
/**
 * SFG NEXUS - Status Colours System
 * Version: v1.2.3
 * 
 * Defines colour coding for statuses across the system
 */

import sfgTruthConfig from '../../config/sfg-truth-config.json';

export type StatusPrefix = 'ENQ' | 'QUO' | 'ORD' | 'INV' | 'DEL' | 'PAID' | 'MISSING';
export type ApprovedDocsStatus = 'Partial' | 'Complete';
export type DeliveryNotesStatus = 'Match' | 'Mismatch';

export interface StatusColor {
  name: string;
  hex: string;
  className: string;
}

/**
 * Status color mappings from Truth File
 */
const STATUS_COLORS: Record<string, StatusColor> = {
  ENQ: { name: 'White', hex: '#FFFFFF', className: 'bg-white text-black border' },
  QUO: { name: 'Blue', hex: '#3B82F6', className: 'bg-blue-500 text-white' },
  ORD: { name: 'Amber', hex: '#F59E0B', className: 'bg-amber-500 text-white' },
  INV: { name: 'Purple', hex: '#A855F7', className: 'bg-purple-500 text-white' },
  DEL: { name: 'Navy', hex: '#1E3A8A', className: 'bg-blue-900 text-white' },
  PAID: { name: 'Green', hex: '#10B981', className: 'bg-green-500 text-white' },
  MISSING: { name: 'RedBadge', hex: '#EF4444', className: 'bg-red-500 text-white animate-pulse' },
  ApprovedDocumentsPartial: { name: 'Blue', hex: '#3B82F6', className: 'bg-blue-500 text-white' },
  ApprovedDocumentsComplete: { name: 'Green', hex: '#10B981', className: 'bg-green-500 text-white' },
  DeliveryNotesPreparedMatch: { name: 'Green', hex: '#10B981', className: 'bg-green-500 text-white' },
  DeliveryNotesPreparedMismatch: { name: 'Amber', hex: '#F59E0B', className: 'bg-amber-500 text-white' }
};

/**
 * Gets status color for a given prefix
 */
export function getStatusColor(prefix: StatusPrefix): StatusColor {
  return STATUS_COLORS[prefix] || STATUS_COLORS.MISSING;
}

/**
 * Gets approved documents status color
 */
export function getApprovedDocsStatusColor(status: ApprovedDocsStatus): StatusColor {
  return status === 'Complete' 
    ? STATUS_COLORS.ApprovedDocumentsComplete 
    : STATUS_COLORS.ApprovedDocumentsPartial;
}

/**
 * Gets delivery notes status color
 */
export function getDeliveryNotesStatusColor(status: DeliveryNotesStatus): StatusColor {
  return status === 'Match'
    ? STATUS_COLORS.DeliveryNotesPreparedMatch
    : STATUS_COLORS.DeliveryNotesPreparedMismatch;
}

/**
 * Checks if all approved documents are present (10a, 10b, 10c)
 */
export function checkApprovedDocsCompleteness(docs: {
  quotationApproved: boolean;
  purchaseOrderReceived: boolean;
  drawingApproved: boolean;
}): ApprovedDocsStatus {
  const { quotationApproved, purchaseOrderReceived, drawingApproved } = docs;
  
  return (quotationApproved && purchaseOrderReceived && drawingApproved) 
    ? 'Complete' 
    : 'Partial';
}

/**
 * Checks delivery notes prepared status
 */
export function checkDeliveryNotesPreparedStatus(preparedCount: number, currentProductCount: number): DeliveryNotesStatus {
  return preparedCount === currentProductCount && currentProductCount > 0
    ? 'Match'
    : 'Mismatch';
}

/**
 * Gets status badge HTML class
 */
export function getStatusBadgeClass(prefix: StatusPrefix): string {
  return getStatusColor(prefix).className;
}

/**
 * Gets all status colors for UI reference
 */
export function getAllStatusColors(): Record<string, StatusColor> {
  return STATUS_COLORS;
}
