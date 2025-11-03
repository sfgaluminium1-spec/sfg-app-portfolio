
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Eye,
  UserCheck,
  UserX,
  Building2
} from 'lucide-react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { formatCurrency } from '@/lib/currency-utils';

interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  position?: string;
  hourlyRate: number;
  weeklyHours: number;
  isManager: boolean;
  isActive: boolean;
  startDate: string;
  totalHoursThisMonth?: number;
  totalPayThisMonth?: number;
}

export default function AdminEmployeesPage() {
  const { data: session } = useSession() || {};
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        employeeNumber: 'SFG001',
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@sfgaluminium.com',
        phone: '07123 456789',
        department: 'Production',
        role: 'Welder',
        position: 'Senior Welder',
        hourlyRate: 28.50,
        weeklyHours: 42.5,
        isManager: false,
        isActive: true,
        startDate: '2023-01-15',
        totalHoursThisMonth: 168,
        totalPayThisMonth: 4788.00
      },
      {
        id: '2',
        employeeNumber: 'SFG002',
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.williams@sfgaluminium.com',
        phone: '07987 654321',
        department: 'Production',
        role: 'Machine Operator',
        hourlyRate: 26.75,
        weeklyHours: 42.5,
        isManager: false,
        isActive: true,
        startDate: '2023-03-01',
        totalHoursThisMonth: 165,
        totalPayThisMonth: 4413.75
      },
      {
        id: '3',
        employeeNumber: 'SFG003',
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@sfgaluminium.com',
        phone: '07456 789123',
        department: 'Quality Control',
        role: 'Inspector',
        hourlyRate: 30.00,
        weeklyHours: 40.0,
        isManager: false,
        isActive: true,
        startDate: '2022-08-10',
        totalHoursThisMonth: 160,
        totalPayThisMonth: 4800.00
      },
      {
        id: '4',
        employeeNumber: 'SFG004',
        firstName: 'Jennifer',
        lastName: 'Davis',
        email: 'jennifer.davis@sfgaluminium.com',
        phone: '07321 654987',
        department: 'Maintenance',
        role: 'Technician',
        hourlyRate: 32.25,
        weeklyHours: 42.5,
        isManager: false,
        isActive: true,
        startDate: '2022-11-20',
        totalHoursThisMonth: 170,
        totalPayThisMonth: 5482.50
      },
      {
        id: '5',
        employeeNumber: 'SFG005',
        firstName: 'Robert',
        lastName: 'Miller',
        email: 'robert.miller@sfgaluminium.com',
        phone: '07789 123456',
        department: 'Production',
        role: 'Supervisor',
        hourlyRate: 35.50,
        weeklyHours: 42.5,
        isManager: true,
        isActive: true,
        startDate: '2021-05-01',
        totalHoursThisMonth: 172,
        totalPayThisMonth: 6106.00
      },
      {
        id: '6',
        employeeNumber: 'SFG006',
        firstName: 'Lisa',
        lastName: 'Wilson',
        email: 'lisa.wilson@sfgaluminium.com',
        phone: '07654 321098',
        department: 'Shipping',
        role: 'Forklift Operator',
        hourlyRate: 24.00,
        weeklyHours: 42.5,
        isManager: false,
        isActive: true,
        startDate: '2023-06-15',
        totalHoursThisMonth: 155,
        totalPayThisMonth: 3720.00
      },
      {
        id: '7',
        employeeNumber: 'SFG007',
        firstName: 'James',
        lastName: 'Taylor',
        email: 'james.taylor@sfgaluminium.com',
        department: 'Administration',
        role: 'Office Assistant',
        hourlyRate: 22.00,
        weeklyHours: 37.5,
        isManager: false,
        isActive: false, // Inactive employee
        startDate: '2023-02-01',
        totalHoursThisMonth: 0,
        totalPayThisMonth: 0
      },
      {
        id: '8',
        employeeNumber: 'SFG008',
        firstName: 'Chris',
        lastName: 'Bulmer',
        email: 'chris.bulmer@sfgaluminium.com',
        department: 'Sales',
        role: 'Business Development',
        hourlyRate: 18.00,
        weeklyHours: 42.5,
        isManager: false,
        isActive: true,
        startDate: '2025-09-01', // New starter
        totalHoursThisMonth: 42,
        totalPayThisMonth: 756.00
      }
    ];

    setEmployees(mockEmployees);
    setLoading(false);
  }, []);

  if (!session) {
    redirect('/login');
  }

  // Check if user has admin role
  const userRole = session?.user?.email === 'warren@sfg-aluminium.co.uk' ? 'admin' : 'employee';
  if (!userRole.includes('admin')) {
    redirect('/employee/dashboard');
  }

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && employee.isActive) ||
                         (statusFilter === 'inactive' && !employee.isActive) ||
                         (statusFilter === 'manager' && employee.isManager);
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(employees.map(emp => emp.department))];
  
  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.isActive).length,
    inactive: employees.filter(emp => !emp.isActive).length,
    managers: employees.filter(emp => emp.isManager).length,
    totalMonthlyPay: employees.reduce((sum, emp) => sum + (emp.totalPayThisMonth || 0), 0),
    totalMonthlyHours: employees.reduce((sum, emp) => sum + (emp.totalHoursThisMonth || 0), 0)
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Employee Management
                </h1>
                <p className="text-gray-600 dark:text-warren-gray-400">
                  Manage employee information, rates, and status
                </p>
              </div>
              <Button size="sm" className="warren-button-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Total</p>
                      <p className="text-2xl font-bold text-warren-blue-600">{stats.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-warren-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Active</p>
                      <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                    </div>
                    <UserCheck className="h-8 w-8 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Inactive</p>
                      <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                    </div>
                    <UserX className="h-8 w-8 text-red-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Managers</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.managers}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Monthly Hours</p>
                      <p className="text-2xl font-bold text-warren-blue-600">{stats.totalMonthlyHours}h</p>
                    </div>
                    <Calendar className="h-8 w-8 text-warren-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="warren-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400">Monthly Pay</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalMonthlyPay)}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 warren-input"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="rounded-md border border-gray-300 dark:border-warren-gray-600 bg-white dark:bg-warren-gray-800 px-3 py-2"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-gray-300 dark:border-warren-gray-600 bg-white dark:bg-warren-gray-800 px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="manager">Managers</option>
              </select>
            </div>
          </div>

          {/* Employees List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warren-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmployees.length === 0 ? (
                <Card className="warren-card">
                  <CardContent className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-warren-gray-400">
                      No employees found matching your criteria
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="warren-card hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-warren-blue-100 dark:bg-warren-blue-900/30 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-warren-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                              {employee.firstName} {employee.lastName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-warren-gray-400 mb-1">
                              {employee.employeeNumber} • {employee.role}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge className={
                                employee.isActive ? 'warren-badge-success' : 'warren-badge-secondary'
                              }>
                                {employee.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              {employee.isManager && (
                                <Badge className="warren-badge-primary">Manager</Badge>
                              )}
                              <Badge variant="outline">{employee.department}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{employee.email}</span>
                        </div>
                        {employee.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{employee.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Started {new Date(employee.startDate).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-warren-gray-800 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Hourly Rate:</span>
                            <p className="text-warren-blue-600 font-semibold">
                              {formatCurrency(employee.hourlyRate)}/hour
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Weekly Hours:</span>
                            <p>{employee.weeklyHours}h</p>
                          </div>
                          <div>
                            <span className="font-medium">Monthly Hours:</span>
                            <p>{employee.totalHoursThisMonth || 0}h</p>
                          </div>
                          <div>
                            <span className="font-medium">Monthly Pay:</span>
                            <p className="text-green-600 font-semibold">
                              {formatCurrency(employee.totalPayThisMonth || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
