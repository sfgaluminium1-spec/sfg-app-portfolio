
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  MessageSquare, 
  User,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useSafeSession } from '@/hooks/use-safe-session';
import toast from 'react-hot-toast';

interface TimesheetForApproval {
  id: string;
  employeeId: string;
  employee: {
    name: string;
    department: string;
    role: string;
  };
  weekEnding: string;
  submittedAt: string;
  status: 'submitted' | 'approved' | 'rejected';
  totalHours: number;
  overtimeHours: number;
  shifts: Array<{
    date: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    overtimeHours: number;
    notes: string;
  }>;
  supervisorNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
}

interface ApprovalAction {
  timesheetId: string;
  approved: boolean;
  notes: string;
}

export function ApprovalWorkflow() {
  const { data: session } = useSafeSession();
  const [timesheets, setTimesheets] = useState<TimesheetForApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('submitted');
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetForApproval | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [processingApproval, setProcessingApproval] = useState(false);

  useEffect(() => {
    loadTimesheets();
  }, [filterStatus]);

  const loadTimesheets = async () => {
    try {
      const response = await fetch(`/api/timesheets/approvals?status=${filterStatus}`);
      if (response.ok) {
        const data = await response.json();
        setTimesheets(data);
      }
    } catch (error) {
      console.error('Error loading timesheets:', error);
      toast.error('Failed to load timesheets');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (action: ApprovalAction) => {
    setProcessingApproval(true);
    
    try {
      const response = await fetch(`/api/timesheets/${action.timesheetId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved: action.approved,
          notes: action.notes,
          supervisorId: session?.user?.id
        })
      });
      
      if (response.ok) {
        toast.success(`Timesheet ${action.approved ? 'approved' : 'rejected'} successfully`);
        setSelectedTimesheet(null);
        setApprovalNotes('');
        loadTimesheets();
        
        // Send notification email to employee
        await sendApprovalNotification(action.timesheetId, action.approved, action.notes);
      } else {
        toast.error('Failed to process approval');
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      toast.error('Error processing approval');
    } finally {
      setProcessingApproval(false);
    }
  };

  const sendApprovalNotification = async (timesheetId: string, approved: boolean, notes: string) => {
    try {
      await fetch('/api/notifications/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timesheetId, approved, notes })
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const isLateSubmission = (submittedAt: string, weekEnding: string) => {
    const submission = new Date(submittedAt);
    const weekEnd = new Date(weekEnding);
    
    // Find the Tuesday after week ending
    const tuesday = new Date(weekEnd);
    tuesday.setDate(tuesday.getDate() + (2 - tuesday.getDay() + 7) % 7);
    tuesday.setHours(17, 0, 0, 0); // 5 PM deadline
    
    return submission > tuesday;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading timesheets for approval...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Supervisor Approval Workflow
          </h2>
          <p className="text-gray-600 dark:text-warren-gray-400">
            Review and approve employee timesheets
          </p>
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submitted">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="warren-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {timesheets.filter(t => t.status === 'submitted').length}
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
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Approved This Week</p>
                <p className="text-2xl font-bold text-green-600">
                  {timesheets.filter(t => t.status === 'approved').length}
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
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total Hours</p>
                <p className="text-2xl font-bold">
                  {timesheets.reduce((sum, t) => sum + t.totalHours, 0).toFixed(1)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-warren-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timesheets List */}
      <div className="space-y-4">
        {timesheets.map((timesheet) => (
          <Card key={timesheet.id} className="warren-card">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-lg">{timesheet.employee.name}</h3>
                    <Badge className={getStatusColor(timesheet.status)}>
                      {getStatusIcon(timesheet.status)}
                      <span className="ml-1 capitalize">{timesheet.status}</span>
                    </Badge>
                    {isLateSubmission(timesheet.submittedAt, timesheet.weekEnding) && (
                      <Badge className="bg-orange-100 text-orange-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Late Submission
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Department</p>
                      <p className="font-medium">{timesheet.employee.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Week Ending</p>
                      <p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total Hours</p>
                      <p className="font-medium">{timesheet.totalHours.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Overtime</p>
                      <p className="font-medium text-orange-600">{timesheet.overtimeHours.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-warren-gray-400">
                    Submitted: {new Date(timesheet.submittedAt).toLocaleString('en-GB')}
                  </div>
                  
                  {timesheet.supervisorNotes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-warren-gray-800 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Supervisor Notes:</span> {timesheet.supervisorNotes}
                      </p>
                      {timesheet.approvedBy && timesheet.approvedAt && (
                        <p className="text-xs text-gray-500 dark:text-warren-gray-500 mt-1">
                          {timesheet.status === 'approved' ? 'Approved' : 'Rejected'} by {timesheet.approvedBy} on {new Date(timesheet.approvedAt).toLocaleString('en-GB')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTimesheet(timesheet)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Review Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>
                          Timesheet Review - {timesheet.employee.name}
                        </DialogTitle>
                        <DialogDescription>
                          Week ending {new Date(timesheet.weekEnding).toLocaleDateString('en-GB')}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedTimesheet && (
                        <div className="space-y-6">
                          {/* Shift Details */}
                          <div>
                            <h3 className="font-medium mb-3">Daily Shifts</h3>
                            <div className="space-y-2">
                              {selectedTimesheet.shifts.map((shift, index) => (
                                <div key={index} className="grid grid-cols-6 gap-4 p-3 border rounded-lg">
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">Date</p>
                                    <p className="font-medium">{new Date(shift.date).toLocaleDateString('en-GB')}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">Start</p>
                                    <p className="font-medium">{shift.startTime}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">End</p>
                                    <p className="font-medium">{shift.endTime}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total Hrs</p>
                                    <p className="font-medium">{shift.totalHours.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">OT Hrs</p>
                                    <p className="font-medium text-orange-600">{shift.overtimeHours.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">Notes</p>
                                    <p className="text-sm">{shift.notes || 'None'}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Approval Section */}
                          {timesheet.status === 'submitted' && (
                            <div className="space-y-4 border-t pt-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  Supervisor Notes (Optional)
                                </label>
                                <Textarea
                                  value={approvalNotes}
                                  onChange={(e) => setApprovalNotes(e.target.value)}
                                  placeholder="Add any comments about this timesheet..."
                                  className="warren-input"
                                />
                              </div>
                              
                              <div className="flex gap-3">
                                <Button
                                  onClick={() => handleApproval({
                                    timesheetId: timesheet.id,
                                    approved: true,
                                    notes: approvalNotes
                                  })}
                                  disabled={processingApproval}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve Timesheet
                                </Button>
                                
                                <Button
                                  onClick={() => handleApproval({
                                    timesheetId: timesheet.id,
                                    approved: false,
                                    notes: approvalNotes
                                  })}
                                  disabled={processingApproval}
                                  variant="destructive"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject Timesheet
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {timesheet.status === 'submitted' && (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleApproval({
                          timesheetId: timesheet.id,
                          approved: true,
                          notes: ''
                        })}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={processingApproval}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleApproval({
                          timesheetId: timesheet.id,
                          approved: false,
                          notes: ''
                        })}
                        size="sm"
                        variant="destructive"
                        disabled={processingApproval}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {timesheets.length === 0 && (
          <Card className="warren-card">
            <CardContent className="py-8">
              <div className="text-center text-gray-500 dark:text-warren-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No timesheets found for the selected status</p>
                <p className="text-sm">Try changing the status filter above</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
