
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// Generate specification number
function generateSpecNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SPEC-${timestamp}-${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const quoteId = searchParams.get('quoteId');
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    
    if (customerId) {
      where.customerId = customerId;
    }
    
    if (quoteId) {
      where.quoteId = quoteId;
    }
    
    if (jobId) {
      where.jobId = jobId;
    }
    
    if (status) {
      where.complianceStatus = status;
    }
    
    if (search) {
      where.OR = [
        { specificationNumber: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [specifications, total] = await Promise.all([
      prisma.glassSpecification.findMany({
        where,
        include: {
          glassType: true,
          finishOption: true,
          template: true,
          customer: true,
          quote: true,
          job: true,
          securityStandards: true,
          complianceRecords: {
            include: {
              standard: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.glassSpecification.count({ where })
    ]);

    return NextResponse.json({
      specifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching specifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Calculate area if dimensions provided
    let area = data.area;
    if (!area && data.width && data.height) {
      area = (data.width * data.height) / 1000000; // Convert mm² to m²
    }
    
    // Calculate pricing
    let unitPrice = data.unitPrice;
    let totalPrice = data.totalPrice;
    
    if (!unitPrice && data.glassTypeId) {
      const glassType = await prisma.glassType.findUnique({
        where: { id: data.glassTypeId }
      });
      
      if (glassType?.pricePerSqm && area) {
        unitPrice = glassType.pricePerSqm * area;
        totalPrice = unitPrice * (data.quantity || 1);
      }
    }

    const specification = await prisma.glassSpecification.create({
      data: {
        specificationNumber: generateSpecNumber(),
        name: data.name,
        description: data.description,
        glassTypeId: data.glassTypeId,
        thickness: data.thickness,
        finishOptionId: data.finishOptionId,
        width: data.width,
        height: data.height,
        area: area,
        quantity: data.quantity || 1,
        targetUValue: data.targetUValue,
        targetGValue: data.targetGValue,
        acousticRequirement: data.acousticRequirement,
        securityRating: data.securityRating,
        specialRequirements: data.specialRequirements,
        templateId: data.templateId,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        priceValidUntil: data.priceValidUntil ? new Date(data.priceValidUntil) : null,
        enquiryId: data.enquiryId,
        quoteId: data.quoteId,
        jobId: data.jobId,
        customerId: data.customerId,
        customerSpecId: data.customerSpecId
      },
      include: {
        glassType: true,
        finishOption: true,
        template: true,
        customer: true,
        quote: true,
        job: true
      }
    });

    // Create security compliance records if security standards specified
    if (data.securityStandardIds && data.securityStandardIds.length > 0) {
      await Promise.all(
        data.securityStandardIds.map((standardId: string) =>
          prisma.securityCompliance.create({
            data: {
              standardId,
              specificationId: specification.id,
              status: 'PENDING'
            }
          })
        )
      );
    }

    return NextResponse.json(specification, { status: 201 });
  } catch (error) {
    console.error('Error creating specification:', error);
    return NextResponse.json(
      { error: 'Failed to create specification' },
      { status: 500 }
    );
  }
}
