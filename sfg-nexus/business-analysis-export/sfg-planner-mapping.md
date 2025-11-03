
# SFG NEXUS - Microsoft Planner Workflow Mapping

**Date:** 5 October 2025  
**Analyst:** Senior Business Systems Analyst  
**Company:** SFG Aluminium (UK) Ltd

---

## Overview

This document maps the top 10 critical workflows from the SFG NEXUS application to Microsoft Planner tasks, providing detailed configuration for automated task creation, assignment, and tracking.

---

## Planner Board Structure

### Recommended Plan Name
**"SFG Operations Hub"**

### Buckets Configuration

| Bucket Name | Purpose | Auto-Assign Rule | Typical Task Count |
|-------------|---------|------------------|-------------------|
| **1. Sales Pipeline** | New enquiries and quote preparation | Sales Team | 10-30 |
| **2. Pending Approvals** | Items requiring approval | Value-based routing | 5-15 |
| **3. Customer Actions** | Waiting for customer input/docs | Customer (external) | 8-20 |
| **4. Technical Review** | Technical and spec reviews | Technical Team (Tier2) | 5-10 |
| **5. Production Planning** | Materials and fabrication prep | Production Team (Tier3) | 10-20 |
| **6. Procurement** | Purchase order management | Operations + Finance | 5-15 |
| **7. Fabrication** | Active manufacturing work | Lead Fabricator | 8-15 |
| **8. Installation Planning** | Scheduling and logistics | Installation Manager | 5-12 |
| **9. Quality & Completion** | Final checks and close-out | Quality Team | 3-8 |
| **10. Completed** | Archive of finished tasks | N/A | Archive |

---

## Top 10 Workflow Mappings

### 1. New Enquiry Response

**Workflow Description:** Initial customer enquiry received, requires immediate response

**Planner Task Configuration:**
- **Task Title:** `Respond to Enquiry #{enquiryNumber} - {customerName}`
- **Bucket:** Sales Pipeline
- **Owner:** Sales Team (auto-assign to next available)
- **Priority:** High
- **Due Date:** `Creation DateTime + 2 hours (business hours)`
- **Start Date:** Creation DateTime

**Task Description Template:**
```
🎯 NEW ENQUIRY ALERT

Customer: {customerName}
Contact: {contactName}
Email: {email}
Phone: {phone}
Company: {company}
Project: {projectName}
Description: {description}

⏰ SLA TARGETS:
- Initial Response: 2 hours ⚠️
- Full Assessment: 24 hours
- Quote Delivery: 7 days

📋 REQUIRED ACTIONS:
See checklist below
```

**Checklist Items:**
- [ ] Acknowledge receipt via email/phone (2 hour SLA)
- [ ] Log enquiry in system with all details
- [ ] Assess project requirements and complexity
- [ ] Determine if survey required
- [ ] Schedule survey if needed (Free for Manchester < £2k)
- [ ] Prepare initial quote estimate
- [ ] Send quote to customer (7 day SLA)
- [ ] Log quote number and link to enquiry
- [ ] Set follow-up reminder for 3 days

**Automation Triggers:**
- **Create:** When new record added to "Enquiries" SharePoint list
- **Reminder:** 1 hour before 2-hour SLA expires
- **Escalate:** If 24 hours pass with no response, notify Sales Manager
- **Complete:** When quote sent and logged

**Labels/Tags:**
- Survey Required (if applicable)
- High Value (if estimated > £10k)
- Manchester Local (if M-prefix postcode)

---

### 2. Quote Approval

**Workflow Description:** Quote prepared and requires approval before sending to customer

**Planner Task Configuration:**
- **Task Title:** `Approve Quote {quoteNumber} - {customerName} - £{value}`
- **Bucket:** Pending Approvals
- **Owner:** Auto-assigned based on value:
  - < £5k: Self-approve (no task if canSelfApprove)
  - £5k-£10k: Sales Manager
  - £10k-£50k: Sales Manager + Finance Manager
  - > £50k: Sales Manager + Finance Manager + CEO
