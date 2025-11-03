
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;

    // Get complete job workflow data
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        communications: {
          orderBy: { createdAt: 'desc' }
        },
        drawingApprovals: {
          orderBy: { createdAt: 'desc' }
        },
        materialsAnalysis: {
          include: {
            orderItems: true
          }
        },
        orderItems: {
          include: {
            supplierOrder: {
              include: {
                supplier: true
              }
            }
          }
        },
        supplierOrders: {
          include: {
            supplier: true,
            orderItems: true
          }
        },
        workflowSteps: {
          orderBy: { stepOrder: 'asc' },
          include: {
            communications: true,
            qualityChecks: true
          }
        },
        qualityChecks: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Calculate workflow progress
    const totalSteps = job.workflowSteps.length;
    const completedSteps = job.workflowSteps.filter((step: any) => step.status === 'COMPLETED').length;
    const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    // Get current workflow stage
    const currentStep = job.workflowSteps.find((step: any) => 
      step.status === 'IN_PROGRESS' || step.status === 'PENDING'
    );

    return NextResponse.json({
      job,
      workflow: {
        progressPercent,
        currentStep: currentStep?.stepName || 'Completed',
        totalSteps,
        completedSteps,
        pendingSteps: job.workflowSteps.filter((step: any) => step.status === 'PENDING').length,
        blockedSteps: job.workflowSteps.filter((step: any) => step.status === 'BLOCKED').length
      }
    });
  } catch (error) {
    console.error('Job workflow API error:', error);
    return NextResponse.json({ error: 'Failed to fetch job workflow' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'initialize_workflow':
        return await initializeJobWorkflow(jobId, data);
      case 'update_step':
        return await updateWorkflowStep(jobId, data);
      case 'complete_step':
        return await completeWorkflowStep(jobId, data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Job workflow action error:', error);
    return NextResponse.json({ error: 'Failed to process workflow action' }, { status: 500 });
  }
}

async function initializeJobWorkflow(jobId: string, data: any) {
  // Create default workflow steps for a new job
  const defaultSteps = [
    {
      stepName: 'Customer Communication Setup',
      stepType: 'CUSTOMER_COMMUNICATION' as const,
      stepOrder: 1,
      requiresApproval: false,
      requiresQualityCheck: false
    },
    {
      stepName: 'Drawing Upload & Review',
      stepType: 'DRAWING_APPROVAL' as const,
      stepOrder: 2,
      requiresApproval: true,
      requiresQualityCheck: true
    },
    {
      stepName: 'Materials Analysis',
      stepType: 'MATERIALS_ANALYSIS' as const,
      stepOrder: 3,
      requiresApproval: true,
      requiresQualityCheck: true
    },
    {
      stepName: 'Order Items Creation',
      stepType: 'ORDER_CREATION' as const,
      stepOrder: 4,
      requiresApproval: true,
      requiresQualityCheck: false
    },
    {
      stepName: 'Supplier Ordering',
      stepType: 'SUPPLIER_ORDERING' as const,
      stepOrder: 5,
      requiresApproval: true,
      requiresQualityCheck: false
    },
    {
      stepName: 'Production Quality Check',
      stepType: 'QUALITY_CHECK' as const,
      stepOrder: 6,
      requiresApproval: false,
      requiresQualityCheck: true
    },
    {
      stepName: 'Installation Scheduling',
      stepType: 'INSTALLATION_SCHEDULING' as const,
      stepOrder: 7,
      requiresApproval: false,
      requiresQualityCheck: false
    },
    {
      stepName: 'Completion Verification',
      stepType: 'COMPLETION_VERIFICATION' as const,
      stepOrder: 8,
      requiresApproval: true,
      requiresQualityCheck: true
    }
  ];

  const workflowSteps = await Promise.all(
    defaultSteps.map((step: any) =>
      prisma.jobWorkflowStep.create({
        data: {
          ...step,
          jobId,
          status: step.stepOrder === 1 ? 'IN_PROGRESS' as const : 'PENDING' as const
        }
      })
    )
  );

  return NextResponse.json({ workflowSteps });
}

async function updateWorkflowStep(jobId: string, data: any) {
  const { stepId, updates } = data;

  const updatedStep = await prisma.jobWorkflowStep.update({
    where: { id: stepId },
    data: {
      ...updates,
      updatedAt: new Date()
    }
  });

  return NextResponse.json({ step: updatedStep });
}

async function completeWorkflowStep(jobId: string, data: any) {
  const { stepId, completedBy, notes } = data;

  // Complete the current step
  const completedStep = await prisma.jobWorkflowStep.update({
    where: { id: stepId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      progressPercent: 100,
      notes: notes || undefined
    }
  });

  // Find and start the next step
  const nextStep = await prisma.jobWorkflowStep.findFirst({
    where: {
      jobId,
      stepOrder: { gt: completedStep.stepOrder },
      status: 'PENDING'
    },
    orderBy: { stepOrder: 'asc' }
  });

  if (nextStep) {
    await prisma.jobWorkflowStep.update({
      where: { id: nextStep.id },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date()
      }
    });
  }

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'JOB_UPDATED',
      description: `Workflow step "${completedStep.stepName}" completed`,
      user: completedBy || 'System',
      jobId
    }
  });

  return NextResponse.json({ 
    completedStep, 
    nextStep,
    message: 'Workflow step completed successfully'
  });
}
