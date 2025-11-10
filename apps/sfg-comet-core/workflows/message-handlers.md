# SFG COMET CORE - Message Handlers

## Overview

This document describes how SFG COMET CORE handles incoming and outgoing webhooks for NEXUS orchestration and MCP server integration.

**Webhook Endpoint:** `https://sfg-comet-core.abacusai.app/api/webhooks/nexus`

## Incoming Webhook Handlers

### From NEXUS to SFG COMET CORE


#### `customer.updated`

**Description:** Customer information updated from external CRM system (MCP-SALES), sync customer data to COMET CORE database

**Payload:**
```json
{
  "event_type": "customer.updated",
  "customer_id": "CUST-2025-123",
  "customer_name": "Acme Construction Ltd",
  "email": "contact@acme.com",
  "phone": "+44 1234 567890",
  "credit_limit": 50000,
  "updated_at": "2025-11-10T10:30:00Z",
  "updated_by": "MCP-SALES"
}
```

**Processing:**
1. Validate webhook signature (HMAC-SHA256)
2. Extract and validate payload data
3. Query RAG Truth System for relevant business rules
4. Perform business logic (update database, trigger workflows)
5. Emit outgoing webhook if needed (e.g., notify other MCP servers)
6. Return 200 OK with confirmation

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request with validation errors
- Processing error: Return 500 Internal Server Error, trigger retry
- Database error: Log to audit trail, retry with exponential backoff

---

#### `quote.accepted`

**Description:** Customer accepted quote via external system, trigger Pre-Production workflow in COMET CORE

**Payload:**
```json
{
  "event_type": "quote.accepted",
  "enquiry_number": "ENQ-2025-045",
  "quote_number": "QUO-2025-045",
  "customer_id": "CUST-2025-123",
  "quote_value": 25000,
  "accepted_at": "2025-11-10T11:00:00Z",
  "accepted_by": "customer@acme.com"
}
```

**Processing:**
1. Validate webhook signature (HMAC-SHA256)
2. Extract and validate payload data
3. Query RAG Truth System for relevant business rules
4. Perform business logic (update database, trigger workflows)
5. Emit outgoing webhook if needed (e.g., notify other MCP servers)
6. Return 200 OK with confirmation

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request with validation errors
- Processing error: Return 500 Internal Server Error, trigger retry
- Database error: Log to audit trail, retry with exponential backoff

---

#### `invoice.paid`

**Description:** Invoice payment received from Xero accounting system, update project status to Completed

**Payload:**
```json
{
  "event_type": "invoice.paid",
  "invoice_number": "INV-2025-045",
  "enquiry_number": "ENQ-2025-045",
  "amount_paid": 25000,
  "payment_date": "2025-11-10T15:00:00Z",
  "payment_method": "Bank Transfer",
  "xero_invoice_id": "abc123-def456"
}
```

**Processing:**
1. Validate webhook signature (HMAC-SHA256)
2. Extract and validate payload data
3. Query RAG Truth System for relevant business rules
4. Perform business logic (update database, trigger workflows)
5. Emit outgoing webhook if needed (e.g., notify other MCP servers)
6. Return 200 OK with confirmation

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request with validation errors
- Processing error: Return 500 Internal Server Error, trigger retry
- Database error: Log to audit trail, retry with exponential backoff

---

#### `project.milestone_reached`

**Description:** Project milestone reached from MCP-OPERATIONS, update project progress and notify team

**Payload:**
```json
{
  "event_type": "project.milestone_reached",
  "enquiry_number": "ENQ-2025-045",
  "milestone": "Material Ordered",
  "milestone_date": "2025-11-10T09:00:00Z",
  "next_milestone": "Production Start",
  "progress_percentage": 40
}
```

**Processing:**
1. Validate webhook signature (HMAC-SHA256)
2. Extract and validate payload data
3. Query RAG Truth System for relevant business rules
4. Perform business logic (update database, trigger workflows)
5. Emit outgoing webhook if needed (e.g., notify other MCP servers)
6. Return 200 OK with confirmation

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request with validation errors
- Processing error: Return 500 Internal Server Error, trigger retry
- Database error: Log to audit trail, retry with exponential backoff

---

#### `document.external_update`

**Description:** Document updated in SharePoint via Microsoft Graph, sync to COMET CORE document library

**Payload:**
```json
{
  "event_type": "document.external_update",
  "document_id": "DOC-2025-789",
  "document_name": "Technical_Spec_V2.pdf",
  "sharepoint_url": "https://sfgaluminium.sharepoint.com/sites/comet-core/docs/DOC-2025-789",
  "updated_by": "warren@sfgaluminium.com",
  "updated_at": "2025-11-10T14:30:00Z"
}
```

