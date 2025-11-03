
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
    const glassType = await prisma.glassType.findUnique({
      where: { id: id },
      include: {
        finishOptions: {
          include: {
            finishOption: true
          }
        },
        specifications: {
          include: {
            customer: true,
            quote: true,
            job: true
          },
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            specifications: true
          }
        }
      }
    });

    if (!glassType) {
      return NextResponse.json(
        { error: 'Glass type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(glassType);
  } catch (error) {
    console.error('Error fetching glass type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch glass type' },
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
    
    const glassType = await prisma.glassType.update({
      where: { id: id },
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        thickness: data.thickness,
        uValue: data.uValue,
        gValue: data.gValue,
        lightTransmission: data.lightTransmission,
        soundReduction: data.soundReduction,
        isLaminated: data.isLaminated,
        isToughened: data.isToughened,
        isFireRated: data.isFireRated,
        isSecurityGlass: data.isSecurityGlass,
        isLowE: data.isLowE,
        securityRating: data.securityRating,
        fireRating: data.fireRating,
        standards: data.standards,
        basePrice: data.basePrice,
        pricePerSqm: data.pricePerSqm,
        leadTimeWeeks: data.leadTimeWeeks,
        isActive: data.isActive
      },
      include: {
        finishOptions: {
          include: {
            finishOption: true
          }
        }
      }
    });

    return NextResponse.json(glassType);
  } catch (error) {
    console.error('Error updating glass type:', error);
    return NextResponse.json(
      { error: 'Failed to update glass type' },
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
    await prisma.glassType.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Glass type deleted successfully' });
  } catch (error) {
    console.error('Error deleting glass type:', error);
    return NextResponse.json(
      { error: 'Failed to delete glass type' },
      { status: 500 }
    );
  }
}
