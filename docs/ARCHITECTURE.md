# SFG Aluminium Ecosystem Architecture

## Overview

The SFG Aluminium ecosystem is a distributed application architecture consisting of 51+ applications orchestrated by SFG NEXUS (the conductor application).

## Architecture Pattern: Hub and Spoke

```
                        ┌─────────────────────┐
                        │    SFG NEXUS       │
                        │   (Conductor/Hub)   │
                        │                     │
                        │ - Persistent Memory │
                        │ - App Registry      │
                        │ - MCP Client        │
                        │ - Workflow Engine   │
                        └──────────┬──────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
┌───────▼────────┐      ┌──────────▼────────┐      ┌─────────▼────────┐
│  Satellite 1   │      │   Satellite 2     │      │   Satellite N    │
│ ChronoShift    │      │   SFG Vertex      │ ...  │   SFG Axis       │
│ - MCP Server   │      │   - MCP Server    │      │   - MCP Server   │
│ - Business     │      │   - Business      │      │   - Business     │
│   Logic        │      │     Logic         │      │     Logic        │
└────────────────┘      └───────────────────┘      └──────────────────┘
```

## Core Components

### 1. SFG NEXUS (Conductor)
**Technology:** Next.js 14, TypeScript, PostgreSQL, AWS S3  
**Role:** Central orchestration and coordination

**Responsibilities:**
- Manage persistent memory across conversations
- Maintain app registry of all satellite applications
- Coordinate workflows across multiple apps
- Provide AI-powered business intelligence
- Handle user authentication and authorization
- Execute cross-app business processes

**Key Systems:**
- **Persistent Memory** - 8 database models for conversations, plans, decisions
- **App Registry** - Central catalog of 51+ applications
- **MCP Client** - Communication with satellite apps
- **Workflow Engine** - Multi-app workflow orchestration
- **Truth File v1.2.3** - Standardized data model for enquiries/quotes/jobs

### 2. Satellite Applications
**Count:** 51 applications (as of Nov 2025)  
**Role:** Specialized business function execution

**Categories:**
- **Core Systems (12)** - Mission-critical applications
- **Satellite Apps (28)** - Specialized functions
- **Integrations (6)** - External system connectors
- **Utilities (5)** - Helper tools and services

**Key Applications:**
- **ChronoShift Pro** - Scheduling and payroll
- **SFG Vertex** - Manufacturing intelligence
- **SFG ESP** - ESP integration
- **SFG Sync** - Data synchronization
- **SFG Axis** - Analytics and reporting

### 3. Data Layer
**Primary Database:** PostgreSQL (Supabase)  
**File Storage:** AWS S3  
**Caching:** Redis (planned)

**Database Schemas:**
- NEXUS Schema - Persistent memory, app registry
- Satellite Schemas - Each app has independent database
- Shared Models - Common entities (Customer, Job, etc.)

### 4. Integration Layer
**Protocol:** MCP (Model Context Protocol)  
**Fallback:** REST APIs  
**Real-time:** WebSockets for events

**Integration Patterns:**
- **Request/Response** - Synchronous operations
- **Event-Driven** - Asynchronous notifications
- **Batch Processing** - Scheduled data synchronization

## Communication Protocols

### MCP (Model Context Protocol)
Primary communication protocol between NEXUS and satellites.

**Features:**
- Bidirectional communication
- Command execution
- Resource querying
- Event subscriptions
- Connection pooling

**Example Flow:**
```
NEXUS → MCP Command → Satellite App
Satellite App → MCP Response → NEXUS
Satellite App → MCP Event → NEXUS (subscribed)
```

### REST APIs
Fallback for apps without MCP support.

**Endpoints:**
- `/api/execute` - Execute command
- `/api/query` - Query data
- `/api/health` - Health check

### WebHooks
For real-time event notifications.

**Events:**
- `job_created`
- `schedule_updated`
- `approval_required`
- `payment_received`

## Data Flow

### Example: Quote to Installation Flow

```
1. NEXUS → Create Quote
2. NEXUS → Pricing Intelligence (calculate price)
3. NEXUS → Send to Customer (via email/portal)
4. Customer → Approve Quote
5. NEXUS → Convert to Job
6. NEXUS → MCP → ChronoShift Pro (create schedule)
7. NEXUS → MCP → SFG Vertex (create production tasks)
8. NEXUS → MCP → SFG ESP (sync to ESP)
9. ChronoShift Pro → MCP Event → NEXUS (schedule confirmed)
10. NEXUS → MCP → SFGComms Hub (notify team)
```

## Security Architecture

### Authentication
- **User Auth:** OAuth 2.0 (Google, Microsoft)
- **App Auth:** GitHub App credentials
- **API Auth:** Bearer tokens (JWT)

### Authorization
- **Role-Based Access Control (RBAC)**
  - Executive (full access)
  - Manager (read/write business data)
  - Staff (read-only, limited write)
  - System (app-to-app communication)

### Data Security
- **Encryption at Rest:** AES-256 (database, S3)
- **Encryption in Transit:** TLS 1.3
- **Secrets Management:** Environment variables, AWS Secrets Manager

