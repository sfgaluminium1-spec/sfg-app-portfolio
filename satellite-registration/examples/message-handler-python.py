
"""
SFG Aluminium - Message Reply Handler (Python/FastAPI)
Version: 1.0.0
Date: November 5, 2025

This message handler responds to requests from NEXUS and other SFG apps.
"""

from fastapi import FastAPI, Request, HTTPException
from typing import Dict, Any
from datetime import datetime

app = FastAPI(title="SFG Aluminium Message Handler")

@app.post("/messages/handle")
async def handle_message(request: Request):
    """
    Handle incoming messages from NEXUS or other apps
    
    Message Types:
    - query.customer_data: Get customer information
    - query.quote_status: Get quote status
    - query.order_status: Get order status
    - action.create_quote: Create new quote
    - action.approve_order: Approve order
    - action.send_invoice: Send invoice
    """
    message = await request.json()
    message_type = message.get("type")
    params = message.get("params", {})
    request_id = message.get("request_id")
    
    print(f"[{datetime.now().isoformat()}] Received message: {message_type}")
    
    # Route to appropriate handler
    handlers = {
        "query.customer_data": get_customer_data,
        "query.quote_status": get_quote_status,
        "query.order_status": get_order_status,
        "action.create_quote": create_quote,
        "action.approve_order": approve_order,
        "action.send_invoice": send_invoice
    }
    
    handler = handlers.get(message_type)
    if handler:
        result = await handler(params)
        status = "success" if "error" not in result else "error"
    else:
        result = {"error": f"Unknown message type: {message_type}"}
        status = "error"
    
    return {
        "request_id": request_id,
        "status": status,
        "result": result,
        "timestamp": datetime.now().isoformat()
    }


async def get_customer_data(params: Dict[str, Any]):
    """
    Get customer data
    
    Returns customer information including tier, credit limit, and outstanding balance
    """
    customer_id = params.get("customer_id")
    
    if not customer_id:
        return {"error": "customer_id is required"}
    
    print(f"Fetching customer data for {customer_id}")
    
    # Your business logic here - query database
    # customer = await db.customers.find_one({"id": customer_id})
    
    # Example data
    customer_data = {
        "customer_id": customer_id,
        "name": "Acme Construction Ltd",
        "email": "orders@acme.co.uk",
        "phone": "+44 20 1234 5678",
        "tier": "sapphire",
        "tier_color": "blue",
        "credit_limit": 50000,
        "outstanding_balance": 12500,
        "available_credit": 37500,
        "payment_terms": "30 days",
        "last_order_date": "2025-10-15",
        "total_orders": 47,
        "total_revenue": 342500
    }
    
    return customer_data


async def get_quote_status(params: Dict[str, Any]):
    """
    Get quote status
    
    Returns current status of a quote including validity
    """
    quote_id = params.get("quote_id")
    
    if not quote_id:
        return {"error": "quote_id is required"}
    
    print(f"Fetching quote status for {quote_id}")
    
    # Your business logic here
    # quote = await db.quotes.find_one({"id": quote_id})
    
    # Example data
    quote_data = {
        "quote_id": quote_id,
        "quote_number": "QUO-251015-7843",
        "status": "sent",
        "customer_name": "Acme Construction Ltd",
        "total_amount": 15750.00,
        "margin": 0.22,
        "created_at": "2025-10-15T09:30:00Z",
        "sent_at": "2025-10-15T14:20:00Z",
        "expires_at": "2025-11-14T14:20:00Z",
        "valid": True,
        "items_count": 12,
        "pdf_url": "https://sharepoint.com/quotes/QUO-251015-7843.pdf"
    }
    
    return quote_data


