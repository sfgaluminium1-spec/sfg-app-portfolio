
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock audit logs for CSV export
    const auditLogs = [
      {
        timestamp: new Date().toISOString(),
        userId: session.user.id,
        userName: session.user.name || 'Admin',
        action: 'LOGIN_SUCCESS',
        details: 'User logged in successfully',
        ipAddress: '192.168.1.100',
        success: true
      },
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: 'user-123',
        userName: 'John Doe',
        action: 'TIMESHEET_SUBMITTED',
        details: 'Weekly timesheet submitted for approval',
        ipAddress: '192.168.1.101',
        success: true
      }
    ];

    // Generate CSV content
    const csvHeaders = ['Timestamp', 'User ID', 'User Name', 'Action', 'Details', 'IP Address', 'Success'];
    const csvRows = auditLogs.map(log => [
      log.timestamp,
      log.userId,
      log.userName,
      log.action,
      log.details,
      log.ipAddress,
      log.success.toString()
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    );
  }
}
