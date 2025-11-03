
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

    const qualityChecks = await prisma.qualityCheck.findMany({
      where: { jobId },
      include: {
        workflowStep: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ qualityChecks });
  } catch (error) {
    console.error('Quality checks API error:', error);
    return NextResponse.json({ error: 'Failed to fetch quality checks' }, { status: 500 });
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

    const qualityCheck = await prisma.qualityCheck.create({
      data: {
        jobId,
        checkType: body.checkType,
        checkName: body.checkName,
        description: body.description,
        workflowStepId: body.workflowStepId
      }
    });

    return NextResponse.json({ qualityCheck });
  } catch (error) {
    console.error('Create quality check error:', error);
    return NextResponse.json({ error: 'Failed to create quality check' }, { status: 500 });
  }
}
