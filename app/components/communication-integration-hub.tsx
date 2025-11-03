
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Send, Settings, CheckCircle, XCircle, Clock, AlertCircle, Phone, Mail, Smartphone, Monitor, Zap, Bell, Calendar, Link, QrCode, Eye, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface CommunicationIntegrationHubProps {
  customerId?: string;
  jobId?: string;
}

interface WhatsAppMessage {
  id: string;
  messageType: string;
  messageContent: string;
  recipientPhone: string;
  recipientName: string;
  status: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failureReason?: string;
}

interface TeamsMessage {
  id: string;
  messageContent: string;
  messageType: string;
  priority: string;
  status: string;
  sentAt?: string;
  channelName?: string;
  mentions: string[];
}

interface Integration {
  id: string;
  type: 'WHATSAPP' | 'TEAMS';
  name: string;
  isActive: boolean;
  status: string;
  messagesCount: number;
  lastMessageSent?: string;
  configuration: any;
}

export default function CommunicationIntegrationHub({ customerId, jobId }: CommunicationIntegrationHubProps) {
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([]);
  const [teamsMessages, setTeamsMessages] = useState<TeamsMessage[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Message sending states
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [showPortalPromoModal, setShowPortalPromoModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);

  // Form data states
  const [whatsappData, setWhatsappData] = useState<any>({});
  const [teamsData, setTeamsData] = useState<any>({});
  const [portalPromoData, setPortalPromoData] = useState<any>({});
  const [integrationData, setIntegrationData] = useState<any>({});

  useEffect(() => {
    fetchCommunicationData();
  }, [customerId, jobId]);

  const fetchCommunicationData = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (customerId) params.append('customerId', customerId);
      if (jobId) params.append('jobId', jobId);

      const [whatsappResponse, teamsResponse, integrationsResponse] = await Promise.all([
        fetch(`/api/whatsapp-integration?${params}`),
        fetch(`/api/teams-integration?${params}`),
        fetch(`/api/communication-integrations`)
      ]);

      const whatsappData = await whatsappResponse.json();
      const teamsData = await teamsResponse.json();
      const integrationsData = await integrationsResponse.json();

      if (whatsappData.success) {
        setWhatsappMessages(whatsappData.messages || []);
      }

      if (teamsData.success) {
        setTeamsMessages(teamsData.messages || []);
      }

      if (integrationsData.success) {
        setIntegrations(integrationsData.integrations || []);
      }
    } catch (error) {
      console.error('Error fetching communication data:', error);
      toast.error('Failed to load communication data');
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsAppMessage = async () => {
    try {
      const response = await fetch('/api/whatsapp-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          messageData: { ...whatsappData, customerId, jobId }
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('WhatsApp message sent successfully');
        await fetchCommunicationData();
        setShowWhatsAppModal(false);
        setWhatsappData({});
      } else {
        toast.error(result.error || 'Failed to send WhatsApp message');
      }
    } catch (error) {
      console.error('WhatsApp send error:', error);
      toast.error('Failed to send WhatsApp message');
    }
  };

  const sendTeamsMessage = async () => {
    try {
      const response = await fetch('/api/teams-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          messageData: { ...teamsData, customerId, jobId }
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Teams message sent successfully');
        await fetchCommunicationData();
        setShowTeamsModal(false);
        setTeamsData({});
      } else {
        toast.error(result.error || 'Failed to send Teams message');
      }
    } catch (error) {
      console.error('Teams send error:', error);
      toast.error('Failed to send Teams message');
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
          portalData: portalPromoData
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Portal promotion sent via ${portalPromoData.method}`);
        setShowPortalPromoModal(false);
        setPortalPromoData({});
      } else {
        toast.error('Failed to send portal promotion');
      }
    } catch (error) {
      console.error('Portal promotion error:', error);
      toast.error('Failed to send portal promotion');
    }
  };

  const configureIntegration = async () => {
    try {
      const endpoint = integrationData.type === 'WHATSAPP' ? 
        '/api/whatsapp-integration' : '/api/teams-integration';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'configure_integration',
          integrationData
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`${integrationData.type} integration configured successfully`);
        await fetchCommunicationData();
        setShowIntegrationModal(false);
        setIntegrationData({});
      } else {
        toast.error('Failed to configure integration');
      }
    } catch (error) {
      console.error('Integration configuration error:', error);
      toast.error('Failed to configure integration');
    }
  };

  const sendDailyReminder = async (type: string) => {
    try {
      const response = await fetch('/api/whatsapp-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_daily_reminder',
          messageData: {
            customerContactId: customerId,
            reminderType: type,
            projectDetails: [
              { jobNumber: 'J001', drawingName: 'Technical Drawing v2.1' }
            ]
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Daily ${type} reminder sent`);
      } else {
        toast.error('Failed to send reminder');
      }
    } catch (error) {
      console.error('Reminder send error:', error);
      toast.error('Failed to send reminder');
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
            <MessageSquare className="h-6 w-6 mr-3 text-blue-600" />
            Communication Integration Hub
          </h2>
          <p className="text-muted-foreground">
            Unified WhatsApp, Teams, and Customer Portal communication
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowIntegrationModal(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Integration Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">WhatsApp Business</p>
                <p className="text-2xl font-bold text-green-600">
                  {whatsappMessages.filter(m => m.status === 'DELIVERED').length}
                </p>
                <p className="text-xs text-muted-foreground">Messages delivered</p>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-8 w-8 text-green-600" />
                <Badge variant="default" className="bg-green-500">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Microsoft Teams</p>
                <p className="text-2xl font-bold text-blue-600">
                  {teamsMessages.filter(m => m.status === 'SENT').length}
                </p>
                <p className="text-xs text-muted-foreground">Messages sent</p>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <Badge variant="default" className="bg-blue-500">
                  Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Portal</p>
                <p className="text-2xl font-bold text-purple-600">85%</p>
                <p className="text-xs text-muted-foreground">Demo conversion rate</p>
              </div>
              <div className="flex items-center space-x-2">
                <Monitor className="h-8 w-8 text-purple-600" />
                <Badge variant="default" className="bg-purple-500">
                  Live
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="portal">Portal Promotion</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <CommunicationOverviewTab 
            onSendWhatsApp={() => setShowWhatsAppModal(true)}
            onSendTeams={() => setShowTeamsModal(true)}
            onPromotePortal={() => setShowPortalPromoModal(true)}
            onSendReminder={sendDailyReminder}
          />
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <WhatsAppTab 
            messages={whatsappMessages}
            onSendMessage={() => setShowWhatsAppModal(true)}
            onSendReminder={sendDailyReminder}
          />
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <TeamsTab 
            messages={teamsMessages}
            onSendMessage={() => setShowTeamsModal(true)}
          />
        </TabsContent>

        <TabsContent value="portal" className="space-y-4">
          <PortalPromotionTab 
            onPromotePortal={() => setShowPortalPromoModal(true)}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <CommunicationAnalyticsTab 
            whatsappMessages={whatsappMessages}
            teamsMessages={teamsMessages}
          />
        </TabsContent>
      </Tabs>

      {/* WhatsApp Message Modal */}
      <Dialog open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2 text-green-600" />
              Send WhatsApp Message
            </DialogTitle>
            <DialogDescription>
              Send messages, drawing approvals, or reminders via WhatsApp Business
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Message Type</label>
              <Select 
                value={whatsappData.messageType || ''} 
                onValueChange={(value) => setWhatsappData({ ...whatsappData, messageType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAWING_APPROVAL_REQUEST">Drawing Approval Request</SelectItem>
                  <SelectItem value="DAILY_REMINDER">Daily Reminder</SelectItem>
                  <SelectItem value="PROJECT_UPDATE">Project Update</SelectItem>
                  <SelectItem value="PORTAL_PROMOTION">Portal Promotion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Recipient Phone</label>
                <Input 
                  value={whatsappData.recipientPhone || ''} 
                  onChange={(e) => setWhatsappData({ ...whatsappData, recipientPhone: e.target.value })}
                  placeholder="+44 7123 456789" 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Recipient Name</label>
                <Input 
                  value={whatsappData.recipientName || ''} 
                  onChange={(e) => setWhatsappData({ ...whatsappData, recipientName: e.target.value })}
                  placeholder="Contact name" 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message Content</label>
              <Textarea 
                value={whatsappData.messageContent || ''} 
                onChange={(e) => setWhatsappData({ ...whatsappData, messageContent: e.target.value })}
                placeholder="Type your message..." 
                rows={6} 
              />
            </div>

            {whatsappData.messageType === 'DRAWING_APPROVAL_REQUEST' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Drawing ID</label>
                <Input 
                  value={whatsappData.drawingId || ''} 
                  onChange={(e) => setWhatsappData({ ...whatsappData, drawingId: e.target.value })}
                  placeholder="Drawing reference" 
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWhatsAppModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={sendWhatsAppMessage}
              disabled={!whatsappData.messageType || !whatsappData.recipientPhone || !whatsappData.messageContent}
            >
              <Send className="h-4 w-4 mr-2" />
              Send WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Teams Message Modal */}
      <Dialog open={showTeamsModal} onOpenChange={setShowTeamsModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Send Teams Message
            </DialogTitle>
            <DialogDescription>
              Send messages and notifications to Microsoft Teams channels
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Channel Type</label>
              <Select 
                value={teamsData.channelType || ''} 
                onValueChange={(value) => setTeamsData({ ...teamsData, channelType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WORKFLOW_UPDATES">Workflow Updates</SelectItem>
                  <SelectItem value="VARIATION_REQUESTS">Variation Requests</SelectItem>
                  <SelectItem value="CUSTOMER_COMMUNICATIONS">Customer Communications</SelectItem>
                  <SelectItem value="APPROVALS">Approvals</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Message Type</label>
                <Input 
                  value={teamsData.messageType || ''} 
                  onChange={(e) => setTeamsData({ ...teamsData, messageType: e.target.value })}
                  placeholder="workflow_update, variation_request, etc." 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select 
                  value={teamsData.priority || 'MEDIUM'} 
                  onValueChange={(value) => setTeamsData({ ...teamsData, priority: value })}
                >
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
              <label className="text-sm font-medium mb-2 block">Message Content</label>
              <Textarea 
                value={teamsData.messageContent || ''} 
                onChange={(e) => setTeamsData({ ...teamsData, messageContent: e.target.value })}
                placeholder="Type your Teams message..." 
                rows={6} 
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mentions (Optional)</label>
              <Input 
                value={teamsData.mentions?.join(', ') || ''} 
                onChange={(e) => setTeamsData({ ...teamsData, mentions: e.target.value.split(', ').filter(Boolean) })}
                placeholder="@user1, @user2, @channel" 
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTeamsModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={sendTeamsMessage}
              disabled={!teamsData.channelType || !teamsData.messageContent}
            >
              <Send className="h-4 w-4 mr-2" />
              Send to Teams
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Portal Promotion Modal */}
      <Dialog open={showPortalPromoModal} onOpenChange={setShowPortalPromoModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-purple-600" />
              Promote Customer Portal
            </DialogTitle>
            <DialogDescription>
              Send customer portal promotions with demo access
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Promotion Method</label>
              <Select 
                value={portalPromoData.method || ''} 
                onValueChange={(value) => setPortalPromoData({ ...portalPromoData, method: value })}
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
              <Textarea 
                value={portalPromoData.message || ''} 
                onChange={(e) => setPortalPromoData({ ...portalPromoData, message: e.target.value })}
                placeholder="Custom promotion message..." 
                rows={4} 
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={portalPromoData.includeDemo !== false}
                  onChange={(e) => setPortalPromoData({ ...portalPromoData, includeDemo: e.target.checked })}
                />
                <span className="text-sm">Include demo access link</span>
              </label>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">📱 Portal Features</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Track projects in real-time</li>
                <li>• Submit new enquiries</li>
                <li>• Approve drawings digitally</li>
                <li>• Access project documents</li>
                <li>• Communicate with our team</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPortalPromoModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={promotePortal}
              disabled={!portalPromoData.method}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Integration Configuration Modal */}
      <Dialog open={showIntegrationModal} onOpenChange={setShowIntegrationModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Configure Integration
            </DialogTitle>
            <DialogDescription>
              Set up and configure communication integrations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Integration Type</label>
              <Select 
                value={integrationData.type || ''} 
                onValueChange={(value) => setIntegrationData({ ...integrationData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select integration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WHATSAPP">WhatsApp Business</SelectItem>
                  <SelectItem value="TEAMS">Microsoft Teams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {integrationData.type === 'WHATSAPP' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Account ID</label>
                    <Input 
                      value={integrationData.businessAccountId || ''} 
                      onChange={(e) => setIntegrationData({ ...integrationData, businessAccountId: e.target.value })}
                      placeholder="WhatsApp Business Account ID" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone Number ID</label>
                    <Input 
                      value={integrationData.phoneNumberId || ''} 
                      onChange={(e) => setIntegrationData({ ...integrationData, phoneNumberId: e.target.value })}
                      placeholder="Phone Number ID" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Access Token</label>
                  <Input 
                    type="password" 
                    value={integrationData.accessToken || ''} 
                    onChange={(e) => setIntegrationData({ ...integrationData, accessToken: e.target.value })}
                    placeholder="WhatsApp Business API Access Token" 
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Webhook URL</label>
                  <Input 
                    value={integrationData.webhookUrl || ''} 
                    onChange={(e) => setIntegrationData({ ...integrationData, webhookUrl: e.target.value })}
                    placeholder="https://your-domain.com/api/whatsapp/webhook" 
                  />
                </div>
              </>
            )}

            {integrationData.type === 'TEAMS' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Team ID</label>
                    <Input 
                      value={integrationData.teamId || ''} 
                      onChange={(e) => setIntegrationData({ ...integrationData, teamId: e.target.value })}
                      placeholder="Microsoft Teams Team ID" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Channel ID</label>
                    <Input 
                      value={integrationData.channelId || ''} 
                      onChange={(e) => setIntegrationData({ ...integrationData, channelId: e.target.value })}
                      placeholder="Teams Channel ID" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Channel Name</label>
                  <Input 
                    value={integrationData.channelName || ''} 
                    onChange={(e) => setIntegrationData({ ...integrationData, channelName: e.target.value })}
                    placeholder="General, Workflow Updates, etc." 
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Webhook URL</label>
                  <Input 
                    value={integrationData.webhookUrl || ''} 
                    onChange={(e) => setIntegrationData({ ...integrationData, webhookUrl: e.target.value })}
                    placeholder="Teams Incoming Webhook URL" 
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIntegrationModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={configureIntegration}
              disabled={!integrationData.type}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-components
function CommunicationOverviewTab({ onSendWhatsApp, onSendTeams, onPromotePortal, onSendReminder }: any) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2 text-green-600" />
              WhatsApp Business
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Send drawing approvals, daily reminders, and project updates via WhatsApp
            </p>
            <div className="space-y-2">
              <Button onClick={onSendWhatsApp} className="w-full" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onSendReminder('drawing_approval')} 
                className="w-full" 
                size="sm"
              >
                <Bell className="h-4 w-4 mr-2" />
                Send Drawing Reminder
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Microsoft Teams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Send workflow updates, variation notifications, and team communications
            </p>
            <div className="space-y-2">
              <Button onClick={onSendTeams} className="w-full" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send to Teams
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Workflow Update
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-purple-600" />
              Customer Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Promote customer portal with demo access and onboarding
            </p>
            <div className="space-y-2">
              <Button onClick={onPromotePortal} className="w-full" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Promote Portal
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                Generate Demo Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Communication Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-16 flex-col space-y-1">
              <Smartphone className="h-5 w-5" />
              <span className="text-xs">Drawing Approval</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-1">
              <Bell className="h-5 w-5" />
              <span className="text-xs">Daily Reminder</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-1">
              <Users className="h-5 w-5" />
              <span className="text-xs">Teams Update</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-1">
              <Monitor className="h-5 w-5" />
              <span className="text-xs">Portal Demo</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WhatsAppTab({ messages, onSendMessage, onSendReminder }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">WhatsApp Business Messages</h3>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onSendReminder('drawing_approval')}>
            <Bell className="h-4 w-4 mr-2" />
            Send Reminder
          </Button>
          <Button onClick={onSendMessage}>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((message: WhatsAppMessage) => (
          <Card key={message.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{message.messageType}</Badge>
                    <Badge 
                      variant={message.status === 'DELIVERED' ? 'default' : 
                              message.status === 'FAILED' ? 'destructive' : 'secondary'}
                    >
                      {message.status}
                    </Badge>
                  </div>
                  <p className="font-medium">{message.recipientName}</p>
                  <p className="text-sm text-muted-foreground">{message.recipientPhone}</p>
                  <p className="text-sm">{message.messageContent}</p>
                  {message.sentAt && (
                    <p className="text-xs text-muted-foreground">
                      Sent: {new Date(message.sentAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {message.status === 'DELIVERED' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {message.status === 'FAILED' && <XCircle className="h-5 w-5 text-red-600" />}
                  {message.status === 'PENDING' && <Clock className="h-5 w-5 text-yellow-600" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No WhatsApp messages sent yet</p>
                <p className="text-sm">Start by sending your first message</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TeamsTab({ messages, onSendMessage }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Microsoft Teams Messages</h3>
        <Button onClick={onSendMessage}>
          <Send className="h-4 w-4 mr-2" />
          Send to Teams
        </Button>
      </div>

      <div className="space-y-4">
        {messages.map((message: TeamsMessage) => (
          <Card key={message.id}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{message.messageType}</Badge>
                  <Badge 
                    variant={message.priority === 'URGENT' ? 'destructive' : 
                            message.priority === 'HIGH' ? 'default' : 'secondary'}
                  >
                    {message.priority}
                  </Badge>
                  <Badge variant="outline">{message.status}</Badge>
                </div>
                <p className="text-sm font-medium">{message.channelName}</p>
                <p className="text-sm">{message.messageContent}</p>
                {message.mentions && message.mentions.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Mentions: {message.mentions.join(', ')}
                  </p>
                )}
                {message.sentAt && (
                  <p className="text-xs text-muted-foreground">
                    Sent: {new Date(message.sentAt).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No Teams messages sent yet</p>
                <p className="text-sm">Start by sending your first Teams message</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function PortalPromotionTab({ onPromotePortal }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-purple-600" />
            Customer Portal Promotion
          </CardTitle>
          <CardDescription>
            Promote the customer portal and increase demo usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Portal Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time project tracking</li>
                <li>• Digital drawing approvals</li>
                <li>• Document access</li>
                <li>• Direct communication</li>
                <li>• New enquiry submissions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Promotion Channels</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Email</Badge>
                <Badge variant="outline">WhatsApp</Badge>
                <Badge variant="outline">SMS</Badge>
                <Badge variant="outline">In-person</Badge>
              </div>
            </div>
          </div>
          <Button onClick={onPromotePortal} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send Portal Promotion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CommunicationAnalyticsTab({ whatsappMessages, teamsMessages }: any) {
  const totalMessages = whatsappMessages.length + teamsMessages.length;
  const deliveredMessages = whatsappMessages.filter((m: WhatsAppMessage) => m.status === 'DELIVERED').length;
  const deliveryRate = totalMessages > 0 ? Math.round((deliveredMessages / totalMessages) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalMessages}</p>
              <p className="text-sm text-muted-foreground">Total Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{deliveredMessages}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{deliveryRate}%</p>
              <p className="text-sm text-muted-foreground">Delivery Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">85%</p>
              <p className="text-sm text-muted-foreground">Portal Conversion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Communication Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">WhatsApp Messages</span>
                <span className="text-sm text-muted-foreground">{whatsappMessages.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${totalMessages > 0 ? (whatsappMessages.length / totalMessages) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Teams Messages</span>
                <span className="text-sm text-muted-foreground">{teamsMessages.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${totalMessages > 0 ? (teamsMessages.length / totalMessages) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
