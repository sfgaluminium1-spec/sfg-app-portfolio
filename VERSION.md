
# SFG Aluminium Ltd Website Version Log

## Current Version: 1.8.2
**Release Date:** November 5, 2025  
**Status:** Unified Data Structure & Comprehensive Application Inventory  

### Version History

#### v1.8.2 (November 5, 2025) - UNIFIED DATA STRUCTURE & ORGANIZATION
- **📁 COMPREHENSIVE FOLDER STRUCTURE CREATED**
- **ORGANIZED DATA MANAGEMENT SYSTEM:**
  - `/data` directory created with subdirectories for enquiries, quotes, services, customers, uploads
  - `/config` directory for configuration files
  - `/backup` directory for backup storage
  - `/logs` directory for application logs
- **JSON TEMPLATES CREATED:**
  - `data/enquiries/TEMPLATE.json` - Contact enquiry template
  - `data/quotes/TEMPLATE.json` - Quote request template
  - `data/services/TEMPLATE.json` - Service inquiry template
  - `data/customers/TEMPLATE.json` - Customer profile template
- **DOCUMENTATION ENHANCED:**
  - Created comprehensive README files for all directories
  - Added file naming conventions and data retention policies
  - Documented backup procedures and log rotation
- **UNIFIED APPLICATION INVENTORY:**
  - Created `SFG_UNIFIED_APPLICATION_INVENTORY.md` - Complete application inventory
  - 13 sections covering all aspects of the application
  - Comprehensive structure documentation
  - Integration points and business rules reference
- **CONFIGURATION ORGANIZATION:**
  - Moved business-logic.json to config/
  - Moved registration-metadata.json to config/
  - Created backup of registration-backup.json
- **READY FOR PRODUCTION:**
  - All data structures in place
  - Templates ready for use
  - Comprehensive documentation complete
  - Clear organization and maintenance procedures

#### v1.8.1 (November 5, 2025) - COMPLETE REGISTRATION IMPLEMENTATION
- **🎉 COMPLETE SFG ALUMINIUM APP REGISTRATION IMPLEMENTED**
- **GITHUB ISSUE CREATED:** #43 - https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues/43
- **REGISTRATION STATUS:** Successfully registered with all required components
- **UPDATED FILES:**
  - `business-logic.json` - Enhanced with all SFG-specific business rules
  - `registration-metadata.json` - Complete metadata with webhook/message handler URLs
  - `README.md` - Comprehensive app documentation with all workflows and integrations
- **SFG BUSINESS RULES INTEGRATED:**
  - Minimum margin requirement (15% minimum, 25% target)
  - Credit check threshold (orders > £10,000 require Experian check)
  - Credit check validity (90 days)
  - Tier-based approval limits (T1:£1M, T2:£100K, T3:£25K, T4:£10K, T5:£1K)
  - Document stage workflow (ENQ → QUO → SENT → ACC → ORD → FAB → INS → INV → PAID)
  - Customer tier assignment (Platinum, Sapphire, Steel, Green, Crimson)
  - Margin warning threshold (18%)
- **INTEGRATION POINTS EXPANDED:**
  - NEXUS (orchestration hub) - Required
  - MCP-SALES (CRM integration) - Required
  - MCP-FINANCE (Experian, Xero) - Required
  - MCP-OPERATIONS (production, installation) - Required
  - MCP-COMMUNICATIONS (email, SMS) - Required
  - MCP-DATA (analytics, reporting) - Required
  - Xero (accounting) - Planned
  - SharePoint (documents) - Planned
  - Companies House (company data) - Planned
  - Experian (credit checks via MCP-FINANCE) - Planned
- **WEBHOOK ENDPOINT:** https://sfg-website-2025.abacusai.app/api/webhooks/nexus
  - Signature verification: HMAC SHA-256
  - Events: enquiry.created, quote.requested, order.approved, customer.registered, credit.check_required, invoice.due, payment.received
  - Health check: GET endpoint returns service status
