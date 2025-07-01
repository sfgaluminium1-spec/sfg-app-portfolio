
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// Xero API integration endpoints
// In a real implementation, this would connect to actual Xero API

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Mock Xero data responses
    const mockXeroData = {
      financials: {
        totalRevenue: 487300,
        outstandingInvoices: 23700,
        cashFlow: 156800,
        profitMargin: 18.5,
        lastUpdated: new Date().toISOString()
      },
      invoices: [
        {
          id: 'INV-001',
          customerName: 'Warren Industries',
          amount: 12500,
          status: 'PAID',
          dueDate: '2025-01-15',
          currency: 'GBP'
        },
        {
          id: 'INV-002',
          customerName: 'Creative Solutions Ltd',
          amount: 8300,
          status: 'PENDING',
          dueDate: '2025-01-20',
          currency: 'GBP'
        },
        {
          id: 'INV-003',
          customerName: 'Innovation Partners',
          amount: 15600,
          status: 'OVERDUE',
          dueDate: '2024-12-30',
          currency: 'GBP'
        }
      ],
      cashflow: {
        inflow: 245800,
        outflow: 189200,
        netCashflow: 56600,
        projectedNextMonth: 78900
      },
      profitAndLoss: {
        revenue: 487300,
        expenses: 312450,
        grossProfit: 174850,
        netProfit: 98340,
        margins: {
          gross: 35.9,
          net: 20.2
        }
      }
    };

    switch (action) {
      case 'financials':
        return NextResponse.json(mockXeroData.financials);
      
      case 'invoices':
        return NextResponse.json(mockXeroData.invoices);
      
      case 'cashflow':
        return NextResponse.json(mockXeroData.cashflow);
      
      case 'profitloss':
        return NextResponse.json(mockXeroData.profitAndLoss);
      
      default:
        return NextResponse.json(mockXeroData);
    }
  } catch (error) {
    console.error('Xero API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Xero data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // Mock Xero API operations
    switch (action) {
      case 'create-invoice':
        return NextResponse.json({
          success: true,
          invoiceId: `INV-${Date.now()}`,
          message: 'Invoice created successfully in Xero',
          amount: data.amount,
          currency: 'GBP'
        });
      
      case 'update-payment':
        return NextResponse.json({
          success: true,
          paymentId: `PAY-${Date.now()}`,
          message: 'Payment updated in Xero'
        });
      
      case 'sync-data':
        return NextResponse.json({
          success: true,
          message: 'Data synchronized with Xero',
          syncedAt: new Date().toISOString()
        });
      
      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Xero API POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to execute Xero operation' },
      { status: 500 }
    );
  }
}