- **Priority:** High
- **Due Date:** `Creation DateTime + 1 business day`
- **Start Date:** Creation DateTime

**Task Description Template:**
```
📋 QUOTE APPROVAL REQUEST

Quote: {quoteNumber} (Revision {revision})
Customer: {customerName}
Project: {projectName}
Product Type: {productType}
Quote Type: {quoteType}

💰 FINANCIAL DETAILS:
Base Value: £{baseValue}
Markup: {markup}%
Net Value: £{netValue}
VAT (20%): £{vatAmount}
Gross Value: £{grossValue}

🎯 PROJECT DETAILS:
Complexity: {projectComplexity}
Timeline: {estimatedTimelineWeeks} weeks
Survey Required: {requiresSurvey}
Quoted By: {quotedBy}

✅ APPROVAL REQUIREMENTS:
{approvalRequirementsList}

📋 REVIEW CHECKLIST:
See checklist below
```

**Checklist Items:**
- [ ] Review quote value and pricing accuracy
- [ ] Verify markup percentage appropriate for project type
- [ ] Check customer credit status and history
- [ ] Confirm project complexity assessment
- [ ] Review survey requirements and costs
- [ ] Verify technical feasibility
- [ ] Check competitor pricing (if available)
- [ ] **APPROVE** or **REJECT** with detailed notes

**Automation Triggers:**
- **Create:** When quote status = "Pending Approval"
- **Assign:** Route to appropriate approver(s) based on value
- **Reminder:** Daily reminder if pending > 1 day
- **Escalate:** If pending > 3 days, notify next level manager
- **Complete:** When quote approval status = "Approved" or "Rejected"
- **Next Action:** If approved, move to "Send Quote" task

**Labels/Tags:**
- Awaiting First Approval
- Awaiting Second Approval (if dual approval required)
- High Value (> £10k)
- Complex Project
- Self-Approve Eligible (< £5k simple)

---

### 3. Quote to Job Conversion

**Workflow Description:** Quote won, needs conversion to job and customer PO tracking

**Planner Task Configuration:**
- **Task Title:** `Convert Quote {quoteNumber} to Job - Await PO from {customerName}`
- **Bucket:** Active Jobs
- **Owner:** Operations Team
- **Priority:** High
- **Due Date:** `Quote Won Date + 14 days`
- **Start Date:** Quote Won Date

**Task Description Template:**
```
🎉 QUOTE WON - CONVERSION TO JOB

Quote: {quoteNumber} (Revision {revision})
Customer: {customerName}
Project: {projectName}
Value: £{value}
Quote Date: {quoteDate}
Won Date: {wonDate}

⚠️ AWAITING CUSTOMER PO
Due Date: {wonDate + 14 days}
Escalation: {wonDate + 21 days}

📞 CUSTOMER CONTACT:
Contact Name: {contactName}
Email: {email}
Phone: {phone}

📋 CONVERSION STEPS:
See checklist below
```

**Checklist Items:**
- [ ] Verify quote approval status = APPROVED
- [ ] Send "Quote Accepted" confirmation email to customer
- [ ] Request Purchase Order from customer
- [ ] Follow up after 7 days if no PO received
- [ ] Follow up after 14 days (urgent)
- [ ] **Escalate to Sales Manager** if PO not received by day 21
- [ ] Upon PO receipt: Record PO number and date in system
- [ ] Auto-create Job record with job number
- [ ] Link job to original quote
- [ ] Initiate Drawing Approval workflow (auto-create task)
- [ ] Notify Operations and Production teams
- [ ] Close this task and archive

**Automation Triggers:**
- **Create:** When quote status changes to "WON"
- **Reminder:** Day 7, 14 (gentle reminder to customer)
- **Escalate:** Day 21 if no PO received, notify Sales Manager
- **Complete:** When `poReceivedDate` is populated
- **Next Action:** Auto-create "Drawing Approval - Customer Upload" task

**Labels/Tags:**
- Awaiting PO
- PO Received (when applicable)
- Escalated (if day 21 passed)

