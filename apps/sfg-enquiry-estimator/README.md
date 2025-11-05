
# SFG Enquiry & Estimator System

**Status:** 🟢 Production  
**Version:** 1.0.0  
**Deployed URL:** https://new-enq-spec.abacusai.app  
**Category:** Operations / Enquiry Management

---

## 📋 Overview

The **SFG Enquiry & Estimator System** is an internal tool for SFG Aluminium Limited that handles the complete enquiry-to-quote workflow. It manages customer enquiries, performs credit assessments, generates automated enquiry numbers, checks building regulation compliance, and integrates with Xero and SharePoint for a seamless operational experience.

## 🎯 Primary Purpose

- **Enquiry Management:** Create, track, and manage customer enquiries with automated sequential numbering
- **Credit Assessment:** Evaluate customer creditworthiness using Companies House and Xero data
- **Quote Generation:** Generate quotes with automated payment terms and margin checking
- **Compliance:** Verify UK building regulations compliance for projects
- **Integration:** Seamlessly integrate with Xero, SharePoint, Companies House, and NEXUS

## ✨ Key Features

### 1. Automated Enquiry Number Generation
- **Format:** `BASE-TYPE` (e.g., `24001-ENQ`)
- **Sequential:** Numbers increment from 24001
- **Lifecycle Tracking:** ENQ → QUO → INV → PO → DEL
- **Traceability:** Base number remains constant through entire document lifecycle

### 2. Credit Assessment & Payment Terms
- **Multi-source Analysis:** Companies House + Xero payment history
- **Automated Calculation:** Payment terms based on entity type, credit score, project value
- **Risk Scoring:** 5-level risk assessment (Very High → Very Low)
- **Xero Integration:** Pull invoice history and calculate payment reliability (0-100 score)

### 3. Customer & Staff Tier Systems
- **Customer Tiers:** Economy 🥉 → Standard 🥈 → Premium 🥇 → Unlimited 💎
- **Staff Tiers:** Junior → Standard → Senior → Manager → Director
- **Approval Limits:** £1,000 → £5,000 → £15,000 → £50,000 → Unlimited
- **Color Coded:** Visual tier identification throughout the system

### 4. Building Regulations Compliance
- **Automated Checks:** Fire safety, structural, thermal, accessibility, security
- **UK Standards:** Part A, B, L, M, N compliance verification
- **Recommendations:** Value engineering suggestions and exemptions

### 5. Multi-Channel Enquiry Entry
- **Manual Entry:** Comprehensive enquiry form with all required fields
- **WhatsApp:** Receive and parse enquiries via WhatsApp Business API
- **Email:** Email enquiry processing (future enhancement)

### 6. Real-Time Statistics Dashboard
- **Enquiry Tracking:** Total enquiries, new, in progress, quoted, won, lost
- **Conversion Rates:** Win rate, average enquiry value
- **Staff Performance:** Enquiries per estimator, approval rates

## 🔄 Core Workflows

### Enquiry to Quote Workflow
1. **Customer Contact** → Enquiry received (manual, WhatsApp, email)
2. **Enquiry Creation** → System generates sequential enquiry number
3. **Customer Assessment** → Check if new or existing customer
4. **Credit Check** → If order > £10k or new customer, perform credit assessment
5. **Payment Terms** → Calculate recommended terms based on credit data
6. **Quote Generation** → Estimator creates specification and pricing
7. **Approval** → If needed based on staff tier limits
8. **Quote Issued** → Convert ENQ to QUO, send to customer
9. **Win/Loss** → Track outcome and conversion

### Credit Assessment Workflow
1. **Extract Details** → Company name, registration number from enquiry
2. **Companies House** → Query API for company data, filing history
3. **Xero Check** → If existing customer, pull payment history
4. **Score Calculation** → Analyze payment reliability (0-100)
5. **Risk Assessment** → Determine risk level based on all factors
6. **Credit Limit** → Calculate base limit + Xero multiplier
7. **Payment Terms** → Assign terms (Cash → 7d → 30d → 60d)
8. **Tier Assignment** → Set customer tier (Economy → Unlimited)
9. **Xero Sync** → Create/update contact in Xero if approved

### Staff Approval Workflow
1. **Quote Created** → Estimator prepares quote with total value
2. **Tier Check** → System checks staff approval limit
3. **Auto-Approve** → If within limit, quote proceeds
4. **Escalate** → If exceeds limit, escalate to next tier
5. **Review** → Higher tier reviews and approves/rejects
6. **Final Approval** → Director has unlimited authority

