
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    const jobId = id;

    // Update job status
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: status,
        updatedAt: new Date()
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'JOB_UPDATED',
        description: `Job ${updatedJob.jobNumber} status updated to ${status}`,
        user: 'Current User', // In real app, get from auth
        jobId: jobId
      }
    });

    return NextResponse.json({ 
      success: true, 
      job: updatedJob,
      message: 'Job status updated successfully'
    });

  } catch (error) {
    console.error('Job status update error:', error);
    return NextResponse.json({ error: 'Failed to update job status' }, { status: 500 });
  }
}
