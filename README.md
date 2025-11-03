# SFG Aluminium Ecosystem

This repository contains the complete SFG Aluminium digital ecosystem, built on a **single webhook with unlimited redirects** architecture.

## Architecture Overview

### Core Principle: One API Per Application
Each application in the ecosystem maintains its own independent API. All applications coordinate through the main SFG NEXUS application using a centralized webhook system that can redirect to any satellite application.

### Organizational Structure (5 Tiers)
1. **Tier 1 - Directors** (Operations Managers & Directors) - Unlimited access
2. **Tier 2 - Finance and Payroll** (Senior Estimator & Accounts) - £50k limit
3. **Tier 3 - HR** (Design & Management) - £15k limit
4. **Tier 4 - H&S/Health & Safety** (Production & Fabrication) - £5k limit
5. **Tier 5 - New Starters/Juniors** - £1k limit

### MCP Server Architecture
- 5 MCP servers (one per organizational tier)
- Each MCP server: 30 tools maximum (AgentPass free tier)
- Tier-specific access controls and spending limits

## Repository Structure

```
sfg-aluminium-ecosystem/
├── sfg-nexus/              # Main NEXUS application (NextJS + Prisma + PostgreSQL)
├── satellite-apps/         # Independent satellite applications
├── shared/                 # Shared resources (truth files, types, utilities)
├── infrastructure/         # System infrastructure (webhooks, API gateway, MCP configs)
├── docs/                   # Documentation and agent instructions
└── backups/                # Timestamped backups (UK 7-year retention)
```

## Key Features

- **Truth File System v1.2.3**: BaseNumber system with folder structures and required fields
- **Xero Integration**: Customer database sync and credit checking
- **UK Compliance**: 7-year data retention standard
- **Backup & Rollback**: Comprehensive backup controls
- **Autonomous Agent Ready**: Instructions for AI agents in `/docs/autonomous-instructions/`

## Getting Started

1. See `/sfg-nexus/README.md` for main application setup
2. See `/docs/` for comprehensive documentation
3. See `/infrastructure/mcp-configs/` for tier-specific MCP configurations

## Data Retention

All data follows UK 7-year retention standards. Backups are stored in `/backups/` with timestamps.

---

**Last Updated**: November 2025  
**Version**: 1.0.0 (Initial Structure)