---

### 4. Drawing Approval - Customer Upload

**Workflow Description:** Customer needs to upload approved drawings for technical review

**Planner Task Configuration:**
- **Task Title:** `Drawing Upload Required - Job {jobNumber} - {customerName}`
- **Bucket:** Customer Actions
- **Owner:** Customer (external) + Sales Rep (facilitator)
- **Priority:** High
- **Due Date:** `Job Creation Date + 7 days`
- **Start Date:** Job Creation Date

**Task Description Template:**
```
📐 DRAWING UPLOAD REQUEST

Job: {jobNumber}
Customer: {customerName}
Project: {projectName}
PO: {orderNumber}
PO Date: {poReceivedDate}

📋 DRAWING REQUIREMENTS:
- Upload approved architectural/technical drawings
- Specify drawing type (Floor Plan, Elevation, Detail, etc.)
- Include version/revision number
- Add any special notes or requirements

⏰ DUE DATE: {jobCreationDate + 7 days}
⚠️ This is the first step in a 16-day drawing approval process

📞 CUSTOMER CONTACT:
{contactName} - {email} - {phone}

📋 UPLOAD PROCESS:
See checklist below
```

**Checklist Items:**
- [ ] Customer notified of drawing upload requirement
- [ ] Reminder sent at day 3 (if no upload)
- [ ] Reminder sent at day 5 (if no upload)
- [ ] Follow-up call at day 7 (if no upload)
- [ ] Drawing file(s) uploaded to portal
- [ ] Drawing type specified
- [ ] Version/revision number recorded
- [ ] Customer notes and requirements captured
- [ ] Automatic progression to "Customer Approval" stage

**Automation Triggers:**
- **Create:** When job created and `poReceivedDate` populated
- **Reminder:** Day 3, 5, 7 if no drawing uploaded
- **Complete:** When drawing file uploaded (status = "UPLOADED")
- **Next Action:** Auto-create "Drawing Approval - Customer Review" task

**Labels/Tags:**
- Awaiting Drawing
- Drawing Uploaded
- Late Upload (> 7 days)

---

### 5. Drawing Approval - Technical Review

**Workflow Description:** Technical team reviews drawing for feasibility and specifications

**Planner Task Configuration:**
- **Task Title:** `Technical Review - Job {jobNumber} - {customerName}`
- **Bucket:** Technical Review
- **Owner:** Technical Team (Tier2) - Auto-assign to next available
- **Priority:** High
- **Due Date:** `Customer Approval Date + 2 days`
- **Start Date:** Customer Approval Date

**Task Description Template:**
```
🔧 TECHNICAL DRAWING REVIEW

Job: {jobNumber}
Customer: {customerName}
Project: {projectName}
Drawing: {drawingName} v{drawingVersion}

📐 CUSTOMER APPROVED: {customerApprovedAt}
📋 AWAITING TECHNICAL REVIEW

⏰ SLA: 2 business days
⚠️ Stage 3 of 7 in drawing approval workflow

🔍 REVIEW REQUIREMENTS:
- Technical feasibility assessment
- Specification verification
- Measurement accuracy check
- Material compatibility review
- Fabrication complexity assessment
- Lead time estimation

📋 REVIEW STEPS:
See checklist below
```

**Checklist Items:**
- [ ] Download and review drawing file
- [ ] Verify technical feasibility of design
- [ ] Check all specifications against standards
- [ ] Verify all measurements and dimensions
- [ ] Assess material requirements and availability
- [ ] Confirm fabrication capability
- [ ] Estimate fabrication complexity and timeline
- [ ] Document any concerns or required clarifications
- [ ] **APPROVE** or **REJECT** with detailed notes
- [ ] If rejected: Specify required changes and return to customer
- [ ] If approved: Progress to Production Review stage

**Automation Triggers:**
- **Create:** When drawing status = "CUSTOMER_APPROVED"
- **Reminder:** Day 1 (halfway through 2-day SLA)
- **Escalate:** If exceeds 2 days, notify Technical Manager
- **Complete:** When `technicalReviewed = true`
- **Next Action:** Auto-create "Drawing Approval - Production Review" task

