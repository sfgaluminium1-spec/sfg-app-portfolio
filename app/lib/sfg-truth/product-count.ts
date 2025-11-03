
/**
 * SFG NEXUS - Product Count Tracking System
 * Version: v1.2.3
 * 
 * NON-NEGOTIABLE: Maintain Product Count from ENQ → QUO (all revisions) → ORD → INV → DEL/Collect → PAID
 * Count only complete deliverable lines with their own price; separately priced accessories count; consumables do not.
 */

export interface ProductCountFields {
  ENQ_initial_count: number;
  QUO_rev_counts: QuoteRevisionCount[];
  Current_product_count: number;
  prepared_count: number;
  delivered_count: number;
  collected_count: number;
}

export interface QuoteRevisionCount {
  rev: string;
  count: number;
  ts: string; // ISO8601
}

export interface ProductCountLogEntry {
  ts: string; // ISO8601
  user: string;
  source: string;
  additions: string[];
  removals: string[];
  extras: string[];
  note: string;
  status: 'Pricing Needed' | 'Agreed' | 'Pending Approval';
  estimatorSignoff: boolean;
  financeAcknowledged: boolean;
}

export interface ProductCountValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates product count continuity
 */
export function validateProductCount(counts: Partial<ProductCountFields>): ProductCountValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check ENQ_initial_count
  if (!counts.ENQ_initial_count || counts.ENQ_initial_count < 1) {
    errors.push('ENQ_initial_count must be set and greater than 0');
  }
  
  // Check Current_product_count
  if (!counts.Current_product_count || counts.Current_product_count < 1) {
    errors.push('Current_product_count must be set and greater than 0');
  }
  
  // Check prepared vs current
  if (counts.prepared_count !== undefined && counts.Current_product_count !== undefined) {
    if (counts.prepared_count > counts.Current_product_count) {
      errors.push(`Prepared count (${counts.prepared_count}) cannot exceed Current product count (${counts.Current_product_count})`);
    }
  }
  
  // Check delivered/collected vs current
  const totalFulfilled = (counts.delivered_count || 0) + (counts.collected_count || 0);
  if (totalFulfilled > (counts.Current_product_count || 0)) {
    errors.push(`Total delivered/collected (${totalFulfilled}) cannot exceed Current product count (${counts.Current_product_count})`);
  }
  
  // Warnings for count changes
  if (counts.ENQ_initial_count && counts.Current_product_count) {
    if (counts.ENQ_initial_count !== counts.Current_product_count) {
      warnings.push(`Product count changed from ${counts.ENQ_initial_count} to ${counts.Current_product_count}. Ensure estimator sign-off and finance acknowledgment.`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Creates a product count log entry
 */
export function createProductCountLog(params: {
  user: string;
  source: string;
  additions?: string[];
  removals?: string[];
  extras?: string[];
  note: string;
  status: 'Pricing Needed' | 'Agreed' | 'Pending Approval';
}): ProductCountLogEntry {
  return {
    ts: new Date().toISOString(),
    user: params.user,
    source: params.source,
    additions: params.additions || [],
    removals: params.removals || [],
    extras: params.extras || [],
    note: params.note,
    status: params.status,
    estimatorSignoff: false,
    financeAcknowledged: false
  };
}

/**
 * Calculates delivery notes status color
 * 17b turns Green when prepared_count equals Current_product_count; else Amber
 */
export function calculateDeliveryNotesStatus(prepared: number, current: number): 'Green' | 'Amber' | 'Red' {
  if (prepared === current && current > 0) {
    return 'Green';
  } else if (prepared > current) {
    return 'Red'; // Error condition
  } else {
    return 'Amber'; // Incomplete
  }
}

/**
 * Checks if product count delta requires approval
 */
export function requiresProductCountApproval(log: ProductCountLogEntry): boolean {
  // Requires approval if additions, removals, or extras are present
  const hasChanges = (log.additions?.length || 0) + (log.removals?.length || 0) + (log.extras?.length || 0) > 0;
  
  // Must have estimator signoff and finance acknowledgment
  return hasChanges && (!log.estimatorSignoff || !log.financeAcknowledged);
}

/**
 * Adds a revision count to the quote revision counts array
 */
export function addQuoteRevisionCount(
  existing: QuoteRevisionCount[],
  revision: string,
  count: number
): QuoteRevisionCount[] {
  return [
    ...existing,
    {
      rev: revision,
      count: count,
      ts: new Date().toISOString()
    }
  ];
}

/**
 * Gets the latest quote revision count
 */
export function getLatestQuoteRevision(revCounts: QuoteRevisionCount[]): QuoteRevisionCount | null {
  if (!revCounts || revCounts.length === 0) return null;
  
  // Sort by timestamp descending
  const sorted = [...revCounts].sort((a, b) => 
    new Date(b.ts).getTime() - new Date(a.ts).getTime()
  );
  
  return sorted[0];
}

/**
 * Blocks QUO→ORD conversion if product count is MISSING
 */
export function canConvertQuoteToOrder(fields: Partial<ProductCountFields>): { allowed: boolean; reason?: string } {
  if (!fields.ENQ_initial_count || fields.ENQ_initial_count < 1) {
    return {
      allowed: false,
      reason: 'ENQ_initial_count is MISSING or invalid. Cannot convert quote to order.'
    };
  }
  
  if (!fields.Current_product_count || fields.Current_product_count < 1) {
    return {
      allowed: false,
      reason: 'Current_product_count is MISSING or invalid. Cannot convert quote to order.'
    };
  }
  
  return { allowed: true };
}
