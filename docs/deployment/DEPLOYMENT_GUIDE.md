
# SFG App Portfolio - Deployment Guide

**Version**: 1.0.0  
**Date**: November 3, 2025  
**Target Audience**: DevOps Engineers, System Administrators, Developers

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Marketing Website Deployment](#marketing-website-deployment)
5. [Chrome Extension Deployment](#chrome-extension-deployment)
6. [Database Setup](#database-setup)
7. [GitHub Actions CI/CD](#github-actions-cicd)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide covers deployment procedures for all SFG App Portfolio applications, with a focus on the SFG Marketing Website and Chrome Extension.

### Deployment Targets

- **Production**: sfg-chrome.abacusai.app (Marketing Website)
- **Staging**: staging.sfg-chrome.abacusai.app (Optional)
- **Development**: localhost:3000

---

## ✅ Prerequisites

### Required Tools

```bash
# Node.js & Yarn
node >= 18.0.0
yarn >= 1.22.0

# Git
git >= 2.30.0

# Database
PostgreSQL >= 14.0

# Optional (for local development)
Docker >= 20.10.0
docker-compose >= 2.0.0
```

### Access Requirements

- GitHub repository access (sfg-app-portfolio)
- Abacus.AI account with deployment permissions
- Database credentials (production/staging)
- API keys for third-party services:
  - Companies House API
  - Twilio Account SID & Auth Token
  - Microsoft 365 credentials (for SharePoint, Xero integrations)

---

## 🔧 Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/sfgaluminium1-spec/sfg-app-portfolio.git
cd sfg-app-portfolio
```

### 2. Install Dependencies

```bash
# Install root dependencies
yarn install

# Install workspace dependencies
yarn workspaces foreach install
```

### 3. Configure Environment Variables

#### Marketing Website (.env)

Create `apps/sfg-marketing-website/.env`:

```bash
# ====================================
# DATABASE CONFIGURATION
# ====================================
DATABASE_URL="postgresql://user:password@host:5432/sfg_marketing?schema=public"
DIRECT_URL="postgresql://user:password@host:5432/sfg_marketing?schema=public"

# ====================================
# AUTHENTICATION
# ====================================
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://sfg-chrome.abacusai.app"

# ====================================
# APPLICATION
# ====================================
APP_VERSION="2.0.0"
NODE_ENV="production"

# ====================================
# AWS S3 (OPTIONAL)
# ====================================
AWS_BUCKET_NAME=""
AWS_FOLDER_PREFIX=""

# ====================================
# STRIPE (OPTIONAL)
# ====================================
STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# ====================================
# ANALYTICS (OPTIONAL)
# ====================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
```

#### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🌐 Marketing Website Deployment

### Option 1: Abacus.AI Hosting (Recommended)

#### Prerequisites

1. Abacus.AI account with deployment permissions
2. GitHub repository connected to Abacus.AI

#### Steps

1. **Login to Abacus.AI**:
   - Navigate to https://apps.abacus.ai
   - Go to DeepAgent → App Management

2. **Connect GitHub Repository**:
   - Click "Connect Repository"
   - Select `sfg-app-portfolio`
   - Authorize GitHub App

3. **Configure Project**:
   ```
   Project Path: apps/sfg-marketing-website/app
   Build Command: yarn build
   Start Command: yarn start
   Node Version: 18.x
   Environment Variables: [See above]
   ```

4. **Set Custom Domain**:
   - Navigate to Domain Settings
   - Add custom domain: `sfg-chrome.abacusai.app`
   - Follow DNS configuration instructions

5. **Deploy**:
   - Click "Deploy"
   - Monitor deployment logs
   - Verify at https://sfg-chrome.abacusai.app

#### Automatic Deployments

Configure automatic deployments on push:
- Go to Deployment Settings
- Enable "Auto Deploy on Push"
- Select branch: `main`

### Option 2: Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd apps/sfg-marketing-website
vercel --prod

# Set environment variables
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
# ... add all other variables
```

### Option 3: Docker Deployment

#### Build Docker Image

Create `apps/sfg-marketing-website/Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Deploy with Docker

```bash
# Build image
docker build -t sfg-marketing-website:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e NEXTAUTH_SECRET="..." \
  -e NEXTAUTH_URL="https://sfg-chrome.abacusai.app" \
  sfg-marketing-website:latest

# Or use docker-compose
docker-compose up -d
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14
    environment:
      POSTGRES_USER: sfg_user
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: sfg_marketing
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

---

## 🔌 Chrome Extension Deployment

### Prerequisites

- Chrome Developer Account
- Extension packaged and tested
- All assets and icons prepared

### Steps

1. **Package Extension**:
```bash
cd chrome_enhancement/sfg_chrome_extension
zip -r sfg-chrome-extension-v2.0.zip .
```

2. **Upload to Chrome Web Store**:
   - Navigate to https://chrome.google.com/webstore/devconsole
   - Click "New Item"
   - Upload `sfg-chrome-extension-v2.0.zip`
   - Fill in store listing details:
     - Name: "SFG Chrome Extension"
     - Description: "AI-powered productivity tools..."
     - Category: Productivity
     - Screenshots: Add 5+ screenshots
     - Icon: 128x128 PNG

3. **Configure Permissions**:
   - Review requested permissions
   - Add privacy policy URL
   - Set content security policy

4. **Submit for Review**:
   - Click "Submit for Review"
   - Wait 1-3 business days
   - Monitor review status

5. **Publish**:
   - Once approved, click "Publish"
   - Extension goes live within hours

### Enterprise Distribution

For internal distribution without Chrome Web Store:

1. **Enable Developer Mode**:
   - Chrome → Settings → Extensions
   - Toggle "Developer mode"

2. **Load Unpacked**:
   - Click "Load unpacked"
   - Select `sfg_chrome_extension` directory

3. **Enterprise Policy** (for company-wide deployment):
   - Use Chrome Enterprise Policy
   - Add extension ID to force-install list
   - Deploy via Group Policy or MDM

---

## 💾 Database Setup

### PostgreSQL Setup

#### Option 1: Managed Database (Recommended)

Use a managed PostgreSQL service:
- AWS RDS
- Google Cloud SQL
- Heroku Postgres
- Supabase
- Neon

#### Option 2: Self-Hosted

```bash
# Install PostgreSQL 14
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-14 postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

```sql
CREATE DATABASE sfg_marketing;
CREATE USER sfg_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE sfg_marketing TO sfg_user;
\q
```

### Prisma Migration

```bash
cd apps/sfg-marketing-website

# Generate Prisma Client
yarn prisma generate

# Run migrations
yarn prisma migrate deploy

# Seed database (if needed)
yarn prisma db seed
```

### Database Backup

```bash
# Manual backup
pg_dump -U sfg_user -h localhost sfg_marketing > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backup (cron)
0 2 * * * pg_dump -U sfg_user -h localhost sfg_marketing > /backups/sfg_$(date +\%Y\%m\%d).sql
```

---

## ⚙️ GitHub Actions CI/CD

### Workflow Configuration

Create `.github/workflows/deploy-marketing-website.yml`:

```yaml
name: Deploy Marketing Website

on:
  push:
    branches:
      - main
    paths:
      - 'apps/sfg-marketing-website/**'
  pull_request:
    branches:
      - main
    paths:
      - 'apps/sfg-marketing-website/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: |
          cd apps/sfg-marketing-website
          yarn install --frozen-lockfile
      
      - name: Run linter
        run: |
          cd apps/sfg-marketing-website
          yarn lint
      
      - name: Run type check
        run: |
          cd apps/sfg-marketing-website
          yarn tsc --noEmit
      
      - name: Run tests
        run: |
          cd apps/sfg-marketing-website
          yarn test

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: |
          cd apps/sfg-marketing-website
          yarn install --frozen-lockfile
      
      - name: Build application
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
        run: |
          cd apps/sfg-marketing-website
          yarn build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: apps/sfg-marketing-website/.next

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: apps/sfg-marketing-website/.next
      
      - name: Deploy to Abacus.AI
        env:
          ABACUS_API_KEY: ${{ secrets.ABACUS_API_KEY }}
        run: |
          # Custom deployment script
          ./scripts/deploy-to-abacus.sh
```

### Required Secrets

Add these secrets in GitHub Settings → Secrets:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ABACUS_API_KEY`
- `AWS_BUCKET_NAME` (optional)
- `STRIPE_SECRET_KEY` (optional)

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check website status
curl https://sfg-chrome.abacusai.app/api/health

# Expected response
{"status":"ok","timestamp":"2025-11-03T12:00:00.000Z"}
```

### Logging

#### Application Logs

```bash
# View logs (Abacus.AI)
# Navigate to App Management → Logs

# View logs (Docker)
docker logs -f sfg-marketing-website

# View logs (systemd)
journalctl -u sfg-marketing-website -f
```

#### Log Aggregation

Set up log aggregation with:
- Datadog
- New Relic
- LogRocket
- Sentry (error tracking)

### Performance Monitoring

```javascript
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### Database Maintenance

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('sfg_marketing'));

-- Vacuum and analyze
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE sfg_marketing;
```

---

## 🔧 Troubleshooting

### Common Issues

#### Build Failures

**Issue**: `yarn build` fails with TypeScript errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf .next node_modules
yarn install
yarn build
```

#### Database Connection Issues

**Issue**: "Can't reach database server"

**Solution**:
```bash
# Check database connection
psql -U sfg_user -h localhost -d sfg_marketing

# Verify environment variables
echo $DATABASE_URL

# Test Prisma connection
yarn prisma db pull
```

#### Authentication Errors

**Issue**: "Invalid token" or "Session expired"

**Solution**:
```bash
# Regenerate NEXTAUTH_SECRET
openssl rand -base64 32

# Clear session storage
# In browser: DevTools → Application → Clear storage

# Restart application
yarn dev
```

#### Deployment Timeouts

**Issue**: Deployment hangs or times out

**Solution**:
```bash
# Increase build timeout
# In vercel.json or deployment config
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxDuration": 120
      }
    }
  ]
}
```

### Support Channels

- **GitHub Issues**: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues
- **Email**: support@sfginnovations.com
- **Teams**: #sfg-devops

---

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Migration Guide](https://www.prisma.io/docs/guides/deployment)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Abacus.AI Documentation](https://abacus.ai/help)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Version**: 1.0.0  
**Last Updated**: November 3, 2025  
**Next Review**: December 1, 2025
