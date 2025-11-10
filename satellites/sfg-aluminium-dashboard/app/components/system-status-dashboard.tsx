
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Database, 
  Shield, 
  Brain, 
  ExternalLink,
  Activity,
  Clock,
  Users,
  Server
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemStatus {
  overall: {
    status: string;
    uptime: string;
    version: string;
    environment: string;
  };
  services: {
    database: {
      status: string;
      responseTime: string;
      connections: string;
    };
    authentication: {
      status: string;
      activeUsers: number;
      lastCheck: string;
    };
    api: {
      status: string;
      totalKeys: number;
      rateLimit: string;
      endpoints: string[];
    };
    ai: {
      status: string;
      models: string[];
      provider: string;
    };
  };
  integrations: {
    sfgKnowledgeAssistant: {
      status: string;
      modelId: string;
      lastHealthCheck: string;
      capabilities: string[];
    };
    logikal: {
      status: string;
      phase: string;
      progress: string;
      nextSteps: string[];
    };
    externalApps: {
      totalConnections: number;
      activeIntegrations: number;
      lastActivity: string;
    };
  };
  metrics: {
    last24Hours: {
      systemLogs: number;
      documentsProcessed: number;
      apiCalls: number;
      errorRate: string;
    };
    performance: {
      avgResponseTime: string;
      throughput: string;
      memoryUsage: string;
      diskUsage: string;
    };
  };
  alerts: any[];
  lastUpdated: string;
}

