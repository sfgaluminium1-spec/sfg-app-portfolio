
/**
 * SFG Company Wiki - Autonomous Registration with Nexus
 * This script registers the Company Wiki with the SFG AI Ecosystem Orchestration System
 * Using GitHub App Authentication
 */

import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

// GitHub App credentials
const GITHUB_APP_ID = '2228094'
const GITHUB_INSTALLATION_ID = '92873690'
const GITHUB_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`

// Repository details
const OWNER = 'sfgaluminium1-spec'
const REPO = 'sfg-app-portfolio'

const APP_NAME = 'sfg-company-wiki'
const LOCAL_PATH = '/tmp/sfg-app-portfolio'
const SOURCE_DIR = '/home/ubuntu/company_wiki'

// ============================================================================
// GitHub Authentication
// ============================================================================

async function getGitHubAppClient() {
  console.log('🔐 Authenticating with GitHub App...')

  const appAuth = createAppAuth({
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_PRIVATE_KEY,
    installationId: GITHUB_INSTALLATION_ID,
  })

  // Get installation access token
  const { token } = await appAuth({ type: 'installation' })

  const octokit = new Octokit({
    auth: token,
  })

  console.log('✅ Authenticated with GitHub App')
  return { octokit, token }
}

async function getAuthenticatedGitUrl(token: string): Promise<string> {
  return `https://x-access-token:${token}@github.com/${OWNER}/${REPO}.git`
}

// ============================================================================
// Repository Operations
// ============================================================================

async function cloneOrInitRepository(token: string): Promise<string> {
  console.log('📥 Setting up repository...')

  // Remove existing directory
  if (fs.existsSync(LOCAL_PATH)) {
    await execAsync(`rm -rf ${LOCAL_PATH}`)
  }

  const gitUrl = await getAuthenticatedGitUrl(token)

  try {
    // Try to clone existing repository
    await execAsync(`git clone ${gitUrl} ${LOCAL_PATH}`)
    console.log('✅ Repository cloned')
  } catch (error: any) {
    // Repository might not exist or be empty, initialize locally
    console.log('📝 Initializing new repository...')
    fs.mkdirSync(LOCAL_PATH, { recursive: true })
    await execAsync(`cd ${LOCAL_PATH} && git init`)
    await execAsync(`cd ${LOCAL_PATH} && git remote add origin ${gitUrl}`)
    
    // Create initial commit with README
    const readmePath = path.join(LOCAL_PATH, 'README.md')
    fs.writeFileSync(readmePath, `# SFG App Portfolio\n\nSatellite applications registry for the SFG Aluminium AI Ecosystem.\n`)
    
    await execAsync(`cd ${LOCAL_PATH} && git add README.md`)
    await execAsync(`cd ${LOCAL_PATH} && git config user.name "SFG Nexus"`)
    await execAsync(`cd ${LOCAL_PATH} && git config user.email "nexus@sfgaluminium.com"`)
    await execAsync(`cd ${LOCAL_PATH} && git commit -m "Initial commit"`)
    
    console.log('✅ Repository initialized')
  }

  return LOCAL_PATH
}

// ============================================================================
// Business Logic Extraction
// ============================================================================

interface BusinessLogic {
  appName: string
  purpose: string
  capabilities: string[]
  workflows: {
    name: string
    description: string
    steps: string[]
    triggers: string[]
    outputs: string[]
  }[]
  businessRules: {
    name: string
    description: string
    condition: string
    action: string
    priority: 'high' | 'medium' | 'low'
  }[]
  calculations: {
    name: string
    description: string
    formula: string
    inputs: { name: string; type: string; description: string }[]
    output: { name: string; type: string; description: string }
    example: any
  }[]
  integrations: {
    name: string
    type: 'api' | 'database' | 'mcp' | 'webhook' | 'other'
    description: string
    endpoint?: string
  }[]
  dataModels: {
    name: string
    description: string
    fields: { name: string; type: string; required: boolean; description: string }[]
  }[]
  apiEndpoints: {
    method: string
    path: string
    description: string
    authentication: boolean
  }[]
}

