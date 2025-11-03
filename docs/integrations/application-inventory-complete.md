# SFG ALUMINIUM - UNIFIED APPLICATION INVENTORY & INTEGRATION ANALYSIS
## Comprehensive System Documentation & Procedure Extraction

**Date Generated**: October 30, 2025  
**Organization**: SFG Aluminium (Shop Front Group)  
**Scope**: Complete ecosystem application inventory, integration points, workflows, and company procedures  

---

## EXECUTIVE SUMMARY

This document provides a complete inventory of all applications, services, and systems used across the SFG Aluminium ecosystem, extracted from bookmark analysis, directive documentation, and system architecture reviews. It includes API endpoints, authentication methods, data models, workflows, and company procedures for unified integration.

---

## 1. CORE BUSINESS APPLICATIONS

### 1.1 MICROSOFT 365 ECOSYSTEM

**Application**: Microsoft 365 Suite  
**Status**: PRODUCTION - Active  
**Deployment**: Cloud (Microsoft Entra ID)

#### Base URLs
- **Authentication**: `https://login.microsoftonline.com/[TENANT_ID]`
- **Outlook/Email**: `https://outlook.office.com`, `https://outlook.office365.com`
- **SharePoint**: `https://shopfrontgroup.sharepoint.com`
- **Teams**: `https://teams.microsoft.com`
- **Office Portal**: `https://www.office.com`

#### Authentication Method
- **Type**: OAuth 2.0 / Microsoft Entra ID (formerly Azure AD)
- **Flow**: Authorization Code Flow with PKCE
- **Credentials**: 
  - Client ID (from App Registration)
  - Tenant ID
  - Client Secret (rotated every 90 days)
- **Scopes Required**:
  - `User.Read` - Basic user profile
  - `Mail.Read` - Email access
  - `Files.ReadWrite` - SharePoint documents
  - `Sites.ReadWrite.All` - SharePoint sites (admin consent required)

#### Owned Entities & Schemas
```typescript
interface M365User {
  id: string;
  userPrincipalName: string; // email
  displayName: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  businessPhones: string[];
  mobilePhone?: string;
}

interface SharePointDocument {
  id: string;
  name: string;
  webUrl: string;
  size: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
  createdBy: M365User;
  lastModifiedBy: M365User;
}

interface M365Email {
  id: string;
  subject: string;
  from: EmailAddress;
  toRecipients: EmailAddress[];
  body: { contentType: string; content: string };
  receivedDateTime: string;
  hasAttachments: boolean;
}
```

#### API Endpoints
- **Base**: `https://graph.microsoft.com/v1.0`
- **User Profile**: `GET /me`
- **User Email**: `GET /me/messages`
- **SharePoint Sites**: `GET /sites/{site-id}`
- **SharePoint Documents**: `GET /sites/{site-id}/drive/items`
- **Teams**: `GET /me/joinedTeams`

#### Rate Limits
- **Throttling**: 10,000 requests per 10 minutes per app per tenant
- **Retry-After header**: Respect for 429 responses
- **Pagination**: @odata.nextLink for large result sets

#### Environment Variables Required
```bash
M365_CLIENT_ID=
M365_TENANT_ID=
M365_CLIENT_SECRET=
M365_REDIRECT_URI=
SHAREPOINT_SITE_ID=
```

#### Staff Permissions & Tiers
- **Admin**: Full access to all M365 services
- **Manager**: Read/write to SharePoint, email, limited Teams admin
- **User**: Read/write own email, limited SharePoint access
- **Guest**: Read-only specific SharePoint documents

#### Decision Confirmations
- **Source of Truth**: Microsoft 365 is the PRIMARY authentication source for all SFG applications
- **SSO Standard**: All internal apps MUST use M365 SSO
- **Data Storage**: SharePoint is the approved document repository

---

### 1.2 XERO ACCOUNTING SOFTWARE

**Application**: Xero Accounting  
**Status**: PRODUCTION - Active  
**Deployment**: Cloud (Xero SaaS)

#### Base URLs
- **Login**: `https://login.xero.com`
- **API Base**: `https://api.xero.com/api.xro/2.0`
- **OAuth**: `https://login.xero.com/identity/connect/authorize`

#### Authentication Method
- **Type**: OAuth 2.0
- **Flow**: Authorization Code with PKCE
- **Token Endpoint**: `https://identity.xero.com/connect/token`
- **Scopes**:
  - `accounting.transactions` - Read/write invoices, payments
  - `accounting.contacts` - Customer/supplier data
  - `accounting.reports.read` - Financial reports
  - `offline_access` - Refresh tokens

#### Owned Entities & Schemas
```typescript
interface XeroInvoice {
  InvoiceID: string;
  InvoiceNumber: string;
  Reference?: string;
  Type: 'ACCREC' | 'ACCPAY'; // Receivable or Payable
  Contact: XeroContact;
  Date: string; // YYYY-MM-DD
  DueDate: string;
  Status: 'DRAFT' | 'SUBMITTED' | 'AUTHORISED' | 'PAID';
  LineAmountTypes: 'Exclusive' | 'Inclusive' | 'NoTax';
  LineItems: XeroLineItem[];
  SubTotal: number;
  TotalTax: number;
  Total: number;
  AmountDue: number;
  AmountPaid: number;
  AmountCredited: number;
  UpdatedDateUTC: string;
}

interface XeroContact {
  ContactID: string;
  ContactNumber?: string;
  Name: string;
  EmailAddress?: string;
  BankAccountDetails?: string;
  TaxNumber?: string;
  AccountsReceivableTaxType?: string;
  AccountsPayableTaxType?: string;
  Addresses?: XeroAddress[];
  Phones?: XeroPhone[];
  IsSupplier?: boolean;
  IsCustomer?: boolean;
}

interface XeroLineItem {
  ItemCode?: string;
  Description: string;
  Quantity: number;
  UnitAmount: number;
  TaxType: string;
  TaxAmount: number;
  LineAmount: number;
  AccountCode: string;
}

interface XeroPayment {
  PaymentID: string;
  Invoice?: { InvoiceID: string; InvoiceNumber: string };
  Account: { AccountID: string; Code: string };
  Date: string;
  Amount: number;
  Reference?: string;
  IsReconciled: boolean;
}
```

#### API Endpoints
- **Invoices**: 
  - `GET /Invoices` - List all invoices
  - `GET /Invoices/{InvoiceID}` - Get specific invoice
  - `POST /Invoices` - Create invoice
  - `PUT /Invoices/{InvoiceID}` - Update invoice
- **Contacts**:
  - `GET /Contacts` - List customers/suppliers
  - `POST /Contacts` - Create contact
  - `PUT /Contacts/{ContactID}` - Update contact
- **Payments**:
  - `GET /Payments` - List payments
  - `POST /Payments` - Record payment
- **Reports**:
  - `GET /Reports/ProfitAndLoss` - P&L statement
  - `GET /Reports/BalanceSheet` - Balance sheet
  - `GET /Reports/AgedReceivables` - Outstanding invoices

#### Webhooks
**Xero Sends**:
- `CREATE.INVOICE` - New invoice created
- `UPDATE.INVOICE` - Invoice updated
- `CREATE.PAYMENT` - Payment received
- `UPDATE.CONTACT` - Customer details changed

**Endpoint to Receive**: `https://sfg-chrome.abacusai.app/api/webhooks/xero`

**Xero Listens For**: N/A (Xero is source of truth for financial data)

#### Rate Limits
- **Standard**: 60 requests per minute per organization
- **Burst**: Up to 100 requests in 60 seconds
- **Daily**: 10,000 requests per day

#### Environment Variables Required
```bash
XERO_CLIENT_ID=
XERO_CLIENT_SECRET=
XERO_REDIRECT_URI=
XERO_WEBHOOK_KEY=
XERO_TENANT_ID=
```

#### Document Prefixes Handled
- **INV** - Sales invoices (accounts receivable)
- **BILL** - Purchase bills (accounts payable)
- **PAID** - Payment records
- **CREDIT** - Credit notes

#### Staff Permissions & Tiers
- **Financial Controller**: Full access to all Xero features
- **Accountant**: Read/write invoices, payments, contacts
- **Sales Manager**: Read-only invoices and contacts
- **Production Manager**: No direct Xero access (data via API)

#### Decision Confirmations
- **Source of Truth**: Xero is the PRIMARY source for all financial data
- **Invoice Numbers**: Generated by base number system, synced to Xero
- **Payment Terms**: Calculated based on customer tier in Xero

---

### 1.3 LOGIKAL (BM ALUMINIUM) - PRICING & DRAWING SYSTEM

**Application**: Logikal Design & Pricing  
**Status**: PRODUCTION - Active  
**Deployment**: On-premise / Cloud hybrid

#### Base URLs
- **Portal**: `https://www.bmaluminium.co.uk/`
- **API**: *To be discovered - likely internal API*
- **Documentation**: *Request from BM Aluminium support*

#### Authentication Method
- **Type**: To be confirmed (likely API Key or Basic Auth)
- **Access**: Restricted to authorized SFG staff
- **Credentials**: To be provided by BM Aluminium

