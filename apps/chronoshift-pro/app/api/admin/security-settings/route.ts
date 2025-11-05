
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';


interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  requireMFA: boolean;
  auditRetentionDays: number;
}

// Mock security settings storage (in real app, this would be in database)
let securitySettings: SecuritySettings = {
  passwordMinLength: 8,
  passwordRequireNumbers: true,
  passwordRequireSymbols: true,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  requireMFA: false,
  auditRetentionDays: 90
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(securitySettings);
  } catch (error) {
    console.error('Error fetching security settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newSettings = await request.json();
    
    // Validate settings
    if (newSettings.passwordMinLength < 6 || newSettings.passwordMinLength > 50) {
      return NextResponse.json(
        { error: 'Password minimum length must be between 6 and 50' },
        { status: 400 }
      );
    }

    if (newSettings.sessionTimeout < 5 || newSettings.sessionTimeout > 480) {
      return NextResponse.json(
        { error: 'Session timeout must be between 5 and 480 minutes' },
        { status: 400 }
      );
    }

    // Update settings (in real app, save to database)
    securitySettings = { ...securitySettings, ...newSettings };

    return NextResponse.json({ 
      message: 'Security settings updated successfully',
      settings: securitySettings 
    });
  } catch (error) {
    console.error('Error updating security settings:', error);
    return NextResponse.json(
      { error: 'Failed to update security settings' },
      { status: 500 }
    );
  }
}
