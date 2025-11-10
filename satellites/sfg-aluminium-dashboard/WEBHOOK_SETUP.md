# GitHub Webhook Setup Instructions

**Application:** SFG Aluminium Dashboard  
**Version:** 1.0.0  
**Date:** November 10, 2025

---

## Overview

This document provides step-by-step instructions for configuring GitHub webhooks to enable real-time communication between GitHub and the SFG Aluminium Dashboard.

---

## Prerequisites

- ✅ Dashboard deployed to production
- ✅ Production URL available (e.g., `https://sfg-dashboard.abacusai.app`)
- ✅ GitHub repository admin access
- ✅ Webhook secret generated

---

## Webhook Configuration

### Step 1: Generate Webhook Secret

Generate a secure random string for webhook signature verification:

```bash
openssl rand -hex 32
```

Save this secret as an environment variable in your deployment:

```bash
GITHUB_WEBHOOK_SECRET="your-generated-secret"
```

### Step 2: Access GitHub Repository Settings

1. Navigate to the repository: https://github.com/sfgaluminium1-spec/sfg-app-portfolio
2. Click on **Settings**
3. In the left sidebar, click **Webhooks**
4. Click **Add webhook** button

### Step 3: Configure Webhook

**Payload URL:**
```
https://[YOUR-DASHBOARD-URL]/api/webhooks/github
```

**Content type:**
```
application/json
```

**Secret:**
```
[Your generated webhook secret from Step 1]
```

**SSL verification:**
```
Enable SSL verification
```

**Which events would you like to trigger this webhook?**

Select **Let me select individual events** and check:

- ✅ **Repository** - Repository created, deleted, archived
- ✅ **Issues** - Issue opened, closed, edited, commented
- ✅ **Pull requests** - PR opened, closed, merged, edited
- ✅ **Push** - Code pushed to repository
- ✅ **Release** - Release published
- ✅ **Star** - Repository starred
- ✅ **Watch** - Repository watched
- ✅ **Workflow runs** - GitHub Actions workflow runs

**Active:**
```
✅ Active
```

### Step 4: Save Webhook

Click **Add webhook** to save the configuration.

---

## Webhook Endpoint Details

### Endpoint
```
POST /api/webhooks/github
```

### Authentication
- **Method:** HMAC-SHA256 signature
- **Header:** `X-Hub-Signature-256`
- **Secret:** Environment variable `GITHUB_WEBHOOK_SECRET`

### Request Headers
```
X-GitHub-Event: event_type
X-GitHub-Delivery: unique_delivery_id
X-Hub-Signature-256: sha256=signature
Content-Type: application/json
```

### Response
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "event": "event_type",
  "timestamp": "2025-11-10T21:00:00Z"
}
```

---

## Supported Events

### Repository Events
- `repository.created` - New repository created
- `repository.deleted` - Repository deleted
- `repository.archived` - Repository archived
- `repository.unarchived` - Repository unarchived
- `repository.renamed` - Repository renamed

### Issue Events
- `issues.opened` - New issue opened
- `issues.closed` - Issue closed
- `issues.reopened` - Issue reopened
- `issues.edited` - Issue edited
- `issues.labeled` - Label added to issue
- `issues.unlabeled` - Label removed from issue
- `issues.assigned` - Issue assigned to user

### Pull Request Events
- `pull_request.opened` - New PR opened
- `pull_request.closed` - PR closed
- `pull_request.merged` - PR merged
- `pull_request.reopened` - PR reopened
- `pull_request.edited` - PR edited
- `pull_request.review_requested` - Review requested
- `pull_request.reviewed` - PR reviewed

### Push Events
- `push` - Code pushed to repository
  - Branch information
  - Commit information
  - Author details

### Release Events
- `release.published` - New release published
- `release.edited` - Release edited
- `release.deleted` - Release deleted

---

## Event Processing

### 1. Signature Verification

The dashboard automatically verifies the webhook signature using HMAC-SHA256:

```typescript
const signature = req.headers['x-hub-signature-256'];
const payload = JSON.stringify(req.body);
const expectedSignature = `sha256=${crypto
  .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
  .update(payload)
  .digest('hex')}`;

if (signature !== expectedSignature) {
  throw new Error('Invalid signature');
}
```

### 2. Event Handling

Events are processed based on their type:

```typescript
const eventType = req.headers['x-github-event'];