**Labels/Tags:**
- In Review
- Approved
- Rejected (if applicable)
- Requires Clarification

---

### 6. Materials Analysis and Costing

**Workflow Description:** Production team extracts materials from drawing and calculates costs

**Planner Task Configuration:**
- **Task Title:** `Materials Analysis - Job {jobNumber} - {customerName}`
- **Bucket:** Production Planning
- **Owner:** Production Team (Tier3)
- **Priority:** High
- **Due Date:** `Final Drawing Approval Date + 2 days`
- **Start Date:** Final Drawing Approval Date

**Task Description Template:**
```
📦 MATERIALS ANALYSIS & COSTING

Job: {jobNumber}
Customer: {customerName}
Project: {projectName}
Drawing: {drawingName} v{drawingVersion}

✅ DRAWING FULLY APPROVED: {finalApprovedAt}

📋 ANALYSIS REQUIREMENTS:
- Extract all material requirements from drawing
- Calculate quantities and dimensions
- Match materials to supplier catalog
- Verify stock availability
- Calculate total material costs
- Estimate lead times
- Generate supplier recommendations

⏰ SLA: 2 business days

📋 ANALYSIS STEPS:
See checklist below
```

**Checklist Items:**
- [ ] Review approved drawing and cutting list
- [ ] Extract all material line items (glass, aluminum, hardware, etc.)
- [ ] Calculate precise quantities for each material
- [ ] Verify specifications match drawing requirements
- [ ] Match materials to preferred supplier catalog
- [ ] Check current stock availability
- [ ] Get pricing quotes from suppliers (if not in system)
- [ ] Calculate total materials cost with breakdown
- [ ] Estimate delivery lead times for each item
- [ ] Document supplier recommendations with justification
- [ ] Generate materials analysis report
- [ ] **Submit for approval**
- [ ] Progress to Purchase Order creation

**Automation Triggers:**
- **Create:** When drawing `finalApproved = true`
- **Reminder:** Day 1 (halfway through SLA)
- **Escalate:** If exceeds 2 days, notify Production Manager
- **Complete:** When `materialsExtracted = true` and `costAnalyzed = true`
- **Next Action:** Auto-create "Purchase Order Creation" task(s) for each supplier

**Labels/Tags:**
- Analysis In Progress
- Awaiting Supplier Quotes
- Analysis Complete
- High Material Cost (> £5k)

---

### 7. Purchase Order Creation and Submission

**Workflow Description:** Operations creates purchase orders from materials analysis

**Planner Task Configuration:**
- **Task Title:** `Create Purchase Order - Job {jobNumber} - {supplierName}`
- **Bucket:** Procurement
- **Owner:** Operations Team (Tier1/3)
- **Priority:** Medium-High (High if urgent project)
- **Due Date:** `Materials Analysis Complete Date + 1 day`
- **Start Date:** Materials Analysis Complete Date

**Task Description Template:**
```
📝 PURCHASE ORDER CREATION

Job: {jobNumber}
Customer: {customerName}
Supplier: {supplierName}

📊 MATERIALS ANALYSIS COMPLETE
Analysis ID: {analysisId}
Total Materials Cost: £{totalMaterialsCost}
Estimated Lead Time: {estimatedLeadTime} days

📋 ORDER DETAILS:
- Generate PO number: Auto (PO{year}-{sequence})
- Select order items from analysis
- Verify supplier details and contact
- Calculate order totals (subtotal, VAT, total)
- Set required delivery date
- Add delivery instructions

⚠️ APPROVAL REQUIRED:
{approvalRequirementBasedOnValue}

📋 ORDER CREATION STEPS:
See checklist below
```

