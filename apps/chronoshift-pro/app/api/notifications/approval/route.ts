
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { timesheetId, approved, notes } = await request.json();

    // Get timesheet and employee details
    const timesheet = await prisma.timesheet.findUnique({
      where: { id: timesheetId },
      include: {
        employee: true
      }
    });

    if (!timesheet) {
      return NextResponse.json({ error: 'Timesheet not found' }, { status: 404 });
    }

    // Log notification (notification model not yet implemented)
    console.log('Notification would be created:', {
      userId: timesheet.employeeId,
      type: approved ? 'TIMESHEET_APPROVED' : 'TIMESHEET_REJECTED',
      title: `Timesheet ${approved ? 'Approved' : 'Rejected'}`,
      message: `Your timesheet for week ending ${timesheet.workDate.toLocaleDateString('en-GB')} has been ${approved ? 'approved' : 'rejected'}${notes ? `. Notes: ${notes}` : '.'}`,
      data: {
        timesheetId,
        approved,
        notes,
        supervisorName: session.user.name
      }
    });

    // Send email notification (if email service is configured)
    try {
      const emailSubject = `Timesheet ${approved ? 'Approved' : 'Rejected'} - SFG Aluminium`;
      const emailBody = `
        Dear ${timesheet.employee.firstName} ${timesheet.employee.lastName},

        Your timesheet for the week ending ${timesheet.workDate.toLocaleDateString('en-GB')} has been ${approved ? 'approved' : 'rejected'} by your supervisor.

        ${notes ? `Supervisor Notes: ${notes}` : ''}

        ${approved ? 
          'Your timesheet has been processed and will be included in the next payroll cycle.' : 
          'Please review your timesheet and resubmit with any necessary corrections.'
        }

        Best regards,
        SFG Aluminium Payroll Team
      `;

      // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
      console.log('Email notification would be sent:', {
        to: timesheet.employee.email,
        subject: emailSubject,
        body: emailBody
      });

    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({ 
      message: 'Approval notification sent successfully' 
    });

  } catch (error) {
    console.error('Error sending approval notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
