
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; checkId: string }> }
) {
  try {
    const { id: jobId, checkId } = await params;
    const body = await request.json();
    const { verifierType, verifiedBy, passed, notes, errorsFound, correctiveActions } = body;

    const updateData: any = {};

    if (verifierType === 'primary') {
      updateData.primaryChecker = verifiedBy;
      updateData.primaryCheckPassed = passed;
      updateData.primaryCheckAt = new Date();
      updateData.primaryCheckNotes = notes;
    } else if (verifierType === 'secondary') {
      updateData.secondaryChecker = verifiedBy;
      updateData.secondaryCheckPassed = passed;
      updateData.secondaryCheckAt = new Date();
      updateData.secondaryCheckNotes = notes;
    }

    if (errorsFound) {
      updateData.errorsFound = errorsFound;
    }

    if (correctiveActions) {
      updateData.correctiveActions = correctiveActions;
    }

    // Check if both verifications are complete
    const currentCheck = await prisma.qualityCheck.findUnique({
      where: { id: checkId }
    });

    if (currentCheck) {
      const primaryComplete = verifierType === 'primary' ? passed : currentCheck.primaryCheckPassed;
      const secondaryComplete = verifierType === 'secondary' ? passed : currentCheck.secondaryCheckPassed;

      if (primaryComplete && secondaryComplete) {
        updateData.overallPassed = true;
        updateData.completedAt = new Date();
        updateData.status = 'PASSED';
      } else if ((verifierType === 'primary' && !passed) || (verifierType === 'secondary' && !passed)) {
        updateData.overallPassed = false;
        updateData.status = 'FAILED';
      }
    }

    const qualityCheck = await prisma.qualityCheck.update({
      where: { id: checkId },
      data: updateData
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'JOB_UPDATED',
        description: `Quality check ${verifierType} verification by ${verifiedBy}: ${passed ? 'PASSED' : 'FAILED'}`,
        user: verifiedBy,
        jobId
      }
    });

    return NextResponse.json({ 
      qualityCheck,
      message: `${verifierType} verification completed`
    });
  } catch (error) {
    console.error('Quality check verification error:', error);
    return NextResponse.json({ error: 'Failed to verify quality check' }, { status: 500 });
  }
}
