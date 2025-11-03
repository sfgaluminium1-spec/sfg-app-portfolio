
/**
 * SFG NEXUS - Required Fields Validation
 * Version: v1.2.3
 * 
 * NON-NEGOTIABLE: Required fields must be present (not MISSING) for QUO→ORD conversion
 */

import sfgTruthConfig from '../../config/sfg-truth-config.json';

export type FieldValue = string | number | null | undefined;

export interface ValidationResult {
  valid: boolean;
  missingFields: string[];
  errors: string[];
}

export interface ProjectFields {
  BaseNumber?: FieldValue;
  Prefix?: FieldValue;
  Customer?: FieldValue;
  Project?: FieldValue;
  Location?: FieldValue;
  ProductType?: FieldValue;
  DeliveryType?: FieldValue;
  ENQ_initial_count?: number | null;
  Current_product_count?: number | null;
}

/**
 * Checks if a field value is considered MISSING
 */
export function isMissing(value: FieldValue): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && (value.trim() === '' || value.toUpperCase() === 'MISSING')) return true;
  if (typeof value === 'number' && (isNaN(value) || value < 0)) return true;
  return false;
}

/**
 * Validates all required fields for a project
 */
export function validateRequiredFields(fields: ProjectFields): ValidationResult {
  const requiredFields = sfgTruthConfig.requiredFields;
  const missingFields: string[] = [];
  const errors: string[] = [];
  
  for (const fieldName of requiredFields) {
    const value = fields[fieldName as keyof ProjectFields];
    
    if (isMissing(value)) {
      missingFields.push(fieldName);
      errors.push(`${fieldName} is MISSING or invalid`);
    }
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields,
    errors
  };
}

/**
 * Validates fields required for QUO→ORD conversion
 * NON-NEGOTIABLE: Blocks conversion if any required field is MISSING
 */
export function validateQuoteToOrderConversion(fields: ProjectFields): ValidationResult {
  const validation = validateRequiredFields(fields);
  
  // Additional checks for QUO→ORD
  if (isMissing(fields.ENQ_initial_count)) {
    validation.missingFields.push('ENQ_initial_count');
    validation.errors.push('ENQ_initial_count must be set before converting quote to order');
    validation.valid = false;
  }
  
  if (isMissing(fields.Current_product_count)) {
    validation.missingFields.push('Current_product_count');
    validation.errors.push('Current_product_count must be set before converting quote to order');
    validation.valid = false;
  }
  
  return validation;
}

/**
 * Gets a human-readable error message for missing fields
 */
export function getMissingFieldsMessage(missingFields: string[]): string {
  if (missingFields.length === 0) return '';
  
  if (missingFields.length === 1) {
    return `Required field is MISSING: ${missingFields[0]}`;
  }
  
  return `Required fields are MISSING: ${missingFields.join(', ')}`;
}

/**
 * Creates a red alert message for Teams notification
 */
export function createRedAlert(missingFields: string[], projectInfo: Partial<ProjectFields>): string {
  const baseNumber = projectInfo.BaseNumber || 'UNKNOWN';
  const customer = projectInfo.Customer || 'UNKNOWN';
  
  return `🚨 RED ALERT: Project ${baseNumber} for ${customer} has MISSING required fields: ${missingFields.join(', ')}. Action required before progression.`;
}

/**
 * Marks a field as MISSING
 */
export const MISSING_MARKER = 'MISSING';

/**
 * Checks data completeness percentage
 */
export function calculateDataCompleteness(fields: ProjectFields): number {
  const requiredFields = sfgTruthConfig.requiredFields;
  const totalFields = requiredFields.length;
  let completedFields = 0;
  
  for (const fieldName of requiredFields) {
    const value = fields[fieldName as keyof ProjectFields];
    if (!isMissing(value)) {
      completedFields++;
    }
  }
  
  return Math.round((completedFields / totalFields) * 100);
}
