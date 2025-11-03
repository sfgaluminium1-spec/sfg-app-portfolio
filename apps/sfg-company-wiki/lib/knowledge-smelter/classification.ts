
import { FileType, ProcessingStatus } from '@prisma/client';
import { bytebotAI } from '../bytebot';

// File type classification rules based on COMET CORE specifications
const CLASSIFICATION_RULES = {
  // Financial documents (7 year retention)
  INVOICE: {
    patterns: {
      fileName: [/invoice/i, /inv[-_]?\d+/i, /bill/i],
      content: ['INVOICE', 'PAYMENT DUE', 'TOTAL AMOUNT', 'VAT', 'TAX INVOICE'],
      extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
    },
    retentionYears: 7,
    versioned: false,
    confidence: {
      fileName: 30,
      content: 70,
      combined: 85
    }
  },
  PURCHASE_ORDER: {
    patterns: {
      fileName: [/purchase.?order/i, /po[-_]?\d+/i, /p\.?o\./i],
      content: ['PURCHASE ORDER', 'PO NUMBER', 'ORDER DATE', 'DELIVERY DATE'],
      extensions: ['.pdf', '.doc', '.docx']
    },
    retentionYears: 7,
    versioned: false,
    confidence: {
      fileName: 30,
      content: 70,
      combined: 85
    }
  },
  DELIVERY_NOTE: {
    patterns: {
      fileName: [/delivery.?note/i, /dn[-_]?\d+/i, /dispatch/i],
      content: ['DELIVERY NOTE', 'DELIVERY DATE', 'DELIVERED BY', 'SIGNATURE'],
      extensions: ['.pdf', '.doc', '.docx']
    },
    retentionYears: 7,
    versioned: false,
    confidence: {
      fileName: 30,
      content: 70,
      combined: 85
    }
  },

  // Sales documents (7 year retention, versioned)
  QUOTE: {
    patterns: {
      fileName: [/quote/i, /quotation/i, /q[-_]?\d+/i, /estimate/i],
      content: ['QUOTATION', 'QUOTE', 'ESTIMATE', 'VALID UNTIL', 'PRICES'],
      extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
    },
    retentionYears: 7,
    versioned: true,
    confidence: {
      fileName: 30,
      content: 70,
      combined: 85
    }
  },
  DYNAMIC_PRICING: {
    patterns: {
      fileName: [/pricing/i, /price.?list/i, /rates/i],
      content: ['PRICING', 'RATE CARD', 'PRICE LIST', 'TARIFF'],
      extensions: ['.xls', '.xlsx', '.pdf']
    },
    retentionYears: 7,
    versioned: true,
    confidence: {
      fileName: 30,
      content: 70,
      combined: 85
    }
  },

  // Technical documents (Permanent retention, versioned)
  DRAWING: {
    patterns: {
      fileName: [/drawing/i, /dwg/i, /plan/i, /diagram/i, /\.dwg$/i],
      content: ['DRAWING', 'SCALE', 'REV', 'REVISION', 'DRAWING NO'],
      extensions: ['.dwg', '.pdf', '.dxf', '.png', '.jpg']
    },
    retentionYears: 999, // Permanent
    versioned: true,
    confidence: {
      fileName: 40,
      content: 60,
      combined: 85
    }
  },
  TECHNICAL_SPEC: {
    patterns: {
      fileName: [/spec(?:ification)?/i, /technical/i, /datasheet/i],
      content: ['SPECIFICATION', 'TECHNICAL', 'DATASHEET', 'DIMENSIONS'],
      extensions: ['.pdf', '.doc', '.docx']
    },
    retentionYears: 999,
    versioned: true,
    confidence: {
      fileName: 30,
      content: 70,
      combined: 85
    }
  },
  WARRANTY: {
    patterns: {
      fileName: [/warranty/i, /guarantee/i],
      content: ['WARRANTY', 'GUARANTEE', 'WARRANTEE', 'COVERAGE'],
      extensions: ['.pdf', '.doc', '.docx']
    },
    retentionYears: 999,
    versioned: false,
    confidence: {
      fileName: 40,
      content: 60,
      combined: 85
    }
  },
  WARRANTY_RECALL: {
    patterns: {
      fileName: [/warranty.?recall/i, /product.?recall/i, /safety.?notice/i],
      content: ['RECALL', 'SAFETY NOTICE', 'PRODUCT RECALL', 'WARRANTY RECALL'],
      extensions: ['.pdf', '.doc', '.docx']
    },
    retentionYears: 999,
    versioned: false,
    confidence: {
      fileName: 50,
      content: 50,
      combined: 85
    }
  },

  // Legal documents (Permanent retention)
  CONTRACT: {
    patterns: {
      fileName: [/contract/i, /agreement/i, /terms/i],
      content: ['CONTRACT', 'AGREEMENT', 'TERMS AND CONDITIONS', 'PARTIES AGREE'],
      extensions: ['.pdf', '.doc', '.docx']
    },
    retentionYears: 999,
    versioned: false,
    confidence: {
      fileName: 30,
      content: 70,
      combined: 85
    }
  },

  // Communication (7 years)
  CORRESPONDENCE: {
    patterns: {
      fileName: [/letter/i, /correspondence/i, /email/i],
      content: ['DEAR', 'SINCERELY', 'REGARDS', 'FROM:', 'TO:', 'SUBJECT:'],
      extensions: ['.pdf', '.doc', '.docx', '.msg', '.eml']
    },
    retentionYears: 7,
    versioned: false,
    confidence: {
      fileName: 20,
      content: 80,
      combined: 85
    }
  },
  EMAIL: {
    patterns: {
      fileName: [/\.msg$/i, /\.eml$/i],
      content: ['FROM:', 'TO:', 'SUBJECT:', 'DATE:', 'SENT:'],
      extensions: ['.msg', '.eml', '.mbox']
    },
    retentionYears: 7,
    versioned: false,
    confidence: {
      fileName: 60,
      content: 40,
      combined: 85
    }
  },

  // Product documents (Permanent)
  PRODUCT_SPEC: {
    patterns: {
      fileName: [/product/i, /catalog/i, /brochure/i],
      content: ['PRODUCT', 'SPECIFICATIONS', 'FEATURES', 'MODEL'],
      extensions: ['.pdf', '.doc', '.docx']
    },
    retentionYears: 999,
    versioned: false,
    confidence: {
      fileName: 30,
      content: 70,
      combined: 85
    }
  },

  // Other common types
  PHOTO: {
    patterns: {
      fileName: [/photo/i, /img/i, /image/i, /pic/i],
      content: [],
      extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.heic']
    },
    retentionYears: 7,
    versioned: false,
    confidence: {
      fileName: 20,
      content: 0,
      combined: 70
    }
  },
  SPREADSHEET: {
    patterns: {
      fileName: [],
      content: [],
      extensions: ['.xls', '.xlsx', '.csv', '.ods']
    },
    retentionYears: 7,
    versioned: false,
    confidence: {
      fileName: 0,
      content: 0,
      combined: 60
    }
  },
  PRESENTATION: {
    patterns: {
      fileName: [/presentation/i, /slides/i],
      content: [],
      extensions: ['.ppt', '.pptx', '.odp']
    },
    retentionYears: 7,
    versioned: false,
    confidence: {
      fileName: 20,
      content: 0,
      combined: 70
    }
  }
};

