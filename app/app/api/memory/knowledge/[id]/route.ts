
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/memory/knowledge/[id] - Get a specific knowledge entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const knowledge = await prisma.knowledgeBase.findUnique({
      where: { id: params.id },
    });

    if (!knowledge) {
      return NextResponse.json(
        { success: false, error: 'Knowledge entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: knowledge,
    });
  } catch (error: any) {
    console.error('Error fetching knowledge:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/memory/knowledge/[id] - Update a knowledge entry
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updateData: any = {};
    if (body.topic !== undefined) updateData.topic = body.topic;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.source !== undefined) updateData.source = body.source;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.relevanceScore !== undefined) updateData.relevanceScore = body.relevanceScore;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;

    const knowledge = await prisma.knowledgeBase.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: knowledge,
    });
  } catch (error: any) {
    console.error('Error updating knowledge:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/memory/knowledge/[id] - Delete a knowledge entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.knowledgeBase.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Knowledge entry deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting knowledge:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
