
'use client';

import { useSafeSession } from '@/hooks/use-safe-session';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Receipt, Plus, Camera, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExpenseRequest {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  hasReceipt: boolean;
}

export default function EmployeeExpensesPage() {
  const { data: session, status, mounted } = useSafeSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState<ExpenseRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (session) {
      loadExpenses();
    }
  }, [status, session, mounted, router]);

  const loadExpenses = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockExpenses: ExpenseRequest[] = [
        {
          id: '1',
          date: '2025-09-08',
          category: 'Travel',
          amount: 24.50,
          description: 'Fuel for site visit - Manchester project',
          status: 'approved',
          submittedAt: '2025-09-08T16:30:00Z',
          hasReceipt: true,
        },
        {
          id: '2',
          date: '2025-09-05',
          category: 'Materials',
          amount: 156.80,
          description: 'Emergency aluminum sheets for client repair',
          status: 'pending',
          submittedAt: '2025-09-06T09:15:00Z',
          hasReceipt: true,
        },
        {
          id: '3',
          date: '2025-08-28',
          category: 'Meals',
          amount: 12.50,
          description: 'Lunch during extended shift at Preston site',
          status: 'approved',
          submittedAt: '2025-08-29T08:45:00Z',
          hasReceipt: false,
        },
      ];
      
      setExpenses(mockExpenses);
    } catch (error) {
      console.error('Failed to load expenses:', error);
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

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'travel':
        return 'bg-blue-100 text-blue-800';
      case 'materials':
        return 'bg-purple-100 text-purple-800';
      case 'meals':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-warren-gray-400">Loading expenses...</p>
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
              Expense Claims
            </h1>
          </div>
          
          <Button 
            onClick={() => {/* TODO: Implement new expense form */}}
            className="warren-button-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Expense
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Summary Card */}
        <Card className="warren-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-warren-blue-600" />
              Expense Summary
            </CardTitle>
            <CardDescription>
              Your expense claims for this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-warren-blue-600">£193.80</p>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total This Month</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">£37.00</p>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">£156.80</p>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">3</p>
                <p className="text-sm text-gray-600 dark:text-warren-gray-400">Claims</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="warren-card">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => {/* TODO: Implement camera receipt */}}
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
              >
                <Camera className="w-6 h-6 text-warren-blue-600" />
                <span className="text-sm">Scan Receipt</span>
              </Button>
              <Button 
                onClick={() => {/* TODO: Implement manual entry */}}
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
              >
                <Upload className="w-6 h-6 text-warren-blue-600" />
                <span className="text-sm">Upload Receipt</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expense History */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Expenses
          </h2>
          
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <Card key={expense.id} className="warren-card">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Receipt className="w-4 h-4 text-warren-blue-600" />
                        <span className="font-medium text-lg">
                          £{expense.amount.toFixed(2)}
                        </span>
                        <Badge className={getCategoryColor(expense.category)}>
                          {expense.category}
                        </Badge>
                        <Badge className={getStatusColor(expense.status)}>
                          {getStatusIcon(expense.status)}
                          <span className="ml-1 capitalize">{expense.status}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-gray-900 dark:text-white mb-2">
                        {expense.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-warren-gray-500">
                        <span>{new Date(expense.date).toLocaleDateString('en-GB')}</span>
                        <span>Submitted {new Date(expense.submittedAt).toLocaleDateString('en-GB')}</span>
                        {expense.hasReceipt && (
                          <Badge variant="secondary" className="text-xs">
                            Receipt attached
                          </Badge>
                        )}
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
                  <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No expense claims yet</p>
                  <p className="text-sm">Submit your first expense claim using the button above</p>
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
                  Expenses are processed via BrightPay
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your expense claims will be sent to the payroll team for approval. 
                  Approved expenses will be included in your next pay cycle.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
