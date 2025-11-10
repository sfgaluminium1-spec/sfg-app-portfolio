# SFG Intelligent Text Corrector - Message Handlers

## Overview

This document describes the webhook event handlers and message processing workflows for the SFG Intelligent Text Corrector application. The system receives events from NEXUS (incoming webhooks) and emits events to NEXUS and other MCP services (outgoing webhooks).

**Version:** 1.2.0  
**Last Updated:** 2025-11-10

---

## Architecture

### Event Flow

```
NEXUS/MCP Services
        ↓
    Incoming Webhooks
        ↓
   Signature Validation (HMAC-SHA256)
        ↓
    Event Router
        ↓
   Handler Functions
        ↓
   Business Logic Processing
        ↓
   Outgoing Webhooks
        ↓
    NEXUS/MCP Services
```

### Webhook Endpoint

**Base URL:** `https://sfg-ai-prompt.abacusai.app/api/webhooks/nexus`

**Security:**
- HMAC-SHA256 signature verification
- Secret key rotation every 90 days
- IP whitelist (optional, configurable)
- Rate limiting (1000 req/hour)

---

## Incoming Webhook Handlers

### 1. `user.preferences.updated`

**Purpose:** Synchronize user preference changes from NEXUS admin panel

**Handler Location:** `/api/webhooks/nexus/route.ts`

**Processing Steps:**
1. Validate webhook signature
2. Extract user_id and preferences object from payload
3. Query database for existing user record
4. Update user preferences in Prisma database
5. Invalidate user session cache to force preference reload
6. Return 200 OK with confirmation timestamp

**Payload Structure:**
```json
{
  "user_id": "user_123",
  "preferences": {
    "default_correction_mode": "business",
    "auto_apply_corrections": true,
    "language": "en-US"
  },
  "updated_at": "2025-11-10T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User preferences updated",
  "user_id": "user_123",
  "processed_at": "2025-11-10T10:00:01Z"
}
```

**Error Handling:**
- User not found: Return 404 with error message
- Invalid preferences: Return 400 with validation errors
- Database error: Return 500, retry with exponential backoff

---

### 2. `template.library.updated`

**Purpose:** Sync business template library updates from central repository

**Handler Location:** `/api/webhooks/nexus/route.ts`

**Processing Steps:**
1. Validate webhook signature
2. Extract template data from payload
3. Check if template exists in local database
4. If exists: Update template content and metadata
5. If new: Create new template record
6. Invalidate template cache
7. Emit `template.sync.completed` event back to NEXUS

**Payload Structure:**
```json
{
  "template_id": "tmpl_456",
  "template_name": "Professional Email Response",
  "category": "email",
  "content": "Dear [Name],...",
  "updated_by": "admin_user",
  "updated_at": "2025-11-10T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template library synchronized",
  "template_id": "tmpl_456",
  "action": "updated",
  "processed_at": "2025-11-10T10:00:02Z"
}
```

**Error Handling:**
- Invalid template format: Return 400 with validation errors
- Database constraint violation: Return 409 with conflict details
- Sync error: Return 500, NEXUS will retry

---

### 3. `correction.quality.alert`

**Purpose:** Receive and process correction quality alerts from NEXUS monitoring

**Handler Location:** `/api/webhooks/nexus/route.ts`

**Processing Steps:**
1. Validate webhook signature
2. Extract alert details and severity level
3. Log alert to monitoring database
4. If severity is "high" or "critical":
   - Send Slack notification to #sfg-text-corrector-alerts
   - Create incident ticket in tracking system
   - Trigger automatic quality analysis job
5. Update quality metrics dashboard
6. Return acknowledgment to NEXUS

**Payload Structure:**
```json
{
  "alert_type": "low_quality_output",
  "correction_id": "corr_789",
  "user_feedback": "incorrect suggestion",
  "severity": "medium",
  "timestamp": "2025-11-10T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quality alert processed",
  "alert_id": "alert_999",
  "actions_taken": ["logged", "slack_notification"],
  "processed_at": "2025-11-10T10:00:03Z"
}
```

**Error Handling:**
- Invalid severity level: Return 400 with valid severity options
- Notification failure: Log error, continue processing
- Database error: Return 500, retry

---

## Outgoing Webhook Emissions

### 1. `correction.completed`

**Trigger:** Every time a text correction is successfully processed

**Emission Location:** `/api/correct/route.ts`

**Recipients:**
- NEXUS (for orchestration and analytics)
- MCP-OPERATIONS (for usage tracking)

**Payload Structure:**
```json
{
  "correction_id": "corr_123",
  "user_id": "user_456",
  "original_text": "This is sample text with erors",
  "corrected_text": "This is sample text with errors",
  "correction_mode": "grammar",
  "timestamp": "2025-11-10T10:00:00Z",
  "processing_time_ms": 245
}
```

**Retry Logic:**
- Max retries: 3
- Initial delay: 1 second
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds per attempt

**Success Criteria:**
- HTTP 200-299 response from recipient
- Response received within timeout

---

### 2. `prompt.enhanced`

**Trigger:** When AI prompt enhancement is completed successfully

