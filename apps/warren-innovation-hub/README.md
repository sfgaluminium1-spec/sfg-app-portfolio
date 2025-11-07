# Warren Heathcote AI & Aluminium Innovation Hub

**Version:** 3.0.0  
**Category:** executive-innovation-hub  
**Platform:** Abacus.AI (Next.js 14.2.28 + TypeScript)  
**Status:** ✅ Approved & Registered  
**Deployment:** https://sfg-heathcote-hub.abacusai.app

---

## 📋 Description

Premier executive command center integrating strategic leadership, AI-driven business intelligence, luxury lifestyle management, creative wellness initiatives, and comprehensive SharePoint/Xero integration. Features dual-persona architecture for Warren's Executive Suite and Yanika's Creative Oasis.

---

## 🎯 Key Features

### Warren's Executive Suite
- 💎 Diamond-themed executive command center
- 📊 Real-time business intelligence dashboards
- 🏎️ Motorsport & automotive excellence tracking
- 💰 Investment & cryptocurrency portfolio management
- 🤖 AI-powered strategic insights

### Yanika's Creative Oasis
- 🌸 Dubai-themed wellness & beauty hub
- 🧴 AI Dermatology assistant (climate-specific)
- 📱 Instagram marketing analytics
- 📅 Content scheduling & management
- 💪 Wellness score tracking

### Shared Infrastructure
- 📁 SharePoint integration with analytics
- 💼 Xero financial integration
- 📊 Power BI advanced analytics
- 🤝 Companies House business data
- 🔗 NEXUS orchestration

---

## ⚡ Capabilities

1. Executive dashboard with real-time business intelligence
2. AI-powered chat assistant for strategic insights (dual-persona support)
3. Dual-persona management (Warren Executive + Yanika Creative Oasis)
4. SharePoint library management with futuristic UI and analytics
5. Xero financial integration with real-time analytics and invoice generation
6. Power BI dashboard integration for advanced business intelligence
7. Luxury lifestyle & motorsport tracking for executive management
8. Investment & cryptocurrency portfolio management with market tracking
9. Creative wellness & beauty management (Dubai-themed)
10. AI Dermatology chatbot for personalized skincare advice (Dubai climate-specific)
11. Instagram marketing analytics & campaign management (@yanika.heathcote)
12. Content updates & scheduling system for multi-platform publishing
13. Dubai wellness hub with family & travel moments tracking
14. Multi-platform social media console with engagement metrics
15. Companies House integration for business intelligence

---

## 🔗 Integrations

- **NEXUS** - SFG ecosystem orchestration
- **MCP-SALES** - Lead management
- **MCP-FINANCE** - Financial analytics
- **MCP-OPERATIONS** - Business intelligence
- **MCP-COMMUNICATIONS** - Email & notifications
- **SharePoint** - Document management
- **Xero** - Financial integration
- **Power BI** - Advanced analytics
- **Instagram** - Social media marketing
- **Abacus.AI** - AI services
- **Companies House** - Business data

---

## 🔌 Webhooks

### Incoming Events (From NEXUS)

- `enquiry.created` - New business enquiry received from NEXUS orchestration
- `financial.update` - Financial data update from Xero integration
- `wellness.booking` - New wellness appointment booking for Yanika's services
- `instagram.engagement` - Significant engagement spike on Instagram posts
- `sharepoint.update` - SharePoint document library updated

### Outgoing Events (To NEXUS)

- `executive.decision` - Strategic decision made in executive dashboard requiring cross-app action
- `wellness.insight` - AI dermatology insights for client wellness tracking
- `campaign.performance` - Marketing campaign performance milestone reached
- `financial.alert` - Critical financial threshold or anomaly detected
- `content.published` - Multi-platform content successfully published

---

## 🚀 Quick Start

### 1. Deployment

The app is deployed at:
```
https://sfg-heathcote-hub.abacusai.app
```

### 2. Webhook Configuration

Configure the webhook endpoint in NEXUS:
```
https://warren-innovation-hub.abacusai.app/api/webhooks/nexus
```

### 3. Environment Variables

Required environment variables:
```env
DATABASE_URL=postgresql://...
ABACUSAI_API_KEY=...
NEXUS_WEBHOOK_SECRET=...
NEXUS_WEBHOOK_URL=...
```

### 4. Testing

Test the integration:
```bash
curl -X POST https://warren-innovation-hub.abacusai.app/api/webhooks/nexus \
  -H "Content-Type: application/json" \
  -H "X-NEXUS-Signature: <signature>" \
  -d '{"type": "enquiry.created", "data": {}}'
```

---

## 📚 Documentation

- **Message Handlers:** See `workflows/message-handlers.md`
- **Webhooks:** See `config/webhooks.json`
- **Communications:** See `config/communications.json`
- **Business Logic:** See `business-logic.json`

---

## 🏗️ Architecture

### Dual-Persona System
- **Warren Executive Suite:** Diamond gold theme, executive focus
- **Yanika Creative Oasis:** Dubai pink-purple theme, wellness focus

### Tech Stack
- **Frontend:** Next.js 14.2.28, React, TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Radix UI
- **Backend:** Next.js API Routes, PostgreSQL
- **Integrations:** Abacus.AI, SharePoint, Xero, Instagram

### Data Flow
1. User interacts with persona-specific dashboard
2. Frontend calls Next.js API routes
3. API routes process business logic
4. External integrations fetched (SharePoint, Xero, etc.)
5. NEXUS webhooks sent/received for orchestration
6. Real-time updates via AI chat assistant

---

## 🔐 Security

- **Authentication:** Simple session-based auth
- **Webhook Security:** HMAC-SHA256 signature verification
- **API Security:** Environment-based secrets
- **Data Privacy:** Persona-based data isolation

---

## 📊 Monitoring

- **Webhook Events:** Logged to `webhook_events` table
- **API Performance:** New Relic / DataDog
- **Error Tracking:** Sentry integration
- **User Analytics:** Google Analytics (optional)

---

## 🤝 Support

**Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio  
**Issues:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues  
**Contact:** warren@sfg-innovations.com

---

**Registered:** 2025-11-07  
**Version:** 3.0.0  
**Status:** ✅ Production Ready with NEXUS Integration
