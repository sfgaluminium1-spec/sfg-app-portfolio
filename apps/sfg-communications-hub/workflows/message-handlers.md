# SFG Communications Hub Message Handlers

## Event-Driven Architecture

The SFG Communications Hub uses an event-driven architecture to integrate with the NEXUS orchestration layer. All events are processed asynchronously via webhooks with retry logic and failure handling.

---

## Incoming Message Handlers

### From NEXUS to SFG Communications Hub

These are events that the Communications Hub receives and processes from the NEXUS orchestration layer.


#### `email.received`

**Description:** Webhook triggered when new email arrives in monitored account

**Payload:**
```json
{
  "email_id": "msg_123456",
  "account": "info@sfgaluminium.com.au",
  "from": "customer@example.com",
  "subject": "Quote request for aluminium doors",
  "received_at": "2025-11-10T10:30:00Z",
  "body_preview": "Hi, I would like a quote for..."
}
```

**Handler:** `handle_email_received()`

**Endpoint:** `POST /api/webhooks/nexus`

**Processing:**
1. Verify HMAC signature
2. Parse event payload
3. Validate required fields
4. Execute business logic
5. Return 200 OK (or 4xx/5xx on error)

---

#### `user.authenticated`

**Description:** User successfully logged in to the communications hub

**Payload:**
```json
{
  "user_id": "user_001",
  "email": "warren@SFG-innovations.com",
  "role": "admin",
  "login_at": "2025-11-10T09:00:00Z"
}
```

**Handler:** `handle_user_authenticated()`

**Endpoint:** `POST /api/webhooks/nexus`

**Processing:**
1. Verify HMAC signature
2. Parse event payload
3. Validate required fields
4. Execute business logic
5. Return 200 OK (or 4xx/5xx on error)

---

#### `account.sync.requested`

**Description:** Manual email sync requested by user

**Payload:**
```json
{
  "account_id": "acc_123",
  "email": "projects@sfgaluminium.com.au",
  "requested_by": "warren@SFG-innovations.com",
  "requested_at": "2025-11-10T11:00:00Z"
}
```

**Handler:** `handle_account_sync_requested()`

**Endpoint:** `POST /api/webhooks/nexus`

**Processing:**
1. Verify HMAC signature
2. Parse event payload
3. Validate required fields
4. Execute business logic
5. Return 200 OK (or 4xx/5xx on error)

---

#### `client.config.downloaded`

**Description:** User downloaded email client configuration

**Payload:**
```json
{
  "account_id": "acc_123",
  "client": "mailspring",
  "platform": "windows",
  "downloaded_by": "staff@sfgaluminium.com.au",
  "downloaded_at": "2025-11-10T12:00:00Z"
}
```

**Handler:** `handle_client_config_downloaded()`

**Endpoint:** `POST /api/webhooks/nexus`

**Processing:**
1. Verify HMAC signature
2. Parse event payload
3. Validate required fields
4. Execute business logic
5. Return 200 OK (or 4xx/5xx on error)

---

## Outgoing Message Handlers

### From SFG Communications Hub to NEXUS

These are events that the Communications Hub sends to the NEXUS orchestration layer for further processing or routing to other SFG applications.


#### `email.triaged`

**Description:** Email has been classified by AI and is ready for routing

**Payload:**
```json
{
  "email_id": "msg_123456",
  "account": "info@sfgaluminium.com.au",
  "classification": {
    "department": "sales",
    "priority": "high",
    "category": "quote_request",
    "confidence": 0.95
  },
  "routing": {
    "assigned_to": "sales_team",
    "sla_deadline": "2025-11-11T10:30:00Z"
  },
  "triaged_at": "2025-11-10T10:30:05Z"
}
```

**Trigger:** Email has been classified by AI and is ready for routing

**Endpoint:** `POST https://nexus.sfgaluminium.com/api/events`

**Retry Policy:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds

---

#### `account.health.alert`

**Description:** Email account health check failed or degraded

**Payload:**
```json
{
  "account_id": "acc_123",
  "email": "accounts@sfgaluminium.com.au",
  "status": "degraded",
  "error": "IMAP connection timeout",
  "last_sync": "2025-11-10T09:45:00Z",
  "alert_severity": "warning"
}
```

**Trigger:** Email account health check failed or degraded

**Endpoint:** `POST https://nexus.sfgaluminium.com/api/events`

**Retry Policy:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds

---

#### `system.metrics.updated`

**Description:** Periodic system metrics broadcast for analytics

**Payload:**
```json
{
  "timestamp": "2025-11-10T11:00:00Z",
  "metrics": {
    "emails_processed_today": 247,
    "success_rate": 98.2,
    "average_triage_time": 3.8,
    "active_accounts": 14,
    "configured_clients": 28
  }
}
```

**Trigger:** Periodic system metrics broadcast for analytics

**Endpoint:** `POST https://nexus.sfgaluminium.com/api/events`

**Retry Policy:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds

---

#### `user.onboarded`

**Description:** New user account created and granted access

**Payload:**
```json
{
  "user_id": "user_005",
  "email": "new.staff@sfgaluminium.com.au",
  "role": "user",
  "created_by": "warren@SFG-innovations.com",
  "created_at": "2025-11-10T08:30:00Z"
}
```

**Trigger:** New user account created and granted access

**Endpoint:** `POST https://nexus.sfgaluminium.com/api/events`

**Retry Policy:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds

---

#### `workflow.completed`

**Description:** Implementation workflow step completed

**Payload:**
```json
{
  "workflow": "Email Account Onboarding",
  "step": "Account validated and synced",
  "progress_percentage": 94,
  "completed_at": "2025-11-10T10:00:00Z"
}
```

**Trigger:** Implementation workflow step completed

**Endpoint:** `POST https://nexus.sfgaluminium.com/api/events`

**Retry Policy:**
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout: 30 seconds

---

## Integration with Other SFG Apps

The Communications Hub integrates with other SFG applications via NEXUS:

### Sales CRM Integration
- Receives: `email.triaged` (when classified as sales inquiry)
- Sends: `lead.created`, `opportunity.updated`

### Finance System Integration
- Receives: `email.triaged` (when classified as invoice/payment)
- Sends: `invoice.received`, `payment.notification`

### Operations Management Integration
- Receives: `email.triaged` (when classified as project/delivery)
- Sends: `project.update`, `delivery.notification`

### WhatsApp Business Integration (Future)
- Receives: `whatsapp.message.received`
- Sends: `whatsapp.message.sent`

### Google Chat Integration (Future)
- Receives: `gchat.message.received`
- Sends: `gchat.message.sent`

---

## Error Handling

All message handlers implement comprehensive error handling:

1. **Validation Errors (400)**: Invalid payload structure
2. **Authentication Errors (401)**: Invalid HMAC signature
3. **Rate Limit Errors (429)**: Too many requests
4. **Server Errors (500)**: Internal processing failures

Failed events are logged to the database and can be retried manually via the admin dashboard.

---

## Monitoring & Observability

All webhook events are logged with:
- Event type and payload
- Processing time
- Success/failure status
- Error messages (if any)
- Retry attempts

Metrics are available in the real-time dashboard under "System Health Monitor".

---

**Last Updated:** {datetime.utcnow().strftime('%Y-%m-%d')}  
**Documentation Version:** 1.2.3
