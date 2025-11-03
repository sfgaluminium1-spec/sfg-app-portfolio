
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { allocateBaseNumber } from '@/lib/base-number'
import { validateRequiredFields, getStatusColor } from '@/lib/sfg-config'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customer = searchParams.get('customer')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (customer) {
      where.customer = { contains: customer, mode: 'insensitive' }
    }
    
    if (search) {
      where.OR = [
        { baseNumber: { contains: search, mode: 'insensitive' } },
        { customer: { contains: search, mode: 'insensitive' } },
        { project: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { productType: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              productCountLogs: true,
              deliveryNotes: true,
              approvedDocuments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.project.count({ where })
    ])

    return NextResponse.json({
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    // Allocate BaseNumber (immutable)
    const baseNumber = await allocateBaseNumber()

    // Determine initial status
    const validation = validateRequiredFields({ ...body, baseNumber })
    const status = validation.isValid ? 'ENQ' : 'MISSING'
    const statusColor = getStatusColor(status)

    // Create project
    const project = await prisma.project.create({
      data: {
        baseNumber,
        prefix: 'ENQ',
        customer: body.customer || null,
        project: body.project || null,
        location: body.location || null,
        productType: body.productType || null,
        deliveryType: body.deliveryType || null,
        customerOrderNumber: body.customerOrderNumber || null,
        enquiryInitialCount: body.enquiryInitialCount ? parseInt(body.enquiryInitialCount) : null,
        currentProductCount: body.enquiryInitialCount ? parseInt(body.enquiryInitialCount) : null,
        status,
        statusColor: statusColor.name,
        notes: body.notes || null,
        tags: body.tags || [],
        priority: body.priority || 'MEDIUM',
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

    // Create initial product count log if count provided
    if (body.enquiryInitialCount) {
      await prisma.productCountLog.create({
        data: {
          projectId: project.id,
          source: 'ENQ',
          newCount: parseInt(body.enquiryInitialCount),
          delta: parseInt(body.enquiryInitialCount),
          note: 'Initial enquiry count',
          createdById: user.id
        }
      })
    }

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
