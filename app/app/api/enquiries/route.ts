
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate enquiry number
function generateEnquiryNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  return `ENQ-${year}${randomNum.toString().padStart(4, '0')}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const where = status ? { status: status as any } : {};
    
    const enquiries = await prisma.enquiry.findMany({
      where,
      include: {
        quotes: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      contactName,
      email,
      phone,
      company,
      projectName,
      description,
      source,
      requiresSurvey
    } = body;

    // Generate unique enquiry number
    let enquiryNumber;
    let isUnique = false;
    while (!isUnique) {
      enquiryNumber = generateEnquiryNumber();
      const existing = await prisma.enquiry.findUnique({
        where: { enquiryNumber }
      });
      if (!existing) {
        isUnique = true;
      }
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        enquiryNumber: enquiryNumber!,
        customerName,
        contactName,
        email,
        phone,
        company,
        projectName,
        description,
        source,
        status: 'NEW',
        requiresSurvey: requiresSurvey || false,
        surveyRequested: requiresSurvey || false
      }
    });

    // Create activity for enquiry creation
    await prisma.activity.create({
      data: {
        type: 'ENQUIRY_CREATED',
        description: `New enquiry ${enquiry.enquiryNumber} received from ${customerName}`,
        user: 'System',
        enquiryId: enquiry.id
      }
    });

    // Create activity for survey request if needed
    if (requiresSurvey) {
      await prisma.activity.create({
        data: {
          type: 'SURVEY_REQUESTED',
          description: `Site survey requested for enquiry ${enquiry.enquiryNumber}`,
          user: 'System',
          enquiryId: enquiry.id
        }
      });
    }

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}
