
# 🏗️ SFG Aluminium Unified Application Inventory & Integration Framework

**Document Version:** 1.0.0  
**Created:** September 8, 2025  
**Status:** Active Extraction & Documentation Phase

---

## 📋 **Executive Overview**

This document serves as the master inventory for all SFG Aluminium applications, their integrations, data models, workflows, and business procedures extracted from legacy systems.

### **Ecosystem Applications Identified:**
1. **SFG Aluminium Ltd** (Main Website - Current Focus)
2. **SFG Architectural**
3. **SFG Glass New**
4. **SFG Maintain**
5. **Roller Shutter Co**
6. **Roller Shutter Manchester**
7. **Shopfront Group**
8. **Comet Core** (Planned)
9. **Brand Engine** (Planned)
10. **AI-AutoStack** (Planned)
11. **ESP Platform** (Planned)
12. **QuickSpace** (Planned)

---

## 🎯 **Phase 1: Legacy Content Extraction**

### **Source Directories from Bluehost:**
```
/public_html/rollershutterco
/public_html/rollershuttercoco
/public_html/rollershuttermanchester-co-uk
/public_html/rollershuttermanchesterco
/public_html/sfg-site-images
/public_html/sfgaluminiumco
/public_html/sfgarchitecturalco
/public_html/sfgglassnew
/public_html/sfgmaintain.com
/public_html/sfgmaintainco
/public_html/shopfrontgroup
```

### **Extraction Targets:**
- [ ] Business procedures documentation
- [ ] Product catalogs and specifications
- [ ] Service descriptions and workflows
- [ ] Customer testimonials and case studies
- [ ] Team information and organizational structure
- [ ] Contact information and service areas
- [ ] Technical documentation and guides
- [ ] Images and media assets
- [ ] Form structures and data collection points
- [ ] Integration points and API documentation

---

## 🏢 **Application Metadata Template**

### **Template for Each Application:**

#### **Application: [NAME]**

##### **1. Core Identification**
```yaml
Application Name: 
Base URLs:
  Production: 
  Staging: 
  Development: 
Version: 
Deployment Status: [Production | Beta | Dev | Planned]
Owner/Maintainer: 
Repository: 
Documentation URL: 
```

##### **2. Authentication & Authorization**
```yaml
Auth Method: [Bearer Token | API Key | OAuth2 | JWT]
Credentials Flow: 
Environment Variables:
  - AUTH_KEY: 
  - API_URL: 
  - SECRET_KEY: 
Header Names:
  - Authorization: 
  - X-API-Key: 
Scopes/Permissions Required: 
```

##### **3. Owned Entities & Data Models**
```typescript
// Customer Entity
interface Customer {
  id: string
  baseNumber: string
  name: string
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  creditLimit: number
  paymentTerms: number // days
  contactMethods: {
    email: string
    phone: string
    whatsapp?: string
  }
  xeroSync: {
    xeroContactId?: string
    lastSyncDate?: Date
    syncStatus: 'pending' | 'synced' | 'error'
  }
  createdDate: Date
  modifiedDate: Date
  status: 'active' | 'inactive' | 'suspended'
}

// Staff Member Entity
interface StaffMember {
  id: string
  name: string
  tier: number // 1-5
  department: string
  quotingLimit: number
  permissions: string[]
  email: string
  phone: string
  status: 'active' | 'inactive'
}

// Base Number Entity
interface BaseNumber {
  value: string // Immutable
  createdDate: Date
  createdBy: string // Staff ID
  status: 'active' | 'archived'
  associatedDocuments: string[]
}

// Document Entity
interface Document {
  id: string
  baseNumber: string
  prefix: 'ENQ' | 'QUO' | 'INV' | 'PO' | 'DEL' | 'PAID'
  fullReference: string // e.g., "ENQ-2025-001234"
  currentStage: string
  auditTrail: WorkflowStep[]
  customerId: string
  assignedStaffId: string
  metadata: Record<string, any>
  createdDate: Date
  modifiedDate: Date
}

// Workflow Step Entity
interface WorkflowStep {
  timestamp: Date
  performedBy: string // Staff ID
  notes: string
  fromStage: string
  toStage: string
  action: string
  metadata?: Record<string, any>
}
```

