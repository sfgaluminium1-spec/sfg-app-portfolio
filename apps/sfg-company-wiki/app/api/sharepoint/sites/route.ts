
import { NextRequest, NextResponse } from 'next/server';
import { microsoftGraphAPI } from '@/lib/microsoft-graph';

export async function GET(request: NextRequest) {
  try {
    const sites = await microsoftGraphAPI.getSites();
    return NextResponse.json(sites);
  } catch (error: any) {
    console.error('SharePoint sites error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch SharePoint sites' },
      { status: 500 }
    );
  }
}
