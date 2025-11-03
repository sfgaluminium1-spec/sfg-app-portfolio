
import { NextRequest, NextResponse } from 'next/server';
import { microsoftGraphAPI } from '@/lib/microsoft-graph';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    const files = await microsoftGraphAPI.getRecentFiles(limit);
    return NextResponse.json(files);
  } catch (error: any) {
    console.error('SharePoint recent files error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recent files' },
      { status: 500 }
    );
  }
}
