
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

    // Get customer's enquiries, jobs, and quotes
    const [enquiries, jobs, quotes] = await Promise.all([
      prisma.enquiry.findMany({
        where: { customerId: customer.id },
        include: { activities: { take: 3, orderBy: { createdAt: 'desc' } } },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.job.findMany({
        where: { customerId: customer.id },
        include: { schedules: { take: 1, orderBy: { scheduledDate: 'desc' } } },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.quote.findMany({
        where: { customerId: customer.id },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Calculate stats
    const stats = {
      totalEnquiries: enquiries.length,
      activeJobs: jobs.filter((job: any) => ['APPROVED', 'IN_PRODUCTION', 'FABRICATION', 'ASSEMBLY', 'READY_FOR_INSTALL', 'INSTALLING'].includes(job.status)).length,
      completedJobs: jobs.filter((job: any) => job.status === 'COMPLETED').length,
      totalQuoteValue: quotes.reduce((sum: number, quote: any) => sum + quote.value, 0),
      pendingQuotes: quotes.filter((quote: any) => quote.status === 'PENDING').length
    };

    return NextResponse.json({
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        company: customer.company
      },
      stats,
      recentEnquiries: enquiries,
      recentJobs: jobs,
      recentQuotes: quotes
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
