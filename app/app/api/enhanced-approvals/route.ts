
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Enhanced Multiple Approval Types API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      action, 
      entityType, 
      entityId, 
      approvalType, 
      approvedBy, 
      notes,
      approvalData 
    } = body;

    // Validate input
    if (!action || !entityType || !entityId || !approvalType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action === 'approve' && !approvedBy) {
      return NextResponse.json(
        { error: 'Approver is required for approval action' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'request':
        return await handleApprovalRequest(entityType, entityId, approvalType, approvalData);
      
      case 'approve':
        return await handleApprovalDecision(entityType, entityId, approvalType, 'APPROVED', approvedBy, notes);
      
      case 'reject':
        return await handleApprovalDecision(entityType, entityId, approvalType, 'REJECTED', approvedBy, notes);
      
      case 'status':
        return await getApprovalStatus(entityType, entityId, approvalType);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Enhanced Approvals API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process approval request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const approvalType = searchParams.get('approvalType');
    const status = searchParams.get('status');

    // Get all approvals for entity or filtered by type/status
    let whereClause: any = {};
    
    if (entityType && entityId) {
      whereClause.entityType = entityType;
      whereClause.entityId = entityId;
    }
    
    if (approvalType) {
      whereClause.approvalType = approvalType;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const approvals = await prisma.approval.findMany({
      where: whereClause,
      include: {
        workflow: true,
        quote: true,
        job: true,
        enquiry: true
      },
      orderBy: { requestedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      approvals
    });

  } catch (error) {
    console.error('Get Enhanced Approvals Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve approvals' },
      { status: 500 }
    );
  }
}

// Handle approval request creation
async function handleApprovalRequest(
  entityType: string, 
  entityId: string, 
  approvalType: string, 
  approvalData: any
) {
  // Get or create appropriate workflow
  const workflow = await getOrCreateApprovalWorkflow(approvalType);
  
  // Check if approval already exists
  const existingApproval = await prisma.approval.findFirst({
    where: {
      entityType,
      entityId,
      approvalType: approvalType as string,
      status: { in: ['PENDING', 'REQUIRES_SECOND_APPROVAL'] }
    }
  });

  if (existingApproval) {
    return NextResponse.json({
      success: false,
      message: 'Approval request already exists',
      approval: existingApproval
    });
  }

  // Create new approval request
  const relationField = 
    entityType === 'QUOTE' ? { quoteId: entityId } :
    entityType === 'JOB' ? { jobId: entityId } :
    { enquiryId: entityId };

  const approval = await prisma.approval.create({
    data: {
      approvalType: approvalType as string,
      entityType,
      entityId,
      stage: getInitialStageForApprovalType(approvalType),
      status: 'PENDING',
      priority: approvalData?.priority || 'MEDIUM',
      requiresSecondApproval: approvalData?.requiresSecondApproval || false,
      canSelfApprove: approvalData?.canSelfApprove !== false,
      mandatoryApproval: approvalData?.mandatoryApproval || false,
      requestedBy: approvalData?.requestedBy || 'System',
      requestNotes: approvalData?.notes,
      workflowId: workflow.id,
      ...relationField
    }
  });

  // Update entity approval status
  await updateEntityApprovalStatus(entityType, entityId, approvalType, 'PENDING_APPROVAL');

  // Send Teams notification
  await sendApprovalTeamsNotification(approval, 'REQUEST');

  return NextResponse.json({
    success: true,
    approval,
    message: `${approvalType} approval request created successfully`
  });
}

// Handle approval decision (approve/reject)
async function handleApprovalDecision(
  entityType: string, 
  entityId: string, 
  approvalType: string, 
  decision: string, 
  decidedBy: string, 
  notes?: string
) {
  // Find the pending approval
  const approval = await prisma.approval.findFirst({
    where: {
      entityType,
      entityId,
      approvalType: approvalType as any,
      status: { in: ['PENDING', 'REQUIRES_SECOND_APPROVAL'] }
    },
    include: { workflow: true }
  });

  if (!approval) {
    return NextResponse.json({
      success: false,
      message: 'No pending approval found'
    }, { status: 404 });
  }

  // Check if user can approve this request
  const canApprove = await validateApprovalPermissions(approval, decidedBy);
  if (!canApprove.allowed) {
    return NextResponse.json({
      success: false,
      message: canApprove.reason
    }, { status: 403 });
  }

  // Update approval record
  const updateData: any = {
    status: decision,
    [`${decision.toLowerCase()}By`]: decidedBy,
    [`${decision.toLowerCase()}At`]: new Date(),
    [`${decision === 'APPROVED' ? 'approval' : 'rejection'}Notes`]: notes
  };

  if (decision === 'REJECTED') {
    updateData.rejectionReason = notes;
  }

  const updatedApproval = await prisma.approval.update({
    where: { id: approval.id },
    data: updateData
  });

  // Determine final approval status
  let finalApprovalStatus = decision === 'APPROVED' ? getApprovedStatusForType(approvalType) : 'REJECTED';

  // Handle second approval requirement
  if (decision === 'APPROVED' && approval.requiresSecondApproval && !approval.approvedBy) {
    finalApprovalStatus = 'PENDING_APPROVAL'; // Still pending second approval
    await prisma.approval.update({
      where: { id: approval.id },
      data: { status: 'REQUIRES_SECOND_APPROVAL' }
    });
  }

  // Update entity approval status
  await updateEntityApprovalStatus(entityType, entityId, approvalType, finalApprovalStatus);

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'APPROVAL_DECISION',
      description: `${approvalType} ${decision.toLowerCase()} by ${decidedBy}`,
      user: decidedBy,
      [`${entityType.toLowerCase()}Id`]: entityId,
      metadata: {
        approvalType,
        decision,
        notes,
        approvalId: approval.id
      }
    }
  });

  // Send Teams notification
  await sendApprovalTeamsNotification(updatedApproval, decision);

  return NextResponse.json({
    success: true,
    approval: updatedApproval,
    message: `${approvalType} ${decision.toLowerCase()} successfully`
  });
}

