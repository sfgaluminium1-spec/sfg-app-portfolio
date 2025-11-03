
# SFG NEXUS - Gaps and Questions for Clarification

**Date:** 5 October 2025  
**Analyst:** Senior Business Systems Analyst  
**Company:** SFG Aluminium (UK) Ltd

---

## Purpose

This document identifies business rules, calculations, and workflows that require clarification from SFG stakeholders to ensure accurate implementation of the NEXUS system and associated SharePoint/Planner automation.

---

## Classification System

**Priority Levels:**
- 🔴 **CRITICAL** - Blocks implementation or causes incorrect financial calculations
- 🟠 **HIGH** - Impacts daily operations or customer experience
- 🟡 **MEDIUM** - Improves efficiency but workarounds exist
- 🟢 **LOW** - Nice-to-have clarification for future optimization

**Impact Areas:**
- 💰 **Financial** - Affects pricing, margins, or financial reporting
- 🔧 **Operational** - Impacts day-to-day workflow efficiency
- 📊 **Reporting** - Affects KPIs and management visibility
- 🧑‍🤝‍🧑 **Customer** - Directly impacts customer experience
- ⚖️ **Compliance** - Regulatory or legal implications

---

## Unknowns and Gaps Requiring Clarification

### 1. Quote Markup Calculation Rules
**Priority:** 🔴 **CRITICAL**  
**Impact Area:** 💰 **Financial**

#### Current Understanding
The system has fields for `markup`, `markupAmount`, `baseValue`, and `netValue`, but specific calculation rules are not defined in code.

#### Questions
1. **What is the target margin percentage for each quote type?**
   - Supply & Install: ?%
   - Supply Only: ?%
   - Remedial: ?%
   - Survey: ?%
   - Maintenance: ?%

2. **How should risk markup be calculated?**
   - Is it a fixed percentage or variable based on factors?
   - What factors increase risk markup? (projectComplexity, productType, etc.)
   - Are there minimum/maximum markup thresholds?

3. **Are there markup rules based on project value?**
   - Lower value projects: higher % margin?
   - Higher value projects: lower % margin but higher absolute value?

4. **How should markup for buy-in items be handled?**
   - Same markup as fabricated items?
   - Separate markup rules?
   - Field: `buyInItemsMarkup` exists but calculation not defined

#### Impact of Not Clarifying
- **CRITICAL**: Incorrect pricing leads to lost margins or uncompetitive quotes
- Risk of inconsistent pricing across estimators
- Difficulty auditing quote profitability

#### Recommended Approach
Define a **Quote Type Rule Table** in SharePoint:
```
Quote Type | Base Markup % | Min Markup % | Max Markup % | Risk Adjustment %
-----------|---------------|--------------|--------------|-------------------
Supply & Install | 25% | 20% | 35% | +0-10%
Supply Only | 15% | 10% | 25% | +0-5%
Remedial | 30% | 25% | 40% | +10% (fixed)
```

---

### 2. CEO Approval Threshold
**Priority:** 🟠 **HIGH**  
**Impact Area:** 💰 **Financial** + 🔧 **Operational**

#### Current Understanding
Approval thresholds identified for < £5k, £5k-£10k, £10k-£50k, but CEO approval threshold not explicitly defined.

#### Questions
1. **At what quote/job value does CEO approval become mandatory?**
   - Suggested: £50,000+
   - Or different threshold (e.g., £25k, £75k, £100k)?

2. **Does CEO approval apply to:**
   - Quotes only?
   - Jobs only?
   - Both quotes and jobs?
   - Purchase orders above a certain value?

3. **Can CEO approval be overridden in emergency situations?**
   - If yes, by whom?
   - What is the emergency approval process?

4. **What happens if CEO is unavailable?**
   - Designated alternate approver?
   - Maximum wait time before escalation?

#### Impact of Not Clarifying
- **HIGH**: Risk of processing high-value transactions without proper oversight
- Inconsistent approval routing for large projects
- Potential compliance issues

#### Recommended Approach
Define in **Approval Workflow Table**:
```
Approval Tier | Value Range | Approvers | Approval Count | Override Allowed
--------------|-------------|-----------|----------------|------------------
Tier 4 | £50,000+ | Sales Mgr + Finance Mgr + CEO | 3 | No (except CEO)
```

