
# 🚀 SFG Satellite App Registration System

**Version:** 3.0  
**Last Updated:** November 5, 2025  
**Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio

## 📋 Overview

This system enables autonomous registration of satellite applications in the SFG orchestration ecosystem. Satellite apps can register themselves by creating GitHub issues with their business logic, capabilities, and integration requirements.

## 🎯 Choose Your Registration Path

### **For SFG Aluminium Business Apps** (NEW!)
**Customer portals, operations apps, finance apps - anything that needs real-time orchestration**

👉 **Use:** [`SFG_ALUMINIUM_APP_REGISTRATION.md`](./SFG_ALUMINIUM_APP_REGISTRATION.md)

**Includes:**
- ✅ Webhook endpoints for real-time NEXUS events
- ✅ Message handlers for inter-app communication
- ✅ SFG-specific business rules (margins, tiers, approval limits)
- ✅ Complete Python and Node.js code examples
- ✅ Integration requirements (MCP servers, Xero, SharePoint)
- ✅ Event types: enquiry.created, quote.requested, order.approved, etc.
- ✅ Message types: query.customer_data, action.create_quote, etc.

### **For Utility & Dashboard Apps**
**Analytics dashboards, reporting tools, admin panels**

👉 **Use:** This README (simple registration below)

**Includes:**
- ✅ Basic business logic documentation
- ✅ No webhooks required
- ✅ No message handlers required
- ✅ Works for any generic app

## 🎯 Quick Start (5 Minutes)

### Option 1: Quick Registration (No Code Backup)

Simply create a GitHub issue manually with your app details using the template in `examples/quick-registration-template.md`.

### Option 2: Full Registration (With Business Logic Extraction)

Use the automated registration script:

```bash
# 1. Install dependencies
cd /home/ubuntu/sfg_aluminium_ltd/app
yarn add @octokit/rest @octokit/auth-app

# 2. Customize your business logic
# Edit satellite-registration/examples/example-business-logic.ts

# 3. Run registration
yarn ts-node ../satellite-registration/scripts/register-satellite.ts
```

## 📁 Directory Structure

```
satellite-registration/
├── README.md                           # This file
├── scripts/
│   ├── github-auth.ts                  # GitHub authentication
│   ├── extract-business-logic.ts       # Business logic extraction
│   └── register-satellite.ts           # Main registration script
├── types/
│   └── business-logic.ts               # TypeScript interfaces
├── utils/
│   └── issue-formatter.ts              # GitHub issue formatting
└── examples/
    ├── example-business-logic.ts       # Example business logic
    ├── quick-registration-template.md  # Quick registration template
    └── complex-app-example.json        # Complex app example
```

## 🔑 GitHub Credentials

Credentials are stored in environment variables (already configured):

- `GITHUB_APP_ID=2228094`
- `GITHUB_APP_INSTALLATION_ID=92873690`
- `GITHUB_OWNER=sfgaluminium1-spec`
- `GITHUB_REPO=sfg-app-portfolio`
- `GITHUB_APP_PRIVATE_KEY` (from .env)

## 📊 Business Logic Structure

Your app registration must include:

1. **Basic Info:** Name, category, description, version
2. **Capabilities:** What your app can do
3. **Workflows:** Step-by-step processes
4. **Business Rules:** Conditional logic and validation
5. **Integrations:** External systems
6. **API Endpoints:** Available APIs
7. **Data Models:** Key data structures

See `examples/example-business-logic.ts` for a complete template.

## 🔧 Usage Examples

### Example 1: Register Simple App

```typescript
// Edit examples/example-business-logic.ts with your app details
// Then run:
yarn ts-node ../satellite-registration/scripts/register-satellite.ts
```

### Example 2: Manual Registration

Copy the template from `examples/quick-registration-template.md` and create a GitHub issue at:
https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues/new

## ✅ Success Criteria

Your registration is complete when:

1. ✅ GitHub issue created with `[Registration]` title
2. ✅ Issue has labels: `registration`, `satellite-app`, `pending-approval`
3. ✅ Business logic documented in issue body
4. ✅ Nexus reviews and approves (within 24-48 hours)
5. ✅ Issue label changed to `approved`

## 📞 Support

- **GitHub Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio
- **Create Issue:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues/new
- **Contact:** warren@sfg-innovations.com
- **Review Time:** 24-48 hours

## 🔒 Security

- Private keys are stored securely in `.env` file
- Never commit credentials to version control
- GitHub App has minimal required permissions
- All API calls are authenticated and logged

---

**Built with:** TypeScript, Octokit, Node.js  
**Maintained by:** SFG Aluminium Ltd Engineering Team
