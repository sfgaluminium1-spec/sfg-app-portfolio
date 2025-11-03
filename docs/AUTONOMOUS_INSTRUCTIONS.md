# SFG Aluminium Ecosystem - Autonomous Agent Instructions

**Document Version:** 1.0  
**Last Updated:** November 3, 2025  
**Primary Contact:** Warren Heathcote (Executive - Escalate all conflicts immediately)

---

## 1. Executive Summary

### 1.1 Overview
SFG Aluminium Limited is implementing a comprehensive business management ecosystem centered around **SFG NEXUS**, a Next.js-based platform that orchestrates multiple satellite applications for managing glass fabrication and installation operations.

### 1.2 Current State - What Has Been Completed ✅

- **SFG NEXUS Main Application**: Core platform developed and backed up to GitHub
- **GitHub Repository Structure**: Created at `/home/ubuntu/github_repos/sfg-app-portfolio`
- **Truth Files Extraction**: Complete organizational knowledge base extracted to:
  - Local: `/home/ubuntu/sfg-truth-files/`
  - GitHub: `shared/truth-files/`
- **Xero Integration Foundation**: OAuth connector configured in Abacus.AI platform
- **Architectural Patterns Defined**: Single webhook, one API per app, MCP structure
- **Compliance Framework**: 7-year data retention policy, GDPR requirements documented

### 1.3 What Needs to Be Done Next 🎯

**IMMEDIATE PRIORITIES FOR MANUS AGENT:**

1. **Xero App Configuration** (CRITICAL)
   - Configure Xero app to sync customer database
   - Import all existing Xero customers into NEXUS
   - Prepare customer records for credit checking integration
   - Set up real-time/batch sync mechanism

2. **Privacy Policy & Terms of Service** (REQUIRED FOR APP REGISTRATION)
   - Draft comprehensive privacy policy for all SFG applications
   - Create terms of service document
   - Host these documents at accessible URLs
   - Prepare URLs for manual app registration

3. **Webhook Handler Implementation** (ARCHITECTURAL FOUNDATION)
   - Implement single webhook endpoint in NEXUS
   - Create routing logic for unlimited satellite redirects
   - Design webhook security and validation
   - Test webhook distribution pattern

4. **Satellite App API Specifications** (ARCHITECTURE)
   - Define API specifications for each satellite app
   - Create API documentation templates
   - Establish API naming conventions
   - Plan API versioning strategy

5. **MCP Server Allocation** (ACCESS CONTROL)
   - Map 5 MCP servers to 5 organizational tiers
   - Allocate 30 tools per MCP server (AgentPass free tier)
   - Define which tools belong to which tier
   - Document access permissions matrix

---

## 2. Architectural Principles

### 2.1 Single Webhook Architecture ⚡

**CRITICAL RULE: Only ONE webhook is allowed across the entire ecosystem.**

#### Why This Matters
- Third-party services (Xero, payment providers, etc.) typically limit webhooks
- Managing multiple webhooks creates synchronization nightmares
- Single webhook enforces centralized event distribution

#### Implementation Pattern

```
External Service (e.g., Xero)
         ↓
   [SINGLE WEBHOOK]
         ↓
   NEXUS Webhook Handler
         ↓
    Event Router
    ↙    ↓    ↘
  App1  App2  App3 ... (unlimited satellite apps)
```

#### Webhook Handler Design

**Location**: `sfg-nexus/app/api/webhooks/central/route.ts`

**Core Functions:**
1. **Receive**: Accept webhook payload from external service
2. **Authenticate**: Verify webhook signature/token
3. **Parse**: Identify event type and affected resources
4. **Route**: Distribute to relevant satellite applications
5. **Log**: Record all webhook events for audit trail
6. **Respond**: Return appropriate HTTP status to sender

**Example Implementation Pattern:**

```typescript
// Webhook routing configuration
const WEBHOOK_ROUTES = {
  'xero.invoice.created': [
    'customer-portal-api',
    'production-tracker-api',
    'credit-checker-api'
  ],
  'xero.payment.received': [
    'customer-portal-api',
    'credit-checker-api'
  ],
  'xero.contact.updated': [
    'customer-portal-api',
    'credit-checker-api'
  ]
}

// Webhook handler
export async function POST(request: Request) {
  const payload = await request.json()
  const eventType = payload.eventType
  
  // Get target apps for this event type
  const targetApis = WEBHOOK_ROUTES[eventType] || []
  
  // Distribute to each satellite app
  const results = await Promise.allSettled(
    targetApis.map(api => 
      fetch(`${API_GATEWAY}/${api}/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    )
  )
  
  return Response.json({ distributed: results.length })
}
```

### 2.2 One API Per Application 🔌

**CRITICAL RULE: Each satellite application must have its own dedicated API.**

#### Why This Matters
- Clear boundaries of responsibility
- Independent deployment and scaling
- Easier debugging and monitoring
- Security isolation

#### API Structure

Each satellite application has:
- **Its own API endpoint**: `https://api.sfg-aluminium.com/{app-name}/`
- **Its own API key/authentication**: Independent security
- **Its own versioning**: `/v1/`, `/v2/` etc.
- **Its own documentation**: OpenAPI/Swagger spec

#### API Naming Conventions

```
Format: {app-name}-api

Examples:
- customer-portal-api
- production-tracker-api
- credit-checker-api
- schedule-manager-api
- compliance-monitor-api
- time-finance-api
```

#### API Gateway Pattern

**NEXUS acts as the API Gateway:**

```
NEXUS Frontend
     ↓
API Gateway (NEXUS Backend)
     ↓
  ┌─────┴─────┬─────────┬──────────┐
  ↓           ↓         ↓          ↓
App1-API  App2-API  App3-API  App4-API
```

**Gateway Responsibilities:**
- Authentication (JWT token validation)
- Rate limiting (tier-based limits)
- Request routing
- Response aggregation
- Error handling
- Logging and monitoring

### 2.3 MCP Organizational Structure 🔐

**AgentPass Free Tier Allocation:** 5 MCP servers × 30 tools each = 150 tools total

#### Tier Mapping

| Tier | Staff Role | Credit Limit | MCP Server | Tools Allocated |
|------|-----------|--------------|------------|-----------------|
| 1 | Directors | Unlimited | `sfg-directors-mcp` | 30 tools |
| 2 | Finance/Payroll | £50,000 | `sfg-finance-mcp` | 30 tools |
| 3 | HR/Design | £15,000 | `sfg-hr-design-mcp` | 30 tools |
| 4 | H&S/Production | £5,000 | `sfg-production-mcp` | 30 tools |
| 5 | New Starters/Juniors | £1,000 | `sfg-juniors-mcp` | 30 tools |

#### Tool Distribution Strategy

**Tier 1 (Directors - Unlimited):**
- Full system administration tools
- Financial override capabilities
- Customer credit approval tools
- Staff management tools
- All reporting and analytics
- System configuration tools
- Backup and restore tools
- Compliance audit tools
- Third-party API management
- Advanced scheduling tools

**Tier 2 (Finance/Payroll - £50k):**
- Financial reporting tools
- Invoice management
- Payment processing
- Xero integration tools
- Credit management (up to £50k)
- Payroll processing
- VAT and tax tools
- Budget management
- Purchase order approval (up to £50k)
- Supplier payment management

**Tier 3 (HR/Design - £15k):**
- HR management tools
- Employee records
- Leave management
- Design tools access
- Customer communication
- Quote creation (up to £15k)
- Project planning
- Document management
- Training records
- Performance reviews

**Tier 4 (H&S/Production - £5k):**
- Health & safety tools
- Production scheduling
- Workshop management
- Material ordering (up to £5k)
- Quality control
- Installation tracking
- Equipment maintenance
- Safety inspection tools
- Production reporting
- Job card management

**Tier 5 (New Starters/Juniors - £1k):**
- Basic time tracking
- Task viewing (assigned to them)
- Document viewing
- Health & safety reporting
- Basic customer communication
- Material requests (up to £1k)
- Production updates
- Training module access
- Personal performance dashboard
- Basic reporting tools

#### MCP Access Control Implementation

