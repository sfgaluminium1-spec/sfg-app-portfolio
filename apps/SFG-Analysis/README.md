# SFG-Analysis - Storage Analysis & Optimization Platform

![Status](https://img.shields.io/badge/status-production-green)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Category](https://img.shields.io/badge/category-sfg--aluminium--app-purple)

**Enterprise-grade SharePoint and local storage analysis platform with AI-powered insights and full orchestration capabilities.**

---

## 🎯 Overview

**App Name:** SFG-Analysis  
**Full Name:** SFG Storage Analysis & Optimization Platform  
**Category:** sfg-aluminium-app  
**Version:** 2.0.0  
**Status:** ✅ Production  

**Deployment URL:** https://sfg-analysis.abacusai.app  
**Webhook URL:** https://sfg-analysis.abacusai.app/api/webhooks/nexus  
**Message Handler URL:** https://sfg-analysis.abacusai.app/api/messages/handle  

---

## 📦 Purpose

SFG-Analysis provides enterprise-grade SharePoint and local storage analysis with AI-powered insights, safety-first cleanup recommendations, and orchestrates document lifecycle workflows with full integration to Xero and Logikal systems.

### Key Capabilities

✅ **SharePoint Analysis** - Deep scanning with real-time metrics  
✅ **Local Drive Analysis** - Multi-platform support (Windows, macOS, Linux)  
✅ **AI-Powered Insights** - Pattern recognition & predictive forecasting  
✅ **Safety-First Cleanup** - Automated backups with 30-day rollback  
✅ **Document Lifecycle Management** - Automated routing & retention policies  
✅ **Integration Orchestration** - Xero, Logikal, SharePoint coordination  
✅ **Cost Monitoring** - Real-time tracking & budget alerts  
✅ **Audit & Compliance** - Complete audit trail & GDPR support  

---

## 🔔 Orchestration Capabilities

### Webhook Events (6 Subscriptions)

| Event | Actions |
|-------|---------|
| **project.created** | Create SharePoint folders, set permissions, initialize tracking |
| **project.completed** | Archive files, apply 7-year retention, optimize storage tier |
| **invoice.generated** | Download from Xero, upload to SharePoint, sync metadata |
| **document.uploaded** | Analyze content, categorize, check duplicates, update metrics |
| **quote.approved** | Sync to Logikal, prepare folders, activate workflow |
| **storage.threshold_exceeded** | Generate alerts, create recommendations, notify stakeholders |

### Events Published (6 Types)

- `storage.analysis.completed`
- `storage.cleanup.executed`
- `storage.cost.threshold_exceeded`
- `document.lifecycle.stage_changed`
- `integration.sync.completed`
- `integration.sync.failed`

### Message Handler Support (7 Messages)

**Query Messages:**
- `query.storage_status` - Get current storage metrics
- `query.cost_forecast` - Get storage cost forecast
- `query.cleanup_recommendations` - Get cleanup recommendations

**Action Messages:**
- `action.analyze_sharepoint` - Trigger SharePoint analysis
- `action.execute_cleanup` - Execute cleanup operation
- `action.sync_to_xero` - Sync documents to Xero
- `action.sync_to_logikal` - Sync documents to Logikal

---

## 🔗 Integrations

### Required Integrations
- **NEXUS** - Orchestration Hub
- **MCP-SALES** - Sales Tools
- **MCP-FINANCE** - Finance Tools
- **MCP-OPERATIONS** - Operations Tools
- **MCP-COMMUNICATIONS** - Communications Tools
- **MCP-DATA** - Data Tools

### Optional Integrations
- **Xero** - Accounting & Invoicing
- **SharePoint** - Document Storage
- **Logikal** - CAD/Quote System
- **Companies House** - Company Data

---

## 🛠️ Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18 + TypeScript 5
- Tailwind CSS + Shadcn UI
- Recharts (visualizations)

**Backend:**
- Next.js API Routes
- Node.js
- Prisma ORM
- PostgreSQL

**Authentication:**
- Microsoft 365 OAuth
- Microsoft Graph API
- Role-based access control

**Integrations:**
- Microsoft SharePoint API
- Xero API
- Logikal API
- Abacus.AI LLM APIs

---

## 🔒 Security

- ✅ **Authentication:** Microsoft 365 SSO
- ✅ **Webhook Security:** HMAC-SHA256 signature verification
- ✅ **Data Encryption:** HTTPS/TLS
- ✅ **Access Control:** Role-based permissions
- ✅ **Audit Logging:** Complete operation trail
- ✅ **Backup & Recovery:** 30-day rollback
- ✅ **Compliance:** GDPR, ISO 27001 ready

**Webhook Secret:** `sfg-analysis-webhook-secret-2025`

---

## 📊 Business Impact

### Target ROI
- **Monthly Savings:** £500 (15-25% storage cost reduction)
- **Annual Savings:** £6,000
- **Time Saved:** 20 hours/month
- **Error Reduction:** 90%
- **Compliance:** 100% audit trail

### Target Users
- All SFG Aluminium employees
- Project managers
- Finance team
- IT administrators
- Operations staff
- Executive leadership

---

## 📞 Support

**Primary Contact:** warren@sfg-innovations.com  
**NEXUS Team:** nexus@sfg-innovations.com  
**Emergency:** nexus-alerts@sfg-innovations.com  

**Documentation:**
- User Guide: https://sfg-analysis.abacusai.app/documentation
- API Reference: https://sfg-analysis.abacusai.app/api/docs

---

## 📋 SFG Business Rules Compliance

### Margins
✅ Minimum: 15% | Target: 25% | Warning: 18%

### Approval Limits
✅ T1 (Director): £1,000,000  
✅ T2 (Senior Manager): £100,000  
✅ T3 (Manager): £25,000  
✅ T4 (Supervisor): £10,000  
✅ T5 (Staff): £1,000

### Document Stages
✅ ENQ → QUO → SENT → ACC → ORD → FAB → INS → INV → PAID

### Customer Tiers
✅ Platinum (Purple) | Sapphire (Blue) | Steel (Gray) | Green (Green) | Crimson (Red)

### Retention Policies
✅ Active projects: Hot storage (SharePoint Online)  
✅ Completed projects: 7-year retention (Cold storage)  
✅ Archive projects: Long-term retention (Azure Blob)  
✅ Temporary files: 30-day retention

---

## 🎯 Registration Status

**Status:** ✅ APPROVED & PRODUCTION-READY  
**Registration Issue:** [#16](https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues/16)  
**Registered Date:** November 3, 2025  
**Orchestration Upgrade:** November 5, 2025  
**Version:** 2.0.0 - Full Orchestration

---

*Registered in the SFG Aluminium App Portfolio*  
*Part of the SFG Ecosystem*  
*November 2025*
