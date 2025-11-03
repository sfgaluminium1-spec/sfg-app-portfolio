
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;

    const materialsAnalysis = await prisma.materialsAnalysis.findMany({
      where: { jobId },
      include: {
        drawingApproval: true,
        orderItems: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ materialsAnalysis });
  } catch (error) {
    console.error('Materials analysis API error:', error);
    return NextResponse.json({ error: 'Failed to fetch materials analysis' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;
    const body = await request.json();

    const analysis = await prisma.materialsAnalysis.create({
      data: {
        jobId,
        drawingApprovalId: body.drawingApprovalId,
        analysisType: body.analysisType || 'DRAWING_BASED',
        status: 'PENDING'
      }
    });

    // Start automated analysis process
    if (body.autoAnalyze) {
      await performMaterialsAnalysis(analysis.id, body.drawingData);
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Create materials analysis error:', error);
    return NextResponse.json({ error: 'Failed to create materials analysis' }, { status: 500 });
  }
}

async function performMaterialsAnalysis(analysisId: string, drawingData?: any) {
  try {
    // Simulate materials extraction from drawings
    const mockMaterialsData = {
      aluminium_profiles: [
        { type: 'Window Frame', quantity: 12, size: '2000x1500mm', grade: '6063-T6' },
        { type: 'Door Frame', quantity: 4, size: '2100x900mm', grade: '6063-T6' }
      ],
      glass_panels: [
        { type: 'Double Glazed', quantity: 16, size: '1800x1200mm', thickness: '24mm' },
        { type: 'Single Glazed', quantity: 4, size: '800x600mm', thickness: '6mm' }
      ],
      hardware: [
        { type: 'Window Handles', quantity: 12, specification: 'Chrome finish' },
        { type: 'Door Locks', quantity: 4, specification: 'Multi-point locking' }
      ],
      sealants: [
        { type: 'Structural Glazing', quantity: 50, unit: 'meters' },
        { type: 'Weather Seal', quantity: 100, unit: 'meters' }
      ]
    };

    // Simulate cost analysis
    const mockCostBreakdown = {
      aluminium_profiles: 2500.00,
      glass_panels: 3200.00,
      hardware: 800.00,
      sealants: 150.00,
      total: 6650.00
    };

    // Simulate supplier recommendations
    const mockSupplierRecommendations = {
      aluminium_profiles: [
        { supplier: 'Aluminium Direct Ltd', price: 2500.00, leadTime: 7, rating: 4.5 },
        { supplier: 'Profile Solutions', price: 2650.00, leadTime: 5, rating: 4.8 }
      ],
      glass_panels: [
        { supplier: 'Guardian Glass', price: 3200.00, leadTime: 10, rating: 4.7 },
        { supplier: 'Pilkington', price: 3350.00, leadTime: 8, rating: 4.6 }
      ]
    };

    // Update analysis with results
    await prisma.materialsAnalysis.update({
      where: { id: analysisId },
      data: {
        status: 'COMPLETED',
        drawingAnalyzed: true,
        drawingAnalyzedAt: new Date(),
        drawingAnalyzedBy: 'AI System',
        materialsExtracted: true,
        materialsExtractedAt: new Date(),
        materialsData: mockMaterialsData,
        costAnalyzed: true,
        costAnalyzedAt: new Date(),
        totalMaterialsCost: mockCostBreakdown.total,
        costBreakdown: mockCostBreakdown,
        suppliersMatched: true,
        suppliersMatchedAt: new Date(),
        supplierRecommendations: mockSupplierRecommendations,
        stockChecked: true,
        stockCheckedAt: new Date(),
        stockAvailability: { inStock: 85, partialStock: 10, outOfStock: 5 },
        leadTimesCalculated: true,
        leadTimesCalculatedAt: new Date(),
        estimatedLeadTime: 14,
        leadTimeBreakdown: {
          aluminium: 7,
          glass: 10,
          hardware: 3,
          sealants: 2
        }
      }
    });

    return true;
  } catch (error) {
    console.error('Materials analysis error:', error);
    return false;
  }
}
