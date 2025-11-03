
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const teamId = searchParams.get('teamId');
    
    let where: any = {};
    
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      where.scheduledDate = {
        gte: startOfDay,
        lte: endOfDay
      };
    }
    
    if (teamId) {
      where.teamId = teamId;
    }
    
    const schedules = await prisma.jobSchedule.findMany({
      where,
      include: {
        job: true,
        team: {
          include: {
            van: true
          }
        },
        van: true
      },
      orderBy: { scheduledDate: 'asc' }
    });

    return NextResponse.json({ schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      jobId,
      teamId,
      vanId,
      scheduledDate,
      scheduledTime,
      notes
    } = body;

    const schedule = await prisma.jobSchedule.create({
      data: {
        jobId,
        teamId,
        vanId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        notes,
        status: 'SCHEDULED'
      },
      include: {
        job: true,
        team: true,
        van: true
      }
    });

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'SCHEDULE_CREATED',
        description: `Installation scheduled for job ${schedule.job.jobNumber} with team ${schedule.team.teamName}`,
        user: 'System User',
        jobId: schedule.jobId
      }
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}