##### **4. API Endpoints**
```yaml
Base API URL: https://api.sfgaluminium.com/v1

Endpoints:
  # Base Number Management
  POST /base-numbers/generate:
    Description: Generate new base number
    Auth: Required (Staff Tier 2+)
    Request: { entityType: string, metadata?: object }
    Response: { baseNumber: string, createdDate: string }
  
  GET /base-numbers/{baseNumber}:
    Description: Get base number details
    Auth: Required (Staff Tier 1+)
    Response: { baseNumber, status, history, documents }
  
  GET /base-numbers/{baseNumber}/history:
    Description: Get base number audit trail
    Auth: Required (Staff Tier 1+)
    Response: { history: WorkflowStep[] }

  # Document Lifecycle
  POST /documents/create:
    Description: Create new document
    Auth: Required (Staff Tier 2+)
    Request: { baseNumber, prefix, customerId, metadata }
    Response: { documentId, fullReference }
  
  PUT /documents/{documentId}/advance:
    Description: Advance document to next stage
    Auth: Required (Staff Tier based on stage)
    Request: { toStage, notes, performedBy }
    Response: { success, newStage, auditEntry }
  
  GET /documents/{documentId}/audit:
    Description: Get document audit trail
    Auth: Required (Staff Tier 1+)
    Response: { auditTrail: WorkflowStep[] }

  # Customer Management
  GET /customers:
    Description: List customers with pagination
    Auth: Required (Staff Tier 1+)
    Query: { page, limit, tier?, status? }
    Response: { customers: Customer[], total, page, pages }
  
  POST /customers:
    Description: Create new customer
    Auth: Required (Staff Tier 2+)
    Request: Customer (without id)
    Response: { customer: Customer }
  
  GET /customers/{customerId}/tier:
    Description: Get customer tier calculation
    Auth: Required (Staff Tier 1+)
    Response: { tier, creditLimit, paymentTerms, calculation }
  
  PUT /customers/{customerId}/tier:
    Description: Update customer tier
    Auth: Required (Staff Tier 3+)
    Request: { tier, reason, approvedBy }
    Response: { success, newTier }

  # Staff & Permissions
  POST /permissions/check:
    Description: Check staff permissions
    Auth: Required
    Request: { staffId, action, resource }
    Response: { allowed: boolean, reason?: string }
  
  GET /staff/{staffId}/limits:
    Description: Get staff quoting limits
    Auth: Required (Staff Tier 1+)
    Response: { quotingLimit, tier, permissions }

  # Workflow Orchestration
  POST /workflows/start:
    Description: Start new workflow
    Auth: Required (Staff Tier 2+)
    Request: { workflowType, entityId, metadata }
    Response: { workflowId, status, nextSteps }
  
  PUT /workflows/{workflowId}/advance:
    Description: Advance workflow
    Auth: Required (Tier based on step)
    Request: { action, notes, data }
    Response: { success, currentStep, nextSteps }
  
  GET /workflows/{workflowId}/status:
    Description: Get workflow status
    Auth: Required (Staff Tier 1+)
    Response: { status, currentStep, history, blockers }

Rate Limits:
  General: 100 requests/minute
  Authentication: 10 requests/minute
  Document Creation: 50 requests/hour
  Bulk Operations: 10 requests/minute

Pagination:
  Default Page Size: 50
  Maximum Page Size: 100
  Cursor-based: Yes (for large datasets)
```

##### **5. Webhooks & Events**