```typescript
// Truth file: /home/ubuntu/sfg-truth-files/staff_tiers.json
{
  "tiers": [
    {
      "tier": 1,
      "name": "Directors",
      "creditLimit": null,
      "mcpServer": "sfg-directors-mcp",
      "tools": ["admin.*", "finance.*", "compliance.*", ...]
    },
    // ... other tiers
  ]
}

// Access control check
function canAccessTool(staffTier: number, toolName: string): boolean {
  const tierConfig = staffTiers.find(t => t.tier === staffTier)
  return tierConfig.tools.some(pattern => 
    new RegExp(pattern).test(toolName)
  )
}
```

---

## 3. Integration Requirements

### 3.1 Xero Integration 🔗

#### Current Status
- **OAuth Configuration**: ✅ COMPLETE - Configured in Abacus.AI connector
- **App Configuration**: ⏳ PENDING - Needs Manus agent to configure
- **Customer Database Sync**: ⏳ PENDING - Critical for credit checking

#### App Configuration Tasks

1. **Authenticate with Xero API**
   ```typescript
   // Use existing OAuth tokens from Abacus connector
   const xeroClient = new XeroClient({
     clientId: process.env.XERO_CLIENT_ID,
     clientSecret: process.env.XERO_CLIENT_SECRET,
     redirectUris: [process.env.XERO_REDIRECT_URI],
     scopes: ['accounting.contacts', 'accounting.transactions']
   })
   ```

2. **Sync Customer Database**
   - Import all existing Xero contacts
   - Map Xero fields to NEXUS customer schema
   - Handle contact groups and categories
   - Import contact history and notes

3. **Customer Schema Mapping**

   **Xero Contact Fields → NEXUS Customer Fields:**
   ```typescript
   {
     xeroContactId: string          // Primary key for sync
     name: string                    // Contact name
     email: string                   // Primary email
     phone: string                   // Primary phone
     address: {
       street: string
       city: string
       region: string
       postalCode: string
       country: string
     }
     accountNumber: string           // Xero account number
     taxNumber: string               // VAT/Tax ID
     isCustomer: boolean             // Contact type
     isSupplier: boolean             // Contact type
     defaultCurrency: string         // GBP
     
     // Additional NEXUS fields for credit checking
     creditLimit: number             // Assigned credit limit
     currentBalance: number          // Outstanding balance
     creditStatus: enum              // 'good', 'watch', 'hold', 'blocked'
     paymentTerms: number            // Days (e.g., 30, 60, 90)
     averagePaymentDays: number      // Historical average
     overdueAmount: number           // Currently overdue
     lastPaymentDate: Date           // Most recent payment
     creditScore: number             // 0-100 calculated score
     projectTier: number             // 1-4 based on typical project size
   }
   ```

4. **Real-Time vs Batch Sync Strategy**

   **Real-Time (via Webhook):**
   - Contact created/updated/deleted
   - Invoice status changes
   - Payment received
   - Credit note issued

   **Batch Sync (Scheduled):**
   - Full contact list sync: Daily at 2:00 AM
   - Financial data reconciliation: Daily at 3:00 AM
   - Historical transaction import: Weekly Sunday 1:00 AM
   - Backup sync verification: Daily at 4:00 AM

5. **Credit Checking Data Structure**

   **Location**: `/home/ubuntu/sfg-truth-files/credit_logic.json`

   ```json
   {
     "creditTiers": [
       {
         "tier": 1,
         "name": "Premium",
         "minProjectValue": 50000,
         "maxProjectValue": null,
         "requiredCreditScore": 80,
         "requiredPaymentHistory": "excellent",
         "approvalRequired": "director"
       },
       {
         "tier": 2,
         "name": "Standard",
         "minProjectValue": 15000,
         "maxProjectValue": 49999,
         "requiredCreditScore": 60,
         "requiredPaymentHistory": "good",
         "approvalRequired": "finance"
       },
       {
         "tier": 3,
         "name": "Basic",
         "minProjectValue": 5000,
         "maxProjectValue": 14999,
         "requiredCreditScore": 40,
         "requiredPaymentHistory": "fair",
         "approvalRequired": "manager"
       },
       {
         "tier": 4,
         "name": "Cash",
         "minProjectValue": 0,
         "maxProjectValue": 4999,
         "requiredCreditScore": 0,
         "requiredPaymentHistory": "any",
         "approvalRequired": "none"
       }
     ],
     "creditScoreCalculation": {
       "factors": {
         "paymentHistory": 0.40,
         "currentBalance": 0.20,
         "accountAge": 0.15,
         "overdueAmount": 0.15,
         "projectSuccess": 0.10
       },
       "penalties": {
         "overduePayment": -10,
         "disputedInvoice": -5,
         "creditLimitExceeded": -15,
         "latePaymentPattern": -20
       },
       "bonuses": {
         "earlyPayment": 5,
         "longTermCustomer": 10,
         "highVolume": 15,
         "referralSource": 5
       }
     }
   }
   ```

6. **Xero Webhook Configuration**

   **CRITICAL**: Remember single webhook rule!

   ```typescript
   // Webhook endpoint: https://nexus.sfg-aluminium.com/api/webhooks/central
   
   // Xero events to subscribe to:
   const XERO_WEBHOOK_EVENTS = [
     'CONTACT.CREATE',
     'CONTACT.UPDATE',
     'CONTACT.DELETE',
     'INVOICE.CREATE',
     'INVOICE.UPDATE',
     'INVOICE.STATUS.CHANGED',
     'PAYMENT.CREATE',
     'PAYMENT.UPDATE',
     'CREDITNOTE.CREATE',
     'ACCOUNT.TRANSACTION.CREATE'
   ]
   ```

#### Xero Integration Testing Checklist

- [ ] OAuth token refresh working
- [ ] Full contact list import successful
- [ ] Contact create/update/delete syncing
- [ ] Invoice data syncing correctly
- [ ] Payment data syncing correctly
- [ ] Credit checking calculations accurate
- [ ] Webhook receiving and routing working
- [ ] Error handling and retry logic tested
- [ ] Data reconciliation report generated

### 3.2 Truth Files Integration 📚

#### Truth Files Location

**Primary Location**: `/home/ubuntu/sfg-truth-files/`  
**GitHub Backup**: `shared/truth-files/`

#### Available Truth Files

1. **staff_tiers.json** - Staff authorization levels and credit limits
2. **customer_tiers.json** - Customer classification and credit logic
3. **project_rules.json** - Project type definitions and workflows
4. **credit_logic.json** - Credit score calculation and approval rules
5. **document_lifecycle.json** - Document types, statuses, retention
6. **building_regulations.json** - UK building regs compliance rules
7. **permissions_matrix.json** - Role-based access control matrix
8. **product_catalog.json** - Standard products and pricing structure
9. **supplier_list.json** - Approved suppliers and contact details
10. **workflow_definitions.json** - Standard business process workflows

#### How to Import Truth Files

**Pattern for all satellite applications:**

```typescript
// Step 1: Import truth file at build time
import staffTiers from '@/truth-files/staff_tiers.json'
import customerTiers from '@/truth-files/customer_tiers.json'

// Step 2: Create TypeScript types from JSON
interface StaffTier {
  tier: number
  name: string
  creditLimit: number | null
  mcpServer: string
  tools: string[]
  permissions: string[]
}

// Step 3: Type-safe access
const staffTierData: StaffTier[] = staffTiers.tiers

// Step 4: Create utility functions
export function getStaffTier(tierId: number): StaffTier | undefined {
  return staffTierData.find(t => t.tier === tierId)
}

export function canApproveAmount(tierId: number, amount: number): boolean {
  const tier = getStaffTier(tierId)
  if (!tier) return false
  if (tier.creditLimit === null) return true // Unlimited
  return amount <= tier.creditLimit
}
```

#### Version Control for Truth Files

**IMPORTANT**: Truth files are business logic and must be versioned.

```bash
# Truth files are tracked in Git
cd /home/ubuntu/github_repos/sfg-app-portfolio
git add shared/truth-files/*.json
git commit -m "Update truth files: [describe change]"
git push origin main

# After updating, sync to local working directory
cp shared/truth-files/*.json /home/ubuntu/sfg-truth-files/
```

**Version Tracking Pattern:**

```json
{
  "version": "1.2.0",
  "lastUpdated": "2025-11-03",
  "updatedBy": "Warren Heathcote",
  "changeLog": "Added new staff tier for temporary contractors",
  "data": {
    // ... actual truth data
  }
}
```

