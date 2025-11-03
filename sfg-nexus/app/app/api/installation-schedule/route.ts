
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Glass weight calculation function: Length × Width × Thickness × 2.5
function calculateGlassWeight(length: number, width: number, thickness: number): number {
  return length * width * thickness * 2.5;
}

// Staff requirement calculation based on weight
function calculateStaffRequirement(weight: number): {
  staffRequired: number;
  liftingMethod: string;
  safetyNotes?: string;
} {
  if (weight <= 25) {
    return {
      staffRequired: 1,
      liftingMethod: 'Manual',
      safetyNotes: 'Solo lift allowed'
    };
  } else if (weight <= 75) {
    return {
      staffRequired: 2,
      liftingMethod: 'Suction/manual',
      safetyNotes: 'Two-man lift required'
    };
  } else if (weight <= 150) {
    return {
      staffRequired: 3,
      liftingMethod: 'Suction/manual',
      safetyNotes: 'Three-man lift required'
    };
  } else {
    return {
      staffRequired: 4,
      liftingMethod: 'Suction/crane',
      safetyNotes: 'Use mechanical aid or extra staff - weight exceeds 150kg'
    };
  }
}

export async function GET() {
  try {
    const installationSchedules = await prisma.installationSchedule.findMany({
      include: {
        job: {
          select: {
            id: true,
            jobNumber: true,
            client: true,
            site: true,
            description: true,
            status: true,
            value: true
          }
        },
        teamLeader: {
          select: {
            id: true,
            fullName: true,
            role: true,
            email: true,
            phone: true
          }
        },
        van: {
          select: {
            id: true,
            vanNumber: true,
            registration: true,
            capacity: true
          }
        },
        assignments: {
          include: {
            employee: {
              select: {
                id: true,
                fullName: true,
                role: true,
                skills: true
              }
            }
          },
          where: {
            isActive: true
          }
        },
        glassCalculations: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        scheduledDate: 'asc'
      }
    });

    return NextResponse.json(installationSchedules);
  } catch (error) {
    console.error('Error fetching installation schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch installation schedules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    let totalGlassWeight = 0;
    let maxStaffRequired = 1;
    let liftingMethod = 'Manual';
    let mechanicalAidRequired = false;
    
    // Calculate glass weights and staff requirements if glass details provided
    const glassCalculations = [];
    if (body.glassDetails && Array.isArray(body.glassDetails)) {
      for (const glass of body.glassDetails) {
        const weight = calculateGlassWeight(glass.length, glass.width, glass.thickness);
        const staffReq = calculateStaffRequirement(weight);
        
        totalGlassWeight += weight;
        if (staffReq.staffRequired > maxStaffRequired) {
          maxStaffRequired = staffReq.staffRequired;
          liftingMethod = staffReq.liftingMethod;
        }
        
        if (weight > 150) {
          mechanicalAidRequired = true;
        }
        
        glassCalculations.push({
          panelName: glass.panelName || `Panel ${glassCalculations.length + 1}`,
          length: glass.length,
          width: glass.width,
          thickness: glass.thickness,
          calculatedWeight: weight,
          staffRequired: staffReq.staffRequired,
          liftingMethod: staffReq.liftingMethod,
          safetyNotes: staffReq.safetyNotes
        });
      }
    }

    // Create the installation schedule
    const installationSchedule = await prisma.installationSchedule.create({
      data: {
        jobId: body.jobId,
        scheduledDate: new Date(body.scheduledDate),
        scheduledTime: body.scheduledTime || null,
        estimatedDuration: body.estimatedDuration || 8,
        totalGlassWeight: totalGlassWeight || null,
        glassDetails: body.glassDetails || [],
        requiredStaff: body.requiredStaff || maxStaffRequired,
        actualStaff: body.actualStaff || 1,
        staffingNotes: body.staffingNotes || null,
        liftingMethod: body.liftingMethod || liftingMethod,
        teamLeaderId: body.teamLeaderId || null,
        vanId: body.vanId || null,
        routeGroup: body.routeGroup || null,
        routeOrder: body.routeOrder || null,
        status: body.status || 'SCHEDULED',
        safetyCheckCompleted: body.safetyCheckCompleted || false,
        safetyNotes: body.safetyNotes || null,
        mechanicalAidRequired: body.mechanicalAidRequired || mechanicalAidRequired,
        mechanicalAidType: body.mechanicalAidType || null
      }
    });

    // Create glass weight calculations
    if (glassCalculations.length > 0) {
      await Promise.all(
        glassCalculations.map((calc: any) => 
          prisma.glassWeightCalculation.create({
            data: {
              scheduleId: installationSchedule.id,
              ...calc
            }
          })
        )
      );
    }

    // Return the complete installation schedule
    const completeSchedule = await prisma.installationSchedule.findUnique({
      where: { id: installationSchedule.id },
      include: {
        job: {
          select: {
            id: true,
            jobNumber: true,
            client: true,
            site: true,
            description: true
          }
        },
        teamLeader: {
          select: {
            id: true,
            fullName: true,
            role: true,
            email: true
          }
        },
        van: {
          select: {
            id: true,
            vanNumber: true,
            registration: true,
            capacity: true
          }
        },
        glassCalculations: true
      }
    });

    return NextResponse.json(completeSchedule);
  } catch (error) {
    console.error('Error creating installation schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create installation schedule' },
      { status: 500 }
    );
  }
}
