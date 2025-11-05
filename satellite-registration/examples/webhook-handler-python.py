
"""
SFG Aluminium - Webhook Handler (Python/FastAPI)
Version: 1.0.0
Date: November 5, 2025

This webhook handler receives real-time events from NEXUS and other SFG apps.
"""

from fastapi import FastAPI, Request, HTTPException
from typing import Dict, Any
import hmac
import hashlib
import json
from datetime import datetime

app = FastAPI(title="SFG Aluminium Webhook Handler")

# Webhook secret for signature verification
# IMPORTANT: Store this securely in environment variables
WEBHOOK_SECRET = "your-webhook-secret-here"

@app.post("/webhooks/nexus")
async def handle_nexus_webhook(request: Request):
    """
    Handle incoming webhooks from NEXUS
    
    Event Types:
    - enquiry.created: New customer enquiry received
    - quote.requested: Customer requested a quote
    - order.approved: Order has been approved
    - customer.registered: New customer registered
    - credit.check_required: Credit check needed
    - invoice.due: Invoice payment is due
    - payment.received: Payment has been received
    """
    # Verify signature to ensure request is from NEXUS
    signature = request.headers.get("X-Nexus-Signature")
    body = await request.body()
    
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature or "", expected_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Parse event
    event = await request.json()
    event_type = event.get("type")
    data = event.get("data")
    
    print(f"[{datetime.now().isoformat()}] Received event: {event_type}")
    
    # Route to appropriate handler
    handlers = {
        "enquiry.created": handle_enquiry_created,
        "quote.requested": handle_quote_requested,
        "order.approved": handle_order_approved,
        "customer.registered": handle_customer_registered,
        "credit.check_required": handle_credit_check,
        "invoice.due": handle_invoice_due,
        "payment.received": handle_payment_received
    }
    
    handler = handlers.get(event_type)
    if handler:
        return await handler(data)
    else:
        return {
            "status": "ignored",
            "reason": f"Unknown event type: {event_type}"
        }


async def handle_enquiry_created(data: Dict[str, Any]):
    """
    Handle new enquiry event
    
    Business Logic:
    1. Create project folder in SharePoint
    2. Assign estimator based on workload
    3. Check if credit check required (> £10k)
    4. Send notification to sales team
    """
    enquiry_id = data.get("enquiry_id")
    customer = data.get("customer")
    estimated_value = data.get("estimated_value", 0)
    
    print(f"Processing enquiry {enquiry_id} from {customer.get('name')}")
    
    # Your business logic here
    actions = []
    
    # 1. Create project folder
    # folder_created = await create_sharepoint_folder(enquiry_id)
    actions.append("Project folder created in SharePoint")
    
    # 2. Assign estimator
    # estimator = await assign_estimator_by_workload()
    actions.append("Estimator assigned based on current workload")
    
    # 3. Check if credit check required
    if estimated_value > 10000:
        # await request_credit_check(customer["id"])
        actions.append("Credit check requested via Experian")
    
    # 4. Send notification
    # await send_notification("sales_team", f"New enquiry {enquiry_id}")
    actions.append("Sales team notified")
    
    return {
        "status": "processed",
        "enquiry_id": enquiry_id,
        "actions": actions,
        "timestamp": datetime.now().isoformat()
    }


async def handle_quote_requested(data: Dict[str, Any]):
    """
    Handle quote request event
    
    Business Logic:
    1. Calculate pricing from items
    2. Apply customer tier discounts
    3. Check margin is >= 15%
    4. Get approval if needed (tier-based limits)
    5. Generate quote document
    """
    enquiry_id = data.get("enquiry_id")
    items = data.get("items", [])
    customer_tier = data.get("customer_tier", "steel")
    
    print(f"Generating quote for enquiry {enquiry_id}")
    
    # Your business logic here
    
    # 1. Calculate pricing
    total_cost = sum(item.get("cost", 0) for item in items)
    total_price = sum(item.get("price", 0) for item in items)
    margin = (total_price - total_cost) / total_price if total_price > 0 else 0
    
    # 2. Check minimum margin (15%)
    if margin < 0.15:
        return {
            "status": "rejected",
            "reason": "Margin below minimum (15%)",
            "margin": margin,
            "required_margin": 0.15
        }
    
    # 3. Check if approval needed
    approval_needed = False
    approval_tier = None
    if total_price > 100000:
        approval_needed = True
        approval_tier = "T2"  # Senior Manager
    elif total_price > 25000:
        approval_needed = True
        approval_tier = "T3"  # Manager
    
    # 4. Generate quote
    quote_number = f"QUO-{datetime.now().strftime('%y%m%d')}-{enquiry_id[-4:]}"
    
    return {
        "status": "processed",
        "quote_number": quote_number,
        "total_amount": total_price,
        "margin": margin,
        "approval_needed": approval_needed,
        "approval_tier": approval_tier,
        "timestamp": datetime.now().isoformat()
    }


