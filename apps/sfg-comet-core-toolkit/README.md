
# SFG COMET CORE Toolkit (SharePoint IA Toolkit)

**Version:** 2.0.0  
**Status:** Production  
**Category:** SFG Aluminium Business App  
**Deployment:** https://sfg-comet-core-toolkit.abacusai.app

---

## 🎯 Overview

The **SFG COMET CORE Toolkit** (formerly SharePoint IA Toolkit) is a comprehensive SharePoint Information Architecture and Knowledge Management system for SFG Aluminium. It automates the complete project lifecycle from enquiry through to paid invoice, with integrated folder structure automation, data classification, and real-time orchestration capabilities with NEXUS.

### Key Capabilities

- **Real-time NEXUS Orchestration** - Webhook and message handler endpoints for coordinated workflows
- **Project Lifecycle Management** - ENQ → QUO → SENT → ACC → ORD → FAB → INS → INV → PAID
- **Automated Folder Creation** - 17-folder standard structure on SharePoint
- **Data Classification & Archive** - 12 file types with retention rules
- **Knowledge Smelter** - Decision tracking and documentation
- **Customer Tier Management** - 5-tier system (Platinum, Sapphire, Steel, Green, Crimson)
- **Security Tier Controls** - T1/T2/T3/T4/T5 approval limits
- **Xero Integration** - Accounting and invoicing
- **Google Analytics 4** - User behavior tracking
- **FreeCommander Integration** - Desktop sync capabilities

---

## 🔔 NEXUS Orchestration

### Webhook Endpoint

**URL:** `https://sfg-comet-core-toolkit.abacusai.app/api/webhooks/nexus`  
**Method:** POST  
**Authentication:** HMAC-SHA256 signature via `X-Nexus-Signature` header

**Supported Events:**

- `enquiry.created` - New customer enquiry received
- `quote.requested` - Quote generation requested
- `order.approved` - Order has been approved
- `customer.registered` - New customer registered
- `credit.check_required` - Credit check needed
- `invoice.due` - Invoice payment due
- `payment.received` - Payment received
- `folder.create_required` - SharePoint folder creation needed
- `document.move_required` - Document move required

**Example Webhook Payload:**

```json
{
  "type": "enquiry.created",
  "data": {
    "enquiry_id": "ENQ-2025-0001",
    "customer": {
      "id": "CUST001",
      "name": "ABC Building Pty Ltd",
      "tier": "Sapphire"
    },
    "items": [],
    "estimated_value": 15750,
    "priority": "normal"
  },
  "timestamp": "2025-11-05T05:30:00Z",
  "request_id": "req_abc123"
}
```

### Message Handler Endpoint

**URL:** `https://sfg-comet-core-toolkit.abacusai.app/api/messages/handle`  
**Method:** POST  
**Authentication:** Bearer token or API key

**Supported Message Types:**

**Queries:**
- `query.customer_data` - Get customer information
- `query.quote_status` - Get quote status and details
- `query.order_status` - Get order status and progress
- `query.folder_structure` - Get SharePoint folder structure
- `query.document_list` - Get list of documents

**Actions:**
- `action.create_quote` - Create new quote
- `action.approve_order` - Approve an order
- `action.send_invoice` - Send invoice to customer
- `action.create_folder` - Create SharePoint folder structure
- `action.move_document` - Move document in SharePoint

**Example Message Request:**

```json
{
  "type": "query.customer_data",
  "params": {
    "customer_id": "CUST001"
  },
  "request_id": "req_xyz789",
  "sender": "sfg-customer-portal"
}
```

**Example Message Response:**

```json
{
  "request_id": "req_xyz789",
  "status": "success",
  "result": {
    "customer_id": "CUST001",
    "company_name": "ABC Building Pty Ltd",
    "tier": "Sapphire",
    "credit_limit": 50000,
    "outstanding_balance": 12500,
    "status": "active"
  },
  "timestamp": "2025-11-05T05:30:15Z"
}
```

---

## 📋 Business Logic

### Workflows

#### 1. Enquiry to Project Lifecycle

Complete customer journey from initial enquiry through to paid invoice:

1. Customer submits enquiry (ENQ status)
2. System assigns auto-number (e.g., 00123-ENQ-WH)
3. Staff creates quote (QUO status)
4. Customer accepts, becomes order (ORD status)
5. Invoice generated (INV status)
6. Goods delivered (DEL status)
7. Payment received (PAID status)
8. Project archived with complete audit trail

#### 2. Automated Folder Creation

Create standard 17-folder structure on SharePoint for each project:

1. Project status changes (e.g., ENQ → QUO)
2. System validates SharePoint permissions
3. System creates site/library if needed
4. System creates canonical folder structure (01-17)
5. System creates month shortcuts
6. System sets folder permissions based on security tier
7. System logs creation in audit trail
8. System notifies relevant staff

#### 3. Data Classification & Archive

Classify uploaded files and apply retention/compliance rules:

