
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const approval = await prisma.approval.findUnique({
      where: { id: id },
      include: {
        workflow: true,
        quote: {
          include: {
            validation: true,
            lineItems: true
          }
        },
        job: true,
        enquiry: true
      }
    });

    if (!approval) {
      return NextResponse.json({ error: 'Approval not found' }, { status: 404 });
    }

    return NextResponse.json(approval);
  } catch (error) {
    console.error('Get approval error:', error);
    return NextResponse.json({ error: 'Failed to fetch approval' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, approvedBy, notes, validationResults } = body;

    const approval = await prisma.approval.findUnique({
      where: { id: id },
      include: { quote: true }
    });

    if (!approval) {
      return NextResponse.json({ error: 'Approval not found' }, { status: 404 });
    }

    // Check if user can approve
    if (approval.mandatoryApproval && approval.requestedBy === approvedBy) {
      return NextResponse.json({ 
        error: 'Cannot self-approve mandatory approval items' 
      }, { status: 403 });
    }

    let updateData: any = {};

    if (action === 'approve') {
      updateData = {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date(),
        approvalNotes: notes
      };

      // Update quote approval status if this is a quote approval
      if (approval.entityType === 'QUOTE' && approval.quoteId) {
        await prisma.quote.update({
          where: { id: approval.quoteId },
          data: { approvalStatus: 'APPROVED' }
        });
      }
    } else if (action === 'reject') {
      updateData = {
        status: 'REJECTED',
        rejectedBy: approvedBy,
        rejectedAt: new Date(),
        rejectionReason: notes
      };

      // Update quote approval status if this is a quote approval
      if (approval.entityType === 'QUOTE' && approval.quoteId) {
        await prisma.quote.update({
          where: { id: approval.quoteId },
          data: { approvalStatus: 'REJECTED' }
        });
      }
    }

    const updatedApproval = await prisma.approval.update({
      where: { id: id },
      data: updateData,
      include: {
        workflow: true,
        quote: true,
        job: true,
        enquiry: true
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: action === 'approve' ? 'QUOTE_GENERATED' : 'QUOTE_GENERATED',
        description: `Approval ${action}d by ${approvedBy}${notes ? `: ${notes}` : ''}`,
        user: approvedBy,
        quoteId: approval.quoteId,
        jobId: approval.jobId,
        enquiryId: approval.enquiryId
      }
    });

    return NextResponse.json(updatedApproval);
  } catch (error) {
    console.error('Update approval error:', error);
    return NextResponse.json({ error: 'Failed to update approval' }, { status: 500 });
  }
}
