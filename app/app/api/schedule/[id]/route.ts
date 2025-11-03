
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedSchedule = await prisma.jobSchedule.update({
      where: { id },
      data: {
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
        scheduledTime: body.scheduledTime,
        status: body.status,
        notes: body.notes,
        vanId: body.vanId,
        teamId: body.teamId
      },
      include: {
        job: true,
        team: {
          include: {
            van: true
          }
        },
        van: true
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'SCHEDULE_UPDATED',
        description: `Schedule updated for job ${updatedSchedule.job.jobNumber}`,
        user: 'System User',
        jobId: updatedSchedule.jobId
      }
    });

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const schedule = await prisma.jobSchedule.findUnique({
      where: { id },
      include: { job: true }
    });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    await prisma.jobSchedule.delete({
      where: { id }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'SCHEDULE_UPDATED',
        description: `Schedule deleted for job ${schedule.job.jobNumber}`,
        user: 'System User',
        jobId: schedule.jobId
      }
    });

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}
