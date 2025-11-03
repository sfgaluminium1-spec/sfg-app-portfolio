
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Glass weight calculation formula: Length × Width × Thickness × 2.5
function calculateGlassWeight(length: number, width: number, thickness: number): number {
  return length * width * thickness * 2.5;
}

// Extract dimensions from product descriptions using regex patterns
function extractDimensionsFromDescription(description: string): {
  length?: number;
  width?: number;
  thickness?: number;
  extracted: boolean;
} {
  const result = { extracted: false };
  
  // Common dimension patterns in product descriptions
  const patterns = [
    // Pattern: 1200 x 800 x 24mm or 1200mm x 800mm x 24mm
    /(\d+\.?\d*)\s*(?:mm)?\s*[x×]\s*(\d+\.?\d*)\s*(?:mm)?\s*[x×]\s*(\d+\.?\d*)\s*mm/i,
    // Pattern: 1.2m x 0.8m x 24mm
    /(\d+\.?\d*)\s*m\s*[x×]\s*(\d+\.?\d*)\s*m\s*[x×]\s*(\d+\.?\d*)\s*mm/i,
    // Pattern: 1200 x 800 mm, 24mm thick
    /(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)\s*mm.*?(\d+\.?\d*)\s*mm\s*thick/i,
    // Pattern: L: 1200mm W: 800mm T: 24mm
    /L:\s*(\d+\.?\d*)\s*mm.*?W:\s*(\d+\.?\d*)\s*mm.*?T:\s*(\d+\.?\d*)\s*mm/i,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) {
      let [, dim1, dim2, thick] = match;
      
      // Convert meters to millimeters if needed
      if (description.includes('m x') || description.includes('m ×')) {
        dim1 = (parseFloat(dim1) * 1000).toString();
        dim2 = (parseFloat(dim2) * 1000).toString();
      }
      
      // Convert mm to meters for length and width
      const length = parseFloat(dim1) / 1000;
      const width = parseFloat(dim2) / 1000;
      const thickness = parseFloat(thick);
      
      if (length > 0 && width > 0 && thickness > 0) {
        return {
          length,
          width,
          thickness,
          extracted: true
        };
      }
    }
  }
  
  return result;
}

