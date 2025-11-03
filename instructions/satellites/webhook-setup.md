
# Webhook Setup Guide

**Purpose:** Configure webhook receiver to get instructions from Nexus  
**Timeline:** 1-2 hours  
**Prerequisites:** GitHub repository access

## What are Webhooks?

Webhooks notify your app when new instructions are pushed to GitHub by Nexus.

## Implementation Steps

### Step 1: Create Webhook Endpoint (30 minutes)

```typescript
// /api/github-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Get webhook signature
    const signature = request.headers.get('x-hub-signature-256');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.text();
    
    // Verify signature
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      console.error('GITHUB_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(body).digest('hex');
    
    if (signature !== digest) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Parse payload
    const payload = JSON.parse(body);
    
    // Process webhook event
    await processWebhookEvent(payload);
    
    return NextResponse.json({ status: 'processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    );
  }
}

async function processWebhookEvent(payload: any) {
  const appId = process.env.APP_ID;
  
  // Check if this is a push event
  if (payload.commits) {
    for (const commit of payload.commits) {
      // Check for new instructions
      const hasInstructions = commit.added.some((file: string) => 
        file.startsWith(`instructions/satellites/${appId}/`) ||
        file.includes(`instructions/satellites/${appId}`)
      );
      
      if (hasInstructions) {
        console.log('New instructions detected:', commit.message);
        
        // Pull latest instructions
        await pullInstructions();
        
        // Implement instructions
        await implementInstructions();
        
        // Report completion
        await reportCompletion(commit);
      }
    }
  }
}

async function pullInstructions() {
  // Pull latest instructions from GitHub
  const appId = process.env.APP_ID;
  const response = await fetch(
    `https://api.github.com/repos/sfgaluminium1-spec/sfg-app-portfolio/contents/instructions/satellites/${appId}`,
    {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch instructions');
  }
  
  const files = await response.json();
  console.log('Instructions pulled:', files.length, 'files');
  
  return files;
}

async function implementInstructions() {
  // Parse and implement instructions
  // This is app-specific logic
  console.log('Implementing instructions...');
  
  // Example: Read instruction files and execute
  // Your implementation here
}

async function reportCompletion(commit: any) {
  // Create GitHub issue to report completion
  const appId = process.env.APP_ID;
  const appName = process.env.APP_NAME;
  
  const issueBody = `## Instructions Implemented

**App:** ${appName} (${appId})
**Commit:** ${commit.id}
**Message:** ${commit.message}

### Actions Taken

- ✅ Instructions pulled from GitHub
- ✅ Instructions parsed and validated
- ✅ Changes implemented
- ✅ System tested

### Status

All instructions have been successfully implemented.

**Timestamp:** ${new Date().toISOString()}`;

  await fetch(
    'https://api.github.com/repos/sfgaluminium1-spec/sfg-app-portfolio/issues',
    {
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `[${appId}] Instructions Implemented - ${commit.message}`,
        body: issueBody,
        labels: ['implementation', 'automated', appId]
      })
    }
  );
}
```

### Step 2: Configure Environment Variables (5 minutes)

Add to your `.env` file:

```bash
APP_ID=your-app-id
APP_NAME=Your App Name
GITHUB_TOKEN=ghp_your_token_here
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
```

### Step 3: Register Webhook on GitHub (15 minutes)

1. Go to repository settings:
   https://github.com/sfgaluminium1-spec/sfg-app-portfolio/settings/hooks

2. Click "Add webhook"

3. Configure webhook:
   - **Payload URL:** `https://your-app.abacusai.app/api/github-webhook`
   - **Content type:** `application/json`
   - **Secret:** Generate a random secret (save in `.env`)
   - **Events:** Select "Just the push event"
   - **Active:** ✅ Checked

4. Click "Add webhook"

### Step 4: Test Webhook (10 minutes)

Test your webhook:

```bash
# Trigger a test push event
curl -X POST https://your-app.abacusai.app/api/github-webhook \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$(echo -n '{"test": true}' | openssl dgst -sha256 -hmac 'your_secret' | cut -d' ' -f2)" \
  -d '{"test": true, "commits": []}'
```

Check your app logs to verify the webhook was received and processed.

### Step 5: Create Test Instruction (10 minutes)

Create a test instruction file in GitHub:

```bash
# In the sfg-app-portfolio repository
mkdir -p instructions/satellites/[your-app-id]
echo "# Test Instruction" > instructions/satellites/[your-app-id]/test.md
git add instructions/satellites/[your-app-id]/test.md
git commit -m "test: Add test instruction for [your-app-id]"
git push origin main
```

Verify that:
1. Webhook is triggered
2. Your app receives the webhook
3. Instructions are pulled
4. GitHub issue is created

## Webhook Event Types

### Push Event
Triggered when code is pushed to repository.

```json
{
  "ref": "refs/heads/main",
  "commits": [
    {
      "id": "abc123",
      "message": "Add instructions",
      "added": ["instructions/satellites/app-id/file.md"],
      "modified": [],
      "removed": []
    }
  ]
}
```

### Pull Request Event
Triggered when PR is created/updated.

```json
{
  "action": "opened",
  "pull_request": {
    "number": 123,
    "title": "Add new feature",
    "body": "Description"
  }
}
```

## Security Best Practices

### Signature Verification
Always verify webhook signatures:

```typescript
function verifySignature(body: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(body).digest('hex');
  return signature === digest;
}
```

### Rate Limiting
Implement rate limiting to prevent abuse:

```typescript
const rateLimiter = new Map<string, number>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimiter.get(ip) || 0;
  
  if (now - lastRequest < 1000) {
    return false; // Too many requests
  }
  
  rateLimiter.set(ip, now);
  return true;
}
```

### Error Handling
Handle errors gracefully:

```typescript
try {
  await processWebhookEvent(payload);
} catch (error) {
  console.error('Webhook processing error:', error);
  // Log error but return 200 to prevent retries
  return NextResponse.json({ status: 'error_logged' });
}
```

## Monitoring

### Log Webhook Events
```typescript
console.log('Webhook received:', {
  event: payload.event,
  timestamp: new Date().toISOString(),
  commits: payload.commits?.length || 0
});
```

### Track Processing Time
```typescript
const startTime = Date.now();
await processWebhookEvent(payload);
const duration = Date.now() - startTime;
console.log('Processing time:', duration, 'ms');
```

## Success Criteria

- ✅ Webhook endpoint responds correctly
- ✅ Signature verification works
- ✅ Instructions are pulled automatically
- ✅ Implementation reports are created
- ✅ Test webhook succeeds

## Troubleshooting

### Webhook Not Received
- Check webhook URL is correct
- Verify app is deployed and accessible
- Check GitHub webhook delivery logs

### Signature Verification Fails
- Verify secret matches in GitHub and `.env`
- Check signature header name is correct
- Ensure body is not modified before verification

### Instructions Not Pulled
- Verify GitHub token has read access
- Check file paths match expected pattern
- Verify API endpoint is correct

## Reporting

When complete, update your GitHub issue:
```
[APP-ID] Webhook Setup - Complete

- ✅ Webhook endpoint implemented
- ✅ Signature verification working
- ✅ Instructions pulled automatically
- ✅ Test webhook successful

Webhook URL: https://your-app.abacusai.app/api/github-webhook
```

