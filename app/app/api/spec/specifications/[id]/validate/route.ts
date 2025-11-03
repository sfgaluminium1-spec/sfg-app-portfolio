
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { validatedBy, validationNotes } = data;

    // Get the specification with all related data
    const specification = await prisma.glassSpecification.findUnique({
      where: { id: id },
      include: {
        glassType: true,
        finishOption: true,
        securityStandards: true,
        complianceRecords: {
          include: {
            standard: true
          }
        }
      }
    });

    if (!specification) {
      return NextResponse.json(
        { error: 'Specification not found' },
        { status: 404 }
      );
    }

    // Perform validation checks
    const validationResults = {
      dimensionsValid: true,
      performanceValid: true,
      securityValid: true,
      complianceValid: true,
      pricingValid: true,
      errors: [] as string[],
      warnings: [] as string[]
    };

    // Check dimensions
    if (specification.width && specification.height) {
      if (specification.width <= 0 || specification.height <= 0) {
        validationResults.dimensionsValid = false;
        validationResults.errors.push('Invalid dimensions: Width and height must be greater than 0');
      }
      
      // Check maximum size limits (example: 3000mm x 2500mm)
      if (specification.width > 3000 || specification.height > 2500) {
        validationResults.warnings.push('Dimensions exceed standard limits - may require special handling');
      }
    }

    // Check performance targets
    if (specification.targetUValue && specification.glassType.uValue) {
      if (specification.glassType.uValue > specification.targetUValue) {
        validationResults.performanceValid = false;
        validationResults.errors.push(`Glass U-value (${specification.glassType.uValue}) exceeds target (${specification.targetUValue})`);
      }
    }

    // Check security requirements
    if (specification.securityRating && specification.glassType.securityRating) {
      const securityLevels = ['STANDARD', 'ENHANCED', 'HIGH_SECURITY', 'MAXIMUM_SECURITY'];
      const requiredLevel = securityLevels.indexOf(specification.securityRating);
      const providedLevel = securityLevels.indexOf(specification.glassType.securityRating);
      
      if (providedLevel < requiredLevel) {
        validationResults.securityValid = false;
        validationResults.errors.push(`Glass security rating insufficient for requirements`);
      }
    }

    // Check compliance status
    const pendingCompliance = specification.complianceRecords.filter(
      (record: any) => record.status === 'PENDING' || record.status === 'NON_COMPLIANT'
    );
    
    if (pendingCompliance.length > 0) {
      validationResults.complianceValid = false;
      validationResults.errors.push(`${pendingCompliance.length} compliance checks pending or failed`);
    }

    // Check pricing
    if (!specification.unitPrice || specification.unitPrice <= 0) {
      validationResults.pricingValid = false;
      validationResults.errors.push('Invalid pricing: Unit price must be specified and greater than 0');
    }

    // Determine overall validation status
    const isValid = validationResults.errors.length === 0;
    const complianceStatus = isValid ? 'COMPLIANT' : 'NON_COMPLIANT';

    // Update specification with validation results
    const updatedSpecification = await prisma.glassSpecification.update({
      where: { id: id },
      data: {
        isValidated: true,
        validatedBy,
        validatedAt: new Date(),
        complianceStatus,
        validationNotes: validationNotes || `Validation completed: ${validationResults.errors.length} errors, ${validationResults.warnings.length} warnings`
      },
      include: {
        glassType: true,
        finishOption: true,
        template: true,
        customer: true,
        quote: true,
        job: true,
        complianceRecords: {
          include: {
            standard: true
          }
        }
      }
    });

    return NextResponse.json({
      specification: updatedSpecification,
      validation: validationResults,
      isValid
    });
  } catch (error) {
    console.error('Error validating specification:', error);
    return NextResponse.json(
      { error: 'Failed to validate specification' },
      { status: 500 }
    );
  }
}
