
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '@/lib/auth-providers';
import { batchProcessor } from '@/lib/knowledge-smelter/batch-processor';

/**
 * GET /api/knowledge-smelter/batch/[id]/progress
 * Get batch progress
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const progress = await batchProcessor.getBatchProgress(params.id);
    return NextResponse.json(progress);
  } catch (error: any) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Failed to get progress', details: error.message },
      { status: 500 }
    );
  }
}
