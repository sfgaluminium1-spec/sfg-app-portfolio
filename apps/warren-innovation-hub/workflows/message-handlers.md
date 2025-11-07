# Warren Heathcote AI & Aluminium Innovation Hub Message Handlers

## Overview

This document describes the complete event-driven architecture for the Warren Innovation Hub, including all incoming and outgoing message handlers for NEXUS orchestration.

---

## Incoming Message Handlers

### From NEXUS to Warren Heathcote AI & Aluminium Innovation Hub


#### `enquiry.created`

**Description:** New business enquiry received from NEXUS orchestration

**Handler Function:** `handle_enquiry_created()`

**Payload Schema:**
```json
{
  "enquiry_id": "ENQ-2025-001",
  "source": "sfg-website",
  "customer_name": "John Doe",
  "email": "john@example.com",
  "enquiry_type": "executive_services",
  "priority": "high",
  "created_at": "2025-11-05T10:30:00Z"
}
```

**Processing Steps:**
1. Validate webhook signature (HMAC-SHA256)
2. Parse and validate payload schema
3. Execute business logic for event type
4. Update relevant data models
5. Send confirmation response
6. Trigger any outgoing webhooks if needed

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request
- Processing error: Return 500 Internal Server Error
- Retry failed requests up to 3 times

---

#### `financial.update`

**Description:** Financial data update from Xero integration

**Handler Function:** `handle_financial_update()`

**Payload Schema:**
```json
{
  "update_type": "invoice_paid",
  "invoice_id": "INV-2025-123",
  "amount": 15000.0,
  "currency": "GBP",
  "customer": "SFG Aluminium Ltd",
  "payment_date": "2025-11-05T14:00:00Z"
}
```

**Processing Steps:**
1. Validate webhook signature (HMAC-SHA256)
2. Parse and validate payload schema
3. Execute business logic for event type
4. Update relevant data models
5. Send confirmation response
6. Trigger any outgoing webhooks if needed

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request
- Processing error: Return 500 Internal Server Error
- Retry failed requests up to 3 times

---

#### `wellness.booking`

**Description:** New wellness appointment booking for Yanika's services

**Handler Function:** `handle_wellness_booking()`

**Payload Schema:**
```json
{
  "booking_id": "BOOK-2025-456",
  "client_name": "Sarah Ahmed",
  "service": "AI Dermatology Consultation",
  "scheduled_date": "2025-11-08T15:00:00Z",
  "location": "Dubai",
  "status": "confirmed"
}
```

**Processing Steps:**
1. Validate webhook signature (HMAC-SHA256)
2. Parse and validate payload schema
3. Execute business logic for event type
4. Update relevant data models
5. Send confirmation response
6. Trigger any outgoing webhooks if needed

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request
- Processing error: Return 500 Internal Server Error
- Retry failed requests up to 3 times

---

#### `instagram.engagement`

**Description:** Significant engagement spike on Instagram posts

**Handler Function:** `handle_instagram_engagement()`

**Payload Schema:**
```json
{
  "post_id": "IG-2025-789",
  "engagement_type": "surge",
  "likes": 1500,
  "comments": 230,
  "shares": 85,
  "reach": 12000,
  "timestamp": "2025-11-05T18:00:00Z"
}
```

**Processing Steps:**
1. Validate webhook signature (HMAC-SHA256)
2. Parse and validate payload schema
3. Execute business logic for event type
4. Update relevant data models
5. Send confirmation response
6. Trigger any outgoing webhooks if needed

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request
- Processing error: Return 500 Internal Server Error
- Retry failed requests up to 3 times

---

#### `sharepoint.update`

**Description:** SharePoint document library updated

**Handler Function:** `handle_sharepoint_update()`

**Payload Schema:**
```json
{
  "library_name": "Warren's Personal Suite",
  "update_type": "document_added",
  "document_name": "Q4-Strategy-Report.pdf",
  "added_by": "warren@sfg-innovations.com",
  "timestamp": "2025-11-05T09:00:00Z"
}
```

**Processing Steps:**
1. Validate webhook signature (HMAC-SHA256)
2. Parse and validate payload schema
3. Execute business logic for event type
4. Update relevant data models
5. Send confirmation response
6. Trigger any outgoing webhooks if needed

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request
- Processing error: Return 500 Internal Server Error
- Retry failed requests up to 3 times

---

## Outgoing Message Handlers

### From Warren Heathcote AI & Aluminium Innovation Hub to NEXUS


#### `executive.decision`

**Description:** Strategic decision made in executive dashboard requiring cross-app action

**Trigger Function:** `send_executive_decision()`

**Payload Schema:**
```json
{
  "decision_id": "DEC-2025-001",
  "decision_type": "investment_approval",
  "amount": 250000.0,
  "category": "cryptocurrency",
  "approved_by": "warren@sfg-innovations.com",
  "requires_action": [
    "mcp-finance",
    "mcp-communications"
  ],
  "timestamp": "2025-11-05T11:00:00Z"
}
```

**Trigger Conditions:**
- Strategic decision made in executive dashboard requiring cross-app action

**Processing Steps:**
1. Gather event data from application state
2. Format payload according to schema
3. Sign payload with HMAC-SHA256
4. Send POST request to NEXUS webhook endpoint
5. Handle response and retry if needed
6. Log event for audit trail

**Retry Logic:**
- Max retries: 3
- Backoff strategy: Exponential (2s, 4s, 8s)
- Timeout: 30 seconds per attempt

---

#### `wellness.insight`

**Description:** AI dermatology insights for client wellness tracking

**Trigger Function:** `send_wellness_insight()`

