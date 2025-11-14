
# SPW600e Door System Message Handlers

## Incoming Message Handlers

### From NEXUS to SPW600e Door System

#### `quote.requested`

**Description:** Triggered when a customer or sales team requests a quote for SPW600e door system. Generates technical drawings and specifications for the quote package.

**Payload:**
```json
{
  "quote_id": "Q-2025-001",
  "customer_name": "ABC Construction Ltd",
  "project_name": "Riverside Office Development",
  "door_configuration": "double",
  "opening_direction": "outward",
  "frame_width": 1870,
  "frame_height": 2235,
  "glazing_type": "triple",
  "finish": "powder_coating",
  "color": "RAL 7016",
  "quantity": 5,
  "requested_by": "sales@sfgaluminium.com",
  "timestamp": "2025-11-07T10:30:00Z"
}
```

**Handler Logic:**
1. Validate door specifications against system constraints
2. Calculate thermal performance based on glazing type
3. Generate technical drawings (elevation, plan, section)
4. Compile material specifications and bill of materials
5. Calculate estimated weight and material requirements
6. Package all technical data for quote preparation
7. Send `quote.technical_data_ready` event to NEXUS
8. Notify sales team via Slack and email

**Error Handling:**
- If specifications exceed system limits, send `validation.failed` event
- If drawing generation fails, retry up to 3 times before alerting technical team
- Log all errors to monitoring system

---

#### `drawing.requested`

**Description:** Triggered when technical drawings are requested for a specific door configuration. Generates CAD drawings at specified scales.

**Payload:**
```json
{
  "request_id": "DR-2025-045",
  "door_type": "single",
  "opening_direction": "inward",
  "leaf_width": 860,
  "leaf_height": 2100,
  "glazing_thickness": 28,
  "drawing_types": ["elevation", "plan", "section"],
  "scale": "1:10",
  "format": "pdf",
  "requested_by": "design@sfgaluminium.com",
  "timestamp": "2025-11-07T14:15:00Z"
}
```

**Handler Logic:**
1. Validate drawing request parameters
2. Initialize TechnicalDrawing class with specified scale
3. Generate requested drawing types:
   - Elevation: Front view with frame and leaf details
   - Plan: Top view showing rebated meeting stile configuration
   - Section: Detailed profile sections at 1:5 scale
4. Add dimensions, annotations, and title blocks
5. Export drawings in requested format (SVG, PDF)
6. Upload to secure storage with 30-day expiry
7. Send `drawings.generated` event to NEXUS
8. Notify requester via email with download links

**Error Handling:**
- Validate dimensions against max/min constraints
- Check glazing thickness compatibility (28-56mm range)
- Handle export format errors gracefully
- Provide fallback to SVG if PDF generation fails

---

#### `specification.requested`

**Description:** Triggered when a technical specification document is requested for a door system configuration.

**Payload:**
```json
{
  "spec_id": "SPEC-2025-089",
  "project_reference": "PRJ-2025-034",
  "door_configuration": "double_rebated",
  "thermal_requirement": "0.95",
  "security_requirement": "PAS24",
  "finish_requirement": "anodised_satin",
  "requested_by": "technical@sfgaluminium.com",
  "timestamp": "2025-11-07T09:00:00Z"
}
```

**Handler Logic:**
1. Retrieve door configuration details
2. Calculate thermal performance for specified glazing
3. Compile material specifications:
   - Aluminium alloy grades (6060.T6/T66, 6063.T6/T66, 6082.T6)
   - Gasketry specifications (BS ISO 3302-1)
   - Fixings (A2 Stainless Steel)
4. Include finish specifications and coating requirements
5. Add testing and compliance documentation (PAS24, SBD, BS6375-1)
6. Generate formatted specification document
7. Upload to secure storage
8. Send `specification.generated` event to NEXUS
9. Notify requester via email

**Error Handling:**
- Validate thermal requirements are achievable with available glazing options
- Check security requirements against tested configurations
- Provide alternative specifications if exact requirements cannot be met

---

#### `manufacturing.order_created`

**Description:** Triggered when a manufacturing order is created. Generates production drawings and material specifications.

**Payload:**
```json
{
  "order_id": "MO-2025-156",
  "quote_reference": "Q-2025-001",
  "door_specifications": {
    "configuration": "double",
    "frame_width": 1870,
    "frame_height": 2235,
    "glazing_thickness": 44,
    "finish": "powder_coating",
    "color": "RAL 7016"
  },
  "quantity": 5,
  "delivery_date": "2025-12-15",
  "timestamp": "2025-11-07T11:45:00Z"
}
```

