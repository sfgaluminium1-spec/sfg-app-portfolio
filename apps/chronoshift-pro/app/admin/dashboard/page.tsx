
'use client';

import { useSafeSession } from '@/hooks/use-safe-session';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  FileText,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HybridTimesheetManager } from '@/components/admin/hybrid-timesheet-manager';
import { OfflineSyncManager } from '@/components/offline/offline-sync-manager';
import { SecurityDashboard } from '@/components/admin/security-dashboard';
import { HelpSystem } from '@/components/help/help-system';
import { AdvancedValidation } from '@/components/validation/advanced-validation';
import { Microsoft365Setup } from '@/components/admin/microsoft365-setup';
import TimesheetExcelGenerator from '@/lib/excel-generator';
import toast from 'react-hot-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardData {
  stats: {
    totalEmployees: number;
    activeTimesheets: number;
    pendingApprovals: number;
    weeklyPayroll: number;
    monthlyPayroll: number;
  };
  chartData: {
    weeklyHours: any[];
    departmentData: any[];
    overtimeTrends: any[];
  };
  pendingItems: any[];
  recentActivity: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const { data: session, status, mounted } = useSafeSession();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
    
    // Check if user has admin role
    if (session && !(session.user as any)?.role?.includes('admin')) {
      redirect('/');
    }
    
    if (session) {
      loadDashboardData();
    }
  }, [session, status]);

  const loadDashboardData = async () => {
    try {
      // Mock data for admin dashboard
      const mockData: AdminDashboardData = {
        stats: {
          totalEmployees: 45,
          activeTimesheets: 12,
          pendingApprovals: 8,
          weeklyPayroll: 28450.50,
          monthlyPayroll: 113802.00,
        },
        chartData: {
          weeklyHours: [
            { day: 'Mon', hours: 385, pay: 5775 },
            { day: 'Tue', hours: 392, pay: 5880 },
            { day: 'Wed', hours: 378, pay: 5670 },
            { day: 'Thu', hours: 401, pay: 6015 },
            { day: 'Fri', hours: 356, pay: 5340 },
            { day: 'Sat', hours: 89, pay: 1785 },
            { day: 'Sun', hours: 45, pay: 900 },
          ],
          departmentData: [
            { name: 'Production', value: 35, color: '#3b82f6' },
            { name: 'Assembly', value: 25, color: '#10b981' },
            { name: 'Warehouse', value: 20, color: '#f59e0b' },
            { name: 'Quality Control', value: 15, color: '#ef4444' },
            { name: 'Admin', value: 5, color: '#8b5cf6' },
          ],
          overtimeTrends: [
            { week: 'W1', overtime: 156 },
            { week: 'W2', overtime: 142 },
            { week: 'W3', overtime: 189 },
            { week: 'W4', overtime: 167 },
          ],
        },
        pendingItems: [
          {
            type: 'timesheet',
            employee: 'John Smith',
            amount: 456.50,
            date: '2024-12-10',
            urgent: false
          },
          {
            type: 'expense',
            employee: 'Sarah Johnson',
            amount: 89.75,
            date: '2024-12-09',
            urgent: true
          },
        ],
        recentActivity: [
          {
            type: 'approval',
            message: 'Timesheet approved for Mike Wilson',
            time: '10 minutes ago',
          },
          {
            type: 'submission',
            message: 'New expense claim from Emma Davis',
            time: '1 hour ago',
          },
        ],
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action);
    // TODO: Implement bulk operations
  };

  const handleExport = async (type: string) => {
    try {
      if (type === 'excel' || type === 'xlsx') {
        // Fetch timesheet data for Excel export
        const response = await fetch('/api/timesheets?format=export');
        if (!response.ok) {
          throw new Error('Failed to fetch timesheet data');
        }
        
        const timesheetData = await response.json();
        
        // Generate and download Excel file
        await TimesheetExcelGenerator.downloadExcel(
          timesheetData, 
          `SFG-Timesheets-${new Date().toISOString().split('T')[0]}.xlsx`,
          {
            includeFormulas: true,
            protectSheets: true,
            password: 'SFGAdmin2024',
            includeInstructions: true,
            templateMode: false
          }
        );
        
        toast.success('Excel file generated and downloaded successfully');
      } else {
        // Handle other export types (PDF, CSV, etc.)
        console.log('Export type not yet implemented:', type);
        toast(`${type.toUpperCase()} export coming soon`, { icon: 'ℹ️' });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-warren-gray-400">Loading admin dashboard...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 p-6 md:ml-64 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-warren-gray-400">
              Payroll management and analytics for SFG Aluminium Ltd
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => handleExport('excel')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <Button className="warren-button-primary">
              Process Payroll
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-warren-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalEmployees}</div>
              <p className="text-xs text-green-600">+2 this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Timesheets</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.activeTimesheets}</div>
              <p className="text-xs text-gray-600 dark:text-warren-gray-400">This week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{dashboardData.stats.pendingApprovals}</div>
              <p className="text-xs text-amber-600">Requires attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{dashboardData.stats.weeklyPayroll.toLocaleString()}</div>
              <p className="text-xs text-green-600">+3.2% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-warren-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{dashboardData.stats.monthlyPayroll.toLocaleString()}</div>
              <p className="text-xs text-warren-blue-600">On track for budget</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
            <TabsTrigger value="hybrid">Hybrid Workflow</TabsTrigger>
            <TabsTrigger value="offline">Offline Sync</TabsTrigger>
            <TabsTrigger value="microsoft365">Microsoft 365</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="help">Help Center</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Hours Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Hours & Pay</CardTitle>
                  <CardDescription>Daily breakdown of hours worked and pay costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.chartData.weeklyHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="hours" fill="#3b82f6" name="Hours" />
                      <Bar yAxisId="right" dataKey="pay" fill="#10b981" name="Pay (£)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Employee distribution by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.chartData.departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.chartData.departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Pending Items and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Pending Approvals
                    <Badge variant="secondary">{dashboardData.pendingItems.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData.pendingItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-warren-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          item.type === 'timesheet' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
                        }`}>
                          {item.type === 'timesheet' ? (
                            <Clock className="w-4 h-4 text-blue-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.employee}</p>
                          <p className="text-xs text-gray-600 dark:text-warren-gray-400">
                            £{item.amount} • {item.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.urgent && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-warren-gray-800 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'approval' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        {activity.type === 'approval' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-warren-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timesheets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Timesheet Management</CardTitle>
                <CardDescription>
                  Review, approve, and manage employee timesheets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input 
                      placeholder="Search by employee name..." 
                      className="warren-input"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                    <Button 
                      onClick={() => handleBulkAction('approve')}
                      className="warren-button-primary"
                    >
                      Bulk Approve
                    </Button>
                  </div>
                </div>

                {/* Timesheet table would go here */}
                <div className="text-center py-8 text-gray-500 dark:text-warren-gray-500">
                  Advanced timesheet management interface coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overtime Trends</CardTitle>
                  <CardDescription>Weekly overtime hours across all departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.chartData.overtimeTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="overtime" fill="#f59e0b" name="Overtime Hours" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                  <CardDescription>Payroll cost breakdown and projections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500 dark:text-warren-gray-500">
                    Advanced analytics dashboard coming soon
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Generation</CardTitle>
                <CardDescription>
                  Generate and schedule automated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    'Weekly Payroll Summary',
                    'Department Cost Analysis', 
                    'Overtime Exception Report',
                    'Holiday Liability Report',
                    'Year-End Summary',
                    'Compliance Report'
                  ].map((reportName) => (
                    <Card key={reportName} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{reportName}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={() => handleExport(reportName.toLowerCase())}
                          variant="outline" 
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hybrid" className="space-y-4">
            <HybridTimesheetManager />
          </TabsContent>
          
          <TabsContent value="offline" className="space-y-4">
            <OfflineSyncManager />
          </TabsContent>
          
          <TabsContent value="microsoft365" className="space-y-4">
            <Microsoft365Setup />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <SecurityDashboard />
          </TabsContent>
          
          <TabsContent value="validation" className="space-y-4">
            <AdvancedValidation autoValidate={false} />
          </TabsContent>
          
          <TabsContent value="help" className="space-y-4">
            <HelpSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
