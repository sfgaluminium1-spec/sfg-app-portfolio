
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CustomerPortalFeature } from '@prisma/client';
import { randomBytes } from 'crypto';

export const dynamic = "force-dynamic";

// Customer Portal Demo System API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, customerId, portalData, demoData } = body;

    switch (action) {
      case 'create_demo_access':
        return await createDemoAccess(customerId, demoData);
      
      case 'activate_demo':
        return await activateDemo(demoData.accessToken);
      
      case 'promote_portal':
        return await promotePortalToCustomer(customerId, portalData);
      
      case 'convert_to_full':
        return await convertDemoToFull(customerId, portalData);
      
      case 'track_activity':
        return await trackPortalActivity(portalData);
      
      case 'generate_demo_link':
        return await generateDemoLink(customerId, demoData);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Customer Portal Demo API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process portal demo request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const accessToken = searchParams.get('accessToken');
    const includeActivities = searchParams.get('includeActivities') === 'true';

    if (accessToken) {
      // Get portal access by token
      const portalAccess = await prisma.customerPortalAccess.findUnique({
        where: { accessToken },
        include: {
          customer: true,
          portalActivities: includeActivities ? {
            orderBy: { createdAt: 'desc' },
            take: 100
          } : false
        }
      });

      if (!portalAccess) {
        return NextResponse.json(
          { error: 'Invalid access token' },
          { status: 404 }
        );
      }

      // Check if demo access has expired
      if (portalAccess.isDemoAccess && portalAccess.demoExpiresAt && 
          new Date() > portalAccess.demoExpiresAt) {
        return NextResponse.json(
          { error: 'Demo access has expired' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        portalAccess
      });
    }

    if (customerId) {
      // Get portal access by customer ID
      const portalAccess = await prisma.customerPortalAccess.findUnique({
        where: { customerId },
        include: {
          customer: true,
          portalActivities: includeActivities ? {
            orderBy: { createdAt: 'desc' },
            take: 50
          } : false
        }
      });

      return NextResponse.json({
        success: true,
        portalAccess
      });
    }

    // Get all portal access records (admin view)
    const portalAccesses = await prisma.customerPortalAccess.findMany({
      include: {
        customer: true
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    // Get demo conversion statistics
    const stats = await getPortalDemoStats();

    return NextResponse.json({
      success: true,
      portalAccesses,
      stats
    });

  } catch (error) {
    console.error('Get Portal Demo Data Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve portal demo data' },
      { status: 500 }
    );
  }
}

// Create demo access for customer
async function createDemoAccess(customerId: string, demoData: any) {
  const { expirationHours = 72, features = [] } = demoData;

  // Check if customer exists
  const customer = await prisma.customer.findUnique({
    where: { id: customerId }
  });

  if (!customer) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404 }
    );
  }

  // Check if portal access already exists
  const existingAccess = await prisma.customerPortalAccess.findUnique({
    where: { customerId }
  });

  if (existingAccess) {
    // Update existing access to demo if it's not already full access
    if (existingAccess.accessType !== 'FULL') {
      const updatedAccess = await prisma.customerPortalAccess.update({
        where: { customerId },
        data: {
          accessType: 'DEMO',
          isDemoAccess: true,
          demoExpiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
          features: features.length > 0 ? features : getDefaultDemoFeatures(),
          demoActivated: false
        }
      });

      return NextResponse.json({
        success: true,
        portalAccess: updatedAccess,
        demoLink: generatePortalDemoUrl(updatedAccess.accessToken),
        message: 'Demo access updated successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Customer already has full portal access'
      });
    }
  }

  // Generate unique access token
  const accessToken = generateAccessToken();

  // Create new demo access
  const portalAccess = await prisma.customerPortalAccess.create({
    data: {
      customerId,
      accessType: 'DEMO',
      features: features.length > 0 ? features : getDefaultDemoFeatures(),
      accessToken,
      isDemoAccess: true,
      demoExpiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
      demoActivated: false
    }
  });

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'PORTAL_DEMO_CREATED',
      description: `Demo portal access created for customer ${customer.firstName} ${customer.lastName || ''}`,
      user: 'System',
      metadata: {
        customerId,
        accessToken: portalAccess.accessToken,
        expirationHours
      }
    }
  });

  return NextResponse.json({
    success: true,
    portalAccess,
    demoLink: generatePortalDemoUrl(accessToken),
    message: 'Demo access created successfully'
  });
}

