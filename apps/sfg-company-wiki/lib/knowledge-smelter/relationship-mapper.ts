
/**
 * File Relationship Mapper
 * Identifies and tracks relationships between files
 */

import { prisma } from '../db';
import { RelationshipType } from '@prisma/client';

export interface RelationshipCandidate {
  sourceFileId: string;
  targetFileId: string;
  type: RelationshipType;
  strength: number;
  reason: string;
}

class RelationshipMapper {
  /**
   * Discover relationships for a newly processed file
   */
  async discoverRelationships(fileId: string): Promise<RelationshipCandidate[]> {
    const file = await prisma.archivedFile.findUnique({
      where: { id: fileId },
      include: { tags: true }
    });

    if (!file) return [];

    const candidates: RelationshipCandidate[] = [];

    // Find files with same job number
    if (file.jobNumber) {
      candidates.push(...await this.findJobRelationships(fileId, file.jobNumber));
    }

    // Find version relationships
    candidates.push(...await this.findVersionRelationships(fileId, file.fileName));

    // Find customer relationships
    if (file.customerName) {
      candidates.push(...await this.findCustomerRelationships(fileId, file.customerName));
    }

    return candidates;
  }

  /**
   * Find files related to same job
   */
  private async findJobRelationships(fileId: string, jobNumber: string): Promise<RelationshipCandidate[]> {
    const relatedFiles = await prisma.archivedFile.findMany({
      where: {
        jobNumber,
        id: { not: fileId }
      },
      take: 50
    });

    return relatedFiles.map(file => ({
      sourceFileId: fileId,
      targetFileId: file.id,
      type: RelationshipType.RELATED_TO_JOB,
      strength: 8,
      reason: `Both files belong to job ${jobNumber}`
    }));
  }

  /**
   * Find version relationships (e.g., Drawing_v1, Drawing_v2)
   */
  private async findVersionRelationships(fileId: string, fileName: string): Promise<RelationshipCandidate[]> {
    const candidates: RelationshipCandidate[] = [];
    
    // Extract base name and version
    const versionMatch = fileName.match(/(.*?)[-_]?v?(\d+)(\.[^.]+)?$/i);
    if (!versionMatch) return [];

    const baseName = versionMatch[1];
    const currentVersion = parseInt(versionMatch[2]);

    // Find files with similar base name
    const similarFiles = await prisma.archivedFile.findMany({
      where: {
        fileName: {
          contains: baseName,
          mode: 'insensitive'
        },
        id: { not: fileId }
      }
    });

    for (const file of similarFiles) {
      const fileVersionMatch = file.fileName.match(/(.*?)[-_]?v?(\d+)(\.[^.]+)?$/i);
      if (fileVersionMatch) {
        const fileVersion = parseInt(fileVersionMatch[2]);
        
        if (fileVersion < currentVersion) {
          // Current file is a newer version
          candidates.push({
            sourceFileId: fileId,
            targetFileId: file.id,
            type: RelationshipType.VERSION_OF,
            strength: 9,
            reason: `Version ${currentVersion} supersedes version ${fileVersion}`
          });
        } else if (fileVersion > currentVersion) {
          // Current file is an older version
          candidates.push({
            sourceFileId: file.id,
            targetFileId: fileId,
            type: RelationshipType.VERSION_OF,
            strength: 9,
            reason: `Version ${fileVersion} supersedes version ${currentVersion}`
          });
        }
      }
    }

    return candidates;
  }

  /**
   * Find files related to same customer
   */
  private async findCustomerRelationships(fileId: string, customerName: string): Promise<RelationshipCandidate[]> {
    const relatedFiles = await prisma.archivedFile.findMany({
      where: {
        customerName: {
          contains: customerName,
          mode: 'insensitive'
        },
        id: { not: fileId }
      },
      take: 20
    });

    return relatedFiles.map(file => ({
      sourceFileId: fileId,
      targetFileId: file.id,
      type: RelationshipType.RELATED_TO_JOB,
      strength: 6,
      reason: `Both files related to customer ${customerName}`
    }));
  }

  /**
   * Create relationships in database
   */
  async createRelationships(candidates: RelationshipCandidate[]): Promise<number> {
    let created = 0;

    for (const candidate of candidates) {
      try {
        await prisma.fileRelationship.create({
          data: {
            sourceFileId: candidate.sourceFileId,
            targetFileId: candidate.targetFileId,
            relationshipType: candidate.type,
            strength: candidate.strength,
            description: candidate.reason
          }
        });
        created++;
      } catch (error) {
        // Skip if relationship already exists
        continue;
      }
    }

    return created;
  }

  /**
   * Get all relationships for a file
   */
  async getFileRelationships(fileId: string) {
    const [outgoing, incoming] = await Promise.all([
      prisma.fileRelationship.findMany({
        where: { sourceFileId: fileId },
        include: { targetFile: true }
      }),
      prisma.fileRelationship.findMany({
        where: { targetFileId: fileId },
        include: { sourceFile: true }
      })
    ]);

    return { outgoing, incoming };
  }

  /**
   * Reconstruct job folder - get all files for a job number
   */
  async reconstructJobFolder(jobNumber: string) {
    const files = await prisma.archivedFile.findMany({
      where: { jobNumber },
      include: {
        tags: true,
        relationships: {
          include: { targetFile: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return {
      jobNumber,
      fileCount: files.length,
      files,
      totalSize: files.reduce((sum, f) => sum + Number(f.fileSize), 0)
    };
  }
}

export const relationshipMapper = new RelationshipMapper();
