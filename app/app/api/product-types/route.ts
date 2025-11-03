
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeRules = searchParams.get('includeRules') === 'true';
    
    if (includeRules) {
      const productTypeRules = await prisma.productTypeRule.findMany({
        where: { isActive: true },
        orderBy: { productType: 'asc' }
      });
      
      return NextResponse.json({ productTypeRules });
    }
    
    // Return basic product type information
    const productTypes = [
      {
        value: 'STANDARD_FABRICATION',
        label: 'Standard Fabrication',
        description: 'Regular fabricated products with standard processes',
        complexity: 'Low',
        leadTime: '2-6 weeks'
      },
      {
        value: 'BESPOKE',
        label: 'Bespoke',
        description: 'Custom designed items requiring special design attention',
        complexity: 'High',
        leadTime: '4-16 weeks'
      },
      {
        value: 'BOUGHT_IN_ITEM',
        label: 'Bought In Item',
        description: 'Products purchased from suppliers (minimal fabrication)',
        complexity: 'Medium',
        leadTime: '1-8 weeks'
      },
      {
        value: 'MERGED_DESIGN',
        label: 'Merged Design',
        description: 'Hybrid of standard fabrication and bought in components',
        complexity: 'High',
        leadTime: '3-12 weeks'
      }
    ];
    
    return NextResponse.json({ productTypes });
  } catch (error) {
    console.error('Product Types API error:', error);
    return NextResponse.json({ error: 'Failed to fetch product types' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productType, baseValue } = body;
    
    // Get product type rule
    const rule = await prisma.productTypeRule.findUnique({
      where: { 
        productType: productType as any
      }
    });
    
    if (!rule) {
      return NextResponse.json({ error: 'Product type rule not found' }, { status: 404 });
    }
    
    // Calculate pricing based on product type
    const adjustedBaseValue = baseValue * rule.basePriceMultiplier;
    const complexityMarkupAmount = (adjustedBaseValue * rule.complexityMarkup) / 100;
    const finalValue = adjustedBaseValue + complexityMarkupAmount;
    
    // Calculate lead time estimate
    const leadTimeEstimate = {
      minimum: rule.minimumLeadTimeWeeks,
      maximum: rule.maximumLeadTimeWeeks,
      average: Math.round((rule.minimumLeadTimeWeeks + rule.maximumLeadTimeWeeks) / 2)
    };
    
    // Determine design complexity
    let designComplexity = 'Simple';
    if (rule.requiresDetailedSpecifications && rule.requiresDrawings) {
      designComplexity = rule.requiresDesignApproval ? 'Highly Complex' : 'Complex';
    } else if (rule.requiresDetailedSpecifications || rule.requiresDrawings) {
      designComplexity = 'Moderate';
    }
    
    const calculation = {
      productType,
      rule: {
        ...rule,
        approvalStages: typeof rule.approvalStages === 'string' ? JSON.parse(rule.approvalStages) : rule.approvalStages,
        escalationRules: typeof rule.escalationRules === 'string' ? JSON.parse(rule.escalationRules) : rule.escalationRules
      },
      pricing: {
        baseValue,
        adjustedBaseValue,
        priceMultiplier: rule.basePriceMultiplier,
        complexityMarkup: rule.complexityMarkup,
        complexityMarkupAmount,
        finalValue
      },
      leadTime: leadTimeEstimate,
      designComplexity,
      approvalRequirements: {
        designApproval: rule.requiresDesignApproval,
        supplierConfirmation: rule.requiresSupplierConfirmation,
        fabricationApproval: rule.requiresFabricationApproval,
        qualityAssurance: rule.requiresQualityAssurance
      },
      validationRequirements: {
        detailedSpecifications: rule.requiresDetailedSpecifications,
        drawings: rule.requiresDrawings,
        supplierQuote: rule.requiresSupplierQuote
      },
      riskAssessment: {
        overall: rule.riskLevel,
        design: rule.designRisk,
        supplier: rule.supplierRisk,
        quality: rule.qualityRisk,
        timeline: rule.timelineRisk
      }
    };
    
    return NextResponse.json(calculation);
  } catch (error) {
    console.error('Product type calculation error:', error);
    return NextResponse.json({ error: 'Failed to calculate product type pricing' }, { status: 500 });
  }
}
