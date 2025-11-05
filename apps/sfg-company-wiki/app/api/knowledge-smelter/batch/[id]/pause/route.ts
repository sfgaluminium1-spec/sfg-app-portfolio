
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '@/lib/auth-providers';
import { batchProcessor } from '@/lib/knowledge-smelter/batch-processor';

/**
 * POST /api/knowledge-smelter/batch/[id]/pause
 * Pause batch processing
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await batchProcessor.pauseBatch(params.id);
    return NextResponse.json({
      success: true,
      message: 'Batch paused'
    });
  } catch (error: any) {
    console.error('Pause batch error:', error);
    return NextResponse.json(
      { error: 'Failed to pause batch', details: error.message },
      { status: 500 }
    );
  }
}
