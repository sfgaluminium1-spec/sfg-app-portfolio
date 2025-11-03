
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const period = searchParams.get('period') || 'MONTHLY';
    const category = searchParams.get('category');

    switch (type) {
      case 'performance':
        return await getPricingPerformance(period, category || undefined);
      
      case 'market-analysis':
        return await getMarketAnalysis(category || undefined);
      
      case 'customer-insights':
        return await getCustomerInsights(category || undefined);
      
      case 'competitive-intelligence':
        return await getCompetitiveIntelligence(category || undefined);
      
      case 'margin-analysis':
        return await getMarginAnalysis(period, category || undefined);
      
      case 'model-accuracy':
        return await getModelAccuracy();
      
      default:
        return await getDashboardOverview();
    }
  } catch (error) {
    console.error('Pricing analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}

async function getPricingPerformance(period: string, category?: string) {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'WEEKLY':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'MONTHLY':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'QUARTERLY':
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    default:
      startDate.setMonth(endDate.getMonth() - 1);
  }

  // Get quotes in period
  const quotes = await prisma.quote.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      ...(category && { lineItems: { some: { product: { contains: category } } } })
    },
    include: {
      lineItems: true
    }
  });

  // Calculate metrics
  const totalQuotes = quotes.length;
  const totalValue = quotes.reduce((sum: number, quote: any) => sum + quote.value, 0);
  const averageValue = totalQuotes > 0 ? totalValue / totalQuotes : 0;
  const wonQuotes = quotes.filter((q: any) => q.status === 'WON').length;
  const winRate = totalQuotes > 0 ? wonQuotes / totalQuotes : 0;

  // Weekly breakdown
  const weeklyData = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekQuotes = quotes.filter((q: any) => 
      q.createdAt >= weekStart && q.createdAt < weekEnd
    );

    weeklyData.push({
      week: i + 1,
      quotes: weekQuotes.length,
      value: weekQuotes.reduce((sum: number, q: any) => sum + q.value, 0),
      winRate: weekQuotes.length > 0 ? 
        weekQuotes.filter((q: any) => q.status === 'WON').length / weekQuotes.length : 0
    });
  }

  return NextResponse.json({
    performance: {
      totalQuotes,
      totalValue,
      averageValue,
      winRate,
      period,
      weeklyData,
      trends: {
        quotesGrowth: calculateGrowth(weeklyData.map((w: any) => w.quotes)),
        valueGrowth: calculateGrowth(weeklyData.map((w: any) => w.value)),
        winRateChange: calculateGrowth(weeklyData.map((w: any) => w.winRate))
      }
    }
  });
}

async function getMarketAnalysis(category?: string) {
  const marketData = await prisma.marketData.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  const competitorData = await prisma.competitorPricing.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: 'desc' },
    take: 15
  });

  // Analyze trends
  const trendAnalysis = analyzeTrends(marketData);
  const competitivePosition = analyzeCompetitivePosition(competitorData);

  return NextResponse.json({
    marketAnalysis: {
      marketData,
      competitorData,
      trendAnalysis,
      competitivePosition,
      insights: generateMarketInsights(marketData, competitorData)
    }
  });
}

async function getCustomerInsights(category?: string) {
  const customerBehaviors = await prisma.customerBehavior.findMany({
    where: category ? { category } : {},
    include: {
      customer: true
    }
  });

  const insights = {
    totalCustomers: customerBehaviors.length,
    averagePriceAcceptance: calculateAverage(customerBehaviors.map((c: any) => c.priceAcceptance).filter((val: any): val is number => val !== null)),
    averageNegotiationRate: calculateAverage(customerBehaviors.map((c: any) => c.negotiationRate).filter((val: any): val is number => val !== null)),
    behaviorTypes: groupBy(customerBehaviors, 'behaviorType'),
    seasonalityPatterns: analyzeSeasonality(customerBehaviors),
    recommendations: generateCustomerRecommendations(customerBehaviors)
  };

  return NextResponse.json({ customerInsights: insights });
}

async function getCompetitiveIntelligence(category?: string) {
  const competitors = await prisma.competitorPricing.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: 'desc' }
  });

  const intelligence = {
    competitorCount: new Set(competitors.map((c: any) => c.competitor)).size,
    averageCompetitorPrice: calculateAverage(competitors.map((c: any) => c.price)),
    priceRanges: calculatePriceRanges(competitors),
    competitorAnalysis: analyzeCompetitors(competitors),
    marketPosition: calculateMarketPosition(competitors),
    opportunities: identifyOpportunities(competitors)
  };

  return NextResponse.json({ competitiveIntelligence: intelligence });
}

