
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Bidirectional Workflow Navigation API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      jobId, 
      action, 
      fromStage, 
      toStage, 
      performedBy, 
      reason, 
      notes,
      confirmNavigation = false 
    } = body;

    // Validate input
    if (!jobId || !action || !fromStage || !toStage || !performedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current job state
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { 
        workflowSteps: true,
        workflowNavigations: {
          orderBy: { performedAt: 'desc' },
          take: 10
        }
      }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Validate workflow navigation rules
    const navigationValidation = await validateWorkflowNavigation(
      job, fromStage, toStage, action, performedBy
    );

    if (!navigationValidation.isAllowed) {
      return NextResponse.json(
        { 
          error: 'Workflow navigation not allowed',
          reason: navigationValidation.reason,
          requiresApproval: navigationValidation.requiresApproval
        },
        { status: 403 }
      );
    }

    // If navigation requires confirmation and not confirmed, return confirmation request
    if (navigationValidation.requiresConfirmation && !confirmNavigation) {
      return NextResponse.json({
        success: false,
        requiresConfirmation: true,
        message: 'This workflow navigation requires confirmation',
        impactAssessment: navigationValidation.impactAssessment,
        affectedProcesses: navigationValidation.affectedProcesses
      });
    }

    // Determine workflow direction
    const direction = determineWorkflowDirection(fromStage, toStage);

    // Create workflow navigation record
    const workflowNavigation = await prisma.workflowNavigation.create({
      data: {
        jobId,
        fromStage,
        toStage,
        direction,
        action: action as 'ADVANCE' | 'REVERT' | 'SKIP' | 'HOLD' | 'CANCEL',
        isAllowed: navigationValidation.isAllowed,
        requiresApproval: navigationValidation.requiresApproval,
        requiresConfirmation: navigationValidation.requiresConfirmation,
        performedBy,
        reason,
        notes,
        affectedProcesses: navigationValidation.affectedProcesses,
        rollbackRequired: action === 'REVERT',
        dataChanges: navigationValidation.dataChanges
      }
    });

    // Update job workflow steps based on navigation
    await updateJobWorkflowSteps(job, fromStage, toStage, action, performedBy);

    // Update job status if needed
    await updateJobStatus(jobId, toStage);

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'WORKFLOW_NAVIGATION',
        description: `Workflow navigated from ${fromStage} to ${toStage}`,
        user: performedBy,
        jobId,
        metadata: {
          action,
          direction,
          reason,
          navigationId: workflowNavigation.id
        }
      }
    });

    // Send Teams notification if enabled
    await sendTeamsWorkflowNotification(job, workflowNavigation);

    return NextResponse.json({
      success: true,
      navigation: workflowNavigation,
      message: `Workflow successfully navigated from ${fromStage} to ${toStage}`
    });

  } catch (error) {
    console.error('Workflow Navigation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to navigate workflow' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const workflowNavigations = await prisma.workflowNavigation.findMany({
      where: { jobId },
      orderBy: { performedAt: 'desc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      navigations: workflowNavigations
    });

  } catch (error) {
    console.error('Get Workflow Navigation Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve workflow navigations' },
      { status: 500 }
    );
  }
}

// Helper functions
async function validateWorkflowNavigation(
  job: any, 
  fromStage: string, 
  toStage: string, 
  action: string, 
  performedBy: string
) {
  // Basic validation rules
  let isAllowed = true;
  let requiresApproval = false;
  let requiresConfirmation = true;
  let reason = '';
  let affectedProcesses: string[] = [];
  let impactAssessment: any = {};
  let dataChanges: any = {};

  // Define workflow stage order
  const stageOrder = [
    'CUSTOMER_COMMUNICATION',
    'DRAWING_APPROVAL', 
    'MATERIALS_ANALYSIS',
    'ORDER_CREATION',
    'SUPPLIER_ORDERING',
    'QUALITY_CHECK',
    'PRODUCTION_STAGE',
    'DELIVERY_COORDINATION',
    'INSTALLATION_SCHEDULING',
    'COMPLETION_VERIFICATION'
  ];

  const fromIndex = stageOrder.indexOf(fromStage);
  const toIndex = stageOrder.indexOf(toStage);

  // Backward navigation validation
  if (action === 'REVERT' && toIndex > fromIndex) {
    isAllowed = false;
    reason = 'Cannot revert to a later stage';
  }

  // Check if navigation affects completed processes
  if (action === 'REVERT') {
    const affectedSteps = job.workflowSteps?.filter((step: any) => 
      stageOrder.indexOf(step.stepName) > toIndex && step.status === 'COMPLETED'
    );
    
    if (affectedSteps?.length > 0) {
      affectedProcesses = affectedSteps.map((step: any) => step.stepName);
      requiresApproval = true;
      impactAssessment = {
        affectedSteps: affectedSteps.length,
        dataRollbackRequired: true,
        documentsAffected: affectedSteps.some((s: any) => s.stepType === 'DRAWING_APPROVAL')
      };
    }
  }

  // Skip action validation
  if (action === 'SKIP') {
    requiresApproval = true;
    reason = 'Skipping workflow stages requires approval';
  }

  return {
    isAllowed,
    requiresApproval,
    requiresConfirmation,
    reason,
    affectedProcesses,
    impactAssessment,
    dataChanges
  };
}

