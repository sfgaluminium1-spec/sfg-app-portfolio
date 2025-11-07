
/**
 * NEXUS Message Handler for ChronoShift Pro
 * 
 * Responds to requests from NEXUS or other SFG apps:
 * - query.employee_data
 * - query.timesheet_summary
 * - query.payroll_summary
 * - action.approve_timesheet
 * - action.generate_payslip
 * - action.export_payroll_data
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const message = await request.json();
    const messageType = message.type;
    const params = message.params || {};
    const requestId = message.request_id || crypto.randomUUID();

    console.log(`💬 NEXUS Message Received: ${messageType}`, {
      request_id: requestId,
      timestamp: new Date().toISOString()
    });

    // Log to compliance system
    await prisma.hRComplianceLog.create({
      data: {
        action: 'NEXUS_MESSAGE_RECEIVED',
        details: {
          message_type: messageType,
          request_id: requestId,
          params: params
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'nexus-message'
      }
    });

    // Handle different message types
    let result;
    try {
      switch (messageType) {
        case 'query.employee_data':
          result = await getEmployeeData(params);
          break;
        case 'query.timesheet_summary':
          result = await getTimesheetSummary(params);
          break;
        case 'query.payroll_summary':
          result = await getPayrollSummary(params);
          break;
        case 'action.approve_timesheet':
          result = await approveTimesheet(params);
          break;
        case 'action.generate_payslip':
          result = await generatePayslip(params);
          break;
        case 'action.export_payroll_data':
          result = await exportPayrollData(params);
          break;
        case 'test.message':
          result = { message: 'Test message received successfully', echo: params };
          break;
        default:
          result = { error: `Unknown message type: ${messageType}` };
      }

      return NextResponse.json({
        request_id: requestId,
        status: 'error' in result ? 'error' : 'success',
        result: result,
        timestamp: new Date().toISOString()
      });
    } catch (handlerError) {
      console.error(`Error handling message ${messageType}:`, handlerError);
      return NextResponse.json({
        request_id: requestId,
        status: 'error',
        result: {
          error: handlerError instanceof Error ? handlerError.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('NEXUS message handler error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get employee data
 */
async function getEmployeeData(params: any) {
  const { employee_id, email, employee_number } = params;

  // Build where clause conditionally
  const whereConditions: any[] = [];
  if (employee_id) whereConditions.push({ id: employee_id });
  if (email) whereConditions.push({ email: email });
  if (employee_number) {
    whereConditions.push({
      employee: {
        employeeNumber: employee_number
      }
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: whereConditions.length > 0 ? whereConditions : [{ id: employee_id }]
    },
    include: {
      employee: true
    }
  });

  if (!user) {
    return { error: 'Employee not found' };
  }

  return {
    employee_id: user.id,
    employee_number: user.employee?.employeeNumber,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.employee?.department,
    position: user.employee?.role,
    hire_date: user.employee?.startDate,
    hourly_rate: user.employee?.hourlyRate,
    weekly_hours: user.employee?.weeklyHours,
    mobile: user.employee?.phone,
    is_manager: user.employee?.isManager,
    is_active: user.employee?.isActive
  };
}

/**
 * Get timesheet summary
 */
async function getTimesheetSummary(params: any) {
  const { employee_id, start_date, end_date, period } = params;

  let dateRange: { gte: Date; lte: Date };

  if (period === 'this_week') {
    const now = new Date();
    dateRange = {
      gte: startOfWeek(now, { weekStartsOn: 1 }),
      lte: endOfWeek(now, { weekStartsOn: 1 })
    };
  } else if (period === 'this_month') {
    const now = new Date();
    dateRange = {
      gte: startOfMonth(now),
      lte: endOfMonth(now)
    };
  } else {
    dateRange = {
      gte: new Date(start_date),
      lte: new Date(end_date)
    };
  }

  // Find employee first
  const user = await prisma.user.findUnique({
    where: { id: employee_id },
    include: { employee: true }
  });

  if (!user?.employee) {
    return { error: 'Employee not found' };
  }

  const timesheets = await prisma.timesheet.findMany({
    where: {
      employeeId: user.employee.id,
      workDate: dateRange
    },
    orderBy: {
      workDate: 'desc'
    }
  });

  const summary = timesheets.reduce(
    (acc, ts) => {
      acc.total_hours += ts.totalHours || 0;
      acc.regular_hours += ts.regularHours || 0;
      acc.overtime_hours += ts.overtimeHours || 0;
      acc.total_pay += ts.totalPay || 0;
      acc.days_worked += 1;

      if (ts.status === 'APPROVED') acc.approved_count += 1;
      if (ts.status === 'SUBMITTED') acc.pending_count += 1;
      if (ts.status === 'REJECTED') acc.rejected_count += 1;

      return acc;
    },
    {
      total_hours: 0,
      regular_hours: 0,
      overtime_hours: 0,
      total_pay: 0,
      days_worked: 0,
      approved_count: 0,
      pending_count: 0,
      rejected_count: 0
    }
  );

  return {
    employee_id: employee_id,
    period: period || { start_date, end_date },
    summary: summary,
    timesheets: timesheets.map(ts => ({
      id: ts.id,
      date: ts.workDate,
      hours: ts.totalHours || 0,
      pay: ts.totalPay || 0,
      status: ts.status
    }))
  };
}

