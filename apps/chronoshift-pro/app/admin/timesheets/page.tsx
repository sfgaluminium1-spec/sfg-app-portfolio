
'use client';

import { useSafeSession } from '@/hooks/use-safe-session';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  User, 
  Calendar, 
  Filter,
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { formatCurrency } from '@/lib/currency-utils';

interface Timesheet {
  id: string;
  employeeName: string;
  employeeId: string;
  workDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  hourlyRate: number;
  grossPay: number;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  description?: string;
  location?: string;
}

export default function AdminTimesheetsPage() {
  const { data: session, status } = useSafeSession();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('this-week');

  // Mock data for demonstration
  useEffect(() => {
    const mockTimesheets: Timesheet[] = [
      {
        id: 'ts-001',
        employeeName: 'Michael Johnson',
        employeeId: 'SFG001',
        workDate: '2025-09-11',
        startTime: '08:00',
        endTime: '17:00',
        totalHours: 8.5,
        hourlyRate: 28.50,
        grossPay: 242.25,
        status: 'approved',
        submittedAt: '2025-09-11T17:30:00Z',
        approvedBy: 'Warren Heathcote',
        approvedAt: '2025-09-11T18:00:00Z',
        description: 'Welding work on Project Alpha',
        location: 'Workshop A'
      },
      {
        id: 'ts-002',
        employeeName: 'Sarah Williams',
        employeeId: 'SFG002',
        workDate: '2025-09-11',
        startTime: '07:30',
        endTime: '16:30',
        totalHours: 8.5,
        hourlyRate: 26.75,
        grossPay: 227.38,
        status: 'pending',
        submittedAt: '2025-09-11T16:45:00Z',
        description: 'Machine operation - production line 2',
        location: 'Production Floor'
      },
      {
        id: 'ts-003',
        employeeName: 'David Brown',
        employeeId: 'SFG003',
        workDate: '2025-09-10',
        startTime: '08:00',
        endTime: '17:30',
        totalHours: 9.0,
        hourlyRate: 30.00,
        grossPay: 270.00,
        status: 'approved',
        submittedAt: '2025-09-10T17:45:00Z',
        approvedBy: 'Warren Heathcote',
        approvedAt: '2025-09-10T19:15:00Z',
        description: 'Quality inspection - batch 2025-09-A',
        location: 'Quality Control Lab'
      },
      {
        id: 'ts-004',
        employeeName: 'Jennifer Davis',
        employeeId: 'SFG004',
        workDate: '2025-09-10',
        startTime: '09:00',
        endTime: '17:00',
        totalHours: 7.5,
        hourlyRate: 32.25,
        grossPay: 241.88,
        status: 'draft',
        description: 'Maintenance work - Line 3 repairs',
        location: 'Production Line 3'
      },
      {
        id: 'ts-005',
        employeeName: 'Robert Miller',
        employeeId: 'SFG005',
        workDate: '2025-09-09',
        startTime: '06:00',
        endTime: '18:00',
        totalHours: 11.5,
        hourlyRate: 35.50,
        grossPay: 408.25,
        status: 'rejected',
        submittedAt: '2025-09-09T18:30:00Z',
        description: 'Overtime shift - urgent production deadline',
        location: 'Workshop B'
      }
    ];

    setTimesheets(mockTimesheets);
    setLoading(false);
  }, []);

  if (!session) {
    redirect('/login');
  }

  // Check if user has admin role
  const userRole = session?.user?.email === 'warren@sfg-aluminium.co.uk' ? 'admin' : 'employee';
  if (!userRole.includes('admin')) {
    redirect('/employee/dashboard');
  }

  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesSearch = timesheet.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timesheet.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || timesheet.status === statusFilter;
    
    // Simple date filtering (would be more complex in real implementation)
    const matchesDate = dateFilter === 'all' || true; // Simplified for demo
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    total: timesheets.length,
    pending: timesheets.filter(ts => ts.status === 'pending').length,
    approved: timesheets.filter(ts => ts.status === 'approved').length,
    rejected: timesheets.filter(ts => ts.status === 'rejected').length,
    draft: timesheets.filter(ts => ts.status === 'draft').length,
    totalHours: timesheets.reduce((sum, ts) => sum + ts.totalHours, 0),
    totalPay: timesheets.reduce((sum, ts) => sum + ts.grossPay, 0)
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="warren-badge-success"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="warren-badge-warning"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="warren-badge-destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'draft':
        return <Badge className="warren-badge-secondary"><AlertTriangle className="h-3 w-3 mr-1" />Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Timesheet Management
                </h1>
                <p className="text-gray-600 dark:text-warren-gray-400">
                  Monitor and manage all employee timesheets
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" className="warren-button-primary">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total</p>
                      <p className="text-2xl font-bold text-warren-blue-600">{stats.total}</p>
                    </div>
                    <Clock className="h-8 w-8 text-warren-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Pending</p>
                      <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-amber-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Approved</p>
                      <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Rejected</p>
                      <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total Hours</p>
                      <p className="text-2xl font-bold text-warren-blue-600">{stats.totalHours}h</p>
                    </div>
                    <Clock className="h-8 w-8 text-warren-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total Pay</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalPay)}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by employee name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 warren-input"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border border-gray-300 dark:border-warren-gray-600 bg-white dark:bg-warren-gray-800 px-3 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="rounded-md border border-gray-300 dark:border-warren-gray-600 bg-white dark:bg-warren-gray-800 px-3 py-2"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
              </select>
            </div>
          </div>

          {/* Timesheets List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warren-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTimesheets.length === 0 ? (
                <Card className="warren-card">
                  <CardContent className="text-center py-12">
                    <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-warren-gray-400">
                      No timesheets found matching your criteria
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTimesheets.map((timesheet) => (
                  <Card key={timesheet.id} className="warren-card hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-warren-blue-600" />
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {timesheet.employeeName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-warren-gray-400">
                              {timesheet.employeeId}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(timesheet.status)}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {new Date(timesheet.workDate).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {timesheet.startTime} - {timesheet.endTime}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Hours: </span>
                          <span className="text-sm">{timesheet.totalHours}h</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Gross Pay: </span>
                          <span className="text-sm font-semibold text-warren-blue-600">
                            {formatCurrency(timesheet.grossPay)}
                          </span>
                        </div>
                      </div>

                      {timesheet.description && (
                        <div className="bg-gray-50 dark:bg-warren-gray-800 p-3 rounded-lg mb-4">
                          <p className="text-sm text-gray-600 dark:text-warren-gray-300">
                            {timesheet.description}
                          </p>
                          {timesheet.location && (
                            <p className="text-xs text-gray-500 dark:text-warren-gray-400 mt-1">
                              Location: {timesheet.location}
                            </p>
                          )}
                        </div>
                      )}

                      {timesheet.submittedAt && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 dark:text-warren-gray-400 pt-3 border-t">
                          <div>
                            Submitted: {new Date(timesheet.submittedAt).toLocaleString('en-GB')}
                          </div>
                          {timesheet.approvedAt && timesheet.approvedBy && (
                            <div>
                              Approved by {timesheet.approvedBy} on {new Date(timesheet.approvedAt).toLocaleDateString('en-GB')}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
