/**
 * Authentication configuration with Azure AD support
 * Uses synchronous auth options with fallback credentials
 */

import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import AzureADProvider from "next-auth/providers/azure-ad"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

// Build providers array
const providers: any[] = [
  // Credentials provider (always available)
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      })

      if (!user || !user.password) {
        return null
      }

      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
      )

      if (!isPasswordValid) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email,
        role: user.role,
      }
    }
  })
]

// Add Azure AD provider if credentials are available
if (
  process.env.AZURE_AD_CLIENT_ID &&
  process.env.AZURE_AD_CLIENT_SECRET &&
  process.env.AZURE_AD_TENANT_ID
) {
  providers.push(
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: "openid profile email User.Read",
        },
      },
    })
  )
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Azure AD sign-in
      if (account?.provider === "azure-ad") {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Create new user from Azure AD profile
            await prisma.user.create({
              data: {
                email: user.email!,
                firstName: (profile as any)?.given_name || user.name?.split(' ')[0] || "",
                lastName: (profile as any)?.family_name || user.name?.split(' ').slice(1).join(' ') || "",
                role: "USER", // Default role; admin can upgrade later
                password: null, // Azure AD users don't have passwords
              }
            })
          }

          return true
        } catch (error) {
          console.error("Error during Azure AD sign-in:", error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = (user as any).role
      }

      // Store Azure AD groups if available
      if (account?.provider === "azure-ad" && profile) {
        const azureProfile = profile as any
        token.groups = azureProfile.groups || []
        
        // Map Azure AD app roles to local roles
        if (azureProfile.roles) {
          if (azureProfile.roles.includes("SFG-Wiki-Admin")) {
            token.role = "ADMIN"
          } else if (azureProfile.roles.includes("SFG-Wiki-Approver")) {
            token.role = "APPROVER"
          } else if (azureProfile.roles.includes("SFG-Wiki-Editor")) {
            token.role = "EDITOR"
          } else if (azureProfile.roles.includes("SFG-Wiki-Viewer")) {
            token.role = "USER"
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as any
        ;(session.user as any).groups = token.groups || []
      }
      return session
    }
  }
}
