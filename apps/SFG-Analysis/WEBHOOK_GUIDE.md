# SFG-Analysis Webhook Integration Guide

## Overview

This guide explains how to integrate with SFG-Analysis webhook endpoint for real-time event notifications and orchestration.

## Webhook Endpoint

**URL:** `https://sfg-analysis.abacusai.app/api/webhooks/nexus`  
**Method:** POST  
**Content-Type:** application/json  
**Authentication:** HMAC-SHA256 Signature

## Security

All webhook requests must include a valid HMAC-SHA256 signature in the `x-sfg-signature` header.

**Webhook Secret:** `sfg-analysis-webhook-secret-2025`

### Signature Verification

```typescript
import crypto from 'crypto';

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}
```

## Supported Events

### 1. project.created

Triggered when a new project is created in the SFG system.

**Payload:**
```json
{
  "event_type": "project.created",
  "event_id": "evt_abc123",
  "timestamp": "2025-11-05T10:00:00Z",
  "data": {
    "project_id": "proj_12345",
    "project_name": "Acme Corp - Office Renovation",
    "customer_id": "cust_67890",
    "customer_name": "Acme Corporation",
    "project_value": 50000,
    "created_by": "john.doe@sfg.com"
  }
}
```

**Actions Performed:**
- Create SharePoint folder structure
- Set folder permissions
- Initialize document tracking
- Enable storage monitoring

---

### 2. project.completed

Triggered when a project is marked as complete.

**Payload:**
```json
{
  "event_type": "project.completed",
  "event_id": "evt_def456",
  "timestamp": "2025-11-05T15:30:00Z",
  "data": {
    "project_id": "proj_12345",
    "project_name": "Acme Corp - Office Renovation",
    "completion_date": "2025-11-05",
    "final_value": 52000,
    "documents_count": 45
  }
}
```

**Actions Performed:**
- Archive project files
- Apply 7-year retention policy
- Optimize storage tier (move to cold storage)
- Generate completion report
- Calculate cost savings

---

### 3. invoice.generated

Triggered when an invoice is created in Xero.

**Payload:**
```json
{
  "event_type": "invoice.generated",
  "event_id": "evt_ghi789",
  "timestamp": "2025-11-05T12:00:00Z",
  "data": {
    "invoice_id": "inv_54321",
    "invoice_number": "INV-2025-1234",
    "project_id": "proj_12345",
    "customer_id": "cust_67890",
    "amount": 10000,
    "xero_invoice_id": "xero_inv_abc123",
    "invoice_url": "https://go.xero.com/invoices/xero_inv_abc123"
  }
}
```

**Actions Performed:**
- Download invoice PDF from Xero
- Upload to SharePoint: `Projects/[ProjectName]/Invoices/`
- Update document metadata (invoice_number, amount, date)
- Track storage usage
- Confirm Xero ↔ SharePoint sync

---

### 4. document.uploaded

Triggered when a document is uploaded to SharePoint.

**Payload:**
```json
{
  "event_type": "document.uploaded",
  "event_id": "evt_jkl012",
  "timestamp": "2025-11-05T14:20:00Z",
  "data": {
    "document_id": "doc_98765",
    "file_name": "drawing_v2.pdf",
    "file_size_bytes": 2048576,
    "uploaded_by": "jane.smith@sfg.com",
    "sharepoint_url": "https://sfg.sharepoint.com/sites/projects/...",
    "project_id": "proj_12345"
  }
}
```

**Actions Performed:**
- Analyze file type and content
- Categorize document automatically
- Extract metadata
- Check for duplicates
- Update storage metrics

---

### 5. quote.approved

Triggered when a customer quote is approved.

**Payload:**
```json
{
  "event_type": "quote.approved",
  "event_id": "evt_mno345",
  "timestamp": "2025-11-05T09:45:00Z",
  "data": {
    "quote_id": "quote_11111",
    "quote_number": "QUO-2025-5678",
    "customer_id": "cust_67890",
    "customer_name": "Acme Corporation",
    "quote_value": 50000,
    "approved_by": "customer",
    "approval_date": "2025-11-05"
  }
}
```

**Actions Performed:**
- Sync quote to Logikal
- Prepare project folder
- Create drawing templates
- Plan storage allocation
- Activate document workflow

---

### 6. storage.threshold_exceeded

Triggered when storage cost exceeds budget threshold.

**Payload:**
```json
{
  "event_type": "storage.threshold_exceeded",
  "event_id": "evt_pqr678",
  "timestamp": "2025-11-05T16:00:00Z",
  "data": {
    "current_cost_gbp": 1250,
    "threshold_gbp": 1000,
    "variance_gbp": 250,
    "variance_percentage": 25,
    "site_url": "https://sfg.sharepoint.com/sites/projects",
    "total_storage_gb": 1500
  }
}
```

**Actions Performed:**
- Generate cost alert
- Analyze usage patterns
- Create cleanup recommendations
- Notify stakeholders
- Initiate optimization workflow

---

## Response Format

SFG-Analysis will respond with:

```json
{
  "status": "received",
  "event_id": "evt_abc123",
  "processed": true,
  "actions_queued": 3,
  "message": "Event processed successfully"
}
```

## Error Handling

In case of errors:

```json
{
  "status": "error",
  "event_id": "evt_abc123",
  "error_code": "PROCESSING_FAILED",
  "error_message": "Failed to create SharePoint folder",
  "retry_scheduled": true,
  "retry_at": "2025-11-05T10:05:00Z"
}
```

## Testing

Send a test webhook:

```bash
curl -X POST https://sfg-analysis.abacusai.app/api/webhooks/nexus \
  -H "Content-Type: application/json" \
  -H "x-sfg-signature: YOUR_HMAC_SIGNATURE" \
  -d '{
    "event_type": "project.created",
    "event_id": "test_123",
    "timestamp": "2025-11-05T10:00:00Z",
    "data": {
      "project_id": "test_proj",
      "project_name": "Test Project",
      "customer_id": "test_cust",
      "customer_name": "Test Customer"
    }
  }'
```

## Support

For webhook integration support:
- **Email:** warren@sfg-innovations.com
- **NEXUS Team:** nexus@sfg-innovations.com
- **Documentation:** https://sfg-analysis.abacusai.app/api/docs

---

*Part of the SFG Aluminium App Portfolio*
