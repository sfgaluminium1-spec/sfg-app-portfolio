
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/memory/context - Get context by key or list all
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');
    const category = searchParams.get('category');

    if (key) {
      // Get specific context by key
      const context = await prisma.context.findUnique({
        where: { key },
      });

      if (!context) {
        return NextResponse.json(
          { success: false, error: 'Context not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: context,
      });
    }

    // List all contexts
    const where: any = {};
    if (category) where.category = category;

    const contexts = await prisma.context.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: contexts,
    });
  } catch (error: any) {
    console.error('Error fetching context:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/memory/context - Create or update context
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, category, expiresAt, metadata } = body;

    if (!key || !value || !category) {
      return NextResponse.json(
        { success: false, error: 'key, value, and category are required' },
        { status: 400 }
      );
    }

    const context = await prisma.context.upsert({
      where: { key },
      update: {
        value,
        category,
        expiresAt,
        metadata,
      },
      create: {
        key,
        value,
        category,
        expiresAt,
        metadata,
      },
    });

    return NextResponse.json({
      success: true,
      data: context,
    });
  } catch (error: any) {
    console.error('Error creating/updating context:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/memory/context - Delete context by key
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'key is required' },
        { status: 400 }
      );
    }

    await prisma.context.delete({
      where: { key },
    });

    return NextResponse.json({
      success: true,
      message: 'Context deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting context:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
