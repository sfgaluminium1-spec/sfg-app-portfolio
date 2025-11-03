# SFG ALUMINIUM - APPLICATION INVENTORY SUMMARY
## Quick Reference Guide

**Date**: October 30, 2025  
**Full Document**: `SFG_Complete_Application_Inventory.md` (2,563 lines)

---

## 🎯 OVERVIEW

This summary provides quick access to all SFG Aluminium applications, their status, authentication methods, and key integration points extracted from your ecosystem.

---

## 📊 APPLICATION STATUS MATRIX

| Application | Status | Auth Method | API Available | Configured |
|-------------|--------|-------------|---------------|------------|
| **Microsoft 365** | ✅ PRODUCTION | OAuth 2.0 | ✅ Yes | ⏳ Pending |
| **Xero Accounting** | ✅ PRODUCTION | OAuth 2.0 | ✅ Yes | ⏳ Pending |
| **Logikal (BM Aluminium)** | ✅ PRODUCTION | API Key/Basic | ⚠️ TBD | ⏳ Pending |
| **Time Finance E3** | 🔄 PLANNED | TBD | ⚠️ TBD | ❌ Not Started |
| **Companies House** | ✅ PRODUCTION | API Key | ✅ Yes | ✅ **CONFIGURED** |
| **Twilio** | ✅ PRODUCTION | Account SID + Token | ✅ Yes | ✅ **CONFIGURED** |
| **SFG Chrome Extension** | ✅ PRODUCTION | API Key | ✅ Yes | ✅ Active |
| **SFG Marketing Website** | ✅ PRODUCTION | NextAuth | ✅ Yes | ✅ Active |
| **AI-AutoStack** | 🤝 PARTNERSHIP | N/A | N/A | Cross-Promo Only |

---

## 🔐 ALREADY CONFIGURED INTEGRATIONS

### ✅ Companies House
- **API Key**: Stored in `/home/ubuntu/.config/abacusai_auth_secrets.json`
- **Use Cases**: Company verification, credit checks
- **Rate Limit**: 600 requests per 5 minutes

### ✅ Twilio
- **Account SID + Auth Token**: Stored in `/home/ubuntu/.config/abacusai_auth_secrets.json`
- **Use Cases**: SMS notifications, 2FA
- **Ready to Use**: Yes

---

## 🏗️ CORE SYSTEM ARCHITECTURE

### Base Number System
**Purpose**: Immutable unique identifier for all business documents

**Format**: `BASE-YYYY-NNNNN`  
**Example**: `BASE-2025-00001`

**Document Prefixes**:
- **ENQ** → Enquiry Received
- **QUO** → Quote Prepared & Sent
- **PO** → Purchase Order Confirmed
- **PROD** → In Production
- **DEL** → Delivered
- **INV** → Invoice Generated
- **PAID** → Payment Received

### Customer Tier System
| Tier | Name | Payment Terms | Credit Check |
|------|------|---------------|--------------|
| **Tier 1** | VIP | Net 7 days | Excellent |
| **Tier 2** | Preferred | Net 14 days | Good |
| **Tier 3** | Standard | Net 30 days | Satisfactory |
| **Tier 4** | New | Payment Upfront/COD | Unknown |
| **Tier 5** | Watch List | Payment Upfront Only | Poor |

### Staff Tier System
| Tier | Quoting Limit | Permissions |
|------|---------------|-------------|
| **Director** | Unlimited | Full system access |
| **Manager** | £50,000 | Department-wide access |
| **Supervisor** | £25,000 | Team access |
| **Senior Staff** | £10,000 | Own records |
| **Staff** | £5,000 | Own records (limited) |
| **Trainee** | £1,000 | Read-only |

---

## 📋 COMPLETE WORKFLOW: ENQUIRY TO PAYMENT

### 13-Step Process

1. **Enquiry Received** (4 hrs SLA)
   - Generate base number (ENQ prefix)
   - Create customer record

2. **Site Survey Scheduled** (48 hrs SLA)
   - Schedule visit
   - Send calendar invite & SMS

3. **Measurements Captured** (1 hr SLA)
   - Site survey completed
   - Photos uploaded to SharePoint

