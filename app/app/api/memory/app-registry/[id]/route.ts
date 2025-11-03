
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/memory/app-registry/[id] - Get a specific app
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = await prisma.appRegistry.findUnique({
      where: { id: params.id },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, error: 'App not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: app,
    });
  } catch (error: any) {
    console.error('Error fetching app:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/memory/app-registry/[id] - Update an app
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updateData: any = {};
    if (body.appName !== undefined) updateData.appName = body.appName;
    if (body.appType !== undefined) updateData.appType = body.appType;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.baseUrl !== undefined) updateData.baseUrl = body.baseUrl;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.technologies !== undefined) updateData.technologies = body.technologies;
    if (body.owner !== undefined) updateData.owner = body.owner;
    if (body.repositoryPath !== undefined) updateData.repositoryPath = body.repositoryPath;
    if (body.apiEndpoints !== undefined) updateData.apiEndpoints = body.apiEndpoints;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;

    const app = await prisma.appRegistry.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: app,
    });
  } catch (error: any) {
    console.error('Error updating app:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/memory/app-registry/[id] - Delete an app
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.appRegistry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'App deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting app:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
