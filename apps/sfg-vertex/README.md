# SFG Vertex

**Version:** 1.0.0  
**Category:** sfg-aluminium-app  
**Status:** Registered  
**Deployment:** https://sfg-vertex.abacusai.app

## Description

Comprehensive project management platform for SFG Aluminium integrating enquiry tracking, quotation generation, professional CAD drawing, autonomous workflow automation, and real-time business intelligence dashboard for curtain wall, window, and door systems.

## Capabilities

- Enquiry Management - Track customer enquiries with full lifecycle management
- Quotation Generation - Create, manage and track quotations with multi-stage approval workflows
- Professional CAD Drawing - AutoCAD-style interface with full drawing tools, layers, and DWG export
- Autonomous Workflow Engine - AI-powered automation for document processing, OCR, and workflow orchestration
- Project Tracking - Real-time project status tracking with Gantt charts and milestone management
- Business Intelligence Dashboard - Live metrics, KPIs, and analytics with interactive visualizations
- Document Management - Centralized repository for specifications, drawings, and cutting lists
- Terminology Dictionary - Industry-specific terminology and standardization system
- AutoCAD Integration - Direct integration with AutoCAD and NanoCAD via COM interface
- Logikal Integration - Bridge to Logikal for advanced curtain wall design and calculations
- Email Automation - Automated email notifications for enquiries, quotations, and project updates
- Multi-user Authentication - Role-based access control with NextAuth integration

## Key Workflows

### Enquiry to Quotation Workflow

Complete lifecycle from customer enquiry to approved quotation

### Drawing Automation Workflow

Automated generation of technical drawings from project specifications

### Project Tracking Workflow

End-to-end project management from order to delivery

### Autonomous Document Processing

AI-powered processing of incoming documents and emails


## Integrations

- NEXUS (orchestration hub)
- MCP-SALES (sales management)
- MCP-FINANCE (financial operations)
- MCP-OPERATIONS (operational workflows)
- MCP-COMMUNICATIONS (notifications and messaging)
- AutoCAD (professional CAD software)
- NanoCAD (alternative CAD platform)
- FreeCAD (open-source CAD with Python scripting)
- Logikal (curtain wall design and calculation)

## Webhooks

### Incoming Events (5 events)

- `enquiry.received`: New customer enquiry received from email or web form
- `quotation.approval_requested`: Request for quotation approval from management
- `project.milestone_update`: Update project milestone status from external systems
- `document.uploaded`: New document uploaded for processing
- `logikal.calculation_complete`: Logikal calculation results ready for import

### Outgoing Events (7 events)

- `enquiry.created`: New enquiry created in SFG Vertex system
- `quotation.generated`: New quotation generated and ready for review
- `quotation.approved`: Quotation approved by management and sent to customer
- `project.created`: New project created from approved quotation
- `drawing.generated`: CAD drawing generated and ready for review
- `workflow.automation_complete`: Automated workflow completed successfully
- `alert.critical`: Critical alert requiring immediate attention

## Communication Channels

### Email Templates (6 templates)

- **Enquiry Acknowledgement**: Sent automatically when new enquiry is received
- **Quotation Ready**: Sent when quotation is approved and ready to send to customer
- **Project Kickoff**: Sent to project team when new project is created
- **Milestone Completed**: Sent to stakeholders when project milestone is reached
- **Drawing Ready for Review**: Sent to engineering team when CAD drawing is generated
- **Quotation Follow-up**: Automated follow-up sent 7 days after quotation is sent

### Internal Notifications

- **slack** (#sales): New enquiry received or quotation generated
- **slack** (#engineering): New drawing request or technical specification uploaded
- **slack** (#operations): Project milestone update or fabrication status change
- **email** (management@sfgaluminium.com): Quotation approval request or critical project alert
- **dashboard** (Real-time Dashboard): Live updates for all metrics and KPIs

## Dashboard Widgets

- **Active Enquiries** (metric): Total number of active enquiries in the system
- **Pending Quotations** (metric): Quotations awaiting approval or customer response
- **Active Projects** (metric): Currently active projects with progress tracking
- **Monthly Revenue** (chart): Revenue trends over time with forecasting
- **Project Timeline** (chart): Gantt chart showing all project timelines
- **Conversion Rate** (metric): Enquiry to quotation to project conversion rates
- **Recent Activity** (table): Latest enquiries, quotations, and project updates
- **Critical Alerts** (alert): Time-sensitive alerts requiring immediate action
- **Workflow Status** (table): Status of all automated workflows and processing jobs
- **Document Processing Queue** (metric): Number of documents in processing queue

## Quick Start

1. Deploy the app at `https://sfg-vertex.abacusai.app`
2. Configure webhook endpoint: `https://sfg-vertex.abacusai.app/api/webhooks/nexus`
3. Set up environment variables for integrations
4. Register with NEXUS orchestration hub
5. Test integration with sample events

## Technical Stack

- **Framework**: Next.js 14.2.28 (App Router)
- **UI**: React 18.2, Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with role-based access
- **CAD Integration**: AutoCAD COM, FreeCAD Python API
- **Automation**: Python workflow engine with OCR processing
- **Deployment**: Abacus.AI platform

## Documentation

- `business-logic.json`: Complete business capabilities and workflows
- `config/webhooks.json`: Webhook configuration and event definitions
- `config/communications.json`: Email templates and notification settings
- `workflows/message-handlers.md`: Detailed event documentation

## Health & Monitoring

- **Health Check Endpoint**: `https://sfg-vertex.abacusai.app/api/health`
- **Webhook Status**: `https://sfg-vertex.abacusai.app/api/webhooks/status`
- **Dashboard**: Real-time metrics and KPIs

---

**Registered:** 2025-11-05  
**Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio  
**App Directory:** `apps/sfg-vertex/`
