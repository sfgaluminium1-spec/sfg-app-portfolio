
# Application Registry Management Guide

## Overview

The Application Registry is a centralized database of all applications in the SFG Aluminium ecosystem. It tracks 51 applications ranging from core systems to experimental utilities.

## Application Categories

### CORE_SYSTEM
Mission-critical applications that the business depends on:
- **sfg-nexus** - Central orchestration platform
- **sfg-vertex** - Manufacturing intelligence system
- **sfg-esp** - ESP integration platform
- **sfg-sync** - Data synchronization service

### SATELLITE_APP
Specialized applications serving specific business functions:
- **chronoshift-pro** - Scheduling and payroll
- **sfg-axis** - Analytics and reporting
- **heathcote-hub** - Internal employee portal
- **company-wiki** - Knowledge management

### INTEGRATION
Connectors and middleware:
- **xero-connector** - Xero accounting integration
- **esp-api-bridge** - ESP API interface
- **s3-sync-service** - AWS S3 synchronization

### UTILITY
Helper applications and tools:
- **pdf-generator** - Document generation
- **email-scheduler** - Automated email campaigns
- **backup-manager** - System backup automation

### WORKFLOW
Process automation applications:
- **approval-workflow** - Multi-level approval system
- **notification-hub** - Centralized notifications
- **task-manager** - Task tracking and assignment

### DASHBOARD
Monitoring and visualization:
- **executive-dashboard** - Leadership metrics
- **production-monitor** - Real-time production tracking
- **financial-dashboard** - Financial KPIs

### API_SERVICE
Backend services:
- **pricing-api** - Dynamic pricing engine
- **credit-checker** - Credit verification service
- **inventory-api** - Inventory management

## Registration Process

### Automated Registration
Satellite applications can self-register using this process:

1. **Gather Metadata**
```typescript
const metadata = {
  appName: 'my-app',
  appType: 'SATELLITE_APP',
  description: 'Brief description',
  baseUrl: 'https://my-app.abacusai.app',
  technologies: ['Next.js', 'PostgreSQL'],
  owner: 'Team Name',
  repositoryPath: 'apps/my-app'
};
```

2. **Register via API**
```typescript
const response = await fetch('https://sfg-nexus.abacusai.app/api/memory/app-registry', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GITHUB_APP_TOKEN}`
  },
  body: JSON.stringify(metadata)
});
```

3. **Verify Registration**
```typescript
const { app } = await response.json();
console.log(`Registered: ${app.appName} with ID ${app.id}`);
```

### Manual Registration
For apps that cannot self-register, Warren or NEXUS can register them:

1. Navigate to NEXUS admin panel
2. Go to "App Registry" section
3. Click "Register New App"
4. Fill in all required fields
5. Submit and verify

## App Status Lifecycle

```
DEVELOPMENT → ACTIVE → MAINTENANCE → DEPRECATED → ARCHIVED
```

### DEVELOPMENT
- App is being built
- Not yet deployed to production
- Testing and iteration phase

### ACTIVE
- Fully operational
- In production use
- Serving end users

### MAINTENANCE
- Temporarily unavailable
- Under updates or fixes
- Will return to ACTIVE

### DEPRECATED
- Being phased out
- Replacement app available
- Will be archived soon

### ARCHIVED
- No longer in use
- Code preserved for reference
- Cannot be activated

## Querying the Registry

### List All Apps
```bash
curl https://sfg-nexus.abacusai.app/api/memory/app-registry
```

### Filter by Type
```bash
curl "https://sfg-nexus.abacusai.app/api/memory/app-registry?appType=SATELLITE_APP"
```

### Filter by Status
```bash
curl "https://sfg-nexus.abacusai.app/api/memory/app-registry?status=ACTIVE"
```

### Search by Name
```bash
curl "https://sfg-nexus.abacusai.app/api/memory/app-registry?search=chronoshift"
```

### Get Specific App
```bash
curl https://sfg-nexus.abacusai.app/api/memory/app-registry/{app_id}
```

## Updating Apps

### Change Status
```typescript
await fetch(`/api/memory/app-registry/${appId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'MAINTENANCE' })
});
```

### Update URL
```typescript
await fetch(`/api/memory/app-registry/${appId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ baseUrl: 'https://new-url.abacusai.app' })
});
```

### Add API Endpoints
```typescript
await fetch(`/api/memory/app-registry/${appId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiEndpoints: [
      { method: 'GET', path: '/api/data', description: 'Fetch data' },
      { method: 'POST', path: '/api/sync', description: 'Sync data' }
    ]
  })
});
```

## App Portfolio Statistics

As of November 3, 2025:
- **Total Apps:** 51
- **Core Systems:** 12
- **Satellite Apps:** 28
- **Integrations:** 6
- **Utilities:** 5

**Total Portfolio Value:** £5.17M+  
**Annual Cost Savings:** £2.1M+  
**Staff Positions Replaced:** 18 FTE

## Health Monitoring

The registry includes health monitoring for all apps:

```typescript
// Check app health
const response = await fetch(`/api/memory/app-registry/${appId}/health`);
const { status, lastChecked, uptime } = await response.json();
```

Health statuses:
- **HEALTHY** - All systems operational
- **DEGRADED** - Partial functionality
- **DOWN** - Not responding
- **UNKNOWN** - Health check failed

## Best Practices

1. **Register immediately** when deploying new apps
2. **Keep URLs updated** when apps move
3. **Document API endpoints** for integration
4. **Update status** when changing app state
5. **Add rich metadata** for better discoverability
6. **Monitor health** regularly
7. **Archive old apps** instead of deleting

## Integration with MCP

Once MCP (Model Context Protocol) is implemented, the App Registry will:
- Automatically discover new apps
- Query app capabilities
- Route requests to appropriate apps
- Monitor app health in real-time
- Coordinate multi-app workflows

---

**Registry Location:** PostgreSQL database in NEXUS  
**API Endpoint:** `/api/memory/app-registry`  
**Current App Count:** 51
