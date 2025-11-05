
import { NextRequest, NextResponse } from 'next/server';
import { getAllActiveEmployees, getEmployeesByDepartment, getDepartments } from '@/lib/employee-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const department = url.searchParams.get('department');
    
    if (department) {
      const employees = getEmployeesByDepartment(department);
      return NextResponse.json(employees);
    }
    
    const employees = getAllActiveEmployees();
    
    // Transform for API compatibility
    const transformedEmployees = employees.map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      employeeNumber: emp.employeeNumber,
      department: emp.department,
      hourlyRate: emp.hourlyRate,
      email: emp.email,
      role: emp.role,
      status: emp.status === 'active' ? 'Active' : 'Inactive',
      phone: emp.phone,
      standardHours: emp.standardHours,
      startDate: emp.startDate,
      firstName: emp.firstName,
      lastName: emp.lastName
    }));

    return NextResponse.json(transformedEmployees);
  } catch (error) {
    console.error('Employees API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const employeeData = await request.json();
    
    // In production, this would create a new employee in the database
    console.log('New employee data:', employeeData);
    
    // For now, return success
    return NextResponse.json({ 
      message: 'Employee created successfully',
      employeeId: `EMP${Date.now()}`
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create employee error:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
