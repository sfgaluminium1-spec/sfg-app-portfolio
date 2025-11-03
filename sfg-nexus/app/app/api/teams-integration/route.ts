
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Teams Integration API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, messageData, integrationData } = body;

    switch (action) {
      case 'send_message':
        return await sendTeamsMessage(messageData);
      
      case 'send_workflow_update':
        return await sendWorkflowUpdate(messageData);
      
      case 'send_variation_notification':
        return await sendVariationNotification(messageData);
      
      case 'configure_integration':
        return await configureTeamsIntegration(integrationData);
      
      case 'webhook':
        return await handleTeamsWebhook(body);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Teams Integration API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process Teams request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelType = searchParams.get('channelType');
    const jobId = searchParams.get('jobId');
    const customerId = searchParams.get('customerId');

    let whereClause: any = {};
    if (jobId) whereClause.jobId = jobId;
    if (customerId) whereClause.customerId = customerId;

    // Filter by integration channel type if specified
    if (channelType) {
      whereClause.teamsIntegration = {
        channelType: channelType
      };
    }

    const messages = await prisma.teamsMessage.findMany({
      where: whereClause,
      include: {
        teamsIntegration: true,
        customer: true,
        job: true,
        quote: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('Get Teams Messages Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve Teams messages' },
      { status: 500 }
    );
  }
}

// Send Teams message
async function sendTeamsMessage(messageData: any) {
  const {
    channelType,
    messageContent,
    messageType,
    priority,
    mentions,
    workflowContext,
    customerId,
    jobId,
    quoteId
  } = messageData;

  // Get Teams integration for the specified channel type
  const integration = await prisma.teamsIntegration.findFirst({
    where: { 
      isActive: true,
      channelType: channelType || 'GENERAL'
    }
  });

  if (!integration) {
    return NextResponse.json(
      { error: `Teams integration not configured for channel type: ${channelType}` },
      { status: 400 }
    );
  }

  try {
    // Send message to Teams (mock implementation)
    const teamsResult = await sendToTeamsAPI({
      integration,
      messageContent,
      mentions,
      priority
    });

    // Create message record
    const message = await prisma.teamsMessage.create({
      data: {
        messageContent,
        messageType: messageType || 'general',
        priority: priority || 'MEDIUM',
        teamsMessageId: teamsResult.messageId,
        mentions: mentions || [],
        status: teamsResult.success ? 'SENT' : 'FAILED',
        sentAt: teamsResult.success ? new Date() : null,
        failureReason: teamsResult.error,
        workflowContext,
        customerId,
        jobId,
        quoteId,
        integrationId: integration.id
      }
    });

    // Update integration usage
    await prisma.teamsIntegration.update({
      where: { id: integration.id },
      data: {
        messagesCount: { increment: 1 },
        lastMessageSent: new Date()
      }
    });

    return NextResponse.json({
      success: teamsResult.success,
      message,
      teamsMessageId: teamsResult.messageId,
      error: teamsResult.error
    });

  } catch (error) {
    console.error('Teams send error:', error);
    return NextResponse.json(
      { error: 'Failed to send Teams message' },
      { status: 500 }
    );
  }
}

// Send workflow update notification
async function sendWorkflowUpdate(messageData: any) {
  const { jobId, fromStage, toStage, performedBy, reason } = messageData;

  // Get job details
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { customer: true }
  });

  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }

  // Format workflow update message
  const messageContent = formatWorkflowUpdateMessage({
    job,
    fromStage,
    toStage,
    performedBy,
    reason
  });

  // Determine mentions based on workflow stage
  const mentions = getMentionsForWorkflowStage(toStage);

  return await sendTeamsMessage({
    channelType: 'WORKFLOW_UPDATES',
    messageContent,
    messageType: 'workflow_update',
    priority: 'MEDIUM',
    mentions,
    workflowContext: {
      jobId,
      jobNumber: job.jobNumber,
      fromStage,
      toStage,
      performedBy
    },
    customerId: job.customerId,
    jobId
  });
}

