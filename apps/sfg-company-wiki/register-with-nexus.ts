
/**
 * SFG Company Wiki - Autonomous Registration with Nexus
 * This script registers the Company Wiki with the SFG AI Ecosystem Orchestration System
 */

import { Octokit } from '@octokit/rest'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

// GitHub configuration
const GITHUB_CONFIG = {
  owner: 'sfgaluminium1-spec',
  repo: 'sfg-app-portfolio',
}

const APP_NAME = 'sfg-company-wiki'
const LOCAL_PATH = '/tmp/sfg-app-portfolio'
const SOURCE_DIR = '/home/ubuntu/company_wiki'
const AUTH_SECRETS_PATH = '/home/ubuntu/.config/abacusai_auth_secrets.json'

// ============================================================================
// GitHub Authentication
// ============================================================================

function getGitHubToken(): string {
  const authSecrets = JSON.parse(fs.readFileSync(AUTH_SECRETS_PATH, 'utf-8'))
  return authSecrets.githubuser.secrets.access_token.value
}

async function getGitHubClient() {
  const token = getGitHubToken()
  const octokit = new Octokit({ auth: token })
  return { octokit, token }
}

async function getAuthenticatedGitUrl(token: string): Promise<string> {
  return `https://${token}@github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}.git`
}

// ============================================================================
// Repository Operations
// ============================================================================

