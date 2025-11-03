
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      total,
      statusCounts,
      recentProjects,
      pendingProductCounts,
      missingFields
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.groupBy({
        by: ['status'],
        _count: true
      }),
      prisma.project.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }),
      prisma.productCountLog.count({
        where: {
          OR: [
            { estimatorSignoff: false },
            { financeAcknowledged: false }
          ]
        }
      }),
      prisma.project.count({
        where: {
          status: 'MISSING'
        }
      })
    ])

    const stats = {
      total,
      byStatus: statusCounts.reduce((acc: any, item: any) => {
        acc[item.status] = item._count
        return acc
      }, {}),
      recentProjects,
      pendingProductCounts,
      missingFields
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching project stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
