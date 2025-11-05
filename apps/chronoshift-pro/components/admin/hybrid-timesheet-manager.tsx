
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search,
  Filter,
  PrinterIcon 
} from 'lucide-react';
import { TimesheetPDFGenerator } from '@/lib/pdf-generator';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
}

interface DigitalTimesheet {
  id: string;
  employeeId: string;
  employee: Employee;
  weekEnding: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
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
  supervisorApproval?: {
    supervisorName: string;
    approved: boolean;
    date: string;
    notes: string;
  };
}

export function HybridTimesheetManager() {
  const [timesheets, setTimesheets] = useState<DigitalTimesheet[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load employees
      const empResponse = await fetch('/api/employees');
      const empData = await empResponse.json();
      setEmployees(empData);
      
      // Load timesheets
      const timesheetResponse = await fetch('/api/timesheets/hybrid');
      const timesheetData = await timesheetResponse.json();
      setTimesheets(timesheetData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load timesheet data');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async (timesheet: DigitalTimesheet) => {
    try {
      const pdfData = {
        employee: {
          name: timesheet.employee.name,
          id: timesheet.employeeId,
          department: timesheet.employee.department
        },
        weekEnding: timesheet.weekEnding,
        shifts: timesheet.shifts.map((shift, index) => ({
          day: new Date(shift.date).toLocaleDateString('en-GB', { weekday: 'long' }),
          date: new Date(shift.date).toLocaleDateString('en-GB'),
          startTime: shift.startTime,
          endTime: shift.endTime,
          totalHours: shift.totalHours,
          breakDuration: '30min', // Default break
          overtimeHours: shift.overtimeHours,
          notes: shift.notes || ''
        })),
        summary: {
          totalHours: timesheet.totalHours,
          overtimeHours: timesheet.overtimeHours,
          absences: 'None',
          authorizedLeave: 'None',
          travelTime: 0
        },
        supervisor: timesheet.supervisorApproval ? {
          name: timesheet.supervisorApproval.supervisorName,
          approved: timesheet.supervisorApproval.approved,
          date: timesheet.supervisorApproval.date
        } : undefined
      };
      
      await TimesheetPDFGenerator.downloadPDF(pdfData);
      toast.success('PDF timesheet downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handlePrintTimesheet = async (timesheet: DigitalTimesheet) => {
    try {
      const pdfData = {
        employee: {
          name: timesheet.employee.name,
          id: timesheet.employeeId,
          department: timesheet.employee.department
        },
        weekEnding: timesheet.weekEnding,
        shifts: timesheet.shifts.map((shift, index) => ({
          day: new Date(shift.date).toLocaleDateString('en-GB', { weekday: 'long' }),
          date: new Date(shift.date).toLocaleDateString('en-GB'),
          startTime: shift.startTime,
          endTime: shift.endTime,
          totalHours: shift.totalHours,
          breakDuration: '30min',
          overtimeHours: shift.overtimeHours,
          notes: shift.notes || ''
        })),
        summary: {
          totalHours: timesheet.totalHours,
          overtimeHours: timesheet.overtimeHours,
          absences: 'None',
          authorizedLeave: 'None',
          travelTime: 0
        }
      };
      
      await TimesheetPDFGenerator.printPDF(pdfData);
      toast.success('Timesheet sent to printer');
    } catch (error) {
      console.error('Error printing timesheet:', error);
      toast.error('Failed to print timesheet');
    }
  };

  const handleApproveTimesheet = async (timesheetId: string, approved: boolean, notes: string = '') => {
    try {
      const response = await fetch(`/api/timesheets/${timesheetId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, notes })
      });
      
      if (response.ok) {
        toast.success(`Timesheet ${approved ? 'approved' : 'rejected'} successfully`);
        loadData();
      }
    } catch (error) {
      console.error('Error updating approval:', error);
      toast.error('Failed to update timesheet approval');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'submitted':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesStatus = statusFilter === 'all' || timesheet.status === statusFilter;
    const matchesSearch = timesheet.employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWeek = !selectedWeek || timesheet.weekEnding === selectedWeek;
    
    return matchesStatus && matchesSearch && matchesWeek;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading timesheet data...</p>
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
            Hybrid Timesheet Manager
          </h2>
          <p className="text-gray-600 dark:text-warren-gray-400">
            Digital-to-print workflow and supervisor approvals
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="warren-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="warren-input pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="warren-input">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="date"
              placeholder="Week ending"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="warren-input"
            />
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSelectedWeek('');
              }}>
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="warren-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total Timesheets</p>
                <p className="text-2xl font-bold">{filteredTimesheets.length}</p>
              </div>
              <FileText className="w-8 h-8 text-warren-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="warren-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredTimesheets.filter(t => t.status === 'submitted').length}
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
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredTimesheets.filter(t => t.status === 'approved').length}
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
                  {filteredTimesheets.reduce((sum, t) => sum + t.totalHours, 0).toFixed(1)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-warren-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timesheets List */}
      <div className="space-y-4">
        {filteredTimesheets.map((timesheet) => (
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
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Overtime Hours</p>
                      <p className="font-medium text-orange-600">{timesheet.overtimeHours.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {timesheet.supervisorApproval && (
                    <div className="bg-gray-50 dark:bg-warren-gray-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                        Supervisor: {timesheet.supervisorApproval.supervisorName} • 
                        {timesheet.supervisorApproval.approved ? ' Approved' : ' Rejected'} • 
                        {new Date(timesheet.supervisorApproval.date).toLocaleDateString('en-GB')}
                      </p>
                      {timesheet.supervisorApproval.notes && (
                        <p className="text-sm mt-1">{timesheet.supervisorApproval.notes}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    onClick={() => handleGeneratePDF(timesheet)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  
                  <Button
                    onClick={() => handlePrintTimesheet(timesheet)}
                    variant="outline"
                    size="sm"
                  >
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  
                  {timesheet.status === 'submitted' && (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleApproveTimesheet(timesheet.id, true)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleApproveTimesheet(timesheet.id, false)}
                        size="sm"
                        variant="destructive"
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
        
        {filteredTimesheets.length === 0 && (
          <Card className="warren-card">
            <CardContent className="py-8">
              <div className="text-center text-gray-500 dark:text-warren-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No timesheets found matching your filters</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
