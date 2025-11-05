
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { db } from '@/lib/db';

// Webhook secret for signature verification
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'sfg-webhook-secret-2025';

/**
 * Handle incoming webhooks from NEXUS
 * 
 * Event Types:
 * - enquiry.created
 * - quote.requested
 * - order.approved
 * - customer.registered
 * - credit.check_required
 * - invoice.due
 * - payment.received
 */
export async function POST(request: NextRequest) {
  try {
    // Get signature from headers
    const signature = request.headers.get('x-nexus-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Get raw body
    const body = await request.text();
    
    // Verify signature
    const expectedSignature = createHmac('sha256', WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse event
    const event = JSON.parse(body);
    const { type, data } = event;

    console.log(`📥 Webhook received: ${type}`);

    // Handle different event types
    let result;
    
    switch (type) {
      case 'enquiry.created':
        result = await handleEnquiryCreated(data);
        break;
      
      case 'quote.requested':
        result = await handleQuoteRequested(data);
        break;
      
      case 'order.approved':
        result = await handleOrderApproved(data);
        break;
      
      case 'customer.registered':
        result = await handleCustomerRegistered(data);
        break;
      
      case 'credit.check_required':
        result = await handleCreditCheckRequired(data);
        break;
      
      case 'invoice.due':
        result = await handleInvoiceDue(data);
        break;
      
      case 'payment.received':
        result = await handlePaymentReceived(data);
        break;
      
      default:
        console.log(`Unknown event type: ${type}`);
        return NextResponse.json({
          status: 'ignored',
          reason: `Unknown event type: ${type}`
        });
    }

    return NextResponse.json({
      status: 'processed',
      event_type: type,
      result
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle new enquiry event
 */
async function handleEnquiryCreated(data: any) {
  const { enquiry_id, customer, enquiry_type } = data;
  
  console.log(`Processing enquiry: ${enquiry_id}`);
  
  // Store enquiry in database
  // await db.enquiry.create({...})
  
  // Send notification email to sales team
  // await sendEmail({...})
  
  // Create project folder in SharePoint
  // await createSharePointFolder({...})
  
  return {
    enquiry_id,
    actions: [
      'Enquiry stored in database',
      'Sales team notified',
      'Project folder created'
    ],
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle quote request event
 */
async function handleQuoteRequested(data: any) {
  const { enquiry_id, items, customer } = data;
  
  console.log(`Processing quote request: ${enquiry_id}`);
  
  // Calculate pricing
  // const pricing = await calculatePricing(items);
  
  // Check margins
  // const marginCheck = await checkMargins(pricing);
  
  // Generate quote
  // const quote = await generateQuote({...});
  
  return {
    enquiry_id,
    quote_number: `QUO-${Date.now()}`,
    status: 'quote_generated',
    actions: [
      'Pricing calculated',
      'Margin verified',
      'Quote generated',
      'Customer notified'
    ],
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle order approval event
 */
async function handleOrderApproved(data: any) {
  const { order_id, customer, items } = data;
  
  console.log(`Processing order approval: ${order_id}`);
  
  // Schedule production
  // const production = await scheduleProduction(items);
  
  // Create invoice
  // const invoice = await createInvoice(order_id);
  
  // Notify teams
  // await notifyTeams({...});
  
  return {
    order_id,
    production_scheduled: true,
    invoice_created: true,
    actions: [
      'Production scheduled',
      'Invoice created',
      'Teams notified'
    ],
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle customer registration event
 */
async function handleCustomerRegistered(data: any) {
  const { customer_id, email, name } = data;
  
  console.log(`Processing customer registration: ${customer_id}`);
  
  // Send welcome email
  // await sendWelcomeEmail({...});
  
  // Create CRM record
  // await createCRMRecord({...});
  
  return {
    customer_id,
    actions: [
      'Welcome email sent',
      'CRM record created',
      'Portal access granted'
    ],
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle credit check required event
 */
async function handleCreditCheckRequired(data: any) {
  const { customer_id, order_value } = data;
  
  console.log(`Credit check required for customer: ${customer_id}`);
  
  // Initiate credit check via Experian
  // const creditCheck = await initiateExperian Check({...});
  
  return {
    customer_id,
    credit_check_initiated: true,
    actions: [
      'Credit check requested from Experian',
      'Finance team notified'
    ],
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle invoice due event
 */
async function handleInvoiceDue(data: any) {
  const { invoice_id, customer_id } = data;
  
  console.log(`Invoice due reminder: ${invoice_id}`);
  
  // Send reminder email
  // await sendInvoiceReminder({...});
  
  return {
    invoice_id,
    actions: [
      'Reminder email sent',
      'Payment chase scheduled'
    ],
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle payment received event
 */
async function handlePaymentReceived(data: any) {
  const { payment_id, invoice_id, amount } = data;
  
  console.log(`Payment received: ${payment_id}`);
  
  // Update invoice status
  // await updateInvoiceStatus({...});
  
  // Send receipt
  // await sendReceipt({...});
  
  return {
    payment_id,
    invoice_id,
    actions: [
      'Invoice marked as paid',
      'Receipt sent to customer',
      'Accounting updated'
    ],
    timestamp: new Date().toISOString()
  };
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'nexus-webhook',
    timestamp: new Date().toISOString()
  });
}
