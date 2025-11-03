
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  Clock, 
  Calendar, 
  Receipt, 
  FileText, 
  Users, 
  BarChart3,
  Shield,
  BookOpen,
  LogOut,
  Plug
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface MobileNavigationProps {
  userRole: string;
  userName?: string;
}

export function MobileNavigation({ userRole, userName }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: '/' },
    ];

    if (userRole === 'employee') {
      return [
        ...baseItems,
        { icon: Clock, label: 'Submit Timesheet', path: '/employee/timesheet' },
        { icon: Calendar, label: 'Holidays', path: '/employee/holidays' },
        { icon: Receipt, label: 'Expenses', path: '/employee/expenses' },
        { icon: FileText, label: 'Payslips', path: '/employee/payslips' },
        { icon: BookOpen, label: 'Company Rules', path: '/employee/company-rules' },
      ];
    }

    if (userRole === 'manager' || userRole === 'supervisor') {
      return [
        ...baseItems,
        { icon: Users, label: 'Team Dashboard', path: '/supervisor/dashboard' },
        { icon: Clock, label: 'Approvals', path: '/supervisor/approvals' },
        { icon: BookOpen, label: 'Company Rules', path: '/employee/company-rules' },
      ];
    }

    if (userRole === 'admin' || userRole === 'director') {
      return [
        ...baseItems,
        { icon: BarChart3, label: 'Admin Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Employees', path: '/admin/employees' },
        { icon: Clock, label: 'Timesheets', path: '/admin/timesheets' },
        { icon: Shield, label: 'HR Compliance', path: '/admin/hr-compliance' },
        { icon: Plug, label: 'App Integrations', path: '/integrations' },
        { icon: BookOpen, label: 'Company Rules', path: '/employee/company-rules' },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="text-left">
              SFG Aluminium Ltd
            </SheetTitle>
            <div className="text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {userName?.split(' ')[0]}
              </p>
              <Badge variant="outline" className="mt-1">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
            </div>
          </SheetHeader>

          <div className="mt-8 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            ))}

            <div className="border-t pt-4 mt-6">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>ChronoShift Pro v4.1</p>
              <p>HR Compliance System Active</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
