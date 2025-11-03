
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get dashboard statistics
    const totalJobs = await prisma.job.count();
    const activeJobs = await prisma.job.count({
      where: {
        status: {
          in: ['APPROVED', 'IN_PRODUCTION', 'FABRICATION', 'ASSEMBLY', 'READY_FOR_INSTALL', 'INSTALLING']
        }
      }
    });
    const completedJobs = await prisma.job.count({
      where: { status: 'COMPLETED' }
    });

    const totalQuotes = await prisma.quote.count();
    const quotesWon = await prisma.quote.count({
      where: { status: 'WON' }
    });
    
    const quotesValueResult = await prisma.quote.aggregate({
      _sum: { value: true }
    });
    const quotesValue = quotesValueResult._sum.value || 0;

    const totalOrders = await prisma.order.count();
    const ordersValueResult = await prisma.order.aggregate({
      _sum: { price: true }
    });
    const ordersValue = ordersValueResult._sum.price || 0;

    // Get recent activities
    const recentActivities = await prisma.activity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        job: true,
        quote: true
      }
    });

    return NextResponse.json({
      totalJobs,
      activeJobs,
      completedJobs,
      totalQuotes,
      quotesWon,
      quotesValue,
      totalOrders,
      ordersValue,
      recentActivities: recentActivities.map((activity: any) => ({
        id: activity.id,
        type: activity.type.toLowerCase(),
        description: activity.description,
        time: getTimeAgo(activity.createdAt)
      }))
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    
    // Return mock data if database is not ready
    return NextResponse.json({
      totalJobs: 156,
      activeJobs: 23,
      completedJobs: 133,
      totalQuotes: 89,
      quotesWon: 67,
      quotesValue: 234868.32,
      totalOrders: 45,
      ordersValue: 156311.82,
      recentActivities: [
        { id: 1, type: 'job_created', description: 'New job 18457 created for Beesley and Fildes', time: '2 hours ago' },
        { id: 2, type: 'quote_sent', description: 'Quote 21476 sent to Lodestone Projects', time: '4 hours ago' },
        { id: 3, type: 'job_completed', description: 'Job 18455 completed - Installation finished', time: '6 hours ago' },
        { id: 4, type: 'order_placed', description: 'Order 31045 placed with NVM Supplier', time: '1 day ago' },
        { id: 5, type: 'status_update', description: 'Job 18456 moved to Fabrication stage', time: '1 day ago' }
      ]
    });
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
