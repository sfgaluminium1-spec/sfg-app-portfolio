
# Satellite App Registration - Autonomous Prompt

This document contains the complete autonomous registration prompt that each satellite app will receive to self-register with the SFG NEXUS ecosystem.

---

## 🤖 AUTONOMOUS REGISTRATION INSTRUCTIONS

Each satellite app will execute these steps to register itself with the ecosystem:

### STEP 1: Clone Repository (2 minutes)

```bash
git clone https://github.com/sfgaluminium1-spec/sfg-app-portfolio.git
cd sfg-app-portfolio
```

### STEP 2: Gather Information (5 minutes)

Collect app metadata:
- `app_id`: Unique identifier (e.g., "sfg-vertex")
- `app_name`: Full name (e.g., "SFG Vertex Manufacturing Intelligence")
- `app_url`: Deployment URL
- `app_category`: core|support|experimental
- `technology_stack`: Tech used
- `primary_function`: What the app does
- `annual_savings`: Estimated £ savings per year

### STEP 3: Create Registration JSON (3 minutes)

Create registration file in `app-registry/[YOUR_APP_ID].json` with complete metadata.

### STEP 4: Backup Codebase (10 minutes)

Backup source code to `app-backups/[YOUR_APP_ID]/` directory.

### STEP 5: Extract Business Logic (10 minutes)

Extract business rules, workflows, and calculations to `business_logic.json`.

### STEP 6: Commit and Push (2 minutes)

Commit all changes and push to main branch.

### STEP 7: Create GitHub Issue (2 minutes)

Create registration completion issue with label "registration".

### STEP 8: Set Up Webhook Endpoint (5 minutes)

Implement `/api/github-webhook` endpoint to receive instruction updates.

### STEP 9: Verify Complete Registration (2 minutes)

Verify all files exist and webhook is functional.

---

## Priority Apps (First 10)

1. sfg-nexus
2. sfg-vertex
3. sfg-esp
4. sfg-sync
5. chronoshift-pro
6. sfg-axis
7. heathcote-hub
8. company-wiki
9. sfg-brand-engine
10. sfgcomms-hub

---

**Total Time:** ~30 minutes per app  
**Success Criteria:** All 9 steps completed and verified
