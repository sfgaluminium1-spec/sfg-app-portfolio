
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/memory/knowledge - List knowledge base entries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const tags = searchParams.get('tags')?.split(',');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (category) where.category = category;
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }
    if (search) {
      where.OR = [
        { topic: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const knowledge = await prisma.knowledgeBase.findMany({
      where,
      orderBy: [
        { relevanceScore: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    });

    const total = await prisma.knowledgeBase.count({ where });

    return NextResponse.json({
      success: true,
      data: knowledge,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching knowledge:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/memory/knowledge - Create a new knowledge entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, content, source, category, tags, relevanceScore, metadata } = body;

    if (!topic || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'topic, content, and category are required' },
        { status: 400 }
      );
    }

    const knowledge = await prisma.knowledgeBase.create({
      data: {
        topic,
        content,
        source,
        category,
        tags: tags || [],
        relevanceScore: relevanceScore || 1.0,
        metadata,
      },
    });

    return NextResponse.json({
      success: true,
      data: knowledge,
    });
  } catch (error: any) {
    console.error('Error creating knowledge:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
