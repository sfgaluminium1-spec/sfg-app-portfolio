
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface TimesheetSyncRequest {
  externalAppId: string
  timesheetData: {
    employeeId: string
    date: string
    clockIn: string
    clockOut: string
    breakDuration?: number
    location?: {
      latitude: number
      longitude: number
      address: string
    }
    projectCode?: string
    description?: string
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify integration permissions
    if (session.user.role !== 'ADMIN' && session.user.role !== 'HR') {
      return NextResponse.json({ error: 'Integration access denied' }, { status: 403 })
    }

    const syncRequest: TimesheetSyncRequest = await request.json()

    // Validate external app
    const isValidApp = await validateExternalApp(syncRequest.externalAppId)
    if (!isValidApp) {
      return NextResponse.json({ error: 'Invalid external application' }, { status: 400 })
    }

    const results = []
    
    for (const timesheetEntry of syncRequest.timesheetData) {
      try {
        // Find user by employee number
        const employee = await prisma.employee.findUnique({
          where: { employeeNumber: timesheetEntry.employeeId },
          include: { user: true }
        })
        
        const user = employee?.user

        if (!user) {
          results.push({
            employeeId: timesheetEntry.employeeId,
            status: 'error',
            message: 'Employee not found'
          })
          continue
        }

        // Calculate hours
        const startTime = timesheetEntry.clockIn
        const endTime = timesheetEntry.clockOut
        const breakMinutes = timesheetEntry.breakDuration || 30

        // Parse time strings to calculate hours
        const [startHour, startMin] = startTime.split(':').map(Number)
        const [endHour, endMin] = endTime.split(':').map(Number)
        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin
        const totalMinutes = endMinutes - startMinutes - breakMinutes
        const totalHours = totalMinutes / 60

        // Calculate regular vs overtime
        const standardHours = 8.5 // SFG standard day
        const regularHours = Math.min(totalHours, standardHours)
        const overtimeHours = Math.max(0, totalHours - standardHours)

        // Create timesheet (no upsert since we don't have a unique constraint)
        const timesheet = await prisma.timesheet.create({
          data: {
            employeeId: employee.id,
            workDate: new Date(timesheetEntry.date),
            startTime: startTime,
            endTime: endTime,
            breakMinutes: breakMinutes,
            regularHours: regularHours,
            overtimeHours: overtimeHours,
            totalHours: totalHours,
            clockInLocation: timesheetEntry.location || undefined,
            description: timesheetEntry.description,
            status: 'DRAFT',
            createdById: user.id
          }
        })

        results.push({
          employeeId: timesheetEntry.employeeId,
          timesheetId: timesheet.id,
          status: 'success',
          regularHours: regularHours,
          overtimeHours: overtimeHours
        })

        // Log integration activity
        await logIntegrationActivity(
          syncRequest.externalAppId,
          'timesheet_sync',
          user.id,
          timesheet.id
        )

      } catch (error) {
        console.error(`Timesheet sync error for employee ${timesheetEntry.employeeId}:`, error)
        results.push({
          employeeId: timesheetEntry.employeeId,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      syncedCount: results.filter(r => r.status === 'success').length,
      errorCount: results.filter(r => r.status === 'error').length,
      results
    })

  } catch (error) {
    console.error('Timesheet sync API error:', error)
    return NextResponse.json(
      { error: 'Failed to sync timesheet data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const employeeId = searchParams.get('employeeId')

    const whereCondition: any = {}

    if (startDate && endDate) {
      whereCondition.workDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    if (employeeId) {
      const employee = await prisma.employee.findUnique({
        where: { employeeNumber: employeeId },
        include: { user: true }
      })
      if (employee) {
        whereCondition.employeeId = employee.id
      }
    }

    const timesheets = await prisma.timesheet.findMany({
      where: whereCondition,
      include: {
        employee: {
          select: {
            employeeNumber: true,
            firstName: true,
            lastName: true,
            department: true,
            role: true
          }
        }
      },
      orderBy: [
        { workDate: 'desc' },
        { employee: { firstName: 'asc' } }
      ]
    })

    const formattedData = timesheets.map(timesheet => ({
      employeeId: timesheet.employee.employeeNumber,
      employeeName: `${timesheet.employee.firstName} ${timesheet.employee.lastName}`,
      department: timesheet.employee.department,
      role: timesheet.employee.role,
      date: timesheet.workDate.toISOString().split('T')[0],
      clockIn: timesheet.startTime,
      clockOut: timesheet.endTime,
      breakDuration: timesheet.breakMinutes,
      regularHours: timesheet.regularHours,
      overtimeHours: timesheet.overtimeHours,
      totalHours: timesheet.totalHours,
      location: timesheet.clockInLocation || null,
      description: timesheet.description,
      status: timesheet.status
    }))

    return NextResponse.json({
      success: true,
      recordCount: formattedData.length,
      data: formattedData
    })

  } catch (error) {
    console.error('Timesheet data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timesheet data' },
      { status: 500 }
    )
  }
}

async function validateExternalApp(appId: string): Promise<boolean> {
  // In production, validate against registered external apps
  // For now, accept any non-empty app ID
  return Boolean(appId && appId.length > 0)
}

async function logIntegrationActivity(
  appId: string,
  action: string,
  userId: string,
  resourceId: string
) {
  try {
    // In production, log to audit table or external monitoring service
    console.log(`Integration Activity: ${appId} performed ${action} on resource ${resourceId} for user ${userId}`)
  } catch (error) {
    console.error('Failed to log integration activity:', error)
  }
}
