 'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Edit, 
  FileText, 
  MessageSquare, 
  Image, 
  Users, 
  Phone, 
  Mail, 
  Workflow, 
  Settings 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { JobNumberGenerator } from '@/lib/job-number-generator';
import { formatDate } from '@/lib/utils';
import JobWorkflowDashboard from './job-workflow-dashboard';

interface Job {
  id: string;
  jobNumber: string;
  client: string;
  site?: string;
  description: string;
  value?: number;
  status: string;
  priority: string;
  date: Date | string;
  fabricationDate?: Date | string;
  installationDate?: Date | string;
  drawingStatus: string;
  approvalStatus: string;
  glassOrderStatus: string;
  cutStatus: string;
  preparedStatus: string;
  coatingStatus: string;
  assemblyStatus: string;
  installStatus: string;
}

export default function JobManagement() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetailModal, setShowJobDetailModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [showWorkflowDashboard, setShowWorkflowDashboard] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter, priorityFilter]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || data);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Set mock data for demonstration
      setJobs([
        {
          id: '1',
          jobNumber: '18456',
          client: 'Beesley and Fildes',
          site: 'Manchester Office',
          description: 'Aluminium window installation - 12 units',
          value: 15750.00,
          status: 'FABRICATION',
          priority: 'HIGH',
          date: new Date('2025-01-10'),
          fabricationDate: new Date('2025-01-15'),
          installationDate: new Date('2025-01-22'),
          drawingStatus: 'APPROVED',
          approvalStatus: 'APPROVED',
          glassOrderStatus: 'ORDERED',
          cutStatus: 'COMPLETED',
          preparedStatus: 'IN_PROGRESS',
          coatingStatus: 'PENDING',
          assemblyStatus: 'PENDING',
          installStatus: 'PENDING'
        },
        {
          id: '2',
          jobNumber: '18457',
          client: 'Lodestone Projects',
          site: 'SBS Northampton',
          description: 'Glass replacement - Emergency repair',
          value: 2850.00,
          status: 'APPROVED',
          priority: 'URGENT',
          date: new Date('2025-01-12'),
          fabricationDate: new Date('2025-01-16'),
          installationDate: new Date('2025-01-18'),
          drawingStatus: 'APPROVED',
          approvalStatus: 'APPROVED',
          glassOrderStatus: 'PENDING',
          cutStatus: 'PENDING',
          preparedStatus: 'PENDING',
          coatingStatus: 'PENDING',
          assemblyStatus: 'PENDING',
          installStatus: 'PENDING'
        },
        {
          id: '3',
          jobNumber: '18455',
          client: 'True Fix Solution',
          site: 'Birmingham Warehouse',
          description: 'Curtain wall system - Phase 2',
          value: 28500.00,
          status: 'COMPLETED',
          priority: 'MEDIUM',
          date: new Date('2025-01-05'),
          fabricationDate: new Date('2025-01-08'),
          installationDate: new Date('2025-01-12'),
          drawingStatus: 'APPROVED',
          approvalStatus: 'APPROVED',
          glassOrderStatus: 'COMPLETED',
          cutStatus: 'COMPLETED',
          preparedStatus: 'COMPLETED',
          coatingStatus: 'COMPLETED',
          assemblyStatus: 'COMPLETED',
          installStatus: 'COMPLETED'
        },
        {
          id: '4',
          jobNumber: '18458',
          client: 'NSS',
          site: 'London Office Complex',
          description: 'Shopfront glazing - 8 panels',
          value: 12300.00,
          status: 'QUOTED',
          priority: 'MEDIUM',
          date: new Date('2025-01-14'),
          drawingStatus: 'PENDING',
          approvalStatus: 'PENDING',
          glassOrderStatus: 'PENDING',
          cutStatus: 'PENDING',
          preparedStatus: 'PENDING',
          coatingStatus: 'PENDING',
          assemblyStatus: 'PENDING',
          installStatus: 'PENDING'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(job => job.priority === priorityFilter);
    }

    setFilteredJobs(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'QUOTED': return 'bg-blue-500';
      case 'APPROVED': return 'bg-green-500';
      case 'FABRICATION': return 'bg-yellow-500';
      case 'ASSEMBLY': return 'bg-orange-500';
      case 'READY_FOR_INSTALL': return 'bg-purple-500';
      case 'INSTALLING': return 'bg-indigo-500';
      case 'COMPLETED': return 'bg-emerald-500';
      case 'ON_HOLD': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'destructive';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'outline';
      default: return 'secondary';
    }
  };

  const getProductionProgress = (job: Job) => {
    const stages = [
      job.drawingStatus,
      job.approvalStatus,
      job.glassOrderStatus,
      job.cutStatus,
      job.preparedStatus,
      job.coatingStatus,
      job.assemblyStatus,
      job.installStatus
    ];
    const completed = stages.filter(stage => 
      stage === 'COMPLETED' || stage === 'APPROVED'
    ).length;
    return Math.round((completed / stages.length) * 100);
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetailModal(true);
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setShowEditJobModal(true);
  };

  const handleOpenWorkflow = (job: Job) => {
    setSelectedJob(job);
    setShowWorkflowDashboard(true);
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId ? { ...job, status: newStatus } : job
          )
        );
        console.log(`Job ${jobId} status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const JobCard = ({ job }: { job: Job }) => (
    <div>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`}></div>
              <CardTitle className="text-lg">Job {job.jobNumber}</CardTitle>
              <Badge variant={getPriorityColor(job.priority) as any}>
                {job.priority}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenWorkflow(job)}
                title="Open Workflow Dashboard"
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <Workflow className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewJob(job)}
                title="View Job Details"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditJob(job)}
                title="Edit Job"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-base font-medium">
            {job.client}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{job.description}</p>
            </div>
            {job.site && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Site</p>
                <p className="text-sm">{job.site}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Value</p>
                <p className="text-sm font-medium">
                  {job.value ? `£${job.value.toLocaleString()}` : 'TBC'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="text-sm font-medium">{job.status.replace('_', ' ')}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Production Progress</p>
                <p className="text-sm font-medium">{getProductionProgress(job)}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProductionProgress(job)}%` }}
                ></div>
              </div>
            </div>
            {job.installationDate && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Install: {formatDate(job.installationDate)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Building2 className="h-8 w-8 mr-3 text-blue-600" />
            Job Management
          </h1>
          <p className="text-muted-foreground">
            Manage and track all jobs through the production pipeline
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Job
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by number, client, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="QUOTED">Quoted</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="FABRICATION">Fabrication</SelectItem>
                <SelectItem value="ASSEMBLY">Assembly</SelectItem>
                <SelectItem value="READY_FOR_INSTALL">Ready for Install</SelectItem>
                <SelectItem value="INSTALLING">Installing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first job.'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Job
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Job Detail Modal */}
      <Dialog open={showJobDetailModal} onOpenChange={setShowJobDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Job {selectedJob?.jobNumber} - {selectedJob?.client}</span>
            </DialogTitle>
            <DialogDescription>
              Complete job details, customer communication, and project management
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              {/* Job Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Job Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Job Number</Label>
                        <p className="font-medium">{selectedJob.jobNumber}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <Badge className={`${getStatusColor(selectedJob.status)} text-white`}>
                          {selectedJob.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Priority</Label>
                        <Badge variant={getPriorityColor(selectedJob.priority) as any}>
                          {selectedJob.priority}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Value</Label>
                        <p className="font-medium text-green-600">
                          {selectedJob.value ? `£${selectedJob.value.toLocaleString()}` : 'TBC'}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Description</Label>
                        <p className="font-medium">{selectedJob.description}</p>
                      </div>
                      {selectedJob.site && (
                        <div className="col-span-2">
                          <Label className="text-muted-foreground">Site Location</Label>
                          <p className="font-medium">{selectedJob.site}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Production Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm font-bold">{getProductionProgress(selectedJob)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${getProductionProgress(selectedJob)}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { label: 'Drawings', status: selectedJob.drawingStatus },
                          { label: 'Approval', status: selectedJob.approvalStatus },
                          { label: 'Glass Order', status: selectedJob.glassOrderStatus },
                          { label: 'Cutting', status: selectedJob.cutStatus },
                          { label: 'Preparation', status: selectedJob.preparedStatus },
                          { label: 'Coating', status: selectedJob.coatingStatus },
                          { label: 'Assembly', status: selectedJob.assemblyStatus },
                          { label: 'Installation', status: selectedJob.installStatus }
                        ].map((stage, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span>{stage.label}</span>
                            <Badge 
                              variant={stage.status === 'COMPLETED' || stage.status === 'APPROVED' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {stage.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Communication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Customer Communication</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Customer
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <h4 className="font-medium mb-2">Recent Communications</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Initial contact made</span>
                          <span className="text-muted-foreground">{formatDate(selectedJob.date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quote approved by customer</span>
                          <span className="text-muted-foreground">{formatDate(selectedJob.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Drawings and Approvals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Image className="h-5 w-5" />
                      <span>Drawings & Documents</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Technical Drawings (3)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Image className="h-4 w-4 mr-2" />
                        Site Photos (5)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Specifications
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Approvals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Design Approval</span>
                        <Badge variant="default">Approved</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Customer Approval</span>
                        <Badge variant="default">Approved</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Production Approval</span>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Schedule Information */}
              {(selectedJob.fabricationDate || selectedJob.installationDate) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>Schedule</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedJob.fabricationDate && (
                        <div>
                          <Label className="text-muted-foreground">Fabrication Date</Label>
                          <p className="font-medium">{formatDate(selectedJob.fabricationDate)}</p>
                        </div>
                      )}
                      {selectedJob.installationDate && (
                        <div>
                          <Label className="text-muted-foreground">Installation Date</Label>
                          <p className="font-medium">{formatDate(selectedJob.installationDate)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJobDetailModal(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowJobDetailModal(false);
              if (selectedJob) handleEditJob(selectedJob);
            }}>
              Edit Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Edit Modal */}
      <Dialog open={showEditJobModal} onOpenChange={setShowEditJobModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Job {selectedJob?.jobNumber}</DialogTitle>
            <DialogDescription>
              Update job details and status
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={selectedJob.status} 
                    onValueChange={(value) => handleUpdateJobStatus(selectedJob.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QUOTED">Quoted</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="FABRICATION">Fabrication</SelectItem>
                      <SelectItem value="ASSEMBLY">Assembly</SelectItem>
                      <SelectItem value="READY_FOR_INSTALL">Ready for Install</SelectItem>
                      <SelectItem value="INSTALLING">Installing</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={selectedJob.priority}>
                    <SelectTrigger>
                      <SelectValue />
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
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add notes about this job..." 
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditJobModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEditJobModal(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workflow Dashboard */}
      {showWorkflowDashboard && selectedJob && (
        <Dialog open={showWorkflowDashboard} onOpenChange={setShowWorkflowDashboard}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
            <div className="h-[95vh] overflow-y-auto p-6">
              <JobWorkflowDashboard 
                jobId={selectedJob.id} 
                onClose={() => setShowWorkflowDashboard(false)} 
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 