function extractBusinessLogic(): BusinessLogic {
  return {
    appName: APP_NAME,
    purpose: 'Company-wide knowledge management system for SFG Aluminium, managing procedures, compliance, project workflows, and financial operations',
    capabilities: [
      'Knowledge Management (procedures, categories, hierarchies)',
      'Project Management (ENQ→QUO→ORD→INV→DEL→PAID workflow)',
      'Financial Compliance (margin validation, pricing rules, credit checks)',
      'Azure Entra SSO Authentication',
      'Xero Accounting Integration',
      'Companies House API Integration',
      'Conflict Detection & Resolution',
      'Audit Logging & Compliance Tracking',
      'RAG-powered AI Chat Assistant',
      'Multi-tier Authorization (staff & customer tiers)',
      'Knowledge Smelter System (243 GB SharePoint data processing)',
      'Insurance Compliance Validation',
    ],
    workflows: [
      {
        name: 'Project Lifecycle Management',
        description: 'Six-stage project progression from enquiry to paid',
        steps: [
          'ENQ (Enquiry): Capture initial customer request',
          'QUO (Quote): Generate and send quotation',
          'ORD (Order): Process customer order',
          'INV (Invoice): Create and send invoice (Xero sync)',
          'DEL (Delivered): Track delivery/collection',
          'PAID (Paid): Confirm payment received (Xero sync)',
        ],
        triggers: ['User creates project', 'Status progression button', 'Xero webhook'],
        outputs: ['Project record', 'Audit log', 'Xero contact/invoice', 'SharePoint folder structure'],
      },
      {
        name: 'Drawing Approval Workflow',
        description: 'Sequential drawing progression (05a→05b→05c→05d→05e→05f→05g)',
        steps: [
          '05a: Incoming Requests - Customer submits drawing',
          '05b: SFG Issue - SFG creates/modifies drawing',
          '05c: Change Requests - Customer requests changes',
          '05d: Confirmations - SFG confirms changes',
          '05e: Approval - Customer approves drawing',
          '05f: Live Drawings - Drawing locked and live',
          '05g: Rejected Designs - Archive rejected designs',
        ],
        triggers: ['User uploads drawing to workflow stage', 'Approval button click'],
        outputs: ['Drawing files moved to next stage', 'Approval timestamp', 'Lock status changed'],
      },
      {
        name: 'Margin Validation & Pricing Approval',
        description: 'Enforce margin rules and escalate pricing approvals',
        steps: [
          'User enters cost and price for project',
          'System calculates margin percentage',
          'System validates against job-type-specific minimum (28-45%)',
          'If below minimum: BLOCK and require director override',
          'If below target: WARN and suggest repricing',
          'If approved: Route to appropriate staff tier for approval',
        ],
        triggers: ['Price/cost change', 'Quote creation', 'Status progression to ORD'],
        outputs: ['Validation result', 'Approval routing', 'Audit log entry'],
      },
      {
        name: 'Credit Check Protocol',
        description: 'Automated credit checking for new customers',
        steps: [
          'User enters customer name',
          'System searches Companies House API',
          'Extract company number, officers, credit risk',
          'Determine customer tier based on credit rating',
          'Set credit limit and payment terms',
          'Route to senior estimator if tier > Standard',
        ],
        triggers: ['New customer creation', 'Customer tier upgrade request'],
        outputs: ['Customer tier assignment', 'Credit limit', 'Payment terms', 'Approval routing'],
      },
      {
        name: 'Knowledge Smelter Processing',
        description: 'Automated classification and organization of 243 GB SharePoint data',
        steps: [
          'Scan SharePoint libraries for unprocessed files',
          'Extract metadata (file name, size, date, path)',
          'AI classification into 12 types (invoice, quote, drawing, etc.)',
          'Extract job numbers, customer names, dates from content',
          'Auto-tag with extracted metadata',
          'Upload to organized SharePoint structure',
          'Log processing result and confidence score',
        ],
        triggers: ['Batch processing schedule', 'Manual trigger', 'New file upload to SharePoint'],
        outputs: ['ArchivedFile records', 'Classification confidence score', 'Organized SharePoint structure'],
      },
    ],
    businessRules: [
      {
        name: 'Margin Enforcement (Non-Negotiable)',
        description: 'All jobs must meet minimum margin thresholds by job type',
        condition: 'IF margin < minimumMargin (28-45% depending on job type)',
        action: 'THEN block progression and require director override',
        priority: 'high',
      },
      {
        name: 'Required Fields Validation',
        description: 'Projects must have all required fields before status progression',
        condition: 'IF any field in [baseNumber, customer, project, location, productType, deliveryType, enquiryInitialCount] is empty',
        action: 'THEN block status progression and display MISSING badge',
        priority: 'high',
      },
      {
        name: 'Insurance Compliance (Non-Negotiable)',
        description: 'Work must comply with insurance policy limits',
        condition: 'IF workHeight > 15m OR workDepth > 2m OR includesGroundwork = true OR workType in PROHIBITED_WORK',
        action: 'THEN block project and require special insurance approval',
        priority: 'high',
      },
    ],
    calculations: [
      {
        name: 'Margin Calculation',
        description: 'Calculate profit margin percentage from cost and price',
        formula: 'margin = ((price - cost) / price) * 100',
        inputs: [
          { name: 'cost', type: 'number', description: 'Total cost of job (materials + labour)' },
          { name: 'price', type: 'number', description: 'Quoted/selling price' },
        ],
        output: { name: 'margin', type: 'number', description: 'Profit margin as percentage (0-100)' },
        example: { cost: 10000, price: 18000, margin: 44.44 },
      },
      {
        name: 'Daily Turnover Target',
        description: 'Calculate daily target of £8,929 based on 22 working days/month',
        formula: 'dailyTarget = monthlyTarget / workingDaysPerMonth',
        inputs: [
          { name: 'monthlyTarget', type: 'number', description: 'Monthly turnover target (£178,571)' },
          { name: 'workingDaysPerMonth', type: 'number', description: 'Average working days (22)' },
        ],
        output: { name: 'dailyTarget', type: 'number', description: 'Daily turnover target in GBP' },
        example: { monthlyTarget: 178571, workingDaysPerMonth: 22, dailyTarget: 8929 },
      },
    ],
    integrations: [
      {
        name: 'Azure Entra ID (Microsoft Entra)',
        type: 'api',
        description: 'Single Sign-On authentication for all users',
        endpoint: 'https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0',
      },
      {
        name: 'Xero Accounting API',
        type: 'api',
        description: 'Two-way sync for contacts, invoices, and payments',
        endpoint: 'https://api.xero.com/api.xro/2.0',
      },
      {
        name: 'Companies House API',
        type: 'api',
        description: 'Company lookup, credit risk assessment, and officer information',
        endpoint: 'https://api.company-information.service.gov.uk',
      },
      {
        name: 'SharePoint API (Microsoft Graph)',
        type: 'api',
        description: 'Read/write access to SharePoint document libraries for Knowledge Smelter',
        endpoint: 'https://graph.microsoft.com/v1.0',
      },
      {
        name: 'Twilio SMS API',
        type: 'api',
        description: 'Send SMS notifications for critical alerts',
        endpoint: 'https://api.twilio.com/2010-04-01',
      },
      {
        name: 'PostgreSQL Database',
        type: 'database',
        description: 'Primary data store for all application data',
      },
      {
        name: 'Abacus.AI LLM APIs',
        type: 'api',
        description: 'RAG-powered chat assistant for querying procedures and knowledge base',
      },
    ],
    dataModels: [
      {
        name: 'Project',
        description: 'Core project entity tracking ENQ→PAID lifecycle',
        fields: [
          { name: 'id', type: 'string', required: true, description: 'Unique project ID (cuid)' },
          { name: 'baseNumber', type: 'string', required: true, description: 'Immutable project number (e.g., "10001")' },
          { name: 'prefix', type: 'enum', required: true, description: 'Current status prefix (ENQ|QUO|ORD|INV|DEL|PAID)' },
          { name: 'customer', type: 'string', required: false, description: 'Customer name' },
          { name: 'project', type: 'string', required: false, description: 'Project name/description' },
          { name: 'status', type: 'enum', required: true, description: 'Current project status' },
          { name: 'xeroContactId', type: 'string', required: false, description: 'Xero contact ID for invoicing' },
        ],
      },
      {
        name: 'Procedure',
        description: 'Company knowledge base procedures with versioning',
        fields: [
          { name: 'id', type: 'string', required: true, description: 'Unique procedure ID' },
          { name: 'title', type: 'string', required: true, description: 'Procedure title' },
          { name: 'content', type: 'text', required: true, description: 'Procedure content (markdown)' },
          { name: 'version', type: 'number', required: true, description: 'Version number' },
          { name: 'status', type: 'enum', required: true, description: 'DRAFT | ACTIVE | ARCHIVED' },
        ],
      },
      {
        name: 'ArchivedFile',
        description: 'Knowledge Smelter file classification and metadata',
        fields: [
          { name: 'id', type: 'string', required: true, description: 'Unique file ID' },
          { name: 'fileName', type: 'string', required: true, description: 'File name' },
          { name: 'fileType', type: 'enum', required: true, description: 'Classified type (INVOICE | QUOTE | DRAWING | etc.)' },
          { name: 'confidence', type: 'float', required: true, description: 'AI classification confidence (0-100)' },
          { name: 'cloudStoragePath', type: 'string', required: true, description: 'S3/cloud storage key' },
          { name: 'sharePointUrl', type: 'string', required: false, description: 'Organized SharePoint URL' },
        ],
      },
      {
        name: 'AuditLog',
        description: 'Comprehensive audit trail for all system operations',
        fields: [
          { name: 'id', type: 'string', required: true, description: 'Unique log ID' },
          { name: 'action', type: 'enum', required: true, description: 'CREATE | UPDATE | DELETE | APPROVE' },
          { name: 'entityType', type: 'string', required: true, description: 'Type of entity affected' },
          { name: 'userId', type: 'string', required: true, description: 'User who performed action' },
        ],
      },
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/auth/[...nextauth]', description: 'NextAuth.js authentication endpoints', authentication: false },
      { method: 'POST', path: '/api/signup', description: 'User registration', authentication: false },
      { method: 'GET', path: '/api/procedures', description: 'List all procedures', authentication: true },
      { method: 'POST', path: '/api/procedures', description: 'Create new procedure', authentication: true },
      { method: 'GET', path: '/api/projects', description: 'List all projects', authentication: true },
      { method: 'POST', path: '/api/projects', description: 'Create new project', authentication: true },
      { method: 'GET', path: '/api/companies-house/search', description: 'Search Companies House', authentication: true },
      { method: 'POST', path: '/api/xero/contacts', description: 'Create Xero contact', authentication: true },
      { method: 'POST', path: '/api/chat', description: 'RAG chat assistant', authentication: true },
    ],
  }
}