**Checklist Items:**
- [ ] Review materials analysis and approved items
- [ ] Verify supplier is active and preferred
- [ ] Generate unique PO number
- [ ] Add all order items with quantities and specs
- [ ] Verify unit prices against supplier catalog
- [ ] Calculate subtotal, VAT (20%), and total
- [ ] Set required delivery date (based on job timeline)
- [ ] Add delivery address (if not standard)
- [ ] Add special delivery instructions (if any)
- [ ] Save PO in DRAFT status
- [ ] **Submit for approval** (auto-route based on value)
- [ ] If < £100: Single approval
- [ ] If £100-£500: Ops + Finance approval
- [ ] If > £500: Finance team mandatory approval

**Automation Triggers:**
- **Create:** When materials analysis approved
- **Complete:** When PO status = "SUBMITTED_FOR_APPROVAL"
- **Next Action:** Auto-create "Purchase Order Approval" task(s)

**Labels/Tags:**
- Draft PO
- Submitted for Approval
- Urgent Order (if job priority = HIGH)

---

### 8. Purchase Order Approval

**Workflow Description:** PO requires approval based on value thresholds before sending to supplier

**Planner Task Configuration:**
- **Task Title:** `Approve PO {orderNumber} - {supplierName} - £{orderValue}`
- **Bucket:** Pending Approvals
- **Owner:** Auto-assigned based on value:
  - < £100: Any Operations staff
  - £100-£500: First approval (Ops), Second approval (Finance)
  - > £500: Finance Team (mandatory)
- **Priority:** High
- **Due Date:** `PO Submission Date + 1 business day`
- **Start Date:** PO Submission Date

**Task Description Template:**
```
✅ PURCHASE ORDER APPROVAL

PO Number: {orderNumber}
Job: {jobNumber}
Customer: {customerName}
Supplier: {supplierName}

💰 ORDER VALUE: £{orderValue}

📋 ORDER DETAILS:
Order Date: {orderDate}
Required Date: {requiredDate}
Delivery Address: {deliveryAddress}
Payment Terms: {paymentTerms}

📦 ORDER ITEMS:
{itemizedListWithPrices}

💰 COST BREAKDOWN:
Subtotal: £{subtotal}
VAT (20%): £{vatAmount}
**TOTAL: £{totalAmount}**

✅ APPROVAL REQUIREMENTS:
{approvalRequirementsList}

⚠️ APPROVAL RULES:
- Under £100: Single approval (can auto-approve)
- £100-£500: Two approvals required (Ops + Finance)
- Over £500: Finance team mandatory approval

📋 APPROVAL STEPS:
See checklist below
```

**Checklist Items:**
- [ ] Review PO value and verify calculations
- [ ] Verify supplier details and payment terms
- [ ] Check order items match materials analysis
- [ ] Verify required delivery date is realistic
- [ ] Confirm budget availability for this job
- [ ] Review supplier performance history (if available)
- [ ] **First Approval** (Operations) - if value >= £100
- [ ] **Second Approval** (Finance) - if value >= £100
- [ ] **Override Approval** - if value < £100 (single approval only)
- [ ] Auto-send email to supplier after full approval
- [ ] Update PO status to "SENT_TO_SUPPLIER"
- [ ] Create MS Teams notification confirming approval
- [ ] Close approval task

**Automation Triggers:**
- **Create:** When PO `requiresApproval = true` and status = "SUBMITTED"
- **Assign:** Auto-route based on order value thresholds
- **Reminder:** Daily if pending > 1 day
- **Escalate:** If pending > 2 days, notify Finance Manager
- **Complete:** When `approved = true`
- **Next Action:** Auto-send supplier email, create activity log

**Labels/Tags:**
- Awaiting First Approval
- Awaiting Second Approval (if applicable)
- Finance Approval Required (if > £500)
- Approved & Sent

---

### 9. Fabrication Workflow Execution

**Workflow Description:** Production team fabricates the job based on approved drawings and materials

**Planner Task Configuration:**
- **Task Title:** `Fabricate Job {jobNumber} - {customerName}`
- **Bucket:** Fabrication
- **Owner:** Lead Fabricator (assigned)
- **Priority:** Based on job priority (HIGH/MEDIUM/LOW)
- **Due Date:** `Fabrication Start Date + {estimatedDays} days`
- **Start Date:** Fabrication Start Date (when materials received)

