
# SFG ESP - Message Handlers & Event-Driven Architecture

**Version:** 1.0.0  
**Last Updated:** November 10, 2025  
**Maintainer:** SFG Innovations Development Team

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Incoming Webhook Handlers](#incoming-webhook-handlers)
4. [Outgoing Webhook Emissions](#outgoing-webhook-emissions)
5. [Workflow Diagrams](#workflow-diagrams)
6. [Security](#security)
7. [Error Handling](#error-handling)
8. [Monitoring & Observability](#monitoring--observability)
9. [Testing](#testing)

---

## 📖 Overview

SFG ESP (Enquiry & Specification Processor) implements an **event-driven architecture** to seamlessly integrate with the SFG COMET Core Orchestration system. The application uses webhooks to receive and emit events, enabling real-time communication with other SFG apps.

### Core Capabilities

- ✅ **Enquiry Processing**: Receive and process customer enquiries from multiple sources
- ✅ **Specification Extraction**: Extract technical specifications from uploaded documents
- ✅ **Credit Checking**: Initiate and process credit assessments
- ✅ **Regulatory Compliance**: Analyze building regulations and compliance requirements
- ✅ **Xero Integration**: Synchronize customer data and financial information
- ✅ **Quote Coordination**: Request and coordinate quotation generation

### Integration Points

- **NEXUS Core**: Central orchestration and task management
- **Communications Hub**: Email triage and classification
- **Mail-Matrix**: Email content analysis
- **Enquiry Estimator**: Quote generation and pricing
- **Customer Portal**: Document uploads and self-service
- **Xero API**: Accounting and financial data
- **Companies House API**: Credit checking and company verification

---

## 🏗 Architecture

### Event Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SFG COMET ORCHESTRATION                     │
│                         (NEXUS CORE)                            │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            INCOMING WEBHOOKS    OUTGOING WEBHOOKS
                    │                   │
    ┌───────────────┴────────┐         │
    │                        │         │
    ▼                        ▼         ▼
┌─────────┐           ┌─────────┐  ┌────────────┐
│ Webhook │           │ Message │  │  Event     │
│ Validator│──────────▶│ Queue   │──▶│ Emitter   │
└─────────┘           └─────────┘  └────────────┘
                           │               │
                           ▼               │
                    ┌─────────────┐        │
                    │  Business   │        │
                    │   Logic     │        │
                    │  Processor  │        │
                    └─────────────┘        │
                           │               │
                           └───────────────┘
```

### Component Responsibilities

1. **Webhook Validator**: Verify HMAC signatures, validate payloads, rate limiting
2. **Message Queue**: Asynchronous processing, retry logic, dead letter queue
3. **Business Logic Processor**: Core enquiry processing, credit checks, regulatory analysis
4. **Event Emitter**: Emit outgoing webhooks to NEXUS and other apps

---

## 📥 Incoming Webhook Handlers

### 1. enquiry.received

**Trigger:** New enquiry received from Communications Hub, website, or email

**Source:** `sfg-communications-hub`, `sfg-website`, `sfg-mail-matrix`

**Endpoint:** `POST /api/webhooks/nexus`

**Payload:**
```json
{
  "event": "enquiry.received",
  "timestamp": "2025-11-10T09:30:00Z",
  "data": {
    "enquiry_id": "ENQ-2025-001",
    "customer_name": "ABC Construction Ltd",
    "customer_email": "contact@abc-construction.co.uk",
    "customer_phone": "+44 20 1234 5678",
    "enquiry_type": "quote_request",
    "product_category": "aluminium_windows",
    "message": "Quote for 12 windows for new build project",
    "source": "website_form"
  }
}
```

**Processing Flow:**
1. **Validate webhook signature** (HMAC-SHA256)
2. **Extract payload data** and validate schema
3. **Create enquiry record** in database
4. **Check if customer exists**
   - If new: Create customer record, initiate credit check
   - If existing: Load customer data
5. **Parse enquiry message** using NLP to extract:
   - Product type (windows, doors, curtain walling, etc.)
   - Quantity
   - Project type (residential, commercial, new build, refurbishment)
   - Urgency indicators
6. **Send acknowledgment email** to customer
7. **Emit outgoing webhooks:**
   - `customer.acknowledged` (immediate)
   - `enquiry.processed` (after parsing)
   - `credit.check.initiated` (if new customer)
8. **Return 200 OK** to sender

**Error Handling:**
- Invalid signature: `401 Unauthorized`
- Invalid payload: `400 Bad Request` (with validation errors)
- Database error: `500 Internal Server Error`, retry with exponential backoff
- Processing error: `500 Internal Server Error`, move to dead letter queue after 3 retries

**Average Processing Time:** 1-2 seconds

---

### 2. specification.uploaded

**Trigger:** Customer uploads technical specifications via Customer Portal

**Source:** `sfg-customer-portal`

**Payload:**
```json
{
  "event": "specification.uploaded",
  "timestamp": "2025-11-10T10:00:00Z",
  "data": {
    "enquiry_id": "ENQ-2025-001",
    "customer_id": "CUST-12345",
    "file_url": "https://sfg-esp.abacusai.app/uploads/spec-2025-001.pdf",
    "file_type": "pdf",
    "file_size_mb": 2.5
  }
}
```

**Processing Flow:**
1. Validate webhook signature
2. **Download file** from provided URL
3. **Validate file** (type, size, virus scan)
4. **Extract specifications** using AI/ML:
   - Window/door dimensions
   - Glass type and specifications
   - Frame colors and finishes
   - Hardware requirements
   - Quantity breakdown
5. **Update enquiry record** with extracted data
6. **Calculate confidence score** for extraction accuracy
7. **If confidence > 90%**: Proceed to quote request
8. **If confidence < 90%**: Flag for manual review
9. **Emit outgoing webhooks:**
   - `specification.extracted` (to NEXUS, Enquiry Estimator)
   - `quote.requested` (if ready)
10. Return 200 OK

**Error Handling:**
- File download failed: `502 Bad Gateway`, retry 3 times
- Extraction failed: `500 Internal Server Error`, flag for manual review
- Low confidence: Emit `specification.review_required` to manual queue

**Average Processing Time:** 5-15 seconds (depends on file size)

---

### 3. nexus.task.assigned

**Trigger:** NEXUS orchestrator assigns enquiry processing task to ESP

**Source:** `sfg-nexus-core`

**Payload:**
```json
{
  "event": "nexus.task.assigned",
  "timestamp": "2025-11-10T09:35:00Z",
  "data": {
    "task_id": "TASK-2025-100",
    "task_type": "process_enquiry",
    "enquiry_id": "ENQ-2025-001",
    "assigned_by": "nexus-orchestrator",
    "priority": "high",
    "deadline": "2025-11-10T17:00:00Z"
  }
}
```

**Processing Flow:**
1. Validate webhook signature
2. **Load task details** and enquiry record
3. **Determine task type:**
   - `process_enquiry`: Standard enquiry processing
   - `reprocess_enquiry`: Retry failed processing
   - `extract_specification`: Extract from document
   - `initiate_credit_check`: Start credit assessment
4. **Execute task** according to type
5. **Update task status** in NEXUS
6. **Emit completion webhook:**
   - `nexus.task.completed` (on success)
   - `nexus.task.failed` (on error with retry info)
7. Return 200 OK

**Priority Handling:**
- `critical`: Process immediately (< 5 minutes)
- `high`: Process within 1 hour
- `normal`: Process within 4 hours
- `low`: Process within 24 hours

---

### 4. credit.check.completed

**Trigger:** Credit check service completes customer assessment

**Source:** `companies-house-api`, `sfg-credit-checker`

**Payload:**
```json
{
  "event": "credit.check.completed",
  "timestamp": "2025-11-10T10:15:00Z",
  "data": {
    "enquiry_id": "ENQ-2025-001",
    "customer_id": "CUST-12345",
    "credit_rating": "B",
    "credit_limit": 50000,
    "risk_level": "low",
    "recommendations": "Approve with standard terms"
  }
}
```

**Processing Flow:**
1. Validate webhook signature
2. **Update customer record** with credit details
3. **Update enquiry status** with credit approval
4. **Apply business rules:**
   - Rating A/B: Approve automatically
   - Rating C: Require manager approval
   - Rating D/E: Require director approval
   - High risk: Flag for manual review
5. **If approved**: Proceed with quote request
6. **If requires approval**: Send notification to appropriate manager
7. **Emit outgoing webhook:**
   - `enquiry.credit_approved` (if approved)
   - `enquiry.credit_review_required` (if manual review needed)
8. Return 200 OK

---

### 5. regulatory.analysis.completed

**Trigger:** Regulatory intelligence module completes compliance analysis

**Source:** `sfg-regulatory-ai`

**Payload:**
```json
{
  "event": "regulatory.analysis.completed",
  "timestamp": "2025-11-10T10:30:00Z",
  "data": {
    "enquiry_id": "ENQ-2025-001",
    "building_height": 15.5,
    "building_type": "residential_new_build",
    "compliance_requirements": ["Part B Fire Safety", "Part L Energy Efficiency"],
    "approval_pathway": "Building_Control_Approval",
    "estimated_compliance_cost": 2500
  }
}
```

**Processing Flow:**
1. Validate webhook signature
2. **Update enquiry record** with regulatory details
3. **Calculate compliance costs** and add to quote estimate
4. **Determine approval pathway:**
   - Standard: Building Control Approval
   - Complex: Third-Party Certification
   - High-rise: Enhanced testing requirements
5. **Add compliance notes** to quotation
6. **Send notification** to sales/technical team
7. **Emit outgoing webhook:**
   - `enquiry.regulatory_analyzed`
8. Return 200 OK

---

### 6. pricing.updated

**Trigger:** Pricing data updated in Xero or pricing engine

**Source:** `xero-api`, `sfg-pricing-engine`

**Payload:**
```json
{
  "event": "pricing.updated",
  "timestamp": "2025-11-10T08:00:00Z",
  "data": {
    "product_id": "ALU-WIN-001",
    "product_name": "Standard Aluminium Window",
    "old_price": 350.00,
    "new_price": 365.00,
    "currency": "GBP",
    "effective_date": "2025-11-15"
  }
}
```

**Processing Flow:**
1. Validate webhook signature
2. **Update product pricing** in local cache
3. **Identify affected enquiries** (quotes not yet sent)
4. **Recalculate affected quotations**
5. **Flag for review** if price change > 5%
6. **Emit notification** to sales team
7. Return 200 OK

---

### 7. customer.updated

**Trigger:** Customer details updated in Xero or CRM

**Source:** `xero-api`, `sfg-crm`

**Payload:**
```json
{
  "event": "customer.updated",
  "timestamp": "2025-11-10T11:00:00Z",
  "data": {
    "customer_id": "CUST-12345",
    "xero_contact_id": "550e8400-e29b-41d4-a716-446655440000",
    "updates": {
      "phone": "+44 20 9876 5432",
      "address": "New Business Park, London"
    }
  }
}
```

**Processing Flow:**
1. Validate webhook signature
2. **Sync customer data** from Xero
3. **Update local customer record**
4. **Update related enquiries** if needed
5. Return 200 OK

---

## 📤 Outgoing Webhook Emissions

### 1. enquiry.processed

**Emitted When:** ESP successfully processes an enquiry and extracts key information

**Recipients:** `sfg-nexus-core`, `sfg-enquiry-estimator`

**Payload:**
```json
{
  "event": "enquiry.processed",
  "source": "sfg-esp",
  "timestamp": "2025-11-10T09:40:00Z",
  "data": {
    "enquiry_id": "ENQ-2025-001",
    "customer_id": "CUST-12345",
    "processing_status": "completed",
    "extracted_data": {
      "product_type": "aluminium_windows",
      "quantity": 12,
      "building_type": "residential_new_build",
      "delivery_location": "London, UK"
    },
    "processing_time_seconds": 45
  },
  "signature": "sha256_hmac_signature_here"
}
```

**Emission Logic:**
1. **Construct payload** with extracted data
2. **Generate HMAC signature** using shared secret
3. **Send POST request** to recipient endpoints
4. **Implement retry logic** (max 3 retries, exponential backoff)
5. **Log emission** for audit trail
6. **Monitor response** and track delivery status

---

### 2. specification.extracted

**Emitted When:** ESP extracts technical specifications from uploaded files

**Recipients:** `sfg-nexus-core`, `sfg-enquiry-estimator`

**Payload:**
```json
{
  "event": "specification.extracted",
  "source": "sfg-esp",
  "timestamp": "2025-11-10T10:05:00Z",
  "data": {
    "enquiry_id": "ENQ-2025-001",
    "specification_data": {
      "window_dimensions": [
        {"width_mm": 1200, "height_mm": 1500, "quantity": 8},
        {"width_mm": 900, "height_mm": 1200, "quantity": 4}
      ],
      "glass_type": "double_glazed",
      "frame_color": "anthracite_grey",
      "hardware": "standard_locks"
    },
    "extraction_confidence": 0.95
  },
  "signature": "sha256_hmac_signature_here"
}
```

---

### 3. quote.requested

**Emitted When:** ESP determines a quotation is ready to be generated

**Recipients:** `sfg-nexus-core`, `sfg-enquiry-estimator`

**Payload:**
```json
{
  "event": "quote.requested",
  "source": "sfg-esp",
  "timestamp": "2025-11-10T10:35:00Z",
  "data": {
    "enquiry_id": "ENQ-2025-001",
    "customer_id": "CUST-12345",
    "quote_type": "standard",
    "urgency": "normal",
    "required_by": "2025-11-15T17:00:00Z",
    "credit_approved": true,
    "regulatory_compliant": true
  },
  "signature": "sha256_hmac_signature_here"
}
```

**Business Logic:**
- Only emit when **all prerequisites are met:**
  - ✅ Specification data extracted/provided
  - ✅ Credit check completed and approved
  - ✅ Regulatory analysis completed (if required)
  - ✅ Customer data synchronized with Xero

---

### 4. customer.acknowledged

**Emitted When:** ESP sends acknowledgment email to customer

**Recipients:** `sfg-nexus-core`, `sfg-communications-hub`

**Payload:**
```json
{
  "event": "customer.acknowledged",
  "source": "sfg-esp",
  "timestamp": "2025-11-10T09:32:00Z",
  "data": {
    "enquiry_id": "ENQ-2025-001",
    "customer_email": "contact@abc-construction.co.uk",
    "acknowledgment_sent": true,
    "estimated_response_time": "24_hours"
  },
  "signature": "sha256_hmac_signature_here"
}
```

---

### 5. credit.check.initiated

**Emitted When:** ESP initiates credit check for new or existing customer

**Recipients:** `sfg-nexus-core`, `sfg-credit-checker`

---

### 6. regulatory.analysis.initiated

**Emitted When:** ESP initiates regulatory compliance analysis

**Recipients:** `sfg-nexus-core`, `sfg-regulatory-ai`

---

### 7. xero.contact.created

**Emitted When:** ESP creates new contact in Xero accounting system

**Recipients:** `sfg-nexus-core`, `xero-api`

---

### 8. enquiry.error

**Emitted When:** ESP encounters an error processing an enquiry

**Recipients:** `sfg-nexus-core`, `sfg-alerts`

**Payload:**
```json
{
  "event": "enquiry.error",
  "source": "sfg-esp",
  "timestamp": "2025-11-10T10:08:00Z",
  "data": {
    "enquiry_id": "ENQ-2025-001",
    "error_type": "specification_extraction_failed",
    "error_message": "Unable to extract dimensions from PDF",
    "retry_possible": true,
    "manual_intervention_required": false
  },
  "signature": "sha256_hmac_signature_here"
}
```

**Error Types:**
- `specification_extraction_failed`: Unable to extract data from document
- `credit_check_failed`: Credit check service unavailable
- `xero_sync_failed`: Xero API error
- `database_error`: Database connection or query error
- `timeout`: Processing exceeded time limit

---

### 9. metrics.updated

**Emitted When:** ESP updates key performance metrics for dashboards

**Recipients:** `sfg-nexus-core`, `sfg-aluminium-unified-dashboard`

**Payload:**
```json
{
  "event": "metrics.updated",
  "source": "sfg-esp",
  "timestamp": "2025-11-10T12:00:00Z",
  "data": {
    "metric_type": "enquiry_processing",
    "metrics": {
      "enquiries_processed_today": 47,
      "average_processing_time_seconds": 52,
      "quotes_requested_today": 35,
      "credit_checks_completed": 28
    }
  },
  "signature": "sha256_hmac_signature_here"
}
```

**Emission Schedule:**
- Real-time: After each significant event
- Aggregated: Every 15 minutes
- Daily summary: At 00:00 UTC

---

## 🔄 Workflow Diagrams

### Main Enquiry Processing Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ENQUIRY PROCESSING WORKFLOW                     │
└─────────────────────────────────────────────────────────────────────┘

START: enquiry.received webhook
    │
    ▼
┌─────────────────┐
│  Validate       │
│  Signature      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐        ┌──────────────────┐
│  Create         │───────▶│  Send            │
│  Enquiry Record │        │  Acknowledgment  │
└────────┬────────┘        └──────────────────┘
         │
         ▼
┌─────────────────┐
│  Check Customer │
│  Status         │
└────────┬────────┘
         │
         ├──▶ NEW: Initiate credit.check.initiated
         │         ├─▶ credit.check.completed
         │         │   └─▶ Update customer record
         │         │
         └──▶ EXISTING: Load customer data
         │
         ▼
┌─────────────────┐
│  Parse Enquiry  │
│  Extract Data   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Emit:          │
│  enquiry        │
│  .processed     │
└────────┬────────┘
         │
         ▼
 ┌───────┴────────┐
 │                │
 ▼                ▼
specification    credit.check
.uploaded        .completed
 │                │
 ▼                ▼
specification    Validate
.extracted       credit status
 │                │
 └────────┬───────┘
          │
          ▼
   ┌─────────────┐
   │ All Ready?  │
   └──────┬──────┘
          │
     YES  │  NO
          │  └─▶ Wait for missing data
          │
          ▼
   ┌─────────────┐
   │ Emit:       │
   │ quote       │
   │ .requested  │
   └─────────────┘
          │
          ▼
       END
```

### Credit Check Workflow

```
START: New customer detected
    │
    ▼
┌─────────────────┐
│  Emit:          │
│  credit.check   │
│  .initiated     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Companies      │
│  House API      │
│  Lookup         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Calculate      │
│  Credit Rating  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Apply Business │
│  Rules          │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  A/B       C/D/E
  AUTO     MANUAL
  APPROVE  REVIEW
    │         │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│  Update         │
│  Customer       │
│  Record         │
└────────┬────────┘
         │
         ▼
      END
```

### Specification Extraction Workflow

```
START: specification.uploaded webhook
    │
    ▼
┌─────────────────┐
│  Download File  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validate File  │
│  (type, size,   │
│  virus scan)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI/ML          │
│  Extraction     │
│  (dimensions,   │
│  specs, qty)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Calculate      │
│  Confidence     │
│  Score          │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  >90%      <90%
  PROCEED   MANUAL
            REVIEW
    │         │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│  Emit:          │
│  specification  │
│  .extracted     │
└────────┬────────┘
         │
         ▼
      END
```

### Error Handling Workflow

```
ERROR DETECTED
    │
    ▼
┌─────────────────┐
│  Classify Error │
│  Type           │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
TRANSIENT   PERMANENT
(network,   (data,
timeout)    logic)
    │         │
    ▼         │
RETRY       │
(max 3)     │
    │         │
    ├─SUCCESS─┘
    │    │
    │    ▼
    │  CONTINUE
    │
FAILURE
    │
    ▼
┌─────────────────┐
│  Move to Dead   │
│  Letter Queue   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Emit:          │
│  enquiry.error  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Notify Team    │
│  (Slack, email) │
└────────┬────────┘
         │
         ▼
   MANUAL REVIEW
```

---

## 🔒 Security

### HMAC Signature Verification

All incoming webhooks must include a valid HMAC-SHA256 signature in the `X-SFG-Signature` header.

**Signature Generation (Sender):**
```typescript
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');
```

**Signature Verification (SFG ESP):**
```typescript
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### Timestamp Validation

- All webhooks must include a `timestamp` field
- Reject webhooks older than **5 minutes** (300 seconds)
- Prevents replay attacks

### IP Whitelisting

Only accept webhooks from known SFG app IP addresses:
- `sfg-nexus.abacusai.app`
- `sfg-communications-hub.abacusai.app`
- `sfg-mail-matrix.abacusai.app`

### Rate Limiting

- **Incoming:** 100 requests/minute, burst capacity 150
- **Outgoing:** 50 requests/minute, burst capacity 100
- Rate limits enforced per source app

### Audit Logging

All webhook events are logged with:
- Timestamp
- Source app
- Event type
- Payload hash (for privacy)
- Processing status
- Response time

---

## ⚠️ Error Handling

### Error Classification

| Error Type | Description | Retry? | Manual Review? |
|-----------|-------------|--------|----------------|
| `invalid_signature` | HMAC signature verification failed | ❌ No | ✅ Yes (security) |
| `invalid_payload` | Payload validation failed | ❌ No | ✅ Yes |
| `database_error` | Database connection/query error | ✅ Yes (3x) | ⚠️ If persistent |
| `network_timeout` | External API timeout | ✅ Yes (3x) | ⚠️ If persistent |
| `extraction_failed` | Specification extraction failed | ✅ Yes (1x) | ✅ Yes |
| `credit_check_failed` | Credit check service unavailable | ✅ Yes (3x) | ⚠️ If persistent |
| `xero_sync_failed` | Xero API error | ✅ Yes (3x) | ⚠️ If persistent |

### Retry Policy

**Transient Errors** (network, timeout, rate limits):
- Max retries: **3**
- Backoff strategy: **Exponential**
  - Retry 1: 1 second
  - Retry 2: 2 seconds
  - Retry 3: 4 seconds
- Total max timeout: **30 seconds**

**Permanent Errors** (validation, logic):
- No retries
- Immediate move to dead letter queue
- Manual review required

### Dead Letter Queue

Failed webhooks after max retries are moved to a **dead letter queue (DLQ)** for manual review:
- Stored in database table: `webhook_failures`
- Retention: **30 days**
- Daily digest sent to operations team
- Ability to replay from DLQ after fixing issues

---

## 📊 Monitoring & Observability

### Key Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| `webhook_success_rate` | % of webhooks processed successfully | < 95% |
| `webhook_latency_p95` | 95th percentile processing time | > 5 seconds |
| `webhook_failure_rate` | % of webhooks failing | > 5% |
| `dead_letter_queue_size` | Number of items in DLQ | > 10 items |
| `retry_rate` | % of webhooks requiring retry | > 10% |

### Dashboard Widget

The `webhook_performance` dashboard widget displays:
- Total webhooks received today
- Success vs. failure rate
- Average processing time
- Current DLQ size
- Top error types

### Alerting Rules

**Critical Alerts** (PagerDuty + Slack):
- Webhook failure rate > 10% (5-minute window)
- Webhook endpoint unavailable
- Dead letter queue > 50 items

**Warning Alerts** (Slack only):
- Webhook failure rate > 5% (15-minute window)
- Webhook latency p95 > 5 seconds
- Dead letter queue > 10 items

### Logging

All webhook events logged to **structured logs** (JSON format):
```json
{
  "timestamp": "2025-11-10T09:30:00Z",
  "level": "info",
  "service": "sfg-esp",
  "event_type": "webhook_received",
  "webhook_event": "enquiry.received",
  "enquiry_id": "ENQ-2025-001",
  "source": "sfg-communications-hub",
  "processing_time_ms": 1250,
  "status": "success"
}
```

Logs retained for **90 days**.

---

## 🧪 Testing

### Test Endpoint

**URL:** `POST /api/webhooks/test`

Accepts test webhooks without signature verification (development only).

### Sample Payloads

Sample payloads for all webhook events available at:
- GitHub: `/registration/test/sample-payloads.json`
- API Docs: `https://sfg-esp.abacusai.app/api/docs/webhooks.json`

### Postman Collection

Complete Postman collection available:
- **URL:** `https://sfg-esp.abacusai.app/api/docs/webhooks.postman.json`
- Includes all incoming/outgoing webhook examples
- Pre-configured environment variables
- HMAC signature generation scripts

### Integration Testing

**Test Scenarios:**
1. ✅ **Happy Path**: Complete enquiry processing from start to finish
2. ✅ **Invalid Signature**: Verify rejection of invalid signatures
3. ✅ **Timeout Handling**: Simulate slow processing and verify timeouts
4. ✅ **Retry Logic**: Trigger transient errors and verify retries
5. ✅ **Dead Letter Queue**: Force permanent errors and verify DLQ
6. ✅ **Rate Limiting**: Exceed rate limits and verify 429 responses

**Test Coverage Target:** > 90%

---

## 📚 Additional Resources

- **API Documentation:** `https://sfg-esp.abacusai.app/api/docs`
- **Business Logic:** `/registration/business-logic.json`
- **Webhook Configuration:** `/registration/config/webhooks.json`
- **Communications Configuration:** `/registration/config/communications.json`
- **GitHub Repository:** `https://github.com/sfgaluminium1-spec/sfg-app-portfolio/tree/main/apps/sfg-esp`

---

**END OF MESSAGE HANDLERS DOCUMENTATION**

**Last Updated:** November 10, 2025  
**Version:** 1.0.0  
**Maintainer:** SFG Innovations Development Team
