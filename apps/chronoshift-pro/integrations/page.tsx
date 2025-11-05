
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Plug, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  BarChart3, 
  FolderKanban, 
  Brain,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Upload,
  Download
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Integration {
  id: string
  appName: string
  type: string
  status: 'active' | 'pending' | 'inactive'
  capabilities: string[]
  lastSync?: string
}

interface IntegrationRequest {
  appName: string
  companyName: string
  integrationType: string
  dataRequirements: string[]
  webhookEndpoint: string
  securityLevel: string
  complianceNeeds: string[]
}

export default function IntegrationsPage() {
  const { data: session } = useSession()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [availableIntegrations, setAvailableIntegrations] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const [integrationForm, setIntegrationForm] = useState<IntegrationRequest>({
    appName: '',
    companyName: 'SFG Aluminium Ltd',
    integrationType: '',
    dataRequirements: [],
    webhookEndpoint: '',
    securityLevel: 'enterprise',
    complianceNeeds: ['GDPR', 'UK_Employment_Law']
  })

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchAvailableIntegrations()
      fetchActiveIntegrations()
    }
  }, [session])

  const fetchAvailableIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations/app-invitation')
      if (response.ok) {
        const data = await response.json()
        setAvailableIntegrations(data)
      }
    } catch (error) {
      console.error('Failed to fetch available integrations:', error)
    }
  }

  const fetchActiveIntegrations = async () => {
    try {
      // In production, fetch from database
      const mockIntegrations: Integration[] = [
        {
          id: '1',
          appName: 'SFG Communications Hub',
          type: 'communication-tools',
          status: 'active',
          capabilities: ['notification-automation', 'approval-workflows'],
          lastSync: new Date().toISOString()
        },
        {
          id: '2', 
          appName: 'SFG Brand Engine',
          type: 'analytics-platforms',
          status: 'active',
          capabilities: ['performance-optimization', 'employee-engagement'],
          lastSync: new Date().toISOString()
        }
      ]
      setIntegrations(mockIntegrations)
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitIntegration = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/integrations/app-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(integrationForm)
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`Integration request submitted! ID: ${result.integrationId}`)
        
        // Reset form
        setIntegrationForm({
          appName: '',
          companyName: 'SFG Aluminium Ltd',
          integrationType: '',
          dataRequirements: [],
          webhookEndpoint: '',
          securityLevel: 'enterprise',
          complianceNeeds: ['GDPR', 'UK_Employment_Law']
        })
        
        // Refresh integrations list
        fetchActiveIntegrations()
      } else {
        throw new Error('Failed to submit integration request')
      }
    } catch (error) {
      toast.error('Failed to submit integration request')
      console.error('Integration submission error:', error)
    }
  }

  const handleDataRequirementChange = (requirement: string, checked: boolean) => {
    setIntegrationForm(prev => ({
      ...prev,
      dataRequirements: checked 
        ? [...prev.dataRequirements, requirement]
        : prev.dataRequirements.filter(r => r !== requirement)
    }))
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertTitle>Access Required</AlertTitle>
          <AlertDescription>Please sign in to access integrations.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (session.user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertTitle>Admin Access Required</AlertTitle>
          <AlertDescription>Only administrators can manage integrations.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'crm-systems': return <Users className="h-5 w-5" />
      case 'ecommerce-platforms': return <TrendingUp className="h-5 w-5" />
      case 'communication-tools': return <MessageSquare className="h-5 w-5" />
      case 'analytics-platforms': return <BarChart3 className="h-5 w-5" />
      case 'project-management': return <FolderKanban className="h-5 w-5" />
      case 'ai-automation-tools': return <Brain className="h-5 w-5" />
      default: return <Plug className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">App Integrations</h1>
          <p className="text-muted-foreground">
            Connect ChronoShift Pro with external applications and services
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Integrations</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="request">Request Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
                <Plug className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'active').length}</div>
                <p className="text-xs text-muted-foreground">Connected applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Sync</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">Success rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Capabilities</CardTitle>
              <CardDescription>
                ChronoShift Pro supports multiple integration types for comprehensive workforce management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Employee Data Sync
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Synchronize employee directories, contact information, and organizational structure
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timesheet Integration
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time timesheet data sharing with project management and billing systems
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Payroll Export
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Secure payroll data export for accounting and compliance systems
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Notification Automation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Multi-channel notifications via WhatsApp, email, and other communication tools
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">Loading integrations...</div>
          ) : (
            <div className="grid gap-4">
              {integrations.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Plug className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Active Integrations</h3>
                    <p className="text-muted-foreground mb-4">Connect external applications to get started</p>
                    <Button onClick={() => setActiveTab('request')}>
                      Request Integration
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                integrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getIntegrationIcon(integration.type)}
                        <div>
                          <CardTitle className="text-lg">{integration.appName}</CardTitle>
                          <CardDescription className="capitalize">
                            {integration.type.replace('-', ' ')}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                          {integration.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Capabilities</h4>
                          <div className="flex flex-wrap gap-1">
                            {integration.capabilities.map((capability) => (
                              <Badge key={capability} variant="outline" className="text-xs">
                                {capability.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Last Sync</h4>
                          <p className="text-sm text-muted-foreground">
                            {integration.lastSync 
                              ? new Date(integration.lastSync).toLocaleString()
                              : 'Never'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          {availableIntegrations && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableIntegrations.available_integrations.map((integration: any) => (
                <Card key={integration.type} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {getIntegrationIcon(integration.type)}
                      <CardTitle className="text-lg capitalize">
                        {integration.type.replace('-', ' ')}
                      </CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {integration.capabilities.slice(0, 2).map((capability: string) => (
                        <Badge key={capability} variant="secondary" className="text-xs">
                          {capability.replace('-', ' ')}
                        </Badge>
                      ))}
                      {integration.capabilities.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{integration.capabilities.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Compatible Apps</h4>
                        <div className="text-sm text-muted-foreground">
                          {integration.examples.slice(0, 2).join(', ')}
                          {integration.examples.length > 2 && '...'}
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setIntegrationForm(prev => ({
                            ...prev,
                            integrationType: integration.capabilities[0]
                          }))
                          setActiveTab('request')
                        }}
                      >
                        Request Integration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="request" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request New Integration</CardTitle>
              <CardDescription>
                Submit a request to integrate ChronoShift Pro with external applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitIntegration} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appName">Application Name *</Label>
                    <Input
                      id="appName"
                      value={integrationForm.appName}
                      onChange={(e) => setIntegrationForm(prev => ({ ...prev, appName: e.target.value }))}
                      placeholder="e.g., Salesforce CRM"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="integrationType">Integration Type *</Label>
                    <Select
                      value={integrationForm.integrationType}
                      onValueChange={(value) => setIntegrationForm(prev => ({ ...prev, integrationType: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select integration type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee-directory-sync">Employee Directory Sync</SelectItem>
                        <SelectItem value="timesheet-sync">Timesheet Synchronization</SelectItem>
                        <SelectItem value="payroll-export">Payroll Export</SelectItem>
                        <SelectItem value="communication-automation">Communication Automation</SelectItem>
                        <SelectItem value="analytics-integration">Analytics Integration</SelectItem>
                        <SelectItem value="project-time-tracking">Project Time Tracking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Data Requirements</Label>
                  <div className="grid md:grid-cols-3 gap-2">
                    {[
                      'employee_contact',
                      'timesheet_data', 
                      'payroll_summary',
                      'department_info',
                      'performance_metrics',
                      'attendance_records'
                    ].map((requirement) => (
                      <div key={requirement} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={requirement}
                          checked={integrationForm.dataRequirements.includes(requirement)}
                          onChange={(e) => handleDataRequirementChange(requirement, e.target.checked)}
                          className="rounded border-input"
                        />
                        <Label htmlFor={requirement} className="text-sm font-normal capitalize">
                          {requirement.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookEndpoint">Webhook Endpoint</Label>
                  <Input
                    id="webhookEndpoint"
                    value={integrationForm.webhookEndpoint}
                    onChange={(e) => setIntegrationForm(prev => ({ ...prev, webhookEndpoint: e.target.value }))}
                    placeholder="https://your-app.com/webhook/chronoshift"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="securityLevel">Security Level</Label>
                    <Select
                      value={integrationForm.securityLevel}
                      onValueChange={(value) => setIntegrationForm(prev => ({ ...prev, securityLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="high-security">High Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={integrationForm.companyName}
                      onChange={(e) => setIntegrationForm(prev => ({ ...prev, companyName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>AI Analysis Included</AlertTitle>
                  <AlertDescription>
                    Your request will be automatically analyzed for technical compatibility, 
                    security requirements, and ROI projections.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full">
                  Submit Integration Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
