
/**
 * SFG Aluminium Business Rules Engine
 * Evidence-backed rules extracted from company documentation
 * All rules are enforced - no exceptions without director override
 */

// ============================================================================
// FINANCIAL RULES (Evidence: SFG_Aluminium_Ltd_Analysis_2025-07-28.pdf)
// ============================================================================

export const FINANCIAL_TARGETS = {
  monthlyTurnover: 178571,
  monthlyOverhead: 50000,
  dailyTurnover: 8929,
  dailyProfit: 2500,
  targetMarginMin: 40,
  targetMarginMax: 45,
  absoluteMinimumMargin: 28,
  maxMarginDropAtPO: 5, // percentage points
} as const

export const MARGIN_RULES = {
  supplyAndInstall: { target: 45, minimum: 28, type: 'Supply & Install' },
  supplyOnly: { target: 30, minimum: 28, type: 'Supply Only' },
  maintenance: { base: 10, markup: 20, minimum: 28, type: 'Maintenance & Repair' },
  corporate: { target: 55, minimum: 28, type: 'Corporate Contract' },
} as const

export const LABOUR_RATES = {
  baseCost: 18,
  chargeOut: 36,
  overtime: 27, // 1.5x
  weekendUplift: 1.5,
} as const

// ============================================================================
// CREDIT & TIER RULES
// ============================================================================

export type CustomerTierType = 'economy' | 'standard' | 'premium' | 'unlimited'
export type StaffTierType = 'junior' | 'standard' | 'senior' | 'manager' | 'director'

export const CUSTOMER_TIERS = {
  economy: {
    name: 'Economy',
    icon: '🥉',
    color: '#6B7280',
    creditLimitMin: 0,
    creditLimitMax: 2500,
    paymentTerms: ['cash_on_delivery', '7_days'],
    requiresCreditCheck: false,
  },
  standard: {
    name: 'Standard',
    icon: '🥈',
    color: '#3B82F6',
    creditLimitMin: 2501,
    creditLimitMax: 10000,
    paymentTerms: ['7_days', '14_days', '30_days'],
    requiresCreditCheck: true,
  },
  premium: {
    name: 'Premium',
    icon: '🥇',
    color: '#8B5CF6',
    creditLimitMin: 10001,
    creditLimitMax: 50000,
    paymentTerms: ['14_days', '30_days', '60_days'],
    requiresCreditCheck: true,
  },
  unlimited: {
    name: 'Unlimited',
    icon: '💎',
    color: '#F59E0B',
    creditLimitMin: 50001,
    creditLimitMax: Infinity,
    paymentTerms: ['30_days', '60_days', '90_days'],
    requiresCreditCheck: true,
  },
} as const

export const STAFF_TIERS = {
  junior: {
    name: 'Junior Estimator',
    approvalLimit: 1000,
    level: 1,
    permissions: ['view_enquiries', 'create_enquiries'],
  },
  standard: {
    name: 'Estimator',
    approvalLimit: 5000,
    level: 2,
    permissions: ['view_enquiries', 'create_enquiries', 'edit_quotes', 'view_customers'],
  },
  senior: {
    name: 'Senior Estimator',
    approvalLimit: 15000,
    level: 3,
    permissions: ['view_enquiries', 'create_enquiries', 'edit_quotes', 'view_customers', 'approve_quotes', 'credit_checks'],
  },
  manager: {
    name: 'Manager',
    approvalLimit: 50000,
    level: 4,
    permissions: ['all_basic', 'team_management', 'override_pricing'],
  },
  director: {
    name: 'Director',
    approvalLimit: Infinity,
    level: 5,
    permissions: ['full_access'],
  },
} as const

// ============================================================================
// INSURANCE CONSTRAINTS (Evidence: Insurance facts extractedSFG Alu.txt)
// ============================================================================

export const INSURANCE_LIMITS = {
  maxWorkHeight: 15, // metres (Endorsement 25)
  maxWorkDepth: 2, // metres (Endorsement 12)
  groundworkProhibited: true, // Endorsement 60
  employersLiability: 10000000, // £10M
  publicLiability: 5000000, // £5M
  productsLiability: 5000000, // £5M
  minSubcontractorPL: 5000000, // £5M required
} as const

export const PROHIBITED_WORK = [
  'groundwork',
  'excavation',
  'demolition',
  'pile_driving',
  'railway_work',
  'airside_work',
  'offshore_work',
  'power_station_work',
] as const

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export interface MarginValidationResult {
  isValid: boolean
  margin: number
  targetMargin: number
  minimumMargin: number
  variance: number
  severity: 'ok' | 'warning' | 'critical'
  message: string
}

export function validateMargin(
  jobType: keyof typeof MARGIN_RULES,
  cost: number,
  price: number
): MarginValidationResult {
  const rule = MARGIN_RULES[jobType]
  const margin = ((price - cost) / price) * 100
  
  // Handle maintenance which has base + markup instead of target
  const target = 'target' in rule ? rule.target : rule.base + rule.markup
  const minimum = rule.minimum
  const variance = margin - target

  let severity: 'ok' | 'warning' | 'critical' = 'ok'
  let message = `Margin ${margin.toFixed(1)}% is within target range`

  if (margin < minimum) {
    severity = 'critical'
    message = `🚨 BLOCKED: Margin ${margin.toFixed(1)}% is below absolute minimum ${minimum}%. Director approval required.`
  } else if (margin < target) {
    severity = 'warning'
    message = `⚠️ WARNING: Margin ${margin.toFixed(1)}% is below target ${target}%. Consider repricing.`
  }

  return {
    isValid: margin >= minimum,
    margin,
    targetMargin: target,
    minimumMargin: minimum,
    variance,
    severity,
    message,
  }
}

