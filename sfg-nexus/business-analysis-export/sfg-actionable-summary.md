
# SFG NEXUS - Actionable Business Rules Summary

**Date:** 5 October 2025  
**Analyst:** Senior Business Systems Analyst  
**Company:** SFG Aluminium (UK) Ltd

---

## Critical Business Rules for Immediate Implementation

### 1. Purchase Order Approval Thresholds ⚠️ **HIGH PRIORITY**

#### Rule Definition
Purchase orders require different approval levels based on value:

- **Under £100**: Single approval (Operations), can auto-approve
- **£100 - £500**: Two approvals required (Operations + Finance)
- **Over £500**: Finance team mandatory approval (2 approvals)

#### Implementation Requirements
- ✅ **SharePoint**: Create "Purchase Order Approvals" list with calculated approval routing
- ✅ **Planner**: Task assigned based on order value threshold
- ✅ **Automation**: Auto-send email to supplier after full approval
- ✅ **MS Teams**: Notification at each approval milestone

#### Validation Points
- Order value calculated automatically
- `requiresTwoApprovals` flag set based on value
- `canAutoApprove` = true only if value < £100
- Email sent only after `approved = true`

---

### 2. Enquiry Response SLA ⚠️ **HIGH PRIORITY**

#### Rule Definition
All enquiries must be acknowledged and responded to within strict timeframes:

- **Initial Response**: 2 hours (business hours)
- **Full Assessment**: 24 hours (business hours)
- **Quote Delivery**: 7 days (business days)
- **Follow-up**: 3 days after quote sent

#### Implementation Requirements
- ✅ **SharePoint**: "Enquiries" list with calculated SLA columns
- ✅ **Power Automate**: Automatic reminders when SLA approaching
- ✅ **Planner**: Bucket = "Sales Pipeline", Due date auto-calculated
- ✅ **Escalation**: Notify Sales Manager if 24-hour response missed

#### Monitoring
- Daily SLA compliance dashboard
- Red/amber/green status indicators
- Automated escalation emails

---

### 3. Drawing Approval Workflow ⚠️ **HIGH PRIORITY**

#### Rule Definition
7-stage sequential approval process:

1. **Customer Upload** (7 days SLA)
2. **Customer Approval** (3 days SLA)
3. **Technical Review** (2 days SLA) - Tier2 Team
4. **Production Review** (1 day SLA) - Tier3 Team
5. **Cutting List Verification** (1 day SLA)
6. **Glass Sizes Verification** (1 day SLA)
7. **Final Approval** (1 day SLA)

**Total SLA: 16 days**

#### Implementation Requirements
- ✅ **SharePoint**: "Drawing Approvals" list with status workflow
- ✅ **Planner**: Separate task for each approval stage
- ✅ **Power Automate**: Auto-progress to next stage on approval
- ✅ **Version Control**: Track all drawing revisions
- ✅ **Rejection Handling**: Return to previous stage, maintain version history

#### Escalation Rules
- If any stage exceeds SLA by 50% → Notify Project Manager
- If Customer Approval > 7 days → Send reminder email
- If Technical Review > 2 days → Escalate to Technical Manager

---

### 4. Quote to Job Conversion Timeline ⚠️ **MEDIUM PRIORITY**

#### Rule Definition
When quote status changes to "WON":

- Job automatically created with inherited quote details
- Customer PO expected within **14 days**
- Escalate to Sales Manager if PO not received within **21 days**
- Drawing approval workflow initiated automatically

#### Implementation Requirements
- ✅ **SharePoint**: Status change trigger in "Quotes" list
- ✅ **Power Automate**: Auto-create job record in "Jobs" list
- ✅ **Planner**: Task created in "Active Jobs" bucket
- ✅ **Due Date**: Set to +14 days from quote WON date
- ✅ **Reminder**: At day 14 and escalation at day 21

#### Workflow Steps
1. Verify quote approval status = APPROVED
2. Create job record (auto-generate job number)
3. Set job status = "AWAITING_PO"
4. Create Planner task for PO follow-up
5. On PO received: Update `poReceivedDate`, initiate drawing workflow

---

### 5. Survey Costing Calculation ⚠️ **MEDIUM PRIORITY**

#### Rule Definition
Survey costs calculated based on distance from Manchester base (M12 5PG):

- **Formula**: `max(distance_miles × £1.00, £50.00)`
- **Exception**: FREE for Manchester area (M-prefix postcodes) if quote value < £2,000
- **Unknown Postcodes**: Default to 50 miles / £50

