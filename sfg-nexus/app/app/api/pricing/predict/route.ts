
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// AI Pricing Prediction Engine
class PricingEngine {
  static async predictPrice(params: {
    product: string;
    category: string;
    quantity?: number;
    specifications?: any;
    customerName?: string;
    urgency?: string;
  }) {
    const { product, category, quantity = 1, specifications = {}, customerName, urgency } = params;

    try {
      // 1. Find the best pricing model for this category
      const pricingModel = await prisma.pricingModel.findFirst({
        where: {
          category,
          isActive: true
        },
        orderBy: { confidence: 'desc' }
      });

      if (!pricingModel) {
        throw new Error(`No pricing model found for category: ${category}`);
      }

      // 2. Get market data for context
      const marketData = await prisma.marketData.findFirst({
        where: {
          category,
          product: { contains: product }
        },
        orderBy: { createdAt: 'desc' }
      });

      // 3. Get customer behavior data if available
      const customerBehavior = customerName ? await prisma.customerBehavior.findFirst({
        where: { customerName }
      }) : null;

      // 4. Get applicable pricing rules
      const pricingRules = await prisma.pricingRule.findMany({
        where: {
          isActive: true,
          OR: [
            { category },
            { category: 'All' }
          ]
        },
        orderBy: { priority: 'asc' }
      });

      // 5. Calculate base price using the model
      const formula = JSON.parse(pricingModel.formula);
      let basePrice = pricingModel.basePrice;

      // Apply formula factors
      if (formula.factors) {
        // Size factor
        if (specifications.size && formula.factors.size) {
          const sizeMultiplier = this.calculateSizeMultiplier(specifications.size, formula.factors.size);
          basePrice *= sizeMultiplier;
        }

        // Material factors
        if (specifications.glazing && formula.factors.glazing) {
          basePrice *= formula.factors.glazing[specifications.glazing] || 1.0;
        }

        if (specifications.frame && formula.factors.frame) {
          basePrice *= formula.factors.frame[specifications.frame] || 1.0;
        }

        // Complexity factor
        if (specifications.complexity && formula.factors.complexity) {
          basePrice *= formula.factors.complexity[specifications.complexity] || 1.0;
        }

        // Urgency factor
        if (urgency && formula.factors.urgency) {
          basePrice *= formula.factors.urgency[urgency] || 1.0;
        }
      }

      // 6. Apply quantity scaling
      let totalPrice = basePrice * quantity;

      // 7. Apply pricing rules
      const appliedRules = [];
      for (const rule of pricingRules) {
        const ruleResult = this.applyPricingRule(rule, {
          basePrice,
          totalPrice,
          quantity,
          specifications,
          customerBehavior
        });

        if (ruleResult.applied) {
          totalPrice = ruleResult.newPrice;
          appliedRules.push({
            name: rule.name,
            type: rule.ruleType,
            adjustment: ruleResult.adjustment
          });
        }
      }

      // 8. Market adjustment
      let marketAdjustment = 0;
      if (marketData) {
        const marketAverage = marketData.averagePrice || basePrice;
        const priceDifference = (totalPrice - marketAverage) / marketAverage;
        
        if (Math.abs(priceDifference) > 0.15) { // If more than 15% different from market
          marketAdjustment = priceDifference > 0 ? -0.05 : 0.03; // Adjust towards market
          totalPrice *= (1 + marketAdjustment);
        }
      }

      // 9. Customer behavior adjustment
      let customerAdjustment = 0;
      if (customerBehavior) {
        if (customerBehavior.priceAcceptance && customerBehavior.priceAcceptance < 0.7) {
          customerAdjustment = -0.08; // More price-sensitive customers get discount
          totalPrice *= (1 + customerAdjustment);
        }
      }

      // 10. Calculate confidence score
      let confidence = pricingModel.confidence;
      if (marketData) confidence += 0.05;
      if (customerBehavior) confidence += 0.03;
      confidence = Math.min(confidence, 0.98);

      // 11. Generate price range
      const variance = 1 - confidence;
      const priceRange = {
        min: totalPrice * (1 - variance * 0.5),
        max: totalPrice * (1 + variance * 0.5)
      };

      // 12. Generate recommendations
      const recommendations = this.generateRecommendations({
        totalPrice,
        basePrice,
        marketData,
        customerBehavior,
        appliedRules,
        confidence
      });

      return {
        predictedPrice: Math.round(totalPrice * 100) / 100,
        confidence,
        priceRange,
        factors: {
          basePrice: Math.round(basePrice * 100) / 100,
          quantity,
          marketAdjustment,
          customerAdjustment,
          appliedRules
        },
        recommendations,
        modelUsed: pricingModel.name,
        marketContext: marketData ? {
          averagePrice: marketData.averagePrice,
          trend: marketData.marketTrend,
          source: marketData.source
        } : null
      };

    } catch (error) {
      console.error('Pricing prediction error:', error);
      throw error;
    }
  }

