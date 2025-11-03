
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCustomerFromToken(token: string) {
  const session = await prisma.customerSession.findUnique({
    where: { token },
    include: { customer: true }
  });

  if (!session || session.expiresAt < new Date() || !session.customer.isActive) {
    return null;
  }

  return session.customer;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const customer = await getCustomerFromToken(token);
    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = { customerId: customer.id };
    if (status) {
      where.status = status;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        quote: true,
        schedules: {
          include: {
            team: true,
            van: true
          },
          orderBy: { scheduledDate: 'desc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        documents: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Jobs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
