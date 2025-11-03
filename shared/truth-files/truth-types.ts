
/**
 * TypeScript Type Definitions for SFG Aluminium Truth Files
 * Version: 2.1.0
 * Last Updated: 2025-11-03
 * 
 * These types correspond to the JSON truth files in the shared/truth-files/ directory
 */

// ============================================================================
// STAFF TIERS
// ============================================================================

/**
 * Individual staff tier with authorization limits and assigned personnel
 */
export interface StaffTier {
  /** Unique tier identifier (1-5) */
  id: number;
  /** Descriptive name of the tier */
  name: string;
  /** Primary color code in hex format */
  primary: string;
  /** Authorization limit for quotes (e.g., "£15,000" or "Unlimited") */
  limit: string;
  /** Department category */
  dept: string;
  /** Array of staff members assigned to this tier */
  staff: string[];
}

/**
 * Complete staff tiers structure with metadata
 */
export interface StaffTiersData {
  metadata: {
    version: string;
    lastUpdated: string;
    description: string;
    source: string;
  };
  staffTiers: StaffTier[];
}

// ============================================================================
// CUSTOMER TIERS
// ============================================================================

/**
 * Individual customer tier classification
 */
export interface CustomerTier {
  /** Unique tier identifier (1-5) */
  id: number;
  /** Descriptive name of the tier with color designation */
  name: string;
  /** Primary color code in hex format */
  primary: string;
  /** Spending criteria or tier qualification */
  spend: string;
}

/**
 * Complete customer tiers structure with metadata
 */
export interface CustomerTiersData {
  metadata: {
    version: string;
    lastUpdated: string;
    description: string;
    source: string;
  };
  customerTiers: CustomerTier[];
}

// ============================================================================
// PROJECT RULES
// ============================================================================

/**
 * Individual project management rule
 */
export interface ProjectRule {
  /** Unique rule identifier */
  id: number;
  /** Short rule title */
  title: string;
  /** Detailed rule description */
  detail: string;
}

/**
 * Complete project rules structure with metadata
 */
export interface ProjectRulesData {
  metadata: {
    version: string;
    lastUpdated: string;
    description: string;
    source: string;
  };
  projectRules: ProjectRule[];
}

// ============================================================================
// CREDIT LOGIC
// ============================================================================

/**
 * Individual credit tier logic
 */
export interface CreditTier {
  /** Tier name (e.g., "Crimson", "Platinum") */
  tier: string;
  /** Color code in hex format */
  color: string;
  /** Trigger condition for this tier */
  trigger: string;
  /** Payment terms for this tier */
  terms: string;
}

/**
 * Complete credit logic structure with metadata
 */
export interface CreditLogicData {
  metadata: {
    version: string;
    lastUpdated: string;
    description: string;
    source: string;
  };
  creditLogic: CreditTier[];
}

// ============================================================================
// DOCUMENT LIFECYCLE
// ============================================================================

/**
 * Individual document lifecycle stage
 */
export interface DocumentStage {
  /** 3-letter stage code (e.g., "ENQ", "QUO") */
  stage: string;
  /** Full stage name */
  name: string;
  /** Color code in hex format */
  color: string;
}

/**
 * Complete document lifecycle structure with metadata
 */
export interface DocumentLifecycleData {
  metadata: {
    version: string;
    lastUpdated: string;
    description: string;
    source: string;
  };
  documentLifecycle: DocumentStage[];
}

// ============================================================================
// BUILDING REGULATIONS
// ============================================================================

/**
 * Individual building regulation document
 */
export interface BuildingRegulation {
  /** Document code (e.g., "DOC_B", "DOC_L") */
  code: string;
  /** Document title with emoji */
  title: string;
  /** Color code in hex format */
  color: string;
  /** Array of compliance items */
  items: string[];
}

/**
 * Compliance check requirements for different building types
 */
export interface ComplianceChecks {
  commercialBuildings: string[];
  newDwellings: string[];
  extensionsOver25sqm: string[];
  windowReplacementOver50percent: string[];
}

/**
 * Complete building regulations structure with metadata
 */
export interface BuildingRegulationsData {
  metadata: {
    version: string;
    lastUpdated: string;
    description: string;
    source: string;
  };
  buildingRegulations: BuildingRegulation[];
  complianceChecks: ComplianceChecks;
}

// ============================================================================
// CREDIT CALCULATION
// ============================================================================

/**
 * Company age multiplier rule
 */
export interface AgeMultiplierRule {
  condition: string;
  multiplier: number;
  label: string;
}

