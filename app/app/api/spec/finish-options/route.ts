
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const material = searchParams.get('material');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (material) {
      where.material = material;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { colorCode: { contains: search, mode: 'insensitive' } }
      ];
    }

    const finishOptions = await prisma.finishOption.findMany({
      where,
      include: {
        glassFinishes: {
          include: {
            glassType: true
          }
        },
        _count: {
          select: {
            specifications: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(finishOptions);
  } catch (error) {
    console.error('Error fetching finish options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch finish options' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const finishOption = await prisma.finishOption.create({
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
        priceMultiplier: data.priceMultiplier || 1.0,
        leadTimeWeeks: data.leadTimeWeeks || 1,
        isStandard: data.isStandard !== false,
        isActive: data.isActive !== false
      }
    });

    return NextResponse.json(finishOption, { status: 201 });
  } catch (error) {
    console.error('Error creating finish option:', error);
    return NextResponse.json(
      { error: 'Failed to create finish option' },
      { status: 500 }
    );
  }
}
