
'use client';

import { useSafeSession } from '@/hooks/use-safe-session';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, FileText, Download, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Payslip {
  id: string;
  period: string;
  payDate: string;
  totalHours: number;
  normalHours: number;
  overtimeHours: number;
  grossPay: number;
  netPay: number;
  status: 'processed' | 'pending' | 'draft';
}

export default function EmployeePayslipsPage() {
  const { data: session, status, mounted } = useSafeSession();
  const router = useRouter();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (session) {
      loadPayslips();
    }
  }, [status, session, mounted, router]);

  const loadPayslips = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockPayslips: Payslip[] = [
        {
          id: '1',
          period: 'September 2025',
          payDate: '2025-09-30',
          totalHours: 180,
          normalHours: 170,
          overtimeHours: 10,
          grossPay: 2775.00,
          netPay: 2220.00,
          status: 'processed',
        },
        {
          id: '2',
          period: 'August 2025',
          payDate: '2025-08-31',
          totalHours: 175,
          normalHours: 170,
          overtimeHours: 5,
          grossPay: 2662.50,
          netPay: 2130.00,
          status: 'processed',
        },
        {
          id: '3',
          period: 'July 2025',
          payDate: '2025-07-31',
          totalHours: 170,
          normalHours: 170,
          overtimeHours: 0,
          grossPay: 2550.00,
          netPay: 2040.00,
          status: 'processed',
        },
      ];
      
      setPayslips(mockPayslips);
    } catch (error) {
      console.error('Failed to load payslips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (payslipId: string) => {
    // TODO: Implement payslip download from BrightPay
    console.log('Download payslip:', payslipId);
  };

  const handleView = (payslipId: string) => {
    // TODO: Implement payslip view
    console.log('View payslip:', payslipId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-warren-gray-400">Loading payslips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 md:ml-64 transition-all duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-warren-gray-800 border-b border-gray-200 dark:border-warren-gray-700 p-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payslips
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Current Month Summary */}
        <Card className="warren-card bg-gradient-to-r from-warren-blue-50 to-blue-50 dark:from-warren-blue-900/20 dark:to-blue-900/20 border-warren-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warren-blue-900 dark:text-warren-blue-100">
              <Calendar className="w-5 h-5" />
              Current Month Summary
            </CardTitle>
            <CardDescription className="text-warren-blue-700 dark:text-warren-blue-300">
              September 2025 (Estimated)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-warren-blue-600">165</p>
                <p className="text-sm text-warren-blue-700 dark:text-warren-blue-300">Hours Worked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">£2,475</p>
                <p className="text-sm text-warren-blue-700 dark:text-warren-blue-300">Estimated Gross</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">15</p>
                <p className="text-sm text-warren-blue-700 dark:text-warren-blue-300">Overtime Hours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">30th</p>
                <p className="text-sm text-warren-blue-700 dark:text-warren-blue-300">Next Pay Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payslip History */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Payslip History
          </h2>
          
          {payslips.length > 0 ? (
            payslips.map((payslip) => (
              <Card key={payslip.id} className="warren-card">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-5 h-5 text-warren-blue-600" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {payslip.period}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                            Pay date: {new Date(payslip.payDate).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(payslip.status)}>
                          {payslip.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total Hours</p>
                          <p className="font-semibold">{payslip.totalHours}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-warren-gray-400">Normal Hours</p>
                          <p className="font-semibold">{payslip.normalHours}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-warren-gray-400">Overtime Hours</p>
                          <p className="font-semibold">{payslip.overtimeHours}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-warren-gray-400">Net Pay</p>
                          <p className="font-semibold text-green-600">£{payslip.netPay.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleView(payslip.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          onClick={() => handleDownload(payslip.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="warren-card">
              <CardContent className="py-8">
                <div className="text-center text-gray-500 dark:text-warren-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No payslips available yet</p>
                  <p className="text-sm">Your payslips will appear here once they are processed</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* BrightPay Integration Note */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Payslips are generated by BrightPay
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your official payslips are generated monthly by our payroll system. 
                  Download copies for your records or tax purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
