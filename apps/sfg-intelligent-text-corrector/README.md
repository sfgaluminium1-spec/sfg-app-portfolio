
# SFG Intelligent Text Corrector

**App Name:** SFG-IntelligentTextCorrector  
**Version:** 1.2.0  
**Category:** Productivity & AI Tools  
**Platform:** Chrome Extension + Web Application  
**Status:** Production  
**Deployed:** https://sfg-ai-prompt.abacusai.app

---

## 🎯 Purpose

SFG Intelligent Text Corrector is an enterprise-grade Chrome extension and web application designed to enhance text quality and AI prompt effectiveness for SFG staff and customers. It provides real-time text correction, intelligent rewriting, and AI prompt enhancement capabilities accessible via right-click context menu.

---

## ✨ Key Features

### 1. **Intelligent Text Correction**
- Grammar checking and correction
- Punctuation validation and fixes
- Context-aware suggestions
- Real-time corrections

### 2. **AI Prompt Enhancement**
- Transform basic prompts into detailed, effective instructions
- Optimize prompt structure for better AI responses
- Multi-step prompt generation
- Prompt variation generation

### 3. **Smart Rewriting Modes**
- **Simple Rewrite:** Clean and straightforward language
- **Business Style Rewrite:** Professional corporate tone
- **Technical Rewrite:** Precise technical documentation style
- **Custom Templates:** Pre-built business templates

### 4. **Chrome Extension Integration**
- Right-click context menu access
- Works on any text field across the web
- Seamless integration with SFG workflows
- Instant corrections and enhancements

### 5. **User Management**
- Secure authentication (NextAuth.js)
- Password reset functionality
- User preferences and settings
- Correction history tracking

---

## 🎨 Design & Branding

- **Theme:** Warren Executive Theme with glassmorphism UI
- **Logo:** SFG Innovations branding (2x larger, prominent placement)
- **Colors:** Professional gradient scheme with brand consistency
- **UX:** Modern, intuitive interface optimized for productivity

---

## 🏗️ Architecture

### **Tech Stack:**
- **Frontend:** Next.js 14.2.28, React 18, TypeScript
- **UI Components:** Radix UI, Tailwind CSS, shadcn/ui
- **Authentication:** NextAuth.js with Prisma adapter
- **Database:** PostgreSQL with Prisma ORM
- **AI/LLM:** Abacus.AI LLM APIs
- **Extension:** Chrome Extension Manifest V3

### **Key Components:**
- Web application (Next.js)
- Chrome extension (background service worker, content scripts, popup UI)
- REST API endpoints for text correction and AI enhancement
- PostgreSQL database for user data and history

---

## 📦 Capabilities

### **Text Processing:**
- Correct grammar and punctuation errors
- Rewrite text in multiple styles
- Enhance clarity and readability
- Maintain original meaning and intent

### **AI Enhancement:**
- Transform prompts for better AI responses
- Generate multi-step instructions
- Create prompt variations
- Explain prompt effectiveness

### **Integration:**
- Chrome browser integration via extension
- Web-based interface for extended features
- API endpoints for programmatic access
- Real-time processing with LLM APIs

---

## 🔄 Workflows

### **Workflow 1: Text Correction via Right-Click**
1. User selects text on any webpage
2. Right-clicks to open context menu
3. Selects "🚀 SFG AI Tools" → correction type
4. Extension sends text to API
5. API processes via LLM
6. Corrected text replaces original
7. Correction saved to history (if logged in)

### **Workflow 2: AI Prompt Enhancement**
1. User writes basic prompt
2. Selects text and right-clicks
3. Chooses "AI Prompt Enhance"
4. Extension sends to enhancement API
5. API analyzes and improves prompt
6. Enhanced prompt replaces original
7. User gets more effective AI responses

### **Workflow 3: Business Template Application**
1. User clicks in editable field
2. Right-clicks for context menu
3. Selects "Business Templates"
4. Chooses template type (email, proposal, etc.)
5. Template inserted with placeholders
6. User customizes content
7. Template saved for reuse

---

## 🔌 Integration Points

### **Current Integrations:**
- **Abacus.AI LLM APIs:** Text correction and AI enhancement
- **Chrome Browser:** Extension APIs for context menu and content scripts
- **PostgreSQL:** User data, preferences, and history storage

### **Potential SFG Integrations:**
- **MCP-COMMUNICATIONS:** For email and document enhancement
- **NEXUS:** For orchestrated text processing workflows
- **SharePoint:** For document correction in enterprise storage
- **Microsoft 365:** For Office document enhancement

---

## 📡 API Endpoints

### **Core Endpoints:**

