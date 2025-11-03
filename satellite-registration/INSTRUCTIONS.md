# 🚀 SFG Satellite App Registration - Complete Instructions

**Date:** November 3, 2025  
**Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio  
**Purpose:** Autonomous registration of satellite apps in the SFG orchestration ecosystem

---

## 📋 GITHUB APP CREDENTIALS

**IMPORTANT:** Use these exact credentials for authentication:

```bash
GITHUB_APP_ID=2228094
GITHUB_APP_INSTALLATION_ID=92873690
GITHUB_OWNER=sfgaluminium1-spec
GITHUB_REPO=sfg-app-portfolio
```

**GITHUB_APP_PRIVATE_KEY:**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpgIBAAKCAQEA8+XtgHAePuJNY7UH65XFqSVQKvQpgPz/URxrdYb8gLnjK4dx
QU9uAvlOHhMm8yNPfZNzEU74H1I7mzfds+/wT5GncSnKKiPBRN8Ci8DyRV3m8DsN
Kcs30Yl2ZVkQzSdGLhQUXcGG9vxEDAvqNdpwySlARqW567iWsvfEPotTBOtBHIXW
Kak1d4vmq5yn0wiJdvN34L3fQcvouQ6sikERXuCA0hxvFlKADDIWC8zJUzvTIXpd
U6HmZSTI/KhpZEiRTXyD0d4IhxdNXjg93GZUb98PqsqGNGvaEvkjjHflN4UmOfXE
gatBzp9jMZqVXEvMhXLgdOVypSa8AJQQ1emH+QIDAQABAoIBAQDMvnAqKfS6BW/C
C+6iLhDIdbJe3Kkax0ft51WuS6scxO+XUxQYJ33KsU6KoLlJ0pKgcG9gUFKquHWh
T7ylmP67TSKrNNGpnmpYTn3spAS9hp6ffHMIarhpBmSFn8ci8Z1QgTq3mgaawBq/
oiDzJHUZ6a8zn1v8LfEUPDpZ5svCi7eEvk5Wn/PHMAZDtVVS58eW6eSBCOs7plPy
8tTCAAlDkv6IueHGH6Sc9FJwOo8gbO55AKlLJHL1cOIoNFmrs66FiNddPgQHCvEz
WcJRQodYE3HdNFcBz0+Fs5Lb1QmOEhMyD5JcokrGfZbZ5EMfgLrzlJwnvH5USnp5
eAN+C9qhAoGBAP0QpbEhPW0DLDjQbyIrEqqLVbqJ5Qo4d/WhhcbIEq80qvzFWPBV
nA5GsH9U2y/VEfYtQDKNb8+0Xt5FBEk2LzcQTdDT5l4qHX788JvqSu2CFR9DN8Af
Aa+As7vDD2hkOLxbikhHv6nbSlKCzKDB0rXILQzpCbdDldu02kqbDvOLAoGBAPa6
EF/ml0naw3SV/vxBauVw4G6Ob8yQoq72mIiZBlBHoncT+8S8nHxI8fm2n2iaEFTd
+GqGGpIoqJ9LGTD38r1A1V9RZu074xjzYFLwaMqIQwZT0J99SCLOHYjFdnWW08wD
aL9JfwJpcnxXa/Rcz0EoCaJG1tPCm/AZKW2HzVMLAoGBAI1L7jeoR5PGYbqXJnX9
dr6ibYtp0uiR/ui29uq2azhIP/BCgBYwtqGB9qohxwA+B3lcaqvPLM7b9txDzNDT
4CjugYRHzChne3Cb6fwkJRHXv9NkxIwQw/Ap/DCqCMBQtRz2P498ABfmyOio/3gC
wJOe4QiEVVht9A5oPDnLud1hAoGBAOOScYITbh4oEzqZE81XBaNF/yzaYpKcIgIh
4EW2Z9VqjZcqLoKjue8FVXQQF27jFAdDiluvABkqOYZcPYsmWJZpk6XMrpRJNcoQ
yhsWNoIBN1lBu98wLnY0CZfbEs2ZZhf6WQZ/YxA1dOztsdx+MoiVxnUQxBwkl7LZ
cpXduexLAoGBAKI6U4JFpmJTYNo5jd8nJNaNsoyP5bKGZAPRlOA2unalS+P6taPv
5ss5wr+df1RVQKNMQ4+zBw4cQIYEDBwz9koCIKJ5IK2uTAUY2EwMdMFcBByDbE8o
rXGxVe0whJeMu5P4QcYRd+FVeqxuiQI12hOY4sy6AlO7Y4rpbwnAR7TN
-----END RSA PRIVATE KEY-----
```

---

## 🎯 QUICK START (5 Minutes)

If you just want to register quickly without full source code backup:

### Step 1: Create GitHub Issue

Create a GitHub issue with this information:

**Title:** `[Registration] [YOUR_APP_NAME]`

**Body:**
```markdown
## App Registration