### Network Security
- **Firewall:** Cloud-based WAF
- **Rate Limiting:** 1000 req/min per app
- **IP Whitelisting:** For sensitive operations

## Deployment Architecture

### Hosting
**Platform:** Abacus.AI (primary), AWS (backup)  
**Regions:** EU-West-2 (London) for GDPR compliance

### Scalability
- **Horizontal:** Auto-scaling up to 10 instances
- **Vertical:** 4 CPU cores, 8GB RAM per instance
- **Database:** Connection pooling (max 100 connections)

### High Availability
- **Uptime Target:** 99.9%
- **Failover:** Automatic (< 60 seconds)
- **Backup:** Daily full, hourly incremental
- **Disaster Recovery:** 4-hour RPO, 8-hour RTO

### Monitoring
- **Application:** Abacus.AI built-in monitoring
- **Database:** PostgreSQL logs and metrics
- **Alerts:** Email, Slack, Teams
- **Metrics:** Response time, error rate, throughput

## Technology Stack

### Frontend
- **Framework:** Next.js 14
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** React Context, Zustand
- **Forms:** React Hook Form + Zod validation

### Backend
- **Runtime:** Node.js 20
- **Framework:** Next.js API routes
- **ORM:** Prisma
- **Database:** PostgreSQL 15
- **File Storage:** AWS S3
- **Caching:** (planned) Redis

### DevOps
- **Version Control:** Git, GitHub
- **CI/CD:** GitHub Actions
- **Deployment:** Abacus.AI platform
- **Monitoring:** Built-in + Custom dashboards
- **Logging:** Structured JSON logs

## Workflow Orchestration

### Workflow Types

1. **Sequential Workflows**
   - Step 1 completes → Step 2 begins
   - Example: Quote → Job → Schedule → Production

2. **Parallel Workflows**
   - Multiple steps execute simultaneously
   - Example: Sync to ESP + Create Schedule + Notify Team

3. **Conditional Workflows**
   - Steps execute based on conditions
   - Example: If high value, require approval; else, auto-approve

4. **Event-Driven Workflows**
   - Triggered by events from satellite apps
   - Example: When schedule complete, trigger invoice generation

### Workflow Engine (Planned)

```typescript
const workflow = new Workflow('quote-to-installation');

workflow
  .step('create-job', async (context) => {
    const job = await nexus.convertQuoteToJob(context.quoteId);
    return { jobId: job.id };
  })
  .step('create-schedule', async (context) => {
    const schedule = await mcp.execute('chronoshift-pro', 'create_schedule', {
      jobId: context.jobId
    });
    return { scheduleId: schedule.id };
  })
  .parallel([
    async (context) => await mcp.execute('sfg-vertex', 'create_tasks', context),
    async (context) => await mcp.execute('sfg-esp', 'sync_job', context),
    async (context) => await mcp.execute('sfgcomms', 'notify_team', context)
  ])
  .onError(async (error, context) => {
    await nexus.logDecision({
      title: 'Workflow Failed',
      description: error.message,
      impact: 'HIGH'
    });
  });

await workflow.execute({ quoteId: '22438' });
```

## Performance Optimization

### Caching Strategy
- **App Registry:** 5-minute TTL
- **User Sessions:** 30-minute TTL
- **Static Assets:** 1-year TTL (versioned)
- **API Responses:** Context-dependent

### Database Optimization
- **Indexes:** On all foreign keys and frequently queried fields
- **Connection Pooling:** Max 100 connections
- **Query Optimization:** N+1 prevention, eager loading
- **Partitioning:** (planned) Time-based for large tables

### API Optimization
- **Pagination:** Default 20 items, max 100
- **Compression:** Gzip for responses > 1KB
- **Rate Limiting:** 1000 requests/minute
- **Batching:** (planned) Batch multiple API calls

## Future Enhancements

### Phase 2 (Q1 2026)
- [ ] Full MCP integration for all 51 apps
- [ ] Warren's Brain ML model for decision support
- [ ] Gap analysis system
- [ ] Advanced workflow engine
- [ ] Real-time dashboard

### Phase 3 (Q2 2026)
- [ ] Mobile applications (iOS, Android)
- [ ] Customer portal v2
- [ ] Advanced analytics and BI
- [ ] Automated testing suite
- [ ] Performance monitoring dashboard

### Phase 4 (Q3-Q4 2026)
- [ ] Multi-tenancy support
- [ ] White-label capabilities
- [ ] API marketplace
- [ ] Third-party integrations
- [ ] Advanced AI features

## Success Metrics

### Technical Metrics
- **Uptime:** 99.9% (target)
- **Response Time:** < 200ms (p95)
- **Error Rate:** < 0.1%
- **Database Query Time:** < 50ms (p95)
- **API Throughput:** 10,000 req/hour

### Business Metrics
- **Portfolio Value:** £5.17M+
- **Annual Savings:** £2.1M+
- **Staff Replaced:** 18 FTE
- **ROI:** 300%+
- **Warren's Time:** 10 hours/week (vs. 24/7 manual)

---

**Version:** 1.0.0  
**Last Updated:** November 3, 2025  
**Maintainer:** Warren Heathcote  
**Status:** Living Document
