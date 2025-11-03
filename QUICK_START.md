
# 🚀 Quick Start Guide - GitHub Integration

## For Repository Admins

### 1. Enable Workflow Permissions (2 minutes)
```
1. Visit: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/settings/installations
2. Click on "SFG GitHub App"
3. Scroll to "Permissions" → Grant "workflows" read & write
4. Save changes
```

### 2. Configure Secrets (3 minutes)
```
Visit: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/settings/secrets/actions

Add these secrets:
- DATABASE_URL: Your PostgreSQL connection string
- NEXTAUTH_SECRET: Generate with: openssl rand -base64 32
- NEXTAUTH_URL: https://sfg-chrome.abacusai.app
```

### 3. Push Workflows (1 minute)
```bash
cd /home/ubuntu/sfg_marketing_website
git add .github/workflows/
git commit -m "feat: Add GitHub Actions CI/CD workflows"
TOKEN=$(python3 /home/ubuntu/.github-credentials/get_token.py)
git push origin master:feature/marketing-website
```

### 4. Create Pull Request
```
Visit: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/pull/new/feature/marketing-website
- Review changes
- Merge to main
```

---

## For Developers

### Clone & Setup
```bash
git clone https://github.com/sfgaluminium1-spec/sfg-app-portfolio.git
cd sfg-app-portfolio
git checkout feature/marketing-website
cd app
yarn install
```

### Development
```bash
# Start dev server
yarn dev

# Run tests
yarn lint
yarn tsc --noEmit

# Build
yarn build
```

### Create Feature
```bash
git checkout -b feature/your-feature
# Make changes
git add .
git commit -m "feat: your feature"
git push origin feature/your-feature
# Create PR on GitHub
```

---

## Quick Links

- **Repository**: https://github.com/sfgaluminium1-spec/sfg-app-portfolio
- **Issues**: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues
- **Live Site**: https://sfg-chrome.abacusai.app
- **Full Report**: See `GITHUB_INTEGRATION_REPORT.md`

---

## Need Help?

- Check the full integration report: `GITHUB_INTEGRATION_REPORT.md`
- View README: `README.md`
- Create an issue: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues/new/choose
