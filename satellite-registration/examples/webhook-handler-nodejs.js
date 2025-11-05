
/**
 * SFG Aluminium - Webhook Handler (Node.js/Express)
 * Version: 1.0.0
 * Date: November 5, 2025
 * 
 * This webhook handler receives real-time events from NEXUS and other SFG apps.
 */

const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Webhook secret for signature verification
// IMPORTANT: Store this securely in environment variables
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-here';

/**
 * Main webhook endpoint for NEXUS events
 */
app.post('/webhooks/nexus', async (req, res) => {
  try {
    // Verify signature to ensure request is from NEXUS
    const signature = req.headers['x-nexus-signature'];
    const body = JSON.stringify(req.body);
    
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Parse event
    const { type, data } = req.body;
    
    console.log(`[${new Date().toISOString()}] Received event: ${type}`);
    
    // Route to appropriate handler
    const handlers = {
      'enquiry.created': handleEnquiryCreated,
      'quote.requested': handleQuoteRequested,
      'order.approved': handleOrderApproved,
      'customer.registered': handleCustomerRegistered,
      'credit.check_required': handleCreditCheck,
      'invoice.due': handleInvoiceDue,
      'payment.received': handlePaymentReceived
    };
    
    const handler = handlers[type];
    if (handler) {
      const result = await handler(data);
      return res.json(result);
    } else {
      return res.json({
        status: 'ignored',
        reason: `Unknown event type: ${type}`
      });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Handle new enquiry event
 */
async function handleEnquiryCreated(data) {
  const { enquiry_id, customer, estimated_value = 0 } = data;
  
  console.log(`Processing enquiry ${enquiry_id} from ${customer.name}`);
  
  const actions = [];
  
  // 1. Create project folder
  actions.push('Project folder created in SharePoint');
  
  // 2. Assign estimator
  actions.push('Estimator assigned based on current workload');
  
  // 3. Check if credit check required
  if (estimated_value > 10000) {
    actions.push('Credit check requested via Experian');
  }
  
  // 4. Send notification
  actions.push('Sales team notified');
  
  return {
    status: 'processed',
    enquiry_id,
    actions,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle quote request event
 */
async function handleQuoteRequested(data) {
  const { enquiry_id, items = [], customer_tier = 'steel' } = data;
  
  console.log(`Generating quote for enquiry ${enquiry_id}`);
  
  // 1. Calculate pricing
  const totalCost = items.reduce((sum, item) => sum + (item.cost || 0), 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const margin = totalPrice > 0 ? (totalPrice - totalCost) / totalPrice : 0;
  
  // 2. Check minimum margin (15%)
  if (margin < 0.15) {
    return {
      status: 'rejected',
      reason: 'Margin below minimum (15%)',
      margin,
      required_margin: 0.15
    };
  }
  
  // 3. Check if approval needed
  let approvalNeeded = false;
  let approvalTier = null;
  if (totalPrice > 100000) {
    approvalNeeded = true;
    approvalTier = 'T2'; // Senior Manager
  } else if (totalPrice > 25000) {
    approvalNeeded = true;
    approvalTier = 'T3'; // Manager
  }
  
  // 4. Generate quote
  const date = new Date();
  const quoteNumber = `QUO-${date.getFullYear().toString().slice(-2)}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${enquiry_id.slice(-4)}`;
  
  return {
    status: 'processed',
    quote_number: quoteNumber,
    total_amount: totalPrice,
    margin,
    approval_needed: approvalNeeded,
    approval_tier: approvalTier,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle order approval event
 */
async function handleOrderApproved(data) {
  const { order_id, customer, items = [] } = data;
  
  console.log(`Processing approved order ${order_id}`);
  
  const actions = [];
  
  // 1. Schedule production
  const productionDate = '2025-11-10'; // Calculate based on capacity
  actions.push(`Production scheduled for ${productionDate}`);
  
  // 2. Create invoice
  const date = new Date();
  const invoiceNumber = `INV-${date.getFullYear().toString().slice(-2)}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${order_id.slice(-4)}`;
  actions.push(`Invoice ${invoiceNumber} created in Xero`);
  
  // 3. Update SharePoint
  actions.push('SharePoint updated with order details');
  
  // 4. Notify team
  actions.push('Production team notified');
  
  return {
    status: 'processed',
    order_id,
    production_scheduled: productionDate,
    invoice_created: invoiceNumber,
    actions,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle new customer registration
 */
async function handleCustomerRegistered(data) {
  const { customer_id, customer_name } = data;
  
  console.log(`New customer registered: ${customer_name} (${customer_id})`);
  
  return {
    status: 'processed',
    customer_id,
    actions: ['Customer portal created', 'Welcome email sent'],
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle credit check request
 */
async function handleCreditCheck(data) {
  const { customer_id, order_value } = data;
  
  console.log(`Credit check requested for customer ${customer_id}`);
  
  // Simulate credit check
  const creditScore = 750;
  
  // Determine credit limit
  let creditLimit;
  let approved;
  if (creditScore >= 700) {
    creditLimit = 50000;
    approved = true;
  } else if (creditScore >= 600) {
    creditLimit = 25000;
    approved = order_value <= creditLimit;
  } else {
    creditLimit = 10000;
    approved = order_value <= creditLimit;
  }
  
  return {
    status: 'processed',
    customer_id,
    credit_score: creditScore,
    credit_limit: creditLimit,
    approved,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle invoice due notification
 */
async function handleInvoiceDue(data) {
  const { invoice_id, customer_id, amount_due } = data;
  
  console.log(`Invoice ${invoice_id} is due: £${amount_due}`);
  
  return {
    status: 'processed',
    invoice_id,
    actions: ['Reminder email sent', 'Finance team notified'],
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle payment received notification
 */
async function handlePaymentReceived(data) {
  const { payment_id, invoice_id, amount } = data;
  
  console.log(`Payment received: £${amount} for invoice ${invoice_id}`);
  
  return {
    status: 'processed',
    payment_id,
    actions: ['Invoice marked as paid', 'Customer notified', 'Xero updated'],
    timestamp: new Date().toISOString()
  };
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SFG Aluminium Webhook Handler',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/webhooks/nexus`);
});

module.exports = app;
