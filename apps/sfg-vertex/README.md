# SFG Vertex

**Version:** 1.0.0  
**Category:** sfg-aluminium-app  
**Status:** Registered  
**Deployment:** https://sfg-vertex.abacusai.app

## Description

Comprehensive project management system for SFG Aluminium, integrating enquiry management, quotation generation, professional CAD drawing tools, autonomous workflow automation, and real-time business intelligence.

## Capabilities

- Enquiry Management - Full lifecycle customer enquiry tracking and processing
- Quotation Generation - Multi-stage approval workflow with automated calculations
- Professional CAD Drawing - AutoCAD-style interface with DWG export capabilities
- Autonomous Workflow Engine - AI-powered document processing and automation
- Project Tracking - Real-time status monitoring with Gantt chart visualization
- Business Intelligence Dashboard - Live metrics, KPIs, and performance analytics
- Document Management - Centralized specification and drawing repository
- Terminology Dictionary - Industry-specific standardization and reference
- AutoCAD Integration - Direct COM interface for automated drawing generation
- Logikal Integration - Curtain wall design system integration bridge
- Email Automation - Automated notification and communication workflows
- Multi-user Authentication - Role-based access control with NextAuth.js

## Key Workflows


### Enquiry to Quotation Workflow
End-to-end process from customer enquiry to approved quotation

1. Customer enquiry received (email/web form)
2. Enquiry logged in system with auto-generated ID
3. Information extraction and parsing (OCR/NLP)
4. Quotation generation with cost calculations
5. Internal approval workflow (multi-stage)
6. Final quotation review and editing
7. Customer communication and delivery
8. Follow-up tracking and conversion monitoring

### Drawing Automation Workflow
Automated technical drawing generation from specifications

1. Document upload (specifications, sketches, Logikal files)
2. OCR processing and data extraction
3. Parametric model generation in FreeCAD
4. SFG curtain wall standards application
5. AutoCAD/nanoCAD dimensioning and annotation
6. DWG export with proper layers and formatting
7. Quality validation and review
8. Delivery to engineering team and customer

### Project Tracking Workflow
Project lifecycle management from quotation to completion

1. Project creation from approved quotation
2. Timeline and milestone definition
3. Resource allocation and scheduling
4. Real-time status updates and tracking
5. Milestone completion notifications
6. Issue tracking and resolution
7. Dashboard metric updates
8. Project completion and handover

### Autonomous Document Processing
AI-powered document classification and workflow automation

1. Document received (email attachment/upload)
2. AI classification (enquiry/specification/invoice/etc)
3. OCR and NLP extraction of structured data
4. Automated record creation in relevant module
5. Workflow triggering based on document type
6. Stakeholder notification
7. Dashboard and reporting updates

## Integrations

- **NEXUS** (orchestration)
- **MCP-SALES** (sales management)
- **MCP-FINANCE** (financial operations)
- **MCP-OPERATIONS** (operational workflows)
- **MCP-COMMUNICATIONS** (messaging and notifications)
- **AutoCAD** (professional CAD software)
- **NanoCAD** (alternative CAD platform)
- **FreeCAD** (open-source CAD with Python API)
- **Logikal** (curtain wall design system)

## Webhooks

### Incoming Events (5)

- `enquiry.received`: New customer enquiry received from external sources (email, web form, partner systems)
- `quotation.approval_requested`: Quotation requires approval from management before sending to customer
- `project.milestone_update`: Project milestone status update from external systems (ERP, manufacturing)
- `document.uploaded`: New document uploaded for processing (specifications, drawings, certifications)
- `logikal.calculation_complete`: Logikal curtain wall calculation results available for import

### Outgoing Events (7)

- `enquiry.created`: New enquiry has been created and logged in the system
- `quotation.generated`: Quotation has been generated and is ready for internal review
- `quotation.approved`: Quotation has been approved and sent to customer
- `project.created`: New project has been created from approved quotation
- `drawing.generated`: Technical drawing has been generated and is ready for review
- `workflow.automation_complete`: Autonomous workflow has completed processing
- `alert.critical`: Critical system alert requiring immediate attention

## Quick Start

1. Deploy the app at https://sfg-vertex.abacusai.app
2. Configure webhook endpoint: `https://sfg-vertex.abacusai.app/api/webhooks/nexus`
3. Register with NEXUS orchestration hub
4. Test integration with sample events
5. Monitor health at `https://sfg-vertex.abacusai.app/api/health`

## Health Monitoring

- **Health Check:** https://sfg-vertex.abacusai.app/api/health
- **Webhook Status:** https://sfg-vertex.abacusai.app/api/webhooks/status
- **Application Dashboard:** https://sfg-vertex.abacusai.app

## Documentation

- **Message Handlers:** `workflows/message-handlers.md`
- **Business Logic:** `business-logic.json`
- **Webhook Configuration:** `config/webhooks.json`
- **Communications Setup:** `config/communications.json`

## Technology Stack

- **Framework:** Next.js 14.2.28 (App Router)
- **UI:** React 18.2, Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with role-based access control
- **CAD Integration:** AutoCAD COM, FreeCAD Python API, nanoCAD
- **Automation:** Python workflow engine with OCR/NLP
- **Deployment:** Abacus.AI platform
- **API:** RESTful webhooks with HMAC-SHA256 security

## Support

For issues or questions:
- GitHub Repository: https://github.com/sfgaluminium1-spec/sfg-app-portfolio
- App Directory: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/tree/main/apps/sfg-vertex

---

**Registered:** 2025-11-06  
**Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio  
**Status:** ✅ Active - Ready for NEXUS orchestration
