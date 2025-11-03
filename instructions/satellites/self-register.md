
# SATELLITE APP SELF-REGISTRATION

**Purpose:** Register your application with the SFG Aluminium Ecosystem  
**Timeline:** 30 minutes  
**Prerequisites:** Git, GitHub CLI (optional)

## Quick Start

Execute these steps to register:

### Step 1: Clone Repository (2 minutes)

```bash
cd /tmp
git clone https://github.com/sfgaluminium1-spec/sfg-app-portfolio.git
cd sfg-app-portfolio
```

### Step 2: Create Registration JSON (5 minutes)

```bash
cat > apps/[YOUR_APP_ID]/app-registration.json << 'EOF'
{
  "app_id": "[YOUR_APP_ID]",
  "app_name": "[YOUR_FULL_NAME]",
  "app_url": "[YOUR_URL]",
  "app_category": "core|support|experimental",
  "version": "[VERSION]",
  "registered_at": "[TIMESTAMP]",
  "technical": {
    "technology_stack": "[STACK]",
    "database": "[DATABASE]",
    "hosting": "Abacus.AI",
    "mcp_enabled": false,
    "api_endpoints": []
  },
  "business": {
    "primary_function": "[FUNCTION]",
    "target_users": "[USERS]",
    "key_features": [],
    "staff_replaced": 0,
    "annual_savings_gbp": 0
  },
  "integration": {
    "integrates_with": [],
    "data_sources": [],
    "data_outputs": []
  },
  "status": "registered",
  "health": "healthy"
}
EOF
```

### Step 3: Backup Your Code (10 minutes)

```bash
# Copy your source code to the app directory
cp -r /path/to/your/code/* apps/[YOUR_APP_ID]/
```

### Step 4: Extract Business Logic (10 minutes)

```bash
cat > apps/[YOUR_APP_ID]/business-logic.json << 'EOF'
{
  "app_id": "[YOUR_APP_ID]",
  "extracted_at": "[TIMESTAMP]",
  "business_rules": [],
  "workflows": [],
  "calculations": [],
  "validations": [],
  "integrations": []
}
EOF
```

### Step 5: Commit and Push (2 minutes)

```bash
git add apps/[YOUR_APP_ID]/
git commit -m "feat: Register [YOUR_APP_NAME]"
git push origin main
```

### Step 6: Create Notification Issue (1 minute)

Create a GitHub issue with title:
```
[REGISTRATION] [YOUR_APP_NAME] - Complete
```

## Verification

Check that your files appear on GitHub:
- `apps/[YOUR_APP_ID]/app-registration.json`
- `apps/[YOUR_APP_ID]/business-logic.json`
- Your source code files

## Next Steps

After registration:
1. Set up MCP server (see `mcp-server-template.md`)
2. Configure webhooks (see `webhook-setup.md`)
3. Wait for orchestration instructions

