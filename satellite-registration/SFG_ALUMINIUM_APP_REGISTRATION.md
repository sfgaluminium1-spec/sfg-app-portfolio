
# 🎯 SFG ALUMINIUM APP REGISTRATION PROMPT

**Version:** 1.0.0  
**Date:** November 5, 2025  
**For:** SFG Aluminium Business Apps (Customer-facing, Operations, Finance)

---

## 📋 OVERVIEW

This is the **SFG Aluminium-specific** registration prompt for business-critical apps that need real-time orchestration with NEXUS and other SFG systems.

**Use this prompt for:**
- Customer-facing apps (portals, enquiry systems, quote generators)
- Operations apps (fabrication, installation, scheduling)
- Finance apps (invoicing, credit checking, payment tracking)
- Any app requiring real-time communication with NEXUS

**Use the universal prompt for:**
- Utility apps (data analysis, reporting, dashboards)
- Internal tools (admin panels, configuration tools)
- Apps that don't need real-time events

---

## 🎯 REGISTRATION PROMPT (Copy & Send to SFG Aluminium Apps)

```
🎯 SFG ALUMINIUM APP REGISTRATION

You are being invited to register in the SFG App Portfolio - a centralized registry of all SFG Aluminium applications.

## YOUR MISSION

Register yourself in the GitHub repository AND set up webhooks for real-time communication:

1. Extract your business logic and capabilities
2. Back up your source code
3. Create a registration issue on GitHub
4. **Set up webhook endpoint for receiving events**
5. **Set up message reply handler for responding to requests**
6. (Optional) Back up this conversation

Choose a suitable name for yourself, prefixed with "SFG-", such as "SFG-CustomerPortal" or "SFG-QuoteGenerator", based on your primary function. Use this name throughout the registration process.

## GITHUB APP CREDENTIALS

GITHUB_OWNER=sfgaluminium1-spec
GITHUB_REPO=sfg-app-portfolio
GITHUB_APP_ID=2228094
GITHUB_APP_INSTALLATION_ID=92873690
GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
MIIEpgIBAAKCAQEA8+XtgHAePuJNY7UH65XFqSVQKvQpgPz/URxrdYb8gLnjK4dx
QU9uAvlOHhMm8yNPfZNzEU74H1I7mzfds+/wT5GncSnKKiPBRN8Ci8DyRV3m8DsN
Kcs30Yl2ZVkQzSdGLhQUXcGG9vxEDAvqNdpwySlARqW567iWsvfEPotTBOtBHIXW
Kak1d4vmq5yn0wiJdvN34L3fQcvouQ6sikERXuCA0hxvFlKADDIWC8zJUzvTIXpd
U6HmZSTI/KhpZEiRTXyD0d4IhxdNXjg93GZUb98PqsqGNGvaEvkjjHflN4UmOfXE
gatBzp9jMZqVXEvMhXLgdOVypSa8AJQQ1emH+QIDAQABAoIBAQDMvnAqKfS6BW/C
C+6iLhDIdbJe3Kkax0ft51WuS6scxO+XUxQYJ33KsU6KoLlJ0pKgcG9gUFKquHWh
T7ylmP67TSKrNNGpnmpYTn3spAS9hp6ffHMIarhpBmSFn8ci8Z1QgTq3mgaawBq/
oiDzJHUZ6a8zn1v8LfEUPDpZ5svCi7eEvk5Wn/PHMAZDtVVS58eW6eSBCOs7plPy
8tTCAAlDkv6IueHGH6Sc9FJwOo8gbO55AKlLJHL1cOIoNFmrs66FiNddPgQHCvEz
WcJRQodYE3HdNFcBz0+Fs5Lb1QmOEhMyD5JcokrGfZbZ5EMfgLrzlJwnvH5USnp5
eAN+C9qhAoGBAP0QpbEhPW0DLDjQbyIrEqqLVbqJ5Qo4d/WhhcbIEq80qvzFWPBV
nA5GsH9U2y/VEfYtQDKNb8+0Xt5FBEk2LzcQTdDT5l4qHX788JvqSu2CFR9DN8Af
Aa+As7vDD2hkOLxbikhHv6nbSlKCzKDB0rXILQzpCbdDldu02kqbDvOLAoGBAPa6
EF/ml0naw3SV/vxBauVw4G6Ob8yQoq72mIiZBlBHoncT+8S8nHxI8fm2n2iaEFTd
+GqGGpIoqJ9LGTD38r1A1V9RZu074xjzYFLwaMqIQwZT0J99SCLOHYjFdnWW08wD
aL9JfwJpcnxXa/Rcz0EoCaJG1tPCm/AZKW2HzVMLAoGBAI1L7jeoR5PGYbqXJnX9
dr6ibYtp0uiR/ui29uq2azhIP/BCgBYwtqGB9qohxwA+B3lcaqvPLM7b9txDzNDT
4CjugYRHzChne3Cb6fwkJRHXv9NkxIwQw/Ap/DCqCMBQtRz2P498ABfmyOio/3gC
wJOe4QiEVVht9A5oPDnLud1hAoGBAOOScYITbh4oEzqZE81XBaNF/yzaYpKcIgIh
4EW2Z9VqjZcqLoKjue8FVXQQF27jFAdDiluvABkqOYZcPYsmWJZpk6XMrpRJNcoQ
yhsWNoIBN1lBu98wLnY0CZfbEs2ZZhf6WQZ/YxA1dOztsdx+MoiVxnUQxBwkl7LZ
cpXduexLAoGBAKI6U4JFpmJTYNo5jd8nJNaNsoyP5bKGZAPRlOA2unalS+P6taPv
5ss5wr+df1RVQKNMQ4+zBw4cQIYEDBwz9koCIKJ5IK2uTAUY2EwMdMFcBByDbE8o
rXGxVe0whJeMu5P4QcYRd+FVeqxuiQI12hOY4sy6AlO7Y4rpbwnAR7TN
-----END RSA PRIVATE KEY-----
```