switch (eventType) {
  case 'repository':
    await handleRepositoryEvent(payload);
    break;
  case 'issues':
    await handleIssueEvent(payload);
    break;
  case 'pull_request':
    await handlePullRequestEvent(payload);
    break;
  case 'push':
    await handlePushEvent(payload);
    break;
  // ... more event handlers
}
```

### 3. Database Recording

All webhook events are recorded in the database for audit and analytics:

```typescript
await prisma.webhookEvent.create({
  data: {
    eventType: eventType,
    deliveryId: req.headers['x-github-delivery'],
    payload: payload,
    processedAt: new Date(),
    status: 'success'
  }
});
```

---

## Testing Webhooks

### Test via GitHub

1. Navigate to webhook settings
2. Click on the webhook you created
3. Scroll to **Recent Deliveries**
4. Click **Redeliver** on any delivery

### Test via curl

```bash
curl -X POST https://[YOUR-DASHBOARD-URL]/api/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: ping" \
  -H "X-Hub-Signature-256: sha256=$(echo -n '{"zen":"testing"}' | openssl dgst -sha256 -hmac 'your-secret' | sed 's/^.* //')" \
  -d '{"zen":"testing"}'
```

### Expected Response

```json
{
  "success": true,
  "message": "Webhook received",
  "event": "ping",
  "timestamp": "2025-11-10T21:00:00Z"
}
```

---

## Monitoring Webhooks

### GitHub Interface

Monitor webhook deliveries in GitHub:
1. Repository Settings → Webhooks
2. Click on your webhook
3. View **Recent Deliveries**
4. Check response codes and payloads

### Dashboard Interface

View webhook events in the dashboard:
1. Login to dashboard
2. Navigate to **System Status**
3. View **Webhook Events** section
4. Filter by event type, date, status

### Database Queries

Query webhook events directly:

```sql
-- Recent webhook events
SELECT * FROM "WebhookEvent" 
ORDER BY "processedAt" DESC 
LIMIT 100;

-- Failed webhooks
SELECT * FROM "WebhookEvent" 
WHERE status = 'error' 
ORDER BY "processedAt" DESC;

-- Events by type
SELECT "eventType", COUNT(*) as count 
FROM "WebhookEvent" 
GROUP BY "eventType" 
ORDER BY count DESC;
```

---

## Troubleshooting

### Webhook Not Receiving Events

1. **Check webhook is active**
   - GitHub Settings → Webhooks
   - Ensure webhook is marked as active

2. **Verify URL is correct**
   - Must be publicly accessible HTTPS URL
   - Test URL in browser: `GET https://[URL]/api/health`

3. **Check SSL certificate**
   - SSL verification must be enabled
   - Certificate must be valid

4. **Review recent deliveries**
   - Check response codes in GitHub
   - 200 = success, 4xx/5xx = error

### Signature Verification Fails

1. **Check secret matches**
   - Secret in GitHub must match environment variable
   - No extra spaces or characters

2. **Verify HMAC calculation**
   - Check implementation in webhook handler
   - Ensure using SHA-256

3. **Check request body**
   - Body must not be modified before verification
   - Use raw body for signature check

### Events Not Processing

1. **Check application logs**
   - Review error messages
   - Look for stack traces

2. **Verify database connection**
   - Check database is accessible
   - Verify credentials

3. **Check event handler implementation**
   - Ensure all event types are handled
   - Add error logging

---

## Security Best Practices

1. **Always verify signatures**
   - Never process unsigned webhooks
   - Use constant-time comparison

2. **Use HTTPS only**
   - Never use HTTP for webhooks
   - Enable SSL verification

3. **Rotate secrets regularly**
   - Update webhook secret every 90 days
   - Update in both GitHub and deployment

4. **Rate limiting**
   - Implement rate limiting on webhook endpoint
   - Default: 1000 requests/minute

5. **Input validation**
   - Validate all webhook payloads
   - Sanitize data before processing

6. **Audit logging**
   - Log all webhook events
   - Monitor for suspicious activity

---

## Post-Deployment Checklist

After deploying the dashboard:

- [ ] Generate webhook secret
- [ ] Add secret to environment variables
- [ ] Configure webhook in GitHub
- [ ] Test webhook with ping event
- [ ] Verify signature validation works
- [ ] Monitor first few webhook deliveries
- [ ] Check database recording
- [ ] Test all event types
- [ ] Set up monitoring alerts
- [ ] Document production URL

---

## Additional Resources

- **GitHub Webhooks Documentation:** https://docs.github.com/en/webhooks
- **Webhook Events Reference:** https://docs.github.com/en/webhooks/webhook-events-and-payloads
- **Security Best Practices:** https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks

---

## Support

**Issues or Questions:**
- Create an issue in the repository
- Contact: warren@sfgaluminium.co.uk

**Webhook Endpoint:**
- URL: `https://[YOUR-DASHBOARD-URL]/api/webhooks/github`
- Health Check: `https://[YOUR-DASHBOARD-URL]/api/health`

---

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Status:** Ready for Implementation
