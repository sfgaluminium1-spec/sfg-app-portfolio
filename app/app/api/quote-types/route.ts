
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const quoteTypeRules = await prisma.quoteTypeRule.findMany({
      where: { isActive: true },
      orderBy: { quoteType: 'asc' }
    });

    return NextResponse.json({ quoteTypeRules });
  } catch (error) {
    console.error('Quote types API error:', error);
    return NextResponse.json({ error: 'Failed to fetch quote types' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteType, baseValue, quantity = 1 } = body;

    // Get quote type rule
    const rule = await prisma.quoteTypeRule.findFirst({
      where: { 
        quoteType: quoteType.toUpperCase().replace(/\s+/g, '_'),
        isActive: true 
      }
    });

    if (!rule) {
      return NextResponse.json({ error: 'Quote type rule not found' }, { status: 404 });
    }

    // Calculate markup
    const totalMarkup = rule.baseMarkup + rule.riskMarkup;
    const markupAmount = (baseValue * totalMarkup) / 100;
    const finalValue = baseValue + markupAmount;

    // Ensure minimum markup
    const minimumMarkupAmount = (baseValue * rule.minimumMarkup) / 100;
    const adjustedMarkupAmount = Math.max(markupAmount, minimumMarkupAmount);
    const adjustedFinalValue = baseValue + adjustedMarkupAmount;

    const calculation = {
      baseValue,
      markup: Math.max(totalMarkup, rule.minimumMarkup),
      markupAmount: adjustedMarkupAmount,
      finalValue: adjustedFinalValue,
      rule: {
        quoteType: rule.quoteType,
        baseMarkup: rule.baseMarkup,
        riskMarkup: rule.riskMarkup,
        minimumMarkup: rule.minimumMarkup,
        riskLevel: rule.riskLevel,
        requiresInstallationPricing: rule.requiresInstallationPricing,
        requiresMandatoryApproval: rule.requiresMandatoryApproval,
        description: rule.description
      }
    };

    return NextResponse.json(calculation);
  } catch (error) {
    console.error('Quote type calculation error:', error);
    return NextResponse.json({ error: 'Failed to calculate quote type pricing' }, { status: 500 });
  }
}