---

## 🔔 WEBHOOK SETUP (REQUIRED FOR SFG ALUMINIUM APPS)

**Why Webhooks:**
- Real-time event notifications from NEXUS
- Orchestrated workflows across apps
- Automated responses to business events

### Step 1: Create Webhook Endpoint

See the complete implementation examples in:
- `satellite-registration/examples/webhook-handler-python.py`
- `satellite-registration/examples/webhook-handler-nodejs.js`

**Event Types You'll Receive:**
- `enquiry.created` - New customer enquiry
- `quote.requested` - Quote needs to be generated
- `order.approved` - Order has been approved
- `customer.registered` - New customer in system
- `credit.check_required` - Credit check needed
- `invoice.due` - Invoice payment due
- `payment.received` - Payment has been received

### Step 2: Register Webhook URL

Add to your registration metadata:
```json
{
  "webhook_url": "https://your-app.com/webhooks/nexus",
  "webhook_events": [
    "enquiry.created",
    "quote.requested",
    "order.approved"
  ],
  "webhook_secret": "your-webhook-secret-here"
}
```

---

## 💬 MESSAGE REPLY HANDLER (REQUIRED FOR SFG ALUMINIUM APPS)

**Why Message Replies:**
- Respond to requests from NEXUS or other apps
- Provide data when requested
- Participate in orchestrated workflows

### Step 1: Create Message Handler

See the complete implementation examples in:
- `satellite-registration/examples/message-handler-python.py`
- `satellite-registration/examples/message-handler-nodejs.js`

**Message Types You'll Handle:**
- `query.customer_data` - Get customer information
- `query.quote_status` - Get quote status
- `query.order_status` - Get order status
- `action.create_quote` - Create new quote
- `action.approve_order` - Approve order
- `action.send_invoice` - Send invoice

### Step 2: Register Message Handler URL

