
'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  X, 
  Clock, 
  Filter, 
  Search, 
  Download,
  Eye,
  Edit,
  AlertTriangle,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface TimesheetData {
  id: string;
  employee: {
    name: string;
    employeeNumber: string;
    department: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  normalHours: number;
  overtimeHours: number;
  totalPay: number;
  status: 'pending' | 'approved' | 'rejected';
  sleepRule: boolean;
  notes?: string;
}

export function TimesheetManagement() {
  const [timesheets, setTimesheets] = useState<TimesheetData[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimesheets();
  }, []);

  const loadTimesheets = async () => {
    try {
      // Mock data for demonstration
      const mockTimesheets: TimesheetData[] = [
        {
          id: '1',
          employee: {
            name: 'John Smith',
            employeeNumber: 'EMP001',
            department: 'Production'
          },
          date: '2024-12-10',
          startTime: '08:00',
          endTime: '17:00',
          totalHours: 8.5,
          normalHours: 8.5,
          overtimeHours: 0,
          totalPay: 127.50,
          status: 'pending',
          sleepRule: false,
          notes: 'Regular shift'
        },
        {
          id: '2',
          employee: {
            name: 'Sarah Johnson',
            employeeNumber: 'EMP002',
            department: 'Assembly'
          },
          date: '2024-12-10',
          startTime: '22:00',
          endTime: '08:00',
          totalHours: 10,
          normalHours: 2,
          overtimeHours: 8,
          totalPay: 234.50,
          status: 'pending',
          sleepRule: true,
          notes: 'Night shift with sleep rule'
        },
        {
          id: '3',
          employee: {
            name: 'Mike Wilson',
            employeeNumber: 'EMP003',
            department: 'Warehouse'
          },
          date: '2024-12-09',
          startTime: '08:00',
          endTime: '18:00',
          totalHours: 9.5,
          normalHours: 8.5,
          overtimeHours: 1,
          totalPay: 180.25,
          status: 'approved',
          sleepRule: false,
        },
      ];
      
      setTimesheets(mockTimesheets);
    } catch (error) {
      console.error('Failed to load timesheets:', error);
      toast({
        title: "Error",
        description: "Failed to load timesheets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTimesheets = timesheets.filter((timesheet) => {
    const matchesSearch = timesheet.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timesheet.employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || timesheet.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredTimesheets.map(t => t.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select items to perform bulk action",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, this would make API calls
      setTimesheets(prev => 
        prev.map(timesheet => 
          selectedItems.includes(timesheet.id) 
            ? { ...timesheet, status: action === 'approve' ? 'approved' : 'rejected' }
            : timesheet
        )
      );
      
      setSelectedItems([]);
      
      toast({
        title: "Success",
        description: `${selectedItems.length} timesheets ${action}d successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} timesheets`,
        variant: "destructive",
      });
    }
  };

  const handleSingleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      setTimesheets(prev => 
        prev.map(timesheet => 
          timesheet.id === id 
            ? { ...timesheet, status: action === 'approve' ? 'approved' : 'rejected' }
            : timesheet
        )
      );
      
      toast({
        title: "Success",
        description: `Timesheet ${action}d successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} timesheet`,
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast({
      title: "Export",
      description: "Export functionality will be implemented soon",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timesheet Management
          </CardTitle>
          <CardDescription>
            Review, approve, and manage employee timesheets with bulk operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => handleBulkAction('approve')}
                disabled={selectedItems.length === 0}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Selected ({selectedItems.length})
              </Button>
              
              <Button
                onClick={() => handleBulkAction('reject')}
                disabled={selectedItems.length === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reject Selected
              </Button>
              
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{filteredTimesheets.length}</p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">
                {filteredTimesheets.filter(t => t.status === 'pending').length}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Approved</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {filteredTimesheets.filter(t => t.status === 'approved').length}
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Sleep Rules</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {filteredTimesheets.filter(t => t.sleepRule).length}
              </p>
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedItems.length === filteredTimesheets.length && filteredTimesheets.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimesheets.map((timesheet) => (
                  <TableRow key={timesheet.id} className={selectedItems.includes(timesheet.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedItems.includes(timesheet.id)}
                        onCheckedChange={(checked) => handleSelectItem(timesheet.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{timesheet.employee.name}</span>
                        <span className="text-sm text-gray-500 dark:text-warren-gray-400">
                          {timesheet.employee.employeeNumber} • {timesheet.employee.department}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(timesheet.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{timesheet.startTime} - {timesheet.endTime}</span>
                        {timesheet.sleepRule && (
                          <Badge variant="outline" className="w-fit mt-1">
                            Sleep Rule
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{timesheet.totalHours}h total</span>
                        <span className="text-gray-500 dark:text-warren-gray-400">
                          {timesheet.normalHours}h normal, {timesheet.overtimeHours}h overtime
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">£{timesheet.totalPay.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(timesheet.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {timesheet.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleSingleAction(timesheet.id, 'approve')}
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleSingleAction(timesheet.id, 'reject')}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTimesheets.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-warren-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'No timesheets found matching your filters' 
                : 'No timesheets available'
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
