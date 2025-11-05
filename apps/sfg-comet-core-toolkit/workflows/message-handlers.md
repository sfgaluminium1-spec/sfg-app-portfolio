# SFG COMET CORE Toolkit Message Handlers

## Incoming Message Handlers

### From NEXUS to SFG COMET CORE Toolkit


#### `enquiry.created`

**Description:** New customer enquiry received - creates project folder, assigns estimator, sends notifications

**Payload:**
```json
{
  "enquiry_id": "ENQ-2025-0001",
  "customer": {
    "id": "CUST001",
    "name": "ABC Building Pty Ltd",
    "tier": "Sapphire"
  },
  "estimated_value": 15750,
  "priority": "normal"
}
```

**Handler:** `handle_enquiry_created()`

---

#### `quote.requested`

**Description:** Quote generation requested - calculates pricing with SFG margins, checks approval requirements

**Payload:**
```json
{
  "enquiry_id": "ENQ-2025-0001",
  "items": [
    {
      "description": "Shopfront",
      "quantity": 1
    }
  ],
  "customer_tier": "Sapphire"
}
```

**Handler:** `handle_quote_requested()`

---

#### `order.approved`

**Description:** Order has been approved - schedules production, creates invoice in Xero, updates folder status

**Payload:**
```json
{
  "order_id": "ORD-2025-0001",
  "approved_by": "Warren Heathcote",
  "approval_amount": 25000
}
```

**Handler:** `handle_order_approved()`

---

#### `customer.registered`

**Description:** New customer registered - creates customer folder, sets up tier permissions

**Payload:**
```json
{
  "customer_id": "CUST001",
  "name": "ABC Building",
  "tier": "Sapphire",
  "credit_limit": 50000
}
```

**Handler:** `handle_customer_registered()`

---

#### `folder.create_required`

**Description:** SharePoint folder creation needed - creates project folder structure with tier-based permissions

**Payload:**
```json
{
  "project_id": "PRJ-2025-0001",
  "customer_name": "ABC Building",
  "tier": "Sapphire",
  "folder_type": "project"
}
```

**Handler:** `handle_folder_create_required()`

---

#### `document.move_required`

**Description:** Document needs to be moved in SharePoint - moves document and updates audit trail

**Payload:**
```json
{
  "document_id": "DOC123",
  "source_path": "/temp/file.pdf",
  "destination_path": "/projects/PRJ-2025-0001/01-Quotes/file.pdf"
}
```

**Handler:** `handle_document_move_required()`

---

## Outgoing Message Handlers

### From SFG COMET CORE Toolkit to NEXUS


#### `project.created`

**Description:** New project has been created with auto-assigned number

**Payload:**
```json
{
  "project_id": "PRJ-2025-0001",
  "project_number": "00123-ENQ-WH",
  "customer_name": "ABC Building",
  "created_at": "2025-11-05T05:30:00Z"
}
```

**Trigger:** New project has been created with auto-assigned number

---

#### `folder.created`

**Description:** SharePoint folder structure has been created

**Payload:**
```json
{
  "project_id": "PRJ-2025-0001",
  "folder_path": "/sites/sfg-projects/PRJ-2025-0001",
  "folders_created": 17
}
```

**Trigger:** SharePoint folder structure has been created

---

#### `document.classified`

**Description:** Document has been classified and archived

**Payload:**
```json
{
  "document_id": "DOC123",
  "file_type": "INVOICE",
  "retention_years": 7,
  "is_immutable": true
}
```

**Trigger:** Document has been classified and archived

---

#### `decision.recorded`

**Description:** Knowledge Smelter decision has been recorded

**Payload:**
```json
{
  "decision_id": "DEC123",
  "project_id": "PRJ-2025-0001",
  "category": "Technical",
  "decision": "Use aluminum grade 6063 for this project"
}
```

**Trigger:** Knowledge Smelter decision has been recorded

---
