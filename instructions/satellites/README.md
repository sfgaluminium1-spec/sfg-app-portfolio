
# Satellite Application Instructions

This directory contains instructions for satellite applications in the SFG Aluminium ecosystem.

## Contents

- **self-register.md** - Autonomous registration process
- **mcp-server-template.md** - Template for implementing MCP server

## What is a Satellite Application?

A satellite application is any specialized application in the SFG ecosystem that:
- Serves a specific business function
- Can operate independently
- Communicates with NEXUS (the conductor)
- Registers itself in the App Registry
- Implements MCP server for orchestration

## Categories

### Core Systems
Mission-critical applications the business depends on.

### Satellite Apps
Specialized applications for specific functions.

### Integrations
Connectors to external systems.

### Utilities
Helper tools and services.

### Workflows
Process automation applications.

### Dashboards
Monitoring and visualization tools.

## Getting Started

1. **Review the self-registration guide** - [self-register.md](./self-register.md)
2. **Implement MCP server** - [mcp-server-template.md](./mcp-server-template.md)
3. **Register your application** - Use the autonomous process
4. **Test integration** - Verify NEXUS can communicate with your app

## Support

For questions or issues:
1. Check the documentation in `/docs/`
2. Review examples in `/apps/chronoshift-pro/`
3. Create a GitHub issue with label "satellite-help"
4. Contact Warren Heathcote

---

**Last Updated:** November 3, 2025
