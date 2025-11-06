# SFG-Mail-Matrix Message Handlers

## Incoming Message Handlers

### From NEXUS to SFG-Mail-Matrix


#### `nexus.task.assigned`

**Description:** Receive task assignments from NEXUS orchestration

**Payload:**
```json
{
  "task_id": "task_12345",
  "email_id": "email_67890",
  "assigned_to": "warren@sfg-aluminium.co.uk",
  "priority": "high",
  "due_date": "2025-11-10"
}
```

**Handler:** `handle_nexus_task_assigned()`

---

#### `mcp.sales.quote_requested`

**Description:** Receive quote request notification from MCP-SALES

**Payload:**
```json
{
  "quote_id": "Q2025-001",
  "customer_email": "customer@example.com",
  "specifications": {
    "material": "6063-T6",
    "quantity": 1000
  },
  "requested_by": "sales_team"
}
```

**Handler:** `handle_mcp_sales_quote_requested()`

---

#### `mcp.operations.order_confirmed`

**Description:** Receive order confirmation from MCP-OPERATIONS

**Payload:**
```json
{
  "order_id": "ORD-2025-123",
  "customer_email": "customer@example.com",
  "confirmation_required": true
}
```

**Handler:** `handle_mcp_operations_order_confirmed()`

---

## Outgoing Message Handlers

### From SFG-Mail-Matrix to NEXUS


#### `email.classified`

**Description:** Send classified email data to NEXUS for orchestration

**Payload:**
```json
{
  "email_id": "email_67890",
  "classification": "quote_request",
  "priority": "high",
  "customer_email": "customer@example.com",
  "extracted_data": {
    "product": "aluminum_profile",
    "quantity": 1000
  },
  "suggested_assignee": "sales_team"
}
```

**Trigger:** Send classified email data to NEXUS for orchestration

---

#### `quote.generated`

**Description:** Notify NEXUS when quote is generated and ready

**Payload:**
```json
{
  "quote_id": "Q2025-001",
  "email_id": "email_67890",
  "customer_email": "customer@example.com",
  "total_amount": 50000.0,
  "status": "pending_approval"
}
```

**Trigger:** Notify NEXUS when quote is generated and ready

---

#### `compliance.alert`

**Description:** Send compliance alerts to NEXUS for action

**Payload:**
```json
{
  "alert_id": "alert_12345",
  "type": "gdpr_violation",
  "severity": "high",
  "description": "Unauthorized email access detected",
  "affected_emails": [
    "email_111",
    "email_222"
  ]
}
```

**Trigger:** Send compliance alerts to NEXUS for action

---

#### `analytics.report_ready`

**Description:** Notify NEXUS when analytics report is generated

**Payload:**
```json
{
  "report_id": "RPT-2025-11",
  "report_type": "monthly_email_analytics",
  "period": "2025-11",
  "insights_count": 15,
  "download_url": "https://sfg-mail-matrix.abacusai.app/reports/RPT-2025-11"
}
```

**Trigger:** Notify NEXUS when analytics report is generated

---