#### Owned Entities & Schemas
```typescript
interface LogikalDrawing {
  drawingId: string;
  projectRef: string;
  drawingNumber: string;
  revision: string;
  createdDate: string;
  modifiedDate: string;
  status: 'DRAFT' | 'APPROVED' | 'SUPERSEDED';
  pdfUrl?: string;
  dxfUrl?: string;
  metadata: {
    width: number;
    height: number;
    profile: string;
    glassType: string;
    hardware: string[];
  };
}

interface LogikalQuote {
  quoteId: string;
  quoteNumber: string;
  projectRef: string;
  customerRef: string;
  lineItems: LogikalLineItem[];
  subtotal: number;
  margin: number;
  total: number;
  validUntil: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
}

interface LogikalLineItem {
  itemCode: string;
  description: string;
  profileType: string;
  dimensions: { width: number; height: number };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  materialCost: number;
  labourCost: number;
}
```

#### API Endpoints (Expected)
- **Drawings**: 
  - `GET /api/drawings` - List drawings
  - `GET /api/drawings/{id}` - Get drawing details
  - `POST /api/drawings` - Create drawing
- **Pricing**:
  - `POST /api/quotes/calculate` - Calculate quote
  - `GET /api/pricing/profiles` - Get profile pricing
  - `GET /api/pricing/materials` - Get material costs
- **Export**:
  - `GET /api/drawings/{id}/pdf` - Download PDF
  - `GET /api/drawings/{id}/dxf` - Download DXF

#### Document Prefixes Handled
- **DWG** - Drawing numbers
- **QUO** - Quote numbers (linked to SFG base number system)

#### Staff Permissions & Tiers
- **Technical Manager**: Full access to all drawings and pricing
- **Estimator**: Create/modify quotes, view drawings
- **Sales**: View quotes and drawings (read-only pricing)
- **Production**: View approved drawings only

#### Decision Confirmations
- **Source of Truth**: Logikal is the source for technical drawings and aluminium pricing
- **Integration**: Pricing data feeds into quote generation system
- **Drawing Storage**: Drawings exported to SharePoint for archiving

#### Environment Variables Required
```bash
LOGIKAL_API_URL=
LOGIKAL_API_KEY=
LOGIKAL_USERNAME=
LOGIKAL_PASSWORD=
```

---

### 1.4 TIME FINANCE E3 (CONDITIONAL INTEGRATION)

**Application**: Time Finance E3 Credit Management  
**Status**: PLANNED - Awaiting Approval  
**Deployment**: Cloud (Time Finance SaaS)

#### Base URLs
- **Portal**: `https://e3.time-finance.dancerace-apps.com/timefinance/e3intro`
- **API**: *To be provided upon integration approval*

#### Authentication Method
- **Type**: To be confirmed (likely OAuth 2.0 or API Key)
- **Access**: Requires formal agreement with Time Finance

#### Owned Entities & Schemas
```typescript
interface TimeFinanceCredit {
  accountId: string;
  customerId: string;
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  creditStatus: 'ACTIVE' | 'SUSPENDED' | 'DECLINED';
  paymentTerms: string; // e.g., "NET30", "NET60"
  lastReviewDate: string;
}

interface TimeFinancePaymentPlan {
  planId: string;
  customerId: string;
  totalAmount: number;
  instalments: number;
  frequency: 'WEEKLY' | 'MONTHLY';
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
}
```

#### API Endpoints (Expected)
- **Credit Check**: `POST /api/credit/check` - Check customer credit
- **Application**: `POST /api/credit/apply` - Apply for credit
- **Status**: `GET /api/credit/{customerId}/status` - Get credit status

#### Webhooks
**Time Finance Sends**:
- `CREDIT.APPROVED` - Credit application approved
- `CREDIT.DECLINED` - Credit application declined
- `PAYMENT.RECEIVED` - Payment received
- `PAYMENT.OVERDUE` - Payment overdue notification

#### Document Prefixes Handled
- **CREDIT** - Credit applications
- **FINANCE** - Finance agreements

#### Staff Permissions & Tiers
- **Financial Controller**: Full access to credit management
- **Sales Manager**: Submit credit applications, view status
- **Sales**: View customer credit status only

#### Decision Confirmations
- **Integration Trigger**: ONLY when explicitly approved by management
- **Source of Truth**: Time Finance for credit decisions and payment plans
- **Customer Tier**: Influenced by Time Finance credit rating

#### Environment Variables Required
```bash
TIME_FINANCE_API_URL=
TIME_FINANCE_API_KEY=
TIME_FINANCE_PARTNER_ID=
```

---

## 2. SFG CHROME EXTENSION ECOSYSTEM

### 2.1 SFG CHROME EXTENSION

**Application**: SFG Chrome Extension  
**Status**: PRODUCTION - Active  
**Deployment**: Chrome Web Store

#### Base Functionality
- AI-powered text processing (grammar, style, tone)
- Bookmark organization and synchronization
- Password management and generation
- AI prompts and templates
- Document analysis and summarization

#### Architecture
- **Manifest Version**: 3
- **Background Script**: Service Worker
- **Content Scripts**: Injected into web pages
- **Popup**: User interface
- **Options**: Settings page

#### Data Storage
- **Local**: `chrome.storage.local` - Extension settings, cached data
- **Sync**: `chrome.storage.sync` - User preferences across devices
- **Backend**: API calls to SFG backend for persistent data

#### API Integration Points
```typescript
interface ExtensionAPI {
  bookmarks: {
    sync: () => Promise<Bookmark[]>;
    organize: (bookmarks: Bookmark[]) => Promise<OrganizeResult>;
    export: (format: 'html' | 'json') => Promise<string>;
  };
  ai: {
    processText: (text: string, action: AIAction) => Promise<string>;
    generatePrompt: (context: string) => Promise<string>;
    analyzeDocument: (url: string) => Promise<DocumentAnalysis>;
  };
  passwords: {
    generate: (options: PasswordOptions) => string;
    store: (service: string, credentials: Credentials) => Promise<void>;
    retrieve: (service: string) => Promise<Credentials>;
  };
}
```

#### Backend API Endpoints
- **Base**: `https://sfg-chrome.abacusai.app/api`
- **Bookmarks**: 
  - `POST /bookmarks/sync` - Sync bookmarks
  - `GET /bookmarks/export` - Export bookmarks
- **AI Processing**:
  - `POST /ai/process` - Process text with AI
  - `POST /ai/prompt` - Generate AI prompts
- **User Data**:
  - `GET /user/profile` - Get user profile
  - `PUT /user/settings` - Update settings

#### Environment Variables Required
```bash
EXTENSION_ID=
EXTENSION_VERSION=
API_BASE_URL=https://sfg-chrome.abacusai.app/api
ABACUSAI_API_KEY=
```

---

### 2.2 SFG MARKETING WEBSITE

**Application**: SFG Chrome Extension Marketing Site  
**Status**: PRODUCTION - Active  
**Deployment**: https://sfg-chrome.abacusai.app

#### Base URLs
- **Production**: `https://sfg-chrome.abacusai.app`
- **Development**: `http://localhost:3000`

#### Features
- Chrome extension showcase
- AI-AutoStack partnership section
- Mobile notes organization section
- App ecosystem dashboard
- Features, pricing, and contact sections
- Generic App Ecosystem API

#### API Endpoints
- **App Invitation**: `POST /api/app-invitation` - Third-party app integration requests
- **Authentication**:
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/signin` - User login
  - `GET /api/auth/session` - Check session
  - `GET /api/auth/csrf` - Get CSRF token

#### Database Schema (PostgreSQL + Prisma)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AppInvitation {
  id          String   @id @default(cuid())
  appName     String
  companyName String
  email       String
  description String
  status      String   @default("pending")
  createdAt   DateTime @default(now())
}
```

#### Environment Variables
```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://sfg-chrome.abacusai.app
APP_VERSION=v1.0.x
```

---

### 2.3 AI-AUTOSTACK PARTNERSHIP

**Application**: AI-AutoStack Workflow Automation  
**Status**: PARTNERSHIP - Cross-Promotion  
**Deployment**: https://Ai-AutoStack.abacusai.app

#### Partnership Type
- **NOT a technical integration**
- **Advertising and cross-promotion partnership**
- **Mutual ecosystem benefits**
- **Separate microfrontend section on marketing site**

#### AI-AutoStack Capabilities (for reference)
- Smart Inventory Systems (40% waste reduction)
- AI Customer Support (85% inquiry automation)
- AI Project Tracking
- Rapid development (7-day deployment)

#### Pricing Structure
| Tier | Features | Monthly Cost |
|------|----------|--------------|
| Starter | Google Workspace automation | £99 / $125 / AED 460 |
| Professional | AI + Database integration | £499 / $635 / AED 2,300 |
| Enterprise | Full Abacus.ai platform | £699 / $890 / AED 3,220 |
| Project-Based | Custom AI builds | £500+ per component |

