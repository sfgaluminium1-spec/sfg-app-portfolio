
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFabricationWorkflow() {
  console.log('🔧 Starting fabrication workflow seeding...');

  try {
    // Create the default fabrication workflow template with 14 steps
    console.log('📋 Creating fabrication workflow template...');
    
    const template = await prisma.fabricationWorkflowTemplate.upsert({
      where: { templateName: 'SFG Standard 14-Step Fabrication' },
      update: {
        description: 'Standard SFG Aluminium 14-step fabrication workflow with helper system',
        isDefault: true,
        totalSteps: 14,
        estimatedHours: 8.58,
        estimatedHoursWithHelper: 6.86,
        helperTimeReduction: 20.0,
        helperCostIncrease: 33.0,
        powderCoatingRequiresTwoOperatives: true,
        isActive: true
      },
      create: {
        templateName: 'SFG Standard 14-Step Fabrication',
        description: 'Standard SFG Aluminium 14-step fabrication workflow with helper system',
        isDefault: true,
        totalSteps: 14,
        estimatedHours: 8.58,
        estimatedHoursWithHelper: 6.86,
        helperTimeReduction: 20.0,
        helperCostIncrease: 33.0,
        powderCoatingRequiresTwoOperatives: true,
        isActive: true
      }
    });

    // Define the 14 fabrication steps based on the SFG analysis
    const fabricationSteps = [
      {
        stepOrder: 1,
        stepName: 'Check Drawing',
        description: 'Confirm RAL & finish on drawing',
        standardTimeHours: 0.25,
        timeWithHelperHours: 0.2,
        canUseHelper: true,
        primaryRole: 'Fabricator',
        requiresTwoOperatives: false,
        dependsOnSteps: [],
        requiresQualityCheck: false,
        notes: 'Confirm RAL & finish on drawing',
        instructions: 'Review drawing specifications and confirm RAL color codes and finish requirements'
      },
      {
        stepOrder: 2,
        stepName: 'Check Stock (profile/powder)',
        description: 'Flag shortage/wrong powder to admin',
        standardTimeHours: 0.25,
        timeWithHelperHours: 0.2,
        canUseHelper: true,
        primaryRole: 'Fabricator',
        requiresTwoOperatives: false,
        dependsOnSteps: ['Check Drawing'],
        requiresQualityCheck: false,
        notes: 'Flag shortage/wrong powder to admin',
        instructions: 'Check material availability and powder coating stock levels'
      },
      {
        stepOrder: 3,
        stepName: 'Cut Profile',
        description: 'Use correct blade, check cut list',
        standardTimeHours: 1.0,
        timeWithHelperHours: 0.8,
        canUseHelper: true,
        primaryRole: 'Fabricator',
        requiresTwoOperatives: false,
        dependsOnSteps: ['Check Stock (profile/powder)'],
        requiresQualityCheck: false,
        notes: 'Use correct blade, check cut list',
        instructions: 'Cut profiles to specification using appropriate cutting blade'
      },
      {
        stepOrder: 4,
        stepName: 'Preparation',
        description: 'Deburr, mark, pre-assemble, lock/hardware prep, punch holes',
        standardTimeHours: 2.0,
        timeWithHelperHours: 1.6,
        canUseHelper: true,
        primaryRole: 'Fabricator',
        requiresTwoOperatives: false,
        dependsOnSteps: ['Cut Profile'],
        requiresQualityCheck: true,
        qualityCheckType: 'Preparation Quality Check',
        notes: 'Deburr, mark, pre-assemble, lock/hardware prep, punch holes',
        instructions: 'Complete all preparation work including deburring, marking, pre-assembly, and hardware preparation'
      },
      {
        stepOrder: 5,
        stepName: 'Contingency',
        description: 'Always included for issues/delays',
        standardTimeHours: 0.5,
        timeWithHelperHours: 0.4,
        canUseHelper: true,
        primaryRole: 'Fabricator',
        requiresTwoOperatives: false,
        dependsOnSteps: ['Preparation'],
        requiresQualityCheck: false,
        notes: 'Always included for issues/delays',
        instructions: 'Buffer time for unexpected issues or delays'
      },
      {
        stepOrder: 6,
        stepName: 'Powder Coating Prep',
        description: 'Cleaning, sanding, hanging',
        standardTimeHours: 0.5,
        timeWithHelperHours: null,
        canUseHelper: false,
        primaryRole: 'Operative 1 (Clean/Hang)',
        requiresTwoOperatives: true,
        dependsOnSteps: ['Contingency'],
        requiresQualityCheck: false,
        notes: 'Cleaning, sanding, hanging',
        instructions: 'Clean and prepare surfaces for powder coating application'
      },
      {
        stepOrder: 7,
        stepName: 'Powder Coating Spray',
        description: '2 min per linear meter (estimate: 10m)',
        standardTimeHours: 0.33,
        timeWithHelperHours: null,
        canUseHelper: false,
        primaryRole: 'Operative 2 (Sprayer)',
        requiresTwoOperatives: true,
        dependsOnSteps: ['Powder Coating Prep'],
        requiresQualityCheck: false,
        notes: '2 min per linear meter (estimate: 10m)',
        instructions: 'Apply powder coating evenly across all surfaces'
      },
      {
        stepOrder: 8,
        stepName: 'Oven Cure',
        description: 'Full cycle',
        standardTimeHours: 0.5,
        timeWithHelperHours: null,
        canUseHelper: false,
        primaryRole: 'Both operatives',
        requiresTwoOperatives: true,
        dependsOnSteps: ['Powder Coating Spray'],
        requiresQualityCheck: false,
        notes: 'Full cycle',
        instructions: 'Complete oven curing cycle according to powder specifications'
      },
      {
        stepOrder: 9,
        stepName: 'Cool Down/Tape Protection',
        description: 'Can overlap with other jobs',
        standardTimeHours: 0.5,
        timeWithHelperHours: null,
        canUseHelper: false,
        primaryRole: 'Both operatives',
        requiresTwoOperatives: true,
        dependsOnSteps: ['Oven Cure'],
        requiresQualityCheck: false,
        notes: 'Can overlap with other jobs',
        instructions: 'Allow proper cooling and apply protective tape where needed'
      },
      {
        stepOrder: 10,
        stepName: 'QC After Powder',
        description: 'Report faults, check finish',
        standardTimeHours: 0.25,
        timeWithHelperHours: 0.2,
        canUseHelper: true,
        primaryRole: 'Fabricator',
        requiresTwoOperatives: false,
        dependsOnSteps: ['Cool Down/Tape Protection'],
        requiresQualityCheck: true,
        qualityCheckType: 'Powder Coating Quality Check',
        notes: 'Report faults, check finish',
        instructions: 'Inspect powder coating quality and report any defects'
      },
      {
        stepOrder: 11,
        stepName: 'Assembly – Frame',
        description: 'Square, fixings, seal',
        standardTimeHours: 1.0,
        timeWithHelperHours: 0.8,
        canUseHelper: true,
        primaryRole: 'Fabricator',
        requiresTwoOperatives: false,
        dependsOnSteps: ['QC After Powder'],
        requiresQualityCheck: true,
        qualityCheckType: 'Frame Assembly Quality Check',
        notes: 'Square, fixings, seal',
        instructions: 'Assemble frame ensuring square alignment and proper sealing'
      },
      {
        stepOrder: 12,
        stepName: 'Assembly – Door',
        description: 'Hinge, lock, check swing',
        standardTimeHours: 2.0,
        timeWithHelperHours: 1.6,
        canUseHelper: true,
        primaryRole: 'Fabricator',
        requiresTwoOperatives: false,
        dependsOnSteps: ['Assembly – Frame'],
        requiresQualityCheck: true,
        qualityCheckType: 'Door Assembly Quality Check',
        notes: 'Hinge, lock, check swing',
        instructions: 'Install hinges, locks and verify proper door operation'
      },
      {
        stepOrder: 13,
        stepName: 'Preglazing',
        description: 'Glass, bead, seal',
        standardTimeHours: 0.5,
        timeWithHelperHours: 0.4,
        canUseHelper: true,
        primaryRole: 'Fabricator',
        requiresTwoOperatives: false,
        dependsOnSteps: ['Assembly – Door'],
        requiresQualityCheck: false,
        notes: 'Glass, bead, seal',
        instructions: 'Install glazing beads and seals ready for glass installation'
      },
      {
        stepOrder: 14,
        stepName: 'Final QC & Sign-off',
        description: 'Use color bar for admin sign-off',
        standardTimeHours: 0.25,
        timeWithHelperHours: 0.2,
        canUseHelper: true,
        primaryRole: 'Fabricator + Admin',
        requiresTwoOperatives: false,
        dependsOnSteps: ['Preglazing'],
        requiresQualityCheck: true,
        qualityCheckType: 'Final Quality Inspection',
        notes: 'Use color bar for admin sign-off',
        instructions: 'Complete final quality inspection and obtain admin approval'
      }
    ];

    console.log('📝 Creating fabrication steps...');
    
    // Create each step
    for (const step of fabricationSteps) {
      await prisma.fabricationStep.upsert({
        where: {
          templateId_stepOrder: {
            templateId: template.id,
            stepOrder: step.stepOrder
          }
        },
        update: {
          stepName: step.stepName,
          description: step.description,
          standardTimeHours: step.standardTimeHours,
          timeWithHelperHours: step.timeWithHelperHours,
          canUseHelper: step.canUseHelper,
          primaryRole: step.primaryRole,
          requiresTwoOperatives: step.requiresTwoOperatives,
          dependsOnSteps: step.dependsOnSteps,
          requiresQualityCheck: step.requiresQualityCheck,
          qualityCheckType: step.qualityCheckType,
          notes: step.notes,
          instructions: step.instructions
        },
        create: {
          templateId: template.id,
          stepOrder: step.stepOrder,
          stepName: step.stepName,
          description: step.description,
          standardTimeHours: step.standardTimeHours,
          timeWithHelperHours: step.timeWithHelperHours,
          canUseHelper: step.canUseHelper,
          primaryRole: step.primaryRole,
          requiresTwoOperatives: step.requiresTwoOperatives,
          dependsOnSteps: step.dependsOnSteps,
          requiresQualityCheck: step.requiresQualityCheck,
          qualityCheckType: step.qualityCheckType,
          notes: step.notes,
          instructions: step.instructions
        }
      });
    }

    console.log('✅ Fabrication workflow seeding completed successfully!');
    console.log(`🔧 Created template: ${template.templateName}`);
    console.log(`📝 Created ${fabricationSteps.length} fabrication steps`);
    console.log(`⏱️  Total estimated time: ${template.estimatedHours} hours`);
    console.log(`🤝 With helper: ${template.estimatedHoursWithHelper} hours (${template.helperTimeReduction}% reduction)`);
    console.log(`💰 Helper cost increase: ${template.helperCostIncrease}%`);
    
  } catch (error) {
    console.error('❌ Error seeding fabrication workflow:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedFabricationWorkflow()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
