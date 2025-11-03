
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, approvedBy, rejectedBy, notes } = body;
    const quoteId = id;

    if (action === 'approve') {
      // Update quote status to approved
      const updatedQuote = await prisma.quote.update({
        where: { id: quoteId },
        data: {
          status: 'WON',
          approvalStatus: 'APPROVED'
        }
      });

      // Update approval record
      await prisma.approval.updateMany({
        where: {
          entityType: 'QUOTE',
          entityId: quoteId,
          status: 'PENDING'
        },
        data: {
          status: 'APPROVED',
          approvedBy: approvedBy || 'System',
          approvedAt: new Date(),
          approvalNotes: notes || 'Quote approved'
        }
      });

      // Create activity log
      await prisma.activity.create({
        data: {
          type: 'STATUS_CHANGED',
          description: `Quote ${updatedQuote.quoteNumber} approved by ${approvedBy || 'System'}`,
          user: approvedBy || 'System',
          quoteId: quoteId
        }
      });

      return NextResponse.json({ 
        success: true, 
        quote: updatedQuote,
        message: 'Quote approved successfully'
      });

    } else if (action === 'reject') {
      // Update quote status to rejected
      const updatedQuote = await prisma.quote.update({
        where: { id: quoteId },
        data: {
          status: 'LOST',
          approvalStatus: 'REJECTED'
        }
      });

      // Update approval record
      await prisma.approval.updateMany({
        where: {
          entityType: 'QUOTE',
          entityId: quoteId,
          status: 'PENDING'
        },
        data: {
          status: 'REJECTED',
          rejectedBy: rejectedBy || 'System',
          rejectedAt: new Date(),
          rejectionReason: notes || 'Quote rejected'
        }
      });

      // Create activity log
      await prisma.activity.create({
        data: {
          type: 'STATUS_CHANGED',
          description: `Quote ${updatedQuote.quoteNumber} rejected by ${rejectedBy || 'System'}${notes ? `: ${notes}` : ''}`,
          user: rejectedBy || 'System',
          quoteId: quoteId
        }
      });

      return NextResponse.json({ 
        success: true, 
        quote: updatedQuote,
        message: 'Quote rejected successfully'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Quote approval error:', error);
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 });
  }
}
