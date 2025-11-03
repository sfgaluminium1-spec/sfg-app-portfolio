
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// AI Project Description Generation API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      entityType, 
      entityId, 
      originalDescription, 
      forceRegenerate = false 
    } = body;

    // Validate input
    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Entity type and ID are required' },
        { status: 400 }
      );
    }

    // Check if AI description already exists
    let existingDescription = null;
    if (entityType === 'QUOTE') {
      existingDescription = await prisma.aIProjectDescription.findUnique({
        where: { quoteId: entityId }
      });
    } else if (entityType === 'JOB') {
      existingDescription = await prisma.aIProjectDescription.findUnique({
        where: { jobId: entityId }
      });
    } else if (entityType === 'ENQUIRY') {
      existingDescription = await prisma.aIProjectDescription.findUnique({
        where: { enquiryId: entityId }
      });
    }

    // Return existing description if found and not forcing regeneration
    if (existingDescription && !forceRegenerate) {
      return NextResponse.json({
        success: true,
        description: existingDescription,
        isNew: false
      });
    }

    // Get entity data for context
    let entityData = null;
    if (entityType === 'QUOTE') {
      entityData = await prisma.quote.findUnique({
        where: { id: entityId },
        include: { lineItems: true }
      });
    } else if (entityType === 'JOB') {
      entityData = await prisma.job.findUnique({
        where: { id: entityId }
      });
    } else if (entityType === 'ENQUIRY') {
      entityData = await prisma.enquiry.findUnique({
        where: { id: entityId }
      });
    }

    if (!entityData) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      );
    }

    // Generate AI description (mock implementation - replace with actual AI service)
    const aiGeneratedDescription = await generateAIDescription(entityData, originalDescription);
    
    // Create or update AI project description
    let aiDescription;
    if (forceRegenerate && existingDescription) {
      aiDescription = await prisma.aIProjectDescription.update({
        where: { id: existingDescription.id },
        data: {
          generatedDescription: aiGeneratedDescription.description,
          projectItemCount: aiGeneratedDescription.itemCount,
          projectScope: aiGeneratedDescription.scope,
          complexityAssessment: aiGeneratedDescription.complexity,
          timelineEstimate: aiGeneratedDescription.timelineWeeks,
          confidence: aiGeneratedDescription.confidence,
          revisionCount: { increment: 1 },
          lastRevised: new Date(),
          revisedBy: 'AI System'
        }
      });
    } else {
      const relationField = 
        entityType === 'QUOTE' ? { quoteId: entityId } :
        entityType === 'JOB' ? { jobId: entityId } :
        { enquiryId: entityId };

      aiDescription = await prisma.aIProjectDescription.create({
        data: {
          originalDescription,
          generatedDescription: aiGeneratedDescription.description,
          projectItemCount: aiGeneratedDescription.itemCount,
          projectScope: aiGeneratedDescription.scope,
          complexityAssessment: aiGeneratedDescription.complexity,
          timelineEstimate: aiGeneratedDescription.timelineWeeks,
          confidence: aiGeneratedDescription.confidence,
          ...relationField
        }
      });
    }

    return NextResponse.json({
      success: true,
      description: aiDescription,
      isNew: !existingDescription || forceRegenerate
    });

  } catch (error) {
    console.error('AI Project Description API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI project description' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Entity type and ID are required' },
        { status: 400 }
      );
    }

    let description = null;
    if (entityType === 'QUOTE') {
      description = await prisma.aIProjectDescription.findUnique({
        where: { quoteId: entityId }
      });
    } else if (entityType === 'JOB') {
      description = await prisma.aIProjectDescription.findUnique({
        where: { jobId: entityId }
      });
    } else if (entityType === 'ENQUIRY') {
      description = await prisma.aIProjectDescription.findUnique({
        where: { enquiryId: entityId }
      });
    }

    return NextResponse.json({
      success: true,
      description
    });

  } catch (error) {
    console.error('Get AI Description Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve AI description' },
      { status: 500 }
    );
  }
}

// Mock AI description generation function
async function generateAIDescription(entityData: any, originalDescription?: string) {
  // This would integrate with actual AI service (OpenAI, etc.)
  // For now, providing a mock implementation
  
  const itemCount = entityData.lineItems?.length || 0;
  const value = entityData.value || 0;
  
  let complexity = 'MODERATE';
  if (value > 50000) complexity = 'HIGHLY_COMPLEX';
  else if (value > 20000) complexity = 'COMPLEX';
  else if (value < 5000) complexity = 'SIMPLE';
  
  const timelineWeeks = Math.ceil(value / 10000) + 2;
  
  const scope = itemCount > 10 ? 'Large-scale project' : 
                itemCount > 5 ? 'Medium-scale project' : 
                'Small-scale project';
  
  const description = `AI-generated description for ${entityData.customerName || entityData.client || 'Customer'} project: ${scope} involving ${itemCount} items with estimated ${timelineWeeks}-week timeline. ${originalDescription ? 'Based on: ' + originalDescription : ''}`;
  
  return {
    description,
    itemCount,
    scope,
    complexity: complexity as 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'HIGHLY_COMPLEX',
    timelineWeeks,
    confidence: 0.85
  };
}
