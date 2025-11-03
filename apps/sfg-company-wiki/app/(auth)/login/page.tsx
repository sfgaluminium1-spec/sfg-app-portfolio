'use client'

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Database, Eye, EyeOff, Building2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAzureLoading, setIsAzureLoading] = useState(false)
  const [error, setError] = useState("")
  const [azureSSOAvailable, setAzureSSOAvailable] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if Azure AD SSO is configured
  useEffect(() => {
    fetch("/api/auth/providers")
      .then(res => res.json())
      .then(providers => {
        setAzureSSOAvailable(!!providers["azure-ad"])
      })
      .catch(() => setAzureSSOAvailable(false))
  }, [])

  // Check for authentication errors from callback
  useEffect(() => {
    const authError = searchParams?.get("error")
    if (authError) {
      setError("Authentication failed. Please try again.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAzureSignIn = async () => {
    setIsAzureLoading(true)
    setError("")
    
    try {
      await signIn("azure-ad", { 
        callbackUrl: "/dashboard",
        redirect: true 
      })
    } catch (err) {
      setError("Azure AD sign-in failed")
      setIsAzureLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0A5A8A] to-[#00A6A6] text-white">
            <Database className="h-6 w-6" />
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">Welcome to SFG Aluminium Wiki</CardTitle>
          <CardDescription>
            Sign in to access the knowledge management system
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        {/* Azure AD SSO Button (Enterprise) */}
        {azureSSOAvailable && (
          <>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-2 border-[#0A5A8A] hover:bg-[#0A5A8A] hover:text-white transition-all"
              onClick={handleAzureSignIn}
              disabled={isAzureLoading || isLoading}
            >
              <Building2 className="mr-2 h-5 w-5" />
              {isAzureLoading ? "Redirecting to Azure AD..." : "Sign in with Azure AD (SSO)"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
          </>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || isAzureLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isAzureLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isAzureLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || isAzureLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
        <div>
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </div>
        {azureSSOAvailable && (
          <p className="text-xs text-muted-foreground">
            SFG Aluminium employees: Use Azure AD SSO for secure access
          </p>
        )}
      </CardFooter>
    </Card>
  )
}
