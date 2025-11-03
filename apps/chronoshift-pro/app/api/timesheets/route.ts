
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { sfgPayrollEngine } from '@/lib/sfg-business-rules';
import { getEmployeeById } from '@/lib/employee-data';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');

    const where: any = {};
    
    if (employeeId) {
      where.employeeId = employeeId;
    }
    
    if (status) {
      where.status = status;
    }

    const timesheets = await prisma.timesheet.findMany({
      where,
      include: {
        employee: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ timesheets });
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timesheets' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      employeeId,
      workDate,
      startTime,
      endTime,
      breakMinutes,
      description,
      status,
      submittedAt,
      regularHours,
      overtimeHours,
      nightHours,
      sleepHours,
      totalHours,
      regularPay,
      overtimePay,
      totalPay,
    } = body;

    // Validate required fields
    if (!employeeId || !workDate || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get employee data for calculations
    const employee = getEmployeeById(employeeId);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if submission is late (after Tuesday 5 PM deadline)
    const submissionDate = new Date();
    const workDateObj = new Date(workDate);
    
    let calculation;
    let finalStatus = status || 'SUBMITTED';
    let processingNotes = description || '';

    if (sfgPayrollEngine.isLateSubmission(submissionDate)) {
      // Process as late submission - standard 42.5 hours
      calculation = sfgPayrollEngine.processLateSubmission(
        { startTime, endTime, date: workDate, notes: description, breakMinutes: breakMinutes || 30 },
        employee.hourlyRate
      );
      finalStatus = 'LATE_SUBMISSION';
      processingNotes = `${description || ''} | ${calculation.status}`;
    } else {
      // Process as regular shift using SFG business rules
      calculation = sfgPayrollEngine.calculateRegularShift(
        startTime, 
        endTime, 
        workDateObj, 
        employee.hourlyRate, 
        breakMinutes || 30
      );
    }

    const timesheet = await prisma.timesheet.create({
      data: {
        employeeId,
        workDate: new Date(workDate),
        startTime,
        endTime,
        breakMinutes: breakMinutes || 30,
        description: processingNotes,
        status: finalStatus,
        submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
        createdById: session.user.id,
        regularHours: calculation.normalHours || 0,
        overtimeHours: calculation.overtimeHours || 0,
        nightHours: nightHours || 0,
        sleepHours: sleepHours || 0,
        totalHours: calculation.totalHours || 0,
        regularPay: calculation.normalPay || 0,
        overtimePay: calculation.overtimePay || 0,
        totalPay: calculation.totalPay || 0,
      },
      include: {
        employee: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ timesheet });
  } catch (error) {
    console.error('Error creating timesheet:', error);
    return NextResponse.json(
      { error: 'Failed to create timesheet' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
