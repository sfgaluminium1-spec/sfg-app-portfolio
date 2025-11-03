'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Users, Target, DollarSign, AlertCircle, CheckCircle, RefreshCw, Filter } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface PricingAnalyticsProps {
  className?: string;
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

export default function PricingAnalytics({ className }: PricingAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState<any>(null);
  const [marginAnalysis, setMarginAnalysis] = useState<any>(null);
  const [customerInsights, setCustomerInsights] = useState<any>(null);
  const [competitiveIntelligence, setCompetitiveIntelligence] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('MONTHLY');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, selectedCategory]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        period: selectedPeriod,
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      });

      const [performanceRes, marginRes, customerRes, competitiveRes] = await Promise.all([
        fetch(`/api/pricing/analytics?type=performance&${params}`),
        fetch(`/api/pricing/analytics?type=margin-analysis&${params}`),
        fetch(`/api/pricing/analytics?type=customer-insights&${params}`),
        fetch(`/api/pricing/analytics?type=competitive-intelligence&${params}`)
      ]);

      const [performanceData, marginData, customerData, competitiveData] = await Promise.all([
        performanceRes.json(),
        marginRes.json(),
        customerRes.json(),
        competitiveRes.json()
      ]);

      setPerformance(performanceData.performance);
      setMarginAnalysis(marginData.marginAnalysis);
      setCustomerInsights(customerData.customerInsights);
      setCompetitiveIntelligence(competitiveData.competitiveIntelligence);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => `£${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
            Pricing Analytics
          </h2>
          <p className="text-muted-foreground">
            Deep insights into pricing performance and market dynamics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="QUARTERLY">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Windows">Windows</SelectItem>
              <SelectItem value="Doors">Doors</SelectItem>
              <SelectItem value="Structural">Structural</SelectItem>
              <SelectItem value="Glazing">Glazing</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadAnalyticsData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="margins">Margin Analysis</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="competitive">Competitive Intel</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {performance && (
            <>
              {/* Performance KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Quotes</p>
                        <p className="text-2xl font-bold">{performance.totalQuotes}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {selectedPeriod.toLowerCase()}
                      </Badge>
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
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">
                        Avg: {formatCurrency(performance.averageValue)}
                      </span>
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
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="mt-2">
                      <Badge variant={performance.winRate > 0.6 ? "default" : "secondary"} className="text-xs">
                        {performance.winRate > 0.6 ? "Excellent" : "Good"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                        <p className="text-2xl font-bold">
                          {performance.trends?.quotesGrowth > 0 ? '+' : ''}
                          {performance.trends?.quotesGrowth?.toFixed(1) || '0.0'}%
                        </p>
                      </div>
                      {performance.trends?.quotesGrowth > 0 ? (
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      ) : (
                        <TrendingDown className="h-8 w-8 text-red-600" />
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">
                        vs previous period
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Trends Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quote Volume Trends</CardTitle>
                    <CardDescription>
                      Weekly quote volume and value progression
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
                          label={{ value: 'Quotes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }} 
                        />
                        <Tooltip 
                          formatter={(value: any, name: string) => [value, name === 'quotes' ? 'Quotes' : 'Value']} 
                          labelFormatter={(label) => `Week ${label}`} 
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Area 
                          type="monotone" 
                          dataKey="quotes" 
                          stroke="#60B5FF" 
                          fill="#60B5FF" 
                          fillOpacity={0.6} 
                          name="Quotes" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Win Rate Analysis</CardTitle>
                    <CardDescription>
                      Success rate trends over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performance.weeklyData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="week" 
                          tick={{ fontSize: 10 }} 
                          label={{ value: 'Week', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }} 
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }} 
                          label={{ value: 'Win Rate', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }} 
                          domain={[0, 1]} 
                          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} 
                        />
                        <Tooltip 
                          formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Win Rate']} 
                          labelFormatter={(label) => `Week ${label}`} 
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Line 
                          type="monotone" 
                          dataKey="winRate" 
                          stroke="#FF9149" 
                          strokeWidth={3} 
                          dot={{ fill: '#FF9149', strokeWidth: 2, r: 4 }} 
                          name="Win Rate" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="margins" className="space-y-6">
          {marginAnalysis && (
            <>
              {/* Margin KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Predictions</p>
                        <p className="text-2xl font-bold">{marginAnalysis.totalPredictions}</p>
                      </div>
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
                        <p className="text-2xl font-bold">{formatPercentage(marginAnalysis.averageAccuracy)}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Margin Health</p>
                        <p className="text-2xl font-bold">Good</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Margin Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Margin Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of profit margins across predictions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: 'Low Margin (<15%)', value: marginAnalysis.marginDistribution?.low || 0, fill: '#FF6363' },
                            { name: 'Medium Margin (15-25%)', value: marginAnalysis.marginDistribution?.medium || 0, fill: '#FF9149' },
                            { name: 'High Margin (>25%)', value: marginAnalysis.marginDistribution?.high || 0, fill: '#72BF78' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[0, 1, 2].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Profitability Trends</CardTitle>
                    <CardDescription>
                      Monthly profitability analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={marginAnalysis.profitabilityTrends || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: 10 }} 
                          label={{ value: 'Month', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }} 
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }} 
                          label={{ value: 'Avg Price (£)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }} 
                        />
                        <Tooltip formatter={(value: any) => [formatCurrency(value), 'Average Price']} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="averagePrice" fill="#60B5FF" name="Average Price" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Margin Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Margin Optimization Recommendations
                  </CardTitle>
                  <CardDescription>
                    AI-generated suggestions to improve profitability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marginAnalysis.recommendations?.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-sm">{rec}</p>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No specific recommendations at this time</p>
                        <p className="text-xs">Margin performance is within acceptable ranges</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          {customerInsights && (
            <>
              {/* Customer KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                        <p className="text-2xl font-bold">{customerInsights.totalCustomers}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Price Acceptance</p>
                        <p className="text-2xl font-bold">
                          {formatPercentage(customerInsights.averagePriceAcceptance || 0)}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Negotiation Rate</p>
                        <p className="text-2xl font-bold">
                          {formatPercentage(customerInsights.averageNegotiationRate || 0)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Behavior Types</p>
                        <p className="text-2xl font-bold">
                          {Object.keys(customerInsights.behaviorTypes || {}).length}
                        </p>
                      </div>
                      <PieChart className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Behavior Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Behavior Type Distribution</CardTitle>
                    <CardDescription>
                      Customer segmentation by behavior patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={Object.entries(customerInsights.behaviorTypes || {}).map(([type, count], index) => ({
                            name: type.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase()),
                            value: count,
                            fill: COLORS[index % COLORS.length]
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip />
                        <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seasonal Patterns</CardTitle>
                    <CardDescription>
                      Customer buying patterns throughout the year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={Object.entries(customerInsights.seasonalityPatterns || {}).map(([season, value]) => ({
                        season: season.toUpperCase(),
                        multiplier: value
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="season" 
                          tick={{ fontSize: 10 }} 
                          label={{ value: 'Season', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }} 
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }} 
                          label={{ value: 'Activity Multiplier', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }} 
                        />
                        <Tooltip formatter={(value: any) => [`${value}x`, 'Activity Level']} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="multiplier" fill="#60B5FF" name="Activity Level" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Customer Strategy Recommendations
                  </CardTitle>
                  <CardDescription>
                    Insights to improve customer engagement and pricing acceptance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customerInsights.recommendations?.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm">{rec}</p>
                      </div>
                    )) || (
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-sm">Segment customers by price sensitivity for targeted pricing strategies</p>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <p className="text-sm">Develop seasonal pricing models based on customer buying patterns</p>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                          <p className="text-sm">Create negotiation guidelines for high-negotiation customers</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          {competitiveIntelligence && (
            <>
              {/* Competitive KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Competitors</p>
                        <p className="text-2xl font-bold">{competitiveIntelligence.competitorCount}</p>
                      </div>
                      <Users className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Competitor Price</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(competitiveIntelligence.averageCompetitorPrice || 0)}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Market Position</p>
                        <p className="text-2xl font-bold">
                          {competitiveIntelligence.marketPosition === 'competitive' ? 'Strong' : 'Good'}
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
                        <p className="text-sm font-medium text-muted-foreground">Opportunities</p>
                        <p className="text-2xl font-bold">{competitiveIntelligence.opportunities?.length || 0}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Price Range Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Competitive Price Analysis</CardTitle>
                  <CardDescription>
                    Market price ranges and competitive positioning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Minimum</p>
                      <p className="text-lg font-bold">{formatCurrency(competitiveIntelligence.priceRanges?.min || 0)}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Average</p>
                      <p className="text-lg font-bold">{formatCurrency(competitiveIntelligence.priceRanges?.average || 0)}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Median</p>
                      <p className="text-lg font-bold">{formatCurrency(competitiveIntelligence.priceRanges?.median || 0)}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Maximum</p>
                      <p className="text-lg font-bold">{formatCurrency(competitiveIntelligence.priceRanges?.max || 0)}</p>
                    </div>
                  </div>

                  {/* Competitor Analysis */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Competitor Breakdown</h4>
                    {competitiveIntelligence.competitorAnalysis?.map((comp: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{comp.name}</p>
                          <p className="text-sm text-muted-foreground">{comp.dataPoints} data points</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(comp.averagePrice)}</p>
                          <Badge variant="outline" className="text-xs">
                            {comp.averagePrice > (competitiveIntelligence.averageCompetitorPrice || 0) ? 'Premium' : 'Competitive'}
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No competitor data available</p>
                        <p className="text-xs">Expand competitive intelligence collection</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Market Opportunities
                  </CardTitle>
                  <CardDescription>
                    Identified opportunities for competitive advantage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competitiveIntelligence.opportunities?.map((opp: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm">{opp}</p>
                      </div>
                    )) || (
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-sm">Monitor competitor pricing changes for strategic positioning opportunities</p>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <p className="text-sm">Identify underserved market segments with pricing gaps</p>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <p className="text-sm">Develop premium service offerings to justify higher pricing</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}