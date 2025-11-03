# Webhook Handler

Single webhook with unlimited redirects architecture.

## Purpose
Central webhook receiver that intelligently routes incoming webhooks to appropriate satellite applications or NEXUS components.

## Architecture
**Single Entry Point**: One webhook URL receives all external webhooks  
**Unlimited Redirects**: Can route to any satellite app or NEXUS component  
**Intelligent Routing**: Payload-based routing logic  

## Features
- Request validation and authentication
- Intelligent routing based on source and payload
- Request logging and monitoring
- Error handling and retry logic
- Rate limiting per source
- Dead letter queue for failed webhooks

## Routing Configuration
Routing rules defined in `webhook-routes.json`

## Monitoring
All webhook activity logged for audit and debugging.
