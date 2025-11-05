
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '@/lib/auth-providers';
import { batchProcessor } from '@/lib/knowledge-smelter/batch-processor';

/**
 * POST /api/knowledge-smelter/batch/[id]/start
 * Start batch processing
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
    const batchId = params.id;
    
    // Start processing asynchronously (don't wait for completion)
    batchProcessor.startBatch(batchId).catch(err => {
      console.error('Batch processing error:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Batch processing started'
    });
  } catch (error: any) {
    console.error('Start batch error:', error);
    return NextResponse.json(
      { error: 'Failed to start batch', details: error.message },
      { status: 500 }
    );
  }
}
