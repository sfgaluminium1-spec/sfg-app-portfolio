
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'supervisor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'submitted';

    const where: any = { status };

    // If user is a supervisor, only show their department's timesheets
    if (session.user.role === 'supervisor') {
      const supervisor = await prisma.employee.findUnique({
        where: { email: session.user.email! }
      });
      
      if (supervisor?.department) {
        where.employee = {
          department: supervisor.department
        };
      }
    }

    const timesheets = await prisma.timesheet.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: true,
            role: true,
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    // Group by employee and week
    const groupedTimesheets = timesheets.reduce((acc: Record<string, any>, timesheet: any) => {
      const weekStart = new Date(timesheet.workDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // Sunday
      
      const key = `${timesheet.employeeId}-${weekEnd.toISOString().split('T')[0]}`;
      
      if (!acc[key]) {
        acc[key] = {
          id: key,
          employeeId: timesheet.employeeId,
          employee: timesheet.employee,
          weekEnding: weekEnd.toISOString().split('T')[0],
          submittedAt: timesheet.submittedAt?.toISOString() || timesheet.createdAt.toISOString(),
          status: timesheet.status,
          totalHours: 0,
          overtimeHours: 0,
          shifts: [],
          supervisorNotes: timesheet.supervisorNotes,
          approvedBy: timesheet.approvedBy,
          approvedAt: timesheet.approvedAt?.toISOString(),
        };
      }
      
      acc[key].totalHours += timesheet.totalHours || 0;
      acc[key].overtimeHours += timesheet.overtimeHours || 0;
      acc[key].shifts.push({
        date: timesheet.workDate.toISOString(),
        startTime: timesheet.startTime,
        endTime: timesheet.endTime,
        totalHours: timesheet.totalHours || 0,
        overtimeHours: timesheet.overtimeHours || 0,
        notes: timesheet.notes || ''
      });
      
      return acc;
    }, {} as Record<string, any>);

    const result = Object.values(groupedTimesheets);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching timesheets for approval:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timesheets' },
      { status: 500 }
    );
  }
}