#### Validation and Type Safety

**Create validation schemas using Zod:**

```typescript
import { z } from 'zod'

const StaffTierSchema = z.object({
  tier: z.number().int().min(1).max(5),
  name: z.string(),
  creditLimit: z.number().nullable(),
  mcpServer: z.string(),
  tools: z.array(z.string()),
  permissions: z.array(z.string())
})

const StaffTiersFileSchema = z.object({
  version: z.string(),
  lastUpdated: z.string(),
  updatedBy: z.string(),
  tiers: z.array(StaffTierSchema)
})

// Validate truth file on import
export function loadStaffTiers() {
  try {
    const data = StaffTiersFileSchema.parse(staffTiersData)
    return data.tiers
  } catch (error) {
    console.error('Truth file validation failed:', error)
    throw new Error('Invalid staff tiers data')
  }
}
```

#### Truth File Update Procedure

1. **Request Change**: Agent identifies need to update truth file
2. **Escalate to Warren**: All truth file changes require approval
3. **Warren Approves**: Gets immediate decision
4. **Update File**: Modify JSON with version bump
5. **Commit to Git**: Version control the change
6. **Sync Applications**: All dependent apps reload truth data
7. **Test**: Verify change doesn't break existing functionality

---

## 4. Compliance & Data Management

### 4.1 UK Data Retention (7 Years) 📅

#### What Must Be Retained

**Financial Records (7 years from end of financial year):**
- Invoices (sales and purchase)
- Credit notes
- Payment records
- VAT records
- Payroll records
- Expense claims
- Bank statements and reconciliations
- Contract documents
- Purchase orders

**Customer Records (7 years from last interaction):**
- Customer contact information
- Quote history
- Project documentation
- Communication logs
- Installation certificates
- Warranty information
- Credit agreements
- Payment history

**Employee Records (6 years after employment ends):**
- Employment contracts
- Payroll records
- Tax information (PAYE)
- Pension contributions
- Absence records
- Training records
- Disciplinary records
- Health & safety incidents

**Building Compliance Records (Permanent for structural work):**
- Building regulation approvals
- Installation certificates
- Technical drawings
- Material certifications
- Safety test results
- Structural calculations

#### Retention Policy Implementation

**Database Schema Pattern:**

```typescript
interface AuditableRecord {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  retentionPeriodYears: number
  retentionCategory: 'financial' | 'customer' | 'employee' | 'compliance'
  deleteAfterDate: Date  // Calculated field
  isArchived: boolean
  archiveLocation: string
}
```

**Retention Policy Rules:**

```json
{
  "retentionPolicies": {
    "financial": {
      "years": 7,
      "startFrom": "financial_year_end",
      "categories": ["invoices", "payments", "vat_records", "payroll"]
    },
    "customer": {
      "years": 7,
      "startFrom": "last_interaction",
      "categories": ["quotes", "projects", "communications", "warranties"]
    },
    "employee": {
      "years": 6,
      "startFrom": "employment_end_date",
      "categories": ["contracts", "payroll", "tax", "hr_records"]
    },
    "compliance": {
      "years": null,
      "startFrom": "permanent",
      "categories": ["building_regs", "certificates", "structural_docs"]
    }
  }
}
```

#### Archive Strategy

**3-Tier Storage:**

1. **Hot Storage (Active Database)**
   - Current records + 2 years
   - PostgreSQL database
   - Fast access, full indexing
   - Daily backups

2. **Warm Storage (Archive Database)**
   - 2-7 years old
   - Compressed PostgreSQL
   - Indexed but slower access
   - Weekly backups

3. **Cold Storage (Compliance Archive)**
   - 7+ years (legal hold)
   - Encrypted JSON files
   - GitHub backup repository
   - Monthly verification

**Archive Process (Automated Monthly Job):**

```typescript
// Run 1st of every month
async function archiveOldRecords() {
  const today = new Date()
  
  // Step 1: Find records older than 2 years (move to warm storage)
  const twoYearsAgo = subYears(today, 2)
  const recordsToArchive = await db.query(`
    SELECT * FROM records 
    WHERE createdAt < $1 
    AND isArchived = false
  `, [twoYearsAgo])
  
  // Step 2: Move to archive database
  await archiveDb.batchInsert(recordsToArchive)
  await db.markAsArchived(recordsToArchive.map(r => r.id))
  
  // Step 3: Find records past retention period
  const recordsToDelete = await archiveDb.query(`
    SELECT * FROM archived_records
    WHERE deleteAfterDate < $1
    AND retentionCategory != 'compliance'
  `, [today])
  
  // Step 4: Create compliance backup before deletion
  const backupFile = `compliance_archive_${format(today, 'yyyy-MM')}.json.gz`
  await createEncryptedBackup(recordsToDelete, backupFile)
  await uploadToGitHub('backups/compliance/', backupFile)
  
  // Step 5: Delete from archive database
  await archiveDb.delete(recordsToDelete.map(r => r.id))
  
  // Step 6: Log deletion audit trail
  await auditLog.create({
    action: 'retention_deletion',
    recordCount: recordsToDelete.length,
    backupLocation: backupFile,
    performedAt: today
  })
}
```

#### Deletion Procedures After Retention Period

**Secure Deletion Protocol:**

1. **Pre-Deletion Verification**
   - Confirm retention period has elapsed
   - Check for legal holds or active disputes
   - Verify backup exists in cold storage
   - Get automated compliance clearance

2. **Deletion Process**
   - Create encrypted backup to cold storage
   - Remove from archive database
   - Overwrite database blocks (secure delete)
   - Remove from backup rotation after 90 days

3. **Audit Trail**
   - Record what was deleted
   - When it was deleted
   - Who authorized (automated system)
   - Where backup is stored
   - Verification hash of backup

4. **Annual Compliance Report**
   - Generate report of all deletions
   - Verify retention policy compliance
   - Review any exceptions or holds
   - Archive report for auditor access

**GDPR Right to Erasure Exception:**

If customer requests data deletion under GDPR, but retention period not expired:
- Remove from active systems
- Anonymize in archive
- Maintain financial records (legal requirement)
- Document the erasure request
- Inform customer what must be retained and why

### 4.2 Privacy Policy & Terms of Service 📋

**CRITICAL FOR APP REGISTRATION**: All OAuth applications require publicly accessible privacy policy and terms of service URLs.

#### Required Documents

1. **Privacy Policy** (`/legal/privacy-policy`)
2. **Terms of Service** (`/legal/terms-of-service`)
3. **Cookie Policy** (`/legal/cookie-policy`)
4. **Data Processing Agreement** (`/legal/data-processing`)

#### Privacy Policy Template Structure

```markdown
# SFG Aluminium Limited - Privacy Policy

**Last Updated:** [Date]  
**Effective Date:** [Date]

## 1. Introduction
[Company introduction and commitment to privacy]

## 2. Data Controller
SFG Aluminium Limited  
[Business Address]  
[Contact Email]  
[Contact Phone]  
Company Registration Number: [Number]

## 3. Data We Collect

### 3.1 Customer Data
- Contact information (name, email, phone, address)
- Business information (company name, VAT number)
- Project details and specifications
- Payment information
- Communication history
- Site survey data

### 3.2 Employee Data
- Personal information (name, address, DOB)
- Employment details
- Payroll and tax information
- Training and certification records
- Performance data
- Health & safety records

### 3.3 Automatically Collected Data
- Login information
- IP addresses
- Browser type and version
- Usage analytics
- Cookie data

## 4. How We Use Your Data
[Specify purposes for each data type]

## 5. Legal Basis for Processing
- Contract performance
- Legal obligation
- Legitimate business interests
- Consent

## 6. Data Retention
We retain data in accordance with UK legal requirements:
- Financial records: 7 years
- Customer records: 7 years from last interaction
- Employee records: 6 years after employment ends
- Compliance records: Permanent

## 7. Data Sharing
[Who we share with and why - Xero, payment processors, etc.]

## 8. Your Rights Under GDPR
- Right to access
- Right to rectification
- Right to erasure (subject to legal retention)
- Right to restrict processing
- Right to data portability
- Right to object
- Rights related to automated decision-making

## 9. Data Security
[Security measures in place]

## 10. International Transfers
[If applicable]

## 11. Contact Us
Data Protection Officer: [Name]  
Email: [DPO Email]  
Phone: [DPO Phone]

## 12. Complaints
You have the right to complain to the Information Commissioner's Office (ICO):  
Website: https://ico.org.uk  
Phone: 0303 123 1113
```

