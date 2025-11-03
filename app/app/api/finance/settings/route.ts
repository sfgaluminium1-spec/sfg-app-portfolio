
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    let settings = await prisma.financeSettings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.financeSettings.create({
        data: {
          defaultDrawdownRate: 80.0,
          financeFeesRate: 3.967,
          minimumInvoiceAmount: 500.0,
          type1Eligible: true,
          type2Eligible: true,
          type3Eligible: false,
          type4Eligible: false,
          firstReminderDays: 60,
          secondReminderDays: 90,
          finalReminderDays: 120,
          vatSubmissionDay: 7,
          cisSubmissionDay: 19,
          quarterlyDeadlineDay: 31
        }
      });
    }

    return NextResponse.json(settings);

  } catch (error) {
    console.error('Error fetching finance settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finance settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    let settings = await prisma.financeSettings.findFirst();

    if (settings) {
      settings = await prisma.financeSettings.update({
        where: { id: settings.id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });
    } else {
      settings = await prisma.financeSettings.create({
        data
      });
    }

    return NextResponse.json(settings);

  } catch (error) {
    console.error('Error updating finance settings:', error);
    return NextResponse.json(
      { error: 'Failed to update finance settings' },
      { status: 500 }
    );
  }
}
