
import { createFile, createIssue, fileExists } from "../lib/github-client";

const APP_NAME = "SFG-Aluminium-Unified-Dashboard";
const APP_FOLDER = `apps/${APP_NAME}`;
const WEBHOOK_URL = "https://sfg-unified-brain.abacusai.app/api/webhooks/nexus";
const MESSAGE_HANDLER_URL = "https://sfg-unified-brain.abacusai.app/api/messages/handle";

/**
 * Extract business logic and capabilities
 */
function extractBusinessLogic() {
  return {
    app_name: APP_NAME,
    platform: "Next.js 14 / React / TypeScript",
    category: "sfg-aluminium-app",
    status: "production",
    purpose: "Unified dashboard for SFG Aluminium business operations, integrating customer management, quotes, orders, invoicing, and AI-powered assistance",
    
    capabilities: [
      "Unified business dashboard with real-time KPIs",
      "Customer enquiry management",
      "Quote generation with SFG pricing margins",
      "Order tracking and management",
      "Invoice processing and financial reporting",
      "Credit checking integration",
      "AI chatbot for customer support",
      "Document management via SharePoint integration",
      "Xero accounting integration",
      "API hub for external integrations",
      "System status monitoring",
      "Analytics and reporting",
    ],
    
    workflows: [
      {
        name: "Enquiry to Quote",
        description: "Convert customer enquiry to formal quote",
        steps: [
          "Receive customer enquiry via portal",
          "Check customer credit (if order value > £10,000)",
          "Calculate pricing with 15-25% margin",
          "Get tier-based approval if needed",
          "Generate professional quote document",
          "Send to customer via email",
          "Create SharePoint project folder",
          "Track quote status (SENT → ACC)",
        ],
      },
      {
        name: "Quote to Order",
        description: "Convert accepted quote to production order",
        steps: [
          "Customer accepts quote",
          "Perform final credit check",
          "Get approval based on value tier",
          "Create production order",
          "Schedule fabrication",
          "Generate invoice via Xero",
          "Notify production team",
          "Track order status (ORD → FAB → INS)",
        ],
      },
      {
        name: "Invoice to Payment",
        description: "Invoice generation and payment tracking",
        steps: [
          "Generate invoice in Xero",
          "Send invoice to customer",
          "Track payment status",
          "Send payment reminders",
          "Record payment received",
          "Update customer balance",
          "Mark order as complete (PAID)",
        ],
      },
      {
        name: "Credit Check",
        description: "Automated credit checking for high-value orders",
        steps: [
          "Detect order value > £10,000",
          "Query Companies House for company data",
          "Perform Experian credit check via MCP-FINANCE",
          "Calculate credit limit",
          "Store credit check result (valid 90 days)",
          "Approve or escalate based on credit score",
        ],
      },
    ],
    
    business_rules: [
      {
        rule: "Minimum margin 15%",
        condition: "margin >= 0.15",
        action: "Allow quote generation",
        escalation: "Warn if margin < 18%",
      },
      {
        rule: "Credit check for orders > £10,000",
        condition: "order_value > 10000",
        action: "Perform credit check via Experian",
        validity: "90 days",
      },
      {
        rule: "Tier-based approval limits",
        tiers: [
          { tier: "T1 (Director)", limit: 1000000 },
          { tier: "T2 (Senior Manager)", limit: 100000 },
          { tier: "T3 (Manager)", limit: 25000 },
          { tier: "T4 (Supervisor)", limit: 10000 },
          { tier: "T5 (Staff)", limit: 1000 },
        ],
        condition: "order_value > tier_limit",
        action: "Escalate to higher tier for approval",
      },
      {
        rule: "Document stage progression",
        stages: "ENQ → QUO → SENT → ACC → ORD → FAB → INS → INV → PAID",
        action: "Track document through lifecycle",
      },
      {
        rule: "Customer tier classification",
        tiers: [
          { name: "Platinum", color: "Purple", benefits: "Highest priority, best rates" },
          { name: "Sapphire", color: "Blue", benefits: "High priority, good rates" },
          { name: "Steel", color: "Gray", benefits: "Standard priority" },
          { name: "Green", color: "Green", benefits: "New customer" },
          { name: "Crimson", color: "Red", benefits: "Requires attention" },
        ],
      },
    ],
    
    integrations: [
      {
        system: "NEXUS",
        purpose: "Orchestration and event coordination",
        type: "hub",
        integration_type: "webhooks + messages",
      },
      {
        system: "Xero",
        purpose: "Accounting, invoicing, financial data",
        type: "external-api",
        integration_type: "REST API",
      },
      {
        system: "SharePoint",
        purpose: "Document storage and management",
        type: "external-api",
        integration_type: "Graph API",
      },
      {
        system: "Companies House",
        purpose: "Company data lookup and verification",
        type: "external-api",
        integration_type: "REST API",
      },
      {
        system: "Experian",
        purpose: "Credit checking and risk assessment",
        type: "external-api",
        integration_type: "API via MCP-FINANCE",
      },
      {
        system: "MCP-SALES",
        purpose: "Sales tools and CRM integration",
        type: "mcp-server",
        integration_type: "MCP protocol",
      },
      {
        system: "MCP-FINANCE",
        purpose: "Finance tools and credit checking",
        type: "mcp-server",
        integration_type: "MCP protocol",
      },
      {
        system: "MCP-OPERATIONS",
        purpose: "Operations and production tools",
        type: "mcp-server",
        integration_type: "MCP protocol",
      },
      {
        system: "MCP-COMMUNICATIONS",
        purpose: "Email and SMS communication",
        type: "mcp-server",
        integration_type: "MCP protocol",
      },
      {
        system: "MCP-DATA",
        purpose: "Data analysis and reporting",
        type: "mcp-server",
        integration_type: "MCP protocol",
      },
    ],
    
    webhook_events: [
      "enquiry.created",
      "quote.requested",
      "order.approved",
      "customer.registered",
      "credit.check_required",
      "invoice.due",
      "payment.received",
    ],
    
    supported_messages: [
      "query.customer_data",
      "query.quote_status",
      "query.order_status",
      "action.create_quote",
      "action.approve_order",
      "action.send_invoice",
      "action.check_credit",
      "query.production_schedule",
    ],
    
    technical_stack: {
      framework: "Next.js 14 (App Router)",
      language: "TypeScript",
      ui: "React + Tailwind CSS + shadcn/ui",
      charts: "Chart.js + Recharts",
      database: "PostgreSQL via Prisma",
      authentication: "NextAuth.js",
      deployment: "Abacus.AI Platform",
    },
  };
}

