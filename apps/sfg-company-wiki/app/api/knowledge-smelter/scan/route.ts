
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '@/lib/auth-providers';
import { sharepointScanner } from '@/lib/knowledge-smelter/scanner';

/**
 * GET /api/knowledge-smelter/scan
 * Scan SharePoint sites
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await sharepointScanner.scanSites();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Failed to scan SharePoint sites', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/knowledge-smelter/scan
 * Queue files from a specific site/drive for processing
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { siteId, driveId, batchId, maxFiles, skipExisting } = body;

    if (!siteId || !driveId || !batchId) {
      return NextResponse.json(
        { error: 'Missing required fields: siteId, driveId, batchId' },
        { status: 400 }
      );
    }

    const queuedCount = await sharepointScanner.scanAndQueueFiles(
      siteId,
      driveId,
      batchId,
      { maxFiles, skipExisting: skipExisting !== false }
    );

    return NextResponse.json({
      success: true,
      queuedCount,
      message: `Queued ${queuedCount} files for processing`
    });
  } catch (error: any) {
    console.error('Queue error:', error);
    return NextResponse.json(
      { error: 'Failed to queue files', details: error.message },
      { status: 500 }
    );
  }
}
