
/**
 * Microsoft Graph API Integration for SharePoint
 * Uses authenticated tokens from oauth_token_manager
 */

interface SharePointSite {
  id: string;
  displayName: string;
  webUrl: string;
  description?: string;
}

interface SharePointFile {
  id: string;
  name: string;
  webUrl: string;
  size: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
  createdBy?: {
    user: {
      displayName: string;
    };
  };
  file?: {
    mimeType: string;
  };
  folder?: any;
}

interface SharePointDrive {
  id: string;
  name: string;
  description?: string;
  driveType: string;
  webUrl: string;
}

class MicrosoftGraphAPI {
  private accessToken: string | null = null;
  private baseURL = 'https://graph.microsoft.com/v1.0';

  private loadAccessToken(): string {
    if (this.accessToken) return this.accessToken;
    
    const token = process.env.SHAREPOINT_ACCESS_TOKEN;
    if (!token) {
      throw new Error('SharePoint access token not found in environment variables');
    }
    this.accessToken = token;
    return this.accessToken;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const accessToken = this.loadAccessToken();
    const url = `${this.baseURL}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Microsoft Graph API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  // Get all SharePoint sites
  async getSites(): Promise<SharePointSite[]> {
    const response = await this.makeRequest('/sites?search=*');
    return response.value || [];
  }

  // Get a specific site by name or ID
  async getSite(siteId: string): Promise<SharePointSite> {
    return this.makeRequest(`/sites/${siteId}`);
  }

  // Get drives (document libraries) for a site
  async getSiteDrives(siteId: string): Promise<SharePointDrive[]> {
    const response = await this.makeRequest(`/sites/${siteId}/drives`);
    return response.value || [];
  }

  // Get root folder items from a drive
  async getDriveItems(siteId: string, driveId: string, itemPath?: string): Promise<SharePointFile[]> {
    let endpoint = `/sites/${siteId}/drives/${driveId}/root/children`;
    if (itemPath) {
      endpoint = `/sites/${siteId}/drives/${driveId}/root:/${itemPath}:/children`;
    }
    const response = await this.makeRequest(endpoint);
    return response.value || [];
  }

  // Get file content
  async getFileContent(siteId: string, driveId: string, itemId: string): Promise<ReadableStream> {
    const accessToken = this.loadAccessToken();
    const url = `${this.baseURL}/sites/${siteId}/drives/${driveId}/items/${itemId}/content`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.status}`);
    }

    return response.body!;
  }

  // Get download URL for a file
  async getFileDownloadUrl(siteId: string, driveId: string, itemId: string): Promise<string> {
    const response = await this.makeRequest(`/sites/${siteId}/drives/${driveId}/items/${itemId}`);
    return response['@microsoft.graph.downloadUrl'] || response.webUrl;
  }

  // Search for files across SharePoint
  async searchFiles(query: string, siteId?: string): Promise<SharePointFile[]> {
    let endpoint = `/search/query`;
    const body = {
      requests: [
        {
          entityTypes: ['driveItem'],
          query: {
            queryString: query,
          },
          ...(siteId && {
            sharePointOneDriveOptions: {
              siteId: siteId,
            },
          }),
        },
      ],
    };

    const response = await this.makeRequest(endpoint, 'POST', body);
    const hits = response.value?.[0]?.hitsContainers?.[0]?.hits || [];
    return hits.map((hit: any) => hit.resource);
  }

  // Get user's OneDrive
  async getMyDrive(): Promise<SharePointDrive> {
    return this.makeRequest('/me/drive');
  }

  // Get recent files
  async getRecentFiles(limit: number = 20): Promise<SharePointFile[]> {
    const response = await this.makeRequest(`/me/drive/recent?$top=${limit}`);
    return response.value || [];
  }

  // Get shared files
  async getSharedWithMe(): Promise<SharePointFile[]> {
    const response = await this.makeRequest('/me/drive/sharedWithMe');
    return response.value || [];
  }
}

export const microsoftGraphAPI = new MicrosoftGraphAPI();
export type { SharePointSite, SharePointFile, SharePointDrive };