// Send variation notification
async function sendVariationNotification(messageData: any) {
  const { variationId, action } = messageData;

  // Get variation details
  const variation = await prisma.projectVariation.findUnique({
    where: { id: variationId },
    include: {
      quote: true,
      job: true,
      customer: true
    }
  });

  if (!variation) {
    return NextResponse.json(
      { error: 'Variation not found' },
      { status: 404 }
    );
  }

  // Format variation message
  const messageContent = formatVariationMessage(variation, action);

  // Determine mentions for variation notifications
  const mentions = ['@channel']; // Notify entire channel for variations

  return await sendTeamsMessage({
    channelType: 'VARIATION_REQUESTS',
    messageContent,
    messageType: 'variation_notification',
    priority: 'HIGH',
    mentions,
    workflowContext: {
      variationId: variation.id,
      variationNumber: variation.variationNumber,
      action,
      value: variation.variationValue
    },
    customerId: variation.customerId,
    jobId: variation.jobId,
    quoteId: variation.quoteId
  });
}

// Configure Teams integration
async function configureTeamsIntegration(integrationData: any) {
  const {
    teamId,
    channelId,
    channelName,
    channelType,
    webhookUrl,
    webhookSecret,
    messageTemplates,
    mentionSettings
  } = integrationData;

  // Check if integration already exists for this channel
  const existingIntegration = await prisma.teamsIntegration.findFirst({
    where: { 
      teamId,
      channelId 
    }
  });

  let integration;
  if (existingIntegration) {
    integration = await prisma.teamsIntegration.update({
      where: { id: existingIntegration.id },
      data: {
        channelName,
        channelType,
        webhookUrl,
        webhookSecret,
        messageTemplates: messageTemplates || getDefaultTeamsTemplates(),
        mentionSettings: mentionSettings || getDefaultMentionSettings()
      }
    });
  } else {
    integration = await prisma.teamsIntegration.create({
      data: {
        teamId,
        channelId,
        channelName,
        channelType,
        webhookUrl,
        webhookSecret,
        isActive: true,
        workflowUpdatesEnabled: true,
        variationNotificationsEnabled: true,
        communicationSyncEnabled: true,
        messageTemplates: messageTemplates || getDefaultTeamsTemplates(),
        mentionSettings: mentionSettings || getDefaultMentionSettings()
      }
    });
  }

  // Test integration
  const testResult = await testTeamsIntegration(integration);

  return NextResponse.json({
    success: true,
    integration,
    testResult
  });
}

// Handle Teams webhook
async function handleTeamsWebhook(webhookData: any) {
  // Process incoming Teams events and messages
  const { type, data } = webhookData;

  switch (type) {
    case 'message':
      await processTeamsMessage(data);
      break;
    case 'mention':
      await processTeamsMention(data);
      break;
    case 'reaction':
      await processTeamsReaction(data);
      break;
  }

  return NextResponse.json({ success: true });
}

// Helper functions
function formatWorkflowUpdateMessage(params: any) {
  const { job, fromStage, toStage, performedBy, reason } = params;

  const stageEmojis: { [key: string]: string } = {
    'CUSTOMER_COMMUNICATION': '📞',
    'DRAWING_APPROVAL': '📐',
    'MATERIALS_ANALYSIS': '🔍',
    'ORDER_CREATION': '📝',
    'SUPPLIER_ORDERING': '🏭',
    'QUALITY_CHECK': '✅',
    'PRODUCTION_STAGE': '⚙️',
    'DELIVERY_COORDINATION': '🚚',
    'INSTALLATION_SCHEDULING': '📅',
    'COMPLETION_VERIFICATION': '🎉'
  };

  const fromEmoji = stageEmojis[fromStage] || '📋';
  const toEmoji = stageEmojis[toStage] || '📋';

  return `🔄 **Workflow Update**

**Job:** ${job.jobNumber} - ${job.client}
**Progress:** ${fromEmoji} ${fromStage} → ${toEmoji} ${toStage}
**Updated by:** ${performedBy}
${reason ? `**Reason:** ${reason}` : ''}

**Project Value:** £${job.value?.toLocaleString() || 'TBC'}
**Status:** ${job.status}`;
}

