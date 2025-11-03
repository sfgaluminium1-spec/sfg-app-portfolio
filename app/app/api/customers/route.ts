
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/customers - Get all customers with filtering and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { accountNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.customerStatus = status;
    }

    if (type) {
      where.customerType = type;
    }

    // Get total count for pagination
    const totalCount = await prisma.customer.count({ where });

    // Get customers with pagination
    const customers = await prisma.customer.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        enquiries: {
          select: { id: true, enquiryNumber: true, status: true, createdAt: true }
        },
        quotes: {
          select: { id: true, quoteNumber: true, status: true, value: true, createdAt: true }
        },
        jobs: {
          select: { id: true, jobNumber: true, status: true, value: true, createdAt: true }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { 
            id: true, 
            activityType: true, 
            description: true, 
            createdAt: true,
            performedBy: true
          }
        },
        validation: true
      }
    });

    // Calculate data completeness for each customer
    const customersWithMetrics = customers.map((customer: any) => {
      const completeness = calculateDataCompleteness(customer);
      return {
        ...customer,
        dataCompleteness: completeness,
        totalEnquiries: customer.enquiries.length,
        totalQuotes: customer.quotes.length,
        totalJobs: customer.jobs.length,
        totalValue: customer.quotes.reduce((sum: number, quote: any) => sum + (quote.value || 0), 0),
        lastActivity: customer.activities[0]?.createdAt || customer.createdAt
      };
    });

    return NextResponse.json({
      customers: customersWithMetrics,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.firstName && !data.contactName) {
      return NextResponse.json(
        { error: 'Either firstName or contactName is required' },
        { status: 400 }
      );
    }

    // Check for existing customer by email
    if (data.email) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { email: data.email }
      });
      
      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Customer with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Calculate data completeness
    const completeness = calculateDataCompleteness(data);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        ...data,
        dataCompleteness: completeness,
        importSource: data.importSource || 'MANUAL',
        importDate: data.importSource ? new Date() : undefined
      },
      include: {
        enquiries: true,
        quotes: true,
        jobs: true,
        activities: true,
        validation: true
      }
    });

    // Create initial activity
    await prisma.customerActivity.create({
      data: {
        customerId: customer.id,
        activityType: 'CUSTOMER_CREATED',
        description: `Customer created: ${customer.firstName} ${customer.lastName || ''}`.trim(),
        performedBy: data.createdBy || 'System',
        source: 'SYSTEM'
      }
    });

    // Create validation record
    await prisma.customerValidation.create({
      data: {
        customerId: customer.id,
        emailValidation: data.email ? 'PENDING' : 'SKIPPED',
        phoneValidation: data.phone ? 'PENDING' : 'SKIPPED',
        addressValidation: data.address ? 'PENDING' : 'SKIPPED',
        businessValidation: data.company ? 'PENDING' : 'SKIPPED'
      }
    });

    return NextResponse.json(customer, { status: 201 });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

// Helper function to calculate data completeness
function calculateDataCompleteness(customer: any): number {
  const fields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'company',
    'address',
    'website'
  ];
  
  const completedFields = fields.filter((field: any) => 
    customer[field] && customer[field].toString().trim().length > 0
  ).length;
  
  return Math.round((completedFields / fields.length) * 100);
}
