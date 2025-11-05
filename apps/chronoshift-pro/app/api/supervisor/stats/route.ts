
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'supervisor' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get supervisor's department
    const supervisor = await prisma.employee.findUnique({
      where: { email: session.user.email! }
    });

    const departmentFilter = supervisor?.department ? {
      employee: { department: supervisor.department }
    } : {};

    // Get current week boundaries
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Get pending approvals
    const pendingApprovals = await prisma.timesheet.count({
      where: {
        ...departmentFilter,
        status: 'SUBMITTED'
      }
    });

    // Get approved this week
    const approvedThisWeek = await prisma.timesheet.count({
      where: {
        ...departmentFilter,
        status: 'APPROVED',
        approvedAt: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    });

    // Get rejected this week
    const rejectedThisWeek = await prisma.timesheet.count({
      where: {
        ...departmentFilter,
        status: 'REJECTED',
        approvedAt: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    });

    // Get total employees in department
    const totalEmployees = await prisma.employee.count({
      where: supervisor?.department ? { department: supervisor.department } : {}
    });

    // Get department hours this week
    const departmentTimesheets = await prisma.timesheet.findMany({
      where: {
        ...departmentFilter,
        workDate: {
          gte: weekStart,
          lte: weekEnd
        }
      },
      select: {
        totalHours: true
      }
    });

    const departmentHours = departmentTimesheets.reduce((sum: number, t: any) => sum + (t.totalHours || 0), 0);
    const averageHoursPerEmployee = totalEmployees > 0 ? departmentHours / totalEmployees : 0;

    return NextResponse.json({
      pendingApprovals,
      approvedThisWeek,
      rejectedThisWeek,
      totalEmployees,
      departmentHours,
      averageHoursPerEmployee
    });

  } catch (error) {
    console.error('Error fetching supervisor stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supervisor stats' },
      { status: 500 }
    );
  }
}
