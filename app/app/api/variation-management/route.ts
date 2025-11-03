
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Variation Management API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, variationData, approvalData } = body;

    switch (action) {
      case 'create_variation':
        return await createProjectVariation(variationData);
      
      case 'approve_variation':
        return await approveVariation(variationData.id, approvalData);
      
      case 'reject_variation':
        return await rejectVariation(variationData.id, approvalData);
      
      case 'implement_variation':
        return await implementVariation(variationData.id, approvalData);
      
      case 'generate_revised_quote':
        return await generateRevisedQuote(variationData);
      
      case 'send_variation_request':
        return await sendVariationRequest(variationData);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Variation Management API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process variation request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('quoteId');
    const jobId = searchParams.get('jobId');
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');

    let whereClause: any = {};
    if (quoteId) whereClause.quoteId = quoteId;
    if (jobId) whereClause.jobId = jobId;
    if (customerId) whereClause.customerId = customerId;
    if (status) whereClause.approvalStatus = status;

    const variations = await prisma.projectVariation.findMany({
      where: whereClause,
      include: {
        quote: true,
        job: true,
        customer: true,
        communications: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      variations
    });

  } catch (error) {
    console.error('Get Variations Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve variations' },
      { status: 500 }
    );
  }
}

// Create new project variation
async function createProjectVariation(variationData: any) {
  const {
    quoteId,
    jobId,
    customerId,
    variationType,
    description,
    reason,
    originalValue,
    variationValue,
    initialNotes,
    requestedBy
  } = variationData;

  // Validate required fields
  if (!quoteId || !customerId || !variationType || !description) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Get quote details
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { customer: true }
  });

  if (!quote) {
    return NextResponse.json(
      { error: 'Quote not found' },
      { status: 404 }
    );
  }

  // Generate variation number
  const variationNumber = await generateVariationNumber(quoteId);

  // Calculate new total value
  const totalNewValue = originalValue + variationValue;

  // Create variation record
  const variation = await prisma.projectVariation.create({
    data: {
      variationNumber,
      variationType,
      description,
      reason,
      originalValue,
      variationValue,
      totalNewValue,
      initialNotes,
      approvalStatus: 'PENDING_APPROVAL',
      requiresCustomerApproval: Math.abs(variationValue) > 100, // Require approval for changes > £100
      requiresInternalApproval: true,
      quoteId,
      jobId,
      customerId
    }
  });

  // Update quote variation flags
  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      hasVariations: true,
      variationsValue: {
        increment: variationValue
      },
      variationApprovalStatus: 'PENDING_APPROVAL'
    }
  });

  // Create initial communication record
  await prisma.variationCommunication.create({
    data: {
      variationId: variation.id,
      communicationType: 'CUSTOMER_UPDATE',
      platform: 'EMAIL',
      subject: `Variation Request: ${variationNumber}`,
      message: `New variation request created: ${description}`,
      status: 'SENT'
    }
  });

  // Send Teams notification
  await sendVariationTeamsNotification(variation, 'created');

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'VARIATION_CREATED',
      description: `Variation ${variationNumber} created for quote ${quote.quoteNumber}`,
      user: requestedBy || 'System',
      quoteId,
      jobId,
      metadata: {
        variationId: variation.id,
        variationNumber,
        variationType,
        value: variationValue
      }
    }
  });

  return NextResponse.json({
    success: true,
    variation,
    message: `Variation ${variationNumber} created successfully`
  });
}

