
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      quoteId,
      customerName,
      contactName,
      contactPhone,
      contactEmail,
      projectName,
      surveyAddress,
      postcode,
      scheduledDate,
      scheduledTime,
      surveyType,
      accessRequirements,
      specialInstructions,
      priority
    } = body;

    if (!quoteId || !customerName || !surveyAddress) {
      return NextResponse.json(
        { error: 'Quote ID, customer name, and survey address are required' },
        { status: 400 }
      );
    }

    // Check if quote exists
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Calculate distance and cost
    const distanceResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/distance-calculation`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: surveyAddress,
          postcode,
          quoteValue: quote.value,
          entityId: quoteId,
          calculatedFor: 'SURVEY'
        })
      }
    );

    const distanceData = await distanceResponse.json();
    
    if (!distanceData.success) {
      return NextResponse.json(
        { error: 'Failed to calculate survey distance and cost' },
        { status: 500 }
      );
    }

    const { calculation } = distanceData;

    // Find Darren Newbury (Norman) in employee system
    const surveyor = await prisma.employee.findFirst({
      where: {
        OR: [
          { fullName: { contains: 'Darren Newbury', mode: 'insensitive' } },
          { firstName: 'Darren' },
          { role: { contains: 'Site Surveyor', mode: 'insensitive' } },
          { scheduleNickname: 'NORMAN' }
        ]
      }
    });

    // Create survey booking
    const surveyBooking = await prisma.surveyBooking.create({
      data: {
        quoteId,
        customerName,
        contactName,
        contactPhone,
        contactEmail,
        projectName,
        surveyAddress,
        postcode: postcode || surveyAddress.split(' ').pop() || '',
        distanceInMiles: calculation.distanceInMiles,
        travelTime: calculation.estimatedTravelTime,
        baseTravelCost: calculation.baseCost,
        finalSurveyCost: calculation.finalCost,
        isManchesterFree: calculation.qualifiesForFree,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        scheduledTime: scheduledTime || null,
        assignedSurveyor: surveyor?.fullName || 'Darren Newbury',
        surveyorEmployeeId: surveyor?.id || null,
        status: 'COST_CALCULATED',
        priority: priority || 'MEDIUM',
        surveyType: surveyType || 'STANDARD_SURVEY',
        accessRequirements,
        specialInstructions
      }
    });

    // Update quote with survey information
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        requiresSurvey: true,
        surveyRequested: true,
        surveyScheduled: !!scheduledDate,
        surveyDate: scheduledDate ? new Date(scheduledDate) : null,
        surveyTime: scheduledTime,
        surveyStatus: 'COST_CALCULATED',
        installationAddress: surveyAddress,
        distanceFromBase: calculation.distanceInMiles,
        surveyTravelCost: calculation.baseCost,
        surveyIsFree: calculation.qualifiesForFree,
        surveyTotalCost: calculation.finalCost,
        assignedSurveyor: surveyor?.fullName || 'Darren Newbury',
        surveyNotes: `Survey booked via system. Distance: ${calculation.distanceInMiles} miles. ${calculation.qualifiesForFree ? 'FREE (Manchester exception)' : `Cost: £${calculation.finalCost}`}`
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'SURVEY_REQUESTED',
        description: `Survey booked for ${customerName} - ${surveyAddress}. Distance: ${calculation.distanceInMiles} miles. ${calculation.qualifiesForFree ? 'FREE (Manchester exception)' : `Cost: £${calculation.finalCost}`}. Assigned to: ${surveyor?.fullName || 'Darren Newbury'}`,
        user: 'System',
        quoteId
      }
    });

    // Return survey booking with cost breakdown
    const surveyWithQuote = await prisma.surveyBooking.findUnique({
      where: { id: surveyBooking.id },
      include: {
        quote: true
      }
    });

    return NextResponse.json({
      success: true,
      surveyBooking: surveyWithQuote,
      costBreakdown: calculation.breakdown,
      surveyor: {
        name: surveyor?.fullName || 'Darren Newbury',
        nickname: 'Norman',
        role: surveyor?.role || 'Site Surveyor'
      }
    });

  } catch (error) {
    console.error('Survey booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create survey booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('quoteId');
    const status = searchParams.get('status');
    const surveyor = searchParams.get('surveyor');

    const where: any = {};
    if (quoteId) where.quoteId = quoteId;
    if (status) where.status = status;
    if (surveyor) where.assignedSurveyor = { contains: surveyor, mode: 'insensitive' };

    const surveyBookings = await prisma.surveyBooking.findMany({
      where,
      include: {
        quote: {
          select: {
            quoteNumber: true,
            value: true,
            status: true,
            projectName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ surveyBookings });

  } catch (error) {
    console.error('Get survey bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey bookings' },
      { status: 500 }
    );
  }
}
