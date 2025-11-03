
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/customers/[id] - Get customer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        enquiries: {
          orderBy: { createdAt: 'desc' },
          include: {
            quotes: {
              select: { id: true, quoteNumber: true, status: true, value: true }
            }
          }
        },
        quotes: {
          orderBy: { createdAt: 'desc' },
          include: {
            jobs: {
              select: { id: true, jobNumber: true, status: true }
            }
          }
        },
        jobs: {
          orderBy: { createdAt: 'desc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        validation: true,
        behaviors: true
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Calculate metrics
    const metrics = {
      totalEnquiries: customer.enquiries.length,
      totalQuotes: customer.quotes.length,
      totalJobs: customer.jobs.length,
      totalValue: customer.quotes.reduce((sum: number, quote: any) => sum + (quote.value || 0), 0),
      averageQuoteValue: customer.quotes.length > 0 
        ? customer.quotes.reduce((sum: number, quote: any) => sum + (quote.value || 0), 0) / customer.quotes.length 
        : 0,
      conversionRate: customer.enquiries.length > 0 
        ? (customer.quotes.filter((q: any) => q.status === 'WON').length / customer.enquiries.length) * 100 
        : 0,
      lastActivity: customer.activities[0]?.createdAt || customer.createdAt,
      dataCompleteness: calculateDataCompleteness(customer)
    };

    return NextResponse.json({
      ...customer,
      metrics
    });

  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check for email conflicts (if email is being changed)
    if (data.email && data.email !== existingCustomer.email) {
      const emailConflict = await prisma.customer.findUnique({
        where: { email: data.email }
      });
      
      if (emailConflict) {
        return NextResponse.json(
          { error: 'Customer with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Calculate data completeness
    const completeness = calculateDataCompleteness({ ...existingCustomer, ...data });

    // Update customer
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...data,
        dataCompleteness: completeness
      },
      include: {
        enquiries: true,
        quotes: true,
        jobs: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        validation: true
      }
    });

    // Create activity for update
    await prisma.customerActivity.create({
      data: {
        customerId: customer.id,
        activityType: 'CUSTOMER_UPDATED',
        description: `Customer information updated`,
        performedBy: data.updatedBy || 'System',
        source: 'USER',
        details: {
          updatedFields: Object.keys(data).filter((key: any) => key !== 'updatedBy')
        }
      }
    });

    return NextResponse.json(customer);

  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Delete customer (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        isActive: false,
        customerStatus: 'INACTIVE'
      }
    });

    // Create activity for deletion
    await prisma.customerActivity.create({
      data: {
        customerId: customer.id,
        activityType: 'STATUS_CHANGED',
        description: 'Customer deactivated',
        performedBy: 'System',
        source: 'SYSTEM'
      }
    });

    return NextResponse.json({ message: 'Customer deactivated successfully' });

  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
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
