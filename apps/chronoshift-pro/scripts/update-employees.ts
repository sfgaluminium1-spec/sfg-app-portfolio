
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  hourlyRate: number;
  weeklyHours: number;
  isManager: boolean;
  isActive: boolean;
}

const employeeData: EmployeeData[] = [
  // New Employee
  {
    firstName: "Chris",
    lastName: "Bulmer", 
    email: "chris.bulmer@sfg-aluminium.co.uk",
    role: "Business Development / Direct Sales",
    department: "Management",
    hourlyRate: 18.00,
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  // Existing Employees with Updated Roles
  {
    firstName: "Yanika",
    lastName: "Heathcote",
    email: "yanika@sfg-aluminium.co.uk",
    role: "Director",
    department: "Management", 
    hourlyRate: 25.00, // Estimated director rate
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  {
    firstName: "Antonee",
    lastName: "Heathcote",
    email: "antonee07@gmail.com",
    role: "Marketing",
    department: "Marketing",
    hourlyRate: 15.00, // From payroll documentation
    weeklyHours: 42.5,
    isManager: false,
    isActive: true
  },
  
  {
    firstName: "Darren", 
    lastName: "Newbury",
    email: "darren.newbury44@gmail.com",
    phone: "",
    role: "Site Surveyor",
    department: "Operations",
    hourlyRate: 15.00,
    weeklyHours: 42.5,
    isManager: false,
    isActive: true
  },
  
  {
    firstName: "Gary",
    lastName: "Spencer",
    email: "godfather735@gmail.com", 
    role: "Installations Team Leader",
    department: "Installations",
    hourlyRate: 16.50,
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  {
    firstName: "Katarzyna",
    lastName: "Marzec",
    email: "Kiwaniak87@gmail.com",
    role: "Office Admin",
    department: "Administration",
    hourlyRate: 12.50,
    weeklyHours: 42.5,
    isManager: false,
    isActive: true
  },
  
  {
    firstName: "Liam",
    lastName: "Greenough", 
    email: "greenoughl33@icloud.com",
    phone: "07404171766",
    role: "Installations Team Member",
    department: "Installations",
    hourlyRate: 14.50,
    weeklyHours: 42.5,
    isManager: false,
    isActive: true
  },
  
  {
    firstName: "Lukasz",
    lastName: "Topolski",
    email: "l.topolski1987@gmail.com",
    role: "Factory Operative / Powder Coating and Sheet Metal Manufacture",
    department: "Factory",
    hourlyRate: 13.50,
    weeklyHours: 42.5,
    isManager: false,
    isActive: true
  },
  
  {
    firstName: "Lukasz",
    lastName: "Wisniowski",
    email: "Lwsn33@gmail.com",
    phone: "07955647344",
    role: "Aluminium Fabricator Team Leader",
    department: "Fabrication", 
    hourlyRate: 16.50,
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  {
    firstName: "Mariusz",
    lastName: "Koszla",
    email: "mariuszkoszla84@gmail.com",
    phone: "07851329792",
    role: "Factory Operative / Powder Coating and Sheet Metal Manufacture",
    department: "Factory",
    hourlyRate: 13.50,
    weeklyHours: 42.5,
    isManager: false,
    isActive: true
  },
  
  {
    firstName: "Martin",
    lastName: "Greenough",
    email: "martingreenough68@gmail.com",
    role: "Installations Team Leader",
    department: "Installations",
    hourlyRate: 16.50,
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  {
    firstName: "Matthew",
    lastName: "Connor",
    email: "mattconnor68@gmail.com",
    phone: "07904164997",
    role: "Production Manager / Customer Communications",
    department: "Production",
    hourlyRate: 18.50,
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  {
    firstName: "Michael",
    lastName: "Viljoen",
    email: "michaeldviljoen85@hotmail.com",
    role: "Installation Manager / Customer Communications", 
    department: "Installations",
    hourlyRate: 18.50,
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  {
    firstName: "Mikenzie",
    lastName: "Lewis",
    email: "lewiskenzie02@gmail.com",
    role: "Accounts Admin / Book Keeper",
    department: "Accounts",
    hourlyRate: 13.50,
    weeklyHours: 42.5,
    isManager: false,
    isActive: true
  },
  
  {
    firstName: "Mohammed",
    lastName: "Khan",
    email: "abdullahyarkhan@hotmail.com",
    role: "Estimation All Projects",
    department: "Estimation",
    hourlyRate: 16.00,
    weeklyHours: 42.5,
    isManager: false,
    isActive: true
  },
  
  {
    firstName: "Paul",
    lastName: "Farrell",
    email: "farrellp92@yahoo.co.uk",
    role: "Aluminium Fabricator Team Leader",
    department: "Fabrication",
    hourlyRate: 16.50,
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  {
    firstName: "Pawel",
    lastName: "Marzec",
    email: "pawelmarzec1@gmail.com",
    role: "General Manager / Except Accounts",
    department: "Management",
    hourlyRate: 22.00,
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  {
    firstName: "Rafal",
    lastName: "Wisniowski",
    email: "Gosc001@sky.com",
    role: "Aluminium Fabricator Team Leader",
    department: "Fabrication",
    hourlyRate: 16.50,
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  {
    firstName: "Rafal",
    lastName: "Zwarycz",
    email: "Rafal.zwarycz@gmail.com",
    role: "Design Office CAD Drawing / Customer Contact and Drawing Approvals",
    department: "Design",
    hourlyRate: 17.50,
    weeklyHours: 42.5,
    isManager: false,
    isActive: true
  },
  
  {
    firstName: "Warren",
    lastName: "Heathcote",
    email: "warren@sfg-aluminium.co.uk",
    phone: "07787631861",
    role: "Operations Manager & Technical Advisor",
    department: "Management", 
    hourlyRate: 24.00,
    weeklyHours: 42.5,
    isManager: true,
    isActive: true
  },
  
  {
    firstName: "Wayne",
    lastName: "Spencer",
    email: "Waynespencer7@outlook.com",
    role: "Installations Team Member",
    department: "Installations",
    hourlyRate: 14.50,
    weeklyHours: 42.5,
    isManager: false,
    isActive: true
  }
];

async function updateEmployees() {
  console.log('🚀 Starting employee database update...');
  
  try {
    // Create or update each employee
    for (const employee of employeeData) {
      const employeeNumber = `SFG${employee.lastName.substring(0,3).toUpperCase()}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
      
      const result = await prisma.employee.upsert({
        where: { email: employee.email },
        update: {
          firstName: employee.firstName,
          lastName: employee.lastName,
          phone: employee.phone,
          role: employee.role,
          department: employee.department,
          hourlyRate: employee.hourlyRate,
          weeklyHours: employee.weeklyHours,
          isManager: employee.isManager,
          isActive: employee.isActive,
        },
        create: {
          employeeNumber,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          role: employee.role,
          department: employee.department,
          hourlyRate: employee.hourlyRate,
          weeklyHours: employee.weeklyHours,
          isManager: employee.isManager,
          isActive: employee.isActive,
          startDate: new Date(),
        },
      });
      
      console.log(`✅ Updated/Created: ${employee.firstName} ${employee.lastName} - ${employee.role}`);
    }
    
    // Get final employee count
    const totalEmployees = await prisma.employee.count({ where: { isActive: true } });
    console.log(`\n🎉 Employee update complete! Total active employees: ${totalEmployees}`);
    
    // Display department summary
    const departments = await prisma.employee.groupBy({
      by: ['department'],
      where: { isActive: true },
      _count: { department: true },
    });
    
    console.log('\n📊 Department Summary:');
    departments.forEach(dept => {
      console.log(`   ${dept.department}: ${dept._count.department} employees`);
    });
    
  } catch (error) {
    console.error('❌ Error updating employees:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  updateEmployees()
    .then(() => {
      console.log('✅ Employee update script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Employee update script failed:', error);
      process.exit(1);
    });
}

export { updateEmployees, employeeData };
