
# SFG-SYNC - Message Handlers & Event-Driven Architecture

**App:** SFG-SYNC: AI-Driven Scheduling Intelligence Platform  
**Version:** 2.0.0  
**Last Updated:** November 10, 2025  
**Purpose:** Document how SFG-SYNC handles incoming webhooks, processes business events, emits outgoing webhooks, and responds to synchronous message queries from NEXUS and other SFG apps.

---

## Table of Contents

1. [Overview](#overview)
2. [Incoming Webhook Handlers](#incoming-webhook-handlers)
3. [Outgoing Webhook Emissions](#outgoing-webhook-emissions)
4. [Synchronous Message Queries](#synchronous-message-queries)
5. [Synchronous Message Actions](#synchronous-message-actions)
6. [Security & Authentication](#security--authentication)
7. [Error Handling & Retry Logic](#error-handling--retry-logic)
8. [Monitoring & Observability](#monitoring--observability)
9. [Workflow Diagrams](#workflow-diagrams)

---

## Overview

SFG-SYNC operates as a **real-time, event-driven scheduling system** that participates in the broader SFG COMET Core orchestration ecosystem. It:

- **Receives webhook events** from NEXUS and other apps (enquiries, orders, fabrication updates, etc.)
- **Processes business logic** (schedule creation, conflict detection, resource optimization, Customer Guardian AI)
- **Emits webhook events** to notify NEXUS and other apps of schedule changes, milestones, conflicts, etc.
- **Responds to synchronous queries** from NEXUS or other apps (schedule status, capacity, conflicts)

All interactions are **secured with HMAC-SHA256 signatures**, **rate-limited**, and **monitored** for performance and reliability.

---

## Incoming Webhook Handlers

### 1. `enquiry.created`

**Trigger:** New customer enquiry received by ESP or Communications Hub

**Payload:**
```json
{
  "enquiry_id": "ENQ-2025-001",
  "customer_id": "CUST-123",
  "project_type": "supply_and_install",
  "estimated_value": 50000,
  "urgency": "standard"
}
```

**Processing Steps:**
1. Validate webhook signature (HMAC-SHA256)
2. Extract payload data
3. Create preliminary schedule estimate (high-level timeline)
4. Check resource availability and capacity
5. Flag any immediate capacity constraints
6. Log enquiry in database
7. Return success response (200 OK)

**Processing Time:** < 5 seconds

**Emitted Events:** None (preliminary only)

**Error Handling:**
- **Invalid signature:** Return 401 Unauthorized
- **Invalid payload:** Return 400 Bad Request
- **Database error:** Return 500 Internal Server Error, retry later

---

### 2. `enquiry.approved`

**Trigger:** Enquiry approved and converted to quotation by ESP or MCP-SALES

**Payload:**
```json
{
  "enquiry_id": "ENQ-2025-001",
  "quotation_id": "QUO-2025-001",
  "customer_id": "CUST-123",
  "project_requirements": {
    "windows": 10,
    "doors": 2,
    "total_sqm": 50,
    "installation_required": true
  }
}
```

**Processing Steps:**
1. Validate webhook signature
2. Extract project requirements
3. **Generate detailed schedule:**
   - Calculate fabrication timeline (based on sqm, complexity)
   - Calculate installation timeline (if S&I)
   - Identify dependencies
   - Run preliminary conflict detection
4. Allocate tentative resources (not confirmed yet)
5. Calculate critical path
6. Save schedule to database
7. Emit `schedule.created` event
8. Return success response

**Processing Time:** < 30 seconds

**Emitted Events:** `schedule.created`

---

### 3. `order.created`

**Trigger:** New order created from approved quote (deposit paid, customer confirmed)

**Payload:**
```json
{
  "order_id": "ORD-2025-001",
  "quotation_id": "QUO-2025-001",
  "customer_id": "CUST-123",
  "order_type": "supply_and_install",
  "total_value": 50000,
  "deposit_paid": true,
  "customer_tier": "preferred"
}
```

**Processing Steps:**
1. Validate webhook signature
2. Extract order details
3. **Finalize schedule:**
   - Convert tentative schedule to confirmed
   - Allocate confirmed resources (personnel, equipment, materials)
   - Create schedule dependencies
   - Run full conflict detection
   - Optimize critical path
4. **Initialize Customer Guardian AI:**
   - Create 48-hour update cycle
   - Generate first customer update
   - Send initial welcome email
5. Publish `schedule.created` event to NEXUS
6. Notify operations team
7. Return success response

**Processing Time:** < 1 minute

**Emitted Events:** `schedule.created`, `customer.update_sent`

**Customer Guardian AI Activation:** Yes (48-hour cycle starts immediately)

---

### 4. `order.approved`

**Trigger:** Order approved for production by operations manager

**Payload:**
```json
{
  "order_id": "ORD-2025-001",
  "approved_by": "manager@sfg.com",
  "production_release_date": "2025-11-15"
}
```

**Processing Steps:**
1. Validate webhook signature
2. Mark schedule as "released to production"
3. Notify fabrication and installation teams (Slack, Teams, Email)
4. Start real-time progress monitoring
5. Emit `schedule.released` event
6. Update dashboard widgets
7. Return success response

**Processing Time:** < 10 seconds

**Emitted Events:** `schedule.released`

---

### 5. `order.updated`

**Trigger:** Order details changed (specifications, delivery date, customer request)

**Payload:**
```json
{
  "order_id": "ORD-2025-001",
  "changes": {
    "delivery_date": "2025-12-20",
    "specifications": {
      "windows": 12
    }
  }
}
```

**Processing Steps:**
1. Validate webhook signature
2. Identify impacted schedule items
3. **Recalculate schedules:**
   - Adjust fabrication timeline
   - Adjust installation timeline (if affected)
   - Re-run conflict detection
   - Re-optimize critical path
4. **Detect and resolve conflicts:**
   - Identify resource conflicts
   - Run AI conflict resolution
   - Apply schedule adjustments
5. Notify affected teams
6. Emit `schedule.updated` event
7. If conflicts unresolved, emit `conflict.detected` event
8. Return success response

**Processing Time:** < 30 seconds

**Emitted Events:** `schedule.updated`, `conflict.detected` (if applicable)

---

### 6. `payment.received`

**Trigger:** Payment milestone reached (deposit, progress payment, final payment)

**Payload:**
```json
{
  "order_id": "ORD-2025-001",
  "payment_type": "progress",
  "amount": 15000,
  "payment_date": "2025-11-20"
}
```

**Processing Steps:**
1. Validate webhook signature
2. Update project status in database
3. Check if customer tier should be upgraded (based on payment history)
4. If milestone payment, trigger milestone notification
5. Update Customer Guardian AI content (include payment acknowledgment in next update)
6. Return success response

**Processing Time:** < 5 seconds

**Emitted Events:** `milestone.completed` (if applicable)

---

### 7. `fabrication.started`

**Trigger:** Fabrication commenced by production team

**Payload:**
```json
{
  "order_id": "ORD-2025-001",
  "fabrication_task_id": "FAB-2025-001",
  "start_date": "2025-11-15",
  "assigned_team": "Team A"
}
```

**Processing Steps:**
1. Validate webhook signature
2. Mark fabrication task as "in progress"
3. Start real-time progress tracking (if IoT devices connected)
4. Update schedule status
5. Trigger Customer Guardian AI update (major milestone started)
6. Emit `milestone.started` event
7. Return success response

**Processing Time:** < 5 seconds

**Emitted Events:** `milestone.started`, `customer.update_sent`

---

### 8. `fabrication.completed`

**Trigger:** Fabrication finished and passed quality inspection

**Payload:**
```json
{
  "order_id": "ORD-2025-001",
  "fabrication_task_id": "FAB-2025-001",
  "completion_date": "2025-11-25",
  "quality_passed": true
}
```

**Processing Steps:**
1. Validate webhook signature
2. Mark fabrication task as "completed"
3. Trigger logistics planning (delivery scheduling)
4. Schedule quality inspection (if not done)
5. Update schedule status
6. Trigger Customer Guardian AI update (major milestone completed)
7. Emit `milestone.completed` event
8. Return success response

**Processing Time:** < 10 seconds

**Emitted Events:** `milestone.completed`, `customer.update_sent`

---

### 9. `installation.scheduled`

**Trigger:** Installation date confirmed with customer

**Payload:**
```json
{
  "order_id": "ORD-2025-001",
  "installation_task_id": "INS-2025-001",
  "scheduled_date": "2025-12-01",
  "customer_confirmed": true
}
```

**Processing Steps:**
1. Validate webhook signature
2. Finalize installation resources (installers, equipment, vehicles)
3. Notify installation team (Slack, Teams, Email)
4. Send installation confirmation email to customer
5. Update schedule status
6. Emit `installation.confirmed` event
7. Return success response

**Processing Time:** < 10 seconds

**Emitted Events:** `installation.confirmed`, `customer.update_sent`

---

### 10. `installation.completed`

**Trigger:** Installation finished and customer signed off

**Payload:**
```json
{
  "order_id": "ORD-2025-001",
  "installation_task_id": "INS-2025-001",
  "completion_date": "2025-12-05",
  "customer_signed_off": true
}
```

**Processing Steps:**
1. Validate webhook signature
2. Mark installation task as "completed"
3. Update project status to "completed"
4. Trigger final handover process
5. Schedule warranty registration
6. Send project completion email to customer
7. Stop Customer Guardian AI cycle (project complete)
8. Emit `project.completed` event
9. Return success response

**Processing Time:** < 10 seconds

**Emitted Events:** `project.completed`, `customer.update_sent`

---

### 11. `nexus.task.assigned`

**Trigger:** NEXUS orchestrator assigned a task to SFG-SYNC

**Payload:**
```json
{
  "task_id": "TASK-2025-001",
  "task_type": "create_schedule|update_schedule|resolve_conflict|optimize_resource",
  "params": {
    "order_id": "ORD-2025-001",
    ...additional params
  }
}
```

**Processing Steps:**
1. Validate webhook signature
2. Route to appropriate handler based on `task_type`
3. Execute task logic
4. Return task results in response body
5. Emit `task.completed` event
6. Return success response

**Processing Time:** < 1 minute

**Emitted Events:** `task.completed`

---

## Outgoing Webhook Emissions

All outgoing webhooks are sent to **NEXUS** and relevant downstream apps (MCP-OPERATIONS, Communications-Hub, etc.). Each webhook includes:

- **Event name** (e.g., `schedule.created`)
- **Payload** (event-specific data)
- **Timestamp** (ISO 8601 format)
- **Signature** (HMAC-SHA256 for verification)

### Retry Logic

- **Max retries:** 3 attempts
- **Backoff strategy:** Exponential (1s, 2s, 4s)
- **Timeout:** 30 seconds per attempt
- **Dead letter queue:** Failed webhooks after 3 retries are logged for manual review

---

### 1. `schedule.created`

**When:** New schedule is created for an order

**Recipients:** NEXUS, MCP-OPERATIONS, Communications-Hub

**Payload:**
```json
{
  "event": "schedule.created",
  "schedule_id": "SCH-2025-001",
  "order_id": "ORD-2025-001",
  "fabrication_start": "2025-11-15",
  "fabrication_end": "2025-11-25",
  "installation_start": "2025-12-01",
  "installation_end": "2025-12-05",
  "total_duration_days": 20,
  "critical_path": [...],
  "timestamp": "2025-11-10T10:00:00Z"
}
```

---

### 2. `schedule.updated`

**When:** Schedule is modified (due to changes, conflicts, optimization)

**Recipients:** NEXUS, MCP-OPERATIONS, Communications-Hub

**Payload:**
```json
{
  "event": "schedule.updated",
  "schedule_id": "SCH-2025-001",
  "order_id": "ORD-2025-001",
  "changes": {
    "fabrication_end": "2025-11-27",
    "reason": "Material delay"
  },
  "timestamp": "2025-11-15T14:30:00Z"
}
```

---

### 3. `conflict.detected`

**When:** Scheduling conflict identified (resource, deadline, dependency)

**Recipients:** NEXUS, MCP-OPERATIONS, Alert-System

**Payload:**
```json
{
  "event": "conflict.detected",
  "conflict_id": "CONF-2025-001",
  "conflict_type": "resource_double_booking",
  "affected_orders": ["ORD-2025-001", "ORD-2025-002"],
  "severity": "high",
  "detected_at": "2025-11-10T14:30:00Z"
}
```

---

### 4. `conflict.resolved`

**When:** Conflict is resolved (automated or manual)

**Recipients:** NEXUS, MCP-OPERATIONS

**Payload:**
```json
{
  "event": "conflict.resolved",
  "conflict_id": "CONF-2025-001",
  "resolution_type": "automatic_reschedule",
  "resolution_time_minutes": 45,
  "affected_orders_updated": ["ORD-2025-001", "ORD-2025-002"],
  "timestamp": "2025-11-10T15:15:00Z"
}
```

---

### 5. `milestone.completed`

**When:** Project milestone is reached (fabrication, delivery, installation)

**Recipients:** NEXUS, Communications-Hub, Customer-Portal

**Payload:**
```json
{
  "event": "milestone.completed",
  "order_id": "ORD-2025-001",
  "milestone_type": "fabrication_completed",
  "completion_date": "2025-11-25",
  "on_time": true,
  "timestamp": "2025-11-25T16:00:00Z"
}
```

---

### 6. `delay.detected`

**When:** Project delay is identified (exceeding tolerance threshold)

**Recipients:** NEXUS, MCP-OPERATIONS, Communications-Hub, Alert-System

**Payload:**
```json
{
  "event": "delay.detected",
  "order_id": "ORD-2025-001",
  "delay_type": "fabrication_delay",
  "delay_days": 3,
  "reason": "Material shortage",
  "impact": "Delivery date pushed to 2025-12-08",
  "timestamp": "2025-11-20T09:00:00Z"
}
```

---

### 7. `customer.update_sent`

**When:** 48-hour Customer Guardian AI update is sent to customer

**Recipients:** NEXUS, Communications-Hub, Analytics

**Payload:**
```json
{
  "event": "customer.update_sent",
  "order_id": "ORD-2025-001",
  "customer_id": "CUST-123",
  "update_type": "progress_report",
  "channel": "email",
  "sent_at": "2025-11-10T09:00:00Z",
  "next_update_at": "2025-11-12T09:00:00Z"
}
```

---

### 8. `resource.allocated`

**When:** Resources are allocated to a project

**Recipients:** NEXUS, MCP-OPERATIONS, Resource-Management

**Payload:**
```json
{
  "event": "resource.allocated",
  "order_id": "ORD-2025-001",
  "resource_type": "personnel",
  "resource_id": "EMP-456",
  "allocation_start": "2025-11-15",
  "allocation_end": "2025-11-25",
  "timestamp": "2025-11-10T10:00:00Z"
}
```

---

### 9. `performance.metrics_updated`

**When:** KPIs and performance metrics are updated

**Recipients:** NEXUS, Performance-Dashboard, Analytics

**Payload:**
```json
{
  "event": "performance.metrics_updated",
  "metric_type": "on_time_delivery_rate",
  "current_value": "93.5%",
  "previous_value": "92.8%",
  "trend": "improving",
  "updated_at": "2025-11-10T16:00:00Z"
}
```

---

## Synchronous Message Queries

SFG-SYNC exposes a **message handler endpoint** (`/api/messages/handle`) that responds to synchronous queries from NEXUS or other apps. These are **request-response** interactions (not webhook-based).

**Endpoint:** `POST /api/messages/handle`

**Authentication:** HMAC-SHA256 signature verification

**Request Format:**
```json
{
  "messageType": "query",
  "queryType": "get_schedule_status",
  "params": {
    "order_id": "ORD-2025-001"
  }
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    ...query results
  }
}
```

---

### Supported Queries

#### 1. `get_customer_data`

**Description:** Retrieve customer information for a given customer ID

**Params:**
```json
{
  "customer_id": "CUST-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customer_id": "CUST-123",
    "name": "Acme Corp",
    "tier": "preferred",
    "active_projects": 3,
    "total_lifetime_value": 150000
  }
}
```

---

#### 2. `get_quote_status`

**Description:** Retrieve quotation status and details

**Params:**
```json
{
  "quotation_id": "QUO-2025-001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quotation_id": "QUO-2025-001",
    "status": "approved",
    "total_value": 50000,
    "estimated_timeline": "20-35 days"
  }
}
```

---

#### 3. `get_order_status`

**Description:** Retrieve order status and progress

**Params:**
```json
{
  "order_id": "ORD-2025-001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "ORD-2025-001",
    "status": "in_progress",
    "progress_percentage": 65,
    "fabrication_status": "completed",
    "installation_status": "scheduled",
    "estimated_completion": "2025-12-05"
  }
}
```

---

#### 4. `get_schedule_status`

**Description:** Retrieve detailed schedule information for an order

**Params:**
```json
{
  "order_id": "ORD-2025-001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "schedule_id": "SCH-2025-001",
    "order_id": "ORD-2025-001",
    "status": "active",
    "fabrication_start": "2025-11-15",
    "fabrication_end": "2025-11-25",
    "installation_start": "2025-12-01",
    "installation_end": "2025-12-05",
    "critical_path": [...],
    "conflicts": []
  }
}
```

---

#### 5. `get_fabrication_status`

**Description:** Retrieve fabrication task status and progress

**Params:**
```json
{
  "order_id": "ORD-2025-001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "ORD-2025-001",
    "fabrication_task_id": "FAB-2025-001",
    "status": "in_progress",
    "progress_percentage": 75,
    "start_date": "2025-11-15",
    "estimated_completion": "2025-11-25"
  }
}
```

---

#### 6. `get_installation_status`

**Description:** Retrieve installation task status and progress

**Params:**
```json
{
  "order_id": "ORD-2025-001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "ORD-2025-001",
    "installation_task_id": "INS-2025-001",
    "status": "scheduled",
    "scheduled_date": "2025-12-01",
    "estimated_duration_days": 4
  }
}
```

---

#### 7. `get_capacity`

**Description:** Retrieve current resource capacity and availability

**Params:**
```json
{
  "date_range": {
    "start": "2025-11-15",
    "end": "2025-11-30"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "personnel_available": 15,
    "personnel_utilized": 12,
    "equipment_available": 8,
    "equipment_utilized": 6,
    "capacity_percentage": 75
  }
}
```

---

#### 8. `check_conflicts`

**Description:** Check for scheduling conflicts for a given date range or project

**Params:**
```json
{
  "order_id": "ORD-2025-001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conflicts": [
      {
        "conflict_id": "CONF-2025-001",
        "conflict_type": "resource_double_booking",
        "severity": "high",
        "affected_orders": ["ORD-2025-001", "ORD-2025-002"]
      }
    ],
    "total_conflicts": 1
  }
}
```

---

## Synchronous Message Actions

In addition to queries, SFG-SYNC can execute **actions** via the message handler endpoint. These are synchronous operations that modify data or trigger workflows.

---

### Supported Actions

#### 1. `create_schedule`

**Description:** Create a new schedule for an order

**Params:**
```json
{
  "order_id": "ORD-2025-001",
  "project_requirements": {...}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "schedule_id": "SCH-2025-001",
    "status": "created"
  }
}
```

---

#### 2. `update_schedule`

**Description:** Update an existing schedule

**Params:**
```json
{
  "schedule_id": "SCH-2025-001",
  "changes": {
    "fabrication_end": "2025-11-27"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "schedule_id": "SCH-2025-001",
    "status": "updated"
  }
}
```

---

#### 3. `reschedule_project`

**Description:** Completely reschedule a project (major changes)

**Params:**
```json
{
  "order_id": "ORD-2025-001",
  "new_delivery_date": "2025-12-20"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "schedule_id": "SCH-2025-001",
    "status": "rescheduled",
    "conflicts_detected": 0
  }
}
```

---

## Security & Authentication

### Webhook Security (HMAC-SHA256)

All incoming webhooks must include a **signature** in the `X-Nexus-Signature-256` header:

```
X-Nexus-Signature-256: sha256=<hmac_signature>
```

**Signature Generation:**
```typescript
const signature = crypto
  .createHmac('sha256', process.env.NEXUS_WEBHOOK_SECRET!)
  .update(JSON.stringify(payload))
  .digest('hex');
```

**Verification:**
```typescript
const expectedSignature = `sha256=${signature}`;
if (receivedSignature !== expectedSignature) {
  return new Response('Unauthorized', { status: 401 });
}
```

### Message Handler Security

The `/api/messages/handle` endpoint uses the same HMAC-SHA256 signature verification.

---

## Error Handling & Retry Logic

### Error Responses

| Status Code | Description | Action |
|-------------|-------------|--------|
| 200 OK | Success | None |
| 400 Bad Request | Invalid payload | Fix payload and retry |
| 401 Unauthorized | Invalid signature | Check secret and retry |
| 500 Internal Server Error | Processing error | Retry with exponential backoff |
| 503 Service Unavailable | System overload | Retry after delay |

### Retry Policy (Outgoing Webhooks)

- **Max retries:** 3 attempts
- **Backoff:** Exponential (1s, 2s, 4s)
- **Timeout:** 30 seconds per attempt
- **Dead letter queue:** Failed webhooks logged for manual review

---

## Monitoring & Observability

### Key Metrics

- **Webhook success/failure rate** (target: 99%+)
- **Average response time** (target: <500ms)
- **Event processing time** (target: <30s)
- **Queue depth** (target: <100 pending events)
- **Retry attempts** (target: <5% requiring retry)

### Alerts

- **Error rate > 5%:** Page on-call engineer
- **Response time > 1s:** Investigate performance
- **Queue depth > 500:** Scale up processing capacity
- **Critical conflict unresolved > 2h:** Escalate to operations manager

### Dashboard Widgets

- Webhook success/failure rate (gauge)
- Event processing time (line chart)
- Active conflicts (alert widget)
- Customer updates sent today (metric)
- Schedule optimizations (metric)

---

## Workflow Diagrams

### Main Webhook Processing Flow

```
Incoming Webhook → Signature Validation → Payload Parsing → Route to Handler
    ↓                      ↓                   ↓                  ↓
    OK               Valid/Invalid         Success/Fail      Process Business Logic
    ↓                      ↓                   ↓                  ↓
Return 200           Return 401          Return 400/500   Emit Outgoing Webhooks
                                                                ↓
                                                          Update Database
                                                                ↓
                                                          Update Dashboard
```

### Conflict Resolution Workflow

```
Detect Conflict → Classify Severity → Run AI Resolution → Generate Options
    ↓                    ↓                    ↓                   ↓
 Log Conflict        High/Med/Low       Find Solutions      Select Best Option
    ↓                    ↓                    ↓                   ↓
Emit Alert         Determine Route     Apply Changes      Notify Stakeholders
    ↓                    ↓                    ↓                   ↓
Monitor          Auto/Manual       Update Schedules     Emit conflict.resolved
```

### Customer Guardian AI Workflow

```
48-Hour Timer Expires → Gather Project Data → Calculate Progress → Identify Milestones
    ↓                           ↓                      ↓                   ↓
Active Projects            Status, Tasks         % Complete          Completed/Pending
    ↓                           ↓                      ↓                   ↓
Detect Delays/Issues → Generate AI Content → Personalize → Send via Channel
    ↓                           ↓                      ↓                   ↓
Flag Issues            Abacus.AI NLP         Tier-based       Email/SMS/WhatsApp
    ↓                           ↓                      ↓                   ↓
Include in Update      Professional Tone    Customer Name   Schedule Next Update (48h)
```

---

## Conclusion

SFG-SYNC's **event-driven architecture** enables real-time, orchestrated workflows across the SFG COMET ecosystem. By handling incoming webhooks, emitting outgoing events, and responding to synchronous queries, SFG-SYNC serves as a **critical scheduling intelligence layer** that powers:

- **Customer Guardian AI** (48-hour progress updates)
- **AI-powered schedule optimization**
- **Real-time conflict detection and resolution**
- **Performance analytics and KPIs**

All interactions are **secured, monitored, and optimized** for reliability and performance.

---

**Document Version:** 2.0.0  
**Last Updated:** November 10, 2025  
**Maintained By:** SFG Digital Transformation Team  
**Contact:** warren@sfg-innovations.com
