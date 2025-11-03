
'use client';

import { useEffect, useState } from 'react';
import { useSafeSession } from '@/hooks/use-safe-session';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  Calendar, 
  Receipt, 
  FileText, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format, startOfWeek, endOfWeek } from 'date-fns';

interface EmployeeDashboardData {
  weeklyHours: {
    current: number;
    target: number;
    overtime: number;
  };
  payroll: {
    nextPayday: string;
    estimatedAmount: number;
  };
  pending: {
    timesheets: number;
    expenses: number;
    holidays: number;
  };
  recentActivity: any[];
}

export default function EmployeeDashboard() {
  const { data: session, status, mounted } = useSafeSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (session) {
      loadDashboardData();
    }
  }, [session, status, mounted, router]);

  const loadDashboardData = async () => {
    try {
      // In a real app, this would fetch from API
      // For now, using mock data
      const mockData: EmployeeDashboardData = {
        weeklyHours: {
          current: 37.5,
          target: 40,
          overtime: 2.5,
        },
        payroll: {
          nextPayday: '2024-12-28',
          estimatedAmount: 2847.50,
        },
        pending: {
          timesheets: 1,
          expenses: 2,
          holidays: 0,
        },
        recentActivity: [
          {
            type: 'timesheet',
            message: 'Timesheet for Dec 9 submitted',
            time: '2 hours ago',
            status: 'pending'
          },
          {
            type: 'expense',
            message: 'Fuel receipt £45.50 approved',
            time: '1 day ago',
            status: 'approved'
          },
        ],
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-warren-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-warren-gray-400">Failed to load dashboard data</p>
      </div>
    );
  }

  const weekProgress = (dashboardData.weeklyHours.current / dashboardData.weeklyHours.target) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 p-4 pb-20 md:ml-64 transition-all duration-300">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session?.user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-600 dark:text-warren-gray-400">
            Week of {format(startOfWeek(new Date()), 'MMM d')} - {format(endOfWeek(new Date()), 'MMM d')}
          </p>
        </div>

        {/* Week Summary Card */}
        <Card className="warren-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-warren-blue-600" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hours worked</span>
                <span className="font-medium">
                  {dashboardData.weeklyHours.current} / {dashboardData.weeklyHours.target} hours
                </span>
              </div>
              <Progress value={weekProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-warren-blue-600">
                  {dashboardData.weeklyHours.overtime}
                </p>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Overtime Hours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  £{(dashboardData.weeklyHours.overtime * 22.5).toFixed(0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Overtime Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Payday Card */}
        <Card className="warren-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Next Payday
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                £{dashboardData.payroll.estimatedAmount.toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-warren-gray-400 mt-1">
                {format(new Date(dashboardData.payroll.nextPayday), 'EEEE, MMMM d')}
              </p>
              <Badge variant="outline" className="mt-2">
                Estimated Amount
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pending Items */}
        {(dashboardData.pending.timesheets > 0 || dashboardData.pending.expenses > 0 || dashboardData.pending.holidays > 0) && (
          <Card className="warren-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Pending Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardData.pending.timesheets > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warren-blue-600" />
                    <span>Pending Timesheets</span>
                  </div>
                  <Badge variant="secondary">
                    {dashboardData.pending.timesheets}
                  </Badge>
                </div>
              )}
              
              {dashboardData.pending.expenses > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-green-600" />
                    <span>Pending Expenses</span>
                  </div>
                  <Badge variant="secondary">
                    {dashboardData.pending.expenses}
                  </Badge>
                </div>
              )}
              
              {dashboardData.pending.holidays > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Pending Holidays</span>
                  </div>
                  <Badge variant="secondary">
                    {dashboardData.pending.holidays}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="warren-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-warren-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'timesheet' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  activity.type === 'expense' ? 'bg-green-100 dark:bg-green-900/30' :
                  'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  {activity.type === 'timesheet' && <Clock className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'expense' && <Receipt className="w-4 h-4 text-green-600" />}
                  {activity.type === 'holiday' && <Calendar className="w-4 h-4 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500 dark:text-warren-gray-500">
                      {activity.time}
                    </p>
                    <Badge 
                      variant={activity.status === 'approved' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions (Fixed Bottom Bar) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-warren-gray-800 border-t border-gray-200 dark:border-warren-gray-700 p-4">
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={() => window.location.href = '/employee/timesheet'}
                className="flex flex-col items-center gap-1 h-auto py-3 warren-button-primary"
              >
                <Clock className="w-5 h-5" />
                <span className="text-xs">Clock In</span>
              </Button>
              
              <Button
                onClick={() => window.location.href = '/employee/holidays'}
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Holiday</span>
              </Button>
              
              <Button
                onClick={() => window.location.href = '/employee/expenses'}
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Receipt className="w-5 h-5" />
                <span className="text-xs">Expense</span>
              </Button>
              
              <Button
                onClick={() => window.location.href = '/employee/payslips'}
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <FileText className="w-5 h-5" />
                <span className="text-xs">Payslip</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
