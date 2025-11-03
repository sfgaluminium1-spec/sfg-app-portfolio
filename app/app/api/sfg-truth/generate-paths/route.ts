
/**
 * API Route: Generate Folder Paths
 * SFG Truth File v1.2.3
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCanonicalPath, generateMonthShortcutPath, type JobPath } from '@/lib/sfg-truth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobPath } = body;
    
    if (!jobPath) {
      return NextResponse.json(
        { error: 'jobPath parameter is required' },
        { status: 400 }
      );
    }
    
    try {
      const canonicalPath = generateCanonicalPath(jobPath as JobPath);
      const monthShortcutPath = generateMonthShortcutPath();
      
      return NextResponse.json({
        success: true,
        paths: {
          canonical: canonicalPath,
          monthShortcut: monthShortcutPath
        }
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Path generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Path generation failed' },
      { status: 500 }
    );
  }
}
