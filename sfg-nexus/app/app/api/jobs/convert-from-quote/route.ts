
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { addWeeks } from 'date-fns';

const prisma = new PrismaClient();

// Generate job number
function generateJobNumber(): string {
  const randomNum = Math.floor(Math.random() * 99999) + 10000;
  return `SFG-${randomNum}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      quoteId,
      orderNumber,
      site,
      poReceivedDate,
      installationDate,
      teamRequirement,
      vanRequirement,
      estimatedDays
    } = body;

    // Get the quote details
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { enquiry: true }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Generate unique job number
    let jobNumber;
    let isUnique = false;
    while (!isUnique) {
      jobNumber = generateJobNumber();
      const existing = await prisma.job.findUnique({
        where: { jobNumber }
      });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create the job
    const job = await prisma.job.create({
      data: {
        jobNumber: jobNumber!,
        client: quote.customerName,
        site: site || quote.projectName || '',
        description: quote.projectName || 'Job converted from quote',
        value: quote.value,
        status: 'APPROVED',
        priority: 'MEDIUM',
        quoteId: quote.id,
        orderNumber,
        poReceivedDate: new Date(poReceivedDate),
        installationDate: new Date(installationDate),
        teamRequirement,
        vanRequirement,
        estimatedDays
      }
    });

    // Update quote status to WON if not already
    if (quote.status !== 'WON') {
      await prisma.quote.update({
        where: { id: quoteId },
        data: { status: 'WON' }
      });
    }

    // Update enquiry status to WON if exists
    if (quote.enquiry) {
      await prisma.enquiry.update({
        where: { id: quote.enquiry.id },
        data: { status: 'WON' }
      });
    }

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'PO_RECEIVED',
        description: `PO received for quote ${quote.quoteNumber}, converted to job ${job.jobNumber}`,
        user: 'System User',
        jobId: job.id,
        quoteId: quote.id,
        enquiryId: quote.enquiry?.id
      }
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error converting quote to job:', error);
    return NextResponse.json(
      { error: 'Failed to convert quote to job' },
      { status: 500 }
    );
  }
}
