
/**
 * API Route: Create Enquiry with Truth File Compliance
 * SFG Truth File v1.2.3
 * 
 * Creates an enquiry with full Truth File compliance:
 * - Allocates BaseNumber
 * - Validates required fields
 * - Generates canonical paths
 * - Tracks product count
 * - Identifies MISSING fields
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  allocateBaseNumber,
  validateRequiredFields,
  generateCanonicalPath,
  generateMonthShortcutPath,
  calculateDataCompleteness,
  type ProjectFields,
  type JobPath
} from '@/lib/sfg-truth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Allocate BaseNumber first (immutable)
    const baseNumberResult = await allocateBaseNumber('ENQ');
    
    // Extract fields
    const fields: ProjectFields = {
      BaseNumber: baseNumberResult.baseNumber,
      Prefix: 'ENQ',
      Customer: body.customer || body.customerName,
      Project: body.project || body.projectName,
      Location: body.location,
      ProductType: body.productType,
      DeliveryType: body.deliveryType,
      ENQ_initial_count: body.enqInitialCount ? parseInt(body.enqInitialCount) : null,
      Current_product_count: body.enqInitialCount ? parseInt(body.enqInitialCount) : null
    };
    
    // Validate fields
    const validation = validateRequiredFields(fields);
    const completeness = calculateDataCompleteness(fields);
    
    // Generate paths (will use MISSING for missing fields)
    let canonicalPath = null;
    let monthShortcutPath = null;
    
    if (validation.valid) {
      try {
        const jobPath: JobPath = {
          baseNumber: fields.BaseNumber as string,
          prefix: 'ENQ',
          customer: fields.Customer as string,
          project: fields.Project as string,
          location: fields.Location as string,
          productType: fields.ProductType as string,
          deliveryType: fields.DeliveryType as any
        };
        
        canonicalPath = generateCanonicalPath(jobPath);
        monthShortcutPath = generateMonthShortcutPath();
      } catch (error) {
        console.warn('Path generation skipped due to missing fields:', error);
      }
    }
    
    // Create enquiry with Truth File compliance
    const enquiry = await prisma.enquiry.create({
      data: {
        enquiryNumber: baseNumberResult.fullNumber,
        baseNumber: baseNumberResult.baseNumber,
        prefix: 'ENQ',
        sfgCustomer: fields.Customer as string || 'MISSING',
        sfgProject: fields.Project as string || 'MISSING',
        sfgLocation: fields.Location as string || 'MISSING',
        sfgProductType: fields.ProductType as string || 'MISSING',
        sfgDeliveryType: fields.DeliveryType as string || 'MISSING',
        enqInitialCount: fields.ENQ_initial_count,
        currentProductCount: fields.Current_product_count,
        canonicalPath,
        monthShortcutPath,
        missingFields: validation.missingFields,
        dataCompleteness: completeness,
        
        // Legacy fields
        customerName: body.customerName || 'MISSING',
        contactName: body.contactName,
        email: body.email,
        phone: body.phone,
        company: body.company,
        projectName: body.projectName,
        description: body.description,
        source: body.source || 'Direct',
        status: 'NEW',
        priority: body.priority || 'MEDIUM'
      }
    });
    
    // Return response with validation status
    return NextResponse.json({
      success: true,
      data: enquiry,
      truthFile: {
        baseNumber: baseNumberResult,
        validation,
        completeness,
        paths: { canonicalPath, monthShortcutPath },
        redAlert: validation.missingFields.length > 0
      }
    });
  } catch (error: any) {
    console.error('Enquiry creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}
