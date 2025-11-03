
/**
 * Multi-Site SharePoint Scanner
 * Scans SharePoint sites and drives for files to process
 */

import { microsoftGraphAPI } from '../microsoft-graph';
import { prisma } from '../db';
import { ProcessingStatus } from '@prisma/client';

export interface DriveInfo {
  id: string;
  name: string;
  fileCount: number;
}

export interface SiteInfo {
  id: string;
  name: string;
  url: string;
  drives: DriveInfo[];
}

export interface ScanResult {
  sites: SiteInfo[];
  totalFiles: number;
  totalSize: number;
}

export interface ScanOptions {
  siteIds?: string[];
  driveIds?: string[];
  fileExtensions?: string[];
  maxFiles?: number;
  skipExisting?: boolean;
}

class SharePointScanner {
  /**
   * Scan all accessible SharePoint sites
   */
  async scanSites(): Promise<ScanResult> {
    const sites = await microsoftGraphAPI.getSites();
    const result: ScanResult = {
      sites: [],
      totalFiles: 0,
      totalSize: 0
    };

    for (const site of sites) {
      const drives = await microsoftGraphAPI.getSiteDrives(site.id);
      const siteData: SiteInfo = {
        id: site.id,
        name: site.displayName,
        url: site.webUrl,
        drives: []
      };

      for (const drive of drives) {
        try {
          const items = await microsoftGraphAPI.getDriveItems(site.id, drive.id);
          const fileCount = items.filter(item => !item.folder).length;
          const driveSize = items.reduce((sum, item) => sum + (item.size || 0), 0);

          siteData.drives.push({
            id: drive.id,
            name: drive.name,
            fileCount
          });

          result.totalFiles += fileCount;
          result.totalSize += driveSize;
        } catch (error) {
          console.error(`Error scanning drive ${drive.id}:`, error);
        }
      }

      result.sites.push(siteData);
    }

    return result;
  }

  /**
   * Scan specific SharePoint site and queue files for processing
   */
  async scanAndQueueFiles(
    siteId: string,
    driveId: string,
    batchId: string,
    options: ScanOptions = {}
  ): Promise<number> {
    const items = await this.scanDriveRecursively(siteId, driveId, options);
    let queuedCount = 0;

    for (const item of items) {
      // Skip if already exists and skipExisting is true
      if (options.skipExisting) {
        const existing = await prisma.archivedFile.findFirst({
          where: {
            sharePointItemId: item.id
          }
        });
        if (existing) continue;
      }

      // Queue file for processing
      await prisma.archivedFile.create({
        data: {
          fileName: item.name,
          originalPath: item.webUrl,
          fileExtension: item.name.split('.').pop() || '',
          fileSize: BigInt(item.size),
          mimeType: item.file?.mimeType || 'application/octet-stream',
          cloudStoragePath: '', // Will be set after upload
          sharePointUrl: item.webUrl,
          sharePointDriveId: driveId,
          sharePointItemId: item.id,
          fileType: 'UNCLASSIFIED',
          confidence: 0,
          retentionYears: 7, // Default
          processingStatus: ProcessingStatus.PENDING,
          batchId
        }
      });

      queuedCount++;

      // Stop if we've reached maxFiles
      if (options.maxFiles && queuedCount >= options.maxFiles) {
        break;
      }
    }

    return queuedCount;
  }

  /**
   * Recursively scan a drive for all files
   */
  private async scanDriveRecursively(
    siteId: string,
    driveId: string,
    options: ScanOptions,
    path = ''
  ): Promise<any[]> {
    const items = await microsoftGraphAPI.getDriveItems(siteId, driveId, path);
    let allFiles: any[] = [];

    for (const item of items) {
      if (item.folder) {
        // Recursively scan folder
        const folderPath = path ? `${path}/${item.name}` : item.name;
        const subItems = await this.scanDriveRecursively(siteId, driveId, options, folderPath);
        allFiles = allFiles.concat(subItems);
      } else {
        // Check file extension filter
        if (options.fileExtensions) {
          const ext = item.name.split('.').pop()?.toLowerCase();
          if (ext && !options.fileExtensions.includes(`.${ext}`)) {
            continue;
          }
        }
        allFiles.push(item);
      }
    }

    return allFiles;
  }

  /**
   * Get scan statistics
   */
  async getScanStats() {
    const total = await prisma.archivedFile.count();
    const byStatus = await prisma.archivedFile.groupBy({
      by: ['processingStatus'],
      _count: true
    });
    const byType = await prisma.archivedFile.groupBy({
      by: ['fileType'],
      _count: true
    });

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.processingStatus] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byType: byType.reduce((acc, item) => {
        acc[item.fileType] = item._count;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const sharepointScanner = new SharePointScanner();