// Approve variation
async function approveVariation(variationId: string, approvalData: any) {
  const { approvedBy, notes, approvalType } = approvalData;

  const variation = await prisma.projectVariation.findUnique({
    where: { id: variationId },
    include: { quote: true, job: true, customer: true }
  });

  if (!variation) {
    return NextResponse.json(
      { error: 'Variation not found' },
      { status: 404 }
    );
  }

  let updateData: any = {};
  let communicationMessage = '';

  if (approvalType === 'customer') {
    updateData = {
      customerApproved: true,
      customerApprovedAt: new Date(),
      customerApprovedBy: approvedBy,
      customerNotes: notes
    };
    communicationMessage = `Customer approval received for variation ${variation.variationNumber}`;
  } else {
    updateData = {
      internalApproved: true,
      internalApprovedAt: new Date(),
      internalApprovedBy: approvedBy,
      internalNotes: notes
    };
    communicationMessage = `Internal approval received for variation ${variation.variationNumber}`;
  }

  // Check if both approvals are now complete
  const bothApproved = (approvalType === 'customer' && variation.internalApproved) ||
                      (approvalType === 'internal' && variation.customerApproved);

  if (bothApproved || !variation.requiresCustomerApproval) {
    updateData.approvalStatus = 'FULLY_APPROVED';
  }

  // Update variation
  const updatedVariation = await prisma.projectVariation.update({
    where: { id: variationId },
    data: updateData
  });

  // Create communication record
  await prisma.variationCommunication.create({
    data: {
      variationId,
      communicationType: 'APPROVAL_REQUEST',
      platform: 'EMAIL',
      subject: `Variation Approved: ${variation.variationNumber}`,
      message: communicationMessage,
      status: 'SENT'
    }
  });

  // Send Teams notification
  await sendVariationTeamsNotification(updatedVariation, 'approved');

  // If fully approved, trigger revised quote generation
  if (updatedVariation.approvalStatus === 'FULLY_APPROVED') {
    await triggerRevisedQuoteGeneration(updatedVariation);
  }

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'VARIATION_APPROVED',
      description: `Variation ${variation.variationNumber} ${approvalType} approval by ${approvedBy}`,
      user: approvedBy,
      quoteId: variation.quoteId,
      jobId: variation.jobId,
      metadata: {
        variationId,
        approvalType,
        notes
      }
    }
  });

  return NextResponse.json({
    success: true,
    variation: updatedVariation,
    message: `Variation ${approvalType} approval recorded successfully`
  });
}

// Reject variation
async function rejectVariation(variationId: string, approvalData: any) {
  const { rejectedBy, reason, rejectionType } = approvalData;

  const variation = await prisma.projectVariation.findUnique({
    where: { id: variationId },
    include: { quote: true }
  });

  if (!variation) {
    return NextResponse.json(
      { error: 'Variation not found' },
      { status: 404 }
    );
  }

  // Update variation status
  const updatedVariation = await prisma.projectVariation.update({
    where: { id: variationId },
    data: {
      approvalStatus: 'REJECTED',
      [`${rejectionType}Approved`]: false,
      [`${rejectionType}ApprovedAt`]: new Date(),
      [`${rejectionType}ApprovedBy`]: rejectedBy,
      [`${rejectionType}Notes`]: reason
    }
  });

  // Create communication record
  await prisma.variationCommunication.create({
    data: {
      variationId,
      communicationType: 'CUSTOMER_UPDATE',
      platform: 'EMAIL',
      subject: `Variation Rejected: ${variation.variationNumber}`,
      message: `Variation rejected by ${rejectedBy}. Reason: ${reason}`,
      status: 'SENT'
    }
  });

  // Send Teams notification
  await sendVariationTeamsNotification(updatedVariation, 'rejected');

  // Update quote variation status
  await prisma.quote.update({
    where: { id: variation.quoteId },
    data: {
      variationApprovalStatus: 'REJECTED'
    }
  });

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'VARIATION_REJECTED',
      description: `Variation ${variation.variationNumber} rejected by ${rejectedBy}`,
      user: rejectedBy,
      quoteId: variation.quoteId,
      jobId: variation.jobId,
      metadata: {
        variationId,
        rejectionType,
        reason
      }
    }
  });

  return NextResponse.json({
    success: true,
    variation: updatedVariation,
    message: `Variation rejected successfully`
  });
}

