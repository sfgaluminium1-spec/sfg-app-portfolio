
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [drawdowns, total] = await Promise.all([
      prisma.financeDrawdown.findMany({
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
              },
              job: {
                select: {
                  id: true,
                  jobNumber: true,
                  description: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.financeDrawdown.count({ where })
    ]);

    // Calculate summary
    const summary = await prisma.financeDrawdown.aggregate({
      where,
      _sum: {
        drawdownAmount: true,
        feesAmount: true,
        netDrawdown: true
      },
      _count: true
    });

    return NextResponse.json({
      drawdowns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalDrawdowns: summary._count,
        totalDrawdownAmount: summary._sum.drawdownAmount || 0,
        totalFees: summary._sum.feesAmount || 0,
        totalNetDrawdown: summary._sum.netDrawdown || 0
      }
    });

  } catch (error) {
    console.error('Error fetching drawdowns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drawdowns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate invoice exists and is eligible
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
      include: { financeDrawdown: true }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    if (!invoice.invoiceFinanceEligible) {
      return NextResponse.json(
        { error: 'Invoice is not eligible for finance drawdown' },
        { status: 400 }
      );
    }

    if (invoice.financeDrawdown) {
      return NextResponse.json(
        { error: 'Drawdown already exists for this invoice' },
        { status: 400 }
      );
    }

    // Get finance settings
    const settings = await prisma.financeSettings.findFirst();
    const drawdownRate = settings?.defaultDrawdownRate || 80.0;
    const feesRate = settings?.financeFeesRate || 3.967;

    // Calculate drawdown amounts
    const eligibleAmount = invoice.totalAmount;
    const drawdownAmount = eligibleAmount * (drawdownRate / 100);
    const feesAmount = drawdownAmount * (feesRate / 100);
    const netDrawdown = drawdownAmount - feesAmount;

    const drawdown = await prisma.financeDrawdown.create({
      data: {
        invoiceId: data.invoiceId,
        eligibleAmount,
        drawdownPercentage: drawdownRate,
        drawdownAmount,
        feesRate,
        feesAmount,
        netDrawdown,
        documentsSubmitted: data.documentsSubmitted || false,
        invoiceCopySubmitted: data.invoiceCopySubmitted || false,
        deliveryProofSubmitted: data.deliveryProofSubmitted || false,
        processingNotes: data.processingNotes
      },
      include: {
        invoice: {
          include: {
            customer: true,
            job: true
          }
        }
      }
    });

    return NextResponse.json(drawdown, { status: 201 });

  } catch (error) {
    console.error('Error creating drawdown:', error);
    return NextResponse.json(
      { error: 'Failed to create drawdown' },
      { status: 500 }
    );
  }
}
