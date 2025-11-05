
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// API key for authentication
const NEXUS_API_KEY = process.env.NEXUS_API_KEY || 'sfg-nexus-api-key-2025';

/**
 * Handle incoming messages from NEXUS or other apps
 * 
 * Message Types:
 * - query.enquiry_status
 * - query.customer_enquiries
 * - action.update_enquiry_status
 * - action.send_quote_email
 * - action.create_follow_up_task
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey || apiKey !== NEXUS_API_KEY) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    const message = await request.json();
    const { type, params, request_id } = message;

    console.log(`📨 Message received: ${type} (Request ID: ${request_id})`);

    // Handle different message types
    let result;
    
    switch (type) {
      case 'query.enquiry_status':
        result = await getEnquiryStatus(params);
        break;
      
      case 'query.customer_enquiries':
        result = await getCustomerEnquiries(params);
        break;
      
      case 'action.update_enquiry_status':
        result = await updateEnquiryStatus(params);
        break;
      
      case 'action.send_quote_email':
        result = await sendQuoteEmail(params);
        break;
      
      case 'action.create_follow_up_task':
        result = await createFollowUpTask(params);
        break;
      
      default:
        return NextResponse.json({
          request_id,
          status: 'error',
          error: `Unknown message type: ${type}`,
          timestamp: new Date().toISOString()
        });
    }

    return NextResponse.json({
      request_id,
      status: 'success',
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Message handling error:', error);
    
    return NextResponse.json({
      request_id: (await request.json()).request_id || 'unknown',
      status: 'error',
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Get enquiry status
 */
async function getEnquiryStatus(params: any) {
  const { enquiry_id } = params;
  
  console.log(`Fetching enquiry status: ${enquiry_id}`);
  
  // Query database
  // const enquiry = await db.enquiry.findUnique({ where: { id: enquiry_id } });
  
  // Mock response
  return {
    enquiry_id,
    status: 'quoted',
    customer_name: 'Sample Customer',
    enquiry_type: 'quote',
    created_at: '2025-11-05T10:00:00Z',
    last_updated: '2025-11-05T14:30:00Z',
    assigned_to: 'Sales Team',
    next_action: 'Follow up call scheduled'
  };
}

/**
 * Get all enquiries for a customer
 */
async function getCustomerEnquiries(params: any) {
  const { customer_id, status, limit = 10 } = params;
  
  console.log(`Fetching enquiries for customer: ${customer_id}`);
  
  // Query database
  // const enquiries = await db.enquiry.findMany({
  //   where: { customer_id, status },
  //   take: limit,
  //   orderBy: { created_at: 'desc' }
  // });
  
  // Mock response
  return {
    customer_id,
    enquiries: [
      {
        id: 'enq_001',
        type: 'quote',
        status: 'quoted',
        created_at: '2025-11-01T10:00:00Z'
      },
      {
        id: 'enq_002',
        type: 'service',
        status: 'completed',
        created_at: '2025-10-15T14:30:00Z'
      }
    ],
    total_count: 2
  };
}

/**
 * Update enquiry status
 */
async function updateEnquiryStatus(params: any) {
  const { enquiry_id, new_status, notes } = params;
  
  console.log(`Updating enquiry ${enquiry_id} to status: ${new_status}`);
  
  // Update database
  // await db.enquiry.update({
  //   where: { id: enquiry_id },
  //   data: { status: new_status, notes }
  // });
  
  // Send notifications if needed
  // if (new_status === 'converted') {
  //   await sendConversionNotification(enquiry_id);
  // }
  
  return {
    enquiry_id,
    old_status: 'quoted',
    new_status,
    updated_at: new Date().toISOString(),
    notifications_sent: ['sales_team', 'customer']
  };
}

/**
 * Send quote email to customer
 */
async function sendQuoteEmail(params: any) {
  const { enquiry_id, quote_pdf_url, customer_email } = params;
  
  console.log(`Sending quote email for enquiry: ${enquiry_id}`);
  
  // Send email with quote attachment
  // await sendEmail({
  //   to: customer_email,
  //   subject: 'Your Quote from SFG Aluminium',
  //   attachments: [{ url: quote_pdf_url }]
  // });
  
  return {
    enquiry_id,
    email_sent: true,
    recipient: customer_email,
    sent_at: new Date().toISOString(),
    quote_url: quote_pdf_url
  };
}

/**
 * Create follow-up task
 */
async function createFollowUpTask(params: any) {
  const { enquiry_id, task_type, due_date, assigned_to } = params;
  
  console.log(`Creating follow-up task for enquiry: ${enquiry_id}`);
  
  // Create task in task management system
  // const task = await createTask({
  //   type: task_type,
  //   enquiry_id,
  //   due_date,
  //   assigned_to
  // });
  
  return {
    task_id: `task_${Date.now()}`,
    enquiry_id,
    task_type,
    due_date,
    assigned_to,
    created_at: new Date().toISOString(),
    status: 'pending'
  };
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'message-handler',
    timestamp: new Date().toISOString(),
    supported_message_types: [
      'query.enquiry_status',
      'query.customer_enquiries',
      'action.update_enquiry_status',
      'action.send_quote_email',
      'action.create_follow_up_task'
    ]
  });
}
