
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function seedSFGHierarchy() {
  console.log('🌱 Starting SFG Aluminium hierarchy seeding...');

  try {
    // 1. Create Security Tiers
    console.log('📊 Creating security tiers...');
    
    const securityTiers = [
      {
        tierId: 1,
        tierName: 'Admin Tier',
        description: 'Full system access (excluding sensitive financial systems for non-finance roles).',
        hasFullSystemAccess: true,
        hasFinancialAccess: false,
        hasDepartmentAccess: true,
        hasTeamManagementAccess: true,
        hasBasicAccess: true,
        canApproveQuotes: true,
        canApproveJobs: true,
        canManageSchedule: true,
        canViewReports: true,
        canManageUsers: true,
        maxApprovalValue: 50000
      },
      {
        tierId: 2,
        tierName: 'Accounts Tier',
        description: 'Financial systems access (restricted to finance team).',
        hasFullSystemAccess: false,
        hasFinancialAccess: true,
        hasDepartmentAccess: true,
        hasTeamManagementAccess: false,
        hasBasicAccess: true,
        canApproveQuotes: true,
        canApproveJobs: false,
        canManageSchedule: false,
        canViewReports: true,
        canManageUsers: false,
        maxApprovalValue: 25000
      },
      {
        tierId: 3,
        tierName: 'Elevated Tier',
        description: 'Department-specific software + relevant databases.',
        hasFullSystemAccess: false,
        hasFinancialAccess: false,
        hasDepartmentAccess: true,
        hasTeamManagementAccess: true,
        hasBasicAccess: true,
        canApproveQuotes: true,
        canApproveJobs: true,
        canManageSchedule: true,
        canViewReports: true,
        canManageUsers: false,
        maxApprovalValue: 15000
      },
      {
        tierId: 4,
        tierName: 'Standard Tier',
        description: 'Team management tools + task trackers.',
        hasFullSystemAccess: false,
        hasFinancialAccess: false,
        hasDepartmentAccess: false,
        hasTeamManagementAccess: true,
        hasBasicAccess: true,
        canApproveQuotes: false,
        canApproveJobs: false,
        canManageSchedule: true,
        canViewReports: false,
        canManageUsers: false,
        maxApprovalValue: 5000
      },
      {
        tierId: 5,
        tierName: 'Limited Tier',
        description: 'Role-critical tools only (restricted permissions).',
        hasFullSystemAccess: false,
        hasFinancialAccess: false,
        hasDepartmentAccess: false,
        hasTeamManagementAccess: false,
        hasBasicAccess: true,
        canApproveQuotes: false,
        canApproveJobs: false,
        canManageSchedule: false,
        canViewReports: false,
        canManageUsers: false,
        maxApprovalValue: 1000
      },
      {
        tierId: 6,
        tierName: 'Basic Tier',
        description: 'Minimal access (task-specific logins).',
        hasFullSystemAccess: false,
        hasFinancialAccess: false,
        hasDepartmentAccess: false,
        hasTeamManagementAccess: false,
        hasBasicAccess: true,
        canApproveQuotes: false,
        canApproveJobs: false,
        canManageSchedule: false,
        canViewReports: false,
        canManageUsers: false,
        maxApprovalValue: 0
      }
    ];

    for (const tier of securityTiers) {
      await prisma.securityTier.upsert({
        where: { tierId: tier.tierId },
        update: tier,
        create: tier
      });
    }

    // 2. Create Color-Coded Schedule System
    console.log('🎨 Creating color-coded schedule system...');
    
    const scheduleColors = [
      {
        colorName: 'Blue',
        colorCode: '#2563eb',
        staffNickname: 'MIKE',
        priorityLevel: 3,
        canAssignJobs: true,
        canAssignVans: true
      },
      {
        colorName: 'Yellow',
        colorCode: '#eab308',
        staffNickname: 'NORMAN',
        priorityLevel: 2,
        canAssignJobs: true,
        canAssignVans: true
      },
      {
        colorName: 'Green',
        colorCode: '#16a34a',
        staffNickname: 'MATT',
        priorityLevel: 4,
        canAssignJobs: true,
        canAssignVans: true
      },
      {
        colorName: 'Red',
        colorCode: '#dc2626',
        staffNickname: 'WARREN',
        priorityLevel: 5,
        canAssignJobs: true,
        canAssignVans: true
      },
      {
        colorName: 'Grey',
        colorCode: '#6b7280',
        staffNickname: 'PAV',
        priorityLevel: 5,
        canAssignJobs: true,
        canAssignVans: true
      }
    ];

    for (const color of scheduleColors) {
      await prisma.scheduleColor.upsert({
        where: { staffNickname: color.staffNickname },
        update: color,
        create: color
      });
    }

    // 3. Create All 21 Employees with Hierarchy
    console.log('👥 Creating SFG Aluminium employees...');
    
    // Get security tier IDs for reference
    const adminTier = await prisma.securityTier.findUnique({ where: { tierName: 'Admin Tier' } });
    const accountsTier = await prisma.securityTier.findUnique({ where: { tierName: 'Accounts Tier' } });
    const elevatedTier = await prisma.securityTier.findUnique({ where: { tierName: 'Elevated Tier' } });
    const standardTier = await prisma.securityTier.findUnique({ where: { tierName: 'Standard Tier' } });
    const limitedTier = await prisma.securityTier.findUnique({ where: { tierName: 'Limited Tier' } });
    const basicTier = await prisma.securityTier.findUnique({ where: { tierName: 'Basic Tier' } });

    // Create employees in hierarchical order (managers first, then reports)
    const employees = [
      // Admin Tier - Top Management
      {
        employeeNumber: 'SFG001',
        firstName: 'Pawel',
        lastName: 'Marzec',
        fullName: 'Pawel Marzec',
        email: 'pawel@sfg-aluminium.co.uk',
        phone: '+44 1234 567001',
        role: 'General Manager',
        department: 'Management',
        securityTierId: adminTier!.id,
        scheduleColorCode: 'GREY',
        scheduleNickname: 'PAV',
        accessDetails: 'All systems except accounting/finance software',
        skills: ['Management', 'Strategic Planning', 'Operations'],
        certifications: ['Management Qualification'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: null
      },
      {
        employeeNumber: 'SFG002',
        firstName: 'Yanika',
        lastName: 'Heathcote',
        fullName: 'Yanika Heathcote',
        email: 'yanika@sfg-aluminium.co.uk',
        phone: '+44 1234 567002',
        role: 'Director',
        department: 'Management',
        securityTierId: adminTier!.id,
        accessDetails: 'Full admin access',
        skills: ['Leadership', 'Business Development', 'Finance'],
        certifications: ['Director Qualification'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: null
      },
      {
        employeeNumber: 'SFG003',
        firstName: 'Warren',
        lastName: 'Heathcote',
        fullName: 'Warren Heathcote',
        email: 'warren@sfg-aluminium.co.uk',
        phone: '+44 1234 567003',
        role: 'Operations Manager',
        department: 'Operations',
        securityTierId: adminTier!.id,
        scheduleColorCode: 'RED',
        scheduleNickname: 'WARREN',
        accessDetails: 'Operations software, CRM, project management',
        skills: ['Operations Management', 'Project Management', 'Team Leadership'],
        certifications: ['Operations Management'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: null
      },
      {
        employeeNumber: 'SFG004',
        firstName: 'Ben',
        lastName: 'Thomas',
        fullName: 'Ben Thomas',
        email: 'ben.thomas@sfg-aluminium.co.uk',
        phone: '+44 1234 567004',
        role: 'IT Manager',
        department: 'IT',
        securityTierId: adminTier!.id,
        accessDetails: 'Network admin, user permissions',
        skills: ['IT Management', 'Network Administration', 'System Security'],
        certifications: ['IT Management', 'Cisco Certified'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: null
      },
      
      // Accounts Tier
      {
        employeeNumber: 'SFG005',
        firstName: 'Mikenzie',
        lastName: 'Lewis',
        fullName: 'Mikenzie Lewis',
        email: 'accounts@sfg-aluminium.co.uk',
        phone: '+44 1234 567005',
        role: 'Accounts Admin',
        department: 'Finance',
        securityTierId: accountsTier!.id,
        accessDetails: 'Xero accounting (full access), payroll systems',
        skills: ['Accounting', 'Payroll', 'Financial Administration'],
        certifications: ['AAT Qualified'],
        isTeamLeader: false,
        canManageTeam: false,
        managerId: null
      },
      {
        employeeNumber: 'SFG006',
        firstName: 'Senior',
        lastName: 'Accountant',
        fullName: 'Senior Accountant',
        email: 'finance@sfg-aluminium.co.uk',
        phone: '+44 1234 567006',
        role: 'Senior Accountant',
        department: 'Finance',
        securityTierId: accountsTier!.id,
        accessDetails: 'Financial reporting, tax software (Read only)',
        skills: ['Financial Reporting', 'Tax Preparation', 'Management Accounts'],
        certifications: ['ACCA Qualified'],
        isTeamLeader: false,
        canManageTeam: false,
        managerId: null
      },
      
      // Elevated Tier - Department Managers
      {
        employeeNumber: 'SFG007',
        firstName: 'Matthew',
        lastName: 'Connor',
        fullName: 'Matthew Connor',
        email: 'production@sfg-aluminium.co.uk',
        phone: '+44 1234 567007',
        role: 'Production Manager',
        department: 'Production',
        securityTierId: elevatedTier!.id,
        scheduleColorCode: 'GREEN',
        scheduleNickname: 'MATT',
        accessDetails: 'Production dashboards, inventory systems',
        skills: ['Production Management', 'Quality Control', 'Inventory Management'],
        certifications: ['Production Management'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: null
      },
      {
        employeeNumber: 'SFG008',
        firstName: 'Michael',
        lastName: 'Viljoen',
        fullName: 'Michael Viljoen',
        email: 'mike@sfg-aluminium.co.uk',
        phone: '+44 1234 567008',
        role: 'Installation Manager',
        department: 'Installation',
        securityTierId: elevatedTier!.id,
        scheduleColorCode: 'BLUE',
        scheduleNickname: 'MIKE',
        accessDetails: 'Installation scheduling, client portals',
        skills: ['Installation Management', 'Team Coordination', 'Customer Relations'],
        certifications: ['Installation Management'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: null
      },
      {
        employeeNumber: 'SFG009',
        firstName: 'Mohammed',
        lastName: 'Khan',
        fullName: 'Mohammed Khan',
        email: 'estimating@sfg-aluminium.co.uk',
        phone: '+44 1234 567009',
        role: 'Estimation Lead',
        department: 'Estimating',
        securityTierId: elevatedTier!.id,
        accessDetails: 'Estimating software (e.g., CostX)',
        skills: ['Cost Estimation', 'Technical Drawing', 'Project Analysis'],
        certifications: ['Estimating Qualification'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: null
      },
      {
        employeeNumber: 'SFG010',
        firstName: 'Darren',
        lastName: 'Newbury',
        fullName: 'Darren Newbury',
        email: 'norman@sfg-aluminium.co.uk',
        phone: '+44 1234 567010',
        role: 'Site Surveyor',
        department: 'Surveying',
        securityTierId: elevatedTier!.id,
        scheduleColorCode: 'YELLOW',
        scheduleNickname: 'NORMAN',
        accessDetails: 'Surveying apps, site reports',
        skills: ['Site Surveying', 'Technical Measurement', 'Report Writing'],
        certifications: ['Site Surveying Qualification'],
        isTeamLeader: false,
        canManageTeam: false,
        managerId: null
      }
    ];

    // Create top-level employees first
    const createdEmployees: any = {};
    for (const emp of employees) {
      const created = await prisma.employee.upsert({
        where: { email: emp.email },
        update: emp,
        create: emp
      });
      createdEmployees[emp.email] = created;
    }

    // Standard Tier - Team Leaders (with manager relationships)
    const teamLeaders = [
      {
        employeeNumber: 'SFG011',
        firstName: 'Gary',
        lastName: 'Spencer',
        fullName: 'Gary Spencer',
        email: 'InstallT2@sfg-aluminium.co.uk',
        phone: '+44 1234 567011',
        role: 'Installations Team Leader',
        department: 'Installation',
        securityTierId: standardTier!.id,
        accessDetails: 'Team schedules, job tracking apps',
        skills: ['Team Leadership', 'Installation', 'Project Coordination'],
        certifications: ['Team Leadership'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: createdEmployees['mike@sfg-aluminium.co.uk'].id
      },
      {
        employeeNumber: 'SFG012',
        firstName: 'Martin',
        lastName: 'Greenough',
        fullName: 'Martin Greenough',
        email: 'InstallT1@sfg-aluminium.co.uk',
        phone: '+44 1234 567012',
        role: 'Installations Team Leader',
        department: 'Installation',
        securityTierId: standardTier!.id,
        accessDetails: 'Team schedules, job tracking apps',
        skills: ['Team Leadership', 'Installation', 'Quality Control'],
        certifications: ['Team Leadership'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: createdEmployees['mike@sfg-aluminium.co.uk'].id
      },
      {
        employeeNumber: 'SFG013',
        firstName: 'Lukasz',
        lastName: 'Wisniowski',
        fullName: 'Lukasz Wisniowski',
        email: 'production@sfg-aluminium.co.uk',
        phone: '+44 1234 567013',
        role: 'Fabrication Team Leader',
        department: 'Production',
        securityTierId: standardTier!.id,
        accessDetails: 'Factory production dashboards',
        skills: ['Fabrication', 'Team Leadership', 'Quality Control'],
        certifications: ['Fabrication Qualification'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: createdEmployees['production@sfg-aluminium.co.uk'].id
      },
      {
        employeeNumber: 'SFG014',
        firstName: 'Paul',
        lastName: 'Farrell',
        fullName: 'Paul Farrell',
        email: 'paul.f@sfg-aluminium.co.uk',
        phone: '+44 1234 567014',
        role: 'Fabrication Team Leader',
        department: 'Production',
        securityTierId: standardTier!.id,
        accessDetails: 'Factory production dashboards',
        skills: ['Fabrication', 'Team Leadership', 'Process Improvement'],
        certifications: ['Fabrication Qualification'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: createdEmployees['production@sfg-aluminium.co.uk'].id
      },
      {
        employeeNumber: 'SFG015',
        firstName: 'Rafal',
        lastName: 'Wisniowski',
        fullName: 'Rafal Wisniowski',
        email: 'rafal@sfg-aluminium.co.uk',
        phone: '+44 1234 567015',
        role: 'Fabrication Team Leader',
        department: 'Production',
        securityTierId: standardTier!.id,
        accessDetails: 'Factory production dashboards',
        skills: ['Fabrication', 'Team Leadership', 'Training'],
        certifications: ['Fabrication Qualification'],
        isTeamLeader: true,
        canManageTeam: true,
        managerId: createdEmployees['production@sfg-aluminium.co.uk'].id
      }
    ];

    for (const emp of teamLeaders) {
      const created = await prisma.employee.upsert({
        where: { email: emp.email },
        update: emp,
        create: emp
      });
      createdEmployees[emp.email] = created;
    }

    // Limited Tier - Office Staff
    const officeStaff = [
      {
        employeeNumber: 'SFG016',
        firstName: 'Katarzyna',
        lastName: 'Marzec',
        fullName: 'Katarzyna Marzec',
        email: 'office@sfg-aluminium.co.uk',
        phone: '+44 1234 567016',
        role: 'Office Admin',
        department: 'Administration',
        securityTierId: limitedTier!.id,
        accessDetails: 'Office 365, internal calendars',
        skills: ['Administration', 'Customer Service', 'Data Entry'],
        certifications: ['Office Administration'],
        isTeamLeader: false,
        canManageTeam: false,
        managerId: createdEmployees['pawel@sfg-aluminium.co.uk'].id
      },
      {
        employeeNumber: 'SFG017',
        firstName: 'Antonee',
        lastName: 'Heathcote',
        fullName: 'Antonee Heathcote',
        email: 'marketing@sfg-aluminium.co.uk',
        phone: '+44 1234 567017',
        role: 'Marketing',
        department: 'Marketing',
        securityTierId: limitedTier!.id,
        accessDetails: 'Social media, website CMS',
        skills: ['Marketing', 'Social Media', 'Content Creation'],
        certifications: ['Digital Marketing'],
        isTeamLeader: false,
        canManageTeam: false,
        managerId: createdEmployees['yanika@sfg-aluminium.co.uk'].id
      }
    ];

    for (const emp of officeStaff) {
      const created = await prisma.employee.upsert({
        where: { email: emp.email },
        update: emp,
        create: emp
      });
      createdEmployees[emp.email] = created;
    }

    // Basic Tier - Operatives
    const operatives = [
      {
        employeeNumber: 'SFG018',
        firstName: 'Liam',
        lastName: 'Greenough',
        fullName: 'Liam Greenough',
        email: 'liam.greenough@sfg-aluminium.co.uk',
        phone: '+44 1234 567018',
        role: 'Installations Team Member',
        department: 'Installation',
        securityTierId: basicTier!.id,
        accessDetails: 'Mobile job app, time tracking',
        skills: ['Installation', 'Manual Handling', 'Customer Service'],
        certifications: ['Basic Installation'],
        isTeamLeader: false,
        canManageTeam: false,
        managerId: createdEmployees['InstallT1@sfg-aluminium.co.uk'].id
      },
      {
        employeeNumber: 'SFG019',
        firstName: 'Wayne',
        lastName: 'Spencer',
        fullName: 'Wayne Spencer',
        email: 'wayne.spencer@sfg-aluminium.co.uk',
        phone: '+44 1234 567019',
        role: 'Installations Team Member',
        department: 'Installation',
        securityTierId: basicTier!.id,
        accessDetails: 'Mobile job app, time tracking',
        skills: ['Installation', 'Manual Handling', 'Equipment Operation'],
        certifications: ['Basic Installation'],
        isTeamLeader: false,
        canManageTeam: false,
        managerId: createdEmployees['InstallT2@sfg-aluminium.co.uk'].id
      },
      {
        employeeNumber: 'SFG020',
        firstName: 'Lukasz',
        lastName: 'Topolski',
        fullName: 'Lukasz Topolski',
        email: 'PC@sfg-aluminium.co.uk',
        phone: '+44 1234 567020',
        role: 'Factory Operative',
        department: 'Production',
        securityTierId: basicTier!.id,
        accessDetails: 'Production line terminals',
        skills: ['Powder Coating', 'Quality Control', 'Equipment Operation'],
        certifications: ['Powder Coating Qualification'],
        isTeamLeader: false,
        canManageTeam: false,
        managerId: createdEmployees['production@sfg-aluminium.co.uk'].id
      },
      {
        employeeNumber: 'SFG021',
        firstName: 'Mariusz',
        lastName: 'Koszla',
        fullName: 'Mariusz Koszla',
        email: 'mariusz@sfg-aluminium.co.uk',
        phone: '+44 1234 567021',
        role: 'Factory Operative',
        department: 'Production',
        securityTierId: basicTier!.id,
        accessDetails: 'Production line terminals',
        skills: ['Fabrication', 'Assembly', 'Quality Control'],
        certifications: ['Basic Fabrication'],
        isTeamLeader: false,
        canManageTeam: false,
        managerId: createdEmployees['production@sfg-aluminium.co.uk'].id
      }
    ];

    for (const emp of operatives) {
      await prisma.employee.upsert({
        where: { email: emp.email },
        update: emp,
        create: emp
      });
    }

    // 4. Update Schedule Color Assignments
    console.log('🔄 Updating schedule color assignments...');
    
    const colorAssignments = [
      { nickname: 'MIKE', email: 'mike@sfg-aluminium.co.uk' },
      { nickname: 'NORMAN', email: 'norman@sfg-aluminium.co.uk' },
      { nickname: 'MATT', email: 'production@sfg-aluminium.co.uk' },
      { nickname: 'WARREN', email: 'warren@sfg-aluminium.co.uk' },
      { nickname: 'PAV', email: 'pawel@sfg-aluminium.co.uk' }
    ];

    for (const assignment of colorAssignments) {
      const employee = await prisma.employee.findUnique({
        where: { email: assignment.email }
      });
      
      if (employee) {
        await prisma.scheduleColor.update({
          where: { staffNickname: assignment.nickname },
          data: { employeeId: employee.id }
        });
      }
    }

    console.log('✅ SFG Aluminium hierarchy seeding completed successfully!');
    console.log(`📊 Created ${securityTiers.length} security tiers`);
    console.log(`🎨 Created ${scheduleColors.length} schedule colors`);
    console.log(`👥 Created 21 employees with proper hierarchy`);
    
  } catch (error) {
    console.error('❌ Error seeding SFG hierarchy:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedSFGHierarchy()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
