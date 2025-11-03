# Infrastructure

System infrastructure for the SFG Aluminium ecosystem.

## Components

### webhooks/
**Single Webhook with Unlimited Redirects Architecture**

The central webhook handler that receives all incoming webhooks and intelligently routes them to the appropriate satellite application or NEXUS component.

**Key Features:**
- Single entry point for all external webhooks
- Intelligent routing based on payload and source
- Unlimited redirect capability to any satellite app
- Request logging and monitoring
- Error handling and retry logic

### api-gateway/
API routing and management layer that:
- Routes requests between applications
- Handles authentication and authorization
- Implements rate limiting per tier
- Provides API versioning
- Monitors API health and performance

### mcp-configs/
MCP (Model Context Protocol) server configurations split across 5 organizational tiers:

#### tier-1-directors/
- Unlimited spending access
- Full system visibility
- All 30 tools available
- Operations Managers & Directors

#### tier-2-finance/
- £50k spending limit
- Financial tools and reporting
- Senior Estimator & Accounts access

#### tier-3-hr/
- £15k spending limit
- HR and design tools
- Design & Management access

#### tier-4-hs/
- £5k spending limit
- Health & Safety tools
- Production & Fabrication access

#### tier-5-juniors/
- £1k spending limit
- Basic tools only
- New Starters access

### backups/
Backup configuration files and scripts for:
- Automated daily backups
- 7-year retention policy (UK standard)
- Rollback procedures
- Disaster recovery plans

## AgentPass Integration
Using AgentPass free tier: 5 MCP servers × 30 tools each = 150 total tools distributed across organizational tiers.