---

### 3. Survey Pricing - Regional Variations
**Priority:** 🟡 **MEDIUM**  
**Impact Area:** 💰 **Financial** + 🧑‍🤝‍🧑 **Customer**

#### Current Understanding
Current rule: £1/mile with £50 minimum, FREE for Manchester area (M-prefix) if quote < £2k.

#### Questions
1. **Are there different pricing models for different regions?**
   - London/South East: higher rate?
   - Scotland/Wales: different calculation?
   - Northern England: standard rate?

2. **Should there be a maximum survey charge cap?**
   - E.g., maximum £200 for surveys over 200 miles?
   - Or charge full calculated amount regardless of distance?

3. **Are there volume discounts?**
   - Multiple surveys for same customer in short timeframe?
   - Large project with multiple site visits?

4. **How to handle overnight stays for distant surveys?**
   - Add accommodation costs?
   - Fixed daily allowance?
   - Pass through at cost?

5. **What about survey complexity?**
   - Simple site survey: standard rate
   - Complex technical survey: higher rate?
   - Multi-day survey: daily rate?

#### Impact of Not Clarifying
- **MEDIUM**: Inconsistent survey pricing across regions
- Potential revenue loss on long-distance surveys
- Customer confusion about survey charges

#### Recommended Approach
Create **Survey Pricing Matrix**:
```
Region | Cost per Mile | Minimum Charge | Free Threshold | Max Charge
-------|---------------|----------------|----------------|------------
Manchester (M) | £1.00 | £50 | £2,000 | £150
Greater NW (L, BB, PR, BL) | £1.00 | £50 | N/A | £150
Midlands (B, NG, DE) | £1.25 | £75 | N/A | £200
South (London) | £1.50 | £100 | N/A | £250
```

---

### 4. Late Payment Interest and Enforcement
**Priority:** 🟡 **MEDIUM**  
**Impact Area:** 💰 **Financial** + ⚖️ **Compliance**

#### Current Understanding
System has `creditStatus` field (GOOD, WATCH, HOLD, BAD) and `creditTerms` (default 30 days), but no late payment calculation rules.

#### Questions
1. **What interest rate applies to late payments?**
   - UK statutory rate (8% + Bank of England base rate)?
   - Fixed rate (e.g., 2% per month)?
   - No interest charged?

2. **When does creditStatus change?**
   - GOOD → WATCH: Payment overdue by X days?
   - WATCH → HOLD: Payment overdue by X days?
   - HOLD → BAD: Payment overdue by X days?

3. **What actions are triggered by creditStatus changes?**
   - WATCH: Send reminder email?
   - HOLD: Stop accepting new orders?
   - BAD: Initiate debt collection?

4. **How to handle partial payments?**
   - Apply to oldest invoice first?
   - Pro-rata across all outstanding invoices?
   - Customer chooses which invoice to pay?

5. **What is the write-off policy?**
   - After how many days is a debt considered unrecoverable?
   - Who approves write-offs?
   - Are there debt recovery procedures before write-off?

#### Impact of Not Clarifying
- **MEDIUM**: Revenue loss due to poor credit management
- Legal compliance risk (Late Payment legislation)
- Inconsistent customer credit terms

#### Recommended Approach
Define **Credit Management Policy**:
```
Status | Trigger | Action | Approval Required
-------|---------|--------|------------------
GOOD | Payment on time | Standard terms | No
WATCH | 1-30 days overdue | Send reminder | No
HOLD | 31-60 days overdue | Block new orders | Operations Manager
BAD | 60+ days overdue | Debt collection | Finance Manager

Late Payment Interest: UK Statutory Rate (currently 8% + BoE base = ~13.25% p.a.)
Calculate on day 31 after invoice date
```

---

### 5. Quality Check Criteria and Standards
**Priority:** 🔴 **CRITICAL**  
**Impact Area:** 🔧 **Operational** + ⚖️ **Compliance**

#### Current Understanding
System has `QualityCheck` entity with fields for primary/secondary checker, but specific pass/fail criteria not defined.

