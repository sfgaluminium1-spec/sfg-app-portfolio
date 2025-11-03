
'use client';

import { useSafeSession } from '@/hooks/use-safe-session';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApprovalWorkflow } from '@/components/supervisor/approval-workflow';

interface SupervisorStats {
  pendingApprovals: number;
  approvedThisWeek: number;
  rejectedThisWeek: number;
  totalEmployees: number;
  departmentHours: number;
  averageHoursPerEmployee: number;
}

export default function SupervisorDashboard() {
  const { data: session, status, mounted } = useSafeSession();
  const router = useRouter();
  const [stats, setStats] = useState<SupervisorStats>({
    pendingApprovals: 0,
    approvedThisWeek: 0,
    rejectedThisWeek: 0,
    totalEmployees: 0,
    departmentHours: 0,
    averageHoursPerEmployee: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (session && (session.user.role !== 'supervisor' && session.user.role !== 'admin')) {
      router.push('/employee/dashboard');
      return;
    }
    
    if (session) {
      loadStats();
    }
  }, [session, status, mounted, router]);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/supervisor/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading supervisor stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-warren-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 p-6 md:ml-64 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Supervisor Dashboard
            </h1>
            <p className="text-gray-600 dark:text-warren-gray-400">
              Review and approve employee timesheets
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-warren-blue-600" />
            <span className="text-sm font-medium">
              Week ending {new Date().toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="warren-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-warren-gray-400">
                    Pending Approval
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.pendingApprovals}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="warren-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-warren-gray-400">
                    Approved This Week
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.approvedThisWeek}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="warren-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-warren-gray-400">
                    Rejected This Week
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.rejectedThisWeek}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="warren-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-warren-gray-400">
                    Team Members
                  </p>
                  <p className="text-3xl font-bold text-warren-blue-600">
                    {stats.totalEmployees}
                  </p>
                </div>
                <Users className="w-8 h-8 text-warren-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="warren-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-warren-gray-400">
                    Department Hours
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.departmentHours.toFixed(1)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="warren-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-warren-gray-400">
                    Avg Hours/Employee
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.averageHoursPerEmployee.toFixed(1)}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="approvals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="overview">Team Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="space-y-4">
            <ApprovalWorkflow />
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <Card className="warren-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Approved Timesheets
                </CardTitle>
                <CardDescription>
                  Recently approved timesheets from your department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 dark:text-warren-gray-400 py-8">
                  Approved timesheets will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <Card className="warren-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Rejected Timesheets
                </CardTitle>
                <CardDescription>
                  Timesheets that require corrections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 dark:text-warren-gray-400 py-8">
                  Rejected timesheets will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <Card className="warren-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-warren-blue-600" />
                  Department Overview
                </CardTitle>
                <CardDescription>
                  Summary of your team's performance and metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{((stats.approvedThisWeek / (stats.approvedThisWeek + stats.rejectedThisWeek || 1)) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">Approval Rate</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-warren-blue-600">{stats.averageHoursPerEmployee.toFixed(1)}</p>
                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">Avg Hours/Employee</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{stats.totalEmployees}</p>
                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">Team Size</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-blue-200">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Supervisor Guidelines
                  </h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Review timesheets by Tuesday 16:00 for payroll processing</li>
                    <li>• Verify hours worked match expected schedules</li>
                    <li>• Check for proper break deductions and overtime calculations</li>
                    <li>• Ensure sleep rule applications are correct for night shifts</li>
                    <li>• Add notes for any corrections or clarifications needed</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