#### Integration Potential (if pursued in future)
```typescript
interface AIAutoStackIntegration {
  workflows: {
    create: (workflow: WorkflowDefinition) => Promise<Workflow>;
    trigger: (workflowId: string, data: any) => Promise<WorkflowExecution>;
    status: (executionId: string) => Promise<WorkflowStatus>;
  };
  automation: {
    processData: (data: any) => Promise<ProcessResult>;
    analyzeContent: (content: string) => Promise<Analysis>;
  };
}
```

---

## 3. GOVERNMENT & COMPLIANCE SYSTEMS

### 3.1 COMPANIES HOUSE

**Application**: UK Companies House  
**Status**: PRODUCTION - Active  
**API**: Available

#### Base URLs
- **Portal**: `https://wck2.companieshouse.gov.uk`
- **API**: `https://api.company-information.service.gov.uk`

#### Authentication Method
- **Type**: API Key
- **Status**: **ALREADY CONFIGURED** ✅
- **Secret Location**: `/home/ubuntu/.config/abacusai_auth_secrets.json`
- **Secret Structure**:
```json
{
  "companies house": {
    "secrets": {
      "api_key": {
        "value": "actual_api_key_value"
      }
    }
  }
}
```

#### API Endpoints
- **Company Search**: `GET /search/companies?q={query}`
- **Company Profile**: `GET /company/{company_number}`
- **Officers**: `GET /company/{company_number}/officers`
- **Filing History**: `GET /company/{company_number}/filing-history`

#### Rate Limits
- **Standard**: 600 requests per 5 minutes

#### Use Cases
- Verify customer company details
- Check company status before extending credit
- Validate supplier information

---

### 3.2 HMRC & GOV.UK SYSTEMS

**Systems**: Various UK Government Services  
**Status**: PRODUCTION - Manual Access

#### Key Systems Used
- **HMRC VAT Online**: `https://www.gov.uk/vat-online-services-vat-online-account/sign-in`
- **Companies House**: See section 3.1
- **Construction Line**: `https://www.constructionline.co.uk`
- **HSE (Health & Safety Executive)**: `https://www.hse.gov.uk`

#### Authentication
- **Type**: Government Gateway ID + Password
- **MFA**: Required for most services
- **Access Level**: Per staff member based on role

---

### 3.3 SSIP & SAFETY SCHEMES

**Application**: SSIP Certification & Safety Management  
**Status**: PRODUCTION - Active

#### Systems
- **SSIP Portal**: `https://ssip.org.uk`
- **SafeContractor**: `https://www.safecontractor.com`
- **CHAS**: `https://www.chas.co.uk`

#### Purpose
- Health & safety certification
- Contractor pre-qualification
- Compliance documentation

---

## 4. COMMUNICATION SYSTEMS

### 4.1 TWILIO (SMS/VOICE)

**Application**: Twilio Communications  
**Status**: CONFIGURED - Ready to Use  
**API**: Active

#### Authentication Method
- **Type**: Account SID + Auth Token
- **Status**: **ALREADY CONFIGURED** ✅
- **Secret Location**: `/home/ubuntu/.config/abacusai_auth_secrets.json`
- **Secret Structure**:
```json
{
  "twilio": {
    "secrets": {
      "account_sid": {
        "value": "actual_account_sid_value"
      },
      "auth_token": {
        "value": "actual_auth_token_value"
      }
    }
  }
}
```

#### Base URLs
- **API**: `https://api.twilio.com/2010-04-01`
- **Messaging**: `https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json`

#### Use Cases
- SMS notifications for quotes and orders
- Customer appointment reminders
- Staff emergency alerts
- Two-factor authentication

---

### 4.2 RINGCENTRAL

**Application**: RingCentral VoIP & Messaging  
**Status**: PRODUCTION - Active

#### Base URLs
- **UK Portal**: `https://service.ringcentral.co.uk`
- **US Portal**: `https://service.ringcentral.com`

#### Features
- Business phone system
- Call routing and forwarding
- Voicemail to email
- Team messaging

---

## 5. PROJECT & SITE MANAGEMENT SYSTEMS

### 5.1 CONTRACTOR TRACKING SYSTEMS

**Systems**: Various site-specific contractor portals  
**Status**: PRODUCTION - Active per site

#### Sites Managed
- **INTU Sites**: `https://intu.ctracker.co.uk`
- **Trafford Centre**: `https://traffordcentre.ctracker.co.uk`
- **Derby Shopping Centre**: `https://derbyshoppingcentre.ctracker.co.uk`
- **Merryhill**: `https://merryhillshoppingcentre.ctracker.co.uk`
- **Broadway Bradford**: `https://broadway.ctracker.co.uk`
- **Landsec Portal**: `https://landlink.landsec.com`
- **Mace SCM**: `https://scm.macegroup.com`
- **RiskWise (S2 Partnership)**: `https://new.s2riskwise.com`

#### Common Features
- Site induction management
- Permit to work systems
- Contractor compliance tracking
- Insurance and certification verification

---

### 5.2 BIGCHANGE JOBWATCH

**Application**: BigChange Job Management  
**Status**: PRODUCTION - Active

#### Base URLs
- **Client Portal**: `https://clients.bigchangeapps.com`
- **Visitor Portal**: `https://visitor.bigchangeapps.com`
- **Main Site**: `https://www.bigchangeapps.com`

#### Features
- Mobile workforce management
- Job scheduling and dispatch
- Live tracking
- Digital forms and checklists
- Time tracking

---

## 6. SFG COMPLETE SYSTEM - CORE ARCHITECTURE

### 6.1 BASE NUMBER MANAGEMENT SYSTEM

**Component**: Central Base Number Generator  
**Status**: TO BE IMPLEMENTED  
**Purpose**: Immutable unique identifier for all business documents

#### Base Number Schema
```typescript
interface BaseNumber {
  id: string; // UUID
  baseNumber: string; // Immutable, sequential (e.g., "BASE-2025-00001")
  createdDate: Date;
  createdBy: {
    staffId: string;
    staffName: string;
    staffTier: StaffTier;
  };
  status: 'ACTIVE' | 'VOIDED' | 'ARCHIVED';
  documentType: DocumentType;
  currentStage: DocumentStage;
  currentPrefix: DocumentPrefix;
  auditTrail: BaseNumberAuditEntry[];
}

interface BaseNumberAuditEntry {
  timestamp: Date;
  action: 'CREATED' | 'STAGE_ADVANCED' | 'PREFIX_CHANGED' | 'VOIDED';
  performedBy: string;
  fromStage?: DocumentStage;
  toStage?: DocumentStage;
  fromPrefix?: DocumentPrefix;
  toPrefix?: DocumentPrefix;
  notes?: string;
}

type DocumentType = 
  | 'ENQUIRY' 
  | 'QUOTE' 
  | 'ORDER' 
  | 'INVOICE' 
  | 'DELIVERY' 
  | 'PAYMENT';

type DocumentStage = 
  | 'ENQUIRY_RECEIVED' 
  | 'QUOTE_PREPARED' 
  | 'QUOTE_SENT' 
  | 'ORDER_CONFIRMED' 
  | 'PRODUCTION_SCHEDULED' 
  | 'IN_PRODUCTION' 
  | 'READY_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'INVOICED' 
  | 'PAYMENT_RECEIVED' 
  | 'COMPLETED';

type DocumentPrefix = 
  | 'ENQ' 
  | 'QUO' 
  | 'INV' 
  | 'PO' 
  | 'DEL' 
  | 'PAID';
```

#### API Endpoints
**Base URL**: `https://sfg-api.abacusai.app/v1` (to be deployed)

##### Base Number Management
```
POST   /base-numbers/generate
GET    /base-numbers/{baseNumber}
GET    /base-numbers/{baseNumber}/history
POST   /base-numbers/{baseNumber}/validate
PUT    /base-numbers/{baseNumber}/void
```

**Generate Base Number Request**:
```json
{
  "documentType": "ENQUIRY",
  "staffId": "staff_12345",
  "initialPrefix": "ENQ",
  "metadata": {
    "customerName": "Example Ltd",
    "projectDescription": "Aluminium shopfront installation"
  }
}
```

**Generate Base Number Response**:
```json
{
  "baseNumber": "BASE-2025-00042",
  "fullReference": "ENQ-BASE-2025-00042",
  "documentType": "ENQUIRY",
  "currentStage": "ENQUIRY_RECEIVED",
  "currentPrefix": "ENQ",
  "createdDate": "2025-10-30T14:30:00Z",
  "createdBy": {
    "staffId": "staff_12345",
    "staffName": "Warren Heathcote",
    "staffTier": "MANAGER"
  }
}
```

---

### 6.2 DOCUMENT LIFECYCLE MANAGEMENT

#### Document Prefix System

| Prefix | Stage | Description | Typical Duration |
|--------|-------|-------------|------------------|
| **ENQ** | Enquiry | Initial customer inquiry received | 1-3 days |
| **QUO** | Quote | Quote prepared and sent to customer | 3-14 days |
| **PO** | Purchase Order | Customer order confirmed | Immediate |
| **PROD** | Production | Item in production | 5-21 days |
| **DEL** | Delivery | Delivered to customer | 1 day |
| **INV** | Invoice | Invoice generated and sent | Immediate |
| **PAID** | Payment | Payment received and reconciled | 30-60 days |