#### Questions
1. **What are the specific quality check requirements for each fabrication stage?**
   - Drawing review: What dimensions/specs must be verified?
   - Material cutting: Tolerance levels? (e.g., ±2mm)
   - Glass quality: Visual inspection standards?
   - Powder coating: Coverage and finish standards?
   - Assembly: Alignment and fit tolerances?

2. **What are the pass/fail thresholds?**
   - Minor defects: acceptable? (e.g., < 3 minor issues = pass)
   - Major defects: automatic fail?
   - Critical defects: stop production immediately?

3. **Who is authorized to perform quality checks?**
   - Primary checker: Production staff?
   - Secondary checker: Production Manager only?
   - Can the same person who fabricated perform quality check? (answer: probably NO)

4. **What happens when a quality check fails?**
   - Return to previous stage?
   - Rework in place?
   - Scrap and restart?
   - Who approves rework decisions?

5. **Are there industry standards to comply with?**
   - BS 6206 (Impact performance of flat safety glass)
   - BS EN 1279 (Glass in building - Insulating glass units)
   - Others?

#### Impact of Not Clarifying
- **CRITICAL**: Risk of defective products reaching customers
- Potential safety issues with glass products
- Inconsistent quality across production
- Compliance risk with building regulations

#### Recommended Approach
Create **Quality Standards Matrix**:
```
Stage | Check Type | Standard | Tolerance | Pass/Fail Criteria
------|------------|----------|-----------|--------------------
Drawing | Dimensional | BS 8000-7 | ±2mm | All dimensions within tolerance
Glass Cutting | Edge Quality | BS 6206 | Visual | No chips, cracks, or sharp edges
Powder Coating | Finish | BS EN 12206 | Visual + DFT | Even coverage, 60-120μm thickness
Assembly | Alignment | Internal | ±1mm | All joints aligned, no gaps > 1mm
Final Inspection | Overall | Combined | As above | All checks passed + customer specs met
```

---

### 6. Drawing Revision Limits and Escalation
**Priority:** 🟡 **MEDIUM**  
**Impact Area:** 🔧 **Operational** + 🧑‍🤝‍🧑 **Customer**

#### Current Understanding
System tracks drawing versions (e.g., 1.0, 1.1, 2.0), but no limits or escalation rules defined.

#### Questions
1. **Is there a maximum number of revisions before escalation?**
   - E.g., 3 revisions → escalate to Project Manager?
   - 5 revisions → escalate to Customer for clarification meeting?

2. **Who pays for excessive revisions?**
   - First X revisions: included in quote price?
   - Subsequent revisions: charge customer?
   - If charged, how much per revision?

3. **What triggers a new drawing version vs. a new revision?**
   - Minor changes: increment revision (1.0 → 1.1)?
   - Major changes: new version (1.x → 2.0)?

4. **How long are drawings valid?**
   - Are there expiry dates for quotes based on drawing age?
   - Must customer re-approve if drawing older than X months?

#### Impact of Not Clarifying
- **MEDIUM**: Excessive revision cycles delay projects
- Customer frustration with unclear change management
- Revenue loss if revisions not charged appropriately

#### Recommended Approach
Define **Drawing Revision Policy**:
```
Revision Count | Action | Cost
---------------|--------|-----
1-2 | Standard process | Included
3-4 | Project Manager notified | Included (warn customer)
5+ | Customer meeting required | £250 per additional revision

Version Changes:
- Minor adjustment (dimensions, specs): Increment revision (1.0 → 1.1)
- Major redesign (layout, product type): New version (1.x → 2.0)

Drawing Validity: 6 months from last customer approval
```

---

### 7. Supplier Performance Ratings and Selection
**Priority:** 🟡 **MEDIUM**  
**Impact Area:** 🔧 **Operational** + 💰 **Financial**

#### Current Understanding
System has supplier performance fields (`performanceRating`, `deliveryRating`, `qualityRating`, `priceRating`) but calculation method not defined.

#### Questions
1. **How are supplier ratings calculated?**
   - Based on what metrics? (on-time delivery %, defect rate, etc.)
   - Weighted average or simple average?
   - How frequently are ratings updated?

2. **What defines a "preferred supplier"?**
   - `isPreferred = true` field exists, but criteria not defined
   - Performance rating > X?
   - Volume of business?
   - Strategic partnership?

3. **How should supplier selection be automated in Materials Analysis?**
   - Always choose preferred supplier?
   - Choose lowest price?
   - Balance price vs. performance rating?
   - Consider lead times?

4. **What happens when a supplier's performance degrades?**
   - Rating below X: Remove "preferred" status?
   - Rating below Y: Stop using supplier?
   - Warning period before action?

5. **Are there supplier approval/onboarding processes?**
   - New supplier checklist?
   - Required certifications?
   - Credit check?
   - Contract terms?

#### Impact of Not Clarifying
- **MEDIUM**: Inconsistent supplier selection
- Risk of using unreliable suppliers
- Difficulty justifying supplier choices to customers

#### Recommended Approach
Define **Supplier Rating System**:
```
Metric | Weight | Calculation | Rating Scale
-------|--------|-------------|-------------
Delivery | 40% | % of orders delivered on time | 1-5 stars
Quality | 30% | % of orders without defects | 1-5 stars
Price | 20% | Competitive pricing vs market | 1-5 stars
Service | 10% | Communication and support | 1-5 stars

Overall Rating = Weighted Average
Preferred Supplier: Overall Rating >= 4.0 stars + Volume >= £50k/year

Supplier Selection Priority:
1. Preferred suppliers with rating >= 4.5
2. Preferred suppliers with rating >= 4.0
3. Non-preferred suppliers with rating >= 4.0
4. All others (manual selection required)
```

---

### 8. Fabrication Helper Assignment Rules
**Priority:** 🟡 **MEDIUM**  
**Impact Area:** 🔧 **Operational** + 💰 **Financial**

#### Current Understanding
System shows:
- `helperTimeReduction = 20%` (faster with helper)
- `helperCostIncrease = 33%` (cost increase)
- `powderCoatingRequiresTwoOperatives = true`

#### Questions
1. **When should a helper be assigned?**
   - Job value over £X?
   - Project complexity level?
   - Tight deadline?
   - Always for powder coating?

2. **How is the cost increase calculated?**
   - 33% increase applied to total job cost?
   - Or 33% increase on labor cost only?
   - Passed to customer or absorbed in margin?

3. **How are helpers selected and scheduled?**
   - Dedicated helper staff?
   - Rotational assignment?
   - Skill-matched to lead fabricator?

4. **What is the cost-benefit calculation?**
   - When does time saving justify cost increase?
   - Is there a break-even formula?

#### Impact of Not Clarifying
- **MEDIUM**: Suboptimal resource allocation
- Over/under-utilization of helper staff
- Inconsistent project costing

#### Recommended Approach
Define **Helper Assignment Rules**:
```
Criteria | Helper Required | Rationale
---------|-----------------|----------
Powder coating job | Yes (mandatory) | Safety and quality requirement
Job value > £15,000 | Yes (recommended) | Time savings justify cost
Project complexity = COMPLEX | Yes (recommended) | Risk mitigation
Deadline < 7 days | Yes (if capacity available) | Meet customer timeline
Standard jobs | No (optional) | Cost optimization

Cost Calculation:
- Helper cost = Lead fabricator hourly rate × 0.5 (assuming junior helper)
- Time saving = 20% reduction in total hours
- Cost increase = 33% on labor portion only (not materials)

Break-even: Jobs over £10k and estimated >40 hours benefit from helper
```

---

### 9. Installation Staffing and Vehicle Assignment
**Priority:** 🟠 **HIGH**  
**Impact Area:** 🔧 **Operational** + ⚖️ **Compliance** (Safety)

#### Current Understanding
System calculates:
- `recommendedStaff` based on glass weight
- `recommendedVehicles`
- `requiresMechanicalAid` for heavy lifts

#### Questions
1. **What are the exact formulas for staffing recommendations?**
   - Glass panel weight < X kg: 1 person?
   - Glass panel weight X-Y kg: 2 people?
   - Glass panel weight > Y kg: 2 people + mechanical aid?

