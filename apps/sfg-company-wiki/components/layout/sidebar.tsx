
'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Database,
  AlertTriangle,
  MessageCircle,
  Upload,
  BarChart3,
  Users,
  CreditCard,
  DollarSign,
  Calculator,
  Hash,
  Settings,
  ChevronRight,
  ChevronDown,
  Shield,
  Star,
  Layers,
  FolderKanban,
  Globe,
  GitBranch,
  Search,
} from "lucide-react"

const menuItems = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
      { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
      { href: "/procedures", label: "All Procedures", icon: FileText },
      { href: "/categories", label: "Categories", icon: Database },
      { href: "/conflicts", label: "Conflicts", icon: AlertTriangle },
    ],
  },
  {
    title: "System Control",
    items: [
      { href: "/system-overview", label: "System Overview", icon: Globe },
      { href: "/process-control", label: "Process Control", icon: GitBranch },
      { href: "/credit-checker", label: "Credit Checker", icon: Search },
    ],
  },
  {
    title: "External Integrations",
    items: [
      { href: "/company-intelligence", label: "Company Intelligence", icon: Search },
      { href: "/sharepoint-docs", label: "SharePoint Documents", icon: FileText },
      { href: "/knowledge-smelter", label: "Knowledge Smelter", icon: Database },
    ],
  },
  {
    title: "Company Data",
    items: [
      { href: "/staff-tiers", label: "Staff Tiers", icon: Users },
      { href: "/customer-tiers", label: "Customer Tiers", icon: CreditCard },
      { href: "/credit-checks", label: "Credit Checks", icon: Shield },
      { href: "/pricing-rules", label: "Pricing & Margins", icon: DollarSign },
      { href: "/payroll-formulas", label: "Payroll Formulas", icon: Calculator },
      { href: "/project-numbering", label: "Project Numbers", icon: Hash },
    ],
  },
  {
    title: "Tools",
    items: [
      { href: "/chat", label: "AI Assistant", icon: MessageCircle },
      { href: "/prompt-library", label: "Prompt Library", icon: Star },
      { href: "/import", label: "Import Data", icon: Upload },
      { href: "/workflows", label: "Workflow Diagrams", icon: Layers },
    ],
  },
  {
    title: "Administration",
    items: [
      { href: "/audit-logs", label: "Audit Trail", icon: FileText },
      { href: "/users", label: "User Management", icon: Users },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Overview",
    "System Control",
    "External Integrations",
    "Company Data",
  ])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((section) => section !== title)
        : [...prev, title]
    )
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/40">
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-4">
          {menuItems.map((section) => (
            <div key={section.title}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start px-2 font-semibold text-muted-foreground hover:text-foreground"
                onClick={() => toggleSection(section.title)}
              >
                {expandedSections.includes(section.title) ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                {section.title}
              </Button>

              {expandedSections.includes(section.title) && (
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start pl-8"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          <span className="flex-1 text-left">{item.label}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
