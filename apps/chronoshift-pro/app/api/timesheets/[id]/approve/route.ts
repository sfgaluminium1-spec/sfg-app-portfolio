
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';


export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'supervisor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { approved, notes, supervisorId } = await request.json();
    const timesheetId = params.id;

    // Update all timesheets for this employee/week combination
    const timesheet = await prisma.timesheet.findUnique({
      where: { id: timesheetId },
      include: { employee: true }
    });

    if (!timesheet) {
      return NextResponse.json({ error: 'Timesheet not found' }, { status: 404 });
    }

    // Update all timesheets for the same employee and week
    const weekStart = new Date(timesheet.workDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Sunday

    await prisma.timesheet.updateMany({
      where: {
        employeeId: timesheet.employeeId,
        workDate: {
          gte: weekStart,
          lte: weekEnd
        }
      },
      data: {
        status: approved ? 'APPROVED' : 'REJECTED',
        rejectionReason: approved ? null : notes,
        approvedAt: new Date(),
        approvedById: session.user.id
      }
    });

    return NextResponse.json({ 
      message: `Timesheet ${approved ? 'approved' : 'rejected'} successfully` 
    });

  } catch (error) {
    console.error('Error processing timesheet approval:', error);
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    );
  }
}