**1. Text Correction**
```
POST /api/correct
Body: { text, mode, userId }
Response: { corrected_text, changes, confidence }
```

**2. AI Prompt Enhancement**
```
POST /api/prompt-enhance
Body: { prompt, userId }
Response: { enhanced_prompt, improvements, tips }
```

**3. User Authentication**
```
POST /api/signup
POST /api/auth/[...nextauth]
POST /api/password-reset
```

**4. History Management**
```
GET /api/history?userId=xxx
Response: { corrections: [...] }
```

**5. Templates**
```
GET /api/templates
Response: { templates: [...] }
```

---

## 🔔 Webhook Events (Future)

**Potential Events for SFG Ecosystem:**
- `text.corrected` - Text correction completed
- `prompt.enhanced` - AI prompt enhancement completed
- `document.processed` - Batch document correction completed
- `user.registered` - New user registration
- `template.created` - Custom template created

---

## 💬 Message Handler (Future)

**Potential Message Types:**
- `action.correct_text` - Correct provided text
- `action.enhance_prompt` - Enhance AI prompt
- `query.correction_history` - Get user's correction history
- `query.available_templates` - Get template list
- `action.apply_template` - Apply business template

---

## 📊 Business Rules

### **Text Processing Rules:**
- Maintain original intent and meaning
- Preserve technical terms and proper nouns
- Apply style consistently based on mode
- Flag potentially sensitive content

### **User Management:**
- Secure password hashing (bcrypt)
- JWT-based session management
- Password reset with time-limited tokens
- User preference persistence

### **Quality Standards:**
- Minimum confidence threshold: 85%
- Maximum processing time: 3 seconds
- Error handling with graceful degradation
- Privacy: No text stored beyond history (user opt-in)

---

## 🚀 Deployment

**Production URL:** https://sfg-ai-prompt.abacusai.app

**Chrome Extension:**
- Version: 1.2.0
- Distribution: Chrome Web Store (pending)
- Installation: Manual load for testing
- Updates: Automatic via Chrome

**Infrastructure:**
- Hosting: Abacus.AI platform
- Database: PostgreSQL (Abacus.AI managed)
- CDN: Abacus.AI cloud storage
- Authentication: NextAuth.js with secure sessions

---

## 📈 Metrics & KPIs

**Usage Metrics:**
- Corrections per day
- Prompt enhancements per day
- Active users
- Extension installs

**Quality Metrics:**
- Correction accuracy
- User satisfaction (implicit via reuse)
- Processing time
- Error rate

**Business Metrics:**
- User retention
- Feature adoption rate
- Template usage
- Premium conversions (future)

---

## 🔐 Security

- HTTPS only for all communications
- Secure authentication with NextAuth.js
- Password hashing with bcrypt (12 rounds)
- JWT tokens with expiration
- API rate limiting (future)
- Input sanitization and validation
- No sensitive data logged

---

## 📝 Installation

### **Chrome Extension:**
1. Download extension from web app
2. Open Chrome → Extensions → Enable Developer Mode
3. Load unpacked extension
4. Pin extension to toolbar
5. Right-click anywhere to use

### **Web Application:**
1. Visit https://sfg-ai-prompt.abacusai.app
2. Sign up for account
3. Access all features
4. Download Chrome extension
5. Track correction history

---

## 🎓 User Guide

### **For End Users:**
- Select text → Right-click → Choose correction type
- Visit web app for advanced features
- View history and preferences in dashboard
- Download and install Chrome extension

### **For Administrators:**
- Monitor usage via admin dashboard (future)
- Manage user accounts
- Configure business templates
- Review system metrics

---

## 🔮 Future Enhancements

1. **SFG Business Integration:**
   - Integration with NEXUS for orchestrated workflows
   - MCP-COMMUNICATIONS for email enhancement
   - SharePoint document correction
   - Microsoft 365 add-in

2. **Advanced Features:**
   - Batch document processing
   - Custom style guidelines
   - Team templates and sharing
   - Multi-language support

3. **Analytics:**
   - Usage dashboards
   - Quality analytics
   - User behavior insights
   - ROI metrics

4. **Enterprise Features:**
   - SSO integration (Google, Microsoft)
   - Team management
   - Usage reporting
   - Custom model fine-tuning

---

## 📞 Support

**Developer:** SFG Innovations  
**Contact:** via GitHub issues  
**Documentation:** https://sfg-ai-prompt.abacusai.app  
**Repository:** Private (source code backed up to SFG App Portfolio)

---

## 📄 License

Proprietary - SFG Innovations  
© 2025 SFG Innovations. All rights reserved.

---

**Last Updated:** November 5, 2025  
**Registered in SFG App Portfolio:** November 5, 2025
