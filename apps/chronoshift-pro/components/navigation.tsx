
"use client";

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Building2, Moon, Sun, Bell } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { MobileNavigation } from '@/components/mobile/mobile-navigation';

interface NavigationProps {
  user: any;
  userRole: string;
}

export function Navigation({ user, userRole }: NavigationProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    loadNotificationCount();
  }, []);

  const loadNotificationCount = async () => {
    try {
      const response = await fetch('/api/notifications?unreadOnly=true');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to load notification count:', error);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      loadNotificationCount(); // Refresh count when opening
    }
  };

  const pendingCounts = {
    timesheets: 2,
    expenses: 1,
    holidays: 0,
  };

  return (
    <>
      <nav className="bg-white dark:bg-warren-gray-800 border-b border-gray-200 dark:border-warren-gray-700 shadow-sm transition-colors duration-300 relative z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-warren-blue-600 to-warren-blue-500 rounded-lg shadow-md">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                  ChronoShift Pro
                </h1>
                <p className="text-sm text-gray-500 dark:text-warren-gray-400">
                  SFG Aluminium v2.1.3
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleNotifications}
                  className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-warren-gray-700 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4 text-gray-600 dark:text-warren-gray-400" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-xs p-0 bg-red-500 text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-warren-gray-700 transition-colors"
                  title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {resolvedTheme === 'dark' ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-warren-blue-600" />
                  )}
                </Button>
              )}

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-warren-blue-100 dark:bg-warren-blue-900 text-warren-blue-600 dark:text-warren-blue-300">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-warren-gray-400 capitalize">
                    {userRole}
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 border-gray-300 dark:border-warren-gray-600 
                  hover:bg-gray-50 dark:hover:bg-warren-gray-700 text-gray-700 dark:text-warren-gray-300
                  transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavigation 
        userRole={userRole}
        userName={user?.name}
      />

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