function formatVariationMessage(variation: any, action: string) {
  const actionEmojis: { [key: string]: string } = {
    'created': '🆕',
    'approved': '✅',
    'rejected': '❌',
    'implemented': '🎯'
  };

  const emoji = actionEmojis[action] || '📝';
  const actionText = action.charAt(0).toUpperCase() + action.slice(1);

  return `${emoji} **Variation ${actionText}**

**Variation:** ${variation.variationNumber}
**Customer:** ${variation.customer.firstName} ${variation.customer.lastName || ''}
**Project:** ${variation.job?.jobNumber || variation.quote?.quoteNumber}

**Type:** ${variation.variationType.replace('_', ' ')}
**Description:** ${variation.description}
**Value Impact:** £${variation.variationValue.toLocaleString()}
**New Total:** £${variation.totalNewValue.toLocaleString()}

**Status:** ${variation.approvalStatus.replace('_', ' ')}`;
}

function getMentionsForWorkflowStage(stage: string): string[] {
  const stageMentions: { [key: string]: string[] } = {
    'DRAWING_APPROVAL': ['@design-team'],
    'MATERIALS_ANALYSIS': ['@procurement-team'],
    'QUALITY_CHECK': ['@quality-team'],
    'PRODUCTION_STAGE': ['@production-team'],
    'INSTALLATION_SCHEDULING': ['@installation-team']
  };

  return stageMentions[stage] || [];
}

