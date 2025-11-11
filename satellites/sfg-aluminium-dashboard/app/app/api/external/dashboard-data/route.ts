
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function validateApiKey(apiKey: string | null) {
  if (!apiKey) return false;
  
  try {
    const config = await prisma.configuration.findUnique({
      where: { key: `api_key_${apiKey}` },
    });
    
    if (!config) return false;
    const keyData = JSON.parse(config.value);
    return keyData.active === true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('api_key') || request.headers.get('x-api-key');
    
    if (!await validateApiKey(apiKey)) {
      return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
    }

    const range = searchParams.get('range') || '30d';
    
    // Calculate date range
    const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    const days = daysMap[range] || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch all dashboard data
    const [financialMetrics, documentsProcessed, activeModels, aiUsage] = await Promise.all([
      prisma.financialMetric.findMany({
        where: { date: { gte: startDate } },
        orderBy: { date: 'desc' },
      }),
      prisma.documentProcessing.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.aIModelUsage.groupBy({
        by: ['modelName'],
        where: { date: { gte: startDate } },
      }),
      prisma.aIModelUsage.findMany({
        where: { date: { gte: startDate } },
        orderBy: { date: 'desc' },
        take: 100,
      })
    ]);

    // Calculate totals and metrics
    const totalRevenue = financialMetrics.reduce((sum: number, metric: any) => sum + metric.revenue, 0);
    const totalExpenses = financialMetrics.reduce((sum: number, metric: any) => sum + metric.expenses, 0);
    const totalProfit = financialMetrics.reduce((sum: number, metric: any) => sum + metric.profit, 0);
    const avgEfficiency = financialMetrics.length > 0 
      ? financialMetrics.reduce((sum: number, metric: any) => sum + metric.efficiency, 0) / financialMetrics.length
      : 0;

    const totalAIRequests = aiUsage.reduce((sum: number, usage: any) => sum + usage.requests, 0);
    const totalAISuccess = aiUsage.reduce((sum: number, usage: any) => sum + usage.success, 0);
    const totalAIErrors = aiUsage.reduce((sum: number, usage: any) => sum + usage.errors, 0);

    const dashboardData = {
      period: range,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString(),
      financial: {
        totalRevenue: totalRevenue.toString(), // Convert to string to handle BigInt
        totalExpenses: totalExpenses.toString(),
        totalProfit: totalProfit.toString(),
        avgEfficiency: Math.round(avgEfficiency * 100) / 100,
        dailyMetrics: financialMetrics.map((metric: any) => ({
          date: metric.date.toISOString().split('T')[0],
          revenue: metric.revenue.toString(),
          expenses: metric.expenses.toString(),
          profit: metric.profit.toString(),
          efficiency: metric.efficiency
        }))
      },
      operations: {
        documentsProcessed,
        activeAIModels: activeModels.length,
        totalAIRequests,
        aiSuccessRate: totalAIRequests > 0 ? (totalAISuccess / totalAIRequests * 100).toFixed(2) : '0',
        aiErrorRate: totalAIRequests > 0 ? (totalAIErrors / totalAIRequests * 100).toFixed(2) : '0'
      },
      aiModels: activeModels.map((model: any) => ({
        name: model.modelName,
        isActive: true
      })),
      metadata: {
        generatedAt: new Date().toISOString(),
        apiVersion: '1.0',
        dataPoints: financialMetrics.length
      }
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('External dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