export interface CreditApprovalResult {
  requiresApproval: boolean
  minimumStaffTier: StaffTierType
  canCurrentUserApprove: boolean
  escalationRequired: boolean
  message: string
}

export function validateCreditApproval(
  amount: number,
  currentUserTier: StaffTierType
): CreditApprovalResult {
  const currentTierData = STAFF_TIERS[currentUserTier]
  const canApprove = amount <= currentTierData.approvalLimit

  let minimumTier: StaffTierType = 'junior'
  for (const [tier, data] of Object.entries(STAFF_TIERS)) {
    if (amount <= data.approvalLimit) {
      minimumTier = tier as StaffTierType
      break
    }
  }

  return {
    requiresApproval: true,
    minimumStaffTier: minimumTier,
    canCurrentUserApprove: canApprove,
    escalationRequired: !canApprove,
    message: canApprove
      ? `✅ You can approve this (£${amount.toLocaleString()})`
      : `⚠️ Escalation required to ${STAFF_TIERS[minimumTier].name} (£${amount.toLocaleString()} exceeds your £${currentTierData.approvalLimit.toLocaleString()} limit)`,
  }
}

export interface InsuranceValidationResult {
  isPermitted: boolean
  violations: string[]
  warnings: string[]
  requiresSpecialApproval: boolean
}

export function validateInsuranceCompliance(projectData: {
  workHeight?: number
  workDepth?: number
  includesGroundwork: boolean
  workType: string[]
  subcontractors?: { name: string; plCover: number }[]
}): InsuranceValidationResult {
  const violations: string[] = []
  const warnings: string[] = []

  // Height check
  if (projectData.workHeight && projectData.workHeight > INSURANCE_LIMITS.maxWorkHeight) {
    violations.push(
      `🚨 CRITICAL: Work height ${projectData.workHeight}m exceeds insurance limit of ${INSURANCE_LIMITS.maxWorkHeight}m (Endorsement 25)`
    )
  }

  // Depth check
  if (projectData.workDepth && projectData.workDepth > INSURANCE_LIMITS.maxWorkDepth) {
    violations.push(
      `🚨 CRITICAL: Work depth ${projectData.workDepth}m exceeds insurance limit of ${INSURANCE_LIMITS.maxWorkDepth}m (Endorsement 12)`
    )
  }

  // Groundwork prohibition
  if (projectData.includesGroundwork) {
    violations.push(`🚨 CRITICAL: Groundwork is explicitly excluded from insurance (Endorsement 60)`)
  }

  // Prohibited work types
  const prohibitedFound = projectData.workType.filter((type) =>
    PROHIBITED_WORK.includes(type as any)
  )
  if (prohibitedFound.length > 0) {
    violations.push(
      `🚨 CRITICAL: Prohibited work types detected: ${prohibitedFound.join(', ')} (Hazardous Works Exclusion 593)`
    )
  }

  // Subcontractor PL check
  if (projectData.subcontractors) {
    projectData.subcontractors.forEach((sub) => {
      if (sub.plCover < INSURANCE_LIMITS.minSubcontractorPL) {
        violations.push(
          `🚨 CRITICAL: Subcontractor "${sub.name}" has insufficient PL cover (£${sub.plCover.toLocaleString()} < required £${INSURANCE_LIMITS.minSubcontractorPL.toLocaleString()})`
        )
      }
    })
  }

  // Warnings for approaching limits
  if (projectData.workHeight && projectData.workHeight > INSURANCE_LIMITS.maxWorkHeight * 0.8) {
    warnings.push(`⚠️ Work height ${projectData.workHeight}m is approaching insurance limit`)
  }

  return {
    isPermitted: violations.length === 0,
    violations,
    warnings,
    requiresSpecialApproval: violations.length > 0,
  }
}

export function calculateLabourCost(
  hours: number,
  isOvertime: boolean = false,
  isWeekend: boolean = false
): { cost: number; chargeOut: number; margin: number } {
  let rate: number = LABOUR_RATES.baseCost
  let chargeRate: number = LABOUR_RATES.chargeOut

  if (isOvertime) {
    rate = LABOUR_RATES.overtime
    chargeRate = LABOUR_RATES.overtime * 2 // Maintain margin on overtime
  }

  if (isWeekend) {
    rate = rate * LABOUR_RATES.weekendUplift
    chargeRate = chargeRate * LABOUR_RATES.weekendUplift
  }

  const cost = hours * rate
  const chargeOut = hours * chargeRate
  const margin = ((chargeOut - cost) / chargeOut) * 100

  return { cost, chargeOut, margin }
}

export function getDailyTarget(dayOfWeek: number): number {
  // Monday = 1, Sunday = 0
  const workingDaysPerMonth = 22
  return FINANCIAL_TARGETS.dailyTurnover
}

export function getMonthlyProgress(currentTurnover: number): {
  percentage: number
  remaining: number
  onTrack: boolean
} {
  const target = FINANCIAL_TARGETS.monthlyTurnover
  const percentage = (currentTurnover / target) * 100
  const remaining = target - currentTurnover

  // Simple check: if we're past 15th of month, we should be at 50%+
  const today = new Date()
  const dayOfMonth = today.getDate()
  const expectedPercentage = (dayOfMonth / 30) * 100

  return {
    percentage,
    remaining,
    onTrack: percentage >= expectedPercentage,
  }
}
