# Shared Resources

Common resources used across the entire SFG Aluminium ecosystem.

## Directory Structure

### truth-files/
JSON truth files containing business rules, tier configurations, and system logic.
- Tier definitions and spending limits
- BaseNumber system rules
- Folder structure templates
- Required field definitions

### types/
Shared TypeScript type definitions used across all applications.
- Customer types
- Staff types
- Project types
- Transaction types

### utils/
Shared utility functions and helpers.
- Date formatting
- Currency handling
- Validation functions
- Common calculations

### constants/
Shared constants and configuration values.
- Tier limits
- System-wide settings
- API endpoints
- Feature flags

## Usage
Import shared resources in any application:
```typescript
import { TierConfig } from '@shared/truth-files/tier-config.json';
import { CustomerType } from '@shared/types/customer';
import { formatCurrency } from '@shared/utils/currency';
import { TIER_LIMITS } from '@shared/constants/tiers';
```

## Versioning
Shared resources follow semantic versioning. Breaking changes require major version bump.