#### Workflow State Machine
```typescript
interface DocumentLifecycle {
  baseNumber: string;
  currentStage: DocumentStage;
  stageHistory: StageTransition[];
  allowedTransitions: DocumentStage[];
}

interface StageTransition {
  fromStage: DocumentStage;
  toStage: DocumentStage;
  timestamp: Date;
  performedBy: {
    staffId: string;
    staffName: string;
    staffTier: StaffTier;
  };
  notes?: string;
  attachments?: string[];
}

// Allowed Transitions (State Machine Rules)
const STAGE_TRANSITIONS: Record<DocumentStage, DocumentStage[]> = {
  ENQUIRY_RECEIVED: ['QUOTE_PREPARED'],
  QUOTE_PREPARED: ['QUOTE_SENT'],
  QUOTE_SENT: ['ORDER_CONFIRMED', 'ENQUIRY_RECEIVED'], // Can go back to inquiry or forward to order
  ORDER_CONFIRMED: ['PRODUCTION_SCHEDULED'],
  PRODUCTION_SCHEDULED: ['IN_PRODUCTION'],
  IN_PRODUCTION: ['READY_FOR_DELIVERY'],
  READY_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: ['INVOICED'],
  INVOICED: ['PAYMENT_RECEIVED'],
  PAYMENT_RECEIVED: ['COMPLETED'],
  COMPLETED: [] // Terminal state
};
```

#### API Endpoints
```
POST   /documents/{baseNumber}/advance-stage
GET    /documents/{baseNumber}/lifecycle
GET    /documents/{baseNumber}/audit-trail
PUT    /documents/{baseNumber}/update-prefix
```

**Advance Stage Request**:
```json
{
  "toStage": "QUOTE_PREPARED",
  "performedBy": "staff_12345",
  "notes": "Quote prepared with 15% discount for repeat customer",
  "attachments": [
    "https://sharepoint.sfg.com/quotes/QUO-BASE-2025-00042.pdf"
  ]
}
```

---

### 6.3 CUSTOMER & CONTACT MANAGEMENT

#### Customer Tier System

```typescript
enum CustomerTier {
  TIER_1_VIP = 'TIER_1_VIP',           // VIP - Immediate net 7 days
  TIER_2_PREFERRED = 'TIER_2_PREFERRED', // Preferred - Net 14 days
  TIER_3_STANDARD = 'TIER_3_STANDARD',   // Standard - Net 30 days
  TIER_4_NEW = 'TIER_4_NEW',           // New - Payment upfront or COD
  TIER_5_WATCH = 'TIER_5_WATCH'        // Watch - Payment upfront only
}

interface Customer {
  customerId: string;
  customerNumber: string; // e.g., "CUST-00123"
  
  // Basic Information
  companyName: string;
  tradingName?: string;
  companyNumber?: string; // Companies House registration
  vatNumber?: string;
  
  // Contact Information
  primaryContact: Contact;
  additionalContacts: Contact[];
  
  // Address Information
  registeredAddress: Address;
  tradingAddress?: Address;
  deliveryAddresses: Address[];
  
  // Financial Information
  tier: CustomerTier;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string; // e.g., "NET30", "NET14", "COD"
  discountRate: number; // Percentage
  
  // Integration References
  xeroContactId?: string;
  timeFinanceAccountId?: string;
  companiesHouseNumber?: string;
  
  // Status & Dates
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLACKLISTED';
  accountOpenedDate: Date;
  lastOrderDate?: Date;
  lastPaymentDate?: Date;
  
  // Metadata
  notes?: string;
  tags: string[];
  assignedSalesRep?: string;
}

interface Contact {
  contactId: string;
  title?: string;
  firstName: string;
  lastName: string;
  position?: string;
  department?: string;
  
  // Contact Methods
  email: string;
  phone?: string;
  mobile?: string;
  whatsapp?: string; // For WhatsApp Business integration
  
  // Preferences
  preferredContactMethod: 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'SMS';
  canReceiveMarketing: boolean;
  canApproveOrders: boolean;
}

interface Address {
  addressId: string;
  type: 'REGISTERED' | 'TRADING' | 'DELIVERY' | 'BILLING';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  deliveryInstructions?: string;
}
```

#### Customer Tier Calculation Logic

```typescript
interface TierCalculationFactors {
  totalLifetimeValue: number;      // Total revenue from customer
  averageOrderValue: number;       // Average per order
  orderFrequency: number;          // Orders per month
  paymentHistory: number;          // 0-100 score based on timely payments
  daysPaymentOverdue: number;      // Current days overdue
  creditRating?: string;           // From Time Finance or credit bureau
  yearsAsCustomer: number;         // Tenure
  industryCategory: string;        // e.g., "CONSTRUCTION", "RETAIL"
}

function calculateCustomerTier(factors: TierCalculationFactors): CustomerTier {
  let score = 0;
  
  // Lifetime Value (30% weight)
  if (factors.totalLifetimeValue > 100000) score += 30;
  else if (factors.totalLifetimeValue > 50000) score += 20;
  else if (factors.totalLifetimeValue > 10000) score += 10;
  
  // Payment History (30% weight)
  score += (factors.paymentHistory / 100) * 30;
  
  // Order Frequency (20% weight)
  if (factors.orderFrequency > 4) score += 20;
  else if (factors.orderFrequency > 2) score += 10;
  else if (factors.orderFrequency > 0.5) score += 5;
  
  // Tenure (10% weight)
  if (factors.yearsAsCustomer > 3) score += 10;
  else if (factors.yearsAsCustomer > 1) score += 5;
  
  // Average Order Value (10% weight)
  if (factors.averageOrderValue > 5000) score += 10;
  else if (factors.averageOrderValue > 1000) score += 5;
  
  // Penalty for overdue payments
  if (factors.daysPaymentOverdue > 60) score -= 20;
  else if (factors.daysPaymentOverdue > 30) score -= 10;
  else if (factors.daysPaymentOverdue > 14) score -= 5;
  
  // Determine tier based on score
  if (score >= 80) return CustomerTier.TIER_1_VIP;
  if (score >= 60) return CustomerTier.TIER_2_PREFERRED;
  if (score >= 40) return CustomerTier.TIER_3_STANDARD;
  if (score >= 20) return CustomerTier.TIER_4_NEW;
  return CustomerTier.TIER_5_WATCH;
}
```

#### API Endpoints
```
POST   /customers
GET    /customers
GET    /customers/{customerId}
PUT    /customers/{customerId}
GET    /customers/{customerId}/tier
POST   /customers/{customerId}/calculate-tier
PUT    /customers/{customerId}/tier
GET    /customers/{customerId}/payment-terms
GET    /customers/{customerId}/credit-limit
POST   /customers/{customerId}/contacts
```

---

### 6.4 STAFF MEMBER & PERMISSIONS SYSTEM

#### Staff Tier Structure

