
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AIDescriptionRequest {
  originalDescription: string;
  entityType: 'ENQUIRY' | 'QUOTE' | 'JOB';
  entityId: string;
  improvementType?: string;
  productCategory?: string;
  customerType?: string;
  includeResearch?: boolean;
  includeCostSpec?: boolean;
}

// AI Description Enhancement Logic (Mock Implementation)
function enhanceDescription(request: AIDescriptionRequest) {
  const { originalDescription, improvementType = 'GENERAL_ENHANCEMENT', productCategory, customerType, includeResearch, includeCostSpec } = request;

  // Mock AI enhancement based on improvement type
  let improvedDescription = originalDescription;
  const improvements: string[] = [];
  let researchSources: any[] = [];
  let costSpecAccuracy = 0;

  switch (improvementType) {
    case 'TECHNICAL_ACCURACY':
      improvedDescription = enhanceTechnicalAccuracy(originalDescription);
      improvements.push('Enhanced technical specifications', 'Added relevant standards', 'Clarified installation requirements');
      costSpecAccuracy = 0.85;
      break;

    case 'COST_SPECIFICATION':
      improvedDescription = enhanceCostSpecification(originalDescription);
      improvements.push('Added detailed cost breakdown', 'Specified material quantities', 'Included labor estimates');
      costSpecAccuracy = 0.92;
      break;

    case 'CLARITY_IMPROVEMENT':
      improvedDescription = improveClarityAndStructure(originalDescription);
      improvements.push('Improved readability', 'Better paragraph structure', 'Clearer terminology');
      costSpecAccuracy = 0.75;
      break;

    case 'PROFESSIONAL_TONE':
      improvedDescription = enhanceProfessionalTone(originalDescription);
      improvements.push('Professional language', 'Industry-appropriate terminology', 'Confident presentation');
      costSpecAccuracy = 0.80;
      break;

    case 'DETAIL_EXPANSION':
      improvedDescription = expandDetails(originalDescription, productCategory);
      improvements.push('Added comprehensive details', 'Included specifications', 'Enhanced scope description');
      costSpecAccuracy = 0.88;
      break;

    case 'RESEARCH_INTEGRATION':
      const researchResult = integrateResearch(originalDescription, productCategory);
      improvedDescription = researchResult.description;
      researchSources = researchResult.sources;
      improvements.push('Integrated market research', 'Added industry best practices', 'Referenced standards');
      costSpecAccuracy = 0.95;
      break;

    default: // GENERAL_ENHANCEMENT
      improvedDescription = generalEnhancement(originalDescription, productCategory, customerType);
      improvements.push('Overall improvement', 'Better structure', 'Enhanced clarity');
      costSpecAccuracy = 0.82;
      break;
  }

  return {
    improvedDescription,
    improvements,
    researchSources: includeResearch ? researchSources : [],
    costSpecAccuracy: includeCostSpec ? costSpecAccuracy : undefined,
    processingTime: Math.random() * 2 + 1, // Mock 1-3 seconds
    confidenceScore: Math.random() * 0.3 + 0.7 // Mock 70-100% confidence
  };
}

function enhanceTechnicalAccuracy(description: string): string {
  // Mock technical enhancement
  let enhanced = description;

  // Add technical specifications if missing
  if (!enhanced.toLowerCase().includes('specification')) {
    enhanced += '\n\nTechnical Specifications:\n- Material: High-grade aluminum extrusion\n- Glass: Double glazed units with thermal break\n- Hardware: Multi-point locking system\n- Performance: Meets current building regulations';
  }

  // Add installation requirements
  if (!enhanced.toLowerCase().includes('installation')) {
    enhanced += '\n\nInstallation Requirements:\n- Professional installation required\n- Site survey recommended\n- Building regulation compliance checked\n- Quality assurance testing included';
  }

  return enhanced;
}

function enhanceCostSpecification(description: string): string {
  // Mock cost specification enhancement
  let enhanced = description;

  enhanced += '\n\nDetailed Cost Breakdown:\n';
  enhanced += '• Materials: High-quality aluminum profiles and fittings\n';
  enhanced += '• Glass Units: Energy-efficient double glazing\n';
  enhanced += '• Hardware: Security locks and operating mechanisms\n';
  enhanced += '• Installation: Professional fitting and finishing\n';
  enhanced += '• Quality Control: Pre-delivery inspection and testing\n';
  enhanced += '• Warranty: Comprehensive manufacturer and installation guarantees';

  return enhanced;
}

