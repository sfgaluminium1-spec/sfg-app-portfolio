# SFG Aluminium Ecosystem

**Complete Application Portfolio for SFG Aluminium Ltd**

This repository contains the complete ecosystem architecture, truth files, and documentation for SFG Aluminium's integrated business management system.

---

## 🏗️ Architecture Overview

The SFG Aluminium ecosystem is built on three core architectural principles:

### 1. **Single Webhook Architecture**
- **ONE webhook only** with unlimited redirect capability
- Central webhook handler distributes events to all satellite applications
- Ensures consistent event processing and simplified maintenance

### 2. **One API Per Application**
- Each satellite application has its own dedicated API
- APIs are **non-shared** to maintain clear boundaries and independence
- Promotes modularity and reduces coupling between systems

### 3. **5-Tier MCP Structure**
- **Tier 1 - Directors**: Unlimited access to all systems and data
- **Tier 2 - Finance/Payroll**: £50,000 credit limit
- **Tier 3 - HR/Design**: £15,000 credit limit
- **Tier 4 - H&S/Production**: £5,000 credit limit
- **Tier 5 - New Starters/Juniors**: £1,000 credit limit

---

## 📁 Directory Structure

```
sfg-app-portfolio/
├── README.md                          # This file - ecosystem overview
├── shared/
│   └── truth-files/                   # 12 canonical truth files
│       ├── staff-tiers-truth.json
│       ├── customer-tiers-truth.json
│       ├── project-rules-truth.json
│       ├── credit-logic-truth.json
│       ├── document-lifecycle-truth.json
│       ├── building-regs-truth.json
│       ├── credit-calculation-truth.json
│       ├── permissions-matrix-truth.json
│       ├── truth-types.ts
│       ├── README.md
│       ├── EXTRACTION_REPORT.md
│       └── QUICK_START.md
├── docs/
│   ├── AUTONOMOUS_INSTRUCTIONS.md     # Complete instructions for Manus agent
│   ├── manus-communication/
│   │   └── HANDOFF.md                 # Handoff document for Manus
│   ├── api-specs/                     # API specifications (to be created)
│   ├── privacy-policy/                # Privacy policy (to be created)
│   └── terms-of-service/              # Terms of service (to be created)
├── apps/
│   ├── sfg-nexus/                     # Central hub application
│   ├── quotation-copilot/            # Quotation management
│   ├── spec-module/                   # Specification management
│   ├── fabrication-tracker/          # Production tracking
│   ├── predictive-pricing/           # Intelligent pricing engine
│   └── [other satellite apps]/
└── infrastructure/
    ├── webhook-handler/               # Central webhook distribution
    └── xero-integration/              # Customer database sync
```

---

## 🚀 Quick Start Guide

### For Developers

1. **Read the Truth Files**
   - Start with `shared/truth-files/README.md`
   - Review `shared/truth-files/QUICK_START.md`
   - Understand the canonical business rules in the JSON files

2. **Review Autonomous Instructions**
   - Read `docs/AUTONOMOUS_INSTRUCTIONS.md` for complete implementation guidance
   - Follow the Manus handoff document at `docs/manus-communication/HANDOFF.md`

3. **Understand the Architecture**
   - Single webhook with unlimited redirects
   - One API per application (non-shared)
   - 5-tier MCP structure for access control

4. **Key Integration Points**
   - Xero integration for customer database synchronization
   - UK 7-year data retention compliance required
   - Privacy policy and terms of service URLs must be provided

### For Manus Agent

**You are the implementation agent for this ecosystem. Your tasks are:**

1. **Xero Integration & Customer Database Sync**
   - Implement customer data synchronization from Xero
   - Maintain customer tier classifications
   - Ensure real-time updates for credit limits and account status

2. **Privacy Policy & Terms of Service**
   - Create comprehensive privacy policy (UK GDPR compliant)
   - Draft terms of service for all applications
   - Ensure 7-year data retention policy is documented

3. **Webhook Handler Implementation**
   - Build central webhook receiver
   - Implement unlimited redirect logic to satellite apps
   - Add event logging and error handling

4. **Satellite App API Specifications**
   - Define API contracts for each application
   - Document authentication and authorization flows
   - Specify data formats and error responses

5. **MCP Server Allocation**
   - Assign MCP tiers to staff members
   - Configure permission matrices
   - Implement credit limit enforcement

---

## 👥 Organizational Tiers

### Tier 1: Directors
- **Access**: Unlimited to all systems
- **Credit Limit**: Unlimited
- **Permissions**: Full administrative control
- **Members**: Company directors and C-level executives

### Tier 2: Finance/Payroll
- **Access**: Financial systems, payroll, invoicing
- **Credit Limit**: £50,000
- **Permissions**: Financial data read/write, reporting
- **Members**: Finance team, accountants, payroll staff

### Tier 3: HR/Design
- **Access**: HR systems, design tools, project planning
- **Credit Limit**: £15,000
- **Permissions**: Employee data, design specifications
- **Members**: HR staff, design team, project managers

### Tier 4: H&S/Production
- **Access**: Safety systems, production tracking, fabrication
- **Credit Limit**: £5,000
- **Permissions**: Production data, safety records
- **Members**: Health & Safety officers, production managers, fabricators

