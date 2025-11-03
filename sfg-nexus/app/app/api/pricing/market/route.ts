
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const region = searchParams.get('region');

    switch (type) {
      case 'trends':
        return await getMarketTrends(category || undefined, region || undefined);
      
      case 'competitors':
        return await getCompetitorAnalysis(category || undefined, region || undefined);
      
      case 'opportunities':
        return await getMarketOpportunities(category || undefined);
      
      case 'intelligence':
        return await getMarketIntelligence(category || undefined, region || undefined);
      
      default:
        return await getMarketOverview(category || undefined, region || undefined);
    }
  } catch (error) {
    console.error('Market API error:', error);
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}

async function getMarketTrends(category?: string, region?: string) {
  const marketData = await prisma.marketData.findMany({
    where: {
      ...(category && { category }),
      ...(region && { region }),
      validTo: { gte: new Date() }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  // Analyze trends by category
  const trendsByCategory = marketData.reduce((acc: any, data: any) => {
    if (!acc[data.category]) {
      acc[data.category] = {
        rising: 0,
        falling: 0,
        stable: 0,
        total: 0,
        averagePrice: 0,
        priceSum: 0
      };
    }
    
    acc[data.category].total++;
    if (data.averagePrice) {
      acc[data.category].priceSum += data.averagePrice;
    }
    
    switch (data.marketTrend) {
      case 'RISING':
        acc[data.category].rising++;
        break;
      case 'FALLING':
        acc[data.category].falling++;
        break;
      case 'STABLE':
        acc[data.category].stable++;
        break;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages
  Object.keys(trendsByCategory).forEach((cat: any) => {
    const data = trendsByCategory[cat];
    data.averagePrice = data.total > 0 ? data.priceSum / data.total : 0;
    data.dominantTrend = data.rising > data.falling && data.rising > data.stable ? 'RISING' :
                        data.falling > data.rising && data.falling > data.stable ? 'FALLING' : 'STABLE';
    delete data.priceSum;
  });

  // Generate trend insights
  const insights = generateTrendInsights(trendsByCategory, marketData);

  return NextResponse.json({
    trends: {
      byCategory: trendsByCategory,
      overall: calculateOverallTrend(marketData),
      insights,
      dataPoints: marketData.length,
      lastUpdated: marketData[0]?.createdAt || new Date()
    }
  });
}

async function getCompetitorAnalysis(category?: string, region?: string) {
  const competitors = await prisma.competitorPricing.findMany({
    where: {
      ...(category && { category }),
      ...(region && { region }),
      validTo: { gte: new Date() }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Group by competitor
  const competitorAnalysis = competitors.reduce((acc: any, comp: any) => {
    if (!acc[comp.competitor]) {
      acc[comp.competitor] = {
        name: comp.competitor,
        products: [],
        averagePrice: 0,
        priceRange: { min: Infinity, max: 0 },
        categories: new Set(),
        dataPoints: 0,
        confidence: 0,
        lastSeen: comp.createdAt
      };
    }
    
    const analysis = acc[comp.competitor];
    analysis.products.push({
      product: comp.product,
      category: comp.category,
      price: comp.price,
      confidence: comp.confidence,
      specifications: comp.specifications
    });
    
    analysis.dataPoints++;
    analysis.categories.add(comp.category);
    analysis.priceRange.min = Math.min(analysis.priceRange.min, comp.price);
    analysis.priceRange.max = Math.max(analysis.priceRange.max, comp.price);
    analysis.confidence += comp.confidence;
    
    if (comp.createdAt > analysis.lastSeen) {
      analysis.lastSeen = comp.createdAt;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages and finalize data
  Object.values(competitorAnalysis).forEach((analysis: any) => {
    analysis.averagePrice = analysis.products.reduce((sum: number, p: any) => sum + p.price, 0) / analysis.products.length;
    analysis.confidence = analysis.confidence / analysis.dataPoints;
    analysis.categories = Array.from(analysis.categories);
    
    if (analysis.priceRange.min === Infinity) {
      analysis.priceRange.min = 0;
    }
  });

  // Generate competitive insights
  const competitiveInsights = generateCompetitiveInsights(Object.values(competitorAnalysis));

  return NextResponse.json({
    competitors: {
      analysis: Object.values(competitorAnalysis),
      summary: {
        totalCompetitors: Object.keys(competitorAnalysis).length,
        totalDataPoints: competitors.length,
        averageMarketPrice: competitors.reduce((sum: number, c: any) => sum + c.price, 0) / competitors.length,
        priceRange: {
          min: Math.min(...competitors.map((c: any) => c.price)),
          max: Math.max(...competitors.map((c: any) => c.price))
        }
      },
      insights: competitiveInsights
    }
  });
}

async function getMarketOpportunities(category?: string) {
  // Get market data and competitor pricing
  const [marketData, competitors, customerBehaviors] = await Promise.all([
    prisma.marketData.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: 'desc' },
      take: 30
    }),
    prisma.competitorPricing.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: 'desc' },
      take: 50
    }),
    prisma.customerBehavior.findMany({
      where: category ? { category } : {},
      take: 20
    })
  ]);

  const opportunities = [];

  // Price gap opportunities
  const priceGaps = identifyPriceGaps(competitors);
  opportunities.push(...priceGaps);

  // Market trend opportunities
  const trendOpportunities = identifyTrendOpportunities(marketData);
  opportunities.push(...trendOpportunities);

  // Customer behavior opportunities
  const behaviorOpportunities = identifyBehaviorOpportunities(customerBehaviors);
  opportunities.push(...behaviorOpportunities);

  // Competitive positioning opportunities
  const positioningOpportunities = identifyPositioningOpportunities(competitors, marketData);
  opportunities.push(...positioningOpportunities);

  return NextResponse.json({
    opportunities: {
      total: opportunities.length,
      highPriority: opportunities.filter((o: any) => o.priority === 'high'),
      mediumPriority: opportunities.filter((o: any) => o.priority === 'medium'),
      lowPriority: opportunities.filter((o: any) => o.priority === 'low'),
      all: opportunities
    }
  });
}

async function getMarketIntelligence(category?: string, region?: string) {
  const [marketData, competitors, recentPredictions] = await Promise.all([
    prisma.marketData.findMany({
      where: {
        ...(category && { category }),
        ...(region && { region })
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    }),
    prisma.competitorPricing.findMany({
      where: {
        ...(category && { category }),
        ...(region && { region })
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    }),
    prisma.pricingPrediction.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: 'desc' },
      take: 15
    })
  ]);

  const intelligence = {
    marketOverview: {
      dataFreshness: calculateDataFreshness(marketData),
      competitorCoverage: competitors.length,
      trendDirection: calculateOverallTrend(marketData),
      volatility: calculateMarketVolatility(marketData)
    },
    competitivePosition: {
      marketShare: estimateMarketShare(competitors, recentPredictions),
      pricePosition: calculatePricePosition(competitors, recentPredictions),
      strengthsWeaknesses: analyzeStrengthsWeaknesses(competitors, marketData)
    },
    recommendations: generateIntelligenceRecommendations(marketData, competitors, recentPredictions),
    alerts: generateMarketAlerts(marketData, competitors)
  };

  return NextResponse.json({ intelligence });
}

async function getMarketOverview(category?: string, region?: string) {
  const [marketDataCount, competitorCount, latestTrends] = await Promise.all([
    prisma.marketData.count({
      where: {
        ...(category && { category }),
        ...(region && { region })
      }
    }),
    prisma.competitorPricing.count({
      where: {
        ...(category && { category }),
        ...(region && { region })
      }
    }),
    prisma.marketData.findMany({
      where: {
        ...(category && { category }),
        ...(region && { region })
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  const overview = {
    dataPoints: marketDataCount,
    competitors: competitorCount,
    coverage: calculateCoverage(category, region),
    recentActivity: latestTrends.length,
    healthScore: calculateMarketHealthScore(marketDataCount, competitorCount, latestTrends)
  };

  return NextResponse.json({ overview });
}

// Helper functions
function generateTrendInsights(trendsByCategory: any, marketData: any[]): string[] {
  const insights: string[] = [];
  
  Object.entries(trendsByCategory).forEach(([category, data]: [string, any]) => {
    if (data.dominantTrend === 'RISING' && data.rising > data.total * 0.6) {
      insights.push(`${category} market showing strong upward trend (${Math.round(data.rising / data.total * 100)}% rising)`);
    }
    
    if (data.dominantTrend === 'FALLING' && data.falling > data.total * 0.5) {
      insights.push(`${category} market declining - potential opportunity for competitive pricing`);
    }
  });

  return insights;
}

function calculateOverallTrend(marketData: any[]): string {
  const trends = marketData.reduce((acc: any, data) => {
    acc[data.marketTrend] = (acc[data.marketTrend] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominant = Object.entries(trends).reduce((a, b) => trends[a[0]] > trends[b[0]] ? a : b);
  return dominant[0];
}

function generateCompetitiveInsights(competitors: any[]): string[] {
  const insights = [];
  
  if (competitors.length === 0) {
    insights.push('Limited competitive intelligence available - consider expanding data collection');
    return insights;
  }

  const avgPrice = competitors.reduce((sum: number, c) => sum + c.averagePrice, 0) / competitors.length;
  const priceLeader = competitors.reduce((leader, comp) => 
    comp.averagePrice > leader.averagePrice ? comp : leader
  );
  const priceFollower = competitors.reduce((follower, comp) => 
    comp.averagePrice < follower.averagePrice ? comp : follower
  );

  insights.push(`Market average price: £${avgPrice.toFixed(2)}`);
  insights.push(`Price leader: ${priceLeader.name} (£${priceLeader.averagePrice.toFixed(2)})`);
  insights.push(`Most competitive: ${priceFollower.name} (£${priceFollower.averagePrice.toFixed(2)})`);

  const priceSpread = priceLeader.averagePrice - priceFollower.averagePrice;
  if (priceSpread > avgPrice * 0.3) {
    insights.push('Large price variation in market - opportunity for strategic positioning');
  }

  return insights;
}

function identifyPriceGaps(competitors: any[]): any[] {
  const opportunities: any[] = [];
  
  if (competitors.length < 2) return opportunities;

  const prices = competitors.map((c: any) => c.price).sort((a, b) => a - b);
  
  for (let i = 1; i < prices.length; i++) {
    const gap = prices[i] - prices[i - 1];
    const avgPrice = (prices[i] + prices[i - 1]) / 2;
    
    if (gap > avgPrice * 0.2) { // 20% gap
      opportunities.push({
        type: 'price_gap',
        description: `Price gap identified between £${prices[i - 1].toFixed(2)} and £${prices[i].toFixed(2)}`,
        opportunity: `Target pricing around £${avgPrice.toFixed(2)}`,
        priority: gap > avgPrice * 0.4 ? 'high' : 'medium',
        value: gap
      });
    }
  }

  return opportunities;
}

function identifyTrendOpportunities(marketData: any[]): any[] {
  const opportunities = [];
  
  const risingTrends = marketData.filter((d: any) => d.marketTrend === 'RISING');
  if (risingTrends.length > marketData.length * 0.6) {
    opportunities.push({
      type: 'market_trend',
      description: 'Strong upward market trend detected',
      opportunity: 'Consider premium pricing strategy',
      priority: 'high',
      categories: Array.from(new Set(risingTrends.map((d: any) => d.category)))
    });
  }

  const fallingTrends = marketData.filter((d: any) => d.marketTrend === 'FALLING');
  if (fallingTrends.length > marketData.length * 0.5) {
    opportunities.push({
      type: 'market_trend',
      description: 'Market prices declining',
      opportunity: 'Opportunity for competitive advantage through value positioning',
      priority: 'medium',
      categories: Array.from(new Set(fallingTrends.map((d: any) => d.category)))
    });
  }

  return opportunities;
}

function identifyBehaviorOpportunities(customerBehaviors: any[]): any[] {
  const opportunities = [];
  
  const priceSensitive = customerBehaviors.filter((b: any) => b.priceAcceptance && b.priceAcceptance < 0.7);
  if (priceSensitive.length > customerBehaviors.length * 0.4) {
    opportunities.push({
      type: 'customer_behavior',
      description: 'High price sensitivity detected in customer base',
      opportunity: 'Develop value-focused pricing tiers',
      priority: 'medium',
      affectedCustomers: priceSensitive.length
    });
  }

  const highNegotiators = customerBehaviors.filter((b: any) => b.negotiationRate && b.negotiationRate > 0.7);
  if (highNegotiators.length > customerBehaviors.length * 0.3) {
    opportunities.push({
      type: 'customer_behavior',
      description: 'High negotiation rates among customers',
      opportunity: 'Build negotiation buffers into initial pricing',
      priority: 'high',
      affectedCustomers: highNegotiators.length
    });
  }

  return opportunities;
}

function identifyPositioningOpportunities(competitors: any[], marketData: any[]): any[] {
  const opportunities: any[] = [];
  
  if (competitors.length === 0) return opportunities;

  const avgCompetitorPrice = competitors.reduce((sum: number, c) => sum + c.price, 0) / competitors.length;
  const marketAvg = marketData.reduce((sum: number, d) => sum + (d.averagePrice || 0), 0) / marketData.length;

  if (Math.abs(avgCompetitorPrice - marketAvg) > marketAvg * 0.15) {
    opportunities.push({
      type: 'positioning',
      description: 'Gap between competitor pricing and market average',
      opportunity: 'Strategic positioning opportunity in the gap',
      priority: 'medium',
      targetPrice: (avgCompetitorPrice + marketAvg) / 2
    });
  }

  return opportunities;
}

function calculateDataFreshness(marketData: any[]): number {
  if (marketData.length === 0) return 0;
  
  const now = new Date();
  const avgAge = marketData.reduce((sum: number, data) => {
    const age = now.getTime() - new Date(data.createdAt).getTime();
    return sum + age;
  }, 0) / marketData.length;

  const dayAge = avgAge / (1000 * 60 * 60 * 24);
  return Math.max(0, 1 - (dayAge / 30)); // Fresher data gets higher score
}

function calculateMarketVolatility(marketData: any[]): string {
  const prices = marketData.map((d: any) => d.averagePrice).filter(Boolean);
  if (prices.length < 2) return 'unknown';

  const avg = prices.reduce((sum: number, p) => sum + p, 0) / prices.length;
  const variance = prices.reduce((sum: number, p) => sum + Math.pow(p - avg, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  const coefficient = stdDev / avg;

  if (coefficient > 0.3) return 'high';
  if (coefficient > 0.15) return 'medium';
  return 'low';
}

function estimateMarketShare(competitors: any[], predictions: any[]): number {
  // Simplified market share estimation
  if (competitors.length === 0) return 0;
  return Math.min(0.25, 1 / competitors.length); // Assume equal distribution with max 25%
}

function calculatePricePosition(competitors: any[], predictions: any[]): string {
  if (competitors.length === 0 || predictions.length === 0) return 'unknown';

  const avgCompetitorPrice = competitors.reduce((sum: number, c) => sum + c.price, 0) / competitors.length;
  const avgOurPrice = predictions.reduce((sum: number, p) => sum + p.predictedPrice, 0) / predictions.length;

  const difference = (avgOurPrice - avgCompetitorPrice) / avgCompetitorPrice;

  if (difference > 0.1) return 'premium';
  if (difference < -0.1) return 'competitive';
  return 'market_rate';
}

function analyzeStrengthsWeaknesses(competitors: any[], marketData: any[]): any {
  return {
    strengths: [
      'AI-powered pricing optimization',
      'Real-time market data integration',
      'Customer behavior analysis'
    ],
    weaknesses: [
      'Limited historical data',
      'Competitor intelligence gaps'
    ],
    opportunities: [
      'Market trend analysis',
      'Dynamic pricing implementation'
    ]
  };
}

function generateIntelligenceRecommendations(marketData: any[], competitors: any[], predictions: any[]): string[] {
  const recommendations = [];

  if (marketData.length < 10) {
    recommendations.push('Expand market data collection for better intelligence');
  }

  if (competitors.length < 5) {
    recommendations.push('Increase competitor monitoring and analysis');
  }

  const risingTrends = marketData.filter((d: any) => d.marketTrend === 'RISING').length;
  if (risingTrends > marketData.length * 0.6) {
    recommendations.push('Consider premium pricing strategy due to rising market trends');
  }

  return recommendations;
}

function generateMarketAlerts(marketData: any[], competitors: any[]): any[] {
  const alerts = [];

  // Price volatility alert
  const recentData = marketData.slice(0, 5);
  const volatility = calculateMarketVolatility(recentData);
  if (volatility === 'high') {
    alerts.push({
      type: 'volatility',
      severity: 'medium',
      message: 'High market price volatility detected',
      action: 'Monitor pricing strategies closely'
    });
  }

  // Competitive pressure alert
  if (competitors.length > 10) {
    alerts.push({
      type: 'competition',
      severity: 'low',
      message: 'High competitive activity in market',
      action: 'Review competitive positioning'
    });
  }

  return alerts;
}

function calculateCoverage(category?: string, region?: string): number {
  // Simplified coverage calculation
  let coverage = 0.7; // Base coverage
  if (category) coverage += 0.1;
  if (region) coverage += 0.1;
  return Math.min(coverage, 1.0);
}

function calculateMarketHealthScore(dataPoints: number, competitors: number, trends: any[]): number {
  let score = 0;
  
  // Data availability (40%)
  score += Math.min(dataPoints / 50, 1) * 0.4;
  
  // Competitive intelligence (30%)
  score += Math.min(competitors / 20, 1) * 0.3;
  
  // Trend freshness (30%)
  score += Math.min(trends.length / 10, 1) * 0.3;
  
  return Math.round(score * 100);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'update-competitor':
        const competitor = await prisma.competitorPricing.create({
          data: {
            competitor: data.competitor,
            product: data.product,
            category: data.category,
            price: parseFloat(data.price),
            source: data.source,
            region: data.region,
            specifications: data.specifications,
            confidence: data.confidence || 0.7
          }
        });
        return NextResponse.json({ competitor });

      case 'add-market-data':
        const marketData = await prisma.marketData.create({
          data: {
            dataType: data.dataType,
            source: data.source,
            category: data.category,
            product: data.product,
            region: data.region,
            averagePrice: data.averagePrice,
            minPrice: data.minPrice,
            maxPrice: data.maxPrice,
            marketTrend: data.marketTrend,
            confidence: data.confidence || 0.7,
            metadata: data.metadata
          }
        });
        return NextResponse.json({ marketData });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Market API POST error:', error);
    return NextResponse.json({ error: 'Failed to process market request' }, { status: 500 });
  }
}