async function getMarginAnalysis(period: string, category?: string) {
  // Get recent quotes with predictions
  const predictions = await prisma.pricingPrediction.findMany({
    where: {
      actualPrice: { not: null },
      ...(category && { category })
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  const marginAnalysis = {
    totalPredictions: predictions.length,
    averageAccuracy: calculateAverage(predictions.map((p: any) => p.accuracy).filter((val: any): val is number => val !== null)),
    marginDistribution: analyzeMarginDistribution(predictions),
    profitabilityTrends: analyzeProfitabilityTrends(predictions),
    recommendations: generateMarginRecommendations(predictions)
  };

  return NextResponse.json({ marginAnalysis });
}

async function getModelAccuracy() {
  const models = await prisma.pricingModel.findMany({
    include: {
      predictions: {
        where: { actualPrice: { not: null } },
        orderBy: { createdAt: 'desc' },
        take: 50
      }
    }
  });

  const modelAccuracy = models.map((model: any) => {
    const predictions = model.predictions;
    const accuracy = predictions.length > 0 ? 
      calculateAverage(predictions.map((p: any) => p.accuracy).filter((val: any): val is number => val !== null)) : 0;
    
    return {
      id: model.id,
      name: model.name,
      category: model.category,
      confidence: model.confidence,
      accuracy,
      predictionCount: predictions.length,
      performance: accuracy > 0.8 ? 'excellent' : accuracy > 0.6 ? 'good' : 'needs_improvement'
    };
  });

  return NextResponse.json({ modelAccuracy });
}

async function getDashboardOverview() {
  const [
    totalModels,
    totalPredictions,
    totalMarketData,
    recentAnalytics
  ] = await Promise.all([
    prisma.pricingModel.count({ where: { isActive: true } }),
    prisma.pricingPrediction.count(),
    prisma.marketData.count(),
    prisma.pricingAnalytics.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  // Get recent predictions for accuracy calculation
  const recentPredictions = await prisma.pricingPrediction.findMany({
    where: { actualPrice: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  const averageAccuracy = recentPredictions.length > 0 ? 
    calculateAverage(recentPredictions.map((p: any) => p.accuracy).filter((val: any): val is number => val !== null)) : 0;

  return NextResponse.json({
    overview: {
      totalModels,
      totalPredictions,
      totalMarketData,
      averageAccuracy,
      recentAnalytics,
      systemHealth: {
        modelsActive: totalModels,
        dataFreshness: calculateDataFreshness(),
        predictionVolume: totalPredictions,
        accuracy: averageAccuracy
      }
    }
  });
}

// Helper functions
function calculateGrowth(values: number[]): number {
  if (values.length < 2) return 0;
  const first = values[0] || 0;
  const last = values[values.length - 1] || 0;
  return first > 0 ? ((last - first) / first) * 100 : 0;
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum: number, val: any) => sum + val, 0) / values.length;
}

function groupBy(array: any[], key: string): Record<string, number> {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = (groups[group] || 0) + 1;
    return groups;
  }, {});
}

function analyzeTrends(marketData: any[]): any {
  const trends = {
    rising: marketData.filter((d: any) => d.marketTrend === 'RISING').length,
    falling: marketData.filter((d: any) => d.marketTrend === 'FALLING').length,
    stable: marketData.filter((d: any) => d.marketTrend === 'STABLE').length
  };

  return {
    ...trends,
    dominant: Object.entries(trends).reduce((a, b) => (trends as any)[a[0]] > (trends as any)[b[0]] ? a : b)[0]
  };
}

function analyzeCompetitivePosition(competitorData: any[]): any {
  if (competitorData.length === 0) return { position: 'unknown' };

  const avgPrice = calculateAverage(competitorData.map((c: any) => c.price));
  const ourEstimatedPrice = avgPrice * 0.95; // Assume we're slightly below average

  return {
    averageCompetitorPrice: avgPrice,
    ourPosition: ourEstimatedPrice < avgPrice ? 'competitive' : 'premium',
    priceAdvantage: ((avgPrice - ourEstimatedPrice) / avgPrice) * 100
  };
}

function generateMarketInsights(marketData: any[], competitorData: any[]): string[] {
  const insights = [];

  if (marketData.some(d => d.marketTrend === 'RISING')) {
    insights.push('Market prices are trending upward - consider premium positioning');
  }

  if (competitorData.length > 0) {
    const avgCompetitorPrice = calculateAverage(competitorData.map((c: any) => c.price));
    insights.push(`Average competitor pricing: £${avgCompetitorPrice.toFixed(2)}`);
  }

  return insights;
}

function analyzeSeasonality(behaviors: any[]): any {
  const seasonalData = behaviors
    .filter((b: any) => b.seasonality)
    .map((b: any) => b.seasonality);

  if (seasonalData.length === 0) return {};

  // Aggregate seasonal patterns
  const seasons = ['q1', 'q2', 'q3', 'q4'];
  const seasonalAverages = seasons.reduce((acc: any, season) => {
    const values = seasonalData
      .map((s: any) => s[season])
      .filter((v: any) => v !== undefined);
    acc[season] = values.length > 0 ? calculateAverage(values) : 1.0;
    return acc;
  }, {});

  return seasonalAverages;
}

function generateCustomerRecommendations(behaviors: any[]): string[] {
  const recommendations = [];

  const highNegotiators = behaviors.filter((b: any) => b.negotiationRate > 0.7).length;
  if (highNegotiators > behaviors.length * 0.3) {
    recommendations.push('High negotiation rates detected - build negotiation buffers into pricing');
  }

  const priceSensitive = behaviors.filter((b: any) => b.priceAcceptance < 0.7).length;
  if (priceSensitive > behaviors.length * 0.4) {
    recommendations.push('Many price-sensitive customers - consider value-based pricing strategies');
  }

  return recommendations;
}

function calculatePriceRanges(competitors: any[]): any {
  const prices = competitors.map((c: any) => c.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    average: calculateAverage(prices),
    median: prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)]
  };
}

function analyzeCompetitors(competitors: any[]): any {
  const competitorGroups = groupBy(competitors, 'competitor');
  return Object.entries(competitorGroups).map(([name, count]) => ({
    name,
    dataPoints: count,
    averagePrice: calculateAverage(
      competitors.filter((c: any) => c.competitor === name).map((c: any) => c.price)
    )
  }));
}

function calculateMarketPosition(competitors: any[]): string {
  // This would be more sophisticated in a real implementation
  return competitors.length > 10 ? 'competitive' : 'limited_data';
}

function identifyOpportunities(competitors: any[]): string[] {
  const opportunities = [];
  
  const priceRanges = calculatePriceRanges(competitors);
  const priceSpread = priceRanges.max - priceRanges.min;
  
  if (priceSpread > priceRanges.average * 0.5) {
    opportunities.push('Large price variation in market - opportunity for strategic positioning');
  }

  return opportunities;
}

function analyzeMarginDistribution(predictions: any[]): any {
  // Calculate margin distribution from predictions
  return {
    low: predictions.filter((p: any) => (p.predictedPrice - (p.predictedPrice * 0.7)) / p.predictedPrice < 0.15).length,
    medium: predictions.filter((p: any) => {
      const margin = (p.predictedPrice - (p.predictedPrice * 0.7)) / p.predictedPrice;
      return margin >= 0.15 && margin < 0.25;
    }).length,
    high: predictions.filter((p: any) => (p.predictedPrice - (p.predictedPrice * 0.7)) / p.predictedPrice >= 0.25).length
  };
}

function analyzeProfitabilityTrends(predictions: any[]): any {
  // Analyze profitability trends over time
  const monthlyData = predictions.reduce((acc: any, p) => {
    const month = new Date(p.createdAt).toISOString().slice(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(p);
    return acc;
  }, {});

  return Object.entries(monthlyData).map(([month, preds]) => ({
    month,
    averagePrice: calculateAverage((preds as any[]).map((p: any) => p.predictedPrice)),
    count: (preds as any[]).length
  }));
}

function generateMarginRecommendations(predictions: any[]): string[] {
  const recommendations = [];
  
  const lowMarginCount = predictions.filter((p: any) => {
    const estimatedMargin = (p.predictedPrice - (p.predictedPrice * 0.7)) / p.predictedPrice;
    return estimatedMargin < 0.15;
  }).length;

  if (lowMarginCount > predictions.length * 0.3) {
    recommendations.push('High number of low-margin predictions - review pricing strategies');
  }

  return recommendations;
}

function calculateDataFreshness(): number {
  // Return a score from 0-1 indicating how fresh the data is
  return 0.85; // Placeholder
}
