# SFG Aluminium Dashboard

**Version:** 1.0.0  
**Status:** Ready for Registration  
**Type:** Internal Dashboard & Integration Hub

## Overview

The SFG Aluminium Dashboard is a unified application inventory and integration portal designed to manage and monitor all SFG applications and their integrations.

## Features

- 🔐 **Secure Authentication** - NextAuth.js with credentials provider
- 📊 **Application Inventory** - Track and manage all SFG applications
- 🔗 **Integration Hub** - Monitor integrations in real-time
- 🔔 **Webhook Management** - Receive and process webhook events
- 💬 **Message Handlers** - Bi-directional communication with other apps
- 🤖 **GitHub Integration** - Self-registration capability

## Technology Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **UI Library:** Shadcn UI + Radix UI
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
cd app
npm install
```

### Environment Variables

Create a `.env` file in the `app` directory:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/sfgdashboard"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Webhooks
- `POST /api/webhooks/github` - Receive GitHub events

### Message Handlers
- `POST /api/messages/handle` - Handle incoming messages

### Registration
- `POST /api/registration/execute` - Execute self-registration

### Health Check
- `GET /api/health` - Application health status

## Project Structure

```
app/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Dashboard pages
│   └── page.tsx              # Home page
├── components/               # React components
├── lib/                      # Utilities and helpers
├── prisma/                   # Database schema
└── public/                   # Static assets
```

## Documentation

- [Registration Document](./REGISTRATION.md) - Complete registration details
- [Prisma Schema](./app/prisma/schema.prisma) - Database models

## Registration Status

See [REGISTRATION.md](./REGISTRATION.md) for complete registration details.

---

**Maintained by:** SFG Aluminium Ltd  
**Contact:** warren@sfgaluminium.co.uk  
**Repository:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio
