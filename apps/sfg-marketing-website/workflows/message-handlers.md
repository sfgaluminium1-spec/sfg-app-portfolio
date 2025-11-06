# SFG Chrome Extension Marketing Website Message Handlers

## Incoming Message Handlers

### From NEXUS to SFG Chrome Extension Marketing Website


#### `nexus.app.registered`

**Description:** Notification when a new app is registered in the SFG ecosystem

**Payload:**
```json
{
  "app_id": "app-123",
  "app_name": "New SFG App",
  "category": "productivity",
  "status": "pending_approval"
}
```

**Handler:** `handle_nexus_app_registered()`

**Implementation Location:** `/api/webhooks/nexus/route.ts`

---

#### `analytics.report.generated`

**Description:** Periodic analytics reports from NEXUS

**Payload:**
```json
{
  "period": "weekly",
  "metrics": {
    "visitors": 1500,
    "signups": 45,
    "conversions": 12
  }
}
```

**Handler:** `handle_analytics_report_generated()`

**Implementation Location:** `/api/webhooks/nexus/route.ts`

---

## Outgoing Message Handlers

### From SFG Chrome Extension Marketing Website to NEXUS


#### `user.signup.completed`

**Description:** Triggered when a new user successfully signs up

**Payload:**
```json
{
  "user_id": "user-123",
  "email": "user@example.com",
  "signup_date": "2025-11-06T00:00:00Z",
  "source": "marketing_website"
}
```

**Trigger:** Triggered when a new user successfully signs up

**Implementation Location:** Triggered from respective API routes

---

#### `integration.request.submitted`

**Description:** Triggered when a developer submits an app integration request

**Payload:**
```json
{
  "request_id": "req-456",
  "developer_email": "dev@company.com",
  "app_name": "Proposed App",
  "app_description": "Description of the proposed integration",
  "submitted_at": "2025-11-06T00:00:00Z"
}
```

**Trigger:** Triggered when a developer submits an app integration request

**Implementation Location:** Triggered from respective API routes

---

#### `contact.form.submitted`

**Description:** Triggered when a visitor submits the contact form

**Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Interested in enterprise features",
  "submitted_at": "2025-11-06T00:00:00Z"
}
```

**Trigger:** Triggered when a visitor submits the contact form

**Implementation Location:** Triggered from respective API routes

---

## Event Flow Architecture

```
[User Action] → [API Route] → [Database Update] → [Webhook Trigger] → [NEXUS]
                                                                     ↓
                                                            [Other SFG Apps]
```

## Security

All outgoing webhooks include:
- HMAC-SHA256 signature
- Timestamp
- Nonce for replay protection
- API key validation

## Error Handling

- **Retry Policy:** 3 attempts with exponential backoff
- **Timeout:** 30 seconds per request
- **Fallback:** Log to error tracking system if all retries fail
