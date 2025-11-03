
'use client';

import { useSafeSession } from '@/hooks/use-safe-session';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HolidayRequest {
  id: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function EmployeeHolidaysPage() {
  const { data: session, status, mounted } = useSafeSession();
  const router = useRouter();
  const [holidays, setHolidays] = useState<HolidayRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (session) {
      loadHolidays();
    }
  }, [status, session, mounted, router]);

  const loadHolidays = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockHolidays: HolidayRequest[] = [
        {
          id: '1',
          startDate: '2025-09-25',
          endDate: '2025-09-27',
          totalDays: 3,
          reason: 'Family vacation',
          status: 'pending',
          submittedAt: '2025-09-10T10:00:00Z',
        },
        {
          id: '2',
          startDate: '2025-08-15',
          endDate: '2025-08-15',
          totalDays: 1,
          reason: 'Medical appointment',
          status: 'approved',
          submittedAt: '2025-08-01T14:30:00Z',
        },
      ];
      
      setHolidays(mockHolidays);
    } catch (error) {
      console.error('Failed to load holidays:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-warren-gray-400">Loading holidays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 md:ml-64 transition-all duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-warren-gray-800 border-b border-gray-200 dark:border-warren-gray-700 p-4">
        <div className="flex items-center justify-between">
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
              Holiday Requests
            </h1>
          </div>
          
          <Button 
            onClick={() => {/* TODO: Implement new request form */}}
            className="warren-button-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Summary Card */}
        <Card className="warren-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warren-blue-600" />
              Holiday Summary
            </CardTitle>
            <CardDescription>
              Your holiday entitlement and usage for this year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-warren-blue-600">28</p>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">15</p>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Used</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">13</p>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Remaining</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">3</p>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Holiday Requests */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Requests
          </h2>
          
          {holidays.length > 0 ? (
            holidays.map((holiday) => (
              <Card key={holiday.id} className="warren-card">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-warren-blue-600" />
                        <span className="font-medium">
                          {new Date(holiday.startDate).toLocaleDateString('en-GB')} - {' '}
                          {new Date(holiday.endDate).toLocaleDateString('en-GB')}
                        </span>
                        <Badge className={getStatusColor(holiday.status)}>
                          {getStatusIcon(holiday.status)}
                          <span className="ml-1 capitalize">{holiday.status}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-warren-gray-400 mb-2">
                        {holiday.reason}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-warren-gray-500">
                        <span>{holiday.totalDays} day{holiday.totalDays > 1 ? 's' : ''}</span>
                        <span>Submitted {new Date(holiday.submittedAt).toLocaleDateString('en-GB')}</span>
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
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No holiday requests yet</p>
                  <p className="text-sm">Submit your first holiday request using the button above</p>
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
                  Holiday requests are processed via BrightPay
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your requests will be automatically sent to the payroll team for approval. 
                  You'll receive email notifications about status changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
