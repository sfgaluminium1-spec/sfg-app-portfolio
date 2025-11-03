
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/memory/decisions - List all decisions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');
    const planId = searchParams.get('planId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (conversationId) where.conversationId = conversationId;
    if (planId) where.planId = planId;

    const decisions = await prisma.decision.findMany({
      where,
      include: {
        conversation: {
          select: {
            id: true,
            title: true,
          },
        },
        plan: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { madeAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.decision.count({ where });

    return NextResponse.json({
      success: true,
      data: decisions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching decisions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/memory/decisions - Create a new decision
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, planId, title, description, rationale, madeBy, impact, metadata } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'title and description are required' },
        { status: 400 }
      );
    }

    const decision = await prisma.decision.create({
      data: {
        conversationId,
        planId,
        title,
        description,
        rationale,
        madeBy,
        impact: impact || 'MEDIUM',
        metadata,
      },
    });

    return NextResponse.json({
      success: true,
      data: decision,
    });
  } catch (error: any) {
    console.error('Error creating decision:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
