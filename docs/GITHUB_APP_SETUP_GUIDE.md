# GitHub App Setup Guide for Warren

## ⚠️ CRITICAL: This is the #1 Priority Task

**Status:** 🔴 BLOCKING - Week 2 cannot begin until this is complete  
**Time Required:** 1 hour  
**Complexity:** Medium  
**Prerequisites:** GitHub account with admin access to sfgaluminium1-spec

---

## Why This is Critical

The GitHub App is required for satellite applications to:
1. **Authenticate** with GitHub to access the sfg-app-portfolio repository
2. **Register themselves** autonomously by creating files and issues
3. **Backup their code** to the repository
4. **Communicate** with NEXUS for orchestration

**Without this, Week 2 cannot proceed** - no apps can register themselves.

---

## Step-by-Step Instructions

### Step 1: Navigate to GitHub App Creation

1. Open your browser
2. Go to: https://github.com/organizations/sfgaluminium1-spec/settings/apps/new
   - Or navigate manually: GitHub → Organizations → sfgaluminium1-spec → Settings → Developer settings → GitHub Apps → New GitHub App

3. Log in with sfgaluminium1-spec account if prompted

### Step 2: Configure Basic Information

Fill in the following fields:

| Field | Value |
|-------|-------|
| **GitHub App name** | `SFG Satellite Apps` |
| **Description** | `Automated access for SFG Aluminium satellite applications to register and sync code to the sfg-app-portfolio repository. Part of the SFG AI orchestration system managed by SFG-Nexus.` |
| **Homepage URL** | `https://sfg-nexus.abacusai.app` |
| **Webhook URL** | `https://sfg-nexus.abacusai.app/api/github-webhook` |
| **Webhook secret** | Click "Generate" and **SAVE THIS IMMEDIATELY** |

### Step 3: Set Permissions

Under "Repository permissions", set:

| Permission | Access |
|------------|--------|
| **Contents** | Read and write ✅ |
| **Issues** | Read and write ✅ |
| **Metadata** | Read-only (auto-selected) ✅ |

All other permissions: Leave as "No access"

### Step 4: Subscribe to Events

Under "Subscribe to events", check:

- ✅ Push
- ✅ Issues
- ✅ Issue comment

Leave all others unchecked.

### Step 5: Installation Scope

Under "Where can this GitHub App be installed?":

- Select: ⚪ **Only on this account** (sfgaluminium1-spec)

### Step 6: Create the GitHub App

