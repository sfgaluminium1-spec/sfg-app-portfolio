
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; analysisId: string }> }
) {
  try {
    const { id: jobId, analysisId } = await params;
    const body = await request.json();
    const { approvedBy, approvalNotes } = body;

    const analysis = await prisma.materialsAnalysis.update({
      where: { id: analysisId },
      data: {
        approved: true,
        approvedAt: new Date(),
        approvedBy,
        approvalNotes
      }
    });

    // Auto-generate order items from materials analysis
    if (analysis.materialsData) {
      await generateOrderItemsFromAnalysis(jobId, analysisId, analysis.materialsData);
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'JOB_UPDATED',
        description: `Materials analysis approved by ${approvedBy}`,
        user: approvedBy,
        jobId
      }
    });

    return NextResponse.json({ 
      analysis, 
      message: 'Materials analysis approved successfully' 
    });
  } catch (error) {
    console.error('Materials analysis approval error:', error);
    return NextResponse.json({ error: 'Failed to approve materials analysis' }, { status: 500 });
  }
}

async function generateOrderItemsFromAnalysis(jobId: string, analysisId: string, materialsData: any) {
  try {
    const orderItems = [];

    // Process each material category
    for (const [category, items] of Object.entries(materialsData)) {
      if (Array.isArray(items)) {
        for (const item of items) {
          const orderItem = await prisma.orderItem.create({
            data: {
              jobId,
              materialsAnalysisId: analysisId,
              itemName: item.type || item.name || 'Unknown Item',
              itemDescription: `${category} - ${JSON.stringify(item)}`,
              category: category.replace('_', ' ').toUpperCase(),
              specifications: item,
              quantity: item.quantity || 1,
              unit: item.unit || 'PCS',
              status: 'PENDING'
            }
          });
          orderItems.push(orderItem);
        }
      }
    }

    return orderItems;
  } catch (error) {
    console.error('Error generating order items:', error);
    return [];
  }
}
