
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specificationId = searchParams.get('specificationId');
    const standardId = searchParams.get('standardId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    
    if (specificationId) {
      where.specificationId = specificationId;
    }
    
    if (standardId) {
      where.standardId = standardId;
    }
    
    if (status) {
      where.status = status;
    }

    const [complianceRecords, total] = await Promise.all([
      prisma.securityCompliance.findMany({
        where,
        include: {
          standard: true,
          specification: {
            include: {
              customer: true,
              glassType: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.securityCompliance.count({ where })
    ]);

    return NextResponse.json({
      complianceRecords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching compliance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const complianceRecord = await prisma.securityCompliance.create({
      data: {
        standardId: data.standardId,
        specificationId: data.specificationId,
        status: data.status || 'PENDING',
        rating: data.rating,
        checkedBy: data.checkedBy,
        checkedAt: data.checkedAt ? new Date(data.checkedAt) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        requirements: data.requirements || {},
        testResults: data.testResults || {},
        notes: data.notes,
        certificateNumber: data.certificateNumber,
        certificateIssued: data.certificateIssued ? new Date(data.certificateIssued) : null,
        certificateExpiry: data.certificateExpiry ? new Date(data.certificateExpiry) : null
      },
      include: {
        standard: true,
        specification: {
          include: {
            customer: true,
            glassType: true
          }
        }
      }
    });

    return NextResponse.json(complianceRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating compliance record:', error);
    return NextResponse.json(
      { error: 'Failed to create compliance record' },
      { status: 500 }
    );
  }
}
