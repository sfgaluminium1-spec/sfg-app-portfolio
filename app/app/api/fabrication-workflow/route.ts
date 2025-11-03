
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const workflows = await prisma.fabricationWorkflow.findMany({
      include: {
        job: {
          select: {
            id: true,
            jobNumber: true,
            client: true,
            description: true,
            status: true,
            value: true
          }
        },
        template: {
          include: {
            steps: {
              orderBy: {
                stepOrder: 'asc'
              }
            }
          }
        },
        leadFabricator: {
          select: {
            id: true,
            fullName: true,
            role: true,
            email: true
          }
        },
        assignments: {
          include: {
            employee: {
              select: {
                id: true,
                fullName: true,
                role: true
              }
            }
          },
          where: {
            isActive: true
          }
        },
        stepExecutions: {
          include: {
            assignedEmployee: {
              select: {
                id: true,
                fullName: true
              }
            },
            helperEmployee: {
              select: {
                id: true,
                fullName: true
              }
            }
          },
          orderBy: {
            stepOrder: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(workflows);
  } catch (error) {
    console.error('Error fetching fabrication workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fabrication workflows' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the default template
    const template = await prisma.fabricationWorkflowTemplate.findFirst({
      where: { isDefault: true },
      include: {
        steps: {
          orderBy: { stepOrder: 'asc' }
        }
      }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'No default fabrication template found' },
        { status: 400 }
      );
    }

    // Create the workflow
    const workflow = await prisma.fabricationWorkflow.create({
      data: {
        jobId: body.jobId,
        templateId: template.id,
        status: 'NOT_STARTED',
        currentStep: 1,
        totalHoursPlanned: template.estimatedHours,
        leadFabricatorId: body.leadFabricatorId || null,
        helperAssigned: body.helperAssigned || false,
        helperHours: body.helperHours || 0,
        helperCostImpact: body.helperCostImpact || 0,
        isOverflow: body.isOverflow || false,
        overflowReason: body.overflowReason || null,
        weekendWorkRequired: body.weekendWorkRequired || false,
        tempStaffRequired: body.tempStaffRequired || false
      }
    });

    // Create step executions for each template step
    const stepExecutions = await Promise.all(
      template.steps.map((step: any) => 
        prisma.fabricationStepExecution.create({
          data: {
            workflowId: workflow.id,
            stepOrder: step.stepOrder,
            stepName: step.stepName,
            status: step.stepOrder === 1 ? 'PENDING' : 'PENDING',
            plannedHours: body.helperAssigned && step.timeWithHelperHours 
              ? step.timeWithHelperHours 
              : step.standardTimeHours,
            assignedEmployeeId: step.stepOrder === 1 ? body.leadFabricatorId : null,
            qualityCheckRequired: step.requiresQualityCheck
          }
        })
      )
    );

    // Return the complete workflow
    const completeWorkflow = await prisma.fabricationWorkflow.findUnique({
      where: { id: workflow.id },
      include: {
        job: {
          select: {
            id: true,
            jobNumber: true,
            client: true,
            description: true
          }
        },
        template: {
          include: {
            steps: {
              orderBy: { stepOrder: 'asc' }
            }
          }
        },
        leadFabricator: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        },
        stepExecutions: {
          orderBy: { stepOrder: 'asc' }
        }
      }
    });

    return NextResponse.json(completeWorkflow);
  } catch (error) {
    console.error('Error creating fabrication workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create fabrication workflow' },
      { status: 500 }
    );
  }
}
