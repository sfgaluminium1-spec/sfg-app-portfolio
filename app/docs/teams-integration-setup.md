
# SFG NEXUS - Microsoft Teams Integration Setup Guide

## Overview
This document outlines the basic setup and configuration for Microsoft Teams integration with SFG NEXUS system.

## Current Implementation Status
✅ **API Infrastructure**: Teams integration API routes are implemented
✅ **Database Schema**: Teams message storage and tracking configured
✅ **Workflow Integration**: Teams notifications linked to job workflows
✅ **Customer Communications**: Teams-based customer interaction logging

## Teams Integration Features

### 1. Workflow Notifications
- **Automatic Job Updates**: Teams channels receive notifications for job status changes
- **Approval Requests**: Quote and job approvals trigger Teams messages to relevant team members
- **Priority Alerts**: Urgent issues automatically notify appropriate Teams channels

### 2. Customer Communication Tracking
- **Inbound Messages**: Customer emails forwarded to Teams channels are logged in the system
- **Response Tracking**: Team member responses via Teams are recorded against customer records
- **Communication History**: Full audit trail of Teams-based customer interactions

### 3. Email In/Out Functionality
**How it Works:**
1. **Email to Teams**: Customer emails are forwarded to designated Teams channels
2. **Teams to Email**: Team member responses in Teams are automatically sent as emails to customers
3. **Bidirectional Sync**: All communications are synchronized between email and Teams

**Setup Requirements:**
- Microsoft Teams connector configured with SFG email domain
- Teams channels created for different departments/project types
- Power Automate flows to handle email/Teams synchronization

### 4. Current Teams Channels Structure
```
SFG Aluminium Workspace
├── 📋 General
├── 🏗️ Installation Team
├── 🔧 Fabrication Team
├── 💼 Sales & Estimating
├── 📞 Customer Service
├── ⚠️ Urgent Issues
└── 🎯 Management Updates
```

## Implementation Guide

### Step 1: Teams Workspace Setup
1. Create "SFG Aluminium" Teams workspace
2. Add all team members with appropriate permissions
3. Configure channels based on department structure
4. Set up channel-specific notification preferences

### Step 2: Email Integration Configuration
1. **Configure Email Connectors**:
   - Set up Teams email connector for your domain
   - Configure forwarding rules for customer emails
   - Test bidirectional email/Teams synchronization

2. **Power Automate Flows**:
   - Create flow: "Customer Email → Teams Channel"
   - Create flow: "Teams Response → Customer Email"
   - Set up approval workflows via Teams

### Step 3: SFG NEXUS API Configuration
1. **Teams API Integration**:
   ```typescript
   // Already implemented in /api/teams-integration
   - Teams message posting
   - Channel management
   - User notification preferences
   - Message threading and replies
   ```

2. **Database Integration**:
   ```sql
   -- Teams messages are stored in:
   TeamsMessage table - Full message history
   CustomerCommunication table - Customer interaction tracking
   Activity table - Workflow event logging
   ```

### Step 4: Workflow Integration
1. **Automatic Notifications**:
   - Job status changes → Teams notifications
   - Quote approvals needed → Teams approval requests
   - Customer issues → Teams alerts

2. **Manual Team Communication**:
   - Team members can post updates via SFG NEXUS interface
   - Messages automatically sync to Teams channels
   - Customer communications tracked in CRM

## API Endpoints Available

### Teams Message Management
- `POST /api/teams-integration` - Send message to Teams channel
- `GET /api/teams-integration/channels` - List available channels
- `POST /api/teams-integration/workflow-update` - Send workflow notification

### Customer Communication via Teams
- `POST /api/teams-integration/customer-message` - Send customer message via Teams
- `GET /api/teams-integration/customer-history` - Get Teams communication history

## Testing the Integration

### 1. Test Teams Message Posting
```bash
curl -X POST http://localhost:3000/api/teams-integration \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "installation-team",
    "message": "Test message from SFG NEXUS",
    "jobId": "test-job-123"
  }'
```

### 2. Test Workflow Notifications
- Create a new job in SFG NEXUS
- Verify Teams notification is sent to appropriate channel
- Check that message is logged in database

### 3. Test Customer Communication
- Send customer email to Teams-integrated email address
- Verify message appears in correct Teams channel
- Test replying via Teams and confirm email is sent to customer

## Security Considerations

### Teams Access Control
- ✅ Department-based channel access
- ✅ Role-based message permissions
- ✅ Customer data protection in Teams messages
- ✅ Audit trail for all Teams communications

### Data Privacy
- Customer personal data is masked in Teams messages
- Sensitive information requires additional approval to share
- All Teams communications are logged for compliance

## Troubleshooting

### Common Issues
1. **Messages not appearing in Teams**: Check connector configuration and channel permissions
2. **Email sync not working**: Verify Power Automate flows are active
3. **Notifications missing**: Check user notification preferences in SFG NEXUS

### Support Contacts
- **Teams Admin**: David Collins (Operations Director)
- **Technical Support**: SFG NEXUS System Administrator
- **Email Integration**: Emma Clarke (Office Manager)

## Future Enhancements
- 📱 Teams mobile app integration
- 🤖 Teams bot for common queries
- 📊 Teams analytics and reporting
- 🔄 Advanced workflow automation via Teams

---
*Last Updated: July 4, 2025*
*Document Version: 1.0*
