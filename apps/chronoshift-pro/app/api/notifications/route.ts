
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true';

    // Mock notifications data
    const mockNotifications = [
      {
        id: '1',
        type: 'timesheet_approved',
        title: 'Timesheet Approved',
        message: 'Your timesheet for December 9 has been approved',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        actionUrl: '/employee/timesheets/1',
        priority: 'normal'
      },
      {
        id: '2',
        type: 'expense_rejected',
        title: 'Expense Claim Rejected',
        message: 'Your expense claim for £45.50 needs additional documentation',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        actionUrl: '/employee/expenses/2',
        priority: 'high'
      },
      {
        id: '3',
        type: 'holiday_approved',
        title: 'Holiday Approved',
        message: 'Your holiday request for Dec 23-27 has been approved',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        actionUrl: '/employee/holidays/3',
        priority: 'normal'
      },
      {
        id: '4',
        type: 'system_update',
        title: 'System Update',
        message: 'SFG Payroll System has been updated to version 2.1.3',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        actionUrl: null,
        priority: 'low'
      },
    ];

    // Filter notifications
    let notifications = mockNotifications;
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.isRead);
    }

    // Apply limit
    notifications = notifications.slice(0, limit);

    return NextResponse.json({
      notifications,
      unreadCount: mockNotifications.filter(n => !n.isRead).length,
      total: mockNotifications.length
    });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, title, message, priority = 'normal', actionUrl } = await request.json();

    // Validate required fields
    if (!type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new notification
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
      actionUrl,
      priority,
      userId: session.user.id,
    };

    // In a real app, save to database
    // await prisma.notification.create({ data: notification });

    // Send push notification if user has subscribed
    await sendPushNotification(notification);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationIds, action } = await request.json();

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ error: 'Invalid notification IDs' }, { status: 400 });
    }

    switch (action) {
      case 'mark_read':
        // In a real app, update database
        // await prisma.notification.updateMany({
        //   where: { id: { in: notificationIds }, userId: session.user.id },
        //   data: { isRead: true }
        // });
        break;
      
      case 'mark_unread':
        // In a real app, update database
        // await prisma.notification.updateMany({
        //   where: { id: { in: notificationIds }, userId: session.user.id },
        //   data: { isRead: false }
        // });
        break;
      
      case 'delete':
        // In a real app, delete from database
        // await prisma.notification.deleteMany({
        //   where: { id: { in: notificationIds }, userId: session.user.id }
        // });
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function sendPushNotification(notification: any) {
  try {
    // In a real app, send push notification using web push protocol
    console.log('Push notification sent:', notification.title);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}
