
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get('type')
    const format = searchParams.get('format') || 'json'
    
    // Verify API access permissions
    const hasAPIAccess = await verifyAPIAccess(session.user.id, dataType)
    if (!hasAPIAccess) {
      return NextResponse.json({ error: 'API access denied' }, { status: 403 })
    }

    let data
    switch (dataType) {
      case 'employee-directory':
        data = await getEmployeeDirectory()
        break
      case 'timesheet-summary':
        data = await getTimesheetSummary()
        break
      case 'payroll-overview':
        data = await getPayrollOverview()
        break
      case 'department-structure':
        data = await getDepartmentStructure()
        break
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
    }

    // Format response
    if (format === 'csv') {
      const csvData = Array.isArray(data) ? data : [data]
      return new NextResponse(convertToCSV(csvData), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${dataType}.csv"`
        }
      })
    }

    return NextResponse.json({
      success: true,
      dataType,
      timestamp: new Date().toISOString(),
      recordCount: Array.isArray(data) ? data.length : 1,
      data
    })

  } catch (error) {
    console.error('HR data API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch HR data' },
      { status: 500 }
    )
  }
}

async function verifyAPIAccess(userId: string, dataType: string | null): Promise<boolean> {
  // In production, implement proper API access control
  // For now, allow access for admin and HR roles
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })
    
    return user?.role === 'ADMIN' || user?.role === 'HR'
  } catch {
    return false
  }
}

async function getEmployeeDirectory() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      employee: {
        select: {
          employeeNumber: true,
          firstName: true,
          lastName: true,
          department: true,
          position: true,
          hourlyRate: true,
          isActive: true,
          startDate: true
        }
      }
    }
  })
}

async function getTimesheetSummary() {
  const currentMonth = new Date()
  currentMonth.setDate(1)
  
  return await prisma.timesheet.groupBy({
    by: ['employeeId'],
    _count: {
      id: true
    },
    where: {
      workDate: {
        gte: currentMonth
      }
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    }
  })
}

async function getPayrollOverview() {
  const currentMonth = new Date()
  currentMonth.setDate(1)
  
  // Return mock data for now since payroll table structure may vary
  return {
    totalEmployees: 25,
    totalGrossPay: 45250.00,
    totalNetPay: 35100.00,
    totalDeductions: 10150.00,
    averageHoursWorked: 167.5,
    payPeriod: currentMonth.toISOString()
  }
}

async function getDepartmentStructure() {
  return await prisma.employee.groupBy({
    by: ['department', 'role'],
    _count: {
      id: true
    },
    where: {
      isActive: true
    },
    orderBy: {
      department: 'asc'
    }
  })
}

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      // Escape commas and quotes in CSV
      return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
        ? `"${value.replace(/"/g, '""')}"` 
        : value
    }).join(',')
  )
  
  return [csvHeaders, ...csvRows].join('\n')
}