**Task Description Template:**
```
🔨 FABRICATION WORKFLOW

Job: {jobNumber}
Customer: {customerName}
Project: {projectName}

📋 JOB DETAILS:
Product Type: {productType}
Estimated Days: {estimatedDays}
Lead Fabricator: {leadFabricatorName}
Helper Assigned: {helperAssigned}

📐 DRAWING: {drawingName} v{drawingVersion}
📦 MATERIALS: All materials received and verified

🔧 FABRICATION STAGES:
1. Drawing Review & Cutting List
2. Material Cutting
3. Component Preparation
4. Powder Coating (if required)
5. Assembly
6. Quality Check
7. Prepare for Installation

⏰ ESTIMATED HOURS:
Without Helper: {estimatedHours} hours
With Helper: {estimatedHoursWithHelper} hours
Current Assignment: {assignmentType}

📋 FABRICATION STEPS:
See checklist below
```

**Checklist Items:**
- [ ] **Stage 1: Review drawings and cutting list** (Verify all dimensions)
- [ ] **Stage 2: Cut materials** (Cut glass, aluminum, frames)
- [ ] **Stage 3: Prepare components** (Clean, deburr, prep surfaces)
- [ ] **Stage 4: Powder coating** (If required, requires 2 operatives)
- [ ] **Stage 5: Assembly** (Assemble all components)
- [ ] **Stage 6: Quality check** (Primary checker + Secondary checker)
- [ ] Verify all dimensions match drawing
- [ ] Check glass quality and edges
- [ ] Test all moving parts (if applicable)
- [ ] Verify powder coating quality (if applicable)
- [ ] **Stage 7: Prepare for installation** (Package, label, load)
- [ ] Document any issues or deviations
- [ ] **Mark fabrication complete**
- [ ] Notify Installation Manager
- [ ] Progress to Installation Scheduling

**Automation Triggers:**
- **Create:** When all materials received and job status = "FABRICATION"
- **Assign:** Auto-assign to Lead Fabricator from schedule
- **Reminder:** Daily progress update required
- **Complete:** When all stages marked complete and quality checked
- **Next Action:** Auto-create "Installation Scheduling" task

**Labels/Tags:**
- In Fabrication
- Quality Check Pending
- Quality Check Passed/Failed
- Fabrication Complete
- Urgent Job (if priority = HIGH)

---

### 10. Installation Scheduling and Execution

**Workflow Description:** Schedule and execute final installation at customer site

**Planner Task Configuration:**
- **Task Title:** `Schedule & Install - Job {jobNumber} - {customerName}`
- **Bucket:** Installation Planning
- **Owner:** Installation Manager
- **Priority:** Based on job priority + customer urgency
- **Due Date:** `Fabrication Complete Date + 7 days`
- **Start Date:** Fabrication Complete Date

**Task Description Template:**
```
🚚 INSTALLATION SCHEDULING

Job: {jobNumber}
Customer: {customerName}
Site Address: {installationAddress}
Distance from Base: {distanceFromBase} miles

📋 JOB DETAILS:
Product Type: {productType}
Fabrication Complete: {fabricationCompletedDate}
Estimated Installation Time: {installationTime} hours

⚖️ GLASS WEIGHT & STAFFING:
Total Glass Weight: {totalGlassWeight} kg
Max Panel Weight: {maxPanelWeight} kg
Recommended Staff: {recommendedStaff}
Requires Mechanical Aid: {requiresMechanicalAid}
{mechanicalAidType}

📋 SAFETY REQUIREMENTS:
Lifting Method: {liftingMethod}
Labor Complexity: {laborComplexity}
Safety Alerts: {safetyAlerts}
Access Requirements: {accessRequirements}

📋 INSTALLATION STEPS:
See checklist below
```

