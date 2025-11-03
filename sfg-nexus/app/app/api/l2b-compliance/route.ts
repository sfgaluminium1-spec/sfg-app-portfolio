
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface L2BAssessmentRequest {
  buildingType: string;
  floorArea?: number;
  buildingAge?: string;
  conservationArea?: boolean;
  listedBuilding?: boolean;
  buildingUsage?: string;
}

interface L2BAssessmentResult {
  complianceRequired: boolean;
  complianceStatus: string;
  exemptionReason?: string;
  assessmentNotes: string;
  regulationReference: string;
  nextSteps: string[];
}

// L2B Building Regulation Assessment Logic
function assessL2BCompliance(assessment: L2BAssessmentRequest): L2BAssessmentResult {
  const { buildingType, floorArea, buildingAge, conservationArea, listedBuilding, buildingUsage } = assessment;

  // Check for explicit exemptions first
  if (listedBuilding) {
    return {
      complianceRequired: false,
      complianceStatus: 'EXEMPT_LISTED_BUILDING',
      exemptionReason: 'Listed building - compliance would unacceptably alter character or appearance',
      assessmentNotes: 'Building is listed under Planning (Listed Buildings and Conservation Areas) Act 1990. L2B requirements do not apply where compliance would unacceptably alter the character or appearance.',
      regulationReference: 'Regulation 21(a)(i) - Listed Buildings Exemption',
      nextSteps: [
        'Document listed building status',
        'Consider alternative energy efficiency measures that preserve character',
        'Consult with conservation officer if any doubt'
      ]
    };
  }

  if (conservationArea) {
    return {
      complianceRequired: false,
      complianceStatus: 'EXEMPT_CONSERVATION_AREA',
      exemptionReason: 'Building in conservation area - compliance would unacceptably alter character or appearance',
      assessmentNotes: 'Building is in a conservation area designated under section 69 of the Planning (Listed Buildings and Conservation Areas) Act 1990. L2B requirements may not apply if compliance would unacceptably alter character or appearance.',
      regulationReference: 'Regulation 21(a)(ii) - Conservation Area Exemption',
      nextSteps: [
        'Document conservation area status',
        'Assess whether compliance would alter character',
        'Consider conservation-friendly energy efficiency measures'
      ]
    };
  }

  // Check for building type exemptions
  const exemptBuildingTypes = [
    'PLACE_OF_WORSHIP',
    'TEMPORARY_BUILDING',
    'AGRICULTURAL_BUILDING',
    'WORKSHOP_LOW_ENERGY',
    'SCHEDULED_MONUMENT'
  ];

  if (exemptBuildingTypes.includes(buildingType)) {
    const exemptionReasons: { [key: string]: string } = {
      'PLACE_OF_WORSHIP': 'Buildings used primarily or solely as places of worship are exempt',
      'TEMPORARY_BUILDING': 'Temporary buildings with planned use of 2 years or less are exempt',
      'AGRICULTURAL_BUILDING': 'Non-residential agricultural buildings with low energy demand are exempt',
      'WORKSHOP_LOW_ENERGY': 'Industrial sites and workshops with low energy demand are exempt',
      'SCHEDULED_MONUMENT': 'Scheduled ancient monuments are exempt where compliance would alter character'
    };

    return {
      complianceRequired: false,
      complianceStatus: `EXEMPT_${buildingType.split('_')[0]}`,
      exemptionReason: exemptionReasons[buildingType],
      assessmentNotes: `Building type '${buildingType}' is explicitly exempt from L2B energy efficiency requirements under Regulation 21.`,
      regulationReference: 'Regulation 21 - Exempt Building Types',
      nextSteps: [
        'Document building type exemption',
        'Consider voluntary energy efficiency measures',
        'Review exemption status if building use changes'
      ]
    };
  }

  // Check floor area exemption for stand-alone buildings
  if (floorArea && floorArea < 50 && buildingType === 'STAND_ALONE_UNDER_50M2') {
    return {
      complianceRequired: false,
      complianceStatus: 'EXEMPT_UNDER_50M2',
      exemptionReason: 'Stand-alone buildings with total useful floor area less than 50m² are exempt',
      assessmentNotes: `Building has floor area of ${floorArea}m² which is below the 50m² threshold for L2B compliance.`,
      regulationReference: 'Regulation 21(d) - Small Buildings Exemption',
      nextSteps: [
        'Document floor area measurement',
        'Verify building is truly stand-alone',
        'Consider voluntary efficiency improvements'
      ]
    };
  }

  // Check for other specific exemptions
  if (buildingType === 'CARPORT_COVERED_WAY' || buildingType === 'CONSERVATORY_PORCH') {
    return {
      complianceRequired: false,
      complianceStatus: 'EXEMPT_OTHER',
      exemptionReason: 'Carports, covered ways, conservatories and porches attached to existing buildings may be exempt',
      assessmentNotes: 'This building type may be exempt from L2B requirements. Assessment needed to determine if it qualifies as an exempt structure.',
      regulationReference: 'Regulation 21(e) - Specific Structure Exemptions',
      nextSteps: [
        'Assess attachment to existing building',
        'Verify structure meets exemption criteria',
        'Document exemption reasoning'
      ]
    };
  }

  // If not exempt, determine compliance requirements
  const complianceRequiredTypes = [
    'RESIDENTIAL_NEW_BUILD',
    'RESIDENTIAL_EXISTING', 
    'RESIDENTIAL_EXTENSION',
    'COMMERCIAL_NEW_BUILD',
    'COMMERCIAL_EXISTING',
    'COMMERCIAL_EXTENSION',
    'INDUSTRIAL_NEW_BUILD',
    'INDUSTRIAL_EXISTING',
    'INDUSTRIAL_EXTENSION'
  ];

  if (complianceRequiredTypes.includes(buildingType)) {
    // Determine specific compliance requirements based on work type
    let complianceStatus = 'COMPLY_REQUIRED';
    let assessmentNotes = '';
    let nextSteps: string[] = [];

    if (buildingType.includes('EXTENSION')) {
      assessmentNotes = 'Extension work requires compliance with Part L energy efficiency requirements. May also trigger consequential improvements if building over 1000m².';
      nextSteps = [
        'Ensure extension meets Part L requirements',
        'Check if consequential improvements required (buildings >1000m²)',
        'Calculate U-values for thermal elements',
        'Specify energy efficient building services'
      ];
    } else if (buildingType.includes('EXISTING')) {
      assessmentNotes = 'Work to existing building must comply with relevant L2B requirements including thermal element standards and building services efficiency.';
      nextSteps = [
        'Identify thermal elements affected by work',
        'Ensure renovated/replaced elements meet Part L standards',
        'Commission building services effectively',
        'Provide energy efficiency information to occupier'
      ];
    } else if (buildingType.includes('NEW_BUILD')) {
      assessmentNotes = 'New building work requires full compliance with current Part L standards for energy efficiency.';
      nextSteps = [
        'Design to meet current Part L requirements',
        'Calculate building energy performance',
        'Specify efficient building services with effective controls',
        'Plan commissioning and testing procedures'
      ];
    }

    // Check for consequential improvements requirement
    if (floorArea && floorArea > 1000) {
      assessmentNotes += ' Building exceeds 1000m² - consequential improvements to energy performance may be required under Regulation 28.';
      nextSteps.push('Assess requirement for consequential improvements under Regulation 28');
    }

    return {
      complianceRequired: true,
      complianceStatus,
      assessmentNotes,
      regulationReference: 'Part L Schedule 1 - Conservation of Fuel and Power',
      nextSteps
    };
  }

  // Default case - requires assessment
  return {
    complianceRequired: true,
    complianceStatus: 'ASSESSMENT_IN_PROGRESS',
    assessmentNotes: 'Building type requires individual assessment to determine L2B compliance requirements. Specialist advice may be needed.',
    regulationReference: 'Building Regulations Part L - General Requirements',
    nextSteps: [
      'Conduct detailed building assessment',
      'Consult with building control body',
      'Consider specialist energy assessment',
      'Document compliance approach'
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enquiryId, quoteId, assessment } = body;

    // Perform L2B assessment
    const result = assessL2BCompliance(assessment);

    // Update enquiry or quote with assessment results
    if (enquiryId) {
      await prisma.enquiry.update({
        where: { id: enquiryId },
        data: {
          buildingType: assessment.buildingType as any,
          l2bComplianceRequired: result.complianceRequired,
          l2bComplianceStatus: result.complianceStatus as any,
          buildingDescription: assessment.buildingUsage,
          floorArea: assessment.floorArea,
          buildingAge: assessment.buildingAge,
          conservationArea: assessment.conservationArea || false,
          listedBuilding: assessment.listedBuilding || false,
          l2bExemptionReason: result.exemptionReason,
          l2bAssessmentNotes: result.assessmentNotes
        }
      });
    }

    if (quoteId) {
      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          buildingType: assessment.buildingType as any,
          l2bComplianceRequired: result.complianceRequired,
          l2bComplianceStatus: result.complianceStatus as any,
          buildingDescription: assessment.buildingUsage,
          floorArea: assessment.floorArea,
          buildingAge: assessment.buildingAge,
          conservationArea: assessment.conservationArea || false,
          listedBuilding: assessment.listedBuilding || false,
          l2bExemptionReason: result.exemptionReason,
          l2bAssessmentNotes: result.assessmentNotes
        }
      });
    }

    return NextResponse.json({
      success: true,
      assessment: result,
      message: 'L2B compliance assessment completed successfully'
    });

  } catch (error) {
    console.error('L2B Compliance Assessment Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to perform L2B compliance assessment',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buildingType = searchParams.get('buildingType');

    if (!buildingType) {
      return NextResponse.json(
        { success: false, message: 'Building type is required' },
        { status: 400 }
      );
    }

    // Quick assessment without saving to database
    const mockAssessment: L2BAssessmentRequest = {
      buildingType: buildingType,
      floorArea: searchParams.get('floorArea') ? parseFloat(searchParams.get('floorArea')!) : undefined,
      buildingAge: searchParams.get('buildingAge') || undefined,
      conservationArea: searchParams.get('conservationArea') === 'true',
      listedBuilding: searchParams.get('listedBuilding') === 'true',
      buildingUsage: searchParams.get('buildingUsage') || undefined
    };

    const result = assessL2BCompliance(mockAssessment);

    return NextResponse.json({
      success: true,
      assessment: result,
      buildingType
    });

  } catch (error) {
    console.error('L2B Compliance Check Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check L2B compliance',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
