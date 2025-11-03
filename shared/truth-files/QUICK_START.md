# SFG Truth Files - Quick Start Guide

## 🎯 What Are These Files?

These are the **canonical source of truth** for all business logic, rules, and configurations in the SFG Aluminium system. Import these files into any application to ensure consistency across the entire ecosystem.

## 📦 What's Included

### 8 JSON Truth Files
1. **staff-tiers-truth.json** - Staff authorization levels (5 tiers, 10 people)
2. **customer-tiers-truth.json** - Customer classifications (5 tiers)
3. **project-rules-truth.json** - Core project management rules (5 rules)
4. **credit-logic-truth.json** - Credit tier logic and payment terms (5 tiers)
5. **document-lifecycle-truth.json** - Document stages (6 stages: ENQ→PAID)
6. **building-regs-truth.json** - UK Building Regulations (4 documents)
7. **credit-calculation-truth.json** - Credit limit calculation algorithm
8. **permissions-matrix-truth.json** - Staff permissions (13 actions × 5 tiers)

### 1 TypeScript File
9. **truth-types.ts** - Complete TypeScript type definitions (25+ interfaces)

## 🚀 Quick Usage

### In React/Next.js:
```typescript
import staffTiers from './truth-files/staff-tiers-truth.json';
import { StaffTiersData } from './truth-files/truth-types';

const tiers: StaffTiersData = staffTiers;

// Use in component
{tiers.staffTiers.map(tier => (
  <div key={tier.id} style={{ color: tier.primary }}>
    {tier.name} - {tier.limit}
  </div>
))}
```

### In Python:
```python
import json

with open('staff-tiers-truth.json') as f:
    data = json.load(f)
    
for tier in data['staffTiers']:
    print(f"{tier['name']}: {tier['limit']}")
```

### In Node.js:
```javascript
const staffTiers = require('./staff-tiers-truth.json');

staffTiers.staffTiers.forEach(tier => {
    console.log(`${tier.name}: ${tier.limit}`);
});
```

## 📋 Key Data Reference

### Staff Tiers (Authorization Limits)
- Tier 1 (Entry): £1,000
- Tier 2 (Production): £5,000
- Tier 3 (Design): £15,000
- Tier 4 (Finance): £50,000
- Tier 5 (Executive): Unlimited

### Customer Tiers (Payment Terms)
- Crimson (Risk): COD
- Green (Proforma): COD/7 Days
- Steel (Standard): 7-30 Days
- Sapphire (Preferred): 30-60 Days
- Platinum (Premier): 60-90 Days

### Document Lifecycle
ENQ → QUO → INV → PO → DEL → PAID

## ✅ File Validation

All files have been validated for:
- ✓ JSON syntax correctness
- ✓ Metadata completeness
- ✓ Color code accuracy
- ✓ Numeric value precision
- ✓ Relationship integrity

## 🔄 Next Steps

1. **Upload to GitHub:**
   ```bash
   cp -r /home/ubuntu/sfg-truth-files/* \
         /home/ubuntu/github_repos/sfg-app-portfolio/shared/truth-files/
   ```

2. **Import into your application:**
   - Enable JSON imports in tsconfig.json
   - Import the needed truth files
   - Use TypeScript types for type safety

3. **Keep in sync:**
   - Subscribe to truth file updates
   - Implement version checking
   - Set up automated CI/CD validation

## 📞 Support

Questions? Contact Warren (Executive tier)

Version: 2.1.0 | Last Updated: 2025-11-03
