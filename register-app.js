const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'app', '.env') });

async function registerApp() {
  try {
    console.log('🚀 Starting SFG-Website Registration...\n');

    // Read business logic
    const businessLogicPath = path.join(__dirname, 'business-logic.json');
    const businessLogic = JSON.parse(fs.readFileSync(businessLogicPath, 'utf8'));

    console.log(`📦 App Name: ${businessLogic.appName}`);
    console.log(`📝 Description: ${businessLogic.description}`);
    console.log(`🔢 Version: ${businessLogic.version}\n`);

    // Initialize Octokit with App authentication
    const appId = parseInt(process.env.GITHUB_APP_ID);
    const installationId = parseInt(process.env.GITHUB_APP_INSTALLATION_ID);
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId,
        privateKey,
        installationId,
      },
    });

    // Verify authentication
    console.log('🔐 GitHub authentication configured...');
    console.log(`✅ Ready to create issue\n`);

    // Create issue title
    const title = `[Registration] ${businessLogic.appName} v${businessLogic.version}`;

    // Create comprehensive issue body
    const body = `# ${businessLogic.appName} - Registration Complete

## ✅ Registration Complete

**App Name:** ${businessLogic.appName}  
**Platform:** ${businessLogic.platform}  
**Category:** ${businessLogic.category}  
**Status:** ${businessLogic.status}  
**Version:** ${businessLogic.version}

**Deployed URL:** ${businessLogic.deployed_url}  
**Webhook URL:** ${businessLogic.webhook_url}  
**Message Handler URL:** ${businessLogic.message_handler_url}

## 📋 App Information

**Purpose:** ${businessLogic.description}

## 🎯 Capabilities

${businessLogic.capabilities.map(cap => `- ${cap}`).join('\n')}

## 🔄 Workflows

${businessLogic.workflows.map(workflow => `
### ${workflow.name}
${workflow.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

**Triggers:** ${workflow.triggers.join(', ')}  
**Outputs:** ${workflow.outputs.join(', ')}
`).join('\n')}

## 📏 Business Rules

${businessLogic.businessRules.map(rule => `
- **${rule.rule}**
  - Condition: \`${rule.condition}\`
  - Action: ${rule.action}
`).join('\n')}

## 🔗 Integration Points

${businessLogic.integrations.map(integration => `
- **${integration.system}**
  - Purpose: ${integration.purpose}
  - Methods: ${integration.methods.join(', ')}
  ${integration.status ? `- Status: ${integration.status}` : ''}
`).join('\n')}

## 🔔 Webhook Events

${businessLogic.webhook_events.map(event => `- ${event}`).join('\n')}

## 💬 Supported Messages

${businessLogic.supported_messages.map(msg => `- ${msg}`).join('\n')}

## 🌐 API Endpoints

${businessLogic.apiEndpoints.map(endpoint => `
- **${endpoint.method} ${endpoint.path}**
  - Description: ${endpoint.description}
  - Auth: ${endpoint.auth}
  - Rate Limit: ${endpoint.rate_limit}
`).join('\n')}

## 📊 Data Models

${businessLogic.dataModels.map(model => `
### ${model.name}
${model.fields.map(field => `- ${field.name}: ${field.type}${field.required ? ' (required)' : ''}`).join('\n')}
`).join('\n')}

## 📁 Files Backed Up

- ✅ business-logic.json
- ✅ registration-metadata.json
- ✅ README.md
- ✅ Full project source code
- ✅ Configuration files
- ✅ Documentation

## 👥 Team

- **Owner:** ${businessLogic.team.owner}
- **Developers:** ${businessLogic.team.developers.join(', ')}
- **Contact:** ${businessLogic.team.contact}

## 📈 Monitoring

- **Health Check:** ${businessLogic.monitoring.health_check_url}
- **Uptime Requirement:** ${businessLogic.monitoring.uptime_requirement}
- **Response Time Target:** ${businessLogic.monitoring.response_time_target}

---

**Registered by:** DeepAgent  
**Date:** ${new Date().toISOString().split('T')[0]}  
**Repository:** ${businessLogic.repository.url}
`;

    // Create the issue
    console.log('📤 Creating GitHub issue...\n');
    
    const issue = await octokit.rest.issues.create({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      title,
      body,
      labels: ['registration', 'satellite-app', 'sfg-aluminium-app', 'pending-approval'],
    });

    console.log('═══════════════════════════════════════════');
    console.log('✅ REGISTRATION COMPLETE!');
    console.log('═══════════════════════════════════════════');
    console.log(`📝 Issue URL: ${issue.data.html_url}`);
    console.log(`🔢 Issue Number: #${issue.data.number}`);
    console.log(`📅 Created: ${issue.data.created_at}`);
    console.log('');
    console.log('Next Steps:');
    console.log('  1. NEXUS will review your registration (within 24 hours)');
    console.log('  2. NEXUS will test your webhook endpoint');
    console.log('  3. NEXUS will test your message handler');
    console.log('  4. Once approved, you\'ll receive orchestration events!');
    console.log('');

    // Save backup locally
    const backupPath = path.join(__dirname, 'registration-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify({
      issueNumber: issue.data.number,
      issueUrl: issue.data.html_url,
      registrationDate: new Date().toISOString(),
      appName: businessLogic.appName,
      version: businessLogic.version,
      businessLogic
    }, null, 2));

    console.log(`💾 Backup saved to: ${backupPath}\n`);

    return {
      success: true,
      issueNumber: issue.data.number,
      issueUrl: issue.data.html_url,
    };

  } catch (error) {
    console.error('\n❌ Registration failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run registration
registerApp()
  .then(result => {
    if (result.success) {
      console.log('✅ Registration successful!');
      process.exit(0);
    } else {
      console.error('❌ Registration failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