// Determine staffing requirements based on glass weight
function calculateStaffingRequirements(weight: number): {
  staffRequired: number;
  liftingMethod: string;
  safetyCategory: string;
  equipmentNeeded: string[];
  vehiclesNeeded: number;
  requiresMechanicalAid: boolean;
  mechanicalAidType?: string;
  safetyNotes: string;
} {
  // Safety rules based on glass weight
  if (weight <= 25) {
    return {
      staffRequired: 2,
      liftingMethod: "Manual",
      safetyCategory: "Light",
      equipmentNeeded: ["Safety gloves", "Suction cups"],
      vehiclesNeeded: 1,
      requiresMechanicalAid: false,
      safetyNotes: "Standard manual handling - 2 person lift"
    };
  } else if (weight <= 50) {
    return {
      staffRequired: 3,
      liftingMethod: "Suction/Manual",
      safetyCategory: "Medium",
      equipmentNeeded: ["Safety gloves", "Suction cups", "Lifting straps"],
      vehiclesNeeded: 1,
      requiresMechanicalAid: false,
      safetyNotes: "3 person lift with suction equipment recommended"
    };
  } else if (weight <= 100) {
    return {
      staffRequired: 4,
      liftingMethod: "Suction/Manual",
      safetyCategory: "Heavy",
      equipmentNeeded: ["Safety gloves", "Heavy duty suction cups", "Lifting straps", "Back support"],
      vehiclesNeeded: 1,
      requiresMechanicalAid: false,
      safetyNotes: "4 person lift - Heavy glass protocol required"
    };
  } else if (weight <= 200) {
    return {
      staffRequired: 4,
      liftingMethod: "Crane Required",
      safetyCategory: "Very Heavy",
      equipmentNeeded: ["Safety gloves", "Crane rigging", "Safety harnesses", "Communication equipment"],
      vehiclesNeeded: 2,
      requiresMechanicalAid: true,
      mechanicalAidType: "Mobile Crane",
      safetyNotes: "Mechanical lifting required - Crane and 4 person team"
    };
  } else {
    return {
      staffRequired: 6,
      liftingMethod: "Crane Required",
      safetyCategory: "Critical",
      equipmentNeeded: ["Safety gloves", "Heavy crane rigging", "Safety harnesses", "Communication equipment", "Site barriers"],
      vehiclesNeeded: 3,
      requiresMechanicalAid: true,
      mechanicalAidType: "Heavy Crane + Specialist Equipment",
      safetyNotes: "CRITICAL WEIGHT - Specialist heavy lifting team and equipment required"
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, glassProducts, manualDimensions } = body;

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    // Check if quote exists
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        lineItems: true
      }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    const glassCalculations = [];
    let totalWeight = 0;
    let totalArea = 0;
    let maxPanelWeight = 0;
    let hasGlassProducts = false;

    // Process provided glass products or extract from quote line items
    const productsToProcess = glassProducts || quote.lineItems || [];

    if (manualDimensions && manualDimensions.length > 0) {
      // Process manually entered dimensions
      for (let i = 0; i < manualDimensions.length; i++) {
        const panel = manualDimensions[i];
        const weight = calculateGlassWeight(panel.length, panel.width, panel.thickness);
        const area = panel.length * panel.width;
        const staffing = calculateStaffingRequirements(weight);

        const calculation = await prisma.quoteGlassCalculation.create({
          data: {
            quoteId,
            panelId: `manual_${i + 1}`,
            panelName: panel.name || `Manual Panel ${i + 1}`,
            description: panel.description || `Manual entry: ${panel.length}m x ${panel.width}m x ${panel.thickness}mm`,
            length: panel.length,
            width: panel.width,
            thickness: panel.thickness,
            glassType: panel.glassType || 'Unknown',
            calculatedWeight: weight,
            area,
            staffRequired: staffing.staffRequired,
            liftingMethod: staffing.liftingMethod,
            isSafetyRisk: weight > 50,
            safetyNotes: staffing.safetyNotes,
            requiresSpecialEquipment: staffing.requiresMechanicalAid,
            equipmentNeeded: staffing.equipmentNeeded.join(', '),
            installationTime: Math.ceil(weight / 10) * 30 // Rough estimate: 30 min per 10kg
          }
        });

        glassCalculations.push(calculation);
        totalWeight += weight;
        totalArea += area;
        maxPanelWeight = Math.max(maxPanelWeight, weight);
        hasGlassProducts = true;
      }
    } else {
      // Extract dimensions from product descriptions
      for (let i = 0; i < productsToProcess.length; i++) {
        const product = productsToProcess[i];
        const description = product.description || product.product || '';
        
        // Skip non-glass products
        if (!description.toLowerCase().includes('glass') && 
            !description.toLowerCase().includes('glazing') && 
            !description.toLowerCase().includes('window') &&
            !description.toLowerCase().includes('panel')) {
          continue;
        }

        const dimensions = extractDimensionsFromDescription(description);
        
        if (dimensions.extracted) {
          const weight = calculateGlassWeight(dimensions.length!, dimensions.width!, dimensions.thickness!);
          const area = dimensions.length! * dimensions.width!;
          const staffing = calculateStaffingRequirements(weight);

          const calculation = await prisma.quoteGlassCalculation.create({
            data: {
              quoteId,
              panelId: product.id || `item_${i + 1}`,
              panelName: `Panel ${i + 1}`,
              description,
              length: dimensions.length!,
              width: dimensions.width!,
              thickness: dimensions.thickness!,
              glassType: description.toLowerCase().includes('double') ? 'Double Glazed' : 
                        description.toLowerCase().includes('laminated') ? 'Laminated' : 
                        description.toLowerCase().includes('toughened') ? 'Toughened' : 'Standard',
              calculatedWeight: weight,
              area,
              staffRequired: staffing.staffRequired,
              liftingMethod: staffing.liftingMethod,
              isSafetyRisk: weight > 50,
              safetyNotes: staffing.safetyNotes,
              requiresSpecialEquipment: staffing.requiresMechanicalAid,
              equipmentNeeded: staffing.equipmentNeeded.join(', '),
              installationTime: Math.ceil(weight / 10) * 30
            }
          });

          glassCalculations.push(calculation);
          totalWeight += weight;
          totalArea += area;
          maxPanelWeight = Math.max(maxPanelWeight, weight);
          hasGlassProducts = true;
        }
      }
    }

    // Calculate overall staffing requirements
    const overallStaffing = calculateStaffingRequirements(maxPanelWeight);
    
    // Generate safety alerts
    const safetyAlerts = [];
    if (maxPanelWeight > 50) safetyAlerts.push("Heavy glass handling required");
    if (maxPanelWeight > 100) safetyAlerts.push("Mechanical lifting equipment required");
    if (maxPanelWeight > 200) safetyAlerts.push("CRITICAL: Specialist heavy lifting team required");
    if (totalWeight > 500) safetyAlerts.push("Multiple panels - staged installation recommended");

    // Update quote with glass weight calculations
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        hasGlassProducts,
        totalGlassWeight: totalWeight,
        totalGlassArea: totalArea,
        maxPanelWeight,
        recommendedStaff: overallStaffing.staffRequired,
        recommendedVehicles: overallStaffing.vehiclesNeeded,
        requiresMechanicalAid: overallStaffing.requiresMechanicalAid,
        mechanicalAidType: overallStaffing.mechanicalAidType,
        liftingMethod: overallStaffing.liftingMethod,
        laborComplexity: overallStaffing.safetyCategory,
        safetyAlerts,
        installationTime: Math.ceil(totalWeight / 25) * 60, // 1 hour per 25kg
        glassWeightNotes: `${glassCalculations.length} panels analyzed. Total weight: ${totalWeight.toFixed(1)}kg. Max panel: ${maxPanelWeight.toFixed(1)}kg. Safety category: ${overallStaffing.safetyCategory}`
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'COMMENT_ADDED',
        description: `Glass weight calculated: ${glassCalculations.length} panels, ${totalWeight.toFixed(1)}kg total. Staffing: ${overallStaffing.staffRequired} people, ${overallStaffing.vehiclesNeeded} vehicles. Safety: ${overallStaffing.safetyCategory}`,
        user: 'Glass Calculator',
        quoteId
      }
    });

    return NextResponse.json({
      success: true,
      calculations: glassCalculations,
      summary: {
        totalPanels: glassCalculations.length,
        totalWeight: Math.round(totalWeight * 100) / 100,
        totalArea: Math.round(totalArea * 100) / 100,
        maxPanelWeight: Math.round(maxPanelWeight * 100) / 100,
        recommendedStaff: overallStaffing.staffRequired,
        recommendedVehicles: overallStaffing.vehiclesNeeded,
        liftingMethod: overallStaffing.liftingMethod,
        safetyCategory: overallStaffing.safetyCategory,
        requiresMechanicalAid: overallStaffing.requiresMechanicalAid,
        mechanicalAidType: overallStaffing.mechanicalAidType,
        estimatedInstallTime: Math.ceil(totalWeight / 25) * 60,
        safetyAlerts,
        equipmentNeeded: overallStaffing.equipmentNeeded
      }
    });

  } catch (error) {
    console.error('Glass weight calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate glass weight' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('quoteId');

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    const calculations = await prisma.quoteGlassCalculation.findMany({
      where: { quoteId },
      orderBy: { createdAt: 'asc' }
    });

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: {
        hasGlassProducts: true,
        totalGlassWeight: true,
        totalGlassArea: true,
        maxPanelWeight: true,
        recommendedStaff: true,
        recommendedVehicles: true,
        requiresMechanicalAid: true,
        mechanicalAidType: true,
        liftingMethod: true,
        laborComplexity: true,
        safetyAlerts: true,
        installationTime: true,
        glassWeightNotes: true
      }
    });

    return NextResponse.json({
      calculations,
      summary: quote
    });

  } catch (error) {
    console.error('Get glass calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch glass calculations' },
      { status: 500 }
    );
  }
}