### Tier 5: New Starters/Juniors
- **Access**: Basic systems, read-only access
- **Credit Limit**: £1,000
- **Permissions**: Limited read access, basic task management
- **Members**: New employees, junior staff, trainees

---

## 📋 Key Documents

### Truth Files
- **Location**: `shared/truth-files/`
- **Purpose**: Canonical source of business rules and logic
- **Files**: 12 JSON/TypeScript files defining all business constraints
- **Documentation**: README, QUICK_START, and EXTRACTION_REPORT included

### Autonomous Instructions
- **Location**: `docs/AUTONOMOUS_INSTRUCTIONS.md`
- **Purpose**: Complete implementation guide for Manus agent
- **Content**: Step-by-step instructions, architecture decisions, integration points

### Manus Handoff
- **Location**: `docs/manus-communication/HANDOFF.md`
- **Purpose**: Transition document from preparatory phase to implementation
- **Content**: Context, completed work, next steps, escalation procedures

---

## 🔄 Next Steps for Manus Agent

### Phase 1: Foundation (Immediate)
1. ✅ Review all truth files and autonomous instructions
2. ✅ Understand the 5-tier MCP structure
3. ⏳ Set up Xero integration credentials
4. ⏳ Create privacy policy and terms of service drafts

### Phase 2: Core Infrastructure (Week 1)
1. ⏳ Implement central webhook handler
2. ⏳ Build Xero customer sync service
3. ⏳ Define API specifications for all satellite apps
4. ⏳ Set up authentication and authorization framework

### Phase 3: Application Development (Week 2-4)
1. ⏳ Develop SFG Nexus central hub
2. ⏳ Build Quotation Copilot
3. ⏳ Implement SPEC Module
4. ⏳ Create Fabrication Tracker
5. ⏳ Deploy Predictive Pricing engine

### Phase 4: Integration & Testing (Week 5-6)
1. ⏳ Connect all satellite apps to webhook handler
2. ⏳ Test MCP tier permissions across all systems
3. ⏳ Validate credit limit enforcement
4. ⏳ Perform end-to-end integration testing

### Phase 5: Deployment & Handoff (Week 7)
1. ⏳ Deploy to production environment
2. ⏳ Train staff on new systems
3. ⏳ Document operational procedures
4. ⏳ Hand off to Warren for final approval

---

## 🔒 Compliance & Security

### UK GDPR Compliance
- 7-year data retention policy enforced
- Privacy policy must be accessible from all applications
- User consent tracking and management required

### Data Security
- Role-based access control (5-tier MCP)
- Audit logging for all financial transactions
- Encrypted data transmission between services

### Business Continuity
- Webhook redundancy and failover
- Database backup and recovery procedures
- Disaster recovery plan documentation

---

## 📞 Contact & Escalation

### Primary Contact
- **Name**: Warren (SFG Aluminium Director)
- **Role**: Project Owner & Final Approver
- **Escalation**: All critical decisions and blockers

### Implementation Agent
- **Name**: Manus
- **Role**: Autonomous Implementation Agent
- **Responsibility**: Execute all development tasks per autonomous instructions

### Support Resources
- **Truth Files**: `shared/truth-files/README.md`
- **Autonomous Instructions**: `docs/AUTONOMOUS_INSTRUCTIONS.md`
- **Manus Handoff**: `docs/manus-communication/HANDOFF.md`

---

## 📊 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Truth Files | ✅ Complete | 12 files extracted and documented |
| Autonomous Instructions | ✅ Complete | Full implementation guide ready |
| Manus Handoff | ✅ Complete | Transition document finalized |
| Repository Structure | ✅ Complete | All directories and docs in place |
| Xero Integration | ⏳ Pending | Manus to implement |
| Privacy Policy | ⏳ Pending | Manus to create |
| Terms of Service | ⏳ Pending | Manus to create |
| Webhook Handler | ⏳ Pending | Manus to build |
| Satellite App APIs | ⏳ Pending | Manus to specify |
| MCP Server Allocation | ⏳ Pending | Manus to configure |

---

## 🎯 Success Criteria

The SFG Aluminium ecosystem will be considered complete when:

1. ✅ All truth files are accessible and documented
2. ✅ Autonomous instructions are comprehensive and actionable
3. ⏳ Xero integration is live and syncing customer data
4. ⏳ Privacy policy and terms of service are published
5. ⏳ Central webhook handler is operational
6. ⏳ All satellite apps have defined APIs
7. ⏳ 5-tier MCP structure is enforced across all systems
8. ⏳ Credit limits are automatically enforced
9. ⏳ All applications are deployed and accessible
10. ⏳ Warren has approved the final implementation

---

## 📝 License

Proprietary - SFG Aluminium Ltd. All rights reserved.

---

## 🙏 Acknowledgments

This ecosystem was designed and prepared through collaborative analysis of SFG Aluminium's business processes, regulatory requirements, and operational workflows. The truth files represent the canonical business logic extracted from comprehensive documentation and stakeholder input.

**Prepared by**: Autonomous preparation agent  
**Implementation by**: Manus autonomous agent  
**Approved by**: Warren, SFG Aluminium Ltd.

---

**Last Updated**: November 3, 2025  
**Version**: 1.0.0  
**Repository**: sfg-app-portfolio
