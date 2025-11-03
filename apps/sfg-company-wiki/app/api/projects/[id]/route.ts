
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { validateRequiredFields, getStatusColor, canProgressToStatus } from '@/lib/sfg-config'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        productCountLogs: {
          include: {
            createdBy: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        deliveryNotes: {
          orderBy: { createdAt: 'desc' }
        },
        approvedDocuments: {
          include: {
            approvedBy: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { approvedAt: 'desc' }
        },
        projectAttachments: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { uploadedAt: 'desc' }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PATCH(
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

    const body = await request.json()
    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Handle status change
    if (body.status && body.status !== project.status) {
      const progressCheck = canProgressToStatus(project.status as any, {
        ...project,
        ...body,
        targetStatus: body.status
      })

      if (!progressCheck.allowed) {
        return NextResponse.json(
          { error: progressCheck.reason },
          { status: 400 }
        )
      }

      // Update timestamps based on status change
      const statusTimestamps: any = {}
      if (body.status === 'QUO' && !project.quoteDate) {
        statusTimestamps.quoteDate = new Date()
      } else if (body.status === 'ORD' && !project.orderDate) {
        statusTimestamps.orderDate = new Date()
      } else if (body.status === 'INV' && !project.invoiceDate) {
        statusTimestamps.invoiceDate = new Date()
      } else if (body.status === 'DEL' && !project.deliveryDate) {
        statusTimestamps.deliveryDate = new Date()
      } else if (body.status === 'PAID' && !project.paidDate) {
        statusTimestamps.paidDate = new Date()
        statusTimestamps.completedDate = new Date()
      }

      body.statusTimestamps = statusTimestamps
    }

    // Re-validate required fields
    const updatedData = { ...project, ...body }
    const validation = validateRequiredFields(updatedData)
    const finalStatus = body.status || (validation.isValid ? project.status : 'MISSING')
    const statusColor = getStatusColor(finalStatus as any)

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...body,
        ...(body.statusTimestamps || {}),
        status: finalStatus,
        statusColor: statusColor.name
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

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(
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

    if (!user || user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.project.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
