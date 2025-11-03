
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '@/lib/auth-providers';
import { prisma } from '@/lib/db';
import { relationshipMapper } from '@/lib/knowledge-smelter/relationship-mapper';

/**
 * GET /api/knowledge-smelter/files/[id]
 * Get file details with tags and relationships
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
    const file = await prisma.archivedFile.findUnique({
      where: { id: params.id },
      include: {
        tags: true,
        batch: true
      }
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const relationships = await relationshipMapper.getFileRelationships(params.id);

    return NextResponse.json({
      ...file,
      relationships
    });
  } catch (error: any) {
    console.error('Get file error:', error);
    return NextResponse.json(
      { error: 'Failed to get file', details: error.message },
      { status: 500 }
    );
  }
}
