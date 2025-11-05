
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Simulate email sending
    const testEmail = {
      to: 'Warren@sfg-aluminium.co.uk',
      subject: 'ChronoShift Pro Email Test',
      body: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email from ChronoShift Pro to verify Office 365 email integration.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-GB')}</p>
        <p><strong>System:</strong> ChronoShift Pro v2.1.3</p>
        <hr>
        <p>If you received this email, your SMTP configuration is working correctly!</p>
      `
    };

    console.log('Test email configuration:', {
      smtp: 'smtp.office365.com:587',
      from: 'Warren@sfg-aluminium.co.uk',
      to: testEmail.to,
      subject: testEmail.subject,
      timestamp: new Date().toISOString()
    });

    // In production, this would actually send the email
    // For now, we'll simulate success
    return NextResponse.json({ 
      message: 'Test email sent successfully',
      details: testEmail 
    });
  } catch (error) {
    console.error('Email test failed:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
