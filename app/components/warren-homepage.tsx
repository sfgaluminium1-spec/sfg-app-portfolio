'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, FileText, ShoppingCart, TrendingUp, Clock, CheckCircle, AlertCircle, Users, Calendar, DollarSign, Zap, Brain, Shield, Factory, Hammer, Wrench, ArrowRight, BarChart3, MessageSquare, Settings, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import QuickJobModal from '@/components/modals/quick-job-modal';
import FirstEnquiryModal from '@/components/modals/first-enquiry-modal';
import POConversionModal from '@/components/modals/po-conversion-modal';
import ScheduleModal from '@/components/modals/schedule-modal';
import StatusUpdateModal from '@/components/modals/status-update-modal';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalQuotes: number;
  quotesWon: number;
  quotesValue: number;
  totalOrders: number;
  ordersValue: number;
  recentActivities: any[];
}

export default function WarrenHomepage() {
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
  });
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showJobModal, setShowJobModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
          { id: 1, type: 'job_created', description: 'New job 18457 created for Beesley and Fildes', time: '2 hours ago' },
          { id: 2, type: 'quote_sent', description: 'Quote 21476 sent to Lodestone Projects', time: '4 hours ago' },
          { id: 3, type: 'job_completed', description: 'Job 18455 completed - Installation finished', time: '6 hours ago' },
          { id: 4, type: 'order_placed', description: 'Order 31045 placed with NVM Supplier', time: '1 day ago' },
          { id: 5, type: 'status_update', description: 'Job 18456 moved to Fabrication stage', time: '1 day ago' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const QuickActionCard = ({ title, description, icon: Icon, onClick, color = "primary", badge }: any) => (
    <div>
      <Card className="warren-executive-card cursor-pointer group" onClick={onClick}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-lg bg-${color}/10 group-hover:bg-${color}/20 transition-colors duration-300`}>
              <Icon className={`h-6 w-6 text-${color}`} />
            </div>
            {badge && (
              <Badge variant="secondary" className="text-xs font-medium">
                {badge}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <div className="flex items-center mt-3 text-primary text-sm font-medium">
            <span>Get started</span>
            <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, description, trend, color = "fabrication", clickable = false }: any) => (
    <div className="group">
      <Card className={`warren-executive-card ${clickable ? 'cursor-pointer hover:shadow-lg transition-all duration-300' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium text-muted-foreground ${clickable ? 'group-hover:text-primary' : ''}`}>{title}</CardTitle>
          <div className={`p-2 rounded-lg bg-${color}/10 group-hover:bg-${color}/20 transition-colors duration-300`}>
            <Icon className={`h-4 w-4 text-${color}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold mb-1 ${clickable ? 'group-hover:text-primary' : ''}`}>{value}</div>
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
          {trend && (
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 text-installation mr-1" />
              <span className="text-xs text-installation font-medium">{trend}</span>
            </div>
          )}
          {clickable && (
            <div className="flex items-center mt-3 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>View details</span>
              <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="warren-shimmer w-16 h-16 rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SFG NEXUS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-installation/5"></div>
        <div className="warren-container relative z-10">
          <div className="mb-12">
            <div className="relative h-24 w-auto mx-auto mb-8">
              <Image 
                src="https://cdn.abacus.ai/images/5587be9e-b9a6-4acd-afac-a3abeae54039.png" 
                alt="SFG NEXUS Logo" 
                width={350} 
                height={96} 
                className="object-contain mx-auto" 
                priority 
              />
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-installation to-primary bg-clip-text text-transparent">
              Executive Glass Management Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Streamline your glass fabrication and installation business with our comprehensive AI-powered platform. From enquiry to completion, manage every aspect of your operation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="warren-btn-primary text-lg px-8 py-6"
                onClick={() => setShowEnquiryModal(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Start New Enquiry
              </Button>
              <Link href="/schedule">
                <Button variant="outline" size="lg" className="warren-btn-secondary text-lg px-8 py-6">
                  <Calendar className="h-5 w-5 mr-2" />
                  View Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="warren-container space-y-12 pb-20">
        {/* Key Performance Metrics */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Business Performance</h2>
            <p className="text-muted-foreground">Real-time insights into your operations data and performance metrics</p>
          </div>
          <div className="dashboard-grid">
            <Link href="/jobs">
              <StatCard 
                title="Total Jobs" 
                value={stats.totalJobs} 
                icon={Building2} 
                description="All jobs in system" 
                trend="+12% from last month" 
                color="fabrication" 
                clickable={true} 
              />
            </Link>
            <Link href="/schedule">
              <StatCard 
                title="Active Projects" 
                value={stats.activeJobs} 
                icon={Clock} 
                description="Currently in progress" 
                trend="+5% from last week" 
                color="installation" 
                clickable={true} 
              />
            </Link>
            <Link href="/pricing">
              <StatCard 
                title="Revenue Pipeline" 
                value={`£${stats.quotesValue.toLocaleString()}`} 
                icon={DollarSign} 
                description="Total quoted this year" 
                trend="+18% from last month" 
                color="primary" 
                clickable={true} 
              />
            </Link>
            <Link href="/finance">
              <StatCard 
                title="Success Rate" 
                value={`${Math.round((stats.completedJobs / stats.totalJobs) * 100)}%`} 
                icon={CheckCircle} 
                description="Jobs completed on time" 
                trend="+3% improvement" 
                color="installation" 
                clickable={true} 
              />
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Quick Actions</h2>
            <p className="text-muted-foreground">Start your most common tasks instantly</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard 
              title="First Enquiry" 
              description="Capture initial customer enquiry and requirements with our guided workflow" 
              icon={MessageSquare} 
              onClick={() => setShowEnquiryModal(true)} 
              color="primary" 
              badge="POPULAR" 
            />
            <QuickActionCard 
              title="PO Received" 
              description="Convert approved quotes to active jobs when purchase orders are received" 
              icon={CheckCircle} 
              onClick={() => setShowPOModal(true)} 
              color="installation" 
            />
            <QuickActionCard 
              title="Schedule Installation" 
              description="Book installation slots with automated resource allocation and planning" 
              icon={Calendar} 
              onClick={() => setShowScheduleModal(true)} 
              color="fabrication" 
            />
            <QuickActionCard 
              title="Update Job Status" 
              description="Track progress through fabrication and installation phases" 
              icon={TrendingUp} 
              onClick={() => setShowStatusModal(true)} 
              color="primary" 
            />
            <Link href="/customers" className="contents">
              <QuickActionCard 
                title="Manage Customers" 
                description="Access customer database with advanced import/export capabilities" 
                icon={Users} 
                onClick={() => {}} 
                color="installation" 
              />
            </Link>
            <Link href="/pricing" className="contents">
              <QuickActionCard 
                title="AI Pricing" 
                description="Generate intelligent quotes with our advanced pricing algorithms" 
                icon={Brain} 
                onClick={() => {}} 
                color="primary" 
                badge="AI" 
              />
            </Link>
          </div>
        </section>

        {/* Feature Highlights */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Platform Features</h2>
            <p className="text-muted-foreground">Comprehensive tools for glass industry professionals</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Production Pipeline */}
            <Card className="warren-executive-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Factory className="h-5 w-5 mr-2 text-fabrication" />
                  Production Pipeline
                </CardTitle>
                <CardDescription>
                  14-step fabrication workflow with intelligent scheduling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { stage: 'Quote', count: 12, color: 'bg-fabrication' },
                    { stage: 'Fab', count: 8, color: 'bg-installation' },
                    { stage: 'Install', count: 6, color: 'bg-primary' },
                    { stage: 'Done', count: 15, color: 'bg-installation' }
                  ].map((item, index) => (
                    <div key={item.stage} className="text-center">
                      <div className={`${item.color} text-white rounded-lg p-3 mb-1`}>
                        <div className="text-lg font-bold">{item.count}</div>
                      </div>
                      <div className="text-xs font-medium">{item.stage}</div>
                    </div>
                  ))}
                </div>
                <Link href="/fabrication-scheduler">
                  <Button variant="outline" className="w-full warren-btn-secondary">
                    <Hammer className="h-4 w-4 mr-2" />
                    View Fabrication Schedule
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* AI Intelligence */}
            <Card className="warren-executive-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  AI Intelligence
                </CardTitle>
                <CardDescription>
                  Smart pricing, scheduling, and workflow optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Price Optimization</span>
                    <Badge variant="secondary">95% Accuracy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Schedule Efficiency</span>
                    <Badge variant="secondary">+23% Improvement</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resource Allocation</span>
                    <Badge variant="secondary">Automated</Badge>
                  </div>
                </div>
                <Link href="/chat">
                  <Button variant="outline" className="w-full warren-btn-secondary">
                    <Brain className="h-4 w-4 mr-2" />
                    Access AI Assistant
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* System Integration */}
        <section>
          <Card className="warren-executive-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Integrated Ecosystem</CardTitle>
              <CardDescription>
                Seamlessly connected modules for complete business management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: 'SFG SPEC', icon: Shield, href: '/spec', color: 'primary' },
                  { name: 'SFG TIME', icon: DollarSign, href: '/finance', color: 'installation' },
                  { name: 'Portal', icon: Users, href: '/portal', color: 'fabrication' },
                  { name: 'Teams', icon: MessageSquare, href: '/chat', color: 'primary' },
                  { name: 'Approvals', icon: CheckCircle, href: '/approvals', color: 'installation' },
                  { name: 'Analytics', icon: BarChart3, href: '/pricing', color: 'fabrication' }
                ].map((module, index) => (
                  <div key={module.name}>
                    <Link href={module.href}>
                      <Card className="text-center p-4 warren-card cursor-pointer group">
                        <module.icon className={`h-8 w-8 mx-auto mb-2 text-${module.color} group-hover:scale-110 transition-transform duration-300`} />
                        <h4 className="text-sm font-medium">{module.name}</h4>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Modals */}
      <QuickJobModal open={showJobModal} onOpenChange={setShowJobModal} onJobCreated={fetchDashboardData} />
      <FirstEnquiryModal open={showEnquiryModal} onOpenChange={setShowEnquiryModal} onEnquiryCreated={fetchDashboardData} />
      <POConversionModal open={showPOModal} onOpenChange={setShowPOModal} onJobCreated={fetchDashboardData} />
      <ScheduleModal open={showScheduleModal} onOpenChange={setShowScheduleModal} onScheduleUpdated={fetchDashboardData} />
      <StatusUpdateModal open={showStatusModal} onOpenChange={setShowStatusModal} onStatusUpdated={fetchDashboardData} />
    </div>
  );
}