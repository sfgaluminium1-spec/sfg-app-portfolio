
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

    const communications = await prisma.jobCommunication.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
      include: {
        workflowStep: true
      }
    });

    return NextResponse.json({ communications });
  } catch (error) {
    console.error('Job communications API error:', error);
    return NextResponse.json({ error: 'Failed to fetch communications' }, { status: 500 });
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

    const communication = await prisma.jobCommunication.create({
      data: {
        jobId,
        communicationType: body.communicationType,
        direction: body.direction || 'OUTBOUND',
        subject: body.subject,
        message: body.message,
        method: body.method || 'EMAIL',
        fromUser: body.fromUser,
        toCustomer: body.toCustomer,
        ccUsers: body.ccUsers || [],
        status: body.status || 'SENT',
        attachments: body.attachments || [],
        documentIds: body.documentIds || [],
        requiresFollowUp: body.requiresFollowUp || false,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        followUpNotes: body.followUpNotes,
        templateUsed: body.templateUsed,
        isAutomated: body.isAutomated || false,
        workflowStepId: body.workflowStepId
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'JOB_UPDATED',
        description: `New communication: ${body.subject || body.communicationType}`,
        user: body.fromUser || 'System',
        jobId
      }
    });

    // Send MS Teams notification if configured
    if (body.notifyTeams) {
      try {
        await fetch('/api/notifications/teams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Job Communication - ${body.subject}`,
            message: `New communication for Job ${jobId}: ${body.message}`,
            recipient: 'sales@sfg-aluminium.co.uk',
            jobId,
            communicationId: communication.id
          })
        });
      } catch (error) {
        console.error('Failed to send Teams notification:', error);
      }
    }

    return NextResponse.json({ communication });
  } catch (error) {
    console.error('Create communication error:', error);
    return NextResponse.json({ error: 'Failed to create communication' }, { status: 500 });
  }
}
