
import { NextRequest, NextResponse } from 'next/server';
import { sharePointIntegration } from '@/lib/sharepoint-integration';
import { teamsIntegration } from '@/lib/teams-integration';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { type, data } = payload;

    console.log('Microsoft 365 webhook received:', { type, data });

    switch (type) {
      case 'timesheet_submission':
        // Handle timesheet submission
        const submitted = await sharePointIntegration.submitTimesheet(data);
        if (submitted) {
          await teamsIntegration.notifyTimesheetSubmission(data);
        }
        break;

      case 'timesheet_approval':
        // Handle timesheet approval/rejection
        await teamsIntegration.notifyTimesheetDecision(
          data.timesheet, 
          data.decision, 
          data.notes
        );
        break;

      case 'weekly_reminder':
        // Send weekly reminder
        await teamsIntegration.sendWeeklyReminder(data.employees);
        break;

      default:
        console.log('Unknown webhook type:', type);
    }

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  return NextResponse.json({
    status: 'healthy',
    service: 'Microsoft 365 Integration',
    timestamp: new Date().toISOString()
  });
}
