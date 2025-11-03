
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PipelineAnalyticsRequest {
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  startDate?: string;
  endDate?: string;
  includeBreakdown?: boolean;
}

// Production Pipeline Analytics Logic
async function generatePipelineSnapshot(period: string = 'daily') {
  const now = new Date();
  let startDate: Date;
  let endDate = now;

  // Calculate date ranges based on period
  switch (period) {
    case 'weekly':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarterly':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    default: // daily
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
  }

  // Get pipeline counts and values
  const [
    enquiries,
    quotes,
    approvedJobs,
    fabricationJobs,
    installationJobs,
    completedJobs
  ] = await Promise.all([
    prisma.enquiry.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['NEW', 'CONTACTED'] }
      }
    }),
    prisma.quote.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['PENDING', 'SENT'] }
      }
    }),
    prisma.job.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'APPROVED'
      }
    }),
    prisma.job.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['FABRICATION', 'ASSEMBLY'] }
      }
    }),
    prisma.job.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'INSTALLING'
      }
    }),
    prisma.job.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'COMPLETED'
      }
    })
  ]);

  // Calculate values
  const enquiriesValue = quotes.reduce((sum: number, quote: any) => sum + (quote.netValue || quote.value || 0), 0);
  const quotesValue = quotes.reduce((sum: number, quote: any) => sum + (quote.netValue || quote.value || 0), 0);
  const approvedJobsValue = approvedJobs.reduce((sum: number, job: any) => sum + (job.value || 0), 0);
  const fabricationValue = fabricationJobs.reduce((sum: number, job: any) => sum + (job.value || 0), 0);
  const installationValue = installationJobs.reduce((sum: number, job: any) => sum + (job.value || 0), 0);
  const completedValue = completedJobs.reduce((sum: number, job: any) => sum + (job.value || 0), 0);

  // Calculate conversion rates
  const enquiryToQuoteRate = enquiries.length > 0 ? (quotes.length / enquiries.length) * 100 : 0;
  const quoteToJobRate = quotes.length > 0 ? (approvedJobs.length / quotes.length) * 100 : 0;
  const jobCompletionRate = approvedJobs.length > 0 ? (completedJobs.length / approvedJobs.length) * 100 : 0;

  // Calculate P&L metrics (simplified)
  const totalRevenue = completedValue;
  const estimatedMaterialCosts = totalRevenue * 0.35; // 35% materials
  const estimatedLaborCosts = totalRevenue * 0.25; // 25% labor
  const estimatedOverheadCosts = totalRevenue * 0.15; // 15% overhead
  const totalCosts = estimatedMaterialCosts + estimatedLaborCosts + estimatedOverheadCosts;
  const grossProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Calculate labor efficiency (simplified)
  const fabricationHours = fabricationJobs.length * 40; // Estimate 40 hours per fabrication job
  const installationHours = installationJobs.length * 16; // Estimate 16 hours per installation
  const totalLaborHours = fabricationHours + installationHours;
  const laborCostPerHour = totalLaborHours > 0 ? estimatedLaborCosts / totalLaborHours : 0;
  const fabricationEfficiency = fabricationJobs.length > 0 ? 85 : 0; // Mock efficiency
  const installationEfficiency = installationJobs.length > 0 ? 90 : 0; // Mock efficiency

  return {
    snapshotDate: now,
    periodType: period.toUpperCase() as any,
    enquiriesCount: enquiries.length,
    quotesCount: quotes.length,
    approvedJobsCount: approvedJobs.length,
    fabricationCount: fabricationJobs.length,
    installationCount: installationJobs.length,
    completedCount: completedJobs.length,
    enquiriesValue,
    quotesValue,
    approvedJobsValue,
    fabricationValue,
    installationValue,
    completedValue,
    enquiryToQuoteRate,
    quoteToJobRate,
    jobCompletionRate,
    totalRevenue,
    totalCosts,
    grossProfit,
    profitMargin,
    laborCosts: estimatedLaborCosts,
    materialCosts: estimatedMaterialCosts,
    overheadCosts: estimatedOverheadCosts,
    laborHours: totalLaborHours,
    fabricationHours,
    installationHours,
    laborCostPerHour,
    fabricationEfficiency,
    installationEfficiency
  };
}

