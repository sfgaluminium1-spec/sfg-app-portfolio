
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// WhatsApp Business Integration API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, messageData, integrationData } = body;

    switch (action) {
      case 'send_message':
        return await sendWhatsAppMessage(messageData);
      
      case 'send_drawing_approval':
        return await sendDrawingApprovalRequest(messageData);
      
      case 'send_daily_reminder':
        return await sendDailyReminder(messageData);
      
      case 'send_portal_promotion':
        return await sendPortalPromotion(messageData);
      
      case 'configure_integration':
        return await configureWhatsAppIntegration(integrationData);
      
      case 'webhook':
        return await handleWhatsAppWebhook(body);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('WhatsApp Integration API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process WhatsApp request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const jobId = searchParams.get('jobId');
    const messageType = searchParams.get('messageType');

    let whereClause: any = {};
    if (customerId) whereClause.customerId = customerId;
    if (jobId) whereClause.jobId = jobId;
    if (messageType) whereClause.messageType = messageType;

    const messages = await prisma.whatsAppMessage.findMany({
      where: whereClause,
      include: {
        customer: true,
        customerContact: true,
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
    console.error('Get WhatsApp Messages Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve WhatsApp messages' },
      { status: 500 }
    );
  }
}

// Send WhatsApp message
async function sendWhatsAppMessage(messageData: any) {
  const {
    messageType,
    recipientPhone,
    recipientName,
    messageContent,
    templateName,
    projectContext,
    customerId,
    jobId,
    quoteId,
    customerContactId
  } = messageData;

  // Get WhatsApp integration
  const integration = await prisma.whatsAppIntegration.findFirst({
    where: { isActive: true }
  });

  if (!integration) {
    return NextResponse.json(
      { error: 'WhatsApp integration not configured' },
      { status: 400 }
    );
  }

  // Validate phone number format
  const formattedPhone = formatPhoneNumber(recipientPhone);
  if (!formattedPhone) {
    return NextResponse.json(
      { error: 'Invalid phone number format' },
      { status: 400 }
    );
  }

  try {
    // Send message via WhatsApp Business API (mock implementation)
    const whatsappResult = await sendToWhatsAppAPI({
      integration,
      recipientPhone: formattedPhone,
      messageContent,
      templateName
    });

    // Create message record
    const message = await prisma.whatsAppMessage.create({
      data: {
        messageType,
        messageContent,
        templateName,
        recipientPhone: formattedPhone,
        recipientName,
        status: whatsappResult.success ? 'SENT' : 'FAILED',
        whatsappMessageId: whatsappResult.messageId,
        sentAt: whatsappResult.success ? new Date() : null,
        failureReason: whatsappResult.error,
        projectContext,
        customerId,
        jobId,
        quoteId,
        customerContactId,
        integrationId: integration.id
      }
    });

    // Update integration usage
    await prisma.whatsAppIntegration.update({
      where: { id: integration.id },
      data: {
        messagesCount: { increment: 1 },
        lastMessageSent: new Date()
      }
    });

    return NextResponse.json({
      success: whatsappResult.success,
      message,
      whatsappMessageId: whatsappResult.messageId,
      error: whatsappResult.error
    });

  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      { error: 'Failed to send WhatsApp message' },
      { status: 500 }
    );
  }
}

// Send drawing approval request via WhatsApp
async function sendDrawingApprovalRequest(messageData: any) {
  const { jobId, drawingId, customerContactId } = messageData;

  // Get job and drawing details
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { customer: true }
  });

  const drawing = await prisma.drawingApproval.findUnique({
    where: { id: drawingId }
  });

  const customerContact = await prisma.customerContact.findUnique({
    where: { id: customerContactId }
  });

  if (!job || !drawing || !customerContact || !customerContact.whatsappEnabled) {
    return NextResponse.json(
      { error: 'Invalid request or WhatsApp not enabled for contact' },
      { status: 400 }
    );
  }

  const messageContent = `🏗️ Drawing Approval Required

Job: ${job.jobNumber}
Project: ${job.description}
Drawing: ${drawing.drawingName} v${drawing.drawingVersion}

Please review and approve the attached drawing for your project.

Reply with:
✅ APPROVE - if you approve the drawing
❌ REJECT - if changes are needed

Thank you!`;

  return await sendWhatsAppMessage({
    messageType: 'DRAWING_APPROVAL_REQUEST',
    recipientPhone: customerContact.whatsappNumber,
    recipientName: customerContact.contactName,
    messageContent,
    templateName: 'drawing_approval_request',
    projectContext: {
      jobId,
      drawingId,
      jobNumber: job.jobNumber
    },
    customerId: job.customerId,
    jobId,
    customerContactId
  });
}

