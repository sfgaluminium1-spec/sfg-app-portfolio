
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    const days = daysMap[range as keyof typeof daysMap] || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const financialMetrics = await prisma.financialMetric.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const formattedData = financialMetrics.map((metric: any) => ({
      date: metric.date.toISOString().split('T')[0],
      revenue: metric.revenue,
      expenses: metric.expenses,
      profit: metric.profit,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Financial data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial data' },
      { status: 500 }
    );
  }
}
