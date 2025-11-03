
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const glassTypes = await prisma.glassType.findMany({
      where,
      include: {
        finishOptions: {
          include: {
            finishOption: true
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

    return NextResponse.json(glassTypes);
  } catch (error) {
    console.error('Error fetching glass types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch glass types' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const glassType = await prisma.glassType.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        thickness: data.thickness || [],
        uValue: data.uValue,
        gValue: data.gValue,
        lightTransmission: data.lightTransmission,
        soundReduction: data.soundReduction,
        isLaminated: data.isLaminated || false,
        isToughened: data.isToughened || false,
        isFireRated: data.isFireRated || false,
        isSecurityGlass: data.isSecurityGlass || false,
        isLowE: data.isLowE || false,
        securityRating: data.securityRating,
        fireRating: data.fireRating,
        standards: data.standards || [],
        basePrice: data.basePrice,
        pricePerSqm: data.pricePerSqm,
        leadTimeWeeks: data.leadTimeWeeks || 2,
        isActive: data.isActive !== false
      },
      include: {
        finishOptions: {
          include: {
            finishOption: true
          }
        }
      }
    });

    return NextResponse.json(glassType, { status: 201 });
  } catch (error) {
    console.error('Error creating glass type:', error);
    return NextResponse.json(
      { error: 'Failed to create glass type' },
      { status: 500 }
    );
  }
}
