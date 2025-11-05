# SFG Communications Hub

## 🎯 Purpose

Centralized communications management platform for SFG Aluminium, handling email accounts, WhatsApp Business, Google Chat, and team collaboration tools.

## 📋 App Information

- **App Name:** SFG-CommunicationsHub
- **Version:** 1.0.0
- **Status:** Production
- **Deployed URL:** https://sfgcomms-hub.abacusai.app
- **Platform:** Next.js 14.2.28 + PostgreSQL + Prisma ORM

## 🎯 Capabilities

- Centralized email account management (14 accounts across Exchange & Gmail)
- Multi-client email configuration and management
- Role-based access control (Admin: Warren/Yanika, Staff: team members)
- AI-powered email triage (<5s processing time)
- Real-time communication monitoring and analytics
- WhatsApp Business integration for customer communications
- Google Chat integration for team collaboration
- Mobile app recommendations and configuration guides
- Client-specific settings management (Outlook, Spark, Mailspring, Apple Mail, Gmail, Thunderbird)
- System health monitoring and progress tracking
- Authentication and session management via NextAuth.js

## 🔄 Workflows

### Email Account Onboarding
**Trigger:** Admin action
**Steps:**
1. Admin creates new email account entry
1. System validates email provider (Exchange/Gmail)
1. Account credentials configured
1. Client preferences set
1. Mobile app recommendations generated
1. Team members granted access based on role
1. Account added to dashboard
**Outputs:** Account configured, Team notified, Client setup guide generated

### Email Triage & Routing
**Trigger:** Incoming email
**Steps:**
1. Email received in monitored account
1. AI analyzes content, urgency, and category
1. Email tagged and prioritized
1. Appropriate team member notified
1. Response templates suggested
1. Follow-up scheduled if needed
**Outputs:** Email categorized, Team notified, Response drafted

### Client Configuration
**Trigger:** User selects email client
**Steps:**
1. User selects email client (desktop/mobile)
1. System generates platform-specific configuration
1. Setup instructions displayed
1. Direct links to client downloads/app stores
1. Configuration validated
1. User confirms setup complete
**Outputs:** Client configured, Setup guide generated, Login credentials provided

### WhatsApp Business Message Handling
**Trigger:** WhatsApp message received
**Steps:**
1. Customer message received via WhatsApp Business
1. AI analyzes message intent
1. Message routed to appropriate department
1. Team member notified
1. Response sent via WhatsApp
1. Conversation logged in system
**Outputs:** Message routed, Team notified, Response sent


## 📊 Business Rules

- **Role-based access control**: Grant full system access including user management, account configuration, and system settings when `user.role == 'ADMIN'`
- **Email account limits**: Allow new account creation when `email_accounts.count <= 14`
- **AI triage performance**: Process email immediately when `processing_time < 5000ms`
- **Real-time updates**: Push live updates to dashboard when `websocket_connected`
- **Session security**: Allow dashboard access when `session_valid && authenticated`

## 🔗 Integration Points

- **Microsoft 365 / Exchange**: Email account integration (Status: active)
- **Gmail / Google Workspace**: Email account integration (Status: active)
- **WhatsApp Business API**: Customer messaging (Status: planned)
- **Google Chat API**: Team collaboration (Status: planned)
- **SharePoint**: Document storage and retrieval (Status: planned)
- **Xero**: Financial data sync for customer communications (Status: planned)
- **MCP-COMMUNICATIONS**: Communication tools and templates (Status: planned)
- **NEXUS**: Orchestration and event coordination (Status: planned)

## 🔔 Webhook Events

This app listens for and processes the following events:

- `communication.email_received`
- `communication.email_sent`
- `communication.whatsapp_received`
- `communication.urgent_message`
- `communication.account_added`
- `communication.account_configured`
- `customer.message_received`
- `customer.enquiry_created`
- `team.notification_required`

## 💬 Supported Messages

This app can respond to the following message types:

- `query.email_account_status`
- `query.communication_stats`
- `query.team_availability`
- `action.send_email`
- `action.send_whatsapp`
- `action.notify_team`
- `action.create_communication_record`

## 🔐 Authentication

- **Method:** NextAuth.js with email/password
- **Admin Users:** Warren Heathcote, Yanika
- **Role-based Access:** Admin (full access), Staff (limited access)

## 📁 Database Schema

### Users
- id, email, password (hashed), name, role (ADMIN/USER)

### EmailAccounts
- id, email, provider, department, status, config

### EmailClients
- id, name, platform, category, features

### ClientConfigurations
- id, userId, emailAccountId, clientId, settings

### SystemProgress
- id, phase, status, completion_percentage, metrics

## 🚀 API Endpoints

### Webhooks
- **POST** `/api/webhooks/nexus` - Receive events from NEXUS

### Message Handler
- **POST** `/api/messages/handle` - Handle requests from NEXUS/other apps

### Email Accounts
- **GET** `/api/email-accounts` - List all email accounts
- **POST** `/api/email-accounts` - Create new account (Admin only)
- **PATCH** `/api/email-accounts/[id]` - Update account

### Email Clients
- **GET** `/api/email-clients` - List available clients
- **POST** `/api/email-clients` - Add new client (Admin only)

### WhatsApp
- **POST** `/api/whatsapp/send` - Send WhatsApp message
- **POST** `/api/whatsapp/webhook` - Receive WhatsApp webhooks

### Google Chat
- **POST** `/api/google-chat/send` - Send Google Chat message
- **POST** `/api/google-chat/webhook` - Receive Google Chat webhooks

## 📊 Real-time Features

- WebSocket connections for live dashboard updates
- Real-time email triage monitoring
- Live system health metrics
- Instant notifications

## 🎨 Tech Stack

- **Frontend:** Next.js 14.2.28, React 18.2.0, TypeScript
- **UI:** Tailwind CSS, shadcn/ui, Radix UI
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Real-time:** WebSocket (ws library)
- **Deployment:** Abacus.AI Platform

## 📝 Registration Details

- **Registered:** 2025-11-05 05:10:07
- **Registered By:** DeepAgent - Comet
- **Category:** sfg-aluminium-app
- **Subcategory:** communications

---

**Maintained by SFG Aluminium IT Team**
