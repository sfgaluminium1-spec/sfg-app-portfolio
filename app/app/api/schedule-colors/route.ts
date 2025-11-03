
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const scheduleColors = await prisma.scheduleColor.findMany({
      include: {
        assignedEmployee: {
          select: {
            id: true,
            fullName: true,
            role: true,
            email: true,
            isActive: true
          }
        }
      },
      orderBy: {
        priorityLevel: 'desc'
      }
    });

    return NextResponse.json(scheduleColors);
  } catch (error) {
    console.error('Error fetching schedule colors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule colors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const scheduleColor = await prisma.scheduleColor.create({
      data: {
        colorName: body.colorName,
        colorCode: body.colorCode,
        staffNickname: body.staffNickname,
        employeeId: body.employeeId || null,
        canAssignJobs: body.canAssignJobs !== false,
        canAssignVans: body.canAssignVans !== false,
        priorityLevel: body.priorityLevel || 1,
        isActive: body.isActive !== false
      },
      include: {
        assignedEmployee: {
          select: {
            id: true,
            fullName: true,
            role: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(scheduleColor);
  } catch (error) {
    console.error('Error creating schedule color:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule color' },
      { status: 500 }
    );
  }
}
