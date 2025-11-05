
import { NextRequest, NextResponse } from 'next/server';
import { microsoftGraphService } from '@/lib/microsoft-graph';

export async function POST(request: NextRequest) {
  try {
    const { type, ...params } = await request.json();

    switch (type) {
      case 'email':
        const emailResult = await microsoftGraphService.sendEmail(
          params.to || 'warren@sfg-aluminium.co.uk',
          'ChronoShift Pro Test Email',
          `
            <h2>🎯 ChronoShift Pro Test Email</h2>
            <p>This is a test email from ChronoShift Pro to verify Microsoft Graph integration.</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString('en-GB')}</p>
            <p><strong>Status:</strong> Microsoft 365 integration is working correctly!</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              This email was sent automatically by ChronoShift Pro Payroll System
            </p>
          `,
          'warren@sfg-aluminium.co.uk'
        );
        
        return NextResponse.json({ 
          success: emailResult, 
          message: emailResult ? 'Test email sent successfully' : 'Failed to send test email'
        });

      case 'teams':
        if (!params.webhookUrl) {
          return NextResponse.json({ success: false, message: 'Webhook URL required' });
        }
        
        const teamsResult = await microsoftGraphService.sendTeamsNotification(
          params.webhookUrl,
          '🎯 ChronoShift Pro Test Notification',
          `Test notification sent at ${new Date().toLocaleString('en-GB')}. Microsoft 365 integration is working!`,
          'https://chronoshift-pro.abacusai.app'
        );
        
        return NextResponse.json({ 
          success: teamsResult, 
          message: teamsResult ? 'Test Teams notification sent successfully' : 'Failed to send Teams notification'
        });

      case 'sharepoint':
        const siteUrl = 'https://sfgaluminium.sharepoint.com/sites/WarrenHeathcote';
        const siteId = await microsoftGraphService.getSharePointSiteId(siteUrl);
        
        if (!siteId) {
          return NextResponse.json({ success: false, message: 'Could not access SharePoint site' });
        }
        
        return NextResponse.json({ 
          success: true, 
          message: 'SharePoint site accessible', 
          siteId: siteId
        });

      case 'user':
        const userProfile = await microsoftGraphService.getUserProfile('warren@sfg-aluminium.co.uk');
        
        return NextResponse.json({ 
          success: !!userProfile, 
          message: userProfile ? 'User profile retrieved' : 'Could not get user profile',
          userProfile: userProfile
        });

      default:
        return NextResponse.json({ success: false, message: 'Invalid test type' });
    }
  } catch (error) {
    console.error('Microsoft 365 test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}