// File extension to MIME type mapping
const MIME_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.dwg': 'application/acad',
  '.dxf': 'application/dxf',
  '.msg': 'application/vnd.ms-outlook',
  '.eml': 'message/rfc822'
};

export interface ClassificationResult {
  fileType: FileType;
  confidence: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  method: 'RULE_BASED' | 'AI_ASSISTED' | 'MANUAL';
  retentionYears: number;
  isVersioned: boolean;
  suggestedTags: Array<{ key: string; value: string; confidence: number }>;
  reasoning: string[];
}

export interface FileInput {
  fileName: string;
  fileSize: number;
  mimeType?: string;
  textContent?: string;
  metadata?: {
    folderPath?: string;
    dateModified?: Date;
    dateCreated?: Date;
  };
}

/**
 * Classify a file using rule-based matching
 */
export function classifyFileRuleBased(input: FileInput): ClassificationResult {
  const fileName = input.fileName.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  const textContent = (input.textContent || '').toUpperCase();
  const folderPath = (input.metadata?.folderPath || '').toLowerCase();

  let bestMatch: {
    fileType: FileType;
    confidence: number;
    retentionYears: number;
    versioned: boolean;
    reasons: string[];
  } | null = null;

  // Check each file type
  for (const [fileType, rules] of Object.entries(CLASSIFICATION_RULES)) {
    const reasons: string[] = [];
    let score = 0;
    let maxScore = 0;

    // Check file name patterns
    if (rules.patterns.fileName.length > 0) {
      maxScore += rules.confidence.fileName;
      for (const pattern of rules.patterns.fileName) {
        if (pattern.test(fileName) || pattern.test(folderPath)) {
          score += rules.confidence.fileName;
          reasons.push(`Filename matches ${fileType} pattern`);
          break;
        }
      }
    }

    // Check file extension
    if (rules.patterns.extensions.length > 0 && rules.patterns.extensions.includes(fileExtension)) {
      score += 10;
      maxScore += 10;
      reasons.push(`Extension ${fileExtension} matches ${fileType}`);
    }

    // Check content patterns
    if (rules.patterns.content.length > 0 && textContent) {
      maxScore += rules.confidence.content;
      let contentMatches = 0;
      for (const pattern of rules.patterns.content) {
        if (textContent.includes(pattern)) {
          contentMatches++;
        }
      }
      if (contentMatches > 0) {
        const contentScore = (contentMatches / rules.patterns.content.length) * rules.confidence.content;
        score += contentScore;
        reasons.push(`Content matches ${contentMatches}/${rules.patterns.content.length} ${fileType} keywords`);
      }
    }

    // Calculate confidence percentage
    const confidence = maxScore > 0 ? (score / maxScore) * 100 : 0;

    // Update best match if this is better
    if (confidence > (bestMatch?.confidence || 0)) {
      bestMatch = {
        fileType: fileType as FileType,
        confidence,
        retentionYears: rules.retentionYears,
        versioned: rules.versioned,
        reasons
      };
    }
  }

  // If no good match, classify as UNCLASSIFIED
  if (!bestMatch || bestMatch.confidence < 40) {
    return {
      fileType: 'UNCLASSIFIED',
      confidence: bestMatch?.confidence || 0,
      confidenceLevel: 'LOW',
      method: 'RULE_BASED',
      retentionYears: 7, // Default retention
      isVersioned: false,
      suggestedTags: extractBasicTags(input),
      reasoning: bestMatch?.reasons || ['No matching patterns found']
    };
  }

  // Determine confidence level
  let confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  if (bestMatch.confidence >= 85) {
    confidenceLevel = 'HIGH';
  } else if (bestMatch.confidence >= 50) {
    confidenceLevel = 'MEDIUM';
  } else {
    confidenceLevel = 'LOW';
  }

  return {
    fileType: bestMatch.fileType,
    confidence: bestMatch.confidence,
    confidenceLevel,
    method: 'RULE_BASED',
    retentionYears: bestMatch.retentionYears,
    isVersioned: bestMatch.versioned,
    suggestedTags: extractBasicTags(input),
    reasoning: bestMatch.reasons
  };
}

