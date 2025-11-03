
/**
 * Xero Accounting API Integration
 * For invoicing, payments, payroll, and financial reporting
 * Based on SFG COMET CORE API Sharing Package
 */

import { getSecret, hasCredentials } from './vault';

interface XeroTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface XeroContact {
  ContactID?: string;
  Name: string;
  EmailAddress?: string;
  Phones?: Array<{
    PhoneType: string;
    PhoneNumber: string;
  }>;
}

interface XeroInvoice {
  InvoiceID?: string;
  InvoiceNumber?: string;
  Type: 'ACCREC' | 'ACCPAY';
  Contact: XeroContact;
  LineItems: Array<{
    Description: string;
    Quantity: number;
    UnitAmount: number;
    AccountCode?: string;
  }>;
  Date: string;
  DueDate: string;
  Status?: string;
}

class XeroAPI {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private redirectUri: string | null = null;
  private accessToken: string | null = null;
  private baseURL = 'https://api.xero.com/api.xro/2.0';
  private authURL = 'https://login.xero.com/identity/connect';

  private async loadCredentials(): Promise<{
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }> {
    if (this.clientId && this.clientSecret && this.redirectUri) {
      return {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        redirectUri: this.redirectUri,
      };
    }

    try {
      this.clientId = await getSecret('xero', 'client_id');
      this.clientSecret = await getSecret('xero', 'client_secret');
      this.redirectUri = await getSecret('xero', 'redirect_uri');
    } catch {
      // Fallback to environment variables
      this.clientId = process.env.XERO_CLIENT_ID || '';
      this.clientSecret = process.env.XERO_CLIENT_SECRET || '';
      this.redirectUri = process.env.XERO_REDIRECT_URI || '';
    }

    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new Error('Xero credentials not found in vault or environment');
    }

    return {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri,
    };
  }

  /**
   * Generate OAuth authorization URL
   */
  async getAuthorizationUrl(state?: string): Promise<string> {
    const { clientId, redirectUri } = await this.loadCredentials();
    
    const scopes = [
      'offline_access',
      'accounting.transactions',
      'accounting.contacts',
      'accounting.settings',
    ].join(' ');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes,
      ...(state && { state }),
    });

    return `${this.authURL}/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getTokenFromCode(code: string): Promise<XeroTokenResponse> {
    const { clientId, clientSecret, redirectUri } = await this.loadCredentials();
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(`${this.authURL}/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Xero OAuth error: ${response.status} ${error}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    return data;
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please call getTokenFromCode first.');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Xero API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  /**
   * Get all contacts (customers/suppliers)
   */
  async getContacts(): Promise<XeroContact[]> {
    const response = await this.makeRequest('/Contacts');
    return response.Contacts || [];
  }

  /**
   * Create or update contact
   */
  async saveContact(contact: XeroContact): Promise<XeroContact> {
    const response = await this.makeRequest('/Contacts', 'POST', { Contacts: [contact] });
    return response.Contacts?.[0];
  }

  /**
   * Get all invoices
   */
  async getInvoices(): Promise<XeroInvoice[]> {
    const response = await this.makeRequest('/Invoices');
    return response.Invoices || [];
  }

  /**
   * Create invoice
   */
  async createInvoice(invoice: XeroInvoice): Promise<XeroInvoice> {
    const response = await this.makeRequest('/Invoices', 'POST', { Invoices: [invoice] });
    return response.Invoices?.[0];
  }

  /**
   * Check if Xero is configured
   */
  isConfigured(): boolean {
    return hasCredentials('xero');
  }

  /**
   * Set access token (for use with existing tokens)
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Get available tenants (organisations)
   */
  async getTenants(): Promise<Array<{
    id: string;
    tenantId: string;
    tenantType: string;
    tenantName: string;
  }>> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please call getTokenFromCode first.');
    }

    const response = await fetch('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get tenants: ${response.status} ${error}`);
    }

    return response.json();
  }

  /**
   * Make authenticated API request with tenant ID
   */
  private async makeRequestWithTenant(
    tenantId: string,
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please call getTokenFromCode first.');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'xero-tenant-id': tenantId,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Xero API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  /**
   * Get organisation info
   */
  async getOrganisation(tenantId?: string): Promise<any> {
    // If no tenant ID provided, use the first available tenant
    if (!tenantId) {
      const tenants = await this.getTenants();
      if (tenants.length === 0) {
        throw new Error('No Xero organisations available');
      }
      tenantId = tenants[0].tenantId;
    }

    const response = await this.makeRequestWithTenant(tenantId, '/Organisation');
    return response.Organisations?.[0];
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<{
    success: boolean;
    organisation?: any;
    tenants?: any[];
    error?: string;
  }> {
    try {
      const tenants = await this.getTenants();
      if (tenants.length === 0) {
        return {
          success: false,
          error: 'No Xero organisations connected',
        };
      }

      const organisation = await this.getOrganisation(tenants[0].tenantId);

      return {
        success: true,
        organisation,
        tenants,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const xeroAPI = new XeroAPI();
export type { XeroTokenResponse, XeroContact, XeroInvoice };

