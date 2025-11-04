# Business Rules

This directory contains versioned business rules that govern SFG Aluminium operations.

## Files

- `margins.json` - Profit margin rules and thresholds
- `approval-limits.json` - Tier-based approval authority limits
- `pricing-rules.json` - Product pricing and discount rules
- `credit-check-rules.json` - Credit checking requirements
- `tier-definitions.json` - Employee tier definitions and permissions

## Version Control

Business rules are versioned. When a rule changes:
1. A new version is created
2. The old version is marked as superseded
3. All apps are notified of the change

## Usage

Apps should read these rules at startup and cache them. NEXUS will notify apps when rules change.