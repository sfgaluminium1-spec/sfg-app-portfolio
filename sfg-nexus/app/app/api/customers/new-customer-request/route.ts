
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/customers/new-customer-request - Get all new customer requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const requests = await prisma.newCustomerRequest.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit
    });

    const totalCount = await prisma.newCustomerRequest.count({ where });

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching new customer requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new customer requests' },
      { status: 500 }
    );
  }
}

// POST /api/customers/new-customer-request - Create new customer request
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Check if request already exists for this customer
    const existingRequest = await prisma.newCustomerRequest.findFirst({
      where: {
        customerName: data.customerName,
        status: {
          in: ['PENDING', 'EMAIL_SENT', 'AWAITING_RESPONSE', 'UNDER_REVIEW']
        }
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Active request already exists for this customer' },
        { status: 409 }
      );
    }

    const request_record = await prisma.newCustomerRequest.create({
      data: {
        ...data,
        status: 'PENDING'
      }
    });

    return NextResponse.json(request_record, { status: 201 });

  } catch (error) {
    console.error('Error creating new customer request:', error);
    return NextResponse.json(
      { error: 'Failed to create new customer request' },
      { status: 500 }
    );
  }
}
