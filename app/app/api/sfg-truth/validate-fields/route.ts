
/**
 * API Route: Validate Required Fields
 * SFG Truth File v1.2.3
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequiredFields, validateQuoteToOrderConversion, type ProjectFields } from '@/lib/sfg-truth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fields, checkConversion } = body;
    
    if (!fields) {
      return NextResponse.json(
        { error: 'fields parameter is required' },
        { status: 400 }
      );
    }
    
    // Validate fields
    const validation = checkConversion
      ? validateQuoteToOrderConversion(fields as ProjectFields)
      : validateRequiredFields(fields as ProjectFields);
    
    return NextResponse.json({
      success: true,
      validation
    });
  } catch (error: any) {
    console.error('Field validation error:', error);
    return NextResponse.json(
      { error: error.message || 'Field validation failed' },
      { status: 500 }
    );
  }
}
