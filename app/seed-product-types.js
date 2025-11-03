
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProductTypes() {
  console.log('🌱 Seeding Product Type Rules...');

  // Create Product Type Rules
  const productTypeRules = [
    {
      productType: 'STANDARD_FABRICATION',
      basePriceMultiplier: 1.0,
      complexityMarkup: 5.0,
      minimumLeadTimeWeeks: 2,
      maximumLeadTimeWeeks: 6,
      requiresDesignApproval: false,
      requiresSupplierConfirmation: false,
      requiresFabricationApproval: false,
      allowsRushOrders: true,
      requiresDetailedSpecifications: false,
      requiresDrawings: false,
      requiresSupplierQuote: false,
      requiresQualityAssurance: true,
      riskLevel: 'LOW',
      designRisk: false,
      supplierRisk: false,
      qualityRisk: false,
      timelineRisk: false,
      approvalStages: JSON.stringify([
        { stage: 'fabrication_review', required: false, role: 'fabrication_manager' }
      ]),
      escalationRules: JSON.stringify({
        highValue: { threshold: 50000, escalateTo: 'senior_manager' },
        rushOrder: { escalateTo: 'production_manager' }
      }),
      description: 'Standard fabricated products using established processes and materials',
      isActive: true
    },
    {
      productType: 'BESPOKE',
      basePriceMultiplier: 1.3,
      complexityMarkup: 25.0,
      minimumLeadTimeWeeks: 4,
      maximumLeadTimeWeeks: 16,
      requiresDesignApproval: true,
      requiresSupplierConfirmation: false,
      requiresFabricationApproval: true,
      allowsRushOrders: false,
      requiresDetailedSpecifications: true,
      requiresDrawings: true,
      requiresSupplierQuote: false,
      requiresQualityAssurance: true,
      riskLevel: 'HIGH',
      designRisk: true,
      supplierRisk: false,
      qualityRisk: true,
      timelineRisk: true,
      approvalStages: JSON.stringify([
        { stage: 'design_review', required: true, role: 'design_manager' },
        { stage: 'fabrication_review', required: true, role: 'fabrication_manager' },
        { stage: 'quality_review', required: true, role: 'quality_manager' }
      ]),
      escalationRules: JSON.stringify({
        designComplexity: { escalateTo: 'senior_designer' },
        highValue: { threshold: 25000, escalateTo: 'senior_manager' },
        timelineRisk: { escalateTo: 'project_manager' }
      }),
      description: 'Custom designed products requiring specialized design attention and unique fabrication processes',
      isActive: true
    },
    {
      productType: 'BOUGHT_IN_ITEM',
      basePriceMultiplier: 1.1,
      complexityMarkup: 8.0,
      minimumLeadTimeWeeks: 1,
      maximumLeadTimeWeeks: 8,
      requiresDesignApproval: false,
      requiresSupplierConfirmation: true,
      requiresFabricationApproval: false,
      allowsRushOrders: true,
      requiresDetailedSpecifications: false,
      requiresDrawings: false,
      requiresSupplierQuote: true,
      requiresQualityAssurance: false,
      riskLevel: 'MEDIUM',
      designRisk: false,
      supplierRisk: true,
      qualityRisk: false,
      timelineRisk: true,
      approvalStages: JSON.stringify([
        { stage: 'supplier_confirmation', required: true, role: 'procurement_manager' },
        { stage: 'delivery_schedule', required: true, role: 'logistics_coordinator' }
      ]),
      escalationRules: JSON.stringify({
        supplierDelay: { escalateTo: 'procurement_manager' },
        qualityIssue: { escalateTo: 'quality_manager' },
        highValue: { threshold: 30000, escalateTo: 'senior_manager' }
      }),
      description: 'Products purchased from external suppliers with minimal in-house fabrication',
      isActive: true
    },
    {
      productType: 'MERGED_DESIGN',
      basePriceMultiplier: 1.2,
      complexityMarkup: 18.0,
      minimumLeadTimeWeeks: 3,
      maximumLeadTimeWeeks: 12,
      requiresDesignApproval: true,
      requiresSupplierConfirmation: true,
      requiresFabricationApproval: true,
      allowsRushOrders: false,
      requiresDetailedSpecifications: true,
      requiresDrawings: true,
      requiresSupplierQuote: true,
      requiresQualityAssurance: true,
      riskLevel: 'HIGH',
      designRisk: true,
      supplierRisk: true,
      qualityRisk: true,
      timelineRisk: true,
      approvalStages: JSON.stringify([
        { stage: 'design_review', required: true, role: 'design_manager' },
        { stage: 'supplier_confirmation', required: true, role: 'procurement_manager' },
        { stage: 'fabrication_review', required: true, role: 'fabrication_manager' },
        { stage: 'integration_review', required: true, role: 'project_manager' },
        { stage: 'quality_review', required: true, role: 'quality_manager' }
      ]),
      escalationRules: JSON.stringify({
        designComplexity: { escalateTo: 'senior_designer' },
        supplierCoordination: { escalateTo: 'procurement_manager' },
        integrationRisk: { escalateTo: 'project_manager' },
        highValue: { threshold: 20000, escalateTo: 'senior_manager' },
        timelineRisk: { escalateTo: 'operations_manager' }
      }),
      description: 'Complex products combining standard fabrication with bought-in components requiring careful integration',
      isActive: true
    }
  ];

  for (const rule of productTypeRules) {
    await prisma.productTypeRule.upsert({
      where: { 
        productType: rule.productType
      },
      update: rule,
      create: rule
    });
  }

  console.log('✅ Product Type Rules seeded successfully');
}

async function main() {
  try {
    await seedProductTypes();
  } catch (error) {
    console.error('❌ Error seeding product types:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { seedProductTypes };
