
# SFG NEXUS Business Rules Analysis - Export Package

**Date:** 5 October 2025  
**Analyst:** Senior Business Systems Analyst  
**Company:** SFG Aluminium (UK) Ltd

---

## 📦 Package Contents

This export package contains a comprehensive business rules analysis of the SFG NEXUS application, extracted from the codebase and structured for SharePoint/Microsoft Planner implementation.

### Files Included

1. **sfg-business-rules-complete.json** (62 KB)
   - Complete structured JSON export of all business rules
   - Entities, workflows, approvals, calculations, SLAs, RBAC
   - Machine-readable format for integration
   - Use this for automated system configuration

2. **sfg-actionable-summary.md** (47 KB) + PDF
   - Executive summary of critical business rules
   - Prioritized implementation roadmap
   - SharePoint list configuration guidance
   - Power Automate flow requirements
   - KPI definitions and monitoring approach

3. **sfg-planner-mapping.md** (55 KB) + PDF
   - Top 10 workflow-to-Planner task mappings
   - Detailed task templates with checklists
   - Automation rules and triggers
   - Bucket structure and assignment logic
   - Integration patterns with SharePoint

4. **sfg-gaps-and-questions.md** (42 KB) + PDF
   - 10 critical business rules requiring clarification
   - Prioritized by impact (CRITICAL, HIGH, MEDIUM, LOW)
   - Stakeholder question templates
   - Recommended policies and thresholds
   - Risk assessment for each gap

5. **README.md** (this file)
   - Package overview and usage guide

---

## 🎯 Purpose

This analysis was performed to:

1. **Extract** existing business rules from the SFG NEXUS application
2. **Document** workflows, approvals, calculations, and SLAs
3. **Identify** gaps and ambiguities requiring stakeholder input
4. **Provide** actionable guidance for SharePoint/Planner implementation
5. **Enable** smooth transition from development to operational deployment

---

## 🔍 Key Findings Summary

### Critical Business Rules Identified

1. **Purchase Order Approvals**
   - < £100: Single approval (Operations)
   - £100-£500: Two approvals (Ops + Finance)
   - > £500: Finance team mandatory

2. **Enquiry Response SLA**
   - Initial response: 2 hours
   - Full assessment: 24 hours
   - Quote delivery: 7 days

3. **Drawing Approval Workflow**
   - 7 sequential stages
   - 16 days total SLA
   - Customer → Technical → Production → Final

4. **Survey Costing**
   - £1 per mile from Manchester M12 5PG
   - £50 minimum charge
   - FREE for Manchester area (M-prefix) if quote < £2,000

5. **Quote to Job Conversion**
   - Customer PO expected within 14 days
   - Escalate after 21 days
   - Auto-initiate drawing approval workflow

6. **RBAC - Tier-Based Access**
   - Tier1: Executive & Operations (full access)
   - Tier2: Finance & Estimating (financial access)
   - Tier3: Sales, Production, Delivery (department access, no financial visibility)

### Gaps Requiring Clarification

**🔴 CRITICAL:**
- Quote markup calculation rules (target margins per quote type)
- Quality check criteria and pass/fail standards

**🟠 HIGH:**
- CEO approval threshold (£50k suggested)
- Installation staffing rules (safety compliance)

**🟡 MEDIUM:**
- Survey pricing regional variations
- Late payment interest calculations
- Drawing revision limits and charging
- Supplier performance rating methodology
- Fabrication helper assignment rules
- Warranty risk assessment

---

## 📊 Implementation Roadmap

### Phase 1: Immediate (Week 1)
- [ ] Stakeholder workshop to clarify CRITICAL gaps
- [ ] Configure SharePoint lists with RBAC
- [ ] Set up Purchase Order approval workflows
- [ ] Implement Enquiry Response SLA tracking

### Phase 2: Short-term (Weeks 2-3)
- [ ] Build Drawing Approval 7-stage workflow
- [ ] Configure Quote to Job conversion automation
- [ ] Set up MS Teams notification webhooks
- [ ] Create Planner board with 10 buckets

### Phase 3: Medium-term (Weeks 4-6)
- [ ] Implement Survey Costing calculation
- [ ] Build automated email templates
- [ ] Configure advanced approval routing
- [ ] Deploy KPI dashboards

---

## 👥 Stakeholder Actions Required

### CEO / Executive Leadership
- Define approval thresholds (suggested: £50k+)
- Review and approve pricing/markup policies
- Validate RBAC tier assignments

### Finance Manager
- Confirm quote markup percentages by type
- Define late payment interest calculations
- Approve credit management policies
- Validate purchase order approval thresholds

### Operations Manager
- Review and approve workflow processes
- Confirm resource allocation rules
- Validate SLA targets (achievable?)
- Define escalation procedures

### Production Manager
- Define quality check standards and criteria
- Specify fabrication helper assignment rules
- Confirm lead time calculations
- Validate materials analysis process