**Emission Location:** `/api/prompt-enhance/route.ts`

**Recipients:**
- NEXUS (for analytics and quality tracking)
- MCP-COMMUNICATIONS (for template suggestions)

**Payload Structure:**
```json
{
  "enhancement_id": "enh_789",
  "user_id": "user_456",
  "original_prompt": "write about dogs",
  "enhanced_prompt": "Write a comprehensive, 500-word article...",
  "timestamp": "2025-11-10T10:00:00Z",
  "quality_score": 0.92
}
```

**Quality Score Calculation:**
- Length improvement: 30%
- Specificity enhancement: 40%
- Clarity metrics: 30%

**Retry Logic:** Same as `correction.completed`

---

### 3. `user.usage.threshold`

**Trigger:** When user reaches 80%, 90%, or 100% of usage quota

**Emission Location:** Scheduled job + real-time checker in `/api/correct/route.ts`

**Recipients:**
- NEXUS (for billing and usage management)
- MCP-COMMUNICATIONS (for user notification)

**Payload Structure:**
```json
{
  "user_id": "user_456",
  "threshold_type": "daily_corrections",
  "current_usage": 95,
  "limit": 100,
  "period": "daily",
  "timestamp": "2025-11-10T10:00:00Z"
}
```

**Threshold Levels:**
- 80%: Warning notification
- 90%: Urgent notification
- 100%: Limit reached, corrections blocked

**Retry Logic:** Same as other outgoing webhooks

---

## Error Handling & Resilience

### Incoming Webhook Failures

1. **Invalid Signature:**
   - Return HTTP 401 Unauthorized
   - Log suspicious activity
   - No retry (security violation)

2. **Malformed Payload:**
   - Return HTTP 400 Bad Request
   - Include validation errors in response
   - No retry (client error)

3. **Processing Error:**
   - Return HTTP 500 Internal Server Error
   - NEXUS will retry with exponential backoff
   - Log error for investigation

### Outgoing Webhook Failures

1. **Network Timeout:**
   - Retry with exponential backoff (3 attempts)
   - Log timeout for monitoring
   - Alert on persistent failures

2. **Recipient Error (4xx):**
   - Log error details
   - No automatic retry (client issue)
   - Alert admin for investigation

3. **Recipient Error (5xx):**
   - Retry with exponential backoff
   - After 3 failures, queue for manual retry
   - Alert on persistent failures

---

## Monitoring & Observability

### Key Metrics

1. **Webhook Processing Time:**
   - Target: <500ms for incoming webhooks
   - Alert if p95 > 1 second

2. **Webhook Success Rate:**
   - Target: >99% for incoming webhooks
   - Target: >97% for outgoing webhooks
   - Alert if rate drops below target

3. **Retry Queue Depth:**
   - Normal: 0-10 items
   - Warning: 10-50 items
   - Critical: >50 items

### Logging

All webhook events are logged with:
- Event type
- Timestamp
- Payload hash (for debugging without exposing data)
- Processing time
- Success/failure status
- Error message (if applicable)

### Alerting

**Slack Notifications:**
- High error rate (>5% failures in 5 minutes)
- Retry queue depth critical
- Security violations (invalid signatures)

**Email Alerts:**
- Extended downtime (>5 minutes)
- Database connection failures
- Critical errors requiring immediate attention

---

## Security Considerations

### Signature Verification

All incoming webhooks MUST include `X-NEXUS-Signature` header:

```
X-NEXUS-Signature: sha256=<hmac_hash>
```

Verification algorithm:
```typescript
const signature = req.headers['x-nexus-signature'];
const payload = JSON.stringify(req.body);
const expectedSignature = 'sha256=' + 
  crypto.createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('hex');

if (signature !== expectedSignature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### Secret Key Rotation

- Secrets rotated every 90 days
- 7-day overlap period for smooth transition
- NEXUS notified of rotation schedule

### Rate Limiting

- Incoming: 1000 requests/hour per endpoint
- Outgoing: 500 requests/hour per destination
- Burst allowance: 50 requests/minute

---

## Testing

### Local Testing

Use webhook testing tool to simulate NEXUS events:

```bash
curl -X POST https://sfg-ai-prompt.abacusai.app/api/webhooks/nexus \
  -H "Content-Type: application/json" \
  -H "X-NEXUS-Signature: sha256=<hmac_hash>" \
  -d '{
    "event": "user.preferences.updated",
    "user_id": "test_user_123",
    "preferences": {
      "default_correction_mode": "grammar"
    }
  }'
```

### Integration Testing

- Test all incoming webhook handlers
- Verify signature validation
- Test error scenarios (invalid payloads, missing fields)
- Verify outgoing webhook emissions
- Test retry logic for failed outgoing webhooks

---

## Deployment Checklist

Before deploying webhook changes:

- [ ] All handlers have unit tests
- [ ] Integration tests pass
- [ ] Signature verification implemented
- [ ] Rate limiting configured
- [ ] Error handling verified
- [ ] Monitoring dashboards updated
- [ ] Alert thresholds configured
- [ ] Documentation updated
- [ ] NEXUS team notified of changes

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-10  
**Maintained By:** SFG Innovations Development Team