4. **Quote Preparation** (24 hrs SLA)
   - Logikal pricing
   - Apply customer tier discount
   - Manager approval if needed

5. **Quote Sent** (1 hr SLA)
   - Prefix changes to QUO
   - Email PDF to customer

6. **Order Confirmed** (2 hrs SLA)
   - Receive customer PO
   - Credit check
   - Prefix changes to PO

7. **Production Scheduled** (48 hrs SLA)
   - Allocate production slot
   - Order materials

8. **In Production** (5-10 days SLA)
   - Fabricate components
   - Quality control

9. **Ready for Delivery** (24 hrs SLA)
   - Final inspection
   - Schedule with customer

10. **Delivered** (8 hrs SLA)
    - Install at site
    - Customer sign-off
    - Prefix changes to DEL

11. **Invoice Generated** (2 hrs SLA)
    - Auto-generate in Xero
    - Prefix changes to INV

12. **Payment Received** (Per customer terms)
    - Xero webhook detects payment
    - Prefix changes to PAID

13. **Order Completed** (24 hrs SLA)
    - Archive documents
    - Update customer tier
    - Send satisfaction survey

---

## 🔌 API ENDPOINTS QUICK REFERENCE

### Base Number Management
```
POST   /base-numbers/generate
GET    /base-numbers/{baseNumber}
GET    /base-numbers/{baseNumber}/history
POST   /base-numbers/{baseNumber}/validate
```

### Customer Management
```
POST   /customers
GET    /customers/{customerId}
POST   /customers/{customerId}/calculate-tier
GET    /customers/{customerId}/payment-terms
```

### Document Lifecycle
```
POST   /documents/{baseNumber}/advance-stage
GET    /documents/{baseNumber}/lifecycle
GET    /documents/{baseNumber}/audit-trail
```

### Workflow Orchestration
```
POST   /workflows/{baseNumber}/start
POST   /workflows/{baseNumber}/advance
GET    /workflows/{baseNumber}/status
```

### Application Registry
```
POST   /registry/applications
GET    /registry/applications/{appId}/health
POST   /registry/applications/{appId}/webhooks/register
```

---

## 🌐 EXTERNAL INTEGRATION URLS

### Microsoft 365
- **Auth**: `https://login.microsoftonline.com/[TENANT_ID]`
- **SharePoint**: `https://shopfrontgroup.sharepoint.com`
- **API**: `https://graph.microsoft.com/v1.0`

### Xero
- **Login**: `https://login.xero.com`
- **API**: `https://api.xero.com/api.xro/2.0`

### Companies House (Configured ✅)
- **Portal**: `https://wck2.companieshouse.gov.uk`
- **API**: `https://api.company-information.service.gov.uk`

### Logikal
- **Portal**: `https://www.bmaluminium.co.uk/`

### Time Finance (Planned)
- **Portal**: `https://e3.time-finance.dancerace-apps.com/timefinance/e3intro`

---

## 📝 KEY COMPANY PROCEDURES

### PROC-CUST-001: Customer Onboarding
**SLA**: 24 hours from initial contact  
**Steps**: Contact → Info Collection → Credit Check → Account Setup → First Quote

### PROC-QUOTE-001: Quotation
**SLA**: 48 hours (standard), 24 hours (urgent)  
**Steps**: Site Survey → Specification → Pricing → Approval → Generation → Delivery

### PROC-ORDER-001: Order Processing
**SLA**: 2 hours from PO receipt  
**Steps**: Receipt → Credit Check → Confirmation → Scheduling → Tracking

### PROC-PROD-001: Production
**SLA**: 5-20 days depending on complexity  
**Steps**: Review → Preparation → Assembly → QC → Finishing → Inspection

### PROC-DEL-001: Delivery & Installation
**SLA**: Per agreed schedule  
**Steps**: Scheduling → Prep → Installation → Sign-Off → Post-Delivery

### PROC-INV-001: Invoicing & Payment
**SLA**: Invoice within 24 hrs of delivery  
**Steps**: Generation → Review → Delivery → Monitoring → Reconciliation

### PROC-WARR-001: Warranty & After-Sales
**Coverage**: 12 months standard  
**Steps**: Registration → Claim → Assessment → Repair → Closure

---

## 🔧 ENVIRONMENT VARIABLES CHECKLIST