/**
 * Classify a file using AI (Bytebot)
 */
export async function classifyFileAI(input: FileInput): Promise<ClassificationResult> {
  try {
    // First try rule-based classification
    const ruleBasedResult = classifyFileRuleBased(input);
    
    // If rule-based has high confidence, use it
    if (ruleBasedResult.confidence >= 85) {
      return ruleBasedResult;
    }

    // Otherwise, use AI for better classification
    if (!input.textContent) {
      // No text content, return rule-based result
      return ruleBasedResult;
    }

    // Prepare AI prompt
    const prompt = `Analyze this document and classify it into ONE of these types:
INVOICE, PURCHASE_ORDER, DELIVERY_NOTE, QUOTE, DYNAMIC_PRICING, DRAWING, TECHNICAL_SPEC, 
WARRANTY, WARRANTY_RECALL, CONTRACT, CORRESPONDENCE, EMAIL, PRODUCT_SPEC, PRODUCT_CATALOG,
PHOTO, REPORT, SPREADSHEET, PRESENTATION, OTHER, UNCLASSIFIED

File name: ${input.fileName}
File size: ${input.fileSize} bytes
Folder path: ${input.metadata?.folderPath || 'unknown'}

Content preview (first 500 chars):
${input.textContent.substring(0, 500)}

Respond with ONLY the classification type (e.g., "INVOICE") and confidence (0-100) in this format:
TYPE: [classification]
CONFIDENCE: [0-100]
REASONING: [brief explanation]`;

    const aiResponse = await bytebotAI.ragQuery(prompt, 'You are a document classification expert.');
    
    // Parse AI response
    const typeMatch = aiResponse.match(/TYPE:\s*(\w+)/i);
    const confMatch = aiResponse.match(/CONFIDENCE:\s*(\d+)/i);
    const reasonMatch = aiResponse.match(/REASONING:\s*(.+)/i);

    if (typeMatch && confMatch) {
      const fileType = typeMatch[1].toUpperCase() as FileType;
      const confidence = parseInt(confMatch[1]);
      const reasoning = reasonMatch ? [reasonMatch[1].trim()] : ['AI classification'];

      // Get retention rules for this type
      const rules = CLASSIFICATION_RULES[fileType as keyof typeof CLASSIFICATION_RULES];
      
      return {
        fileType,
        confidence,
        confidenceLevel: confidence >= 85 ? 'HIGH' : confidence >= 50 ? 'MEDIUM' : 'LOW',
        method: 'AI_ASSISTED',
        retentionYears: rules?.retentionYears || 7,
        isVersioned: rules?.versioned || false,
        suggestedTags: extractBasicTags(input),
        reasoning
      };
    }

    // If AI parsing failed, return rule-based result
    return {
      ...ruleBasedResult,
      method: 'AI_ASSISTED',
      reasoning: [...ruleBasedResult.reasoning, 'AI classification failed, using rules']
    };

  } catch (error) {
    console.error('AI classification error:', error);
    // Fallback to rule-based
    const result = classifyFileRuleBased(input);
    return {
      ...result,
      reasoning: [...result.reasoning, 'AI error, using rule-based classification']
    };
  }
}

