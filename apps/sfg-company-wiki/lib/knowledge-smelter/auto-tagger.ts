
/**
 * Auto-Tagging Engine
 * Automatically generates and applies tags to archived files
 */

import { prisma } from '../db';
import { contentExtractor } from './content-extractor';

export interface TaggingResult {
  tags: Array<{
    key: string;
    value: string;
    source: string;
    confidence: number;
  }>;
  jobNumber?: string;
  customerName?: string;
  productType?: string;
}

class AutoTagger {
  /**
   * Generate tags for a file
   */
  async generateTags(
    fileId: string,
    fileName: string,
    textContent: string,
    extractedEntities: any
  ): Promise<TaggingResult> {
    const tags: TaggingResult['tags'] = [];

    // Extract job number
    const jobNumber = contentExtractor.extractJobNumber(textContent, fileName);
    if (jobNumber) {
      tags.push({
        key: 'job_number',
        value: jobNumber,
        source: 'Extracted',
        confidence: 90
      });
    }

    // Extract customer names from entities
    if (extractedEntities.customerNames?.length > 0) {
      for (const customer of extractedEntities.customerNames) {
        tags.push({
          key: 'customer',
          value: customer,
          source: 'AI',
          confidence: 80
        });
      }
    }

    // Extract product types
    if (extractedEntities.productTypes?.length > 0) {
      for (const product of extractedEntities.productTypes) {
        tags.push({
          key: 'product_type',
          value: product,
          source: 'AI',
          confidence: 85
        });
      }
    } else {
      // Fallback to regex extraction
      const product = contentExtractor.extractProductType(textContent);
      if (product) {
        tags.push({
          key: 'product_type',
          value: product,
          source: 'Extracted',
          confidence: 70
        });
      }
    }

    // Extract dates
    if (extractedEntities.dates?.length > 0) {
      for (const date of extractedEntities.dates) {
        tags.push({
          key: 'document_date',
          value: date,
          source: 'AI',
          confidence: 75
        });
      }
    }

    // Extract year from filename or content
    const yearMatch = fileName.match(/20\d{2}/) || textContent.match(/20\d{2}/);
    if (yearMatch) {
      tags.push({
        key: 'year',
        value: yearMatch[0],
        source: 'Extracted',
        confidence: 95
      });
    }

    // Extract file type from extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension) {
      tags.push({
        key: 'file_extension',
        value: extension,
        source: 'Metadata',
        confidence: 100
      });
    }

    return {
      tags,
      jobNumber: jobNumber || undefined,
      customerName: extractedEntities.customerNames?.[0],
      productType: extractedEntities.productTypes?.[0] || 
                   contentExtractor.extractProductType(textContent) || undefined
    };
  }

  /**
   * Apply tags to database
   */
  async applyTags(fileId: string, tags: TaggingResult['tags']): Promise<void> {
    for (const tag of tags) {
      await prisma.fileTag.create({
        data: {
          fileId,
          key: tag.key,
          value: tag.value,
          source: tag.source,
          confidence: tag.confidence
        }
      });
    }
  }

  /**
   * Get all tags for a file
   */
  async getFileTags(fileId: string) {
    return prisma.fileTag.findMany({
      where: { fileId },
      orderBy: [
        { key: 'asc' },
        { confidence: 'desc' }
      ]
    });
  }

  /**
   * Search files by tag
   */
  async searchByTag(key: string, value: string) {
    return prisma.fileTag.findMany({
      where: {
        key,
        value: {
          contains: value,
          mode: 'insensitive'
        }
      },
      include: {
        file: true
      }
    });
  }

  /**
   * Get tag statistics
   */
  async getTagStats() {
    const allTags = await prisma.fileTag.findMany({
      select: {
        key: true,
        value: true
      }
    });

    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag.key] = (acc[tag.key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uniqueValues = allTags.reduce((acc, tag) => {
      if (!acc[tag.key]) acc[tag.key] = new Set();
      acc[tag.key].add(tag.value);
      return acc;
    }, {} as Record<string, Set<string>>);

    return {
      totalTags: allTags.length,
      tagCounts,
      uniqueValues: Object.entries(uniqueValues).reduce((acc, [key, set]) => {
        acc[key] = set.size;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const autoTagger = new AutoTagger();
