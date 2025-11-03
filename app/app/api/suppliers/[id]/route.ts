
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplier = await prisma.supplier.findUnique({
      where: { id: id },
      include: {
        supplierOrders: {
          include: {
            job: true,
            orderItems: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json({ supplier });
  } catch (error) {
    console.error('Supplier API error:', error);
    return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const supplier = await prisma.supplier.update({
      where: { id: id },
      data: {
        name: body.name,
        companyName: body.companyName,
        contactPerson: body.contactPerson,
        email: body.email,
        phone: body.phone,
        website: body.website,
        address: body.address,
        city: body.city,
        postcode: body.postcode,
        country: body.country,
        vatNumber: body.vatNumber,
        companyNumber: body.companyNumber,
        categories: body.categories,
        specializations: body.specializations,
        certifications: body.certifications,
        performanceRating: body.performanceRating ? parseFloat(body.performanceRating) : undefined,
        deliveryRating: body.deliveryRating ? parseFloat(body.deliveryRating) : undefined,
        qualityRating: body.qualityRating ? parseFloat(body.qualityRating) : undefined,
        priceRating: body.priceRating ? parseFloat(body.priceRating) : undefined,
        paymentTerms: body.paymentTerms,
        deliveryTerms: body.deliveryTerms,
        minimumOrder: body.minimumOrder ? parseFloat(body.minimumOrder) : undefined,
        isActive: body.isActive,
        isPreferred: body.isPreferred
      }
    });

    return NextResponse.json({ supplier });
  } catch (error) {
    console.error('Update supplier error:', error);
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.supplier.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 });
  }
}
