
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

    // Fetch financial metrics
    const financialMetrics = await prisma.financialMetric.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate totals
    const totalRevenue = financialMetrics.reduce((sum: number, metric: any) => sum + metric.revenue, 0);
    const avgEfficiency = financialMetrics.length > 0 
      ? financialMetrics.reduce((sum: number, metric: any) => sum + metric.efficiency, 0) / financialMetrics.length
      : 0;

    // Count documents processed
    const documentsProcessed = await prisma.documentProcessing.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Count active AI models
    const activeModels = await prisma.aIModelUsage.groupBy({
      by: ['modelName'],
      where: {
        date: {
          gte: startDate,
        },
      },
    });

    return NextResponse.json({
      revenue: totalRevenue,
      efficiency: avgEfficiency,
      documentsProcessed,
      activeModels: activeModels.length,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
