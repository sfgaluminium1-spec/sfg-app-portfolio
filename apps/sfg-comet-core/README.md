# SFG COMET CORE

[![Version](https://img.shields.io/badge/version-1.2.0-blue)]()
[![Status](https://img.shields.io/badge/status-Production-green)]()
[![Category](https://img.shields.io/badge/category-core-hub-orange)]()

**Version:** 1.2.0  
**Category:** core-hub  
**Status:** ✅ Production Ready  
**Deployment:** https://sfg-comet-core.abacusai.app

---

## 📋 Description

SFG COMET CORE is the central orchestration hub for SFG Aluminium's business operations, serving as the primary desktop and document management system. Built with Next.js 14, TypeScript, and PostgreSQL, it integrates with five specialized MCP (Model Context Protocol) servers via AgentPass.ai for Sales, Finance, Operations, Communications, and Data management. The system features a RAG (Retrieval-Augmented Generation) Truth System powered by ChromaDB and PostgreSQL, storing all business rules and logic in a vector database for AI-queryable intelligence. COMET CORE manages the complete project lifecycle through six stages (New Enquiry, Viability Check, Pre-Production, Production, Final Inspection, Invoicing) with automated document numbering, anti-drift protection, and comprehensive audit logging. It provides real-time credit checking via Companies House and Experian integration, tier-based staff permissions (Tier 1-3 access control), and seamless integration with external systems including Xero accounting, Microsoft Graph for SharePoint/Outlook, Gmail, and Twilio SMS. The application serves as the single source of truth for all SFG Aluminium operations, orchestrating data flow between satellite applications and maintaining centralized business intelligence.

---

## 🎯 Capabilities

1. Complete project lifecycle management with 6-stage workflow (New Enquiry → Viability Check → Pre-Production → Production → Final Inspection → Invoicing)
2. Automated document numbering system with anti-drift protection and verification (format: ENQ-YYYY-###, VC-YYYY-###, etc.)
3. Real-time credit checking and scoring via Companies House API with AI-powered financial analysis and automated alerts
4. RAG Truth System with ChromaDB vector database storing all business rules, logic, and operational intelligence for AI-queryable insights
5. MCP orchestration layer integrating 5 specialized servers (Sales, Finance, Operations, Communications, Data) via AgentPass.ai
6. Tier-based staff permissions and approval workflows (Tier 1: Sales, Tier 2: Management, Tier 3: Executive)
7. Comprehensive document management with S3 cloud storage, version control, and audit logging for all file operations
8. Real-time activity feed and notification system with Slack/Teams integration for team collaboration and updates
9. External API integrations (Xero accounting, Microsoft Graph SharePoint/Outlook, Gmail, Twilio SMS) with centralized credential vault
10. Advanced analytics dashboard with project metrics, conversion rates, stage duration analysis, and financial KPIs

---

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: Tailwind CSS, shadcn/ui (glassmorphic design)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 14 with Prisma ORM
- **Authentication**: NextAuth.js with JWT sessions
- **Storage**: AWS S3 for document management
- **Vector DB**: ChromaDB for RAG Truth System
- **Deployment**: Abacus.AI Platform
- **Orchestration**: AgentPass.ai + NEXUS

### Database Schema (11 Tables)

- **users** - User accounts with tier-based permissions
- **projects** - Main project records with 6-stage workflow
- **comments** - Activity feed and collaboration
- **documents** - File metadata with S3 references
- **credit_checks** - Companies House credit results
- **approvals** - Multi-tier approval workflows
- **activity_logs** - Comprehensive audit trail
- **notifications** - Real-time notification queue
- **rag_documents** - RAG system document metadata
- **mcp_events** - Webhook event history
- **api_vault** - Encrypted external API credentials

### MCP Integration

COMET CORE orchestrates 5 specialized MCP servers via AgentPass.ai:

1. **MCP-SALES** - Customer CRM, enquiry management, quote generation
2. **MCP-FINANCE** - Xero integration, invoicing, credit management
3. **MCP-OPERATIONS** - Production scheduling, material orders, logistics
4. **MCP-COMMUNICATIONS** - Email/SMS/Slack/Teams unified messaging
5. **MCP-DATA** - Data warehousing, analytics, business intelligence

---

## 🔌 Integrations

- **NEXUS** - Central orchestration layer for all SFG applications
- **MCP-SALES** - Sales CRM and customer management
- **MCP-FINANCE** - Financial system and accounting
- **MCP-OPERATIONS** - Operations and production management
- **MCP-COMMUNICATIONS** - Unified communications hub
- **MCP-DATA** - Data analytics and business intelligence
- **AgentPass.ai** - AI agent orchestration platform
- **Xero** - Accounting and invoicing
- **Microsoft Graph** - SharePoint document sync, Outlook email
- **Companies House** - UK company credit checks
- **Experian** - Advanced credit scoring (planned)
- **Gmail** - Email integration
- **Twilio** - SMS notifications

---

## 📨 Webhooks

### Incoming Events (5)

**From NEXUS and MCP servers:**

- **`customer.updated`**: Customer information updated from external CRM system (MCP-SALES), sync customer data to COMET CORE database
- **`quote.accepted`**: Customer accepted quote via external system, trigger Pre-Production workflow in COMET CORE
- **`invoice.paid`**: Invoice payment received from Xero accounting system, update project status to Completed
- **`project.milestone_reached`**: Project milestone reached from MCP-OPERATIONS, update project progress and notify team
- **`document.external_update`**: Document updated in SharePoint via Microsoft Graph, sync to COMET CORE document library


### Outgoing Events (6)

**To NEXUS and MCP servers:**

- **`enquiry.created`**: New enquiry created in COMET CORE, notify NEXUS and MCP-SALES for CRM synchronization
- **`credit_check.completed`**: Credit check completed with AI scoring, send results to NEXUS and MCP-FINANCE for risk assessment
- **`project.stage_changed`**: Project moved to new stage, notify all MCP servers and update NEXUS orchestration state
- **`document.uploaded`**: Document uploaded to COMET CORE, sync to SharePoint and notify relevant team members
- **`approval.required`**: Project requires manager/executive approval, send notification to NEXUS for workflow routing
- **`alert.critical`**: Critical system alert (credit risk, overdue project, etc.), immediate notification to all systems


**Webhook Endpoint:** `https://sfg-comet-core.abacusai.app/api/webhooks/nexus`

---

## 🚀 Quick Start

### 1. Access the Application

Visit: **https://sfg-comet-core.abacusai.app**

### 2. Login Credentials (Test)

```
Email: warren@test.com
Password: password123
```

### 3. Create New Enquiry

1. Navigate to Dashboard
2. Click "New Enquiry" button
3. Fill in customer details and product description
4. System auto-generates ENQ-YYYY-### number
5. Credit check triggered automatically (if company provided)

### 4. Run Credit Check

1. Open enquiry detail page
2. Click "Check Credit" button
3. System queries Companies House API
4. AI analyzes financial data
5. Results displayed with Healthy/Moderate/Poor score

### 5. Manage Project Workflow

1. Move project through 6 stages:
   - New Enquiry → Viability Check → Pre-Production → Production → Final Inspection → Invoicing
2. Upload documents at each stage
3. Add comments and @ mention team members
4. Approve with tier-based permissions

### 6. View Analytics Dashboard

1. Navigate to Dashboard
2. View metrics:
   - Active projects by stage
   - Total project value
   - Conversion rates
   - Average stage duration
3. Filter by date range and stage

---

## 🔐 Permissions & Tiers

### Tier 1: Sales Team
- Create and edit enquiries
- Run credit checks
- Upload documents
- Add comments
- Move projects through New Enquiry and Viability Check stages

### Tier 2: Management
- All Tier 1 permissions
- Approve Pre-Production and Production stages
- View financial reports
- Manage team members

### Tier 3: Executive
- All Tier 2 permissions
- Approve Final Inspection and Invoicing stages
- Configure system settings
- Access audit logs
- Manage API integrations

---

## 📡 API Endpoints

### Public Endpoints

- `GET /api/health` - System health check
- `GET /api/version` - Application version

### Authentication Required

- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PATCH /api/projects/:id` - Update project
- `POST /api/credit-check` - Run credit check
- `POST /api/documents/upload` - Upload document
- `GET /api/dashboard/stats` - Dashboard metrics

### Webhook Endpoints

- `POST /api/webhooks/nexus` - Receive NEXUS events
- `GET /api/webhooks/health` - Webhook system health

### RAG System Endpoints

- `POST /api/rag/query` - Query RAG Truth System
- `POST /api/rag/ingest` - Ingest business rules

---

## 🔐 Security

- **HMAC-SHA256 Signature Verification** - All webhooks validated
- **JWT Session Management** - Secure authentication with NextAuth.js
- **SSL/TLS Encryption** - All data encrypted in transit
- **Rate Limiting** - API endpoints protected (1000/hour incoming, 500/hour outgoing)
- **Tier-Based Access Control** - Permissions enforced at database level
- **Audit Logging** - All actions tracked with user, timestamp, and IP
- **API Vault** - External credentials encrypted at rest
- **Input Validation** - All user input sanitized and validated

---

## 📈 Performance Metrics

- **System Uptime**: 99.9% target
- **API Response Time**: <2 seconds average
- **Webhook Processing**: <5 seconds
- **RAG Query Time**: <500ms
- **Database Query Time**: <100ms
- **Document Upload**: <10 seconds for 10MB files

---

## 📊 Workflows

### 1. New Enquiry to Quote Workflow

Complete workflow from initial customer enquiry through credit check, viability assessment, and quote generation.

**Steps:**
1. Customer submits enquiry via email, phone, or web form
2. COMET CORE creates New Enquiry record with auto-generated ENQ-YYYY-### number
3. System triggers Companies House credit check and AI scoring
4. Credit results stored in RAG Truth System for future reference
5. Viability Check stage initiated with technical assessment
6. Quote generated with pricing, terms, and delivery timeline
7. Quote sent to customer via email with tracking
8. Status updates pushed to NEXUS and MCP-SALES

### 2. Project Approval and Production Workflow

Multi-tier approval workflow from quote acceptance through production initiation.

**Steps:**
1. Customer accepts quote, triggering approval workflow
2. Tier 2 manager reviews and approves Pre-Production stage
3. Project details synchronized with Xero for financial tracking
4. Production team receives notification via Slack/Teams
5. Production stage initiated with material orders and scheduling
6. Real-time progress updates captured in activity feed
7. Document attachments stored in S3 with version control
8. All changes logged in audit trail for compliance

### 3. Credit Check and Risk Assessment Workflow

Automated credit checking with AI-powered risk scoring and decision support.

**Steps:**
1. Credit check triggered from New Enquiry or manually by staff
2. Companies House API queried for company financial data
3. AI scoring engine analyzes financial health (Healthy/Moderate/Poor)
4. Credit results stored in PostgreSQL and ChromaDB vector DB
5. Risk assessment summary generated with recommendations
6. Alert notifications sent to sales team if risk detected
7. Credit history tracked over time for repeat customers
8. Results accessible via RAG system for future queries

### 4. Document Management and Audit Workflow

Comprehensive document lifecycle with version control and audit logging.

**Steps:**
1. User uploads document via drag-and-drop interface
2. File validated for type, size, and security
3. Document uploaded to AWS S3 with encrypted storage
4. Metadata stored in PostgreSQL (filename, size, uploaded_by, timestamp)
5. Document linked to specific project and stage
6. Access controlled based on user tier permissions
7. All document operations logged in audit trail
8. Automatic notifications sent to relevant team members

### 5. MCP Orchestration and Data Synchronization Workflow

Real-time data synchronization across 5 MCP servers via AgentPass.ai.

**Steps:**
1. COMET CORE receives data update from user action
2. Update validated against business rules in RAG Truth System
3. Event payload constructed with full context
4. Webhook sent to NEXUS orchestration layer
5. NEXUS routes event to relevant MCP servers (Sales, Finance, etc.)
6. MCP servers process event and return confirmation
7. COMET CORE updates local database with synchronized data
8. Success/failure logged with retry logic for failed webhooks

---

## 📞 Support

**Project Owner:** Warren Heathcote  
**Email:** warren@SFG-innovations.com  
**System Version:** 1.2.0  
**Status:** Production Ready  
**Last Updated:** 2025-11-10

---

## 📚 Documentation

- **[Message Handlers](workflows/message-handlers.md)** - Complete webhook documentation
- **[Webhook Configuration](config/webhooks.json)** - Webhook setup and examples
- **[Business Logic](business-logic.json)** - Capabilities and workflows
- **[Communications Setup](config/communications.json)** - Email templates and notifications

---

## 🎨 UI Components

Built with shadcn/ui and custom glassmorphic design:

- **Dashboard** - Project overview with analytics
- **Project List** - Sortable, filterable table
- **Project Detail** - Complete project information with tabs
- **Credit Check Card** - Visual credit scoring display
- **Activity Feed** - Real-time updates and comments
- **Document Library** - Upload, view, download documents
- **Tier Badges** - Visual user permission indicators
- **Status Badges** - Project stage indicators

---

## 🔮 Future Enhancements

1. **Experian Credit API** - Advanced credit scoring
2. **Mobile App** - iOS and Android native apps
3. **Advanced Analytics** - Predictive project outcomes
4. **Custom Workflows** - User-configurable stage flows
5. **API Marketplace** - Third-party integration ecosystem

---

**Registered:** 2025-11-10  
**Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio  
**License:** Proprietary - SFG Aluminium  
**Compliant With:** V4.0 ENFORCED Registration Standards
