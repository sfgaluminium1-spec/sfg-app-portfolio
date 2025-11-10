
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Get customer data
 */
async function getCustomerData(params: any) {
  const { customer_id } = params;
  
  // In production, query your database
  // For now, return mock data
  return {
    customer_id,
    name: "Acme Construction Ltd",
    email: "contact@acmeconstruction.co.uk",
    tier: "Sapphire",
    tier_color: "Blue",
    credit_limit: 50000,
    outstanding_balance: 12500,
    payment_terms: "30 days",
    company_number: "12345678",
    vat_number: "GB123456789",
  };
}

/**
 * Get quote status
 */
async function getQuoteStatus(params: any) {
  const { quote_id } = params;
  
  // In production, query your database
  // For now, return mock data
  return {
    quote_id,
    quote_number: "QUO-25001",
    status: "sent",
    total_amount: 15750.00,
    margin: 0.22,
    created_at: "2025-11-01T10:30:00Z",
    expires_at: "2025-11-30T23:59:59Z",
    customer_name: "Acme Construction Ltd",
    items_count: 5,
  };
}

/**
 * Get order status
 */
async function getOrderStatus(params: any) {
  const { order_id } = params;
  
  // In production, query your database
  return {
    order_id,
    order_number: "ORD-25001",
    status: "in_production",
    total_amount: 15750.00,
    created_at: "2025-11-05T09:00:00Z",
    production_scheduled: "2025-11-10T08:00:00Z",
    installation_scheduled: "2025-11-15T09:00:00Z",
    progress: 45,
    customer_name: "Acme Construction Ltd",
  };
}

/**
 * Create quote
 */
async function createQuote(params: any) {
  const { enquiry_id, items, customer_id } = params;
  
  // Calculate pricing with SFG margins
  const totalCost = items?.reduce((sum: number, item: any) => sum + (item.cost || 0), 0) || 0;
  const margin = 0.22; // 22% margin
  const totalAmount = totalCost * (1 + margin);
  
  const quoteNumber = `QUO-${Date.now().toString().slice(-5)}`;
  
  // In production, create quote in database
  return {
    quote_id: `quote_${Date.now()}`,
    quote_number: quoteNumber,
    total_amount: totalAmount,
    margin: margin,
    pdf_url: `https://sfg-unified-brain.abacusai.app/api/quotes/${quoteNumber}/pdf`,
    status: "draft",
    created_at: new Date().toISOString(),
  };
}

/**
 * Approve order
 */
async function approveOrder(params: any) {
  const { order_id, approved_by, notes } = params;
  
  // In production, update order status in database
  return {
    order_id,
    status: "approved",
    approved_by,
    approved_at: new Date().toISOString(),
    notes,
    next_steps: [
      "Schedule production",
      "Create invoice",
      "Notify customer",
    ],
  };
}

/**
 * Send invoice
 */
async function sendInvoice(params: any) {
  const { order_id, customer_email } = params;
  
  const invoiceNumber = `INV-${Date.now().toString().slice(-5)}`;
  
  // In production, generate invoice and send via email
  return {
    invoice_id: `invoice_${Date.now()}`,
    invoice_number: invoiceNumber,
    status: "sent",
    sent_to: customer_email,
    sent_at: new Date().toISOString(),
    pdf_url: `https://sfg-unified-brain.abacusai.app/api/invoices/${invoiceNumber}/pdf`,
  };
}

/**
 * Check credit
 */
async function checkCredit(params: any) {
  const { customer_id, order_value } = params;
  
  // In production, perform real credit check via Experian
  const creditScore = Math.floor(Math.random() * 100) + 600; // 600-700
  const creditLimit = creditScore > 650 ? order_value * 1.5 : order_value;
  
  return {
    customer_id,
    credit_score: creditScore,
    credit_limit: creditLimit,
    approved: creditScore > 600,
    risk_level: creditScore > 650 ? "low" : "medium",
    valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
  };
}

/**
 * Get production schedule
 */
async function getProductionSchedule(params: any) {
  const { order_id } = params;
  
  return {
    order_id,
    production_start: "2025-11-10T08:00:00Z",
    production_end: "2025-11-14T17:00:00Z",
    installation_start: "2025-11-15T09:00:00Z",
    installation_end: "2025-11-15T16:00:00Z",
    milestones: [
      { stage: "Fabrication", status: "in_progress", progress: 45 },
      { stage: "Quality Check", status: "pending", progress: 0 },
      { stage: "Delivery", status: "pending", progress: 0 },
      { stage: "Installation", status: "pending", progress: 0 },
    ],
  };
}

/**
 * POST /api/messages/handle
 * Handle incoming messages from NEXUS or other apps
 */
export async function POST(request: NextRequest) {
  try {
    const message = await request.json();
    const { type, params, request_id } = message;
    
    console.log(`💬 Received message: ${type} (request_id: ${request_id})`);
    
    let result;
    
    // Handle different message types
    switch (type) {
      case "query.customer_data":
        result = await getCustomerData(params);
        break;
      
      case "query.quote_status":
        result = await getQuoteStatus(params);
        break;
      
      case "query.order_status":
        result = await getOrderStatus(params);
        break;
      
      case "action.create_quote":
        result = await createQuote(params);
        break;
      
      case "action.approve_order":
        result = await approveOrder(params);
        break;
      
      case "action.send_invoice":
        result = await sendInvoice(params);
        break;
      
      case "action.check_credit":
        result = await checkCredit(params);
        break;
      
      case "query.production_schedule":
        result = await getProductionSchedule(params);
        break;
      
      case "ping":
        result = {
          message: "pong",
          app_name: "SFG Aluminium Unified Dashboard",
          status: "online",
        };
        break;
      
      default:
        result = { error: `Unknown message type: ${type}` };
    }
    
    // Log the message (if database available)
    try {
      if ('messageLog' in prisma) {
        await (prisma as any).messageLog.create({
          data: {
            request_id,
            message_type: type,
            message_params: params,
            response_data: result,
            processed_at: new Date(),
          },
        });
      }
    } catch (error) {
      console.log("Note: messageLog table not available");
    }
    
    return NextResponse.json({
      request_id,
      status: (result as any).error ? "error" : "success",
      result,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error("❌ Message handler error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: "Internal server error",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/messages/handle
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "online",
    app_name: "SFG Aluminium Unified Dashboard",
    capabilities: [
      "query.customer_data",
      "query.quote_status",
      "query.order_status",
      "action.create_quote",
      "action.approve_order",
      "action.send_invoice",
      "action.check_credit",
      "query.production_schedule",
    ],
    timestamp: new Date().toISOString(),
  });
}