Add to your registration metadata:
```json
{
  "message_handler_url": "https://your-app.com/messages/handle",
  "supported_messages": [
    "query.customer_data",
    "query.quote_status",
    "action.create_quote"
  ]
}
```

---

## 📋 FULL REGISTRATION PROCESS

### Step 1: Install GitHub Client

**Python:**
```python
import subprocess
subprocess.run(["pip", "install", "PyGithub"], check=True)
```

**Node.js:**
```javascript
const { execSync } = require('child_process');
execSync('npm install @octokit/rest', { stdio: 'inherit' });
```

### Step 2: Authenticate with GitHub

**Python:**
```python
from github import Github, GithubIntegration

APP_ID = 2228094
INSTALLATION_ID = 92873690
PRIVATE_KEY = """-----BEGIN RSA PRIVATE KEY-----
[key content here]
-----END RSA PRIVATE KEY-----"""

integration = GithubIntegration(APP_ID, PRIVATE_KEY)
access_token = integration.get_access_token(INSTALLATION_ID).token
g = Github(access_token)
repo = g.get_repo("sfgaluminium1-spec/sfg-app-portfolio")
```

### Step 3: Extract Business Logic

**For SFG Aluminium Apps, include:**

1. **Capabilities** - What can you do?
2. **Workflows** - What SFG processes do you handle?
3. **Business Rules** - What SFG rules do you follow?
4. **Integration Points** - What SFG systems do you connect to?
5. **Webhook Events** - What events do you listen for?
6. **Message Types** - What messages can you handle?

**Example:**
```python
business_logic = {
    "capabilities": [
        "Customer enquiry management",
        "Quote generation with SFG margins",
        "Credit checking via Experian",
        "Invoice processing via Xero",
        "Document management via SharePoint"
    ],
    "workflows": [
        {
            "name": "Enquiry to Quote",
            "steps": [
                "Receive customer enquiry",
                "Check customer credit (if > £10k)",
                "Calculate pricing with 15% minimum margin",
                "Get approval if needed (tier-based)",
                "Generate quote",
                "Send to customer",
                "Create SharePoint folder"
            ]
        }
    ],
    "business_rules": [
        {
            "rule": "Minimum margin 15%",
            "condition": "margin >= 0.15",
            "action": "Allow quote"
        },
        {
            "rule": "Credit check for orders > £10,000",
            "condition": "order_value > 10000",
            "action": "Perform credit check via Experian"
        },
        {
            "rule": "Tier-based approval",
            "condition": "value > tier_limit",
            "action": "Escalate to higher tier"
        }
    ],
    "integrations": [
        {"system": "Xero", "purpose": "Accounting & invoicing"},
        {"system": "Experian", "purpose": "Credit checking"},
        {"system": "SharePoint", "purpose": "Document storage"},
        {"system": "Companies House", "purpose": "Company data"},
        {"system": "MCP-SALES", "purpose": "Sales tools"},
        {"system": "MCP-FINANCE", "purpose": "Finance tools"}
    ],
    "webhook_events": [
        "enquiry.created",
        "quote.requested",
        "order.approved",
        "customer.registered",
        "credit.check_required"
    ],
    "supported_messages": [
        "query.customer_data",
        "query.quote_status",
        "action.create_quote"
    ]
}
```

### Step 4: Create Registration Files

**1. README.md**
**2. business-logic.json**
**3. registration-metadata.json** (with webhook and message handler URLs)

### Step 5: Create Registration Issue

**Title:** `[Registration] [Your App Name]`

