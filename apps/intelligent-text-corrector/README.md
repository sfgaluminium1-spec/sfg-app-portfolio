# SFG Intelligent Text Corrector

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![Status](https://img.shields.io/badge/status-production-green)
![Category](https://img.shields.io/badge/category-productivity-purple)

**Deployment:** https://sfg-ai-prompt.abacusai.app  
**Chrome Extension:** Available in Chrome Web Store  
**Last Updated:** 2025-11-10

---

## 📋 Overview

The SFG Intelligent Text Corrector is an enterprise-grade Chrome extension and web application that provides AI-powered text correction, grammar checking, and prompt enhancement capabilities. Designed for professionals who demand accuracy and efficiency, it seamlessly integrates into daily workflows through browser right-click context menus and a comprehensive web dashboard. The platform leverages advanced language models to deliver real-time corrections, style improvements, and intelligent prompt optimization for business communications, technical documentation, and creative content creation.

---

## 🎯 Key Capabilities

The SFG Intelligent Text Corrector provides comprehensive text improvement capabilities:

1. **Real-time grammar and spelling correction with contextual suggestions**
2. **AI-powered prompt enhancement and optimization for better LLM interactions**
3. **Multiple writing style transformations (Simple, Business, Technical)**
4. **Punctuation checking and automated formatting improvements**
5. **Chrome extension with right-click context menu integration**
6. **Web-based dashboard for correction history and analytics**
7. **User authentication and personalized correction preferences**
8. **Business template library for standardized communications**
9. **Multi-language support with localized corrections**
10. **Batch processing capabilities for large document corrections**

---

## 🔌 System Integrations

The application integrates with multiple SFG and external systems:

- **NEXUS** - Central orchestration layer for event routing and system coordination
- **MCP-COMMUNICATIONS** - Unified communications hub for notifications and templates
- **MCP-OPERATIONS** - Operations management for usage tracking and monitoring
- **Abacus.AI LLM APIs** - Advanced language model APIs for text processing
- **Chrome Extension Store** - Distribution platform for browser extension

---

## 📨 Webhook Integration

### Incoming Events (From NEXUS)

The application receives and processes the following events:

#### `user.preferences.updated`
**Purpose:** Receives notification when user preferences are changed via NEXUS admin panel

**Sample Payload:**
```json
{
  "user_id": "user_123",
  "preferences": {
    "default_correction_mode": "business",
    "auto_apply_corrections": true,
    "language": "en-US"
  },
  "updated_at": "2025-11-10T10:00:00Z"
}
```

#### `template.library.updated`
**Purpose:** Receives notification when business template library is updated centrally

**Sample Payload:**
```json
{
  "template_id": "tmpl_456",
  "template_name": "Professional Email Response",
  "category": "email",
  "content": "Dear [Name],...",
  "updated_by": "admin_user",
  "updated_at": "2025-11-10T10:00:00Z"
}
```

#### `correction.quality.alert`
**Purpose:** Receives alerts about correction quality issues from NEXUS monitoring

**Sample Payload:**
```json
{
  "alert_type": "low_quality_output",
  "correction_id": "corr_789",
  "user_feedback": "incorrect suggestion",
  "severity": "medium",
  "timestamp": "2025-11-10T10:00:00Z"
}
```


---

### Outgoing Events (To NEXUS)

The application emits the following events for system-wide coordination:

#### `correction.completed`
**Trigger:** Sent when text correction is successfully completed

**Sample Payload:**
```json
{
  "correction_id": "corr_123",
  "user_id": "user_456",
  "original_text": "This is sample text with erors",
  "corrected_text": "This is sample text with errors",
  "correction_mode": "grammar",
  "timestamp": "2025-11-10T10:00:00Z",
  "processing_time_ms": 245
}
```

#### `prompt.enhanced`
**Trigger:** Sent when AI prompt enhancement is completed

**Sample Payload:**
```json
{
  "enhancement_id": "enh_789",
  "user_id": "user_456",
  "original_prompt": "write about dogs",
  "enhanced_prompt": "Write a comprehensive, 500-word article about domestic dog breeds, focusing on temperament, care requirements, and suitability for different living environments",
  "timestamp": "2025-11-10T10:00:00Z",
  "quality_score": 0.92
}
```

#### `user.usage.threshold`
**Trigger:** Sent when user reaches usage threshold or quota limits

**Sample Payload:**
```json
{
  "user_id": "user_456",
  "threshold_type": "daily_corrections",
  "current_usage": 95,
  "limit": 100,
  "period": "daily",
  "timestamp": "2025-11-10T10:00:00Z"
}
```


---

## 🚀 Quick Start Guide

### For End Users

1. **Access Web Application**
   - Visit: https://sfg-ai-prompt.abacusai.app
   - Sign up or log in with credentials
   - Configure preferences in dashboard

2. **Install Chrome Extension**
   - Download from Chrome Web Store
   - Click "Add to Chrome"
   - Log in with web app credentials
   - Grant necessary permissions

3. **Using Text Correction**
   - Highlight text in any web page
   - Right-click to open context menu
   - Select "SFG AI Tools" → Choose correction mode
   - Corrected text replaces original automatically

4. **Using Prompt Enhancement**
   - Write your initial prompt
   - Right-click and select "AI Prompt Enhance"
   - Review enhanced version
   - Accept or modify as needed

### For Developers

1. **Clone Repository**
   ```bash
   git clone https://github.com/sfgaluminium1-spec/sfg-app-portfolio.git
   cd apps/intelligent-text-corrector
   ```

2. **Install Dependencies**
   ```bash
   cd app && yarn install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with required credentials
   ```

4. **Run Development Server**
   ```bash
   yarn dev
   ```

5. **Build Chrome Extension**
   ```bash
   cd chrome-extension
   ./build.sh
   ```

---

## 🏗️ Architecture & Technology Stack

### Web Application

**Frontend:**
- Next.js 14.2.28 (React 18.2.0)
- TypeScript 5.2.2
- Tailwind CSS 3.3.3 with custom SFG theme
- shadcn/ui component library

**Backend:**
- Next.js API Routes
- PostgreSQL database
- Prisma ORM 6.7.0
- NextAuth.js 4.24.11 for authentication

**AI/ML:**
- Abacus.AI LLM APIs
- Custom prompt engineering
- Multi-model correction pipeline

### Chrome Extension

**Technology:**
- Manifest V3
- Service Worker architecture
- Content Scripts for DOM manipulation
- Chrome Storage API for persistence

**Key Files:**
- `manifest.json` - Extension configuration
- `background.js` - Service worker, event handling
- `content.js` - Page interaction logic
- `popup.html/js/css` - Extension UI

### Deployment Infrastructure

- **Platform:** Abacus.AI Cloud
- **Domain:** sfg-ai-prompt.abacusai.app
- **Database:** Managed PostgreSQL
- **CDN:** Integrated asset delivery
- **SSL:** Automatic HTTPS

---

## 📡 API Endpoints

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/correct` | POST | Submit text for correction |
| `/api/prompt-enhance` | POST | Enhance AI prompts |
| `/api/templates` | GET | List available templates |
| `/api/history` | GET | Retrieve correction history |
| `/api/signup` | POST | User registration |
| `/api/auth` | POST | User authentication |
| `/api/password-reset` | POST | Password reset flow |

### Webhook Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/nexus` | POST | Receive NEXUS events |

### Admin Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users` | GET | List all users |
| `/api/admin/users` | POST | Create/update users |
| `/api/user/preferences` | GET/POST | User preferences |

---

## 🔐 Security & Authentication

### Web Application

- **Authentication:** NextAuth.js with JWT sessions
- **Password Hashing:** bcrypt with salt rounds
- **Session Management:** HTTP-only cookies
- **API Security:** Route-level authentication middleware

### Chrome Extension

- **Secure Communication:** HTTPS-only API calls
- **Token Storage:** Chrome Storage API (encrypted)
- **CSP:** Strict Content Security Policy
- **Permissions:** Minimal required permissions

### Webhook Security

- **Signature Verification:** HMAC-SHA256
- **Secret Rotation:** Every 90 days
- **Rate Limiting:** 1000 req/hour incoming, 500 req/hour outgoing
- **IP Whitelisting:** Optional, configurable

---

## 📊 Performance Metrics & SLA

### System Performance

- **Uptime Target:** 99.9% monthly
- **API Response Time:** <2 seconds average
- **Webhook Processing:** <500ms per event
- **Extension Performance:** <100ms UI response time

### Usage Limits

- **Free Tier:** 50 corrections/day
- **Premium Tier:** 500 corrections/day
- **Enterprise:** Unlimited with rate limiting

### Monitoring

- Real-time dashboard metrics
- Error rate tracking (<3% target)
- User satisfaction scoring
- System health checks every 60 seconds

---

## 📧 Email & Notification Templates

### Correction Summary Report
**Subject:** Your Daily Text Correction Summary - {{date}}

**Description:** Daily automated email showing user's correction statistics and insights

### Welcome Email
**Subject:** Welcome to SFG Intelligent Text Corrector

**Description:** Sent to new users upon successful registration with setup instructions

### Password Reset Confirmation
**Subject:** Password Reset Successful - SFG Text Corrector

**Description:** Sent after user successfully resets their password

### Usage Limit Warning
**Subject:** Approaching Usage Limit - SFG Text Corrector

**Description:** Sent when user reaches 80% of their correction quota


---

## 📊 Dashboard Widgets

### Daily Corrections Counter
**Type:** metric

**Description:** Displays total number of corrections performed today across all users

### Correction Mode Distribution
**Type:** chart

**Description:** Pie chart showing percentage breakdown of Grammar, Punctuation, Rewrite modes used

### Active Users Table
**Type:** table

**Description:** List of currently active users with their recent correction activity

### API Response Time
**Type:** metric

**Description:** Average API response time in milliseconds for correction requests

### Error Rate Alert
**Type:** alert

**Description:** Visual alert when correction error rate exceeds 3% threshold

### User Growth Trend
**Type:** chart

**Description:** Line graph showing new user registrations over time


---

## 🔧 Configuration & Environment Variables

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
NEXTAUTH_URL=https://sfg-ai-prompt.abacusai.app
NEXTAUTH_SECRET=<secret_key>

# API Keys
ABACUSAI_API_KEY=<api_key>

# Webhook Security
NEXUS_WEBHOOK_SECRET=<webhook_secret>

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=<measurement_id>
```

### Optional Configuration

```bash
# Feature Flags
ENABLE_USAGE_LIMITS=true
ENABLE_ANALYTICS=true
ENABLE_EMAIL_NOTIFICATIONS=true

# Performance Tuning
API_TIMEOUT_MS=30000
MAX_TEXT_LENGTH=10000
```

---

## 🧪 Testing

### Unit Tests

```bash
cd app && yarn test
```

### Integration Tests

```bash
cd app && yarn test:integration
```

### E2E Tests

```bash
cd app && yarn test:e2e
```

### Extension Testing

1. Load unpacked extension in Chrome
2. Navigate to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `chrome-extension/build` directory

---

## 🚢 Deployment Process

### Web Application Deployment

1. **Build Application**
   ```bash
   cd app && yarn build
   ```

2. **Run Tests**
   ```bash
   yarn test && yarn test:integration
   ```

3. **Deploy to Production**
   ```bash
   # Handled automatically via Abacus.AI platform
   # Push to main branch triggers deployment
   ```

### Chrome Extension Deployment

1. **Build Production Version**
   ```bash
   cd chrome-extension
   ./build.sh --production
   ```

2. **Create Distribution Package**
   ```bash
   zip -r intelligent-text-corrector-v1.2.0.zip build/
   ```

3. **Upload to Chrome Web Store**
   - Visit Chrome Developer Dashboard
   - Upload new version
   - Submit for review

---

## 📞 Support & Contact

### Technical Support

**Project Owner:** Warren Heathcote  
**Email:** warren@sfg-innovations.com  
**Slack:** #sfg-text-corrector-support

### Issue Reporting

- **Bug Reports:** GitHub Issues
- **Feature Requests:** GitHub Discussions
- **Security Issues:** security@sfg-innovations.com (private)

### Documentation

- [Message Handlers](workflows/message-handlers.md) - Webhook event documentation
- [Business Logic](business-logic.json) - Complete capability definitions
- [Webhook Configuration](config/webhooks.json) - Event routing details
- [Communications Setup](config/communications.json) - Email and notification templates

---

## 📝 Version History

### v1.2.0 - 2025-11-10

**Features:**
- Complete V4 registration with NEXUS orchestration
- Chrome extension with right-click context menu
- Password reset functionality
- Business template library
- User preference management
- Comprehensive correction history

**Integrations:**
- NEXUS webhook handlers (3 incoming, 3 outgoing)
- MCP-COMMUNICATIONS integration
- Abacus.AI LLM APIs

**Security:**
- HMAC-SHA256 webhook verification
- JWT session management
- Rate limiting on all endpoints

---

## 📜 License

**Copyright © 2025 SFG Aluminium Limited**  
**All Rights Reserved**

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🏆 NEXUS Integration Status

**Registration Status:** ✅ V4 Compliant - Complete  
**Files Created:** 5/5 mandatory files  
**GitHub Issue:** #{42} (Pending NEXUS Approval)  
**Webhook Endpoint:** https://sfg-ai-prompt.abacusai.app/api/webhooks/nexus  
**Last Verified:** 2025-11-10 21:39:40 UTC

**Compliance Checklist:**
- [x] business-logic.json (10 capabilities, 4 workflows)
- [x] config/webhooks.json (3 incoming, 3 outgoing events)
- [x] config/communications.json (4 templates, 4 notifications, 6 widgets)
- [x] workflows/message-handlers.md (Complete event documentation)
- [x] README.md (Comprehensive project documentation)

---

**Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio  
**Branch:** main  
**Path:** `apps/intelligent-text-corrector/`
