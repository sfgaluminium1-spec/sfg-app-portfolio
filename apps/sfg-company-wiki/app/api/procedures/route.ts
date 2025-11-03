
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET - Fetch procedures with filtering and search
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const categoryId = searchParams.get("categoryId")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: any = {
      isLatestVersion: true,
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { summary: { contains: query, mode: "insensitive" } },
        { tags: { has: query } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    const procedures = await prisma.procedure.findMany({
      where,
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        conflicts: {
          where: {
            status: "DETECTED",
          },
        },
        _count: {
          select: {
            crossReferences: true,
            referencedIn: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.procedure.count({ where })

    return NextResponse.json({
      procedures,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching procedures:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new procedure
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const {
      title,
      content,
      summary,
      categoryId,
      tags,
      priority,
      formulas,
      thresholds,
      dependencies,
      approvalLevel,
      effectiveDate,
      expirationDate,
    } = data

    const procedure = await prisma.procedure.create({
      data: {
        title,
        content,
        summary,
        categoryId,
        tags: tags || [],
        priority: priority || "MEDIUM",
        formulas: formulas || [],
        thresholds: thresholds ? JSON.parse(JSON.stringify(thresholds)) : null,
        dependencies: dependencies || [],
        approvalLevel: approvalLevel || "NONE",
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        createdById: session.user.id,
      },
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // Log the creation
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "procedure",
        entityId: procedure.id,
        newValues: JSON.parse(JSON.stringify(procedure)),
        description: `Created procedure: ${procedure.title}`,
        userId: session.user.id,
        procedureId: procedure.id,
      },
    })

    return NextResponse.json(procedure, { status: 201 })
  } catch (error) {
    console.error("Error creating procedure:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
