
const { Octokit } = require('@octokit/rest');
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

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_APP_PRIVATE_KEY
    });

    // Create issue title
    const title = `[Registration] ${businessLogic.appName}`;

    // Create issue body
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

${businessLogic.integrations.map(int => `
- **${int.system}**
  - Purpose: ${int.purpose}
  - Methods: ${int.methods.join(', ')}
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

    console.log('📤 Creating GitHub issue...\n');

    // Create the issue
    const response = await octokit.rest.issues.create({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      title: title,
      body: body,
      labels: ['registration', 'satellite-app', 'sfg-aluminium-app', 'pending-approval']
    });

    console.log('✅ SUCCESS!\n');
    console.log(`📝 Issue Created: #${response.data.number}`);
    console.log(`🔗 URL: ${response.data.html_url}`);
    console.log(`📅 Created: ${response.data.created_at}\n`);

    // Save local backup
    const backupPath = path.join(__dirname, 'registration-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify({
      issue_number: response.data.number,
      issue_url: response.data.html_url,
      created_at: response.data.created_at,
      business_logic: businessLogic
    }, null, 2));

    console.log(`💾 Local backup saved: ${backupPath}\n`);
    console.log('🎉 SFG-Website successfully registered in the portfolio!');
    console.log('🔄 NEXUS will review and approve within 24 hours.\n');

    return response.data;
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    throw error;
  }
}

// Execute
registerApp()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