## 🔗 Integrations

### Xero Accounting
- **Purpose:** Customer sync, invoice management, payment history
- **Endpoints:** `/api.xro/2.0/Contacts`, `/api.xro/2.0/Invoices`
- **Use Cases:** 
  - Create customer contacts
  - Pull payment history for credit assessment
  - Calculate payment reliability score

### Companies House
- **Purpose:** Company data lookup for credit checks
- **API:** Companies House REST API
- **Use Cases:**
  - Verify company registration
  - Check company age and filing history
  - Assess credit risk based on accounts

### SharePoint
- **Purpose:** Document storage and credit limit research
- **Sites:** 13 SharePoint sites accessed
- **Use Cases:**
  - Store project documents
  - Retrieve historical credit limits
  - Share specifications with customers

### Twilio WhatsApp
- **Purpose:** Receive customer enquiries via WhatsApp
- **API:** Twilio WhatsApp Business API
- **Use Cases:**
  - Receive inbound enquiry messages
  - Parse and extract enquiry data
  - Send confirmation replies

### NEXUS Orchestration
- **Purpose:** Central SFG ecosystem integration
- **Webhook:** `https://new-enq-spec.abacusai.app/api/webhooks/nexus`
- **Message Handler:** `https://new-enq-spec.abacusai.app/api/messages/handle`
- **Use Cases:**
  - Receive event notifications from other SFG apps
  - Respond to data queries
  - Participate in orchestrated workflows

## 📊 Business Rules

### Margin Requirements
- **Minimum:** 15% margin on all quotes
- **Target:** 25% margin
- **Warning:** Below 18% triggers notification
- **Exception:** Director approval required for <15%

### Credit Check Thresholds
- **Requirement:** Orders > £10,000 require credit check
- **New Customers:** Always require credit check
- **Existing Customers:** Use Xero history if < 90 days old
- **Providers:** Companies House (primary), Xero (secondary), Experian (if needed)

### Approval Limits by Tier
| Staff Tier | Approval Limit | Permissions |
|------------|---------------|-------------|
| Junior | £1,000 | Basic quotes only |
| Standard | £5,000 | Standard quotes, view customers |
| Senior | £15,000 | Approve quotes, credit checks |
| Manager | £50,000 | Team management, override pricing |
| Director | Unlimited | Full system access |

### Customer Tiers
| Tier | Credit Range | Color | Payment Terms |
|------|-------------|-------|---------------|
| Economy 🥉 | £0 - £2,500 | Gray | Cash, 7 days |
| Standard 🥈 | £2,501 - £10,000 | Blue | 7, 14, 30 days |
| Premium 🥇 | £10,001 - £50,000 | Purple | 14, 30, 60 days |
| Unlimited 💎 | £50,001+ | Amber | 30, 60, 90 days |

### Enquiry Number Lifecycle
- **ENQ** → Initial enquiry
- **QUO** → Quotation issued
- **INV** → Invoice raised
- **PO** → Purchase order
- **DEL** → Delivery note

**Rule:** Base number NEVER changes, only prefix changes as document progresses

## 🔔 Webhook Events (Incoming)

The system listens for these events from NEXUS and other SFG apps:

| Event | Description | Action Taken |
|-------|-------------|--------------|
| `enquiry.created` | New enquiry from external system | Create enquiry record, generate number |
| `quote.requested` | Quote requested for enquiry | Update status, flag for generation |
| `order.approved` | Customer approved quote | Mark as won, prepare for fabrication |
| `customer.registered` | New customer registered | Create customer, trigger credit check |
| `credit.check_required` | Credit check requested | Perform assessment, return results |
| `invoice.due` | Invoice approaching due date | Log notification, track payment |
| `payment.received` | Payment received | Update payment history |

**Webhook URL:** `https://new-enq-spec.abacusai.app/api/webhooks/nexus`  
**Security:** HMAC-SHA256 signature verification using `X-Nexus-Signature` header

## 💬 Supported Messages (Outgoing/Responses)

The system responds to these message types from NEXUS and other SFG apps:

| Message Type | Description | Response |
|--------------|-------------|----------|
| `query.customer_data` | Get customer information | Customer details, tier, credit, enquiries |
| `query.enquiry_status` | Get enquiry status | Enquiry number, status, value, dates |
| `query.quote_status` | Get quote status | Same as enquiry status |
| `query.customer_credit` | Get credit details | Credit limit, score, risk, history |
| `query.payment_history` | Get Xero payment data | Xero contact ID, payment terms |
| `action.create_enquiry` | Create new enquiry | New enquiry ID and number |
| `action.update_enquiry_status` | Update enquiry | Updated enquiry details |
| `action.approve_credit` | Approve customer credit | Approved credit details |