export default function SystemStatusDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchSystemStatus = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll create mock data since we need API key validation
      const mockStatus: SystemStatus = {
        overall: {
          status: 'operational',
          uptime: '99.9%',
          version: '1.0.0',
          environment: 'production'
        },
        services: {
          database: {
            status: 'healthy',
            responseTime: '< 50ms',
            connections: 'normal'
          },
          authentication: {
            status: 'operational',
            activeUsers: 3,
            lastCheck: new Date().toISOString()
          },
          api: {
            status: 'operational',
            totalKeys: 2,
            rateLimit: 'normal',
            endpoints: [
              '/api/external/dashboard-data',
              '/api/external/integration/sfg-assistant',
              '/api/external/integration/logikal',
              '/api/external/system-status'
            ]
          },
          ai: {
            status: 'configured',
            models: ['gpt-4.1-mini'],
            provider: 'Abacus.AI'
          }
        },
        integrations: {
          sfgKnowledgeAssistant: {
            status: 'ready',
            modelId: '16bba6251c',
            lastHealthCheck: new Date().toISOString(),
            capabilities: ['Q&A', 'Document Analysis', 'Knowledge Retrieval']
          },
          logikal: {
            status: 'setup_pending',
            phase: 'Phase 1 - Foundation',
            progress: '60%',
            nextSteps: ['File system mapping', 'Real-time sync setup']
          },
          externalApps: {
            totalConnections: 2,
            activeIntegrations: 1,
            lastActivity: new Date().toISOString()
          }
        },
        metrics: {
          last24Hours: {
            systemLogs: 45,
            documentsProcessed: 12,
            apiCalls: 856,
            errorRate: '0.1%'
          },
          performance: {
            avgResponseTime: '125ms',
            throughput: '100 req/min',
            memoryUsage: '65%',
            diskUsage: '40%'
          }
        },
        alerts: [],
        lastUpdated: new Date().toISOString()
      };

      setSystemStatus(mockStatus);
      setLastRefresh(new Date());
      toast.success('System status updated');
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      toast.error('Failed to fetch system status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
      case 'healthy':
      case 'ready':
      case 'configured':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'setup_pending':
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
      case 'down':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
      case 'healthy':
      case 'ready':
      case 'configured':
        return 'text-green-400';
      case 'setup_pending':
      case 'warning':
        return 'text-yellow-400';
      case 'error':
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (isLoading && !systemStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Status</h1>
          <p className="text-gray-400">
            Real-time monitoring of SFG Aluminium AI Brain system health
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button
            onClick={fetchSystemStatus}
            disabled={isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {systemStatus && getStatusIcon(systemStatus.overall.status)}
            Overall System Status
            <Badge className={`ml-auto ${getStatusColor(systemStatus?.overall.status || '')}`}>
              {systemStatus?.overall.status || 'Unknown'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{systemStatus?.overall.uptime}</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{systemStatus?.overall.version}</div>
              <div className="text-sm text-gray-400">Version</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{systemStatus?.overall.environment}</div>
              <div className="text-sm text-gray-400">Environment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{systemStatus?.alerts?.length || 0}</div>
              <div className="text-sm text-gray-400">Active Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Database
              {systemStatus && getStatusIcon(systemStatus.services.database.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Response Time</span>
                <span className="text-white">{systemStatus?.services.database.responseTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Connections</span>
                <span className="text-white">{systemStatus?.services.database.connections}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Authentication
              {systemStatus && getStatusIcon(systemStatus.services.authentication.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Users</span>
                <span className="text-white">{systemStatus?.services.authentication.activeUsers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span className={getStatusColor(systemStatus?.services.authentication.status || '')}>
                  {systemStatus?.services.authentication.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              API
              {systemStatus && getStatusIcon(systemStatus.services.api.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">API Keys</span>
                <span className="text-white">{systemStatus?.services.api.totalKeys}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rate Limit</span>
                <span className="text-white">{systemStatus?.services.api.rateLimit}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-400" />
              AI Services
              {systemStatus && getStatusIcon(systemStatus.services.ai.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Provider</span>
                <span className="text-white">{systemStatus?.services.ai.provider}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Models</span>
                <span className="text-white">{systemStatus?.services.ai.models?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-green-400" />
              SFG Knowledge Assistant
              {systemStatus && getStatusIcon(systemStatus.integrations.sfgKnowledgeAssistant.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Model ID</span>
                <span className="text-white font-mono text-xs">
                  {systemStatus?.integrations.sfgKnowledgeAssistant.modelId}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 text-sm">Capabilities:</span>
                <div className="flex flex-wrap gap-1">
                  {systemStatus?.integrations.sfgKnowledgeAssistant.capabilities.map((capability, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-green-500/30 text-green-400">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-yellow-400" />
              Logikal Integration
              {systemStatus && getStatusIcon(systemStatus.integrations.logikal.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Phase</span>
                  <span className="text-white">{systemStatus?.integrations.logikal.phase}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{systemStatus?.integrations.logikal.progress}</span>
                  </div>
                  <Progress 
                    value={parseInt(systemStatus?.integrations.logikal.progress?.replace('%', '') || '0')} 
                    className="h-2"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 text-sm">Next Steps:</span>
                <ul className="text-xs text-white space-y-1">
                  {systemStatus?.integrations.logikal.nextSteps.map((step, index) => (
                    <li key={index}>• {step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              External Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Connections</span>
                <span className="text-white">{systemStatus?.integrations.externalApps.totalConnections}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Integrations</span>
                <span className="text-white">{systemStatus?.integrations.externalApps.activeIntegrations}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Activity</span>
                <span className="text-white text-xs">
                  {systemStatus?.integrations.externalApps.lastActivity ? 
                    new Date(systemStatus.integrations.externalApps.lastActivity).toLocaleTimeString() : 
                    'N/A'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Last 24 Hours Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{systemStatus?.metrics.last24Hours.systemLogs}</div>
                <div className="text-sm text-gray-400">System Logs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{systemStatus?.metrics.last24Hours.documentsProcessed}</div>
                <div className="text-sm text-gray-400">Documents Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{systemStatus?.metrics.last24Hours.apiCalls}</div>
                <div className="text-sm text-gray-400">API Calls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{systemStatus?.metrics.last24Hours.errorRate}</div>
                <div className="text-sm text-gray-400">Error Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg Response Time</span>
                <span className="text-white">{systemStatus?.metrics.performance.avgResponseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Throughput</span>
                <span className="text-white">{systemStatus?.metrics.performance.throughput}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className="text-white">{systemStatus?.metrics.performance.memoryUsage}</span>
                </div>
                <Progress 
                  value={parseInt(systemStatus?.metrics.performance.memoryUsage?.replace('%', '') || '0')} 
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Disk Usage</span>
                  <span className="text-white">{systemStatus?.metrics.performance.diskUsage}</span>
                </div>
                <Progress 
                  value={parseInt(systemStatus?.metrics.performance.diskUsage?.replace('%', '') || '0')} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
