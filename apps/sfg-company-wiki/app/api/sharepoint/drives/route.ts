
import { NextRequest, NextResponse } from 'next/server';
import { microsoftGraphAPI } from '@/lib/microsoft-graph';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { error: 'Query parameter "siteId" is required' },
        { status: 400 }
      );
    }

    const drives = await microsoftGraphAPI.getSiteDrives(siteId);
    return NextResponse.json(drives);
  } catch (error: any) {
    console.error('SharePoint drives error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch drives' },
      { status: 500 }
    );
  }
}
