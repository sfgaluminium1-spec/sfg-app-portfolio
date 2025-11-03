
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, ArrowLeft, ArrowRight, RefreshCw, Plus, FileEdit, CheckCircle, XCircle, Clock, AlertTriangle, MessageSquare, Zap, GitBranch, Users, FileText, Send, Edit3, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface EnhancedWorkflowOverviewProps {
  jobId: string;
  currentUser?: string;
}

interface WorkflowData {
  job: any;
  aiDescription?: any;
  workflowSteps: any[];
  variations: any[];
  approvals: any[];
  communications: any[];
  navigationHistory: any[];
}

export default function EnhancedWorkflowOverview({ 
  jobId, 
  currentUser = 'Warren Smith' 
}: EnhancedWorkflowOverviewProps) {
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // AI Description states
  const [showAIModal, setShowAIModal] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiInput, setAiInput] = useState('');

  // Workflow navigation states
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [navigationData, setNavigationData] = useState<any>({});

  // Variation states
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [variationData, setVariationData] = useState<any>({});

  // Approval states
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalData, setApprovalData] = useState<any>({});

  useEffect(() => {
    fetchWorkflowData();
  }, [jobId]);

  const fetchWorkflowData = async () => {
    try {
      setLoading(true);
      
      // Fetch job data with all related information
      const responses = await Promise.all([
        fetch(`/api/jobs/${jobId}`),
        fetch(`/api/ai-project-description?entityType=JOB&entityId=${jobId}`),
        fetch(`/api/workflow-navigation?jobId=${jobId}`),
        fetch(`/api/variation-management?jobId=${jobId}`),
        fetch(`/api/enhanced-approvals?entityType=JOB&entityId=${jobId}`),
        fetch(`/api/customer-contact-management?customerId=${jobId}`)
      ]);

      const [
        jobResponse,
        aiResponse,
        navigationResponse,
        variationResponse,
        approvalResponse,
        communicationResponse
      ] = await Promise.all(responses.map(r => r.json()));

      setWorkflowData({
        job: jobResponse.job || {},
        aiDescription: aiResponse.description,
        workflowSteps: jobResponse.job?.workflowSteps || [],
        variations: variationResponse.variations || [],
        approvals: approvalResponse.approvals || [],
        communications: communicationResponse.communications || [],
        navigationHistory: navigationResponse.navigations || []
      });
    } catch (error) {
      console.error('Error fetching workflow data:', error);
      toast.error('Failed to load workflow data');
    } finally {
      setLoading(false);
    }
  };

  const generateAIDescription = async (forceRegenerate = false) => {
    try {
      setGeneratingAI(true);
      const response = await fetch('/api/ai-project-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'JOB',
          entityId: jobId,
          originalDescription: aiInput,
          forceRegenerate
        })
      });

      const result = await response.json();
      if (result.success) {
        setWorkflowData(prev => prev ? { ...prev, aiDescription: result.description } : null);
        toast.success(forceRegenerate ? 'AI description regenerated' : 'AI description generated');
        setShowAIModal(false);
        setAiInput('');
      } else {
        toast.error('Failed to generate AI description');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate AI description');
    } finally {
      setGeneratingAI(false);
    }
  };

  const navigateWorkflow = async (fromStage: string, toStage: string, action: string) => {
    try {
      const response = await fetch('/api/workflow-navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          action,
          fromStage,
          toStage,
          performedBy: currentUser,
          reason: navigationData.reason,
          notes: navigationData.notes,
          confirmNavigation: navigationData.confirmed
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        await fetchWorkflowData();
        setShowNavigationModal(false);
        setNavigationData({});
      } else if (result.requiresConfirmation) {
        setNavigationData({
          ...navigationData,
          requiresConfirmation: true,
          impactAssessment: result.impactAssessment,
          affectedProcesses: result.affectedProcesses
        });
      } else {
        toast.error(result.error || 'Navigation failed');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate workflow');
    }
  };

  const createVariation = async () => {
    try {
      const response = await fetch('/api/variation-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_variation',
          variationData: {
            ...variationData,
            jobId,
            quoteId: workflowData?.job?.quoteId,
            customerId: workflowData?.job?.customerId,
            requestedBy: currentUser
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Variation created successfully');
        await fetchWorkflowData();
        setShowVariationModal(false);
        setVariationData({});
      } else {
        toast.error(result.error || 'Failed to create variation');
      }
    } catch (error) {
      console.error('Variation creation error:', error);
      toast.error('Failed to create variation');
    }
  };

  const requestApproval = async () => {
    try {
      const response = await fetch('/api/enhanced-approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          entityType: 'JOB',
          entityId: jobId,
          approvalType: approvalData.type,
          approvalData: {
            ...approvalData,
            requestedBy: currentUser
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Approval request created');
        await fetchWorkflowData();
        setShowApprovalModal(false);
        setApprovalData({});
      } else {
        toast.error(result.error || 'Failed to request approval');
      }
    } catch (error) {
      console.error('Approval request error:', error);
      toast.error('Failed to request approval');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workflowData) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to Load Workflow Data</h3>
          <p className="text-muted-foreground mb-4">Unable to retrieve workflow information for this job.</p>
          <Button onClick={fetchWorkflowData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { job, aiDescription, workflowSteps, variations, approvals } = workflowData;

  return (
    <div className="space-y-6">
      {/* Enhanced Header with AI Description */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center space-x-2">
                <span>Job {job.jobNumber} - Enhanced Workflow Overview</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {job.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                {job.client} • {job.description}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowAIModal(true)}>
                <Brain className="h-4 w-4 mr-2" />
                {aiDescription ? 'Revise Description' : 'Generate AI Description'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowVariationModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Extra Items
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* AI Generated Description */}
          {aiDescription && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Project Description
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">{aiDescription.generatedDescription}</p>
                  <div className="flex items-center space-x-4 text-xs text-blue-600">
                    <span>• {aiDescription.projectItemCount || 0} items</span>
                    <span>• {aiDescription.complexityAssessment} complexity</span>
                    <span>• {aiDescription.timelineEstimate || 'TBC'} weeks estimated</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round((aiDescription.confidence || 0) * 100)}% confidence
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => generateAIDescription(true)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Workflow Progress Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {workflowSteps.filter((s: any) => s.status === 'COMPLETED').length}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {workflowSteps.filter((s: any) => s.status === 'IN_PROGRESS').length}
              </div>
              <div className="text-sm text-blue-700">In Progress</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{variations.length}</div>
              <div className="text-sm text-orange-700">Variations</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {approvals.filter((a: any) => a.status === 'PENDING').length}
              </div>
              <div className="text-sm text-purple-700">Pending Approvals</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Workflow Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Steps</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="variations">Variations</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <WorkflowOverviewTab 
            job={job} 
            workflowSteps={workflowSteps} 
            onNavigate={(from: any, to: any, action: any) => {
              setNavigationData({ fromStage: from, toStage: to, action });
              setShowNavigationModal(true);
            }} 
          />
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <BidirectionalWorkflowSteps 
            workflowSteps={workflowSteps} 
            onNavigate={(from: any, to: any, action: any) => {
              setNavigationData({ fromStage: from, toStage: to, action });
              setShowNavigationModal(true);
            }} 
          />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <MultipleApprovalsTab 
            approvals={approvals} 
            onRequestApproval={() => setShowApprovalModal(true)} 
          />
        </TabsContent>

        <TabsContent value="variations" className="space-y-4">
          <VariationManagementTab 
            variations={variations} 
            onCreateVariation={() => setShowVariationModal(true)} 
          />
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <CommunicationTab communications={workflowData.communications} />
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          <NavigationHistoryTab navigationHistory={workflowData.navigationHistory} />
        </TabsContent>
      </Tabs>

      {/* AI Description Modal */}
      <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              {aiDescription ? 'Revise AI Description' : 'Generate AI Description'}
            </DialogTitle>
            <DialogDescription>
              {aiDescription 
                ? 'Provide additional context to improve the AI-generated project description.'
                : 'Provide project context to generate an AI-powered description with complexity assessment and timeline estimates.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Additional Project Context (Optional)
              </label>
              <Textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Provide any additional details about the project scope, requirements, or special considerations..."
                rows={4}
              />
            </div>
            {aiDescription && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Current AI Description:</h4>
                <p className="text-sm text-gray-700">{aiDescription.generatedDescription}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => generateAIDescription(!!aiDescription)} 
              disabled={generatingAI}
            >
              {generatingAI ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  {aiDescription ? 'Regenerate' : 'Generate'} Description
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workflow Navigation Modal */}
      <WorkflowNavigationModal
        open={showNavigationModal}
        onOpenChange={setShowNavigationModal}
        navigationData={navigationData}
        onNavigate={navigateWorkflow}
        onUpdateData={setNavigationData}
      />

      {/* Variation Creation Modal */}
      <VariationCreationModal
        open={showVariationModal}
        onOpenChange={setShowVariationModal}
        variationData={variationData}
        onCreateVariation={createVariation}
        onUpdateData={setVariationData}
      />

      {/* Approval Request Modal */}
      <ApprovalRequestModal
        open={showApprovalModal}
        onOpenChange={setShowApprovalModal}
        approvalData={approvalData}
        onRequestApproval={requestApproval}
        onUpdateData={setApprovalData}
      />
    </div>
  );
}

// Sub-components
function WorkflowOverviewTab({ job, workflowSteps, onNavigate }: any) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-muted-foreground">Job Number</label>
              <p className="font-medium">{job.jobNumber}</p>
            </div>
            <div>
              <label className="text-muted-foreground">Client</label>
              <p className="font-medium">{job.client}</p>
            </div>
            <div>
              <label className="text-muted-foreground">Value</label>
              <p className="font-medium text-green-600">
                £{job.value?.toLocaleString() || 'TBC'}
              </p>
            </div>
            <div>
              <label className="text-muted-foreground">Priority</label>
              <Badge variant={job.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                {job.priority}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => onNavigate('CURRENT', 'NEXT', 'ADVANCE')}
            >
              <ArrowRight className="h-5 w-5" />
              <span>Advance Stage</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => onNavigate('CURRENT', 'PREVIOUS', 'REVERT')}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MessageSquare className="h-5 w-5" />
              <span>Add Communication</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <CheckCircle className="h-5 w-5" />
              <span>Request Approval</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BidirectionalWorkflowSteps({ workflowSteps, onNavigate }: any) {
  return (
    <div className="space-y-4">
      {workflowSteps.map((step: any, index: number) => (
        <div key={step.id}>
          <Card className={`${step.status === 'IN_PROGRESS' ? 'ring-2 ring-blue-500' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    step.status === 'COMPLETED'
                      ? 'bg-green-500'
                      : step.status === 'IN_PROGRESS'
                      ? 'bg-blue-500'
                      : step.status === 'BLOCKED'
                      ? 'bg-red-500'
                      : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <h4 className="font-medium">{step.stepName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {step.assignedTo && `Assigned to: ${step.assignedTo}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{step.status}</Badge>
                  {step.status === 'COMPLETED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate(step.stepName, 'PREVIOUS', 'REVERT')}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  {step.status === 'IN_PROGRESS' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onNavigate(step.stepName, 'NEXT', 'ADVANCE')}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

function MultipleApprovalsTab({ approvals, onRequestApproval }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Multiple Approval Types</h3>
        <Button onClick={onRequestApproval}>
          <Plus className="h-4 w-4 mr-2" />
          Request Approval
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {['QUOTE_APPROVAL', 'DRAWING_APPROVAL', 'VARIATIONS_APPROVAL', 'EXTRA_ITEMS_APPROVAL'].map((type) => {
          const approval = approvals.find((a: any) => a.approvalType === type);
          const status = approval?.status || 'NOT_REQUIRED';
          return (
            <Card key={type}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{type.replace('_', ' ')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {approval
                        ? `Requested ${new Date(approval.requestedAt).toLocaleDateString()}`
                        : 'Not requested'
                      }
                    </p>
                  </div>
                  <Badge
                    variant={
                      status === 'APPROVED'
                        ? 'default'
                        : status === 'PENDING'
                        ? 'secondary'
                        : status === 'REJECTED'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function VariationManagementTab({ variations, onCreateVariation }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Project Variations</h3>
        <Button onClick={onCreateVariation}>
          <Plus className="h-4 w-4 mr-2" />
          Create Variation
        </Button>
      </div>
      {variations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No variations created yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {variations.map((variation: any) => (
            <Card key={variation.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{variation.variationNumber}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{variation.description}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span>Type: {variation.variationType.replace('_', ' ')}</span>
                      <span className={`font-medium ${
                        variation.variationValue >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {variation.variationValue >= 0 ? '+' : ''}£{variation.variationValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      variation.approvalStatus === 'FULLY_APPROVED'
                        ? 'default'
                        : variation.approvalStatus === 'PENDING_APPROVAL'
                        ? 'secondary'
                        : variation.approvalStatus === 'REJECTED'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {variation.approvalStatus.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CommunicationTab({ communications }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Customer Communications</h3>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </div>
      {communications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No communications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {communications.map((comm: any) => (
            <Card key={comm.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{comm.platform}</Badge>
                      <Badge variant={comm.direction === 'OUTBOUND' ? 'default' : 'secondary'}>
                        {comm.direction}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {comm.subject && <h4 className="font-medium mb-1">{comm.subject}</h4>}
                    <p className="text-sm text-muted-foreground">{comm.message}</p>
                  </div>
                  <Badge variant={comm.status === 'SENT' ? 'default' : 'secondary'}>
                    {comm.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function NavigationHistoryTab({ navigationHistory }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Workflow Navigation History</h3>
      {navigationHistory.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No navigation history yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {navigationHistory.map((nav: any) => (
            <Card key={nav.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      nav.direction === 'FORWARD'
                        ? 'bg-green-100 text-green-600'
                        : nav.direction === 'BACKWARD'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {nav.direction === 'FORWARD' ? (
                        <ArrowRight className="h-4 w-4" />
                      ) : nav.direction === 'BACKWARD' ? (
                        <ArrowLeft className="h-4 w-4" />
                      ) : (
                        <GitBranch className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {nav.fromStage} → {nav.toStage}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {nav.action} by {nav.performedBy} • {new Date(nav.performedAt).toLocaleString()}
                      </p>
                      {nav.reason && (
                        <p className="text-xs text-muted-foreground mt-1">Reason: {nav.reason}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">{nav.action}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Modal Components
function WorkflowNavigationModal({ open, onOpenChange, navigationData, onNavigate, onUpdateData }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <GitBranch className="h-5 w-5 mr-2" />
            Workflow Navigation
          </DialogTitle>
          <DialogDescription>
            Navigate workflow stages with full audit trail and impact assessment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">From Stage</label>
              <p className="text-sm text-muted-foreground">{navigationData.fromStage}</p>
            </div>
            <div>
              <label className="text-sm font-medium">To Stage</label>
              <p className="text-sm text-muted-foreground">{navigationData.toStage}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Reason</label>
            <Textarea
              value={navigationData.reason || ''}
              onChange={(e) => onUpdateData({ ...navigationData, reason: e.target.value })}
              placeholder="Provide a reason for this workflow navigation..."
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
            <Textarea
              value={navigationData.notes || ''}
              onChange={(e) => onUpdateData({ ...navigationData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>
          {navigationData.requiresConfirmation && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">⚠️ Confirmation Required</h4>
              <p className="text-sm text-orange-800 mb-2">
                This navigation will affect the following processes:
              </p>
              <ul className="text-sm text-orange-700 list-disc list-inside">
                {navigationData.affectedProcesses?.map((process: string, index: number) => (
                  <li key={index}>{process}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onUpdateData({ ...navigationData, confirmed: true });
              onNavigate(navigationData.fromStage, navigationData.toStage, navigationData.action);
            }}
            disabled={!navigationData.reason}
          >
            {navigationData.requiresConfirmation ? 'Confirm Navigation' : 'Navigate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VariationCreationModal({ open, onOpenChange, variationData, onCreateVariation, onUpdateData }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create Project Variation
          </DialogTitle>
          <DialogDescription>
            Create a variation with notes-first approach, then generate revised quote.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Variation Type</label>
            <Select
              value={variationData.variationType || ''}
              onValueChange={(value) => onUpdateData({ ...variationData, variationType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select variation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXTRA_ITEMS">Extra Items</SelectItem>
                <SelectItem value="CHANGE_REQUEST">Change Request</SelectItem>
                <SelectItem value="DESIGN_MODIFICATION">Design Modification</SelectItem>
                <SelectItem value="SPECIFICATION_CHANGE">Specification Change</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={variationData.description || ''}
              onChange={(e) => onUpdateData({ ...variationData, description: e.target.value })}
              placeholder="Describe the variation in detail..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Estimated Value (£)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={variationData.estimatedValue || ''}
                onChange={(e) => onUpdateData({ ...variationData, estimatedValue: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select
                value={variationData.priority || ''}
                onValueChange={(value) => onUpdateData({ ...variationData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onCreateVariation}
            disabled={!variationData.variationType || !variationData.description}
          >
            Create Variation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ApprovalRequestModal({ open, onOpenChange, approvalData, onRequestApproval, onUpdateData }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Request Approval
          </DialogTitle>
          <DialogDescription>
            Submit an approval request with detailed justification.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Approval Type</label>
            <Select
              value={approvalData.type || ''}
              onValueChange={(value) => onUpdateData({ ...approvalData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select approval type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="QUOTE_APPROVAL">Quote Approval</SelectItem>
                <SelectItem value="DRAWING_APPROVAL">Drawing Approval</SelectItem>
                <SelectItem value="VARIATIONS_APPROVAL">Variations Approval</SelectItem>
                <SelectItem value="EXTRA_ITEMS_APPROVAL">Extra Items Approval</SelectItem>
                <SelectItem value="DESIGN_APPROVAL">Design Approval</SelectItem>
                <SelectItem value="BUDGET_APPROVAL">Budget Approval</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Justification</label>
            <Textarea
              value={approvalData.justification || ''}
              onChange={(e) => onUpdateData({ ...approvalData, justification: e.target.value })}
              placeholder="Provide detailed justification for this approval request..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select
                value={approvalData.priority || ''}
                onValueChange={(value) => onUpdateData({ ...approvalData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Required By</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={approvalData.requiredBy || ''}
                onChange={(e) => onUpdateData({ ...approvalData, requiredBy: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onRequestApproval}
            disabled={!approvalData.type || !approvalData.justification}
          >
            Request Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
