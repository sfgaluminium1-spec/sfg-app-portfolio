
# SFG App Portfolio - GitHub Integration Plan

**Date**: November 3, 2025  
**Status**: In Progress  
**Repository**: https://github.com/sfgaluminium1-spec/sfg-app-portfolio

---

## 📋 Overview

This document outlines the comprehensive plan for integrating the SFG Marketing Website and all related applications into the sfg-app-portfolio GitHub repository.

---

## 🎯 Objectives

1. ✅ Authenticate with GitHub using GitHub App credentials
2. ✅ Understand existing repository structure
3. 🔄 Integrate SFG Marketing Website as a new app
4. 🔄 Create comprehensive documentation
5. 🔄 Set up CI/CD workflows with GitHub Actions
6. 🔄 Configure automated deployments
7. 🔄 Establish development best practices

---

## 📊 Current Status

### Completed Tasks

- ✅ GitHub App authentication configured
- ✅ Access token obtained and stored securely
- ✅ Repository structure analyzed (apps/, packages/, docs/)
- ✅ Existing applications identified (50+ apps + specialized apps)
- ✅ Repository README content reviewed

### In Progress

- 🔄 Marketing website integration planning
- 🔄 Documentation compilation
- 🔄 GitHub Actions workflow creation

### Pending

- ⏳ Marketing website code push
- ⏳ CI/CD pipeline testing
- ⏳ Automated deployment configuration
- ⏳ Team access and permissions setup

---

## 🏗️ Integration Strategy

### Phase 1: Repository Preparation

#### 1.1 Create App Directory Structure

```bash
sfg-app-portfolio/
└── apps/
    └── sfg-marketing-website/
        ├── app/                    # Next.js app directory
        ├── .gitignore
        ├── package.json
        ├── README.md
        ├── next.config.js
        ├── tailwind.config.ts
        ├── tsconfig.json
        └── .env.example
```

#### 1.2 Update Root Configuration