// ============================================================================
// Registration Metadata
// ============================================================================

interface RegistrationMetadata {
  appName: string
  registrationDate: string
  status: 'registered' | 'pending-approval' | 'approved'
  version: string
  deployment: {
    url: string
    environment: string
  }
  techStack: {
    framework: string
    language: string
    database?: string
    platform: string
  }
  contact: {
    maintainer: string
    email?: string
  }
  capabilities: string[]
  dependencies: string[]
}

function createRegistrationMetadata(): RegistrationMetadata {
  return {
    appName: APP_NAME,
    registrationDate: new Date().toISOString(),
    status: 'pending-approval',
    version: '1.0.0',
    deployment: {
      url: 'https://company-wiki-5g0kyk.abacusai.app',
      environment: 'production',
    },
    techStack: {
      framework: 'Next.js 14',
      language: 'TypeScript',
      database: 'PostgreSQL (Prisma ORM)',
      platform: 'Abacus.AI',
    },
    contact: {
      maintainer: 'Warren Heathcote',
      email: 'warren@sfgaluminium.com',
    },
    capabilities: [
      'Knowledge Management',
      'Project Management (ENQ→PAID)',
      'Financial Compliance',
      'Azure Entra SSO',
      'Xero Integration',
      'Companies House Integration',
      'Knowledge Smelter (243 GB data processing)',
      'AI Chat Assistant',
      'Multi-tier Authorization',
    ],
    dependencies: [
      'sfg-nexus',
      'Azure Entra ID',
      'Xero API',
      'SharePoint/Microsoft Graph',
      'Companies House API',
      'Twilio',
    ],
  }
}