#### Implementation Requirements
- ✅ **SharePoint**: Calculated column in "Quotes" list
- ✅ **Power Automate**: Call distance calculation API
- ✅ **Display**: Show breakdown in quote form
- ✅ **Override**: Allow manual override with justification

#### Calculation Variables
- `cost_per_mile = £1.00`
- `minimum_charge = £50.00`
- `free_threshold_value = £2,000`
- `base_postcode = "M12 5PG"`

---

### 6. Role-Based Access Control (RBAC) - Financial Fields ⚠️ **HIGH PRIORITY**

#### Rule Definition
Financial fields visible only to Tier1 (Executive/Operations) and Tier2 (Finance/Estimating):

**Restricted Fields:**
- Quote: `value`, `revisedPrice`, `markup`, `markupAmount`, `netValue`, `grossValue`, `baseValue`
- Job: `value`
- Supplier Order: `orderValue`, `totalAmount`, `subtotal`

**Tier3 (Sales/Production/Delivery)** can see:
- Quote: `quoteNumber`, `customerName`, `projectName`, `status`, `quoteDate`
- Job: `jobNumber`, `client`, `description`, `status`, `drawingStatus`
- Supplier Order: `orderNumber`, `supplier`, `status`, `orderDate`

#### Implementation Requirements
- ✅ **SharePoint**: Column-level permissions on all financial fields
- ✅ **Power Apps**: Conditional visibility based on user security tier
- ✅ **Reports**: Separate views for each tier
- ✅ **Audit**: Log all financial field access attempts

---

## Priority Implementation Order

### Phase 1: Immediate (Week 1)
1. **Purchase Order Approval Thresholds** - Critical for operations
2. **RBAC Setup** - Protect financial data immediately
3. **Enquiry Response SLA** - Customer-facing priority

### Phase 2: Short-term (Week 2-3)
4. **Drawing Approval Workflow** - Complex but essential
5. **Quote to Job Conversion** - Business continuity

### Phase 3: Medium-term (Week 4-6)
6. **Survey Costing Calculation** - Automation efficiency
7. **MS Teams Integration** - Notification system
8. **Automated Email Templates** - Customer/supplier communication

---

## SharePoint List Configuration Summary

### Required Lists
1. **Enquiries** - With SLA calculations and status workflow
2. **Quotes** - With approval status, financial fields (restricted), revision tracking
3. **Jobs** - With workflow status tracking, PO received date
4. **Purchase Orders** - With approval routing, value thresholds
5. **Drawing Approvals** - With 7-stage workflow, version control
6. **Customers** - With credit status, validation tracking
7. **Suppliers** - With performance ratings, contact details

### Key Calculated Columns
- `SLA Status` (Red/Amber/Green based on time elapsed)
- `Approval Required` (based on value thresholds)
- `Days Since Creation` (for aging reports)
- `Next Action` (based on current status)
- `Assigned To` (based on role and value thresholds)

---

## Microsoft Planner Configuration

### Recommended Buckets
1. **Sales Pipeline** - New enquiries and quotes
2. **Pending Approvals** - Quotes, jobs, POs awaiting approval
3. **Customer Actions** - Items waiting for customer input
4. **Technical Review** - Drawing and specification reviews
5. **Production Planning** - Materials analysis, fabrication scheduling
6. **Procurement** - Purchase order creation and management
7. **Fabrication** - Active fabrication work
8. **Installation Planning** - Scheduling and resource allocation
9. **Completed** - Archive for closed tasks

### Automation Rules
- Auto-create task when new enquiry/quote/job/PO created
- Auto-assign based on value threshold and role
- Auto-calculate due dates based on SLA
- Auto-move to next bucket on status change
- Auto-complete when parent record status = "COMPLETE"

---

## Power Automate Flows Required

### Critical Flows (Must Have)
1. **New Enquiry → Create Planner Task** (Due: +2 hours)
2. **Quote Won → Create Job + Planner Task** (Due: +14 days for PO)
3. **PO Created → Route for Approval** (Based on value threshold)
4. **PO Approved → Send Email to Supplier** (Auto-send)
5. **Drawing Stage Change → Notify Next Approver** (Sequential workflow)
6. **SLA Approaching → Send Reminder** (Daily check)
7. **SLA Exceeded → Escalate to Manager** (Real-time)

### Supporting Flows (Should Have)
8. **Customer PO Received → Update Job, Start Drawing Workflow**
9. **Drawing Approved → Create Materials Analysis Task**
10. **Materials Analysis Complete → Create PO Task**
11. **Fabrication Complete → Create Installation Task**
12. **Quote Revision → Update Quote Number, Reset Approval**

---

## MS Teams Notifications

