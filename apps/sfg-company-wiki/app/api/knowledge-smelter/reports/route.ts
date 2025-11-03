
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { buildAuthOptions } from '@/lib/auth-providers';
import { prisma } from '@/lib/db';
import { autoTagger } from '@/lib/knowledge-smelter/auto-tagger';
import { sharepointScanner } from '@/lib/knowledge-smelter/scanner';

/**
 * GET /api/knowledge-smelter/reports
 * Generate processing reports
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(await buildAuthOptions());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'summary';

    switch (reportType) {
      case 'summary':
        return NextResponse.json(await generateSummaryReport());
      case 'batch':
        const batchId = searchParams.get('batchId');
        if (!batchId) {
          return NextResponse.json({ error: 'batchId required' }, { status: 400 });
        }
        return NextResponse.json(await generateBatchReport(batchId));
      case 'classification':
        return NextResponse.json(await generateClassificationReport());
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Generate summary report
 */
async function generateSummaryReport() {
  const [
    totalFiles,
    totalSize,
    byStatus,
    byFileType,
    byConfidence,
    tagStats,
    scanStats
  ] = await Promise.all([
    prisma.archivedFile.count(),
    prisma.archivedFile.aggregate({
      _sum: { fileSize: true }
    }),
    prisma.archivedFile.groupBy({
      by: ['processingStatus'],
      _count: true
    }),
    prisma.archivedFile.groupBy({
      by: ['fileType'],
      _count: true
    }),
    Promise.all([
      prisma.archivedFile.count({ where: { confidence: { gte: 85 } } }),
      prisma.archivedFile.count({ where: { confidence: { gte: 50, lt: 85 } } }),
      prisma.archivedFile.count({ where: { confidence: { lt: 50 } } })
    ]),
    autoTagger.getTagStats(),
    sharepointScanner.getScanStats()
  ]);

  return {
    overview: {
      totalFiles,
      totalSizeGB: Number(totalSize._sum.fileSize || 0) / (1024 * 1024 * 1024),
      processingComplete: byStatus.find(s => s.processingStatus === 'COMPLETED')?._count || 0
    },
    processingStatus: byStatus,
    fileTypes: byFileType,
    confidence: {
      high: byConfidence[0],
      medium: byConfidence[1],
      low: byConfidence[2]
    },
    tags: tagStats,
    scan: scanStats,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generate batch report
 */
async function generateBatchReport(batchId: string) {
  const batch = await prisma.processingBatch.findUnique({
    where: { id: batchId },
    include: {
      files: {
        include: { tags: true }
      }
    }
  });

  if (!batch) {
    throw new Error('Batch not found');
  }

  const byFileType = batch.files.reduce((acc, file) => {
    acc[file.fileType] = (acc[file.fileType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageConfidence = batch.files.reduce((sum, f) => sum + f.confidence, 0) / batch.files.length;

  return {
    batch: {
      id: batch.id,
      name: batch.batchName,
      status: batch.status,
      startedAt: batch.startedAt,
      completedAt: batch.completedAt,
      duration: batch.actualDuration
    },
    statistics: {
      totalFiles: batch.filesQueued,
      processed: batch.filesProcessed,
      succeeded: batch.filesSucceeded,
      failed: batch.filesFailed,
      averageConfidence
    },
    fileTypes: byFileType,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generate classification report
 */
async function generateClassificationReport() {
  const files = await prisma.archivedFile.findMany({
    select: {
      fileType: true,
      confidence: true,
      classificationMethod: true
    }
  });

  const byMethod = files.reduce((acc, file) => {
    acc[file.classificationMethod] = (acc[file.classificationMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const confidenceDistribution = {
    '0-25': 0,
    '26-50': 0,
    '51-75': 0,
    '76-85': 0,
    '86-100': 0
  };

  files.forEach(file => {
    if (file.confidence <= 25) confidenceDistribution['0-25']++;
    else if (file.confidence <= 50) confidenceDistribution['26-50']++;
    else if (file.confidence <= 75) confidenceDistribution['51-75']++;
    else if (file.confidence <= 85) confidenceDistribution['76-85']++;
    else confidenceDistribution['86-100']++;
  });

  return {
    totalFiles: files.length,
    byMethod,
    confidenceDistribution,
    averageConfidence: files.reduce((sum, f) => sum + f.confidence, 0) / files.length,
    generatedAt: new Date().toISOString()
  };
}