#### Terms of Service Template Structure

```markdown
# SFG Aluminium Limited - Terms of Service

**Last Updated:** [Date]  
**Effective Date:** [Date]

## 1. Agreement to Terms
[Binding agreement language]

## 2. Services Provided
[Description of services]

## 3. User Accounts
- Account creation requirements
- Security responsibilities
- Account termination

## 4. Acceptable Use
[What users can and cannot do]

## 5. Intellectual Property
[Copyright and trademark notices]

## 6. Payment Terms
- Pricing
- Payment methods
- Refund policy
- Late payment fees

## 7. Project Terms
- Quote validity period
- Installation scheduling
- Customer responsibilities
- Site access requirements
- Delays and force majeure

## 8. Warranties and Guarantees
- Product warranties
- Installation guarantees
- Limitation of warranties

## 9. Liability Limitations
[Legal liability limits]

## 10. Dispute Resolution
- Governing law (England and Wales)
- Dispute resolution process
- Arbitration clause

## 11. Changes to Terms
[How terms may be updated]

## 12. Contact Information
[Company contact details]
```

#### Hosting Requirements

**URLs must be publicly accessible without authentication:**

```
https://www.sfg-aluminium.com/legal/privacy-policy
https://www.sfg-aluminium.com/legal/terms-of-service
https://www.sfg-aluminium.com/legal/cookie-policy
https://www.sfg-aluminium.com/legal/data-processing
```

**Implementation:**

```typescript
// Next.js pages
// pages/legal/privacy-policy.tsx
// pages/legal/terms-of-service.tsx
// pages/legal/cookie-policy.tsx
// pages/legal/data-processing.tsx

// Each page should:
// 1. Be statically generated (SSG)
// 2. Include version number and last updated date
// 3. Be printable
// 4. Be accessible (WCAG AA)
// 5. Include table of contents for easy navigation
```

#### GDPR Compliance Requirements

**Must-Have Features:**

1. **Consent Management**
   - Cookie consent banner
   - Granular consent options
   - Easy withdrawal of consent
   - Record of consent with timestamp

2. **Data Subject Rights Portal**
   - Request data access
   - Request data correction
   - Request data deletion
   - Request data portability
   - Object to processing

3. **Automated Responses**
   - Acknowledge request within 72 hours
   - Fulfill request within 30 days
   - Explain any delays
   - Provide requested data in machine-readable format

4. **Audit Trail**
   - Log all data access
   - Log all data modifications
   - Log all data deletions
   - Log all consent changes
   - Retain logs for 7 years

---

## 5. Operational Procedures

### 5.1 Backup & Rollback 💾

#### Automated Backup Schedule

**Tier 1: Real-Time (Continuous)**
- Database transaction logs
- Uploaded files (immediate sync)
- Configuration changes

**Tier 2: Hourly**
- User-generated content
- Job updates
- Schedule changes
- Communication logs

**Tier 3: Daily (2:00 AM)**
- Full database backup
- Application state
- Truth files
- User preferences

**Tier 4: Weekly (Sunday 1:00 AM)**
- Complete system snapshot
- Full file system backup
- Archived records
- Compliance documents

**Tier 5: Monthly (1st of month 1:00 AM)**
- Long-term archive backup
- Historical data
- Audit logs
- Deleted records (retention compliance)

#### Backup Storage Locations

**Primary Backup: GitHub Repository**

```
/home/ubuntu/github_repos/sfg-app-portfolio/backups/
├── daily/
│   ├── 2025-11-03/
│   │   ├── database-full-20251103-0200.sql.gz
│   │   ├── files-20251103-0200.tar.gz
│   │   └── truth-files-20251103-0200.json.gz
│   └── [keep 7 days]
├── weekly/
│   ├── 2025-W44/
│   │   ├── system-snapshot-20251103.tar.gz
│   │   └── metadata-20251103.json
│   └── [keep 8 weeks]
├── monthly/
│   ├── 2025-11/
│   │   ├── archive-202511.tar.gz
│   │   └── compliance-202511.json.gz
│   └── [keep 12 months]
└── compliance/
    ├── [encrypted archives for 7-year retention]
    └── [never auto-delete]
```

**Secondary Backup: Local Storage**

```
/home/ubuntu/backups/
├── hot/ (last 24 hours, high-frequency)
├── warm/ (last 7 days)
└── verification/ (restore test results)
```

**Tertiary Backup: Abacus.AI Storage**

```
Use Abacus.AI File Upload API for critical backups
- Encrypted
- Versioned
- Accessible via API
- High availability
```

#### Rollback Procedures

**Level 1: Configuration Rollback (Minor issues)**

```bash
# Revert truth files to previous version
cd /home/ubuntu/github_repos/sfg-app-portfolio
git log shared/truth-files/staff_tiers.json  # Find previous commit
git checkout [commit-hash] shared/truth-files/staff_tiers.json
cp shared/truth-files/*.json /home/ubuntu/sfg-truth-files/
# Restart application to load reverted files
```

**Level 2: Code Rollback (Application bugs)**

```bash
# Use Git to rollback specific application
cd /home/ubuntu/github_repos/sfg-app-portfolio/apps/sfg-nexus
git log  # Identify last working commit
git revert [commit-hash]  # Create revert commit
npm run build
pm2 restart sfg-nexus
```

**Level 3: Database Rollback (Data corruption)**

```bash
# Stop application
pm2 stop all

# Identify backup to restore
ls -lah /home/ubuntu/backups/daily/

# Restore database
gunzip -c database-full-20251103-0200.sql.gz | psql sfg_nexus_db

# Verify restoration
psql sfg_nexus_db -c "SELECT COUNT(*) FROM customers;"

# Restart application
pm2 start all
```

**Level 4: Full System Rollback (Critical failure)**

```bash
# Use weekly snapshot
cd /home/ubuntu/backups/weekly/2025-W44/

# Extract system snapshot
tar -xzf system-snapshot-20251103.tar.gz -C /home/ubuntu/restore/

# Stop all services
pm2 stop all

# Restore files
rsync -av /home/ubuntu/restore/ /home/ubuntu/

# Restore database
gunzip -c database-full-20251103.sql.gz | psql sfg_nexus_db

# Restart services
pm2 start all

# Verify system health
npm run test:health-check
```

**CRITICAL: Always test restore before disaster strikes**

```bash
# Monthly restore test (automated)
#!/bin/bash
# restore-test.sh

# Create test environment
TEST_DIR="/home/ubuntu/test-restore-$(date +%Y%m%d)"
mkdir -p $TEST_DIR

# Get latest daily backup
LATEST_BACKUP=$(ls -t /home/ubuntu/backups/daily/ | head -1)

# Attempt restore to test location
tar -xzf /home/ubuntu/backups/daily/$LATEST_BACKUP/files-*.tar.gz -C $TEST_DIR

# Restore database to test database
gunzip -c /home/ubuntu/backups/daily/$LATEST_BACKUP/database-*.sql.gz | psql test_restore_db

# Verify data integrity
psql test_restore_db -c "SELECT COUNT(*) FROM customers;" > $TEST_DIR/verify.log
psql test_restore_db -c "SELECT COUNT(*) FROM jobs;" >> $TEST_DIR/verify.log

# Compare with production counts
PROD_CUSTOMERS=$(psql sfg_nexus_db -t -c "SELECT COUNT(*) FROM customers;")
TEST_CUSTOMERS=$(psql test_restore_db -t -c "SELECT COUNT(*) FROM customers;")

if [ "$PROD_CUSTOMERS" -eq "$TEST_CUSTOMERS" ]; then
  echo "✅ Restore test PASSED" >> $TEST_DIR/verify.log
else
  echo "❌ Restore test FAILED - count mismatch" >> $TEST_DIR/verify.log
  # Alert Warren immediately
fi

# Cleanup test environment
dropdb test_restore_db
rm -rf $TEST_DIR
```

#### Testing Backup Restoration

**Monthly Restore Test (1st Sunday of each month)**

