
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

    const drawings = await prisma.drawingApproval.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
      include: {
        materialsAnalysis: true
      }
    });

    return NextResponse.json({ drawings });
  } catch (error) {
    console.error('Job drawings API error:', error);
    return NextResponse.json({ error: 'Failed to fetch drawings' }, { status: 500 });
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

    const drawing = await prisma.drawingApproval.create({
      data: {
        jobId,
        drawingName: body.drawingName,
        drawingVersion: body.drawingVersion || '1.0',
        drawingType: body.drawingType,
        fileUrl: body.fileUrl,
        fileSize: body.fileSize,
        status: 'UPLOADED',
        currentStage: 'CUSTOMER_UPLOAD',
        isLatestVersion: true
      }
    });

    // Mark any previous versions as not latest
    if (body.previousVersionId) {
      await prisma.drawingApproval.update({
        where: { id: body.previousVersionId },
        data: { isLatestVersion: false }
      });
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'JOB_UPDATED',
        description: `Drawing uploaded: ${body.drawingName}`,
        user: body.uploadedBy || 'System',
        jobId
      }
    });

    return NextResponse.json({ drawing });
  } catch (error) {
    console.error('Upload drawing error:', error);
    return NextResponse.json({ error: 'Failed to upload drawing' }, { status: 500 });
  }
}
