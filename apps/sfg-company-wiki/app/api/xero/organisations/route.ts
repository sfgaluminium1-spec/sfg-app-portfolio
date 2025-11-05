
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/xero/organisations
 * Get Xero organisations (tenants) for the authenticated user
 * 
 * Query params:
 * - accessToken: Access token from OAuth flow
 */
export async function GET(req: NextRequest) {
  try {
    // Check user authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 400 }
      );
    }

    // Get connections (tenants/organisations)
    const response = await fetch('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get organisations: ${response.status} ${errorText}`);
    }

    const connections = await response.json();

    return NextResponse.json({
      success: true,
      organisations: connections,
      count: connections.length,
    });
  } catch (error: any) {
    console.error('Xero organisations error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get Xero organisations',
      },
      { status: 500 }
    );
  }
}
