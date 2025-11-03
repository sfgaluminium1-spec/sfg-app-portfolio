# SFG Aluminium Application Portfolio

**Centralized repository for the SFG Aluminium Limited AI-powered business ecosystem**

## Overview

This repository serves as the central hub for managing 51+ applications in the SFG Aluminium ecosystem, orchestrated by SFG NEXUS (the conductor application).

## Repository Structure

```
sfg-app-portfolio/
├── instructions/          # Instructions for NEXUS and satellite apps
│   ├── nexus/            # NEXUS conductor instructions
│   └── satellites/       # Satellite app instructions
├── docs/                 # Architecture and technical documentation
├── analysis/             # App inventory and gap analysis
├── .github/              # Workflows and issue templates
├── templates/            # Registration and configuration templates
├── app-registry/         # JSON files for each registered app
├── app-backups/          # Source code backups of all apps
├── apps/                 # (Legacy) App directories
├── sfg-nexus/           # NEXUS conductor application
└── shared/              # Shared libraries and utilities
```

## Quick Start

### For Warren (Administrator)

1. **Week 1 Setup** (November 3-10, 2025)
   - [x] Persistent memory implemented
   - [ ] Create GitHub App for satellite authentication
   - [ ] Share GitHub App credentials with NEXUS
   - [ ] Verify repository structure
   - [ ] Make repository private

2. **Week 2 - First 10 Apps** (November 11-17, 2025)
   - [ ] Register 10 priority satellite apps
   - [ ] Implement MCP integration
   - [ ] Test orchestration workflows

3. **Week 3-4 - Full Rollout** (November 18 - December 1, 2025)
   - [ ] Register remaining 40 apps
   - [ ] Deploy Warren's Brain
   - [ ] Achieve zero-drift architecture

### For NEXUS (Conductor)

See instructions in [`instructions/nexus/`](./instructions/nexus/)

- [Persistent Memory Guide](./instructions/nexus/persistent-memory.md)
- [App Registry Management](./instructions/nexus/app-registry.md)
- [MCP Client Implementation](./instructions/nexus/mcp-client.md)

### For Satellite Applications

See instructions in [`instructions/satellites/`](./instructions/satellites/)

- [Self-Registration Guide](./instructions/satellites/self-register.md)
- [MCP Server Template](./instructions/satellites/mcp-server-template.md)

## Application Portfolio

### Core Systems (12 apps)
Mission-critical applications the business depends on

- **SFG NEXUS** - Central orchestration platform
- **SFG Vertex** - Manufacturing intelligence
- **SFG ESP** - ESP integration
- **SFG Sync** - Data synchronization
- [View full list →](./analysis/APP_INVENTORY.md)

### Satellite Applications (28 apps)
Specialized applications for specific business functions

- **ChronoShift Pro** - Scheduling and payroll
- **SFG Axis** - Analytics and reporting
- **Heathcote Hub** - Internal employee portal
- [View full list →](./analysis/APP_INVENTORY.md)

### Total Portfolio Value
- **£5.17M+** in application value
- **£2.1M+** annual cost savings
- **18 FTE** positions replaced
- **300%+ ROI** over 3 years

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Conductor Specification](./docs/CONDUCTOR_SPEC.md) (coming soon)
- [Satellite Specification](./docs/SATELLITE_SPEC.md) (coming soon)
- [MCP Integration Guide](./docs/MCP_INTEGRATION.md) (coming soon)

## Status

**Current Phase:** Week 1 - Foundation (30% complete)  
**Last Updated:** November 3, 2025  
**Next Milestone:** Week 1 completion by November 10, 2025

### Week 1 Progress
- [x] Persistent memory system implemented
- [x] Repository structure created
- [x] Documentation written
- [ ] GitHub App created
- [ ] Repository made private

## Contributing

### Satellite App Registration
1. Follow the [self-registration guide](./instructions/satellites/self-register.md)
2. Create registration JSON in `app-registry/`
3. Backup source code to `app-backups/`
4. Create GitHub issue with label "registration"

### Bug Reports
Create an issue with label "bug" and include:
- Application name
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Feature Requests
Create an issue with label "enhancement" and describe:
- Use case
- Proposed solution
- Business value

## Support

- **Primary Contact:** Warren Heathcote
- **Documentation:** [`/docs`](./docs/)
- **Issues:** [GitHub Issues](https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues)
- **Slack:** #all-sfg-aluminium-limited

## License

Proprietary - SFG Aluminium Limited © 2025

All rights reserved. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

**Managed by:** SFG NEXUS  
**Orchestration Platform:** Abacus.AI  
**Technology Stack:** Next.js, TypeScript, PostgreSQL, AWS