```yaml
Webhooks to Receive:
  - Endpoint: /webhooks/customer-created
    Categories: [customer_management]
    Payload: { event: "customer.created", data: Customer }
  
  - Endpoint: /webhooks/quote-approved
    Categories: [document_lifecycle]
    Payload: { event: "quote.approved", data: Document }
  
  - Endpoint: /webhooks/payment-received
    Categories: [financial]
    Payload: { event: "payment.received", data: Payment }

Webhooks to Send:
  - Target: Xero Integration
    Categories: [invoice_created, payment_received]
    Endpoint: https://xero.sfgaluminium.com/webhooks
  
  - Target: CRM System
    Categories: [customer_updated, quote_sent]
    Endpoint: https://crm.sfgaluminium.com/webhooks

Event Types Published:
  - customer.created
  - customer.updated
  - customer.tier_changed
  - quote.created
  - quote.approved
  - quote.rejected
  - invoice.created
  - invoice.paid
  - delivery.scheduled
  - delivery.completed
  - document.stage_changed

Event Types Listened:
  - payment.received (from Xero)
  - email.opened (from ESP)
  - form.submitted (from website)
  - support.ticket_created (from helpdesk)
```

##### **6. MCP/AgentPass Server Configuration**

```yaml
Server Orchestrator: SFG Complete System Orchestrator
Workspace: AGENTPASS_SFG_WORKSPACE

MCP Servers:
  - Name: base-number-server
    Tools:
      - generate_base_number
      - validate_base_number
      - get_base_number_history
    Auth: COMETCORE_API_KEY
    Docs: https://docs.sfgaluminium.com/mcp/base-numbers
  
  - Name: document-lifecycle-server
    Tools:
      - create_document
      - advance_document
      - get_document_audit
    Auth: SFGORCHESTRATOR_KEY
    Docs: https://docs.sfgaluminium.com/mcp/documents
  
  - Name: permissions-server
    Tools:
      - check_staff_permission
      - enforce_tier_limits
      - get_user_permissions
    Auth: PERMISSIONS_API_KEY
    Docs: https://docs.sfgaluminium.com/mcp/permissions

Key Environment Variables:
  - COMETCORE_API_KEY
  - SFGORCHESTRATOR_KEY
  - AGENTPASS_WORKSPACE
  - BASE_NUMBER_SERVICE_URL
  - XERO_CLIENT_ID
  - XERO_CLIENT_SECRET

Tool Responsibilities:
  - Cross-app knowledge sharing
  - Workflow enforcement
  - Base number generation/validation
  - Permission checking
  - Document lifecycle management
  - Tier calculation and enforcement
```

##### **7. Decision Confirmations & Source of Truth**

```yaml
Source of Truth Domains:
  Customer Data: Comet Core (synced to Xero)
  Base Numbers: Base Number Generator (immutable)
  Documents: Document Lifecycle Service
  Permissions: Permissions Service
  Financial Data: Xero (synced from Document Service)
  Product Catalog: Brand Engine
  Marketing Content: ESP Platform
  Support Tickets: QuickSpace

Uses Base Number Generator: Yes/No
Document Prefixes Handled:
  - ENQ (Enquiry)
  - QUO (Quote)
  - INV (Invoice)
  - PO (Purchase Order)
  - DEL (Delivery)
  - PAID (Payment Confirmation)

Staff Tier Permissions Required:
  Read Operations: Tier 1+
  Create Documents: Tier 2+
  Approve Quotes: Tier 3+
  Modify Customers: Tier 3+
  Financial Operations: Tier 4+
  System Administration: Tier 5+

Customer Tier Permissions:
  Bronze: View quotes, limited history
  Silver: Full history, priority support
  Gold: Advanced features, account manager
  Platinum: Premium services, API access
```

##### **8. Deployment & Monitoring**

```yaml
Deployment Status: [Production | Beta | Dev | Planned]
Current Version: 
Last Deployed: 
Next Planned Release: 

Health Check Endpoint: /health
Response: { status: "healthy", version: "x.x.x", uptime: number }

Monitoring Endpoints:
  Metrics: /metrics
  Logs: /logs
  Traces: /traces

Logging Level: [DEBUG | INFO | WARN | ERROR]
Log Destination: [CloudWatch | Elasticsearch | File]

Alerts Configured:
  - High error rate (>5% in 5 min)
  - Response time >500ms (p95)
  - Service unavailable
  - Database connection issues
```

##### **9. Integration Points**

