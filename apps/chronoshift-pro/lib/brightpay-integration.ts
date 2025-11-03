
/**
 * BRIGHTPAY INTEGRATION - EMAIL APPROACH
 * 
 * This module handles BrightPay integration via email for MVP.
 * Future versions will integrate with BrightPay API when available.
 */

import nodemailer from 'nodemailer';

interface HolidayRequest {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason?: string;
  requestType: 'annual-leave' | 'sick-leave' | 'personal' | 'emergency';
  status: 'pending' | 'approved' | 'rejected';
}

interface TimesheetSummary {
  weekEnding: Date;
  employeeData: {
    employeeId: string;
    name: string;
    email: string;
    department: string;
    normalHours: number;
    overtimeHours: number;
    totalHours: number;
    hourlyRate: number;
    totalPay: number;
  }[];
  totals: {
    totalNormalHours: number;
    totalOvertimeHours: number;
    totalPay: number;
  };
}

// Create email transporter (configure based on your email provider)
const createEmailTransporter = () => {
  // For development/testing - using a service like SendGrid, Mailgun, or SMTP
  return nodemailer.createTransport({
    // Configure your email service here
    // Example for Gmail/Outlook:
    host: 'smtp.gmail.com', // or your SMTP server
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // Add to .env
      pass: process.env.EMAIL_PASSWORD, // Add to .env
    },
  });
};

export async function sendHolidayRequestToBrightPay(request: HolidayRequest): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    
    const emailContent = `
SFG ALUMINIUM LTD - HOLIDAY REQUEST

Employee Details:
- Name: ${request.employeeName}
- Email: ${request.employeeEmail}
- Employee ID: ${request.employeeId}

Holiday Request Details:
- Type: ${request.requestType.toUpperCase()}
- Start Date: ${request.startDate.toLocaleDateString('en-GB')}
- End Date: ${request.endDate.toLocaleDateString('en-GB')}
- Total Days: ${request.totalDays}
- Reason: ${request.reason || 'Not specified'}

Status: ${request.status.toUpperCase()}

This request was automatically generated from ChronoShift Pro.
Please process this request in BrightPay and update the employee accordingly.

Generated: ${new Date().toLocaleString('en-GB')}
`;

    const mailOptions = {
      from: process.env.MICROSOFT_ADMIN_EMAIL || 'warren@sfg-aluminium.co.uk',
      to: process.env.BRIGHTPAY_EMAIL || 'warren@sfg-aluminium.co.uk',
      cc: process.env.PAYROLL_ADMIN_EMAIL,
      subject: `Holiday Request - ${request.employeeName} - ${request.startDate.toLocaleDateString('en-GB')}`,
      text: emailContent,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="background: #1e40af; color: white; padding: 20px; border-radius: 8px;">
              <h2>SFG ALUMINIUM LTD - HOLIDAY REQUEST</h2>
            </div>
            <div style="padding: 20px; background: #f9fafb; margin: 20px 0; border-radius: 8px;">
              <h3 style="color: #1e40af;">Employee Details:</h3>
              <ul>
                <li><strong>Name:</strong> ${request.employeeName}</li>
                <li><strong>Email:</strong> ${request.employeeEmail}</li>
                <li><strong>Employee ID:</strong> ${request.employeeId}</li>
              </ul>
              
              <h3 style="color: #1e40af;">Holiday Request Details:</h3>
              <ul>
                <li><strong>Type:</strong> ${request.requestType.toUpperCase()}</li>
                <li><strong>Start Date:</strong> ${request.startDate.toLocaleDateString('en-GB')}</li>
                <li><strong>End Date:</strong> ${request.endDate.toLocaleDateString('en-GB')}</li>
                <li><strong>Total Days:</strong> ${request.totalDays}</li>
                <li><strong>Reason:</strong> ${request.reason || 'Not specified'}</li>
              </ul>
              
              <p style="background: #10b981; color: white; padding: 10px; border-radius: 4px; display: inline-block;">
                <strong>Status: ${request.status.toUpperCase()}</strong>
              </p>
            </div>
            <div style="padding: 10px; background: #e5e7eb; border-radius: 4px; font-size: 12px;">
              <p>This request was automatically generated from <strong>ChronoShift Pro</strong>.</p>
              <p>Please process this request in BrightPay and update the employee accordingly.</p>
              <p>Generated: ${new Date().toLocaleString('en-GB')}</p>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Holiday request email sent for ${request.employeeName}`);
    return true;

  } catch (error) {
    console.error('❌ Failed to send holiday request email:', error);
    return false;
  }
}

export async function sendTimesheetSummaryToBrightPay(summary: TimesheetSummary): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    
    // Generate CSV content
    const csvContent = generateBrightPayCSV(summary);
    
    const emailContent = `
SFG ALUMINIUM LTD - WEEKLY TIMESHEET SUMMARY

Week Ending: ${summary.weekEnding.toLocaleDateString('en-GB')}

Summary Totals:
- Total Normal Hours: ${summary.totals.totalNormalHours}
- Total Overtime Hours: ${summary.totals.totalOvertimeHours}
- Total Pay: £${summary.totals.totalPay.toFixed(2)}
- Total Employees: ${summary.employeeData.length}

Please find the attached CSV file for import into BrightPay.

Employee Breakdown:
${summary.employeeData.map(emp => 
  `${emp.name}: ${emp.totalHours} hours = £${emp.totalPay.toFixed(2)}`
).join('\n')}

Generated: ${new Date().toLocaleString('en-GB')}
ChronoShift Pro - SFG Aluminium Payroll System
`;

    const mailOptions = {
      from: process.env.MICROSOFT_ADMIN_EMAIL || 'warren@sfg-aluminium.co.uk',
      to: process.env.BRIGHTPAY_EMAIL || 'warren@sfg-aluminium.co.uk',
      cc: process.env.PAYROLL_ADMIN_EMAIL,
      subject: `Payroll Data - Week Ending ${summary.weekEnding.toLocaleDateString('en-GB')}`,
      text: emailContent,
      attachments: [
        {
          filename: `SFG_Payroll_${summary.weekEnding.toISOString().split('T')[0]}.csv`,
          content: csvContent,
          contentType: 'text/csv',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Timesheet summary email sent for week ending ${summary.weekEnding.toLocaleDateString('en-GB')}`);
    return true;

  } catch (error) {
    console.error('❌ Failed to send timesheet summary email:', error);
    return false;
  }
}

