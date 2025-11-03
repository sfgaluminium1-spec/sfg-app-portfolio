'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PlayCircle,
  PauseCircle,
  SkipForward,
  Wrench,
  HelpCircle,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Settings
} from 'lucide-react'

interface FabricationStep {
  id: string
  stepOrder: number
  stepName: string
  description: string | null
  standardTimeHours: number
  timeWithHelperHours: number | null
  canUseHelper: boolean
  primaryRole: string
  requiresTwoOperatives: boolean
  requiresQualityCheck: boolean
  notes: string | null
}

interface FabricationWorkflow {
  id: string
  status: string
  currentStep: number
  totalHoursPlanned: number | null
  totalHoursActual: number | null
  helperAssigned: boolean
  helperHours: number
  helperCostImpact: number
  isOverflow: boolean
  weekendWorkRequired: boolean
  tempStaffRequired: boolean
  job: {
    id: string
    jobNumber: string
    client: string
    description: string
    status: string
    value: number | null
  }
  template: {
    templateName: string
    estimatedHours: number
    estimatedHoursWithHelper: number
    helperTimeReduction: number
    helperCostIncrease: number
    steps: FabricationStep[]
  }
  leadFabricator: {
    id: string
    fullName: string
    role: string
    email: string
  } | null
  stepExecutions: {
    id: string
    stepOrder: number
    stepName: string
    status: string
    plannedHours: number
    actualHours: number | null
    scheduledStartAt: string | null
    actualStartAt: string | null
    scheduledEndAt: string | null
    actualEndAt: string | null
    helperAssigned: boolean
    progressPercent: number
    notes: string | null
    assignedEmployee: {
      id: string
      fullName: string
    } | null
    helperEmployee: {
      id: string
      fullName: string
    } | null
  }[]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'NOT_STARTED':
      return 'bg-gray-100 text-gray-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'PAUSED':
      return 'bg-yellow-100 text-yellow-800'
    case 'OVERFLOW_FLAGGED':
      return 'bg-orange-100 text-orange-800'
    case 'HELPER_ASSIGNED':
      return 'bg-purple-100 text-purple-800'
    case 'WEEKEND_SCHEDULED':
      return 'bg-red-100 text-red-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStepStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-gray-100 text-gray-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'BLOCKED':
      return 'bg-red-100 text-red-800'
    case 'ON_HOLD':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function AdvancedFabricationScheduler() {
  const [workflows, setWorkflows] = useState<FabricationWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/fabrication-workflow')
      const data = await response.json()
      setWorkflows(data)
      if (data.length > 0 && !selectedWorkflow) {
        setSelectedWorkflow(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <Wrench className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Advanced Fabrication Scheduler</h1>
            <p className="text-green-100 mt-2">
              14-step fabrication workflow with helper system and resource optimization
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">{workflows.length}</div>
            <div className="text-green-100">Active Workflows</div>
          </div>
          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'IN_PROGRESS').length}
            </div>
            <div className="text-green-100">In Progress</div>
          </div>
          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.helperAssigned).length}
            </div>
            <div className="text-green-100">Using Helpers</div>
          </div>
          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.isOverflow).length}
            </div>
            <div className="text-green-100">Overflow Jobs</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
          <TabsTrigger value="template">14-Step Template</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="resources">Resource Management</TabsTrigger>
        </TabsList>

        {/* Active Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Workflow List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Active Workflows</CardTitle>
                  <CardDescription>Select a workflow to view details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workflows.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No active fabrication workflows</p>
                      <Button className="mt-4" variant="outline">
                        Create New Workflow
                      </Button>
                    </div>
                  ) : (
                    workflows.map((workflow) => (
                      <Card
                        key={workflow.id}
                        className={`cursor-pointer transition-colors ${
                          selectedWorkflow === workflow.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedWorkflow(workflow.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{workflow.job.jobNumber}</span>
                            <Badge className={getStatusColor(workflow.status)}>
                              {workflow.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{workflow.job.client}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Progress</span>
                              <span>Step {workflow.currentStep}/14</span>
                            </div>
                            <Progress value={(workflow.currentStep / 14) * 100} className="h-2" />
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            {workflow.helperAssigned && (
                              <div className="flex items-center gap-1">
                                <HelpCircle className="h-3 w-3" />
                                <span>Helper</span>
                              </div>
                            )}
                            {workflow.isOverflow && (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                                <span>Overflow</span>
                              </div>
                            )}
                            {workflow.weekendWorkRequired && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-red-500" />
                                <span>Weekend</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Workflow Details */}
            <div className="lg:col-span-2">
              {selectedWorkflowData ? (
                <div className="space-y-6">
                  {/* Workflow Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {selectedWorkflowData.job.jobNumber}
                            <Badge className={getStatusColor(selectedWorkflowData.status)}>
                              {selectedWorkflowData.status.replace('_', ' ')}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {selectedWorkflowData.job.client} - {selectedWorkflowData.job.description}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Job Value</div>
                          <div className="text-lg font-semibold">
                            {selectedWorkflowData.job.value
                              ? `£${selectedWorkflowData.job.value.toLocaleString()}`
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Timeline Info */}
                        <div>
                          <h4 className="font-medium mb-3">Timeline & Resources</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Planned Duration</span>
                              <span className="text-sm font-medium">
                                {selectedWorkflowData.totalHoursPlanned || selectedWorkflowData.template.estimatedHours}h
                              </span>
                            </div>
                            {selectedWorkflowData.helperAssigned && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">With Helper</span>
                                  <span className="text-sm font-medium text-green-600">
                                    {selectedWorkflowData.template.estimatedHoursWithHelper}h (-{selectedWorkflowData.template.helperTimeReduction}%)
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Cost Impact</span>
                                  <span className="text-sm font-medium text-red-600">
                                    +{selectedWorkflowData.template.helperCostIncrease}%
                                  </span>
                                </div>
                              </>
                            )}
                            {selectedWorkflowData.leadFabricator && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Lead Fabricator</span>
                                <span className="text-sm font-medium">
                                  {selectedWorkflowData.leadFabricator.fullName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Alerts & Flags */}
                        <div>
                          <h4 className="font-medium mb-3">Status & Alerts</h4>
                          <div className="space-y-2">
                            {selectedWorkflowData.isOverflow && (
                              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                <AlertTriangle className="h-4 w-4" />
                                <span>Overflow job - requires advance planning</span>
                              </div>
                            )}
                            {selectedWorkflowData.weekendWorkRequired && (
                              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                <Calendar className="h-4 w-4" />
                                <span>Weekend work scheduled</span>
                              </div>
                            )}
                            {selectedWorkflowData.tempStaffRequired && (
                              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                                <Users className="h-4 w-4" />
                                <span>Temporary staff required</span>
                              </div>
                            )}
                            {selectedWorkflowData.helperAssigned && (
                              <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 p-2 rounded">
                                <HelpCircle className="h-4 w-4" />
                                <span>Helper assigned - {selectedWorkflowData.template.helperTimeReduction}% time reduction</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Fabrication Steps Progress</CardTitle>
                      <CardDescription>
                        Detailed view of the 14-step fabrication process
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedWorkflowData.stepExecutions.map((execution, index) => {
                          const templateStep = selectedWorkflowData.template.steps.find(
                            s => s.stepOrder === execution.stepOrder
                          )
                          return (
                            <div key={execution.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="text-lg font-semibold text-gray-400">
                                    {execution.stepOrder.toString().padStart(2, '0')}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{execution.stepName}</h4>
                                    {templateStep?.notes && (
                                      <p className="text-sm text-gray-600">{templateStep.notes}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getStepStatusColor(execution.status)}>
                                    {execution.status}
                                  </Badge>
                                  {templateStep?.requiresTwoOperatives && (
                                    <Badge variant="outline" className="text-xs">
                                      2 Operatives Required
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Primary Role</div>
                                  <div className="text-sm font-medium">{templateStep?.primaryRole}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Planned Time</div>
                                  <div className="text-sm font-medium">{execution.plannedHours}h</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Actual Time</div>
                                  <div className="text-sm font-medium">
                                    {execution.actualHours ? `${execution.actualHours}h` : 'Not started'}
                                  </div>
                                </div>
                              </div>
                              {execution.assignedEmployee && (
                                <div className="mt-3 flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {execution.assignedEmployee.fullName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{execution.assignedEmployee.fullName}</span>
                                  {execution.helperEmployee && (
                                    <>
                                      <span className="text-sm text-gray-500">+ Helper:</span>
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs bg-purple-100">
                                          {execution.helperEmployee.fullName.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">{execution.helperEmployee.fullName}</span>
                                    </>
                                  )}
                                </div>
                              )}
                              {execution.progressPercent > 0 && (
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Progress</span>
                                    <span>{execution.progressPercent}%</span>
                                  </div>
                                  <Progress value={execution.progressPercent} className="h-2" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a Workflow
                    </h3>
                    <p className="text-gray-500">
                      Choose a workflow from the list to view detailed step progress
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Template Tab */}
        <TabsContent value="template" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SFG Standard 14-Step Fabrication Template</CardTitle>
              <CardDescription>
                Comprehensive fabrication workflow with helper system and time optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {workflows.length > 0 && workflows[0].template ? (
                <div className="space-y-6">
                  {/* Template Overview */}
                  <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {workflows[0].template.steps.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Steps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {workflows[0].template.estimatedHours}h
                      </div>
                      <div className="text-sm text-gray-600">Standard Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {workflows[0].template.estimatedHoursWithHelper}h
                      </div>
                      <div className="text-sm text-gray-600">With Helper</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {workflows[0].template.helperTimeReduction}%
                      </div>
                      <div className="text-sm text-gray-600">Time Reduction</div>
                    </div>
                  </div>

                  {/* Template Steps */}
                  <div className="space-y-4">
                    {workflows[0].template.steps.map((step, index) => (
                      <Card key={step.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="text-lg font-bold text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                {step.stepOrder}
                              </div>
                              <div>
                                <h4 className="font-semibold">{step.stepName}</h4>
                                {step.description && (
                                  <p className="text-sm text-gray-600">{step.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {step.requiresTwoOperatives && (
                                <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-800">
                                  2 Operatives
                                </Badge>
                              )}
                              {step.requiresQualityCheck && (
                                <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-800">
                                  QC Required
                                </Badge>
                              )}
                              {step.canUseHelper && (
                                <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-800">
                                  Helper OK
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500 text-xs">Primary Role</div>
                              <div className="font-medium">{step.primaryRole}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Standard Time</div>
                              <div className="font-medium">{step.standardTimeHours}h</div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">With Helper</div>
                              <div className="font-medium">
                                {step.timeWithHelperHours ? `${step.timeWithHelperHours}h` : 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Time Savings</div>
                              <div className="font-medium text-green-600">
                                {step.timeWithHelperHours
                                  ? `${((step.standardTimeHours - step.timeWithHelperHours) / step.standardTimeHours * 100).toFixed(0)}%`
                                  : 'N/A'}
                              </div>
                            </div>
                          </div>
                          {step.notes && (
                            <div className="mt-3 p-2 bg-yellow-50 rounded text-sm">
                              <strong>Notes:</strong> {step.notes}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No fabrication template available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Efficiency Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Completion Time</span>
                      <span className="font-medium">8.2h</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Helper Usage Rate</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Quality Pass Rate</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">£2,340</div>
                    <div className="text-sm text-gray-600">Average Job Cost</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Standard Rate</span>
                      <span>£2,100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Helper Premium</span>
                      <span className="text-red-600">+£240</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time Savings</span>
                      <span className="text-green-600">-1.7h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Resource Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    <AlertTriangle className="h-4 w-4" />
                    <span>3 jobs require weekend work</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span>Powder coating backlog</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    <Users className="h-4 w-4" />
                    <span>Temp staff available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Management</CardTitle>
              <CardDescription>
                Helper assignments, overflow management, and capacity planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Helper System Policy</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Time Reduction</span>
                      <span className="font-medium text-green-600">20%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>Cost Increase</span>
                      <span className="font-medium text-red-600">33%</span>
                    </div>
                    <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                      <strong>Policy:</strong> Use helpers/weekends/temps only if absolutely needed. All overflow must be flagged 5 working days in advance.
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Powder Coating Requirements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      <Users className="h-4 w-4" />
                      <span>2 operatives required for safety and efficiency</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Steps requiring 2 operatives:
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Powder Coating Prep</li>
                        <li>Powder Coating Spray</li>
                        <li>Oven Cure</li>
                        <li>Cool Down/Tape Protection</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 