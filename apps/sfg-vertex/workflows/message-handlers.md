# SFG Vertex Message Handlers

## Incoming Message Handlers

### From NEXUS to SFG Vertex


#### `enquiry.received`

**Description:** New customer enquiry received from external sources (email, web form, partner systems)

**Payload:**
```json
{
  "enquiry_id": "ENQ-2025-001",
  "source": "email",
  "customer_name": "ABC Construction",
  "contact_email": "contact@abcconstruction.com",
  "project_description": "Curtain wall for office building",
  "urgency": "high",
  "attachments": [
    "specification.pdf",
    "sketch.jpg"
  ],
  "timestamp": "2025-11-05T10:30:00Z"
}
```

**Handler:** `handle_enquiry_received()`

---

#### `quotation.approval_requested`

**Description:** Quotation requires approval from management before sending to customer

**Payload:**
```json
{
  "quotation_id": "QUOT-2025-045",
  "enquiry_id": "ENQ-2025-001",
  "total_amount": 150000.0,
  "approver": "warren@sfgaluminium.com",
  "submitted_by": "sales@sfgaluminium.com",
  "deadline": "2025-11-07T17:00:00Z"
}
```

**Handler:** `handle_quotation_approval_requested()`

---

#### `project.milestone_update`

**Description:** Project milestone status update from external systems (ERP, manufacturing)

**Payload:**
```json
{
  "project_id": "PROJ-2025-023",
  "milestone": "Fabrication Complete",
  "status": "completed",
  "completion_date": "2025-11-05T14:30:00Z",
  "next_milestone": "Installation"
}
```

**Handler:** `handle_project_milestone_update()`

---

#### `document.uploaded`

**Description:** New document uploaded for processing (specifications, drawings, certifications)

**Payload:**
```json
{
  "document_id": "DOC-2025-178",
  "type": "specification",
  "filename": "curtain_wall_spec_v2.pdf",
  "uploaded_by": "engineering@sfgaluminium.com",
  "project_id": "PROJ-2025-023",
  "requires_ocr": true
}
```

**Handler:** `handle_document_uploaded()`

---

#### `logikal.calculation_complete`

**Description:** Logikal curtain wall calculation results available for import

**Payload:**
```json
{
  "calculation_id": "LOG-2025-089",
  "project_id": "PROJ-2025-023",
  "results_file": "logikal_export.xml",
  "total_area": 450.5,
  "total_cost": 125000.0,
  "material_list": "attached"
}
```

**Handler:** `handle_logikal_calculation_complete()`

---

## Outgoing Message Handlers

### From SFG Vertex to NEXUS


#### `enquiry.created`

**Description:** New enquiry has been created and logged in the system

**Payload:**
```json
{
  "enquiry_id": "ENQ-2025-001",
  "customer_name": "ABC Construction",
  "status": "new",
  "assigned_to": "sales@sfgaluminium.com",
  "priority": "high",
  "created_at": "2025-11-05T10:30:00Z"
}
```

**Trigger:** New enquiry has been created and logged in the system

---

#### `quotation.generated`

**Description:** Quotation has been generated and is ready for internal review

**Payload:**
```json
{
  "quotation_id": "QUOT-2025-045",
  "enquiry_id": "ENQ-2025-001",
  "total_amount": 150000.0,
  "status": "pending_approval",
  "generated_at": "2025-11-05T11:15:00Z"
}
```

**Trigger:** Quotation has been generated and is ready for internal review

---

#### `quotation.approved`

**Description:** Quotation has been approved and sent to customer

**Payload:**
```json
{
  "quotation_id": "QUOT-2025-045",
  "approved_by": "warren@sfgaluminium.com",
  "sent_to": "contact@abcconstruction.com",
  "valid_until": "2025-12-05",
  "approved_at": "2025-11-05T15:30:00Z"
}
```

**Trigger:** Quotation has been approved and sent to customer

---

#### `project.created`

**Description:** New project has been created from approved quotation

**Payload:**
```json
{
  "project_id": "PROJ-2025-023",
  "quotation_id": "QUOT-2025-045",
  "customer_name": "ABC Construction",
  "start_date": "2025-11-10",
  "expected_completion": "2025-12-20",
  "created_at": "2025-11-05T16:00:00Z"
}
```

**Trigger:** New project has been created from approved quotation

---

#### `drawing.generated`

**Description:** Technical drawing has been generated and is ready for review

**Payload:**
```json
{
  "drawing_id": "DWG-2025-156",
  "project_id": "PROJ-2025-023",
  "drawing_type": "fabrication",
  "format": "dwg",
  "file_url": "https://sfg-vertex.abacusai.app/drawings/DWG-2025-156.dwg",
  "generated_at": "2025-11-05T17:30:00Z"
}
```

**Trigger:** Technical drawing has been generated and is ready for review

---

#### `workflow.automation_complete`

**Description:** Autonomous workflow has completed processing

**Payload:**
```json
{
  "workflow_id": "WF-2025-234",
  "workflow_type": "document_processing",
  "status": "completed",
  "records_created": 5,
  "notifications_sent": 3,
  "completed_at": "2025-11-05T18:00:00Z"
}
```

**Trigger:** Autonomous workflow has completed processing

---

#### `alert.critical`

**Description:** Critical system alert requiring immediate attention

**Payload:**
```json
{
  "alert_id": "ALERT-2025-012",
  "severity": "critical",
  "message": "Quotation deadline approaching with no response",
  "quotation_id": "QUOT-2025-042",
  "action_required": "Follow up with customer",
  "created_at": "2025-11-05T19:00:00Z"
}
```

**Trigger:** Critical system alert requiring immediate attention

---
