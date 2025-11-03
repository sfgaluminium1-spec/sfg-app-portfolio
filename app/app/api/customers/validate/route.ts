
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// POST /api/customers/validate - Validate customer information
export async function POST(request: NextRequest) {
  try {
    const { customerId, validationType, isValid, notes, validatedBy } = await request.json();

    // Get customer validation record
    let validation = await prisma.customerValidation.findUnique({
      where: { customerId }
    });

    if (!validation) {
      // Create validation record if it doesn't exist
      validation = await prisma.customerValidation.create({
        data: { customerId }
      });
    }

    // Update specific validation
    const updateData: any = {};
    const now = new Date();

    switch (validationType) {
      case 'email':
        updateData.emailValidation = isValid ? 'VALIDATED' : 'FAILED';
        updateData.emailValidatedAt = now;
        updateData.emailValidationNotes = notes;
        break;
      case 'phone':
        updateData.phoneValidation = isValid ? 'VALIDATED' : 'FAILED';
        updateData.phoneValidatedAt = now;
        updateData.phoneValidationNotes = notes;
        break;
      case 'address':
        updateData.addressValidation = isValid ? 'VALIDATED' : 'FAILED';
        updateData.addressValidatedAt = now;
        updateData.addressValidationNotes = notes;
        break;
      case 'business':
        updateData.businessValidation = isValid ? 'VALIDATED' : 'FAILED';
        updateData.businessValidatedAt = now;
        updateData.businessValidationNotes = notes;
        break;
    }

    // Update validation record
    const updatedValidation = await prisma.customerValidation.update({
      where: { customerId },
      data: updateData
    });

    // Check if all validations are complete
    const allValidated = [
      updatedValidation.emailValidation,
      updatedValidation.phoneValidation,
      updatedValidation.addressValidation,
      updatedValidation.businessValidation
    ].every(status => status === 'VALIDATED' || status === 'SKIPPED' || status === 'FAILED');

    if (allValidated && updatedValidation.overallStatus === 'PENDING') {
      await prisma.customerValidation.update({
        where: { customerId },
        data: {
          overallStatus: 'VALIDATED',
          validatedBy,
          validatedAt: now
        }
      });

      // Update customer validation flags
      await prisma.customer.update({
        where: { id: customerId },
        data: {
          emailValidated: updatedValidation.emailValidation === 'VALIDATED',
          phoneValidated: updatedValidation.phoneValidation === 'VALIDATED',
          addressValidated: updatedValidation.addressValidation === 'VALIDATED'
        }
      });

      // Create activity
      await prisma.customerActivity.create({
        data: {
          customerId,
          activityType: 'VALIDATION_COMPLETED',
          description: 'Customer validation completed',
          performedBy: validatedBy || 'System',
          source: 'SYSTEM'
        }
      });
    }

    return NextResponse.json(updatedValidation);

  } catch (error) {
    console.error('Error validating customer:', error);
    return NextResponse.json(
      { error: 'Failed to validate customer' },
      { status: 500 }
    );
  }
}
