# Business Logic Files

This directory contains business logic documentation for all registered satellite apps.

## Purpose

Each satellite app must document its business logic in a JSON file when registering.

## Format

```json
{
  "app_name": "app-identifier",
  "version": "1.0.0",
  "capabilities": ["list", "of", "features"],
  "workflows": [
    {
      "name": "Workflow Name",
      "steps": ["step1", "step2"]
    }
  ],
  "business_rules": [
    {
      "rule": "Rule description",
      "condition": "When to apply",
      "action": "What happens"
    }
  ],
  "integrations": [
    {"system": "System Name", "purpose": "Integration purpose"}
  ]
}
```

## Approval Process

1. App submits registration with business logic file
2. NEXUS reviews the file
3. If complete, NEXUS approves
4. App becomes active in ecosystem