**Checklist Items:**
- [ ] **Coordinate with customer** for installation date/time
- [ ] **Assign installation team** (based on glass weight and complexity)
- [ ] **Assign van** (based on product size and team)
- [ ] **Schedule date** (confirm with customer)
- [ ] **Confirm access requirements** (parking, site access, keys)
- [ ] **Safety briefing** for installation team
- [ ] Verify mechanical aids available (if required)
- [ ] Load van with fabricated product
- [ ] Conduct pre-departure safety check
- [ ] **Travel to site**
- [ ] **Execute installation** (follow safety protocols)
- [ ] Conduct on-site quality check
- [ ] **Customer sign-off** (completion certificate)
- [ ] Clean up and site restoration
- [ ] Return to base
- [ ] **Mark job complete**
- [ ] Create completion report
- [ ] Archive job

**Automation Triggers:**
- **Create:** When fabrication complete and quality passed
- **Reminder:** 3 days before scheduled installation
- **Complete:** When installation complete and customer signed off
- **Next Action:** Move to "Quality & Completion" bucket for final review

**Labels/Tags:**
- Awaiting Schedule
- Scheduled (with date)
- In Progress (during installation)
- Complete - Pending Sign-Off
- Complete - Signed Off
- High Complexity Installation
- Mechanical Aid Required

---

## Planner Automation Rules Summary

### Auto-Create Tasks
1. New Enquiry → Create "Respond to Enquiry" task (Bucket: Sales Pipeline)
2. Quote Pending Approval → Create "Approve Quote" task (Bucket: Pending Approvals)
3. Quote Won → Create "Convert to Job" task (Bucket: Active Jobs)
4. Job Created → Create "Drawing Upload" task (Bucket: Customer Actions)
5. Drawing Approved → Create "Technical Review" task (Bucket: Technical Review)
6. Drawing Final Approved → Create "Materials Analysis" task (Bucket: Production Planning)
7. Materials Analysis Complete → Create "Create PO" task (Bucket: Procurement)
8. PO Submitted → Create "Approve PO" task (Bucket: Pending Approvals)
9. Materials Received → Create "Fabrication" task (Bucket: Fabrication)
10. Fabrication Complete → Create "Installation" task (Bucket: Installation Planning)

### Auto-Assign Tasks
- **Value-based routing** for Quote and PO approvals
- **Role-based assignment** for Technical, Production, Fabrication teams
- **Workload balancing** for Sales and Installation teams (next available)

### Auto-Calculate Due Dates
- Enquiry Response: Creation + 2 hours
- Quote Approval: Creation + 1 day
- Job Conversion: Won Date + 14 days
- Drawing Upload: Job Created + 7 days
- Technical Review: Customer Approval + 2 days
- Materials Analysis: Drawing Approved + 2 days
- PO Approval: Submission + 1 day
- Fabrication: Materials Received + Estimated Days
- Installation: Fabrication Complete + 7 days

### Auto-Send Reminders
- **50% of SLA elapsed**: Gentle reminder
- **75% of SLA elapsed**: Urgent reminder
- **100% of SLA elapsed**: Escalation to manager

### Auto-Escalate
- Enquiry no response after 24 hours → Sales Manager
- Quote approval pending > 3 days → Next level manager
- PO approval pending > 2 days → Finance Manager
- Drawing stage exceeds SLA by 50% → Project Manager
- Job PO not received after 21 days → Sales Manager

---

## Integration with SharePoint

### Data Flow: SharePoint ↔ Planner

#### New Enquiry
1. Record added to **"Enquiries" SharePoint list**
2. **Power Automate** triggers
3. Create task in **Planner** (Bucket: Sales Pipeline)
4. Assign to Sales Team member (round-robin)
5. Set due date (Creation + 2 hours)
6. Populate task description with enquiry details

#### Quote Approval
1. Quote status in **"Quotes" list** changes to "Pending Approval"
2. **Power Automate** evaluates quote value
3. Create task in **Planner** (Bucket: Pending Approvals)
4. Assign to appropriate approver(s) based on value threshold
5. Set due date (Creation + 1 day)
6. Populate task with quote financials (Tier1/Tier2 only)

