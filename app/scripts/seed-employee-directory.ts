
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const employees = [
  // Executive Team
  {
    name: 'James McKenzie',
    email: 'james.mckenzie@sfgaluminium.co.uk',
    role: 'Managing Director',
    department: 'Executive',
    canApproveQuotes: true,
    canApproveJobs: true,
    canOverrideApprovals: true,
    maxApprovalValue: 1000000.0,
    laborRate: 0.0, // Executive - no labor rate
    securityTier: 'TIER_1_EXECUTIVE',
    directReports: ['david.collins', 'sarah.thompson', 'michael.wright'],
    skills: ['Leadership', 'Strategic Planning', 'Business Development'],
    phone: '+44 1234 567801',
    emergencyContact: '+44 7700 900801'
  },
  {
    name: 'David Collins',
    email: 'david.collins@sfgaluminium.co.uk',
    role: 'Operations Director',
    department: 'Operations',
    canApproveQuotes: true,
    canApproveJobs: true,
    canOverrideApprovals: true,
    maxApprovalValue: 500000.0,
    laborRate: 0.0, // Management - no labor rate
    securityTier: 'TIER_2_SENIOR_MANAGEMENT',
    directReports: ['tom.harrison', 'lisa.wilson'],
    skills: ['Operations Management', 'Process Optimization', 'Quality Control'],
    phone: '+44 1234 567802',
    emergencyContact: '+44 7700 900802'
  },
  {
    name: 'Sarah Thompson',
    email: 'sarah.thompson@sfgaluminium.co.uk',
    role: 'Finance Director',
    department: 'Finance',
    canApproveQuotes: true,
    canApproveJobs: true,
    canOverrideApprovals: false,
    maxApprovalValue: 250000.0,
    laborRate: 0.0, // Management - no labor rate
    securityTier: 'TIER_2_SENIOR_MANAGEMENT',
    directReports: ['emma.clarke', 'robert.davies'],
    skills: ['Financial Management', 'Cost Analysis', 'Budget Planning'],
    phone: '+44 1234 567803',
    emergencyContact: '+44 7700 900803'
  },

  // Production & Installation Teams
  {
    name: 'Tom Harrison',
    email: 'tom.harrison@sfgaluminium.co.uk',
    role: 'Installation Team Leader',
    department: 'Installation',
    canApproveQuotes: false,
    canApproveJobs: true,
    canOverrideApprovals: false,
    maxApprovalValue: 25000.0,
    laborRate: 18.0, // £18 Lead Installer
    securityTier: 'TIER_4_TEAM_LEAD',
    directReports: ['steve.martinez', 'paul.anderson', 'chris.taylor'],
    skills: ['Team Leadership', 'Installation Planning', 'Quality Assurance'],
    phone: '+44 1234 567804',
    emergencyContact: '+44 7700 900804'
  },
  {
    name: 'Steve Martinez',
    email: 'steve.martinez@sfgaluminium.co.uk',
    role: 'Senior Installation Technician',
    department: 'Installation',
    canApproveQuotes: false,
    canApproveJobs: false,
    canOverrideApprovals: false,
    maxApprovalValue: 5000.0,
    laborRate: 15.0, // £15 2nd Installer
    securityTier: 'TIER_5_TECHNICIAN',
    directReports: [],
    skills: ['Glass Installation', 'Safety Compliance', 'Customer Service'],
    phone: '+44 1234 567805',
    emergencyContact: '+44 7700 900805'
  },
  {
    name: 'Paul Anderson',
    email: 'paul.anderson@sfgaluminium.co.uk',
    role: 'Installation Technician',
    department: 'Installation',
    canApproveQuotes: false,
    canApproveJobs: false,
    canOverrideApprovals: false,
    maxApprovalValue: 0.0,
    laborRate: 15.0, // £15 2nd Installer
    securityTier: 'TIER_5_TECHNICIAN',
    directReports: [],
    skills: ['Glass Installation', 'Tool Maintenance', 'Site Safety'],
    phone: '+44 1234 567806',
    emergencyContact: '+44 7700 900806'
  },
  {
    name: 'Chris Taylor',
    email: 'chris.taylor@sfgaluminium.co.uk',
    role: 'Installation Technician',
    department: 'Installation',
    canApproveQuotes: false,
    canApproveJobs: false,
    canOverrideApprovals: false,
    maxApprovalValue: 0.0,
    laborRate: 15.0, // £15 2nd Installer
    securityTier: 'TIER_5_TECHNICIAN',
    directReports: [],
    skills: ['Glass Installation', 'Customer Relations', 'Equipment Operation'],
    phone: '+44 1234 567807',
    emergencyContact: '+44 7700 900807'
  },

  // Fabrication Team
  {
    name: 'Lisa Wilson',
    email: 'lisa.wilson@sfgaluminium.co.uk',
    role: 'Fabrication Manager',
    department: 'Fabrication',
    canApproveQuotes: false,
    canApproveJobs: true,
    canOverrideApprovals: false,
    maxApprovalValue: 15000.0,
    laborRate: 16.0, // Fabrication Lead
    securityTier: 'TIER_4_TEAM_LEAD',
    directReports: ['mark.johnson', 'andrew.brown'],
    skills: ['Fabrication Planning', 'Quality Control', 'Production Scheduling'],
    phone: '+44 1234 567808',
    emergencyContact: '+44 7700 900808'
  },
  {
    name: 'Mark Johnson',
    email: 'mark.johnson@sfgaluminium.co.uk',
    role: 'Senior Fabrication Technician',
    department: 'Fabrication',
    canApproveQuotes: false,
    canApproveJobs: false,
    canOverrideApprovals: false,
    maxApprovalValue: 2000.0,
    laborRate: 14.0, // Fabrication Technician
    securityTier: 'TIER_5_TECHNICIAN',
    directReports: [],
    skills: ['Aluminum Cutting', 'Assembly', 'Precision Measurement'],
    phone: '+44 1234 567809',
    emergencyContact: '+44 7700 900809'
  },
  {
    name: 'Andrew Brown',
    email: 'andrew.brown@sfgaluminium.co.uk',
    role: 'Fabrication Technician',
    department: 'Fabrication',
    canApproveQuotes: false,
    canApproveJobs: false,
    canOverrideApprovals: false,
    maxApprovalValue: 0.0,
    laborRate: 14.0, // Fabrication Technician
    securityTier: 'TIER_5_TECHNICIAN',
    directReports: [],
    skills: ['Machine Operation', 'Quality Checking', 'Material Handling'],
    phone: '+44 1234 567810',
    emergencyContact: '+44 7700 900810'
  },

  // Sales & Estimating Team
  {
    name: 'Michael Wright',
    email: 'michael.wright@sfgaluminium.co.uk',
    role: 'Sales Director',
    department: 'Sales',
    canApproveQuotes: true,
    canApproveJobs: true,
    canOverrideApprovals: false,
    maxApprovalValue: 100000.0,
    laborRate: 0.0, // Management - no labor rate
    securityTier: 'TIER_2_SENIOR_MANAGEMENT',
    directReports: ['norman.smith', 'rachel.green'],
    skills: ['Sales Management', 'Client Relations', 'Contract Negotiation'],
    phone: '+44 1234 567811',
    emergencyContact: '+44 7700 900811'
  },
  {
    name: 'Norman Smith',
    email: 'norman.smith@sfgaluminium.co.uk',
    role: 'Senior Estimator & Surveyor',
    department: 'Sales',
    canApproveQuotes: true,
    canApproveJobs: false,
    canOverrideApprovals: false,
    maxApprovalValue: 50000.0,
    laborRate: 0.0, // Estimator - hourly rate varies by project
    securityTier: 'TIER_3_DEPARTMENT_MANAGER',
    directReports: [],
    skills: ['Survey & Estimation', 'Glass Weight Calculation', 'Technical Specification'],
    phone: '+44 1234 567812',
    emergencyContact: '+44 7700 900812'
  },
  {
    name: 'Rachel Green',
    email: 'rachel.green@sfgaluminium.co.uk',
    role: 'Sales Representative',
    department: 'Sales',
    canApproveQuotes: false,
    canApproveJobs: false,
    canOverrideApprovals: false,
    maxApprovalValue: 10000.0,
    laborRate: 0.0, // Sales - commission based
    securityTier: 'TIER_5_TECHNICIAN',
    directReports: [],
    skills: ['Client Relations', 'Quote Preparation', 'Follow-up'],
    phone: '+44 1234 567813',
    emergencyContact: '+44 7700 900813'
  },

  // Administration & Support
  {
    name: 'Emma Clarke',
    email: 'emma.clarke@sfgaluminium.co.uk',
    role: 'Office Manager',
    department: 'Administration',
    canApproveQuotes: false,
    canApproveJobs: false,
    canOverrideApprovals: false,
    maxApprovalValue: 5000.0,
    laborRate: 0.0, // Administration - salary
    securityTier: 'TIER_4_TEAM_LEAD',
    directReports: ['jennifer.white'],
    skills: ['Office Management', 'Document Control', 'Customer Service'],
    phone: '+44 1234 567814',
    emergencyContact: '+44 7700 900814'
  },
  {
    name: 'Robert Davies',
    email: 'robert.davies@sfgaluminium.co.uk',
    role: 'Accounts Manager',
    department: 'Finance',
    canApproveQuotes: false,
    canApproveJobs: false,
    canOverrideApprovals: false,
    maxApprovalValue: 15000.0,
    laborRate: 0.0, // Finance - salary
    securityTier: 'TIER_4_TEAM_LEAD',
    directReports: [],
    skills: ['Financial Analysis', 'Invoice Management', 'Credit Control'],
    phone: '+44 1234 567815',
    emergencyContact: '+44 7700 900815'
  },
  {
    name: 'Jennifer White',
    email: 'jennifer.white@sfgaluminium.co.uk',
    role: 'Administrative Assistant',
    department: 'Administration',
    canApproveQuotes: false,
    canApproveJobs: false,
    canOverrideApprovals: false,
    maxApprovalValue: 0.0,
    laborRate: 0.0, // Administration - salary
    securityTier: 'TIER_6_SUPPORT',
    directReports: [],
    skills: ['Data Entry', 'Filing', 'Reception'],
    phone: '+44 1234 567816',
    emergencyContact: '+44 7700 900816'
  }
];

