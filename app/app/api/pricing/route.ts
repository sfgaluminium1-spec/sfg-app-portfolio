
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    
    switch (type) {
      case 'models':
        const models = await prisma.pricingModel.findMany({
          where: category ? { category } : {},
          orderBy: { confidence: 'desc' },
          include: {
            predictions: {
              take: 5,
              orderBy: { createdAt: 'desc' }
            },
            analytics: {
              take: 3,
              orderBy: { createdAt: 'desc' }
            }
          }
        });
        return NextResponse.json({ models });

      case 'market-data':
        const marketData = await prisma.marketData.findMany({
          where: category ? { category } : {},
          orderBy: { createdAt: 'desc' },
          take: 50
        });
        return NextResponse.json({ marketData });

      case 'analytics':
        const analytics = await prisma.pricingAnalytics.findMany({
          where: category ? { category } : {},
          orderBy: { createdAt: 'desc' },
          include: {
            pricingModel: true
          },
          take: 20
        });
        return NextResponse.json({ analytics });

      case 'competitors':
        const competitors = await prisma.competitorPricing.findMany({
          where: category ? { category } : {},
          orderBy: { createdAt: 'desc' },
          take: 30
        });
        return NextResponse.json({ competitors });

      case 'rules':
        const rules = await prisma.pricingRule.findMany({
          where: {
            isActive: true,
            ...(category ? { category } : {})
          },
          orderBy: { priority: 'asc' }
        });
        return NextResponse.json({ rules });

      default:
        // Return overview data
        const overview = {
          models: await prisma.pricingModel.count({ where: { isActive: true } }),
          predictions: await prisma.pricingPrediction.count(),
          marketData: await prisma.marketData.count(),
          analytics: await prisma.pricingAnalytics.count(),
          competitors: await prisma.competitorPricing.count(),
          rules: await prisma.pricingRule.count({ where: { isActive: true } })
        };
        return NextResponse.json({ overview });
    }
  } catch (error) {
    console.error('Pricing API error:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create-model':
        const model = await prisma.pricingModel.create({
          data: {
            name: data.name,
            description: data.description,
            modelType: data.modelType,
            category: data.category,
            basePrice: parseFloat(data.basePrice),
            formula: JSON.stringify(data.formula),
            factors: data.factors,
            confidence: data.confidence || 0.8
          }
        });
        return NextResponse.json({ model });

      case 'update-market-data':
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

      case 'create-rule':
        const rule = await prisma.pricingRule.create({
          data: {
            name: data.name,
            description: data.description,
            ruleType: data.ruleType,
            category: data.category,
            conditions: data.conditions,
            actions: data.actions,
            priority: data.priority || 1
          }
        });
        return NextResponse.json({ rule });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Pricing API POST error:', error);
    return NextResponse.json({ error: 'Failed to process pricing request' }, { status: 500 });
  }
}