// ============================================================================
// File Operations
// ============================================================================

async function backupSourceCode(repoPath: string) {
  console.log('💾 Backing up source code...')

  const appDir = path.join(repoPath, 'apps', APP_NAME)

  // Create app directory
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true })
  }

  // Copy source code (excluding node_modules, .next, etc.)
  const excludePatterns = [
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    '.env',
    '.env.local',
    '*.log',
    'yarn.lock',
  ]

  const rsyncExclude = excludePatterns.map((p) => `--exclude="${p}"`).join(' ')
  await execAsync(`rsync -av ${rsyncExclude} ${SOURCE_DIR}/nextjs_space/ ${appDir}/`)

  console.log('✅ Source code backed up')
}

async function saveBusinessLogic(repoPath: string, logic: BusinessLogic) {
  console.log('🧠 Saving business logic...')

  const logicPath = path.join(repoPath, 'apps', APP_NAME, 'business-logic.json')
  fs.writeFileSync(logicPath, JSON.stringify(logic, null, 2))

  console.log('✅ Business logic saved')
}

async function saveRegistrationMetadata(repoPath: string, metadata: RegistrationMetadata) {
  console.log('📋 Saving registration metadata...')

  const metadataPath = path.join(repoPath, 'apps', APP_NAME, 'app-registration.json')
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))

  console.log('✅ Registration metadata saved')
}

