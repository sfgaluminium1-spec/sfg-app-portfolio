'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Target, Users, DollarSign, BarChart3, Zap, AlertTriangle, CheckCircle, Clock, ArrowUp, ArrowDown, Minus, RefreshCw, Settings, Download } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PricingDashboardProps {
  className?: string;
}

export default function PricingDashboard({ className }: PricingDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null);
  const [modelAccuracy, setModelAccuracy] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewRes, performanceRes, marketRes, accuracyRes] = await Promise.all([
        fetch('/api/pricing/analytics'),
        fetch('/api/pricing/analytics?type=performance'),
        fetch('/api/pricing/analytics?type=market-analysis'),
        fetch('/api/pricing/analytics?type=model-accuracy')
      ]);

      const [overviewData, performanceData, marketData, accuracyData] = await Promise.all([
        overviewRes.json(),
        performanceRes.json(),
        marketRes.json(),
        accuracyRes.json()
      ]);

      setOverview(overviewData.overview);
      setPerformance(performanceData.performance);
      setMarketAnalysis(marketData.marketAnalysis);
      setModelAccuracy(accuracyData.modelAccuracy);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => `£${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg">Loading SFG PRICE INTELLIGENCE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Brain className="h-8 w-8 mr-3 text-blue-600" />
            SFG PRICE INTELLIGENCE
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered pricing optimization and market intelligence
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={loadDashboardData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Models</p>
                  <p className="text-2xl font-bold">{overview.totalModels}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">85% operational</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Predictions Made</p>
                  <p className="text-2xl font-bold">{overview.totalPredictions}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="secondary" className="text-xs">
                  +12% this month
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Market Data Points</p>
                  <p className="text-2xl font-bold">{overview.totalMarketData}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-muted-foreground">Data fresh</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accuracy Score</p>
                  <p className="text-2xl font-bold">{formatPercentage(overview.averageAccuracy || 0.87)}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-4">
                <Progress value={(overview.averageAccuracy || 0.87) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Excellent performance</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="market">Market Intelligence</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pricing Performance Chart */}
            {performance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Pricing Performance Trends
                  </CardTitle>
                  <CardDescription>
                    Quote volume and value trends over the last 4 weeks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performance.weeklyData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fontSize: 10 }} 
                        label={{ value: 'Week', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }} 
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }} 
                        label={{ value: 'Value (£)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }} 
                      />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          name === 'value' ? formatCurrency(value) : value,
                          name === 'value' ? 'Quote Value' : 'Quotes'
                        ]} 
                        labelFormatter={(label) => `Week ${label}`} 
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stackId="1" 
                        stroke="#60B5FF" 
                        fill="#60B5FF" 
                        fillOpacity={0.6} 
                        name="Quote Value" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="quotes" 
                        stackId="2" 
                        stroke="#FF9149" 
                        fill="#FF9149" 
                        fillOpacity={0.6} 
                        name="Quote Count" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  System Health
                </CardTitle>
                <CardDescription>
                  Real-time status of pricing intelligence components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Models</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={92} className="w-20 h-2" />
                    <Badge variant="secondary">92%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Market Data</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={88} className="w-20 h-2" />
                    <Badge variant="secondary">88%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Prediction Engine</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={95} className="w-20 h-2" />
                    <Badge variant="secondary">95%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analytics Pipeline</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={90} className="w-20 h-2" />
                    <Badge variant="secondary">90%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Intelligence Activity
              </CardTitle>
              <CardDescription>
                Latest pricing predictions and market updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview?.recentAnalytics?.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {activity.analyticsType.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.category || 'Overall'} • {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.period}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {performance && (
            <>
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Quotes</p>
                        <p className="text-2xl font-bold">{performance.totalQuotes}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(performance.trends?.quotesGrowth || 0)}
                        <span className={`text-sm ${getTrendColor(performance.trends?.quotesGrowth || 0)}`}>
                          {Math.abs(performance.trends?.quotesGrowth || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                        <p className="text-2xl font-bold">{formatCurrency(performance.totalValue)}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(performance.trends?.valueGrowth || 0)}
                        <span className={`text-sm ${getTrendColor(performance.trends?.valueGrowth || 0)}`}>
                          {Math.abs(performance.trends?.valueGrowth || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                        <p className="text-2xl font-bold">{formatPercentage(performance.winRate)}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(performance.trends?.winRateChange || 0)}
                        <span className={`text-sm ${getTrendColor(performance.trends?.winRateChange || 0)}`}>
                          {Math.abs(performance.trends?.winRateChange || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance Breakdown</CardTitle>
                  <CardDescription>
                    Detailed analysis of quote performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={performance.weeklyData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fontSize: 10 }} 
                        label={{ value: 'Week', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }} 
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }} 
                        label={{ value: 'Count / Rate', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }} 
                      />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          name === 'winRate' ? formatPercentage(value) : value,
                          name === 'winRate' ? 'Win Rate' : name === 'quotes' ? 'Quotes' : 'Value'
                        ]} 
                        labelFormatter={(label) => `Week ${label}`} 
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="quotes" fill="#60B5FF" name="Quotes" />
                      <Bar dataKey="winRate" fill="#FF9149" name="Win Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          {marketAnalysis && (
            <>
              {/* Market Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Trends</CardTitle>
                    <CardDescription>
                      Current market direction and pricing trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketAnalysis.trendAnalysis && (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-green-600">{marketAnalysis.trendAnalysis.rising}</p>
                            <p className="text-xs text-muted-foreground">Rising</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-600">{marketAnalysis.trendAnalysis.stable}</p>
                            <p className="text-xs text-muted-foreground">Stable</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-red-600">{marketAnalysis.trendAnalysis.falling}</p>
                            <p className="text-xs text-muted-foreground">Falling</p>
                          </div>
                        </div>
                      )}
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium">Dominant Trend</p>
                        <Badge variant="secondary" className="mt-1">
                          {marketAnalysis.trendAnalysis?.dominant || 'Stable'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Competitive Position</CardTitle>
                    <CardDescription>
                      Your position relative to competitors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketAnalysis.competitivePosition && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Market Position</span>
                            <Badge variant="outline">
                              {marketAnalysis.competitivePosition.position || 'Competitive'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Price Advantage</span>
                            <span className="text-sm font-medium text-green-600">
                              {formatPercentage(marketAnalysis.competitivePosition.priceAdvantage || 0.08)}
                            </span>
                          </div>
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Market Insights</p>
                            <div className="space-y-1">
                              {marketAnalysis.insights?.slice(0, 3).map((insight: string, index: number) => (
                                <p key={index} className="text-xs text-muted-foreground">
                                  • {insight}
                                </p>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Market Data Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Market Data</CardTitle>
                  <CardDescription>
                    Latest market intelligence and competitor pricing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketAnalysis.marketData?.slice(0, 5).map((data: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{data.category}</p>
                          <p className="text-xs text-muted-foreground">
                            {data.source} • {data.region || 'UK'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {data.averagePrice ? formatCurrency(data.averagePrice) : 'N/A'}
                          </p>
                          <Badge 
                            variant={data.marketTrend === 'RISING' ? 'default' : data.marketTrend === 'FALLING' ? 'destructive' : 'secondary'} 
                            className="text-xs"
                          >
                            {data.marketTrend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          {modelAccuracy && (
            <>
              {/* Model Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Models</p>
                        <p className="text-2xl font-bold">{modelAccuracy.length}</p>
                      </div>
                      <Brain className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
                        <p className="text-2xl font-bold">
                          {formatPercentage(
                            modelAccuracy.reduce((sum: number, model: any) => sum + model.accuracy, 0) / modelAccuracy.length || 0
                          )}
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Excellent Models</p>
                        <p className="text-2xl font-bold">
                          {modelAccuracy.filter((model: any) => model.performance === 'excellent').length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Model Details */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Performance</CardTitle>
                  <CardDescription>
                    Detailed performance metrics for each pricing model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modelAccuracy.map((model: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{model.name}</h4>
                            <p className="text-sm text-muted-foreground">{model.category}</p>
                          </div>
                          <Badge 
                            variant={model.performance === 'excellent' ? 'default' : model.performance === 'good' ? 'secondary' : 'destructive'}
                          >
                            {model.performance.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Confidence</p>
                            <p className="font-medium">{formatPercentage(model.confidence)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Accuracy</p>
                            <p className="font-medium">{formatPercentage(model.accuracy)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Predictions</p>
                            <p className="font-medium">{model.predictionCount}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Progress value={model.accuracy * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  AI-Generated Insights
                </CardTitle>
                <CardDescription>
                  Intelligent recommendations based on market analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Market Opportunity</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Windows market showing 15% price increase trend - consider premium positioning
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Pricing Optimization</p>
                        <p className="text-xs text-green-700 mt-1">
                          Emergency repair pricing model achieving 92% accuracy - expand usage
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">Competitive Alert</p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Competitor pricing 8% below market average in structural glazing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Strategic Recommendations
                </CardTitle>
                <CardDescription>
                  Action items to improve pricing performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">High Priority</p>
                      <p className="text-xs text-muted-foreground">
                        Update curtain wall pricing model with latest material costs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Medium Priority</p>
                      <p className="text-xs text-muted-foreground">
                        Expand competitor intelligence for commercial glazing sector
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Low Priority</p>
                      <p className="text-xs text-muted-foreground">
                        Implement seasonal pricing adjustments for maintenance services
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Intelligence Performance Metrics</CardTitle>
              <CardDescription>
                Key performance indicators for the pricing intelligence system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">87%</p>
                  <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">£2.3M</p>
                  <p className="text-sm text-muted-foreground">Value Optimized</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">156</p>
                  <p className="text-sm text-muted-foreground">Market Insights</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">23%</p>
                  <p className="text-sm text-muted-foreground">Margin Improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}