
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// Glass weight calculation function: Length × Width × Thickness × 2.5
function calculateGlassWeight(length: number, width: number, thickness: number): number {
  return length * width * thickness * 2.5;
}

// Staff requirement calculation based on weight
function calculateStaffRequirement(weight: number): {
  staffRequired: number;
  liftingMethod: string;
  safetyNotes: string;
  mechanicalAidRequired: boolean;
} {
  if (weight <= 25) {
    return {
      staffRequired: 1,
      liftingMethod: 'Manual',
      safetyNotes: 'Solo lift allowed - standard handling procedures',
      mechanicalAidRequired: false
    };
  } else if (weight <= 75) {
    return {
      staffRequired: 2,
      liftingMethod: 'Suction/manual',
      safetyNotes: 'Two-man lift required - use proper lifting technique',
      mechanicalAidRequired: false
    };
  } else if (weight <= 150) {
    return {
      staffRequired: 3,
      liftingMethod: 'Suction/manual',
      safetyNotes: 'Three-man lift required - coordinate lifting movements',
      mechanicalAidRequired: false
    };
  } else {
    return {
      staffRequired: 4,
      liftingMethod: 'Suction/crane',
      safetyNotes: 'HEAVY GLASS: Use mechanical aid or 4+ staff - exceeds safe manual handling limit',
      mechanicalAidRequired: true
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { glassDetails } = body;
    
    if (!glassDetails || !Array.isArray(glassDetails)) {
      return NextResponse.json(
        { error: 'Glass details array is required' },
        { status: 400 }
      );
    }

    const calculations = [];
    let totalWeight = 0;
    let maxStaffRequired = 1;
    let primaryLiftingMethod = 'Manual';
    let anyMechanicalAidRequired = false;
    let overallSafetyNotes = [];

    for (const glass of glassDetails) {
      if (!glass.length || !glass.width || !glass.thickness) {
        return NextResponse.json(
          { error: 'Each glass panel must have length, width, and thickness' },
          { status: 400 }
        );
      }

      const weight = calculateGlassWeight(glass.length, glass.width, glass.thickness);
      const staffReq = calculateStaffRequirement(weight);
      
      totalWeight += weight;
      
      if (staffReq.staffRequired > maxStaffRequired) {
        maxStaffRequired = staffReq.staffRequired;
        primaryLiftingMethod = staffReq.liftingMethod;
      }
      
      if (staffReq.mechanicalAidRequired) {
        anyMechanicalAidRequired = true;
      }

      calculations.push({
        panelName: glass.panelName || `Panel ${calculations.length + 1}`,
        dimensions: {
          length: glass.length,
          width: glass.width,
          thickness: glass.thickness
        },
        area: glass.length * glass.width, // Square meters
        weight: weight,
        staffRequired: staffReq.staffRequired,
        liftingMethod: staffReq.liftingMethod,
        safetyNotes: staffReq.safetyNotes,
        mechanicalAidRequired: staffReq.mechanicalAidRequired
      });
    }

    // Generate overall safety recommendations
    if (anyMechanicalAidRequired) {
      overallSafetyNotes.push('MECHANICAL AID REQUIRED - One or more panels exceed safe manual handling limits');
    }
    
    if (maxStaffRequired >= 3) {
      overallSafetyNotes.push('MULTI-PERSON LIFT - Coordinate movements and ensure clear communication');
    }
    
    if (totalWeight > 200) {
      overallSafetyNotes.push('HIGH TOTAL WEIGHT - Consider splitting installation or using crane assistance');
    }

    // Route optimization suggestions
    const routeOptimization = {
      recommendedVanConfiguration: maxStaffRequired >= 3 ? 'Large van with 3+ team members' : 'Standard van with 2 team members',
      estimatedInstallationTime: calculations.length * 0.5 + (maxStaffRequired >= 3 ? 2 : 1), // Hours
      toolsRequired: anyMechanicalAidRequired ? ['Suction lifters', 'Crane or mechanical aid', 'Safety harnesses'] : ['Suction lifters', 'Manual handling equipment']
    };

    const result = {
      summary: {
        totalPanels: calculations.length,
        totalWeight: Math.round(totalWeight * 100) / 100, // Round to 2 decimal places
        totalArea: Math.round(calculations.reduce((sum: number, calc) => sum + calc.area, 0) * 100) / 100,
        maxStaffRequired: maxStaffRequired,
        primaryLiftingMethod: primaryLiftingMethod,
        mechanicalAidRequired: anyMechanicalAidRequired,
        overallSafetyNotes: overallSafetyNotes
      },
      calculations: calculations,
      routeOptimization: routeOptimization,
      safetyCompliance: {
        manualHandlingAssessment: totalWeight <= 75 ? 'PASS' : 'REQUIRES_ASSESSMENT',
        teamSizeCompliant: maxStaffRequired <= 4 ? 'COMPLIANT' : 'REQUIRES_ADDITIONAL_RESOURCES',
        mechanicalAidCompliant: anyMechanicalAidRequired ? 'MECHANICAL_AID_REQUIRED' : 'MANUAL_HANDLING_ACCEPTABLE'
      }
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating glass weights:', error);
    return NextResponse.json(
      { error: 'Failed to calculate glass weights' },
      { status: 500 }
    );
  }
}
