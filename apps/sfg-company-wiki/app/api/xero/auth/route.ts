
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { xeroAPI } from '@/lib/xero';

/**
 * GET /api/xero/auth
 * Initiates Xero OAuth 2.0 flow
 */
export async function GET(req: NextRequest) {
  try {
    // Check user authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate OAuth authorization URL
    const state = `${session.user.id}_${Date.now()}`; // Include user ID for security
    const authUrl = await xeroAPI.getAuthorizationUrl(state);

    return NextResponse.json({
      success: true,
      authUrl,
      message: 'Redirect user to this URL to authorize Xero access',
    });
  } catch (error: any) {
    console.error('Xero auth error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate Xero authorization URL' },
      { status: 500 }
    );
  }
}
