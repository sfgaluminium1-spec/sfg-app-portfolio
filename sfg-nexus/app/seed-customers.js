
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedCustomers() {
  try {
    console.log('🚀 Starting customer seeding...');

    // Create test customers
    const customers = [
      {
        email: 'john.doe@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Doe Construction Ltd',
        phone: '01234 567890'
      },
      {
        email: 'sarah.smith@techcorp.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Smith',
        company: 'TechCorp Solutions',
        phone: '01234 567891'
      },
      {
        email: 'mike.johnson@retail.co.uk',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Johnson',
        company: 'Johnson Retail Group',
        phone: '01234 567892'
      }
    ];

    // Clear existing customers
    await prisma.customerSession.deleteMany();
    await prisma.customer.deleteMany();

    // Create customers
    for (const customerData of customers) {
      const hashedPassword = await bcrypt.hash(customerData.password, 12);
      
      const customer = await prisma.customer.create({
        data: {
          ...customerData,
          password: hashedPassword
        }
      });
      
      console.log(`✅ Created customer: ${customer.firstName} ${customer.lastName} (${customer.email})`);
    }

    // Create some sample enquiries, quotes, and jobs linked to customers
    const allCustomers = await prisma.customer.findMany();
    
    // Create sample enquiries
    for (let i = 0; i < 3; i++) {
      const customer = allCustomers[i % allCustomers.length];
      
      const enquiry = await prisma.enquiry.create({
        data: {
          enquiryNumber: `ENQ-24${(1000 + i).toString()}`,
          customerName: `${customer.firstName} ${customer.lastName}`,
          contactName: customer.firstName,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          projectName: `Project ${i + 1}`,
          description: `Sample project description for customer ${customer.firstName}`,
          source: 'Website',
          status: i === 0 ? 'NEW' : i === 1 ? 'QUOTED' : 'WON',
          customerId: customer.id
        }
      });
      
      console.log(`✅ Created enquiry: ${enquiry.enquiryNumber} for ${customer.firstName}`);
      
      // Create a quote for each enquiry
      const quote = await prisma.quote.create({
        data: {
          quoteNumber: `QUO-24${(1000 + i).toString()}`,
          customerName: `${customer.firstName} ${customer.lastName}`,
          projectName: enquiry.projectName,
          contactName: customer.firstName,
          value: 5000 + (i * 2500),
          status: i === 0 ? 'PENDING' : i === 1 ? 'SENT' : 'WON',
          enquiryId: enquiry.id,
          customerId: customer.id
        }
      });
      
      console.log(`✅ Created quote: ${quote.quoteNumber} for £${quote.value}`);
      
      // Create a job for won quotes
      if (quote.status === 'WON') {
        const job = await prisma.job.create({
          data: {
            jobNumber: `JOB-24${(1000 + i).toString()}`,
            client: `${customer.firstName} ${customer.lastName}`,
            site: customer.company || 'Customer Site',
            description: enquiry.description || 'Installation project',
            value: quote.value,
            status: 'APPROVED',
            quoteId: quote.id,
            customerId: customer.id,
            installationDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) // 30 days from now
          }
        });
        
        console.log(`✅ Created job: ${job.jobNumber} for ${customer.firstName}`);
      }
    }

    console.log('🎉 Customer seeding completed successfully!');
    console.log(`📊 Created ${allCustomers.length} customers with sample data`);
    console.log('\n📝 Test Login Credentials:');
    console.log('Email: john.doe@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Error seeding customers:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedCustomers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
