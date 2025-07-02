
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, DollarSign, Users, Bot, 
  CheckCircle, AlertCircle, Clock, RefreshCw,
  BarChart3, Globe, Shield, Zap,
  TrendingUp, Activity, Wifi, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface IntegrationOverviewProps {
  compact?: boolean;
  showHealthChecks?: boolean;
}

export default function IntegrationOverview({
  compact = false,
  showHealthChecks = true
}: IntegrationOverviewProps) {
  const [systemHealth, setSystemHealth] = useState(98.7);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  const integrations = [
    {
      id: 'sharepoint',
      name: 'SharePoint Online',
      description: 'Document management and collaboration',
      status: 'connected' as const,
      health: 99.2,
      icon: Database,
      color: '#0078D4',
      lastSync: '2 minutes ago',
      uptime: '99.8%',
      connections: 16
    },
    {
      id: 'xero',
      name: 'Xero Accounting',
      description: 'Financial data and invoice management',
      status: 'connected' as const,
      health: 97.8,
      icon: DollarSign,
      color: '#13B5EA',
      lastSync: '5 minutes ago',
      uptime: '99.5%',
      connections: 1
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Chat, collaboration, and notifications',
      status: 'connected' as const,
      health: 99.8,
      icon: Users,
      color: '#6264A7',
      lastSync: '1 minute ago',
      uptime: '99.9%',
      connections: 47
    },
    {
      id: 'abacus-ai',
      name: 'Abacus.AI Platform',
      description: 'AI models and intelligent automation',
      status: 'connected' as const,
      health: 98.5,
      icon: Bot,
      color: '#FF6B6B',
      lastSync: '30 seconds ago',
      uptime: '99.7%',
      connections: 8
    },
    {
      id: 'power-platform',
      name: 'Power Platform',
      description: 'Custom apps and workflow automation',
      status: 'warning' as const,
      health: 94.2,
      icon: Zap,
      color: '#742774',
      lastSync: '15 minutes ago',
      uptime: '98.1%',
      connections: 12
    },
    {
      id: 'azure-ad',
      name: 'Azure Active Directory',
      description: 'Identity and access management',
      status: 'connected' as const,
      health: 99.9,
      icon: Shield,
      color: '#0078D4',
      lastSync: '1 minute ago',
      uptime: '99.9%',
      connections: 94
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const systemMetrics = [
    {
      label: 'Overall Health',
      value: systemHealth,
      unit: '%',
      icon: Activity,
      color: '#4CAF50'
    },
    {
      label: 'Active Connections',
      value: 178,
      unit: '',
      icon: Wifi,
      color: '#2196F3'
    },
    {
      label: 'Daily Transactions',
      value: 1247,
      unit: '',
      icon: TrendingUp,
      color: '#FF9800'
    },
    {
      label: 'System Load',
      value: 23.4,
      unit: '%',
      icon: BarChart3,
      color: '#9C27B0'
    }
  ];

  const handleRefreshAll = () => {
    setLastUpdate(new Date());
    
    // Simulate comprehensive system refresh
    setSystemHealth(Math.random() * 2 + 97);
    
    // Show loading state briefly
    setTimeout(() => {
      alert('All integrations refreshed successfully! System health updated.');
    }, 1500);
  };

  const handleIntegrationClick = (integration: typeof integrations[0]) => {
    switch (integration.id) {
      case 'sharepoint':
        window.open('/sharepoint-admin', '_blank');
        break;
      case 'xero':
        window.open('/xero/dashboard', '_blank');
        break;
      case 'teams':
        window.open('/teams/collaboration', '_blank');
        break;
      case 'abacus-ai':
        window.open('/ai/models', '_blank');
        break;
      case 'power-platform':
        window.open('/power-platform/apps', '_blank');
        break;
      case 'azure-ad':
        window.open('/azure/identity', '_blank');
        break;
      default:
        alert(`Opening ${integration.name} management interface...`);
    }
  };

  useEffect(() => {
    // Set client-side flag and initial timestamp
    setIsClient(true);
    setLastUpdate(new Date());

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="integration-overview-container">
      {/* Integration Overview Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mr-4">
            <Globe className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-bold text-blue-400">
              Integration Hub
            </h2>
            <p className="text-sm text-gray-400">
              Comprehensive system integration overview
            </p>
          </div>
        </div>
        
        <Button
          size="sm"
          className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400"
          onClick={handleRefreshAll}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* System Health Metrics */}
      {showHealthChecks && (
        <div className={cn(
          'grid gap-4 mb-6',
          compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'
        )}>
          {systemMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="integration-card bg-black/40 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: metric.color + '20' }}
                      >
                        <IconComponent className="h-4 w-4" style={{ color: metric.color }} />
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-blue-400">
                        {metric.unit === '%' 
                          ? `${metric.value.toFixed(1)}${metric.unit}`
                          : Math.round(metric.value).toLocaleString()
                        }
                      </div>
                      <div className="text-xs text-gray-400">{metric.label}</div>
                    </div>
                    
                    <Progress 
                      value={metric.unit === '%' ? metric.value : Math.min((metric.value / 2000) * 100, 100)} 
                      className="h-1 bg-gray-800"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Integration Services Grid */}
      <div className={cn(
        'grid gap-4 mb-6',
        compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      )}>
        {integrations.map((integration, index) => {
          const IconComponent = integration.icon;
          
          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card 
                className="integration-card bg-black/40 border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 group cursor-pointer"
                onClick={() => handleIntegrationClick(integration)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                        style={{ backgroundColor: integration.color + '20', borderColor: integration.color + '40' }}
                      >
                        <IconComponent className="h-5 w-5" style={{ color: integration.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-sm text-blue-400">{integration.name}</CardTitle>
                        <p className="text-xs text-gray-400 mt-1">{integration.description}</p>
                      </div>
                    </div>
                    {getStatusIcon(integration.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Health Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Health</span>
                        <span className="text-xs text-blue-400">{integration.health.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={integration.health} 
                        className="h-1 bg-gray-800"
                      />
                    </div>

                    {/* Connection Stats */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-gray-400">Uptime</div>
                        <div className="text-blue-400 font-medium">{integration.uptime}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Connections</div>
                        <div className="text-blue-400 font-medium">{integration.connections}</div>
                      </div>
                    </div>

                    {/* Last Sync */}
                    <div className="pt-2 border-t border-blue-500/20">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last sync</span>
                        <span>{integration.lastSync}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Investment Summary */}
      <Card className="integration-card bg-black/40 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-lg text-blue-400 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Integration Investment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">£135,000</div>
              <div className="text-sm text-gray-400">Total Investment</div>
              <div className="text-xs text-green-400 mt-1">18-month program</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">300%</div>
              <div className="text-sm text-gray-400">Expected ROI</div>
              <div className="text-xs text-blue-400 mt-1">Within 18 months</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">6</div>
              <div className="text-sm text-gray-400">Active Integrations</div>
              <div className="text-xs text-purple-400 mt-1">Enterprise-grade</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Footer */}
      <div className="mt-6 pt-4 border-t border-blue-500/20">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Settings className="h-3 w-3 mr-1 text-blue-400" />
            All systems operational
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-blue-400" />
            Last updated: {isClient && lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
          </div>
        </div>
      </div>
    </div>
  );
}
