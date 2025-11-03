
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '@/lib/auth-providers';
import { batchProcessor } from '@/lib/knowledge-smelter/batch-processor';

/**
 * GET /api/knowledge-smelter/batch
 * Get all batches
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const batches = await batchProcessor.getAllBatches();
    return NextResponse.json(batches);
  } catch (error: any) {
    console.error('Get batches error:', error);
    return NextResponse.json(
      { error: 'Failed to get batches', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/knowledge-smelter/batch
 * Create a new batch
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = await request.json();
    
    if (!config.batchName || !config.sourceLocation || !config.siteId || !config.driveId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const batch = await batchProcessor.createBatch(config);
    return NextResponse.json(batch);
  } catch (error: any) {
    console.error('Create batch error:', error);
    return NextResponse.json(
      { error: 'Failed to create batch', details: error.message },
      { status: 500 }
    );
  }
}