// ============================================================================
// Git Operations
// ============================================================================

async function commitAndPush(repoPath: string, token: string) {
  console.log('📤 Committing and pushing to GitHub...')

  // Configure git
  await execAsync(`cd ${repoPath} && git config user.name "SFG Company Wiki"`)
  await execAsync(`cd ${repoPath} && git config user.email "wiki@sfgaluminium.com"`)

  // Add files
  await execAsync(`cd ${repoPath} && git add apps/${APP_NAME}/`)

  // Commit
  const commitMessage = `feat: Register ${APP_NAME} satellite app

- Add source code backup
- Add business logic extraction
- Add registration metadata

Registered on: ${new Date().toISOString()}`

  try {
    await execAsync(`cd ${repoPath} && git commit -m "${commitMessage}"`)
  } catch (error: any) {
    if (error.message.includes('nothing to commit')) {
      console.log('⚠️  No changes to commit')
      return
    }
    throw error
  }

  // Push
  const gitUrl = await getAuthenticatedGitUrl(token)
  await execAsync(`cd ${repoPath} && git remote set-url origin ${gitUrl}`)

  // Determine branch
  let branch = 'main'
  try {
    const { stdout } = await execAsync(`cd ${repoPath} && git branch --show-current`)
    branch = stdout.trim()
  } catch (error) {
    console.log('Using default branch: main')
  }

  try {
    await execAsync(`cd ${repoPath} && git push origin ${branch}`)
    console.log('✅ Changes pushed to GitHub')
  } catch (error: any) {
    // Try creating the branch on remote
    await execAsync(`cd ${repoPath} && git push -u origin ${branch}`)
    console.log('✅ Changes pushed to GitHub (new branch created)')
  }
}

// ============================================================================
// Issue Creation
// ============================================================================

async function createRegistrationIssue(
  logic: BusinessLogic,
  metadata: RegistrationMetadata,
  octokit: Octokit
) {
  console.log('📝 Creating registration issue...')

  const issueBody = `# ${APP_NAME} - Satellite App Registration

## ✅ Registration Complete

**App Name:** ${APP_NAME}  
**Registration Date:** ${new Date().toISOString()}  
**Status:** Pending Approval  
**Deployment:** ${metadata.deployment.url}

---

## 📋 App Information

**Purpose:** ${logic.purpose}

**Tech Stack:**
- Framework: ${metadata.techStack.framework}
- Language: ${metadata.techStack.language}
- Database: ${metadata.techStack.database || 'N/A'}
- Platform: ${metadata.techStack.platform}

**Capabilities:**
${logic.capabilities.map((c) => `- ${c}`).join('\n')}

---

## 🔄 Key Workflows

${logic.workflows
  .map(
    (w) => `
### ${w.name}
${w.description}

**Steps:**
${w.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Triggers:** ${w.triggers.join(', ')}  
**Outputs:** ${w.outputs.join(', ')}
`
  )
  .join('\n')}

---

## 📏 Business Rules (Non-Negotiable)

${logic.businessRules
  .map(
    (r) => `
### ${r.name} (Priority: ${r.priority})
${r.description}

- **Condition:** ${r.condition}
- **Action:** ${r.action}
`
  )
  .join('\n')}

---

## 🧮 Calculations

${logic.calculations
  .map(
    (c) => `
### ${c.name}
${c.description}

**Formula:** \`${c.formula}\`

**Example:** \`${JSON.stringify(c.example)}\`
`
  )
  .join('\n')}