**Handler Logic:**
1. Retrieve confirmed door specifications from quote
2. Generate production-ready technical drawings with manufacturing notes
3. Calculate exact material requirements for quantity ordered
4. Generate cutting lists for frame and leaf profiles
5. Specify hardware requirements (hinges, locks, handles)
6. Include finish specifications and quality control checkpoints
7. Package all production documentation
8. Upload to manufacturing system
9. Notify manufacturing team via Slack and email
10. Update order status in NEXUS

**Error Handling:**
- Validate delivery date is achievable based on production capacity
- Check material availability before confirming order
- Alert if specifications have changed since quote was generated

---

## Outgoing Message Handlers

### From SPW600e Door System to NEXUS

#### `drawings.generated`

**Description:** Sent when technical drawings have been successfully generated and are ready for download.

**Payload:**
```json
{
  "request_id": "DR-2025-045",
  "drawing_package_id": "PKG-2025-045",
  "drawings": [
    {
      "type": "elevation",
      "scale": "1:10",
      "format": "pdf",
      "url": "https://sfg-storage.s3.amazonaws.com/drawings/DR-2025-045-elevation.pdf",
      "file_size": "245KB"
    },
    {
      "type": "plan",
      "scale": "1:10",
      "format": "pdf",
      "url": "https://sfg-storage.s3.amazonaws.com/drawings/DR-2025-045-plan.pdf",
      "file_size": "198KB"
    },
    {
      "type": "section",
      "scale": "1:5",
      "format": "pdf",
      "url": "https://sfg-storage.s3.amazonaws.com/drawings/DR-2025-045-section.pdf",
      "file_size": "312KB"
    }
  ],
  "generated_at": "2025-11-07T14:20:00Z",
  "expires_at": "2025-12-07T14:20:00Z"
}
```

**Trigger Conditions:**
- All requested drawings have been successfully generated
- Files have been uploaded to secure storage
- Download URLs are valid and accessible

**NEXUS Actions:**
- Update drawing request status to "completed"
- Send email notification to requester with download links
- Log drawing generation metrics for reporting
- Archive request after 30 days

---

#### `specification.generated`

**Description:** Sent when a technical specification document has been generated.

**Payload:**
```json
{
  "spec_id": "SPEC-2025-089",
  "document_url": "https://sfg-storage.s3.amazonaws.com/specs/SPEC-2025-089.pdf",
  "thermal_performance": "0.95 W/m²K",
  "security_rating": "PAS24 Compliant",
  "material_specifications": {
    "aluminium_alloy": "6063.T6",
    "glazing": "Triple glazed 44mm",
    "finish": "Anodised satin AA25"
  },
  "generated_at": "2025-11-07T09:05:00Z"
}
```

**Trigger Conditions:**
- Specification document has been compiled and formatted
- All technical data has been validated
- Document has been uploaded to secure storage

**NEXUS Actions:**
- Update specification request status to "completed"
- Distribute specification to relevant stakeholders
- Attach to project documentation
- Update project technical requirements

---

#### `quote.technical_data_ready`

**Description:** Sent when technical data for a quote has been compiled and is ready for pricing.

**Payload:**
```json
{
  "quote_id": "Q-2025-001",
  "technical_package_url": "https://sfg-storage.s3.amazonaws.com/quotes/Q-2025-001-technical.pdf",
  "bill_of_materials": {
    "frame_profiles": "SPW600e-FRAME-75mm x 15.2m",
    "leaf_profiles": "SPW600e-LEAF-75mm x 18.4m",
    "glazing_area": "7.8 sqm",
    "hardware": "Heavy duty hinges x 12, Multi-point lock x 2"
  },
  "estimated_weight": "285kg",
  "generated_at": "2025-11-07T10:35:00Z"
}
```

**Trigger Conditions:**
- All technical drawings have been generated
- Bill of materials has been calculated
- Material specifications have been compiled
- Estimated weights and dimensions are available

**NEXUS Actions:**
- Update quote status to "ready for pricing"
- Notify sales team via Slack and email
- Provide bill of materials to pricing system
- Attach technical package to quote record

---

#### `validation.failed`

**Description:** Sent when door specifications fail validation checks.

