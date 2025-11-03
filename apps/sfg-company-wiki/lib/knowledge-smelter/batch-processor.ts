
/**
 * Batch Processing System
 * Processes files in batches with progress tracking
 */

import { prisma } from '../db';
import { BatchStatus, ProcessingStatus, FileType, LogLevel } from '@prisma/client';
import { classifyFile } from './classification';
import { contentExtractor } from './content-extractor';
import { autoTagger } from './auto-tagger';
import { relationshipMapper } from './relationship-mapper';
import { microsoftGraphAPI } from '../microsoft-graph';
import { uploadFile } from '../s3';

export interface BatchConfig {
  batchName: string;
  sourceLocation: string;
  siteId: string;
  driveId: string;
  maxFiles?: number;
  fileTypes?: string[];
}

export interface ProcessingProgress {
  batchId: string;
  progress: number;
  filesProcessed: number;
  filesSucceeded: number;
  filesFailed: number;
  currentFile?: string;
  estimatedTimeRemaining?: number;
}

class BatchProcessor {
  private activeProcesses: Map<string, boolean> = new Map();

  /**
   * Create a new processing batch
   */
  async createBatch(config: BatchConfig) {
    return prisma.processingBatch.create({
      data: {
        batchName: config.batchName,
        description: `Processing files from ${config.sourceLocation}`,
        sourceLocation: config.sourceLocation,
        totalSizeGB: 0, // Will be calculated during scan
        estimatedFiles: config.maxFiles,
        status: BatchStatus.PENDING
      }
    });
  }