#### Job Conversion
1. Quote status in **"Quotes" list** changes to "WON"
2. **Power Automate** creates new record in **"Jobs" list**
3. Auto-generate job number (J{year}-{sequence})
4. Link job to original quote
5. Create task in **Planner** (Bucket: Active Jobs)
6. Set due date (Won Date + 14 days for PO)
7. Monitor for PO received date update

#### PO Approval
1. Record added to **"Supplier Orders" list** with status "SUBMITTED"
2. **Power Automate** evaluates order value
3. Create task in **Planner** (Bucket: Pending Approvals)
4. Route to appropriate approver(s) based on value thresholds
5. Upon approval: Update SharePoint record, send supplier email
6. Complete Planner task

### Bi-Directional Sync
- **Task completion in Planner** → Update status in SharePoint list
- **Status change in SharePoint** → Update task progress in Planner
- **Comments in Planner** → Sync to SharePoint "Notes" field
- **Checklist progress** → Update SharePoint workflow columns

---

## Labels and Tags Strategy

### Priority Labels
- 🔴 **Urgent** - SLA expiring within 4 hours
- 🟠 **High Priority** - Customer critical or high-value job
- 🟡 **Medium Priority** - Standard workflow
- 🟢 **Low Priority** - Non-urgent tasks

### Status Labels
- 📋 **Pending** - Awaiting action
- 🔄 **In Progress** - Currently being worked on
- ✅ **Complete** - Finished and verified
- ❌ **Blocked** - Waiting on external dependency
- ⚠️ **Escalated** - Requires management attention

### Category Labels
- 💰 **High Value** - Quote/Job > £10k
- 🏠 **Manchester Local** - M-prefix postcode
- 🔧 **Complex** - High fabrication complexity
- 🚨 **Safety Critical** - Heavy glass or mechanical aid required
- 📐 **Awaiting Drawing** - Customer action required
- 💵 **Awaiting PO** - Customer PO not yet received

---

## Reporting and Dashboards

### Key Metrics to Track (via Power BI or Planner Analytics)
1. **Average Time to Complete by Bucket** (identify bottlenecks)
2. **Tasks by Due Date** (upcoming deadlines)
3. **Tasks by Owner** (workload balancing)
4. **Overdue Tasks by SLA** (compliance monitoring)
5. **Escalated Tasks** (management attention required)
6. **Completed Tasks by Week** (productivity trends)

### Weekly Status Report Template
```
📊 SFG NEXUS WEEKLY STATUS REPORT

Week Ending: {date}

📋 TASKS BY BUCKET:
- Sales Pipeline: {count} tasks
- Pending Approvals: {count} tasks
- Customer Actions: {count} tasks
- Technical Review: {count} tasks
- Production Planning: {count} tasks
- Procurement: {count} tasks
- Fabrication: {count} tasks
- Installation Planning: {count} tasks
- Completed: {count} tasks

⚠️ OVERDUE TASKS:
{list of overdue tasks with owners and days overdue}

🚨 ESCALATED TASKS:
{list of escalated tasks requiring management attention}

📈 COMPLETION RATE:
Total Created: {count}
Total Completed: {count}
Completion Rate: {percentage}%

🎯 TOP BOTTLENECKS:
{identify buckets with longest average completion time}

💡 RECOMMENDATIONS:
{actionable insights based on data}
```

---

## Next Steps

1. **Create "SFG Operations Hub" Plan** in Microsoft Planner
2. **Configure 10 Buckets** as specified above
3. **Build Power Automate Flows** for auto-task creation
4. **Configure SharePoint List Triggers** for workflow automation
5. **Set Up MS Teams Integration** for Planner notifications
6. **Train Team Members** on Planner task management
7. **Monitor and Adjust** bucket structure and automation rules
8. **Generate Weekly Reports** to identify bottlenecks
9. **Optimize Workflows** based on actual performance data

---

**Document Version:** 1.0  
**Last Updated:** 5 October 2025  
**Next Review:** After 2 weeks of live usage
