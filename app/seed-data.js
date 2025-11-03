const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with SFG data...');

  // Create sample jobs based on real SFG data
  const jobs = [
    {
      jobNumber: '18456',
      client: 'Beesley and Fildes',
      site: 'Manchester Office',
      description: 'Aluminium window installation - 12 units',
      value: 15750.00,
      status: 'FABRICATION',
      priority: 'HIGH',
      drawingStatus: 'APPROVED',
      approvalStatus: 'APPROVED',
      glassOrderStatus: 'ORDERED',
      cutStatus: 'COMPLETED',
      preparedStatus: 'IN_PROGRESS',
      coatingStatus: 'PENDING',
      assemblyStatus: 'PENDING',
      installStatus: 'PENDING',
      fabricationDate: new Date('2025-01-15'),
      installationDate: new Date('2025-01-22')
    },
    {
      jobNumber: '18457',
      client: 'Lodestone Projects',
      site: 'SBS Northampton',
      description: 'Glass replacement - Emergency repair',
      value: 2850.00,
      status: 'APPROVED',
      priority: 'URGENT',
      drawingStatus: 'APPROVED',
      approvalStatus: 'APPROVED',
      glassOrderStatus: 'PENDING',
      cutStatus: 'PENDING',
      preparedStatus: 'PENDING',
      coatingStatus: 'PENDING',
      assemblyStatus: 'PENDING',
      installStatus: 'PENDING',
      fabricationDate: new Date('2025-01-16'),
      installationDate: new Date('2025-01-18')
    },
    {
      jobNumber: '18455',
      client: 'True Fix Solution',
      site: 'Birmingham Warehouse',
      description: 'Curtain wall system - Phase 2',
      value: 28500.00,
      status: 'COMPLETED',
      priority: 'MEDIUM',
      drawingStatus: 'APPROVED',
      approvalStatus: 'APPROVED',
      glassOrderStatus: 'COMPLETED',
      cutStatus: 'COMPLETED',
      preparedStatus: 'COMPLETED',
      coatingStatus: 'COMPLETED',
      assemblyStatus: 'COMPLETED',
      installStatus: 'COMPLETED',
      fabricationDate: new Date('2025-01-08'),
      installationDate: new Date('2025-01-12'),
      completionDate: new Date('2025-01-12')
    },
    {
      jobNumber: '18458',
      client: 'NSS',
      site: 'London Office Complex',
      description: 'Shopfront glazing - 8 panels',
      value: 12300.00,
      status: 'QUOTED',
      priority: 'MEDIUM',
      drawingStatus: 'PENDING',
      approvalStatus: 'PENDING',
      glassOrderStatus: 'PENDING',
      cutStatus: 'PENDING',
      preparedStatus: 'PENDING',
      coatingStatus: 'PENDING',
      assemblyStatus: 'PENDING',
      installStatus: 'PENDING'
    }
  ];

  for (const jobData of jobs) {
    await prisma.job.upsert({
      where: { jobNumber: jobData.jobNumber },
      update: jobData,
      create: jobData
    });
  }

  // Create sample quotes based on real SFG data
  const quotes = [
    {
      quoteNumber: '21471',
      customer: 'Lodestone Projects',
      projectName: 'SBS Northampton',
      contactName: 'Matt Ellis',
      productType: 'Glass Replacement',
      quotedBy: 'Warren',
      value: 1377.00,
      status: 'WON',
      quoteType: 'Supply & Fit',
      quoteDate: new Date('2025-01-03'),
      dueDate: new Date('2025-01-17')
    },
    {
      quoteNumber: '21472',
      customer: 'True Fix Solution',
      projectName: 'Birmingham Warehouse Repair',
      contactName: 'Sarah Johnson',
      productType: 'Emergency Glazing',
      quotedBy: 'Neil',
      value: 2850.00,
      revisedPrice: 2650.00,
      status: 'SENT',
      quoteType: 'Supply & Fit',
      revision: 1,
      quoteDate: new Date('2025-01-05'),
      dueDate: new Date('2025-01-19')
    },
    {
      quoteNumber: '21473',
      customer: 'NSS',
      projectName: 'London Office Complex',
      contactName: 'David Brown',
      productType: 'Shopfront Glazing',
      quotedBy: 'Warren',
      value: 12300.00,
      status: 'PENDING',
      quoteType: 'Supply Only',
      quoteDate: new Date('2025-01-08'),
      dueDate: new Date('2025-01-22')
    },
    {
      quoteNumber: '21474',
      customer: 'Etron',
      projectName: 'Industrial Unit Glazing',
      contactName: 'Mike Wilson',
      productType: 'Curtain Wall System',
      quotedBy: 'Neil',
      value: 18750.00,
      status: 'LOST',
      quoteType: 'Supply & Fit',
      quoteDate: new Date('2025-01-10'),
      dueDate: new Date('2025-01-24')
    },
    {
      quoteNumber: '21475',
      customer: 'Beesley and Fildes',
      projectName: 'Manchester Office Renovation',
      contactName: 'Emma Thompson',
      productType: 'Window Replacement',
      quotedBy: 'Warren',
      value: 15750.00,
      status: 'REVISED',
      quoteType: 'Supply & Fit',
      quoteDate: new Date('2025-01-12'),
      dueDate: new Date('2025-01-26')
    }
  ];

  for (const quoteData of quotes) {
    await prisma.quote.upsert({
      where: { quoteNumber: quoteData.quoteNumber },
      update: quoteData,
      create: quoteData
    });
  }

  // Create sample orders
  const orders = [
    {
      orderNumber: '31034',
      supplier: 'NVM',
      description: '4no 180nm Motors - Remote fobs',
      price: 323.00,
      orderedBy: 'CW',
      date: new Date('2023-01-03')
    },
    {
      orderNumber: '31035',
      supplier: 'Glass Supplier Ltd',
      description: '5no 50 x50 x3mm box section @ 6000mm',
      price: 1250.00,
      orderedBy: 'Maintain',
      date: new Date('2025-01-15')
    },
    {
      orderNumber: '31036',
      supplier: 'BGS',
      description: '2xpairs Guardsman\'s handles',
      price: 450.00,
      orderedBy: 'CW',
      date: new Date('2025-01-14')
    }
  ];

  // Link orders to jobs
  const job18456 = await prisma.job.findUnique({ where: { jobNumber: '18456' } });
  const job18457 = await prisma.job.findUnique({ where: { jobNumber: '18457' } });

  for (const orderData of orders) {
    const jobId = orderData.orderNumber === '31034' ? job18456?.id : 
                  orderData.orderNumber === '31035' ? job18457?.id : 
                  job18456?.id;
    
    if (jobId) {
      await prisma.order.upsert({
        where: { orderNumber: orderData.orderNumber },
        update: { ...orderData, jobId },
        create: { ...orderData, jobId }
      });
    }
  }

  // Create sample activities
  const activities = [
    {
      type: 'JOB_CREATED',
      description: 'New job 18457 created for Beesley and Fildes',
      user: 'Warren Heathcote',
      jobId: job18456?.id
    },
    {
      type: 'STATUS_CHANGED',
      description: 'Job 18456 status changed to FABRICATION',
      user: 'System',
      jobId: job18456?.id
    },
    {
      type: 'QUOTE_GENERATED',
      description: 'Quote 21476 sent to Lodestone Projects',
      user: 'Neil Smith'
    },
    {
      type: 'JOB_UPDATED',
      description: 'Job 18455 completed - Installation finished',
      user: 'Installation Team'
    },
    {
      type: 'ORDER_PLACED',
      description: 'Order 31045 placed with NVM Supplier',
      user: 'Craig Wilson'
    }
  ];

  for (const activityData of activities) {
    await prisma.activity.create({
      data: activityData
    });
  }

  // Create sample chat messages
  const chatMessages = [
    {
      message: 'New job for Beesley and Fildes',
      response: '✅ New job created: **18456**\n\nClient: Beesley and Fildes\nDescription: Not specified\n\nJob is ready for processing. Would you like me to create a quote for this job?',
      user: 'User',
      processed: true
    },
    {
      message: 'Complete job 18455',
      response: '✅ Job **18455** marked as completed!\n\nStatus updated to COMPLETED\nCompletion date: 12/01/2025\n\nGreat work! 🎉',
      user: 'User',
      processed: true
    }
  ];

  for (const messageData of chatMessages) {
    await prisma.chatMessage.create({
      data: messageData
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