function improveClarityAndStructure(description: string): string {
  // Mock clarity improvement
  const sentences = description.split(/[.!?]+/).filter((s: any) => s.trim());
  
  let enhanced = 'Project Overview:\n';
  enhanced += sentences[0]?.trim() + '.\n\n';
  
  enhanced += 'Scope of Work:\n';
  for (let i = 1; i < sentences.length; i++) {
    enhanced += `• ${sentences[i].trim()}\n`;
  }
  
  enhanced += '\nKey Benefits:\n';
  enhanced += '• Enhanced security and energy efficiency\n';
  enhanced += '• Professional installation and finish\n';
  enhanced += '• Full compliance with building regulations\n';
  enhanced += '• Comprehensive warranty coverage';

  return enhanced;
}

function enhanceProfessionalTone(description: string): string {
  // Mock professional tone enhancement
  let enhanced = description;
  
  // Replace casual language with professional terms
  enhanced = enhanced.replace(/\bwindows?\b/gi, 'glazing systems');
  enhanced = enhanced.replace(/\bdoors?\b/gi, 'entrance solutions');
  enhanced = enhanced.replace(/\bfix\b/gi, 'install');
  enhanced = enhanced.replace(/\bcheap\b/gi, 'cost-effective');
  enhanced = enhanced.replace(/\bquick\b/gi, 'efficient');
  
  // Add professional opening if not present
  if (!enhanced.startsWith('We propose') && !enhanced.startsWith('This quotation')) {
    enhanced = 'We propose to supply and install ' + enhanced.toLowerCase();
  }

  return enhanced;
}

function expandDetails(description: string, productCategory?: string): string {
  // Mock detail expansion based on product category
  let enhanced = description;

  const categoryDetails: { [key: string]: string } = {
    'windows': '\n\nWindow Specifications:\n- Frame material: Thermally broken aluminum\n- Glass specification: 24mm double glazed units\n- Operating mechanism: Multi-point locking\n- Weather sealing: EPDM gaskets\n- Finish options: Powder coated in choice of colors',
    
    'doors': '\n\nDoor Specifications:\n- Security rating: PAS24 compliant\n- Lock system: Multi-point high security\n- Threshold: Low profile with weather seal\n- Glass options: Laminated safety glass available\n- Access control: Optional keypad or card reader',
    
    'curtain_wall': '\n\nCurtain Wall System:\n- Structural glazing system\n- High performance thermal break\n- Weather seal integrity testing\n- Structural calculations and wind load analysis\n- Installation by certified specialists'
  };

  if (productCategory && categoryDetails[productCategory.toLowerCase()]) {
    enhanced += categoryDetails[productCategory.toLowerCase()];
  } else {
    // Generic detail expansion
    enhanced += '\n\nDetailed Specifications:\n';
    enhanced += '• High-performance aluminum systems\n';
    enhanced += '• Energy-efficient glazing solutions\n';
    enhanced += '• Professional installation service\n';
    enhanced += '• Quality assurance and testing\n';
    enhanced += '• Comprehensive warranty package';
  }

  return enhanced;
}

function integrateResearch(description: string, productCategory?: string): { description: string; sources: any[] } {
  // Mock research integration
  let enhanced = description;
  
  enhanced += '\n\nIndustry Research Integration:\n';
  enhanced += '• Current market standards exceed basic building regulation requirements\n';
  enhanced += '• Energy efficiency improvements can reduce heating costs by up to 30%\n';
  enhanced += '• Modern security features deter 95% of opportunistic break-in attempts\n';
  enhanced += '• Professional installation ensures optimal performance and warranty validity';

  const mockSources = [
    {
      source: 'Building Research Establishment (BRE)',
      reference: 'Energy Efficiency in Commercial Buildings 2024',
      relevance: 'thermal performance standards'
    },
    {
      source: 'Glass and Glazing Federation (GGF)',
      reference: 'Installation Best Practices Guide',
      relevance: 'installation quality standards'
    },
    {
      source: 'Secured by Design',
      reference: 'Commercial Security Standards',
      relevance: 'security requirements and testing'
    }
  ];

  return {
    description: enhanced,
    sources: mockSources
  };
}

