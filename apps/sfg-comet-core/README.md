# SFG COMET CORE

**Version:** 1.2.0  
**Platform:** Abacus.AI DeepAgent  
**Status:** production  
**URL:** https://sfg-comet-core.abacusai.app

## Purpose

Central project management hub for SFG Aluminium

## Technical Stack

- **Framework:** Next.js 14 + TypeScript
- **Database:** PostgreSQL (Prisma)
- **Deployment:** Abacus.AI Hosted

## Capabilities

- Project management with 6-stage workflow (ENQ→QUO→ORD→INV→DEL→PAID)
- Customer credit checking via Companies House API
- Document management with AWS S3 cloud storage
- RAG truth system with AI-queryable business rules
- User management with 5-tier role-based access control
- Activity logging and comprehensive audit trails
- Approval workflows with tier-based authority
- Notification system for project events
- Dashboard and analytics
- MCP (Multi-Channel Processor) orchestration

## Workflows

### Project Lifecycle
1. ENQ - Receive customer enquiry
2. QUO - Generate and send quote
3. ORD - Confirm customer order
4. INV - Generate and send invoice
5. DEL - Create delivery note and dispatch
6. PAID - Receive payment and close project

### Credit Checking
1. Extract company number
2. Query Companies House API
3. Calculate traditional credit score
4. Calculate AI-enhanced credit score
5. Determine risk tier and credit limit
6. Store result in database

### Document Management
1. User uploads document
2. Validate file type and size
3. Upload to AWS S3 cloud storage
4. Store S3 key in PostgreSQL database
5. Generate signed URL for download
6. Track document version history

### Approval Workflow
1. User submits approval request
2. System determines required tier based on amount
3. Notify approvers in required tier
4. Approver reviews and approves/rejects
5. System updates project status
6. Send confirmation notification


## Business Rules

**5-tier staff permission system**
- Condition: User tier determines approval authority
- Action: T1: Unlimited, T2: £50k, T3: £15k, T4: £5k, T5: £1k

**5-tier customer credit system**
- Condition: Customer tier based on credit limit
- Action: Platinum: £50k+, Sapphire: £15-50k, Steel: £5-15k, Green: £1-5k, Crimson: £0-1k

**Sequential base number system**
- Condition: All projects get sequential base number
- Action: Format: {BASE_NUMBER}-{STAGE} (e.g., 24001-ENQ)

**Credit check for high-value orders**
- Condition: order_value > £10,000
- Action: Perform credit check before order approval

**Minimum margin requirement**
- Condition: margin >= 0.15
- Action: Require 15% minimum margin on all quotes

**Tier-based approval escalation**
- Condition: value > user_tier_limit
- Action: Escalate to higher tier for approval


## Integration Points

- **Companies House**: Company data and credit checking
- **AWS S3**: Cloud document storage
- **PostgreSQL**: Primary database
- **ChromaDB**: Vector database for RAG system
- **Xero**: Accounting and invoicing (pending OAuth)
- **Microsoft Graph**: Email, calendar, SharePoint (pending OAuth)
- **Twilio**: SMS notifications (configured)
- **Abacus.AI LLM APIs**: AI-powered features

## Webhook Events

- project.created
- project.status_changed
- document.uploaded
- approval.requested
- approval.approved
- approval.rejected
- payment.received
- credit_check.completed

## Supported Messages

- query.project_status
- query.customer_data
- query.credit_check
- action.create_project
- action.update_status
- action.request_approval

## API Endpoints

- `/api/auth/[...nextauth]`
- `/api/signup`
- `/api/projects`
- `/api/projects/[id]`
- `/api/credit-check/[companyNumber]`
- `/api/credit-check/batch`
- `/api/dashboard/stats`
- `/api/rag/query`
- `/api/mcp/health`
- `/api/xero/authorize`
- `/api/xero/callback`
- `/api/vault/status`
- `/api/version`

## Registration

**Registered:** 2025-11-04T20:53:57.949391  
**Registered By:** Autonomous Registration (Comet)

---

**Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio  
**App Directory:** /apps/sfg-comet-core