```typescript
enum StaffTier {
  DIRECTOR = 'DIRECTOR',               // Full system access
  MANAGER = 'MANAGER',                 // Department management
  SUPERVISOR = 'SUPERVISOR',           // Team supervision
  SENIOR_STAFF = 'SENIOR_STAFF',       // Experienced staff member
  STAFF = 'STAFF',                     // Standard staff
  TRAINEE = 'TRAINEE'                  // Limited access
}

enum Department {
  SALES = 'SALES',
  PRODUCTION = 'PRODUCTION',
  ESTIMATING = 'ESTIMATING',
  ACCOUNTS = 'ACCOUNTS',
  ADMIN = 'ADMIN',
  TECHNICAL = 'TECHNICAL',
  WAREHOUSE = 'WAREHOUSE',
  INSTALLATION = 'INSTALLATION'
}

interface StaffMember {
  staffId: string;
  staffNumber: string; // e.g., "STAFF-00042"
  
  // Personal Information
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  mobile?: string;
  
  // Employment Information
  tier: StaffTier;
  department: Department;
  position: string;
  lineManager?: string; // staffId of manager
  employmentStartDate: Date;
  employmentStatus: 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED';
  
  // Permissions
  permissions: StaffPermission[];
  quotingLimit?: number; // Max quote value staff can approve
  purchaseLimit?: number; // Max purchase value staff can authorize
  
  // Integration References
  m365UserId?: string; // Microsoft 365 User ID
  xeroUserId?: string; // Xero user reference
  
  // Metadata
  notes?: string;
  lastLoginDate?: Date;
}

interface StaffPermission {
  resource: string; // e.g., "QUOTES", "INVOICES", "CUSTOMERS"
  actions: PermissionAction[]; // ['READ', 'WRITE', 'DELETE']
  scope: 'OWN' | 'DEPARTMENT' | 'ALL'; // Can access own, department, or all records
}

type PermissionAction = 'READ' | 'WRITE' | 'DELETE' | 'APPROVE' | 'VOID';

// Permission Matrix by Staff Tier
const TIER_PERMISSIONS: Record<StaffTier, StaffPermission[]> = {
  DIRECTOR: [
    { resource: '*', actions: ['READ', 'WRITE', 'DELETE', 'APPROVE', 'VOID'], scope: 'ALL' }
  ],
  MANAGER: [
    { resource: 'QUOTES', actions: ['READ', 'WRITE', 'APPROVE'], scope: 'DEPARTMENT' },
    { resource: 'CUSTOMERS', actions: ['READ', 'WRITE'], scope: 'DEPARTMENT' },
    { resource: 'STAFF', actions: ['READ'], scope: 'DEPARTMENT' },
    { resource: 'REPORTS', actions: ['READ'], scope: 'DEPARTMENT' }
  ],
  SUPERVISOR: [
    { resource: 'QUOTES', actions: ['READ', 'WRITE'], scope: 'DEPARTMENT' },
    { resource: 'CUSTOMERS', actions: ['READ', 'WRITE'], scope: 'DEPARTMENT' },
    { resource: 'STAFF', actions: ['READ'], scope: 'DEPARTMENT' }
  ],
  SENIOR_STAFF: [
    { resource: 'QUOTES', actions: ['READ', 'WRITE'], scope: 'OWN' },
    { resource: 'CUSTOMERS', actions: ['READ', 'WRITE'], scope: 'OWN' }
  ],
  STAFF: [
    { resource: 'QUOTES', actions: ['READ', 'WRITE'], scope: 'OWN' },
    { resource: 'CUSTOMERS', actions: ['READ'], scope: 'OWN' }
  ],
  TRAINEE: [
    { resource: 'QUOTES', actions: ['READ'], scope: 'OWN' },
    { resource: 'CUSTOMERS', actions: ['READ'], scope: 'OWN' }
  ]
};

// Quoting Limits by Tier
const QUOTING_LIMITS: Record<StaffTier, number> = {
  DIRECTOR: Infinity,
  MANAGER: 50000,
  SUPERVISOR: 25000,
  SENIOR_STAFF: 10000,
  STAFF: 5000,
  TRAINEE: 1000
};
```

#### API Endpoints
```
POST   /staff
GET    /staff
GET    /staff/{staffId}
PUT    /staff/{staffId}
GET    /staff/{staffId}/permissions
POST   /staff/{staffId}/permissions/check
GET    /staff/{staffId}/quoting-limit
```

**Permission Check Request**:
```json
{
  "resource": "QUOTES",
  "action": "APPROVE",
  "recordId": "QUO-BASE-2025-00042",
  "staffId": "staff_12345"
}
```

**Permission Check Response**:
```json
{
  "allowed": true,
  "reason": "Staff tier MANAGER has APPROVE permission for QUOTES with DEPARTMENT scope",
  "additionalChecks": {
    "quotingLimitCheck": {
      "quoteValue": 15000,
      "staffLimit": 50000,
      "withinLimit": true
    }
  }
}
```

---

### 6.5 WORKFLOW ORCHESTRATION

#### Complete Workflow Example: Enquiry to Payment

```typescript
interface WorkflowDefinition {
  workflowId: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

interface WorkflowStep {
  stepId: string;
  stepName: string;
  stage: DocumentStage;
  requiredActions: WorkflowAction[];
  requiredPermissions: StaffPermission[];
  automationRules?: AutomationRule[];
  notificationRules?: NotificationRule[];
  slaHours?: number; // Service Level Agreement time limit
}

interface WorkflowAction {
  actionType: 'MANUAL' | 'AUTOMATED' | 'APPROVAL_REQUIRED';
  description: string;
  responsibleRole?: StaffTier | Department;
}

// Example: Complete Aluminium Order Workflow
const ALUMINIUM_ORDER_WORKFLOW: WorkflowDefinition = {
  workflowId: 'WF-ALUMINIUM-ORDER',
  name: 'Aluminium Order Processing',
  description: 'End-to-end workflow from customer enquiry to payment',
  steps: [
    {
      stepId: 'STEP-1',
      stepName: 'Enquiry Received',
      stage: 'ENQUIRY_RECEIVED',
      requiredActions: [
        {
          actionType: 'MANUAL',
          description: 'Log customer enquiry details',
          responsibleRole: Department.SALES
        },
        {
          actionType: 'AUTOMATED',
          description: 'Generate base number with ENQ prefix'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Create customer record if new'
        }
      ],
      requiredPermissions: [
        { resource: 'ENQUIRIES', actions: ['WRITE'], scope: 'OWN' }
      ],
      automationRules: [
        {
          condition: 'enquiry_source == "website"',
          action: 'send_email',
          target: 'sales@shopfrontgroup.co.uk'
        }
      ],
      slaHours: 4 // Respond within 4 hours
    },
    {
      stepId: 'STEP-2',
      stepName: 'Site Survey Scheduled',
      stage: 'ENQUIRY_RECEIVED',
      requiredActions: [
        {
          actionType: 'MANUAL',
          description: 'Schedule site visit',
          responsibleRole: Department.SALES
        },
        {
          actionType: 'AUTOMATED',
          description: 'Send calendar invite to customer'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Send SMS reminder 24 hours before'
        }
      ],
      slaHours: 48
    },
    {
      stepId: 'STEP-3',
      stepName: 'Measurements & Specifications Captured',
      stage: 'ENQUIRY_RECEIVED',
      requiredActions: [
        {
          actionType: 'MANUAL',
          description: 'Conduct site survey and capture measurements',
          responsibleRole: Department.TECHNICAL
        },
        {
          actionType: 'MANUAL',
          description: 'Upload site photos to SharePoint'
        },
        {
          actionType: 'MANUAL',
          description: 'Create technical specification document'
        }
      ],
      slaHours: 1 // Complete within 1 hour of site visit
    },
    {
      stepId: 'STEP-4',
      stepName: 'Quote Preparation',
      stage: 'QUOTE_PREPARED',
      requiredActions: [
        {
          actionType: 'MANUAL',
          description: 'Generate pricing from Logikal',
          responsibleRole: Department.ESTIMATING
        },
        {
          actionType: 'AUTOMATED',
          description: 'Calculate customer discount based on tier'
        },
        {
          actionType: 'MANUAL',
          description: 'Review and adjust quote',
          responsibleRole: Department.ESTIMATING
        },
        {
          actionType: 'APPROVAL_REQUIRED',
          description: 'Manager approval if quote exceeds quoting limit'
        }
      ],
      automationRules: [
        {
          condition: 'quote_value > staff_quoting_limit',
          action: 'request_approval',
          target: 'line_manager'
        }
      ],
      notificationRules: [
        {
          event: 'quote_prepared',
          recipients: ['sales_rep', 'customer'],
          template: 'quote_ready_notification'
        }
      ],
      slaHours: 24
    },
    {
      stepId: 'STEP-5',
      stepName: 'Quote Sent to Customer',
      stage: 'QUOTE_SENT',
      requiredActions: [
        {
          actionType: 'AUTOMATED',
          description: 'Update base number prefix to QUO'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Email quote PDF to customer'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Log in CRM'
        }
      ],
      automationRules: [
        {
          condition: 'no_response_after_7_days',
          action: 'send_follow_up_email',
          target: 'customer'
        }
      ],
      slaHours: 1
    },
    {
      stepId: 'STEP-6',
      stepName: 'Order Confirmed',
      stage: 'ORDER_CONFIRMED',
      requiredActions: [
        {
          actionType: 'MANUAL',
          description: 'Receive customer purchase order',
          responsibleRole: Department.SALES
        },
        {
          actionType: 'AUTOMATED',
          description: 'Update base number prefix to PO'
        },
        {
          actionType: 'MANUAL',
          description: 'Check customer credit limit',
          responsibleRole: Department.ACCOUNTS
        },
        {
          actionType: 'APPROVAL_REQUIRED',
          description: 'Credit approval if order exceeds available credit'
        }
      ],
      automationRules: [
        {
          condition: 'customer_tier == TIER_4_NEW || customer_tier == TIER_5_WATCH',
          action: 'request_payment_upfront',
          target: 'customer'
        },
        {
          condition: 'order_value > credit_limit',
          action: 'request_credit_approval',
          target: 'financial_controller'
        }
      ],
      notificationRules: [
        {
          event: 'order_confirmed',
          recipients: ['customer', 'production_manager', 'sales_rep'],
          template: 'order_confirmation'
        }
      ],
      slaHours: 2
    },
    {
      stepId: 'STEP-7',
      stepName: 'Production Scheduled',
      stage: 'PRODUCTION_SCHEDULED',
      requiredActions: [
        {
          actionType: 'MANUAL',
          description: 'Schedule production slot',
          responsibleRole: Department.PRODUCTION
        },
        {
          actionType: 'MANUAL',
          description: 'Order materials from suppliers'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Generate production work order'
        }
      ],
      notificationRules: [
        {
          event: 'production_scheduled',
          recipients: ['customer', 'production_team'],
          template: 'production_scheduled'
        }
      ],
      slaHours: 48
    },
    {
      stepId: 'STEP-8',
      stepName: 'In Production',
      stage: 'IN_PRODUCTION',
      requiredActions: [
        {
          actionType: 'MANUAL',
          description: 'Fabricate aluminium components',
          responsibleRole: Department.PRODUCTION
        },
        {
          actionType: 'MANUAL',
          description: 'Quality control checks'
        },
        {
          actionType: 'MANUAL',
          description: 'Update production status in system'
        }
      ],
      automationRules: [
        {
          condition: 'production_milestone_reached',
          action: 'send_progress_update',
          target: 'customer'
        }
      ],
      slaHours: 120 // 5 working days typical
    },
    {
      stepId: 'STEP-9',
      stepName: 'Ready for Delivery',
      stage: 'READY_FOR_DELIVERY',
      requiredActions: [
        {
          actionType: 'MANUAL',
          description: 'Final quality inspection',
          responsibleRole: Department.PRODUCTION
        },
        {
          actionType: 'MANUAL',
          description: 'Schedule delivery with customer',
          responsibleRole: Department.SALES
        },
        {
          actionType: 'AUTOMATED',
          description: 'Send delivery confirmation SMS'
        }
      ],
      notificationRules: [
        {
          event: 'ready_for_delivery',
          recipients: ['customer', 'installation_team'],
          template: 'delivery_scheduling'
        }
      ],
      slaHours: 24
    },
    {
      stepId: 'STEP-10',
      stepName: 'Delivered & Installed',
      stage: 'DELIVERED',
      requiredActions: [
        {
          actionType: 'MANUAL',
          description: 'Deliver and install at customer site',
          responsibleRole: Department.INSTALLATION
        },
        {
          actionType: 'MANUAL',
          description: 'Customer sign-off on delivery note'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Update base number prefix to DEL'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Upload signed delivery note to SharePoint'
        }
      ],
      automationRules: [
        {
          condition: 'delivery_completed',
          action: 'trigger_invoice_generation',
          target: 'accounts_department'
        }
      ],
      notificationRules: [
        {
          event: 'delivery_completed',
          recipients: ['customer', 'accounts', 'sales_rep'],
          template: 'delivery_confirmation'
        }
      ],
      slaHours: 8
    },
    {
      stepId: 'STEP-11',
      stepName: 'Invoice Generated',
      stage: 'INVOICED',
      requiredActions: [
        {
          actionType: 'AUTOMATED',
          description: 'Generate invoice in Xero based on quote and delivery'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Update base number prefix to INV'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Email invoice to customer'
        },
        {
          actionType: 'MANUAL',
          description: 'Review and approve invoice',
          responsibleRole: Department.ACCOUNTS
        }
      ],
      automationRules: [
        {
          condition: 'invoice_generated',
          action: 'sync_to_xero',
          target: 'xero_api'
        }
      ],
      slaHours: 2
    },
    {
      stepId: 'STEP-12',
      stepName: 'Payment Received',
      stage: 'PAYMENT_RECEIVED',
      requiredActions: [
        {
          actionType: 'AUTOMATED',
          description: 'Detect payment in Xero via webhook'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Update base number prefix to PAID'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Reconcile payment against invoice'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Update customer balance'
        }
      ],
      automationRules: [
        {
          condition: 'payment_overdue_14_days',
          action: 'send_payment_reminder',
          target: 'customer'
        },
        {
          condition: 'payment_overdue_30_days',
          action: 'escalate_to_debt_collection',
          target: 'financial_controller'
        }
      ],
      notificationRules: [
        {
          event: 'payment_received',
          recipients: ['customer', 'accounts', 'sales_rep'],
          template: 'payment_confirmation'
        }
      ],
      slaHours: null // Based on customer payment terms
    },
    {
      stepId: 'STEP-13',
      stepName: 'Order Completed',
      stage: 'COMPLETED',
      requiredActions: [
        {
          actionType: 'AUTOMATED',
          description: 'Archive all documents to SharePoint'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Update customer tier based on completed order'
        },
        {
          actionType: 'AUTOMATED',
          description: 'Send customer satisfaction survey'
        },
        {
          actionType: 'MANUAL',
          description: 'Final review and close workflow',
          responsibleRole: Department.ACCOUNTS
        }
      ],
      notificationRules: [
        {
          event: 'order_completed',
          recipients: ['sales_rep', 'manager'],
          template: 'order_closure'
        }
      ],
      slaHours: 24
    }
  ]
};
```

