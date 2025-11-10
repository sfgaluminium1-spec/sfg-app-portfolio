# SFG Intelligent Text Corrector - Message Handlers

## Overview

This document describes how the SFG Intelligent Text Corrector handles incoming and outgoing webhooks for NEXUS orchestration and event-driven architecture within the SFG ecosystem.

The app provides intelligent text correction and AI prompt enhancement capabilities via:
- **Web Application**: https://sfg-ai-prompt.abacusai.app
- **Chrome Extension**: Right-click context menu integration
- **API Endpoints**: RESTful APIs for programmatic access

---

## Incoming Webhook Handlers

### From NEXUS to SFG Intelligent Text Corrector

#### 1. `nexus.task.assigned`

**Trigger:** When NEXUS assigns a text correction or AI prompt enhancement task to this app

**Payload:**
```json
{
  "task_id": "task_12345",
  "task_type": "text_correction",
  "text": "Sample text to correct or enhance",
  "mode": "grammar_check",
  "user_id": "user_123",
  "timestamp": "2025-11-10T12:00:00Z"
}
```

**Processing:**
1. Validate webhook signature (HMAC-SHA256)
2. Extract task details and text content
3. Route to appropriate processing pipeline:
   - Grammar Check → `/api/correct` with mode=grammar_check
   - Prompt Enhancement → `/api/prompt-enhance`
4. Process text using Abacus.AI LLM APIs
5. Store result in database with user_id reference
6. Emit `text.corrected` or `prompt.enhanced` webhook
7. Return 200 OK with processing status

**Error Handling:**
- Invalid signature: Return 401 Unauthorized
- Invalid payload: Return 400 Bad Request with validation errors
- LLM API timeout: Return 500 Internal Server Error, auto-retry with exponential backoff
- Database error: Log error, emit `correction.failed` webhook

**Processing Time:** Typically 1-3 seconds per request

---

#### 2. `user.text.submitted`

**Trigger:** When a user submits text for correction through the web app or Chrome extension

**Payload:**
```json
{
  "user_id": "user_123",
  "text": "Sample text with potential errors",
  "correction_mode": "grammar_check",
  "source": "chrome_extension",
  "timestamp": "2025-11-10T12:00:00Z"
}
```

**Processing:**
1. Validate webhook signature
2. Check user authentication and session validity
3. Validate text length (max 5000 characters)
4. Apply correction mode:
   - `grammar_check` → Fix grammar and spelling errors
   - `punctuation_check` → Fix punctuation only
   - `simple_rewrite` → Simplify language
   - `business_style_rewrite` → Professional business tone
   - `technical_rewrite` → Technical documentation style
5. Process via LLM API with appropriate prompts
6. Save to correction history (database)
7. Emit `text.corrected` webhook
8. Return corrected text to user

**Error Handling:**
- Text too long: Return 413 Payload Too Large
- Invalid mode: Return 400 Bad Request
- Authentication failed: Return 401 Unauthorized
- Rate limit exceeded: Return 429 Too Many Requests

**Rate Limiting:** 100 corrections/hour per user

---

#### 3. `prompt.enhancement.requested`

**Trigger:** When an AI prompt enhancement is requested via NEXUS or direct submission

**Payload:**
```json
{
  "user_id": "user_123",
  "original_prompt": "Write a blog post",
  "enhancement_type": "structure_and_clarity",
  "context": "business_communication",
  "timestamp": "2025-11-10T12:00:00Z"
}
```

**Processing:**
1. Validate webhook signature
2. Extract prompt and enhancement preferences
3. Apply AI-powered prompt enhancement:
   - Analyze prompt structure and clarity
   - Add missing context and details
   - Improve specificity and actionability
   - Optimize for LLM understanding
4. Generate enhanced prompt using meta-prompting techniques
5. Save to enhancement history
6. Emit `prompt.enhanced` webhook
7. Return enhanced prompt

**Error Handling:**
- Empty prompt: Return 400 Bad Request
- Enhancement failed: Return 500 Internal Server Error, emit `correction.failed` webhook
- Invalid context: Use default context

**Processing Time:** Typically 2-4 seconds per request

---

#### 4. `template.requested`

**Trigger:** When a business template is requested from the template library

