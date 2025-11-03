
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteId, validationType, isValid, notes, validatedBy } = body;

    // Get or create quote validation record
    let validation = await prisma.quoteValidation.findUnique({
      where: { quoteId }
    });

    if (!validation) {
      validation = await prisma.quoteValidation.create({
        data: {
          quoteId,
          productCountCheck: false,
          productCountValid: false,
          priceValidationCheck: false,
          priceValidationValid: false,
          installationPriceCheck: false,
          installationPriceValid: false,
          quoteTypeValidation: false,
          quoteTypeValid: false,
          markupValidation: false,
          markupValid: false,
          allChecksComplete: false,
          validationPassed: false
        }
      });
    }

    // Update specific validation
    const updateData: any = {
      validatedBy,
      validatedAt: new Date()
    };

    switch (validationType) {
      case 'product_count':
        updateData.productCountCheck = true;
        updateData.productCountValid = isValid;
        updateData.productCountNotes = notes;
        break;
      case 'price_validation':
        updateData.priceValidationCheck = true;
        updateData.priceValidationValid = isValid;
        updateData.priceValidationNotes = notes;
        break;
      case 'installation_pricing':
        updateData.installationPriceCheck = true;
        updateData.installationPriceValid = isValid;
        updateData.installationPriceNotes = notes;
        break;
      case 'quote_type':
        updateData.quoteTypeValidation = true;
        updateData.quoteTypeValid = isValid;
        updateData.quoteTypeNotes = notes;
        break;
      case 'markup':
        updateData.markupValidation = true;
        updateData.markupValid = isValid;
        updateData.markupNotes = notes;
        break;
    }

    const updatedValidation = await prisma.quoteValidation.update({
      where: { quoteId },
      data: updateData
    });

    // Check if all required validations are complete
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { validation: true }
    });

    if (quote && quote.validation) {
      const allChecksComplete = 
        quote.validation.productCountCheck &&
        quote.validation.priceValidationCheck &&
        (quote.quoteTypeEnum !== 'SUPPLY_AND_INSTALL' || quote.validation.installationPriceCheck) &&
        quote.validation.quoteTypeValidation &&
        quote.validation.markupValidation;

      const validationPassed = 
        quote.validation.productCountValid &&
        quote.validation.priceValidationValid &&
        (quote.quoteTypeEnum !== 'SUPPLY_AND_INSTALL' || quote.validation.installationPriceValid) &&
        quote.validation.quoteTypeValid &&
        quote.validation.markupValid;

      if (allChecksComplete !== quote.validation.allChecksComplete || 
          validationPassed !== quote.validation.validationPassed) {
        await prisma.quoteValidation.update({
          where: { quoteId },
          data: {
            allChecksComplete,
            validationPassed
          }
        });
      }
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'QUOTE_GENERATED',
        description: `Quote validation: ${validationType} ${isValid ? 'passed' : 'failed'}${notes ? ` - ${notes}` : ''}`,
        user: validatedBy,
        quoteId
      }
    });

    return NextResponse.json(updatedValidation);
  } catch (error) {
    console.error('Quote validation error:', error);
    return NextResponse.json({ error: 'Failed to update validation' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('quoteId');

    if (!quoteId) {
      return NextResponse.json({ error: 'Quote ID required' }, { status: 400 });
    }

    const validation = await prisma.quoteValidation.findUnique({
      where: { quoteId },
      include: {
        quote: {
          include: {
            lineItems: true
          }
        }
      }
    });

    return NextResponse.json(validation);
  } catch (error) {
    console.error('Get quote validation error:', error);
    return NextResponse.json({ error: 'Failed to fetch validation' }, { status: 500 });
  }
}
