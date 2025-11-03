'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Clock, XCircle, AlertTriangle, FileText, Building2, Users, TrendingUp } from 'lucide-react';
import ApprovalWorkflow from '@/components/approval-workflow';
import QuoteValidation from '@/components/quote-validation';

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState('workflow');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-600" />
            SFG APPROVAL SYSTEM
          </h1>
          <p className="text-muted-foreground">
            Comprehensive approval and validation system with business rule enforcement
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            System Active
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">8</p>
                <p className="text-xs text-muted-foreground">+15% vs yesterday</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk Quotes</p>
                <p className="text-2xl font-bold text-red-600">5</p>
                <p className="text-xs text-muted-foreground">Supply & Install</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Validation Rate</p>
                <p className="text-2xl font-bold text-blue-600">94%</p>
                <p className="text-xs text-muted-foreground">All checks passed</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflow" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Approval Workflow
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Quote Validation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-6 mt-6">
          <ApprovalWorkflow />
        </TabsContent>

        <TabsContent value="validation" className="space-y-6 mt-6">
          {selectedQuoteId ? (
            <QuoteValidation 
              quoteId={selectedQuoteId} 
              onValidationComplete={() => {
                // Refresh data or show success message
              }} 
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Quote for Validation</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a quote from the approval workflow to perform detailed validation checks.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Recent quotes requiring validation:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => setSelectedQuoteId('quote-1')}
                    >
                      Quote 21475 - Beesley and Fildes
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => setSelectedQuoteId('quote-2')}
                    >
                      Quote 21474 - Etron
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => setSelectedQuoteId('quote-3')}
                    >
                      Quote 21473 - NSS
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Approval Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Approval Time</span>
                    <Badge variant="secondary">2.3 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">First-Time Approval Rate</span>
                    <Badge variant="secondary">87%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Validation Pass Rate</span>
                    <Badge variant="secondary">94%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High-Risk Quote Accuracy</span>
                    <Badge variant="outline">76%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Warren Smith</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">15 approved</Badge>
                      <Badge variant="outline">2 pending</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neil Johnson</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">12 approved</Badge>
                      <Badge variant="outline">3 pending</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sarah Mitchell</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">8 approved</Badge>
                      <Badge variant="outline">1 pending</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emma Davis</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">6 approved</Badge>
                      <Badge variant="outline">4 pending</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 