**Payload:**
```json
{
  "user_id": "user_123",
  "template_category": "business",
  "template_name": "meeting_minutes",
  "timestamp": "2025-11-10T12:00:00Z"
}
```

**Processing:**
1. Validate webhook signature
2. Lookup template in database by category and name
3. Retrieve template content and metadata
4. Apply user preferences (if any)
5. Return template to user
6. Log template usage for analytics

**Error Handling:**
- Template not found: Return 404 Not Found with similar suggestions
- Invalid category: Return 400 Bad Request

**Response Time:** <100ms (cached templates)

---

## Outgoing Webhook Emissions

### From SFG Intelligent Text Corrector to NEXUS

#### 1. `text.corrected`

**Trigger:** When text has been successfully corrected and is ready for delivery

**Payload:**
```json
{
  "correction_id": "corr_12345",
  "original_text": "Sample text with errors",
  "corrected_text": "Sample text without errors",
  "corrections_made": 5,
  "correction_mode": "grammar_check",
  "user_id": "user_123",
  "timestamp": "2025-11-10T12:01:00Z"
}
```

**Recipients:**
- NEXUS (orchestration and audit logging)
- SFG-ANALYTICS (usage tracking)
- User notification service (if configured)

**Retry Logic:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds per attempt

**Sent To:** `https://nexus.sfg-comet.com/api/webhooks/text-corrected`

---

#### 2. `prompt.enhanced`

**Trigger:** When an AI prompt has been successfully enhanced

**Payload:**
```json
{
  "enhancement_id": "enh_12345",
  "original_prompt": "Write a blog post",
  "enhanced_prompt": "Write a comprehensive 1500-word blog post about...",
  "improvements": ["Added structure", "Clarified objective", "Added context"],
  "user_id": "user_123",
  "timestamp": "2025-11-10T12:01:00Z"
}
```

**Recipients:**
- NEXUS (orchestration)
- SFG-ANALYTICS (feature usage tracking)
- User dashboard (real-time update)

**Retry Logic:** Same as `text.corrected`

**Sent To:** `https://nexus.sfg-comet.com/api/webhooks/prompt-enhanced`

---

#### 3. `correction.failed`

**Trigger:** When text correction or prompt enhancement fails due to errors

**Payload:**
```json
{
  "task_id": "task_12345",
  "error_type": "api_timeout",
  "error_message": "LLM API request timed out after 30 seconds",
  "user_id": "user_123",
  "timestamp": "2025-11-10T12:01:00Z"
}
```