2. **What are the safety thresholds?**
   - Maximum weight per person?
   - When is mechanical aid (lift, crane, etc.) mandatory?
   - What safety equipment is required at each weight level?

3. **How are vehicles assigned?**
   - Small van: jobs up to X size/weight?
   - Large van: jobs over X?
   - Specialist vehicle (with crane): when required?

4. **What about site access constraints?**
   - How to factor in: stairs, narrow access, high-rise installation?
   - Do these increase staffing requirements?

5. **Are there regulatory compliance requirements?**
   - HSE (Health & Safety Executive) guidelines?
   - Manual Handling Operations Regulations 1992?
   - Working at Height Regulations 2005?

#### Impact of Not Clarifying
- **HIGH**: Safety risk to installation staff
- Risk of injury claims
- Regulatory compliance violations
- Inefficient resource allocation

#### Recommended Approach
Define **Installation Staffing Matrix** (based on HSE guidelines):
```
Glass Panel Weight | Staff Required | Mechanical Aid | Vehicle Type | Safety Equipment
-------------------|----------------|----------------|--------------|------------------
< 20 kg | 1 person | No | Small van | Gloves, safety boots
20-50 kg | 2 people | No | Standard van | + Lifting straps
50-100 kg | 2 people | Recommended | Large van | + Suction lifters
100-250 kg | 2 people | Mandatory | Van + trailer | + Glass manipulator
> 250 kg | 3+ people | Mandatory | Specialist vehicle | + Crane/hoist

Site Access Factors (add +1 staff if any apply):
- Stairs (> 1 flight)
- Working at height (> 3 meters)
- Restricted access (< 1m width)
- High-rise (> 5 floors)
```

---

### 10. Warranty and Callback Risk Assessment
**Priority:** 🟡 **MEDIUM**  
**Impact Area:** 💰 **Financial** + 🧑‍🤝‍🧑 **Customer**

#### Current Understanding
Quote type rules have fields for `warrantyRisk` and `callbackRisk`, but assessment method not defined.

#### Questions
1. **What factors indicate high warranty risk?**
   - Remedial work: always high risk?
   - Bespoke/complex products: higher risk?
   - New product types: learning curve risk?
   - Challenging site conditions?

2. **How should warranty risk affect pricing?**
   - High risk: add X% markup?
   - Reserve funds for potential callbacks?
   - Extended warranty offered/required?

3. **What is the historical callback rate?**
   - % of jobs requiring callback within 12 months?
   - Average cost of callback?
   - Most common reasons for callback?

4. **What is the standard warranty period?**
   - Fabrication: X years?
   - Installation: Y years?
   - Different warranties for different product types?

5. **How are warranty claims processed?**
   - Who approves warranty work?
   - How is cost allocated (materials, labor)?
   - Impact on future quotes/pricing?

#### Impact of Not Clarifying
- **MEDIUM**: Inadequate provision for warranty costs
- Margin erosion from frequent callbacks
- Customer dissatisfaction with warranty disputes

#### Recommended Approach
Create **Warranty Risk Assessment Matrix**:
```
Risk Factor | Risk Level | Markup Adjustment
------------|------------|-------------------
Remedial work | High | +5-10%
Bespoke/complex product | Medium-High | +3-5%
Challenging site (height, access) | Medium | +2-3%
New product type (< 10 jobs) | Medium | +2-3%
Standard fabrication & install | Low | 0%

Standard Warranty:
- Fabrication defects: 5 years
- Installation defects: 2 years
- Normal wear and tear: Not covered
- Customer damage: Chargeable repair

Callback Budget Reserve: 2% of job value for high-risk jobs
```

---

## Summary of Priorities

### 🔴 CRITICAL (Must Clarify Before Go-Live)
1. **Quote Markup Calculation Rules** - Financial impact
2. **Quality Check Criteria** - Safety and compliance

### 🟠 HIGH (Clarify Within First Month)
3. **CEO Approval Threshold** - Governance and oversight
4. **Installation Staffing Rules** - Safety compliance

### 🟡 MEDIUM (Clarify for Optimization)
5. **Survey Pricing Variations** - Regional consistency
6. **Late Payment Interest** - Credit management
7. **Drawing Revision Limits** - Project efficiency
8. **Supplier Performance** - Operational efficiency
9. **Fabrication Helper Rules** - Resource optimization
10. **Warranty Risk Assessment** - Financial protection