**App Name:** [YOUR_APP_NAME]
**Category:** [e.g., PROJECT_MANAGEMENT, ESTIMATING, SCHEDULING, etc.]
**Description:** [Brief description of what your app does]
**Version:** [e.g., 1.0.0]
**URL:** [Your Abacus.AI app URL]

## Capabilities

- [Capability 1]
- [Capability 2]
- [Capability 3]

## Workflows

1. **[Workflow Name]:** [Brief description]
2. **[Workflow Name]:** [Brief description]

## Business Rules

1. **[Rule Name]:** [Description]
2. **[Rule Name]:** [Description]

## Integrations

- [System 1]
- [System 2]

## API Endpoints

- `[METHOD] [ENDPOINT]` - [Description]
- `[METHOD] [ENDPOINT]` - [Description]

---

**Status:** ✅ Registered - Pending Nexus Approval
```

**Labels:** `registration`, `satellite-app`, `pending-approval`

### Step 2: Done!

That's it! Nexus will review and approve within 24-48 hours.

---

## 📚 DETAILED REGISTRATION (30-45 Minutes)

For complete registration with source code backup and business logic extraction:

### Step 1: Install Dependencies

```bash
npm install @octokit/rest @octokit/auth-app archiver
# or
yarn add @octokit/rest @octokit/auth-app archiver
```

### Step 2: Set Up Authentication

Create a file `github-auth.ts`:

```typescript
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import * as fs from 'fs';

const GITHUB_APP_ID = '2228094';
const GITHUB_INSTALLATION_ID = '92873690';
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpgIBAAKCAQEA8+XtgHAePuJNY7UH65XFqSVQKvQpgPz/URxrdYb8gLnjK4dx
QU9uAvlOHhMm8yNPfZNzEU74H1I7mzfds+/wT5GncSnKKiPBRN8Ci8DyRV3m8DsN
Kcs30Yl2ZVkQzSdGLhQUXcGG9vxEDAvqNdpwySlARqW567iWsvfEPotTBOtBHIXW
Kak1d4vmq5yn0wiJdvN34L3fQcvouQ6sikERXuCA0hxvFlKADDIWC8zJUzvTIXpd
U6HmZSTI/KhpZEiRTXyD0d4IhxdNXjg93GZUb98PqsqGNGvaEvkjjHflN4UmOfXE
gatBzp9jMZqVXEvMhXLgdOVypSa8AJQQ1emH+QIDAQABAoIBAQDMvnAqKfS6BW/C
C+6iLhDIdbJe3Kkax0ft51WuS6scxO+XUxQYJ33KsU6KoLlJ0pKgcG9gUFKquHWh
T7ylmP67TSKrNNGpnmpYTn3spAS9hp6ffHMIarhpBmSFn8ci8Z1QgTq3mgaawBq/
oiDzJHUZ6a8zn1v8LfEUPDpZ5svCi7eEvk5Wn/PHMAZDtVVS58eW6eSBCOs7plPy
8tTCAAlDkv6IueHGH6Sc9FJwOo8gbO55AKlLJHL1cOIoNFmrs66FiNddPgQHCvEz
WcJRQodYE3HdNFcBz0+Fs5Lb1QmOEhMyD5JcokrGfZbZ5EMfgLrzlJwnvH5USnp5
eAN+C9qhAoGBAP0QpbEhPW0DLDjQbyIrEqqLVbqJ5Qo4d/WhhcbIEq80qvzFWPBV
nA5GsH9U2y/VEfYtQDKNb8+0Xt5FBEk2LzcQTdDT5l4qHX788JvqSu2CFR9DN8Af
Aa+As7vDD2hkOLxbikhHv6nbSlKCzKDB0rXILQzpCbdDldu02kqbDvOLAoGBAPa6
EF/ml0naw3SV/vxBauVw4G6Ob8yQoq72mIiZBlBHoncT+8S8nHxI8fm2n2iaEFTd
+GqGGpIoqJ9LGTD38r1A1V9RZu074xjzYFLwaMqIQwZT0J99SCLOHYjFdnWW08wD
aL9JfwJpcnxXa/Rcz0EoCaJG1tPCm/AZKW2HzVMLAoGBAI1L7jeoR5PGYbqXJnX9
dr6ibYtp0uiR/ui29uq2azhIP/BCgBYwtqGB9qohxwA+B3lcaqvPLM7b9txDzNDT
4CjugYRHzChne3Cb6fwkJRHXv9NkxIwQw/Ap/DCqCMBQtRz2P498ABfmyOio/3gC
wJOe4QiEVVht9A5oPDnLud1hAoGBAOOScYITbh4oEzqZE81XBaNF/yzaYpKcIgIh
4EW2Z9VqjZcqLoKjue8FVXQQF27jFAdDiluvABkqOYZcPYsmWJZpk6XMrpRJNcoQ
yhsWNoIBN1lBu98wLnY0CZfbEs2ZZhf6WQZ/YxA1dOztsdx+MoiVxnUQxBwkl7LZ
cpXduexLAoGBAKI6U4JFpmJTYNo5jd8nJNaNsoyP5bKGZAPRlOA2unalS+P6taPv
5ss5wr+df1RVQKNMQ4+zBw4cQIYEDBwz9koCIKJ5IK2uTAUY2EwMdMFcBByDbE8o
rXGxVe0whJeMu5P4QcYRd+FVeqxuiQI12hOY4sy6AlO7Y4rpbwnAR7TN
-----END RSA PRIVATE KEY-----`;

export async function createOctokitClient() {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: GITHUB_APP_ID,
      privateKey: PRIVATE_KEY,
      installationId: GITHUB_INSTALLATION_ID,
    },
  });

  return octokit;
}
```