1. Select previous week's backup
2. Restore to isolated test environment
3. Verify data integrity
4. Test critical application functions
5. Document any issues
6. Report results to Warren

**Restore Test Checklist:**

- [ ] Database restore completes without errors
- [ ] All tables present with expected row counts
- [ ] File restore includes all required assets
- [ ] Truth files restored correctly
- [ ] Application starts successfully
- [ ] Login and authentication works
- [ ] Critical workflows functional
- [ ] Data relationships intact (foreign keys)
- [ ] Time to restore documented
- [ ] Any errors logged and resolved

### 5.2 Conflict Resolution ⚖️

**GOLDEN RULE: All conflicts escalate to Warren immediately for decision.**

#### What Constitutes a Conflict?

1. **Technical Conflicts**
   - Contradictory requirements
   - Architectural decisions (which pattern to use)
   - Performance vs. feature trade-offs
   - Security vs. usability decisions

2. **Business Logic Conflicts**
   - Credit approval thresholds
   - Pricing calculations
   - Workflow processes
   - Authorization rules

3. **Priority Conflicts**
   - Which feature to build first
   - Which bug to fix first
   - Resource allocation
   - Timeline adjustments

4. **Data Conflicts**
   - Conflicting information in truth files
   - Xero data vs. NEXUS data discrepancies
   - Customer information conflicts

#### Immediate Decision Protocol

**When conflict detected:**

```
1. STOP work on conflicting items immediately
2. Document the conflict clearly:
   - What is the conflict?
   - What are the options?
   - What are the implications of each option?
   - What is your recommendation?
3. Escalate to Warren via Slack
4. Wait for decision before proceeding
5. Document decision in resolution log
6. Update relevant documentation
7. Resume work with clarity
```

**Conflict Escalation Template:**

```markdown
## 🚨 CONFLICT REQUIRING DECISION

**Conflict ID:** CONF-2025-11-03-001  
**Detected By:** [Agent Name]  
**Date:** 2025-11-03  
**Priority:** [High/Medium/Low]

### Description
[Clear description of the conflict]

### Option A: [Name]
**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

**Implications:**
- [Technical impact]
- [Business impact]
- [Timeline impact]

### Option B: [Name]
**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

**Implications:**
- [Technical impact]
- [Business impact]
- [Timeline impact]

### Agent Recommendation
[Your recommended choice and reasoning]

### Request for Decision
@Warren - Please review and decide which option to proceed with.
```

#### Documentation of Decisions

**Decision Log Location:** `/home/ubuntu/sfg-nexus/docs/decisions/`

```markdown
# Decision Log Entry

**Decision ID:** DEC-2025-11-03-001  
**Related Conflict:** CONF-2025-11-03-001  
**Date:** 2025-11-03  
**Decided By:** Warren Heathcote  
**Decision:** Option B - [Name]

## Rationale
[Warren's reasoning for the decision]

## Actions Required
- [ ] Update truth file [filename]
- [ ] Modify component [component name]
- [ ] Update documentation
- [ ] Inform affected agents

## Impact Assessment
- Technical: [Impact]
- Business: [Impact]
- Timeline: [Impact]

## Follow-up
[Any follow-up actions or monitoring needed]
```

**All agents must check decision log before making significant changes.**

#### Conflict Tracking System

```typescript
// Store in database for tracking
interface ConflictRecord {
  id: string
  dateRaised: Date
  raisedBy: string  // Agent name
  description: string
  options: Array<{
    name: string
    pros: string[]
    cons: string[]
    implications: string
  }>
  recommendation: string
  status: 'open' | 'decided' | 'implemented' | 'closed'
  decision: string
  decidedBy: string
  decidedAt: Date
  resolutionNotes: string
}
```

### 5.3 Testing Protocol 🧪

**Philosophy: Hands-on, immediate feedback, simultaneous monitoring and fixing.**

#### Testing Approach

**NO traditional "test phase" - continuous testing:**

1. **Build Feature**
2. **Test Feature Immediately** (on localhost or dev)
3. **If broken → Fix immediately**
4. **If works → Deploy to staging**
5. **Test on staging**
6. **If broken → Fix immediately**
7. **If works → Deploy to production**
8. **Monitor in production**
9. **If issues → Fix immediately**

#### Instant Feedback Loop

**Development Workflow:**

```bash
# Terminal 1: Development server
npm run dev

# Terminal 2: Test runner (watch mode)
npm run test:watch

# Terminal 3: Type checking (watch mode)
npm run type-check:watch

# Terminal 4: Logs monitoring
pm2 logs sfg-nexus --lines 100

# All running simultaneously
# Instant feedback on any change
```

#### Simultaneous Monitoring and Fixing

**Agent Testing Checklist (for every feature):**

1. **Unit Test** - Does the function work in isolation?
   ```bash
   npm run test:unit -- --watch
   # Write test → See it fail → Write code → See it pass
   ```

2. **Integration Test** - Does it work with other components?
   ```bash
   npm run test:integration
   # Test API endpoints, database operations, external integrations
   ```

3. **Manual Test** - Does it work in the UI?
   ```bash
   # Open browser to localhost:3000
   # Click through the feature
   # Try to break it
   # Check console for errors
   # Check network tab for API calls
   ```

4. **Edge Case Test** - Does it handle unusual inputs?
   ```
   - Empty strings
   - Null values
   - Very long inputs
   - Special characters
   - Invalid data types
   - Concurrent operations
   ```

5. **Error Handling Test** - Does it fail gracefully?
   ```
   - Network timeout
   - Database down
   - Invalid API response
   - Missing permissions
   - Expired tokens
   ```

6. **Performance Test** - Is it fast enough?
   ```bash
   # Check page load time
   # Check API response time
   # Check database query performance
   npm run test:performance
   ```

#### Test Environment vs Production

**Three Environments:**

1. **Local Development** (localhost:3000)
   - Instant feedback
   - Hot reload
   - Debug mode enabled
   - Test data

2. **Staging** (staging.sfg-aluminium.com)
   - Production-like environment
   - Real(ish) data (anonymized production copy)
   - Test integrations with real services
   - Pre-deployment validation

3. **Production** (nexus.sfg-aluminium.com)
   - Live customer data
   - Real integrations
   - Monitoring enabled
   - Rollback ready

**Environment Variables:**

```bash
# .env.local (development)
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/sfg_dev
XERO_CLIENT_ID=test_client_id
XERO_REDIRECT_URI=http://localhost:3000/auth/xero/callback

# .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://staging-db:5432/sfg_staging
XERO_CLIENT_ID=staging_client_id
XERO_REDIRECT_URI=https://staging.sfg-aluminium.com/auth/xero/callback

# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://prod-db:5432/sfg_production
XERO_CLIENT_ID=prod_client_id
XERO_REDIRECT_URI=https://nexus.sfg-aluminium.com/auth/xero/callback
```

#### Automated Testing (CI/CD)

**On every Git push:**

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Type check
        run: npm run type-check
      - name: Lint
        run: npm run lint
      - name: Unit tests
        run: npm run test:unit
      - name: Integration tests
        run: npm run test:integration
      - name: Build
        run: npm run build
