
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real application, this would fetch from the database
    // For now, return mock data
    const financeData = {
      totalRevenue: 1247832.50,
      outstandingInvoices: 23,
      paidInvoices: 156,
      overdueInvoices: 5,
      monthlyRevenue: 98234.75,
      profitMargin: 18.5,
      cashFlow: 234567.89,
      recentTransactions: [
        { 
          id: 1, 
          type: 'payment', 
          description: 'Payment received from Beesley and Fildes', 
          amount: 15420.00, 
          date: '2 hours ago', 
          status: 'completed' 
        },
        { 
          id: 2, 
          type: 'invoice', 
          description: 'Invoice sent to Lodestone Projects', 
          amount: 28750.50, 
          date: '4 hours ago', 
          status: 'sent' 
        },
        { 
          id: 3, 
          type: 'expense', 
          description: 'Material purchase - NVM Supplier', 
          amount: -5680.25, 
          date: '1 day ago', 
          status: 'paid' 
        },
        { 
          id: 4, 
          type: 'payment', 
          description: 'Payment received from City Council', 
          amount: 45200.00, 
          date: '2 days ago', 
          status: 'completed' 
        },
        { 
          id: 5, 
          type: 'invoice', 
          description: 'Invoice overdue - ABC Construction', 
          amount: 12300.00, 
          date: '5 days ago', 
          status: 'overdue' 
        }
      ],
      complianceItems: [
        { 
          id: 1, 
          type: 'tax', 
          description: 'VAT Return Q4 2024', 
          dueDate: '2025-01-31', 
          status: 'pending', 
          priority: 'high' 
        },
        { 
          id: 2, 
          type: 'audit', 
          description: 'Annual Financial Audit', 
          dueDate: '2025-03-15', 
          status: 'in_progress', 
          priority: 'medium' 
        },
        { 
          id: 3, 
          type: 'insurance', 
          description: 'Public Liability Insurance Renewal', 
          dueDate: '2025-02-28', 
          status: 'completed', 
          priority: 'high' 
        },
        { 
          id: 4, 
          type: 'certification', 
          description: 'ISO 9001 Certification Review', 
          dueDate: '2025-04-30', 
          status: 'pending', 
          priority: 'low' 
        }
      ]
    };

    return NextResponse.json(financeData);
  } catch (error) {
    console.error('Error fetching finance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finance data' },
      { status: 500 }
    );
  }
}
