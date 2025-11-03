
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; drawingId: string }> }
) {
  try {
    const { id: jobId, drawingId } = await params;
    const body = await request.json();
    const { approvalType, approvedBy, notes, stage } = body;

    const updateData: any = {};
    
    switch (approvalType) {
      case 'customer':
        updateData.customerApproved = true;
        updateData.customerApprovedAt = new Date();
        updateData.customerApprovedBy = approvedBy;
        updateData.customerNotes = notes;
        updateData.currentStage = 'TECHNICAL_REVIEW';
        break;
        
      case 'technical':
        updateData.technicalReviewed = true;
        updateData.technicalReviewedAt = new Date();
        updateData.technicalReviewedBy = approvedBy;
        updateData.technicalNotes = notes;
        updateData.currentStage = 'PRODUCTION_REVIEW';
        break;
        
      case 'production':
        updateData.productionReviewed = true;
        updateData.productionReviewedAt = new Date();
        updateData.productionReviewedBy = approvedBy;
        updateData.productionNotes = notes;
        updateData.currentStage = 'CUTTING_LIST_VERIFICATION';
        break;
        
      case 'cutting_list':
        updateData.cuttingListVerified = true;
        updateData.cuttingListVerifiedAt = new Date();
        updateData.cuttingListVerifiedBy = approvedBy;
        updateData.cuttingListNotes = notes;
        updateData.currentStage = 'GLASS_SIZES_VERIFICATION';
        break;
        
      case 'glass_sizes':
        updateData.glassSizesVerified = true;
        updateData.glassSizesVerifiedAt = new Date();
        updateData.glassSizesVerifiedBy = approvedBy;
        updateData.glassSizesNotes = notes;
        updateData.currentStage = 'FINAL_APPROVAL';
        break;
        
      case 'final':
        updateData.finalApproved = true;
        updateData.finalApprovedAt = new Date();
        updateData.finalApprovedBy = approvedBy;
        updateData.finalNotes = notes;
        updateData.status = 'APPROVED';
        break;
    }

    const drawing = await prisma.drawingApproval.update({
      where: { id: drawingId },
      data: updateData
    });

    // Check if all approvals are complete
    if (drawing.finalApproved) {
      // Update job drawing status
      await prisma.job.update({
        where: { id: jobId },
        data: { drawingStatus: 'APPROVED' }
      });

      // Trigger materials analysis if not already started
      const existingAnalysis = await prisma.materialsAnalysis.findFirst({
        where: { jobId }
      });

      if (!existingAnalysis) {
        await prisma.materialsAnalysis.create({
          data: {
            jobId,
            drawingApprovalId: drawingId,
            analysisType: 'DRAWING_BASED',
            status: 'PENDING'
          }
        });
      }
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'JOB_UPDATED',
        description: `Drawing ${approvalType} approval completed by ${approvedBy}`,
        user: approvedBy,
        jobId
      }
    });

    // Send notification to next approver or team
    const notificationMessage = `Drawing approval (${approvalType}) completed for Job ${jobId}`;
    
    try {
      await fetch('/api/notifications/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Drawing Approval Update',
          message: notificationMessage,
          recipient: 'sales@sfg-aluminium.co.uk',
          jobId,
          drawingId
        })
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    return NextResponse.json({ 
      drawing, 
      message: `${approvalType} approval completed successfully` 
    });
  } catch (error) {
    console.error('Drawing approval error:', error);
    return NextResponse.json({ error: 'Failed to approve drawing' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; drawingId: string }> }
) {
  try {
    const { id: jobId, drawingId } = await params;
    const body = await request.json();
    const { rejectedBy, rejectionReason } = body;

    const drawing = await prisma.drawingApproval.update({
      where: { id: drawingId },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date(),
        rejectedBy,
        rejectionReason
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'JOB_UPDATED',
        description: `Drawing rejected: ${rejectionReason}`,
        user: rejectedBy,
        jobId
      }
    });

    return NextResponse.json({ 
      drawing, 
      message: 'Drawing rejected successfully' 
    });
  } catch (error) {
    console.error('Drawing rejection error:', error);
    return NextResponse.json({ error: 'Failed to reject drawing' }, { status: 500 });
  }
}
