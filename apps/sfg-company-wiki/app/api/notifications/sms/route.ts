
/**
 * SMS Notification API Route
 * Uses Twilio to send SMS/WhatsApp messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { twilioAPI } from '@/lib/twilio';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can send notifications
    // @ts-ignore
    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { to, body, type = 'sms' } = await req.json();

    if (!to || !body) {
      return NextResponse.json(
        { error: 'Phone number and message body are required' },
        { status: 400 }
      );
    }

    let result;
    if (type === 'whatsapp') {
      result = await twilioAPI.sendWhatsApp(to, body);
    } else {
      result = await twilioAPI.sendSMS({ to, body });
    }

    return NextResponse.json({
      success: true,
      messageSid: result.sid,
      status: result.status,
    });
  } catch (error: any) {
    console.error('SMS notification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send notification' },
      { status: 500 }
    );
  }
}

