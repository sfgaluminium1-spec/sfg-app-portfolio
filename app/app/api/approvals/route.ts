
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');

    const where: any = {};
    
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (status) where.status = status;

    const approvals = await prisma.approval.findMany({
      where,
      include: {
        workflow: true,
        quote: true,
        job: true,
        enquiry: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ approvals });
  } catch (error) {
    console.error('Approvals API error:', error);
    return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Get the appropriate workflow
    const workflow = await prisma.approvalWorkflow.findFirst({
      where: {
        workflowType: body.workflowType || 'QUOTE_APPROVAL',
        isActive: true
      }
    });

    if (!workflow) {
      return NextResponse.json({ error: 'No active workflow found' }, { status: 400 });
    }

    // Determine approval requirements based on quote type and value
    const requiresSecondApproval = body.value > 25000 || body.quoteType === 'SUPPLY_AND_INSTALL';
    const mandatoryApproval = body.quoteType === 'SUPPLY_AND_INSTALL' || body.value > 50000;

    const approval = await prisma.approval.create({
      data: {
        approvalType: body.approvalType || 'QUOTE_CREATION',
        entityType: body.entityType || 'QUOTE',
        entityId: body.entityId,
        stage: body.stage || 'creation',
        status: 'PENDING',
        priority: body.priority || 'MEDIUM',
        requiresSecondApproval,
        canSelfApprove: !mandatoryApproval,
        mandatoryApproval,
        requestedBy: body.requestedBy || 'System',
        requestNotes: body.requestNotes,
        validationItems: JSON.stringify(body.validationItems || []),
        workflowId: workflow.id,
        quoteId: body.entityType === 'QUOTE' ? body.entityId : null,
        jobId: body.entityType === 'JOB' ? body.entityId : null,
        enquiryId: body.entityType === 'ENQUIRY' ? body.entityId : null
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'QUOTE_GENERATED',
        description: `Approval request created for ${body.entityType} ${body.entityId}`,
        user: body.requestedBy || 'System',
        quoteId: body.entityType === 'QUOTE' ? body.entityId : null,
        jobId: body.entityType === 'JOB' ? body.entityId : null,
        enquiryId: body.entityType === 'ENQUIRY' ? body.entityId : null
      }
    });

    return NextResponse.json(approval);
  } catch (error) {
    console.error('Create approval error:', error);
    return NextResponse.json({ error: 'Failed to create approval' }, { status: 500 });
  }
}
