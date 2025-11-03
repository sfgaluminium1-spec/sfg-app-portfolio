
import { NextRequest, NextResponse } from 'next/server';
import { microsoftGraphAPI } from '@/lib/microsoft-graph';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const siteId = searchParams.get('siteId');
    const driveId = searchParams.get('driveId');
    const itemPath = searchParams.get('path');

    if (!siteId || !driveId) {
      return NextResponse.json(
        { error: 'Query parameters "siteId" and "driveId" are required' },
        { status: 400 }
      );
    }

    const files = await microsoftGraphAPI.getDriveItems(
      siteId,
      driveId,
      itemPath || undefined
    );
    return NextResponse.json(files);
  } catch (error: any) {
    console.error('SharePoint files error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
