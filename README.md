
# SFG App Portfolio - Comprehensive Documentation

**Last Updated**: November 3, 2025  
**Repository**: https://github.com/sfgaluminium1-spec/sfg-app-portfolio  
**Maintainer**: SFG Innovations Team

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Repository Structure](#repository-structure)
3. [Key Applications](#key-applications)
4. [Marketing Website](#marketing-website)
5. [Chrome Extension](#chrome-extension)
6. [Application Inventory](#application-inventory)
7. [AI-AutoStack Integration](#ai-autostack-integration)
8. [Development Standards](#development-standards)
9. [Deployment](#deployment)
10. [Contributing](#contributing)

---

## 🎯 Overview

The SFG App Portfolio is a comprehensive monorepo containing all SFG Aluminium applications, tools, and integrations. This repository serves as the central hub for the SFG ecosystem, including web applications, Chrome extensions, mobile apps, and enterprise integrations.

### Key Components

- **SFG Marketing Website**: Next.js 14 marketing site with AI-AutoStack partnership showcase
- **SFG Chrome Extension**: AI-powered browser extension for productivity and document management
- **50+ Specialized Applications**: From app-001 to app-050, each serving specific business functions
- **Enterprise Integrations**: Microsoft 365, Xero, Logikal, and more
- **AI Infrastructure**: Powered by Abacus.AI with advanced AI/ML capabilities

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Node.js, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth, Microsoft 365 SSO
- **AI/ML**: Abacus.AI, OpenAI integration
- **Styling**: Tailwind CSS, Warren Executive Theme
- **Deployment**: Vercel, Abacus.AI hosting

---

## 📁 Repository Structure

```
sfg-app-portfolio/
├── apps/
│   ├── app-001/                # Specialized application 1
│   ├── app-002/                # Specialized application 2
│   ├── ...
│   ├── app-050/                # Specialized application 50
│   ├── chronoshift-pro/        # Time management application
│   ├── sfg-company-wiki/       # Internal documentation system
│   ├── sfg-esp/                # ESP integration
│   └── sfg-marketing-website/  # Marketing website (NEW)
├── packages/
│   ├── shared-ui/              # Shared UI components (Warren Executive Theme)
│   ├── shared-utils/           # Shared utility functions
│   └── shared-config/          # Shared configuration files
├── docs/
│   ├── integration-guides/     # Integration documentation
│   ├── api-reference/          # API documentation
│   └── deployment/             # Deployment guides
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
├── package.json                # Root package.json
├── turbo.json                  # Turborepo configuration
└── README.md                   # This file
```

---

## 🌐 Key Applications

### SFG Marketing Website

**Status**: ✅ Production  
**Deployment**: https://sfg-chrome.abacusai.app  
**Technology**: Next.js 14, TypeScript, Tailwind CSS

The SFG Marketing Website is a professional, modern marketing site promoting the SFG Chrome Extension, AI-AutoStack partnership, mobile notes, and app ecosystem.

#### Features

- **Hero Section**: Compelling introduction with CTA buttons
- **Chrome Extension Showcase**: Feature highlights and download links
- **AI-AutoStack Partnership**: Cross-promotion and integration benefits
- **Mobile Notes**: iPhone and Android app information
- **App Ecosystem**: Generic third-party app integration showcase
- **Pricing**: Transparent pricing tiers (Free, Professional, Enterprise)
- **Contact Form**: Lead generation and inquiry management

#### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth with email/password
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with Warren Executive Theme
- **UI Components**: Radix UI, Shadcn UI
- **Forms**: React Hook Form with Zod validation

#### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://sfg-chrome.abacusai.app"

# App Version
APP_VERSION="2.0.0"

# AWS S3 (Optional)
AWS_BUCKET_NAME=""
AWS_FOLDER_PREFIX=""

# Stripe (Optional)
STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
```

#### Local Development

```bash
cd apps/sfg-marketing-website/app
yarn install
yarn dev
```

#### Deployment

The marketing website is deployed on Abacus.AI hosting with the following configuration:

- **Hostname**: sfg-chrome.abacusai.app
- **Branch**: main
- **Build Command**: `yarn build`
- **Start Command**: `yarn start`
- **Node Version**: 18.x

---

### SFG Chrome Extension

**Status**: ✅ Production  
**Versions**: Multiple fixed versions available  
**Technology**: JavaScript, Chrome Extension API

The SFG Chrome Extension is an AI-powered productivity tool that enhances web browsing with features like:

- **AI Text Processing**: Grammar check, rewriting, summarization
- **Bookmark Management**: Smart organization and duplicate detection
- **Password Tools**: Secure password generation and storage
- **Quick Actions**: Dashboard, analytics, and templates
- **Context Menu Integration**: Right-click access to all features

#### Installation

See `/chrome_enhancement/INSTALLATION_GUIDE.md` for detailed installation instructions.

---

## 📊 Application Inventory

The SFG ecosystem includes extensive integrations with enterprise systems:

### Core Business Systems

| Application | Status | Authentication | Purpose |
|------------|--------|----------------|---------|
| Microsoft 365 | ✅ Production | OAuth 2.0 | Email, SharePoint, Teams |
| Xero Accounting | ✅ Production | OAuth 2.0 | Financial management |
| Logikal (BM Aluminium) | ✅ Production | API Key | Pricing and drawings |
| Companies House | ✅ Configured | API Key | Company verification |
| Twilio | ✅ Configured | Account SID | SMS notifications |

### Base Number System

SFG uses a unique Base Number system for document lifecycle management:

**Format**: `BASE-YYYY-NNNNN`  
**Example**: `BASE-2025-00001`

**Document Prefixes**:
- **ENQ** → Enquiry Received
- **QUO** → Quote Prepared & Sent
- **PO** → Purchase Order Confirmed
- **PROD** → In Production
- **DEL** → Delivered
- **INV** → Invoice Generated
- **PAID** → Payment Received

### Customer Tier System

| Tier | Name | Payment Terms | Credit Check |
|------|------|---------------|--------------|
| Tier 1 | VIP | Net 7 days | Excellent |
| Tier 2 | Preferred | Net 14 days | Good |
| Tier 3 | Standard | Net 30 days | Satisfactory |
| Tier 4 | New | Payment Upfront/COD | Unknown |
| Tier 5 | Watch List | Payment Upfront Only | Poor |

For complete application inventory details, see:
- `/docs/SFG_Complete_Application_Inventory.md`
- `/docs/SFG_Application_Inventory_Summary.md`

---

## 🤝 AI-AutoStack Integration

**Partnership Status**: ✅ Active  
**Platform**: https://Ai-AutoStack.abacusai.app

The AI-AutoStack integration provides:

### Integration Points

1. **Workflow Automation**: Browser actions trigger AI-AutoStack workflows
2. **Data Processing**: Extension collects data → AI-AutoStack analyzes
3. **Cross-Platform Sync**: Real-time synchronization across devices
4. **AI-Powered Insights**: Advanced analytics and recommendations

### Technical Architecture

```
SFG Chrome Extension → Cloud Storage/API → AI-AutoStack
                    ↑                    ↓
                WebSocket Server ← → AI Workflows
```

### Implementation

- **API Integration**: RESTful APIs for data exchange
- **WebSocket**: Real-time communication
- **Webhook Integration**: Automated workflow triggers
- **DeepAgent Integration**: Advanced AI processing

For complete integration analysis, see:
- `/docs/AI_AutoStack_Integration_Analysis_Report.md`

---

## 🛠️ Development Standards

### Warren Executive Theme

All SFG applications must follow the Warren Executive Theme design system:

**Core Principles**:
- Professional, modern aesthetic
- Consistent color palette and typography
- Responsive design for all devices
- Accessibility-first approach

**Theme Files**:
- `/docs/warren_executive_theme_complete.pdf`
- `/chrome_enhancement/warren-executive-theme.css`

### Code Standards

```typescript
// TypeScript strict mode
"strict": true,
"strictNullChecks": true,
"noImplicitAny": true

// ESLint configuration
"extends": [
  "next/core-web-vitals",
  "plugin:@typescript-eslint/recommended"
]

// Prettier formatting
"semi": true,
"trailingComma": "es5",
"singleQuote": false,
"tabWidth": 2
```

### Microfrontends & Module Federation

- **Standard**: Use Microfrontends/Module Federation for all internal integrations
- **NO iframes**: Except for untrusted 3rd-party content
- **Benefits**: Unified UX, shared dependencies, independent deployments

### Security Requirements

- **Authentication**: Microsoft 365 SSO for all user-facing apps
- **API Keys**: Rotated every 90 days, never exposed client-side
- **Data Encryption**: AES-256 at rest
- **GDPR Compliance**: Via M365 privacy controls

---

## 🚀 Deployment

### Marketing Website Deployment

**Current Deployment**:
```bash
# Abacus.AI hosting
Hostname: sfg-chrome.abacusai.app
Branch: main
Build: Automatic on push
```

**Manual Deployment**:
```bash
cd apps/sfg-marketing-website
yarn build
yarn deploy
```

### Chrome Extension Deployment

```bash
# Package extension
cd chrome_enhancement/sfg_chrome_extension
zip -r sfg-chrome-extension.zip .

# Upload to Chrome Web Store
# Follow: /chrome_enhancement/INSTALLATION_GUIDE.md
```

### CI/CD Pipeline

GitHub Actions workflows are configured for:
- Automated testing on PR
- Automated deployment on merge to main
- Version management and release tagging

---

## 👥 Contributing

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sfgaluminium1-spec/sfg-app-portfolio.git
cd sfg-app-portfolio
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp apps/sfg-marketing-website/.env.example apps/sfg-marketing-website/.env
# Edit .env with your values
```

4. Start development server:
```bash
yarn dev
```

### Branching Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/\***: New features
- **bugfix/\***: Bug fixes
- **hotfix/\***: Critical production fixes

### Pull Request Process

1. Create feature branch from `develop`
2. Make your changes with clear commit messages
3. Run tests: `yarn test`
4. Push and create PR to `develop`
5. Wait for CI checks and review
6. Merge after approval

---

## 📚 Additional Documentation

### Key Documents

- **Application Inventory**: `/docs/SFG_Complete_Application_Inventory.md`
- **Integration Analysis**: `/docs/AI_AutoStack_Integration_Analysis_Report.md`
- **Setup Log**: `/docs/setup_log.md`
- **Extension Guide**: `/chrome_enhancement/EXTENSION_SETUP_GUIDE.md`
- **Warren Theme**: `/docs/warren_executive_theme_complete.pdf`
- **Core Directive**: `/docs/DeepAgent_ChatLLM_Core_Directive.txt`

### API Documentation

- Base Number API: `/docs/api-reference/base-numbers.md`
- Customer Management API: `/docs/api-reference/customers.md`
- Document Lifecycle API: `/docs/api-reference/documents.md`
- Workflow API: `/docs/api-reference/workflows.md`

---

## 📞 Support

For questions, issues, or contributions:

- **Email**: support@sfginnovations.com
- **GitHub Issues**: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues
- **Teams Channel**: #sfg-development
- **Documentation**: https://docs.sfginnovations.com

---

## 📄 License

Proprietary - SFG Innovations © 2025. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: November 3, 2025  
**Next Review**: December 1, 2025
