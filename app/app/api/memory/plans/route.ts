
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/memory/plans - List all plans
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (conversationId) where.conversationId = conversationId;
    if (status) where.status = status;

    const plans = await prisma.plan.findMany({
      where,
      include: {
        conversation: {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
        decisions: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.plan.count({ where });

    return NextResponse.json({
      success: true,
      data: plans,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/memory/plans - Create a new plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, title, description, status, priority, metadata } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'title and description are required' },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.create({
      data: {
        conversationId,
        title,
        description,
        status: status || 'PENDING',
        priority: priority || 'MEDIUM',
        metadata,
      },
    });

    return NextResponse.json({
      success: true,
      data: plan,
    });
  } catch (error: any) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