#### API Endpoints
```
POST   /workflows/{baseNumber}/start
POST   /workflows/{baseNumber}/advance
GET    /workflows/{baseNumber}/status
GET    /workflows/{baseNumber}/history
PUT    /workflows/{baseNumber}/override
```

**Start Workflow Request**:
```json
{
  "workflowType": "ALUMINIUM_ORDER",
  "customerId": "CUST-00123",
  "staffId": "staff_12345",
  "initialData": {
    "customerName": "Example Construction Ltd",
    "projectDescription": "Aluminium shopfront - 3m x 2.5m",
    "enquirySource": "website",
    "urgency": "STANDARD"
  }
}
```

**Start Workflow Response**:
```json
{
  "baseNumber": "BASE-2025-00043",
  "fullReference": "ENQ-BASE-2025-00043",
  "workflowId": "WF-ALUMINIUM-ORDER",
  "currentStage": "ENQUIRY_RECEIVED",
  "currentStep": "STEP-1",
  "nextActions": [
    {
      "description": "Log customer enquiry details",
      "responsibleRole": "SALES",
      "deadline": "2025-10-30T18:30:00Z"
    }
  ],
  "automationsTriggered": [
    "Base number generated with ENQ prefix",
    "Email sent to sales@shopfrontgroup.co.uk"
  ]
}
```

---

### 6.6 APPLICATION REGISTRY & HEALTH MONITORING

#### Application Registration Schema

```typescript
interface ApplicationMetadata {
  appId: string;
  appName: string;
  appDescription: string;
  version: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'DEPRECATED' | 'OFFLINE';
  
  // Deployment Information
  deploymentEnvironment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
  baseUrls: {
    production?: string;
    staging?: string;
    development?: string;
  };
  
  // API Information
  apiEndpoints: APIEndpoint[];
  authentication: AuthenticationConfig;
  
  // Data Ownership
  ownedEntities: string[]; // e.g., ["Customer", "Invoice", "Quote"]
  schemas: Record<string, any>; // TypeScript interfaces or JSON schemas
  
  // Integration Points
  webhooksReceived: WebhookConfig[];
  webhooksSent: WebhookConfig[];
  eventsPublished: EventConfig[];
  eventsSubscribed: EventConfig[];
  
  // MCP/AgentPass
  mcpServers?: MCPServerConfig[];
  
  // Operational
  rateLimits: RateLimitConfig;
  healthCheckEndpoint: string;
  monitoringEndpoints: string[];
  documentationUrl: string;
  
  // Governance
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  complianceRequirements: string[]; // e.g., ["GDPR", "PCI-DSS"]
  ownerTeam: string;
  technicalContact: string;
}

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authentication: 'REQUIRED' | 'OPTIONAL' | 'PUBLIC';
  rateLimit?: number;
  requestSchema?: any;
  responseSchema?: any;
}

interface WebhookConfig {
  endpoint: string;
  eventTypes: string[];
  payloadSchema: any;
  retryPolicy?: {
    maxRetries: number;
    backoffStrategy: 'LINEAR' | 'EXPONENTIAL';
  };
}

interface EventConfig {
  eventType: string;
  description: string;
  payloadSchema: any;
  frequency: 'REAL_TIME' | 'BATCH' | 'SCHEDULED';
}

interface MCPServerConfig {
  serverName: string;
  serverUrl: string;
  tools: string[];
  authentication: AuthenticationConfig;
  documentation: string;
}
```

#### API Endpoints
```
POST   /registry/applications
GET    /registry/applications
GET    /registry/applications/{appId}
PUT    /registry/applications/{appId}
GET    /registry/applications/{appId}/health
POST   /registry/applications/{appId}/webhooks/register
```

**Health Check Response**:
```json
{
  "appId": "XERO_INTEGRATION",
  "status": "HEALTHY",
  "timestamp": "2025-10-30T14:30:00Z",
  "checks": [
    {
      "name": "API_CONNECTIVITY",
      "status": "PASS",
      "responseTime": 142
    },
    {
      "name": "OAUTH_TOKEN_VALID",
      "status": "PASS",
      "expiresIn": 3600
    },
    {
      "name": "WEBHOOK_LISTENER",
      "status": "PASS"
    }
  ],
  "metrics": {
    "requestsLast24h": 3421,
    "errorsLast24h": 7,
    "averageResponseTime": 156
  }
}
```

---

## 7. COMPANY PROCEDURES & TASK LOGIC

### 7.1 CUSTOMER ONBOARDING PROCEDURE

**Procedure ID**: PROC-CUST-001  
**Responsible**: Sales Department

