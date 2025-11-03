
import { NextRequest, NextResponse } from 'next/server';
import { microsoftGraphAPI } from '@/lib/microsoft-graph';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const siteId = searchParams.get('siteId');
    const driveId = searchParams.get('driveId');
    const itemId = searchParams.get('itemId');

    if (!siteId || !driveId || !itemId) {
      return NextResponse.json(
        { error: 'Query parameters "siteId", "driveId", and "itemId" are required' },
        { status: 400 }
      );
    }

    const downloadUrl = await microsoftGraphAPI.getFileDownloadUrl(siteId, driveId, itemId);
    return NextResponse.json({ downloadUrl });
  } catch (error: any) {
    console.error('SharePoint download error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get download URL' },
      { status: 500 }
    );
  }
}
