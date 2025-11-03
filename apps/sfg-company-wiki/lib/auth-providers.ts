
/**
 * Authentication Providers Configuration
 * Supports both Credentials (local) and Azure AD (SSO)
 */

import { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import AzureADProvider from "next-auth/providers/azure-ad"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { getSecret } from "@/lib/azure-keyvault"

/**
 * Build NextAuth configuration
 * Dynamically includes Azure AD provider if credentials are available
 */
export async function buildAuthOptions(): Promise<AuthOptions> {
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
  const azureAdClientId = await getSecret("sfg-wiki-entra-client-id", "AZURE_AD_CLIENT_ID")
  const azureAdClientSecret = await getSecret("sfg-wiki-entra-client-secret", "AZURE_AD_CLIENT_SECRET")
  const azureAdTenantId = await getSecret("sfg-wiki-entra-tenant-id", "AZURE_AD_TENANT_ID")

  if (azureAdClientId && azureAdClientSecret && azureAdTenantId) {
    providers.push(
      AzureADProvider({
        clientId: azureAdClientId,
        clientSecret: azureAdClientSecret,
        tenantId: azureAdTenantId,
        authorization: {
          params: {
            scope: "openid profile email User.Read",
          },
        },
      })
    )
  }

  const authOptions: AuthOptions = {
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

  return authOptions
}

/**
 * Get role from Azure AD groups
 * Maps M365 security groups to application roles
 */
export function getRoleFromGroups(groups: string[] = []): string {
  // Admin group (highest priority)
  if (groups.some(g => g.toLowerCase().includes("sfg-wiki-admin"))) {
    return "ADMIN"
  }
  
  // Approver group
  if (groups.some(g => g.toLowerCase().includes("sfg-wiki-approver"))) {
    return "APPROVER"
  }
  
  // Editor group
  if (groups.some(g => g.toLowerCase().includes("sfg-wiki-editor"))) {
    return "EDITOR"
  }
  
  // Default: Viewer/User
  return "USER"
}
