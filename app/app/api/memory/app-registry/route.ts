
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/memory/app-registry - List all applications
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const appType = searchParams.get('appType');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (appType) where.appType = appType;
    if (status) where.status = status;

    const apps = await prisma.appRegistry.findMany({
      where,
      orderBy: { registeredAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.appRegistry.count({ where });

    return NextResponse.json({
      success: true,
      data: apps,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching apps:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/memory/app-registry - Register a new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appName, appType, description, baseUrl, status, technologies, owner, repositoryPath, apiEndpoints, metadata } = body;

    if (!appName || !appType) {
      return NextResponse.json(
        { success: false, error: 'appName and appType are required' },
        { status: 400 }
      );
    }

    const app = await prisma.appRegistry.create({
      data: {
        appName,
        appType,
        description,
        baseUrl,
        status: status || 'ACTIVE',
        technologies,
        owner,
        repositoryPath,
        apiEndpoints,
        metadata,
      },
    });

    return NextResponse.json({
      success: true,
      data: app,
    });
  } catch (error: any) {
    console.error('Error registering app:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
