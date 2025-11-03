
"use client";

import { useState } from 'react';
import { TimesheetForm } from '@/components/timesheet-form';
import { Dashboard } from '@/components/dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, BarChart3, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PayrollAppProps {
  employees: any[];
  timesheets: any[];
  userRole: string;
}

export function PayrollApp({ employees, timesheets, userRole }: PayrollAppProps) {
  const [currentTimesheets, setCurrentTimesheets] = useState(timesheets);

  const handleTimesheetSubmit = async (timesheetData: any) => {
    try {
      const response = await fetch('/api/timesheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timesheetData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save timesheet');
      }

      const result = await response.json();
      
      // Update the timesheets list
      setCurrentTimesheets(prev => [result.timesheet, ...prev]);
      
      toast({
        title: "Success",
        description: `Timesheet ${timesheetData.status === 'SUBMITTED' ? 'submitted' : 'saved'} successfully`,
      });
    } catch (error: any) {
      console.error('Error submitting timesheet:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save timesheet",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleViewTimesheet = async (id: string) => {
    // TODO: Implement timesheet detail view
    console.log('View timesheet:', id);
  };

  const handleExportData = async (type: string) => {
    try {
      const response = await fetch('/api/export/timesheets');
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SFG_Timesheets_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Excel file downloaded successfully",
      });
    } catch (error: any) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-warren-blue-600 via-warren-blue-700 to-warren-blue-800 
          dark:from-warren-blue-400 dark:via-warren-blue-500 dark:to-warren-blue-600 
          bg-clip-text text-transparent mb-2">
          SFG Aluminium Ltd
        </h1>
        <p className="text-xl text-gray-600 dark:text-warren-gray-400 transition-colors">
          Payroll Management System
        </p>
        <div className="mt-2 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-warren-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Online
          </span>
          <span>|</span>
          <span>Warren Executive Theme</span>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-warren-gray-800 border dark:border-warren-gray-700">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center gap-2 data-[state=active]:bg-warren-blue-50 
            dark:data-[state=active]:bg-warren-blue-900/50 data-[state=active]:text-warren-blue-700 
            dark:data-[state=active]:text-warren-blue-300 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="new-timesheet" 
            className="flex items-center gap-2 data-[state=active]:bg-warren-blue-50 
            dark:data-[state=active]:bg-warren-blue-900/50 data-[state=active]:text-warren-blue-700 
            dark:data-[state=active]:text-warren-blue-300 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            New Timesheet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Dashboard
            timesheets={currentTimesheets}
            employees={employees}
            onViewTimesheet={handleViewTimesheet}
            onExportData={handleExportData}
            userRole={userRole}
          />
        </TabsContent>

        <TabsContent value="new-timesheet">
          <TimesheetForm
            employees={employees}
            onSubmit={handleTimesheetSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
