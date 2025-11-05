
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock audit logs data (in real app, this would come from database)
    const auditLogs = [
      {
        id: '1',
        userId: session.user.id,
        userName: session.user.name || 'Admin',
        action: 'LOGIN_SUCCESS',
        details: 'User logged in successfully',
        ipAddress: '192.168.1.100',
        timestamp: new Date().toISOString(),
        success: true
      },
      {
        id: '2',
        userId: 'user-123',
        userName: 'John Doe',
        action: 'TIMESHEET_SUBMITTED',
        details: 'Weekly timesheet submitted for approval',
        ipAddress: '192.168.1.101',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        success: true
      },
      {
        id: '3',
        userId: 'user-456',
        userName: 'Jane Smith',
        action: 'LOGIN_FAILED',
        details: 'Failed login attempt - invalid password',
        ipAddress: '192.168.1.102',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        success: false
      },
      {
        id: '4',
        userId: session.user.id,
        userName: session.user.name || 'Admin',
        action: 'USER_CREATED',
        details: 'New employee account created',
        ipAddress: '192.168.1.100',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        success: true
      },
      {
        id: '5',
        userId: 'supervisor-789',
        userName: 'Mike Johnson',
        action: 'TIMESHEET_APPROVED',
        details: 'Timesheet approved for John Doe',
        ipAddress: '192.168.1.103',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        success: true
      }
    ];

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
