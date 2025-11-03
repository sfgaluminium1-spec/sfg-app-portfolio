# SFG Aluminium Truth Files

**Version:** 2.1.0  
**Last Updated:** 2025-11-03  
**Source:** SFGCompleteSystem React Component

## Overview

This directory contains the canonical source of truth for all business logic, rules, tiers, and system configurations for the SFG Aluminium business management system. These files should be imported into all applications across the SFG ecosystem to ensure consistency.

## Files

### 1. **staff-tiers-truth.json**
- **Purpose:** Defines the 5 staff authorization tiers
- **Contains:** 
  - Tier names and IDs (1-5)
  - Primary colors (hex codes)
  - Authorization limits (£1,000 to Unlimited)
  - Department assignments
  - Staff member assignments
- **Staff Count:** 10 active staff members across 5 tiers

### 2. **customer-tiers-truth.json**
- **Purpose:** Defines the 5 customer classification tiers
- **Contains:**
  - Tier names: Premier (Platinum), Preferred (Sapphire), Standard (Steel), Proforma (Green), Risk (Crimson)
  - Primary colors (hex codes)
  - Spending criteria and qualification rules
- **Tiers:** 5 complete customer tiers preserved from original system

### 3. **project-rules-truth.json**
- **Purpose:** Core project management rules enforced system-wide
- **Contains:**
  - BaseNumber immutability rule
  - Required field specifications
  - Path structure requirements
  - Document lifecycle sequence
  - Drawing workflow lock sequence
- **Rules:** 5 fundamental project rules

### 4. **credit-logic-truth.json**
- **Purpose:** Credit tier logic with triggers and payment terms
- **Contains:**
  - 5 credit tiers: Crimson, Green, Platinum, Sapphire, Steel
  - Color codes for each tier
  - Trigger conditions (spending, on-time %, overdue days)
  - Payment terms (COD to 90 days)
- **Tiers:** 5 credit classification levels

### 5. **document-lifecycle-truth.json**
- **Purpose:** Document lifecycle stages for project tracking
- **Contains:**
  - Stage codes: ENQ, QUO, INV, PO, DEL, PAID
  - Full stage names
  - Color codes for UI representation
- **Stages:** 6 lifecycle stages from enquiry to payment

### 6. **building-regs-truth.json**
- **Purpose:** UK Building Regulations compliance requirements
- **Contains:**
  - 4 key documents: Doc B (Fire), Doc L (Energy), Doc N (Glazing), Doc Q (Security)
  - Compliance items for each document
  - Quick compliance checks by building type
- **Documents:** 4 building regulation categories

### 7. **credit-calculation-truth.json**
- **Purpose:** Complete credit limit calculation algorithm
- **Contains:**
  - Base amount (£1,000)
  - Company age multipliers (1-10+ years)
  - Company type multipliers (PLC, Ltd, LLP, Sole Trader)
  - Accounts/filing status multipliers
  - Payment history multipliers
  - References multipliers (bank + trade)
  - Final rounding logic
  - Example calculation with step-by-step breakdown
- **Algorithm:** Multi-factor credit assessment system

### 8. **permissions-matrix-truth.json**
- **Purpose:** Complete permissions matrix for all staff tiers
- **Contains:**
  - 13 distinct actions with tier-based permissions
  - Permission levels from tier 1 (entry) to tier 5 (executive)
  - Tier summaries with total permission counts
- **Actions:** 13 system actions with granular access control

### 9. **truth-types.ts**
- **Purpose:** TypeScript type definitions for all truth files
- **Contains:**
  - Interface definitions for all data structures
  - Utility types and union types
  - JSDoc comments explaining each type
- **Types:** Complete TypeScript type safety for truth data

## Usage

### JavaScript/TypeScript
```typescript
import staffTiers from './staff-tiers-truth.json';
import { StaffTiersData } from './truth-types';

const tiers: StaffTiersData = staffTiers;
console.log(tiers.staffTiers[0].name); // "Operations Managers & Directors"
```

### Python
```python
import json

with open('staff-tiers-truth.json') as f:
    staff_tiers = json.load(f)
    
print(staff_tiers['staffTiers'][0]['name'])
```

### React
```tsx
import staffTiersData from '@/truth-files/staff-tiers-truth.json';

function StaffTierDisplay() {
  return (
    <div>
      {staffTiersData.staffTiers.map(tier => (
        <div key={tier.id} style={{ backgroundColor: tier.primary }}>
          {tier.name}
        </div>
      ))}
    </div>
  );
}
```

## Data Integrity

- ✅ All JSON files validated
- ✅ All colors preserved from original system
- ✅ All staff assignments maintained
- ✅ All rules and logic documented
- ✅ Metadata included in all files

## File Size Summary

| File | Size | Records |
|------|------|---------|
| staff-tiers-truth.json | 1.2 KB | 5 tiers, 10 staff |
| customer-tiers-truth.json | 896 B | 5 tiers |
| project-rules-truth.json | 892 B | 5 rules |
| credit-logic-truth.json | 885 B | 5 tiers |
| document-lifecycle-truth.json | 771 B | 6 stages |
| building-regs-truth.json | 1.6 KB | 4 documents |
| credit-calculation-truth.json | 4.5 KB | Complete algorithm |
| permissions-matrix-truth.json | 4.2 KB | 13 actions × 5 tiers |
| truth-types.ts | 9.6 KB | All TypeScript types |

## Next Steps

1. Upload these files to GitHub repository: `sfg-app-portfolio/shared/truth-files/`
2. Import into all satellite applications
3. Configure CI/CD to validate truth file integrity
4. Set up versioning and change management workflow

## Notes

- These files represent the **single source of truth** for the entire SFG ecosystem
- Any changes to these files must be reviewed and approved by Warren (Executive tier)
- Color codes are consistent across all UIs and applications
- All monetary values should be parsed and formatted consistently
- Credit calculation algorithm is deterministic and repeatable

---

**Generated by:** DeepAgent  
**Date:** 2025-11-03  
**Status:** ✅ Production Ready
