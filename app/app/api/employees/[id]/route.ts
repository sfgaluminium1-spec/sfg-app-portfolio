
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employee = await prisma.employee.findUnique({
      where: { id: id },
      include: {
        securityTier: true,
        manager: {
          select: {
            id: true,
            fullName: true,
            role: true,
            email: true
          }
        },
        directReports: {
          select: {
            id: true,
            fullName: true,
            role: true,
            email: true,
            isActive: true
          }
        },
        scheduleColor: true,
        teamAssignments: {
          include: {
            team: {
              select: {
                id: true,
                teamName: true,
                skills: true
              }
            }
          },
          where: {
            isActive: true
          }
        },
        scheduleBlocks: {
          where: {
            blockDate: {
              gte: new Date()
            }
          },
          orderBy: {
            blockDate: 'asc'
          }
        },
        fabricationAssignments: {
          include: {
            workflow: {
              include: {
                job: {
                  select: {
                    id: true,
                    jobNumber: true,
                    client: true,
                    status: true
                  }
                }
              }
            }
          },
          where: {
            isActive: true
          }
        },
        installationAssignments: {
          include: {
            installationSchedule: {
              include: {
                job: {
                  select: {
                    id: true,
                    jobNumber: true,
                    client: true,
                    status: true
                  }
                }
              }
            }
          },
          where: {
            isActive: true
          }
        }
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: any = {};
    
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.firstName !== undefined || body.lastName !== undefined) {
      updateData.fullName = `${body.firstName || ''} ${body.lastName || ''}`.trim();
    }
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.department !== undefined) updateData.department = body.department;
    if (body.managerId !== undefined) updateData.managerId = body.managerId;
    if (body.securityTierId !== undefined) updateData.securityTierId = body.securityTierId;
    if (body.scheduleColorCode !== undefined) updateData.scheduleColorCode = body.scheduleColorCode;
    if (body.scheduleNickname !== undefined) updateData.scheduleNickname = body.scheduleNickname;
    if (body.accessDetails !== undefined) updateData.accessDetails = body.accessDetails;
    if (body.canLoginToSystem !== undefined) updateData.canLoginToSystem = body.canLoginToSystem;
    if (body.preferredContactMethod !== undefined) updateData.preferredContactMethod = body.preferredContactMethod;
    if (body.emailNotifications !== undefined) updateData.emailNotifications = body.emailNotifications;
    if (body.smsNotifications !== undefined) updateData.smsNotifications = body.smsNotifications;
    if (body.skills !== undefined) updateData.skills = body.skills;
    if (body.certifications !== undefined) updateData.certifications = body.certifications;
    if (body.isTeamLeader !== undefined) updateData.isTeamLeader = body.isTeamLeader;
    if (body.canManageTeam !== undefined) updateData.canManageTeam = body.canManageTeam;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.startDate !== undefined) updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;

    const employee = await prisma.employee.update({
      where: { id: id },
      data: updateData,
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
        scheduleColor: true
      }
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Soft delete by setting isActive to false
    const employee = await prisma.employee.update({
      where: { id: id },
      data: { 
        isActive: false,
        endDate: new Date()
      }
    });

    return NextResponse.json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating employee:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate employee' },
      { status: 500 }
    );
  }
}
