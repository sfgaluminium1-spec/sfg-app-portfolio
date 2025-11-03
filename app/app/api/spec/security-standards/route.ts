
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (search) {
      where.OR = [
        { standardCode: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const standards = await prisma.securityStandard.findMany({
      where,
      include: {
        _count: {
          select: {
            specifications: true,
            complianceRecords: true
          }
        }
      },
      orderBy: {
        standardCode: 'asc'
      }
    });

    return NextResponse.json(standards);
  } catch (error) {
    console.error('Error fetching security standards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security standards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const standard = await prisma.securityStandard.create({
      data: {
        standardCode: data.standardCode,
        name: data.name,
        description: data.description,
        category: data.category,
        requirements: data.requirements || {},
        testMethods: data.testMethods || [],
        certificationBody: data.certificationBody,
        securityLevels: data.securityLevels || {},
        minimumRating: data.minimumRating,
        version: data.version,
        effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        isActive: data.isActive !== false
      }
    });

    return NextResponse.json(standard, { status: 201 });
  } catch (error) {
    console.error('Error creating security standard:', error);
    return NextResponse.json(
      { error: 'Failed to create security standard' },
      { status: 500 }
    );
  }
}
