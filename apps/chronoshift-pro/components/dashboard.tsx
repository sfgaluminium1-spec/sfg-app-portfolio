
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

interface DashboardProps {
  timesheets: any[];
  employees: any[];
  onViewTimesheet: (id: string) => void;
  onExportData: (type: string) => void;
  userRole: string;
}

export function Dashboard({ 
  timesheets, 
  employees, 
  onViewTimesheet, 
  onExportData, 
  userRole 
}: DashboardProps) {
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  // Calculate this week's data
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  
  const thisWeekTimesheets = timesheets?.filter(ts => 
    isWithinInterval(new Date(ts.workDate), { start: weekStart, end: weekEnd })
  ) || [];

  // Calculate summary statistics
  const totalHoursThisWeek = thisWeekTimesheets.reduce((sum, ts) => sum + (ts.totalHours || 0), 0);
  const totalPayThisWeek = thisWeekTimesheets.reduce((sum, ts) => sum + (ts.totalPay || 0), 0);
  const pendingApprovals = timesheets?.filter(ts => ts.status === 'SUBMITTED').length || 0;
  const approvedThisWeek = thisWeekTimesheets.filter(ts => ts.status === 'APPROVED').length;

  // Recent activity (last 10 timesheets)
  const recentTimesheets = [...(timesheets || [])].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 10);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'SUBMITTED':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SFG Payroll Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onExportData('timesheets')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Hours This Week</p>
                <p className="text-2xl font-bold text-blue-900">{totalHoursThisWeek.toFixed(1)}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Pay This Week</p>
                <p className="text-2xl font-bold text-green-900">${totalPayThisWeek.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-900">{pendingApprovals}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Employees</p>
                <p className="text-2xl font-bold text-purple-900">{employees?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          {userRole === 'manager' && <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>}
        </TabsList>

        {/* Recent Activity Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Timesheets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTimesheets.length > 0 ? recentTimesheets.map((timesheet) => (
                  <div key={timesheet.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold">
                            {timesheet.employee?.firstName} {timesheet.employee?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(timesheet.workDate), 'MMM d, yyyy')} • 
                            {timesheet.startTime} - {timesheet.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold">{timesheet.totalHours?.toFixed(2) || '0.00'} hrs</p>
                        <p className="text-sm text-green-600 font-medium">
                          ${timesheet.totalPay?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      {getStatusBadge(timesheet.status)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewTimesheet(timesheet.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No timesheets found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* This Week Tab */}
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                This Week's Timesheets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thisWeekTimesheets.length > 0 ? thisWeekTimesheets.map((timesheet) => (
                  <div key={timesheet.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold">
                            {timesheet.employee?.firstName} {timesheet.employee?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(timesheet.workDate), 'EEEE, MMM d')} • 
                            {timesheet.startTime} - {timesheet.endTime}
                          </p>
                          {timesheet.description && (
                            <p className="text-sm text-gray-500 mt-1">{timesheet.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold">{timesheet.totalHours?.toFixed(2) || '0.00'} hrs</p>
                        <div className="text-sm text-gray-600">
                          <span className="text-blue-600">{timesheet.regularHours?.toFixed(2) || '0.00'}r</span>
                          {(timesheet.overtimeHours || 0) > 0 && (
                            <span className="text-orange-600 ml-1">+{timesheet.overtimeHours?.toFixed(2)}ot</span>
                          )}
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                          ${timesheet.totalPay?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      {getStatusBadge(timesheet.status)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewTimesheet(timesheet.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No timesheets for this week</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approvals Tab (Manager only) */}
        {userRole === 'manager' && (
          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Pending Approvals ({pendingApprovals})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timesheets?.filter(ts => ts.status === 'SUBMITTED').length > 0 ? 
                    timesheets.filter(ts => ts.status === 'SUBMITTED').map((timesheet) => (
                      <div key={timesheet.id} className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                            <div>
                              <p className="font-semibold">
                                {timesheet.employee?.firstName} {timesheet.employee?.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {format(new Date(timesheet.workDate), 'EEEE, MMM d, yyyy')} • 
                                {timesheet.startTime} - {timesheet.endTime}
                              </p>
                              <p className="text-sm text-yellow-700">
                                Submitted {format(new Date(timesheet.submittedAt), 'MMM d at h:mm a')}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold">{timesheet.totalHours?.toFixed(2) || '0.00'} hrs</p>
                            <p className="text-sm text-green-600 font-medium">
                              ${timesheet.totalPay?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onViewTimesheet(timesheet.id)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Review
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-gray-500 py-8">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No pending approvals</p>
                      </div>
                    )
                  }
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