**Processing:**
1. Validate webhook signature (HMAC-SHA256)
2. Extract and validate payload data
3. Query RAG Truth System for relevant business rules
4. Perform business logic (update database, trigger workflows)
5. Emit outgoing webhook if needed (e.g., notify other MCP servers)
6. Return 200 OK with confirmation

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request with validation errors
- Processing error: Return 500 Internal Server Error, trigger retry
- Database error: Log to audit trail, retry with exponential backoff

---

## Outgoing Webhook Emissions

### From SFG COMET CORE to NEXUS


#### `enquiry.created`

**Trigger:** New enquiry created in COMET CORE, notify NEXUS and MCP-SALES for CRM synchronization

**Payload:**
```json
{
  "event_type": "enquiry.created",
  "enquiry_number": "ENQ-2025-046",
  "customer_name": "Beta Industries Ltd",
  "customer_email": "info@beta.com",
  "product_description": "Aluminium window frames - 50 units",
  "estimated_value": 15000,
  "created_at": "2025-11-10T16:00:00Z",
  "created_by": "john.doe@sfgaluminium.com",
  "stage": "New Enquiry"
}
```

**Recipients:**
- NEXUS (orchestration layer)
- MCP-SALES (if customer/enquiry related)
- MCP-OPERATIONS (if project/production related)
- MCP-FINANCE (if financial/credit related)
- MCP-COMMUNICATIONS (if notification required)

**Retry Logic:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds
- Failed webhooks logged to database for manual review

---

#### `credit_check.completed`

**Trigger:** Credit check completed with AI scoring, send results to NEXUS and MCP-FINANCE for risk assessment

**Payload:**
```json
{
  "event_type": "credit_check.completed",
  "enquiry_number": "ENQ-2025-046",
  "company_name": "Beta Industries Ltd",
  "company_number": "12345678",
  "credit_score": "Healthy",
  "financial_summary": "Strong cash flow, low debt ratio",
  "recommendation": "Approve up to \u00a350,000 credit",
  "checked_at": "2025-11-10T16:05:00Z"
}
```

**Recipients:**
- NEXUS (orchestration layer)
- MCP-SALES (if customer/enquiry related)
- MCP-OPERATIONS (if project/production related)
- MCP-FINANCE (if financial/credit related)
- MCP-COMMUNICATIONS (if notification required)

**Retry Logic:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds
- Failed webhooks logged to database for manual review

---

#### `project.stage_changed`

**Trigger:** Project moved to new stage, notify all MCP servers and update NEXUS orchestration state

**Payload:**
```json
{
  "event_type": "project.stage_changed",
  "enquiry_number": "ENQ-2025-046",
  "previous_stage": "Viability Check",
  "new_stage": "Pre-Production",
  "changed_by": "manager@sfgaluminium.com",
  "changed_at": "2025-11-10T17:00:00Z",
  "reason": "Quote accepted by customer"
}
```

**Recipients:**
- NEXUS (orchestration layer)
- MCP-SALES (if customer/enquiry related)
- MCP-OPERATIONS (if project/production related)
- MCP-FINANCE (if financial/credit related)
- MCP-COMMUNICATIONS (if notification required)

**Retry Logic:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds
- Failed webhooks logged to database for manual review

---

#### `document.uploaded`

**Trigger:** Document uploaded to COMET CORE, sync to SharePoint and notify relevant team members

**Payload:**
```json
{
  "event_type": "document.uploaded",
  "document_id": "DOC-2025-790",
  "document_name": "Customer_PO.pdf",
  "enquiry_number": "ENQ-2025-046",
  "uploaded_by": "sales@sfgaluminium.com",
  "uploaded_at": "2025-11-10T17:15:00Z",
  "file_size": 2048000,
  "s3_key": "uploads/2025/11/ENQ-2025-046/Customer_PO.pdf"
}
```

**Recipients:**
- NEXUS (orchestration layer)
- MCP-SALES (if customer/enquiry related)
- MCP-OPERATIONS (if project/production related)
- MCP-FINANCE (if financial/credit related)
- MCP-COMMUNICATIONS (if notification required)

**Retry Logic:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds
- Failed webhooks logged to database for manual review

---

#### `approval.required`

**Trigger:** Project requires manager/executive approval, send notification to NEXUS for workflow routing

**Payload:**
```json
{
  "event_type": "approval.required",
  "enquiry_number": "ENQ-2025-046",
  "approval_type": "Production Start",
  "required_tier": 2,
  "requested_by": "sales@sfgaluminium.com",
  "requested_at": "2025-11-10T17:30:00Z",
  "reason": "Project value exceeds Tier 1 approval limit"
}
```

