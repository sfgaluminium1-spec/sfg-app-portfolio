
import { NextRequest, NextResponse } from 'next/server';
import { companiesHouseAPI } from '@/lib/companies-house';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const results = await companiesHouseAPI.searchCompanies(query);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Companies House search error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search companies' },
      { status: 500 }
    );
  }
}
