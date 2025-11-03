
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const body = await request.json()
    const oldCount = project.currentProductCount || 0
    const newCount = parseInt(body.newCount)
    const delta = newCount - oldCount

    // Create product count log
    const log = await prisma.productCountLog.create({
      data: {
        projectId: project.id,
        source: body.source || 'Manual',
        oldCount,
        newCount,
        delta,
        additions: body.additions || [],
        removals: body.removals || [],
        extras: body.extras || [],
        note: body.note || null,
        pricingStatus: body.pricingStatus || 'Pricing Needed',
        createdById: user.id
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // Update project's current product count
    await prisma.project.update({
      where: { id: project.id },
      data: {
        currentProductCount: newCount
      }
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Error updating product count:', error)
    return NextResponse.json({ error: 'Failed to update product count' }, { status: 500 })
  }
}