- **MESSAGE HANDLER:** https://sfg-website-2025.abacusai.app/api/messages/handle
  - Authentication: API key (X-API-Key header)
  - Messages: query.enquiry_status, query.customer_enquiries, action.update_enquiry_status, action.send_quote_email, action.create_follow_up_task
  - Health check: GET endpoint returns supported message types
- **REGISTRATION SCRIPT:**
  - `register-app.js` - Corrected GitHub App authentication
  - Uses @octokit/auth-app for proper token generation
  - Successfully created issue #43 with comprehensive details
  - Local backup: `registration-backup.json`
- **NEXT STEPS:**
  - NEXUS will review registration within 24 hours
  - NEXUS will test webhook endpoint with test event
  - NEXUS will test message handler with test message
  - Upon approval, issue receives `approved` label and `pending-approval` removed
  - Real-time orchestration begins
- **STATUS:** ✅ Complete Registration - Awaiting NEXUS Review & Testing

#### v1.8.0 (November 5, 2025)
- **NEXUS ORCHESTRATION INTEGRATION COMPLETE** - Real-time communication infrastructure
- **GITHUB ISSUE CREATED:** #40 - https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues/40
- **WEBHOOK ENDPOINT IMPLEMENTED:** `/api/webhooks/nexus`
  - HMAC signature verification for security
  - Handles 7 event types: enquiry.created, quote.requested, order.approved, customer.registered, credit.check_required, invoice.due, payment.received
  - Automated response processing and database updates
  - Real-time notifications to sales and operations teams
- **MESSAGE HANDLER IMPLEMENTED:** `/api/messages/handle`
  - API key authentication
  - Handles 5 message types: query.enquiry_status, query.customer_enquiries, action.update_enquiry_status, action.send_quote_email, action.create_follow_up_task
  - Request/response tracking with request IDs
  - Database queries and action execution
- **HEALTH CHECK ENDPOINT:** `/api/health`
  - System status monitoring
  - Service uptime tracking
  - Memory usage reporting
  - Endpoint availability verification
- **ENVIRONMENT VARIABLES CONFIGURED:**
  - `WEBHOOK_SECRET` - Webhook signature verification
  - `NEXUS_API_KEY` - Message handler authentication
  - GitHub App credentials for app registration
- **BUSINESS LOGIC DOCUMENTED:**
  - Full business-logic.json with 10 capabilities
  - 4 workflows defined with triggers and outputs
  - 7 business rules documented
  - 7 integration points mapped
  - 7 webhook events subscribed
  - 5 message types supported
  - 5 API endpoints available
  - 3 data models defined
- **AUTONOMOUS REGISTRATION SCRIPT:**
  - `autonomous_registration.py` - Successfully executed
  - Created GitHub issue #40 automatically
  - Zero manual intervention required
  - Local backup saved: `registration-backup.json`
- **APP CAPABILITIES:**
  - Lead capture via contact forms
  - Quote request processing
  - Service inquiry management
  - Product catalog display
  - Customer self-service portal
  - Real-time enquiry notifications
  - Multi-channel lead routing
  - Document generation
  - CRM integration
  - Analytics and conversion tracking
- **INTEGRATION READY:**
  - NEXUS orchestration hub
  - MCP-SALES tools
  - MCP-FINANCE tools
  - MCP-OPERATIONS tools
  - MCP-COMMUNICATIONS tools
  - Cloud storage (S3)
  - Email service
- **MONITORING:**
  - Health check: https://sfg-website-2025.abacusai.app/api/health
  - Uptime requirement: 99.9%
  - Response time target: < 500ms
- **FILES CREATED:**
  - `app/api/webhooks/nexus/route.ts` - Webhook handler
  - `app/api/messages/handle/route.ts` - Message handler
  - `app/api/health/route.ts` - Health check endpoint
  - `business-logic.json` - Complete business logic documentation
  - `autonomous_registration.py` - Registration script
  - `registration-backup.json` - Registration confirmation
