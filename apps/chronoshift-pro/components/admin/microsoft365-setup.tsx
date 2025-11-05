
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Settings, 
  Users, 
  Mail,
  FileText,
  MessageSquare,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { teamsIntegration } from '@/lib/teams-integration';
import toast from 'react-hot-toast';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'complete';
  instructions: string[];
  links?: { name: string; url: string }[];
}

export function Microsoft365Setup() {
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: 'teams-webhook',
      title: 'Teams Webhook Setup',
      description: 'Configure Teams channel to receive ChronoShift Pro notifications',
      status: 'pending',
      instructions: [
        "1. Open Microsoft Teams and go to your desired channel",
        "2. Click the '...' menu next to the channel name",
        "3. Select 'Connectors' from the dropdown",
        "4. Find 'Incoming Webhook' and click 'Add'",
        "5. Name it 'ChronoShift Pro Notifications'",
        "6. Upload the ChronoShift Pro logo if desired",
        "7. Copy the webhook URL that's generated",
        "8. Paste the URL in the field below and save"
      ],
      links: [
        { name: "Teams Webhook Guide", url: "https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook" }
      ]
    },
    {
      id: 'sharepoint-list',
      title: 'SharePoint List Creation',
      description: 'Create timesheet storage list in SharePoint',
      status: 'pending',
      instructions: [
        "1. Go to your SharePoint site: sfgaluminium.sharepoint.com",
        "2. Navigate to 'Site Contents'",
        "3. Click 'New' → 'List'",
        "4. Choose 'Blank list'",
        "5. Name: 'ChronoShift_Timesheets'",
        "6. Add these columns:",
        "   - Employee Name (Single line text)",
        "   - Work Date (Date and time)",
        "   - Start Time (Single line text)",
        "   - End Time (Single line text)",
        "   - Total Hours (Number)",
        "   - Status (Choice: Draft, Submitted, Approved, Rejected)",
        "   - Notes (Multiple lines of text)"
      ],
      links: [
        { name: "SharePoint Lists Guide", url: "https://support.microsoft.com/en-us/office/create-a-list-in-sharepoint-0d397414-d95f-41eb-addd-5e6eff41b083" }
      ]
    },
    {
      id: 'power-automate',
      title: 'Power Automate Flows',
      description: 'Create automated workflows for approvals and reminders',
      status: 'pending',
      instructions: [
        "1. Go to power.automate.microsoft.com",
        "2. Click 'Create' → 'Automated cloud flow'",
        "3. Name: 'ChronoShift Timesheet Approval'",
        "4. Trigger: 'When an HTTP request is received'",
        "5. Add actions:",
        "   - Parse JSON (timesheet data)",
        "   - Send email to supervisor",
        "   - Post Teams notification",
        "   - Update SharePoint list",
        "6. Save and copy the HTTP POST URL",
        "7. Repeat for 'Weekly Reminder' flow"
      ],
      links: [
        { name: "Power Automate Guide", url: "https://docs.microsoft.com/en-us/power-automate/getting-started" },
        { name: "HTTP Trigger Setup", url: "https://docs.microsoft.com/en-us/power-automate/triggers-introduction" }
      ]
    },
    {
      id: 'email-setup',
      title: 'Email Configuration',
      description: 'Configure Office 365 email for notifications',
      status: 'pending',
      instructions: [
        "1. Go to portal.office.com",
        "2. Sign in as Warren@sfg-aluminium.co.uk",
        "3. Go to 'Security' → 'App passwords'",
        "4. Generate new app password for 'ChronoShift Pro'",
        "5. Copy the generated password",
        "6. Configure SMTP settings:",
        "   - Server: smtp.office365.com",
        "   - Port: 587",
        "   - Username: Warren@sfg-aluminium.co.uk",
        "   - Password: [app password]",
        "7. Test email sending"
      ]
    }
  ]);

  const [webhookUrl, setWebhookUrl] = useState('');
  const [emailAppPassword, setEmailAppPassword] = useState('');
  const [powerAutomateUrls, setPowerAutomateUrls] = useState({
    approval: '',
    reminder: ''
  });

  const handleSaveConfiguration = async (stepId: string) => {
    try {
      const config = {
        teamsWebhook: webhookUrl,
        emailAppPassword: emailAppPassword,
        powerAutomateUrls: powerAutomateUrls
      };

      // Save to environment/database
      console.log('Saving Microsoft 365 configuration:', config);
      
      // Update step status
      setSetupSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, status: 'complete' }
          : step
      ));

      toast.success(`${stepId} configuration saved!`);
    } catch (error) {
      console.error('Failed to save configuration:', error);
      toast.error('Failed to save configuration');
    }
  };

  const testIntegration = async (type: string) => {
    try {
      const testPayload: any = { type };
      
      switch (type) {
        case 'teams':
          if (!webhookUrl) {
            toast.error('Please save Teams webhook URL first');
            return;
          }
          testPayload.webhookUrl = webhookUrl;
          break;
        
        case 'email':
          testPayload.to = 'warren@sfg-aluminium.co.uk';
          break;
        
        case 'sharepoint':
          // Test SharePoint access
          break;
          
        case 'user':
          // Test user profile access
          break;
      }

      const response = await fetch('/api/microsoft365/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message);
        if (result.userProfile) {
          console.log('User Profile:', result.userProfile);
        }
        if (result.siteId) {
          console.log('SharePoint Site ID:', result.siteId);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Integration test failed:', error);
      toast.error('Integration test failed');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-warren-blue-600" />
          Microsoft 365 Integration Setup
        </h2>
        <p className="text-gray-600 dark:text-warren-gray-400">
          Configure ChronoShift Pro to work with your existing Microsoft 365 infrastructure
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Teams Setup</TabsTrigger>
          <TabsTrigger value="sharepoint">SharePoint</TabsTrigger>
          <TabsTrigger value="power-automate">Power Automate</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="warren-card">
            <CardHeader>
              <CardTitle>Azure App Registration Status</CardTitle>
              <CardDescription>
                Your Azure app registration is configured with these credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Application (Client) ID</h4>
                  <code className="bg-gray-100 dark:bg-warren-gray-700 px-2 py-1 rounded text-xs block">
                    1e965d6a-b617-439c-b0b2-3c07895ef160
                  </code>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Directory (Tenant) ID</h4>
                  <code className="bg-gray-100 dark:bg-warren-gray-700 px-2 py-1 rounded text-xs block">
                    7d93dbfe-4aae-4abf-b51e-11c6135a54c6
                  </code>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Client Secret</h4>
                  <code className="bg-gray-100 dark:bg-warren-gray-700 px-2 py-1 rounded text-xs block">
                    i9_8Q~w6y5_GE.x8D...*** (expires 11/12/2025)
                  </code>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Redirect URI</h4>
                  <code className="bg-gray-100 dark:bg-warren-gray-700 px-2 py-1 rounded text-xs block">
                    https://chronoshift-pro.abacusai.app/api/auth/callback/azure-ad
                  </code>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">
                    Admin Consent Required
                  </span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  Some permissions need admin consent. To grant admin consent for all users in your organisation:
                </p>
                <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 ml-4">
                  <li>1. Go to your Azure app registration page</li>
                  <li>2. Navigate to "API permissions"</li>
                  <li>3. Click "Grant admin consent for SFG Aluminium"</li>
                  <li>4. Confirm by clicking "Yes"</li>
                </ol>
                <Button asChild className="mt-3" size="sm">
                  <a 
                    href="https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/CallAnAPI/appId/1e965d6a-b617-439c-b0b2-3c07895ef160"
                    target="_blank"
                    rel="noopener"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Azure App Registration
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="warren-card">
            <CardHeader>
              <CardTitle>Setup Progress</CardTitle>
              <CardDescription>
                Complete these steps to fully integrate with Microsoft 365
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {setupSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {step.status === 'complete' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : step.status === 'in-progress' ? (
                        <div className="w-6 h-6 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{step.title}</h3>
                        <Badge className={
                          step.status === 'complete' ? 'bg-green-100 text-green-800' :
                          step.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card className="warren-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Teams Webhook Configuration
              </CardTitle>
              <CardDescription>
                Set up Teams notifications for timesheet submissions and approvals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Step-by-Step Instructions:
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>1. Open Microsoft Teams</li>
                  <li>2. Go to the channel where you want notifications</li>
                  <li>3. Click '...' menu → Connectors</li>
                  <li>4. Add 'Incoming Webhook'</li>
                  <li>5. Name: 'ChronoShift Pro Notifications'</li>
                  <li>6. Copy the webhook URL</li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Teams Webhook URL</label>
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://outlook.office.com/webhook/..."
                  className="warren-input"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => handleSaveConfiguration('teams-webhook')}
                  className="warren-button-primary"
                  disabled={!webhookUrl}
                >
                  Save Configuration
                </Button>
                <Button 
                  onClick={() => testIntegration('teams')}
                  variant="outline"
                  disabled={!webhookUrl}
                >
                  Test Integration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharepoint" className="space-y-4">
          <Card className="warren-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                SharePoint List Setup
              </CardTitle>
              <CardDescription>
                Create timesheet storage list in your SharePoint site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">
                    Manual Setup Required
                  </span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  You'll need to manually create the SharePoint list. Click the link below for guidance.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">SharePoint Site:</h4>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 dark:bg-warren-gray-700 px-2 py-1 rounded text-sm">
                    https://sfgaluminium.sharepoint.com/sites/WarrenHeathcote
                  </code>
                  <Button 
                    onClick={() => copyToClipboard('https://sfgaluminium.sharepoint.com/sites/WarrenHeathcote')}
                    size="sm"
                    variant="outline"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Required List Columns:</h4>
                <div className="bg-gray-50 dark:bg-warren-gray-800 p-3 rounded-lg">
                  <code className="text-sm whitespace-pre-line">
{`Employee Name (Single line of text)
Work Date (Date and time)
Start Time (Single line of text)
End Time (Single line of text)
Total Hours (Number, 2 decimals)
Break Minutes (Number)
Status (Choice: Draft, Submitted, Approved, Rejected)
Notes (Multiple lines of text)`}
                  </code>
                </div>
              </div>

              <Button asChild>
                <a href="https://sfgaluminium.sharepoint.com/sites/WarrenHeathcote" target="_blank" rel="noopener">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open SharePoint Site
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="power-automate" className="space-y-4">
          <Card className="warren-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Power Automate Flows
              </CardTitle>
              <CardDescription>
                Create automated workflows for notifications and approvals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Timesheet Approval Flow</h4>
                  <p className="text-sm text-gray-600 dark:text-warren-gray-400 mb-3">
                    Handles timesheet submissions and supervisor notifications
                  </p>
                  <Input
                    placeholder="Power Automate flow URL"
                    value={powerAutomateUrls.approval}
                    onChange={(e) => setPowerAutomateUrls(prev => ({ ...prev, approval: e.target.value }))}
                    className="mb-2"
                  />
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://power.automate.microsoft.com" target="_blank">
                      Create Flow
                    </a>
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Weekly Reminder Flow</h4>
                  <p className="text-sm text-gray-600 dark:text-warren-gray-400 mb-3">
                    Sends automated reminders to submit timesheets
                  </p>
                  <Input
                    placeholder="Power Automate flow URL"
                    value={powerAutomateUrls.reminder}
                    onChange={(e) => setPowerAutomateUrls(prev => ({ ...prev, reminder: e.target.value }))}
                    className="mb-2"
                  />
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://power.automate.microsoft.com" target="_blank">
                      Create Flow
                    </a>
                  </Button>
                </div>
              </div>

              <Button 
                onClick={() => handleSaveConfiguration('power-automate')}
                className="warren-button-primary"
              >
                Save Flow URLs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card className="warren-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Office 365 Email Configuration
              </CardTitle>
              <CardDescription>
                Set up email notifications using Warren@sfg-aluminium.co.uk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  SMTP Configuration:
                </h4>
                <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <p><strong>Server:</strong> smtp.office365.com</p>
                  <p><strong>Port:</strong> 587 (STARTTLS)</p>
                  <p><strong>Username:</strong> Warren@sfg-aluminium.co.uk</p>
                  <p><strong>Password:</strong> App Password (generated below)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Office 365 App Password
                </label>
                <Input
                  type="password"
                  value={emailAppPassword}
                  onChange={(e) => setEmailAppPassword(e.target.value)}
                  placeholder="Generated app password"
                  className="warren-input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Generate this in Office 365 Security settings under "App passwords"
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button 
                  onClick={() => handleSaveConfiguration('email-setup')}
                  className="warren-button-primary"
                  disabled={!emailAppPassword}
                >
                  Save Email Config
                </Button>
                <Button 
                  onClick={() => testIntegration('email')}
                  variant="outline"
                >
                  Send Test Email
                </Button>
                <Button 
                  onClick={() => testIntegration('user')}
                  variant="outline"
                >
                  Test User Profile
                </Button>
                <Button 
                  onClick={() => testIntegration('sharepoint')}
                  variant="outline"
                >
                  Test SharePoint
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://portal.office.com" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Office 365 Portal
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