/**
 * Generate README content
 */
function generateReadme(businessLogic: any): string {
  return `# ${businessLogic.app_name}

**Platform:** ${businessLogic.platform}  
**Category:** ${businessLogic.category}  
**Status:** ${businessLogic.status}  
**Deployment:** https://sfg-unified-brain.abacusai.app

## 🎯 Purpose

${businessLogic.purpose}

## ✨ Capabilities

${businessLogic.capabilities.map((cap: string) => `- ${cap}`).join("\n")}

## 🔄 Workflows

${businessLogic.workflows
  .map(
    (workflow: any) => `
### ${workflow.name}

${workflow.description}

**Steps:**
${workflow.steps.map((step: string, idx: number) => `${idx + 1}. ${step}`).join("\n")}
`
  )
  .join("\n")}

## 📋 Business Rules

${businessLogic.business_rules
  .map(
    (rule: any) => `
### ${rule.rule}

- **Condition:** ${rule.condition || "N/A"}
- **Action:** ${rule.action || "N/A"}
${rule.escalation ? `- **Escalation:** ${rule.escalation}` : ""}
${rule.validity ? `- **Validity:** ${rule.validity}` : ""}
${rule.stages ? `- **Stages:** ${rule.stages}` : ""}
${
  rule.tiers
    ? `\n**Tiers:**\n${rule.tiers.map((tier: any) => `- ${tier.tier || tier.name}: ${tier.limit ? "£" + tier.limit.toLocaleString() : tier.benefits || tier.color}`).join("\n")}`
    : ""
}
`
  )
  .join("\n")}

## 🔗 Integrations

${businessLogic.integrations
  .map(
    (integration: any) =>
      `- **${integration.system}** (${integration.type}): ${integration.purpose}`
  )
  .join("\n")}

## 🔔 Webhook Events

This app listens for the following events from NEXUS:

${businessLogic.webhook_events.map((event: string) => `- \`${event}\``).join("\n")}