async def get_order_status(params: Dict[str, Any]):
    """
    Get order status
    
    Returns current status of an order including production schedule
    """
    order_id = params.get("order_id")
    
    if not order_id:
        return {"error": "order_id is required"}
    
    print(f"Fetching order status for {order_id}")
    
    # Your business logic here
    # order = await db.orders.find_one({"id": order_id})
    
    # Example data
    order_data = {
        "order_id": order_id,
        "order_number": "ORD-251020-3421",
        "status": "fabrication",
        "customer_name": "Acme Construction Ltd",
        "total_amount": 15750.00,
        "created_at": "2025-10-20T11:00:00Z",
        "production_start": "2025-10-25T08:00:00Z",
        "estimated_completion": "2025-11-10T17:00:00Z",
        "installation_date": "2025-11-15T09:00:00Z",
        "progress": 0.65,
        "items_completed": 8,
        "items_total": 12
    }
    
    return order_data


async def create_quote(params: Dict[str, Any]):
    """
    Create new quote
    
    Generates a quote from enquiry details
    """
    enquiry_id = params.get("enquiry_id")
    items = params.get("items", [])
    customer_id = params.get("customer_id")
    
    if not enquiry_id or not items:
        return {"error": "enquiry_id and items are required"}
    
    print(f"Creating quote for enquiry {enquiry_id}")
    
    # Your business logic here
    # Calculate pricing, check margins, generate PDF
    
    total_price = sum(item.get("price", 0) for item in items)
    total_cost = sum(item.get("cost", 0) for item in items)
    margin = (total_price - total_cost) / total_price if total_price > 0 else 0
    
    # Check minimum margin
    if margin < 0.15:
        return {
            "error": "Margin below minimum (15%)",
            "margin": margin,
            "required_margin": 0.15
        }
    
    # Generate quote
    quote_number = f"QUO-{datetime.now().strftime('%y%m%d')}-{enquiry_id[-4:]}"
    
    quote_data = {
        "quote_id": f"q_{datetime.now().timestamp()}",
        "quote_number": quote_number,
        "enquiry_id": enquiry_id,
        "customer_id": customer_id,
        "total_amount": total_price,
        "margin": margin,
        "status": "draft",
        "created_at": datetime.now().isoformat(),
        "expires_at": datetime.now().isoformat(),  # + 30 days
        "pdf_url": f"https://sharepoint.com/quotes/{quote_number}.pdf"
    }
    
    return quote_data


async def approve_order(params: Dict[str, Any]):
    """
    Approve order
    
    Marks order as approved and triggers production scheduling
    """
    order_id = params.get("order_id")
    approved_by = params.get("approved_by")
    
    if not order_id or not approved_by:
        return {"error": "order_id and approved_by are required"}
    
    print(f"Approving order {order_id} by {approved_by}")
    
    # Your business logic here
    # Update order status, schedule production, create invoice
    
    approval_data = {
        "order_id": order_id,
        "status": "approved",
        "approved_by": approved_by,
        "approved_at": datetime.now().isoformat(),
        "production_scheduled": "2025-11-10",
        "invoice_created": f"INV-{datetime.now().strftime('%y%m%d')}-{order_id[-4:]}"
    }
    
    return approval_data


async def send_invoice(params: Dict[str, Any]):
    """
    Send invoice
    
    Generates and sends invoice to customer
    """
    order_id = params.get("order_id")
    customer_email = params.get("customer_email")
    
    if not order_id:
        return {"error": "order_id is required"}
    
    print(f"Sending invoice for order {order_id}")
    
    # Your business logic here
    # Generate invoice in Xero, send email
    
    invoice_data = {
        "invoice_id": f"inv_{datetime.now().timestamp()}",
        "invoice_number": f"INV-{datetime.now().strftime('%y%m%d')}-{order_id[-4:]}",
        "order_id": order_id,
        "sent_to": customer_email,
        "sent_at": datetime.now().isoformat(),
        "due_date": datetime.now().isoformat(),  # + 30 days
        "status": "sent",
        "pdf_url": f"https://xero.com/invoices/INV-{datetime.now().strftime('%y%m%d')}-{order_id[-4:]}.pdf"
    }
    
    return invoice_data


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "SFG Aluminium Message Handler",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
