
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';


interface Microsoft365Config {
  teamsWebhookUrl?: string;
  powerAutomateFlows?: {
    approval?: string;
    reminder?: string;
  };
  emailConfig?: {
    smtpServer?: string;
    smtpPort?: number;
    username?: string;
    appPassword?: string;
  };
  sharePointConfig?: {
    siteUrl?: string;
    listName?: string;
  };
}

// Mock storage for configuration (in production, this would be in database)
let microsoft365Config: Microsoft365Config = {
  emailConfig: {
    smtpServer: 'smtp.office365.com',
    smtpPort: 587,
    username: 'Warren@sfg-aluminium.co.uk'
  },
  sharePointConfig: {
    siteUrl: 'https://sfgaluminium.sharepoint.com/sites/WarrenHeathcote',
    listName: 'ChronoShift_Timesheets'
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return configuration without sensitive data
    const safeConfig = {
      ...microsoft365Config,
      emailConfig: microsoft365Config.emailConfig ? {
        ...microsoft365Config.emailConfig,
        appPassword: microsoft365Config.emailConfig.appPassword ? '***' : undefined
      } : undefined
    };

    return NextResponse.json(safeConfig);
  } catch (error) {
    console.error('Error fetching Microsoft 365 config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
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

    const updates = await request.json();
    
    // Validate configuration updates
    if (updates.emailConfig?.smtpPort && 
        (updates.emailConfig.smtpPort < 1 || updates.emailConfig.smtpPort > 65535)) {
      return NextResponse.json(
        { error: 'Invalid SMTP port number' },
        { status: 400 }
      );
    }

    // Update configuration
    microsoft365Config = { ...microsoft365Config, ...updates };

    console.log('Microsoft 365 configuration updated:', {
      hasTeamsWebhook: !!microsoft365Config.teamsWebhookUrl,
      hasPowerAutomateFlows: !!(microsoft365Config.powerAutomateFlows?.approval || microsoft365Config.powerAutomateFlows?.reminder),
      hasEmailConfig: !!microsoft365Config.emailConfig?.appPassword,
      sharePointSite: microsoft365Config.sharePointConfig?.siteUrl
    });

    return NextResponse.json({ 
      message: 'Configuration updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating Microsoft 365 config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}
