# Satellite Applications

Independent applications that extend the SFG NEXUS ecosystem. Each satellite app maintains its own API and coordinates with NEXUS through the webhook system.

## Architecture Principle
**One API per application** - Each satellite maintains complete independence while coordinating through the central webhook handler.

## Current Satellite Apps

### customer-portal/
Customer-facing portal for order tracking, quotes, and communication.

### production-tracker/
Internal production tracking and workflow management.

### credit-checker/
Automated credit checking integration with Xero and credit agencies.

## Adding New Satellite Apps
1. Create new directory under `/satellite-apps/`
2. Implement independent API
3. Register webhook endpoint in `/infrastructure/webhooks/`
4. Add API specification to `/docs/api-specs/`
5. Configure tier-specific access in relevant MCP configs

## Communication Pattern
All satellite apps communicate through:
1. Incoming webhooks from NEXUS
2. Outgoing API calls to NEXUS
3. Shared truth files in `/shared/truth-files/`