#### Steps
1. **Initial Contact** (Sales)
   - Receive customer enquiry via phone, email, or website
   - Log in CRM system
   - Generate base number with ENQ prefix
   - Assign to sales representative

2. **Customer Information Collection** (Sales)
   - Company name and registration number
   - Contact details (primary + secondary)
   - Business address
   - VAT number
   - Request trade references

3. **Credit Check** (Accounts)
   - Search Companies House for company details
   - Check credit rating (Creditsafe or similar)
   - Review trade references
   - Determine initial customer tier

4. **Account Setup** (Accounts)
   - Create customer record in system
   - Set payment terms based on tier
   - Set credit limit
   - Create customer in Xero
   - Send welcome email with account details

5. **First Quote Preparation** (Estimating)
   - Follow standard quoting procedure (PROC-QUOTE-001)

**SLA**: Complete within 24 hours of initial contact

**Decision Points**:
- If credit check fails → Tier 4 (payment upfront only)
- If existing customer with good history → Tier 2 or 1
- If new customer with satisfactory credit → Tier 3

---

### 7.2 QUOTATION PROCEDURE

**Procedure ID**: PROC-QUOTE-001  
**Responsible**: Estimating Department

#### Steps
1. **Site Survey** (Technical/Sales)
   - Schedule site visit with customer
   - Capture measurements and photos
   - Document site conditions and access
   - Identify any special requirements
   - Upload all data to SharePoint

2. **Technical Specification** (Technical)
   - Create detailed specification document
   - Select appropriate profiles and systems
   - Specify glass types and thicknesses
   - List hardware requirements
   - Document finish/colour requirements

3. **Pricing Calculation** (Estimating)
   - Input specifications into Logikal
   - Calculate material costs
   - Calculate labour hours and costs
   - Add overhead percentage
   - Calculate profit margin
   - Apply customer tier discount
   - Review for competitiveness

4. **Quote Approval** (Manager)
   - If quote value <= estimator's limit → Auto-approve
   - If quote value > estimator's limit → Manager review required
   - Check margin percentage
   - Check competitiveness vs market rates

5. **Quote Generation** (Estimating)
   - Generate professional quote PDF
   - Include:
     - Base number reference
     - Itemized pricing
     - Payment terms
     - Delivery timeframes
     - Terms and conditions
     - Validity period (30 days standard)

6. **Quote Delivery** (Sales)
   - Email quote to customer
   - Log in CRM
   - Schedule follow-up call (7 days)

**SLA**: 
- Standard quotes: 48 hours from site survey
- Urgent quotes: 24 hours (with manager approval)

**Decision Points**:
- Margin < 20% → Requires manager approval
- Quote value > £50,000 → Requires director approval
- Customer tier impacts discount percentage:
  - Tier 1: 15% standard discount
  - Tier 2: 10% standard discount
  - Tier 3: 5% standard discount
  - Tier 4/5: No discount unless approved

---

### 7.3 ORDER PROCESSING PROCEDURE

**Procedure ID**: PROC-ORDER-001  
**Responsible**: Sales Department

#### Steps
1. **Order Receipt** (Sales)
   - Receive customer purchase order
   - Verify PO details match quote
   - Update base number prefix from QUO to PO
   - Check for any customer-requested changes

2. **Credit Check** (Accounts)
   - Check current customer balance
   - Verify order value within credit limit
   - If over limit → Request payment upfront or credit approval
   - If Tier 4/5 → Request payment upfront

3. **Order Confirmation** (Sales)
   - Send order acknowledgement to customer
   - Confirm delivery timeframe
   - Provide customer with order tracking reference
   - Notify production team

4. **Production Scheduling** (Production)
   - Allocate production slot
   - Order materials from suppliers
   - Generate work orders
   - Assign to production team

5. **Order Tracking** (Sales)
   - Update customer on production progress
   - Confirm delivery date 48 hours before
   - Send SMS reminder 24 hours before delivery

**SLA**: Order confirmation within 2 hours of receipt

**Decision Points**:
- Payment terms based on customer tier
- Credit limit exceeded → Requires director approval or upfront payment
- Rush orders → Additional 20% charge + manager approval

---

### 7.4 PRODUCTION PROCEDURE

**Procedure ID**: PROC-PROD-001  
**Responsible**: Production Department

#### Steps
1. **Work Order Review** (Production Manager)
   - Review technical specifications
   - Check material availability
   - Verify equipment availability
   - Assign to production team

2. **Material Preparation** (Production)
   - Cut profiles to size
   - Machine components
   - Prepare glass (if applicable)
   - Organize hardware

3. **Assembly** (Production)
   - Assemble frames
   - Install glass/infill panels
   - Fit hardware
   - Apply sealants

4. **Quality Control** (Production Manager)
   - Visual inspection
   - Dimensional check
   - Operation check (opening/closing, locks)
   - Photo documentation

5. **Finishing** (Production)
   - Clean and polish
   - Apply protective wrapping
   - Label components
   - Prepare for delivery

6. **Final Inspection** (Production Manager)
   - Final quality sign-off
   - Update status to "Ready for Delivery"
   - Notify sales team

**SLA**: 
- Standard orders: 10 working days
- Simple orders: 5 working days
- Complex orders: 15-20 working days

**Quality Standards**:
- Zero defects policy
- All products must meet CE marking requirements
- Document compliance certificates

---

### 7.5 DELIVERY & INSTALLATION PROCEDURE

**Procedure ID**: PROC-DEL-001  
**Responsible**: Installation Department

#### Steps
1. **Delivery Scheduling** (Sales)
   - Confirm delivery date with customer
   - Arrange access requirements
   - Confirm site contact details
   - Brief installation team

2. **Pre-Delivery Prep** (Installation)
   - Load vehicle
   - Check all components present
   - Gather tools and equipment
   - Review site-specific requirements

3. **On-Site Installation** (Installation)
   - Arrive on time
   - Conduct site safety briefing
   - Protect customer premises
   - Remove old units (if applicable)
   - Install new units
   - Test operation
   - Clean up site

4. **Customer Sign-Off** (Installation)
   - Walk through installation with customer
   - Demonstrate operation
   - Address any concerns
   - Obtain customer signature on delivery note
   - Leave care instructions

5. **Post-Delivery** (Installation)
   - Upload signed delivery note to SharePoint
   - Report any snags to production
   - Update base number prefix to DEL
   - Notify accounts to generate invoice

**SLA**: Delivery within agreed timeframe, typically 2-5 working days after production completion

**Quality Standards**:
- Professional appearance and conduct
- Site left clean and tidy
- Customer satisfaction verified

---

### 7.6 INVOICING & PAYMENT PROCEDURE

**Procedure ID**: PROC-INV-001  
**Responsible**: Accounts Department

#### Steps
1. **Invoice Generation** (Accounts)
   - Triggered automatically on delivery completion
   - Generate invoice in Xero
   - Match to original quote
   - Include delivery note reference
   - Apply correct VAT rate

2. **Invoice Review** (Accounts)
   - Verify invoice accuracy
   - Check customer details
   - Confirm payment terms
   - Approve for sending

3. **Invoice Delivery** (Accounts)
   - Email invoice to customer
   - Update base number prefix to INV
   - Set payment due date
   - Schedule payment reminder

4. **Payment Monitoring** (Accounts)
   - Monitor Xero for payment receipt
   - If paid → Update prefix to PAID
   - If 14 days overdue → Send first reminder
   - If 30 days overdue → Send final reminder
   - If 45 days overdue → Escalate to debt collection

5. **Payment Reconciliation** (Accounts)
   - Match payment to invoice
   - Update customer balance
   - Update customer tier if needed
   - Archive completed order

**SLA**: Invoice sent within 24 hours of delivery

**Payment Terms by Tier**:
- Tier 1: Net 7 days
- Tier 2: Net 14 days
- Tier 3: Net 30 days
- Tier 4/5: Payment upfront or COD

---

### 7.7 WARRANTY & AFTER-SALES PROCEDURE

**Procedure ID**: PROC-WARR-001  
**Responsible**: Sales Department

#### Steps
1. **Warranty Registration** (Sales)
   - Automatically register upon delivery completion
   - Standard warranty: 12 months
   - Extended warranty: Available for purchase

2. **Warranty Claim Receipt** (Sales)
   - Customer reports issue
   - Log in CRM system
   - Assign warranty claim reference
   - Schedule site visit for assessment

3. **Warranty Assessment** (Technical)
   - Visit site to assess issue
   - Determine if covered under warranty
   - Document findings with photos
   - Provide report to customer

4. **Warranty Repair** (Production/Installation)
   - If covered → Schedule repair at no charge
   - If not covered → Provide repair quote
   - Complete repair
   - Customer sign-off

5. **Warranty Closure** (Sales)
   - Verify customer satisfaction
   - Update warranty record
   - Archive documentation

**Warranty Coverage**:
- Manufacturing defects
- Installation errors (by SFG)
- Material failures
**Not Covered**:
- Customer misuse
- Accidental damage
- Normal wear and tear
- Acts of God

---

## 8. INTEGRATION ARCHITECTURE

### 8.1 EVENT-DRIVEN ARCHITECTURE

