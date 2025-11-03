
/**
 * SFG NEXUS - Email and Filename Pattern Validation
 * Version: v1.2.3
 * 
 * NON-NEGOTIABLE: Email subjects and filenames must follow defined patterns precisely.
 * Any deviation raises a red alert and blocks send.
 */

import sfgTruthConfig from '../../config/sfg-truth-config.json';

export interface EmailSubjectParams {
  BaseNumber: string;
  Prefix: string;
  Customer: string;
  Project: string;
  Location: string;
  ProductType: string;
  DeliveryType: string;
  CustomerOrderNumber?: string;
}

export interface FilenameParams {
  BaseNumber: string;
  Prefix: string;
  Revision?: string;
  PONumber?: string;
  Category?: string;
}

export interface PatternValidation {
  valid: boolean;
  generatedPattern?: string;
  errors: string[];
  redAlert: boolean;
}

/**
 * Generates email subject following the mandatory pattern
 * Pattern: [{BaseNumber}-{Prefix}] → CUS {Customer} → {Project} → {Location} → {ProductType} → {DeliveryType} — SFG Aluminium — Customer Order nr {CustomerOrderNumber?}
 */
export function generateEmailSubject(params: EmailSubjectParams): string {
  const {
    BaseNumber,
    Prefix,
    Customer,
    Project,
    Location,
    ProductType,
    DeliveryType,
    CustomerOrderNumber
  } = params;
  
  // Check for MISSING fields
  const sanitize = (val: string | undefined) => val && val.trim() !== '' ? val : 'MISSING';
  
  const subject = [
    `[${sanitize(BaseNumber)}-${sanitize(Prefix)}]`,
    '→ CUS',
    sanitize(Customer),
    '→',
    sanitize(Project),
    '→',
    sanitize(Location),
    '→',
    sanitize(ProductType),
    '→',
    sanitize(DeliveryType),
    '— SFG Aluminium —',
    CustomerOrderNumber ? `Customer Order nr ${CustomerOrderNumber}` : ''
  ].filter(Boolean).join(' ');
  
  return subject;
}

/**
 * Validates email subject against the mandatory pattern
 */
export function validateEmailSubject(subject: string, params: EmailSubjectParams): PatternValidation {
  const generatedPattern = generateEmailSubject(params);
  const errors: string[] = [];
  let redAlert = false;
  
  // Check if subject matches the pattern
  if (!subject.startsWith(`[${params.BaseNumber}-${params.Prefix}]`)) {
    errors.push('Subject must start with [{BaseNumber}-{Prefix}]');
    redAlert = true;
  }
  
  // Check for MISSING segments
  if (subject.includes('MISSING')) {
    errors.push('Subject contains MISSING field values. All required fields must be populated.');
    redAlert = true;
  }
  
  // Check for required segments
  const requiredSegments = [
    '→ CUS',
    params.Customer,
    params.Project,
    params.Location,
    params.ProductType,
    params.DeliveryType,
    'SFG Aluminium'
  ];
  
  for (const segment of requiredSegments) {
    if (!subject.includes(segment)) {
      errors.push(`Subject missing required segment: "${segment}"`);
      redAlert = true;
    }
  }
  
  return {
    valid: errors.length === 0,
    generatedPattern,
    errors,
    redAlert
  };
}

/**
 * Generates quote filename following the mandatory pattern
 * Pattern: {BaseNumber}-{Prefix}_Quote_{Revision}.pdf
 */
export function generateQuoteFilename(params: FilenameParams): string {
  const { BaseNumber, Prefix, Revision } = params;
  return `${BaseNumber || 'MISSING'}-${Prefix || 'MISSING'}_Quote_${Revision || 'MISSING'}.pdf`;
}

/**
 * Generates PO filename following the mandatory pattern
 * Pattern: {BaseNumber}-{Prefix}_Customer_PO_{PONumber}.pdf
 */
export function generatePOFilename(params: FilenameParams): string {
  const { BaseNumber, Prefix, PONumber } = params;
  return `${BaseNumber || 'MISSING'}-${Prefix || 'MISSING'}_Customer_PO_${PONumber || 'MISSING'}.pdf`;
}

/**
 * Generates supplier RFQ filename following the mandatory pattern
 * Pattern: {BaseNumber}-SFG-ENQ_RFQ_{Category}.pdf
 */
export function generateSupplierRFQFilename(params: FilenameParams): string {
  const { BaseNumber, Category } = params;
  return `${BaseNumber || 'MISSING'}-SFG-ENQ_RFQ_${Category || 'MISSING'}.pdf`;
}

/**
 * Validates filename against mandatory patterns
 */
export function validateFilename(filename: string, type: 'quote' | 'po' | 'rfq', params: FilenameParams): PatternValidation {
  const errors: string[] = [];
  let redAlert = false;
  let generatedPattern: string;
  
  switch (type) {
    case 'quote':
      generatedPattern = generateQuoteFilename(params);
      if (!filename.match(/^\d{4}-\d{4}-(ENQ|QUO|ORD)_Quote_[^.]+\.pdf$/)) {
        errors.push('Quote filename does not match pattern: {BaseNumber}-{Prefix}_Quote_{Revision}.pdf');
        redAlert = true;
      }
      break;
    case 'po':
      generatedPattern = generatePOFilename(params);
      if (!filename.match(/^\d{4}-\d{4}-(ENQ|QUO|ORD)_Customer_PO_[^.]+\.pdf$/)) {
        errors.push('PO filename does not match pattern: {BaseNumber}-{Prefix}_Customer_PO_{PONumber}.pdf');
        redAlert = true;
      }
      break;
    case 'rfq':
      generatedPattern = generateSupplierRFQFilename(params);
      if (!filename.match(/^\d{4}-\d{4}-SFG-ENQ_RFQ_[^.]+\.pdf$/)) {
        errors.push('RFQ filename does not match pattern: {BaseNumber}-SFG-ENQ_RFQ_{Category}.pdf');
        redAlert = true;
      }
      break;
    default:
      return {
        valid: false,
        errors: ['Unknown filename type'],
        redAlert: true
      };
  }
  
  if (filename.includes('MISSING')) {
    errors.push('Filename contains MISSING field values');
    redAlert = true;
  }
  
  return {
    valid: errors.length === 0,
    generatedPattern,
    errors,
    redAlert
  };
}

/**
 * Creates a Teams red alert message for pattern violations
 */
export function createPatternViolationAlert(errors: string[], context: string): string {
  return `🚨 RED ALERT: Email/Filename Pattern Violation\n\nContext: ${context}\n\nErrors:\n${errors.map(e => `• ${e}`).join('\n')}\n\nSend BLOCKED until patterns are corrected.`;
}
