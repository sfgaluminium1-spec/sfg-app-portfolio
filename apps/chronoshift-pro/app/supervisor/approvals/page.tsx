
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  MapPin,
  MessageSquare,
  Filter,
  Search
} from 'lucide-react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/currency-utils';

interface PendingTimesheet {
  id: string;
  employeeName: string;
  employeeId: string;
  workDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  hourlyRate: number;
  grossPay: number;
  description?: string;
  location?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PendingExpense {
  id: string;
  employeeName: string;
  employeeId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  receipt?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PendingHoliday {
  id: string;
  employeeName: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  days: number;
  type: 'annual' | 'sick' | 'personal';
  reason?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function SupervisorApprovalsPage() {
  const { data: session } = useSession() || {};
  const [pendingTimesheets, setPendingTimesheets] = useState<PendingTimesheet[]>([]);
  const [pendingExpenses, setPendingExpenses] = useState<PendingExpense[]>([]);
  const [pendingHolidays, setPendingHolidays] = useState<PendingHoliday[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [approvalNotes, setApprovalNotes] = useState<Record<string, string>>({});

  // Mock data for demonstration
  useEffect(() => {
    const mockTimesheets: PendingTimesheet[] = [
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
        description: 'Welding work on Project Alpha',
        location: 'Workshop A',
        submittedAt: '2025-09-11T17:30:00Z',
        status: 'pending'
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
        description: 'Machine operation - production line 2',
        location: 'Production Floor',
        submittedAt: '2025-09-11T16:45:00Z',
        status: 'pending'
      }
    ];

    const mockExpenses: PendingExpense[] = [
      {
        id: 'exp-001',
        employeeName: 'David Brown',
        employeeId: 'SFG003',
        description: 'Travel to client site for inspection',
        amount: 45.80,
        category: 'Travel',
        date: '2025-09-10',
        receipt: 'receipt-001.jpg',
        submittedAt: '2025-09-11T09:15:00Z',
        status: 'pending'
      }
    ];

    const mockHolidays: PendingHoliday[] = [
      {
        id: 'hol-001',
        employeeName: 'Jennifer Davis',
        employeeId: 'SFG004',
        startDate: '2025-09-20',
        endDate: '2025-09-22',
        days: 3,
        type: 'annual',
        reason: 'Family holiday',
        submittedAt: '2025-09-10T14:20:00Z',
        status: 'pending'
      }
    ];

    setPendingTimesheets(mockTimesheets);
    setPendingExpenses(mockExpenses);
    setPendingHolidays(mockHolidays);
    setLoading(false);
  }, []);

  const handleTimesheetAction = async (timesheetId: string, action: 'approve' | 'reject') => {
    try {
      const notes = approvalNotes[timesheetId] || '';
      
      // API call would go here
      console.log(`${action} timesheet ${timesheetId} with notes: ${notes}`);
      
      // Update local state
      setPendingTimesheets(prev => 
        prev.map(ts => 
          ts.id === timesheetId 
            ? { ...ts, status: (action === 'approve' ? 'approved' : 'rejected') as 'pending' | 'approved' | 'rejected' }
            : ts
        ).filter(ts => ts.status === 'pending')
      );

      toast.success(`Timesheet ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // Clear notes
      setApprovalNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[timesheetId];
        return newNotes;
      });
    } catch (error) {
      toast.error(`Failed to ${action} timesheet`);
    }
  };

  const handleExpenseAction = async (expenseId: string, action: 'approve' | 'reject') => {
    try {
      const notes = approvalNotes[expenseId] || '';
      
      // API call would go here
      console.log(`${action} expense ${expenseId} with notes: ${notes}`);
      
      setPendingExpenses(prev => 
        prev.map(exp => 
          exp.id === expenseId 
            ? { ...exp, status: (action === 'approve' ? 'approved' : 'rejected') as 'pending' | 'approved' | 'rejected' }
            : exp
        ).filter(exp => exp.status === 'pending')
      );

      toast.success(`Expense ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // Clear notes
      setApprovalNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[expenseId];
        return newNotes;
      });
    } catch (error) {
      toast.error(`Failed to ${action} expense`);
    }
  };

  const handleHolidayAction = async (holidayId: string, action: 'approve' | 'reject') => {
    try {
      const notes = approvalNotes[holidayId] || '';
      
      // API call would go here
      console.log(`${action} holiday ${holidayId} with notes: ${notes}`);
      
      setPendingHolidays(prev => 
        prev.map(hol => 
          hol.id === holidayId 
            ? { ...hol, status: (action === 'approve' ? 'approved' : 'rejected') as 'pending' | 'approved' | 'rejected' }
            : hol
        ).filter(hol => hol.status === 'pending')
      );

      toast.success(`Holiday request ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // Clear notes
      setApprovalNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[holidayId];
        return newNotes;
      });
    } catch (error) {
      toast.error(`Failed to ${action} holiday request`);
    }
  };

  if (!session) {
    redirect('/login');
  }

  // Check if user has supervisor or admin role
  const userRole = session?.user?.email === 'warren@sfg-aluminium.co.uk' ? 'admin' : 'employee';
  if (!userRole.includes('supervisor') && !userRole.includes('admin')) {
    redirect('/employee/dashboard');
  }

  const totalPending = pendingTimesheets.length + pendingExpenses.length + pendingHolidays.length;

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Supervisor Approvals
                </h1>
                <p className="text-gray-600 dark:text-warren-gray-400">
                  Review and approve pending submissions from your team
                </p>
              </div>
              <Badge className="warren-badge-primary text-lg px-4 py-2">
                {totalPending} Pending
              </Badge>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by employee name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 warren-input"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="rounded-md border border-gray-300 dark:border-warren-gray-600 bg-white dark:bg-warren-gray-800 px-3 py-2"
                >
                  <option value="all">All Types</option>
                  <option value="timesheets">Timesheets</option>
                  <option value="expenses">Expenses</option>
                  <option value="holidays">Holidays</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warren-blue-600"></div>
            </div>
          ) : (
            <Tabs defaultValue="timesheets" className="space-y-4">
              <TabsList>
                <TabsTrigger value="timesheets">
                  Timesheets ({pendingTimesheets.length})
                </TabsTrigger>
                <TabsTrigger value="expenses">
                  Expenses ({pendingExpenses.length})
                </TabsTrigger>
                <TabsTrigger value="holidays">
                  Holidays ({pendingHolidays.length})
                </TabsTrigger>
              </TabsList>

              {/* Timesheets Tab */}
              <TabsContent value="timesheets" className="space-y-4">
                {pendingTimesheets.length === 0 ? (
                  <Card className="warren-card">
                    <CardContent className="text-center py-12">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <p className="text-gray-500 dark:text-warren-gray-400">
                        No pending timesheet approvals
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingTimesheets.map((timesheet) => (
                    <Card key={timesheet.id} className="warren-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-warren-blue-600" />
                            <div>
                              <CardTitle className="text-lg">
                                {timesheet.employeeName}
                              </CardTitle>
                              <CardDescription>
                                Employee ID: {timesheet.employeeId}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="warren-badge-warning">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{timesheet.location || 'No location'}</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-warren-gray-800 p-4 rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Hours:</span>
                              <p>{timesheet.totalHours}h</p>
                            </div>
                            <div>
                              <span className="font-medium">Rate:</span>
                              <p>{formatCurrency(timesheet.hourlyRate)}/hour</p>
                            </div>
                            <div>
                              <span className="font-medium">Gross Pay:</span>
                              <p className="font-semibold text-warren-blue-600">
                                {formatCurrency(timesheet.grossPay)}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span>
                              <p>{new Date(timesheet.submittedAt).toLocaleDateString('en-GB')}</p>
                            </div>
                          </div>
                        </div>

                        {timesheet.description && (
                          <div>
                            <span className="font-medium text-sm">Description:</span>
                            <p className="text-sm text-gray-600 dark:text-warren-gray-400 mt-1">
                              {timesheet.description}
                            </p>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Approval Notes (Optional)
                            </label>
                            <Textarea
                              placeholder="Add any notes about this approval..."
                              value={approvalNotes[timesheet.id] || ''}
                              onChange={(e) => setApprovalNotes(prev => ({
                                ...prev,
                                [timesheet.id]: e.target.value
                              }))}
                              className="warren-input"
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleTimesheetAction(timesheet.id, 'approve')}
                              className="warren-button-primary flex-1"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleTimesheetAction(timesheet.id, 'reject')}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Expenses Tab */}
              <TabsContent value="expenses" className="space-y-4">
                {pendingExpenses.length === 0 ? (
                  <Card className="warren-card">
                    <CardContent className="text-center py-12">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <p className="text-gray-500 dark:text-warren-gray-400">
                        No pending expense approvals
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingExpenses.map((expense) => (
                    <Card key={expense.id} className="warren-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-warren-blue-600" />
                            <div>
                              <CardTitle className="text-lg">
                                {expense.employeeName}
                              </CardTitle>
                              <CardDescription>
                                Employee ID: {expense.employeeId}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="warren-badge-warning">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-gray-50 dark:bg-warren-gray-800 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Amount:</span>
                              <p className="font-semibold text-warren-blue-600 text-lg">
                                {formatCurrency(expense.amount)}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Category:</span>
                              <p>{expense.category}</p>
                            </div>
                            <div>
                              <span className="font-medium">Date:</span>
                              <p>{new Date(expense.date).toLocaleDateString('en-GB')}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className="font-medium text-sm">Description:</span>
                          <p className="text-sm text-gray-600 dark:text-warren-gray-400 mt-1">
                            {expense.description}
                          </p>
                        </div>

                        {expense.receipt && (
                          <div>
                            <span className="font-medium text-sm">Receipt:</span>
                            <Button variant="outline" size="sm" className="mt-1">
                              View Receipt
                            </Button>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Approval Notes (Optional)
                            </label>
                            <Textarea
                              placeholder="Add any notes about this approval..."
                              value={approvalNotes[expense.id] || ''}
                              onChange={(e) => setApprovalNotes(prev => ({
                                ...prev,
                                [expense.id]: e.target.value
                              }))}
                              className="warren-input"
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleExpenseAction(expense.id, 'approve')}
                              className="warren-button-primary flex-1"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleExpenseAction(expense.id, 'reject')}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Holidays Tab */}
              <TabsContent value="holidays" className="space-y-4">
                {pendingHolidays.length === 0 ? (
                  <Card className="warren-card">
                    <CardContent className="text-center py-12">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <p className="text-gray-500 dark:text-warren-gray-400">
                        No pending holiday approvals
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingHolidays.map((holiday) => (
                    <Card key={holiday.id} className="warren-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-warren-blue-600" />
                            <div>
                              <CardTitle className="text-lg">
                                {holiday.employeeName}
                              </CardTitle>
                              <CardDescription>
                                Employee ID: {holiday.employeeId}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="warren-badge-warning">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-gray-50 dark:bg-warren-gray-800 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Start Date:</span>
                              <p>{new Date(holiday.startDate).toLocaleDateString('en-GB')}</p>
                            </div>
                            <div>
                              <span className="font-medium">End Date:</span>
                              <p>{new Date(holiday.endDate).toLocaleDateString('en-GB')}</p>
                            </div>
                            <div>
                              <span className="font-medium">Days:</span>
                              <p className="font-semibold text-warren-blue-600">
                                {holiday.days} day{holiday.days > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="font-medium">Type:</span>
                            <Badge className={
                              holiday.type === 'annual' ? 'warren-badge-primary' :
                              holiday.type === 'sick' ? 'warren-badge-warning' :
                              'warren-badge-secondary'
                            }>
                              {holiday.type}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Submitted:</span>
                            <span className="ml-1">
                              {new Date(holiday.submittedAt).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                        </div>

                        {holiday.reason && (
                          <div>
                            <span className="font-medium text-sm">Reason:</span>
                            <p className="text-sm text-gray-600 dark:text-warren-gray-400 mt-1">
                              {holiday.reason}
                            </p>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Approval Notes (Optional)
                            </label>
                            <Textarea
                              placeholder="Add any notes about this approval..."
                              value={approvalNotes[holiday.id] || ''}
                              onChange={(e) => setApprovalNotes(prev => ({
                                ...prev,
                                [holiday.id]: e.target.value
                              }))}
                              className="warren-input"
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleHolidayAction(holiday.id, 'approve')}
                              className="warren-button-primary flex-1"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleHolidayAction(holiday.id, 'reject')}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
