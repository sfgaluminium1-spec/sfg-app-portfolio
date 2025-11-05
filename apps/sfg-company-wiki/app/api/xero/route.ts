
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { xeroAPI } from '@/lib/xero';

/**
 * POST /api/xero
 * General Xero API operations
 * 
 * Supported actions:
 * - get_contacts
 * - create_contact
 * - get_invoices
 * - create_invoice
 * 
 * Body:
 * {
 *   "action": "string",
 *   "accessToken": "string",
 *   "data": {} // action-specific data
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Check user authentication
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, accessToken, data } = body;

    if (!action || !accessToken) {
      return NextResponse.json(
        { error: 'Action and access token required' },
        { status: 400 }
      );
    }

    // Set access token
    xeroAPI.setAccessToken(accessToken);

    // Route to appropriate action
    switch (action) {
      case 'get_contacts':
        const contacts = await xeroAPI.getContacts();
        return NextResponse.json({ success: true, contacts });

      case 'create_contact':
        if (!data) {
          return NextResponse.json(
            { error: 'Contact data required' },
            { status: 400 }
          );
        }
        const newContact = await xeroAPI.saveContact(data);
        return NextResponse.json({ success: true, contact: newContact });

      case 'get_invoices':
        const invoices = await xeroAPI.getInvoices();
        return NextResponse.json({ success: true, invoices });

      case 'create_invoice':
        if (!data) {
          return NextResponse.json(
            { error: 'Invoice data required' },
            { status: 400 }
          );
        }
        const newInvoice = await xeroAPI.createInvoice(data);
        return NextResponse.json({ success: true, invoice: newInvoice });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Xero API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to execute Xero API operation',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/xero
 * Check Xero configuration status
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isConfigured = xeroAPI.isConfigured();

    return NextResponse.json({
      success: true,
      configured: isConfigured,
      redirectUri: process.env.XERO_REDIRECT_URI,
      scopes: [
        'offline_access',
        'accounting.transactions',
        'accounting.contacts',
        'accounting.settings',
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to check Xero configuration' },
      { status: 500 }
    );
  }
}