// Generate dashboard metrics
async function generateDashboardMetrics() {
  const now = new Date();
  const metrics = [];

  // Pipeline counts for different periods
  const periods = [
    { type: 'DAILY', days: 1 },
    { type: 'WEEKLY', days: 7 },
    { type: 'MONTHLY', days: 30 },
    { type: 'QUARTERLY', days: 90 }
  ];

  for (const period of periods) {
    const startDate = new Date(now.getTime() - period.days * 24 * 60 * 60 * 1000);
    
    const [enquiryCount, quoteCount, jobCount] = await Promise.all([
      prisma.enquiry.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.quote.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.job.count({
        where: { createdAt: { gte: startDate } }
      })
    ]);

    metrics.push({
      metricType: 'PIPELINE_COUNT' as any,
      dailyValue: period.type === 'DAILY' ? enquiryCount + quoteCount + jobCount : null,
      weeklyValue: period.type === 'WEEKLY' ? enquiryCount + quoteCount + jobCount : null,
      monthlyValue: period.type === 'MONTHLY' ? enquiryCount + quoteCount + jobCount : null,
      quarterlyValue: period.type === 'QUARTERLY' ? enquiryCount + quoteCount + jobCount : null,
      breakdownData: {
        enquiries: enquiryCount,
        quotes: quoteCount,
        jobs: jobCount,
        period: period.type
      }
    });
  }

  return metrics;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { period = 'daily', startDate, endDate, includeBreakdown = true } = body as PipelineAnalyticsRequest;

    // Generate pipeline snapshot
    const snapshot = await generatePipelineSnapshot(period);

    // Save snapshot to database
    const savedSnapshot = await prisma.productionPipelineSnapshot.create({
      data: snapshot
    });

    // Generate dashboard metrics if requested
    let dashboardMetrics = null;
    if (includeBreakdown) {
      const metrics = await generateDashboardMetrics();
      
      // Save metrics to database
      for (const metric of metrics) {
        await prisma.dashboardMetrics.create({
          data: metric
        });
      }
      
      dashboardMetrics = metrics;
    }

    return NextResponse.json({
      success: true,
      snapshot: savedSnapshot,
      metrics: dashboardMetrics,
      message: 'Production pipeline analytics generated successfully'
    });

  } catch (error) {
    console.error('Production Pipeline Analytics Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to generate production pipeline analytics',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily';
    const includeHistory = searchParams.get('includeHistory') === 'true';

    // Get current snapshot
    const currentSnapshot = await generatePipelineSnapshot(period);

    // Get historical data if requested
    let historicalData = null;
    if (includeHistory) {
      const historicalSnapshots = await prisma.productionPipelineSnapshot.findMany({
        where: {
          periodType: period.toUpperCase() as any,
          snapshotDate: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        orderBy: { snapshotDate: 'desc' },
        take: 30
      });

      historicalData = historicalSnapshots;
    }

    // Get recent metrics
    const recentMetrics = await prisma.dashboardMetrics.findMany({
      where: {
        metricDate: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      orderBy: { metricDate: 'desc' },
      take: 20
    });

    // Calculate trends
    const trends = {
      enquiryTrend: historicalData && historicalData.length > 1 
        ? ((historicalData[0].enquiriesCount - historicalData[1].enquiriesCount) / historicalData[1].enquiriesCount) * 100
        : 0,
      quoteTrend: historicalData && historicalData.length > 1
        ? ((historicalData[0].quotesCount - historicalData[1].quotesCount) / historicalData[1].quotesCount) * 100
        : 0,
      revenueTrend: historicalData && historicalData.length > 1
        ? ((historicalData[0].totalRevenue - historicalData[1].totalRevenue) / historicalData[1].totalRevenue) * 100
        : 0
    };

    return NextResponse.json({
      success: true,
      current: currentSnapshot,
      historical: historicalData,
      metrics: recentMetrics,
      trends,
      period
    });

  } catch (error) {
    console.error('Production Pipeline Fetch Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch production pipeline data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
