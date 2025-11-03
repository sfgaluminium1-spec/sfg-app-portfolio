'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, User, LogOut, FileText, Calendar, DollarSign, Clock, CheckCircle, AlertCircle, TrendingUp, Download, MessageSquare, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
}

interface DashboardData {
  customer: Customer;
  stats: {
    totalEnquiries: number;
    activeJobs: number;
    completedJobs: number;
    totalQuoteValue: number;
    pendingQuotes: number;
  };
  recentEnquiries: any[];
  recentJobs: any[];
  recentQuotes: any[];
}

const statusColors = {
  NEW: 'bg-blue-500',
  CONTACTED: 'bg-yellow-500',
  QUOTED: 'bg-purple-500',
  WON: 'bg-green-500',
  LOST: 'bg-red-500',
  APPROVED: 'bg-blue-500',
  IN_PRODUCTION: 'bg-yellow-500',
  FABRICATION: 'bg-orange-500',
  ASSEMBLY: 'bg-purple-500',
  READY_FOR_INSTALL: 'bg-indigo-500',
  INSTALLING: 'bg-yellow-500',
  COMPLETED: 'bg-green-500',
  PENDING: 'bg-gray-500',
  SENT: 'bg-blue-500'
};

export default function CustomerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadDashboard();
  }, []);

  const checkAuthAndLoadDashboard = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      if (!token) {
        window.location.href = '/portal';
        return;
      }

      const response = await fetch('/api/portal/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        localStorage.removeItem('customerToken');
        window.location.href = '/portal';
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
      }

      localStorage.removeItem('customerToken');
      window.location.href = '/portal';
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load dashboard</h2>
          <Button onClick={() => window.location.href = '/portal'}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  const { customer, stats, recentEnquiries, recentJobs, recentQuotes } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">SFG PORTAL</h1>
                <p className="text-sm text-muted-foreground">Customer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                <p className="text-sm text-muted-foreground">{customer.company || customer.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {customer.firstName}!
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your projects and recent activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Enquiries</p>
                  <p className="text-2xl font-bold">{stats.totalEnquiries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Active Jobs</p>
                  <p className="text-2xl font-bold">{stats.activeJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Completed Jobs</p>
                  <p className="text-2xl font-bold">{stats.completedJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Quote Value</p>
                  <p className="text-2xl font-bold">£{stats.totalQuoteValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Pending Quotes</p>
                  <p className="text-2xl font-bold">{stats.pendingQuotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <div>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">My Jobs</TabsTrigger>
              <TabsTrigger value="quotes">My Quotes</TabsTrigger>
              <TabsTrigger value="enquiries">My Enquiries</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Recent Jobs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Jobs</CardTitle>
                    <CardDescription>Your latest project updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentJobs.length > 0 ? (
                      recentJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{job.jobNumber}</p>
                            <p className="text-xs text-muted-foreground">{job.description}</p>
                          </div>
                          <Badge className={`${statusColors[job.status as keyof typeof statusColors]} text-white text-xs`}>
                            {job.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No recent jobs</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Quotes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Quotes</CardTitle>
                    <CardDescription>Your latest quotations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentQuotes.length > 0 ? (
                      recentQuotes.map((quote) => (
                        <div key={quote.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{quote.quoteNumber}</p>
                            <p className="text-xs text-muted-foreground">£{quote.value.toLocaleString()}</p>
                          </div>
                          <Badge className={`${statusColors[quote.status as keyof typeof statusColors]} text-white text-xs`}>
                            {quote.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No recent quotes</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Enquiries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Enquiries</CardTitle>
                    <CardDescription>Your latest enquiries</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentEnquiries.length > 0 ? (
                      recentEnquiries.map((enquiry) => (
                        <div key={enquiry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{enquiry.enquiryNumber}</p>
                            <p className="text-xs text-muted-foreground">{enquiry.projectName || 'No project name'}</p>
                          </div>
                          <Badge className={`${statusColors[enquiry.status as keyof typeof statusColors]} text-white text-xs`}>
                            {enquiry.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No recent enquiries</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>My Jobs</CardTitle>
                  <CardDescription>Track the progress of your installations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Detailed job tracking coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes">
              <Card>
                <CardHeader>
                  <CardTitle>My Quotes</CardTitle>
                  <CardDescription>View and download your quotations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Quote management coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enquiries">
              <Card>
                <CardHeader>
                  <CardTitle>My Enquiries</CardTitle>
                  <CardDescription>View your enquiry history and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Enquiry management coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}