
# Instructions Directory

This directory contains operational procedures and instructions for the SFG NEXUS ecosystem.

## Structure

- **nexus/** - Instructions specifically for the NEXUS conductor application
- **satellites/** - Instructions for satellite applications to self-register and integrate

## How It Works

1. **NEXUS reads from `/instructions/nexus/`** to understand its operational procedures
2. **Satellite apps read from `/instructions/satellites/`** to learn how to register and integrate
3. **All instructions are version-controlled** in GitHub as the single source of truth
4. **Changes trigger webhooks** to notify relevant applications

## Key Files

- `nexus/persistent-memory.md` - HIGH PRIORITY: Implement persistent memory to stop forgetting
- `nexus/app-registry.md` - Track all 40+ registered applications
- `nexus/mcp-client.md` - Connect to satellite applications via MCP protocol
- `satellites/self-register.md` - Autonomous registration guide for satellite apps
- `satellites/mcp-server-template.md` - Template for implementing MCP servers

## Usage

When NEXUS or a satellite app needs to perform a task, it:
1. Pulls the latest instructions from this directory
2. Reads the relevant markdown file
3. Executes the instructions step-by-step
4. Reports completion via GitHub issue

This creates a **zero-drift orchestration system** where all apps stay synchronized with the latest procedures.
