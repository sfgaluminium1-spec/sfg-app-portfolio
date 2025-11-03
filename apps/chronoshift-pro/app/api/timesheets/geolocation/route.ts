
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';

import { PrismaClient } from '@prisma/client';

import { z } from 'zod';


const prisma = new PrismaClient();

// Validation schema for geolocation timesheet submission
const GeolocationTimesheetSchema = z.object({
  employeeId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  breakMinutes: z.number().min(0).max(480), // Max 8 hours break
  description: z.string().optional(),
  totalHours: z.number().min(0).max(24),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number(),
    address: z.string().optional(),
    timestamp: z.number(),
    geofenceCheck: z.object({
      isWithin: z.boolean(),
      distance: z.number(),
      siteName: z.string(),
    }),
    verifiedAt: z.string(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate input
    const validatedData = GeolocationTimesheetSchema.parse(body);

    // Additional security: Verify user can submit for this employee
    const employee = await prisma.employee.findUnique({
      where: { id: validatedData.employeeId },
      include: { user: true },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if user is submitting for themselves or has admin/supervisor privileges
    const canSubmit = employee.user?.email === session.user?.email ||
                      session.user?.role === 'admin' ||
                      session.user?.role === 'supervisor' ||
                      session.user?.role === 'manager';

    if (!canSubmit) {
      return NextResponse.json({ error: 'Not authorized to submit for this employee' }, { status: 403 });
    }

    // Verify geofence compliance
    if (!validatedData.location.geofenceCheck.isWithin) {
      return NextResponse.json({ 
        error: `Location verification failed. You are ${validatedData.location.geofenceCheck.distance}m from the work site. Please be within 50m of ${validatedData.location.geofenceCheck.siteName} to submit timesheets.` 
      }, { status: 400 });
    }

    // Calculate pay based on hourly rate and overtime rules
    const regularHours = Math.min(validatedData.totalHours, 8); // Standard 8 hour day
    const overtimeHours = Math.max(0, validatedData.totalHours - 8);
    
    const regularPay = regularHours * employee.hourlyRate;
    const overtimePay = overtimeHours * employee.hourlyRate * 1.5; // Time and a half
    const totalPay = regularPay + overtimePay;

    // Create timesheet with location data
    const timesheet = await prisma.timesheet.create({
      data: {
        employeeId: validatedData.employeeId,
        workDate: new Date(validatedData.date),
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        breakMinutes: validatedData.breakMinutes,
        description: validatedData.description || '',
        totalHours: validatedData.totalHours,
        regularHours,
        overtimeHours,
        regularPay,
        overtimePay,
        totalPay,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        createdById: session.user?.id,
        // Store location data in JSON fields
        clockInLocation: {
          latitude: validatedData.location.latitude,
          longitude: validatedData.location.longitude,
          accuracy: validatedData.location.accuracy,
          address: validatedData.location.address,
          timestamp: validatedData.location.timestamp,
          verifiedAt: validatedData.location.verifiedAt,
        },
        locationVerified: true,
        geofenceDistance: validatedData.location.geofenceCheck.distance,
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

    // Log the submission for HR compliance
    await prisma.hRComplianceLog.create({
      data: {
        action: 'TIMESHEET_SUBMITTED_WITH_LOCATION',
        userId: session.user?.id,
        employeeId: validatedData.employeeId,
        details: {
          timesheetId: timesheet.id,
          locationData: {
            distance: validatedData.location.geofenceCheck.distance,
            accuracy: validatedData.location.accuracy,
            siteName: validatedData.location.geofenceCheck.siteName,
          },
          workDate: validatedData.date,
          totalHours: validatedData.totalHours,
        },
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      timesheet: {
        id: timesheet.id,
        workDate: timesheet.workDate,
        totalHours: timesheet.totalHours,
        totalPay: timesheet.totalPay,
        status: timesheet.status,
        locationVerified: timesheet.locationVerified,
        submittedAt: timesheet.submittedAt,
      },
      message: 'Timesheet submitted successfully with location verification',
    });

  } catch (error: any) {
    console.error('Geolocation timesheet submission error:', error);
    await prisma.$disconnect();

    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid data provided', 
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to submit timesheet' 
    }, { status: 500 });
  }
}
