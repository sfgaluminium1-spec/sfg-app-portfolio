
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface NetPricingRequest {
  grossValue?: number;
  netValue?: number;
  vatRate?: number;
  priceDisplayMode?: string;
  quoteId?: string;
  enquiryId?: string;
  items?: Array<{
    grossPrice?: number;
    netPrice?: number;
    quantity: number;
    description: string;
  }>;
}

interface NetPricingResult {
  grossValue: number;
  netValue: number;
  vatRate: number;
  vatAmount: number;
  priceDisplayMode: string;
  itemsBreakdown?: Array<{
    description: string;
    quantity: number;
    grossPrice: number;
    netPrice: number;
    totalGross: number;
    totalNet: number;
    vatAmount: number;
  }>;
  calculations: {
    conversionFormula: string;
    vatCalculation: string;
    notes: string[];
  };
}

// NET Pricing Calculation Logic
function calculateNetPricing(request: NetPricingRequest): NetPricingResult {
  const { grossValue, netValue, vatRate = 20.0, priceDisplayMode = 'NET_ONLY', items = [] } = request;

  let finalGrossValue = 0;
  let finalNetValue = 0;
  let finalVatAmount = 0;
  const itemsBreakdown: any[] = [];
  const notes: string[] = [];

  // Calculate VAT rate as decimal
  const vatRateDecimal = vatRate / 100;

  // Process individual items if provided
  if (items.length > 0) {
    items.forEach((item: any) => {
      let itemGross = 0;
      let itemNet = 0;

      if (item.grossPrice && !item.netPrice) {
        // Convert from gross to net: Net = Gross / (1 + VAT Rate)
        itemGross = item.grossPrice;
        itemNet = itemGross / (1 + vatRateDecimal);
        notes.push(`Item "${item.description}": Converted gross £${itemGross} to net £${itemNet.toFixed(2)}`);
      } else if (item.netPrice && !item.grossPrice) {
        // Convert from net to gross: Gross = Net * (1 + VAT Rate)
        itemNet = item.netPrice;
        itemGross = itemNet * (1 + vatRateDecimal);
        notes.push(`Item "${item.description}": Converted net £${itemNet} to gross £${itemGross.toFixed(2)}`);
      } else if (item.grossPrice && item.netPrice) {
        // Both provided - validate consistency
        itemGross = item.grossPrice;
        itemNet = item.netPrice;
        const expectedNet = itemGross / (1 + vatRateDecimal);
        if (Math.abs(expectedNet - itemNet) > 0.01) {
          notes.push(`Warning: Item "${item.description}" has inconsistent pricing. Expected net: £${expectedNet.toFixed(2)}, provided: £${itemNet}`);
        }
      } else {
        throw new Error(`Item "${item.description}" must have either gross or net price`);
      }

      const totalGross = itemGross * item.quantity;
      const totalNet = itemNet * item.quantity;
      const vatAmount = totalGross - totalNet;

      itemsBreakdown.push({
        description: item.description,
        quantity: item.quantity,
        grossPrice: itemGross,
        netPrice: itemNet,
        totalGross,
        totalNet,
        vatAmount
      });

      finalGrossValue += totalGross;
      finalNetValue += totalNet;
      finalVatAmount += vatAmount;
    });
  } else {
    // Process overall values
    if (grossValue && !netValue) {
      // Convert from gross to net: Net = Gross / (1 + VAT Rate)
      finalGrossValue = grossValue;
      finalNetValue = grossValue / (1 + vatRateDecimal);
      finalVatAmount = finalGrossValue - finalNetValue;
      notes.push(`Converted gross value £${grossValue} to net £${finalNetValue.toFixed(2)} using VAT rate ${vatRate}%`);
    } else if (netValue && !grossValue) {
      // Convert from net to gross: Gross = Net * (1 + VAT Rate)
      finalNetValue = netValue;
      finalGrossValue = netValue * (1 + vatRateDecimal);
      finalVatAmount = finalGrossValue - finalNetValue;
      notes.push(`Converted net value £${netValue} to gross £${finalGrossValue.toFixed(2)} using VAT rate ${vatRate}%`);
    } else if (grossValue && netValue) {
      // Both provided - validate consistency
      finalGrossValue = grossValue;
      finalNetValue = netValue;
      finalVatAmount = finalGrossValue - finalNetValue;
      
      const expectedNet = grossValue / (1 + vatRateDecimal);
      if (Math.abs(expectedNet - netValue) > 0.01) {
        notes.push(`Warning: Inconsistent pricing detected. Expected net: £${expectedNet.toFixed(2)}, provided: £${netValue}`);
      }
    } else {
      throw new Error('Either gross value or net value must be provided');
    }
  }

  // Round to 2 decimal places
  finalGrossValue = Math.round(finalGrossValue * 100) / 100;
  finalNetValue = Math.round(finalNetValue * 100) / 100;
  finalVatAmount = Math.round(finalVatAmount * 100) / 100;

  return {
    grossValue: finalGrossValue,
    netValue: finalNetValue,
    vatRate,
    vatAmount: finalVatAmount,
    priceDisplayMode,
    itemsBreakdown: items.length > 0 ? itemsBreakdown : undefined,
    calculations: {
      conversionFormula: `Net = Gross ÷ (1 + VAT Rate) | Gross = Net × (1 + VAT Rate)`,
      vatCalculation: `VAT Amount = £${finalVatAmount.toFixed(2)} (${vatRate}% of net value)`,
      notes
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = calculateNetPricing(body);

    // Update quote or enquiry if IDs provided
    if (body.quoteId) {
      await prisma.quote.update({
        where: { id: body.quoteId },
        data: {
          grossValue: result.grossValue,
          netValue: result.netValue,
          vatRate: result.vatRate,
          vatAmount: result.vatAmount,
          value: result.netValue, // Update main value to net value
          isNetPricing: true,
          priceDisplayMode: result.priceDisplayMode as any
        }
      });
    }

    return NextResponse.json({
      success: true,
      pricing: result,
      message: 'NET pricing calculated successfully'
    });

  } catch (error) {
    console.error('NET Pricing Calculation Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to calculate NET pricing',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grossValue = searchParams.get('grossValue');
    const netValue = searchParams.get('netValue');
    const vatRate = searchParams.get('vatRate');

    if (!grossValue && !netValue) {
      return NextResponse.json(
        { success: false, message: 'Either grossValue or netValue is required' },
        { status: 400 }
      );
    }

    const mockRequest: NetPricingRequest = {
      grossValue: grossValue ? parseFloat(grossValue) : undefined,
      netValue: netValue ? parseFloat(netValue) : undefined,
      vatRate: vatRate ? parseFloat(vatRate) : 20.0
    };

    const result = calculateNetPricing(mockRequest);

    return NextResponse.json({
      success: true,
      pricing: result
    });

  } catch (error) {
    console.error('NET Pricing Check Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check NET pricing',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