**Recipients:**
- NEXUS (error logging and alerting)
- SFG-OPERATIONS (incident tracking)
- Internal Slack (#sfg-ai-alerts)

**Sent To:** `https://nexus.sfg-comet.com/api/webhooks/correction-failed`

**Error Types:**
- `api_timeout` - LLM API timeout
- `invalid_text` - Text validation failed
- `rate_limit` - Rate limit exceeded
- `database_error` - Database write failed
- `unknown` - Unexpected error

---

#### 4. `usage.metrics.updated`

**Trigger:** Periodic updates of usage metrics (every 5 minutes) for dashboard widgets

**Payload:**
```json
{
  "total_corrections_today": 150,
  "total_prompts_enhanced_today": 45,
  "active_users_today": 23,
  "average_response_time": "1.8s",
  "error_rate": "0.3%",
  "timestamp": "2025-11-10T12:00:00Z"
}
```

**Recipients:**
- NEXUS (central metrics aggregation)
- SFG-ALUMINIUM-UNIFIED-DASHBOARD (real-time dashboard)
- SFG-ANALYTICS (historical data)

**Sent To:** `https://nexus.sfg-comet.com/api/webhooks/metrics-updated`

**Frequency:** Every 5 minutes during business hours, every 15 minutes off-hours

---

## Workflow Diagrams

### Main Text Correction Workflow

```
User Input (Web/Extension) 
    ↓
Validation & Authentication
    ↓
Route to Correction Mode
    ↓
LLM API Processing (1-3s)
    ↓
Save to Database
    ↓
Emit text.corrected webhook → NEXUS
    ↓
Return to User (Web/Extension)
    ↓
[Success] Update Dashboard Metrics
```

### Error Handling Workflow

```
Request Received
    ↓
[Validation Error?] → Return 400 Bad Request → STOP
    ↓
[Auth Error?] → Return 401 Unauthorized → STOP
    ↓
Process via LLM API
    ↓
[API Timeout?] → Retry (3 attempts) → [All Failed?] → Emit correction.failed → Return 500
    ↓
[Database Error?] → Emit correction.failed → Return 500
    ↓
[Success] → Emit text.corrected → Return 200
```

### Webhook Event Flow

```
NEXUS (orchestrator)
    ↓
    [nexus.task.assigned] → SFG Intelligent Text Corrector
    ↓
Process Text/Prompt
    ↓
    [text.corrected / prompt.enhanced] → NEXUS
    ↓
NEXUS Updates Dashboard
    ↓
User Notification (if configured)
```

---

## Security

### Webhook Signature Verification

All incoming webhooks MUST include a valid HMAC-SHA256 signature in the `X-SFG-Signature` header:

```javascript
const crypto = require('crypto');
const secret = process.env.WEBHOOK_SECRET;

function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

### Rate Limiting

**Incoming Webhooks:**
- 1000 requests/hour per IP
- Burst: 20 requests/minute

**Outgoing Webhooks:**
- 500 requests/hour to NEXUS
- No burst limit (queued)

### IP Whitelisting (Optional)

Production webhooks can be restricted to SFG internal IPs:
- NEXUS: 10.0.1.0/24
- MCP Servers: 10.0.2.0/24

### Audit Logging

All webhook events are logged with:
- Timestamp (ISO 8601)
- Source/Destination
- Payload hash (SHA256)
- Response status
- Processing time
- User ID (if applicable)

Logs retained for 90 days in compliance with data retention policy.

---

## Monitoring & Alerting

### Key Metrics

**Performance:**
- Average webhook processing time: Target <2s
- API response time: Target <3s
- Error rate: Target <1%

**Availability:**
- Uptime: Target >99.9%
- Webhook success rate: Target >99%

**Usage:**
- Total corrections/day
- Total prompts enhanced/day
- Active users/day
- Chrome extension installs

### Alert Triggers

**Critical Alerts (Immediate):**
- Webhook processing time >10s
- Error rate >5%
- System downtime >1 minute
- LLM API failures >10/minute

**Warning Alerts (Within 1 hour):**
- Error rate >2%
- Response time >5s
- Webhook queue >100 items

**Notification Channels:**
- Slack: #sfg-ai-alerts (real-time)
- Email: warren@SFG-innovations.com (critical only)
- Dashboard: Red alert banner (all users)

### Dashboard Integration

Real-time metrics displayed in:
- **SFG-ALUMINIUM-UNIFIED-DASHBOARD**: Central hub with 7 widgets
- **Internal Admin Panel**: https://sfg-ai-prompt.abacusai.app/app/admin
- **NEXUS Orchestration Dashboard**: System-wide health

---

## Testing & Validation

### Webhook Testing

**Test Endpoint:** `POST /api/webhooks/test`

Example test payload:
```json
{
  "event": "nexus.task.assigned",
  "test": true,
  "payload": {
    "task_id": "test_12345",
    "text": "This is a test correction request"
  }
}
```

Expected response: `200 OK` with processing confirmation

### Integration Testing

1. **Unit Tests**: Test individual webhook handlers
2. **Integration Tests**: Test full workflow from NEXUS → App → NEXUS
3. **Load Tests**: Simulate 1000 webhooks/hour
4. **Failure Tests**: Test error handling and retry logic

### Monitoring Tools

- **Application Performance Monitoring (APM)**: Track response times
- **Log Aggregation**: Centralized logging with search
- **Real-time Dashboards**: Grafana + Prometheus
- **Alerting**: PagerDuty integration for critical alerts

---

## Version History

**v1.2.0** (Current)
- Added `prompt.enhancement.requested` webhook
- Added `usage.metrics.updated` periodic webhook
- Enhanced error handling with detailed error types
- Added rate limiting per user

**v1.0.0** (Initial)
- Basic text correction webhooks
- Chrome extension integration
- NEXUS orchestration support

---

**Document Version:** 1.2.0  
**Last Updated:** November 10, 2025  
**Owner:** Warren Heathcote (warren@SFG-innovations.com)  
**Status:** Production Ready