async def handle_order_approved(data: Dict[str, Any]):
    """
    Handle order approval event
    
    Business Logic:
    1. Schedule production
    2. Create invoice in Xero
    3. Update SharePoint with order details
    4. Notify production team
    """
    order_id = data.get("order_id")
    customer = data.get("customer")
    items = data.get("items", [])
    
    print(f"Processing approved order {order_id}")
    
    # Your business logic here
    actions = []
    
    # 1. Schedule production
    production_date = "2025-11-10"  # Calculate based on capacity
    actions.append(f"Production scheduled for {production_date}")
    
    # 2. Create invoice
    invoice_number = f"INV-{datetime.now().strftime('%y%m%d')}-{order_id[-4:]}"
    actions.append(f"Invoice {invoice_number} created in Xero")
    
    # 3. Update SharePoint
    actions.append("SharePoint updated with order details")
    
    # 4. Notify team
    actions.append("Production team notified")
    
    return {
        "status": "processed",
        "order_id": order_id,
        "production_scheduled": production_date,
        "invoice_created": invoice_number,
        "actions": actions,
        "timestamp": datetime.now().isoformat()
    }


async def handle_customer_registered(data: Dict[str, Any]):
    """Handle new customer registration"""
    customer_id = data.get("customer_id")
    customer_name = data.get("customer_name")
    
    print(f"New customer registered: {customer_name} ({customer_id})")
    
    # Your business logic here
    return {
        "status": "processed",
        "customer_id": customer_id,
        "actions": ["Customer portal created", "Welcome email sent"],
        "timestamp": datetime.now().isoformat()
    }


async def handle_credit_check(data: Dict[str, Any]):
    """
    Handle credit check request
    
    Business Logic:
    1. Query Experian API via MCP-FINANCE
    2. Evaluate credit score
    3. Set credit limit based on score
    4. Update customer tier if needed
    """
    customer_id = data.get("customer_id")
    order_value = data.get("order_value")
    
    print(f"Credit check requested for customer {customer_id}")
    
    # Your business logic here
    # credit_score = await check_experian_credit(customer_id)
    credit_score = 750  # Example
    
    # Determine credit limit
    if credit_score >= 700:
        credit_limit = 50000
        approved = True
    elif credit_score >= 600:
        credit_limit = 25000
        approved = order_value <= credit_limit
    else:
        credit_limit = 10000
        approved = order_value <= credit_limit
    
    return {
        "status": "processed",
        "customer_id": customer_id,
        "credit_score": credit_score,
        "credit_limit": credit_limit,
        "approved": approved,
        "timestamp": datetime.now().isoformat()
    }


async def handle_invoice_due(data: Dict[str, Any]):
    """Handle invoice due notification"""
    invoice_id = data.get("invoice_id")
    customer_id = data.get("customer_id")
    amount_due = data.get("amount_due")
    
    print(f"Invoice {invoice_id} is due: £{amount_due}")
    
    # Your business logic here
    return {
        "status": "processed",
        "invoice_id": invoice_id,
        "actions": ["Reminder email sent", "Finance team notified"],
        "timestamp": datetime.now().isoformat()
    }


async def handle_payment_received(data: Dict[str, Any]):
    """Handle payment received notification"""
    payment_id = data.get("payment_id")
    invoice_id = data.get("invoice_id")
    amount = data.get("amount")
    
    print(f"Payment received: £{amount} for invoice {invoice_id}")
    
    # Your business logic here
    return {
        "status": "processed",
        "payment_id": payment_id,
        "actions": ["Invoice marked as paid", "Customer notified", "Xero updated"],
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "SFG Aluminium Webhook Handler",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
