
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET - Fetch conflicts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (severity) {
      where.severity = severity
    }

    const conflicts = await prisma.conflictReport.findMany({
      where,
      include: {
        procedure: {
          include: {
            category: true,
          },
        },
        relatedProcedure: {
          include: {
            category: true,
          },
        },
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: [
        { severity: "desc" },
        { detectedAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.conflictReport.count({ where })

    return NextResponse.json({
      conflicts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching conflicts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Report new conflict
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const {
      title,
      description,
      conflictType,
      severity,
      procedureId,
      relatedProcedureId,
    } = data

    const conflict = await prisma.conflictReport.create({
      data: {
        title,
        description,
        conflictType,
        severity,
        procedureId,
        relatedProcedureId,
        reportedById: session.user.id,
      },
      include: {
        procedure: {
          include: {
            category: true,
          },
        },
        relatedProcedure: {
          include: {
            category: true,
          },
        },
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(conflict, { status: 201 })
  } catch (error) {
    console.error("Error reporting conflict:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