Update `turbo.json` (if using Turborepo):
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    }
  }
}
```

Update root `package.json`:
```json
{
  "name": "sfg-app-portfolio",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

### Phase 2: Marketing Website Integration

#### 2.1 Prepare Marketing Website Code

1. Clone main repository to temporary location
2. Copy marketing website code to apps/sfg-marketing-website
3. Update paths and configuration for monorepo structure
4. Create .env.example with required variables
5. Update package.json for workspace compatibility

#### 2.2 File Modifications

**Update package.json**:
```json
{
  "name": "@sfg/marketing-website",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Create .env.example**:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sfg_marketing"
DIRECT_URL="postgresql://user:password@localhost:5432/sfg_marketing"

# Authentication
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Application
APP_VERSION="2.0.0"
NODE_ENV="development"
```

**Create README.md**:
```markdown
# SFG Marketing Website

Professional marketing website for SFG Chrome Extension and ecosystem.

## Quick Start

\`\`\`bash
yarn install
yarn dev
\`\`\`

## Environment Variables

Copy `.env.example` to `.env` and configure values.

## Documentation

See `/docs/marketing-website/` for complete documentation.
```

### Phase 3: Documentation Creation

#### 3.1 Documentation Structure

```
docs/
├── README.md                                   # Index of all documentation
├── marketing-website/
│   ├── README.md
│   ├── features.md
│   ├── deployment.md
│   └── api-reference.md
├── chrome-extension/
│   ├── README.md
│   ├── installation.md
│   └── features.md
├── integrations/
│   ├── ai-autostack.md
│   ├── microsoft-365.md
│   ├── xero.md
│   └── logikal.md
├── development/
│   ├── getting-started.md
│   ├── code-standards.md
│   ├── warren-executive-theme.md
│   └── contributing.md
└── deployment/
    ├── marketing-website.md
    ├── chrome-extension.md
    └── ci-cd.md
```

#### 3.2 Copy Existing Documentation

Move existing documentation to docs/ structure:
- AI_AutoStack_Integration_Analysis_Report.md → docs/integrations/ai-autostack.md
- SFG_Application_Inventory_Summary.md → docs/integrations/application-inventory.md
- setup_log.md → docs/deployment/setup-log.md

### Phase 4: GitHub Actions Setup

#### 4.1 Create Workflow Files

**.github/workflows/marketing-website-ci.yml**:
```yaml
name: Marketing Website CI

on:
  pull_request:
    branches: [main, develop]
    paths:
      - 'apps/sfg-marketing-website/**'
  push:
    branches: [main, develop]
    paths:
      - 'apps/sfg-marketing-website/**'

jobs:
  lint-and-test:
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
      
      - name: Type check
        run: |
          cd apps/sfg-marketing-website
          yarn tsc --noEmit
      
      - name: Run tests
        run: |
          cd apps/sfg-marketing-website
          yarn test
```

**.github/workflows/marketing-website-deploy.yml**:
```yaml
name: Deploy Marketing Website

on:
  push:
    branches: [main]
    paths:
      - 'apps/sfg-marketing-website/**'

jobs:
  deploy:
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
      
      - name: Build application
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
        run: |
          cd apps/sfg-marketing-website
          yarn build
      
      - name: Deploy to Abacus.AI
        env:
          ABACUS_API_KEY: ${{ secrets.ABACUS_API_KEY }}
          DEPLOYMENT_HOSTNAME: sfg-chrome.abacusai.app
        run: |
          # Use Abacus.AI deployment script or API
          curl -X POST https://api.abacus.ai/deploy \
            -H "Authorization: Bearer $ABACUS_API_KEY" \
            -d "hostname=$DEPLOYMENT_HOSTNAME" \
            -d "project_path=apps/sfg-marketing-website"
```

#### 4.2 Configure Secrets

Required GitHub Secrets:
- `DATABASE_URL` - Production database connection string
- `DIRECT_URL` - Direct database URL (if different)
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Production URL (https://sfg-chrome.abacusai.app)
- `ABACUS_API_KEY` - Abacus.AI deployment API key
- `AWS_BUCKET_NAME` - S3 bucket (if using cloud storage)
- `STRIPE_SECRET_KEY` - Stripe secret key (if using payments)

### Phase 5: Development Best Practices

#### 5.1 Branch Protection Rules

Configure for `main` and `develop` branches:
- Require pull request reviews (1-2 reviewers)
- Require status checks to pass (CI workflows)
- Require branches to be up to date before merging
- Include administrators in restrictions
- Require linear history

#### 5.2 Code Review Guidelines

Create `.github/PULL_REQUEST_TEMPLATE.md`:
```markdown
## Description
<!-- Brief description of changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
<!-- How has this been tested? -->

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console errors/warnings

## Related Issues
<!-- Link to related issues -->

## Screenshots (if applicable)
<!-- Add screenshots for UI changes -->
```

#### 5.3 Issue Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug Report
about: Report a bug in the application
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
<!-- Clear description of the bug -->

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
<!-- What should happen? -->

## Actual Behavior
<!-- What actually happens? -->

## Environment
- Browser: [e.g. Chrome 118]
- OS: [e.g. macOS 14.0]
- App Version: [e.g. 2.0.0]

## Screenshots
<!-- If applicable -->

## Additional Context
<!-- Any other relevant information -->
```

Create `.github/ISSUE_TEMPLATE/feature_request.md`:
```markdown
---
name: Feature Request
about: Suggest a new feature
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Description
<!-- Clear description of the feature -->

## Problem It Solves
<!-- What problem does this solve? -->

## Proposed Solution
<!-- How should this work? -->

## Alternative Solutions
<!-- Other approaches considered -->

## Additional Context
<!-- Screenshots, mockups, etc. -->
```

---

## 🚀 Execution Plan

### Week 1: Setup & Integration

**Day 1-2: Repository Preparation**
- [ ] Clone main repository to `/home/ubuntu/sfg-app-portfolio-clone`
- [ ] Review and clean up existing structure
- [ ] Set up Turborepo configuration (if not already)
- [ ] Update root package.json and configuration files

**Day 3-4: Marketing Website Integration**
- [ ] Copy marketing website code to apps/sfg-marketing-website
- [ ] Update configuration for monorepo compatibility
- [ ] Create .env.example and documentation
- [ ] Test build process locally

**Day 5: Documentation**
- [ ] Create docs/ structure
- [ ] Move existing documentation
- [ ] Create new documentation files
- [ ] Update main README.md

### Week 2: CI/CD & Deployment

**Day 6-7: GitHub Actions**
- [ ] Create CI workflow for testing and linting
- [ ] Create deployment workflow for production
- [ ] Configure GitHub Secrets
- [ ] Test workflows with pull requests

**Day 8-9: Deployment Configuration**
- [ ] Set up Abacus.AI deployment integration
- [ ] Configure custom domain (sfg-chrome.abacusai.app)
- [ ] Test automated deployment
- [ ] Verify production deployment

**Day 10: Testing & Documentation**
- [ ] End-to-end testing of complete workflow
- [ ] Update documentation with any changes
- [ ] Create developer onboarding guide
- [ ] Finalize and review

---

## 📝 Commit Strategy

### Initial Commits

```bash
# 1. Add marketing website code
git add apps/sfg-marketing-website
git commit -m "feat: add SFG Marketing Website to monorepo

- Add Next.js 14 marketing website
- Configure for monorepo compatibility
- Include Warren Executive Theme styling
- Add authentication and database setup"

# 2. Add documentation
git add docs/
git commit -m "docs: add comprehensive documentation

- Add marketing website documentation
- Include integration guides
- Add development standards
- Include deployment procedures"

# 3. Add GitHub Actions
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflows

- Add CI workflow for testing and linting
- Add deployment workflow for production
- Configure automated deployments"

# 4. Update root configuration
git add package.json turbo.json README.md
git commit -m "chore: update root configuration for new apps

- Update root package.json
- Configure Turborepo
- Update main README"
```

---

## 🔒 Security Considerations

### Secrets Management

1. **Never Commit Secrets**:
   - Use .gitignore for .env files
   - Use GitHub Secrets for CI/CD
   - Rotate secrets regularly (every 90 days)

2. **Environment Variables**:
   - Store sensitive data in GitHub Secrets
   - Use .env.example as template
   - Document required variables

3. **Access Control**:
   - Limit repository access to authorized users
   - Use GitHub teams for permission management
   - Enable 2FA for all contributors

### Code Security

1. **Dependency Scanning**:
   - Enable Dependabot alerts
   - Configure automated security updates
   - Regular dependency audits

2. **Code Scanning**:
   - Enable CodeQL analysis
   - Configure SAST tools
   - Regular security reviews

---

## 📊 Success Metrics

### Technical Metrics

- ✅ All tests passing
- ✅ Build time < 5 minutes
- ✅ Deployment time < 10 minutes
- ✅ Zero critical vulnerabilities
- ✅ Code coverage > 80%

### Process Metrics

- ✅ Pull requests merged within 24 hours
- ✅ CI/CD success rate > 95%
- ✅ Automated deployments successful
- ✅ Documentation complete and up-to-date

---

## 🆘 Rollback Plan

If integration issues occur:

1. **Immediate Rollback**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Restore from Backup**:
   - Use last known good commit
   - Restore database from backup
   - Verify application functionality

3. **Communication**:
   - Notify team of rollback
   - Document issues encountered
   - Plan remediation steps

---

## 📞 Support & Contact

- **GitHub Issues**: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues
- **Email**: support@sfginnovations.com
- **Teams Channel**: #sfg-development

---

## ✅ Checklist

### Pre-Integration
- [x] GitHub App authentication configured
- [x] Repository structure analyzed
- [x] Integration strategy documented
- [ ] Team notified of integration plan

### Integration
- [ ] Marketing website code copied
- [ ] Configuration updated for monorepo
- [ ] Documentation created
- [ ] Tests passing locally

### CI/CD
- [ ] GitHub Actions workflows created
- [ ] Secrets configured
- [ ] Automated deployments tested
- [ ] Branch protection rules configured

### Post-Integration
- [ ] Production deployment successful
- [ ] Documentation complete
- [ ] Team trained on new workflow
- [ ] Monitoring and alerts configured

---

**Status**: Ready to execute  
**Next Steps**: Begin Phase 1 - Repository Preparation  
**Estimated Completion**: November 15, 2025
