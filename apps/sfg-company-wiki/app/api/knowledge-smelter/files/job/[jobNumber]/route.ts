
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '@/lib/auth-providers';
import { relationshipMapper } from '@/lib/knowledge-smelter/relationship-mapper';

/**
 * GET /api/knowledge-smelter/files/job/[jobNumber]
 * Reconstruct all files for a job
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { jobNumber: string } }
) {
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const jobFolder = await relationshipMapper.reconstructJobFolder(params.jobNumber);
    return NextResponse.json(jobFolder);
  } catch (error: any) {
    console.error('Reconstruct job error:', error);
    return NextResponse.json(
      { error: 'Failed to reconstruct job folder', details: error.message },
      { status: 500 }
    );
  }
}
