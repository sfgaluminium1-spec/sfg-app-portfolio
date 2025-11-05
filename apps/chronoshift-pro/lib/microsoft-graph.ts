
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

interface MicrosoftGraphConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
}

interface SharePointListItem {
  employeeName: string;
  employeeEmail: string;
  workDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  breakMinutes: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  notes?: string;
  submittedAt: string;
}

export class MicrosoftGraphService {
  private graphClient: Client;
  private config: MicrosoftGraphConfig;

  constructor() {
    this.config = {
      tenantId: process.env.MICROSOFT_TENANT_ID!,
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!
    };

    // Create credential for authentication
    const credential = new ClientSecretCredential(
      this.config.tenantId,
      this.config.clientId,
      this.config.clientSecret
    );

    // Initialize Graph client with app-only authentication
    this.graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const tokenResponse = await credential.getToken(['https://graph.microsoft.com/.default']);
          return tokenResponse?.token || '';
        }
      }
    });
  }

  /**
   * Send email notification using Microsoft Graph
   */
  async sendEmail(
    to: string, 
    subject: string, 
    htmlContent: string, 
    from: string = process.env.MICROSOFT_ADMIN_EMAIL!
  ): Promise<boolean> {
    try {
      const mail = {
        message: {
          subject: subject,
          body: {
            contentType: 'HTML',
            content: htmlContent
          },
          toRecipients: [
            {
              emailAddress: {
                address: to
              }
            }
          ]
        }
      };

      await this.graphClient
        .api(`/users/${from}/sendMail`)
        .post(mail);

      return true;
    } catch (error) {
      console.error('Failed to send email via Graph API:', error);
      return false;
    }
  }

  /**
   * Create or update SharePoint list for timesheets
   */
  async createSharePointList(siteId: string, listName: string = 'ChronoShift_Timesheets'): Promise<string | null> {
    try {
      const listConfig = {
        displayName: listName,
        columns: [
          {
            name: 'EmployeeName',
            text: {}
          },
          {
            name: 'EmployeeEmail',
            text: {}
          },
          {
            name: 'WorkDate',
            dateTime: {}
          },
          {
            name: 'StartTime',
            text: {}
          },
          {
            name: 'EndTime', 
            text: {}
          },
          {
            name: 'TotalHours',
            number: {
              decimalPlaces: 2
            }
          },
          {
            name: 'BreakMinutes',
            number: {}
          },
          {
            name: 'Status',
            choice: {
              choices: ['Draft', 'Submitted', 'Approved', 'Rejected']
            }
          },
          {
            name: 'Notes',
            text: {
              allowMultipleLines: true
            }
          },
          {
            name: 'SubmittedAt',
            dateTime: {}
          }
        ]
      };

      const response = await this.graphClient
        .api(`/sites/${siteId}/lists`)
        .post(listConfig);

      return response.id;
    } catch (error) {
      console.error('Failed to create SharePoint list:', error);
      return null;
    }
  }

  /**
   * Add item to SharePoint list
   */
  async addItemToSharePointList(
    siteId: string, 
    listId: string, 
    item: SharePointListItem
  ): Promise<boolean> {
    try {
      const listItem = {
        fields: {
          EmployeeName: item.employeeName,
          EmployeeEmail: item.employeeEmail,
          WorkDate: item.workDate,
          StartTime: item.startTime,
          EndTime: item.endTime,
          TotalHours: item.totalHours,
          BreakMinutes: item.breakMinutes,
          Status: item.status,
          Notes: item.notes || '',
          SubmittedAt: item.submittedAt
        }
      };

      await this.graphClient
        .api(`/sites/${siteId}/lists/${listId}/items`)
        .post(listItem);

      return true;
    } catch (error) {
      console.error('Failed to add item to SharePoint list:', error);
      return false;
    }
  }

  /**
   * Get SharePoint list items
   */
  async getSharePointListItems(
    siteId: string, 
    listId: string,
    filter?: string
  ): Promise<SharePointListItem[]> {
    try {
      let query = this.graphClient.api(`/sites/${siteId}/lists/${listId}/items`).expand('fields');
      
      if (filter) {
        query = query.filter(filter);
      }

      const response = await query.get();
      
      return response.value.map((item: any) => ({
        employeeName: item.fields.EmployeeName,
        employeeEmail: item.fields.EmployeeEmail,
        workDate: item.fields.WorkDate,
        startTime: item.fields.StartTime,
        endTime: item.fields.EndTime,
        totalHours: item.fields.TotalHours,
        breakMinutes: item.fields.BreakMinutes,
        status: item.fields.Status,
        notes: item.fields.Notes,
        submittedAt: item.fields.SubmittedAt
      }));
    } catch (error) {
      console.error('Failed to get SharePoint list items:', error);
      return [];
    }
  }

  /**
   * Send Teams notification via webhook
   */
  async sendTeamsNotification(
    webhookUrl: string,
    title: string,
    message: string,
    actionUrl?: string
  ): Promise<boolean> {
    try {
      const teamsMessage = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": title,
        "sections": [
          {
            "activityTitle": title,
            "activitySubtitle": message,
            "markdown": true
          }
        ],
        "potentialAction": actionUrl ? [
          {
            "@type": "OpenUri",
            "name": "View in ChronoShift Pro",
            "targets": [
              { "os": "default", "uri": actionUrl }
            ]
          }
        ] : []
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(teamsMessage)
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send Teams notification:', error);
      return false;
    }
  }

  /**
   * Get user profile from Microsoft Graph
   */
  async getUserProfile(userEmail: string): Promise<any> {
    try {
      const user = await this.graphClient
        .api(`/users/${userEmail}`)
        .get();
      
      return {
        id: user.id,
        displayName: user.displayName,
        email: user.userPrincipalName,
        jobTitle: user.jobTitle,
        department: user.department,
        manager: user.manager
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Get SharePoint site ID by URL
   */
  async getSharePointSiteId(siteUrl: string): Promise<string | null> {
    try {
      // Extract hostname and site path from URL
      const url = new URL(siteUrl);
      const hostname = url.hostname;
      const sitePath = url.pathname;

      const response = await this.graphClient
        .api(`/sites/${hostname}:${sitePath}`)
        .get();

      return response.id;
    } catch (error) {
      console.error('Failed to get SharePoint site ID:', error);
      return null;
    }
  }

  /**
   * Upload file to SharePoint document library
   */
  async uploadFileToSharePoint(
    siteId: string,
    fileName: string,
    fileBuffer: Buffer,
    folderPath: string = 'Shared Documents'
  ): Promise<string | null> {
    try {
      const response = await this.graphClient
        .api(`/sites/${siteId}/drive/root:/${folderPath}/${fileName}:/content`)
        .put(fileBuffer);

      return response.webUrl;
    } catch (error) {
      console.error('Failed to upload file to SharePoint:', error);
      return null;
    }
  }
}

// Export singleton instance
export const microsoftGraphService = new MicrosoftGraphService();
