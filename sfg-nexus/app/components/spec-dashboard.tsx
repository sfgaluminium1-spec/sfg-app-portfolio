
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Shield, Eye, CheckCircle, AlertTriangle, Clock, TrendingUp, Palette, Layers, FileCheck, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardData {
  overview: {
    totalSpecifications: number;
    pendingValidation: number;
    compliantSpecs: number;
    nonCompliantSpecs: number;
    complianceRate: number;
    validationRate: number;
  };
  recentActivity: any[];
  glassTypeStats: any[];
  securityCompliance: any[];
  finishOptions: any[];
  monthlyTrends: any[];
}

export default function SpecDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/spec/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        // Fallback to mock data
        setDashboardData(mockDashboardData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data
      setDashboardData(mockDashboardData);
    } finally {
      setLoading(false);
    }
  };

  const mockDashboardData: DashboardData = {
    overview: {
      totalSpecifications: 156,
      pendingValidation: 23,
      compliantSpecs: 142,
      nonCompliantSpecs: 14,
      complianceRate: 91,
      validationRate: 85
    },
    recentActivity: [
      {
        id: '1',
        specificationNumber: 'SPEC-2024-001',
        customer: { firstName: 'John', lastName: 'Smith' },
        glassType: { name: 'Double Glazed Unit', category: 'Insulated' },
        complianceStatus: 'COMPLIANT'
      },
      {
        id: '2',
        specificationNumber: 'SPEC-2024-002',
        customer: { firstName: 'Sarah', lastName: 'Wilson' },
        glassType: { name: 'Laminated Safety Glass', category: 'Safety' },
        complianceStatus: 'PENDING'
      }
    ],
    glassTypeStats: [
      { name: 'Double Glazed Units', category: 'Insulated', usageCount: 45, isActive: true },
      { name: 'Laminated Glass', category: 'Safety', usageCount: 38, isActive: true },
      { name: 'Toughened Glass', category: 'Safety', usageCount: 32, isActive: true },
      { name: 'Triple Glazed Units', category: 'Insulated', usageCount: 23, isActive: true }
    ],
    securityCompliance: [
      { status: 'COMPLIANT', count: 142 },
      { status: 'PENDING', count: 23 },
      { status: 'NON_COMPLIANT', count: 14 },
      { status: 'UNDER_REVIEW', count: 8 }
    ],
    finishOptions: [
      { name: 'Powder Coated', material: 'Aluminium', category: 'Standard', usageCount: 67, isActive: true },
      { name: 'Anodised', material: 'Aluminium', category: 'Premium', usageCount: 45, isActive: true },
      { name: 'Mill Finish', material: 'Aluminium', category: 'Basic', usageCount: 23, isActive: true }
    ],
    monthlyTrends: []
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  const { overview, recentActivity, glassTypeStats, securityCompliance, finishOptions } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SFG SPEC Dashboard</h1>
          <p className="text-muted-foreground">Glass specification and security compliance management</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          £120/month ADD-ON
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Specifications</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalSpecifications}</div>
            <p className="text-xs text-muted-foreground">
              Active glass specifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.complianceRate}%</div>
            <Progress value={overview.complianceRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {overview.compliantSpecs} of {overview.totalSpecifications} compliant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validation Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.validationRate}%</div>
            <Progress value={overview.validationRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {overview.pendingValidation} pending validation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overview.nonCompliantSpecs}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="glass-types">Glass Types</TabsTrigger>
          <TabsTrigger value="security">Security Compliance</TabsTrigger>
          <TabsTrigger value="finishes">Finish Options</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Specifications</CardTitle>
              <CardDescription>Latest glass specifications and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No recent specifications</p>
                ) : (
                  recentActivity.map((spec, index) => (
                    <div key={spec.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Eye className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{spec.specificationNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {spec.customer?.firstName} {spec.customer?.lastName} • {spec.glassType?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={spec.complianceStatus === 'COMPLIANT' ? 'default' : spec.complianceStatus === 'NON_COMPLIANT' ? 'destructive' : 'secondary'}>
                          {spec.complianceStatus}
                        </Badge>
                        <Badge variant="outline">
                          {spec.glassType?.category}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="glass-types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Glass Type Usage</CardTitle>
              <CardDescription>Most popular glass types and their usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {glassTypeStats.map((type, index) => (
                  <div key={type.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Layers className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{type.name}</p>
                        <p className="text-sm text-muted-foreground">{type.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{type.usageCount} specs</Badge>
                      {type.isActive && <Badge variant="default">Active</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Compliance Status</CardTitle>
              <CardDescription>Overview of security compliance across all specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {securityCompliance.map((compliance, index) => (
                  <div key={compliance.status} className="p-4 border rounded-lg text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="font-medium">{compliance.status}</p>
                    <p className="text-2xl font-bold text-blue-600">{compliance.count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finishes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Finish Options Usage</CardTitle>
              <CardDescription>Popular finish options and material preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {finishOptions.map((finish, index) => (
                  <div key={finish.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Palette className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{finish.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {finish.material} • {finish.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{finish.usageCount} specs</Badge>
                      {finish.isActive && <Badge variant="default">Active</Badge>}
                    </div>
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