```yaml
Integrates With:
  - Xero: Financial sync, invoice creation
  - Microsoft 365: Email, SharePoint documents
  - WhatsApp Business: Customer notifications
  - Google Maps: Service area visualization
  - Payment Gateway: Stripe/PayPal integration
  - SMS Gateway: Twilio for notifications

Data Flow:
  Incoming:
    - Customer data from website forms
    - Payment confirmations from Xero
    - Support requests from QuickSpace
  
  Outgoing:
    - Invoice data to Xero
    - Customer notifications to ESP
    - Document PDFs to SharePoint
```

---

## 🔄 **Standard Workflow Examples**

### **Workflow 1: Enquiry to Quote Process**

#### **Step-by-Step Detail:**

```yaml
1. Inquiry Received:
   Channel: [Website Form | Phone | Email | WhatsApp]
   Data Captured:
     - Customer name
     - Contact details (phone, email)
     - Project type
     - Location
     - Budget range
     - Timeline
     - Specific requirements
   Staff Assigned: Auto-assign based on location/type
   Action: Generate base number, create ENQ document
   
2. Initial Assessment:
   Staff Action: Review enquiry, determine viability
   Data Updated:
     - Feasibility score
     - Required site survey (Yes/No)
     - Estimated quote value
   Decision Point:
     - Proceed to quote: Continue
     - Not viable: Mark as declined, send polite response
   
3. Site Survey (if required):
   Staff Action: Schedule survey appointment
   Data Captured:
     - Site measurements
     - Photos
     - Technical constraints
     - Access requirements
   Document: Survey report attached to ENQ
   
4. Quote Creation:
   Staff Action: Create QUO document from ENQ
   Permissions Required: Tier 2+ staff
   Data Generated:
     - Line items with specifications
     - Pricing (based on staff tier limits)
     - Payment terms (based on customer tier)
     - Validity period
   Workflow: ENQ -> QUO (base number carried forward)
   
5. Quote Review & Approval:
   Review By: Senior staff (Tier 3+) if exceeds junior limits
   Checks:
     - Pricing accuracy
     - Margin verification
     - Customer tier compatibility
   Action: Approve or request revisions
   
6. Quote Sent to Customer:
   Channels: Email (PDF), WhatsApp (link), Portal (if registered)
   Event Published: quote.sent
   Tracking: Email opens, link clicks
   Follow-up: Auto-reminder after 7 days
   
7. Customer Response:
   Options:
     a) Accept Quote:
        - Customer confirmation captured
        - QUO -> Convert to order workflow
        - Trigger: order_confirmed event
     
     b) Request Changes:
        - Create QUO revision (QUO-R01, QUO-R02, etc.)
        - Maintain base number
        - Restart from step 4
     
     c) Decline:
        - Mark quote as declined
        - Capture decline reason
        - Event: quote.declined
        - Archive with audit trail

Audit Trail Captured:
  - Timestamp of each action
  - Staff member performing action
  - Stage transitions
  - Customer interactions
  - Document revisions
  - Email/notification history
```

### **Workflow 2: Order to Delivery Process**

