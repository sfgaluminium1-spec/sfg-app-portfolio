
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/xero/test
 * Test Xero API connectivity and permissions
 * 
 * Body:
 * {
 *   "accessToken": "string" // Access token from OAuth flow
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
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 400 }
      );
    }

    // Test 1: Get Organisation (basic connectivity test)
    console.log('Testing Xero API connectivity...');
    const orgResponse = await fetch('https://api.xero.com/api.xro/2.0/Organisation', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!orgResponse.ok) {
      const errorText = await orgResponse.text();
      throw new Error(`Organisation API failed: ${orgResponse.status} ${errorText}`);
    }

    const orgData = await orgResponse.json();
    const organisation = orgData.Organisations?.[0];

    // Test 2: Get Contacts (read permission test)
    console.log('Testing Xero Contacts API...');
    const contactsResponse = await fetch('https://api.xero.com/api.xro/2.0/Contacts?page=1&pageSize=5', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!contactsResponse.ok) {
      const errorText = await contactsResponse.text();
      console.error('Contacts API failed:', errorText);
    }

    const contactsData = contactsResponse.ok ? await contactsResponse.json() : null;
    const contactsCount = contactsData?.Contacts?.length || 0;

    // Test 3: Get Invoices (accounting transactions read test)
    console.log('Testing Xero Invoices API...');
    const invoicesResponse = await fetch('https://api.xero.com/api.xro/2.0/Invoices?page=1&pageSize=5', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!invoicesResponse.ok) {
      const errorText = await invoicesResponse.text();
      console.error('Invoices API failed:', errorText);
    }

    const invoicesData = invoicesResponse.ok ? await invoicesResponse.json() : null;
    const invoicesCount = invoicesData?.Invoices?.length || 0;

    // Test 4: Get Accounts (chart of accounts)
    console.log('Testing Xero Accounts API...');
    const accountsResponse = await fetch('https://api.xero.com/api.xro/2.0/Accounts?page=1', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text();
      console.error('Accounts API failed:', errorText);
    }

    const accountsData = accountsResponse.ok ? await accountsResponse.json() : null;
    const accountsCount = accountsData?.Accounts?.length || 0;

    // Compile test results
    const results = {
      success: true,
      timestamp: new Date().toISOString(),
      organisation: organisation ? {
        name: organisation.Name,
        legalName: organisation.LegalName,
        version: organisation.Version,
        organisationID: organisation.OrganisationID,
        countryCode: organisation.CountryCode,
        baseCurrency: organisation.BaseCurrency,
      } : null,
      permissions: {
        organisation: orgResponse.ok,
        contacts: contactsResponse.ok,
        invoices: invoicesResponse.ok,
        accounts: accountsResponse.ok,
      },
      dataCounts: {
        contacts: contactsCount,
        invoices: invoicesCount,
        accounts: accountsCount,
      },
      scopes: [
        'offline_access',
        'accounting.transactions',
        'accounting.contacts',
        'accounting.settings',
      ],
      message: 'Xero API connectivity test completed successfully',
    };

    console.log('Xero API test results:', results);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Xero test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to test Xero API connectivity',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
