
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding comprehensive workflow enhancement data...');

  // Create enhanced customers with contact management
  const customer1 = await prisma.customer.create({
    data: {
      firstName: 'Warren',
      lastName: 'Smith',
      contactName: 'Warren Smith',
      company: 'SFG Aluminium',
      email: 'warren@sfgaluminium.com',
      phone: '+44 161 123 4567',
      address: 'Manchester Business Park, Manchester M12 5PG',
      customerType: 'PROSPECT',
      customerStatus: 'ACTIVE',
      source: 'DIRECT',
      portalAccess: true,
      emailNotifications: true
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      firstName: 'David',
      lastName: 'Johnson',
      contactName: 'David Johnson',
      company: 'Johnson Construction Ltd',
      email: 'david@johnsonconstruction.co.uk',
      phone: '+44 161 987 6543',
      address: 'Industrial Estate, Manchester M15 6RT',
      customerType: 'ACTIVE_CUSTOMER',
      customerStatus: 'ACTIVE',
      source: 'REFERRAL',
      portalAccess: false,
      emailNotifications: true
    }
  });

  // Create enhanced customer contacts
  await prisma.customerContact.createMany({
    data: [
      {
        customerId: customer1.id,
        contactName: 'Warren Smith',
        role: 'PRIMARY_CONTACT',
        email: 'warren@sfgaluminium.com',
        phone: '+44 161 123 4567',
        mobile: '+44 7700 123456',
        preferredContactMethod: 'EMAIL',
        whatsappEnabled: true,
        whatsappNumber: '+44 7700 123456',
        emailNotifications: true,
        department: 'Management',
        jobTitle: 'Managing Director',
        authority: 'Full decision making authority',
        dataSource: 'MANUAL_ENTRY',
        isValidated: true
      },
      {
        customerId: customer2.id,
        contactName: 'David Johnson',
        role: 'PRIMARY_CONTACT',
        email: 'david@johnsonconstruction.co.uk',
        phone: '+44 161 987 6543',
        mobile: '+44 7700 987654',
        preferredContactMethod: 'WHATSAPP',
        whatsappEnabled: true,
        whatsappNumber: '+44 7700 987654',
        emailNotifications: true,
        department: 'Operations',
        jobTitle: 'Operations Director',
        authority: 'Project approval up to £50,000',
        dataSource: 'DIGITAL_FORM',
        isValidated: true
      },
      {
        customerId: customer2.id,
        contactName: 'Sarah Mitchell',
        role: 'PROJECT_MANAGER',
        email: 'sarah.mitchell@johnsonconstruction.co.uk',
        phone: '+44 161 987 6544',
        mobile: '+44 7700 111222',
        preferredContactMethod: 'EMAIL',
        whatsappEnabled: false,
        emailNotifications: true,
        department: 'Project Management',
        jobTitle: 'Senior Project Manager',
        authority: 'Project coordination and scheduling',
        dataSource: 'XERO_INTEGRATION',
        isValidated: true
      }
    ]
  });

  // Create enhanced quotes with AI descriptions
  const quote1 = await prisma.quote.create({
    data: {
      quoteNumber: 'Q24-001',
      customerId: customer1.id,
      customerName: 'Warren Smith',
      projectName: 'Office Building Windows Replacement',
      contactName: 'Warren Smith',
      productType: 'Commercial Windows',
      quotedBy: 'SFG Sales Team',
      value: 25000,
      netValue: 20833.33,
      grossValue: 25000,
      vatRate: 20.0,
      vatAmount: 4166.67,
      status: 'PENDING',
      quoteType: 'Supply & Install',
      projectComplexity: 'MODERATE',
      estimatedTimelineWeeks: 6,
      aiGeneratedDescription: 'Commercial office building windows replacement project involving 12 double-glazed aluminium frame windows with enhanced thermal performance. Project includes site survey, custom fabrication, and professional installation. Estimated 6-week timeline with moderate complexity due to building access requirements.',
      quoteApprovalStatus: 'PENDING_APPROVAL',
      drawingApprovalStatus: 'NOT_REQUIRED',
      variationApprovalStatus: 'NOT_REQUIRED',
      extraItemsApprovalStatus: 'NOT_REQUIRED'
    }
  });

  const quote2 = await prisma.quote.create({
    data: {
      quoteNumber: 'Q24-002',
      customerId: customer2.id,
      customerName: 'David Johnson',
      projectName: 'Warehouse Roller Shutters',
      contactName: 'David Johnson',
      productType: 'Industrial Roller Shutters',
      quotedBy: 'SFG Sales Team',
      value: 18500,
      netValue: 15416.67,
      grossValue: 18500,
      vatRate: 20.0,
      vatAmount: 3083.33,
      status: 'SENT',
      quoteType: 'Supply & Install',
      projectComplexity: 'COMPLEX',
      estimatedTimelineWeeks: 8,
      aiGeneratedDescription: 'Industrial warehouse roller shutter installation featuring 4 large-scale electric roller shutters with security enhancements. Complex project requiring specialized mounting systems and electrical integration. 8-week timeline includes custom fabrication and coordination with electrical contractors.',
      quoteApprovalStatus: 'QUOTE_APPROVED',
      drawingApprovalStatus: 'PENDING_APPROVAL',
      variationApprovalStatus: 'NOT_REQUIRED',
      extraItemsApprovalStatus: 'NOT_REQUIRED'
    }
  });

  // Create jobs with enhanced workflow
  const job1 = await prisma.job.create({
    data: {
      jobNumber: 'J24-001',
      quoteId: quote1.id,
      customerId: customer1.id,
      client: 'Warren Smith',
      site: 'SFG Aluminium Head Office',
      description: 'Office Building Windows Replacement - Premium aluminium frames with enhanced thermal glazing',
      value: 25000,
      status: 'APPROVED',
      priority: 'MEDIUM'
    }
  });

  const job2 = await prisma.job.create({
    data: {
      jobNumber: 'J24-002',
      quoteId: quote2.id,
      customerId: customer2.id,
      client: 'Johnson Construction Ltd',
      site: 'Industrial Warehouse Complex',
      description: 'Warehouse Roller Shutters - Heavy-duty electric shutters with security features',
      value: 18500,
      status: 'IN_PRODUCTION',
      priority: 'HIGH'
    }
  });

  // Create AI project descriptions
  await prisma.aIProjectDescription.createMany({
    data: [
      {
        jobId: job1.id,
        originalDescription: 'Office windows replacement',
        generatedDescription: quote1.aiGeneratedDescription,
        projectItemCount: 12,
        projectScope: 'Commercial window replacement with thermal enhancement',
        complexityAssessment: 'MODERATE',
        timelineEstimate: 6,
        aiModel: 'gpt-4',
        confidence: 0.92,
        userApproved: true
      },
      {
        jobId: job2.id,
        originalDescription: 'Warehouse roller shutters',
        generatedDescription: quote2.aiGeneratedDescription,
        projectItemCount: 4,
        projectScope: 'Industrial roller shutter installation with security',
        complexityAssessment: 'COMPLEX',
        timelineEstimate: 8,
        aiModel: 'gpt-4',
        confidence: 0.89,
        userApproved: true
      }
    ]
  });

  // Create workflow steps
  const workflowSteps = [
    'CUSTOMER_COMMUNICATION',
    'DRAWING_APPROVAL',
    'MATERIALS_ANALYSIS',
    'ORDER_CREATION',
    'SUPPLIER_ORDERING',
    'QUALITY_CHECK',
    'PRODUCTION_STAGE',
    'DELIVERY_COORDINATION',
    'INSTALLATION_SCHEDULING',
    'COMPLETION_VERIFICATION'
  ];

  for (const jobId of [job1.id, job2.id]) {
    await prisma.jobWorkflowStep.createMany({
      data: workflowSteps.map((stepName, index) => ({
        jobId,
        stepName,
        stepType: stepName,
        stepOrder: index + 1,
        status: index < 3 ? 'COMPLETED' : index === 3 ? 'IN_PROGRESS' : 'PENDING',
        progressPercent: index < 3 ? 100 : index === 3 ? 45 : 0,
        assignedTo: index === 3 ? 'Warren Smith' : null,
        startedAt: index <= 3 ? new Date() : null,
        completedAt: index < 3 ? new Date() : null
      }))
    });
  }

  // Create project variations
  await prisma.projectVariation.create({
    data: {
      variationNumber: 'Q24-002-VAR001',
      quoteId: quote2.id,
      jobId: job2.id,
      customerId: customer2.id,
      variationType: 'ADDITIONAL_ITEMS',
      description: 'Additional security camera integration with roller shutters',
      reason: 'CUSTOMER_REQUEST',
      originalValue: 18500,
      variationValue: 2500,
      totalNewValue: 21000,
      initialNotes: 'Customer requested enhanced security features including CCTV integration points on each roller shutter unit for comprehensive surveillance coverage.',
      approvalStatus: 'PENDING_APPROVAL',
      requiresCustomerApproval: true,
      requiresInternalApproval: true
    }
  });

  // Create WhatsApp integration
  await prisma.whatsAppIntegration.create({
    data: {
      businessAccountId: 'sfg_whatsapp_001',
      phoneNumberId: 'phone_001',
      phoneNumber: '+44 161 123 4567',
      verificationStatus: 'VERIFIED',
      accessToken: 'whatsapp_token_demo',
      webhookUrl: 'https://sfgaluminium.com/api/whatsapp/webhook',
      isActive: true,
      dailyRemindersEnabled: true,
      drawingApprovalsEnabled: true,
      portalPromotionEnabled: true,
      messageTemplates: {
        drawing_approval_request: {
          name: 'drawing_approval_request',
          content: 'New drawing approval required for Job {{jobNumber}}. Please review: {{drawingUrl}}',
          category: 'UTILITY'
        }
      },
      messagesCount: 24,
      lastMessageSent: new Date()
    }
  });

  // Create Teams integration
  await prisma.teamsIntegration.create({
    data: {
      teamId: 'sfg_team_001',
      channelId: 'channel_workflow',
      channelName: 'Workflow Updates',
      channelType: 'WORKFLOW_UPDATES',
      webhookUrl: 'https://outlook.office.com/webhook/sfg-workflow',
      isActive: true,
      workflowUpdatesEnabled: true,
      variationNotificationsEnabled: true,
      communicationSyncEnabled: true,
      messageTemplates: {
        workflow_update: {
          title: 'Workflow Progress Update',
          color: '0078D4'
        }
      },
      mentionSettings: {
        workflow_updates: ['@warren.smith'],
        variations: ['@management']
      },
      messagesCount: 18,
      lastMessageSent: new Date()
    }
  });

  // Create customer portal demo access
  await prisma.customerPortalAccess.createMany({
    data: [
      {
        customerId: customer1.id,
        accessType: 'FULL',
        features: ['NEW_ENQUIRY', 'PROJECT_TRACKING', 'DOCUMENT_SHARING', 'APPROVAL_WORKFLOW'],
        accessToken: 'demo_token_warren_001',
        isDemoAccess: false,
        loginCount: 15,
        lastLoginAt: new Date(),
        featuresUsed: ['PROJECT_TRACKING', 'DOCUMENT_SHARING'],
        timeSpent: 245,
        convertedToFull: true,
        convertedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        conversionSource: 'demo'
      },
      {
        customerId: customer2.id,
        accessType: 'DEMO',
        features: ['DEMO_ACCESS', 'PROJECT_TRACKING', 'DOCUMENT_SHARING'],
        accessToken: 'demo_token_david_001',
        isDemoAccess: true,
        demoExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        demoActivated: true,
        demoActivatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        loginCount: 5,
        lastLoginAt: new Date(),
        featuresUsed: ['PROJECT_TRACKING'],
        timeSpent: 67,
        convertedToFull: false
      }
    ]
  });

  // Create communication records
  await prisma.customerCommunication.createMany({
    data: [
      {
        customerId: customer1.id,
        subject: 'Project Kickoff - Office Windows Replacement',
        message: 'Project has been approved and scheduled to begin next week. Site survey completed with access arrangements confirmed.',
        communicationType: 'CUSTOMER_UPDATE',
        platform: 'EMAIL',
        direction: 'OUTBOUND',
        status: 'DELIVERED',
        sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        customerId: customer2.id,
        subject: 'Drawing Approval Required',
        message: 'Please review and approve the technical drawings for your warehouse roller shutter project. Drawings include security camera integration points.',
        communicationType: 'DRAWING_SUBMISSION',
        platform: 'WHATSAPP',
        direction: 'OUTBOUND',
        status: 'READ',
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
      }
    ]
  });

  // Create workflow navigation history
  await prisma.workflowNavigation.createMany({
    data: [
      {
        jobId: job1.id,
        fromStage: 'CUSTOMER_COMMUNICATION',
        toStage: 'DRAWING_APPROVAL',
        direction: 'FORWARD',
        action: 'ADVANCE',
        isAllowed: true,
        requiresConfirmation: false,
        performedBy: 'Warren Smith',
        reason: 'Customer approval received, moving to drawing stage',
        affectedProcesses: [],
        rollbackRequired: false
      },
      {
        jobId: job2.id,
        fromStage: 'MATERIALS_ANALYSIS',
        toStage: 'DRAWING_APPROVAL',
        direction: 'BACKWARD',
        action: 'REVERT',
        isAllowed: true,
        requiresConfirmation: true,
        performedBy: 'Warren Smith',
        reason: 'Customer requested design changes, reverting to drawing approval',
        affectedProcesses: ['ORDER_CREATION'],
        rollbackRequired: true
      }
    ]
  });

  console.log('✅ Comprehensive workflow enhancement data seeded successfully!');
  console.log(`
📊 Created:
   • 2 Enhanced customers with portal access
   • 3 Customer contacts with WhatsApp integration
   • 2 Quotes with AI-generated descriptions
   • 2 Jobs with workflow steps
   • 1 Project variation with approval workflow
   • WhatsApp Business integration setup
   • Microsoft Teams integration setup
   • Customer portal demo access
   • Communication records and workflow navigation history

🚀 System ready for comprehensive workflow testing!
  `);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
