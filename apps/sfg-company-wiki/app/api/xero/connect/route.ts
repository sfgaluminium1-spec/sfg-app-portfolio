
/**
 * Xero OAuth Connection Initiation
 * Redirects user to Xero authorization page
 */

import { NextRequest, NextResponse } from 'next/server';
import { xeroAPI } from '@/lib/xero';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate authorization URL
    const authUrl = await xeroAPI.getAuthorizationUrl();

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Xero connect error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate Xero connection' },
      { status: 500 }
    );
  }
}

