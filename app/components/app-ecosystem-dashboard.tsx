
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Zap, Users, TrendingUp, Sparkles, Send, CheckCircle, Clock, 
  BarChart3, MessageSquare, ShoppingCart, Database, Calendar, Bot
} from 'lucide-react'
import { toast } from 'sonner'

interface InvitationForm {
  appName: string
  appType: string
  companyName: string
  contactEmail: string
  appDescription: string
  techStack: string[]
  userBase: number
  integrationType: string
  businessModel: string
  website: string
  expectedROI: string
}

export function AppEcosystemDashboard() {
  const [form, setForm] = useState<InvitationForm>({
    appName: '',
    appType: '',
    companyName: '',
    contactEmail: '',
    appDescription: '',
    techStack: [],
    userBase: 0,
    integrationType: '',
    businessModel: '',
    website: '',
    expectedROI: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'status'>('overview')

  const appTypeIcons = {
    'CRM': Users,
    'E-commerce': ShoppingCart,
    'Communication': MessageSquare,
    'Analytics': BarChart3,
    'Project Management': Calendar,
    'AI/Automation': Bot
  }

  const supportedApps = [
    {
      type: 'CRM Systems',
      icon: Users,
      examples: ['Salesforce', 'HubSpot', 'Pipedrive'],
      integrationFocus: 'Lead management and contact synchronization',
      color: 'blue'
    },
    {
      type: 'E-commerce Platforms',
      icon: ShoppingCart,
      examples: ['Shopify', 'WooCommerce', 'Magento'],
      integrationFocus: 'Revenue tracking and automated campaigns',
      color: 'green'
    },
    {
      type: 'Communication Tools',
      icon: MessageSquare,
      examples: ['Slack', 'Discord', 'Microsoft Teams'],
      integrationFocus: 'Multi-channel automation and smart responses',
      color: 'purple'
    },
    {
      type: 'Analytics Platforms',
      icon: BarChart3,
      examples: ['Google Analytics', 'Mixpanel', 'Amplitude'],
      integrationFocus: 'Performance optimization and predictive insights',
      color: 'orange'
    },
    {
      type: 'Project Management',
      icon: Calendar,
      examples: ['Asana', 'Trello', 'Monday.com'],
      integrationFocus: 'Workflow enhancement and team collaboration',
      color: 'cyan'
    },
    {
      type: 'AI/Automation Tools',
      icon: Bot,
      examples: ['Zapier', 'Make.com', 'AI-AutoStack'],
      integrationFocus: 'Process optimization and intelligent automation',
      color: 'pink'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/app-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      })

      const result = await response.json()
      
      if (result.success) {
        setSubmissionResult(result)
        setActiveTab('status')
        toast.success('Application submitted successfully!')
      } else {
        toast.error(result.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-blue-500/50 text-blue-300">
            Generic App Ecosystem
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ANY APP</span> Can Integrate
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Submit your app for AI-powered compatibility analysis and custom integration planning. Join our growing ecosystem of productivity tools.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 border border-white/10">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              className={activeTab === 'overview' ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-400 hover:text-white'}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'apply' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('apply')}
              className={activeTab === 'apply' ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-400 hover:text-white'}
            >
              Apply for Integration
            </Button>
            <Button
              variant={activeTab === 'status' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('status')}
              className={activeTab === 'status' ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-400 hover:text-white'}
            >
              Status
            </Button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Supported App Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportedApps.map((app, index) => (
                <Card key={index} className="group cursor-pointer bg-slate-800/30 backdrop-blur-sm border-white/10 hover:border-blue-500/50 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 bg-${app.color}-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${app.color}-500/30 transition-all duration-300`}>
                      <app.icon className={`w-6 h-6 text-${app.color}-400 group-hover:text-${app.color}-300 transition-colors`} />
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-blue-300 transition-colors">
                      {app.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-3">{app.integrationFocus}</p>
                    <div className="flex flex-wrap gap-1">
                      {app.examples.map((example, i) => (
                        <Badge key={i} variant="outline" className={`text-xs border-${app.color}-500/50 text-${app.color}-300`}>
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Integration Process */}
            <Card className="bg-slate-800/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Zap className="w-6 h-6 text-blue-400 mr-3" />
                  How Integration Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">1. Submit Request</h3>
                    <p className="text-gray-400 text-sm">Fill out the integration form with your app details</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">2. AI Analysis</h3>
                    <p className="text-gray-400 text-sm">Our AI analyzes compatibility and technical requirements</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">3. Custom Strategy</h3>
                    <p className="text-gray-400 text-sm">Receive a tailored integration plan and timeline</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">4. Launch</h3>
                    <p className="text-gray-400 text-sm">Go live with seamless integration and shared benefits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Apply Tab */}
        {activeTab === 'apply' && (
          <Card className="max-w-3xl mx-auto bg-slate-800/30 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white">App Integration Application</CardTitle>
              <p className="text-gray-400">Submit your app for AI-powered compatibility analysis</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="appName" className="text-white">App Name *</Label>
                    <Input
                      id="appName"
                      value={form.appName}
                      onChange={(e) => setForm({...form, appName: e.target.value})}
                      required
                      className="bg-slate-700/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName" className="text-white">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={form.companyName}
                      onChange={(e) => setForm({...form, companyName: e.target.value})}
                      required
                      className="bg-slate-700/50 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contactEmail" className="text-white">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({...form, contactEmail: e.target.value})}
                    required
                    className="bg-slate-700/50 border-gray-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="appType" className="text-white">App Type *</Label>
                    <Select value={form.appType} onValueChange={(value) => setForm({...form, appType: value})}>
                      <SelectTrigger className="bg-slate-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select app type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRM">CRM System</SelectItem>
                        <SelectItem value="E-commerce">E-commerce Platform</SelectItem>
                        <SelectItem value="Communication">Communication Tool</SelectItem>
                        <SelectItem value="Analytics">Analytics Platform</SelectItem>
                        <SelectItem value="Project Management">Project Management</SelectItem>
                        <SelectItem value="AI/Automation">AI/Automation Tool</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="integrationType" className="text-white">Integration Type</Label>
                    <Select value={form.integrationType} onValueChange={(value) => setForm({...form, integrationType: value})}>
                      <SelectTrigger className="bg-slate-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select integration method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="API">API Integration</SelectItem>
                        <SelectItem value="Webhook">Webhook</SelectItem>
                        <SelectItem value="Chrome Extension">Chrome Extension</SelectItem>
                        <SelectItem value="Widget">Widget</SelectItem>
                        <SelectItem value="SDK">SDK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="appDescription" className="text-white">App Description *</Label>
                  <Textarea
                    id="appDescription"
                    value={form.appDescription}
                    onChange={(e) => setForm({...form, appDescription: e.target.value})}
                    required
                    className="bg-slate-700/50 border-gray-600 text-white"
                    placeholder="Describe your app's main features and functionality..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="website" className="text-white">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm({...form, website: e.target.value})}
                      className="bg-slate-700/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userBase" className="text-white">User Base Size</Label>
                    <Input
                      id="userBase"
                      type="number"
                      value={form.userBase}
                      onChange={(e) => setForm({...form, userBase: parseInt(e.target.value) || 0})}
                      className="bg-slate-700/50 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="expectedROI" className="text-white">Expected ROI/Benefits</Label>
                  <Textarea
                    id="expectedROI"
                    value={form.expectedROI}
                    onChange={(e) => setForm({...form, expectedROI: e.target.value})}
                    className="bg-slate-700/50 border-gray-600 text-white"
                    placeholder="What benefits do you expect from this integration?"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="mr-2 w-4 h-4 animate-spin" />
                      Analyzing App...
                    </>
                  ) : (
                    <>
                      Submit for Analysis
                      <Send className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <Card className="max-w-4xl mx-auto bg-slate-800/30 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submissionResult ? (
                <div className="space-y-6">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-300 mb-2">Application Submitted Successfully!</h3>
                    <p className="text-gray-300 mb-4">
                      <strong>Invitation ID:</strong> {submissionResult.invitationId}
                    </p>
                    <Badge variant="outline" className="border-green-500/50 text-green-300">
                      {submissionResult.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-blue-500/10 border-blue-500/30">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-300">AI Analysis Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-gray-300">Compatibility Score</Label>
                            <div className="text-2xl font-bold text-blue-400">
                              {submissionResult.aiAnalysis?.compatibilityScore}/100
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-300">Integration Complexity</Label>
                            <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                              {submissionResult.aiAnalysis?.technicalAssessment?.integrationComplexity}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-gray-300">Estimated Timeframe</Label>
                            <p className="text-white">{submissionResult.aiAnalysis?.technicalAssessment?.estimatedTimeframe}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-500/10 border-purple-500/30">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-300">Next Steps</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {submissionResult.nextSteps?.map((step: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Integration Strategy</h4>
                    <p className="text-gray-300 bg-slate-700/30 p-4 rounded-lg">
                      {submissionResult.aiAnalysis?.customInvitation?.integrationStrategy}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Applications Yet</h3>
                  <p className="text-gray-400">Submit an application to see your status here.</p>
                  <Button
                    onClick={() => setActiveTab('apply')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