// Activate demo access (when customer first clicks demo link)
async function activateDemo(accessToken: string) {
  const portalAccess = await prisma.customerPortalAccess.findUnique({
    where: { accessToken },
    include: { customer: true }
  });

  if (!portalAccess) {
    return NextResponse.json(
      { error: 'Invalid access token' },
      { status: 404 }
    );
  }

  if (!portalAccess.isDemoAccess) {
    return NextResponse.json(
      { error: 'This is not a demo access' },
      { status: 400 }
    );
  }

  // Check if demo has expired
  if (portalAccess.demoExpiresAt && new Date() > portalAccess.demoExpiresAt) {
    return NextResponse.json(
      { error: 'Demo access has expired' },
      { status: 403 }
    );
  }

  // Activate demo if not already activated
  let updatedAccess = portalAccess;
  if (!portalAccess.demoActivated) {
    updatedAccess = await prisma.customerPortalAccess.update({
      where: { accessToken },
      data: {
        demoActivated: true,
        demoActivatedAt: new Date(),
        loginCount: { increment: 1 },
        lastLoginAt: new Date()
      },
      include: { customer: true }
    });

    // Track activation activity
    await trackPortalActivity({
      portalAccessId: portalAccess.id,
      activityType: 'demo_activation',
      description: 'Demo portal activated'
    });
  } else {
    // Just update login info
    updatedAccess = await prisma.customerPortalAccess.update({
      where: { accessToken },
      data: {
        loginCount: { increment: 1 },
        lastLoginAt: new Date()
      },
      include: { customer: true }
    });
  }

  return NextResponse.json({
    success: true,
    portalAccess: updatedAccess,
    demoData: getDemoProjectData(portalAccess.customer),
    message: 'Demo activated successfully'
  });
}

// Promote portal to customer via various channels
async function promotePortalToCustomer(customerId: string, promotionData: any) {
  const { method, message, includeDemo = true } = promotionData;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { customerContacts: true }
  });

  if (!customer) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404 }
    );
  }

  // Create or get demo access if requested
  let demoLink = '';
  if (includeDemo) {
    const demoResult = await createDemoAccess(customerId, { expirationHours: 168 }); // 7 days
    if (demoResult instanceof Response) {
      const demoData = await demoResult.json();
      demoLink = demoData.demoLink;
    }
  }

  let promotionResult;
  switch (method) {
    case 'EMAIL':
      promotionResult = await sendPortalPromotionEmail(customer, message, demoLink);
      break;
    case 'WHATSAPP':
      promotionResult = await sendPortalPromotionWhatsApp(customer, message, demoLink);
      break;
    case 'SMS':
      promotionResult = await sendPortalPromotionSMS(customer, message, demoLink);
      break;
    default:
      return NextResponse.json(
        { error: 'Invalid promotion method' },
        { status: 400 }
      );
  }

  // Track promotion activity
  await prisma.customerCommunication.create({
    data: {
      subject: 'Customer Portal Promotion',
      message: message || getDefaultPromotionMessage(method, demoLink),
      communicationType: 'PORTAL_PROMOTION',
      platform: method,
      direction: 'OUTBOUND',
      status: promotionResult.success ? 'SENT' : 'FAILED',
      customerId,
      sentAt: new Date()
    }
  });

  return NextResponse.json({
    success: promotionResult.success,
    demoLink,
    message: promotionResult.success 
      ? `Portal promotion sent via ${method}`
      : `Failed to send promotion: ${'error' in promotionResult ? promotionResult.error : 'Unknown error'}`
  });
}

