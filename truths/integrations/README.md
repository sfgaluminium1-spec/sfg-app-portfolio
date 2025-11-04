# Integration Configurations

This directory contains configuration for third-party integrations.

## Files

- `xero-config.json` - Xero accounting integration settings
- `stripe-config.json` - Stripe payment processing settings
- `sharepoint-config.json` - SharePoint document storage settings
- `companies-house-config.json` - Companies House API settings

## Security

**NEVER commit API keys or secrets here!**

These files contain:
- API endpoints
- Webhook URLs
- Field mappings
- Rate limit configurations
- Retry policies

Actual credentials are stored securely in environment variables.