// Get approval status
async function getApprovalStatus(entityType: string, entityId: string, approvalType?: string) {
  const whereClause: any = { entityType, entityId };
  if (approvalType) {
    whereClause.approvalType = approvalType;
  }

  const approvals = await prisma.approval.findMany({
    where: whereClause,
    include: { workflow: true },
    orderBy: { requestedAt: 'desc' }
  });

  // Get entity current approval statuses
  let entityApprovalStatuses: any = {};
  if (entityType === 'QUOTE') {
    const quote = await prisma.quote.findUnique({
      where: { id: entityId },
      select: {
        quoteApprovalStatus: true,
        drawingApprovalStatus: true,
        variationApprovalStatus: true,
        extraItemsApprovalStatus: true
      }
    });
    entityApprovalStatuses = quote;
  }

  return NextResponse.json({
    success: true,
    approvals,
    currentStatuses: entityApprovalStatuses
  });
}

// Helper functions
async function getOrCreateApprovalWorkflow(approvalType: string) {
  let workflow = await prisma.approvalWorkflow.findFirst({
    where: { workflowName: `${approvalType}_APPROVAL` }
  });

  if (!workflow) {
    workflow = await prisma.approvalWorkflow.create({
      data: {
        workflowName: `${approvalType}_APPROVAL`,
        description: `Approval workflow for ${approvalType}`,
        workflowType: 'APPROVAL',
        isActive: true,
        stages: getWorkflowStagesForType(approvalType),
        rules: getWorkflowRulesForType(approvalType)
      }
    });
  }

  return workflow;
}

function getInitialStageForApprovalType(approvalType: string): string {
  const stageMap: { [key: string]: string } = {
    'QUOTE_APPROVAL': 'QUOTE_REVIEW',
    'COSTS_AGREED': 'COST_REVIEW',
    'DRAWING_APPROVAL': 'DRAWING_REVIEW',
    'EXTRA_ITEMS_APPROVAL': 'EXTRA_ITEMS_REVIEW',
    'VARIATIONS_APPROVAL': 'VARIATION_REVIEW'
  };
  return stageMap[approvalType] || 'INITIAL_REVIEW';
}

function getApprovedStatusForType(approvalType: string): string {
  const statusMap: { [key: string]: string } = {
    'QUOTE_APPROVAL': 'QUOTE_APPROVED',
    'COSTS_AGREED': 'COSTS_AGREED',
    'DRAWING_APPROVAL': 'DRAWING_APPROVED',
    'EXTRA_ITEMS_APPROVAL': 'EXTRA_ITEMS_APPROVED',
    'VARIATIONS_APPROVAL': 'VARIATIONS_APPROVED'
  };
  return statusMap[approvalType] || 'FULLY_APPROVED';
}

function getWorkflowStagesForType(approvalType: string): any {
  return [
    {
      name: getInitialStageForApprovalType(approvalType),
      order: 1,
      required: true,
      approvers: ['MANAGER', 'SENIOR_STAFF']
    }
  ];
}

function getWorkflowRulesForType(approvalType: string): any {
  return {
    maxValue: approvalType === 'QUOTE_APPROVAL' ? 50000 : null,
    requiresSecondApproval: approvalType === 'VARIATIONS_APPROVAL',
    timeLimit: 48, // hours
    escalation: {
      enabled: true,
      afterHours: 24
    }
  };
}

async function validateApprovalPermissions(approval: any, decidedBy: string) {
  // Basic validation - in real implementation, check user roles and permissions
  if (approval.mandatoryApproval && approval.requestedBy === decidedBy) {
    return {
      allowed: false,
      reason: 'Cannot self-approve mandatory approval requests'
    };
  }

  return { allowed: true, reason: '' };
}

async function updateEntityApprovalStatus(
  entityType: string, 
  entityId: string, 
  approvalType: string, 
  status: string
) {
  const statusField = 
    approvalType === 'QUOTE_APPROVAL' ? 'quoteApprovalStatus' :
    approvalType === 'DRAWING_APPROVAL' ? 'drawingApprovalStatus' :
    approvalType === 'VARIATIONS_APPROVAL' ? 'variationApprovalStatus' :
    approvalType === 'EXTRA_ITEMS_APPROVAL' ? 'extraItemsApprovalStatus' :
    null;

  if (statusField && entityType === 'QUOTE') {
    await prisma.quote.update({
      where: { id: entityId },
      data: { [statusField]: status }
    });
  }
}

async function sendApprovalTeamsNotification(approval: any, action: string) {
  try {
    const teamsIntegration = await prisma.teamsIntegration.findFirst({
      where: { 
        isActive: true,
        channelType: 'APPROVALS'
      }
    });

    if (teamsIntegration) {
      const messageContent = action === 'REQUEST' 
        ? `🔔 New ${approval.approvalType} approval request for ${approval.entityType} ${approval.entityId}`
        : `✅ ${approval.approvalType} ${action.toLowerCase()} for ${approval.entityType} ${approval.entityId}`;

      await prisma.teamsMessage.create({
        data: {
          messageContent,
          messageType: 'approval_notification',
          priority: approval.priority,
          status: 'PENDING',
          workflowContext: {
            approvalId: approval.id,
            approvalType: approval.approvalType,
            action
          },
          integrationId: teamsIntegration.id
        }
      });
    }
  } catch (error) {
    console.error('Teams approval notification error:', error);
  }
}