1. User uploads file via UI or email
2. System detects file type (invoice, quote, drawing, etc.)
3. System applies classification rules
4. System determines retention period (1-10 years, permanent, lifetime)
5. System sets immutability flag if required
6. System moves file to correct SharePoint path
7. System creates metadata record in database
8. System updates audit log

### Business Rules

- **Margins:** Minimum 15%, Target 25%, Warning threshold 18%
- **Approval Limits:**
  - T1 (Director): £1,000,000
  - T2 (Senior Manager): £100,000
  - T3 (Manager): £25,000
  - T4 (Supervisor): £10,000
  - T5 (Staff): £1,000
- **Credit Checks:** Required for orders > £10,000, valid for 90 days
- **Document Stages:** ENQ → QUO → SENT → ACC → ORD → FAB → INS → INV → PAID
- **Customer Tiers:** Platinum (Purple), Sapphire (Blue), Steel (Gray), Green (Green), Crimson (Red)

---

## 🔗 Integrations

### Microsoft SharePoint
- **Type:** API (Microsoft Graph)
- **Purpose:** Document management, folder structure automation
- **Authentication:** OAuth 2.0
- **Status:** Active

### Xero
- **Type:** API
- **Purpose:** Accounting and invoicing
- **Authentication:** OAuth 2.0
- **Status:** Configured

### PostgreSQL
- **Type:** Database
- **Purpose:** Primary data store
- **Status:** Active

### NEXUS
- **Type:** Orchestration
- **Purpose:** Real-time event handling and workflow coordination
- **Endpoints:** `/api/webhooks/nexus`, `/api/messages/handle`
- **Status:** Active

### SFG Company Wiki
- **Type:** MCP
- **Purpose:** Knowledge synchronization
- **Status:** Active

### Google Analytics 4
- **Type:** Analytics
- **Purpose:** User behavior tracking
- **Status:** Configured

---

## 📊 Data Models

### Enquiry
- `id` - Unique UUID
- `enquiryNumber` - Auto-generated number
- `baseNumber` - Sequential 5-digit base
- `customerName` - Customer name
- `shortDescription` - Brief description
- `status` - ENQ/QUO/ORD/INV/DEL/PAID
- `staffInitials` - Staff member initials

### Project
- `id` - Unique UUID
- `projectNumber` - Project identifier
- `enquiryId` - Link to original enquiry
- `customerName` - Customer name
- `status` - Current project status

### Document
- `id` - Unique UUID
- `fileName` - Original filename
- `fileType` - Classification type
- `retentionYears` - Retention period
- `isImmutable` - Cannot be modified

---

## 🚀 API Endpoints

### Core Endpoints

- `GET /api/enquiries` - List all enquiries
- `POST /api/enquiries` - Create new enquiry
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `POST /api/data-archive` - Archive and classify file
- `POST /api/folders` - Create new folder

### Orchestration Endpoints

- `POST /api/webhooks/nexus` - NEXUS webhook endpoint
- `POST /api/messages/handle` - Message handler for orchestration requests

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes, PostgreSQL, Prisma ORM
- **Integrations:** Microsoft Graph API, Xero API, Google Analytics 4
- **Hosting:** Abacus.AI
- **Authentication:** OAuth 2.0 (Microsoft Entra ID)

---

## 📦 Environment Variables

### Required

```env
DATABASE_URL=postgresql://...
NEXUS_WEBHOOK_SECRET=your-webhook-secret
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id
```

### Optional

```env
XERO_CLIENT_ID=your-xero-client-id
XERO_CLIENT_SECRET=your-xero-client-secret
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🧪 Testing

### Health Check

```bash
curl -X POST https://sfg-comet-core-toolkit.abacusai.app/api/messages/handle \
  -H "Content-Type: application/json" \
  -d '{"type":"ping"}'
```

**Expected Response:**

```json
{
  "request_id": null,
  "status": "success",
  "result": {
    "status": "ok",
    "message": "SharePoint IA Toolkit is online"
  },
  "timestamp": "2025-11-05T05:30:00Z"
}
```

### Test Webhook

```bash
curl -X POST https://sfg-comet-core-toolkit.abacusai.app/api/webhooks/nexus \
  -H "Content-Type: application/json" \
  -H "X-Nexus-Signature: test" \
  -d '{"type":"test.event","data":{}}'
```

---

## 📝 Documentation

- **Business Logic:** [business-logic.json](./business-logic.json)
- **Registration Metadata:** [registration-metadata.json](./registration-metadata.json)
- **Deployment URL:** https://sfg-comet-core-toolkit.abacusai.app
- **GitHub Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio

---

## 👤 Contact

**Owner:** Warren Heathcote  
**Organization:** SFG Aluminium  
**Email:** warren@sfgaluminium.com.au

**Registered by:** Comet (DeepAgent)  
**Registration Date:** November 5, 2025

---

## 📄 License

Proprietary - SFG Aluminium
