
/**
 * API Route: Allocate BaseNumber
 * SFG Truth File v1.2.3
 * 
 * NON-NEGOTIABLE: BaseNumber generation with database-backed concurrency control
 */

import { NextRequest, NextResponse } from 'next/server';
import { allocateBaseNumber, type PrefixType } from '@/lib/sfg-truth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prefix } = body;
    
    // Validate prefix
    const validPrefixes: PrefixType[] = ['ENQ', 'QUO', 'ORD', 'INV', 'DEL', 'PAID'];
    if (prefix && !validPrefixes.includes(prefix)) {
      return NextResponse.json(
        { error: `Invalid prefix. Must be one of: ${validPrefixes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Allocate BaseNumber
    const result = await allocateBaseNumber(prefix || 'ENQ');
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('BaseNumber allocation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to allocate BaseNumber' },
      { status: 500 }
    );
  }
}
