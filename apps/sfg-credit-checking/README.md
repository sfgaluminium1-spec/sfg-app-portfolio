# SFG Credit Checking Application

## Overview

The SFG Credit Checking Application is a comprehensive system for performing credit checks and company verification through integrated third-party APIs. This application provides automated credit assessment, company verification, and financial analysis capabilities.

## Architecture

This application operates as a non-executable documentation and configuration repository. All business logic, API configurations, and workflow definitions are stored as declarative JSON and Markdown files.

## Contents

### Core Configuration

- **business-logic.json** - Main business logic rules and decision trees for credit assessment
- **config/experian-api.json** - Configuration for Experian API integration (credit bureau)
- **config/companies-house-api.json** - Configuration for Companies House API integration (UK company registry)
- **config/mcp-finance.json** - MCP Finance system integration configuration
- **config/webhooks.json** - Webhook endpoint definitions for event-driven communications
- **config/communications.json** - Communication templates and notification settings

### Connectors

- **connectors/experian-connector.md** - Documentation for Experian API connector implementation
- **connectors/companies-house-connector.md** - Documentation for Companies House API connector implementation

### Workflows

- **workflows/message-handlers.md** - Message handling workflows and event processing logic

## Key Features

1. **Credit Assessment** - Automated credit scoring using Experian data
2. **Company Verification** - Real-time company status checks via Companies House
3. **Financial Analysis** - Integration with MCP Finance for comprehensive financial review
4. **Event-Driven Architecture** - Webhook-based notifications and processing
5. **Communication Management** - Automated notifications and status updates

## Integration Points

### Experian API
Provides credit bureau data for individual and business credit checks. Configuration includes authentication, endpoints, and data mapping.

### Companies House API
Accesses UK company registry information including company status, officers, and financial filings.

### MCP Finance
Integrates with internal MCP Finance system for financial risk assessment and decision making.

## Usage

This is a documentation and configuration repository. Implementation details are contained in the connector documentation files. All configurations follow JSON schema standards and can be validated before deployment.

## File Organization

```
sfg-credit-checking/
├── README.md (this file)
├── business-logic.json
├── config/
│   ├── experian-api.json
│   ├── companies-house-api.json
│   ├── mcp-finance.json
│   ├── webhooks.json
│   └── communications.json
├── connectors/
│   ├── experian-connector.md
│   └── companies-house-connector.md
└── workflows/
    └── message-handlers.md
```

## Notes

- All API credentials should be stored securely using environment variables or secret management systems
- Configuration files should be validated against their respective schemas before deployment
- Webhook endpoints must be properly secured with authentication tokens
- Rate limiting considerations are documented in individual connector files

## Maintainers

SFG Aluminium - Application Portfolio Team
