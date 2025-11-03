
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        securityTier: true,
        manager: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        },
        directReports: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        },
        scheduleColor: true,
        teamAssignments: {
          include: {
            team: {
              select: {
                id: true,
                teamName: true
              }
            }
          }
        }
      },
      orderBy: [
        { securityTier: { tierId: 'asc' } },
        { fullName: 'asc' }
      ]
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const employee = await prisma.employee.create({
      data: {
        employeeNumber: body.employeeNumber,
        firstName: body.firstName,
        lastName: body.lastName,
        fullName: `${body.firstName} ${body.lastName || ''}`.trim(),
        email: body.email,
        phone: body.phone,
        role: body.role,
        department: body.department,
        managerId: body.managerId,
        securityTierId: body.securityTierId,
        scheduleColorCode: body.scheduleColorCode,
        scheduleNickname: body.scheduleNickname,
        accessDetails: body.accessDetails,
        canLoginToSystem: body.canLoginToSystem !== false,
        preferredContactMethod: body.preferredContactMethod || 'EMAIL',
        emailNotifications: body.emailNotifications !== false,
        smsNotifications: body.smsNotifications || false,
        skills: body.skills || [],
        certifications: body.certifications || [],
        isTeamLeader: body.isTeamLeader || false,
        canManageTeam: body.canManageTeam || false,
        isActive: body.isActive !== false,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null
      },
      include: {
        securityTier: true,
        manager: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