---

## Recommended Next Steps

### Step 1: Stakeholder Workshop (Priority: 🔴 CRITICAL)
**Participants:**
- CEO (approval thresholds, strategic decisions)
- Finance Manager (markup, margins, credit management)
- Operations Manager (workflows, resource allocation)
- Production Manager (quality standards, fabrication processes)
- Sales Manager (customer experience, survey pricing)
- Installation Manager (staffing, safety compliance)

**Agenda:**
1. Review all CRITICAL and HIGH priority gaps
2. Make decisions and document in policy manual
3. Agree on implementation timeline

### Step 2: Policy Documentation (Priority: 🔴 CRITICAL)
Create formal policy documents for:
- **Financial Policies** (markup, pricing, credit)
- **Approval Authorities** (thresholds, routing)
- **Quality Standards** (fabrication, installation)
- **Health & Safety** (installation staffing, risk assessment)

### Step 3: System Configuration (Priority: 🟠 HIGH)
Implement decisions in:
- SharePoint lists (calculated columns, validation rules)
- Power Automate flows (approval routing, notifications)
- Planner tasks (assignment rules, due dates)

### Step 4: User Training (Priority: 🟠 HIGH)
Train staff on:
- New policies and procedures
- System workflows and approvals
- Quality standards and documentation
- Safety compliance requirements

### Step 5: Monitoring and Adjustment (Ongoing)
- Track KPIs and compliance metrics
- Monthly review of policy effectiveness
- Quarterly adjustments based on business performance

---

## Appendix: Questions Template for Stakeholders

Use this template to collect answers from SFG stakeholders:

```
SFG NEXUS - Business Rules Clarification Form

Date: ______________
Completed by: ______________
Role: ______________

Section 1: Quote Markup Rules
Q1: Target margin % for Supply & Install quotes: ______%
Q2: Target margin % for Supply Only quotes: ______%
Q3: Target margin % for Remedial quotes: ______%
Q4: Risk markup adjustment for complex projects: ______%
Q5: Buy-in items markup: Same as fabricated ☐  Different: ______%  ☐

Section 2: Approval Thresholds
Q6: CEO approval required for quotes/jobs over: £______
Q7: CEO approval applies to: Quotes ☐  Jobs ☐  Both ☐
Q8: Emergency override allowed: Yes ☐  No ☐  If yes, by whom: ______________

Section 3: Survey Pricing
Q9: Standard rate per mile: £______
Q10: Minimum charge: £______
Q11: Manchester free threshold: £______
Q12: Regional variations: Yes ☐  No ☐  If yes, attach rate card
Q13: Maximum survey charge cap: £______ (or "No cap")

Section 4: Credit Management
Q14: Late payment interest rate: ______% p.a. (or "UK statutory")
Q15: Credit status triggers:
    - WATCH: ______ days overdue
    - HOLD: ______ days overdue
    - BAD: ______ days overdue
Q16: Write-off threshold: ______ days and approved by ______________

Section 5: Quality Standards
Q17: Fabrication tolerance: ±______ mm
Q18: Quality check required at stages: _________________________________
Q19: Primary checker: ______________ (role)
Q20: Secondary checker: ______________ (role)
Q21: Industry standards to comply with: _________________________________

Section 6: Staffing and Safety
Q22: Max manual handling weight per person: ______ kg
Q23: Mechanical aid required for glass over: ______ kg
Q24: Installation staffing formula: _________________________________

Section 7: Warranty
Q25: Standard warranty period - Fabrication: ______ years
Q26: Standard warranty period - Installation: ______ years
Q27: Warranty risk markup for remedial work: +______%
Q28: Callback budget reserve: ______% of job value

Additional Notes:
____________________________________________________________________________
____________________________________________________________________________
____________________________________________________________________________

Signature: ______________  Date: ______________
```

---

**Document Version:** 1.0  
**Last Updated:** 5 October 2025  
**Status:** AWAITING STAKEHOLDER FEEDBACK  
**Next Action:** Schedule Stakeholder Workshop
