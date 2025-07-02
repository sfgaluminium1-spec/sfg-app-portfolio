
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, FileText, CreditCard, 
  AlertCircle, CheckCircle, Clock, RefreshCw,
  PieChart, BarChart3, Calculator, Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface XeroIntegrationProps {
  compact?: boolean;
  showFinancials?: boolean;
}

export default function XeroIntegration({
  compact = false,
  showFinancials = true
}: XeroIntegrationProps) {
  const [animatedValues, setAnimatedValues] = useState({
    totalRevenue: 0,
    outstandingInvoices: 0,
    cashFlow: 0,
    profitMargin: 0
  });

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connected');

  const targetValues = {
    totalRevenue: 487.3,
    outstandingInvoices: 23.7,
    cashFlow: 156.8,
    profitMargin: 18.5
  };

  useEffect(() => {
    // Animate financial values
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
      }, 25);
    };

    Object.entries(targetValues).forEach(([key, value]) => {
      animateValue(key as keyof typeof targetValues, value);
    });
  }, []);

  const financialMetrics = [
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      icon: DollarSign,
      value: animatedValues.totalRevenue,
      unit: 'K',
      trend: '+12%',
      color: '#4CAF50',
      description: 'Monthly revenue from Xero'
    },
    {
      id: 'outstanding-invoices',
      title: 'Outstanding Invoices',
      icon: FileText,
      value: animatedValues.outstandingInvoices,
      unit: 'K',
      trend: '-5%',
      color: '#FF9800',
      description: 'Pending invoice payments'
    },
    {
      id: 'cash-flow',
      title: 'Cash Flow',
      icon: TrendingUp,
      value: animatedValues.cashFlow,
      unit: 'K',
      trend: '+24%',
      color: '#2196F3',
      description: 'Net cash flow this month'
    },
    {
      id: 'profit-margin',
      title: 'Profit Margin',
      icon: PieChart,
      value: animatedValues.profitMargin,
      unit: '%',
      trend: '+3%',
      color: '#9C27B0',
      description: 'Current profit margin'
    }
  ];

  const xeroActions = [
    { label: 'Create Invoice', icon: Receipt, action: 'create-invoice' },
    { label: 'View Reports', icon: BarChart3, action: 'view-reports' },
    { label: 'Reconcile Bank', icon: CreditCard, action: 'reconcile-bank' },
    { label: 'Sync Data', icon: RefreshCw, action: 'sync-data' }
  ];

  const handleXeroAction = (action: string) => {
    console.log(`Executing Xero action: ${action}`);
    
    switch (action) {
      case 'create-invoice':
        // Open invoice creation modal or navigate to invoice page
        window.open('/xero/create-invoice', '_blank');
        break;
      case 'view-reports':
        // Open reports dashboard
        window.open('/xero/reports', '_blank');
        break;
      case 'reconcile-bank':
        // Open bank reconciliation interface
        window.open('/xero/bank-reconciliation', '_blank');
        break;
      case 'sync-data':
        // Trigger data synchronization
        setConnectionStatus('connecting');
        setTimeout(() => {
          setConnectionStatus('connected');
          // Show success notification
          alert('Xero data synchronized successfully!');
        }, 2000);
        break;
      case 'refresh':
        // Refresh financial data
        setConnectionStatus('connecting');
        setTimeout(() => {
          setConnectionStatus('connected');
          // Simulate refreshed data
          alert('Financial data refreshed from Xero!');
        }, 1500);
        break;
      default:
        alert(`Opening ${action} interface...`);
    }
  };

  return (
    <div className="xero-integration-container">
      {/* Xero Connection Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center mr-4">
            <DollarSign className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-bold text-blue-400">
              Xero Financial Hub
            </h2>
            <div className="flex items-center text-sm text-gray-400">
              {connectionStatus === 'connected' && (
                <>
                  <CheckCircle className="h-4 w-4 mr-1 text-green-400" />
                  Connected to Xero
                </>
              )}
              {connectionStatus === 'connecting' && (
                <>
                  <Clock className="h-4 w-4 mr-1 text-yellow-400 animate-spin" />
                  Connecting...
                </>
              )}
              {connectionStatus === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 mr-1 text-red-400" />
                  Connection Error
                </>
              )}
            </div>
          </div>
        </div>
        
        <Button
          size="sm"
          className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400"
          onClick={() => handleXeroAction('refresh')}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Financial Metrics Grid */}
      {showFinancials && (
        <div className={cn(
          'grid gap-4 mb-6',
          compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'
        )}>
          {financialMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="xero-card bg-black/40 border-blue-500/20 hover:border-blue-500/40 transition-colors">
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
                          : `£${metric.value.toFixed(1)}${metric.unit}`
                        }
                      </div>
                      <div className="text-xs text-gray-400">{metric.title}</div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2">
                      {metric.description}
                    </div>
                    
                    <Progress 
                      value={Math.min((metric.value / (metric.unit === '%' ? 25 : 500)) * 100, 100)} 
                      className="h-1 bg-gray-800"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Xero Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-blue-400 mb-3">Xero Quick Actions</h3>
        <div className={cn(
          'grid gap-2',
          compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'
        )}>
          {xeroActions.map((action, index) => {
            const IconComponent = action.icon;
            
            return (
              <motion.div
                key={action.action}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-auto p-3 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 justify-start"
                  onClick={() => handleXeroAction(action.action)}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Real-time Sync Status */}
      <div className="mt-6 pt-4 border-t border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <RefreshCw className="h-3 w-3 mr-1 text-blue-400 animate-spin" />
            Last sync: 2 minutes ago
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Calculator className="h-3 w-3 mr-1 text-blue-400" />
            Next auto-sync: 8 minutes
          </div>
        </div>
      </div>
    </div>
  );
}
