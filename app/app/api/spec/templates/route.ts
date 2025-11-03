
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

    const templates = await prisma.specificationTemplate.findMany({
      where,
      include: {
        _count: {
          select: {
            specifications: true
          }
        }
      },
      orderBy: [
        { usageCount: 'desc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const template = await prisma.specificationTemplate.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        defaultGlassType: data.defaultGlassType,
        defaultFinish: data.defaultFinish,
        securityRequirements: data.securityRequirements || {},
        performanceTargets: data.performanceTargets || {},
        validationRules: data.validationRules || {},
        requiredFields: data.requiredFields || [],
        isActive: data.isActive !== false
      }
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