// Send daily reminder
async function sendDailyReminder(messageData: any) {
  const { customerContactId, reminderType, projectDetails } = messageData;

  const customerContact = await prisma.customerContact.findUnique({
    where: { id: customerContactId },
    include: { customer: true }
  });

  if (!customerContact || !customerContact.whatsappEnabled) {
    return NextResponse.json(
      { error: 'WhatsApp not enabled for this contact' },
      { status: 400 }
    );
  }

  let messageContent = '';
  switch (reminderType) {
    case 'drawing_approval':
      messageContent = `⏰ Daily Reminder

Hi ${customerContact.contactName},

You have pending drawing approvals that require your attention:

${projectDetails.map((p: any) => `• Job ${p.jobNumber}: ${p.drawingName}`).join('\n')}

Please review and respond when convenient.

Thank you!`;
      break;
    
    case 'project_update':
      messageContent = `📋 Project Update Reminder

Hi ${customerContact.contactName},

Your project updates are ready for review. Please check your customer portal or respond to our recent messages.

Need help? Just reply to this message.

Best regards!`;
      break;
  }

  return await sendWhatsAppMessage({
    messageType: 'DAILY_REMINDER',
    recipientPhone: customerContact.whatsappNumber,
    recipientName: customerContact.contactName,
    messageContent,
    templateName: `daily_reminder_${reminderType}`,
    customerId: customerContact.customerId,
    customerContactId
  });
}

// Send customer portal promotion
async function sendPortalPromotion(messageData: any) {
  const { customerContactId, portalDemoLink } = messageData;

  const customerContact = await prisma.customerContact.findUnique({
    where: { id: customerContactId },
    include: { customer: true }
  });

  if (!customerContact || !customerContact.whatsappEnabled) {
    return NextResponse.json(
      { error: 'WhatsApp not enabled for this contact' },
      { status: 400 }
    );
  }

  const messageContent = `🚀 Introducing Our New Customer Portal!

Hi ${customerContact.contactName},

We're excited to introduce our new customer portal where you can:

✅ Track your projects in real-time
✅ Submit new enquiries easily
✅ Approve drawings digitally
✅ Access all your documents
✅ Communicate with our team

Try our demo: ${portalDemoLink}

Questions? Just reply to this message!

Best regards,
SFG Aluminium Team`;

  return await sendWhatsAppMessage({
    messageType: 'PORTAL_PROMOTION',
    recipientPhone: customerContact.whatsappNumber,
    recipientName: customerContact.contactName,
    messageContent,
    templateName: 'portal_promotion',
    projectContext: { portalDemoLink },
    customerId: customerContact.customerId,
    customerContactId
  });
}

// Configure WhatsApp integration
async function configureWhatsAppIntegration(integrationData: any) {
  const {
    businessAccountId,
    phoneNumberId,
    phoneNumber,
    accessToken,
    webhookUrl,
    webhookSecret,
    messageTemplates
  } = integrationData;

  // Check if integration already exists
  const existingIntegration = await prisma.whatsAppIntegration.findUnique({
    where: { businessAccountId }
  });

  let integration;
  if (existingIntegration) {
    integration = await prisma.whatsAppIntegration.update({
      where: { id: existingIntegration.id },
      data: {
        phoneNumberId,
        phoneNumber,
        accessToken,
        webhookUrl,
        webhookSecret,
        messageTemplates,
        verificationStatus: 'PENDING'
      }
    });
  } else {
    integration = await prisma.whatsAppIntegration.create({
      data: {
        businessAccountId,
        phoneNumberId,
        phoneNumber,
        accessToken,
        webhookUrl,
        webhookSecret,
        messageTemplates: messageTemplates || getDefaultMessageTemplates(),
        verificationStatus: 'PENDING',
        isActive: true,
        dailyRemindersEnabled: true,
        drawingApprovalsEnabled: true,
        portalPromotionEnabled: true
      }
    });
  }

  // Verify integration (mock verification)
  const verificationResult = await verifyWhatsAppIntegration(integration);

  if (verificationResult.success) {
    await prisma.whatsAppIntegration.update({
      where: { id: integration.id },
      data: { verificationStatus: 'VERIFIED' }
    });
  }

  return NextResponse.json({
    success: true,
    integration,
    verification: verificationResult
  });
}