// Implement approved variation
async function implementVariation(variationId: string, approvalData: any) {
  const { implementedBy, notes } = approvalData;

  const variation = await prisma.projectVariation.findUnique({
    where: { id: variationId },
    include: { quote: true, job: true }
  });

  if (!variation) {
    return NextResponse.json(
      { error: 'Variation not found' },
      { status: 404 }
    );
  }

  if (variation.approvalStatus !== 'FULLY_APPROVED') {
    return NextResponse.json(
      { error: 'Variation must be fully approved before implementation' },
      { status: 400 }
    );
  }

  // Update variation as implemented
  const updatedVariation = await prisma.projectVariation.update({
    where: { id: variationId },
    data: {
      implemented: true,
      implementedAt: new Date(),
      implementedBy,
      internalNotes: notes
    }
  });

  // Update quote value if not already done
  if (!variation.revisedQuoteGenerated) {
    await prisma.quote.update({
      where: { id: variation.quoteId },
      data: {
        value: variation.totalNewValue,
        revisedPrice: variation.totalNewValue,
        revision: { increment: 1 },
        hasVariations: true
      }
    });
  }

  // Update job value if exists
  if (variation.jobId) {
    await prisma.job.update({
      where: { id: variation.jobId },
      data: {
        value: variation.totalNewValue
      }
    });
  }

  // Create communication record
  await prisma.variationCommunication.create({
    data: {
      variationId,
      communicationType: 'CUSTOMER_UPDATE',
      platform: 'EMAIL',
      subject: `Variation Implemented: ${variation.variationNumber}`,
      message: `Variation ${variation.variationNumber} has been implemented by ${implementedBy}`,
      status: 'SENT'
    }
  });

  // Send Teams notification
  await sendVariationTeamsNotification(updatedVariation, 'implemented');

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'VARIATION_IMPLEMENTED',
      description: `Variation ${variation.variationNumber} implemented by ${implementedBy}`,
      user: implementedBy,
      quoteId: variation.quoteId,
      jobId: variation.jobId,
      metadata: {
        variationId,
        newValue: variation.totalNewValue,
        notes
      }
    }
  });

  return NextResponse.json({
    success: true,
    variation: updatedVariation,
    message: `Variation implemented successfully`
  });
}

// Generate revised quote
async function generateRevisedQuote(variationData: any) {
  const { variationId, quoteData } = variationData;

  const variation = await prisma.projectVariation.findUnique({
    where: { id: variationId },
    include: { quote: true }
  });

  if (!variation) {
    return NextResponse.json(
      { error: 'Variation not found' },
      { status: 404 }
    );
  }

  // Create revised quote
  const revisedQuote = await prisma.quote.create({
    data: {
      ...quoteData,
      quoteNumber: `${variation.quote.quoteNumber}-R${variation.quote.revision + 1}`,
      revision: variation.quote.revision + 1,
      value: variation.totalNewValue,
      netValue: variation.totalNewValue,
      originalQuoteId: variation.quoteId,
      hasVariations: true,
      variationsValue: variation.variationValue,
      customerId: variation.customerId,
      status: 'PENDING'
    }
  });

  // Update variation as having revised quote generated
  await prisma.projectVariation.update({
    where: { id: variationId },
    data: {
      revisedQuoteGenerated: true
    }
  });

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'QUOTE_REVISED',
      description: `Revised quote ${revisedQuote.quoteNumber} generated for variation ${variation.variationNumber}`,
      user: 'System',
      quoteId: revisedQuote.id,
      metadata: {
        originalQuoteId: variation.quoteId,
        variationId,
        newValue: variation.totalNewValue
      }
    }
  });

  return NextResponse.json({
    success: true,
    revisedQuote,
    variation,
    message: `Revised quote ${revisedQuote.quoteNumber} generated successfully`
  });
}

// Send variation request to customer
async function sendVariationRequest(variationData: any) {
  const { variationId, communicationMethod, customMessage } = variationData;

  const variation = await prisma.projectVariation.findUnique({
    where: { id: variationId },
    include: {
      quote: true,
      customer: {
        include: { customerContacts: true }
      }
    }
  });

  if (!variation) {
    return NextResponse.json(
      { error: 'Variation not found' },
      { status: 404 }
    );
  }

  // Create variation request message
  const messageContent = customMessage || generateVariationRequestMessage(variation);

  // Send via selected communication method
  let communicationResult;
  switch (communicationMethod) {
    case 'EMAIL':
      communicationResult = await sendVariationEmail(variation, messageContent);
      break;
    case 'WHATSAPP':
      communicationResult = await sendVariationWhatsApp(variation, messageContent);
      break;
    case 'PORTAL':
      communicationResult = await sendVariationPortalNotification(variation, messageContent);
      break;
    default:
      communicationResult = { success: false, error: 'Invalid communication method' };
  }

  // Create communication record
  await prisma.variationCommunication.create({
    data: {
      variationId,
      communicationType: 'VARIATION_REQUEST',
      platform: communicationMethod,
      subject: `Variation Request: ${variation.variationNumber}`,
      message: messageContent,
      status: communicationResult.success ? 'SENT' : 'FAILED'
    }
  });

  return NextResponse.json({
    success: communicationResult.success,
    message: communicationResult.success 
      ? `Variation request sent via ${communicationMethod}`
      : `Failed to send variation request: ${'error' in communicationResult ? communicationResult.error : 'Unknown error'}`
  });
}

