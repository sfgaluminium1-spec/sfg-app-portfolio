
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const specification = await prisma.glassSpecification.findUnique({
      where: { id: id },
      include: {
        glassType: {
          include: {
            finishOptions: {
              include: {
                finishOption: true
              }
            }
          }
        },
        finishOption: true,
        template: true,
        customer: true,
        quote: true,
        job: true,
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

    return NextResponse.json(specification);
  } catch (error) {
    console.error('Error fetching specification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specification' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Calculate area if dimensions provided
    let area = data.area;
    if (!area && data.width && data.height) {
      area = (data.width * data.height) / 1000000; // Convert mm² to m²
    }
    
    const specification = await prisma.glassSpecification.update({
      where: { id: id },
      data: {
        name: data.name,
        description: data.description,
        thickness: data.thickness,
        finishOptionId: data.finishOptionId,
        width: data.width,
        height: data.height,
        area: area,
        quantity: data.quantity,
        targetUValue: data.targetUValue,
        targetGValue: data.targetGValue,
        acousticRequirement: data.acousticRequirement,
        securityRating: data.securityRating,
        specialRequirements: data.specialRequirements,
        complianceStatus: data.complianceStatus,
        validationNotes: data.validationNotes,
        unitPrice: data.unitPrice,
        totalPrice: data.totalPrice,
        priceValidUntil: data.priceValidUntil ? new Date(data.priceValidUntil) : null,
        isValidated: data.isValidated,
        validatedBy: data.validatedBy,
        validatedAt: data.isValidated ? new Date() : null
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

    return NextResponse.json(specification);
  } catch (error) {
    console.error('Error updating specification:', error);
    return NextResponse.json(
      { error: 'Failed to update specification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.glassSpecification.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Specification deleted successfully' });
  } catch (error) {
    console.error('Error deleting specification:', error);
    return NextResponse.json(
      { error: 'Failed to delete specification' },
      { status: 500 }
    );
  }
}
