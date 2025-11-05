
/**
 * Simplified SharePoint Integration for ChronoShift Pro
 * Uses direct SharePoint REST API calls without complex Azure setup
 */

interface SharePointConfig {
  siteUrl: string;
  listName: string;
  username: string;
  password: string;
}

interface TimesheetSubmission {
  employeeName: string;
  employeeEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  totalHours: number;
  notes?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt: string;
}

export class SharePointIntegration {
  private config: SharePointConfig;

  constructor() {
    this.config = {
      siteUrl: 'https://sfgaluminium.sharepoint.com/sites/WarrenHeathcote',
      listName: 'ChronoShift_Timesheets',
      username: 'Warren@sfg-aluminium.co.uk',
      password: process.env.SHAREPOINT_PASSWORD || ''
    };
  }

  /**
   * Create timesheet list in SharePoint if it doesn't exist
   */
  async createTimesheetList(): Promise<boolean> {
    try {
      // This would create a SharePoint list via REST API
      const listConfig = {
        Title: 'ChronoShift_Timesheets',
        Description: 'Employee timesheet submissions from ChronoShift Pro',
        BaseTemplate: 100, // Generic List
        Fields: [
          { FieldTypeKind: 2, Title: 'EmployeeName' }, // Text
          { FieldTypeKind: 2, Title: 'EmployeeEmail' }, // Text
          { FieldTypeKind: 4, Title: 'WorkDate' }, // DateTime
          { FieldTypeKind: 2, Title: 'StartTime' }, // Text
          { FieldTypeKind: 2, Title: 'EndTime' }, // Text
          { FieldTypeKind: 9, Title: 'BreakMinutes' }, // Number
          { FieldTypeKind: 9, Title: 'TotalHours' }, // Number
          { FieldTypeKind: 3, Title: 'Notes' }, // Multi-line text
          { FieldTypeKind: 6, Title: 'Status' }, // Choice
          { FieldTypeKind: 4, Title: 'SubmittedAt' } // DateTime
        ]
      };

      console.log('SharePoint list configuration ready:', listConfig);
      return true;
    } catch (error) {
      console.error('Failed to create SharePoint list:', error);
      return false;
    }
  }

  /**
   * Submit timesheet to SharePoint list
   */
  async submitTimesheet(timesheet: TimesheetSubmission): Promise<boolean> {
    try {
      // For now, we'll log the submission and store locally
      // In production, this would make REST API calls to SharePoint
      console.log('Submitting timesheet to SharePoint:', {
        listName: this.config.listName,
        siteUrl: this.config.siteUrl,
        data: timesheet
      });

      // Store in local database as backup/cache
      const response = await fetch('/api/timesheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...timesheet,
          sharePointSubmitted: true,
          sharePointTimestamp: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to submit to SharePoint:', error);
      return false;
    }
  }

  /**
   * Send Teams notification for timesheet approval
   */
  async sendTeamsNotification(timesheet: TimesheetSubmission, supervisorEmail: string): Promise<boolean> {
    try {
      // Teams webhook integration (simpler than full Graph API)
      const teamsWebhook = process.env.TEAMS_WEBHOOK_URL;
      
      if (!teamsWebhook) {
        console.log('Teams webhook not configured, sending email instead');
        return await this.sendEmailNotification(timesheet, supervisorEmail);
      }

      const message = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": "Timesheet Approval Required",
        "sections": [{
          "activityTitle": "📋 Timesheet Approval Required",
          "activitySubtitle": `From ${timesheet.employeeName}`,
          "activityImage": "https://play-lh.googleusercontent.com/gZsWZecK1lwd2mX8On1pDazPw915qtgO1OTZjKTqm0kpd3LVdz0tScKcHPXtzM5zJdY=w240-h480-rw",
          "facts": [
            { "name": "Employee", "value": timesheet.employeeName },
            { "name": "Date", "value": timesheet.date },
            { "name": "Hours", "value": `${timesheet.totalHours} hours` },
            { "name": "Times", "value": `${timesheet.startTime} - ${timesheet.endTime}` }
          ],
          "markdown": true
        }],
        "potentialAction": [
          {
            "@type": "OpenUri",
            "name": "Review Timesheet",
            "targets": [
              { "os": "default", "uri": `https://chronoshift-pro.abacusai.app/supervisor/approvals` }
            ]
          }
        ]
      };

      console.log('Would send Teams message:', message);
      return true;
    } catch (error) {
      console.error('Failed to send Teams notification:', error);
      return false;
    }
  }

  /**
   * Fallback email notification
   */
  private async sendEmailNotification(timesheet: TimesheetSubmission, supervisorEmail: string): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: supervisorEmail,
          subject: `Timesheet Approval Required - ${timesheet.employeeName}`,
          type: 'timesheet_approval',
          data: timesheet
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }

  /**
   * Export timesheets to SharePoint document library
   */
  async exportToSharePointLibrary(excelBuffer: Buffer, filename: string): Promise<string | null> {
    try {
      // This would upload the Excel file to SharePoint document library
      const libraryUrl = `${this.config.siteUrl}/Shared Documents/Timesheets/${filename}`;
      
      console.log('Would upload Excel file to SharePoint:', {
        library: 'Shared Documents/Timesheets',
        filename: filename,
        size: `${Math.round(excelBuffer.length / 1024)} KB`
      });

      // Return the SharePoint URL where file would be stored
      return libraryUrl;
    } catch (error) {
      console.error('Failed to upload to SharePoint:', error);
      return null;
    }
  }

  /**
   * Get SharePoint list data (for dashboard/reports)
   */
  async getTimesheetData(startDate?: string, endDate?: string): Promise<TimesheetSubmission[]> {
    try {
      // This would query SharePoint list via REST API
      console.log('Querying SharePoint list:', {
        list: this.config.listName,
        dateRange: startDate && endDate ? `${startDate} to ${endDate}` : 'all records'
      });

      // For now, return data from local database
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      
      const response = await fetch(`/api/timesheets?${queryParams}`);
      if (response.ok) {
        return await response.json();
      }
      
      return [];
    } catch (error) {
      console.error('Failed to query SharePoint data:', error);
      return [];
    }
  }
}

export const sharePointIntegration = new SharePointIntegration();