  static calculateSizeMultiplier(size: any, sizeConfig: any): number {
    if (typeof size === 'object' && size.width && size.height) {
      const area = (size.width / 1000) * (size.height / 1000); // Convert mm to m²
      return 1 + (area - 1) * (sizeConfig.multiplier - 1);
    }
    return 1.0;
  }

  static applyPricingRule(rule: any, context: any): { applied: boolean; newPrice: number; adjustment: string } {
    const { conditions, actions } = rule;
    const { totalPrice, quantity, specifications, customerBehavior } = context;

    // Check conditions
    let conditionsMet = true;

    if (conditions.min_quantity && quantity < conditions.min_quantity) {
      conditionsMet = false;
    }

    if (conditions.min_value && totalPrice < conditions.min_value) {
      conditionsMet = false;
    }

    if (conditions.service_type && specifications.serviceType !== conditions.service_type) {
      conditionsMet = false;
    }

    if (conditions.margin_threshold && context.basePrice) {
      const currentMargin = (totalPrice - context.basePrice) / totalPrice;
      if (currentMargin < conditions.margin_threshold) {
        conditionsMet = false;
      }
    }

    if (!conditionsMet) {
      return { applied: false, newPrice: totalPrice, adjustment: 'none' };
    }

    // Apply actions
    let newPrice = totalPrice;
    let adjustment = '';

    if (actions.discount_percentage) {
      const discount = Math.min(actions.discount_percentage / 100, actions.max_discount / 100 || 0.2);
      newPrice *= (1 - discount);
      adjustment = `${actions.discount_percentage}% discount applied`;
    }

    if (actions.markup_percentage) {
      newPrice *= (1 + actions.markup_percentage / 100);
      adjustment = `${actions.markup_percentage}% markup applied`;
    }

    if (actions.minimum_charge && newPrice < actions.minimum_charge) {
      newPrice = actions.minimum_charge;
      adjustment = `Minimum charge of £${actions.minimum_charge} applied`;
    }

    if (actions.minimum_margin && context.basePrice) {
      const requiredPrice = context.basePrice / (1 - actions.minimum_margin);
      if (newPrice < requiredPrice) {
        newPrice = requiredPrice;
        adjustment = `Minimum margin protection applied`;
      }
    }

    return {
      applied: newPrice !== totalPrice,
      newPrice,
      adjustment
    };
  }

  static generateRecommendations(context: any): string[] {
    const recommendations = [];
    const { totalPrice, basePrice, marketData, customerBehavior, confidence } = context;

    if (confidence < 0.8) {
      recommendations.push('Consider gathering more market data to improve pricing accuracy');
    }

    if (marketData && marketData.trend === 'RISING') {
      recommendations.push('Market trend is rising - consider premium pricing strategy');
    }

    if (customerBehavior && customerBehavior.negotiationRate > 0.7) {
      recommendations.push('Customer has high negotiation rate - build in negotiation buffer');
    }

    if (totalPrice > basePrice * 1.5) {
      recommendations.push('Price significantly above base - ensure value proposition is clear');
    }

    if (marketData && totalPrice < marketData.averagePrice * 0.9) {
      recommendations.push('Price below market average - opportunity for margin improvement');
    }

    return recommendations;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      product,
      category,
      quantity,
      specifications,
      customerName,
      urgency,
      targetId,
      targetType
    } = body;

    // Generate prediction
    const prediction = await PricingEngine.predictPrice({
      product,
      category,
      quantity,
      specifications,
      customerName,
      urgency
    });

    // Find the pricing model used
    const pricingModel = await prisma.pricingModel.findFirst({
      where: {
        name: prediction.modelUsed
      }
    });

    // Save prediction to database
    const savedPrediction = await prisma.pricingPrediction.create({
      data: {
        predictionType: 'QUOTE_PRICING',
        targetId: targetId || 'manual',
        targetType: targetType || 'MANUAL',
        product,
        category,
        quantity,
        specifications,
        customerName,
        predictedPrice: prediction.predictedPrice,
        confidence: prediction.confidence,
        priceRange: prediction.priceRange,
        factors: prediction.factors,
        recommendations: prediction.recommendations,
        modelId: pricingModel?.id || ''
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'PRICING_PREDICTION',
        description: `AI pricing prediction generated for ${product} - £${prediction.predictedPrice} (${Math.round(prediction.confidence * 100)}% confidence)`,
        user: 'SFG PRICE INTELLIGENCE',
        metadata: {
          predictionId: savedPrediction.id,
          product,
          category,
          predictedPrice: prediction.predictedPrice
        }
      }
    });

    return NextResponse.json({
      success: true,
      prediction: {
        ...prediction,
        id: savedPrediction.id
      }
    });

  } catch (error) {
    console.error('Pricing prediction error:', error);
    return NextResponse.json({
      error: 'Failed to generate pricing prediction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
