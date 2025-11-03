
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertTriangle, Users, Package, TrendingUp, Calendar, Activity } from 'lucide-react';

interface WorkflowData {
  overview: {
    totalJobs: number;
    activeJobs: number;
    completedThisMonth: number;
    averageCompletionTime: number;
    totalRevenue: number;
    pendingApprovals: number;
  };
  stageCounts: {
    enquiry: number;
    quote: number;
    job: number;
    fabrication: number;
    installation: number;
    completed: number;
  };
  monthlyTrends: Array<{
    month: string;
    enquiries: number;
    quotes: number;
    jobs: number;
    revenue: number;
  }>;
  departmentWorkload: Array<{
    department: string;
    current: number;
    capacity: number;
    efficiency: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

export default function ComprehensiveWorkflowDashboard() {
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchWorkflowData();
  }, [selectedPeriod]);

  const fetchWorkflowData = async () => {
    try {
      const response = await fetch(`/api/workflow/dashboard?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setWorkflowData(data);
      } else {
        // Fallback to mock data
        setWorkflowData(mockWorkflowData);
      }
    } catch (error) {
      console.error('Error fetching workflow data:', error);
      setWorkflowData(mockWorkflowData);
    } finally {
      setLoading(false);
    }
  };

  const mockWorkflowData: WorkflowData = {
    overview: {
      totalJobs: 156,
      activeJobs: 42,
      completedThisMonth: 38,
      averageCompletionTime: 14,
      totalRevenue: 485000,
      pendingApprovals: 8
    },
    stageCounts: {
      enquiry: 23,
      quote: 18,
      job: 15,
      fabrication: 12,
      installation: 8,
      completed: 38
    },
    monthlyTrends: [
      { month: 'Jan', enquiries: 45, quotes: 38, jobs: 32, revenue: 425000 },
      { month: 'Feb', enquiries: 52, quotes: 44, jobs: 38, revenue: 465000 },
      { month: 'Mar', enquiries: 48, quotes: 41, jobs: 35, revenue: 485000 },
      { month: 'Apr', enquiries: 58, quotes: 49, jobs: 42, revenue: 520000 },
      { month: 'May', enquiries: 61, quotes: 52, jobs: 45, revenue: 545000 },
      { month: 'Jun', enquiries: 55, quotes: 47, jobs: 40, revenue: 515000 }
    ],
    departmentWorkload: [
      { department: 'Sales', current: 18, capacity: 25, efficiency: 92 },
      { department: 'Fabrication', current: 12, capacity: 15, efficiency: 88 },
      { department: 'Installation', current: 8, capacity: 12, efficiency: 95 },
      { department: 'Quality Control', current: 5, capacity: 8, efficiency: 87 }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'JOB_COMPLETED',
        description: 'Installation completed for SFG240115',
        timestamp: '2024-01-22T10:30:00Z',
        status: 'COMPLETED'
      },
      {
        id: '2',
        type: 'QUOTE_APPROVED',
        description: 'Quote QUO240116 approved by customer',
        timestamp: '2024-01-22T09:15:00Z',
        status: 'APPROVED'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'DELAYED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workflowData) return null;

  const stageData = Object.entries(workflowData.stageCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comprehensive Workflow Dashboard</h1>
          <p className="text-muted-foreground">
            End-to-end workflow visibility and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </Button>
          <Button
            variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('quarter')}
          >
            Quarter
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{workflowData.overview.totalJobs}</p>
              </div>
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">{workflowData.overview.activeJobs}</p>
              </div>
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{workflowData.overview.completedThisMonth}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Time</p>
                <p className="text-2xl font-bold">{workflowData.overview.averageCompletionTime}d</p>
              </div>
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">£{(workflowData.overview.totalRevenue / 1000).toFixed(0)}k</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{workflowData.overview.pendingApprovals}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflow">Workflow Pipeline</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="departments">Department Workload</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Stage Distribution</CardTitle>
                <CardDescription>Current jobs by workflow stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {stageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stage Breakdown</CardTitle>
                <CardDescription>Number of jobs at each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stageData.map((stage, index) => (
                    <div key={stage.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{stage.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{stage.value} jobs</Badge>
                        <span className="text-sm text-muted-foreground">
                          {((stage.value / workflowData.overview.totalJobs) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Trends</CardTitle>
              <CardDescription>Enquiries, quotes, and jobs over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={workflowData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="enquiries" 
                    stroke="#60B5FF" 
                    strokeWidth={2}
                    name="Enquiries"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="quotes" 
                    stroke="#FF9149" 
                    strokeWidth={2}
                    name="Quotes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="jobs" 
                    stroke="#80D8C3" 
                    strokeWidth={2}
                    name="Jobs"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid gap-4">
            {workflowData.departmentWorkload.map((dept) => (
              <Card key={dept.department}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{dept.department}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dept.current} of {dept.capacity} capacity
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{dept.efficiency}%</div>
                      <div className="text-sm text-muted-foreground">Efficiency</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Workload</span>
                      <span>{dept.current}/{dept.capacity}</span>
                    </div>
                    <Progress value={(dept.current / dept.capacity) * 100} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest workflow updates and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
