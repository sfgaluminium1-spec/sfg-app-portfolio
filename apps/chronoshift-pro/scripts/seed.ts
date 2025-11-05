
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test users
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  const hashedManagerPassword = await bcrypt.hash('sfgmanager123', 12);

  // Create manager user (test account - hidden from user)
  const manager = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Manager',
      password: hashedPassword,
      role: 'manager',
    },
  });

  // Create employee user
  const employee = await prisma.user.upsert({
    where: { email: 'employee@sfgaluminium.com' },
    update: {},
    create: {
      email: 'employee@sfgaluminium.com',
      name: 'Jane Employee',
      password: hashedManagerPassword,
      role: 'employee',
    },
  });

  console.log('✅ Users created');

  // Create SFG employees with realistic data
  const employees = [
    {
      employeeNumber: 'SFG001',
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@sfgaluminium.com',
      department: 'Production',
      position: 'Welder',
      hourlyRate: 28.50,
    },
    {
      employeeNumber: 'SFG002',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@sfgaluminium.com',
      department: 'Production',
      position: 'Machine Operator',
      hourlyRate: 26.75,
    },
    {
      employeeNumber: 'SFG003',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@sfgaluminium.com',
      department: 'Quality Control',
      position: 'Inspector',
      hourlyRate: 30.00,
    },
    {
      employeeNumber: 'SFG004',
      firstName: 'Jennifer',
      lastName: 'Davis',
      email: 'jennifer.davis@sfgaluminium.com',
      department: 'Maintenance',
      position: 'Technician',
      hourlyRate: 32.25,
    },
    {
      employeeNumber: 'SFG005',
      firstName: 'Robert',
      lastName: 'Miller',
      email: 'robert.miller@sfgaluminium.com',
      department: 'Production',
      position: 'Supervisor',
      hourlyRate: 35.50,
    },
    {
      employeeNumber: 'SFG006',
      firstName: 'Lisa',
      lastName: 'Wilson',
      email: 'lisa.wilson@sfgaluminium.com',
      department: 'Shipping',
      position: 'Forklift Operator',
      hourlyRate: 24.00,
    },
    {
      employeeNumber: 'SFG007',
      firstName: 'James',
      lastName: 'Taylor',
      email: 'james.taylor@sfgaluminium.com',
      department: 'Production',
      position: 'Fabricator',
      hourlyRate: 29.25,
    },
    {
      employeeNumber: 'SFG008',
      firstName: 'Amanda',
      lastName: 'Anderson',
      email: 'amanda.anderson@sfgaluminium.com',
      department: 'Administration',
      position: 'Office Assistant',
      hourlyRate: 22.50,
    },
    {
      employeeNumber: 'SFG009',
      firstName: 'Christopher',
      lastName: 'Martinez',
      email: 'christopher.martinez@sfgaluminium.com',
      department: 'Maintenance',
      position: 'Electrician',
      hourlyRate: 34.75,
    },
    {
      employeeNumber: 'SFG010',
      firstName: 'Michelle',
      lastName: 'Garcia',
      email: 'michelle.garcia@sfgaluminium.com',
      department: 'Quality Control',
      position: 'Quality Assurance Lead',
      hourlyRate: 33.00,
    },
  ];

  // Create employees
  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { employeeNumber: emp.employeeNumber },
      update: emp,
      create: emp,
    });
  }

  console.log('✅ SFG employees created');

  // Create sample timesheets with various scenarios
  const sampleTimesheets = [
    {
      employeeNumber: 'SFG001',
      workDate: new Date('2024-01-15'),
      startTime: '08:00',
      endTime: '17:00',
      description: 'Regular welding shift',
      status: 'APPROVED',
    },
    {
      employeeNumber: 'SFG002',
      workDate: new Date('2024-01-15'),
      startTime: '06:00',
      endTime: '16:30',
      description: 'Early shift machine operations',
      status: 'APPROVED',
    },
    {
      employeeNumber: 'SFG001',
      workDate: new Date('2024-01-16'),
      startTime: '22:00',
      endTime: '07:00',
      description: 'Night shift welding - maintenance work',
      status: 'SUBMITTED',
    },
    {
      employeeNumber: 'SFG003',
      workDate: new Date('2024-01-13'), // Saturday
      startTime: '09:00',
      endTime: '15:00',
      description: 'Weekend quality inspection',
      status: 'APPROVED',
    },
    {
      employeeNumber: 'SFG005',
      workDate: new Date('2024-01-17'),
      startTime: '07:00',
      endTime: '19:00',
      description: 'Extended shift supervision',
      status: 'DRAFT',
    },
  ];

  // Get employees for timesheet creation
  const allEmployees = await prisma.employee.findMany();
  
  for (const ts of sampleTimesheets) {
    const employee = allEmployees.find(e => e.employeeNumber === ts.employeeNumber);
    if (!employee) continue;

    // Calculate payroll data (simplified for seed)
    const startHour = parseInt(ts.startTime.split(':')[0]);
    const endHour = parseInt(ts.endTime.split(':')[0]);
    const totalHours = endHour >= startHour ? endHour - startHour - 0.5 : (24 - startHour + endHour) - 0.5;
    
    const isWeekend = ts.workDate.getDay() === 0 || ts.workDate.getDay() === 6;
    const regularHours = isWeekend ? 0 : Math.min(totalHours, 8.5);
    const overtimeHours = totalHours - regularHours;
    
    const regularPay = regularHours * employee.hourlyRate;
    const overtimePay = overtimeHours * employee.hourlyRate * 1.5;
    
    await prisma.timesheet.upsert({
      where: {
        employeeId_workDate: {
          employeeId: employee.id,
          workDate: ts.workDate,
        }
      },
      update: {},
      create: {
        employeeId: employee.id,
        workDate: ts.workDate,
        startTime: ts.startTime,
        endTime: ts.endTime,
        description: ts.description,
        status: ts.status as any,
        submittedAt: ts.status === 'SUBMITTED' ? new Date() : null,
        approvedAt: ts.status === 'APPROVED' ? new Date() : null,
        approvedById: ts.status === 'APPROVED' ? manager.id : null,
        createdById: manager.id,
        regularHours,
        overtimeHours,
        totalHours,
        regularPay,
        overtimePay,
        totalPay: regularPay + overtimePay,
        breakMinutes: 30,
      },
    });
  }

  console.log('✅ Sample timesheets created');
  console.log('🎉 Database seed completed successfully!');
  console.log('');
  console.log('Test Accounts Created:');
  console.log('Manager: manager@sfgaluminium.com / sfgmanager123');
  console.log('Employee: employee@sfgaluminium.com / sfgmanager123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
