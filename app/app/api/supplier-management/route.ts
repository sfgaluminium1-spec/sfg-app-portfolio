
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SupplierPricingRequest {
  systemSupplier: string;
  productType?: string;
  basePrice: number;
  quantity?: number;
  customerType?: string;
  projectComplexity?: string;
}

interface SupplierPricingResult {
  supplierName: string;
  basePrice: number;
  supplierMarkup: number;
  adjustedPrice: number;
  deliveryCost: number;
  totalPrice: number;
  leadTimeWeeks: number;
  pricingRules: any;
  recommendations: string[];
}

// System Supplier Pricing Logic
function calculateSupplierPricing(request: SupplierPricingRequest): SupplierPricingResult {
  const { systemSupplier, productType, basePrice, quantity = 1, customerType, projectComplexity } = request;

  let supplierMarkup = 0;
  let deliveryCost = 0;
  let leadTimeWeeks = 4;
  let supplierName = '';
  const recommendations: string[] = [];
  const pricingRules: any = {};

  switch (systemSupplier) {
    case 'SENIOR_ARCHITECTURAL':
      supplierName = 'Senior Architectural Systems';
      supplierMarkup = 15; // 15% markup for Senior systems
      leadTimeWeeks = 6;
      deliveryCost = basePrice > 5000 ? 0 : 150; // Free delivery over £5000
      pricingRules.minimumOrder = 500;
      pricingRules.volumeDiscount = quantity > 50 ? 5 : 0; // 5% discount for large quantities
      recommendations.push('Premium system with excellent thermal performance');
      recommendations.push('Suitable for high-end commercial projects');
      if (basePrice > 10000) recommendations.push('Consider extended warranty options');
      break;

    case 'KESTRAL_SYSTEMS':
      supplierName = 'Kestral Aluminium Systems';
      supplierMarkup = 12; // 12% markup for Kestral
      leadTimeWeeks = 4;
      deliveryCost = basePrice > 3000 ? 0 : 120; // Free delivery over £3000
      pricingRules.minimumOrder = 300;
      pricingRules.volumeDiscount = quantity > 30 ? 3 : 0; // 3% discount for medium quantities
      recommendations.push('Good balance of quality and value');
      recommendations.push('Reliable delivery times');
      if (customerType === 'commercial') recommendations.push('Suitable for most commercial applications');
      break;

    case 'JACK_ALUMINIUM':
      supplierName = 'Jack Aluminium';
      supplierMarkup = 10; // 10% markup for Jack
      leadTimeWeeks = 3;
      deliveryCost = basePrice > 2000 ? 0 : 100; // Free delivery over £2000
      pricingRules.minimumOrder = 200;
      pricingRules.volumeDiscount = quantity > 20 ? 2 : 0; // 2% discount for smaller quantities
      recommendations.push('Cost-effective solution');
      recommendations.push('Fast delivery times');
      if (customerType === 'residential') recommendations.push('Good for residential projects');
      break;

    case 'SFG_FABRICATION':
      supplierName = 'SFG In-House Fabrication';
      supplierMarkup = 25; // 25% markup for in-house fabrication
      leadTimeWeeks = 2;
      deliveryCost = 0; // No delivery cost for in-house
      pricingRules.minimumOrder = 100;
      pricingRules.qualityControl = 'Full in-house quality control';
      recommendations.push('Maximum quality control');
      recommendations.push('Fastest delivery times');
      recommendations.push('Complete project oversight');
      break;

    case 'OTHER_SYSTEM':
      supplierName = 'Alternative System Supplier';
      supplierMarkup = 20; // 20% markup for other systems
      leadTimeWeeks = 5;
      deliveryCost = 200; // Standard delivery cost
      pricingRules.minimumOrder = 1000;
      pricingRules.requiresSpecialQuote = true;
      recommendations.push('Specialist system - requires detailed quotation');
      recommendations.push('Extended lead time may apply');
      break;

    case 'MIXED_SUPPLIERS':
      supplierName = 'Mixed Supplier Solution';
      supplierMarkup = 18; // 18% average markup
      leadTimeWeeks = 5;
      deliveryCost = 150;
      pricingRules.complexityFactor = 'Additional coordination required';
      recommendations.push('Optimized supplier mix for best value');
      recommendations.push('Requires careful project coordination');
      recommendations.push('May extend overall lead time');
      break;

    case 'CUSTOMER_SUPPLIED':
      supplierName = 'Customer Supplied Materials';
      supplierMarkup = 0; // No markup on customer supplied
      leadTimeWeeks = 1; // Quick turnaround for labor only
      deliveryCost = 0;
      pricingRules.laborOnly = true;
      pricingRules.warrantyLimitations = 'Warranty limited to installation only';
      recommendations.push('Labor-only pricing');
      recommendations.push('Customer responsible for material quality');
      recommendations.push('Limited warranty coverage');
      break;

    default:
      supplierName = 'To Be Determined';
      supplierMarkup = 15;
      leadTimeWeeks = 4;
      deliveryCost = 100;
      recommendations.push('Supplier to be selected based on final requirements');
      break;
  }

  // Apply project complexity adjustments
  if (projectComplexity === 'Complex' || projectComplexity === 'Highly Complex') {
    supplierMarkup += 5; // Additional 5% for complex projects
    leadTimeWeeks += 1;
    recommendations.push('Additional time and cost for complex installation');
  }

  // Apply volume discounts
  const volumeDiscount = pricingRules.volumeDiscount || 0;
  const markupAfterDiscount = supplierMarkup - volumeDiscount;

  // Calculate final pricing
  const adjustedPrice = basePrice * (1 + markupAfterDiscount / 100);
  const totalPrice = adjustedPrice + deliveryCost;

  return {
    supplierName,
    basePrice,
    supplierMarkup: markupAfterDiscount,
    adjustedPrice,
    deliveryCost,
    totalPrice,
    leadTimeWeeks,
    pricingRules,
    recommendations
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, enquiryId, ...pricingRequest } = body;

    if (!pricingRequest.systemSupplier || !pricingRequest.basePrice) {
      return NextResponse.json(
        { success: false, message: 'systemSupplier and basePrice are required' },
        { status: 400 }
      );
    }

    // Calculate supplier pricing
    const result = calculateSupplierPricing(pricingRequest);

    // Update quote or enquiry if IDs provided
    if (quoteId) {
      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          systemSupplier: pricingRequest.systemSupplier as any,
          supplierSpecific: true,
          supplierPricing: JSON.parse(JSON.stringify(result)),
          supplierMarkup: result.supplierMarkup,
          supplierNotes: `${result.supplierName} - ${result.recommendations.join('; ')}`
        }
      });
    }

    if (enquiryId) {
      await prisma.enquiry.update({
        where: { id: enquiryId },
        data: {
          systemSupplier: pricingRequest.systemSupplier as any,
          supplierSpecific: true,
          supplierNotes: `${result.supplierName} - Lead time: ${result.leadTimeWeeks} weeks`
        }
      });
    }

    return NextResponse.json({
      success: true,
      supplierPricing: result,
      message: 'Supplier pricing calculated successfully'
    });

  } catch (error) {
    console.error('Supplier Pricing Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to calculate supplier pricing',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const systemSupplier = searchParams.get('systemSupplier');
    const includeRules = searchParams.get('includeRules') === 'true';

    if (systemSupplier) {
      // Get pricing information for specific supplier
      const mockRequest = {
        systemSupplier,
        basePrice: 1000, // Mock base price for calculation
        quantity: 1,
        productType: 'windows',
        customerType: 'commercial'
      };

      const result = calculateSupplierPricing(mockRequest);

      return NextResponse.json({
        success: true,
        supplier: {
          name: result.supplierName,
          markupPercentage: result.supplierMarkup,
          leadTimeWeeks: result.leadTimeWeeks,
          pricingRules: includeRules ? result.pricingRules : undefined,
          recommendations: result.recommendations
        }
      });
    } else {
      // Get all available suppliers
      const suppliers = [
        {
          code: 'SENIOR_ARCHITECTURAL',
          name: 'Senior Architectural Systems',
          markup: 15,
          leadTime: 6,
          description: 'Premium aluminum systems'
        },
        {
          code: 'KESTRAL_SYSTEMS',
          name: 'Kestral Aluminium Systems',
          markup: 12,
          leadTime: 4,
          description: 'Quality and value balance'
        },
        {
          code: 'JACK_ALUMINIUM',
          name: 'Jack Aluminium',
          markup: 10,
          leadTime: 3,
          description: 'Cost-effective solutions'
        },
        {
          code: 'SFG_FABRICATION',
          name: 'SFG In-House Fabrication',
          markup: 25,
          leadTime: 2,
          description: 'Maximum quality control'
        },
        {
          code: 'OTHER_SYSTEM',
          name: 'Alternative System Supplier',
          markup: 20,
          leadTime: 5,
          description: 'Specialist systems'
        },
        {
          code: 'MIXED_SUPPLIERS',
          name: 'Mixed Supplier Solution',
          markup: 18,
          leadTime: 5,
          description: 'Optimized supplier mix'
        },
        {
          code: 'CUSTOMER_SUPPLIED',
          name: 'Customer Supplied Materials',
          markup: 0,
          leadTime: 1,
          description: 'Labor-only solution'
        }
      ];

      return NextResponse.json({
        success: true,
        suppliers
      });
    }

  } catch (error) {
    console.error('Supplier Management Fetch Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch supplier information',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