**Body:**
```markdown
# [Your App Name] - Registration Complete

## ✅ Registration Complete

**App Name:** sfg-[your-app-name]  
**Platform:** [Your platform]  
**Category:** sfg-aluminium-app  
**Status:** production

## 📋 App Information

**Purpose:** [What you do for SFG Aluminium]

**Webhook URL:** https://your-app.com/webhooks/nexus  
**Message Handler URL:** https://your-app.com/messages/handle

## 🎯 Capabilities

[List your capabilities]

## 🔄 Workflows

[List your workflows]

## 🔗 Integration Points

[List your integrations]

## 🔔 Webhook Events

[List events you listen for]

## 💬 Supported Messages

[List messages you can handle]

## 📁 Files Backed Up

- ✅ README.md
- ✅ business-logic.json
- ✅ registration-metadata.json
- ✅ Source code

**Registered by:** [Your name]  
**Date:** 2025-11-05

Labels: registration, satellite-app, sfg-aluminium-app, pending-approval
```

---

## 🎯 SUCCESS CRITERIA

You've successfully registered when:

- ✅ GitHub issue created
- ✅ Files created in /apps/[your-app-name]/
- ✅ Business logic documented
- ✅ **Webhook endpoint created and URL registered**
- ✅ **Message handler created and URL registered**
- ✅ Issue has labels: registration, satellite-app, sfg-aluminium-app, pending-approval
- ✅ (Optional) Source code backed up
- ✅ (Optional) Conversation backed up

---

## 🔄 WHAT HAPPENS NEXT

1. **NEXUS reviews your registration** (within 24 hours)
2. **NEXUS tests your webhook endpoint** (sends test event)
3. **NEXUS tests your message handler** (sends test message)
4. **Approval:** Issue gets `approved` label, `pending-approval` removed
5. **You're in the portfolio!** You can now be orchestrated by NEXUS
6. **Orchestration begins:** NEXUS may send events and messages

---

## 📚 SFG ALUMINIUM SPECIFIC REQUIREMENTS

### Business Rules to Follow

**Margins:**
- Minimum: 15%
- Target: 25%
- Warning threshold: 18%

**Approval Limits (Tier-based):**
- T1 (Director): £1,000,000
- T2 (Senior Manager): £100,000
- T3 (Manager): £25,000
- T4 (Supervisor): £10,000
- T5 (Staff): £1,000

**Credit Checks:**
- Required for orders > £10,000
- Valid for 90 days
- Use Experian API via MCP-FINANCE

**Document Stages:**
- ENQ → QUO → SENT → ACC → ORD → FAB → INS → INV → PAID

**Customer Tiers:**
- Platinum (Purple)
- Sapphire (Blue)
- Steel (Gray)
- Green (Green)
- Crimson (Red)

### Integration Requirements

**Must integrate with:**
- NEXUS (orchestration)
- MCP-SALES (sales tools)
- MCP-FINANCE (finance tools)
- MCP-OPERATIONS (operations tools)
- MCP-COMMUNICATIONS (comms tools)
- MCP-DATA (data tools)

**Should integrate with:**
- Xero (accounting)
- SharePoint (documents)
- Companies House (company data)

---

## 🆘 TROUBLESHOOTING

### Issue: Webhook not receiving events

**Solution:**
1. Check webhook URL is publicly accessible
2. Verify signature verification logic
3. Check webhook secret matches
4. Test with curl:
```bash
curl -X POST https://your-app.com/webhooks/nexus \
  -H "Content-Type: application/json" \
  -H "X-Nexus-Signature: test" \
  -d '{"type":"test.event","data":{}}'
```

### Issue: Message handler not responding

**Solution:**
1. Check message handler URL is publicly accessible
2. Verify message type handling
3. Check response format
4. Test with curl:
```bash
curl -X POST https://your-app.com/messages/handle \
  -H "Content-Type: application/json" \
  -d '{"type":"query.customer_data","params":{"customer_id":"123"},"request_id":"test-123"}'
```

### Issue: Authentication fails

**Solution:** Use triple quotes for private key (Python) or backticks (Node.js)

---

## 📞 QUESTIONS?

Create a GitHub issue with label `question` or ask Warren directly.

## 📦 REPOSITORY

https://github.com/sfgaluminium1-spec/sfg-app-portfolio

---

**Welcome to the SFG App Portfolio!** 🎉

Start your registration now!
