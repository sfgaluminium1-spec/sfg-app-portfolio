
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Play, Users, TrendingUp, Link, QrCode, Send, Eye, BarChart3, Calendar, Clock, CheckCircle, XCircle, ArrowRight, Smartphone, Mail, MessageSquare, Download, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface CustomerPortalDemoSystemProps {
  customerId?: string;
}

interface PortalAccess {
  id: string;
  customerId: string;
  accessType: string;
  accessToken: string;
  isDemoAccess: boolean;
  demoExpiresAt?: string;
  demoActivated: boolean;
  demoActivatedAt?: string;
  loginCount: number;
  lastLoginAt?: string;
  featuresUsed: string[];
  timeSpent: number;
  convertedToFull: boolean;
  convertedAt?: string;
  conversionSource?: string;
  customer?: any;
}

interface DemoStats {
  totalDemo: number;
  activatedDemo: number;
  convertedToFull: number;
  conversionRate: number;
  activationRate: number;
}

export default function CustomerPortalDemoSystem({ customerId }: CustomerPortalDemoSystemProps) {
  const [portalAccesses, setPortalAccesses] = useState<PortalAccess[]>([]);
  const [demoStats, setDemoStats] = useState<DemoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Demo creation states
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [demoData, setDemoData] = useState<any>({});
  const [promotionData, setPromotionData] = useState<any>({});

  useEffect(() => {
    fetchPortalData();
  }, [customerId]);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (customerId) params.append('customerId', customerId);

      const response = await fetch(`/api/customer-portal-demo?${params}`);
      const data = await response.json();

      if (data.success) {
        setPortalAccesses(data.portalAccesses || []);
        setDemoStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching portal data:', error);
      toast.error('Failed to load portal data');
    } finally {
      setLoading(false);
    }
  };

  const createDemoAccess = async () => {
    try {
      const response = await fetch('/api/customer-portal-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_demo_access',
          customerId,
          demoData
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Demo access created successfully');
        await fetchPortalData();
        setShowDemoModal(false);
        setDemoData({});

        // Copy demo link to clipboard
        if (result.demoLink) {
          navigator.clipboard.writeText(result.demoLink);
          toast.success('Demo link copied to clipboard');
        }
      } else {
        toast.error(result.message || 'Failed to create demo access');
      }
    } catch (error) {
      console.error('Demo creation error:', error);
      toast.error('Failed to create demo access');
    }
  };

  const promotePortal = async () => {
    try {
      const response = await fetch('/api/customer-portal-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'promote_portal',
          customerId,
          portalData: promotionData
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Portal promotion sent via ${promotionData.method}`);
        setShowPromotionModal(false);
        setPromotionData({});
      } else {
        toast.error('Failed to send portal promotion');
      }
    } catch (error) {
      console.error('Promotion error:', error);
      toast.error('Failed to send portal promotion');
    }
  };

  const convertToFull = async (accessId: string) => {
    try {
      const response = await fetch('/api/customer-portal-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'convert_to_full',
          customerId,
          portalData: { conversionSource: 'manual' }
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Customer converted to full portal access');
        await fetchPortalData();
      } else {
        toast.error(result.message || 'Failed to convert to full access');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert to full access');
    }
  };

  const generateDemoLink = async (customerId: string) => {
    try {
      const response = await fetch('/api/customer-portal-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_demo_link',
          customerId,
          demoData: { expirationHours: 168 } // 7 days
        })
      });

      const result = await response.json();
      if (result.success) {
        navigator.clipboard.writeText(result.demoLink);
        toast.success('Demo link generated and copied to clipboard');
      } else {
        toast.error('Failed to generate demo link');
      }
    } catch (error) {
      console.error('Demo link generation error:', error);
      toast.error('Failed to generate demo link');
    }
  };

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
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <Monitor className="h-6 w-6 mr-3 text-purple-600" />
            Customer Portal Demo System
          </h2>
          <p className="text-muted-foreground">
            Manage portal demos, track conversions, and promote customer adoption
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowPromotionModal(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send Promotion
          </Button>
          <Button onClick={() => setShowDemoModal(true)}>
            <Play className="h-4 w-4 mr-2" />
            Create Demo
          </Button>
        </div>
      </div>

      {/* Demo Statistics Overview */}
      {demoStats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Demos</p>
                  <p className="text-2xl font-bold text-blue-600">{demoStats.totalDemo}</p>
                </div>
                <Monitor className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Activated</p>
                  <p className="text-2xl font-bold text-green-600">{demoStats.activatedDemo}</p>
                  <p className="text-xs text-muted-foreground">{demoStats.activationRate}% rate</p>
                </div>
                <Play className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Converted</p>
                  <p className="text-2xl font-bold text-purple-600">{demoStats.convertedToFull}</p>
                  <p className="text-xs text-muted-foreground">{demoStats.conversionRate}% rate</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-orange-600">{demoStats.conversionRate}%</p>
                  <p className="text-xs text-muted-foreground">Demo to full</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Score</p>
                  <p className="text-2xl font-bold text-indigo-600">A+</p>
                  <p className="text-xs text-muted-foreground">Overall rating</p>
                </div>
                <CheckCircle className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Portal Demo Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demos">Demo Access</TabsTrigger>
          <TabsTrigger value="promotion">Promotion</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DemoOverviewTab 
            portalAccesses={portalAccesses}
            onCreateDemo={() => setShowDemoModal(true)}
            onGenerateDemoLink={generateDemoLink}
            onConvertToFull={convertToFull}
          />
        </TabsContent>

        <TabsContent value="demos" className="space-y-4">
          <DemoAccessTab 
            portalAccesses={portalAccesses}
            onCreateDemo={() => setShowDemoModal(true)}
            onGenerateDemoLink={generateDemoLink}
            onConvertToFull={convertToFull}
          />
        </TabsContent>

        <TabsContent value="promotion" className="space-y-4">
          <PromotionTab onPromote={() => setShowPromotionModal(true)} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab portalAccesses={portalAccesses} demoStats={demoStats} />
        </TabsContent>
      </Tabs>

      {/* Demo Creation Modal */}
      <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Play className="h-5 w-5 mr-2 text-purple-600" />
              Create Demo Access
            </DialogTitle>
            <DialogDescription>
              Create a new demo portal access for customer evaluation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Demo Expiration</label>
              <Select 
                value={demoData.expirationHours?.toString() || '72'} 
                onValueChange={(value) => setDemoData({ ...demoData, expirationHours: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 Hours</SelectItem>
                  <SelectItem value="72">3 Days</SelectItem>
                  <SelectItem value="168">1 Week</SelectItem>
                  <SelectItem value="336">2 Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Demo Features</label>
              <div className="space-y-2">
                {['DEMO_ACCESS', 'PROJECT_TRACKING', 'DOCUMENT_SHARING', 'APPROVAL_WORKFLOW'].map((feature) => (
                  <label key={feature} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      checked={demoData.features?.includes(feature) || false}
                      onChange={(e) => {
                        const features = demoData.features || [];
                        if (e.target.checked) {
                          setDemoData({ ...demoData, features: [...features, feature] });
                        } else {
                          setDemoData({ ...demoData, features: features.filter((f: string) => f !== feature) });
                        }
                      }}
                    />
                    <span className="text-sm">{feature.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🎯 Demo Features</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Sample project data for demonstration</li>
                <li>• Interactive feature walkthrough</li>
                <li>• Guided tour of portal capabilities</li>
                <li>• Mock notifications and updates</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDemoModal(false)}>
              Cancel
            </Button>
            <Button onClick={createDemoAccess}>
              <Play className="h-4 w-4 mr-2" />
              Create Demo Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Portal Promotion Modal */}
      <Dialog open={showPromotionModal} onOpenChange={setShowPromotionModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2 text-purple-600" />
              Promote Customer Portal
            </DialogTitle>
            <DialogDescription>
              Send portal promotions to encourage customer adoption
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Promotion Method</label>
              <Select 
                value={promotionData.method || ''} 
                onValueChange={(value) => setPromotionData({ ...promotionData, method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Custom Message (Optional)</label>
              <textarea 
                className="w-full px-3 py-2 border rounded-md resize-none"
                rows={4}
                value={promotionData.message || ''}
                onChange={(e) => setPromotionData({ ...promotionData, message: e.target.value })}
                placeholder="Add a personalized message..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  checked={promotionData.includeDemo !== false}
                  onChange={(e) => setPromotionData({ ...promotionData, includeDemo: e.target.checked })}
                />
                <span className="text-sm">Include demo access link</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  checked={promotionData.includeGuide || false}
                  onChange={(e) => setPromotionData({ ...promotionData, includeGuide: e.target.checked })}
                />
                <span className="text-sm">Include setup guide</span>
              </label>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📧 Promotion Preview</h4>
              <p className="text-sm text-blue-800">
                Subject: Experience Our New Customer Portal<br/>
                🚀 Track projects, approve drawings, and communicate with our team - all in one place!
                {promotionData.includeDemo && <><br/>Try our demo: [DEMO_LINK]</>}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPromotionModal(false)}>
              Cancel
            </Button>
            <Button onClick={promotePortal} disabled={!promotionData.method}>
              <Send className="h-4 w-4 mr-2" />
              Send Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-components
function DemoOverviewTab({ portalAccesses, onCreateDemo, onGenerateDemoLink, onConvertToFull }: any) {
  const recentDemos = portalAccesses.filter((access: PortalAccess) => access.isDemoAccess).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="h-5 w-5 mr-2 text-green-600" />
              Quick Demo Creation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Create instant demo access for customer evaluation
            </p>
            <Button onClick={onCreateDemo} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Create Demo Access
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link className="h-5 w-5 mr-2 text-blue-600" />
              Demo Link Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Generate shareable demo links for any customer
            </p>
            <Button variant="outline" className="w-full">
              <Link className="h-4 w-4 mr-2" />
              Generate Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Conversion Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Track demo to full portal conversions
            </p>
            <Button variant="outline" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Demo Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDemos.map((access: PortalAccess) => (
              <div key={access.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    access.convertedToFull ? 'bg-green-500' :
                    access.demoActivated ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <div className="font-medium text-sm">
                      {access.customer?.firstName || 'Customer'} {access.customer?.lastName || ''}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {access.demoActivated ? `Activated • ${access.loginCount} logins` : 'Not activated'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    access.convertedToFull ? 'default' :
                    access.demoActivated ? 'secondary' : 'outline'
                  }>
                    {access.convertedToFull ? 'Converted' : access.demoActivated ? 'Active' : 'Pending'}
                  </Badge>
                  {!access.convertedToFull && (
                    <Button size="sm" variant="outline" onClick={() => onConvertToFull(access.id)}>
                      Convert
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {recentDemos.length === 0 && (
            <div className="text-center py-8">
              <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No demo access created yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DemoAccessTab({ portalAccesses, onCreateDemo, onGenerateDemoLink, onConvertToFull }: any) {
  const demoAccesses = portalAccesses.filter((access: PortalAccess) => access.isDemoAccess);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Demo Portal Access</h3>
        <Button onClick={onCreateDemo}>
          <Play className="h-4 w-4 mr-2" />
          Create Demo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {demoAccesses.map((access: PortalAccess) => (
          <Card key={access.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {access.customer?.firstName || 'Customer'} {access.customer?.lastName || ''}
                  </CardTitle>
                  <CardDescription>{access.customer?.company || 'No company'}</CardDescription>
                </div>
                <Badge variant={access.demoActivated ? 'default' : 'outline'}>
                  {access.demoActivated ? 'Active' : 'Pending'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">Logins</label>
                  <p className="font-medium">{access.loginCount}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Time Spent</label>
                  <p className="font-medium">{access.timeSpent || 0}m</p>
                </div>
              </div>

              {access.demoExpiresAt && (
                <div className="text-sm">
                  <label className="text-muted-foreground">Expires</label>
                  <p className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(access.demoExpiresAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="text-sm">
                <label className="text-muted-foreground">Features Used</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {access.featuresUsed?.slice(0, 3).map((feature: string) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature.replace('_', ' ')}
                    </Badge>
                  )) || <span className="text-muted-foreground text-xs">None</span>}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onGenerateDemoLink(access.customerId)}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Link
                </Button>
                {!access.convertedToFull && (
                  <Button size="sm" onClick={() => onConvertToFull(access.id)} className="flex-1">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Convert
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {demoAccesses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No demo access created yet</h3>
            <p className="text-muted-foreground mb-4">Create demo access to allow customers to try the portal</p>
            <Button onClick={onCreateDemo}>
              <Play className="h-4 w-4 mr-2" />
              Create First Demo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PromotionTab({ onPromote }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Portal Promotion Campaigns</h3>
        <Button onClick={onPromote}>
          <Send className="h-4 w-4 mr-2" />
          Send Promotion
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Promotion Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Email Campaigns</div>
                    <div className="text-sm text-muted-foreground">Targeted email promotions</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">WhatsApp Business</div>
                    <div className="text-sm text-muted-foreground">Direct WhatsApp messages</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">SMS Marketing</div>
                    <div className="text-sm text-muted-foreground">SMS promotions</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promotion Materials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">QR Code Portal Access</h4>
                  <Button size="sm" variant="outline">
                    <QrCode className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  QR codes for easy portal access at site meetings
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Demo Video</h4>
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Portal walkthrough video for customer education
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Setup Guide</h4>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Step-by-step portal setup guide for customers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portal Benefits Showcase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Real-time Tracking</h4>
              <p className="text-sm text-muted-foreground">Monitor project progress instantly</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Digital Approvals</h4>
              <p className="text-sm text-muted-foreground">Approve drawings with one click</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Team Communication</h4>
              <p className="text-sm text-muted-foreground">Direct line to project team</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Eye className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Document Access</h4>
              <p className="text-sm text-muted-foreground">All project docs in one place</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsTab({ portalAccesses, demoStats }: any) {
  const demoAccesses = portalAccesses.filter((access: PortalAccess) => access.isDemoAccess);
  const fullAccesses = portalAccesses.filter((access: PortalAccess) => !access.isDemoAccess);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{demoAccesses.length}</div>
              <div className="text-sm text-muted-foreground">Demo Accesses</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{fullAccesses.length}</div>
              <div className="text-sm text-muted-foreground">Full Accesses</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {demoStats?.conversionRate || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Math.round(portalAccesses.reduce((sum: number, access: PortalAccess) => sum + access.timeSpent, 0) / portalAccesses.length) || 0}m
              </div>
              <div className="text-sm text-muted-foreground">Avg. Time Spent</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Portal Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Demo Activations</span>
                <span className="text-sm text-muted-foreground">
                  {demoStats?.activationRate || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${demoStats?.activationRate || 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Demo Conversions</span>
                <span className="text-sm text-muted-foreground">
                  {demoStats?.conversionRate || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${demoStats?.conversionRate || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
