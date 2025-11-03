
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
    const customerType = searchParams.get('customerType');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.paymentStatus = status;
    }

    if (customerType) {
      where.customerType = customerType;
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { firstName: { contains: search, mode: 'insensitive' } } },
        { customer: { lastName: { contains: search, mode: 'insensitive' } } },
        { customer: { company: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              company: true,
              email: true,
              phone: true
            }
          },
          job: {
            select: {
              id: true,
              jobNumber: true,
              description: true
            }
          },
          quote: {
            select: {
              id: true,
              quoteNumber: true,
              projectName: true
            }
          },
          financeDrawdown: true,
          paymentReminders: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.invoice.count({ where })
    ]);

    // Calculate summary statistics
    const summary = await prisma.invoice.aggregate({
      where,
      _sum: {
        totalAmount: true,
        paidAmount: true,
        drawdownAmount: true,
        financeFeesAmount: true
      },
      _count: true
    });

    const overdue = await prisma.invoice.count({
      where: {
        ...where,
        paymentStatus: 'OVERDUE'
      }
    });

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalInvoices: summary._count,
        totalValue: summary._sum.totalAmount || 0,
        totalPaid: summary._sum.paidAmount || 0,
        totalDrawdowns: summary._sum.drawdownAmount || 0,
        totalFees: summary._sum.financeFeesAmount || 0,
        overdueCount: overdue
      }
    });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true }
    });

    let invoiceNumber = 'INV-001';
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
      invoiceNumber = `INV-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Get customer to determine finance eligibility
    const customer = await prisma.customer.findUnique({
      where: { id: data.customerId }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Determine customer finance type based on customer data
    let customerType: 'TYPE_1' | 'TYPE_2' | 'TYPE_3' | 'TYPE_4' = 'TYPE_4'; // Default to no eligibility
    if (customer.creditStatus === 'GOOD' && customer.customerType === 'REPEAT_CUSTOMER') {
      customerType = 'TYPE_1';
    } else if (customer.creditStatus === 'GOOD' && customer.customerType === 'ACTIVE_CUSTOMER') {
      customerType = 'TYPE_2';
    } else if (customer.customerType === 'ACTIVE_CUSTOMER') {
      customerType = 'TYPE_3';
    }

    // Calculate finance eligibility
    const financeSettings = await prisma.financeSettings.findFirst();
    const settings = financeSettings || {
      defaultDrawdownRate: 80.0,
      financeFeesRate: 3.967,
      minimumInvoiceAmount: 500.0,
      type1Eligible: true,
      type2Eligible: true,
      type3Eligible: false,
      type4Eligible: false
    };

    const isEligible = (
      data.totalAmount >= settings.minimumInvoiceAmount &&
      (
        (customerType === 'TYPE_1' && settings.type1Eligible) ||
        (customerType === 'TYPE_2' && settings.type2Eligible) ||
        (customerType === 'TYPE_3' && settings.type3Eligible) ||
        (customerType === 'TYPE_4' && settings.type4Eligible)
      )
    );

    const drawdownAmount = isEligible ? (data.totalAmount * settings.defaultDrawdownRate / 100) : null;
    const financeFeesAmount = drawdownAmount ? (drawdownAmount * settings.financeFeesRate / 100) : null;

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId: data.customerId,
        customerType,
        jobId: data.jobId,
        quoteId: data.quoteId,
        dueDate: data.dueDate,
        subtotal: data.subtotal,
        vatAmount: data.vatAmount || 0,
        cisDeduction: data.cisDeduction || 0,
        totalAmount: data.totalAmount,
        invoiceFinanceEligible: isEligible,
        drawdownAmount,
        financeFeesAmount,
        vatStatus: data.vatStatus || 'STANDARD_RATE',
        cisStatus: data.cisStatus || 'NOT_APPLICABLE',
        reverseCharge: data.reverseCharge || false
      },
      include: {
        customer: true,
        job: true,
        quote: true
      }
    });

    // Create finance drawdown if eligible
    if (isEligible && drawdownAmount && financeFeesAmount) {
      await prisma.financeDrawdown.create({
        data: {
          invoiceId: invoice.id,
          eligibleAmount: data.totalAmount,
          drawdownPercentage: settings.defaultDrawdownRate,
          drawdownAmount,
          feesRate: settings.financeFeesRate,
          feesAmount: financeFeesAmount,
          netDrawdown: drawdownAmount - financeFeesAmount
        }
      });
    }

    return NextResponse.json(invoice, { status: 201 });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
