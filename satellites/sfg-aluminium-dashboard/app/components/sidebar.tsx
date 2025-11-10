
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  BarChart3, 
  BookOpen, 
  Code, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  Activity,
  ExternalLink,
  Server
} from 'lucide-react';

const navigation = [
  { name: 'AI Assistant', href: '/', icon: Brain },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'API Documentation', href: '/api-documentation', icon: FileText },
  { name: 'System Status', href: '/system-status', icon: Activity },
  { name: 'Usage Guide', href: '/guide', icon: BookOpen },
  { name: 'API Hub', href: '/api-hub', icon: Code },
  { name: 'Control Panel', href: '/control-panel', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className={cn(
      "h-screen glass-sidebar transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500/20 animate-float">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">SFG AI Brain</h1>
                <p className="text-xs text-gray-400">Command Center</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-blue-500/20 text-blue-400 neon-glow" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        {!collapsed && (
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-full bg-gray-500/20">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{session?.user?.name}</p>
              <p className="text-xs text-gray-400">{session?.user?.email}</p>
            </div>
          </div>
        )}
        <Button
          onClick={() => signOut()}
          variant="ghost"
          size="sm"  
          className="w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}