```yaml
1. Order Confirmation:
   Trigger: Quote acceptance
   Action: Create PO document from QUO
   Staff: Automatically assigned project manager
   Data:
     - Confirmed specifications
     - Agreed pricing
     - Payment schedule
     - Delivery timeline
   Customer Notification: Order confirmation email
   
2. Deposit Payment:
   Amount: Based on customer tier and project value
   Payment Methods: Bank transfer, card, finance
   Verification: Match payment to PO
   Event: payment.received (deposit)
   Action: Advance to production scheduling
   
3. Production Scheduling:
   Staff Action: Schedule manufacturing/installation
   Data Captured:
     - Production slot
     - Material requirements
     - Team assignment
     - Customer availability
   Dependencies: Deposit confirmed, materials available
   
4. Production/Procurement:
   Activities:
     - Custom manufacturing (if applicable)
     - Material procurement
     - Quality checks
   Updates: Progress milestones recorded
   Customer Notifications: Regular progress updates
   
5. Pre-Delivery Inspection:
   Staff Action: Quality assurance check
   Checklist:
     - Specifications met
     - Quality standards
     - Packaging/protection
   Document: Inspection report attached to PO
   
6. Delivery Scheduling:
   Staff Action: Coordinate delivery/installation
   Customer: Confirm date and access
   Create: DEL document from PO
   Resources: Assign installation team, transport
   
7. Delivery/Installation:
   Activities:
     - Site preparation
     - Installation
     - Customer walkthrough
     - Sign-off
   Documentation:
     - Installation photos
     - Customer signature
     - Handover documents
   Event: delivery.completed
   
8. Invoice Generation:
   Trigger: Delivery completion + customer sign-off
   Action: Create INV document from PO
   Data:
     - Final balance due
     - Payment terms (based on customer tier)
     - Payment methods
   Xero Sync: Auto-create invoice in Xero
   Send: Invoice to customer (email, portal)
   
9. Final Payment:
   Monitor: Payment due date
   Actions:
     - Send reminders (based on customer tier)
     - Escalate if overdue
   Payment Received:
     - Verify payment amount
     - Match to INV
     - Event: payment.received (final)
     - Create: PAID document
   
10. Post-Completion:
    Activities:
      - Request customer testimonial/review
      - Schedule PPM follow-up (if applicable)
      - Archive project documents
      - Update customer tier calculation
    SharePoint: Upload all documents
    CRM: Update customer record with project history

Audit Trail:
  - Every stage transition
  - Payment confirmations
  - Delivery sign-offs
  - Customer communications
  - Document generations
```

---

## 🎨 **Design & Theme Consistency**

### **Theme Tokens**

```typescript
// Warren Executive Theme Configuration
const themeTokens = {
  // Primary Colors
  colors: {
    primary: {
      blue: '#2563eb',      // Warren Executive Blue
      darkBlue: '#1e40af',
      lightBlue: '#3b82f6',
      metallicBlue: '#60a5fa'
    },
    metallics: {
      silver: '#94a3b8',
      chrome: '#cbd5e1',
      platinum: '#e2e8f0',
      gold: '#fbbf24'       // Accent for premium tiers
    },
    status: {
      active: '#10b981',    // Green
      pending: '#f59e0b',   // Amber
      error: '#ef4444',     // Red
      inactive: '#6b7280'   // Gray
    },
    tiers: {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2'
    },
    stages: {
      enquiry: '#3b82f6',   // Blue
      quote: '#8b5cf6',     // Purple
      order: '#f59e0b',     // Amber
      delivery: '#10b981',  // Green
      paid: '#059669'       // Dark green
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: 'Inter, sans-serif',
      heading: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    }
  },
  
  // Spacing
  spacing: {
    unit: 8, // Base unit in pixels
    scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
  },
  
  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)'
    }
  }
}

// Customer Tier Visual Indicators
const tierBadges = {
  bronze: {
    background: 'linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)',
    icon: 'Bronze',
    features: ['Basic support', 'Standard pricing']
  },
  silver: {
    background: 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%)',
    icon: 'Silver',
    features: ['Priority support', '5% discount', 'Extended warranty']
  },
  gold: {
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    icon: 'Gold',
    features: ['Premium support', '10% discount', 'Account manager']
  },
  platinum: {
    background: 'linear-gradient(135deg, #e5e4e2 0%, #f8f9fa 100%)',
    icon: 'Platinum',
    features: ['VIP support', '15% discount', 'Dedicated team', 'API access']
  }
}

// Document Stage Visual Flow
const stageFlow = {
  enquiry: { color: '#3b82f6', icon: 'FileQuestion', label: 'Enquiry' },
  quote: { color: '#8b5cf6', icon: 'FileText', label: 'Quote' },
  order: { color: '#f59e0b', icon: 'ShoppingCart', label: 'Order' },
  production: { color: '#06b6d4', icon: 'Cog', label: 'Production' },
  delivery: { color: '#10b981', icon: 'Truck', label: 'Delivery' },
  invoice: { color: '#f59e0b', icon: 'FileInvoice', label: 'Invoice' },
  paid: { color: '#059669', icon: 'CheckCircle', label: 'Paid' }
}
```

