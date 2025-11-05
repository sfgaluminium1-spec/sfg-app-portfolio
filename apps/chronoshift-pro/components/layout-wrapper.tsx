
'use client';

import { Navigation } from '@/components/navigation';
import { MobileNavigation } from '@/components/mobile/mobile-navigation';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { SiteFooter } from '@/components/site-footer';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { data: session } = useSession() || {};
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock user role determination
  const userRole = session?.user?.email === 'warren@sfg-aluminium.co.uk' ? 'admin' : 'employee';

  const pendingCounts = {
    timesheets: 2,
    expenses: 1,
    holidays: 0,
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        {children}
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation user={session.user} userRole={userRole} />
      
      {/* Main Content Area with Proper Spacing */}
      <div className="flex flex-1">
        {/* Desktop Sidebar Spacer */}
        <div className="hidden md:block w-36 flex-shrink-0" />
        
        {/* Main Content */}
        <main className="flex-1 md:ml-0">
          {children}
        </main>
      </div>

      {/* Site Footer */}
      <SiteFooter />

      {/* Mobile Navigation */}
      <MobileNavigation 
        userRole={userRole}
        userName={session?.user?.name || undefined}
      />
    </div>
  );
}
