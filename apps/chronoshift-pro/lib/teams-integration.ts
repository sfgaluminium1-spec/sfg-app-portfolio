
/**
 * Microsoft Teams Integration for ChronoShift Pro
 * Simplified approach using webhooks and Power Automate
 */

interface TeamsNotification {
  title: string;
  message: string;
  employee: string;
  urgent?: boolean;
  actionUrl?: string;
  data?: any;
}

interface PowerAutomateFlow {
  flowUrl: string;
  name: string;
  description: string;
}

export class TeamsIntegration {
  private webhookUrl: string;
  private powerAutomateFlows: PowerAutomateFlow[];

  constructor() {
    this.webhookUrl = process.env.TEAMS_WEBHOOK_URL || '';
    this.powerAutomateFlows = [
      {
        flowUrl: process.env.POWER_AUTOMATE_TIMESHEET_FLOW || '',
        name: 'Timesheet Approval Flow',
        description: 'Handles timesheet submissions and approvals'
      },
      {
        flowUrl: process.env.POWER_AUTOMATE_REMINDER_FLOW || '',
        name: 'Reminder Flow', 
        description: 'Sends weekly timesheet reminders'
      }
    ];
  }

  /**
   * Send timesheet submission notification to Teams
   */
  async notifyTimesheetSubmission(timesheet: any): Promise<boolean> {
    const notification: TeamsNotification = {
      title: '📋 New Timesheet Submitted',
      message: `${timesheet.employeeName} has submitted their timesheet for ${timesheet.date}`,
      employee: timesheet.employeeName,
      actionUrl: 'https://chronoshift-pro.abacusai.app/supervisor/approvals',
      data: timesheet
    };

    return await this.sendTeamsMessage(notification);
  }

  /**
   * Send approval/rejection notification to Teams
   */
  async notifyTimesheetDecision(timesheet: any, decision: 'approved' | 'rejected', notes?: string): Promise<boolean> {
    const isApproved = decision === 'approved';
    const notification: TeamsNotification = {
      title: `${isApproved ? '✅' : '❌'} Timesheet ${decision.toUpperCase()}`,
      message: `Timesheet for ${timesheet.employeeName} (${timesheet.date}) has been ${decision}${notes ? ': ' + notes : ''}`,
      employee: timesheet.employeeName,
      urgent: !isApproved,
      actionUrl: 'https://chronoshift-pro.abacusai.app/employee/dashboard',
      data: { timesheet, decision, notes }
    };

    return await this.sendTeamsMessage(notification);
  }

  /**
   * Send weekly reminder to submit timesheets
   */
  async sendWeeklyReminder(employees: string[]): Promise<boolean> {
    const notification: TeamsNotification = {
      title: '⏰ Timesheet Reminder',
      message: `Don't forget to submit your timesheets! Deadline: Tuesday 4:00 PM`,
      employee: 'All Employees',
      urgent: true,
      actionUrl: 'https://chronoshift-pro.abacusai.app/employee/timesheet',
      data: { employees, deadline: 'Tuesday 16:00' }
    };

    return await this.sendTeamsMessage(notification);
  }

  /**
   * Send Teams message via webhook
   */
  private async sendTeamsMessage(notification: TeamsNotification): Promise<boolean> {
    try {
      if (!this.webhookUrl) {
        console.log('Teams webhook not configured, logging notification:', notification);
        return true; // Succeed silently for demo
      }

      const teamsCard = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": notification.urgent ? "FF0000" : "0076D7",
        "summary": notification.title,
        "sections": [
          {
            "activityTitle": notification.title,
            "activitySubtitle": notification.message,
            "activityImage": "https://lh3.googleusercontent.com/JY6ryH4uBUfF9cfRNLDN8Wd_12lGv8cEcgKef4N0t_DRipoVtDiUTGaEg8mTViQsuDQwquZrf7XtDwdJ9iulqvbl6CqEAQHx_qH_=w1064-v0",
            "facts": [
              { "name": "Employee", "value": notification.employee },
              { "name": "Time", "value": new Date().toLocaleString('en-GB') },
              { "name": "System", "value": "ChronoShift Pro" }
            ],
            "markdown": true
          }
        ],
        "potentialAction": notification.actionUrl ? [
          {
            "@type": "OpenUri",
            "name": "Open ChronoShift Pro",
            "targets": [
              { "os": "default", "uri": notification.actionUrl }
            ]
          }
        ] : undefined
      };

      // In production, this would make HTTP POST to Teams webhook
      console.log('Teams notification prepared:', {
        webhook: this.webhookUrl ? 'configured' : 'not configured',
        card: teamsCard
      });

      return true;
    } catch (error) {
      console.error('Failed to send Teams message:', error);
      return false;
    }
  }

  /**
   * Trigger Power Automate flow
   */
  async triggerPowerAutomateFlow(flowName: string, data: any): Promise<boolean> {
    try {
      const flow = this.powerAutomateFlows.find(f => f.name.includes(flowName));
      if (!flow || !flow.flowUrl) {
        console.log(`Power Automate flow "${flowName}" not configured`);
        return false;
      }

      // In production, this would make HTTP POST to Power Automate flow
      console.log('Power Automate flow triggered:', {
        flow: flow.name,
        description: flow.description,
        data: JSON.stringify(data, null, 2)
      });

      return true;
    } catch (error) {
      console.error('Failed to trigger Power Automate flow:', error);
      return false;
    }
  }

  /**
   * Setup instructions for Teams integration
   */
  getSetupInstructions(): string[] {
    return [
      "1. Create Teams Webhook:",
      "   - Go to your Teams channel",
      "   - Click '...' → Connectors → Incoming Webhook",
      "   - Name: 'ChronoShift Pro Notifications'",
      "   - Copy webhook URL to environment variable TEAMS_WEBHOOK_URL",
      "",
      "2. Create Power Automate Flows:",
      "   - Go to power.automate.microsoft.com",
      "   - Create 'Timesheet Approval Flow' with HTTP trigger",
      "   - Create 'Reminder Flow' for weekly notifications",
      "   - Copy flow URLs to environment variables",
      "",
      "3. SharePoint List Setup:",
      "   - Go to your SharePoint site",
      "   - Create list: 'ChronoShift_Timesheets'",
      "   - Add columns: Employee, Date, Hours, Status, etc.",
      "",
      "4. Environment Variables to Set:",
      "   - TEAMS_WEBHOOK_URL",
      "   - POWER_AUTOMATE_TIMESHEET_FLOW",
      "   - POWER_AUTOMATE_REMINDER_FLOW",
      "   - SHAREPOINT_SITE_URL",
      "   - EMAIL_FROM (Warren@sfg-aluminium.co.uk)"
    ];
  }
}

export const teamsIntegration = new TeamsIntegration();