### **Shared Brand Assets**

```yaml
Logo Files:
  Primary: /public/assets/logo/sfg-aluminium-primary.svg
  White: /public/assets/logo/sfg-aluminium-white.svg
  Icon: /public/assets/logo/sfg-aluminium-icon.svg
  
Favicon:
  Standard: /public/favicon.ico
  Apple Touch: /public/apple-touch-icon.png
  Manifest: /public/site.webmanifest

Brand Guidelines:
  Document: /docs/brand-guidelines.pdf
  Theme Config: /config/theme.json
  Component Library: /components/ui/*
```

---

## ✅ **Integration Checklist**

### **Phase 1: Foundation (Current)**
- [x] Next.js project initialized
- [x] Warren Executive Theme implemented
- [x] Advanced video hero system
- [x] Version tracking system
- [x] Basic authentication endpoints
- [ ] Legacy content extraction started
- [ ] Application inventory documented

### **Phase 2: Core Infrastructure**
- [ ] Base number generator service deployed
- [ ] Document lifecycle API implemented
- [ ] Permission/tier system deployed
- [ ] Customer management API
- [ ] Staff management system
- [ ] Workflow orchestration engine

### **Phase 3: Integrations**
- [ ] Xero integration (invoices, payments)
- [ ] Microsoft 365 integration (email, SharePoint)
- [ ] WhatsApp Business API
- [ ] SMS notifications (Twilio)
- [ ] Payment gateway (Stripe/PayPal)
- [ ] Email service provider

### **Phase 4: MCP/AgentPass**
- [ ] MCP server orchestrator configured
- [ ] Tool registration complete
- [ ] Cross-app knowledge sharing active
- [ ] Workflow enforcement tools deployed
- [ ] Environment variables configured

### **Phase 5: Advanced Features**
- [ ] Application registry service
- [ ] Health check monitoring
- [ ] Event routing/webhook distribution
- [ ] Rate limiting implemented
- [ ] Comprehensive logging/monitoring

---

## 📊 **Next Actions Required**

### **Immediate Tasks:**

1. **Extract Legacy Content**
   - [ ] Download all files from Bluehost directories
   - [ ] Catalog existing pages and content
   - [ ] Extract business procedures documentation
   - [ ] Identify product catalogs
   - [ ] Map service workflows
   - [ ] Extract customer testimonials
   - [ ] Catalog images and media

2. **Document Each Application**
   - [ ] SFG Architectural procedures
   - [ ] SFG Glass workflows
   - [ ] SFG Maintain PPM processes
   - [ ] Roller Shutter systems
   - [ ] Shopfront Group operations

3. **Data Model Finalization**
   - [ ] Finalize Customer schema
   - [ ] Finalize Document schema
   - [ ] Finalize Workflow schema
   - [ ] Design database structure
   - [ ] Plan migration strategy

4. **API Development Priority**
   - [ ] Base number generation endpoint
   - [ ] Document lifecycle API
   - [ ] Customer tier calculation
   - [ ] Permission checking system

---

## 🎯 **Questions to Answer for Each Legacy Site**

For each old website (SFG Architectural, SFG Glass, SFG Maintain, Roller Shutter, etc.):

### **Data & Content:**
1. What products/services are offered?
2. What pricing structures exist?
3. What customer data is captured?
4. What documents/forms are used?
5. What workflows are documented?

### **Technical:**
6. What integrations exist (Xero, CRM, etc.)?
7. What automation is in place?
8. What APIs or webhooks are used?
9. What database structure exists?
10. What authentication/permissions are needed?

### **Business Logic:**
11. What approval processes exist?
12. What tier/permission systems are used?
13. What document numbering systems?
14. What customer tier calculations?
15. What workflow stages and transitions?

### **Content & Assets:**
16. What images/media need migrating?
17. What PDFs/documents exist?
18. What case studies/testimonials?
19. What technical specifications?
20. What SEO content to preserve?

---

**Status:** 📋 Ready for Legacy Content Extraction

*This document will be updated as applications are documented and integrated.*
