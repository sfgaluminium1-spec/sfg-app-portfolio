# SFG-Aluminium-Unified-Dashboard

**Platform:** Next.js 14 / React / TypeScript  
**Category:** sfg-aluminium-app  
**Status:** production  
**Deployment:** https://sfg-unified-brain.abacusai.app

## 🎯 Purpose

Unified dashboard for SFG Aluminium business operations, integrating customer management, quotes, orders, invoicing, and AI-powered assistance

## ✨ Capabilities

- Unified business dashboard with real-time KPIs
- Customer enquiry management
- Quote generation with SFG pricing margins
- Order tracking and management
- Invoice processing and financial reporting
- Credit checking integration
- AI chatbot for customer support
- Document management via SharePoint integration
- Xero accounting integration
- API hub for external integrations
- System status monitoring
- Analytics and reporting

## 🔄 Workflows


### Enquiry to Quote

Convert customer enquiry to formal quote

**Steps:**
1. Receive customer enquiry via portal
2. Check customer credit (if order value > £10,000)
3. Calculate pricing with 15-25% margin
4. Get tier-based approval if needed
5. Generate professional quote document
6. Send to customer via email
7. Create SharePoint project folder
8. Track quote status (SENT → ACC)


### Quote to Order

Convert accepted quote to production order

**Steps:**
1. Customer accepts quote
2. Perform final credit check
3. Get approval based on value tier
4. Create production order
5. Schedule fabrication
6. Generate invoice via Xero
7. Notify production team
8. Track order status (ORD → FAB → INS)


### Invoice to Payment

Invoice generation and payment tracking

**Steps:**
1. Generate invoice in Xero
2. Send invoice to customer
3. Track payment status
4. Send payment reminders
5. Record payment received
6. Update customer balance
7. Mark order as complete (PAID)


### Credit Check

Automated credit checking for high-value orders

**Steps:**
1. Detect order value > £10,000
2. Query Companies House for company data
3. Perform Experian credit check via MCP-FINANCE
4. Calculate credit limit
5. Store credit check result (valid 90 days)
6. Approve or escalate based on credit score


## 📋 Business Rules


### Minimum margin 15%

- **Condition:** margin >= 0.15
- **Action:** Allow quote generation
- **Escalation:** Warn if margin < 18%





### Credit check for orders > £10,000

- **Condition:** order_value > 10000
- **Action:** Perform credit check via Experian

- **Validity:** 90 days




### Tier-based approval limits

- **Condition:** order_value > tier_limit
- **Action:** Escalate to higher tier for approval




**Tiers:**
- T1 (Director): £1,000,000
- T2 (Senior Manager): £100,000
- T3 (Manager): £25,000
- T4 (Supervisor): £10,000
- T5 (Staff): £1,000


### Document stage progression

- **Condition:** N/A
- **Action:** Track document through lifecycle


- **Stages:** ENQ → QUO → SENT → ACC → ORD → FAB → INS → INV → PAID



### Customer tier classification

- **Condition:** N/A
- **Action:** N/A




**Tiers:**
- Platinum: Highest priority, best rates
- Sapphire: High priority, good rates
- Steel: Standard priority
- Green: New customer
- Crimson: Requires attention


## 🔗 Integrations

- **NEXUS** (hub): Orchestration and event coordination
- **Xero** (external-api): Accounting, invoicing, financial data
- **SharePoint** (external-api): Document storage and management
- **Companies House** (external-api): Company data lookup and verification
- **Experian** (external-api): Credit checking and risk assessment
- **MCP-SALES** (mcp-server): Sales tools and CRM integration
- **MCP-FINANCE** (mcp-server): Finance tools and credit checking
- **MCP-OPERATIONS** (mcp-server): Operations and production tools
- **MCP-COMMUNICATIONS** (mcp-server): Email and SMS communication
- **MCP-DATA** (mcp-server): Data analysis and reporting

## 🔔 Webhook Events

This app listens for the following events from NEXUS:

- `enquiry.created`
- `quote.requested`
- `order.approved`
- `customer.registered`
- `credit.check_required`
- `invoice.due`
- `payment.received`

**Webhook URL:** https://sfg-unified-brain.abacusai.app/api/webhooks/nexus

## 💬 Supported Messages

This app can handle the following message types:

- `query.customer_data`
- `query.quote_status`
- `query.order_status`
- `action.create_quote`
- `action.approve_order`
- `action.send_invoice`
- `action.check_credit`
- `query.production_schedule`

**Message Handler URL:** https://sfg-unified-brain.abacusai.app/api/messages/handle

## 🛠️ Technical Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** React + Tailwind CSS + shadcn/ui
- **Charts:** Chart.js + Recharts
- **Database:** PostgreSQL via Prisma
- **Authentication:** NextAuth.js
- **Deployment:** Abacus.AI Platform

## 📦 Repository

This is a registered app in the SFG App Portfolio.

**Registered:** 2025-11-05  
**Last Updated:** 2025-11-05

---

*Registered via automated self-registration system*
