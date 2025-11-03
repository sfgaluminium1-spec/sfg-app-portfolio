import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting database seeding for SFG Aluminium Wiki...')

  // Create SFG Aluminium users
  const hashedPassword = await bcrypt.hash('sfg2025', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'yanika@sfg-aluminium.co.uk' },
    update: {},
    create: {
      email: 'yanika@sfg-aluminium.co.uk',
      password: hashedPassword,
      firstName: 'Yanika',
      lastName: 'Heathcote',
      role: 'SUPER_ADMIN',
      tierLevel: 'director',
      department: 'management',
    },
  })

  const opsUser = await prisma.user.upsert({
    where: { email: 'pawel@sfg-aluminium.co.uk' },
    update: {},
    create: {
      email: 'pawel@sfg-aluminium.co.uk',
      password: hashedPassword,
      firstName: 'Pawel',
      lastName: 'Marzec',
      role: 'ADMIN',
      tierLevel: 'manager',
      department: 'management',
    },
  })

  console.log('✅ Users created:', adminUser.email, opsUser.email)

  // Create categories (ProjectVault Pro compatible - 12 categories)
  const categories = [
    {
      name: 'Insurance & Risk',
      code: 'INSURANCE',
      description: 'Insurance policies, coverage, exclusions, and risk management',
      icon: 'Shield',
      color: '#ef4444',
      sortOrder: 1,
    },
    {
      name: 'Staff Tier Levels',
      code: 'STAFF_TIERS',
      description: 'Organizational hierarchy and staff tier definitions',
      icon: 'Users',
      color: '#3b82f6',
      sortOrder: 2,
    },
    {
      name: 'Customer Tier Levels',
      code: 'CUSTOMER_TIERS',
      description: 'Customer classification and tier benefits',
      icon: 'CreditCard',
      color: '#10b981',
      sortOrder: 3,
    },
    {
      name: 'Credit Check Protocols',
      code: 'CREDIT_CHECKS',
      description: 'Credit evaluation and approval procedures',
      icon: 'Shield',
      color: '#f59e0b',
      sortOrder: 4,
    },
    {
      name: 'Company Protocols',
      code: 'PROTOCOLS',
      description: 'General company policies and protocols',
      icon: 'FileText',
      color: '#64748b',
      sortOrder: 5,
    },
    {
      name: 'Project Numbering',
      code: 'PROJECT_NUM',
      description: 'Project identification and numbering systems',
      icon: 'Hash',
      color: '#84cc16',
      sortOrder: 6,
    },
    // NEW CATEGORIES - ProjectVault Pro Integration
    {
      name: 'Financial Records',
      code: 'FINANCIAL',
      description: 'Invoices, receipts, budgets, expenses, accounting records, and financial reports',
      icon: 'DollarSign',
      color: '#059669',
      sortOrder: 7,
    },
    {
      name: 'HR & Personnel',
      code: 'HR_PERSONNEL',
      description: 'Employee records, payroll, hiring, onboarding, performance reviews, and benefits',
      icon: 'UserCheck',
      color: '#7c3aed',
      sortOrder: 8,
    },
    {
      name: 'Training & Enablement',
      code: 'TRAINING',
      description: 'Training materials, onboarding guides, SOPs, and knowledge transfer documents',
      icon: 'GraduationCap',
      color: '#0ea5e9',
      sortOrder: 9,
    },
    {
      name: 'Vendor Management',
      code: 'VENDOR',
      description: 'Supplier contracts, vendor agreements, procurement documents, and purchase orders',
      icon: 'Package',
      color: '#f97316',
      sortOrder: 10,
    },
    {
      name: 'Compliance & Governance',
      code: 'COMPLIANCE',
      description: 'Regulatory compliance, audits, governance policies, and legal requirements',
      icon: 'Scale',
      color: '#dc2626',
      sortOrder: 11,
    },
    {
      name: 'Archive & Knowledge Base',
      code: 'ARCHIVE',
      description: 'Historical records, archived projects, lessons learned, and reference materials',
      icon: 'Archive',
      color: '#6b7280',
      sortOrder: 12,
    },
  ]

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { code: categoryData.code },
      update: {},
      create: categoryData,
    })
  }

  console.log('✅ Categories created')

  // Staff tiers
  await prisma.staffTier.createMany({
    data: [
      {
        name: 'Director',
        level: 1,
        description: 'Managing Director',
        salaryMin: 60000,
        salaryMax: 150000,
        budgetAuthority: 99999999,
      },
      {
        name: 'Manager',
        level: 2,
        description: 'Operations/Installations Manager',
        salaryMin: 40000,
        salaryMax: 70000,
        budgetAuthority: 50000,
      },
      {
        name: 'Senior',
        level: 3,
        description: 'Senior Estimator',
        salaryMin: 30000,
        salaryMax: 50000,
        budgetAuthority: 15000,
      },
    ],
    skipDuplicates: true,
  })

  // Customer tiers
  await prisma.customerTier.createMany({
    data: [
      {
        name: 'Unlimited',
        code: 'UNLTD',
        priority: 1,
        revenueMin: 50001,
        discountPercentage: 12,
        paymentTerms: 'Net 60',
        creditLimit: 999999,
      },
      {
        name: 'Premium',
        code: 'PREM',
        priority: 2,
        revenueMin: 10001,
        revenueMax: 50000,
        discountPercentage: 8,
        paymentTerms: 'Net 30',
        creditLimit: 50000,
      },
      {
        name: 'Standard',
        code: 'STD',
        priority: 3,
        revenueMin: 2501,
        revenueMax: 10000,
        discountPercentage: 5,
        paymentTerms: 'Net 14',
        creditLimit: 10000,
      },
      {
        name: 'Economy',
        code: 'ECON',
        priority: 4,
        revenueMin: 0,
        revenueMax: 2500,
        discountPercentage: 0,
        paymentTerms: 'COD',
        creditLimit: 2500,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Tiers created')
  console.log('✅ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