/**
 * Company type multiplier
 */
export interface CompanyTypeMultiplier {
  multiplier: number;
  label: string;
}

/**
 * Accounts filing multiplier rule
 */
export interface FilingMultiplierRule {
  condition: string;
  multiplier: number;
  label: string;
}

/**
 * Payment history multiplier
 */
export interface PaymentHistoryMultiplier {
  multiplier: number;
  label: string;
}

/**
 * References multiplier rule
 */
export interface ReferencesMultiplierRule {
  condition: string;
  multiplier: number;
  label: string;
}

/**
 * Credit calculation algorithm structure
 */
export interface CreditCalculationAlgorithm {
  baseAmount: number;
  description: string;
  companyAgeMultipliers: {
    description: string;
    rules: AgeMultiplierRule[];
  };
  companyTypeMultipliers: {
    description: string;
    types: {
      plc: CompanyTypeMultiplier;
      ltd: CompanyTypeMultiplier;
      llp: CompanyTypeMultiplier;
      sole_trader: CompanyTypeMultiplier;
    };
  };
  accountsFilingMultipliers: {
    description: string;
    rules: FilingMultiplierRule[];
  };
  paymentHistoryMultipliers: {
    description: string;
    levels: {
      excellent: PaymentHistoryMultiplier;
      good: PaymentHistoryMultiplier;
      fair: PaymentHistoryMultiplier;
      poor: PaymentHistoryMultiplier;
    };
  };
  referencesMultipliers: {
    description: string;
    rules: ReferencesMultiplierRule[];
    note: string;
  };
  finalRounding: {
    description: string;
    formula: string;
  };
}

/**
 * Example calculation step
 */
export interface CalculationStep {
  step: number;
  description: string;
  amount: number;
}

/**
 * Complete credit calculation structure with metadata
 */
export interface CreditCalculationData {
  metadata: {
    version: string;
    lastUpdated: string;
    description: string;
    source: string;
  };
  creditCalculationAlgorithm: CreditCalculationAlgorithm;
  exampleCalculation: {
    description: string;
    inputs: {
      companyAge: number;
      companyType: string;
      accountsAvailable: boolean;
      filingStatus: string;
      paymentHistory: string;
      bankRefs: number;
      tradeRefs: number;
    };
    steps: CalculationStep[];
    finalCreditLimit: string;
  };
}

// ============================================================================
// PERMISSIONS MATRIX
// ============================================================================

/**
 * Permissions for a specific action across all tiers
 */
export interface PermissionAction {
  /** Action name */
  action: string;
  /** Action description */
  description: string;
  /** Permissions by tier (true = allowed, false = denied) */
  permissions: {
    tier1: boolean;
    tier2: boolean;
    tier3: boolean;
    tier4: boolean;
    tier5: boolean;
  };
}

/**
 * Summary information for a tier
 */
export interface TierSummary {
  name: string;
  totalPermissions: number;
  description: string;
}

/**
 * Complete permissions matrix structure with metadata
 */
export interface PermissionsMatrixData {
  metadata: {
    version: string;
    lastUpdated: string;
    description: string;
    source: string;
  };
  permissionsMatrix: PermissionAction[];
  tierSummary: {
    tier1: TierSummary;
    tier2: TierSummary;
    tier3: TierSummary;
    tier4: TierSummary;
    tier5: TierSummary;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Generic metadata structure used across all truth files
 */
export interface TruthFileMetadata {
  version: string;
  lastUpdated: string;
  description: string;
  source: string;
}

/**
 * Union type of all tier IDs
 */
export type TierId = 1 | 2 | 3 | 4 | 5;

/**
 * Union type of all company types
 */
export type CompanyType = 'plc' | 'ltd' | 'llp' | 'sole_trader';

/**
 * Union type of all filing statuses
 */
export type FilingStatus = 'current' | 'late' | 'overdue';

/**
 * Union type of all payment history levels
 */
export type PaymentHistory = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * Union type of all document stage codes
 */
export type DocumentStageCode = 'ENQ' | 'QUO' | 'INV' | 'PO' | 'DEL' | 'PAID';

/**
 * Union type of all building regulation codes
 */
export type BuildingRegCode = 'DOC_B' | 'DOC_L' | 'DOC_N' | 'DOC_Q';

/**
 * Union type of all credit tier names
 */
export type CreditTierName = 'Crimson' | 'Green' | 'Platinum' | 'Sapphire' | 'Steel';