**Payload:**
```json
{
  "request_id": "DR-2025-046",
  "validation_errors": [
    {
      "field": "leaf_width",
      "value": 1200,
      "error": "Exceeds maximum leaf width of 1000mm"
    },
    {
      "field": "leaf_weight",
      "estimated_value": 85,
      "error": "Estimated weight exceeds maximum of 75kg"
    }
  ],
  "timestamp": "2025-11-07T15:30:00Z"
}
```

**Trigger Conditions:**
- Specifications exceed system constraints
- Invalid configuration detected
- Incompatible options selected

**NEXUS Actions:**
- Update request status to "validation failed"
- Notify requester with detailed error messages
- Provide suggested corrections or alternative configurations
- Log validation errors for system improvement

---

## Event-Driven Architecture

### Message Flow Diagram

```
┌─────────────┐                    ┌──────────────────────┐                    ┌─────────────┐
│   NEXUS     │                    │  SPW600e Door System │                    │   Storage   │
│ Orchestrator│                    │                      │                    │   (S3)      │
└──────┬──────┘                    └──────────┬───────────┘                    └──────┬──────┘
       │                                      │                                       │
       │  1. quote.requested                 │                                       │
       │─────────────────────────────────────>│                                       │
       │                                      │                                       │
       │                                      │  2. Validate specifications           │
       │                                      │────────────────────┐                  │
       │                                      │                    │                  │
       │                                      │<───────────────────┘                  │
       │                                      │                                       │
       │                                      │  3. Generate drawings                 │
       │                                      │────────────────────┐                  │
       │                                      │                    │                  │
       │                                      │<───────────────────┘                  │
       │                                      │                                       │
       │                                      │  4. Upload drawings                   │
       │                                      │──────────────────────────────────────>│
       │                                      │                                       │
       │                                      │  5. Get download URLs                 │
       │                                      │<──────────────────────────────────────│
       │                                      │                                       │
       │  6. quote.technical_data_ready      │                                       │
       │<─────────────────────────────────────│                                       │
       │                                      │                                       │
       │  7. Update quote status              │                                       │
       │────────────────────┐                 │                                       │
       │                    │                 │                                       │
       │<───────────────────┘                 │                                       │
       │                                      │                                       │
       │  8. Notify sales team                │                                       │
       │────────────────────┐                 │                                       │
       │                    │                 │                                       │
       │<───────────────────┘                 │                                       │
       │                                      │                                       │
```

### Integration Points

1. **NEXUS Orchestrator**: Central message broker for all SFG applications
2. **MCP-SALES**: Sales team interface for quote requests and customer communications
3. **MCP-OPERATIONS**: Manufacturing and production management
4. **MCP-COMMUNICATIONS**: Email, Slack, and notification services
5. **Storage (S3)**: Secure file storage for drawings and specifications

### Message Routing Rules

- All incoming messages are validated before processing
- Failed validations trigger immediate error responses
- Successful operations trigger status updates and notifications
- All messages are logged for audit and analytics
- Retry logic: 3 attempts with exponential backoff for transient failures

### Security Considerations

- All webhook payloads are signed with HMAC-SHA256
- Download URLs expire after 30 days
- Access to technical drawings requires authentication
- Sensitive customer data is encrypted at rest and in transit
- Audit logs maintained for all message transactions

---

## Testing and Monitoring

### Test Scenarios

1. **Happy Path**: Quote request → Validation → Drawing generation → Technical package ready
2. **Validation Failure**: Invalid specifications → Validation error → Notification with corrections
3. **Partial Failure**: Some drawings succeed, others fail → Retry failed drawings → Complete package
4. **Timeout Handling**: Long-running drawing generation → Progress updates → Completion notification

### Monitoring Metrics

- Message processing time (target: < 30 seconds for drawing generation)
- Validation failure rate (target: < 5%)
- Drawing generation success rate (target: > 99%)
- Storage upload success rate (target: > 99.9%)
- Notification delivery rate (target: > 99%)

### Alerting Rules

- Alert if message processing time exceeds 60 seconds
- Alert if validation failure rate exceeds 10% in 1 hour
- Alert if drawing generation fails 3 times consecutively
- Alert if storage upload fails
- Alert if notification delivery fails

---

## Version History

- **v1.0.0** (2025-11-07): Initial message handler implementation for SPW600e Door System
  - Incoming handlers: quote.requested, drawing.requested, specification.requested, manufacturing.order_created
  - Outgoing handlers: drawings.generated, specification.generated, quote.technical_data_ready, validation.failed
  - Integration with NEXUS orchestrator and MCP services
  - Secure file storage and download URL generation
  - Comprehensive error handling and retry logic
