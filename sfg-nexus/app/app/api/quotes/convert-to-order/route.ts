
/**
 * API Route: Convert Quote to Order with Truth File Compliance
 * SFG Truth File v1.2.3
 * 
 * NON-NEGOTIABLE: Blocks conversion if required fields or product count is MISSING
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  validateQuoteToOrderConversion,
  canConvertQuoteToOrder,
  getNextPrefix,
  type ProjectFields,
  type ProductCountFields
} from '@/lib/sfg-truth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId } = body;
    
    if (!quoteId) {
      return NextResponse.json(
        { error: 'quoteId is required' },
        { status: 400 }
      );
    }
    
    // Fetch quote
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId }
    });
    
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }
    
    // Prepare fields for validation
    const fields: ProjectFields = {
      BaseNumber: quote.baseNumber,
      Prefix: quote.prefix,
      Customer: quote.sfgCustomer,
      Project: quote.sfgProject,
      Location: quote.sfgLocation,
      ProductType: quote.quoteProductType,
      DeliveryType: quote.sfgDeliveryType,
      ENQ_initial_count: quote.enqInitialCount,
      Current_product_count: quote.currentProductCount
    };
    
    // Validate fields
    const fieldValidation = validateQuoteToOrderConversion(fields);
    
    if (!fieldValidation.valid) {
      return NextResponse.json({
        success: false,
        blocked: true,
        reason: 'MISSING_REQUIRED_FIELDS',
        validation: fieldValidation,
        message: `Cannot convert quote to order. ${fieldValidation.errors.join('. ')}`
      }, { status: 400 });
    }
    
    // Validate product count
    const productCountValidation = canConvertQuoteToOrder({
      ENQ_initial_count: quote.enqInitialCount,
      Current_product_count: quote.currentProductCount
    } as Partial<ProductCountFields>);
    
    if (!productCountValidation.allowed) {
      return NextResponse.json({
        success: false,
        blocked: true,
        reason: 'MISSING_PRODUCT_COUNT',
        message: productCountValidation.reason
      }, { status: 400 });
    }
    
    // All validations passed - create job
    const job = await prisma.job.create({
      data: {
        jobNumber: `${quote.baseNumber}-ORD`,
        baseNumber: quote.baseNumber,
        prefix: 'ORD',
        sfgCustomer: quote.sfgCustomer,
        sfgProject: quote.sfgProject,
        sfgLocation: quote.sfgLocation,
        jobProductType: quote.quoteProductType,
        sfgDeliveryType: quote.sfgDeliveryType,
        enqInitialCount: quote.enqInitialCount,
        currentProductCount: quote.currentProductCount,
        productCountLog: quote.productCountLog,
        canonicalPath: quote.canonicalPath,
        monthShortcutPath: quote.monthShortcutPath,
        quotationApproved: quote.quotationApproved,
        purchaseOrderReceived: quote.purchaseOrderReceived,
        drawingApproved: quote.drawingApproved,
        approvedDocsComplete: quote.approvedDocsComplete,
        missingFields: [],
        dataCompleteness: 100,
        
        // Legacy fields
        client: quote.customerName,
        site: quote.sfgLocation || '',
        description: quote.projectName || '',
        value: quote.value,
        status: 'APPROVED',
        priority: 'MEDIUM',
        quoteId: quote.id,
        customerId: quote.customerId
      }
    });
    
    // Update quote status
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: 'CONVERTED',
        canConvertToOrder: false
      }
    });
    
    return NextResponse.json({
      success: true,
      data: job,
      message: 'Quote successfully converted to order'
    });
  } catch (error: any) {
    console.error('Quote conversion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to convert quote to order' },
      { status: 500 }
    );
  }
}
