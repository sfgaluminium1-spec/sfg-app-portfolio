# SFG Nexus Core

**Version:** 1.2.3  
**Platform:** Abacus.AI + Next.js 14  
**Category:** Core System  
**Status:** Active

## Purpose

NEXUS is the central orchestration system for SFG Aluminium's 51 satellite applications. It coordinates workflows, manages business rules, and ensures consistent operation across the entire application ecosystem.

## Capabilities

- Truth File System v1.2.3 (versioned business rules)
- Persistent Memory System (conversations, plans, decisions)
- Satellite App Orchestration (registration, approval, coordination)
- BaseNumber Generation (ENQ, QUO, ORD, INV, FAB, INS)
- Customer/Job/Quote Management
- Approval Workflow Management (tier-based)
- Finance Dashboard (Xero integration)
- Installation/Fabrication Scheduling
- Document Lifecycle Management (ENQ→PAID)

## Workflows

### 1. Satellite App Registration
1. App sends registration request
2. NEXUS reviews business logic
3. NEXUS approves/rejects
4. App becomes active in ecosystem

### 2. Business Rule Management
1. Rule change requested
2. NEXUS creates new version
3. NEXUS supersedes old version
4. All apps notified of change

### 3. Workflow Orchestration
1. Event triggered in app
2. NEXUS coordinates with other apps
3. NEXUS ensures business rules followed
4. NEXUS logs all actions

## Integration Points

- **GitHub:** Repository management, issue tracking
- **Xero:** Accounting, invoicing, financial data
- **SharePoint:** Document storage, collaboration
- **Companies House:** Company data, credit checks
- **Stripe:** Payment processing
- **Abacus.AI:** AI/ML capabilities

## Registration

**Registered:** 2025-11-04  
**Registered By:** Comet (Manus AI Project Manager)  
**Category:** Core System  
**Approval:** Not required (core app)