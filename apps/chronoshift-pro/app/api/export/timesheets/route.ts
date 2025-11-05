
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to export data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (user?.role !== 'manager' && user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    const where: any = {};
    
    if (startDate && endDate) {
      where.workDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const timesheets = await prisma.timesheet.findMany({
      where,
      include: {
        employee: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { workDate: 'asc' },
        { employee: { employeeNumber: 'asc' } },
      ],
    });

    // Prepare data for Excel export
    const excelData = timesheets.map((timesheet) => ({
      'Employee Number': timesheet.employee?.employeeNumber || '',
      'Employee Name': `${timesheet.employee?.firstName || ''} ${timesheet.employee?.lastName || ''}`.trim(),
      'Department': timesheet.employee?.department || '',
      'Work Date': format(new Date(timesheet.workDate), 'yyyy-MM-dd'),
      'Day of Week': format(new Date(timesheet.workDate), 'EEEE'),
      'Start Time': timesheet.startTime,
      'End Time': timesheet.endTime,
      'Break Minutes': timesheet.breakMinutes,
      'Regular Hours': timesheet.regularHours?.toFixed(2) || '0.00',
      'Overtime Hours': timesheet.overtimeHours?.toFixed(2) || '0.00',
      'Night Hours': timesheet.nightHours?.toFixed(2) || '0.00',
      'Sleep Deduction': timesheet.sleepHours?.toFixed(2) || '0.00',
      'Total Hours': timesheet.totalHours?.toFixed(2) || '0.00',
      'Hourly Rate': timesheet.employee?.hourlyRate?.toFixed(2) || '0.00',
      'Regular Pay': timesheet.regularPay?.toFixed(2) || '0.00',
      'Overtime Pay': timesheet.overtimePay?.toFixed(2) || '0.00',
      'Total Pay': timesheet.totalPay?.toFixed(2) || '0.00',
      'Status': timesheet.status,
      'Description': timesheet.description || '',
      'Submitted Date': timesheet.submittedAt ? format(new Date(timesheet.submittedAt), 'yyyy-MM-dd HH:mm:ss') : '',
      'Approved Date': timesheet.approvedAt ? format(new Date(timesheet.approvedAt), 'yyyy-MM-dd HH:mm:ss') : '',
      'Approved By': timesheet.approvedBy?.name || '',
      'Rejection Reason': timesheet.rejectionReason || '',
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-fit columns
    const range = XLSX.utils.decode_range(worksheet['!ref'] || '');
    const columnWidths = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxWidth = 0;
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          const cellLength = cell.v.toString().length;
          maxWidth = Math.max(maxWidth, cellLength);
        }
      }
      columnWidths.push({ width: Math.min(maxWidth + 2, 50) });
    }
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Timesheets');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    // Create filename with current date
    const filename = `SFG_Timesheets_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting timesheets:', error);
    return NextResponse.json(
      { error: 'Failed to export timesheets' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