**Payload Schema:**
```json
{
  "client_id": "CLI-2025-123",
  "insight_type": "skin_analysis",
  "recommendations": [
    "Hydration boost",
    "SPF 50+",
    "Vitamin C serum"
  ],
  "follow_up_date": "2025-12-05",
  "confidence_score": 0.94,
  "timestamp": "2025-11-05T16:00:00Z"
}
```

**Trigger Conditions:**
- AI dermatology insights for client wellness tracking

**Processing Steps:**
1. Gather event data from application state
2. Format payload according to schema
3. Sign payload with HMAC-SHA256
4. Send POST request to NEXUS webhook endpoint
5. Handle response and retry if needed
6. Log event for audit trail

**Retry Logic:**
- Max retries: 3
- Backoff strategy: Exponential (2s, 4s, 8s)
- Timeout: 30 seconds per attempt

---

#### `campaign.performance`

**Description:** Marketing campaign performance milestone reached

**Trigger Function:** `send_campaign_performance()`

**Payload Schema:**
```json
{
  "campaign_id": "CAMP-2025-SUMMER",
  "milestone": "10k_reach",
  "metrics": {
    "reach": 10500,
    "engagement_rate": 8.5,
    "roi": 320.0
  },
  "next_action": "scale_up",
  "timestamp": "2025-11-05T20:00:00Z"
}
```

**Trigger Conditions:**
- Marketing campaign performance milestone reached

**Processing Steps:**
1. Gather event data from application state
2. Format payload according to schema
3. Sign payload with HMAC-SHA256
4. Send POST request to NEXUS webhook endpoint
5. Handle response and retry if needed
6. Log event for audit trail

**Retry Logic:**
- Max retries: 3
- Backoff strategy: Exponential (2s, 4s, 8s)
- Timeout: 30 seconds per attempt

---

#### `financial.alert`

**Description:** Critical financial threshold or anomaly detected

**Trigger Function:** `send_financial_alert()`

**Payload Schema:**
```json
{
  "alert_type": "cash_flow_low",
  "current_balance": 45000.0,
  "threshold": 50000.0,
  "severity": "medium",
  "recommended_action": "transfer_funds",
  "timestamp": "2025-11-05T08:00:00Z"
}
```

**Trigger Conditions:**
- Critical financial threshold or anomaly detected

**Processing Steps:**
1. Gather event data from application state
2. Format payload according to schema
3. Sign payload with HMAC-SHA256
4. Send POST request to NEXUS webhook endpoint
5. Handle response and retry if needed
6. Log event for audit trail

**Retry Logic:**
- Max retries: 3
- Backoff strategy: Exponential (2s, 4s, 8s)
- Timeout: 30 seconds per attempt

---

#### `content.published`

**Description:** Multi-platform content successfully published

**Trigger Function:** `send_content_published()`

**Payload Schema:**
```json
{
  "content_id": "CONT-2025-789",
  "platforms": [
    "instagram",
    "facebook",
    "linkedin"
  ],
  "content_type": "wellness_tips",
  "engagement_target": 5000,
  "publish_time": "2025-11-05T12:00:00Z"
}
```

**Trigger Conditions:**
- Multi-platform content successfully published

**Processing Steps:**
1. Gather event data from application state
2. Format payload according to schema
3. Sign payload with HMAC-SHA256
4. Send POST request to NEXUS webhook endpoint
5. Handle response and retry if needed
6. Log event for audit trail

**Retry Logic:**
- Max retries: 3
- Backoff strategy: Exponential (2s, 4s, 8s)
- Timeout: 30 seconds per attempt

---

## Implementation Guide

### Webhook Security

All webhooks use HMAC-SHA256 signature verification:

```typescript
import crypto from 'crypto';

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

### Webhook Endpoint

```typescript
// app/api/webhooks/nexus/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('X-NEXUS-Signature');
    
    if (!verifyWebhookSignature(payload, signature, process.env.NEXUS_WEBHOOK_SECRET!)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const event = JSON.parse(payload);
    
    switch (event.type) {
      case 'enquiry.created':
        await handle_enquiry_created(event);
        break;
      case 'financial.update':
        await handle_financial_update(event);
        break;
      // ... other event handlers
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Sending Outgoing Events

```typescript
async function sendToNexus(event: string, payload: any) {
  const secret = process.env.NEXUS_WEBHOOK_SECRET!;
  const payloadString = JSON.stringify(payload);
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');
  
  const response = await fetch(process.env.NEXUS_WEBHOOK_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Warren-Signature': signature,
    },
    body: payloadString,
  });
  
  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.statusText}`);
  }
  
  return response.json();
}
```

---

## Testing

### Test Incoming Webhook

```bash
curl -X POST https://warren-innovation-hub.abacusai.app/api/webhooks/nexus \
  -H "Content-Type: application/json" \
  -H "X-NEXUS-Signature: <signature>" \
  -d '{"type": "enquiry.created", "data": {...}}'
```

### Test Outgoing Webhook

```typescript
await sendToNexus('executive.decision', {
  decision_id: 'DEC-TEST-001',
  decision_type: 'test',
  // ... other fields
});
```

---

## Monitoring & Logging

All webhook events are logged with:
- Event type
- Timestamp
- Payload (sanitized)
- Response status
- Processing time
- Any errors

Logs are stored in:
- Application logs: `/var/log/warren-hub/webhooks.log`
- Database: `webhook_events` table
- External monitoring: New Relic / DataDog

---

**Last Updated:** {datetime.utcnow().strftime('%Y-%m-%d')}  
**Version:** 3.0.0
