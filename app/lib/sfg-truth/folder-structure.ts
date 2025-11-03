
/**
 * SFG NEXUS - Canonical Folder Structure
 * Version: v1.2.3
 * 
 * NON-NEGOTIABLE: Folder order and names are locked.
 * Changes require written approval from Warren Heathcote, Yanika Heathcote, or Pawel Marzec.
 */

import sfgTruthConfig from '../../config/sfg-truth-config.json';

export interface JobPath {
  baseNumber: string;
  prefix: string;
  customer: string;
  project: string;
  location: string;
  productType: string;
  deliveryType: 'SupplyOnly' | 'Collected' | 'Supply&Install';
}

export interface FolderStructure {
  canonical: string;
  monthShortcut?: string;
  subfolders: string[];
}

/**
 * Generates the canonical folder path
 * Pattern: Active/{BaseNumber}-{Prefix}/{Customer}/{Project}/{Location}/{ProductType}/{DeliveryType}
 */
export function generateCanonicalPath(jobPath: JobPath): string {
  const { baseNumber, prefix, customer, project, location, productType, deliveryType } = jobPath;
  
  // Validate required fields
  const missingFields = [];
  if (!baseNumber) missingFields.push('BaseNumber');
  if (!prefix) missingFields.push('Prefix');
  if (!customer) missingFields.push('Customer');
  if (!project) missingFields.push('Project');
  if (!location) missingFields.push('Location');
  if (!productType) missingFields.push('ProductType');
  if (!deliveryType) missingFields.push('DeliveryType');
  
  if (missingFields.length > 0) {
    throw new Error(`Cannot generate path. Missing required fields: ${missingFields.join(', ')}`);
  }
  
  // Sanitize path components (remove illegal characters)
  const sanitize = (str: string) => str.replace(/[<>:"/\\|?*]/g, '_');
  
  const activeRoot = '/sites/Files/SFG Aluminium/2025 SFG Aluminium/Active';
  
  return `${activeRoot}/${sanitize(baseNumber)}-${sanitize(prefix)}/${sanitize(customer)}/${sanitize(project)}/${sanitize(location)}/${sanitize(productType)}/${sanitize(deliveryType)}`;
}

/**
 * Generates month shortcut path
 * Pattern: /sites/Files/SFG Aluminium/2025 SFG Aluminium/{MonthYear}/Active
 */
export function generateMonthShortcutPath(date: Date = new Date()): string {
  const monthYear = date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
  const monthAccessRoot = '/sites/Files/SFG Aluminium/2025 SFG Aluminium';
  
  return `${monthAccessRoot}/${monthYear}/Active`;
}

/**
 * Returns the complete folder structure in NON-NEGOTIABLE order
 */
export function getCompleteFolderStructure(): string[] {
  return sfgTruthConfig.folders;
}

/**
 * Validates folder structure order
 */
export function validateFolderStructure(folders: string[]): { valid: boolean; errors: string[] } {
  const canonical = getCompleteFolderStructure();
  const errors: string[] = [];
  
  if (folders.length !== canonical.length) {
    errors.push(`Folder count mismatch. Expected ${canonical.length}, got ${folders.length}`);
  }
  
  for (let i = 0; i < canonical.length; i++) {
    if (folders[i] !== canonical[i]) {
      errors.push(`Folder order violation at position ${i}. Expected "${canonical[i]}", got "${folders[i] || 'undefined'}"`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Gets folder structure for a specific stage
 */
export function getFoldersByStage(stage: string): string[] {
  const allFolders = getCompleteFolderStructure();
  
  switch (stage) {
    case 'drawings':
      return allFolders.filter(f => f.startsWith('05 Drawings'));
    case 'customers':
      return allFolders.filter(f => f.startsWith('07 Customers'));
    case 'contacts':
      return allFolders.filter(f => f.startsWith('13 Customer Contacts'));
    case 'approved':
      return allFolders.filter(f => f.startsWith('10 Approved Documents'));
    case 'completed':
      return allFolders.filter(f => f.startsWith('17 Completed Pack'));
    default:
      return allFolders;
  }
}

/**
 * Drawing workflow folder progression
 * NON-NEGOTIABLE: 05a → 05b → 05c → 05d → 05e → 10c (approved) or 05g (rejected)
 */
export const DRAWING_WORKFLOW = {
  INCOMING: '05 Drawings/05a Incoming Requests',
  SFG_ISSUE: '05 Drawings/05b SFG Issue',
  CHANGE_REQUESTS: '05 Drawings/05c Change Requests',
  CONFIRMATIONS: '05 Drawings/05d Confirmations',
  APPROVAL: '05 Drawings/05e Approval',
  LIVE: '05 Drawings/05f Live Drawings',
  REJECTED: '05 Drawings/05g Rejected Designs',
  APPROVED_ARCHIVE: '10 Approved Documents (locked)/10c Drawing Approved'
} as const;

/**
 * Validates drawing workflow transition
 */
export function isValidDrawingTransition(from: string, to: string): boolean {
  const validTransitions: Record<string, string[]> = {
    [DRAWING_WORKFLOW.INCOMING]: [DRAWING_WORKFLOW.SFG_ISSUE],
    [DRAWING_WORKFLOW.SFG_ISSUE]: [DRAWING_WORKFLOW.CHANGE_REQUESTS, DRAWING_WORKFLOW.CONFIRMATIONS],
    [DRAWING_WORKFLOW.CHANGE_REQUESTS]: [DRAWING_WORKFLOW.CONFIRMATIONS],
    [DRAWING_WORKFLOW.CONFIRMATIONS]: [DRAWING_WORKFLOW.APPROVAL],
    [DRAWING_WORKFLOW.APPROVAL]: [DRAWING_WORKFLOW.APPROVED_ARCHIVE, DRAWING_WORKFLOW.REJECTED, DRAWING_WORKFLOW.LIVE],
    [DRAWING_WORKFLOW.LIVE]: [],
    [DRAWING_WORKFLOW.REJECTED]: [],
    [DRAWING_WORKFLOW.APPROVED_ARCHIVE]: []
  };
  
  return validTransitions[from]?.includes(to) ?? false;
}
