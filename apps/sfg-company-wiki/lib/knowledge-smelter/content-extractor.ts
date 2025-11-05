
/**
 * Content Extraction System
 * Extracts text content and metadata from various file types
 */

import { bytebotAI } from '../bytebot';

export interface ExtractedContent {
  text: string;
  metadata: {
    title?: string;
    author?: string;
    createdDate?: Date;
    modifiedDate?: Date;
    pageCount?: number;
    language?: string;
  };
  entities: {
    jobNumbers: string[];
    customerNames: string[];
    productTypes: string[];
    dates: string[];
    amounts: Array<{ value: number; currency: string }>;
  };
}

class ContentExtractor {
  /**
   * Extract content from file based on mime type
   */
  async extractContent(fileBuffer: Buffer, mimeType: string, fileName: string): Promise<ExtractedContent> {
    let text = '';
    const metadata: any = {};
    
    try {
      // For now, use AI to extract content from common types
      // In production, use dedicated libraries (pdf-parse, mammoth, etc.)
      
      if (mimeType.includes('text')) {
        text = fileBuffer.toString('utf-8');
      } else if (mimeType.includes('pdf')) {
        text = await this.extractFromPDF(fileBuffer);
      } else if (mimeType.includes('word') || mimeType.includes('document')) {
        text = await this.extractFromWord(fileBuffer);
      } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
        text = await this.extractFromExcel(fileBuffer);
      }

      // Extract entities using AI
      const entities = await this.extractEntities(text);

      return {
        text: text.slice(0, 50000), // Limit to 50KB for database storage
        metadata,
        entities
      };
    } catch (error) {
      console.error('Content extraction error:', error);
      return {
        text: '',
        metadata: {},
        entities: {
          jobNumbers: [],
          customerNames: [],
          productTypes: [],
          dates: [],
          amounts: []
        }
      };
    }
  }

  /**
   * Extract text from PDF (simplified - in production use pdf-parse)
   */
  private async extractFromPDF(buffer: Buffer): Promise<string> {
    // Simplified: In production, use pdf-parse library
    // For now, use AI to extract if small file
    if (buffer.length < 1024 * 1024) {
      try {
        const base64 = buffer.toString('base64');
        const response = await bytebotAI.chatCompletion({
          messages: [
            {
              role: 'system',
              content: 'Extract all text content from this document. Return only the text, no formatting.'
            },
            {
              role: 'user',
              content: `PDF file (base64): ${base64.slice(0, 1000)}...`
            }
          ],
          temperature: 0
        });
        return response.choices[0].message.content;
      } catch {
        return '';
      }
    }
    return '';
  }

  /**
   * Extract text from Word document
   */
  private async extractFromWord(buffer: Buffer): Promise<string> {
    // In production, use mammoth.js or similar
    return '';
  }

  /**
   * Extract text from Excel
   */
  private async extractFromExcel(buffer: Buffer): Promise<string> {
    // In production, use xlsx library
    return '';
  }

  /**
   * Extract entities using AI
   */
  async extractEntities(text: string): Promise<ExtractedContent['entities']> {
    if (!text || text.length < 10) {
      return {
        jobNumbers: [],
        customerNames: [],
        productTypes: [],
        dates: [],
        amounts: []
      };
    }

    try {
      const schema = `{
        "jobNumbers": ["array of job numbers found - patterns like 19450, ENQ-2023-0156, 0234-ENQ"],
        "customerNames": ["array of customer/company names"],
        "productTypes": ["array of product types - roller shutter, door, window, glazing"],
        "dates": ["array of dates in ISO format"],
        "amounts": [{"value": number, "currency": "GBP/USD/EUR"}]
      }`;

      const extracted = await bytebotAI.extractData(text.slice(0, 5000), schema);
      
      return {
        jobNumbers: extracted.jobNumbers || [],
        customerNames: extracted.customerNames || [],
        productTypes: extracted.productTypes || [],
        dates: extracted.dates || [],
        amounts: extracted.amounts || []
      };
    } catch (error) {
      console.error('Entity extraction error:', error);
      return {
        jobNumbers: [],
        customerNames: [],
        productTypes: [],
        dates: [],
        amounts: []
      };
    }
  }

  /**
   * Extract job number using regex patterns
   */
  extractJobNumber(text: string, fileName: string): string | null {
    const patterns = [
      /\b\d{5}\b/,                           // 19450
      /ENQ[-_]\d{4}[-_]\d{4}/i,              // ENQ-2023-0156
      /\d{4}[-_]ENQ/i,                       // 0234-ENQ
      /JOB[-_]?\d+/i,                        // JOB-12345
      /PROJECT[-_]?\d+/i                     // PROJECT-12345
    ];

    // Check filename first
    for (const pattern of patterns) {
      const match = fileName.match(pattern);
      if (match) return match[0];
    }

    // Then check content
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }

    return null;
  }

  /**
   * Extract customer name using AI
   */
  async extractCustomerName(text: string): Promise<string | null> {
    try {
      const response = await bytebotAI.chatCompletion({
        messages: [
          {
            role: 'system',
            content: 'Extract the customer/company name from this document. Return ONLY the company name, nothing else. If no customer is found, return "null".'
          },
          {
            role: 'user',
            content: text.slice(0, 2000)
          }
        ],
        temperature: 0
      });
      
      const result = response.choices[0].message.content.trim();
      return result === 'null' ? null : result;
    } catch {
      return null;
    }
  }

  /**
   * Extract product type
   */
  extractProductType(text: string): string | null {
    const products = ['roller shutter', 'door', 'window', 'glazing', 'curtain', 'blind'];
    const lowerText = text.toLowerCase();
    
    for (const product of products) {
      if (lowerText.includes(product)) {
        return product;
      }
    }
    
    return null;
  }
}

export const contentExtractor = new ContentExtractor();
