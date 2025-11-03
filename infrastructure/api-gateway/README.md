# API Gateway

API routing and management layer for the SFG Aluminium ecosystem.

## Purpose
Central API gateway that handles routing, authentication, and rate limiting for all inter-application communication.

## Features
- Request routing between applications
- Authentication and authorization
- Tier-based rate limiting
- API versioning
- Health monitoring
- Performance metrics
- Request/response logging

## Tier-Based Rate Limiting
- Tier 1: Unlimited requests
- Tier 2: 1000 requests/hour
- Tier 3: 500 requests/hour
- Tier 4: 250 requests/hour
- Tier 5: 100 requests/hour

## Configuration
Gateway configuration in `gateway-config.json`
