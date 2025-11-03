
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/memory/instructions - List all instructions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (category) where.category = category;
    if (priority) where.priority = priority;

    const instructions = await prisma.instruction.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { usageCount: 'desc' },
      ],
      take: limit,
      skip: offset,
    });

    const total = await prisma.instruction.count({ where });

    return NextResponse.json({
      success: true,
      data: instructions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching instructions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/memory/instructions - Create a new instruction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, priority, metadata } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'title, content, and category are required' },
        { status: 400 }
      );
    }

    const instruction = await prisma.instruction.create({
      data: {
        title,
        content,
        category,
        priority: priority || 'MEDIUM',
        metadata,
      },
    });

    return NextResponse.json({
      success: true,
      data: instruction,
    });
  } catch (error: any) {
    console.error('Error creating instruction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
