
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { Navigation } from '@/components/navigation';
import { PayrollApp } from '@/components/payroll-app';

const prisma = new PrismaClient();

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Fetch employees and timesheets
  const [employees, timesheets] = await Promise.all([
    prisma.employee.findMany({
      where: { isActive: true },
      orderBy: { employeeNumber: 'asc' },
    }),
    prisma.timesheet.findMany({
      include: {
        employee: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit for performance
    }),
  ]);

  await prisma.$disconnect();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 transition-colors duration-300">
      <Navigation 
        user={session.user} 
        userRole={(session.user as any)?.role || 'employee'} 
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:ml-64 transition-all duration-300">
        <PayrollApp 
          employees={employees}
          timesheets={timesheets}
          userRole={(session.user as any)?.role || 'employee'}
        />
      </main>
    </div>
  );
}
