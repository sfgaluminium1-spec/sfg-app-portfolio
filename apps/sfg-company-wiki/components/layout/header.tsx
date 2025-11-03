
'use client'

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  FileText,
  Database,
  AlertTriangle,
  MessageCircle,
  Upload,
  BarChart3,
} from "lucide-react"

export function Header() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/procedures", label: "Procedures", icon: FileText },
    { href: "/categories", label: "Categories", icon: Database },
    { href: "/conflicts", label: "Conflicts", icon: AlertTriangle },
    { href: "/chat", label: "AI Assistant", icon: MessageCircle },
    { href: "/import", label: "Import", icon: Upload },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-14 items-center px-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <Database className="h-4 w-4" />
            </div>
            <span className="hidden font-bold sm:inline-block">CompanyWiki</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-1 ml-6">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Search */}
        <div className="flex-1 flex justify-center px-4">
          <form onSubmit={handleSearch} className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search procedures, policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </form>
        </div>

        {/* Right side - Notifications and User */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Link href="/conflicts">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {/* Dynamic notification badge will be added later */}
            </Button>
          </Link>

          {/* Settings */}
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>

          {/* User Menu */}
          {session ? (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-sm">
                <div className="font-medium">
                  {session.user.name || session.user.email}
                </div>
                <div className="text-muted-foreground text-xs">
                  {session.user.role}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
