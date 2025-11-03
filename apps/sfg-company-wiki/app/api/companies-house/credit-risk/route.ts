
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

    const assessment = await companiesHouseAPI.assessCompanyCreditRisk(companyNumber);
    return NextResponse.json(assessment);
  } catch (error: any) {
    console.error('Companies House credit risk error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to assess credit risk' },
      { status: 500 }
    );
  }
}