  /**
   * Start batch processing
   */
  async startBatch(batchId: string): Promise<void> {
    if (this.activeProcesses.has(batchId)) {
      throw new Error('Batch is already processing');
    }

    this.activeProcesses.set(batchId, true);

    try {
      await prisma.processingBatch.update({
        where: { id: batchId },
        data: {
          status: BatchStatus.PROCESSING,
          startedAt: new Date()
        }
      });

      await this.processBatch(batchId);

      await prisma.processingBatch.update({
        where: { id: batchId },
        data: {
          status: BatchStatus.COMPLETED,
          completedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Batch processing error:', error);
      await prisma.processingBatch.update({
        where: { id: batchId },
        data: {
          status: BatchStatus.FAILED
        }
      });
    } finally {
      this.activeProcesses.delete(batchId);
    }
  }

  /**
   * Process all files in a batch
   */
  private async processBatch(batchId: string): Promise<void> {
    const files = await prisma.archivedFile.findMany({
      where: {
        batchId,
        processingStatus: ProcessingStatus.PENDING
      }
    });

    const batch = await prisma.processingBatch.findUnique({
      where: { id: batchId }
    });

    if (!batch) throw new Error('Batch not found');

    await prisma.processingBatch.update({
      where: { id: batchId },
      data: { filesQueued: files.length }
    });

    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    for (const file of files) {
      try {
        await this.processFile(file.id);
        succeeded++;
      } catch (error) {
        console.error(`Error processing file ${file.id}:`, error);
        failed++;
        
        await this.logError(batchId, file.id, file.fileName, error);
      }

      processed++;

      // Update progress
      const progress = (processed / files.length) * 100;
      await prisma.processingBatch.update({
        where: { id: batchId },
        data: {
          filesProcessed: processed,
          filesSucceeded: succeeded,
          filesFailed: failed,
          progress
        }
      });
    }
  }

  /**
   * Process a single file
   */
  async processFile(fileId: string): Promise<void> {
    const startTime = Date.now();

    // Update status
    await prisma.archivedFile.update({
      where: { id: fileId },
      data: {
        processingStatus: ProcessingStatus.ANALYZING,
        processingAttempts: { increment: 1 },
        lastProcessedAt: new Date()
      }
    });

    const file = await prisma.archivedFile.findUnique({
      where: { id: fileId }
    });

    if (!file) throw new Error('File not found');

    try {
      // Step 1: Download file from SharePoint
      const fileContent = await this.downloadFile(file);

      // Step 2: Upload to S3
      const cloudPath = await this.uploadToCloud(file.fileName, fileContent);

      // Step 3: Extract content
      const extracted = await contentExtractor.extractContent(
        fileContent,
        file.mimeType || 'application/octet-stream',
        file.fileName
      );

      // Step 4: Classify file
      const classification = await classifyFile(file.fileName, extracted.text);

      // Step 5: Generate tags
      const tagging = await autoTagger.generateTags(
        fileId,
        file.fileName,
        extracted.text,
        extracted.entities
      );

      // Step 6: Update file record
      await prisma.archivedFile.update({
        where: { id: fileId },
        data: {
          cloudStoragePath: cloudPath,
          fileType: classification.fileType as FileType,
          confidence: classification.confidence,
          classificationMethod: classification.method,
          textContent: extracted.text,
          jobNumber: tagging.jobNumber,
          customerName: tagging.customerName,
          productType: tagging.productType,
          retentionYears: classification.retentionYears,
          processingStatus: classification.confidence >= 50 
            ? ProcessingStatus.CLASSIFIED 
            : ProcessingStatus.NEEDS_REVIEW
        }
      });

      // Step 7: Apply tags
      await autoTagger.applyTags(fileId, tagging.tags);

      // Step 8: Discover relationships
      const relationships = await relationshipMapper.discoverRelationships(fileId);
      await relationshipMapper.createRelationships(relationships);

      // Step 9: Mark as completed
      await prisma.archivedFile.update({
        where: { id: fileId },
        data: { processingStatus: ProcessingStatus.COMPLETED }
      });

      // Log success
      const duration = Date.now() - startTime;
      await this.logProcessing(file.batchId || '', fileId, file.fileName, duration);

    } catch (error: any) {
      await prisma.archivedFile.update({
        where: { id: fileId },
        data: {
          processingStatus: ProcessingStatus.FAILED,
          processingError: error.message
        }
      });
      throw error;
    }
  }

  /**
   * Download file from SharePoint
   */
  private async downloadFile(file: any): Promise<Buffer> {
    if (!file.sharePointDriveId || !file.sharePointItemId) {
      throw new Error('SharePoint information missing');
    }

    // Extract siteId from sharePointUrl or use a default
    const siteId = 'root'; // In production, extract from file.sharePointUrl

    const stream = await microsoftGraphAPI.getFileContent(
      siteId,
      file.sharePointDriveId,
      file.sharePointItemId
    );

    // Convert stream to buffer
    const chunks: any[] = [];
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    return Buffer.concat(chunks);
  }

  /**
   * Upload file to cloud storage
   */
  private async uploadToCloud(fileName: string, content: Buffer): Promise<string> {
    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const cloudPath = `archived/${timestamp}-${safeName}`;
    
    await uploadFile(content, cloudPath);
    return cloudPath;
  }

  /**
   * Log processing activity
   */
  private async logProcessing(
    batchId: string,
    fileId: string,
    fileName: string,
    duration: number
  ): Promise<void> {
    await prisma.processingLog.create({
      data: {
        level: LogLevel.INFO,
        category: 'processing',
        message: `Successfully processed file: ${fileName}`,
        fileId,
        fileName,
        batchId,
        duration
      }
    });
  }

  /**
   * Log error
   */
  private async logError(
    batchId: string,
    fileId: string,
    fileName: string,
    error: any
  ): Promise<void> {
    await prisma.processingLog.create({
      data: {
        level: LogLevel.ERROR,
        category: 'error',
        message: `Failed to process file: ${fileName}`,
        fileId,
        fileName,
        batchId,
        errorCode: error.code,
        errorStack: error.stack
      }
    });
  }

  /**
   * Get batch progress
   */
  async getBatchProgress(batchId: string): Promise<ProcessingProgress> {
    const batch = await prisma.processingBatch.findUnique({
      where: { id: batchId }
    });

    if (!batch) throw new Error('Batch not found');

    let estimatedTimeRemaining;
    if (batch.startedAt && batch.filesProcessed > 0) {
      const elapsed = Date.now() - batch.startedAt.getTime();
      const avgTimePerFile = elapsed / batch.filesProcessed;
      const remaining = batch.filesQueued - batch.filesProcessed;
      estimatedTimeRemaining = Math.round((avgTimePerFile * remaining) / 1000 / 60); // minutes
    }

    return {
      batchId,
      progress: batch.progress,
      filesProcessed: batch.filesProcessed,
      filesSucceeded: batch.filesSucceeded,
      filesFailed: batch.filesFailed,
      estimatedTimeRemaining
    };
  }

  /**
   * Pause batch processing
   */
  async pauseBatch(batchId: string): Promise<void> {
    this.activeProcesses.delete(batchId);
    await prisma.processingBatch.update({
      where: { id: batchId },
      data: { status: BatchStatus.PAUSED }
    });
  }

  /**
   * Get all batches
   */
  async getAllBatches() {
    return prisma.processingBatch.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const batchProcessor = new BatchProcessor();