```

**Must pass before deployment to staging.**

#### Testing Sign-Off

**Feature Complete Criteria:**

- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Edge cases handled
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Tested on staging
- [ ] Warren approved (if significant feature)
- [ ] Deployed to production
- [ ] Monitoring confirmed working

**Only then is the feature considered "done".**

---

## 6. Satellite Applications

### Overview

SFG NEXUS serves as the central orchestration platform. Satellite applications are specialized modules that handle specific business functions. Each satellite has its own API and integrates with NEXUS via the API Gateway.

### 6.1 Planned Satellite Applications

#### 1. **Customer Portal** (`sfg-customer-portal`)

**Purpose:** Self-service portal for customers to manage projects, view quotes, track installations.

**API Requirements:**
- `GET /api/customer/:id/projects` - List customer projects
- `GET /api/customer/:id/quotes` - List customer quotes
- `POST /api/customer/enquiry` - Submit new enquiry
- `GET /api/customer/:id/invoices` - View invoices
- `POST /api/customer/:id/support` - Submit support ticket
- `GET /api/customer/:id/documents` - Access project documents

**Integration Points with NEXUS:**
- Authentication (OAuth via NEXUS)
- Customer data sync (from Xero via NEXUS)
- Project status updates (webhook from NEXUS)
- Quote approval workflow (API call to NEXUS)

**Truth Files Used:**
- `customer_tiers.json` - Determine customer access level
- `project_rules.json` - Display relevant project information
- `document_lifecycle.json` - Control document access

**Priority:** HIGH (customer-facing)

---

#### 2. **Production Tracker** (`sfg-production-tracker`)

**Purpose:** Real-time tracking of fabrication and installation progress.

**API Requirements:**
- `GET /api/production/schedule` - Get production schedule
- `PUT /api/production/job/:id/status` - Update job status
- `POST /api/production/job/:id/milestone` - Record milestone completion
- `GET /api/production/job/:id/materials` - View material usage
- `POST /api/production/job/:id/issue` - Report production issue
- `GET /api/production/capacity` - Check production capacity

**Integration Points with NEXUS:**
- Job creation (triggered by approved quote)
- Schedule updates (sync with NEXUS schedule)
- Material ordering (API call to NEXUS)
- Installation date confirmation (webhook to customer portal)

**Truth Files Used:**
- `staff_tiers.json` - Production staff access control
- `workflow_definitions.json` - Production workflow stages
- `product_catalog.json` - Material specifications

**Priority:** HIGH (operations critical)

---

#### 3. **Credit Checker** (`sfg-credit-checker`)

**Purpose:** Automated credit checking and approval workflow.

**API Requirements:**
- `POST /api/credit/check` - Run credit check for customer/project
- `GET /api/credit/customer/:id` - Get customer credit status
- `PUT /api/credit/customer/:id/limit` - Update credit limit
- `GET /api/credit/approvals/pending` - List pending approvals
- `POST /api/credit/approve/:id` - Approve credit decision
- `GET /api/credit/history/:id` - View credit history

**Integration Points with NEXUS:**
- Xero customer data (sync from NEXUS)
- Quote approval workflow (API call to NEXUS)
- Payment history (webhook from Xero via NEXUS)
- Risk scoring (standalone calculation)

**Truth Files Used:**
- `credit_logic.json` - Credit calculation rules
- `customer_tiers.json` - Customer tier assignment
- `staff_tiers.json` - Approval authority levels

**Priority:** HIGH (revenue protection)

---

#### 4. **Schedule Manager** (`sfg-schedule-manager`)

**Purpose:** Advanced scheduling for installation teams and vehicles.

**API Requirements:**
- `GET /api/schedule/teams` - List available teams
- `GET /api/schedule/vehicles` - List available vehicles
- `POST /api/schedule/job/:id/assign` - Assign team to job
- `PUT /api/schedule/job/:id/reschedule` - Reschedule installation
- `GET /api/schedule/calendar/:date` - View schedule for date
- `POST /api/schedule/optimize` - Run schedule optimization

**Integration Points with NEXUS:**
- Job schedule (sync with NEXUS)
- Team availability (API call to NEXUS)
- Vehicle maintenance (webhook from NEXUS)
- Customer notifications (trigger via NEXUS)

**Truth Files Used:**
- `staff_tiers.json` - Team member skills and access
- `workflow_definitions.json` - Installation workflow
- `project_rules.json` - Project scheduling rules

**Priority:** MEDIUM (efficiency improvement)

---

#### 5. **Compliance Monitor** (`sfg-compliance-monitor`)

**Purpose:** Track building regulations compliance and certifications.

**API Requirements:**
- `POST /api/compliance/check` - Check project compliance requirements
- `GET /api/compliance/project/:id` - View compliance status
- `POST /api/compliance/certificate/:id` - Upload certificate
- `GET /api/compliance/regulations` - Get current regulations
- `POST /api/compliance/audit` - Create compliance audit
- `GET /api/compliance/reports` - Generate compliance reports

**Integration Points with NEXUS:**
- Project creation (compliance check trigger)
- Document upload (webhook to NEXUS)
- Certification completion (update job status in NEXUS)
- Audit reports (API call to NEXUS for data)

**Truth Files Used:**
- `building_regulations.json` - Compliance requirements
- `document_lifecycle.json` - Certificate management
- `project_rules.json` - Project-specific regulations

**Priority:** MEDIUM (regulatory requirement)

---

#### 6. **Time Finance Module** (`sfg-time-finance`)

**Purpose:** Manage finance options for customers, integrate with finance providers.

**API Requirements:**
- `POST /api/finance/quote` - Get finance quote
- `POST /api/finance/application` - Submit finance application
- `GET /api/finance/application/:id/status` - Check application status
- `POST /api/finance/agreement/:id/sign` - Sign finance agreement
- `GET /api/finance/customer/:id/agreements` - List customer agreements
- `GET /api/finance/reports` - Finance performance reports

**Integration Points with NEXUS:**
- Quote integration (add finance option to quote)
- Payment tracking (webhook from finance provider via NEXUS)
- Customer portal (finance options display)
- Approval workflow (API call to NEXUS)

**Truth Files Used:**
- `customer_tiers.json` - Finance eligibility
- `credit_logic.json` - Finance credit checking
- `staff_tiers.json` - Finance approval authority

**Priority:** LOW (future enhancement)

---

#### 7. **Supplier Portal** (`sfg-supplier-portal`)

**Purpose:** Manage supplier relationships, purchase orders, material tracking.

**API Requirements:**
- `GET /api/supplier/catalog` - View supplier catalog
- `POST /api/supplier/order` - Create purchase order
- `GET /api/supplier/order/:id` - View order status
- `PUT /api/supplier/order/:id/receive` - Record material receipt
- `POST /api/supplier/invoice` - Process supplier invoice
- `GET /api/supplier/performance` - Supplier performance metrics

**Integration Points with NEXUS:**
- Material requirements (API call from NEXUS)
- Purchase order approval (workflow in NEXUS)
- Invoice processing (webhook to Xero via NEXUS)
- Inventory updates (API call to NEXUS)

**Truth Files Used:**
- `supplier_list.json` - Approved suppliers
- `product_catalog.json` - Material specifications
- `staff_tiers.json` - Purchase order approval limits

**Priority:** LOW (future enhancement)

---

### 6.2 Satellite App Development Priority

**Phase 1 (Immediate - Q4 2025):**
1. Customer Portal (customer-facing urgency)
2. Production Tracker (operations critical)
3. Credit Checker (revenue protection)

**Phase 2 (Q1 2026):**
4. Schedule Manager (efficiency improvement)
5. Compliance Monitor (regulatory requirement)

**Phase 3 (Q2 2026):**
6. Time Finance Module (revenue enhancement)
7. Supplier Portal (supply chain optimization)

---

## 7. Next Steps & Action Items

### 7.1 Immediate Tasks for Manus Agent

**PRIORITY 1: Xero Integration (CRITICAL)** 🔴

- [ ] **Task 1.1**: Configure Xero OAuth in NEXUS
  - Use existing Abacus.AI connector tokens
  - Test authentication flow
  - Implement token refresh mechanism

- [ ] **Task 1.2**: Import Xero Customer Database
  - Write import script
  - Map Xero contact fields to NEXUS customer schema
  - Handle contact groups and categories
  - Import historical data (invoices, payments)

- [ ] **Task 1.3**: Set Up Customer Data Sync
  - Implement real-time webhook handler for Xero events
  - Configure batch sync job (daily 2:00 AM)
  - Create data reconciliation report
  - Test sync both directions

- [ ] **Task 1.4**: Prepare Credit Checking Infrastructure
  - Add credit-specific fields to customer table
  - Implement credit score calculation (use `credit_logic.json`)
  - Create credit approval workflow
  - Test with sample customers

**PRIORITY 2: Privacy Policy & Terms of Service (REQUIRED)** 🟡

- [ ] **Task 2.1**: Draft Privacy Policy
  - Use template provided in Section 4.2
  - Customize for SFG Aluminium specifics
  - Include all required GDPR elements
  - Review with Warren for approval

- [ ] **Task 2.2**: Draft Terms of Service
  - Use template provided in Section 4.2
  - Include SFG-specific clauses (installation terms, warranties)
  - Review with Warren for approval

- [ ] **Task 2.3**: Create Legal Pages in NEXUS
  - Create `/legal/privacy-policy` page
  - Create `/legal/terms-of-service` page
  - Create `/legal/cookie-policy` page
  - Ensure pages are publicly accessible (no auth required)

- [ ] **Task 2.4**: Host Legal Documents
  - Deploy legal pages to production URL
  - Verify accessibility: `https://nexus.sfg-aluminium.com/legal/privacy-policy`
  - Provide URLs to Warren for app registration

