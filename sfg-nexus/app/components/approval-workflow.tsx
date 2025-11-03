'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  Shield,
  Eye,
  MessageSquare,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface Approval {
  id: string
  approvalType: string
  entityType: string
  entityId: string
  stage: string
  status: string
  priority: string
  requiresSecondApproval: boolean
  canSelfApprove: boolean
  mandatoryApproval: boolean
  requestedBy: string
  requestedAt: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  requestNotes?: string
  approvalNotes?: string
  rejectionReason?: string
  quote?: any
  job?: any
  enquiry?: any
  workflow: {
    workflowName: string
    description: string
  }
}

interface ApprovalWorkflowProps {
  entityType?: string
  entityId?: string
  currentUser?: string
}

export default function ApprovalWorkflow({
  entityType,
  entityId,
  currentUser = 'Warren Smith'
}: ApprovalWorkflowProps) {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve')
  const [approvalNotes, setApprovalNotes] = useState('')
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    fetchApprovals()
  }, [entityType, entityId])

  const fetchApprovals = async () => {
    try {
      const params = new URLSearchParams()
      if (entityType) params.append('entityType', entityType)
      if (entityId) params.append('entityId', entityId)

      const response = await fetch(`/api/approvals?${params}`)
      const data = await response.json()

      setApprovals(data.approvals || [])
    } catch (error) {
      console.error('Error fetching approvals:', error)
      toast.error('Failed to fetch approvals')
    } finally {
      setLoading(false)
    }
  }

  const handleApprovalAction = async () => {
    if (!selectedApproval) return

    try {
      const response = await fetch(`/api/approvals/${selectedApproval.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: approvalAction,
          approvedBy: currentUser,
          notes: approvalNotes
        }),
      })

      if (response.ok) {
        toast.success(`Approval ${approvalAction}d successfully`)
        setShowApprovalDialog(false)
        setApprovalNotes('')
        fetchApprovals()
      } else {
        const error = await response.json()
        toast.error(error.error || `Failed to ${approvalAction} approval`)
      }
    } catch (error) {
      console.error('Error updating approval:', error)
      toast.error(`Failed to ${approvalAction} approval`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'APPROVED':
        return 'success'
      case 'REJECTED':
        return 'destructive'
      case 'REQUIRES_SECOND_APPROVAL':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return Clock
      case 'APPROVED':
        return CheckCircle
      case 'REJECTED':
        return XCircle
      case 'REQUIRES_SECOND_APPROVAL':
        return AlertTriangle
      default:
        return Clock
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'destructive'
      case 'MEDIUM':
        return 'warning'
      case 'LOW':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const canUserApprove = (approval: Approval) => {
    if (approval.status !== 'PENDING') return false
    if (approval.mandatoryApproval && approval.requestedBy === currentUser) return false
    return true
  }

  const ApprovalCard = ({ approval }: { approval: Approval }) => {
    const StatusIcon = getStatusIcon(approval.status)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StatusIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">{approval.workflow.workflowName}</CardTitle>
                  <CardDescription className="text-sm">
                    {approval.entityType} • Stage: {approval.stage}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getPriorityColor(approval.priority) as any}>
                  {approval.priority}
                </Badge>
                <Badge variant={getStatusColor(approval.status) as any}>
                  {approval.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Entity Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Entity</p>
                <p className="text-sm font-medium">
                  {approval.quote?.quoteNumber || approval.job?.jobNumber || approval.enquiry?.enquiryNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Customer</p>
                <p className="text-sm">
                  {approval.quote?.customerName || approval.job?.client || approval.enquiry?.customerName}
                </p>
              </div>
            </div>

            {/* Approval Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Requested By</p>
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2" />
                  {approval.requestedBy}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Requested</p>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(approval.requestedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Approval Requirements */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Self Approval:</span>
                <Badge variant={approval.canSelfApprove ? 'success' : 'destructive'}>
                  {approval.canSelfApprove ? 'Allowed' : 'Not Allowed'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mandatory Approval:</span>
                <Badge variant={approval.mandatoryApproval ? 'destructive' : 'secondary'}>
                  {approval.mandatoryApproval ? 'Required' : 'Optional'}
                </Badge>
              </div>
              {approval.requiresSecondApproval && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Second Approval:</span>
                  <Badge variant="warning">Required</Badge>
                </div>
              )}
            </div>

            {/* Request Notes */}
            {approval.requestNotes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Request Notes</p>
                <p className="text-sm bg-muted p-2 rounded">{approval.requestNotes}</p>
              </div>
            )}

            {/* Approval/Rejection Details */}
            {approval.status === 'APPROVED' && approval.approvedBy && (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">
                    Approved by {approval.approvedBy}
                  </span>
                  <span className="text-xs text-green-600">
                    {new Date(approval.approvedAt!).toLocaleString()}
                  </span>
                </div>
                {approval.approvalNotes && (
                  <p className="text-sm text-green-700">{approval.approvalNotes}</p>
                )}
              </div>
            )}

            {approval.status === 'REJECTED' && approval.rejectedBy && (
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-800">
                    Rejected by {approval.rejectedBy}
                  </span>
                  <span className="text-xs text-red-600">
                    {new Date(approval.rejectedAt!).toLocaleString()}
                  </span>
                </div>
                {approval.rejectionReason && (
                  <p className="text-sm text-red-700">{approval.rejectionReason}</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {approval.status === 'PENDING' && (
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedApproval(approval)
                    setShowApprovalDialog(true)
                  }}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Review
                </Button>

                {canUserApprove(approval) && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setSelectedApproval(approval)
                        setApprovalAction('approve')
                        setShowApprovalDialog(true)
                      }}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedApproval(approval)
                        setApprovalAction('reject')
                        setShowApprovalDialog(true)
                      }}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}

                {!canUserApprove(approval) && approval.mandatoryApproval && approval.requestedBy === currentUser && (
                  <div className="flex-1 text-center">
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Requires Second Approval
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const filteredApprovals = approvals.filter(approval => {
    switch (activeTab) {
      case 'pending':
        return approval.status === 'PENDING' || approval.status === 'REQUIRES_SECOND_APPROVAL'
      case 'approved':
        return approval.status === 'APPROVED'
      case 'rejected':
        return approval.status === 'REJECTED'
      default:
        return true
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <Shield className="h-6 w-6 mr-3 text-blue-600" />
            Approval Workflow
          </h2>
          <p className="text-muted-foreground">
            Manage approvals and validation for quotes, jobs, and enquiries
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {approvals.filter(a => a.status === 'PENDING').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {approvals.filter(a => a.status === 'APPROVED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {approvals.filter(a => a.status === 'REJECTED').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-purple-600">
                  {approvals.filter(a => a.priority === 'HIGH').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredApprovals.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredApprovals.map((approval) => (
                <ApprovalCard key={approval.id} approval={approval} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No approvals found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'pending' 
                    ? 'No pending approvals at this time.' 
                    : `No ${activeTab} approvals found.`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {approvalAction === 'approve' ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 mr-2 text-red-600" />
              )}
              {approvalAction === 'approve' ? 'Approve' : 'Reject'} Request
            </DialogTitle>
            <DialogDescription>
              {selectedApproval && (
                <>
                  {approvalAction === 'approve' ? 'Approve' : 'Reject'} the{' '}
                  {selectedApproval.approvalType.toLowerCase().replace('_', ' ')} for{' '}
                  {selectedApproval.entityType}{' '}
                  {selectedApproval.quote?.quoteNumber || 
                   selectedApproval.job?.jobNumber || 
                   selectedApproval.enquiry?.enquiryNumber}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedApproval && (
            <div className="space-y-4">
              {/* Request Details */}
              <div className="bg-muted p-4 rounded">
                <h4 className="font-medium mb-2">Request Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Requested by:</span>
                    <span className="ml-2">{selectedApproval.requestedBy}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge variant={getPriorityColor(selectedApproval.priority) as any} className="ml-2">
                      {selectedApproval.priority}
                    </Badge>
                  </div>
                </div>
                {selectedApproval.requestNotes && (
                  <div className="mt-2">
                    <span className="text-muted-foreground text-sm">Notes:</span>
                    <p className="text-sm mt-1">{selectedApproval.requestNotes}</p>
                  </div>
                )}
              </div>

              {/* Approval Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {approvalAction === 'approve' ? 'Approval Notes' : 'Rejection Reason'} *
                </label>
                <Textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder={
                    approvalAction === 'approve'
                      ? 'Add any notes about this approval...'
                      : 'Please provide a reason for rejection...'
                  }
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={approvalAction === 'approve' ? 'default' : 'destructive'}
              onClick={handleApprovalAction}
              disabled={!approvalNotes.trim()}
            >
              {approvalAction === 'approve' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {approvalAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 