
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  BookOpen, 
  Monitor, 
  Code, 
  Settings, 
  AlertTriangle,
  HelpCircle,
  FileText,
  Database,
  Zap
} from 'lucide-react';

const guideCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    sections: [
      {
        title: 'System Overview',
        content: `The SFG-Aluminium-AI-Brain system is a comprehensive business intelligence platform that integrates four AI models with your Xero financial data, document processing capabilities, and real-time monitoring.

Key Features:
• Real-time financial analytics and KPI tracking
• AI-powered document processing and analysis
• Multi-model AI integration (GPT-4, Claude-3, Gemini-Pro, Custom-LLM)
• Interactive dashboard with live data visualization
• API integration hub for third-party applications
• System control panel for administrative tasks

The system is designed to provide actionable insights for your aluminum manufacturing business, helping you make data-driven decisions and optimize operations.`
      },
      {
        title: 'First Login',
        content: `To access the SFG-Aluminium-AI-Brain system:

1. Navigate to the login page
2. Use your provided credentials or the demo account:
   • Email: john@doe.com
   • Password: johndoe123

3. After successful login, you'll be redirected to the main dashboard
4. Explore the sidebar navigation to access different sections
5. Use the date range filter to view data for different time periods

The dashboard automatically refreshes data and provides real-time updates on your business metrics.`
      }
    ]
  },
  {
    id: 'dashboard',
    title: 'Dashboard Usage',
    icon: Monitor,
    sections: [
      {
        title: 'Understanding KPI Cards',
        content: `The dashboard displays four key performance indicators at the top:

1. Total Revenue: Shows your cumulative revenue with percentage change
2. Production Efficiency: Displays current efficiency rating with trend
3. Documents Processed: Count of processed documents with growth rate
4. Active AI Models: Number of currently active AI models

Each KPI card features:
• Animated counters that update when data changes
• Trend indicators (up, down, or stable)
• Hover effects for better interactivity
• Color-coded status indicators`
      },
      {
        title: 'Interactive Charts',
        content: `The dashboard includes three main chart sections:

Financial Performance Chart:
• Line chart showing revenue, expenses, and profit over time
• Hover over data points for detailed information
• Adjustable time ranges (7 days, 30 days, 90 days, 1 year)

AI Model Usage Chart:
• Donut chart displaying request distribution across AI models
• Shows relative usage of each AI model
• Interactive legend for filtering

Business Intelligence Analytics:
• Bar chart comparing current, target, and previous performance
• Covers six key categories: Production, Quality, Efficiency, Sales, Customer, Innovation
• Percentage-based metrics for easy comparison`
      },
      {
        title: 'Filtering and Exports',
        content: `Dashboard Filtering:
• Use the date range selector in the top-right corner
• Available ranges: 7 days, 30 days, 90 days, 1 year
• All charts and KPIs update automatically when range changes

Export Functions:
• Click "Export Report" to generate comprehensive reports
• Reports include all current dashboard data
• Supports PDF and Excel formats
• Scheduled exports can be configured in the Control Panel`
      }
    ]
  },
  {
    id: 'ai-integration',
    title: 'AI Integration',
    icon: Zap,
    sections: [
      {
        title: 'AI Model Overview',
        content: `The system integrates four powerful AI models:

GPT-4:
• Natural language processing and generation
• Complex reasoning and analysis
• Best for: Strategic planning, report generation, customer communication

Claude-3:
• Advanced document analysis and summarization
• Ethical AI with strong safety measures
• Best for: Legal document review, compliance checking

Gemini-Pro:
• Multimodal AI supporting text, images, and data
• Excellent at pattern recognition
• Best for: Quality control, visual inspections

Custom-LLM:
• Industry-specific model trained on aluminum manufacturing data
• Optimized for your specific business needs
• Best for: Production optimization, process improvement`
      },
      {
        title: 'Document Processing',
        content: `AI-Powered Document Processing:

Supported File Types:
• PDF documents
• Word documents (.docx)
• Excel spreadsheets (.xlsx)
• Images (PNG, JPG)
• Plain text files

Processing Capabilities:
• Automatic text extraction and OCR
• Document classification and tagging
• Key information extraction
• Content summarization
• Compliance checking

To process documents:
1. Navigate to the Control Panel
2. Use the drag-and-drop upload area
3. Select files or drag them into the upload zone
4. Monitor processing progress in real-time
5. View results in the Documents section`
      }
    ]
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    icon: Code,
    sections: [
      {
        title: 'API Overview',
        content: `The SFG-Aluminium-AI-Brain system provides a RESTful API for integrating with other applications and systems.

Base URL: https://your-domain.com/api/v1

Authentication:
• API key authentication required
• Include your API key in the Authorization header
• Format: Authorization: Bearer YOUR_API_KEY

Rate Limiting:
• 1000 requests per hour per API key
• Rate limit information included in response headers
• Upgrade available for higher limits`
      },
      {
        title: 'Available Endpoints',
        content: `Core API Endpoints:

GET /api/v1/dashboard
• Retrieve dashboard KPI data
• Query parameters: range (7d, 30d, 90d, 1y)

GET /api/v1/financial-data
• Access financial metrics
• Supports date range filtering

GET /api/v1/ai-usage
• AI model usage statistics
• Returns request counts and success rates

POST /api/v1/documents
• Upload documents for processing
• Supports multipart/form-data

GET /api/v1/documents/{id}
• Retrieve processed document results
• Returns extracted data and analysis

POST /api/v1/ai/chat
• Send chat requests to AI models
• Specify model in request body`
      },
      {
        title: 'Code Examples',
        content: `JavaScript/Node.js Example:

\`\`\`javascript
const response = await fetch('https://your-domain.com/api/v1/dashboard?range=30d', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
\`\`\`

Python Example:

\`\`\`python
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://your-domain.com/api/v1/dashboard', headers=headers)
data = response.json()
print(data)
\`\`\`

cURL Example:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://your-domain.com/api/v1/dashboard?range=30d
\`\`\``
      }
    ]
  },
  {
    id: 'system-control',
    title: 'System Control',
    icon: Settings,
    sections: [
      {
        title: 'User Management',
        content: `Managing Users in the Control Panel:

Adding New Users:
1. Navigate to Control Panel > User Management
2. Click "Add New User" button
3. Fill in user details (name, email, role)
4. Set initial password (user can change on first login)
5. Assign appropriate role (Admin, Manager, User)

User Roles:
• Admin: Full system access, can manage users and settings
• Manager: Dashboard access, report generation, limited configuration
• User: Read-only dashboard access, basic reporting

Editing Users:
• Click on any user in the table to edit details
• Change roles, reset passwords, or update information
• Deactivate users without deleting their data

Bulk Operations:
• Select multiple users for bulk actions
• Export user lists
• Send password reset emails`
      },
      {
        title: 'Data Management',
        content: `Data Import and Export:

Importing Data:
• Use the drag-and-drop file upload area
• Supported formats: CSV, Excel, JSON
• Data is automatically validated and processed
• View import logs for any errors or warnings

Exporting Data:
• Click "Export All Data" for complete data backup
• Select specific data types for partial exports
• Choose format: CSV, Excel, or JSON
• Scheduled exports can be configured

Data Backup:
• Automatic daily backups are enabled by default
• Manual backups can be triggered anytime
• Backup files are stored securely and encrypted
• Retention period: 90 days for automatic backups

Data Validation:
• All imported data is automatically validated
• Invalid entries are flagged and reported
• Data quality scores are calculated and displayed`
      },
      {
        title: 'System Configuration',
        content: `Configuring System Settings:

API Settings:
• Set rate limits per user/key
• Configure allowed origins for CORS
• Enable/disable specific API endpoints
• Set API key expiration policies

AI Model Settings:
• Enable/disable specific AI models
• Set usage quotas and limits
• Configure model-specific parameters
• Monitor model performance and costs

Security Settings:
• Password complexity requirements
• Session timeout configurations
• Two-factor authentication settings
• IP whitelisting for sensitive operations

Notification Settings:
• Email alerts for system events
• Performance threshold notifications
• Error reporting and escalation
• Scheduled report delivery`
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: AlertTriangle,
    sections: [
      {
        title: 'Common Issues',
        content: `Login Problems:
• Clear browser cache and cookies
• Check that JavaScript is enabled
• Verify email and password are correct
• Try using the demo account if available

Dashboard Not Loading:
• Check internet connection
• Refresh the page (Ctrl+F5 or Cmd+Shift+R)
• Disable browser extensions temporarily
• Try a different browser

Charts Not Displaying:
• Ensure ad blockers are disabled
• Check browser console for JavaScript errors
• Verify that third-party cookies are allowed
• Try switching between light and dark themes`
      },
      {
        title: 'API Issues',
        content: `Authentication Errors:
• Verify API key is correct and active
• Check that the key hasn't expired
• Ensure proper Authorization header format
• Test with a fresh API key if needed

Rate Limiting:
• Check rate limit headers in API responses
• Implement exponential backoff in your code
• Consider upgrading your API tier
• Distribute requests across multiple keys if allowed

Connection Timeouts:
• Increase timeout values in your client
• Check network connectivity
• Verify the API endpoint URLs are correct
• Monitor API status page for outages`
      },
      {
        title: 'Performance Issues',
        content: `Slow Dashboard Loading:
• Reduce the date range for charts
• Close unnecessary browser tabs
• Check system requirements are met
• Clear browser cache regularly

Document Processing Delays:
• Check file sizes (max 50MB per file)
• Verify file formats are supported
• Monitor processing queue status
• Contact support for large batch processing

Database Connection Issues:
• Verify database credentials
• Check network connectivity
• Monitor database performance metrics
• Review connection pool settings`
      }
    ]
  }
];

export function UsageGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredCategories = guideCategories.filter(category => {
    const matchesSearch = !searchTerm || 
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.sections.some(section => 
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCategory = !selectedCategory || category.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex">
      {/* Table of Contents Sidebar */}
      <div className="w-80 glass-sidebar border-r border-white/10 p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Usage Guide</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search guide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory('')}
              className="w-full justify-start text-left"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              All Sections
            </Button>
            {guideCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'ghost'}
                onClick={() => setSelectedCategory(category.id)}
                className="w-full justify-start text-left"
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">SFG Aluminium AI Brain Guide</h1>
            <p className="text-gray-400 mt-2">
              Comprehensive documentation for using the SFG-Aluminium-AI-Brain system
            </p>
          </div>

          {filteredCategories.map((category) => (
            <Card key={category.id} className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <category.icon className="w-6 h-6 mr-3 text-blue-400" />
                  {category.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {category.id === 'getting-started' && 'Learn the basics of the system'}
                  {category.id === 'dashboard' && 'Master the interactive dashboard'}
                  {category.id === 'ai-integration' && 'Understand AI model capabilities'}
                  {category.id === 'api-integration' && 'Integrate with other systems'}
                  {category.id === 'system-control' && 'Manage users and system settings'}
                  {category.id === 'troubleshooting' && 'Resolve common issues'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.sections
                    .filter(section => 
                      !searchTerm || 
                      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      section.content.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((section, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger className="text-white hover:text-blue-400">
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          {section.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <div className="prose prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap font-sans">{section.content}</pre>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}

          {filteredCategories.length === 0 && (
            <Card className="glass-card border-white/20">
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-400">
                  Try adjusting your search terms or browse all sections.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
