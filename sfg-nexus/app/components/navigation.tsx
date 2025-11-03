'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LayoutDashboard, Building2, FileText, MessageSquare, Database, FolderOpen, Zap, DollarSign, Calendar, Search, Bell, Settings, User, Menu, X, Users, Brain, Shield, Eye, UserCheck, Truck, Wrench, UserCog, Hammer, ChevronDown, Cog, Factory, CreditCard } from 'lucide-react';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';

// Core navigation items for main bar
const coreNavigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, description: 'Overview and analytics' },
  { name: 'Enquiries', href: '/enquiries', icon: MessageSquare, description: 'Customer enquiry management' },
  { name: 'Quotes', href: '/quotes', icon: FileText, description: 'Quote generation and management' },
  { name: 'Jobs', href: '/jobs', icon: Building2, description: 'Job management and tracking' },
  { name: 'Customers', href: '/customers', icon: Users, description: 'Customer database management' },
  { name: 'Schedule', href: '/schedule', icon: Calendar, description: 'Fabrication and installation scheduling' }
];

// Grouped navigation items for dropdowns
const navigationGroups = [
  {
    name: 'Teams & Management',
    icon: UserCheck,
    items: [
      { name: 'Teams', href: '/teams', icon: UserCheck, description: 'Team member management and hierarchy' },
      { name: 'SFG Employee Hierarchy', href: '/sfg-hierarchy', icon: UserCog, description: 'Complete organizational hierarchy with security tiers', badge: 'NEW' },
      { name: 'Suppliers', href: '/suppliers', icon: Truck, description: 'Supplier management and ordering' }
    ]
  },
  {
    name: 'Scheduling & Production',
    icon: Factory,
    items: [
      { name: 'Fabrication Scheduler', href: '/fabrication-scheduler', icon: Hammer, description: '14-step fabrication workflow with helper system', badge: 'NEW' },
      { name: 'Installation Scheduler', href: '/installation-scheduler', icon: Wrench, description: 'Glass weight calculator and safety compliance', badge: 'NEW' },
      { name: 'Workflows', href: '/workflows', icon: Zap, description: 'Automation and processes' }
    ]
  },
  {
    name: 'SFG Systems',
    icon: Cog,
    items: [
      { name: 'SFG SPEC', href: '/spec', icon: Eye, description: 'Glass specification and security compliance', badge: 'ADD-ON' },
      { name: 'SFG TIME', href: '/finance', icon: DollarSign, description: 'Finance and compliance management', badge: 'ADD-ON' },
      { name: 'SFG PRICE INTELLIGENCE', href: '/pricing', icon: Brain, description: 'AI-powered pricing optimization', badge: 'AI' },
      { name: 'SFG APPROVAL SYSTEM', href: '/approvals', icon: Shield, description: 'Comprehensive approval and validation system', badge: 'NEW' },
      { name: 'SFG PORTAL', href: '/portal', icon: User, description: 'Customer self-service portal', badge: 'CUSTOMER' }
    ]
  },
  {
    name: 'Tools & Communication',
    icon: Brain,
    items: [
      { name: 'Teams Chat', href: '/chat', icon: Brain, description: 'AI-powered chat interface', badge: 'AI' },
      { name: 'SharePoint', href: '/sharepoint', icon: Database, description: 'Database integration' },
      { name: 'Documents', href: '/documents', icon: FolderOpen, description: 'Document management' }
    ]
  }
];

// All items for mobile menu
const allNavigationItems = [
  ...coreNavigationItems,
  ...navigationGroups.flatMap(group => group.items)
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isGroupActive = (group: any) => {
    return group.items.some((item: any) => isActive(item.href));
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 warren-nav">
        <div className="warren-container w-full">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-auto warren-glass rounded-xl p-2 shadow-warren-sm">
                  <Image 
                    src="https://cdn.abacus.ai/images/5587be9e-b9a6-4acd-afac-a3abeae54039.png" 
                    alt="SFG NEXUS Logo" 
                    width={140} 
                    height={40} 
                    className="object-contain" 
                    priority 
                  />
                </div>
                <Badge variant="secondary" className="text-xs">MOCKUP</Badge>
              </div>
            </div>

            {/* Core Navigation Items */}
            <div className="flex items-center space-x-1">
              {coreNavigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    size="sm"
                    className={`warren-nav-item ${isActive(item.href) ? 'active' : ''}`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}

              {/* Grouped Navigation Items */}
              {navigationGroups.map((group) => (
                <DropdownMenu key={group.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={isGroupActive(group) ? 'default' : 'ghost'}
                      size="sm"
                      className={`warren-nav-item ${isGroupActive(group) ? 'active' : ''}`}
                    >
                      <group.icon className="h-4 w-4 mr-2" />
                      {group.name}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 warren-glass border border-border/50">
                    {group.items.map((item, index) => (
                      <div key={item.href}>
                        <DropdownMenuItem asChild>
                          <Link href={item.href} className="flex items-center w-full p-2 cursor-pointer">
                            <item.icon className="h-4 w-4 mr-3" />
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="text-sm font-medium">{item.name}</span>
                                {item.badge && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        {index < group.items.length - 1 && <DropdownMenuSeparator />}
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="warren-btn warren-focus">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="warren-btn warren-focus">
                <Bell className="h-4 w-4" />
              </Button>
              <DarkModeToggle />
              <Button variant="ghost" size="sm" className="warren-btn warren-focus">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="warren-btn warren-focus">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 warren-nav">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="relative h-8 w-auto warren-glass rounded-lg p-1 shadow-warren-sm">
                <Image 
                  src="https://cdn.abacus.ai/images/5587be9e-b9a6-4acd-afac-a3abeae54039.png" 
                  alt="SFG NEXUS Logo" 
                  width={112} 
                  height={32} 
                  className="object-contain" 
                  priority 
                />
              </div>
              <Badge variant="secondary" className="text-xs">MOCKUP</Badge>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              <DarkModeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="warren-btn warren-focus"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t bg-background max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-2">
              {allNavigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <div className="flex-1 text-left">
                      <div className="flex items-center">
                        {item.name}
                        {(item as any).badge && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {(item as any).badge}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              ))}
              <div className="pt-4 border-t space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-3" />
                  Search
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-3" />
                  Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16"></div>
    </>
  );
}