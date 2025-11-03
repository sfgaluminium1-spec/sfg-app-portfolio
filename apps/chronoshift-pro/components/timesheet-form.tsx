
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Calculator, DollarSign, Calendar, User, Save, Send } from 'lucide-react';
import { calculatePayroll, validateTimeEntry, type TimeEntry, type PayrollCalculation } from '@/lib/payroll-calculations';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  hourlyRate: number;
  department: string;
}

interface TimesheetFormProps {
  employees: Employee[];
  onSubmit: (timesheetData: any) => Promise<void>;
  initialData?: any;
}

export function TimesheetForm({ employees, onSubmit, initialData }: TimesheetFormProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [workDate, setWorkDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [description, setDescription] = useState('');
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time calculation when inputs change
  useEffect(() => {
    if (selectedEmployee && workDate && startTime && endTime) {
      try {
        const timeEntry: TimeEntry = {
          startTime,
          endTime,
          workDate: new Date(workDate),
          breakMinutes
        };

        const errors = validateTimeEntry(timeEntry);
        if (errors.length === 0) {
          const calc = calculatePayroll(timeEntry, selectedEmployee.hourlyRate);
          setCalculation(calc);
        } else {
          setCalculation(null);
        }
      } catch (error) {
        setCalculation(null);
      }
    }
  }, [selectedEmployee, workDate, startTime, endTime, breakMinutes]);

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      const employee = employees.find(e => e.id === initialData.employeeId);
      if (employee) {
        setSelectedEmployee(employee);
      }
      setWorkDate(format(new Date(initialData.workDate), 'yyyy-MM-dd'));
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setBreakMinutes(initialData.breakMinutes || 30);
      setDescription(initialData.description || '');
    }
  }, [initialData, employees]);

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    setSelectedEmployee(employee || null);
  };

  const handleSaveDraft = async () => {
    if (!selectedEmployee) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive"
      });
      return;
    }

    const timeEntry: TimeEntry = {
      startTime,
      endTime,
      workDate: new Date(workDate),
      breakMinutes
    };

    const errors = validateTimeEntry(timeEntry);
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        employeeId: selectedEmployee.id,
        workDate: new Date(workDate),
        startTime,
        endTime,
        breakMinutes,
        description,
        status: 'DRAFT',
        ...calculation
      });
      
      toast({
        title: "Success",
        description: "Timesheet saved as draft"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save timesheet",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!selectedEmployee) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive"
      });
      return;
    }

    const timeEntry: TimeEntry = {
      startTime,
      endTime,
      workDate: new Date(workDate),
      breakMinutes
    };

    const errors = validateTimeEntry(timeEntry);
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        employeeId: selectedEmployee.id,
        workDate: new Date(workDate),
        startTime,
        endTime,
        breakMinutes,
        description,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        ...calculation
      });
      
      toast({
        title: "Success",
        description: "Timesheet submitted for approval"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit timesheet",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card className="h-fit">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timesheet Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employee" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Employee
            </Label>
            <Select onValueChange={handleEmployeeChange} value={selectedEmployee?.id || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee..." />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.employeeNumber} - {employee.firstName} {employee.lastName} ({employee.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEmployee && (
              <div className="text-sm text-gray-600">
                Hourly Rate: <span className="font-semibold">${selectedEmployee.hourlyRate.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Work Date */}
          <div className="space-y-2">
            <Label htmlFor="workDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Work Date
            </Label>
            <Input
              id="workDate"
              type="date"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Break Minutes */}
          <div className="space-y-2">
            <Label htmlFor="breakMinutes">Break Minutes</Label>
            <Input
              id="breakMinutes"
              type="number"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(parseInt(e.target.value) || 0)}
              min="0"
              max="480"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Work Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the work performed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSaveDraft} 
              disabled={isSubmitting || !selectedEmployee}
              variant="outline"
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={handleSubmitForApproval} 
              disabled={isSubmitting || !selectedEmployee || !calculation}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit for Approval
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Display */}
      <Card className="h-fit">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Payroll Calculation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {calculation && selectedEmployee ? (
            <div className="space-y-4">
              {/* Hours Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">Regular Hours</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {calculation.regularHours.toFixed(2)}
                  </div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-sm text-gray-600">Overtime Hours</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {calculation.overtimeHours.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Special Hours */}
              {(calculation.nightHours > 0 || calculation.sleepHours > 0) && (
                <div className="grid grid-cols-2 gap-4">
                  {calculation.nightHours > 0 && (
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Night Hours</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {calculation.nightHours.toFixed(2)}
                      </div>
                    </div>
                  )}
                  {calculation.sleepHours > 0 && (
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-sm text-gray-600">Sleep Deduction</div>
                      <div className="text-lg font-semibold text-red-600">
                        -{calculation.sleepHours.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Pay Calculation */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Regular Pay:</span>
                  <span className="font-semibold">${calculation.regularPay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overtime Pay (1.5x):</span>
                  <span className="font-semibold">${calculation.overtimePay.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Total Pay:
                  </span>
                  <span className="font-bold text-green-600">
                    ${calculation.totalPay.toFixed(2)}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Breakdown Details */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700">Time Breakdown:</div>
                <div className="text-xs space-y-1 text-gray-600">
                  <div>Total Hours: {calculation.totalHours.toFixed(2)}</div>
                  <div>Normal Time: {calculation.breakdown.normalTimeHours.toFixed(2)}</div>
                  {calculation.breakdown.beforeWorkHours > 0 && (
                    <div>Before Hours: {calculation.breakdown.beforeWorkHours.toFixed(2)}</div>
                  )}
                  {calculation.breakdown.afterWorkHours > 0 && (
                    <div>After Hours: {calculation.breakdown.afterWorkHours.toFixed(2)}</div>
                  )}
                  {calculation.breakdown.weekendHours > 0 && (
                    <div>Weekend Hours: {calculation.breakdown.weekendHours.toFixed(2)}</div>
                  )}
                </div>
              </div>

              {/* Weekend/Special Shift Indicators */}
              <div className="flex flex-wrap gap-2">
                {new Date(workDate).getDay() === 0 || new Date(workDate).getDay() === 6 ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Weekend Shift
                  </Badge>
                ) : null}
                {calculation.nightHours > 0 && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Night Shift
                  </Badge>
                )}
                {calculation.sleepHours > 0 && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    Sleep Rule Applied
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select an employee and enter work times to see payroll calculation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