### ✅ Already Configured
```bash
# Stored in /home/ubuntu/.config/abacusai_auth_secrets.json
COMPANIES_HOUSE_API_KEY=[configured]
TWILIO_ACCOUNT_SID=[configured]
TWILIO_AUTH_TOKEN=[configured]
```

### ⏳ To Be Configured

#### Microsoft 365
```bash
M365_CLIENT_ID=
M365_TENANT_ID=
M365_CLIENT_SECRET=
M365_REDIRECT_URI=
SHAREPOINT_SITE_ID=
```

#### Xero
```bash
XERO_CLIENT_ID=
XERO_CLIENT_SECRET=
XERO_REDIRECT_URI=
XERO_WEBHOOK_KEY=
XERO_TENANT_ID=
```

#### Logikal
```bash
LOGIKAL_API_URL=
LOGIKAL_API_KEY=
LOGIKAL_USERNAME=
LOGIKAL_PASSWORD=
```

#### SFG Core System
```bash
SFG_ORCHESTRATOR_KEY=
SFG_API_GATEWAY_URL=
BASE_NUMBER_SERVICE_URL=
WORKFLOW_SERVICE_URL=
CUSTOMER_SERVICE_URL=
```

---

## 🚀 IMPLEMENTATION ROADMAP

### Phase 1: Core Foundation (Weeks 1-4)
- Base Number Management API
- Customer & Staff Management
- Document Lifecycle Engine

### Phase 2: Key Integrations (Weeks 5-8)
- Xero Integration (OAuth + Webhooks)
- SharePoint Integration (Document Storage)
- Logikal Integration (Pricing API)

### Phase 3: Workflow Automation (Weeks 9-12)
- Workflow Engine & Orchestration
- Event Bus & Message Routing
- API Gateway & Security

### Phase 4: Advanced Features (Weeks 13+)
- AI-AutoStack Partnership Features
- Mobile Sync Capabilities
- Analytics & Business Intelligence

---

## 📚 APPLICATIONS DISCOVERED (From Bookmarks)

### Business Systems
- Microsoft 365 (Email, SharePoint, Teams)
- Xero Accounting
- BigChange JobWatch (Workforce Management)
- RingCentral (VoIP)

### Government & Compliance
- Companies House ✅
- HMRC & Gov.UK Services
- SSIP, SafeContractor, CHAS (Safety Certification)

### Site Management
- INTU Contractor Tracking
- Landsec Portal
- Mace SCM
- RiskWise (S2 Partnership)

### Suppliers & Partners
- BM Aluminium (Logikal)
- Senior Architectural Systems
- Various hardware and material suppliers

### Financial Services
- Nationwide Banking
- Santander Business Banking
- Barclays
- Creditsafe UK

---

## 🎯 KEY DECISIONS & SOURCE OF TRUTH

| Domain | Source of Truth | Notes |
|--------|-----------------|-------|
| **Authentication** | Microsoft 365 | SSO for all internal apps |
| **Financial Data** | Xero | Invoices, payments, contacts |
| **Technical Drawings** | Logikal | Pricing and specifications |
| **Documents** | SharePoint | All business documents |
| **Customer Data** | SFG Core System | Master customer database |
| **Base Numbers** | SFG Core System | Immutable document identifiers |
| **Workflows** | SFG Core System | Business process automation |

---

## 📞 NEXT STEPS

1. **Review** this summary with stakeholders
2. **Prioritize** which integrations to implement first
3. **Configure** environment variables for priority integrations
4. **Develop** SFG Core System APIs
5. **Test** with sample data
6. **Deploy** to production incrementally

---

## 📄 DOCUMENTS GENERATED

1. **SFG_Complete_Application_Inventory.md** (2,563 lines)
   - Complete technical documentation
   - All API endpoints and schemas
   - Detailed workflows and procedures

2. **SFG_Application_Inventory_Summary.md** (This document)
   - Executive summary
   - Quick reference guide
   - Implementation roadmap

---

**For the complete detailed documentation, refer to:**  
`/home/ubuntu/SFG_Complete_Application_Inventory.md`

**Generated by**: DeepAgent (Abacus.AI)  
**Date**: October 30, 2025

