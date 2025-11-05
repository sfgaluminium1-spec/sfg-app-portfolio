
/**
 * SFG Aluminium - Message Reply Handler (Node.js/Express)
 * Version: 1.0.0
 * Date: November 5, 2025
 * 
 * This message handler responds to requests from NEXUS and other SFG apps.
 */

const express = require('express');

const app = express();
app.use(express.json());

/**
 * Main message handler endpoint
 */
app.post('/messages/handle', async (req, res) => {
  try {
    const { type, params = {}, request_id } = req.body;
    
    console.log(`[${new Date().toISOString()}] Received message: ${type}`);
    
    // Route to appropriate handler
    const handlers = {
      'query.customer_data': getCustomerData,
      'query.quote_status': getQuoteStatus,
      'query.order_status': getOrderStatus,
      'action.create_quote': createQuote,
      'action.approve_order': approveOrder,
      'action.send_invoice': sendInvoice
    };
    
    const handler = handlers[type];
    let result;
    let status;
    
    if (handler) {
      result = await handler(params);
      status = result.error ? 'error' : 'success';
    } else {
      result = { error: `Unknown message type: ${type}` };
      status = 'error';
    }
    
    res.json({
      request_id,
      status,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Message handler error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get customer data
 */
async function getCustomerData(params) {
  const { customer_id } = params;
  
  if (!customer_id) {
    return { error: 'customer_id is required' };
  }
  
  console.log(`Fetching customer data for ${customer_id}`);
  
  // Your business logic here - query database
  
  // Example data
  return {
    customer_id,
    name: 'Acme Construction Ltd',
    email: 'orders@acme.co.uk',
    phone: '+44 20 1234 5678',
    tier: 'sapphire',
    tier_color: 'blue',
    credit_limit: 50000,
    outstanding_balance: 12500,
    available_credit: 37500,
    payment_terms: '30 days',
    last_order_date: '2025-10-15',
    total_orders: 47,
    total_revenue: 342500
  };
}

/**
 * Get quote status
 */
async function getQuoteStatus(params) {
  const { quote_id } = params;
  
  if (!quote_id) {
    return { error: 'quote_id is required' };
  }
  
  console.log(`Fetching quote status for ${quote_id}`);
  
  // Your business logic here
  
  // Example data
  return {
    quote_id,
    quote_number: 'QUO-251015-7843',
    status: 'sent',
    customer_name: 'Acme Construction Ltd',
    total_amount: 15750.00,
    margin: 0.22,
    created_at: '2025-10-15T09:30:00Z',
    sent_at: '2025-10-15T14:20:00Z',
    expires_at: '2025-11-14T14:20:00Z',
    valid: true,
    items_count: 12,
    pdf_url: 'https://sharepoint.com/quotes/QUO-251015-7843.pdf'
  };
}

/**
 * Get order status
 */
async function getOrderStatus(params) {
  const { order_id } = params;
  
  if (!order_id) {
    return { error: 'order_id is required' };
  }
  
  console.log(`Fetching order status for ${order_id}`);
  
  // Your business logic here
  
  // Example data
  return {
    order_id,
    order_number: 'ORD-251020-3421',
    status: 'fabrication',
    customer_name: 'Acme Construction Ltd',
    total_amount: 15750.00,
    created_at: '2025-10-20T11:00:00Z',
    production_start: '2025-10-25T08:00:00Z',
    estimated_completion: '2025-11-10T17:00:00Z',
    installation_date: '2025-11-15T09:00:00Z',
    progress: 0.65,
    items_completed: 8,
    items_total: 12
  };
}

/**
 * Create new quote
 */
async function createQuote(params) {
  const { enquiry_id, items = [], customer_id } = params;
  
  if (!enquiry_id || items.length === 0) {
    return { error: 'enquiry_id and items are required' };
  }
  
  console.log(`Creating quote for enquiry ${enquiry_id}`);
  
  // Calculate pricing
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalCost = items.reduce((sum, item) => sum + (item.cost || 0), 0);
  const margin = totalPrice > 0 ? (totalPrice - totalCost) / totalPrice : 0;
  
  // Check minimum margin
  if (margin < 0.15) {
    return {
      error: 'Margin below minimum (15%)',
      margin,
      required_margin: 0.15
    };
  }
  
  // Generate quote
  const date = new Date();
  const quoteNumber = `QUO-${date.getFullYear().toString().slice(-2)}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${enquiry_id.slice(-4)}`;
  
  return {
    quote_id: `q_${Date.now()}`,
    quote_number: quoteNumber,
    enquiry_id,
    customer_id,
    total_amount: totalPrice,
    margin,
    status: 'draft',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
    pdf_url: `https://sharepoint.com/quotes/${quoteNumber}.pdf`
  };
}

/**
 * Approve order
 */
async function approveOrder(params) {
  const { order_id, approved_by } = params;
  
  if (!order_id || !approved_by) {
    return { error: 'order_id and approved_by are required' };
  }
  
  console.log(`Approving order ${order_id} by ${approved_by}`);
  
  // Your business logic here
  
  const date = new Date();
  const invoiceNumber = `INV-${date.getFullYear().toString().slice(-2)}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${order_id.slice(-4)}`;
  
  return {
    order_id,
    status: 'approved',
    approved_by,
    approved_at: new Date().toISOString(),
    production_scheduled: '2025-11-10',
    invoice_created: invoiceNumber
  };
}

/**
 * Send invoice
 */
async function sendInvoice(params) {
  const { order_id, customer_email } = params;
  
  if (!order_id) {
    return { error: 'order_id is required' };
  }
  
  console.log(`Sending invoice for order ${order_id}`);
  
  // Your business logic here
  
  const date = new Date();
  const invoiceNumber = `INV-${date.getFullYear().toString().slice(-2)}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${order_id.slice(-4)}`;
  
  return {
    invoice_id: `inv_${Date.now()}`,
    invoice_number: invoiceNumber,
    order_id,
    sent_to: customer_email,
    sent_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
    status: 'sent',
    pdf_url: `https://xero.com/invoices/${invoiceNumber}.pdf`
  };
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SFG Aluminium Message Handler',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Message handler running on port ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/messages/handle`);
});

module.exports = app;