function generateBrightPayCSV(summary: TimesheetSummary): string {
  const headers = [
    'Employee ID',
    'Employee Name',
    'Email',
    'Department',
    'Normal Hours',
    'Overtime Hours', 
    'Total Hours',
    'Hourly Rate',
    'Normal Pay',
    'Overtime Pay',
    'Total Pay',
    'Week Ending',
  ];

  const rows = summary.employeeData.map(emp => [
    emp.employeeId,
    emp.name,
    emp.email,
    emp.department,
    emp.normalHours.toFixed(2),
    emp.overtimeHours.toFixed(2),
    emp.totalHours.toFixed(2),
    emp.hourlyRate.toFixed(2),
    (emp.normalHours * emp.hourlyRate).toFixed(2),
    (emp.overtimeHours * emp.hourlyRate * 1.5).toFixed(2),
    emp.totalPay.toFixed(2),
    summary.weekEnding.toLocaleDateString('en-GB'),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

// Direct integration test function
export async function testBrightPayIntegration(): Promise<void> {
  console.log('🧪 Testing BrightPay Email Integration...');
  
  // Test holiday request
  const testHolidayRequest: HolidayRequest = {
    employeeId: 'SFG001',
    employeeName: 'Test Employee',
    employeeEmail: 'test@sfg-aluminium.co.uk',
    startDate: new Date('2025-09-20'),
    endDate: new Date('2025-09-22'),
    totalDays: 3,
    reason: 'Annual holiday',
    requestType: 'annual-leave',
    status: 'pending',
  };

  const holidayResult = await sendHolidayRequestToBrightPay(testHolidayRequest);
  console.log(`Holiday request email: ${holidayResult ? '✅ Success' : '❌ Failed'}`);

  // Test timesheet summary
  const testTimesheetSummary: TimesheetSummary = {
    weekEnding: new Date('2025-09-15'),
    employeeData: [
      {
        employeeId: 'SFG001',
        name: 'Test Employee',
        email: 'test@sfg-aluminium.co.uk',
        department: 'Testing',
        normalHours: 40,
        overtimeHours: 5,
        totalHours: 45,
        hourlyRate: 15.00,
        totalPay: 712.50,
      },
    ],
    totals: {
      totalNormalHours: 40,
      totalOvertimeHours: 5,
      totalPay: 712.50,
    },
  };

  const timesheetResult = await sendTimesheetSummaryToBrightPay(testTimesheetSummary);
  console.log(`Timesheet summary email: ${timesheetResult ? '✅ Success' : '❌ Failed'}`);
}
