# SFG Vertex Message Handlers

## Incoming Message Handlers

### From NEXUS to SFG Vertex


#### `enquiry.received`

**Description:** New customer enquiry received from email or web form

**Payload:**
```json
{
  "enquiry_id": "ENQ-2025-001",
  "customer_name": "ABC Construction Ltd",
  "customer_email": "contact@abcconstruction.com",
  "project_name": "High-rise Curtain Wall Project",
  "requirements": "200 sqm curtain wall system with thermal break",
  "deadline": "2025-12-31",
  "source": "email",
  "timestamp": "2025-11-05T10:30:00Z"
}
```

**Handler:** `handle_enquiry_received()`

---

#### `quotation.approval_requested`

**Description:** Request for quotation approval from management

**Payload:**
```json
{
  "quotation_id": "QUO-2025-045",
  "enquiry_id": "ENQ-2025-001",
  "amount": 150000.0,
  "currency": "GBP",
  "prepared_by": "sales@sfgaluminium.com",
  "approval_level": "manager",
  "timestamp": "2025-11-05T14:00:00Z"
}
```

**Handler:** `handle_quotation_approval_requested()`

---

#### `project.milestone_update`

**Description:** Update project milestone status from external systems

**Payload:**
```json
{
  "project_id": "PRJ-2025-012",
  "milestone": "fabrication_complete",
  "status": "completed",
  "completion_date": "2025-11-05",
  "notes": "All panels fabricated and QC passed",
  "timestamp": "2025-11-05T16:00:00Z"
}
```

**Handler:** `handle_project_milestone_update()`

---

#### `document.uploaded`

**Description:** New document uploaded for processing

**Payload:**
```json
{
  "document_id": "DOC-2025-234",
  "document_type": "specification",
  "file_url": "https://storage.sfg.com/specs/spec-001.pdf",
  "uploaded_by": "user@sfgaluminium.com",
  "project_id": "PRJ-2025-012",
  "timestamp": "2025-11-05T11:00:00Z"
}
```

**Handler:** `handle_document_uploaded()`

---

#### `logikal.calculation_complete`

**Description:** Logikal calculation results ready for import

**Payload:**
```json
{
  "calculation_id": "CALC-2025-089",
  "project_id": "PRJ-2025-012",
  "results_url": "https://logikal.sfg.com/results/calc-089.json",
  "bill_of_materials": [],
  "timestamp": "2025-11-05T13:30:00Z"
}
```

**Handler:** `handle_logikal_calculation_complete()`

---

## Outgoing Message Handlers

### From SFG Vertex to NEXUS


#### `enquiry.created`

**Description:** New enquiry created in SFG Vertex system

**Payload:**
```json
{
  "enquiry_id": "ENQ-2025-001",
  "customer_name": "ABC Construction Ltd",
  "project_name": "High-rise Curtain Wall Project",
  "estimated_value": 150000.0,
  "priority": "high",
  "created_at": "2025-11-05T10:30:00Z"
}
```

**Trigger:** New enquiry created in SFG Vertex system

---

#### `quotation.generated`

**Description:** New quotation generated and ready for review

**Payload:**
```json
{
  "quotation_id": "QUO-2025-045",
  "enquiry_id": "ENQ-2025-001",
  "total_amount": 150000.0,
  "line_items": [],
  "pdf_url": "https://vertex.sfg.com/quotations/QUO-2025-045.pdf",
  "created_at": "2025-11-05T12:00:00Z"
}
```

**Trigger:** New quotation generated and ready for review

---

#### `quotation.approved`

**Description:** Quotation approved by management and sent to customer

**Payload:**
```json
{
  "quotation_id": "QUO-2025-045",
  "approved_by": "manager@sfgaluminium.com",
  "approved_at": "2025-11-05T14:30:00Z",
  "sent_to_customer": true
}
```

**Trigger:** Quotation approved by management and sent to customer

---

#### `project.created`

**Description:** New project created from approved quotation

**Payload:**
```json
{
  "project_id": "PRJ-2025-012",
  "quotation_id": "QUO-2025-045",
  "project_name": "High-rise Curtain Wall Project",
  "start_date": "2025-11-10",
  "estimated_completion": "2025-12-31",
  "project_manager": "pm@sfgaluminium.com"
}
```

**Trigger:** New project created from approved quotation

---

#### `drawing.generated`

**Description:** CAD drawing generated and ready for review

**Payload:**
```json
{
  "drawing_id": "DRW-2025-156",
  "project_id": "PRJ-2025-012",
  "drawing_type": "fabrication",
  "format": "DWG",
  "file_url": "https://vertex.sfg.com/drawings/DRW-2025-156.dwg",
  "created_at": "2025-11-05T15:00:00Z"
}
```

**Trigger:** CAD drawing generated and ready for review

---

#### `workflow.automation_complete`

**Description:** Automated workflow completed successfully

**Payload:**
```json
{
  "workflow_id": "WF-2025-789",
  "workflow_type": "document_processing",
  "status": "completed",
  "processed_items": 12,
  "completion_time": "2025-11-05T16:45:00Z"
}
```

**Trigger:** Automated workflow completed successfully

---

#### `alert.critical`

**Description:** Critical alert requiring immediate attention

**Payload:**
```json
{
  "alert_type": "project_delay",
  "project_id": "PRJ-2025-012",
  "severity": "critical",
  "message": "Project milestone delayed by 5 days",
  "timestamp": "2025-11-05T17:00:00Z"
}
```

**Trigger:** Critical alert requiring immediate attention

---