/**
 * Extract basic tags from file metadata
 */
function extractBasicTags(input: FileInput): Array<{ key: string; value: string; confidence: number }> {
  const tags: Array<{ key: string; value: string; confidence: number }> = [];
  
  // Extract year from filename or date
  const yearMatch = input.fileName.match(/20\d{2}/);
  if (yearMatch) {
    tags.push({ key: 'year', value: yearMatch[0], confidence: 80 });
  } else if (input.metadata?.dateCreated) {
    tags.push({ 
      key: 'year', 
      value: input.metadata.dateCreated.getFullYear().toString(), 
      confidence: 90 
    });
  }

  // Extract potential job numbers (various formats)
  const jobPatterns = [
    /\b\d{5}\b/,           // 5-digit number like "19450"
    /ENQ[-_]?\d{4}[-_]?\d{4}/i,  // ENQ-2023-0156
    /\d{4}[-_]ENQ/i        // 0234-ENQ
  ];
  
  for (const pattern of jobPatterns) {
    const match = input.fileName.match(pattern);
    if (match) {
      tags.push({ key: 'job', value: match[0], confidence: 70 });
      break;
    }
  }

  // Extract file extension
  const extension = input.fileName.substring(input.fileName.lastIndexOf('.'));
  if (extension) {
    tags.push({ key: 'extension', value: extension, confidence: 100 });
  }

  return tags;
}

/**
 * Unified file classification function
 * Tries rule-based first, falls back to AI if confidence is low
 */
export async function classifyFile(fileName: string, content: string): Promise<ClassificationResult> {
  const input: FileInput = { 
    fileName, 
    textContent: content,
    fileSize: 0 // Will be set later
  };
  
  // Try rule-based classification first
  const ruleResult = classifyFileRuleBased(input);
  
  // If confidence is high, use rule-based result
  if (ruleResult.confidence >= 85) {
    return ruleResult;
  }
  
  // Otherwise, use AI classification
  try {
    const aiResult = await classifyFileAI(input);
    // If AI gives higher confidence, use that
    if (aiResult.confidence > ruleResult.confidence) {
      return aiResult;
    }
  } catch (error) {
    console.error('AI classification failed:', error);
  }
  
  // Fall back to rule-based result
  return ruleResult;
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(fileName: string): string {
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return MIME_TYPES[extension] || 'application/octet-stream';
}

/**
 * Determine if file needs manual review
 */
export function needsManualReview(result: ClassificationResult): boolean {
  return result.confidence < 85 || result.fileType === 'UNCLASSIFIED';
}

/**
 * Get retention years for a file type
 */
export function getRetentionYears(fileType: FileType): number {
  const rules = CLASSIFICATION_RULES[fileType as keyof typeof CLASSIFICATION_RULES];
  return rules?.retentionYears || 7;
}

/**
 * Check if file type is versioned
 */
export function isVersioned(fileType: FileType): boolean {
  const rules = CLASSIFICATION_RULES[fileType as keyof typeof CLASSIFICATION_RULES];
  return rules?.versioned || false;
}