function determineWorkflowDirection(fromStage: string, toStage: string): 'FORWARD' | 'BACKWARD' | 'BIDIRECTIONAL' {
  const stageOrder = [
    'CUSTOMER_COMMUNICATION',
    'DRAWING_APPROVAL', 
    'MATERIALS_ANALYSIS',
    'ORDER_CREATION',
    'SUPPLIER_ORDERING',
    'QUALITY_CHECK',
    'PRODUCTION_STAGE',
    'DELIVERY_COORDINATION',
    'INSTALLATION_SCHEDULING',
    'COMPLETION_VERIFICATION'
  ];

  const fromIndex = stageOrder.indexOf(fromStage);
  const toIndex = stageOrder.indexOf(toStage);

  if (toIndex > fromIndex) return 'FORWARD';
  if (toIndex < fromIndex) return 'BACKWARD';
  return 'BIDIRECTIONAL';
}

async function updateJobWorkflowSteps(
  job: any, 
  fromStage: string, 
  toStage: string, 
  action: string, 
  performedBy: string
) {
  // Update current step status
  const currentStep = job.workflowSteps?.find((step: any) => step.stepName === fromStage);
  if (currentStep) {
    await prisma.jobWorkflowStep.update({
      where: { id: currentStep.id },
      data: {
        status: action === 'REVERT' ? 'PENDING' : 'COMPLETED',
        completedAt: action === 'REVERT' ? null : new Date(),
        notes: `${action} action performed by ${performedBy}`
      }
    });
  }

  // Update target step status
  const targetStep = job.workflowSteps?.find((step: any) => step.stepName === toStage);
  if (targetStep) {
    await prisma.jobWorkflowStep.update({
      where: { id: targetStep.id },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        assignedTo: performedBy
      }
    });
  }
}

async function updateJobStatus(jobId: string, toStage: string) {
  // Map workflow stages to job statuses
  const stageToStatus: { [key: string]: string } = {
    'CUSTOMER_COMMUNICATION': 'APPROVED',
    'DRAWING_APPROVAL': 'IN_PRODUCTION',
    'MATERIALS_ANALYSIS': 'IN_PRODUCTION',
    'ORDER_CREATION': 'FABRICATION',
    'SUPPLIER_ORDERING': 'FABRICATION',
    'QUALITY_CHECK': 'ASSEMBLY',
    'PRODUCTION_STAGE': 'ASSEMBLY',
    'DELIVERY_COORDINATION': 'READY_FOR_INSTALL',
    'INSTALLATION_SCHEDULING': 'READY_FOR_INSTALL',
    'COMPLETION_VERIFICATION': 'COMPLETED'
  };

  const newStatus = stageToStatus[toStage];
  if (newStatus) {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: newStatus as any }
    });
  }
}

async function sendTeamsWorkflowNotification(job: any, navigation: any) {
  try {
    // Check if Teams integration is enabled
    const teamsIntegration = await prisma.teamsIntegration.findFirst({
      where: { 
        isActive: true,
        workflowUpdatesEnabled: true,
        channelType: 'WORKFLOW_UPDATES'
      }
    });

    if (teamsIntegration) {
      await prisma.teamsMessage.create({
        data: {
          messageContent: `🔄 Workflow Update: Job ${job.jobNumber} navigated from ${navigation.fromStage} to ${navigation.toStage} by ${navigation.performedBy}`,
          messageType: 'workflow_update',
          priority: 'MEDIUM',
          status: 'PENDING',
          workflowContext: {
            jobId: job.id,
            jobNumber: job.jobNumber,
            navigation: navigation
          },
          jobId: job.id,
          integrationId: teamsIntegration.id
        }
      });
    }
  } catch (error) {
    console.error('Teams notification error:', error);
  }
}