function generalEnhancement(description: string, productCategory?: string, customerType?: string): string {
  // Mock general enhancement
  let enhanced = improveClarityAndStructure(description);
  enhanced = enhanceProfessionalTone(enhanced);
  
  // Add customer-specific content
  if (customerType === 'commercial') {
    enhanced += '\n\nCommercial Benefits:\n';
    enhanced += '• Improved building performance and value\n';
    enhanced += '• Reduced maintenance requirements\n';
    enhanced += '• Enhanced occupant comfort and productivity\n';
    enhanced += '• Compliance with current building standards';
  } else if (customerType === 'residential') {
    enhanced += '\n\nResidential Benefits:\n';
    enhanced += '• Enhanced home security and comfort\n';
    enhanced += '• Improved energy efficiency and lower bills\n';
    enhanced += '• Increased property value\n';
    enhanced += '• Long-term durability and low maintenance';
  }

  return enhanced;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const aiRequest = body as AIDescriptionRequest;

    if (!aiRequest.originalDescription || !aiRequest.entityType || !aiRequest.entityId) {
      return NextResponse.json(
        { success: false, message: 'originalDescription, entityType, and entityId are required' },
        { status: 400 }
      );
    }

    // Process AI enhancement
    const result = enhanceDescription(aiRequest);

    // Save suggestion to database
    const suggestion = await prisma.aIDescriptionSuggestion.create({
      data: {
        originalDescription: aiRequest.originalDescription,
        improvedDescription: result.improvedDescription,
        improvementType: aiRequest.improvementType as any || 'GENERAL_ENHANCEMENT',
        processingTime: result.processingTime,
        confidenceScore: result.confidenceScore,
        entityType: aiRequest.entityType,
        entityId: aiRequest.entityId,
        productCategory: aiRequest.productCategory,
        customerType: aiRequest.customerType,
        hasResearchData: aiRequest.includeResearch || false,
        researchSources: result.researchSources,
        costSpecAccuracy: result.costSpecAccuracy
      }
    });

    return NextResponse.json({
      success: true,
      suggestion: {
        id: suggestion.id,
        originalDescription: suggestion.originalDescription,
        improvedDescription: suggestion.improvedDescription,
        improvementType: suggestion.improvementType,
        improvements: result.improvements,
        researchSources: result.researchSources,
        costSpecAccuracy: result.costSpecAccuracy,
        processingTime: result.processingTime,
        confidenceScore: result.confidenceScore
      },
      message: 'AI description enhancement completed successfully'
    });

  } catch (error) {
    console.error('AI Description Enhancement Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to enhance description with AI',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const entityType = searchParams.get('entityType');

    if (entityId && entityType) {
      // Get suggestions for specific entity
      const suggestions = await prisma.aIDescriptionSuggestion.findMany({
        where: {
          entityId,
          entityType
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        suggestions
      });
    } else {
      // Get recent suggestions
      const recentSuggestions = await prisma.aIDescriptionSuggestion.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      // Get usage statistics
      const stats = await prisma.aIDescriptionSuggestion.groupBy({
        by: ['improvementType'],
        _count: { id: true },
        _avg: { confidenceScore: true, userRating: true }
      });

      return NextResponse.json({
        success: true,
        recent: recentSuggestions,
        statistics: stats
      });
    }

  } catch (error) {
    console.error('AI Description Fetch Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch AI suggestions',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { suggestionId, action, rating, feedback } = body;

    if (!suggestionId || !action) {
      return NextResponse.json(
        { success: false, message: 'suggestionId and action are required' },
        { status: 400 }
      );
    }

    if (action === 'apply') {
      // Mark suggestion as applied
      await prisma.aIDescriptionSuggestion.update({
        where: { id: suggestionId },
        data: {
          wasApplied: true,
          appliedBy: 'User', // In real implementation, get from session
          appliedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: 'AI suggestion applied successfully'
      });

    } else if (action === 'rate') {
      // Rate the suggestion
      await prisma.aIDescriptionSuggestion.update({
        where: { id: suggestionId },
        data: {
          userRating: rating,
          userFeedback: feedback
        }
      });

      return NextResponse.json({
        success: true,
        message: 'AI suggestion rated successfully'
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('AI Description Update Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update AI suggestion',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