// Helper functions
async function generateVariationNumber(quoteId: string): Promise<string> {
  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  const existingVariations = await prisma.projectVariation.count({
    where: { quoteId }
  });
  
  return `${quote?.quoteNumber}-VAR${(existingVariations + 1).toString().padStart(3, '0')}`;
}

async function sendVariationTeamsNotification(variation: any, action: string) {
  try {
    // Use the Teams integration API to send notification
    const response = await fetch('/api/teams-integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_variation_notification',
        messageData: {
          variationId: variation.id,
          action
        }
      })
    });
  } catch (error) {
    console.error('Teams notification error:', error);
  }
}

async function triggerRevisedQuoteGeneration(variation: any) {
  // Auto-trigger revised quote generation for fully approved variations
  try {
    await generateRevisedQuote({
      variationId: variation.id,
      quoteData: {
        customerName: variation.customer?.firstName || '',
        projectName: variation.quote?.projectName,
        contactName: variation.quote?.contactName,
        quotedBy: 'System (Variation)',
        description: `Revised quote including variation ${variation.variationNumber}`
      }
    });
  } catch (error) {
    console.error('Auto-generate revised quote error:', error);
  }
}

function generateVariationRequestMessage(variation: any): string {
  return `Dear ${variation.customer?.firstName || 'Customer'},

We have prepared a variation request for your project:

Variation Number: ${variation.variationNumber}
Project: ${variation.quote?.projectName || 'Your Project'}
Type: ${variation.variationType.replace('_', ' ')}

Description:
${variation.description}

Financial Impact:
Original Value: £${variation.originalValue.toLocaleString()}
Variation Value: £${variation.variationValue >= 0 ? '+' : ''}${variation.variationValue.toLocaleString()}
New Total Value: £${variation.totalNewValue.toLocaleString()}

${variation.initialNotes ? `Notes:\n${variation.initialNotes}\n\n` : ''}Please review this variation and let us know if you approve the changes.

Best regards,
SFG Aluminium Team`;
}

async function sendVariationEmail(variation: any, messageContent: string) {
  // Mock email sending - integrate with actual email service
  return { success: true, messageId: `email_${Date.now()}` };
}

async function sendVariationWhatsApp(variation: any, messageContent: string) {
  // Use WhatsApp integration to send variation request
  try {
    const primaryContact = variation.customer.customerContacts.find(
      (c: any) => c.role === 'PRIMARY_CONTACT' && c.whatsappEnabled
    );

    if (!primaryContact) {
      return { success: false, error: 'No WhatsApp-enabled contact found' };
    }

    const response = await fetch('/api/whatsapp-integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_message',
        messageData: {
          messageType: 'PROJECT_UPDATE',
          recipientPhone: primaryContact.whatsappNumber,
          recipientName: primaryContact.contactName,
          messageContent,
          customerId: variation.customerId,
          quoteId: variation.quoteId,
          customerContactId: primaryContact.id
        }
      })
    });

    const result = await response.json();
    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: 'WhatsApp integration error' };
  }
}

async function sendVariationPortalNotification(variation: any, messageContent: string) {
  // Create portal notification for customer
  try {
    await prisma.customerCommunication.create({
      data: {
        subject: `Variation Request: ${variation.variationNumber}`,
        message: messageContent,
        communicationType: 'VARIATION_REQUEST',
        platform: 'PORTAL',
        direction: 'OUTBOUND',
        status: 'SENT',
        customerId: variation.customerId,
        quoteId: variation.quoteId
      }
    });

    return { success: true, messageId: `portal_${Date.now()}` };
  } catch (error) {
    return { success: false, error: 'Portal notification error' };
  }
}