// Handle WhatsApp webhook
async function handleWhatsAppWebhook(webhookData: any) {
  // Process incoming WhatsApp messages and status updates
  const { messages, statuses } = webhookData;

  // Process message status updates
  if (statuses) {
    for (const status of statuses) {
      await updateMessageStatus(status);
    }
  }

  // Process incoming messages (replies)
  if (messages) {
    for (const message of messages) {
      await processIncomingMessage(message);
    }
  }

  return NextResponse.json({ success: true });
}

// Helper functions
function formatPhoneNumber(phone: string): string | null {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // UK number validation and formatting
  if (digits.startsWith('44')) {
    return `+${digits}`;
  } else if (digits.startsWith('0')) {
    return `+44${digits.substring(1)}`;
  } else if (digits.length === 10) {
    return `+44${digits}`;
  }
  
  return null;
}

async function sendToWhatsAppAPI(params: any) {
  // Mock WhatsApp Business API call
  // In real implementation, use actual WhatsApp Business API
  try {
    // Simulate API call
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        messageId: `wa_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Failed to deliver message'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function getDefaultMessageTemplates() {
  return {
    drawing_approval_request: {
      name: 'drawing_approval_request',
      content: 'Drawing approval required for Job {{jobNumber}}. Please review and respond.',
      category: 'UTILITY'
    },
    daily_reminder: {
      name: 'daily_reminder',
      content: 'Daily reminder: You have pending approvals requiring attention.',
      category: 'UTILITY'
    },
    portal_promotion: {
      name: 'portal_promotion',
      content: 'Try our new customer portal for better project management.',
      category: 'MARKETING'
    }
  };
}

async function verifyWhatsAppIntegration(integration: any) {
  // Mock verification - in real implementation, test API connectivity
  try {
    // Simulate verification API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'WhatsApp integration verified successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to verify WhatsApp integration',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function updateMessageStatus(status: any) {
  const { id, status: messageStatus, timestamp } = status;
  
  try {
    await prisma.whatsAppMessage.updateMany({
      where: { whatsappMessageId: id },
      data: {
        status: messageStatus.toUpperCase(),
        [`${messageStatus}At`]: new Date(timestamp * 1000)
      }
    });
  } catch (error) {
    console.error('Error updating message status:', error);
  }
}

async function processIncomingMessage(message: any) {
  const { from, text, timestamp } = message;
  
  try {
    // Find the customer contact by phone number
    const customerContact = await prisma.customerContact.findFirst({
      where: { whatsappNumber: from }
    });

    if (!customerContact) return;

    // Process approval responses
    if (text?.body) {
      const response = text.body.toUpperCase().trim();
      if (response.includes('APPROVE') || response.includes('✅')) {
        await processDrawingApproval(customerContact, true, text.body);
      } else if (response.includes('REJECT') || response.includes('❌')) {
        await processDrawingApproval(customerContact, false, text.body);
      }
    }

    // Create customer communication record
    await prisma.customerCommunication.create({
      data: {
        subject: 'WhatsApp Response',
        message: text?.body || 'Media message received',
        communicationType: 'GENERAL_INQUIRY',
        platform: 'WHATSAPP',
        direction: 'INBOUND',
        status: 'DELIVERED',
        customerId: customerContact.customerId,
        toContactId: customerContact.id,
        platformMessageId: message.id,
        sentAt: new Date(timestamp * 1000)
      }
    });

  } catch (error) {
    console.error('Error processing incoming message:', error);
  }
}

async function processDrawingApproval(customerContact: any, approved: boolean, message: string) {
  // Find pending drawing approvals for this customer
  const pendingDrawings = await prisma.drawingApproval.findMany({
    where: {
      job: {
        customerId: customerContact.customerId
      },
      customerApproved: false,
      status: { in: ['UPLOADED', 'CUSTOMER_REVIEW'] }
    },
    include: { job: true }
  });

  // Update the most recent drawing approval
  if (pendingDrawings.length > 0) {
    const latestDrawing = pendingDrawings[0];
    
    await prisma.drawingApproval.update({
      where: { id: latestDrawing.id },
      data: {
        customerApproved: approved,
        customerApprovedAt: new Date(),
        customerApprovedBy: customerContact.contactName,
        customerNotes: message,
        status: approved ? 'APPROVED' : 'REJECTED'
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'DRAWING_APPROVAL',
        description: `Drawing ${approved ? 'approved' : 'rejected'} via WhatsApp by ${customerContact.contactName}`,
        user: customerContact.contactName,
        jobId: latestDrawing.jobId,
        metadata: {
          drawingId: latestDrawing.id,
          approved,
          method: 'WhatsApp',
          message
        }
      }
    });
  }
}
