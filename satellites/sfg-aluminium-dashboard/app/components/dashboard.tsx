
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Zap, 
  FileText, 
  Brain,
  Calendar,
  Filter
} from 'lucide-react';
import { KPICard } from '@/components/kpi-card';
import { FinancialChart } from '@/components/financial-chart';
import { AIUsageChart } from '@/components/ai-usage-chart';
import { AnalyticsChart } from '@/components/analytics-chart';

export function Dashboard() {
  const [dateRange, setDateRange] = useState('30d');
  const [kpiData, setKpiData] = useState({
    revenue: 0,
    efficiency: 0,
    documentsProcessed: 0,
    activeModels: 0
  });

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/dashboard?range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setKpiData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback data for demo
      setKpiData({
        revenue: 2847500,
        efficiency: 94.2,
        documentsProcessed: 1847,
        activeModels: 4
      });
    }
  };

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Command Center</h1>
          <p className="text-gray-400 mt-1">Real-time business intelligence dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/20">
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 neon-glow"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={`$${(kpiData.revenue / 1000000).toFixed(2)}M`}
          change="+12.5%"
          icon={DollarSign}
          trend="up"
        />
        <KPICard
          title="Production Efficiency"
          value={`${kpiData.efficiency}%`}
          change="+2.1%"
          icon={Zap}
          trend="up"
        />
        <KPICard
          title="Documents Processed"
          value={kpiData.documentsProcessed.toLocaleString()}
          change="+18.2%"
          icon={FileText}
          trend="up"
        />
        <KPICard
          title="Active AI Models"
          value={kpiData.activeModels.toString()}
          change="100%"
          icon={Brain}
          trend="stable"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Financial Performance
            </CardTitle>
            <CardDescription className="text-gray-400">
              Revenue vs Expenses over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialChart dateRange={dateRange} />
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              AI Model Usage
            </CardTitle>
            <CardDescription className="text-gray-400">
              Distribution of AI model requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIUsageChart />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Chart */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Business Intelligence Analytics
          </CardTitle>
          <CardDescription className="text-gray-400">
            Key performance indicators and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsChart />
        </CardContent>
      </Card>
    </div>
  );
}
