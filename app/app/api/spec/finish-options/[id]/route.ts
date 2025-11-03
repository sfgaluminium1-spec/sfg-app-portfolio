
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
    const finishOption = await prisma.finishOption.findUnique({
      where: { id: id },
      include: {
        glassFinishes: {
          include: {
            glassType: true
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

    if (!finishOption) {
      return NextResponse.json(
        { error: 'Finish option not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(finishOption);
  } catch (error) {
    console.error('Error fetching finish option:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finish option' },
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
    
    const finishOption = await prisma.finishOption.update({
      where: { id: id },
      data: {
        name: data.name,
        category: data.category,
        material: data.material,
        description: data.description,
        colorCode: data.colorCode,
        texture: data.texture,
        finish: data.finish,
        durability: data.durability,
        weatherResistance: data.weatherResistance,
        uvResistance: data.uvResistance,
        maintenanceReq: data.maintenanceReq,
        basePrice: data.basePrice,
        priceMultiplier: data.priceMultiplier,
        leadTimeWeeks: data.leadTimeWeeks,
        isStandard: data.isStandard,
        isActive: data.isActive
      }
    });

    return NextResponse.json(finishOption);
  } catch (error) {
    console.error('Error updating finish option:', error);
    return NextResponse.json(
      { error: 'Failed to update finish option' },
      { status: 500 }
    );
  }
}
