
# Configuration Directory

This directory contains all configuration and metadata files for the SFG satellite app registration system.

## Files

- **business-logic.json** - Complete business logic definition for the SFG Website app
- **registration-metadata.json** - Registration metadata and deployment information

## Usage

These files are used by the satellite registration system to:
1. Register the app with the NEXUS orchestration hub
2. Define workflows and business rules
3. Configure integrations with other apps
4. Set up webhook and message handling

## Maintenance

- Update business-logic.json when adding new features or workflows
- Update registration-metadata.json when deployment URLs or versions change
- Keep both files in sync with the actual implementation
