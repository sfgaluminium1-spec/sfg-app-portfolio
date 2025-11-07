
/**
 * NEXUS Webhook Endpoint for ChronoShift Pro
 * 
 * Handles incoming events from NEXUS orchestration system:
 * - employee.registered
 * - employee.updated
 * - payroll.process_requested
 * - timesheet.bulk_import
 * - compliance.audit_required
 */

import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { prisma } from '@/lib/db';

// Webhook secret for signature verification
const WEBHOOK_SECRET = process.env.NEXUS_WEBHOOK_SECRET || 'chronoshift-pro-nexus-secret-2025';

export async function POST(request: NextRequest) {
  try {
    // Verify signature
    const signature = request.headers.get('x-nexus-signature');
    const body = await request.text();
    
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    if (signature && !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )) {
      console.error('Invalid NEXUS webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse event
    const event = JSON.parse(body);
    const eventType = event.type;
    const data = event.data;
    const eventId = event.event_id || crypto.randomUUID();

    console.log(`🔔 NEXUS Event Received: ${eventType}`, {
      event_id: eventId,
      timestamp: new Date().toISOString()
    });

    // Log to compliance system
    await prisma.hRComplianceLog.create({
      data: {
        action: 'NEXUS_WEBHOOK_EVENT',
        details: {
          event_type: eventType,
          event_id: eventId,
          data: data
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'nexus-webhook'
      }
    });

    // Handle different event types
    let result;
    switch (eventType) {
      case 'employee.registered':
        result = await handleEmployeeRegistered(data);
        break;
      case 'employee.updated':
        result = await handleEmployeeUpdated(data);
        break;
      case 'payroll.process_requested':
        result = await handlePayrollProcessRequested(data);
        break;
      case 'timesheet.bulk_import':
        result = await handleTimesheetBulkImport(data);
        break;
      case 'compliance.audit_required':
        result = await handleComplianceAuditRequired(data);
        break;
      case 'test.event':
        result = { status: 'processed', message: 'Test event received successfully' };
        break;
      default:
        console.warn(`Unknown NEXUS event type: ${eventType}`);
        return NextResponse.json({
          status: 'ignored',
          reason: `Unknown event type: ${eventType}`
        });
    }

    return NextResponse.json({
      status: 'processed',
      event_type: eventType,
      event_id: eventId,
      result: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('NEXUS webhook error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle employee.registered event
 */
async function handleEmployeeRegistered(data: any) {
  console.log('👤 Processing employee registration:', data.employee_id);

  // TODO: Implement actual employee creation when sync is needed
  // For now, just acknowledge the event
  return {
    status: 'acknowledged',
    employee_id: data.employee_id,
    employee_number: data.employee_number,
    message: 'Employee registration event received',
    actions: [
      'Event logged to compliance system',
      'Ready for future sync implementation'
    ]
  };
}

/**
 * Handle employee.updated event
 */
async function handleEmployeeUpdated(data: any) {
  console.log('👤 Processing employee update:', data.employee_id);

  // TODO: Implement actual employee updates when sync is needed
  return {
    status: 'acknowledged',
    employee_id: data.employee_id,
    message: 'Employee update event received',
    fields_updated: Object.keys(data).filter(k => k !== 'employee_id' && k !== 'email')
  };
}

/**
 * Handle payroll.process_requested event
 */
async function handlePayrollProcessRequested(data: any) {
  console.log('💰 Processing payroll request:', data.period_id);

  try {
    const { start_date, end_date, period_id } = data;

    // Get approved timesheets count for the period
    const timesheetCount = await prisma.timesheet.count({
      where: {
        workDate: {
          gte: new Date(start_date),
          lte: new Date(end_date)
        },
        status: 'APPROVED'
      }
    });

    return {
      status: 'processed',
      period_id: period_id,
      start_date: start_date,
      end_date: end_date,
      timesheets_found: timesheetCount,
      message: 'Payroll data available via API export endpoints'
    };
  } catch (error) {
    console.error('Failed to process payroll:', error);
    throw error;
  }
}

/**
 * Handle timesheet.bulk_import event
 */
async function handleTimesheetBulkImport(data: any) {
  console.log('📊 Processing bulk timesheet import');

  // TODO: Implement actual bulk import when needed
  // For now, just acknowledge the request
  const timesheetCount = data.timesheets?.length || 0;
  
  return {
    status: 'acknowledged',
    timesheets_received: timesheetCount,
    message: 'Bulk import feature available via admin interface',
    note: 'Use existing timesheet entry workflow for data integrity'
  };
}

/**
 * Handle compliance.audit_required event
 */
async function handleComplianceAuditRequired(data: any) {
  console.log('📋 Processing compliance audit request:', data.audit_type);

  try {
    const { audit_type, start_date, end_date, scope } = data;

    // Generate basic compliance report
    let auditResults: any = {};

    if (audit_type === 'timesheet_accuracy' || scope === 'all') {
      const timesheets = await prisma.timesheet.findMany({
        where: {
          workDate: {
            gte: new Date(start_date),
            lte: new Date(end_date)
          }
        }
      });

      auditResults.timesheet_accuracy = {
        total_timesheets: timesheets.length,
        approved: timesheets.filter(ts => ts.status === 'APPROVED').length,
        pending: timesheets.filter(ts => ts.status === 'SUBMITTED').length,
        rejected: timesheets.filter(ts => ts.status === 'REJECTED').length
      };
    }

    if (audit_type === 'compliance_logs' || scope === 'all') {
      const logs = await prisma.hRComplianceLog.findMany({
        where: {
          timestamp: {
            gte: new Date(start_date),
            lte: new Date(end_date)
          }
        }
      });

      auditResults.compliance_logs = {
        total_logs: logs.length,
        actions: logs.reduce((acc: any, log) => {
          acc[log.action] = (acc[log.action] || 0) + 1;
          return acc;
        }, {})
      };
    }

    return {
      status: 'completed',
      audit_type: audit_type,
      period: { start_date, end_date },
      results: auditResults,
      generated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Compliance audit failed:', error);
    throw error;
  }
}

// Support GET for webhook verification
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'ChronoShift Pro NEXUS Webhook Endpoint',
    app_name: 'chronoshift-pro',
    supported_events: [
      'employee.registered',
      'employee.updated',
      'payroll.process_requested',
      'timesheet.bulk_import',
      'compliance.audit_required',
      'test.event'
    ],
    timestamp: new Date().toISOString()
  });
}
