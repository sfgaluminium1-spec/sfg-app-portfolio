
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');
    const complianceType = searchParams.get('type');

    const where: any = {};

    if (period) {
      where.period = period;
    }

    if (complianceType) {
      where.complianceType = complianceType;
    }

    const records = await prisma.complianceRecord.findMany({
      where,
      include: {
        invoice: {
          include: {
            customer: {
              select: {
                id: true,
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

    // Get upcoming deadlines
    const upcomingDeadlines = await prisma.complianceRecord.findMany({
      where: {
        submitted: false,
        submissionDeadline: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
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

    // Calculate compliance statistics
    const stats = await prisma.complianceRecord.groupBy({
      by: ['complianceType', 'status'],
      _count: true
    });

    const complianceStats = {
      VAT_MONTHLY: { pending: 0, submitted: 0, overdue: 0 },
      VAT_QUARTERLY: { pending: 0, submitted: 0, overdue: 0 },
      CIS_MONTHLY: { pending: 0, submitted: 0, overdue: 0 },
      ANNUAL_RETURN: { pending: 0, submitted: 0, overdue: 0 }
    };

    stats.forEach((stat: any) => {
      if (complianceStats[stat.complianceType as keyof typeof complianceStats]) {
        const statusKey = stat.status.toLowerCase() as keyof typeof complianceStats.VAT_MONTHLY;
        (complianceStats[stat.complianceType as keyof typeof complianceStats] as any)[statusKey] = stat._count;
      }
    });

    return NextResponse.json({
      records,
      upcomingDeadlines,
      complianceStats
    });

  } catch (error) {
    console.error('Error fetching compliance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (data.action === 'generate_period_records') {
      // Generate compliance records for a specific period
      const { period, year, month } = data;
      
      // Get all invoices for the period
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const invoices = await prisma.invoice.findMany({
        where: {
          invoiceDate: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      // Get finance settings for deadlines
      const settings = await prisma.financeSettings.findFirst();
      const vatDay = settings?.vatSubmissionDay || 7;
      const cisDay = settings?.cisSubmissionDay || 19;

      const records = [];

      for (const invoice of invoices) {
        // Create VAT record if applicable
        if (invoice.vatAmount > 0) {
          const vatDeadline = new Date(year, month, vatDay);
          
          const vatRecord = await prisma.complianceRecord.create({
            data: {
              invoiceId: invoice.id,
              complianceType: 'VAT_MONTHLY',
              period: `${year}-${String(month).padStart(2, '0')}`,
              submissionDeadline: vatDeadline,
              vatReturn: true,
              vatAmount: invoice.vatAmount
            }
          });
          records.push(vatRecord);
        }

        // Create CIS record if applicable
        if (invoice.cisDeduction > 0) {
          const cisDeadline = new Date(year, month, cisDay);
          
          const cisRecord = await prisma.complianceRecord.create({
            data: {
              invoiceId: invoice.id,
              complianceType: 'CIS_MONTHLY',
              period: `${year}-${String(month).padStart(2, '0')}`,
              submissionDeadline: cisDeadline,
              cisReturn: true,
              cisDeduction: invoice.cisDeduction
            }
          });
          records.push(cisRecord);
        }
      }

      return NextResponse.json({
        message: `Generated ${records.length} compliance records for ${period}`,
        records
      });
    }

    // Create individual compliance record
    const record = await prisma.complianceRecord.create({
      data: {
        invoiceId: data.invoiceId,
        complianceType: data.complianceType,
        period: data.period,
        submissionDeadline: new Date(data.submissionDeadline),
        vatReturn: data.vatReturn || false,
        cisReturn: data.cisReturn || false,
        vatAmount: data.vatAmount,
        cisDeduction: data.cisDeduction,
        notes: data.notes
      },
      include: {
        invoice: {
          include: {
            customer: true
          }
        }
      }
    });

    return NextResponse.json(record, { status: 201 });

  } catch (error) {
    console.error('Error creating compliance record:', error);
    return NextResponse.json(
      { error: 'Failed to create compliance record' },
      { status: 500 }
    );
  }
}