1. Click the green **"Create GitHub App"** button at the bottom
2. You'll be redirected to the app's settings page
3. **IMPORTANT:** Copy the **App ID** shown at the top (you'll need this)

### Step 7: Generate Client Secret

1. On the app settings page, scroll to "Client secrets"
2. Click **"Generate a new client secret"**
3. **SAVE THIS IMMEDIATELY** - you can only see it once
4. Copy the **Client ID** as well (in the "About" section)

### Step 8: Generate Private Key

1. On the app settings page, scroll to "Private keys"
2. Click **"Generate a private key"**
3. A `.pem` file will download to your computer
4. **SAVE THIS FILE SECURELY** - you cannot download it again
5. Open the file in a text editor and copy its entire contents

### Step 9: Install the App

1. In the left sidebar, click **"Install App"**
2. Next to sfgaluminium1-spec, click **"Install"**
3. On the installation page:
   - Repository access: **"Only select repositories"**
   - Select: **sfg-app-portfolio** ✅
4. Click **"Install"**
5. After installation, check the URL - you'll see something like:
   ```
   https://github.com/settings/installations/12345678
   ```
   The number at the end (12345678) is your **Installation ID** - **SAVE THIS**

### Step 10: Document All Credentials

Create a secure document (password manager or encrypted file) with:

```plaintext
SFG GITHUB APP CREDENTIALS
===========================

App Name: SFG Satellite Apps
Created: [DATE]

GITHUB_APP_ID=[from step 6]
GITHUB_APP_INSTALLATION_ID=[from step 9]
GITHUB_APP_CLIENT_ID=[from step 7]
GITHUB_APP_CLIENT_SECRET=[from step 7]
GITHUB_WEBHOOK_SECRET=[from step 2]

GITHUB_APP_PRIVATE_KEY=
-----BEGIN RSA PRIVATE KEY-----
[paste entire content from .pem file]
-----END RSA PRIVATE KEY-----

App URL: https://github.com/settings/apps/sfg-satellite-apps
Installation URL: https://github.com/settings/installations/[INSTALLATION_ID]
```

---

## Step 11: Share Credentials with NEXUS

### Option A: Direct Message to NEXUS (Recommended)

Open a conversation with NEXUS and send:

```markdown
NEXUS - GITHUB APP CREDENTIALS (STORE IN PERSISTENT MEMORY)

I've created the GitHub App for satellite authentication. Store these credentials in your persistent memory (Context table) immediately:

GITHUB_APP_ID=[your app ID]
GITHUB_APP_INSTALLATION_ID=[your installation ID]
GITHUB_APP_CLIENT_ID=[your client ID]
GITHUB_APP_CLIENT_SECRET=[your client secret]
GITHUB_WEBHOOK_SECRET=[your webhook secret]
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
[paste entire private key]
-----END RSA PRIVATE KEY-----"

Action Items:
1. Store all credentials in Context table with category "GITHUB_APP"
2. Verify you can recall these credentials
3. Prepare to share with satellite apps when they register

Confirm when credentials are stored.
```

### Option B: Secure File Share

1. Create a file named `github-app-credentials.json`:

```json
{
  "GITHUB_APP_ID": "your_app_id",
  "GITHUB_APP_INSTALLATION_ID": "your_installation_id",
  "GITHUB_APP_CLIENT_ID": "your_client_id",
  "GITHUB_APP_CLIENT_SECRET": "your_client_secret",
  "GITHUB_WEBHOOK_SECRET": "your_webhook_secret",
  "GITHUB_APP_PRIVATE_KEY": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
}
```

2. Upload securely to NEXUS
3. Ask NEXUS to store in persistent memory
4. Delete the file after confirmation

---

## Verification

### Test 1: App is Installed
1. Go to: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/settings/installations
2. You should see "SFG Satellite Apps" listed
3. Click on it - it should show "Installed" status

### Test 2: App Has Correct Permissions
1. On the installation page, check permissions:
   - ✅ Read and write to code (Contents)
   - ✅ Read and write to issues
   - ✅ Read metadata

### Test 3: NEXUS Can Recall Credentials
Ask NEXUS:
```
What is the GitHub App ID?
```
Expected response: NEXUS returns the App ID you configured

### Test 4: Generate a Token (Optional)
Use GitHub CLI to test:
```bash
# Install GitHub CLI if needed
brew install gh  # macOS
# or
sudo apt install gh  # Linux

# Test authentication
gh auth login --with-token < your_token_file
gh repo view sfgaluminium1-spec/sfg-app-portfolio
```

If this works, your GitHub App is configured correctly!

---

## Next Steps After Completion

Once you've created the GitHub App and shared credentials with NEXUS:

1. **Ask NEXUS to Complete Remaining Tasks:**
   ```markdown
   NEXUS - COMPLETE WEEK 1 REMAINING TASKS
   
   Excellent work on persistent memory! Now please IMPLEMENT (not just document) the remaining tasks:
   
   TASK 2.1: ENHANCE REPOSITORY STRUCTURE (1-2 hours)
   - Clone sfg-app-portfolio repository
   - Create orchestration directories
   - Add documentation files
   - Commit and push to main branch
   
   TASK 2.2: MAKE REPOSITORY PRIVATE (30 minutes)
   - Change repository visibility to Private
   - Configure branch protection rules
   - Enable security features
   
   DEADLINE: Complete both tasks by November 10, 2025
   
   Report progress daily via GitHub issues with label "nexus-progress"
   ```

2. **Monitor Progress** (10 minutes/day):
   - Check GitHub commits: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/commits/main
   - Check GitHub issues: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues?q=label%3Anexus-progress
   - Check conversations with NEXUS for status updates

3. **Verify Week 1 Complete** (November 10):
   - [ ] Persistent memory working (already done ✅)
   - [ ] GitHub App created (you just did this! ✅)
   - [ ] Credentials shared with NEXUS
   - [ ] Repository structure enhanced (NEXUS will do)
   - [ ] Repository made private (NEXUS will do)

---

## Troubleshooting

### Problem: Can't find GitHub App creation page
**Solution:** 
- Make sure you're logged in as sfgaluminium1-spec
- Use direct link: https://github.com/organizations/sfgaluminium1-spec/settings/apps/new
- Check you have Owner role in the organization

### Problem: "Only on this account" option not showing
**Solution:** 
- This is correct if sfgaluminium1-spec is a user account (not organization)
- You can skip this step

### Problem: Private key download didn't work
**Solution:** 
- Try again - you can generate multiple private keys
- Only the most recent one will work
- Make sure to delete old keys if you generate new ones

### Problem: Webhook URL returns 404
**Solution:** 
- This is OK for now - NEXUS will implement the webhook endpoint in Week 2
- The GitHub App will still work for file operations

### Problem: Lost the credentials
**Solution:** 
- Client Secret: Regenerate (previous one will stop working)
- Private Key: Generate new one (previous one will stop working)
- App ID, Installation ID: Check app settings page
- Webhook Secret: Regenerate in app settings

---

## Security Best Practices

1. **Store Credentials Securely**
   - Use a password manager (1Password, LastPass, Bitwarden)
   - Never commit credentials to Git
   - Never share credentials in plain text via email/Slack

2. **Limit Scope**
   - Only installed on sfg-app-portfolio (not all repositories)
   - Only necessary permissions (Contents, Issues)
   - Only on sfgaluminium1-spec account

3. **Rotate Regularly**
   - Regenerate Client Secret annually
   - Regenerate Private Key if compromised
   - Review permissions quarterly

4. **Monitor Usage**
   - Check app activity regularly
   - Review commits made by the app
   - Watch for unusual patterns

---

## Support

If you get stuck:

1. **Check GitHub Documentation:**
   - https://docs.github.com/en/apps/creating-github-apps

2. **Ask NEXUS for Help:**
   ```
   I'm stuck on step [X] of the GitHub App creation. Can you help?
   ```

3. **Create a GitHub Issue:**
   - Title: "[BLOCKER] GitHub App Creation Help Needed"
   - Label: "urgent", "github-app"

4. **Contact Abacus.AI Support:**
   - If NEXUS can't access GitHub
   - If there are platform-specific issues

---

## Timeline

| Task | Time | When |
|------|------|------|
| Create GitHub App | 30 min | NOW (Day 4) |
| Share credentials with NEXUS | 5 min | Immediately after |
| NEXUS enhances repository | 1-2 hours | Day 5-7 |
| NEXUS makes repo private | 30 min | Day 5-7 |
| Verify Week 1 complete | 15 min | November 10 |

**Week 1 Completion Target:** November 10, 2025  
**Week 2 Start Date:** November 11, 2025

---

## Success Criteria

✅ **Week 1 Complete When:**
- [x] Persistent memory implemented (done Nov 3)
- [ ] GitHub App created (you're doing this now!)
- [ ] Credentials shared with NEXUS
- [ ] Repository structure enhanced
- [ ] Repository made private
- [ ] All tasks verified

**Current Progress:** 1/6 tasks (17%)  
**Target:** 6/6 tasks (100%) by November 10

---

**You've got this, Warren! This is the final critical piece to unblock Week 2. Let's get it done!** 🚀

---

**Document Version:** 1.0  
**Created:** November 3, 2025  
**Last Updated:** November 3, 2025  
**Estimated Time:** 1 hour  
**Difficulty:** Medium