```typescript
interface EventBusMessage {
  eventId: string;
  eventType: string;
  timestamp: Date;
  source: {
    appId: string;
    appName: string;
  };
  payload: any;
  metadata: {
    correlationId?: string;
    causationId?: string;
    userId?: string;
  };
}

// Example Event Types
const EVENT_TYPES = {
  // Customer Events
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  CUSTOMER_TIER_CHANGED: 'customer.tier_changed',
  
  // Document Events
  BASE_NUMBER_GENERATED: 'base_number.generated',
  DOCUMENT_STAGE_ADVANCED: 'document.stage_advanced',
  DOCUMENT_PREFIX_CHANGED: 'document.prefix_changed',
  
  // Workflow Events
  WORKFLOW_STARTED: 'workflow.started',
  WORKFLOW_STEP_COMPLETED: 'workflow.step_completed',
  WORKFLOW_COMPLETED: 'workflow.completed',
  WORKFLOW_FAILED: 'workflow.failed',
  
  // Financial Events
  QUOTE_SENT: 'quote.sent',
  ORDER_CONFIRMED: 'order.confirmed',
  INVOICE_GENERATED: 'invoice.generated',
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_OVERDUE: 'payment.overdue',
  
  // Production Events
  PRODUCTION_STARTED: 'production.started',
  PRODUCTION_COMPLETED: 'production.completed',
  QUALITY_CHECK_PASSED: 'quality_check.passed',
  QUALITY_CHECK_FAILED: 'quality_check.failed',
  
  // Delivery Events
  DELIVERY_SCHEDULED: 'delivery.scheduled',
  DELIVERY_COMPLETED: 'delivery.completed',
  
  // Integration Events
  XERO_SYNC_COMPLETED: 'xero.sync_completed',
  XERO_SYNC_FAILED: 'xero.sync_failed',
  SHAREPOINT_UPLOAD_COMPLETED: 'sharepoint.upload_completed'
};

// Event Routing Configuration
const EVENT_ROUTING: Record<string, string[]> = {
  'customer.created': ['XERO_INTEGRATION', 'CRM_SYSTEM', 'EMAIL_SERVICE'],
  'order.confirmed': ['XERO_INTEGRATION', 'PRODUCTION_SYSTEM', 'NOTIFICATION_SERVICE'],
  'payment.received': ['XERO_INTEGRATION', 'CRM_SYSTEM', 'CUSTOMER_PORTAL'],
  'invoice.generated': ['XERO_INTEGRATION', 'EMAIL_SERVICE', 'DOCUMENT_STORAGE']
};
```

---

### 8.2 API GATEWAY & ROUTING

```typescript
// Central API Gateway Configuration
const API_GATEWAY_CONFIG = {
  baseUrl: 'https://api.sfg.abacusai.app',
  version: 'v1',
  
  routes: {
    '/base-numbers/**': {
      service: 'BASE_NUMBER_SERVICE',
      authentication: 'REQUIRED',
      rateLimit: 100
    },
    '/customers/**': {
      service: 'CUSTOMER_SERVICE',
      authentication: 'REQUIRED',
      rateLimit: 200
    },
    '/workflows/**': {
      service: 'WORKFLOW_SERVICE',
      authentication: 'REQUIRED',
      rateLimit: 50
    },
    '/xero/**': {
      service: 'XERO_INTEGRATION',
      authentication: 'REQUIRED',
      rateLimit: 60
    }
  },
  
  cors: {
    allowedOrigins: [
      'https://sfg-chrome.abacusai.app',
      'https://shopfrontgroup.sharepoint.com'
    ]
  },
  
  security: {
    apiKeyHeader: 'X-SFG-API-Key',
    jwtHeader: 'Authorization',
    csrfProtection: true
  }
};
```

---

## 9. ENVIRONMENT VARIABLES - MASTER LIST

```bash
# ===== MICROSOFT 365 =====
M365_CLIENT_ID=
M365_TENANT_ID=
M365_CLIENT_SECRET=
M365_REDIRECT_URI=
SHAREPOINT_SITE_ID=

# ===== XERO =====
XERO_CLIENT_ID=
XERO_CLIENT_SECRET=
XERO_REDIRECT_URI=
XERO_WEBHOOK_KEY=
XERO_TENANT_ID=

# ===== LOGIKAL =====
LOGIKAL_API_URL=
LOGIKAL_API_KEY=
LOGIKAL_USERNAME=
LOGIKAL_PASSWORD=

# ===== TIME FINANCE (CONDITIONAL) =====
TIME_FINANCE_API_URL=
TIME_FINANCE_API_KEY=
TIME_FINANCE_PARTNER_ID=

# ===== TWILIO =====
# Already configured in /home/ubuntu/.config/abacusai_auth_secrets.json
TWILIO_ACCOUNT_SID=[from secrets file]
TWILIO_AUTH_TOKEN=[from secrets file]
TWILIO_PHONE_NUMBER=

# ===== COMPANIES HOUSE =====
# Already configured in /home/ubuntu/.config/abacusai_auth_secrets.json
COMPANIES_HOUSE_API_KEY=[from secrets file]

# ===== DATABASE =====
DATABASE_URL=postgresql://...
DATABASE_POOL_SIZE=10

# ===== AUTH =====
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://sfg-chrome.abacusai.app

# ===== CHROME EXTENSION =====
EXTENSION_ID=
EXTENSION_VERSION=
API_BASE_URL=https://sfg-chrome.abacusai.app/api

# ===== ABACUS.AI =====
ABACUSAI_API_KEY=

# ===== SFG CORE SYSTEM =====
SFG_ORCHESTRATOR_KEY=
SFG_API_GATEWAY_URL=https://api.sfg.abacusai.app
BASE_NUMBER_SERVICE_URL=
WORKFLOW_SERVICE_URL=
CUSTOMER_SERVICE_URL=

# ===== APP VERSION =====
APP_VERSION=v1.0.x

# ===== AWS (FOR FUTURE) =====
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# ===== FEATURE FLAGS =====
FEATURE_TIME_FINANCE_ENABLED=false
FEATURE_AI_AUTOSTACK_INTEGRATION=false
FEATURE_MOBILE_SYNC_ENABLED=false
```

---

## 10. NEXT STEPS & IMPLEMENTATION PRIORITIES

### Phase 1: Core Foundation (Weeks 1-4)
1. **Base Number Management System**
   - API development
   - Database schema implementation
   - Testing with sample data

2. **Customer & Staff Management**
   - Customer tier calculation
   - Staff permissions system
   - Integration with M365

3. **Document Lifecycle**
   - State machine implementation
   - Prefix management
   - Audit trail

### Phase 2: Key Integrations (Weeks 5-8)
1. **Xero Integration**
   - OAuth implementation
   - Invoice sync
   - Payment webhooks

2. **SharePoint Integration**
   - Document storage
   - Metadata management
   - Search functionality

3. **Logikal Integration**
   - Pricing API connection
   - Drawing export
   - Quote generation

### Phase 3: Workflow Automation (Weeks 9-12)
1. **Workflow Engine**
   - Orchestration logic
   - SLA monitoring
   - Notification system

2. **Event Bus**
   - Message routing
   - Webhook distribution
   - Error handling

3. **API Gateway**
   - Centralized routing
   - Rate limiting
   - Security

### Phase 4: Advanced Features (Weeks 13+)
1. **AI-AutoStack Partnership**
   - Marketing integration
   - Cross-promotion features

2. **Mobile Sync**
   - Cloud storage
   - Offline capabilities
   - Real-time sync

3. **Analytics & Reporting**
   - Business intelligence
   - Performance metrics
   - Predictive analytics

---

## DOCUMENT CONTROL

**Document ID**: SFG-APP-INV-001  
**Version**: 1.0  
**Date**: October 30, 2025  
**Author**: DeepAgent (Abacus.AI)  
**Status**: DRAFT  
**Next Review**: November 30, 2025  

**Approval Required**:
- [ ] Technical Director
- [ ] Operations Manager
- [ ] IT Manager

---

## APPENDIX

### A. Glossary of Terms
- **Base Number**: Immutable unique identifier for business documents
- **Customer Tier**: Classification system for customer credit and pricing
- **Document Prefix**: Stage-specific code (ENQ, QUO, INV, etc.)
- **Workflow**: Automated sequence of business process steps
- **SLA**: Service Level Agreement - time limit for task completion

### B. Acronyms
- **API**: Application Programming Interface
- **SSO**: Single Sign-On
- **M365**: Microsoft 365
- **MFA**: Multi-Factor Authentication
- **CRM**: Customer Relationship Management
- **SLA**: Service Level Agreement
- **MCP**: Model Context Protocol
- **JWT**: JSON Web Token
- **OAuth**: Open Authorization

### C. References
- Microsoft Graph API Documentation: https://docs.microsoft.com/graph
- Xero API Documentation: https://developer.xero.com
- Abacus.AI Documentation: https://abacus.ai/help
- SFG Chrome Extension Repository: [To be provided]

---

**END OF DOCUMENT**