// Convert demo access to full portal access
async function convertDemoToFull(customerId: string, conversionData: any) {
  const { conversionSource = 'demo', requestedBy } = conversionData;

  const portalAccess = await prisma.customerPortalAccess.findUnique({
    where: { customerId },
    include: { customer: true }
  });

  if (!portalAccess) {
    return NextResponse.json(
      { error: 'No portal access found for customer' },
      { status: 404 }
    );
  }

  if (portalAccess.accessType === 'FULL') {
    return NextResponse.json({
      success: false,
      message: 'Customer already has full portal access'
    });
  }

  // Update to full access
  const updatedAccess = await prisma.customerPortalAccess.update({
    where: { customerId },
    data: {
      accessType: 'FULL',
      features: getFullPortalFeatures(),
      isDemoAccess: false,
      demoExpiresAt: null,
      convertedToFull: true,
      convertedAt: new Date(),
      conversionSource
    }
  });

  // Enable portal access for customer
  await prisma.customer.update({
    where: { id: customerId },
    data: { portalAccess: true }
  });

  // Track conversion activity
  await trackPortalActivity({
    portalAccessId: portalAccess.id,
    activityType: 'conversion_to_full',
    description: `Demo converted to full access via ${conversionSource}`
  });

  // Send welcome email for full access
  await sendFullAccessWelcomeEmail(portalAccess.customer);

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'PORTAL_CONVERSION',
      description: `Customer ${portalAccess.customer.firstName} converted to full portal access`,
      user: requestedBy || 'System',
      metadata: {
        customerId,
        conversionSource,
        previousAccessType: portalAccess.accessType
      }
    }
  });

  return NextResponse.json({
    success: true,
    portalAccess: updatedAccess,
    message: 'Successfully converted to full portal access'
  });
}

// Track portal activity
async function trackPortalActivity(activityData: any) {
  const {
    portalAccessId,
    activityType,
    description,
    feature,
    sessionId,
    ipAddress,
    userAgent,
    additionalData
  } = activityData;

  // Get portal access if not provided
  let portalAccess;
  if (portalAccessId) {
    portalAccess = await prisma.customerPortalAccess.findUnique({
      where: { id: portalAccessId }
    });
  }

  if (!portalAccess) {
    return NextResponse.json(
      { error: 'Portal access not found' },
      { status: 404 }
    );
  }

  // Create activity record
  const activity = await prisma.customerPortalActivity.create({
    data: {
      portalAccessId: portalAccess.id,
      activityType,
      feature,
      description,
      sessionId,
      ipAddress,
      userAgent,
      activityData: additionalData
    }
  });

  // Update portal access statistics
  const updateData: any = {};
  if (activityType === 'login') {
    updateData.loginCount = { increment: 1 };
    updateData.lastLoginAt = new Date();
  }

  // Track feature usage
  if (feature && portalAccess.featuresUsed) {
    const featuresUsed = Array.isArray(portalAccess.featuresUsed) ? portalAccess.featuresUsed : [];
    if (!featuresUsed.includes(feature)) {
      updateData.featuresUsed = [...featuresUsed, feature];
    }
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.customerPortalAccess.update({
      where: { id: portalAccess.id },
      data: updateData
    });
  }

  return NextResponse.json({
    success: true,
    activity
  });
}

// Generate demo link for customer
async function generateDemoLink(customerId: string, demoData: any) {
  const { source = 'manual', expirationHours = 72 } = demoData;

  // Create demo access
  const createResult = await createDemoAccess(customerId, { expirationHours });
  
  if (createResult instanceof Response) {
    return createResult;
  }

  const demoLink = generatePortalDemoUrl((createResult as any).portalAccess.accessToken);

  return NextResponse.json({
    success: true,
    demoLink,
    expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
    message: 'Demo link generated successfully'
  });
}

// Helper functions
function generateAccessToken(): string {
  return randomBytes(32).toString('hex');
}