- **STATUS:** ✅ Fully Registered & Ready for NEXUS Orchestration
- **NEXT STEPS:**
  - NEXUS to review registration (within 24 hours)
  - NEXUS to test webhook endpoint
  - NEXUS to test message handler
  - Upon approval, app will receive `approved` label
  - Real-time orchestration will begin

#### v1.7.0 (November 5, 2025)
- **GOOGLE ANALYTICS 4 (GA4) INTEGRATION** - Full tracking and analytics implementation
- **ANALYTICS PACKAGE:** `@next/third-parties` Google Analytics component integrated
- **MEASUREMENT ID:** Environment variable configured (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- **TRACKING SCOPE:** Site-wide tracking in root layout for all pages
- **PERFORMANCE OPTIMIZED:** Scripts load after page hydration for optimal performance
- **GDPR READY:** Privacy-compliant tracking implementation
- **AUTONOMOUS APP REGISTRATION COMPLETED:**
  - ✅ Successfully registered in SFG App Portfolio
  - ✅ GitHub Issue #39 created: https://github.com/sfgaluminium1-spec/sfg-app-portfolio/issues/39
  - ✅ Business logic uploaded to repository
  - ✅ Registration metadata submitted
  - ✅ App Code: `sfg-aluminium-corporate-website`
  - ✅ Status: Awaiting Nexus approval for orchestration integration
- **AUTONOMOUS REGISTRATION SCRIPT:**
  - `autonomous_registration.py` - Full autonomous registration implementation
  - Zero manual intervention required
  - Automatic GitHub authentication
  - Business logic extraction and upload
  - Issue creation and confirmation
- **REGISTRATION DETAILS:**
  - 10 capabilities documented
  - 3 workflows implemented
  - 4 business rules defined
  - 3 API endpoints available
  - 6+ integrations configured
  - 3 data models defined
- **DEPLOYMENT URL:** https://sfg-website-2025.abacusai.app
- **FILES MODIFIED:**
  - `app/layout.tsx` - Added GoogleAnalytics component
  - `package.json` - Added @next/third-parties dependency
  - Created: `autonomous_registration.py`
  - Created: `business-logic.json`
- **NEXT STEPS:**
  - User to add actual GA4 Measurement ID (format: G-XXXXXXXXXX)
  - Find Measurement ID in Google Analytics → Admin → Data Streams
  - Update environment variable: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **STATUS:** ✅ Analytics Integrated & App Registered in Portfolio

#### v1.6.0 (November 5, 2025)
- **MAJOR ENHANCEMENT** - SFG Aluminium-Specific App Registration with Real-Time Orchestration
- **WEBHOOK SYSTEM:** Complete webhook endpoint implementation for real-time NEXUS events
- **MESSAGE HANDLERS:** Request/response message system for inter-app communication
- **SFG BUSINESS RULES:** Complete implementation of SFG-specific business logic
  - Margin enforcement (15% minimum, 25% target)
  - Tier-based approval limits (T1-T5: £1k to £1M)
  - Credit check automation (> £10k orders, 90-day validity)
  - Customer tier system (Platinum, Sapphire, Steel, Green, Crimson)
  - Document stage tracking (ENQ → QUO → SENT → ACC → ORD → FAB → INS → INV → PAID)
- **WEBHOOK EVENT TYPES:**
  - `enquiry.created` - New customer enquiry received
  - `quote.requested` - Quote generation requested
  - `order.approved` - Order approval notification
  - `customer.registered` - New customer registration
  - `credit.check_required` - Credit check trigger
  - `invoice.due` - Payment due notification
  - `payment.received` - Payment confirmation
- **MESSAGE TYPES SUPPORTED:**
  - `query.customer_data` - Fetch customer information
  - `query.quote_status` - Get quote details
  - `query.order_status` - Get order tracking info
  - `action.create_quote` - Generate new quote
  - `action.approve_order` - Approve order
  - `action.send_invoice` - Send invoice to customer
- **CODE EXAMPLES PROVIDED:**
  - `webhook-handler-python.py` - Python/FastAPI webhook implementation
  - `webhook-handler-nodejs.js` - Node.js/Express webhook implementation
  - `message-handler-python.py` - Python/FastAPI message handler
  - `message-handler-nodejs.js` - Node.js/Express message handler
  - `sfg-aluminium-example.json` - Complete registration example for SFG Customer Portal
- **INTEGRATION REQUIREMENTS:**
  - NEXUS (orchestration hub) - Required
  - MCP-SALES (sales tools) - Required
  - MCP-FINANCE (finance tools, Experian, Xero) - Required
  - MCP-OPERATIONS (production tracking) - Required
  - MCP-COMMUNICATIONS (notifications) - Required
  - MCP-DATA (data tools) - Required
  - SharePoint (document storage) - Recommended
  - Xero (accounting) - Recommended
  - Companies House (company verification) - Recommended
- **DOCUMENTATION CREATED:**
  - `SFG_ALUMINIUM_APP_REGISTRATION.md` - Complete SFG-specific registration guide
  - Webhook setup instructions with signature verification
  - Message handler implementation patterns
  - SFG business rules reference
  - Troubleshooting guides for webhooks and message handlers
- **REGISTRATION WORKFLOW:**
  1. Install GitHub client (Python/Node.js)
  2. Authenticate with GitHub App credentials
  3. Extract business logic with SFG requirements
  4. Implement webhook endpoint
  5. Implement message handler
  6. Create registration files
  7. Submit GitHub issue
  8. NEXUS tests webhook and message handler
  9. Approval within 24 hours
  10. Begin orchestrated operation
- **APPROVAL WORKFLOW:**
  - NEXUS reviews registration (24 hours)
  - Webhook endpoint tested (sends test event)
  - Message handler tested (sends test message)
  - Issue labeled `approved` upon success
  - Real-time orchestration begins
- **FILES ADDED:**
  - `/satellite-registration/SFG_ALUMINIUM_APP_REGISTRATION.md`
  - `/satellite-registration/examples/webhook-handler-python.py`
  - `/satellite-registration/examples/webhook-handler-nodejs.js`
  - `/satellite-registration/examples/message-handler-python.py`
  - `/satellite-registration/examples/message-handler-nodejs.js`
  - `/satellite-registration/examples/sfg-aluminium-example.json`
- **TARGET APPS:** Customer portals, operations apps, finance apps, any SFG business-critical apps
- **UNIVERSAL PROMPT PRESERVED:** Simple registration still available for utility apps
- **STATUS:** ✅ Full Real-Time SFG Aluminium App Orchestration System Operational

#### v1.5.0 (November 3, 2025)
- **MAJOR FEATURE** - SFG Satellite App Registration System
- **GITHUB INTEGRATION:** Complete GitHub App authentication with Octokit
- **AUTONOMOUS REGISTRATION:** Automated GitHub issue creation for satellite apps
- **BUSINESS LOGIC FRAMEWORK:** Comprehensive extraction and documentation system
- **DIRECTORY STRUCTURE:**
  - `/satellite-registration/` - Root directory for registration system
  - `/satellite-registration/scripts/` - GitHub auth, extraction, and registration scripts
  - `/satellite-registration/types/` - TypeScript interface definitions
  - `/satellite-registration/utils/` - Issue formatting utilities
  - `/satellite-registration/examples/` - Templates and examples
- **CORE COMPONENTS:**
  - `github-auth.ts` - GitHub App authentication with credentials
  - `extract-business-logic.ts` - Business logic extraction template
  - `register-satellite.ts` - Main registration orchestration script
  - `issue-formatter.ts` - GitHub issue body formatting
  - `business-logic.ts` - TypeScript type definitions
- **TEMPLATES PROVIDED:**
  - Quick registration template (manual GitHub issue creation)
  - Example business logic (QuickSpace workspace management)
  - Complex app example (Pichada Legal compliance system)
- **DOCUMENTATION:**
  - Complete README with setup instructions
  - 5-minute quick start guide
  - 30-45 minute detailed registration guide
  - Troubleshooting section
  - Success criteria checklist
- **ENVIRONMENT VARIABLES CONFIGURED:**
  - `GITHUB_APP_ID=2228094`
  - `GITHUB_APP_INSTALLATION_ID=92873690`
  - `GITHUB_OWNER=sfgaluminium1-spec`
  - `GITHUB_REPO=sfg-app-portfolio`
  - `GITHUB_APP_PRIVATE_KEY` (RSA private key secured in .env)
- **DEPENDENCIES ADDED:**
  - `@octokit/rest` - GitHub REST API client
  - `@octokit/auth-app` - GitHub App authentication
- **CAPABILITIES:**
  - Autonomous satellite app registration via GitHub issues
  - Business logic extraction with validation
  - Workflow documentation with steps, triggers, outputs
  - Business rules with conditions and priorities
  - API endpoint documentation
  - Data model definitions
  - Integration tracking
  - Local backup of business logic (JSON)
- **REPOSITORY:** https://github.com/sfgaluminium1-spec/sfg-app-portfolio
- **NEXUS REVIEW:** 24-48 hour approval workflow
- **STATUS:** ✅ Full Satellite App Registration System Operational

#### v1.4.0 (October 31, 2025)
- **MAJOR DOCUMENTATION** - Comprehensive Chat Extraction completed
- **CONSOLIDATION:** All conversation history from August 2024 to October 2025 extracted
- **SOURCES PROCESSED:**
  - Current conversation summary (key decisions and implementations)
  - `SFG Website  llm chat  conversation.pdf` (176 pages of detailed conversation)
  - `user_message_2025-08-11_20-18-06.txt` (180+ page specification)
  - `user_message_2025-08-11_23-11-30.txt` (SFG Innovations override directive)
- **DOCUMENT CREATED:** `COMPREHENSIVE_CHAT_EXTRACTION.md` (30+ pages)
- **CONTENT COVERAGE:**
  - Complete project evolution timeline (4 phases)
  - All critical specifications and decisions
  - Brand identity and design guidelines (Warren Executive Theme)
  - Technical architecture documentation
  - Content strategy and requirements
  - UK compliance and regulations mapping
  - Integration requirements (Microsoft 365, /apps microfrontends)
  - Complete page inventory (180+ pages mapped)
  - Implementation directives and Universal Task Framework
  - Current status and detailed roadmap
- **KEY INSIGHTS DOCUMENTED:**
  - Brand separation rules (SFG Aluminium vs SFG Innovations)
  - PPM-only services model (no 24/7 emergency)
  - Warren Executive Theme specifications
  - Product page structure (10 categories × 6 subpages = 60 pages)
  - /apps microfrontends security model
  - 15+ source files identified for content extraction
- **FILES MODIFIED:** 
  - Created: `/home/ubuntu/sfg_aluminium_ltd/COMPREHENSIVE_CHAT_EXTRACTION.md`
  - Created: `/home/ubuntu/sfg_aluminium_ltd/COMPREHENSIVE_CHAT_EXTRACTION.pdf`
  - Updated: `/home/ubuntu/sfg_aluminium_ltd/VERSION.md`
- **STATUS:** ✅ Complete Conversation History Documented and Archived

#### v1.3.0 (September 8, 2025)
- **MAJOR DOCUMENTATION** - Unified Application Inventory framework created
- **EXTRACTION PLAN:** Comprehensive legacy content extraction strategy
- **PROCEDURE TEMPLATES:** Standardized documentation for business procedures
- **WORKFLOW TEMPLATES:** Standardized documentation for workflows
- **INTEGRATION FRAMEWORK:** Complete API endpoint specifications
- **DATA MODELS:** Core entity schemas (Customer, Staff, Document, BaseNumber)
- **MCP CONFIGURATION:** AgentPass server orchestration documented
- **THEME TOKENS:** Warren Executive Theme complete specification
- **EXTRACTION TOOLS:** Python script for automated content extraction
- **BUSINESS LOGIC:** Framework for capturing procedures and workflows
- **STATUS:** ✅ Ready for Legacy Content Extraction Phase

#### v1.2.0 (September 8, 2025)
- **MAJOR FEATURE** - Advanced video hero background system implementation
- **VIDEO SYSTEM:** Multi-device responsive video (Desktop/Tablet/Mobile formats)
- **ANIMATIONS:** Scroll-triggered animations with intersection observers
- **MICRO-INTERACTIONS:** Button hover effects, scale transforms, shimmer animations
- **ACCESSIBILITY:** Full compliance with reduced-motion support and screen readers
- **PERFORMANCE:** Progressive enhancement with intelligent fallbacks
- **THEME INTEGRATION:** Warren Executive Theme colors and metallic effects
- **CTA ENHANCEMENT:** Animated "Get Free Quote" and "Book Survey" buttons
- **STATISTICS:** Dynamic counting animations for trust indicators
- **CONTROLS:** Video play/pause, mute/unmute, progress tracking
- **STATUS:** ✅ Advanced Interactive Hero Experience Complete

#### v1.1.0 (September 8, 2025)
- **SERVICE CONTENT UPDATE** - Replaced emergency services with PPM focus
- **CHANGE:** Updated "24/7 Emergency Service Available" to "Pre-Planned Maintenance (PPM) Services"
- **ENHANCEMENT:** Added prominent version display system with floating badge
- **FOOTER UPDATE:** Enhanced footer with dynamic version information
- **FEATURES:** Version badge component with multiple display variants
- **ALIGNMENT:** Content now accurately reflects PPM-only service model
- **STATUS:** ✅ Content Aligned with Business Model

#### v1.0.0 (September 8, 2025)
- **INITIAL BUILD** - Base Next.js structure created
- **DESIGN BRIEF INTEGRATION** - 180+ page specification implemented
- **SCOPE:** Comprehensive aluminium solutions showcase
- **FEATURES:** Hero section, products, stats, basic navigation
- **ARCHITECTURE:** Next.js 14.2.28 with TypeScript
- **STATUS:** ✅ Foundation Complete

---

## Universal Task Framework – Category Mapping

### Task Categories & Recommended AI Agents

#### 1️⃣ Ideation & Strategy
**Best Agents/LLMs:** GPT‑5 Thinking, Claude Sonnet 4, Grok 4, Nano Banana  
**Use Cases:** product strategies, campaign ideation, sales narratives, stakeholder vision docs  
**Outputs:** strategy papers, vision maps, feature roadmaps  

#### 2️⃣ Research & Intelligence
**Best Agents/LLMs:** Perplexity Pro, SearchLLM, Gemini 2.5 Pro, Claude Sonnet 3.7, RouteLLM  
**Use Cases:** market scans, compliance/legal research, competitor analysis, technical stack evals, trend scouting  
**Outputs:** research briefs, competitor benchmarks, regulatory impact summaries  

#### 3️⃣ Planning & Directives
**Best Agents/LLMs:** GPT‑5, Claude Sonnet 4, Gemini 2.5 Flash, Llama4 Maverick, AI Engineer Agent  
**Use Cases:** build directives, project planning, technical paradigms, security & compliance protocols  
**Outputs:** directive documents, resource allocation plans, governance standards  

#### 4️⃣ Prototyping & Build
**Best Agents/LLMs:** CodeLLM, GPT‑4o, GPT‑5 Mini, Nano Banana  
**Use Cases:** code generation, frontend/backend scaffolds, UI mockups, workflow POCs, RAG/chatbot prototypes  
**Outputs:** code repos, sandbox builds, prototype screenshots, UI wireframes  

#### 5️⃣ Testing, QA & Review
**Best Agents/LLMs:** GPT‑4.1, GPT‑5 Thinking, CodeLLM, Claude Sonnet 3.7, DeepSeek R1  
**Use Cases:** regression/unit testing, security testing, compliance reviews, accessibility checks, performance simulations  
**Outputs:** test reports, bug logs, compliance gap analysis  

#### 6️⃣ Content & Communication
**Best Agents/LLMs:** GPT‑5, Claude Sonnet 4, Grok 4, Gemini 2.5 Flash, Custom Content Bots  
**Use Cases:** corporate web copy, tenders, bids, social media text, blogs, HR comms  
**Outputs:** copy drafts, campaign packs, compliance‑aligned statements, FAQs  

#### 7️⃣ Creative & Media
**Best Agents/LLMs:** Nano Banana, GPT‑4o, Image Agent, Video Agent  
**Use Cases:** images, ads, renders, storyboards, short videos, schematics  
**Outputs:** graphics, explainer clips, mockup assets, campaign visuals  

#### 8️⃣ Workflows & Automation
**Best Agents/LLMs:** AI Engineer Agent, Workflow Agents, Autonomous Browser Agent  
**Use Cases:** CRM sync, Microsoft 365 automation, Xero integration, email triage, Slack/Teams orchestration, portal form automation  
**Outputs:** automated flows, API call sequences, browser logs, updated dashboards  

#### 9️⃣ Deployment & Operations
**Best Agents/LLMs:** Autonomous Browser Agent, AI Engineer, RouteLLM, Claude Sonnet 4  
**Use Cases:** final app deploy, DNS + security configs, Microsoft 365 app reg, launch acceptance checklists, audit trails  
**Outputs:** deployment scripts, handover docs, exec reports, compliance record snapshots  

#### 🔟 Post‑Deployment Support
**Best Agents/LLMs:** Ops Custom Bots, RouteLLM, DeepSeek R1 (for logs), Claude Sonnet 4  
**Use Cases:** email/chat triage, customer service bots, monitoring dashboards, compliance audits, bug patch logging  
**Outputs:** ticket reports, triage decisions, monitoring dashboards, compliance packs  

### 🔹 Execution Rules for DeepAgent
- Always check tool/LLM availability at session start → integrate new models/agents by updating mappings above
- Select best specialist model per task category; avoid generalists unless no specialist fits
- For critical stages (testing, compliance, deployment), validate through RouteLLM multi‑model arbitration
- Generate handover summaries at every lifecycle stage
- Enforce GDPR & security: never expose keys, rotate API secrets, isolate knowledge bases
- Outputs must be packaged into actionable formats: structured docs, workflows, test plans, dashboards, or reports

✅ **This is now the master instruction set** — not limited to websites, but spanning all task families DeepAgent can handle today and adaptively in the future.

Think of it as your AI Production Director across Sales, Ops, Compliance, Dev, Creative, and Deployment.

---

## Project Scope Summary

### Main Website (100+ pages)
- Comprehensive aluminium solutions showcase
- Warren Executive Theme with blues/metallics
- 3D immersive elements and sustainability messaging
- Lead generation and conversion optimization

### /apps Microfrontends Host (16 pages)
- 12 specialized tools with magic-link security
- Microsoft 365 SharePoint integration
- UK Building Regulations compliance mapping

### Technical Requirements
- Next.js with TypeScript
- SSR capabilities
- SEO optimization
- GDPR compliance
- Performance optimization

---

**Next Agent Instructions:** Review this version log and continue development based on the comprehensive design brief. All updates should increment the version number and document changes here.
