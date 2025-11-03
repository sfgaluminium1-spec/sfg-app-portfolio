
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id: id },
      include: {
        customer: true,
        job: {
          include: {
            quote: {
              include: {
                lineItems: true
              }
            }
          }
        },
        quote: {
          include: {
            lineItems: true
          }
        },
        deliveryTemplate: true,
        financeDrawdown: true,
        paymentReminders: {
          orderBy: { createdAt: 'desc' }
        },
        complianceRecords: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);

  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const invoice = await prisma.invoice.update({
      where: { id: id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        customer: true,
        job: true,
        quote: true,
        financeDrawdown: true
      }
    });

    return NextResponse.json(invoice);

  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.invoice.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Invoice deleted successfully' });

  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