function generatePortalDemoUrl(accessToken: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/portal?demo=${accessToken}`;
}

function getDefaultDemoFeatures(): string[] {
  return [
    'DEMO_ACCESS',
    'PROJECT_TRACKING',
    'DOCUMENT_SHARING'
  ];
}

function getFullPortalFeatures(): CustomerPortalFeature[] {
  return [
    CustomerPortalFeature.NEW_ENQUIRY,
    CustomerPortalFeature.PROJECT_TRACKING,
    CustomerPortalFeature.DOCUMENT_SHARING,
    CustomerPortalFeature.APPROVAL_WORKFLOW,
    CustomerPortalFeature.PAYMENT_PORTAL
  ];
}

function getDemoProjectData(customer: any) {
  // Generate sample project data for demo
  return {
    projects: [
      {
        id: 'demo-1',
        projectName: 'Sample Office Windows',
        status: 'IN_PRODUCTION',
        value: 15000,
        progress: 65,
        nextMilestone: 'Installation Scheduled'
      },
      {
        id: 'demo-2',
        projectName: 'Warehouse Doors',
        status: 'DRAWING_APPROVAL',
        value: 8500,
        progress: 30,
        nextMilestone: 'Customer Approval Required'
      }
    ],
    documents: [
      {
        id: 'demo-doc-1',
        name: 'Technical Drawings v2.1',
        type: 'DRAWING',
        status: 'APPROVED',
        date: new Date().toISOString()
      }
    ],
    communications: [
      {
        id: 'demo-comm-1',
        subject: 'Welcome to the Demo!',
        message: 'This is a sample of how you can track your projects with us.',
        date: new Date().toISOString()
      }
    ]
  };
}

async function getPortalDemoStats() {
  const totalDemo = await prisma.customerPortalAccess.count({
    where: { isDemoAccess: true }
  });

  const activatedDemo = await prisma.customerPortalAccess.count({
    where: { 
      isDemoAccess: true,
      demoActivated: true 
    }
  });

  const convertedToFull = await prisma.customerPortalAccess.count({
    where: { convertedToFull: true }
  });

  const conversionRate = activatedDemo > 0 ? (convertedToFull / activatedDemo) * 100 : 0;

  return {
    totalDemo,
    activatedDemo,
    convertedToFull,
    conversionRate: Math.round(conversionRate * 100) / 100,
    activationRate: totalDemo > 0 ? Math.round((activatedDemo / totalDemo) * 100) : 0
  };
}

function getDefaultPromotionMessage(method: string, demoLink: string): string {
  const baseMessage = `🚀 Experience our new Customer Portal!\n\nTrack your projects, view documents, and communicate with our team - all in one place.\n\n`;
  
  if (demoLink) {
    return baseMessage + `Try our demo: ${demoLink}\n\nQuestions? Just reply to this message!`;
  }
  
  return baseMessage + `Contact us to get started!\n\nBest regards,\nSFG Aluminium Team`;
}

async function sendPortalPromotionEmail(customer: any, message: string, demoLink: string) {
  // Mock email sending - integrate with actual email service
  return { 
    success: true, 
    messageId: `email_${Date.now()}`,
    message: 'Portal promotion email sent successfully'
  };
}

async function sendPortalPromotionWhatsApp(customer: any, message: string, demoLink: string) {
  // Use WhatsApp integration
  try {
    const whatsappContact = customer.customerContacts?.find(
      (c: any) => c.whatsappEnabled && c.role === 'PRIMARY_CONTACT'
    );

    if (!whatsappContact) {
      return { success: false, error: 'No WhatsApp-enabled contact found' };
    }

    const response = await fetch('/api/whatsapp-integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_portal_promotion',
        messageData: {
          customerContactId: whatsappContact.id,
          portalDemoLink: demoLink
        }
      })
    });

    const result = await response.json();
    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: 'WhatsApp integration error' };
  }
}

async function sendPortalPromotionSMS(customer: any, message: string, demoLink: string) {
  // Mock SMS sending - integrate with actual SMS service
  return { 
    success: true, 
    messageId: `sms_${Date.now()}`,
    message: 'Portal promotion SMS sent successfully'
  };
}

async function sendFullAccessWelcomeEmail(customer: any) {
  // Send welcome email for full portal access
  const welcomeMessage = `Welcome to your SFG Aluminium Customer Portal!

Your full portal access is now active. You can now:

✅ Submit new enquiries
✅ Track all your projects
✅ Access project documents
✅ Approve drawings digitally
✅ View invoices and payments

Login at: ${process.env.NEXT_PUBLIC_BASE_URL}/portal

Thank you for choosing SFG Aluminium!`;

  // Create communication record
  await prisma.customerCommunication.create({
    data: {
      subject: 'Welcome to Your Customer Portal',
      message: welcomeMessage,
      communicationType: 'CUSTOMER_UPDATE',
      platform: 'EMAIL',
      direction: 'OUTBOUND',
      status: 'SENT',
      customerId: customer.id,
      sentAt: new Date()
    }
  });

  return { success: true };
}
