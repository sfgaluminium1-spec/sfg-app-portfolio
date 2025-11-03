
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/memory/messages - List messages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'conversationId is required' },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.message.count({ where: { conversationId } });

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/memory/messages - Create a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, role, content, metadata, tokens } = body;

    if (!conversationId || !role || !content) {
      return NextResponse.json(
        { success: false, error: 'conversationId, role, and content are required' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        role,
        content,
        metadata,
        tokens,
      },
    });

    // Update conversation's last activity time
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastActivityAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
