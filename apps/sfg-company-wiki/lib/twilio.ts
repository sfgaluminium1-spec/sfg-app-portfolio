
/**
 * Twilio Communications Integration
 * For SMS, WhatsApp, voice calls, and notifications
 * Based on SFG COMET CORE API Sharing Package
 */

import { getSecret, hasCredentials } from './vault';

interface SMSRequest {
  to: string;
  from?: string;
  body: string;
}

interface SMSResponse {
  sid: string;
  status: string;
  to: string;
  from: string;
  body: string;
  dateCreated: string;
}

class TwilioAPI {
  private accountSid: string | null = null;
  private authToken: string | null = null;
  private baseURL = 'https://api.twilio.com/2010-04-01';
  private defaultFrom: string = process.env.TWILIO_PHONE_NUMBER || '';

  private async loadCredentials(): Promise<{ accountSid: string; authToken: string }> {
    if (this.accountSid && this.authToken) {
      return { accountSid: this.accountSid, authToken: this.authToken };
    }

    try {
      this.accountSid = await getSecret('twilio', 'account_sid');
      this.authToken = await getSecret('twilio', 'auth_token');
    } catch {
      // Fallback to environment variables
      this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
      this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    }

    if (!this.accountSid || !this.authToken) {
      throw new Error('Twilio credentials not found in vault or environment');
    }

    return { accountSid: this.accountSid, authToken: this.authToken };
  }

  /**
   * Send SMS message
   */
  async sendSMS(request: SMSRequest): Promise<SMSResponse> {
    const { accountSid, authToken } = await this.loadCredentials();
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const from = request.from || this.defaultFrom;
    if (!from) {
      throw new Error('Twilio phone number not configured. Set TWILIO_PHONE_NUMBER in .env');
    }

    const response = await fetch(
      `${this.baseURL}/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: request.to,
          From: from,
          Body: request.body,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Twilio API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return {
      sid: data.sid,
      status: data.status,
      to: data.to,
      from: data.from,
      body: data.body,
      dateCreated: data.date_created,
    };
  }

  /**
   * Send WhatsApp message
   */
  async sendWhatsApp(to: string, body: string): Promise<SMSResponse> {
    // WhatsApp numbers must be prefixed with "whatsapp:"
    const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const whatsappFrom = this.defaultFrom.startsWith('whatsapp:')
      ? this.defaultFrom
      : `whatsapp:${this.defaultFrom}`;

    return this.sendSMS({
      to: whatsappTo,
      from: whatsappFrom,
      body,
    });
  }

  /**
   * Check if Twilio is configured
   */
  isConfigured(): boolean {
    return hasCredentials('twilio');
  }
}

export const twilioAPI = new TwilioAPI();
export type { SMSRequest, SMSResponse };

