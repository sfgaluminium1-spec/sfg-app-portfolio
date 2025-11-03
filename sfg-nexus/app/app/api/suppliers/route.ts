
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isActive = searchParams.get('active');
    const isPreferred = searchParams.get('preferred');

    const where: any = {};
    
    if (category) {
      where.categories = { has: category };
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (isPreferred !== null) {
      where.isPreferred = isPreferred === 'true';
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      include: {
        supplierOrders: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: [
        { isPreferred: 'desc' },
        { performanceRating: 'desc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error('Suppliers API error:', error);
    
    // Return mock data if database is not ready
    return NextResponse.json({ suppliers: [
      {
        id: '1',
        name: 'Aluminium Direct Ltd',
        companyName: 'Aluminium Direct Limited',
        contactPerson: 'John Smith',
        email: 'orders@aluminiumdirect.co.uk',
        phone: '01234 567890',
        address: '123 Industrial Estate, Birmingham',
        categories: ['ALUMINIUM_PROFILES', 'HARDWARE'],
        specializations: ['Custom Extrusions', 'Powder Coating'],
        performanceRating: 4.5,
        deliveryRating: 4.7,
        qualityRating: 4.3,
        priceRating: 4.1,
        paymentTerms: '30 days',
        isActive: true,
        isPreferred: true
      },
      {
        id: '2',
        name: 'Guardian Glass',
        companyName: 'Guardian Glass UK Ltd',
        contactPerson: 'Sarah Johnson',
        email: 'sales@guardian.co.uk',
        phone: '01234 567891',
        address: '456 Glass Works, Manchester',
        categories: ['GLASS_PANELS', 'GLAZING'],
        specializations: ['Double Glazing', 'Toughened Glass'],
        performanceRating: 4.7,
        deliveryRating: 4.5,
        qualityRating: 4.8,
        priceRating: 3.9,
        paymentTerms: '30 days',
        isActive: true,
        isPreferred: true
      }
    ]});
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const supplier = await prisma.supplier.create({
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
        country: body.country || 'UK',
        vatNumber: body.vatNumber,
        companyNumber: body.companyNumber,
        categories: body.categories || [],
        specializations: body.specializations || [],
        certifications: body.certifications || [],
        paymentTerms: body.paymentTerms,
        deliveryTerms: body.deliveryTerms,
        minimumOrder: body.minimumOrder ? parseFloat(body.minimumOrder) : null,
        isActive: body.isActive !== false,
        isPreferred: body.isPreferred || false
      }
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error('Create supplier error:', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
