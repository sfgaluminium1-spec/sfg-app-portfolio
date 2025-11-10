# ChronoShift Pro - Message Handlers

## Webhook Endpoints

- **Incoming**: `https://chronoshift-pro.abacusai.app/api/webhooks/nexus`
- **Message Handler**: `https://chronoshift-pro.abacusai.app/api/messages/handle`

## Security

HMAC-SHA256 signature verification required.

## Incoming Events

### employee.registered
Triggered when new employee added to HR system.

### payroll.process_requested
Triggered when payroll processing requested.

## Outgoing Events

### timesheet.submitted  
Emitted when employee submits timesheet.

### payroll.data_ready
Emitted when payroll data ready for export.
