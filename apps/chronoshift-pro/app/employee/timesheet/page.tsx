
'use client';

import { useSafeSession } from '@/hooks/use-safe-session';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GeolocationTimesheet } from '@/components/timesheet/geolocation-timesheet';
import { ArrowLeft, Download, HelpCircle, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

export default function EmployeeTimesheetPage() {
  const { data: session, status, mounted } = useSafeSession();
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);

  useEffect(() => {
    if (!mounted) return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    fetchEmployees();
  }, [status, mounted, router]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data);
      
      // Find current employee data
      const employee = data.find((emp: any) => emp.email === session?.user?.email);
      setCurrentEmployee(employee);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleTimesheetSubmit = async (timesheetData: any) => {
    try {
      const response = await fetch('/api/timesheets/geolocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...timesheetData,
          employeeId: currentEmployee?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save timesheet');
      }

      const result = await response.json();
      toast.success('Timesheet submitted successfully with location verification');
      
      // Optionally redirect to dashboard
      setTimeout(() => {
        router.push('/employee/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting timesheet:', error);
      throw error; // Re-throw to let GeolocationTimesheet handle the error display
    }
  };

  const handleExportPDF = async () => {
    if (!currentEmployee) return;
    
    try {
      // Get current week's timesheets for this employee
      const weekEnd = new Date();
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      
      const response = await fetch(`/api/timesheets?employeeId=${currentEmployee?.id}&weekStart=${weekStart.toISOString()}&weekEnd=${weekEnd.toISOString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timesheet data');
      }

      const timesheets = await response.json();
      
      if (timesheets.length === 0) {
        toast.error('No timesheets found for this week');
        return;
      }

      // Generate PDF using existing generator
      // Implementation would go here
      toast.success('PDF export feature coming soon');
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error('Failed to export timesheet data');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-warren-gray-400">Loading timesheet system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 pb-20 md:ml-64 transition-all duration-300">
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/employee/dashboard')}
                className="md:hidden"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Submit Timesheet
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location verification required
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">How to Submit Timesheets</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium">1. Grant Location Access</p>
                        <p className="text-gray-600">Allow location services when prompted</p>
                      </div>
                      <div>
                        <p className="font-medium">2. Verify Your Location</p>
                        <p className="text-gray-600">Must be within 50m of work site</p>
                      </div>
                      <div>
                        <p className="font-medium">3. Enter Work Details</p>
                        <p className="text-gray-600">Start time, end time, and break duration</p>
                      </div>
                      <div>
                        <p className="font-medium">4. Submit</p>
                        <p className="text-gray-600">Location is verified again at submission</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Privacy:</strong> Location is only captured when submitting timesheets, 
                        never continuously tracked.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        {currentEmployee && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                Employee Information
                <Badge variant="outline">
                  {currentEmployee.employeeNumber}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">{currentEmployee.firstName} {currentEmployee.lastName}</p>
                  <p className="text-gray-600 dark:text-gray-400">{currentEmployee.department}</p>
                </div>
                <div>
                  <p className="font-medium">Rate: £{currentEmployee.hourlyRate}/hour</p>
                  <p className="text-gray-600 dark:text-gray-400">Standard: {currentEmployee.weeklyHours}hrs/week</p>
                </div>
                <div>
                  <p className="font-medium">Role: {currentEmployee.role}</p>
                  <p className="text-gray-600 dark:text-gray-400">{currentEmployee.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Timesheet Form */}
        <GeolocationTimesheet 
          employeeId={currentEmployee?.id}
          onSubmit={handleTimesheetSubmit}
        />
      </div>
    </div>
  );
}