async function seedEmployeeDirectory() {
  console.log('🏢 Seeding SFG Aluminium Employee Directory...');

  try {
    // Clear existing team members
    await prisma.teamMember.deleteMany({});
    console.log('📝 Cleared existing team members');

    let created = 0;
    for (const employee of employees) {
      const teamMember = await prisma.teamMember.create({
        data: {
          name: employee.name,
          email: employee.email,
          role: employee.role,
          department: employee.department,
          canApproveQuotes: employee.canApproveQuotes,
          canApproveJobs: employee.canApproveJobs,
          canOverrideApprovals: employee.canOverrideApprovals,
          maxApprovalValue: employee.maxApprovalValue,
          emailNotifications: true,
          smsNotifications: false,
          isActive: true
        }
      });
      created++;
      console.log(`👤 Created: ${employee.name} - ${employee.role}`);
    }

    console.log(`✅ Successfully created ${created} team members`);
    console.log('\n📊 Employee Statistics:');
    console.log(`• Total Employees: ${employees.length}`);
    console.log(`• Executive Team: ${employees.filter(e => e.department === 'Executive').length}`);
    console.log(`• Operations: ${employees.filter(e => e.department === 'Operations').length}`);
    console.log(`• Installation Team: ${employees.filter(e => e.department === 'Installation').length}`);
    console.log(`• Fabrication Team: ${employees.filter(e => e.department === 'Fabrication').length}`);
    console.log(`• Sales Team: ${employees.filter(e => e.department === 'Sales').length}`);
    console.log(`• Administration: ${employees.filter(e => e.department === 'Administration').length}`);
    console.log(`• Finance: ${employees.filter(e => e.department === 'Finance').length}`);

    console.log('\n💰 Labor Rates:');
    console.log(`• Lead Installer: £${employees.find(e => e.role === 'Installation Team Leader')?.laborRate}/hour`);
    console.log(`• 2nd Installer: £${employees.find(e => e.role === 'Installation Technician')?.laborRate}/hour`);
    console.log(`• Fabrication Lead: £${employees.find(e => e.role === 'Fabrication Manager')?.laborRate}/hour`);
    console.log(`• Fabrication Tech: £${employees.find(e => e.role === 'Fabrication Technician')?.laborRate}/hour`);

  } catch (error) {
    console.error('❌ Error seeding employee directory:', error);
    throw error;
  }
}

export default seedEmployeeDirectory;

if (require.main === module) {
  seedEmployeeDirectory()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
