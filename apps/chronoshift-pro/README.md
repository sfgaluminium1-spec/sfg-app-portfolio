# ChronoShift Pro - Advanced Payroll System

**Version:** 2.3.0  
**Status:** production  
**Platform:** Next.js 14 + TypeScript + Prisma + PostgreSQL  
**Deployed URL:** https://chronoshift-pro.abacusai.app

## Overview

Advanced payroll and timesheet management system for SFG Aluminium Ltd with real-time location tracking, supervisor approvals, and comprehensive HR compliance features

## Capabilities

- Real-time timesheet entry with mandatory location tracking
- Automated time calculations (regular/overtime with SFG rules)
- Multi-level supervisor approval workflows
- Comprehensive payroll processing and export
- Microsoft Teams integration for notifications
- SharePoint integration for document management
- BrightPay export for final payroll processing
- Mobile PWA with offline sync capability
- Voice dictation for timesheet entry
- Advanced HR compliance tracking and audit logs
- Role-based access control (Admin/Supervisor/Employee)
- Dark mode and responsive design
- Real-time geolocation verification

## NEXUS Integration

### Webhook Events Handled

- `employee.registered`
- `employee.updated`
- `payroll.process_requested`
- `timesheet.bulk_import`
- `compliance.audit_required`
- `test.event`

**Webhook URL:** `https://chronoshift-pro.abacusai.app/api/webhooks/nexus`

### Message Types Supported

- `query.employee_data`
- `query.timesheet_summary`
- `query.payroll_summary`
- `action.approve_timesheet`
- `action.generate_payslip`
- `action.export_payroll_data`
- `test.message`

**Message Handler URL:** `https://chronoshift-pro.abacusai.app/api/messages/handle`

## Technical Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **UI Framework:** shadcn/ui + Tailwind CSS
- **Backend:** Next.js API Routes, NextAuth.js
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js + Azure AD (optional)
- **Hosting:** Abacus.AI Platform

## Business Rules

### Timesheet Rules

- **Mandatory Location Tracking:** All timesheet entries must include GPS coordinates
- **Overtime Calculation:** Hours > 37.5/week at 1.5x base rate
- **Break Time Deduction:** Default 30 minutes, adjustable per shift
- **Supervisor Approval Required:** All timesheets must be approved before payroll

### Compliance

- **UK GDPR Compliant**
- **7-Year Audit Trail Retention**
- **Working Time Directive Monitoring**
- **Data Export/Deletion Functionality**

## Integration Points

### SFG Systems

- **NEXUS:** Central orchestration hub
- **MCP-OPERATIONS:** Operations tools
- **MCP-HR:** HR tools and policies
- **MCP-FINANCE:** Financial calculations
- **MCP-COMMUNICATIONS:** Notifications

### External Services

- **Microsoft 365:** Teams notifications, SharePoint storage
- **BrightPay:** UK payroll processing
- **Azure AD:** Optional authentication

## Security Features

- Role-based access control (RBAC)
- Mandatory location verification
- Session management with NextAuth
- API route protection
- SQL injection prevention (Prisma ORM)
- XSS protection (React default)
- CSRF protection
- Secure password hashing (bcrypt)
- Audit logging for all actions
- IP address tracking

## Test Accounts

- **Admin:** admin@sfgaluminium.com / Admin123! - Full system access
- **Supervisor:** supervisor@sfgaluminium.com / Super123! - Team approval access
- **Employee:** employee@sfgaluminium.com / Emp123! - Timesheet entry only

## Deployment Information

- **Production URL:** https://chronoshift-pro.abacusai.app
- **Platform:** Abacus.AI
- **Last Updated:** 2025-11-04

## Support

**Contact:** Warren @ SFG Aluminium  
**Support URL:** https://chronoshift-pro.abacusai.app

## Registration

- **Registered At:** 2025-11-04T00:00:00Z
- **Registered By:** Warren @ SFG Aluminium
- **Registration Version:** 2.0

---

*ChronoShift Pro is a mission-critical payroll system for SFG Aluminium Ltd with real-time NEXUS orchestration via webhooks and message handlers.*
