'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Building2,
  FileText,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react'
import { motion } from 'framer-motion'
import QuickJobModal from '@/components/modals/quick-job-modal'
import FirstEnquiryModal from '@/components/modals/first-enquiry-modal'
import POConversionModal from '@/components/modals/po-conversion-modal'
import ScheduleModal from '@/components/modals/schedule-modal'
import StatusUpdateModal from '@/components/modals/status-update-modal'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  completedJobs: number
  totalQuotes: number
  quotesWon: number
  quotesValue: number
  totalOrders: number
  ordersValue: number
  recentActivities: any[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalQuotes: 0,
    quotesWon: 0,
    quotesValue: 0,
    totalOrders: 0,
    ordersValue: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showJobModal, setShowJobModal] = useState(false)
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)
  const [showPOModal, setShowPOModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set mock data for demonstration
      setStats({
        totalJobs: 156,
        activeJobs: 23,
        completedJobs: 133,
        totalQuotes: 89,
        quotesWon: 67,
        quotesValue: 234868.32,
        totalOrders: 45,
        ordersValue: 156311.82,
        recentActivities: [
          {
            id: 1,
            type: 'job_created',
            description: 'New job 18457 created for Beesley and Fildes',
            time: '2 hours ago'
          },
          {
            id: 2,
            type: 'quote_sent',
            description: 'Quote 21476 sent to Lodestone Projects',
            time: '4 hours ago'
          },
          {
            id: 3,
            type: 'job_completed',
            description: 'Job 18455 completed - Installation finished',
            time: '6 hours ago'
          },
          {
            id: 4,
            type: 'order_placed',
            description: 'Order 31045 placed with NVM Supplier',
            time: '1 day ago'
          },
          {
            id: 5,
            type: 'status_update',
            description: 'Job 18456 moved to Fabrication stage',
            time: '1 day ago'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = 'blue'
  }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 text-${color}-600`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">{trend}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

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
          <h1 className="text-3xl font-bold tracking-tight">SFG NEXUS Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your comprehensive business management system
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowPOModal(true)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            PO Received
          </Button>
          <Button size="sm" onClick={() => setShowEnquiryModal(true)}>
            <Building2 className="h-4 w-4 mr-2" />
            First Enquiry
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={Building2}
          description="All jobs in system"
          trend="+12% from last month"
          color="blue"
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Clock}
          description="Currently in progress"
          trend="+5% from last week"
          color="orange"
        />
        <StatCard
          title="Quotes Value"
          value={`£${stats.quotesValue.toLocaleString()}`}
          icon={DollarSign}
          description="Total quoted this year"
          trend="+18% from last month"
          color="green"
        />
        <StatCard
          title="Completion Rate"
          value={`${Math.round((stats.completedJobs / stats.totalJobs) * 100)}%`}
          icon={CheckCircle}
          description="Jobs completed on time"
          trend="+3% improvement"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Production Pipeline Overview */}
        <div className="lg:col-span-2">
          <ProductionPipelineOverview />
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setShowEnquiryModal(true)}
              >
                <Building2 className="h-4 w-4 mr-2" />
                First Enquiry
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setShowPOModal(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                PO Received
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Place Order
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setShowScheduleModal(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Installation
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setShowStatusModal(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Update Job Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Overview */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Production Pipeline Overview</CardTitle>
            <CardDescription>Current status of jobs in the production pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                { stage: 'Quoted', count: 12, color: 'bg-blue-500' },
                { stage: 'Approved', count: 8, color: 'bg-green-500' },
                { stage: 'Fabrication', count: 6, color: 'bg-yellow-500' },
                { stage: 'Assembly', count: 4, color: 'bg-orange-500' },
                { stage: 'Ready', count: 3, color: 'bg-purple-500' },
                { stage: 'Installing', count: 2, color: 'bg-indigo-500' },
                { stage: 'Completed', count: 15, color: 'bg-emerald-500' },
                { stage: 'On Hold', count: 1, color: 'bg-red-500' }
              ].map((stage, index) => (
                <div
                  key={stage.stage}
                  className="text-center"
                >
                  <div className={`${stage.color} text-white rounded-lg p-4 mb-2`}>
                    <div className="text-2xl font-bold">{stage.count}</div>
                  </div>
                  <div className="text-sm font-medium">{stage.stage}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <QuickJobModal
        open={showJobModal}
        onOpenChange={setShowJobModal}
        onJobCreated={fetchDashboardData}
      />
      <FirstEnquiryModal
        open={showEnquiryModal}
        onOpenChange={setShowEnquiryModal}
        onEnquiryCreated={fetchDashboardData}
      />
      <POConversionModal
        open={showPOModal}
        onOpenChange={setShowPOModal}
        onJobCreated={fetchDashboardData}
      />
      <ScheduleModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        onScheduleUpdated={fetchDashboardData}
      />
      <StatusUpdateModal
        open={showStatusModal}
        onOpenChange={setShowStatusModal}
        onStatusUpdated={fetchDashboardData}
      />
    </div>
  )
}

// Production Pipeline Overview Component
function ProductionPipelineOverview() {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly')
  const [selectedMetric, setSelectedMetric] = useState<'pipeline' | 'profit' | 'labor'>('pipeline')

  // Mock data for charts
  const weeklyPipelineData = [
    { name: 'Mon', enquiries: 4, quotes: 8, jobs: 3, completed: 5, revenue: 15400 },
    { name: 'Tue', enquiries: 6, quotes: 12, jobs: 4, completed: 3, revenue: 18200 },
    { name: 'Wed', enquiries: 8, quotes: 6, jobs: 7, completed: 4, revenue: 22100 },
    { name: 'Thu', enquiries: 5, quotes: 10, jobs: 2, completed: 6, revenue: 19800 },
    { name: 'Fri', enquiries: 7, quotes: 14, jobs: 5, completed: 8, revenue: 28500 },
    { name: 'Sat', enquiries: 3, quotes: 4, jobs: 1, completed: 2, revenue: 12300 },
    { name: 'Sun', enquiries: 2, quotes: 2, jobs: 0, completed: 1, revenue: 5600 }
  ]

  const monthlyPipelineData = [
    {
      name: 'Jan',
      enquiries: 125,
      quotes: 89,
      jobs: 67,
      completed: 72,
      revenue: 234000,
      profit: 58500,
      laborCost: 45000
    },
    {
      name: 'Feb',
      enquiries: 143,
      quotes: 97,
      jobs: 73,
      completed: 68,
      revenue: 267000,
      profit: 66750,
      laborCost: 48000
    },
    {
      name: 'Mar',
      enquiries: 167,
      quotes: 112,
      jobs: 84,
      completed: 79,
      revenue: 312000,
      profit: 78000,
      laborCost: 52000
    },
    {
      name: 'Apr',
      enquiries: 134,
      quotes: 95,
      jobs: 71,
      completed: 76,
      revenue: 289000,
      profit: 72250,
      laborCost: 47000
    },
    {
      name: 'May',
      enquiries: 156,
      quotes: 103,
      jobs: 78,
      completed: 74,
      revenue: 298000,
      profit: 74500,
      laborCost: 49500
    },
    {
      name: 'Jun',
      enquiries: 178,
      quotes: 121,
      jobs: 92,
      completed: 87,
      revenue: 345000,
      profit: 86250,
      laborCost: 55000
    }
  ]

  const profitData = [
    { name: 'Jan', revenue: 234000, costs: 175500, profit: 58500, margin: 25 },
    { name: 'Feb', revenue: 267000, costs: 200250, profit: 66750, margin: 25 },
    { name: 'Mar', revenue: 312000, costs: 234000, profit: 78000, margin: 25 },
    { name: 'Apr', revenue: 289000, costs: 216750, profit: 72250, margin: 25 },
    { name: 'May', revenue: 298000, costs: 223500, profit: 74500, margin: 25 },
    { name: 'Jun', revenue: 345000, costs: 258750, profit: 86250, margin: 25 }
  ]

  const laborBreakdownData = [
    { name: 'Fabrication', hours: 450, cost: 18000, efficiency: 92 },
    { name: 'Installation', hours: 280, cost: 14000, efficiency: 88 },
    { name: 'Admin', hours: 120, cost: 4800, efficiency: 95 },
    { name: 'Quality Control', hours: 80, cost: 3200, efficiency: 98 }
  ]

  const pipelineStatusData = [
    { stage: 'Enquiries', count: 23, value: 125000, color: '#60B5FF' },
    { stage: 'Quotes', count: 15, value: 89000, color: '#FF9149' },
    { stage: 'Approved', count: 8, value: 156000, color: '#FF9898' },
    { stage: 'Fabrication', count: 12, value: 198000, color: '#FF90BB' },
    { stage: 'Installation', count: 6, value: 87000, color: '#80D8C3' },
    { stage: 'Completed', count: 18, value: 298000, color: '#72BF78' }
  ]

  const handleStageClick = (stage: string) => {
    // Navigate to specific pipeline stage view
    console.log(`Navigate to ${stage} view`)
    // In real implementation, this would use router.push()
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Production Pipeline Overview
            </CardTitle>
            <CardDescription>Real-time analytics and performance metrics</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 text-sm rounded-l-lg ${
                  viewMode === 'weekly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-3 py-1 text-sm rounded-r-lg ${
                  viewMode === 'monthly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pipeline Status Cards */}
        <div className="grid grid-cols-3 gap-3">
          {pipelineStatusData.slice(0, 6).map((item, index) => (
            <div
              key={item.stage}
              onClick={() => handleStageClick(item.stage)}
              className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all hover:shadow-md bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-600">{item.stage}</div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
              </div>
              <div className="text-lg font-bold text-gray-900">{item.count}</div>
              <div className="text-xs text-gray-500">£{(item.value / 1000).toFixed(0)}k</div>
            </div>
          ))}
        </div>

        {/* Metric Selection Tabs */}
        <div className="flex space-x-1 rounded-lg border bg-gray-50 p-1">
          {[
            { key: 'pipeline', label: 'Pipeline Flow', icon: Building2 },
            { key: 'profit', label: 'P&L Analysis', icon: DollarSign },
            { key: 'labor', label: 'Labor Breakdown', icon: Users }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key as any)}
              className={`flex items-center flex-1 px-3 py-2 text-sm rounded-md transition-all ${
                selectedMetric === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="h-64">
          {selectedMetric === 'pipeline' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={viewMode === 'weekly' ? weeklyPipelineData : monthlyPipelineData}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: 11 }}
                  formatter={(value: any, name: string) => [value, name]}
                />
                <Bar dataKey="enquiries" stackId="pipeline" fill="#60B5FF" />
                <Bar dataKey="quotes" stackId="pipeline" fill="#FF9149" />
                <Bar dataKey="jobs" stackId="pipeline" fill="#FF9898" />
                <Bar dataKey="completed" stackId="pipeline" fill="#72BF78" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {selectedMetric === 'profit' && viewMode === 'monthly' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: 11 }}
                  formatter={(value: any, name: string) => [
                    name === 'revenue' || name === 'costs' || name === 'profit'
                      ? `£${(value / 1000).toFixed(0)}k`
                      : `${value}%`,
                    name
                  ]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#60B5FF" strokeWidth={2} />
                <Line type="monotone" dataKey="costs" stroke="#FF9149" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#72BF78" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {selectedMetric === 'labor' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={laborBreakdownData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ fontSize: 11 }}
                  formatter={(value: any, name: string) => [
                    name === 'cost'
                      ? `£${value}`
                      : name === 'efficiency'
                      ? `${value}%`
                      : value,
                    name
                  ]}
                />
                <Bar dataKey="hours" fill="#60B5FF" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {selectedMetric === 'profit' && viewMode === 'weekly' && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">P&L Analysis available for monthly view only</p>
              </div>
            </div>
          )}
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Conversion Rate:</span>
              <span className="font-medium">67%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Job Value:</span>
              <span className="font-medium">£18,500</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Profit Margin:</span>
              <span className="font-medium text-green-600">25%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Labor Efficiency:</span>
              <span className="font-medium text-blue-600">92%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 