**PRIORITY 3: Webhook Handler Implementation (ARCHITECTURE)** 🟢

- [ ] **Task 3.1**: Create Central Webhook Endpoint
  - Location: `/app/api/webhooks/central/route.ts`
  - Implement authentication/signature verification
  - Create event router

- [ ] **Task 3.2**: Define Webhook Routing Configuration
  - Map Xero events to satellite apps
  - Create routing rules JSON
  - Implement distribution logic

- [ ] **Task 3.3**: Test Webhook Distribution
  - Set up test webhook from Xero
  - Verify routing to correct satellite APIs
  - Test error handling and retry logic

**PRIORITY 4: API Specifications (ARCHITECTURE)** 🔵

- [ ] **Task 4.1**: Document Customer Portal API
  - Define all endpoints (see Section 6.1)
  - Create OpenAPI specification
  - Document authentication requirements

- [ ] **Task 4.2**: Document Production Tracker API
  - Define all endpoints (see Section 6.1)
  - Create OpenAPI specification
  - Document webhook payloads

- [ ] **Task 4.3**: Document Credit Checker API
  - Define all endpoints (see Section 6.1)
  - Create OpenAPI specification
  - Document credit calculation algorithm

**PRIORITY 5: MCP Server Allocation (ACCESS CONTROL)** 🟣

- [ ] **Task 5.1**: Map MCP Servers to Tiers
  - Allocate 5 MCP servers to 5 organizational tiers
  - Define which tools belong in each server
  - Document access permissions matrix

- [ ] **Task 5.2**: Configure MCP Server 1 (Directors)
  - Set up `sfg-directors-mcp`
  - Add 30 tools for unlimited access tier
  - Test access control

- [ ] **Task 5.3**: Configure Remaining MCP Servers
  - Set up `sfg-finance-mcp`, `sfg-hr-design-mcp`, etc.
  - Allocate 30 tools each based on tier requirements
  - Test cross-tier access restrictions

### 7.2 Blockers and Dependencies

**Current Blockers:**

1. **Privacy Policy & Terms of Service URLs**
   - **Blocker for:** App registration with third-party services (Xero, etc.)
   - **Action:** Manus to draft and deploy legal pages
   - **Timeline:** Complete within 1 week

2. **Xero Customer Data Import**
   - **Blocker for:** Credit checking functionality
   - **Action:** Manus to implement import script
   - **Timeline:** Complete within 2 weeks

3. **Webhook Handler**
   - **Blocker for:** Real-time sync with external services
   - **Action:** Manus to implement central webhook
   - **Timeline:** Complete within 1 week

**Dependencies:**

- **Xero OAuth Tokens**: ✅ AVAILABLE (configured in Abacus.AI)
- **Truth Files**: ✅ AVAILABLE (extracted to `/home/ubuntu/sfg-truth-files/`)
- **GitHub Structure**: ✅ AVAILABLE (created at `/home/ubuntu/github_repos/sfg-app-portfolio`)
- **NEXUS Codebase**: ✅ AVAILABLE (backed up to GitHub)

### 7.3 Timeline Considerations

**Week 1 (Nov 4-10, 2025):**
- Complete privacy policy & terms of service
- Deploy legal pages
- Begin Xero customer import

**Week 2 (Nov 11-17, 2025):**
- Complete Xero customer import
- Implement webhook handler
- Test webhook distribution

**Week 3 (Nov 18-24, 2025):**
- Configure credit checking
- Test customer portal integration
- Begin production tracker development

**Week 4 (Nov 25-Dec 1, 2025):**
- Complete production tracker
- Begin schedule manager development
- Prepare for Phase 2 satellite apps

### 7.4 Success Criteria

**Xero Integration Success:**
- [ ] All Xero customers imported into NEXUS
- [ ] Real-time sync working (webhooks functional)
- [ ] Credit checking operational with accurate calculations
- [ ] No data discrepancies between Xero and NEXUS

**Satellite Apps Success:**
- [ ] Customer portal live and accessible
- [ ] Production tracker operational in workshop
- [ ] Credit checker approving/declining quotes correctly
- [ ] All APIs documented and accessible
- [ ] Webhook routing functional

**Compliance Success:**
- [ ] Privacy policy and terms of service published
- [ ] 7-year data retention policy implemented
- [ ] Backup and rollback tested successfully
- [ ] All app registrations completed

**Operational Success:**
- [ ] No conflicts requiring escalation (clear decision log)
- [ ] All tests passing
- [ ] Staff can access appropriate tools for their tier
- [ ] System performance acceptable (page load < 2s)

---

## 8. Reference Information

### 8.1 GitHub Repository Structure

**Repository Location:** `/home/ubuntu/github_repos/sfg-app-portfolio`

```
sfg-app-portfolio/
├── apps/
│   ├── sfg-nexus/                    # Main orchestration platform
│   ├── sfg-customer-portal/          # Customer self-service portal
│   ├── sfg-production-tracker/       # Production management
│   ├── sfg-credit-checker/           # Credit checking and approval
│   ├── sfg-schedule-manager/         # Advanced scheduling
│   ├── sfg-compliance-monitor/       # Regulatory compliance tracking
│   ├── sfg-time-finance/             # Finance options module
│   └── sfg-supplier-portal/          # Supplier management
├── shared/
│   ├── truth-files/                  # Organizational knowledge base
│   │   ├── staff_tiers.json
│   │   ├── customer_tiers.json
│   │   ├── project_rules.json
│   │   ├── credit_logic.json
│   │   ├── document_lifecycle.json
│   │   ├── building_regulations.json
│   │   ├── permissions_matrix.json
│   │   ├── product_catalog.json
│   │   ├── supplier_list.json
│   │   └── workflow_definitions.json
│   ├── types/                        # Shared TypeScript types
│   ├── utils/                        # Shared utility functions
│   └── components/                   # Shared UI components
├── api-gateway/                      # Central API gateway (part of NEXUS)
├── webhooks/                         # Central webhook handler
├── docs/
│   ├── architecture/                 # Architecture documentation
│   ├── api/                          # API documentation (OpenAPI specs)
│   ├── decisions/                    # Decision log
│   └── guides/                       # Development guides
├── backups/
│   ├── daily/
│   ├── weekly/
│   ├── monthly/
│   └── compliance/
└── README.md                         # Repository overview
```

### 8.2 Truth Files Documentation

**Location:** `/home/ubuntu/sfg-truth-files/` and `shared/truth-files/`

#### 1. `staff_tiers.json`

Defines staff authorization levels and credit limits.

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-03",
  "tiers": [
    {
      "tier": 1,
      "name": "Directors",
      "creditLimit": null,
      "description": "Unlimited authority",
      "mcpServer": "sfg-directors-mcp",
      "permissions": ["all"]
    },
    {
      "tier": 2,
      "name": "Finance/Payroll",
      "creditLimit": 50000,
      "description": "Financial management and high-value approvals",
      "mcpServer": "sfg-finance-mcp",
      "permissions": ["finance", "payroll", "high_value_approvals"]
    },
    {
      "tier": 3,
      "name": "HR/Design",
      "creditLimit": 15000,
      "description": "HR management and design work",
      "mcpServer": "sfg-hr-design-mcp",
      "permissions": ["hr", "design", "medium_value_approvals"]
    },
    {
      "tier": 4,
      "name": "H&S/Production",
      "creditLimit": 5000,
      "description": "Health & safety and production management",
      "mcpServer": "sfg-production-mcp",
      "permissions": ["health_safety", "production", "low_value_approvals"]
    },
    {
      "tier": 5,
      "name": "New Starters/Juniors",
      "creditLimit": 1000,
      "description": "Basic access for new employees",
      "mcpServer": "sfg-juniors-mcp",
      "permissions": ["basic_access", "time_tracking"]
    }
  ]
}
```

#### 2. `customer_tiers.json`

Defines customer classification based on project value and payment history.

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-03",
  "tiers": [
    {
      "tier": 1,
      "name": "Premium",
      "minProjectValue": 50000,
      "maxProjectValue": null,
      "benefits": [
        "Priority scheduling",
        "Dedicated account manager",
        "Extended payment terms (60 days)",
        "Volume discounts",
        "Free design consultations"
      ],
      "requiredCreditScore": 80
    },
    {
      "tier": 2,
      "name": "Standard",
      "minProjectValue": 15000,
      "maxProjectValue": 49999,
      "benefits": [
        "Standard scheduling",
        "Account manager access",
        "Standard payment terms (30 days)",
        "Standard pricing"
      ],
      "requiredCreditScore": 60
    },
    {
      "tier": 3,
      "name": "Basic",
      "minProjectValue": 5000,
      "maxProjectValue": 14999,
      "benefits": [
        "Standard scheduling",
        "Email support",
        "Payment on completion",
        "Standard pricing"
      ],
      "requiredCreditScore": 40
    },
    {
      "tier": 4,
      "name": "Cash",
      "minProjectValue": 0,
      "maxProjectValue": 4999,
      "benefits": [
        "Scheduled as capacity allows",
        "Basic support",
        "Cash/card payment required",
        "No credit terms"
      ],
      "requiredCreditScore": 0
    }
  ]
}
```

