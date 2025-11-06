# SFG Chrome Extension Marketing Website

**Version:** 1.2.0  
**Category:** marketing  
**Status:** ✅ Production Ready  
**Deployed:** https://sfg-chrome.abacusai.app

## Overview

Professional marketing website promoting the SFG Chrome Extension with AI-powered features, mobile notes, and app ecosystem integration. Built with Next.js 14, featuring authentication, partnership sections, and comprehensive feature showcase.

## Key Features

### 🎯 Core Capabilities

- Chrome Extension Promotion - Feature showcase and benefits
- AI-AutoStack Partnership - Advertising and cross-promotion
- Mobile App Promotion - iPhone and Android notes app
- App Ecosystem Dashboard - Third-party app integration requests
- User Authentication - Email/password with NextAuth and Prisma
- Contact Form - Lead generation and inquiries
- Pricing Display - Subscription tiers and features
- Version Management - Update tracking with changelog
- Analytics Integration - Google Analytics 4 ready


### 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Warren Executive Theme
- **Authentication:** NextAuth.js + Prisma
- **Database:** PostgreSQL
- **Hosting:** Abacus.AI Platform

### 🔗 Integrations

- **NEXUS** - Orchestration layer
- **MCP-SALES** - Lead management
- **MCP-COMMUNICATIONS** - Email and notifications
- **Google Analytics 4** - User tracking and insights
- **AI-AutoStack** - Partnership and cross-promotion

## Architecture

### Pages & Routes

```
/                    - Landing page with hero, features, pricing
/auth/signin         - User authentication
/auth/signup         - User registration
/api/auth/[...]      - NextAuth endpoints
/api/app-invitation  - App ecosystem integration API
/api/webhooks/nexus  - NEXUS webhook receiver
```

### Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AppInvitation {
  id          String   @id @default(cuid())
  appName     String
  description String
  email       String
  status      String   @default("pending")
  createdAt   DateTime @default(now())
}
```

## Workflows


### User Registration Flow

New users sign up and access premium features

**Steps:**
1. User visits marketing site
2. User signs up via email/password
3. Account created in PostgreSQL database
4. User receives confirmation
5. User can access protected features


### App Ecosystem Integration Request

Third-party developers request integration with SFG ecosystem

**Steps:**
1. Developer fills out integration form
2. Request submitted to /api/app-invitation
3. Request stored in database
4. Admin reviews integration request
5. Developer receives approval/feedback


### Lead Generation

Potential customers submit inquiries via contact form

**Steps:**
1. User fills out contact form
2. Form data validated
3. Lead information captured
4. Notification sent to sales team
5. Follow-up initiated


## Webhooks & Events

### Incoming Events (from NEXUS)

- **`nexus.app.registered`**: Notification when a new app is registered in the SFG ecosystem
- **`analytics.report.generated`**: Periodic analytics reports from NEXUS


### Outgoing Events (to NEXUS)

- **`user.signup.completed`**: Triggered when a new user successfully signs up
- **`integration.request.submitted`**: Triggered when a developer submits an app integration request
- **`contact.form.submitted`**: Triggered when a visitor submits the contact form


### Webhook Configuration

**Endpoint:** `https://sfg-chrome.abacusai.app/api/webhooks/nexus`  
**Security:** HMAC-SHA256 signature verification  
**Retry Policy:** 3 attempts with exponential backoff

## Deployment

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Environment variables configured

### Environment Variables

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://sfg-chrome.abacusai.app"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
APP_VERSION="1.2.0"
```

### Build & Deploy

```bash
# Install dependencies
yarn install

# Run database migrations
yarn prisma migrate deploy
yarn prisma generate

# Build for production
yarn build

# Start production server
yarn start
```

### Current Deployment

- **URL:** https://sfg-chrome.abacusai.app
- **Platform:** Abacus.AI
- **Status:** Active
- **Last Updated:** 2025-11-06

## Development

### Local Setup

```bash
# Clone repository
git clone https://github.com/sfgaluminium1-spec/sfg-app-portfolio.git
cd sfg-app-portfolio/apps/sfg-marketing-website

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
yarn prisma migrate dev

# Start development server
yarn dev
```

### Testing

```bash
# Run type checking
yarn tsc --noEmit

# Run linting
yarn lint

# Build test
yarn build
```

## Communications

### Email Templates

- **Welcome Email**: Sent to new users after successful signup
- **Integration Request Confirmation**: Sent to developers after submitting integration request
- **Contact Form Acknowledgment**: Sent to visitors after submitting contact form


### Internal Notifications

- **SLACK** (#marketing-leads): New contact form submission
- **SLACK** (#app-ecosystem): New app integration request
- **EMAIL** (admin@sfg-innovations.com): New user signup (daily digest)


### Dashboard Widgets

- **User Signups** (metric): Total new user registrations (daily/weekly/monthly)
- **Conversion Rate** (chart): Visitor-to-signup conversion rate over time
- **Integration Requests** (table): List of pending app integration requests
- **Contact Form Leads** (table): Recent contact form submissions requiring follow-up


## Support & Documentation

- **GitHub Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio
- **Issues:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues
- **Documentation:** See `/workflows/message-handlers.md` for detailed event documentation

## Version History

- **1.2.0** (2025-11-06) - NEXUS integration, complete registration
- **1.1.0** (2025-11-05) - Google Analytics integration, version container
- **1.0.0** (2025-11-04) - Initial production release

---

**Registered:** 2025-11-06  
**Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio  
**Status:** ✅ Production Ready - Awaiting NEXUS Approval