### Step 3: Extract Business Logic

Create a file `extract-business-logic.ts`:

```typescript
interface BusinessLogic {
  app_name: string;
  category: string;
  description: string;
  version: string;
  capabilities: string[];
  workflows: Array<{
    name: string;
    description: string;
    steps?: string[];
    triggers?: string;
    outputs?: string;
  }>;
  business_rules: Array<{
    name: string;
    description: string;
    condition?: string;
    action?: string;
    priority?: 'high' | 'medium' | 'low';
  }>;
  integrations: string[];
  api_endpoints: Array<{
    endpoint: string;
    method: string;
    purpose: string;
    auth_required?: boolean;
  }>;
  data_models: Array<{
    name: string;
    description: string;
    key_fields?: string[];
  }>;
}

export function extractBusinessLogic(): BusinessLogic {
  // TODO: Customize this with your app's actual business logic
  return {
    app_name: 'YOUR_APP_NAME',
    category: 'YOUR_CATEGORY',
    description: 'YOUR_DESCRIPTION',
    version: '1.0.0',
    capabilities: [
      'Capability 1',
      'Capability 2',
      'Capability 3',
    ],
    workflows: [
      {
        name: 'Workflow 1',
        description: 'Description of workflow 1',
        steps: ['Step 1', 'Step 2', 'Step 3'],
        triggers: 'What triggers this workflow',
        outputs: 'What this workflow produces',
      },
    ],
    business_rules: [
      {
        name: 'Rule 1',
        description: 'Description of rule 1',
        condition: 'IF condition',
        action: 'THEN action',
        priority: 'high',
      },
    ],
    integrations: [
      'System 1',
      'System 2',
    ],
    api_endpoints: [
      {
        endpoint: '/api/endpoint1',
        method: 'GET',
        purpose: 'Purpose of endpoint',
        auth_required: true,
      },
    ],
    data_models: [
      {
        name: 'Model1',
        description: 'Description of model',
        key_fields: ['field1', 'field2'],
      },
    ],
  };
}
```

### Step 4: Create Registration Script

Create a file `register-satellite.ts`:

```typescript
import { createOctokitClient } from './github-auth';
import { extractBusinessLogic } from './extract-business-logic';
import * as fs from 'fs';
import * as path from 'path';

const GITHUB_OWNER = 'sfgaluminium1-spec';
const GITHUB_REPO = 'sfg-app-portfolio';

async function registerSatelliteApp() {
  console.log('🚀 Starting satellite app registration...');

  // Step 1: Extract business logic
  console.log('📊 Extracting business logic...');
  const businessLogic = extractBusinessLogic();

  // Step 2: Create Octokit client
  console.log('🔐 Authenticating with GitHub...');
  const octokit = await createOctokitClient();

  // Step 3: Create registration issue
  console.log('📝 Creating registration issue...');
  
  const issueBody = `## App Registration