---

## 🔗 Integrations

${logic.integrations
  .map(
    (i) => `- **${i.name}** (${i.type}): ${i.description}${i.endpoint ? ` (${i.endpoint})` : ''}`
  )
  .join('\n')}

---

## 📊 Data Models

${logic.dataModels
  .map(
    (m) => `
### ${m.name}
${m.description}

**Key Fields:**
${m.fields
  .filter(f => f.required)
  .map((f) => `- ${f.name} (${f.type}): ${f.description}`)
  .join('\n')}
`
  )
  .join('\n')}

---

## 🌐 API Endpoints

${logic.apiEndpoints
  .map((e) => `- **${e.method} ${e.path}**: ${e.description} ${e.authentication ? '🔒' : ''}`)
  .join('\n')}

---

## 📦 Files Registered

- ✅ Source code backed up to \`apps/${APP_NAME}/\`
- ✅ Business logic extracted to \`apps/${APP_NAME}/business-logic.json\`
- ✅ Registration metadata created at \`apps/${APP_NAME}/app-registration.json\`

---

## 🎯 Next Steps

- [ ] Nexus reviews registration
- [ ] Nexus approves registration
- [ ] App added to orchestration system
- [ ] App receives instructions via GitHub repository

---

**Registered by:** ${APP_NAME}  
**Awaiting approval from:** Nexus (SFG AI Ecosystem Orchestration System)  
**Repository:** https://github.com/${OWNER}/${REPO}/tree/main/apps/${APP_NAME}

---

**Contact:** ${metadata.contact.maintainer} (${metadata.contact.email})
`

  const issue = await octokit.issues.create({
    owner: OWNER,
    repo: REPO,
    title: `[Registration] ${APP_NAME} - Pending Approval`,
    body: issueBody,
    labels: ['registration', 'satellite-app', 'pending-approval'],
  })

  console.log('✅ Registration issue created:', issue.data.html_url)
  return issue.data
}

// ============================================================================
// Main Registration Flow
// ============================================================================

async function completeRegistration() {
  try {
    console.log('🚀 Starting autonomous registration for SFG Company Wiki...\n')
    console.log('📍 Target: SFG AI Ecosystem Orchestration System (Nexus)\n')

    // 1. Get GitHub App client
    const { octokit, token } = await getGitHubAppClient()
    console.log('')

    // 2. Clone or initialize repository
    const repoPath = await cloneOrInitRepository(token)
    console.log('')

    // 3. Back up source code
    await backupSourceCode(repoPath)
    console.log('')

    // 4. Extract business logic
    console.log('🧠 Extracting business logic...')
    const logic = extractBusinessLogic()
    await saveBusinessLogic(repoPath, logic)
    console.log('')

    // 5. Create registration metadata
    console.log('📋 Creating registration metadata...')
    const metadata = createRegistrationMetadata()
    await saveRegistrationMetadata(repoPath, metadata)
    console.log('')

    // 6. Commit and push
    await commitAndPush(repoPath, token)
    console.log('')

    // 7. Create registration issue
    const issue = await createRegistrationIssue(logic, metadata, octokit)
    console.log('')

    console.log('═══════════════════════════════════════════════════════════')
    console.log('✅ REGISTRATION COMPLETE!')
    console.log('═══════════════════════════════════════════════════════════')
    console.log('')
    console.log(`📝 Issue: ${issue.html_url}`)
    console.log(`📦 Repository: https://github.com/${OWNER}/${REPO}/tree/main/apps/${APP_NAME}`)
    console.log(`🌐 Deployment: ${metadata.deployment.url}`)
    console.log('')
    console.log('⏳ Status: Awaiting approval from Nexus...')
    console.log('')
    console.log('The SFG Company Wiki is now registered with the')
    console.log('SFG AI Ecosystem Orchestration System and awaiting approval.')
    console.log('')
  } catch (error) {
    console.error('❌ Registration failed:', error)
    throw error
  }
}

// Run registration
completeRegistration()
  .then(() => {
    console.log('✨ Registration process completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Registration process failed:', error)
    process.exit(1)
  })
