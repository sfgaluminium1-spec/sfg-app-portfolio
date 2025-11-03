
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with new workflow data...');

  // Create sample vans
  const vans = await Promise.all([
    prisma.van.create({
      data: {
        vanNumber: 'VAN-001',
        registration: 'SF24 GLZ',
        model: 'Ford Transit Large',
        capacity: 'Large',
        equipment: ['Glass Suction Cups', 'Lifting Equipment', 'Power Tools', 'Safety Equipment']
      }
    }),
    prisma.van.create({
      data: {
        vanNumber: 'VAN-002',
        registration: 'SF24 CUR',
        model: 'Mercedes Sprinter',
        capacity: 'Large',
        equipment: ['Curtain Wall Tools', 'Lifting Equipment', 'Welding Kit', 'Safety Equipment']
      }
    }),
    prisma.van.create({
      data: {
        vanNumber: 'VAN-003',
        registration: 'SF24 WIN',
        model: 'Ford Transit Medium',
        capacity: 'Medium',
        equipment: ['Window Installation Tools', 'Sealants', 'Power Tools', 'Safety Equipment']
      }
    }),
    prisma.van.create({
      data: {
        vanNumber: 'VAN-004',
        registration: 'SF24 SHO',
        model: 'Iveco Daily',
        capacity: 'Medium',
        equipment: ['Shopfront Tools', 'Glass Handling', 'Power Tools', 'Safety Equipment']
      }
    })
  ]);

  // Create sample teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        teamName: 'Alpha Team',
        teamLeader: 'Mark Thompson',
        members: ['Mark Thompson', 'James Wilson', 'Robert Clarke'],
        skills: ['Curtain Walling', 'Structural Glazing', 'Complex Installations'],
        vanId: vans[0].id
      }
    }),
    prisma.team.create({
      data: {
        teamName: 'Beta Team',
        teamLeader: 'Steve Richards',
        members: ['Steve Richards', 'Paul Anderson', 'Michael Brown'],
        skills: ['Windows', 'Doors', 'Shopfronts'],
        vanId: vans[1].id
      }
    }),
    prisma.team.create({
      data: {
        teamName: 'Gamma Team',
        teamLeader: 'David Jones',
        members: ['David Jones', 'Chris Taylor'],
        skills: ['Windows', 'Residential', 'Maintenance'],
        vanId: vans[2].id
      }
    }),
    prisma.team.create({
      data: {
        teamName: 'Delta Team',
        teamLeader: 'Tony Miller',
        members: ['Tony Miller', 'Gary White', 'Simon Davis'],
        skills: ['Shopfronts', 'Commercial', 'Glazing'],
        vanId: vans[3].id
      }
    })
  ]);

  // Create sample enquiries
  const enquiries = await Promise.all([
    prisma.enquiry.create({
      data: {
        enquiryNumber: 'ENQ-240001',
        customerName: 'Beesley and Fildes',
        contactName: 'John Smith',
        email: 'john.smith@beesleyfildes.com',
        phone: '0161 234 5678',
        company: 'Beesley and Fildes Ltd',
        projectName: 'Office Refurbishment Phase 2',
        description: 'Additional curtain walling for office expansion',
        source: 'Website',
        status: 'CONTACTED'
      }
    }),
    prisma.enquiry.create({
      data: {
        enquiryNumber: 'ENQ-240002',
        customerName: 'Lodestone Projects',
        contactName: 'Mike Wilson',
        email: 'mike@lodestoneprojects.co.uk',
        phone: '0113 456 7890',
        company: 'Lodestone Projects Ltd',
        projectName: 'Retail Development Leeds',
        description: 'Shopfront installation for new retail units',
        source: 'Referral',
        status: 'QUOTED'
      }
    }),
    prisma.enquiry.create({
      data: {
        enquiryNumber: 'ENQ-240003',
        customerName: 'Urban Developments',
        contactName: 'Emma Davis',
        email: 'emma@urbandevelopments.com',
        phone: '0121 789 0123',
        company: 'Urban Developments PLC',
        projectName: 'Residential Complex Birmingham',
        description: 'Window installation for 50-unit residential development',
        source: 'Direct',
        status: 'WON'
      }
    }),
    prisma.enquiry.create({
      data: {
        enquiryNumber: 'ENQ-240004',
        customerName: 'City Council',
        contactName: 'Sarah Thompson',
        email: 'sarah.thompson@citycouncil.gov.uk',
        phone: '0121 456 7890',
        company: 'Birmingham City Council',
        projectName: 'Library Extension',
        description: 'Structural glazing for new library extension',
        source: 'Tender',
        status: 'NEW'
      }
    }),
    prisma.enquiry.create({
      data: {
        enquiryNumber: 'ENQ-240005',
        customerName: 'Retail Chain Ltd',
        contactName: 'Mark Johnson',
        email: 'mark@retailchain.co.uk',
        phone: '0161 789 0123',
        company: 'Retail Chain Ltd',
        projectName: 'Store Refurbishment',
        description: 'Shopfront replacement for 3 stores',
        source: 'Direct',
        status: 'CONTACTED'
      }
    })
  ]);

  // Create sample quotes
  const quotes = await Promise.all([
    prisma.quote.create({
      data: {
        quoteNumber: 'SFG-Q-001234',
        customer: 'Beesley and Fildes',
        projectName: 'Office Refurbishment Phase 2',
        contactName: 'John Smith',
        productType: 'Curtain Walling',
        value: 45000.00,
        status: 'SENT',
        quotedBy: 'Sarah Johnson',
        quoteType: 'Supply & Fit',
        enquiryId: enquiries[0].id
      }
    }),
    prisma.quote.create({
      data: {
        quoteNumber: 'SFG-Q-001235',
        customer: 'Lodestone Projects',
        projectName: 'Retail Development Leeds',
        contactName: 'Mike Wilson',
        productType: 'Shopfronts',
        value: 32000.00,
        status: 'WON',
        quotedBy: 'David Brown',
        quoteType: 'Supply & Fit',
        enquiryId: enquiries[1].id
      }
    }),
    prisma.quote.create({
      data: {
        quoteNumber: 'SFG-Q-001236',
        customer: 'Urban Developments',
        projectName: 'Residential Complex Birmingham',
        contactName: 'Emma Davis',
        productType: 'Windows',
        value: 78000.00,
        status: 'WON',
        quotedBy: 'Sarah Johnson',
        quoteType: 'Supply & Fit',
        enquiryId: enquiries[2].id
      }
    })
  ]);

  // Create sample jobs (converted from won quotes)
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        jobNumber: 'SFG-18457',
        client: 'Lodestone Projects',
        site: 'Leeds Retail Development',
        description: 'Shopfront installation for new retail units',
        value: 32000.00,
        status: 'FABRICATION',
        priority: 'HIGH',
        quoteId: quotes[1].id,
        poReceivedDate: new Date('2024-06-15'),
        fabricationDate: new Date('2024-07-15'),
        installationDate: new Date('2024-07-08'), // 3 weeks from PO
        teamRequirement: 1,
        vanRequirement: 1,
        estimatedDays: 3,
        drawingStatus: 'APPROVED',
        approvalStatus: 'APPROVED',
        glassOrderStatus: 'ORDERED',
        cutStatus: 'IN_PROGRESS'
      }
    }),
    prisma.job.create({
      data: {
        jobNumber: 'SFG-18458',
        client: 'Urban Developments',
        site: 'Birmingham Residential Complex',
        description: 'Window installation for 50-unit residential development',
        value: 78000.00,
        status: 'READY_FOR_INSTALL',
        priority: 'MEDIUM',
        quoteId: quotes[2].id,
        poReceivedDate: new Date('2024-06-01'),
        fabricationDate: new Date('2024-07-01'),
        installationDate: new Date('2024-07-22'), // 3 weeks from PO
        teamRequirement: 2,
        vanRequirement: 2,
        estimatedDays: 5,
        drawingStatus: 'APPROVED',
        approvalStatus: 'APPROVED',
        glassOrderStatus: 'DELIVERED',
        cutStatus: 'COMPLETED',
        preparedStatus: 'COMPLETED',
        coatingStatus: 'COMPLETED',
        assemblyStatus: 'COMPLETED'
      }
    })
  ]);

  // Create sample job schedules
  await Promise.all([
    prisma.jobSchedule.create({
      data: {
        scheduledDate: new Date('2024-07-22'),
        scheduledTime: 'Full Day',
        status: 'SCHEDULED',
        notes: 'First day of installation - setup and initial windows',
        jobId: jobs[1].id,
        teamId: teams[0].id,
        vanId: vans[0].id
      }
    }),
    prisma.jobSchedule.create({
      data: {
        scheduledDate: new Date('2024-07-22'),
        scheduledTime: 'Full Day',
        status: 'SCHEDULED',
        notes: 'Second team working on different block',
        jobId: jobs[1].id,
        teamId: teams[1].id,
        vanId: vans[1].id
      }
    }),
    prisma.jobSchedule.create({
      data: {
        scheduledDate: new Date('2024-07-08'),
        scheduledTime: 'Full Day',
        status: 'SCHEDULED',
        notes: 'Shopfront installation - Leeds retail',
        jobId: jobs[0].id,
        teamId: teams[3].id,
        vanId: vans[3].id
      }
    })
  ]);

  // Create sample orders
  await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: 'ORD-31045',
        supplier: 'NVM Glass Supplier',
        description: 'Shopfront glass units for Leeds project',
        price: 12000.00,
        orderedBy: 'David Brown',
        jobId: jobs[0].id
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-31046',
        supplier: 'Window Systems Ltd',
        description: 'UPVC windows for Birmingham residential',
        price: 35000.00,
        orderedBy: 'Sarah Johnson',
        jobId: jobs[1].id
      }
    })
  ]);

  // Create sample activities
  await Promise.all([
    prisma.activity.create({
      data: {
        type: 'ENQUIRY_CREATED',
        description: 'New enquiry ENQ-240001 received from Beesley and Fildes',
        user: 'System',
        enquiryId: enquiries[0].id
      }
    }),
    prisma.activity.create({
      data: {
        type: 'QUOTE_GENERATED',
        description: 'Quote SFG-Q-001235 generated from enquiry ENQ-240002',
        user: 'David Brown',
        quoteId: quotes[1].id,
        enquiryId: enquiries[1].id
      }
    }),
    prisma.activity.create({
      data: {
        type: 'PO_RECEIVED',
        description: 'PO received for quote SFG-Q-001235, converted to job SFG-18457',
        user: 'Sarah Johnson',
        jobId: jobs[0].id,
        quoteId: quotes[1].id
      }
    }),
    prisma.activity.create({
      data: {
        type: 'SCHEDULE_CREATED',
        description: 'Installation scheduled for job SFG-18458 with Alpha and Beta teams',
        user: 'Production Manager',
        jobId: jobs[1].id
      }
    })
  ]);

  console.log('Database seeded successfully with new workflow data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
