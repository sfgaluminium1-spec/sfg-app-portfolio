
/**
 * SFG Satellite App Registration - GitHub Issue Formatter
 * @version 2.0
 * @date November 3, 2025
 */

import type { BusinessLogic } from '../types/business-logic';

/**
 * Format business logic into GitHub issue body
 * @param logic Business logic to format
 * @param repoOwner GitHub repository owner
 * @param repoName GitHub repository name
 * @returns Formatted issue body
 */
export function formatIssueBody(
  logic: BusinessLogic,
  repoOwner: string,
  repoName: string
): string {
  return `## App Registration

**App Name:** ${logic.app_name}
**Category:** ${logic.category}
**Description:** ${logic.description}
**Version:** ${logic.version}
**URL:** ${logic.app_url || 'N/A'}

## Capabilities (${logic.capabilities.length})

${logic.capabilities.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Workflows (${logic.workflows.length})

${logic.workflows.map((w, i) => `
### ${i + 1}. ${w.name}
${w.description}

**Steps:**
${w.steps?.map((s, j) => `${j + 1}. ${s}`).join('\n') || 'N/A'}

**Triggers:** ${w.triggers || 'N/A'}
**Outputs:** ${w.outputs || 'N/A'}
`).join('\n')}

## Business Rules (${logic.business_rules.length})

${logic.business_rules.map((r, i) => `
### ${i + 1}. ${r.name} ${r.priority ? `(Priority: ${r.priority})` : ''}
${r.description}

- **Condition:** ${r.condition || 'N/A'}
- **Action:** ${r.action || 'N/A'}
`).join('\n')}

## Integrations (${logic.integrations.length})

${logic.integrations.map((int, i) => `${i + 1}. ${int}`).join('\n')}

## API Endpoints (${logic.api_endpoints.length})

${logic.api_endpoints.map((e, i) => `
${i + 1}. **${e.method} ${e.endpoint}**: ${e.purpose} ${e.auth_required ? '🔒' : ''}
`).join('\n')}

## Data Models (${logic.data_models.length})

${logic.data_models.map((m, i) => `
### ${i + 1}. ${m.name}
${m.description}

**Key Fields:** ${m.key_fields?.join(', ') || 'N/A'}
`).join('\n')}

---

**Status:** ✅ Registered - Pending Nexus Approval
**Registered by:** ${logic.app_name}-bot
**Repository:** https://github.com/${repoOwner}/${repoName}/tree/main/apps/${logic.app_name}
**Contact:** ${logic.contact_email || 'warren@sfg-innovations.com'}

---

### Next Steps

1. Nexus will review this registration within 24-48 hours
2. Once approved, integration instructions will be provided
3. MCP server setup guide will be shared
4. Orchestration workflows will be assigned

### Questions?

Create an issue at: https://github.com/${repoOwner}/${repoName}/issues/new
`;
}

/**
 * Generate issue title
 * @param appName Application name
 * @returns Formatted issue title
 */
export function formatIssueTitle(appName: string): string {
  return `[Registration] ${appName}`;
}

/**
 * Get issue labels
 * @returns Array of label names
 */
export function getIssueLabels(): string[] {
  return ['registration', 'satellite-app', 'pending-approval'];
}