**App Name:** ${businessLogic.app_name}
**Category:** ${businessLogic.category}
**Description:** ${businessLogic.description}
**Version:** ${businessLogic.version}

## Capabilities (${businessLogic.capabilities.length})

${businessLogic.capabilities.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Workflows (${businessLogic.workflows.length})

${businessLogic.workflows.map((w, i) => `
### ${i + 1}. ${w.name}
${w.description}

**Steps:**
${w.steps?.map((s, j) => `${j + 1}. ${s}`).join('\n') || 'N/A'}

**Triggers:** ${w.triggers || 'N/A'}
**Outputs:** ${w.outputs || 'N/A'}
`).join('\n')}

## Business Rules (${businessLogic.business_rules.length})

${businessLogic.business_rules.map((r, i) => `
### ${i + 1}. ${r.name} (Priority: ${r.priority || 'medium'})
${r.description}

- **Condition:** ${r.condition || 'N/A'}
- **Action:** ${r.action || 'N/A'}
`).join('\n')}

## Integrations

${businessLogic.integrations.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

## API Endpoints (${businessLogic.api_endpoints.length})

${businessLogic.api_endpoints.map((e, i) => `
${i + 1}. **${e.method} ${e.endpoint}**: ${e.purpose} ${e.auth_required ? '🔒' : ''}
`).join('\n')}

## Data Models (${businessLogic.data_models.length})

${businessLogic.data_models.map((m, i) => `
### ${i + 1}. ${m.name}
${m.description}

**Key Fields:** ${m.key_fields?.join(', ') || 'N/A'}
`).join('\n')}

---

**Status:** ✅ Registered - Pending Nexus Approval
**Registered by:** ${businessLogic.app_name}-bot
**Repository:** https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/tree/main/apps/${businessLogic.app_name}

**Contact:** warren@sfg-innovations.com
`;

  const issue = await octokit.issues.create({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    title: `[Registration] ${businessLogic.app_name}`,
    body: issueBody,
    labels: ['registration', 'satellite-app', 'pending-approval'],
  });

  console.log(`✅ Registration issue created: ${issue.data.html_url}`);

  // Step 4: Save business logic to file
  console.log('💾 Saving business logic...');
  const outputDir = path.join(process.cwd(), 'registration_output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'business-logic.json'),
    JSON.stringify(businessLogic, null, 2)
  );

  console.log('✅ Registration complete!');
  console.log(`📝 Issue URL: ${issue.data.html_url}`);
  console.log(`📊 Business logic saved to: ${outputDir}/business-logic.json`);
}

registerSatelliteApp().catch(console.error);
```

### Step 5: Run Registration

```bash
npx ts-node register-satellite.ts
```

---

## 📖 BUSINESS LOGIC EXAMPLES

### Example 1: Simple App (quickspace)

```json
{
  "app_name": "quickspace",
  "category": "WORKSPACE_MANAGEMENT",
  "description": "Quick workspace setup and management",
  "version": "1.0.0",
  "capabilities": [
    "Create workspaces",
    "Manage permissions",
    "File organization"
  ],
  "workflows": [
    {
      "name": "Workspace Creation",
      "description": "Create a new workspace with default settings",
      "steps": [
        "User provides workspace name",
        "System creates directory structure",
        "System sets default permissions",
        "User receives confirmation"
      ],
      "triggers": "User clicks 'Create Workspace' button",
      "outputs": "Workspace ID, Access URL"
    }
  ],
  "business_rules": [
    {
      "name": "Workspace Name Validation",
      "description": "Workspace names must be unique and follow naming conventions",
      "condition": "IF workspace name contains special characters OR already exists",
      "action": "THEN reject creation and show error message",
      "priority": "high"
    }
  ],
  "integrations": ["SharePoint", "Azure AD"],
  "api_endpoints": [
    {
      "endpoint": "/api/workspaces",
      "method": "POST",
      "purpose": "Create new workspace",
      "auth_required": true
    }
  ],
  "data_models": [
    {
      "name": "Workspace",
      "description": "Workspace entity",
      "key_fields": ["id", "name", "owner", "created_at"]
    }
  ]
}
```

### Example 2: Complex App (pichada-legal)

```json
{
  "app_name": "pichada-legal",
  "category": "LEGAL_COMPLIANCE",
  "description": "Legal document management and compliance tracking",
  "version": "2.1.0",
  "capabilities": [
    "Contract management",
    "Compliance tracking",
    "Document versioning",
    "E-signature integration",
    "Audit trail",
    "Deadline reminders",
    "Template library"
  ],
  "workflows": [
    {
      "name": "Contract Approval",
      "description": "Multi-stage contract approval workflow",
      "steps": [
        "Legal team drafts contract",
        "Manager reviews and comments",
        "Director approves or rejects",
        "If approved, send to client for signature",
        "Track signature status",
        "Archive signed contract"
      ],
      "triggers": "New contract created OR contract updated",
      "outputs": "Signed contract PDF, Audit log entry"
    },
    {
      "name": "Compliance Check",
      "description": "Automated compliance verification",
      "steps": [
        "System scans contract for required clauses",
        "Checks against compliance database",
        "Flags missing or non-compliant clauses",
        "Generates compliance report",
        "Notifies legal team if issues found"
      ],
      "triggers": "Contract submitted for approval",
      "outputs": "Compliance report, Risk score"
    }
  ],
  "business_rules": [
    {
      "name": "Director Approval Required",
      "description": "Contracts over £50K require director approval",
      "condition": "IF contract value > £50,000",
      "action": "THEN route to director for approval",
      "priority": "high"
    },
    {
      "name": "Mandatory Clauses",
      "description": "All contracts must include mandatory clauses",
      "condition": "IF contract missing mandatory clause",
      "action": "THEN block approval and notify legal team",
      "priority": "high"
    }
  ],
  "integrations": [
    "DocuSign",
    "SharePoint",
    "Xero",
    "Companies House API"
  ],
  "api_endpoints": [
    {
      "endpoint": "/api/contracts",
      "method": "POST",
      "purpose": "Create new contract",
      "auth_required": true
    },
    {
      "endpoint": "/api/contracts/:id/approve",
      "method": "POST",
      "purpose": "Approve contract",
      "auth_required": true
    },
    {
      "endpoint": "/api/compliance/check",
      "method": "POST",
      "purpose": "Run compliance check",
      "auth_required": true
    }
  ],
  "data_models": [
    {
      "name": "Contract",
      "description": "Contract entity",
      "key_fields": ["id", "title", "value", "status", "client_id", "created_by"]
    },
    {
      "name": "ComplianceRule",
      "description": "Compliance rule definition",
      "key_fields": ["id", "name", "clause_text", "mandatory", "category"]
    }
  ]
}
```

---

## 🔧 TROUBLESHOOTING

### Error: "Bad credentials"

**Cause:** Private key is incorrect or malformed

**Solution:** 
- Verify you're using the exact private key provided above
- Ensure there are no extra spaces or line breaks
- Check that the key starts with `-----BEGIN RSA PRIVATE KEY-----` and ends with `-----END RSA PRIVATE KEY-----`

### Error: "Resource not accessible by integration"

**Cause:** GitHub App doesn't have permission to create issues

**Solution:**
- Contact Warren to verify GitHub App permissions
- Ensure the app has "Issues: Read & Write" permission

### Error: "Not Found"

**Cause:** Repository name or owner is incorrect

**Solution:**
- Verify `GITHUB_OWNER=sfgaluminium1-spec`
- Verify `GITHUB_REPO=sfg-app-portfolio`

### Registration Issue Not Created

**Cause:** Network error or authentication failure

**Solution:**
- Check internet connection
- Verify credentials are correct
- Try again in a few minutes
- Check GitHub status: https://www.githubstatus.com/

---

## 📞 NEED HELP?

**GitHub Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio

**Create an Issue:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues/new

**Contact:** warren@sfg-innovations.com

**Nexus Review Time:** 24-48 hours

---

## ✅ SUCCESS CRITERIA

Your registration is complete when:

1. ✅ GitHub issue created with `[Registration]` title
2. ✅ Issue has labels: `registration`, `satellite-app`, `pending-approval`
3. ✅ Business logic documented in issue body
4. ✅ Nexus reviews and approves (within 24-48 hours)
5. ✅ Issue label changed to `approved`

**After approval, you'll receive:**
- Integration instructions
- MCP server setup guide
- Orchestration workflow assignments

---

**Version:** 2.0 (Corrected with actual private key)  
**Last Updated:** November 3, 2025  
**Valid Until:** Private key rotation (TBD)

