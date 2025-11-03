
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const offlineTimesheet = await request.json();

    // Validate the offline timesheet data
    if (!offlineTimesheet.employeeId || !offlineTimesheet.date || !offlineTimesheet.startTime || !offlineTimesheet.endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if this timesheet already exists
    const existingTimesheet = await prisma.timesheet.findFirst({
      where: {
        employeeId: offlineTimesheet.employeeId,
        workDate: new Date(offlineTimesheet.date),
        startTime: offlineTimesheet.startTime,
        endTime: offlineTimesheet.endTime,
      }
    });

    if (existingTimesheet) {
      return NextResponse.json({ 
        message: 'Timesheet already exists',
        id: existingTimesheet.id 
      });
    }

    // Get employee details for payroll calculation
    const employee = await prisma.employee.findUnique({
      where: { id: offlineTimesheet.employeeId }
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Calculate hours and pay (simplified for offline sync)
    const startTime = new Date(`1970-01-01T${offlineTimesheet.startTime}:00`);
    let endTime = new Date(`1970-01-01T${offlineTimesheet.endTime}:00`);
    
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const totalHours = diffMs / (1000 * 60 * 60) - (offlineTimesheet.breakMinutes || 0) / 60;
    
    const regularHours = Math.min(totalHours, 8.5);
    const overtimeHours = Math.max(0, totalHours - 8.5);
    
    const regularPay = regularHours * employee.hourlyRate;
    const overtimePay = overtimeHours * employee.hourlyRate * 1.5;

    // Create the timesheet record
    const timesheet = await prisma.timesheet.create({
      data: {
        employeeId: offlineTimesheet.employeeId,
        workDate: new Date(offlineTimesheet.date),
        startTime: offlineTimesheet.startTime,
        endTime: offlineTimesheet.endTime,
        totalHours: Number(totalHours.toFixed(2)),
        regularHours: Number(regularHours.toFixed(2)),
        overtimeHours: Number(overtimeHours.toFixed(2)),
        regularPay: Number(regularPay.toFixed(2)),
        overtimePay: Number(overtimePay.toFixed(2)),
        totalPay: Number((regularPay + overtimePay).toFixed(2)),
        description: offlineTimesheet.notes || '',
        status: 'SUBMITTED',
        createdById: session.user.id,
        submittedAt: new Date(offlineTimesheet.timestamp),
        breakMinutes: offlineTimesheet.breakMinutes || 0,
      },
      include: {
        employee: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Offline timesheet synced successfully',
      timesheet 
    });

  } catch (error) {
    console.error('Error syncing offline timesheet:', error);
    return NextResponse.json(
      { error: 'Failed to sync offline timesheet' },
      { status: 500 }
    );
  }
}