### Sales Manager
- Confirm enquiry response SLA feasibility
- Review survey pricing model
- Validate quote approval workflow
- Define customer communication templates

### Installation Manager
- Define installation staffing formulas (safety)
- Confirm vehicle assignment logic
- Specify site access risk factors
- Validate glass weight handling procedures

---

## 📋 How to Use This Package

### For Business Stakeholders

1. **Start with:** `sfg-actionable-summary.pdf`
   - Read the executive summary
   - Review the critical business rules (pages 1-10)
   - Understand the implementation priorities

2. **Then review:** `sfg-gaps-and-questions.pdf`
   - Answer the clarification questions (use template on last page)
   - Provide missing policy definitions
   - Validate or correct extracted rules

3. **Finally review:** `sfg-planner-mapping.pdf`
   - Understand how workflows translate to Planner tasks
   - Validate bucket structure and task assignments
   - Confirm automation rules make sense

### For Technical Implementation Team

1. **Start with:** `sfg-business-rules-complete.json`
   - Import into configuration management system
   - Use as source of truth for SharePoint list design
   - Build Power Automate flows based on workflow definitions

2. **Then use:** `sfg-actionable-summary.md`
   - SharePoint list schema (Section: SharePoint List Configuration)
   - Power Automate flow requirements (Section: Power Automate Flows Required)
   - MS Teams integration patterns (Section: MS Teams Notifications)

3. **Finally implement:** `sfg-planner-mapping.md`
   - Create Planner board with specified buckets
   - Configure auto-task creation flows
   - Set up due date calculations and reminders

### For Project Managers

1. **Track progress** against the implementation roadmap (this README)
2. **Monitor** stakeholder question responses (sfg-gaps-and-questions.md)
3. **Report** on KPIs defined in actionable summary
4. **Escalate** any blocked items requiring executive decision

---

## 🔗 Integration Points

### SharePoint Lists (To Be Created)
- Enquiries
- Quotes
- Jobs
- Purchase Orders (Supplier Orders)
- Drawing Approvals
- Materials Analysis
- Customers
- Suppliers

### Power Automate Flows (To Be Built)
1. New Enquiry → Create Planner Task
2. Quote Won → Create Job + Planner Task
3. PO Created → Route for Approval
4. PO Approved → Send Email to Supplier
5. Drawing Stage Change → Notify Next Approver
6. SLA Approaching → Send Reminder
7. SLA Exceeded → Escalate to Manager

### Microsoft Planner
- Plan Name: "SFG Operations Hub"
- 10 Buckets (Sales Pipeline → Completed)
- Auto-create tasks from SharePoint
- Auto-assign based on value/role
- Auto-calculate due dates from SLA

### MS Teams Integration
- Channels: Sales, Operations, Finance, Technical, Production
- Notification webhooks for approval requests
- Real-time updates on critical milestones

---

## 📈 Success Metrics

### Operational Efficiency
- Enquiry response time: < 2 hours (target: 95% compliance)
- Quote delivery time: < 7 days (target: 90% compliance)
- Drawing approval cycle: < 16 days (target: 85% compliance)
- PO approval cycle: < 24 hours (target: 90% compliance)

### Financial Performance
- Quote win rate: > 30%
- Average quote value: £X (baseline to be established)
- Margin by quote type: Target margins defined in policies
- On-time payment rate: > 85%

### Quality & Customer Satisfaction
- Drawing first-time approval rate: > 60%
- Quality check pass rate: > 95%
- Installation on-time completion: > 90%
- Customer satisfaction score: > 4.0/5.0

---

## ⚠️ Important Notes

1. **Data Accuracy**: All rules extracted from current codebase as of 5 October 2025. May require validation against actual business practices.

2. **Gaps Exist**: 10 critical questions require stakeholder input before full implementation. Do not deploy approval workflows or financial calculations until gaps are resolved.

3. **RBAC Critical**: Financial field restrictions (Tier3 cannot see values) must be implemented before go-live to ensure data security.

4. **Compliance**: Installation staffing rules must comply with UK HSE guidelines. Consult safety officer before finalizing.

5. **Change Management**: Major process changes identified (e.g., 7-stage drawing approval). Plan user training and communication.

---

## 📞 Questions or Issues?

**Business Rules Questions:**
- Schedule stakeholder workshop
- Use clarification form in sfg-gaps-and-questions.md

**Technical Implementation:**
- Refer to sfg-business-rules-complete.json for detailed specs
- Review API routes in codebase for exact logic

**Project Management:**
- Follow implementation roadmap (Phase 1-3)
- Track against defined success metrics

---

## 📝 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-05 | Senior Business Systems Analyst | Initial analysis and export |

---

## 🔐 Confidentiality

This document contains confidential business rules and operational procedures of SFG Aluminium (UK) Ltd. 

**Internal Use Only - Do Not Distribute**

---

**End of README**
