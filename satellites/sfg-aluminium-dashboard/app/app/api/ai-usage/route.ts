
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const aiUsage = await prisma.aIModelUsage.groupBy({
      by: ['modelName'],
      _sum: {
        requests: true,
      },
      where: {
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const formattedData = aiUsage.map((usage: any) => ({
      name: usage.modelName,
      value: usage._sum.requests || 0,
      requests: usage._sum.requests || 0,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('AI usage API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI usage data' },
      { status: 500 }
    );
  }
}