**Message Handler URL:** `https://new-enq-spec.abacusai.app/api/messages/handle`  
**Format:** JSON requests and responses

## 🗄️ Data Models

### User (Staff)
```typescript
{
  email: string (unique)
  role: "estimator" | "admin" | "contract_manager"
  staffTier: "junior" | "standard" | "senior" | "manager" | "director"
  department: string
}
```

### Customer
```typescript
{
  name: string
  email: string (unique)
  companyNumber: string
  entityType: "limited" | "independent" | "partnership" | "sole_trader"
  tier: "economy" | "standard" | "premium" | "unlimited"
  creditLimit: number
  creditScore: number (0-999)
  paymentTerms: string
  riskLevel: "very_high" | "high" | "medium" | "low" | "very_low"
  xeroContactId: string
}
```

### Enquiry
```typescript
{
  enquiryNumber: string (unique, format: "BASE-TYPE")
  customerId: string
  customerName: string
  jobType: string
  location: string
  status: "new" | "in_progress" | "specified" | "quoted" | "won" | "lost"
  estimatedValue: number
  urgency: "low" | "normal" | "high" | "urgent"
  paymentTerms: string
  creditApproved: boolean
  createdVia: "manual" | "whatsapp" | "email"
}
```

### CreditCheck
```typescript
{
  customerId: string
  checkType: "companies_house" | "credit_bureau" | "manual"
  score: number (0-999)
  limit: number
  status: "completed" | "failed" | "pending"
  provider: string
  riskFactors: string[]
}
```

## 🛠️ Technical Stack

- **Framework:** Next.js 14 (TypeScript)
- **Database:** PostgreSQL with Prisma ORM
- **Frontend:** React + TailwindCSS + shadcn/ui
- **Authentication:** NextAuth.js (email/password)
- **Package Manager:** Yarn
- **Hosting:** Abacus.AI Platform

## 📍 Key API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/enquiries` | CRUD for enquiries |
| `/api/customers` | Customer management |
| `/api/credit-check` | Perform credit checks |
| `/api/payment-terms/calculate` | Calculate payment terms |
| `/api/xero/auth` | Xero OAuth flow |
| `/api/xero/payment-history` | Get payment data |
| `/api/whatsapp/webhook` | Receive WhatsApp messages |
| `/api/webhooks/nexus` | NEXUS event webhook |
| `/api/messages/handle` | Message handler |

## 🚀 Getting Started (For Developers)

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Yarn package manager

### Environment Variables
```bash
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://new-enq-spec.abacusai.app
NEXTAUTH_SECRET=your-secret
XERO_CLIENT_ID=your-xero-id
XERO_CLIENT_SECRET=your-xero-secret
COMPANIES_HOUSE_API_KEY=your-key
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
NEXUS_WEBHOOK_SECRET=sfg-aluminium-webhook-secret-2025
```

### Installation
```bash
cd /home/ubuntu/sfg_aluminium_website/app
yarn install
yarn prisma generate
yarn dev
```

## 📄 Files in This Registration

- `business-logic.json` - Comprehensive business logic documentation
- `registration-metadata.json` - Technical metadata and integration details
- `README.md` - This file

## 🔐 Security

- **Authentication:** NextAuth.js with email/password
- **Authorization:** Role-based access control
- **Webhook Security:** HMAC signature verification
- **Data Encryption:** At rest and in transit
- **Session Management:** Server-side sessions with HTTP-only cookies

## 📞 Support

**Primary Contact:** SFG Aluminium IT Team  
**Documentation:** Available in `/registration` directory  
**GitHub:** sfgaluminium1-spec/sfg-app-portfolio

## 📈 Future Enhancements

- AI-powered quote generation
- Integration with fabrication systems
- Mobile app for field estimators
- Advanced analytics and forecasting
- Integration with CAD systems
- Automated margin optimization
- Customer portal for quote tracking

---

**Registered by:** Warren (DeepAgent Assistant)  
**Registration Date:** 2025-11-05  
**Status:** Pending Approval  
**Labels:** registration, satellite-app, sfg-aluminium-app, operations, enquiry-management

---

*Part of the SFG Aluminium App Portfolio*