#### 3. `credit_logic.json`

Defines credit score calculation and approval rules (see Section 3.1 for full details).

#### 4. `project_rules.json`

Defines project workflows and milestones.

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-03",
  "projectTypes": [
    {
      "type": "supply_and_install",
      "name": "Supply & Install",
      "workflow": [
        "enquiry",
        "site_survey",
        "quote",
        "approval",
        "fabrication",
        "installation",
        "completion",
        "payment"
      ],
      "requiredDocuments": [
        "quote",
        "site_survey_report",
        "installation_certificate",
        "warranty_certificate"
      ]
    },
    {
      "type": "supply_only",
      "name": "Supply Only",
      "workflow": [
        "enquiry",
        "quote",
        "approval",
        "fabrication",
        "delivery",
        "payment"
      ],
      "requiredDocuments": [
        "quote",
        "delivery_note"
      ]
    }
  ]
}
```

#### 5. `document_lifecycle.json`

Defines document types, statuses, and retention periods.

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-03",
  "documentTypes": [
    {
      "type": "quote",
      "name": "Quotation",
      "retentionPeriod": 7,
      "requiredFor": ["all_projects"],
      "statuses": ["draft", "sent", "approved", "declined", "expired"]
    },
    {
      "type": "invoice",
      "name": "Invoice",
      "retentionPeriod": 7,
      "requiredFor": ["all_projects"],
      "statuses": ["draft", "sent", "paid", "overdue", "void"]
    },
    {
      "type": "installation_certificate",
      "name": "Installation Certificate",
      "retentionPeriod": null,
      "requiredFor": ["supply_and_install"],
      "statuses": ["issued", "archived"]
    }
  ]
}
```

### 8.3 Staff Tier Assignments

**Example Staff Assignments:**

| Name | Role | Tier | Credit Limit | MCP Server |
|------|------|------|--------------|------------|
| Warren Heathcote | Director | 1 | Unlimited | sfg-directors-mcp |
| [Finance Manager] | Finance | 2 | £50,000 | sfg-finance-mcp |
| [HR Manager] | HR | 3 | £15,000 | sfg-hr-design-mcp |
| [Production Manager] | Production | 4 | £5,000 | sfg-production-mcp |
| [Junior Fabricator] | Fabrication | 5 | £1,000 | sfg-juniors-mcp |

### 8.4 Customer Tier Logic

**Automatic Tier Assignment:**

```typescript
function assignCustomerTier(customer: Customer): number {
  const avgProjectValue = customer.averageProjectValue
  const creditScore = customer.creditScore
  
  // Find matching tier based on project value
  const tier = customerTiers.find(t => 
    avgProjectValue >= t.minProjectValue &&
    (t.maxProjectValue === null || avgProjectValue <= t.maxProjectValue)
  )
  
  // Verify credit score meets requirement
  if (tier && creditScore >= tier.requiredCreditScore) {
    return tier.tier
  }
  
  // Default to Cash tier if credit score insufficient
  return 4
}
```

### 8.5 Credit Calculation Algorithm

**Credit Score Calculation (0-100):**

```typescript
function calculateCreditScore(customer: Customer): number {
  let score = 50 // Base score
  
  // Payment history (40% weight)
  const paymentScore = calculatePaymentHistoryScore(customer)
  score += paymentScore * 0.40
  
  // Current balance (20% weight)
  const balanceScore = calculateBalanceScore(customer)
  score += balanceScore * 0.20
  
  // Account age (15% weight)
  const ageScore = calculateAccountAgeScore(customer)
  score += ageScore * 0.15
  
  // Overdue amount (15% weight)
  const overdueScore = calculateOverdueScore(customer)
  score += overdueScore * 0.15
  
  // Project success (10% weight)
  const projectScore = calculateProjectSuccessScore(customer)
  score += projectScore * 0.10
  
  // Apply penalties
  score -= calculatePenalties(customer)
  
  // Apply bonuses
  score += calculateBonuses(customer)
  
  // Clamp to 0-100
  return Math.max(0, Math.min(100, score))
}
```

---

## 9. Conclusion & Escalation Protocol

### 9.1 Working Principles for All Agents

1. **Clarity Over Speed**: If unsure, escalate to Warren immediately. Never guess.
2. **Document Everything**: All decisions, conflicts, and changes must be logged.
3. **Test Immediately**: Don't build a feature without testing it right away.
4. **Truth Files Are Gospel**: Always consult truth files for business logic.
5. **One Webhook Rule**: Never create additional webhooks without Warren's approval.
6. **Security First**: All APIs must be authenticated, all data encrypted.
7. **GDPR Compliance**: Always consider data privacy implications.

### 9.2 When to Escalate to Warren

**Immediate Escalation Required For:**

- Any architectural decision not covered in this document
- Conflicts between requirements
- Changes to truth files
- Security vulnerabilities discovered
- Performance issues that can't be quickly resolved
- Third-party integration failures
- Data loss or corruption
- Compliance concerns
- Budget or timeline issues
- Customer-facing bugs in production

**Escalation Method:**

1. **Slack**: Post in `#all-sfg-aluminium-limited` channel with `@Warren Heathcote`
2. **Format**: Use conflict template from Section 5.2
3. **Urgency**: Mark with 🚨 for critical issues
4. **Wait**: Do not proceed until Warren responds

### 9.3 Success Metrics

**Agent Performance:**

- **Response Time**: Address requests within 1 hour during business hours
- **Accuracy**: All implemented features work as specified (zero critical bugs)
- **Documentation**: All code changes documented in decision log
- **Testing**: 100% of features tested before deployment
- **Conflicts**: All conflicts escalated immediately (no unresolved conflicts)

**System Health:**

- **Uptime**: 99.9% availability
- **Performance**: Page load < 2 seconds, API response < 500ms
- **Data Integrity**: Zero data loss incidents
- **Security**: Zero security breaches
- **Compliance**: 100% compliance with GDPR and UK regulations

### 9.4 Final Note for Manus Agent

This document is your definitive guide to the SFG Aluminium ecosystem. Everything you need to know about architecture, integrations, compliance, and operational procedures is here.

**Your mission:**

1. Complete Priority 1 tasks (Xero integration)
2. Complete Priority 2 tasks (Privacy policy & terms)
3. Complete Priority 3 tasks (Webhook handler)
4. Proceed to satellite app development

**Remember:**

- When in doubt, ask Warren
- Test everything immediately
- Document all decisions
- Follow the architectural patterns strictly
- Protect customer data at all costs
- Have fun building an amazing system! 🚀

**Contact:**

- **Warren Heathcote**: Executive Director
- **Slack**: `@Warren Heathcote` in `#all-sfg-aluminium-limited`
- **Decision Authority**: Final say on all matters

---

**Document End**

*This document is version-controlled in Git and should be updated as the system evolves. All agents must refer to the latest version in the repository.*

**Last Updated:** November 3, 2025  
**Next Review:** December 1, 2025  
**Maintained By:** DeepAgent & Manus Agent  
**Approved By:** Warren Heathcote
