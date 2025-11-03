
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedApprovalSystem() {
  console.log('🔄 Seeding approval system data...');

  try {
    // Create Team Members
    const teamMembers = await prisma.teamMember.createMany({
      data: [
        {
          name: 'Warren Smith',
          email: 'warren@sfg.com',
          role: 'Senior Estimator',
          department: 'Sales',
          canApproveQuotes: true,
          canApproveJobs: true,
          canOverrideApprovals: true,
          maxApprovalValue: 50000.00,
          emailNotifications: true,
          smsNotifications: false
        },
        {
          name: 'Neil Johnson',
          email: 'neil@sfg.com',
          role: 'Project Manager',
          department: 'Operations',
          canApproveQuotes: true,
          canApproveJobs: true,
          canOverrideApprovals: false,
          maxApprovalValue: 25000.00,
          emailNotifications: true,
          smsNotifications: true
        },
        {
          name: 'Sarah Mitchell',
          email: 'sarah@sfg.com',
          role: 'Operations Manager',
          department: 'Operations',
          canApproveQuotes: true,
          canApproveJobs: true,
          canOverrideApprovals: true,
          maxApprovalValue: 100000.00,
          emailNotifications: true,
          smsNotifications: false
        },
        {
          name: 'Mike Thompson',
          email: 'mike@sfg.com',
          role: 'Technical Specialist',
          department: 'Technical',
          canApproveQuotes: false,
          canApproveJobs: true,
          canOverrideApprovals: false,
          maxApprovalValue: 15000.00,
          emailNotifications: true,
          smsNotifications: false
        },
        {
          name: 'Emma Davis',
          email: 'emma@sfg.com',
          role: 'Quality Controller',
          department: 'Quality',
          canApproveQuotes: true,
          canApproveJobs: false,
          canOverrideApprovals: false,
          maxApprovalValue: 30000.00,
          emailNotifications: true,
          smsNotifications: true
        }
      ],
      skipDuplicates: true
    });

    // Create Quote Type Rules
    const quoteTypeRules = await prisma.quoteTypeRule.createMany({
      data: [
        {
          quoteType: 'SUPPLY_ONLY',
          baseMarkup: 5.0,
          riskMarkup: 0.0,
          minimumMarkup: 3.0,
          allowConversion: false,
          requiresNewQuoteNumber: true,
          requiresInstallationPricing: false,
          requiresWarrantyAssessment: false,
          requiresMandatoryApproval: false,
          riskLevel: 'LOW',
          warrantyRisk: false,
          callbackRisk: false,
          description: 'Supply only - minimal risk, quick turnaround, lowest markup'
        },
        {
          quoteType: 'SUPPLY_AND_INSTALL',
          baseMarkup: 15.0,
          riskMarkup: 5.0,
          minimumMarkup: 12.0,
          allowConversion: false,
          requiresNewQuoteNumber: true,
          requiresInstallationPricing: true,
          requiresWarrantyAssessment: true,
          requiresMandatoryApproval: true,
          riskLevel: 'HIGH',
          warrantyRisk: true,
          callbackRisk: true,
          description: 'Supply & Install - higher risk due to warranty callbacks, requires higher markup'
        },
        {
          quoteType: 'LABOUR_ONLY',
          baseMarkup: 25.0,
          riskMarkup: 10.0,
          minimumMarkup: 20.0,
          allowConversion: true,
          requiresNewQuoteNumber: false,
          requiresInstallationPricing: true,
          requiresWarrantyAssessment: true,
          requiresMandatoryApproval: true,
          riskLevel: 'HIGH',
          warrantyRisk: true,
          callbackRisk: true,
          description: 'Labour only - high risk, requires comprehensive assessment'
        },
        {
          quoteType: 'MAINTENANCE',
          baseMarkup: 30.0,
          riskMarkup: 15.0,
          minimumMarkup: 25.0,
          allowConversion: true,
          requiresNewQuoteNumber: false,
          requiresInstallationPricing: false,
          requiresWarrantyAssessment: true,
          requiresMandatoryApproval: false,
          riskLevel: 'MEDIUM',
          warrantyRisk: false,
          callbackRisk: true,
          description: 'Maintenance work - medium risk, callback potential'
        },
        {
          quoteType: 'EMERGENCY_REPAIR',
          baseMarkup: 40.0,
          riskMarkup: 20.0,
          minimumMarkup: 35.0,
          allowConversion: false,
          requiresNewQuoteNumber: false,
          requiresInstallationPricing: true,
          requiresWarrantyAssessment: true,
          requiresMandatoryApproval: true,
          riskLevel: 'CRITICAL',
          warrantyRisk: true,
          callbackRisk: true,
          description: 'Emergency repairs - critical risk, immediate response required'
        }
      ],
      skipDuplicates: true
    });

    // Create Approval Workflows
    const workflows = await prisma.approvalWorkflow.createMany({
      data: [
        {
          workflowName: 'Quote Creation Approval',
          description: 'Standard approval workflow for new quotes',
          workflowType: 'QUOTE_APPROVAL',
          isActive: true,
          stages: JSON.stringify([
            {
              stage: 'creation',
              name: 'Quote Creation',
              requiresApproval: false,
              canSelfApprove: true,
              mandatorySecondApproval: false
            },
            {
              stage: 'pricing_validation',
              name: 'Pricing Validation',
              requiresApproval: true,
              canSelfApprove: true,
              mandatorySecondApproval: false,
              validationChecks: ['product_count', 'price_validation']
            },
            {
              stage: 'pre_send_approval',
              name: 'Pre-Send Approval',
              requiresApproval: true,
              canSelfApprove: false,
              mandatorySecondApproval: true,
              validationChecks: ['product_count', 'price_validation', 'installation_pricing', 'quote_type']
            }
          ]),
          rules: JSON.stringify({
            maxSelfApprovalValue: 10000.00,
            mandatoryApprovalThreshold: 25000.00,
            requiresInstallationValidation: ['SUPPLY_AND_INSTALL', 'LABOUR_ONLY', 'EMERGENCY_REPAIR']
          })
        },
        {
          workflowName: 'High Value Quote Approval',
          description: 'Enhanced approval workflow for high-value quotes',
          workflowType: 'QUOTE_APPROVAL',
          isActive: true,
          stages: JSON.stringify([
            {
              stage: 'creation',
              name: 'Quote Creation',
              requiresApproval: true,
              canSelfApprove: false,
              mandatorySecondApproval: true
            },
            {
              stage: 'technical_review',
              name: 'Technical Review',
              requiresApproval: true,
              canSelfApprove: false,
              mandatorySecondApproval: true,
              validationChecks: ['product_count', 'price_validation', 'installation_pricing']
            },
            {
              stage: 'management_approval',
              name: 'Management Approval',
              requiresApproval: true,
              canSelfApprove: false,
              mandatorySecondApproval: true,
              validationChecks: ['all']
            }
          ]),
          rules: JSON.stringify({
            triggerValue: 50000.00,
            requiresManagerApproval: true,
            mandatoryTechnicalReview: true
          })
        },
        {
          workflowName: 'Job Creation Approval',
          description: 'Approval workflow for converting quotes to jobs',
          workflowType: 'JOB_APPROVAL',
          isActive: true,
          stages: JSON.stringify([
            {
              stage: 'po_validation',
              name: 'PO Validation',
              requiresApproval: true,
              canSelfApprove: true,
              mandatorySecondApproval: false
            },
            {
              stage: 'resource_allocation',
              name: 'Resource Allocation',
              requiresApproval: true,
              canSelfApprove: false,
              mandatorySecondApproval: true
            }
          ]),
          rules: JSON.stringify({
            requiresPOValidation: true,
            requiresResourceCheck: true
          })
        }
      ],
      skipDuplicates: true
    });

    console.log('✅ Approval system data seeded successfully!');
    console.log(`📊 Created ${teamMembers.count} team members`);
    console.log(`📋 Created ${quoteTypeRules.count} quote type rules`);
    console.log(`🔄 Created ${workflows.count} approval workflows`);

  } catch (error) {
    console.error('❌ Error seeding approval system data:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedApprovalSystem();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { seedApprovalSystem };
