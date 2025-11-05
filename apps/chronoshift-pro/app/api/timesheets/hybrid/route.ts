
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekEnding = searchParams.get('weekEnding');
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    const where: any = {};
    
    if (weekEnding) {
      where.workDate = {
        gte: new Date(weekEnding),
        lt: new Date(new Date(weekEnding).getTime() + 7 * 24 * 60 * 60 * 1000)
      };
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (employeeId) {
      where.employeeId = employeeId;
    }

    // Group timesheets by employee and week
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
        },
        createdBy: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: [
        { workDate: 'desc' },
        { employee: { firstName: 'asc' } }
      ]
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
          status: timesheet.status,
          totalHours: 0,
          overtimeHours: 0,
          shifts: [],
          supervisorApproval: timesheet.approvedBy ? {
            supervisorName: timesheet.approvedBy,
            approved: timesheet.status === 'approved',
            date: timesheet.approvedAt?.toISOString() || '',
            notes: timesheet.notes || ''
          } : undefined
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
    console.error('Error fetching hybrid timesheets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timesheets' },
      { status: 500 }
    );
  }
}
