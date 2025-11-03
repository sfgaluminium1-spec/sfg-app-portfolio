
import { NextRequest, NextResponse } from 'next/server';
import { xeroAPI } from '@/lib/xero';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/xero/callback
 * Handles OAuth callback from Xero
 * This is the redirect URI configured in Xero app
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard?xero_error=${error}`, req.url)
      );
    }

    // Validate authorization code
    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?xero_error=missing_code', req.url)
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await xeroAPI.getTokenFromCode(code);

    // Store tokens securely (you may want to save to database)
    // For now, we'll redirect with a success flag
    // In production, store tokenResponse.access_token and tokenResponse.refresh_token

    console.log('Xero OAuth successful:', {
      hasAccessToken: !!tokenResponse.access_token,
      hasRefreshToken: !!tokenResponse.refresh_token,
      expiresIn: tokenResponse.expires_in,
    });

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      new URL('/dashboard?xero_connected=true', req.url)
    );
  } catch (error: any) {
    console.error('Xero callback error:', error);
    return NextResponse.redirect(
      new URL(`/dashboard?xero_error=${encodeURIComponent(error.message)}`, req.url)
    );
  }
}