async function sendToTeamsAPI(params: any) {
  // Mock Teams webhook call
  // In real implementation, use Microsoft Teams webhook API
  try {
    const { integration, messageContent, mentions, priority } = params;

    // Simulate API call
    const success = Math.random() > 0.05; // 95% success rate
    
    if (success) {
      return {
        success: true,
        messageId: `teams_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Failed to send Teams message'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function getDefaultTeamsTemplates() {
  return {
    workflow_update: {
      title: 'Workflow Update',
      color: '0078D4',
      sections: [
        {
          activityTitle: 'Job Progress',
          activitySubtitle: 'Workflow stage changed'
        }
      ]
    },
    variation_notification: {
      title: 'Project Variation',
      color: 'FF8C00',
      sections: [
        {
          activityTitle: 'Variation Request',
          activitySubtitle: 'Customer variation submitted'
        }
      ]
    },
    communication_sync: {
      title: 'Customer Communication',
      color: '28A745',
      sections: [
        {
          activityTitle: 'Customer Message',
          activitySubtitle: 'New communication received'
        }
      ]
    }
  };
}

function getDefaultMentionSettings() {
  return {
    workflow_updates: {
      high_priority: ['@channel'],
      urgent: ['@everyone'],
      variations: ['@management']
    },
    approval_required: ['@management'],
    quality_issues: ['@quality-team', '@management'],
    customer_escalation: ['@customer-service', '@management']
  };
}

async function testTeamsIntegration(integration: any) {
  try {
    // Send test message
    const testResult = await sendToTeamsAPI({
      integration,
      messageContent: `🧪 **Teams Integration Test**\n\nIntegration for ${integration.channelName} is working correctly!\n\nChannel Type: ${integration.channelType}\nTimestamp: ${new Date().toISOString()}`,
      mentions: [],
      priority: 'LOW'
    });

    return {
      success: testResult.success,
      message: testResult.success ? 'Teams integration test successful' : 'Teams integration test failed',
      error: testResult.error
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to test Teams integration',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function processTeamsMessage(messageData: any) {
  // Process incoming Teams messages (mentions, replies, etc.)
  try {
    const { messageId, text, author, channelId, timestamp } = messageData;

    // Find the Teams integration
    const integration = await prisma.teamsIntegration.findFirst({
      where: { channelId }
    });

    if (!integration) return;

    // Create communication record if it's a response to a workflow update
    // Note: Skipping customer communication creation as no customer context is available
    if (text.includes('@workflow') || text.includes('@bot')) {
      console.log('Teams workflow interaction detected:', {
        messageId,
        author: author.name,
        text: text.substring(0, 100)
      });
      // TODO: Implement proper customer context resolution for Teams communications
    }
  } catch (error) {
    console.error('Error processing Teams message:', error);
  }
}

async function processTeamsMention(mentionData: any) {
  // Process Teams mentions (when bot is mentioned)
  try {
    const { text, author, channelId } = mentionData;

    // Parse mention commands
    if (text.includes('status')) {
      // Send workflow status update
      await sendWorkflowStatusSummary(channelId);
    } else if (text.includes('help')) {
      // Send help information
      await sendTeamsHelpMessage(channelId);
    }
  } catch (error) {
    console.error('Error processing Teams mention:', error);
  }
}

async function processTeamsReaction(reactionData: any) {
  // Process Teams reactions (likes, approvals, etc.)
  try {
    const { messageId, reaction, user } = reactionData;

    // Find the original Teams message
    const teamsMessage = await prisma.teamsMessage.findFirst({
      where: { teamsMessageId: messageId }
    });

    if (teamsMessage && reaction === '👍' && teamsMessage.messageType === 'variation_notification') {
      // Treat thumbs up as approval for variation notifications
      await processVariationApprovalViaTeams(teamsMessage, user);
    }
  } catch (error) {
    console.error('Error processing Teams reaction:', error);
  }
}

async function sendWorkflowStatusSummary(channelId: string) {
  // Send a summary of current workflow statuses
  const activeJobs = await prisma.job.findMany({
    where: { 
      status: { in: ['APPROVED', 'IN_PRODUCTION', 'FABRICATION', 'ASSEMBLY', 'READY_FOR_INSTALL'] }
    },
    take: 10,
    orderBy: { updatedAt: 'desc' }
  });

  const statusSummary = activeJobs.map((job: any) => 
    `• ${job.jobNumber} - ${job.client} (${job.status})`
  ).join('\n');

  const messageContent = `📊 **Workflow Status Summary**\n\nActive Jobs:\n${statusSummary}`;

  await sendTeamsMessage({
    channelType: 'WORKFLOW_UPDATES',
    messageContent,
    messageType: 'status_summary',
    priority: 'MEDIUM'
  });
}

async function sendTeamsHelpMessage(channelId: string) {
  const helpContent = `🤖 **Teams Bot Help**

Available commands:
• Mention me with "status" for workflow summary
• React with 👍 to approve variations
• Use @workflow for workflow-related queries

Automatic notifications:
• Workflow stage changes
• Variation requests
• Customer communications
• Quality alerts

Need more help? Contact the development team.`;

  await sendTeamsMessage({
    channelType: 'GENERAL',
    messageContent: helpContent,
    messageType: 'help',
    priority: 'LOW'
  });
}

async function processVariationApprovalViaTeams(teamsMessage: any, user: any) {
  const variationId = teamsMessage.workflowContext?.variationId;
  
  if (variationId) {
    await prisma.projectVariation.update({
      where: { id: variationId },
      data: {
        internalApproved: true,
        internalApprovedAt: new Date(),
        internalApprovedBy: user.name,
        internalNotes: 'Approved via Teams reaction'
      }
    });

    // Send confirmation message
    await sendTeamsMessage({
      channelType: 'VARIATION_REQUESTS',
      messageContent: `✅ **Variation Approved**\n\nVariation ${teamsMessage.workflowContext.variationNumber} has been approved by ${user.name} via Teams reaction.`,
      messageType: 'variation_approved',
      priority: 'MEDIUM'
    });
  }
}
