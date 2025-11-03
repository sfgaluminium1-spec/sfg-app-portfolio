
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedFinanceData() {
  console.log('🏦 Starting SFG TIME Finance Module seeding...');

  try {
    // Create finance settings
    console.log('📊 Creating finance settings...');
    const financeSettings = await prisma.financeSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        defaultDrawdownRate: 80.0,
        financeFeesRate: 3.967,
        minimumInvoiceAmount: 500.0,
        type1Eligible: true,
        type2Eligible: true,
        type3Eligible: false,
        type4Eligible: false,
        firstReminderDays: 60,
        secondReminderDays: 90,
        finalReminderDays: 120,
        vatSubmissionDay: 7,
        cisSubmissionDay: 19,
        quarterlyDeadlineDay: 31,
        reminderEmailTemplate: 'Dear {customerName}, Your payment of £{amount} for invoice {invoiceNumber} is now {daysOverdue} days overdue. Please arrange payment as soon as possible.',
        complianceEmailTemplate: 'Compliance submission for {period} is due on {deadline}. Please ensure all documentation is submitted on time.'
      }
    });

    // Get existing customers, jobs, and quotes for creating invoices
    const customers = await prisma.customer.findMany({ take: 10 });
    const jobs = await prisma.job.findMany({ take: 10 });
    const quotes = await prisma.quote.findMany({ take: 10 });

    if (customers.length === 0) {
      console.log('⚠️ No customers found. Please run customer seeding first.');
      return;
    }

    // Create sample invoices
    console.log('📄 Creating sample invoices...');
    const invoices = [];

    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length];
      const job = jobs[i % jobs.length] || null;
      const quote = quotes[i % quotes.length] || null;

      // Determine customer finance type based on customer data
      let customerType = 'TYPE_4';
      if (customer.creditStatus === 'GOOD' && customer.customerType === 'REPEAT_CUSTOMER') {
        customerType = 'TYPE_1';
      } else if (customer.creditStatus === 'GOOD' && customer.customerType === 'ACTIVE_CUSTOMER') {
        customerType = 'TYPE_2';
      } else if (customer.customerType === 'ACTIVE_CUSTOMER') {
        customerType = 'TYPE_3';
      }

      const subtotal = 1000 + (i * 500) + Math.random() * 2000;
      const vatAmount = subtotal * 0.2;
      const cisDeduction = Math.random() > 0.7 ? subtotal * 0.2 : 0;
      const totalAmount = subtotal + vatAmount - cisDeduction;

      // Calculate finance eligibility
      const isEligible = (
        totalAmount >= 500 &&
        (customerType === 'TYPE_1' || customerType === 'TYPE_2')
      );

      const drawdownAmount = isEligible ? totalAmount * 0.8 : null;
      const financeFeesAmount = drawdownAmount ? drawdownAmount * 0.03967 : null;

      const invoiceDate = new Date();
      invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 90));
      
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30);

      // Determine payment status
      let paymentStatus = 'PENDING';
      let paidAmount = 0;
      const daysSinceInvoice = Math.floor((new Date() - invoiceDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceInvoice > 60 && Math.random() > 0.3) {
        paymentStatus = 'OVERDUE';
      } else if (Math.random() > 0.6) {
        paymentStatus = 'PAID';
        paidAmount = totalAmount;
      } else if (Math.random() > 0.8) {
        paymentStatus = 'PARTIAL';
        paidAmount = totalAmount * (0.3 + Math.random() * 0.4);
      }

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-${String(i + 1).padStart(3, '0')}`,
          invoiceDate,
          dueDate,
          customerId: customer.id,
          customerType,
          jobId: job?.id,
          quoteId: quote?.id,
          subtotal,
          vatAmount,
          cisDeduction,
          totalAmount,
          invoiceFinanceEligible: isEligible,
          drawdownAmount,
          financeFeesAmount,
          paymentStatus,
          paidAmount,
          paymentDate: paymentStatus === 'PAID' ? new Date() : null,
          vatStatus: Math.random() > 0.8 ? 'REVERSE_CHARGE' : 'STANDARD_RATE',
          cisStatus: cisDeduction > 0 ? 'STANDARD_RATE' : 'NOT_APPLICABLE',
          reverseCharge: Math.random() > 0.9
        }
      });

      invoices.push(invoice);

      // Create finance drawdown if eligible
      if (isEligible && drawdownAmount && financeFeesAmount) {
        const drawdownStatus = Math.random() > 0.3 ? 'APPROVED' : 'PENDING';
        
        await prisma.financeDrawdown.create({
          data: {
            invoiceId: invoice.id,
            eligibleAmount: totalAmount,
            drawdownPercentage: 80.0,
            drawdownAmount,
            feesRate: 3.967,
            feesAmount: financeFeesAmount,
            netDrawdown: drawdownAmount - financeFeesAmount,
            status: drawdownStatus,
            requestedDate: invoiceDate,
            approvedDate: drawdownStatus === 'APPROVED' ? new Date() : null,
            documentsSubmitted: true,
            invoiceCopySubmitted: true,
            deliveryProofSubmitted: Math.random() > 0.3
          }
        });
      }
    }

    console.log(`✅ Created ${invoices.length} sample invoices`);

    // Create delivery templates
    console.log('🚚 Creating delivery templates...');
    const deliveryTemplates = [];

    for (let i = 0; i < 10; i++) {
      const invoice = invoices[i];
      const customer = customers.find(c => c.id === invoice.customerId);
      const job = jobs.find(j => j.id === invoice.jobId);

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 30));

      // Sample product details (automatically populated)
      const productDetails = [
        {
          lineNumber: 1,
          product: 'Double Glazed Window',
          description: '1200x1000mm UPVC Double Glazed Window with toughened glass',
          quantity: 2,
          unitPrice: 450.00,
          totalPrice: 900.00
        },
        {
          lineNumber: 2,
          product: 'Door Frame',
          description: 'UPVC Door Frame with multi-point locking system',
          quantity: 1,
          unitPrice: 320.00,
          totalPrice: 320.00
        }
      ];

      const glassDetails = [
        {
          lineNumber: 1,
          product: 'Double Glazed Unit',
          description: 'Toughened double glazed unit with low-E coating',
          quantity: 2,
          unitPrice: 120.00,
          totalPrice: 240.00,
          glassType: 'toughened',
          thickness: '6mm',
          dimensions: '1180x980'
        }
      ];

      const hardwareDetails = [
        {
          lineNumber: 3,
          product: 'Window Gasket',
          description: 'EPDM rubber gasket for window sealing',
          quantity: 8,
          unitPrice: 12.50,
          totalPrice: 100.00,
          hardwareType: 'Gasket',
          specifications: 'EPDM rubber, black, 10mm profile'
        },
        {
          lineNumber: 4,
          product: 'Fixing Screws',
          description: 'Stainless steel fixing screws',
          quantity: 20,
          unitPrice: 2.50,
          totalPrice: 50.00,
          hardwareType: 'Fixing',
          specifications: 'M6x50mm stainless steel'
        }
      ];

      const extrasDetails = [
        {
          lineNumber: 5,
          product: 'Additional Sealant',
          description: 'Weather-resistant external sealant',
          quantity: 2,
          unitPrice: 15.00,
          totalPrice: 30.00
        }
      ];

      const status = Math.random() > 0.5 ? 'COMPLETED' : 'SCHEDULED';
      const workCompleted = status === 'COMPLETED';

      const template = await prisma.deliveryTemplate.create({
        data: {
          templateNumber: `DT-${String(i + 1).padStart(3, '0')}`,
          customerId: customer.id,
          jobId: job?.id,
          invoiceId: invoice.id,
          deliveryDate,
          deliveryAddress: customer.address || '123 Sample Street, Sample City, SC1 2AB',
          installationTeam: `Team ${String.fromCharCode(65 + (i % 5))}`,
          teamLeader: ['John Smith', 'Mike Johnson', 'David Brown', 'Chris Wilson', 'Paul Davis'][i % 5],
          productDetails,
          glassDetails,
          hardwareDetails,
          extrasDetails,
          installationNotes: 'Standard installation with weather sealing',
          specialRequirements: i % 3 === 0 ? 'Access via rear entrance only' : null,
          accessRequirements: i % 4 === 0 ? 'Parking permit required' : null,
          workCompleted,
          qualityChecked: workCompleted,
          customerSatisfied: workCompleted,
          customerSignature: workCompleted ? 'CustomerSignatureData123' : null,
          customerName: workCompleted ? `${customer.firstName} ${customer.lastName}` : null,
          signatureDate: workCompleted ? new Date() : null,
          beforePhotos: workCompleted ? ['before1.jpg', 'before2.jpg'] : [],
          afterPhotos: workCompleted ? ['after1.jpg', 'after2.jpg'] : [],
          installationPhotos: workCompleted ? ['install1.jpg', 'install2.jpg', 'install3.jpg'] : [],
          certificateGenerated: workCompleted,
          certificateUrl: workCompleted ? `/certificates/cert-${i + 1}.pdf` : null,
          status,
          completedAt: workCompleted ? new Date() : null
        }
      });

      deliveryTemplates.push(template);
    }

    console.log(`✅ Created ${deliveryTemplates.length} delivery templates`);

    // Create payment reminders
    console.log('📧 Creating payment reminders...');
    const overdueInvoices = invoices.filter(inv => inv.paymentStatus === 'OVERDUE');
    
    for (const invoice of overdueInvoices.slice(0, 5)) {
      const customer = customers.find(c => c.id === invoice.customerId);
      const daysPastDue = Math.floor((new Date() - invoice.dueDate) / (1000 * 60 * 60 * 24));
      
      let reminderType = 'FIRST_REMINDER';
      if (daysPastDue > 90) reminderType = 'FINAL_REMINDER';
      else if (daysPastDue > 60) reminderType = 'SECOND_REMINDER';

      await prisma.paymentReminder.create({
        data: {
          invoiceId: invoice.id,
          reminderType,
          reminderDate: new Date(),
          daysOverdue: daysPastDue,
          subject: `Payment Reminder - Invoice ${invoice.invoiceNumber}`,
          message: `Dear ${customer.firstName}, your payment of £${invoice.totalAmount} for invoice ${invoice.invoiceNumber} is now ${daysPastDue} days overdue.`,
          method: 'EMAIL',
          sent: Math.random() > 0.3,
          sentAt: Math.random() > 0.3 ? new Date() : null,
          automated: true
        }
      });
    }

    console.log('✅ Created payment reminders for overdue invoices');

    // Create compliance records
    console.log('📋 Creating compliance records...');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Create VAT and CIS records for the last 3 months
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const month = currentMonth - monthOffset;
      const year = month < 0 ? currentYear - 1 : currentYear;
      const adjustedMonth = month < 0 ? month + 12 : month;

      const period = `${year}-${String(adjustedMonth + 1).padStart(2, '0')}`;
      const vatDeadline = new Date(year, adjustedMonth + 1, 7);
      const cisDeadline = new Date(year, adjustedMonth + 1, 19);

      // VAT compliance record
      await prisma.complianceRecord.create({
        data: {
          invoiceId: invoices[monthOffset % invoices.length].id,
          complianceType: 'VAT_MONTHLY',
          period,
          submissionDeadline: vatDeadline,
          vatReturn: true,
          vatAmount: 1500 + (monthOffset * 200),
          submitted: monthOffset > 0,
          submittedDate: monthOffset > 0 ? new Date(year, adjustedMonth + 1, 5) : null,
          status: monthOffset > 0 ? 'SUBMITTED' : 'PENDING'
        }
      });

      // CIS compliance record
      if (monthOffset < 2) {
        await prisma.complianceRecord.create({
          data: {
            invoiceId: invoices[(monthOffset + 1) % invoices.length].id,
            complianceType: 'CIS_MONTHLY',
            period,
            submissionDeadline: cisDeadline,
            cisReturn: true,
            cisDeduction: 800 + (monthOffset * 100),
            submitted: monthOffset > 0,
            submittedDate: monthOffset > 0 ? new Date(year, adjustedMonth + 1, 17) : null,
            status: monthOffset > 0 ? 'SUBMITTED' : 'PENDING'
          }
        });
      }
    }

    console.log('✅ Created compliance records');

    // Create sample finance reports
    console.log('📊 Creating sample finance reports...');
    
    const totalInvoiceValue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPaidValue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalDrawdowns = invoices.reduce((sum, inv) => sum + (inv.drawdownAmount || 0), 0);

    await prisma.financeReport.create({
      data: {
        reportType: 'CASH_FLOW',
        period: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`,
        reportData: {
          invoices: invoices.slice(0, 5).map(inv => ({
            invoiceNumber: inv.invoiceNumber,
            amount: inv.totalAmount,
            status: inv.paymentStatus,
            customer: customers.find(c => c.id === inv.customerId)?.firstName
          }))
        },
        summary: {
          totalInvoiced: totalInvoiceValue,
          totalPaid: totalPaidValue,
          outstanding: totalInvoiceValue - totalPaidValue
        },
        totalInvoices: invoices.length,
        totalValue: totalInvoiceValue,
        totalDrawdowns: totalDrawdowns
      }
    });

    await prisma.financeReport.create({
      data: {
        reportType: 'DRAWDOWN_ANALYSIS',
        period: `${currentYear}-Q${Math.ceil((currentMonth + 1) / 3)}`,
        reportData: {
          drawdowns: invoices.filter(inv => inv.drawdownAmount).map(inv => ({
            invoiceNumber: inv.invoiceNumber,
            drawdownAmount: inv.drawdownAmount,
            feesAmount: inv.financeFeesAmount
          }))
        },
        summary: {
          totalDrawdowns: invoices.filter(inv => inv.drawdownAmount).length,
          totalAmount: totalDrawdowns,
          totalFees: invoices.reduce((sum, inv) => sum + (inv.financeFeesAmount || 0), 0)
        },
        totalDrawdowns: totalDrawdowns
      }
    });

    console.log('✅ Created sample finance reports');

    // Summary
    const summary = {
      invoices: invoices.length,
      deliveryTemplates: deliveryTemplates.length,
      financeDrawdowns: invoices.filter(inv => inv.drawdownAmount).length,
      paymentReminders: overdueInvoices.length,
      complianceRecords: 6, // 3 months × 2 types
      financeReports: 2
    };

    console.log('\n🎉 SFG TIME Finance Module seeding completed!');
    console.log('📊 Summary:');
    console.log(`   • ${summary.invoices} invoices created`);
    console.log(`   • ${summary.deliveryTemplates} delivery templates created`);
    console.log(`   • ${summary.financeDrawdowns} finance drawdowns created`);
    console.log(`   • ${summary.paymentReminders} payment reminders created`);
    console.log(`   • ${summary.complianceRecords} compliance records created`);
    console.log(`   • ${summary.financeReports} finance reports created`);
    console.log('\n💰 Finance Features Available:');
    console.log('   • Invoice Finance Management (80% drawdown, 3.967% fees)');
    console.log('   • Customer Classification (Types 1-4)');
    console.log('   • Payment Tracking (60/90 day reminders)');
    console.log('   • VAT/CIS Compliance automation');
    console.log('   • Delivery/Completion Templates with automatic product population');
    console.log('   • Professional completion certificates');
    console.log('   • Financial reporting and analytics');

    return summary;

  } catch (error) {
    console.error('❌ Error seeding finance data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedFinanceData()
    .then((summary) => {
      console.log('\n✅ Finance seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Finance seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedFinanceData };
