
# SFG-Website - SFG Aluminium Ltd Corporate Website

**Version:** 1.7.0  
**Category:** sfg-aluminium-app  
**Status:** ✅ Production  
**Deployed URL:** https://sfg-website-2025.abacusai.app

---

## 📋 Overview

The SFG Aluminium Ltd website serves as the primary digital presence for the company, focusing on:
- **Lead Generation:** Capture customer enquiries, quote requests, and service inquiries
- **Customer Self-Service:** Enable customers to browse products, request quotes, and track enquiries
- **Brand Presence:** Showcase SFG Aluminium's expertise, products, and services
- **Business Integration:** Seamlessly integrate with NEXUS and all SFG business systems

## 🎯 Core Capabilities

### Lead Capture & Management
- Contact form submissions with instant notifications
- Quote request processing with product selection
- Service inquiry routing to appropriate teams
- Real-time lead qualification and categorization

### Product Showcase
- Comprehensive product catalog (windows, doors, curtain walling, shopfronts, balustrades)
- Technical specifications and material options
- Image galleries and case studies
- Industry-specific solutions (commercial/residential)

### Customer Portal
- Enquiry tracking and status updates
- Quote review and acceptance
- Document downloads (brochures, technical sheets)
- Account management

### Business Process Integration
- Webhook endpoint for NEXUS orchestration
- Message handler for inter-app communication
- Real-time event processing
- Automated workflow triggers

## 🔄 Key Workflows

### 1. Contact Form Submission
```
Customer fills contact form
    ↓
Form validation (email, phone, message)
    ↓
Store lead in database
    ↓
Send confirmation email to customer
    ↓
Notify sales team
    ↓
Create CRM record (via MCP-SALES)
    ↓
Track conversion funnel (via Analytics)
```

### 2. Quote Request Processing
```
Customer submits quote request form
    ↓
Validate product selection and specifications
    ↓
Store request in database
    ↓
Send webhook to NEXUS (quote.requested)
    ↓
NEXUS orchestrates quote generation
    ↓
Quote Generator app creates PDF quote
    ↓
Send quote PDF to customer
    ↓
Create follow-up task for sales
```

### 3. Enquiry to NEXUS Orchestration
```
Receive enquiry from any form
    ↓
Validate and normalize data
    ↓
Send webhook to NEXUS (enquiry.created)
    ↓
NEXUS orchestrates downstream actions
    ↓
Receive confirmation from NEXUS
    ↓
Update customer with reference number
```

## 📐 SFG Business Rules

The website adheres to all SFG Aluminium business rules:

### Margin Requirements
- **Minimum Margin:** 15%
- **Target Margin:** 25%
- **Warning Threshold:** 18% (triggers sales team alert)

### Approval Limits (Tier-Based)
| Tier | Role | Limit |
|------|------|-------|
| T1 | Director | £1,000,000 |
| T2 | Senior Manager | £100,000 |
| T3 | Manager | £25,000 |
| T4 | Supervisor | £10,000 |
| T5 | Staff | £1,000 |

### Credit Check Requirements
- **Threshold:** Orders > £10,000 require credit check
- **Validity:** Credit checks valid for 90 days
- **Integration:** Via Experian through MCP-FINANCE

### Document Stage Workflow
```
ENQ → QUO → SENT → ACC → ORD → FAB → INS → INV → PAID
```

### Customer Tiers
- **Platinum** (Purple) - Premium customers
- **Sapphire** (Blue) - High-value regular customers
- **Steel** (Gray) - Standard commercial customers
- **Green** (Green) - New/growing customers
- **Crimson** (Red) - At-risk customers requiring attention

## 🔗 Integration Points

### Required Integrations
- **NEXUS:** Orchestration hub for all business processes
- **MCP-SALES:** CRM and sales tools
- **MCP-FINANCE:** Experian credit checks, Xero accounting
- **MCP-OPERATIONS:** Production scheduling, installation tracking
- **MCP-COMMUNICATIONS:** Email and SMS notifications
- **MCP-DATA:** Analytics and reporting

### Planned Integrations
- **Xero:** Direct accounting integration
- **SharePoint:** Document management
- **Companies House:** Company data verification
- **Google Analytics (GA4):** Conversion tracking

### Active Integrations
- **PostgreSQL:** Primary database
- **AWS S3:** Cloud storage for documents
- **Email Service:** Customer notifications

## 🔔 Webhook Events

The website listens for and processes these events from NEXUS:

| Event | Description | Handler |
|-------|-------------|---------|
| `enquiry.created` | New enquiry submitted | Store, notify team, create project folder |
| `quote.requested` | Quote generation requested | Calculate pricing, check margins, generate quote |
| `order.approved` | Order approved by customer | Schedule production, create invoice |
| `customer.registered` | New customer registered | Send welcome email, create CRM record |
| `credit.check_required` | Credit check needed | Initiate Experian check via MCP-FINANCE |
| `invoice.due` | Invoice payment due | Send reminder, schedule follow-up |
| `payment.received` | Payment confirmed | Update invoice, send receipt |

**Endpoint:** `POST /api/webhooks/nexus`  
**Authentication:** HMAC SHA-256 signature verification  
**Header:** `X-Nexus-Signature`

## 💬 Message Handlers

The website can respond to these messages from NEXUS or other apps:

| Message Type | Description | Response |
|--------------|-------------|----------|
| `query.enquiry_status` | Get enquiry status | Current status, assigned team, next action |
| `query.customer_enquiries` | Get all customer enquiries | List of enquiries with details |
| `action.update_enquiry_status` | Update enquiry status | Confirmation with notifications |
| `action.send_quote_email` | Send quote to customer | Email delivery confirmation |
| `action.create_follow_up_task` | Create sales follow-up | Task created with assignment |

**Endpoint:** `POST /api/messages/handle`  
**Authentication:** API Key  
**Header:** `X-API-Key`

## 📡 API Endpoints

### Public Endpoints (Customer-Facing)
- `POST /api/contact` - Submit contact form
- `POST /api/quote` - Submit quote request
- `POST /api/service` - Submit service inquiry

**Rate Limits:**
- Contact/Service: 10 requests/minute
- Quote: 5 requests/minute

### Integration Endpoints
- `POST /api/webhooks/nexus` - Receive NEXUS webhooks
- `POST /api/messages/handle` - Handle NEXUS messages
- `GET /api/health` - Health check

**Rate Limits:**
- Webhooks/Messages: 1000 requests/minute

## 🗄️ Data Models

### ContactEnquiry
- `id`, `name`, `email`, `phone`, `company`, `message`
- `enquiry_type`: general | quote | service
- `status`: new | contacted | quoted | converted | closed
- `created_at`, `updated_at`

### QuoteRequest
- `id`, `customer_name`, `email`, `phone`
- `product_type`: windows | doors | curtain_walling | shopfronts | balustrades
- `quantity`, `specifications` (JSON), `estimated_value`
- `status`: pending | quoted | accepted | rejected
- `quote_reference`, `created_at`

### ServiceInquiry
- `id`, `customer_name`, `email`, `phone`
- `service_type`: installation | repair | maintenance | consultation
- `urgency`: routine | urgent | emergency
- `description`, `preferred_date`
- `status`: new | scheduled | in_progress | completed
- `created_at`

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14.2.28 (App Router)
- **UI Library:** React 18.2.0
- **Styling:** Tailwind CSS 3.3.3
- **Components:** Radix UI, Shadcn/ui
- **Animations:** Framer Motion

### Backend
- **Runtime:** Node.js (Next.js API Routes)
- **Database:** PostgreSQL (via Prisma 6.7.0)
- **Authentication:** NextAuth.js
- **Storage:** AWS S3

### DevOps
- **Hosting:** Abacus.AI Platform
- **CI/CD:** Automated deployments
- **Monitoring:** Health checks, uptime monitoring

## 📊 Monitoring & Health

### Health Check
```bash
curl https://sfg-website-2025.abacusai.app/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-05T12:00:00Z",
  "uptime": "99.9%"
}
```

### Performance Targets
- **Uptime:** 99.9%
- **Response Time:** < 500ms
- **Availability:** 24/7

## 🧪 Testing

### Webhook Testing
```bash
curl -X POST https://sfg-website-2025.abacusai.app/api/webhooks/nexus \
  -H "Content-Type: application/json" \
  -H "X-Nexus-Signature: <hmac_signature>" \
  -d '{"type":"enquiry.created","data":{"enquiry_id":"test-001","customer":{"name":"Test Customer"}}}'
```

### Message Handler Testing
```bash
curl -X POST https://sfg-website-2025.abacusai.app/api/messages/handle \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <api_key>" \
  -d '{"type":"query.enquiry_status","params":{"enquiry_id":"test-001"},"request_id":"req-001"}'
```

## 📦 Deployment

### Current Deployment
- **URL:** https://sfg-website-2025.abacusai.app
- **Version:** 1.7.0
- **Environment:** Production
- **Last Updated:** 2025-11-05

### Environment Variables
```env
DATABASE_URL=<postgres_connection_string>
WEBHOOK_SECRET=sfg-webhook-secret-2025
NEXUS_API_KEY=sfg-nexus-api-key-2025
AWS_BUCKET_NAME=<s3_bucket>
AWS_FOLDER_PREFIX=sfg-website/
```

## 👥 Team

- **Owner:** Warren (SFG Director)
- **Contact:** warren@sfgaluminium.co.uk
- **Developers:** DeepAgent, Future Development Teams
- **Support:** dev-team@sfgaluminium.co.uk

## 📝 Version History

### v1.7.0 (2025-11-05)
- ✅ Webhook endpoint implementation
- ✅ Message handler implementation
- ✅ SFG business rules integration
- ✅ Complete app registration

### v1.6.0 (2025-11-04)
- Satellite registration system
- GitHub autonomous integration
- Business logic documentation

### v1.5.0 (2025-11-03)
- Enhanced forms with validation
- Email notifications
- Database integration

### v1.0.0 (2025-11-01)
- Initial website launch
- Core pages and navigation
- Product catalog

## 🔐 Security

### Authentication
- Webhook signature verification (HMAC SHA-256)
- API key authentication for messages
- Rate limiting on all endpoints
- HTTPS enforced

### Data Protection
- GDPR compliant data handling
- Consent tracking
- Data deletion capabilities
- Secure storage (encrypted at rest)

## 📞 Support

For issues, questions, or feature requests:

1. **GitHub Issues:** Create issue with `question` or `bug` label
2. **Email:** dev-team@sfgaluminium.co.uk
3. **Contact Owner:** warren@sfgaluminium.co.uk

## 🎉 Registration Status

✅ **Successfully registered in SFG App Portfolio**

- Registration Date: 2025-11-05
- GitHub Issue: [Pending creation]
- Approval Status: Pending NEXUS review
- Orchestration Ready: Yes

---

**Welcome to the SFG App Portfolio!**

This app is now part of the SFG Aluminium orchestration ecosystem and ready to receive webhooks and messages from NEXUS.