### Notification Triggers
- Quote approval required (Sales channel)
- Job created from won quote (Operations channel)
- Purchase order approval (Finance channel)
- Drawing approval stage change (Technical channel)
- Customer PO received (All channels)
- Critical SLA deadline approaching (Management channel)
- High-value order requires approval (Finance + Management channels)

### Notification Format
```
**Title:** Quote Approval Required
**Message:** Quote Q2025-0123 for Customer ABC Ltd requires approval.
**Value:** £12,500 (requires 2 approvals)
**Assigned To:** Sales Manager, Finance Manager
**Due:** Tomorrow 4:00 PM
**Action:** [Approve] [Reject] [View Details]
```

---

## Key Performance Indicators (KPIs)

### Operational KPIs
- Enquiry response time (Target: < 2 hours)
- Quote delivery time (Target: < 7 days)
- Quote-to-job conversion rate (Target: > 30%)
- PO approval cycle time (Target: < 24 hours)
- Drawing approval cycle time (Target: < 16 days)

### Financial KPIs
- Average quote value
- Average job value
- Quote win rate
- On-time PO delivery rate
- Average markup by quote type

### Quality KPIs
- Drawing revision count (Target: < 2 per job)
- Customer approval first-time-through rate
- Quality check pass rate
- Installation completion on-time rate

---

## Exception Handling Rules

### Manchester Free Survey Exception
- **Condition:** Postcode starts with 'M' AND quote value < £2,000
- **Action:** Set `surveyIsFree = true`, `surveyTravelCost = £0`
- **Display:** Show "Free Survey - Manchester Local Project" on quote

### Small Order Auto-Approve
- **Condition:** Order value < £100
- **Action:** Set `canAutoApprove = true`, require single approval only
- **Override:** Allow Operations staff to override approval

### Self-Approval for Simple Quotes
- **Condition:** `value < £5,000` AND `projectComplexity = 'SIMPLE'`
- **Action:** Set `canSelfApprove = true`, skip approval workflow
- **Audit:** Log all self-approved quotes for review

---

## Data Validation Rules

### Quote Validation
- Quote number must be unique and follow format `Q{year}-{sequence}`
- Value must be > 0
- Customer name required
- If `requiresSurvey = true`, must have survey date or "Pending" status
- If status = "WON", must have `poReceivedDate` within 14 days

### Job Validation
- Job number must be unique and follow format `J{year}-{sequence}`
- Must link to approved quote (if converted from quote)
- `poReceivedDate` required before fabrication can start
- All drawing approval stages must complete before materials analysis

### Purchase Order Validation
- Order number must be unique and follow format `PO{year}-{sequence}`
- Order value must be > 0
- Supplier must be active
- If `orderValue >= £100`, must have `requiresTwoApprovals = true`
- Cannot send to supplier unless `approved = true`

---

## Audit and Compliance

### Required Audit Trails
- All approval actions (who, when, decision, notes)
- All financial field access (Tier3 must not see values)
- All self-approved quotes (for management review)
- All PO value overrides (if different from calculated value)
- All SLA breaches (with reason codes)

### Compliance Checks
- Daily SLA compliance report
- Weekly approval authority compliance check
- Monthly quote win rate by estimator
- Quarterly customer credit status review

---

## Questions Requiring Clarification

### High Priority
1. **Quote Markup Percentages**: What is the target margin for each quote type?
2. **CEO Approval Threshold**: At what value does CEO approval become mandatory?
3. **Quality Check Criteria**: What are the specific pass/fail criteria for each fabrication stage?

### Medium Priority
4. **Regional Survey Pricing**: Are there different pricing models beyond Manchester exception?
5. **Late Payment Handling**: What are the interest calculations and enforcement procedures?
6. **Warranty Assessment**: What triggers warranty risk assessment in quotes?

### Low Priority
7. **Drawing Revision Limits**: Is there a maximum number of revisions before escalation?
8. **Supplier Performance**: How are supplier ratings calculated and updated?
9. **Installation Staffing**: What is the formula for determining staff requirements?

---

## Next Steps

1. **Review and Validate** this summary with SFG stakeholders
2. **Clarify Unknowns** listed above
3. **Create SharePoint Lists** with proper columns and permissions
4. **Build Power Automate Flows** starting with critical flows
5. **Configure Planner** with buckets and automation
6. **Set Up MS Teams** channels and notification webhooks
7. **Test End-to-End** with sample data
8. **Train Users** on new processes and systems
9. **Go Live** with phased rollout
10. **Monitor KPIs** and adjust rules as needed

---

**Document Version:** 1.0  
**Last Updated:** 5 October 2025  
**Next Review:** After stakeholder validation
