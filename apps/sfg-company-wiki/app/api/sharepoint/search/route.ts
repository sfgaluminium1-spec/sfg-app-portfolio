
import { NextRequest, NextResponse } from 'next/server';
import { microsoftGraphAPI } from '@/lib/microsoft-graph';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const siteId = searchParams.get('siteId');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const results = await microsoftGraphAPI.searchFiles(query, siteId || undefined);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('SharePoint search error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search files' },
      { status: 500 }
    );
  }
}
