# SFG-Analysis Message Handler Guide

## Overview

The message handler provides synchronous request/response communication for querying storage status and triggering actions.

## Message Handler Endpoint

**URL:** `https://sfg-analysis.abacusai.app/api/messages/handle`  
**Method:** POST  
**Content-Type:** application/json  
**Authentication:** Bearer Token or API Key

## Authentication

Include authentication in the request header:

```
Authorization: Bearer YOUR_API_TOKEN
```

## Message Format

All messages follow this structure:

```json
{
  "message_id": "msg_unique_id",
  "message_type": "query.storage_status",
  "sender": "app_name",
  "timestamp": "2025-11-05T10:00:00Z",
  "parameters": {
    // Message-specific parameters
  }
}
```

## Query Messages

### 1. query.storage_status

Get current storage metrics and status.

**Request:**
```json
{
  "message_id": "msg_001",
  "message_type": "query.storage_status",
  "sender": "sfg-dashboard",
  "timestamp": "2025-11-05T10:00:00Z",
  "parameters": {
    "site_url": "https://sfg.sharepoint.com/sites/projects",
    "detailed": true
  }
}
```

**Response:**
```json
{
  "message_id": "msg_001",
  "status": "success",
  "data": {
    "total_storage_gb": 1250,
    "used_storage_gb": 1100,
    "available_storage_gb": 150,
    "monthly_cost_gbp": 875,
    "category_breakdown": {
      "documents": 450,
      "images": 300,
      "videos": 250,
      "archives": 100
    },
    "optimization_potential_gb": 180,
    "estimated_savings_gbp": 135
  }
}
```

---

### 2. query.cost_forecast

Get storage cost forecast.

**Request:**
```json
{
  "message_id": "msg_002",
  "message_type": "query.cost_forecast",
  "sender": "sfg-finance",
  "timestamp": "2025-11-05T10:00:00Z",
  "parameters": {
    "months": 6
  }
}
```

**Response:**
```json
{
  "message_id": "msg_002",
  "status": "success",
  "data": {
    "current_cost_gbp": 875,
    "forecast": [
      {"month": "2025-12", "cost_gbp": 920},
      {"month": "2026-01", "cost_gbp": 965},
      {"month": "2026-02", "cost_gbp": 1010},
      {"month": "2026-03", "cost_gbp": 1055},
      {"month": "2026-04", "cost_gbp": 1100},
      {"month": "2026-05", "cost_gbp": 1145}
    ],
    "growth_rate_percentage": 5,
    "budget_status": "approaching_threshold",
    "recommendations": [
      "Consider archiving completed projects",
      "Enable automated cleanup for temporary files",
      "Review and remove duplicate documents"
    ]
  }
}
```

---

### 3. query.cleanup_recommendations

Get cleanup recommendations.

**Request:**
```json
{
  "message_id": "msg_003",
  "message_type": "query.cleanup_recommendations",
  "sender": "sfg-admin",
  "timestamp": "2025-11-05T10:00:00Z",
  "parameters": {
    "site_url": "https://sfg.sharepoint.com/sites/projects",
    "min_savings_gb": 10
  }
}
```

**Response:**
```json
{
  "message_id": "msg_003",
  "status": "success",
  "data": {
    "total_savings_potential_gb": 180,
    "recommendations": [
      {
        "type": "duplicates",
        "potential_savings_gb": 45,
        "file_count": 234,
        "priority": "high"
      },
      {
        "type": "old_temp_files",
        "potential_savings_gb": 28,
        "file_count": 567,
        "priority": "medium"
      },
      {
        "type": "archive_candidates",
        "potential_savings_gb": 107,
        "file_count": 1200,
        "priority": "low"
      }
    ],
    "estimated_cost_savings_gbp": 135
  }
}
```

---

## Action Messages

### 1. action.analyze_sharepoint

Trigger SharePoint storage analysis.

**Request:**
```json
{
  "message_id": "msg_004",
  "message_type": "action.analyze_sharepoint",
  "sender": "sfg-admin",
  "timestamp": "2025-11-05T10:00:00Z",
  "parameters": {
    "site_url": "https://sfg.sharepoint.com/sites/projects",
    "recursive": true,
    "analysis_depth": "full"
  }
}
```

**Response:**
```json
{
  "message_id": "msg_004",
  "status": "success",
  "data": {
    "analysis_id": "analysis_12345",
    "status": "in_progress",
    "estimated_completion": "2025-11-05T10:05:00Z",
    "results": {
      "total_files": 12450,
      "total_size_gb": 1250,
      "optimization_opportunities": 23,
      "estimated_savings_gb": 180
    }
  }
}
```

---

### 2. action.execute_cleanup

Execute cleanup operation.

**Request:**
```json
{
  "message_id": "msg_005",
  "message_type": "action.execute_cleanup",
  "sender": "sfg-admin",
  "timestamp": "2025-11-05T10:00:00Z",
  "parameters": {
    "cleanup_id": "cleanup_67890",
    "files": ["file1.tmp", "file2.old"],
    "action_type": "archive",
    "backup_location": "backup/2025-11-05"
  }
}
```

**Response:**
```json
{
  "message_id": "msg_005",
  "status": "success",
  "data": {
    "cleanup_status": "completed",
    "files_processed": 2,
    "space_reclaimed_gb": 12,
    "backup_url": "https://sfg.sharepoint.com/backup/2025-11-05",
    "rollback_deadline": "2025-12-05T10:00:00Z"
  }
}
```

---

### 3. action.sync_to_xero

Sync documents to Xero.

**Request:**
```json
{
  "message_id": "msg_006",
  "message_type": "action.sync_to_xero",
  "sender": "sfg-finance",
  "timestamp": "2025-11-05T10:00:00Z",
  "parameters": {
    "document_ids": ["doc_1", "doc_2"],
    "sync_type": "full"
  }
}
```

**Response:**
```json
{
  "message_id": "msg_006",
  "status": "success",
  "data": {
    "sync_id": "sync_11111",
    "documents_synced": 2,
    "sync_status": "completed"
  }
}
```

---

### 4. action.sync_to_logikal

Sync documents to Logikal.

**Request:**
```json
{
  "message_id": "msg_007",
  "message_type": "action.sync_to_logikal",
  "sender": "sfg-operations",
  "timestamp": "2025-11-05T10:00:00Z",
  "parameters": {
    "document_ids": ["doc_3", "doc_4"],
    "project_id": "proj_12345"
  }
}
```

**Response:**
```json
{
  "message_id": "msg_007",
  "status": "success",
  "data": {
    "sync_id": "sync_22222",
    "documents_synced": 2,
    "sync_status": "completed"
  }
}
```

---

## Error Responses

```json
{
  "message_id": "msg_001",
  "status": "error",
  "error_code": "INVALID_PARAMETERS",
  "error_message": "site_url is required",
  "timestamp": "2025-11-05T10:00:00Z"
}
```

## Testing

```bash
curl -X POST https://sfg-analysis.abacusai.app/api/messages/handle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "message_id": "test_msg",
    "message_type": "query.storage_status",
    "sender": "test_app",
    "timestamp": "2025-11-05T10:00:00Z",
    "parameters": {
      "site_url": "https://sfg.sharepoint.com/sites/projects",
      "detailed": true
    }
  }'
```

## Support

For message handler support:
- **Email:** warren@sfg-innovations.com
- **NEXUS Team:** nexus@sfg-innovations.com
- **Documentation:** https://sfg-analysis.abacusai.app/api/docs

---

*Part of the SFG Aluminium App Portfolio*
