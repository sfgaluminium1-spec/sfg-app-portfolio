
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Folder, Users, Activity, 
  TrendingUp, BarChart3, Clock, CheckCircle,
  AlertTriangle, RefreshCw, Database, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SharePointAnalyticsProps {
  compact?: boolean;
  showDetails?: boolean;
}

export default function SharePointAnalytics({
  compact = false,
  showDetails = true
}: SharePointAnalyticsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    totalDocuments: 0,
    activeUsers: 0,
    weeklyActivity: 0,
    storageUsed: 0
  });

  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  const targetValues = {
    totalDocuments: 2847,
    activeUsers: 47,
    weeklyActivity: 156,
    storageUsed: 78.5
  };

  useEffect(() => {
    // Animate analytics values
    const animateValue = (key: keyof typeof targetValues, target: number) => {
      const increment = target / 100;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({ ...prev, [key]: current }));
      }, 30);
    };

    Object.entries(targetValues).forEach(([key, value]) => {
      animateValue(key as keyof typeof targetValues, value);
    });
  }, []);

  const analyticsMetrics = [
    {
      id: 'total-documents',
      title: 'Total Documents',
      icon: FileText,
      value: animatedValues.totalDocuments,
      unit: '',
      trend: '+15%',
      color: '#4CAF50',
      description: 'Documents across all libraries'
    },
    {
      id: 'active-users',
      title: 'Active Users',
      icon: Users,
      value: animatedValues.activeUsers,
      unit: '',
      trend: '+8%',
      color: '#2196F3',
      description: 'Users active this week'
    },
    {
      id: 'weekly-activity',
      title: 'Weekly Activity',
      icon: Activity,
      value: animatedValues.weeklyActivity,
      unit: '',
      trend: '+23%',
      color: '#FF9800',
      description: 'Document interactions'
    },
    {
      id: 'storage-used',
      title: 'Storage Used',
      icon: Database,
      value: animatedValues.storageUsed,
      unit: '%',
      trend: '+5%',
      color: '#9C27B0',
      description: 'Of allocated storage'
    }
  ];

  const topLibraries = [
    { name: 'Innovation Hub Portal', documents: 423, activity: 'High' },
    { name: 'Financial Records', documents: 387, activity: 'Medium' },
    { name: 'R&D Workspace', documents: 256, activity: 'High' },
    { name: 'Project Documents', documents: 198, activity: 'Medium' },
    { name: 'Warren Executive', documents: 167, activity: 'Low' }
  ];

  const recentActivity = [
    { action: 'Document uploaded', file: 'Q4_Financial_Report.pdf', user: 'Warren H.', time: '2m ago' },
    { action: 'Folder created', file: 'New Innovation Project', user: 'Yanika D.', time: '15m ago' },
    { action: 'Document edited', file: 'Strategy_Roadmap.docx', user: 'Sarah M.', time: '1h ago' },
    { action: 'Permission granted', file: 'Executive Dashboard', user: 'Admin', time: '2h ago' }
  ];

  const handleRefreshData = () => {
    setSyncStatus('syncing');
    
    // Simulate data refresh with animated value updates
    setTimeout(() => {
      setSyncStatus('synced');
      
      // Update values with slight variations to show "refreshed" data
      const newValues = {
        totalDocuments: targetValues.totalDocuments + Math.floor(Math.random() * 50),
        activeUsers: targetValues.activeUsers + Math.floor(Math.random() * 10),
        weeklyActivity: targetValues.weeklyActivity + Math.floor(Math.random() * 20),
        storageUsed: Math.min(targetValues.storageUsed + Math.random() * 5, 95)
      };
      
      // Animate to new values
      Object.entries(newValues).forEach(([key, value]) => {
        const animateValue = (currentKey: keyof typeof targetValues, target: number) => {
          const increment = (target - animatedValues[currentKey]) / 20;
          let current = animatedValues[currentKey];
          const timer = setInterval(() => {
            current += increment;
            if (Math.abs(current - target) < Math.abs(increment)) {
              current = target;
              clearInterval(timer);
            }
            setAnimatedValues(prev => ({ ...prev, [currentKey]: current }));
          }, 50);
        };
        animateValue(key as keyof typeof targetValues, value);
      });
      
      alert('SharePoint analytics data refreshed successfully!');
    }, 2000);
  };

  return (
    <div className="sharepoint-analytics-container">
      {/* SharePoint Analytics Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center mr-4">
            <BarChart3 className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-bold text-blue-400">
              SharePoint Analytics
            </h2>
            <div className="flex items-center text-sm text-gray-400">
              {syncStatus === 'synced' && (
                <>
                  <CheckCircle className="h-4 w-4 mr-1 text-green-400" />
                  Real-time sync active
                </>
              )}
              {syncStatus === 'syncing' && (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 text-yellow-400 animate-spin" />
                  Syncing data...
                </>
              )}
              {syncStatus === 'error' && (
                <>
                  <AlertTriangle className="h-4 w-4 mr-1 text-red-400" />
                  Sync error
                </>
              )}
            </div>
          </div>
        </div>
        
        <Button
          size="sm"
          className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400"
          onClick={handleRefreshData}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Analytics Metrics Grid */}
      {showDetails && (
        <div className={cn(
          'grid gap-4 mb-6',
          compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'
        )}>
          {analyticsMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="sharepoint-card bg-black/40 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: metric.color + '20' }}
                      >
                        <IconComponent className="h-4 w-4" style={{ color: metric.color }} />
                      </div>
                      <span className="text-xs text-green-400">{metric.trend}</span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-blue-400">
                        {metric.unit === '%' 
                          ? `${metric.value.toFixed(1)}${metric.unit}`
                          : Math.round(metric.value).toLocaleString()
                        }
                      </div>
                      <div className="text-xs text-gray-400">{metric.title}</div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2">
                      {metric.description}
                    </div>
                    
                    <Progress 
                      value={metric.unit === '%' ? metric.value : Math.min((metric.value / 3000) * 100, 100)} 
                      className="h-1 bg-gray-800"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Library Analytics and Recent Activity */}
      <div className={cn(
        'grid gap-6',
        compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
      )}>
        {/* Top Libraries */}
        <Card className="sharepoint-card bg-black/40 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-400 flex items-center">
              <Folder className="h-5 w-5 mr-2" />
              Top Libraries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLibraries.map((library, index) => (
                <motion.div
                  key={library.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                >
                  <div>
                    <div className="text-sm font-medium text-blue-300">{library.name}</div>
                    <div className="text-xs text-gray-400">{library.documents} documents</div>
                  </div>
                  <div className={cn(
                    'px-2 py-1 rounded-full text-xs',
                    library.activity === 'High' ? 'bg-green-500/20 text-green-400' :
                    library.activity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  )}>
                    {library.activity}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="sharepoint-card bg-black/40 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-400 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-blue-500/5"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-blue-300">
                      <span className="font-medium">{activity.action}</span>
                      <span className="text-gray-400 ml-1">{activity.file}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-between mt-1">
                      <span>by {activity.user}</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status Footer */}
      <div className="mt-6 pt-4 border-t border-blue-500/20">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Database className="h-3 w-3 mr-1 text-blue-400" />
            Connected to 16 SharePoint libraries
          </div>
          <div className="flex items-center">
            <Search className="h-3 w-3 mr-1 text-blue-400" />
            Last indexed: 5 minutes ago
          </div>
        </div>
      </div>
    </div>
  );
}
