
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '@/lib/auth-providers';
import { prisma } from '@/lib/db';

/**
 * GET /api/knowledge-smelter/search
 * Search archived files
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const jobNumber = searchParams.get('jobNumber');
    const customer = searchParams.get('customer');
    const fileType = searchParams.get('fileType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};

    if (query) {
      where.OR = [
        { fileName: { contains: query, mode: 'insensitive' } },
        { textContent: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (jobNumber) {
      where.jobNumber = jobNumber;
    }

    if (customer) {
      where.customerName = { contains: customer, mode: 'insensitive' };
    }

    if (fileType) {
      where.fileType = fileType;
    }

    const [files, total] = await Promise.all([
      prisma.archivedFile.findMany({
        where,
        include: {
          tags: true,
          relationships: {
            include: { targetFile: true }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.archivedFile.count({ where })
    ]);

    return NextResponse.json({
      files,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}
