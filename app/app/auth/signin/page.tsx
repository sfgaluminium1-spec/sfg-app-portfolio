
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/header'
import Footer from '@/components/footer'
import VersionBadge from '@/components/version-badge'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // For development - redirect to home on any attempt
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Development mode - Enter any credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter any password"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Sign In (Development)
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>Development Version 1.1.0</p>
                <p className="mt-1">Full Microsoft 365 authentication coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
      <VersionBadge position="fixed" variant="default" />
    </div>
  )
}