async function cloneRepository(token: string): Promise<string> {
  console.log('📥 Cloning repository...')

  // Remove existing directory
  if (fs.existsSync(LOCAL_PATH)) {
    await execAsync(`rm -rf ${LOCAL_PATH}`)
  }

  // Clone repository
  const gitUrl = await getAuthenticatedGitUrl(token)
  try {
    await execAsync(`git clone ${gitUrl} ${LOCAL_PATH}`)
    console.log('✅ Repository cloned')
  } catch (error: any) {
    // Repository might not exist yet, try to initialize
    console.log('Repository does not exist, initializing locally...')
    fs.mkdirSync(LOCAL_PATH, { recursive: true })
    await execAsync(`cd ${LOCAL_PATH} && git init`)
    await execAsync(`cd ${LOCAL_PATH} && git remote add origin ${gitUrl}`)
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
      {
        name: 'Product Count Change Tracking',
        description: 'Track and approve changes to project product quantities',
        steps: [
          'User logs product count change (additions, removals, extras)',
          'System calculates delta and pricing impact',
          'Route to estimator for signoff',
          'Route to finance for acknowledgement',
          'Update project current product count',
          'Log change in audit trail',
        ],
        triggers: ['Product count log creation', 'Revision submission'],
        outputs: ['ProductCountLog record', 'Estimator signoff', 'Finance acknowledgement', 'Updated project count'],
      },
      {
        name: 'Procedure Management & Conflict Detection',
        description: 'Create, version, and detect conflicts in company procedures',
        steps: [
          'User creates/updates procedure',
          'System versions procedure (increment version number)',
          'System scans for conflicts (duplicate rules, contradictory policies)',
          'If conflict detected: Create ConflictReport',
          'Notify relevant users of conflict',
          'Track resolution progress',
        ],
        triggers: ['Procedure creation/update', 'Manual conflict scan'],
        outputs: ['Procedure version', 'ConflictReport (if applicable)', 'Notification', 'Audit log'],
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
        name: 'Staff Tier Approval Limits',
        description: 'Staff can only approve amounts within their tier limit',
        condition: 'IF approvalAmount > staffTier.approvalLimit',
        action: 'THEN escalate to next tier level',
        priority: 'high',
      },
      {
        name: 'Insurance Compliance (Non-Negotiable)',
        description: 'Work must comply with insurance policy limits',
        condition: 'IF workHeight > 15m OR workDepth > 2m OR includesGroundwork = true OR workType in PROHIBITED_WORK',
        action: 'THEN block project and require special insurance approval',
        priority: 'high',
      },
      {
        name: 'Drawing Workflow Sequential Progression',
        description: 'Drawings must progress through workflow stages sequentially',
        condition: 'IF targetStage.order != currentStage.order + 1',
        action: 'THEN block and show "Cannot skip workflow stages"',
        priority: 'high',
      },
      {
        name: 'Xero Contact Creation Priority',
        description: 'Contacts must be created in Xero before invoice generation',
        condition: 'IF project.status = ORD AND project.xeroContactId = null',
        action: 'THEN create Xero contact and store xeroContactId before allowing INV progression',
        priority: 'high',
      },
      {
        name: 'Credit Limit Enforcement',
        description: 'Customers cannot exceed their tier-based credit limit',
        condition: 'IF totalOutstanding + newOrderValue > customerTier.creditLimit',
        action: 'THEN block order and require credit tier upgrade or payment',
        priority: 'high',
      },
      {
        name: 'Daily Turnover Target Tracking',
        description: 'Track progress against £8,929 daily turnover target',
        condition: 'IF date = today',
        action: 'THEN sum all project values by status and display vs target',
        priority: 'medium',
      },
      {
        name: 'Monthly Overhead Coverage',
        description: 'Ensure £50,000 monthly overhead is covered',
        condition: 'IF monthToDate turnover < monthlyOverhead',
        action: 'THEN display warning on dashboard',
        priority: 'medium',
      },
      {
        name: 'Audit Log Everything',
        description: 'All create/update/delete operations must be logged',
        condition: 'IF action in [CREATE, UPDATE, DELETE, APPROVE, REJECT]',
        action: 'THEN create AuditLog record with oldValues, newValues, userId, timestamp',
        priority: 'medium',
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
        name: 'Labour Cost Calculation',
        description: 'Calculate labour cost with overtime and weekend uplifts',
        formula: 'cost = hours * rate * (isOvertime ? 1.5 : 1) * (isWeekend ? 1.5 : 1)',
        inputs: [
          { name: 'hours', type: 'number', description: 'Number of labour hours' },
          { name: 'isOvertime', type: 'boolean', description: 'Whether work is overtime' },
          { name: 'isWeekend', type: 'boolean', description: 'Whether work is on weekend' },
        ],
        output: { name: 'cost', type: 'number', description: 'Total labour cost in GBP' },
        example: { hours: 8, isOvertime: false, isWeekend: false, cost: 144 },
      },
      {
        name: 'Monthly Progress Tracking',
        description: 'Calculate progress towards £178,571 monthly turnover target',
        formula: 'percentage = (currentTurnover / targetTurnover) * 100',
        inputs: [
          { name: 'currentTurnover', type: 'number', description: 'Month-to-date turnover' },
        ],
        output: { name: 'percentage', type: 'number', description: 'Progress percentage (0-100)' },
        example: { currentTurnover: 89285, percentage: 50 },
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
      {
        name: 'Product Count Delta',
        description: 'Calculate change in product quantities between revisions',
        formula: 'delta = newCount - oldCount',
        inputs: [
          { name: 'oldCount', type: 'number', description: 'Previous product count' },
          { name: 'newCount', type: 'number', description: 'New product count' },
        ],
        output: { name: 'delta', type: 'number', description: 'Change in quantity (can be negative)' },
        example: { oldCount: 25, newCount: 32, delta: 7 },
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
      {
        name: 'AWS S3 (via Abacus Cloud Storage)',
        type: 'other',
        description: 'Cloud storage for file attachments, drawings, and documents',
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
          { name: 'location', type: 'string', required: false, description: 'Project location' },
          { name: 'productType', type: 'string', required: false, description: 'Type of product (e.g., "Aluminium Windows")' },
          { name: 'deliveryType', type: 'enum', required: false, description: 'SUPPLY_ONLY | COLLECTED | SUPPLY_AND_INSTALL' },
          { name: 'status', type: 'enum', required: true, description: 'Current project status' },
          { name: 'xeroContactId', type: 'string', required: false, description: 'Xero contact ID for invoicing' },
          { name: 'xeroInvoiceId', type: 'string', required: false, description: 'Xero invoice ID' },
          { name: 'currentProductCount', type: 'number', required: false, description: 'Current number of products in project' },
        ],
      },
      {
        name: 'Procedure',
        description: 'Company knowledge base procedures with versioning and conflict detection',
        fields: [
          { name: 'id', type: 'string', required: true, description: 'Unique procedure ID' },
          { name: 'title', type: 'string', required: true, description: 'Procedure title' },
          { name: 'content', type: 'text', required: true, description: 'Procedure content (markdown)' },
          { name: 'categoryId', type: 'string', required: true, description: 'Parent category ID' },
          { name: 'version', type: 'number', required: true, description: 'Version number' },
          { name: 'isLatestVersion', type: 'boolean', required: true, description: 'Whether this is the latest version' },
          { name: 'status', type: 'enum', required: true, description: 'DRAFT | ACTIVE | INACTIVE | ARCHIVED | UNDER_REVIEW' },
          { name: 'approvalLevel', type: 'enum', required: true, description: 'Required approval level (NONE | MANAGER | DIRECTOR | VP | CEO)' },
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
          { name: 'jobNumber', type: 'string', required: false, description: 'Extracted job number' },
          { name: 'customerName', type: 'string', required: false, description: 'Extracted customer name' },
          { name: 'processingStatus', type: 'enum', required: true, description: 'Processing status' },
        ],
      },
      {
        name: 'AuditLog',
        description: 'Comprehensive audit trail for all system operations',
        fields: [
          { name: 'id', type: 'string', required: true, description: 'Unique log ID' },
          { name: 'action', type: 'enum', required: true, description: 'CREATE | UPDATE | DELETE | VIEW | APPROVE | REJECT | RESTORE | ARCHIVE' },
          { name: 'entityType', type: 'string', required: true, description: 'Type of entity affected' },
          { name: 'entityId', type: 'string', required: true, description: 'ID of entity affected' },
          { name: 'oldValues', type: 'json', required: false, description: 'Previous values (before change)' },
          { name: 'newValues', type: 'json', required: false, description: 'New values (after change)' },
          { name: 'userId', type: 'string', required: true, description: 'User who performed action' },
        ],
      },
      {
        name: 'ConflictReport',
        description: 'Detected conflicts between procedures and policies',
        fields: [
          { name: 'id', type: 'string', required: true, description: 'Unique conflict ID' },
          { name: 'title', type: 'string', required: true, description: 'Conflict title' },
          { name: 'conflictType', type: 'enum', required: true, description: 'Type of conflict' },
          { name: 'severity', type: 'enum', required: true, description: 'LOW | MEDIUM | HIGH | CRITICAL' },
          { name: 'status', type: 'enum', required: true, description: 'DETECTED | INVESTIGATING | RESOLVED | ACCEPTED | IGNORED' },
          { name: 'procedureId', type: 'string', required: true, description: 'Primary procedure involved' },
          { name: 'relatedProcedureId', type: 'string', required: false, description: 'Related procedure (if applicable)' },
        ],
      },
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/auth/[...nextauth]', description: 'NextAuth.js authentication endpoints', authentication: false },
      { method: 'POST', path: '/api/signup', description: 'User registration', authentication: false },
      { method: 'GET', path: '/api/procedures', description: 'List all procedures', authentication: true },
      { method: 'POST', path: '/api/procedures', description: 'Create new procedure', authentication: true },
      { method: 'GET', path: '/api/categories', description: 'List all categories', authentication: true },
      { method: 'POST', path: '/api/categories', description: 'Create new category', authentication: true },
      { method: 'GET', path: '/api/projects', description: 'List all projects', authentication: true },
      { method: 'POST', path: '/api/projects', description: 'Create new project', authentication: true },
      { method: 'GET', path: '/api/projects/[id]', description: 'Get project by ID', authentication: true },
      { method: 'PUT', path: '/api/projects/[id]', description: 'Update project', authentication: true },
      { method: 'DELETE', path: '/api/projects/[id]', description: 'Delete project', authentication: true },
      { method: 'POST', path: '/api/projects/[id]/product-count', description: 'Log product count change', authentication: true },
      { method: 'GET', path: '/api/projects/stats', description: 'Get project statistics', authentication: true },
      { method: 'GET', path: '/api/companies-house/search', description: 'Search Companies House by company name', authentication: true },
      { method: 'GET', path: '/api/companies-house/profile', description: 'Get company profile by number', authentication: true },
      { method: 'GET', path: '/api/companies-house/officers', description: 'Get company officers', authentication: true },
      { method: 'GET', path: '/api/companies-house/credit-risk', description: 'Assess credit risk', authentication: true },
      { method: 'GET', path: '/api/xero/auth', description: 'Initiate Xero OAuth flow', authentication: true },
      { method: 'GET', path: '/api/xero/connect', description: 'Xero OAuth callback', authentication: true },
      { method: 'GET', path: '/api/xero/organisations', description: 'List connected Xero organisations', authentication: true },
      { method: 'POST', path: '/api/xero/contacts', description: 'Create or update Xero contact', authentication: true },
      { method: 'POST', path: '/api/xero/invoices', description: 'Create Xero invoice', authentication: true },
      { method: 'POST', path: '/api/chat', description: 'RAG chat assistant endpoint', authentication: true },
      { method: 'POST', path: '/api/ai/chat', description: 'AI chat completion', authentication: true },
      { method: 'POST', path: '/api/notifications/sms', description: 'Send SMS notification via Twilio', authentication: true },
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
  techStack: {
    framework: string
    language: string
    database?: string
    deployment: string
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
    techStack: {
      framework: 'Next.js 14',
      language: 'TypeScript',
      database: 'PostgreSQL (Prisma ORM)',
      deployment: 'Abacus.AI',
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
  await execAsync(`cd ${repoPath} && git config user.name "${APP_NAME}"`)
  await execAsync(`cd ${repoPath} && git config user.email "${APP_NAME}@sfgaluminium.com"`)

  // Add files
  await execAsync(`cd ${repoPath} && git add apps/${APP_NAME}/`)

  // Commit
  const commitMessage = `feat: Register ${APP_NAME} satellite app

- Add source code backup
- Add business logic extraction
- Add registration metadata

Registered on: ${new Date().toISOString()}`

  await execAsync(`cd ${repoPath} && git commit -m "${commitMessage}"`)

  // Push
  const gitUrl = await getAuthenticatedGitUrl(token)
  await execAsync(`cd ${repoPath} && git remote set-url origin ${gitUrl}`)
  
  try {
    await execAsync(`cd ${repoPath} && git push origin main`)
  } catch (error: any) {
    // Try pushing to master if main doesn't exist
    console.log('Main branch does not exist, trying master...')
    await execAsync(`cd ${repoPath} && git push origin master`)
  }

  console.log('✅ Changes pushed to GitHub')
}

// ============================================================================
// Issue Creation
// ============================================================================

async function createRegistrationIssue(
  logic: BusinessLogic,
  metadata: RegistrationMetadata
) {
  console.log('📝 Creating registration issue...')

  const { octokit } = await getGitHubClient()

  const issueBody = `
# ${APP_NAME} - Satellite App Registration

## ✅ Registration Complete

**App Name:** ${APP_NAME}  
**Registration Date:** ${new Date().toISOString()}  
**Status:** Pending Approval  
**Deployment:** https://company-wiki-5g0kyk.abacusai.app

---

## 📋 App Information

**Purpose:** ${logic.purpose}

**Tech Stack:**
- Framework: ${metadata.techStack.framework}
- Language: ${metadata.techStack.language}
- Database: ${metadata.techStack.database || 'N/A'}
- Deployment: ${metadata.techStack.deployment}

**Capabilities:**
${logic.capabilities.map((c) => `- ${c}`).join('\n')}

---

## 🔄 Workflows

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

## 📏 Business Rules

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

**Inputs:**
${c.inputs.map((i) => `- ${i.name} (${i.type}): ${i.description}`).join('\n')}

**Output:** ${c.output.name} (${c.output.type}): ${c.output.description}

**Example:** \`${JSON.stringify(c.example)}\`
`
  )
  .join('\n')}

---

## 🔗 Integrations

${logic.integrations
  .map(
    (i) => `
- **${i.name}** (${i.type}): ${i.description}${i.endpoint ? ` (${i.endpoint})` : ''}
`
  )
  .join('\n')}

---

## 📊 Data Models

${logic.dataModels
  .map(
    (m) => `
### ${m.name}
${m.description}

**Fields:**
${m.fields
  .map((f) => `- ${f.name} (${f.type})${f.required ? ' *required*' : ''}: ${f.description}`)
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
**Awaiting approval from:** Nexus  
**Repository:** https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/tree/main/apps/${APP_NAME}
`

  const issue = await octokit.issues.create({
    owner: GITHUB_CONFIG.owner,
    repo: GITHUB_CONFIG.repo,
    title: `[Registration] ${APP_NAME} - Registration Complete`,
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
    console.log('🚀 Starting satellite app registration for SFG Company Wiki...\n')

    // 1. Get GitHub client
    const { octokit, token } = await getGitHubClient()
    console.log('✅ Authenticated with GitHub\n')

    // 2. Clone repository
    const repoPath = await cloneRepository(token)

    // 3. Back up source code
    await backupSourceCode(repoPath)

    // 4. Extract business logic
    const logic = extractBusinessLogic()
    await saveBusinessLogic(repoPath, logic)

    // 5. Create registration metadata
    const metadata = createRegistrationMetadata()
    await saveRegistrationMetadata(repoPath, metadata)

    // 6. Commit and push
    await commitAndPush(repoPath, token)

    // 7. Create registration issue
    const issue = await createRegistrationIssue(logic, metadata)

    console.log('\n✅ REGISTRATION COMPLETE!\n')
    console.log(`Issue URL: ${issue.html_url}`)
    console.log(
      `Repository: https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/tree/main/apps/${APP_NAME}`
    )
    console.log('\n⏳ Awaiting approval from Nexus...')
  } catch (error) {
    console.error('❌ Registration failed:', error)
    throw error
  }
}

// Run registration
completeRegistration()
