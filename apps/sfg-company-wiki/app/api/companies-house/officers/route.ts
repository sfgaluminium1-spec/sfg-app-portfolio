
import { NextRequest, NextResponse } from 'next/server';
import { companiesHouseAPI } from '@/lib/companies-house';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyNumber = searchParams.get('number');

    if (!companyNumber) {
      return NextResponse.json(
        { error: 'Query parameter "number" is required' },
        { status: 400 }
      );
    }

    const officers = await companiesHouseAPI.getCompanyOfficers(companyNumber);
    return NextResponse.json(officers);
  } catch (error: any) {
    console.error('Companies House officers error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch company officers' },
      { status: 500 }
    );
  }
}