**Recipients:**
- NEXUS (orchestration layer)
- MCP-SALES (if customer/enquiry related)
- MCP-OPERATIONS (if project/production related)
- MCP-FINANCE (if financial/credit related)
- MCP-COMMUNICATIONS (if notification required)

**Retry Logic:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds
- Failed webhooks logged to database for manual review

---

#### `alert.critical`

**Trigger:** Critical system alert (credit risk, overdue project, etc.), immediate notification to all systems

**Payload:**
```json
{
  "event_type": "alert.critical",
  "alert_type": "Credit Risk Detected",
  "enquiry_number": "ENQ-2025-047",
  "customer_name": "Risky Customer Ltd",
  "severity": "HIGH",
  "message": "Companies House shows declining financial health",
  "action_required": "Review credit terms before proceeding",
  "created_at": "2025-11-10T18:00:00Z"
}
```

**Recipients:**
- NEXUS (orchestration layer)
- MCP-SALES (if customer/enquiry related)
- MCP-OPERATIONS (if project/production related)
- MCP-FINANCE (if financial/credit related)
- MCP-COMMUNICATIONS (if notification required)

**Retry Logic:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds
- Failed webhooks logged to database for manual review

---

## Workflow Diagrams

### Main Event Flow

```
External Event → NEXUS → COMET CORE Webhook → Validation → RAG Query → Business Logic → Database Update → Outgoing Webhook → NEXUS → MCP Servers
```

### Credit Check Workflow

```
User Trigger → Companies House API → AI Scoring → Database Storage → RAG Vector DB → Webhook Emission → NEXUS → MCP-FINANCE
```

### Document Upload Workflow

```
User Upload → File Validation → S3 Storage → Database Record → Webhook Emission → NEXUS → SharePoint Sync
```

### Project Stage Change Workflow

```
Stage Change → Validation → Tier Permission Check → Database Update → Activity Log → Webhook Emission → NEXUS → All MCP Servers
```

## Security

- **HMAC-SHA256 Signature Verification:** All incoming webhooks must include valid signature
- **Rate Limiting:** 1000 requests/hour incoming, 500 requests/hour outgoing
- **IP Whitelisting:** Only NEXUS and approved MCP servers can send webhooks
- **Audit Logging:** All webhook activity logged with timestamp, payload, and outcome
- **Encrypted Payloads:** Sensitive data encrypted at rest and in transit

## Monitoring

- **Success Rate:** Track % of successful webhook deliveries (target: >99%)
- **Response Time:** Track average webhook processing time (target: <2 seconds)
- **Error Rate:** Alert if error rate exceeds 5% in 1-hour window
- **Queue Depth:** Monitor outgoing webhook queue for backlog
- **MCP Health:** Track last successful communication with each MCP server

## Integration Points

### MCP-SALES
- Receives: `enquiry.created`, `credit_check.completed`, `project.stage_changed`
- Sends: `customer.updated`, `quote.accepted`

### MCP-FINANCE
- Receives: `credit_check.completed`, `project.stage_changed`
- Sends: `invoice.paid`

### MCP-OPERATIONS
- Receives: `project.stage_changed`, `document.uploaded`
- Sends: `project.milestone_reached`

### MCP-COMMUNICATIONS
- Receives: `approval.required`, `alert.critical`
- Sends: None (receives only)

### MCP-DATA
- Receives: All events (for data warehousing and analytics)
- Sends: None (receives only)

## Testing

### Test Incoming Webhook

```bash
curl -X POST https://sfg-comet-core.abacusai.app/api/webhooks/nexus \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: <HMAC-SHA256-SIGNATURE>" \
  -d '{
    "event_type": "customer.updated",
    "customer_id": "TEST-001",
    "customer_name": "Test Customer",
    "email": "test@example.com"
  }'
```

### Test Outgoing Webhook

```typescript
// From COMET CORE API route
await sendWebhook({
  event: 'enquiry.created',
  payload: {
    enquiry_number: 'ENQ-2025-999',
    customer_name: 'Test Customer',
    stage: 'New Enquiry'
  }
});
```

## Troubleshooting

### Webhook Not Received
1. Check NEXUS webhook logs for delivery attempts
2. Verify HMAC signature is correct
3. Check COMET CORE application logs
4. Verify firewall rules allow NEXUS IP

### Webhook Failed
1. Check error message in audit log
2. Verify payload format matches expected schema
3. Check database connection and RAG system health
4. Retry manually from admin panel if needed

### Slow Webhook Processing
1. Check RAG query performance (should be <500ms)
2. Monitor database query execution time
3. Check for large payload sizes
4. Review application logs for bottlenecks

---

**Last Updated:** {datetime.utcnow().strftime("%Y-%m-%d")}  
**Version:** {APP_VERSION}  
**Maintained By:** Warren Heathcote (warren@SFG-innovations.com)