**Webhook URL:** ${WEBHOOK_URL}

## 💬 Supported Messages

This app can handle the following message types:

${businessLogic.supported_messages.map((msg: string) => `- \`${msg}\``).join("\n")}

**Message Handler URL:** ${MESSAGE_HANDLER_URL}

## 🛠️ Technical Stack

- **Framework:** ${businessLogic.technical_stack.framework}
- **Language:** ${businessLogic.technical_stack.language}
- **UI:** ${businessLogic.technical_stack.ui}
- **Charts:** ${businessLogic.technical_stack.charts}
- **Database:** ${businessLogic.technical_stack.database}
- **Authentication:** ${businessLogic.technical_stack.authentication}
- **Deployment:** ${businessLogic.technical_stack.deployment}

## 📦 Repository

This is a registered app in the SFG App Portfolio.

**Registered:** ${new Date().toISOString().split("T")[0]}  
**Last Updated:** ${new Date().toISOString().split("T")[0]}

---

*Registered via automated self-registration system*
`;
}

/**
 * Generate registration metadata
 */
function generateMetadata(businessLogic: any): string {
  return JSON.stringify(
    {
      app_name: businessLogic.app_name,
      platform: businessLogic.platform,
      category: businessLogic.category,
      status: businessLogic.status,
      deployment_url: "https://sfg-unified-brain.abacusai.app",
      webhook_url: WEBHOOK_URL,
      webhook_events: businessLogic.webhook_events,
      webhook_secret: "sfg-aluminium-webhook-secret-2025",
      message_handler_url: MESSAGE_HANDLER_URL,
      supported_messages: businessLogic.supported_messages,
      registered_at: new Date().toISOString(),
      contact: "Warren @ SFG Aluminium",
    },
    null,
    2
  );
}

/**
 * Generate issue body
 */
function generateIssueBody(businessLogic: any): string {
  return `# ${businessLogic.app_name} - Registration Complete

## ✅ Registration Complete

**App Name:** ${businessLogic.app_name}  
**Platform:** ${businessLogic.platform}  
**Category:** ${businessLogic.category}  
**Status:** ${businessLogic.status}

## 📋 App Information

**Purpose:** ${businessLogic.purpose}

**Deployment URL:** https://sfg-unified-brain.abacusai.app  
**Webhook URL:** ${WEBHOOK_URL}  
**Message Handler URL:** ${MESSAGE_HANDLER_URL}

## 🎯 Capabilities

${businessLogic.capabilities.map((cap: string) => `- ${cap}`).join("\n")}

## 🔄 Workflows

${businessLogic.workflows.map((w: any) => `- **${w.name}:** ${w.description}`).join("\n")}

## 🔗 Integration Points

${businessLogic.integrations.map((i: any) => `- **${i.system}:** ${i.purpose}`).join("\n")}

## 🔔 Webhook Events

${businessLogic.webhook_events.map((e: string) => `- \`${e}\``).join("\n")}

## 💬 Supported Messages

${businessLogic.supported_messages.map((m: string) => `- \`${m}\``).join("\n")}

## 📁 Files Backed Up

- ✅ README.md
- ✅ business-logic.json
- ✅ registration-metadata.json

**Registered by:** SFG Aluminium Unified Dashboard (Self-Registration)  
**Date:** ${new Date().toISOString().split("T")[0]}

---

