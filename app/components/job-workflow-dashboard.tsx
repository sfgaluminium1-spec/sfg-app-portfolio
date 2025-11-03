
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  MessageSquare,
  FileImage,
  Package,
  ShoppingCart,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  Upload,
  Download,
  Eye,
  Edit,
  Send,
  Truck,
  Calendar,
  DollarSign,
  Star,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

interface JobWorkflowDashboardProps {
  jobId: string;
  onClose?: () => void;
}

interface WorkflowData {
  job: any;
  workflow: {
    progressPercent: number;
    currentStep: string;
    totalSteps: number;
    completedSteps: number;
    pendingSteps: number;
    blockedSteps: number;
  };
}

export default function JobWorkflowDashboard({ jobId, onClose }: JobWorkflowDashboardProps) {
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializingWorkflow, setInitializingWorkflow] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [initializationSuccess, setInitializationSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchWorkflowData();
  }, [jobId]);

  const fetchWorkflowData = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/workflow`);
      if (response.ok) {
        const data = await response.json();
        setWorkflowData(data);
      }
    } catch (error) {
      console.error('Error fetching workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeWorkflow = async () => {
    setInitializingWorkflow(true);
    setInitializationError(null);
    setInitializationSuccess(false);

    try {
      const response = await fetch(`/api/jobs/${jobId}/workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'initialize_workflow',
          data: {}
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Workflow initialized successfully:', result);

        // Fetch updated workflow data
        await fetchWorkflowData();

        // Show success state
        setInitializationSuccess(true);

        // Auto-redirect to overview tab after successful initialization
        setTimeout(() => {
          setActiveTab('overview');
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize workflow');
      }
    } catch (error) {
      console.error('Error initializing workflow:', error);
      setInitializationError(error instanceof Error ? error.message : 'Failed to initialize workflow');
    } finally {
      setInitializingWorkflow(false);
    }
  };

  const completeWorkflowStep = async (stepId: string, notes?: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'complete_step',
          data: {
            stepId,
            completedBy: 'Current User',
            notes
          }
        })
      });

      if (response.ok) {
        await fetchWorkflowData();
      }
    } catch (error) {
      console.error('Error completing workflow step:', error);
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'PENDING': return 'bg-gray-400';
      case 'BLOCKED': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'BLOCKED': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workflowData || !workflowData.job.workflowSteps || workflowData.job.workflowSteps.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Workflow Not Initialized</h3>
          <p className="text-muted-foreground mb-4">
            Initialize the comprehensive workflow system for this job to enable tracking
            through all stages from customer communication to completion.
          </p>

          {/* Job Info Preview */}
          {workflowData && workflowData.job && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Job:</strong> {workflowData.job.jobNumber}</div>
                <div><strong>Client:</strong> {workflowData.job.client}</div>
                <div><strong>Value:</strong> {workflowData.job.value ? `£${workflowData.job.value.toLocaleString()}` : 'TBC'}</div>
                <div><strong>Status:</strong> {workflowData.job.status}</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {initializationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-red-700">
                <XCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Initialization Failed</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{initializationError}</p>
            </div>
          )}

          {/* Success Message */}
          {initializationSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Workflow Initialized Successfully!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Redirecting to workflow dashboard...</p>
            </div>
          )}

          {/* Initialize Button */}
          <Button
            onClick={initializeWorkflow}
            disabled={initializingWorkflow || initializationSuccess}
            className="min-w-[200px]"
          >
            {initializingWorkflow ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Initializing Workflow...
              </>
            ) : initializationSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Workflow Initialized
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Initialize Workflow
              </>
            )}
          </Button>

          {/* Retry Button for Errors */}
          {initializationError && !initializingWorkflow && (
            <Button
              variant="outline"
              onClick={() => {
                setInitializationError(null);
                initializeWorkflow();
              }}
              className="ml-2"
            >
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const { job, workflow } = workflowData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Building2 className="h-8 w-8 mr-3 text-blue-600" />
            Job {job.jobNumber} - Workflow Dashboard
          </h1>
          <p className="text-muted-foreground">
            {job.client} • {job.description}
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Workflow Progress</span>
          </CardTitle>
          <CardDescription>
            Overall progress through the job workflow system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-bold">{workflow.progressPercent}%</span>
            </div>
            <Progress value={workflow.progressPercent} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{workflow.completedSteps}</div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1</div>
                <div className="text-sm text-blue-700">In Progress</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{workflow.pendingSteps}</div>
                <div className="text-sm text-gray-700">Pending</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{workflow.blockedSteps}</div>
                <div className="text-sm text-red-700">Blocked</div>
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-900">Current Step</div>
              <div className="text-lg font-bold text-blue-700">{workflow.currentStep}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Workflow Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="drawings">Drawings</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Job Information */}
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Job Number</Label>
                    <p className="font-medium">{job.jobNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge className="bg-blue-500 text-white">{job.status}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Priority</Label>
                    <Badge variant={job.priority === 'URGENT' ? 'destructive' : 'secondary'}>
                      {job.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Value</Label>
                    <p className="font-medium text-green-600">
                      {job.value ? `£${job.value.toLocaleString()}` : 'TBC'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Client</Label>
                    <p className="font-medium">{job.client}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Site</Label>
                    <p className="font-medium">{job.site || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {job.workflowSteps?.map((step: any, index: number) => (
                    <div className="flex items-center space-x-3 p-3 rounded-lg border" key={step.id}>
                      <div className={`w-3 h-3 rounded-full ${getStepStatusColor(step.status)}`}></div>
                      <div className="flex-1">
                        <div className="font-medium">{step.stepName}</div>
                        <div className="text-sm text-muted-foreground">
                          {step.status === 'COMPLETED' && step.completedAt && `Completed ${formatDate(step.completedAt)}`}
                          {step.status === 'IN_PROGRESS' && 'Currently in progress'}
                          {step.status === 'PENDING' && 'Waiting to start'}
                          {step.status === 'BLOCKED' && 'Blocked - requires attention'}
                        </div>
                      </div>
                      {getStepStatusIcon(step.status)}
                      {step.status === 'IN_PROGRESS' && (
                        <Button size="sm" onClick={() => completeWorkflowStep(step.id)}>
                          Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common workflow actions and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => setShowCommunicationModal(true)}
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Add Communication</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => setShowDrawingModal(true)}
                >
                  <FileImage className="h-6 w-6" />
                  <span>Upload Drawing</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => setActiveTab('materials')}
                >
                  <Package className="h-6 w-6" />
                  <span>Materials Analysis</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => setShowOrderModal(true)}
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>Create Order</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-6">
          <CommunicationsModule jobId={jobId} />
        </TabsContent>

        {/* Drawings Tab */}
        <TabsContent value="drawings" className="space-y-6">
          <DrawingsModule jobId={jobId} />
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <MaterialsModule jobId={jobId} />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <OrdersModule jobId={jobId} />
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-6">
          <QualityModule jobId={jobId} />
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <TimelineModule jobId={jobId} />
        </TabsContent>
      </Tabs>

      {/* Communication Modal */}
      <CommunicationModal
        open={showCommunicationModal}
        onOpenChange={setShowCommunicationModal}
        jobId={jobId}
        onSuccess={fetchWorkflowData}
      />

      {/* Drawing Upload Modal */}
      <DrawingUploadModal
        open={showDrawingModal}
        onOpenChange={setShowDrawingModal}
        jobId={jobId}
        onSuccess={fetchWorkflowData}
      />

      {/* Order Creation Modal */}
      <OrderCreationModal
        open={showOrderModal}
        onOpenChange={setShowOrderModal}
        jobId={jobId}
        onSuccess={fetchWorkflowData}
      />
    </div>
  );
}

// Communication Module Component
function CommunicationsModule({ jobId }: { jobId: string }) {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunications();
  }, [jobId]);

  const fetchCommunications = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/communications`);
      if (response.ok) {
        const data = await response.json();
        setCommunications(data.communications || []);
      }
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading communications...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Customer Communications</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Call Customer
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {communications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No communications yet</p>
            </CardContent>
          </Card>
        ) : (
          communications.map((comm: any) => (
            <Card key={comm.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{comm.communicationType}</Badge>
                      <Badge variant={comm.direction === 'OUTBOUND' ? 'default' : 'secondary'}>
                        {comm.direction}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(comm.createdAt)}
                      </span>
                    </div>
                    {comm.subject && (
                      <h4 className="font-medium">{comm.subject}</h4>
                    )}
                    <p className="text-sm text-muted-foreground">{comm.message}</p>
                    {comm.fromUser && (
                      <p className="text-xs text-muted-foreground">From: {comm.fromUser}</p>
                    )}
                  </div>
                  <Badge variant={comm.status === 'SENT' ? 'default' : 'secondary'}>
                    {comm.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Drawings Module Component
function DrawingsModule({ jobId }: { jobId: string }) {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrawings();
  }, [jobId]);

  const fetchDrawings = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/drawings`);
      if (response.ok) {
        const data = await response.json();
        setDrawings(data.drawings || []);
      }
    } catch (error) {
      console.error('Error fetching drawings:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveDrawing = async (drawingId: string, approvalType: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/drawings/${drawingId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approvalType,
          approvedBy: 'Current User',
          notes: `${approvalType} approval completed`
        })
      });

      if (response.ok) {
        await fetchDrawings();
      }
    } catch (error) {
      console.error('Error approving drawing:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading drawings...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Drawing Approvals</h3>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Drawing
        </Button>
      </div>

      <div className="space-y-4">
        {drawings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No drawings uploaded yet</p>
            </CardContent>
          </Card>
        ) : (
          drawings.map((drawing: any) => (
            <Card key={drawing.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{drawing.drawingName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Version {drawing.drawingVersion} • {drawing.drawingType}
                      </p>
                    </div>
                    <Badge variant={drawing.status === 'APPROVED' ? 'default' : 'secondary'}>
                      {drawing.status}
                    </Badge>
                  </div>

                  {/* Approval Checkpoints */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      {drawing.customerApproved ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">Customer Approval</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {drawing.technicalReviewed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">Technical Review</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {drawing.productionReviewed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">Production Review</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {drawing.cuttingListVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">Cutting List</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {drawing.glassSizesVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">Glass Sizes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {drawing.finalApproved ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">Final Approval</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {!drawing.technicalReviewed && (
                      <Button size="sm" onClick={() => approveDrawing(drawing.id, 'technical')}>
                        Technical Approve
                      </Button>
                    )}
                    {drawing.technicalReviewed && !drawing.productionReviewed && (
                      <Button size="sm" onClick={() => approveDrawing(drawing.id, 'production')}>
                        Production Approve
                      </Button>
                    )}
                    {drawing.productionReviewed && !drawing.cuttingListVerified && (
                      <Button size="sm" onClick={() => approveDrawing(drawing.id, 'cutting_list')}>
                        Verify Cutting List
                      </Button>
                    )}
                    {drawing.cuttingListVerified && !drawing.glassSizesVerified && (
                      <Button size="sm" onClick={() => approveDrawing(drawing.id, 'glass_sizes')}>
                        Verify Glass Sizes
                      </Button>
                    )}
                    {drawing.glassSizesVerified && !drawing.finalApproved && (
                      <Button size="sm" onClick={() => approveDrawing(drawing.id, 'final')}>
                        Final Approval
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Materials Module Component
function MaterialsModule({ jobId }: { jobId: string }) {
  const [materialsAnalysis, setMaterialsAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterialsAnalysis();
  }, [jobId]);

  const fetchMaterialsAnalysis = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/materials`);
      if (response.ok) {
        const data = await response.json();
        setMaterialsAnalysis(data.materialsAnalysis || []);
      }
    } catch (error) {
      console.error('Error fetching materials analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading materials analysis...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Materials Analysis</h3>
        <Button>
          <Package className="h-4 w-4 mr-2" />
          Start Analysis
        </Button>
      </div>

      <div className="space-y-4">
        {materialsAnalysis.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No materials analysis yet</p>
            </CardContent>
          </Card>
        ) : (
          materialsAnalysis.map((analysis: any) => (
            <Card key={analysis.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">Materials Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        {analysis.analysisType} • {formatDate(analysis.createdAt)}
                      </p>
                    </div>
                    <Badge variant={analysis.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {analysis.status}
                    </Badge>
                  </div>

                  {/* Analysis Progress */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      {analysis.drawingAnalyzed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">Drawing Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {analysis.materialsExtracted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">Materials Extracted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {analysis.costAnalyzed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">Cost Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {analysis.suppliersMatched ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">Suppliers Matched</span>
                    </div>
                  </div>

                  {analysis.totalMaterialsCost && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-900">Total Materials Cost</div>
                      <div className="text-2xl font-bold text-green-700">
                        £{analysis.totalMaterialsCost.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {!analysis.approved && analysis.status === 'COMPLETED' && (
                    <Button>Approve Analysis</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Orders Module Component
function OrdersModule({ jobId }: { jobId: string }) {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [jobId]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrderData(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Orders & Procurement</h3>
      <Card>
        <CardContent className="text-center py-8">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Orders module coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Quality Module Component
function QualityModule({ jobId }: { jobId: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Quality Control</h3>
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Quality control module coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Timeline Module Component
function TimelineModule({ jobId }: { jobId: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Timeline</h3>
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Timeline module coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Modal Components
function CommunicationModal({ open, onOpenChange, jobId, onSuccess }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Communication</DialogTitle>
          <DialogDescription>Record customer communication</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select communication type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Message</Label>
            <Textarea placeholder="Communication details..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DrawingUploadModal({ open, onOpenChange, jobId, onSuccess }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Drawing</DialogTitle>
          <DialogDescription>Upload technical drawings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Drawing Name</Label>
            <Input placeholder="Enter drawing name..." />
          </div>
          <div>
            <Label>File</Label>
            <Input type="file" accept=".pdf,.dwg,.dxf" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrderCreationModal({ open, onOpenChange, jobId, onSuccess }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>Create new procurement order</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Supplier</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supplier1">Glass Supplier Ltd</SelectItem>
                <SelectItem value="supplier2">Aluminum Direct</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea placeholder="Order details..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)}>Create Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
