
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');
    const period = searchParams.get('period');

    if (reportType === 'dashboard_summary') {
      // Generate dashboard summary data
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      // Invoice statistics
      const invoiceStats = await prisma.invoice.aggregate({
        _sum: {
          totalAmount: true,
          paidAmount: true,
          drawdownAmount: true,
          financeFeesAmount: true
        },
        _count: true
      });

      const monthlyInvoices = await prisma.invoice.aggregate({
        where: {
          invoiceDate: {
            gte: startOfMonth
          }
        },
        _sum: {
          totalAmount: true,
          paidAmount: true
        },
        _count: true
      });

      // Payment status breakdown
      const paymentStatusBreakdown = await prisma.invoice.groupBy({
        by: ['paymentStatus'],
        _count: true,
        _sum: {
          totalAmount: true
        }
      });

      // Customer type breakdown
      const customerTypeBreakdown = await prisma.invoice.groupBy({
        by: ['customerType'],
        _count: true,
        _sum: {
          totalAmount: true,
          drawdownAmount: true
        }
      });

      // Drawdown statistics
      const drawdownStats = await prisma.financeDrawdown.aggregate({
        _sum: {
          drawdownAmount: true,
          feesAmount: true,
          netDrawdown: true
        },
        _count: true
      });

      const pendingDrawdowns = await prisma.financeDrawdown.count({
        where: {
          status: 'PENDING'
        }
      });

      // Compliance statistics
      const complianceStats = await prisma.complianceRecord.groupBy({
        by: ['status'],
        _count: true
      });

      const upcomingDeadlines = await prisma.complianceRecord.count({
        where: {
          submitted: false,
          submissionDeadline: {
            gte: now,
            lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
          }
        }
      });

      // Recent activity
      const recentInvoices = await prisma.invoice.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
              company: true
            }
          }
        }
      });

      const recentDeliveries = await prisma.deliveryTemplate.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
              company: true
            }
          }
        }
      });

      return NextResponse.json({
        invoiceStats: {
          total: invoiceStats._count,
          totalValue: invoiceStats._sum.totalAmount || 0,
          totalPaid: invoiceStats._sum.paidAmount || 0,
          totalDrawdowns: invoiceStats._sum.drawdownAmount || 0,
          totalFees: invoiceStats._sum.financeFeesAmount || 0,
          monthlyCount: monthlyInvoices._count,
          monthlyValue: monthlyInvoices._sum.totalAmount || 0,
          monthlyPaid: monthlyInvoices._sum.paidAmount || 0
        },
        paymentStatusBreakdown,
        customerTypeBreakdown,
        drawdownStats: {
          total: drawdownStats._count,
          totalDrawdowns: drawdownStats._sum.drawdownAmount || 0,
          totalFees: drawdownStats._sum.feesAmount || 0,
          totalNet: drawdownStats._sum.netDrawdown || 0,
          pending: pendingDrawdowns
        },
        complianceStats,
        upcomingDeadlines,
        recentActivity: {
          invoices: recentInvoices,
          deliveries: recentDeliveries
        }
      });
    }

    // Get existing reports
    const where: any = {};
    
    if (reportType) {
      where.reportType = reportType;
    }
    
    if (period) {
      where.period = period;
    }

    const reports = await prisma.financeReport.findMany({
      where,
      orderBy: { generatedDate: 'desc' },
      take: 20
    });

    return NextResponse.json({ reports });

  } catch (error) {
    console.error('Error fetching finance reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finance reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Generate specific report
    const { reportType, period, startDate, endDate } = data;

    let reportData = {};
    let summary = {};

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    switch (reportType) {
      case 'CASH_FLOW':
        const cashFlowData = await prisma.invoice.findMany({
          where: {
            invoiceDate: {
              gte: start,
              lte: end
            }
          },
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
                company: true
              }
            },
            financeDrawdown: true
          },
          orderBy: { invoiceDate: 'asc' }
        });

        const cashFlowSummary = await prisma.invoice.aggregate({
          where: {
            invoiceDate: {
              gte: start,
              lte: end
            }
          },
          _sum: {
            totalAmount: true,
            paidAmount: true,
            drawdownAmount: true
          }
        });

        reportData = { invoices: cashFlowData };
        summary = {
          totalInvoiced: cashFlowSummary._sum.totalAmount || 0,
          totalPaid: cashFlowSummary._sum.paidAmount || 0,
          totalDrawdowns: cashFlowSummary._sum.drawdownAmount || 0,
          outstanding: (cashFlowSummary._sum.totalAmount || 0) - (cashFlowSummary._sum.paidAmount || 0)
        };
        break;

      case 'DRAWDOWN_ANALYSIS':
        const drawdownData = await prisma.financeDrawdown.findMany({
          where: {
            requestedDate: {
              gte: start,
              lte: end
            }
          },
          include: {
            invoice: {
              include: {
                customer: {
                  select: {
                    firstName: true,
                    lastName: true,
                    company: true
                  }
                }
              }
            }
          },
          orderBy: { requestedDate: 'asc' }
        });

        const drawdownSummary = await prisma.financeDrawdown.aggregate({
          where: {
            requestedDate: {
              gte: start,
              lte: end
            }
          },
          _sum: {
            drawdownAmount: true,
            feesAmount: true,
            netDrawdown: true
          },
          _count: true
        });

        reportData = { drawdowns: drawdownData };
        summary = {
          totalDrawdowns: drawdownSummary._count,
          totalAmount: drawdownSummary._sum.drawdownAmount || 0,
          totalFees: drawdownSummary._sum.feesAmount || 0,
          totalNet: drawdownSummary._sum.netDrawdown || 0
        };
        break;

      case 'COMPLIANCE_REPORT':
        const complianceData = await prisma.complianceRecord.findMany({
          where: {
            submissionDeadline: {
              gte: start,
              lte: end
            }
          },
          include: {
            invoice: {
              include: {
                customer: {
                  select: {
                    firstName: true,
                    lastName: true,
                    company: true
                  }
                }
              }
            }
          },
          orderBy: { submissionDeadline: 'asc' }
        });

        const complianceSummary = await prisma.complianceRecord.groupBy({
          where: {
            submissionDeadline: {
              gte: start,
              lte: end
            }
          },
          by: ['status', 'complianceType'],
          _count: true,
          _sum: {
            vatAmount: true,
            cisDeduction: true
          }
        });

        reportData = { compliance: complianceData };
        summary = { breakdown: complianceSummary };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }

    // Save report
    const report = await prisma.financeReport.create({
      data: {
        reportType,
        period: period || `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`,
        reportData,
        summary,
        totalInvoices: reportType === 'CASH_FLOW' ? (reportData as any).invoices?.length : undefined,
        totalValue: (summary as any).totalInvoiced || (summary as any).totalAmount,
        totalDrawdowns: (summary as any).totalDrawdowns || (summary as any).totalAmount,
        totalFees: (summary as any).totalFees
      }
    });

    return NextResponse.json(report, { status: 201 });

  } catch (error) {
    console.error('Error generating finance report:', error);
    return NextResponse.json(
      { error: 'Failed to generate finance report' },
      { status: 500 }
    );
  }
}