*This app is now ready for orchestration by NEXUS.*
`;
}

/**
 * Main registration execution
 */
async function executeRegistration() {
  try {
    console.log("🚀 Starting SFG Aluminium Dashboard Registration...\n");
    
    // Check if already registered
    const readmePath = `${APP_FOLDER}/README.md`;
    const alreadyRegistered = await fileExists(readmePath);
    
    if (alreadyRegistered) {
      console.log("⚠️  App is already registered in the portfolio!");
      console.log(`   Check: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/tree/main/${APP_FOLDER}`);
      return;
    }
    
    // Extract business logic
    console.log("📝 Extracting business logic...");
    const businessLogic = extractBusinessLogic();
    console.log(`   ✓ ${businessLogic.capabilities.length} capabilities`);
    console.log(`   ✓ ${businessLogic.workflows.length} workflows`);
    console.log(`   ✓ ${businessLogic.integrations.length} integrations`);
    console.log(`   ✓ ${businessLogic.webhook_events.length} webhook events`);
    console.log(`   ✓ ${businessLogic.supported_messages.length} message types\n`);
    
    // Generate files
    console.log("📄 Generating registration files...");
    const readme = generateReadme(businessLogic);
    const metadata = generateMetadata(businessLogic);
    const businessLogicJson = JSON.stringify(businessLogic, null, 2);
    console.log("   ✓ README.md");
    console.log("   ✓ business-logic.json");
    console.log("   ✓ registration-metadata.json\n");
    
    // Create files in GitHub
    console.log("📤 Uploading files to GitHub repository...");
    
    await createFile(
      `${APP_FOLDER}/README.md`,
      readme,
      `Register ${APP_NAME} - README`
    );
    console.log(`   ✓ ${APP_FOLDER}/README.md`);
    
    await createFile(
      `${APP_FOLDER}/business-logic.json`,
      businessLogicJson,
      `Register ${APP_NAME} - Business Logic`
    );
    console.log(`   ✓ ${APP_FOLDER}/business-logic.json`);
    
    await createFile(
      `${APP_FOLDER}/registration-metadata.json`,
      metadata,
      `Register ${APP_NAME} - Metadata`
    );
    console.log(`   ✓ ${APP_FOLDER}/registration-metadata.json\n`);
    
    // Create registration issue
    console.log("🎫 Creating registration issue on GitHub...");
    const issueBody = generateIssueBody(businessLogic);
    const issueNumber = await createIssue(
      `[Registration] ${APP_NAME}`,
      issueBody,
      ["registration", "satellite-app", "sfg-aluminium-app", "pending-approval"]
    );
    console.log(`   ✓ Issue #${issueNumber} created\n`);
    
    // Success summary
    console.log("✅ REGISTRATION COMPLETE!\n");
    console.log("📦 Repository:");
    console.log(`   https://github.com/sfgaluminium1-spec/sfg-app-portfolio\n`);
    console.log("📁 Files:");
    console.log(`   https://github.com/sfgaluminium1-spec/sfg-app-portfolio/tree/main/${APP_FOLDER}\n`);
    console.log("🎫 Registration Issue:");
    console.log(`   https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues/${issueNumber}\n`);
    console.log("🔔 Webhook Endpoint:");
    console.log(`   ${WEBHOOK_URL}\n`);
    console.log("💬 Message Handler:");
    console.log(`   ${MESSAGE_HANDLER_URL}\n`);
    console.log("🎯 Next Steps:");
    console.log("   1. NEXUS will review registration (within 24 hours)");
    console.log("   2. NEXUS will test webhook endpoint");
    console.log("   3. NEXUS will test message handler");
    console.log("   4. Issue gets 'approved' label");
    console.log("   5. App is ready for orchestration!\n");
    
  } catch (error: any) {
    console.error("\n❌ Registration failed!");
    console.error(`   Error: ${error.message}`);
    if (error.stack) {
      console.error(`\n   Stack trace:\n${error.stack}`);
    }
    process.exit(1);
  }
}

// Execute registration
executeRegistration();
