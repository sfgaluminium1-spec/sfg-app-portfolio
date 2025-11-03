
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Mail, 
  Download, 
  Calendar,
  Users,
  Clock,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BrightPayIntegrationProps {
  weeklyData?: any;
  pendingHolidayRequests?: any[];
}

export function BrightPayIntegration({ weeklyData, pendingHolidayRequests = [] }: BrightPayIntegrationProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSendWeeklyData = async () => {
    setIsSending(true);
    
    try {
      const response = await fetch('/api/brightpay/send-weekly-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyData }),
      });
      
      if (response.ok) {
        toast.success('✅ Weekly payroll data sent to BrightPay via email');
      } else {
        throw new Error('Failed to send data');
      }
    } catch (error) {
      toast.error('❌ Failed to send payroll data');
      console.error('BrightPay integration error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendHolidayRequests = async () => {
    setIsSending(true);
    
    try {
      const response = await fetch('/api/brightpay/send-holiday-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: pendingHolidayRequests }),
      });
      
      if (response.ok) {
        toast.success('✅ Holiday requests sent to BrightPay via email');
      } else {
        throw new Error('Failed to send requests');
      }
    } catch (error) {
      toast.error('❌ Failed to send holiday requests');
      console.error('BrightPay integration error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const downloadCSV = () => {
    // Generate and download CSV file
    const csvData = generatePayrollCSV(weeklyData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SFG_Payroll_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('📥 CSV file downloaded for manual BrightPay import');
  };

  return (
    <div className="space-y-6">
      {/* Integration Header */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <ExternalLink className="w-5 h-5" />
            BrightPay Integration
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Send payroll data and holiday requests to BrightPay via email for processing.
            CSV exports are also available for manual import.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Payroll Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-warren-blue-600" />
              Weekly Payroll Data
            </CardTitle>
            <CardDescription>
              Send current week's timesheet data to BrightPay for payroll processing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyData ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-warren-gray-400">Total Employees</p>
                    <p className="font-semibold text-lg">{weeklyData.employeeCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-warren-gray-400">Total Hours</p>
                    <p className="font-semibold text-lg">{weeklyData.totalHours || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-warren-gray-400">Week Ending</p>
                    <p className="font-semibold">
                      {weeklyData.weekEnding ? new Date(weeklyData.weekEnding).toLocaleDateString('en-GB') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-warren-gray-400">Total Pay</p>
                    <p className="font-semibold text-lg text-green-600">
                      £{weeklyData.totalPay?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSendWeeklyData}
                    disabled={isSending}
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {isSending ? 'Sending...' : 'Email to BrightPay'}
                  </Button>
                  
                  <Button 
                    onClick={downloadCSV}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-warren-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No weekly data available</p>
                <p className="text-sm">Complete timesheets will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Holiday Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warren-blue-600" />
              Holiday Requests
            </CardTitle>
            <CardDescription>
              Send pending holiday requests to BrightPay for approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingHolidayRequests.length > 0 ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-warren-gray-400">Pending Requests</span>
                    <Badge variant="secondary">{pendingHolidayRequests.length}</Badge>
                  </div>
                  
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {pendingHolidayRequests.slice(0, 5).map((request, index) => (
                      <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-warren-gray-800 rounded">
                        <span>{request.employeeName}</span>
                        <span className="text-gray-500">{request.totalDays} days</span>
                      </div>
                    ))}
                    {pendingHolidayRequests.length > 5 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{pendingHolidayRequests.length - 5} more requests
                      </p>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={handleSendHolidayRequests}
                  disabled={isSending}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSending ? 'Sending...' : 'Send Holiday Requests'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-warren-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No pending holiday requests</p>
                <p className="text-sm">Employee requests will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                BrightPay Email Integration Active
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Payroll data will be sent to {process.env.NEXT_PUBLIC_BRIGHTPAY_EMAIL || 'warren@sfg-aluminium.co.uk'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function generatePayrollCSV(data: any): string {
  if (!data || !data.employees) return '';
  
  const headers = [
    'Employee ID',
    'Name',
    'Email',
    'Department',
    'Normal Hours',
    'Overtime Hours',
    'Total Hours',
    'Hourly Rate',
    'Total Pay',
    'Week Ending',
  ];

  const rows = data.employees.map((emp: any) => [
    emp.employeeId || '',
    emp.name || '',
    emp.email || '',
    emp.department || '',
    emp.normalHours?.toFixed(2) || '0.00',
    emp.overtimeHours?.toFixed(2) || '0.00',
    emp.totalHours?.toFixed(2) || '0.00',
    emp.hourlyRate?.toFixed(2) || '0.00',
    emp.totalPay?.toFixed(2) || '0.00',
    data.weekEnding ? new Date(data.weekEnding).toLocaleDateString('en-GB') : '',
  ]);

  return [
    headers.join(','),
    ...rows.map((row: string[]) => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}
