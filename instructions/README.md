
# Instructions Directory

This directory contains instructions for the SFG Aluminium Ecosystem orchestration system.

## Structure

- **nexus/** - Instructions for Nexus (the central conductor)
- **satellites/** - Instructions for satellite applications

## How Instructions Work

1. **Nexus** reads instructions from `/instructions/nexus/` to understand its role and capabilities
2. **Satellite apps** receive instructions via GitHub webhooks when files are added to `/instructions/satellites/[app-id]/`
3. All instructions are version-controlled and tracked in this repository

## Instruction Types

### For Nexus
- `persistent-memory.md` - Database and memory management
- `app-registry.md` - App registration and tracking
- `mcp-client.md` - MCP protocol integration
- `gap-analysis.md` - Capability gap identification

### For Satellites
- `self-register.md` - How to register with the ecosystem
- `mcp-server-template.md` - How to implement MCP server
- `webhook-setup.md` - How to receive instructions via webhooks

## Adding New Instructions

1. Create markdown file in appropriate directory
2. Use clear, actionable language
3. Include examples and verification steps
4. Commit and push to trigger webhooks
5. Monitor GitHub issues for implementation reports