/**
 * Get payroll summary
 */
async function getPayrollSummary(params: any) {
  const { start_date, end_date, department } = params;

  // Get approved timesheets for the period
  const timesheets = await prisma.timesheet.findMany({
    where: {
      workDate: {
        gte: new Date(start_date),
        lte: new Date(end_date)
      },
      status: 'APPROVED'
    }
  });

  // Calculate basic totals
  const totals = timesheets.reduce(
    (acc, ts) => {
      acc.total_regular_hours += ts.regularHours || 0;
      acc.total_overtime_hours += ts.overtimeHours || 0;
      acc.total_regular_pay += ts.regularPay || 0;
      acc.total_overtime_pay += ts.overtimePay || 0;
      acc.total_payroll += ts.totalPay || 0;
      return acc;
    },
    {
      total_regular_hours: 0,
      total_overtime_hours: 0,
      total_regular_pay: 0,
      total_overtime_pay: 0,
      total_payroll: 0
    }
  );

  // Get unique employee count
  const uniqueEmployees = new Set(timesheets.map(ts => ts.employeeId));

  return {
    period: { start_date, end_date },
    department: department || 'all',
    employees_count: uniqueEmployees.size,
    timesheets_count: timesheets.length,
    totals: totals,
    message: 'Detailed employee breakdown available via export API'
  };
}

/**
 * Approve timesheet
 */
async function approveTimesheet(params: any) {
  const { timesheet_id, approved_by, notes } = params;

  const timesheet = await prisma.timesheet.update({
    where: { id: timesheet_id },
    data: {
      status: 'APPROVED',
      approvedAt: new Date(),
      approvedById: approved_by || undefined,
      rejectionReason: notes || undefined
    }
  });

  // Log approval
  await prisma.hRComplianceLog.create({
    data: {
      action: 'TIMESHEET_APPROVED_VIA_NEXUS',
      details: {
        timesheet_id: timesheet_id,
        approved_by: approved_by,
        notes: notes
      },
      ipAddress: 'nexus-message'
    }
  });

  return {
    timesheet_id: timesheet_id,
    status: 'APPROVED',
    approved_at: new Date().toISOString()
  };
}

/**
 * Generate payslip
 */
async function generatePayslip(params: any) {
  const { employee_id, start_date, end_date } = params;

  // Find user and employee
  const user = await prisma.user.findUnique({
    where: { id: employee_id },
    include: { employee: true }
  });

  if (!user?.employee) {
    return { error: 'Employee not found' };
  }

  const timesheets = await prisma.timesheet.findMany({
    where: {
      employeeId: user.employee.id,
      workDate: {
        gte: new Date(start_date),
        lte: new Date(end_date)
      },
      status: 'APPROVED'
    }
  });

  if (timesheets.length === 0) {
    return { error: 'No approved timesheets found for this period' };
  }

  const totals = timesheets.reduce(
    (acc, ts) => {
      acc.regular_hours += ts.regularHours || 0;
      acc.overtime_hours += ts.overtimeHours || 0;
      acc.regular_pay += ts.regularPay || 0;
      acc.overtime_pay += ts.overtimePay || 0;
      acc.total_pay += ts.totalPay || 0;
      return acc;
    },
    { regular_hours: 0, overtime_hours: 0, regular_pay: 0, overtime_pay: 0, total_pay: 0 }
  );

  return {
    payslip_id: `PAY-${employee_id}-${Date.now()}`,
    employee: {
      id: user.id,
      number: user.employee.employeeNumber,
      name: user.name,
      department: user.employee.department
    },
    period: { start_date, end_date },
    breakdown: totals,
    generated_at: new Date().toISOString()
  };
}

/**
 * Export payroll data
 */
async function exportPayrollData(params: any) {
  const { start_date, end_date, format } = params;

  const summary = await getPayrollSummary({ start_date, end_date });

  return {
    export_id: `EXPORT-${Date.now()}`,
    format: format || 'json',
    data: summary,
    exported_at: new Date().toISOString(),
    download_url: `/api/export/payroll?start=${start_date}&end=${end_date}&format=${format || 'json'}`
  };
}

// Support GET for message handler verification
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'ChronoShift Pro NEXUS Message Handler',
    app_name: 'chronoshift-pro',
    supported_messages: [
      'query.employee_data',
      'query.timesheet_summary',
      'query.payroll_summary',
      'action.approve_timesheet',
      'action.generate_payslip',
      'action.export_payroll_data',
      'test.message'
    ],
    timestamp: new Date().toISOString()
  });
}
