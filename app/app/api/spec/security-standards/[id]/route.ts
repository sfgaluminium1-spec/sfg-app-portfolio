
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const standard = await prisma.securityStandard.findUnique({
      where: { id: id },
      include: {
        specifications: {
          include: {
            customer: true,
            quote: true,
            job: true
          },
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        },
        complianceRecords: {
          include: {
            specification: {
              include: {
                customer: true
              }
            }
          },
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            specifications: true,
            complianceRecords: true
          }
        }
      }
    });

    if (!standard) {
      return NextResponse.json(
        { error: 'Security standard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(standard);
  } catch (error) {
    console.error('Error fetching security standard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security standard' },
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
    
    const standard = await prisma.securityStandard.update({
      where: { id: id },
      data: {
        standardCode: data.standardCode,
        name: data.name,
        description: data.description,
        category: data.category,
        requirements: data.requirements,
        testMethods: data.testMethods,
        certificationBody: data.certificationBody,
        securityLevels: data.securityLevels,
        minimumRating: data.minimumRating,
        version: data.version,
        effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        isActive: data.isActive
      }
    });

    return NextResponse.json(standard);
  } catch (error) {
    console.error('Error updating security standard:', error);
    return NextResponse.json(
      { error: 'Failed to update security standard' },
      { status: 500 }
    );
  }
}
