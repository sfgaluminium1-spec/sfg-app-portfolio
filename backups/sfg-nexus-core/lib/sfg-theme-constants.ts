/**
 * SFG Theme Package v4.0 - Pure Design System
 * Date: November 4, 2025
 * Staff & Customer Tier Data Structures
 */

export interface StaffTier {
  code: string;
  name: string;
  color: string;
  approvalLimit: number;
  badgeText: string;
  description: string;
  exampleMembers: string[];
}

export interface CustomerTier {
  name: string;
  color: string;
  displayName: string;
}

export interface DocumentStage {
  code: string;
  name: string;
  color: string;
  order: number;
}

/* Staff Tier Data Structure */
export const STAFF_TIERS: Record<string, StaffTier> = {
  T1: {
    code: 'T1',
    name: 'Directors',
    color: '#991b1b',
    approvalLimit: Infinity,
    badgeText: 'T1 - Directors',
    description: 'Full system access, unlimited approval authority',
    exampleMembers: ['Warren', 'Pawel', 'Yanika']
  },
  T2: {
    code: 'T2',
    name: 'Finance',
    color: '#7c3aed',
    approvalLimit: 50000,
    badgeText: 'T2 - Finance',
    description: 'Finance operations, credit management, high-value approvals',
    exampleMembers: ['Mohamad', 'Mikenzie']
  },
  T3: {
    code: 'T3',
    name: 'Design',
    color: '#1e40af',
    approvalLimit: 15000,
    badgeText: 'T3 - Design',
    description: 'Design and technical operations, mid-level approvals',
    exampleMembers: ['Matt', 'Mike', 'Rafal Z', 'Norman']
  },
  T4: {
    code: 'T4',
    name: 'Production',
    color: '#ea580c',
    approvalLimit: 5000,
    badgeText: 'T4 - Production',
    description: 'Production floor operations, basic approvals',
    exampleMembers: ['Lukasz T']
  },
  T5: {
    code: 'T5',
    name: 'Juniors',
    color: '#065f46',
    approvalLimit: 1000,
    badgeText: 'T5 - Juniors',
    description: 'Entry-level access, limited approval authority',
    exampleMembers: ['Antonee']
  }
};

/* Customer Tier Data Structure */
export const CUSTOMER_TIERS: Record<string, CustomerTier> = {
  Platinum: {
    name: 'Premier (Platinum)',
    color: '#1e40af',
    displayName: 'Premier (Platinum)'
  },
  Sapphire: {
    name: 'Preferred (Sapphire)',
    color: '#334155',
    displayName: 'Preferred (Sapphire)'
  },
  Steel: {
    name: 'Standard (Steel)',
    color: '#475569',
    displayName: 'Standard (Steel)'
  },
  Green: {
    name: 'Proforma (Green)',
    color: '#065f46',
    displayName: 'Proforma (Green)'
  },
  Crimson: {
    name: 'Risk (Crimson)',
    color: '#7f1d1d',
    displayName: 'Risk (Crimson)'
  }
};

/* Document Stage Colors & Lifecycle */
export const DOCUMENT_STAGES: Record<string, DocumentStage> = {
  ENQ: {
    code: 'ENQ',
    name: 'Enquiry',
    color: '#475569',
    order: 1
  },
  QUO: {
    code: 'QUO',
    name: 'Quote',
    color: '#3b82f6',
    order: 2
  },
  ORD: {
    code: 'ORD',
    name: 'Order',
    color: '#f59e0b',
    order: 3
  },
  INV: {
    code: 'INV',
    name: 'Invoice',
    color: '#10b981',
    order: 4
  },
  DEL: {
    code: 'DEL',
    name: 'Delivery',
    color: '#8b5cf6',
    order: 5
  },
  PAID: {
    code: 'PAID',
    name: 'Paid',
    color: '#059669',
    order: 6
  }
};

/* Document Lifecycle Workflow */
export const DOCUMENT_LIFECYCLE = ['ENQ', 'QUO', 'ORD', 'INV', 'DEL', 'PAID'] as const;

/* Numbering System Logic */
// Document IDs follow lifecycle: ENQ-XXXX → QUO-XXXX → ORD-XXXX → INV-XXXX → DEL-XXXX → PAID-XXXX
// Use in UI for status badges with corresponding stage colors

/* Typography Scale */
export const TYPOGRAPHY = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem'     // 48px
};

/* Spacing System */
export const SPACING = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem'   // 64px
};

/* Helper Functions */
export function getStaffTierBadgeClass(tierCode: string): string {
  return `sfg-badge-${tierCode.toLowerCase()}`;
}

export function getCustomerTierBadgeClass(tierName: string): string {
  return `sfg-badge-${tierName.toLowerCase()}`;
}

export function getDocumentStageBadgeClass(stageCode: string): string {
  return `sfg-badge-stage-${stageCode.toLowerCase()}`;
}

export function formatDocumentNumber(stage: string, number: number): string {
  return `${stage}-${String(number).padStart(4, '0')}`;
}

export function canApprove(userTier: string, amount: number): boolean {
  const tier = STAFF_TIERS[userTier];
  if (!tier) return false;
  return amount <= tier.approvalLimit;
}

export function getNextStage(currentStage: string): string | null {
  const currentIndex = DOCUMENT_LIFECYCLE.indexOf(currentStage as any);
  if (currentIndex === -1 || currentIndex === DOCUMENT_LIFECYCLE.length - 1) {
    return null;
  }
  return DOCUMENT_LIFECYCLE[currentIndex + 1];
}
