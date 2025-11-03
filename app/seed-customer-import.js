
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Helper function to calculate data completeness
function calculateDataCompleteness(customer) {
  const fields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'company',
    'address',
    'website'
  ];
  
  const completedFields = fields.filter(field => 
    customer[field] && customer[field].toString().trim().length > 0
  ).length;
  
  return Math.round((completedFields / fields.length) * 100);
}

// Determine customer type based on data
function determineCustomerType(customer) {
  // If they have quotes or jobs, they're active customers
  if (customer.hasQuotes || customer.hasJobs) {
    return 'ACTIVE_CUSTOMER';
  }
  
  // If they have enquiries, they're leads
  if (customer.hasEnquiries) {
    return 'LEAD';
  }
  
  // Otherwise, they're prospects
  return 'PROSPECT';
}

// Determine customer status
function determineCustomerStatus(customer) {
  // Most imported customers should be active
  return 'ACTIVE';
}

// Determine credit status based on available data
function determineCreditStatus(customer) {
  // Default to good credit for established companies
  if (customer.company && customer.company.length > 0) {
    return 'GOOD';
  }
  return 'FAIR';
}

async function importCustomers() {
  try {
    console.log('🚀 Starting customer import from processed data...');

    // Read processed customer data
    const processedDataPath = path.join(__dirname, 'processed-customers.json');
    
    if (!fs.existsSync(processedDataPath)) {
      console.error('❌ Processed customer data not found. Please run process-customer-data.js first.');
      return;
    }

    const processedCustomers = JSON.parse(fs.readFileSync(processedDataPath, 'utf8'));
    console.log(`📊 Found ${processedCustomers.length} processed customers to import`);

    // Clear existing imported customers (keep manually created ones)
    await prisma.customerActivity.deleteMany({
      where: {
        customer: {
          importSource: 'CSV_IMPORT'
        }
      }
    });

    await prisma.customerValidation.deleteMany({
      where: {
        customer: {
          importSource: 'CSV_IMPORT'
        }
      }
    });

    await prisma.customer.deleteMany({
      where: {
        importSource: 'CSV_IMPORT'
      }
    });

    console.log('🧹 Cleared existing imported customers');

    let importedCount = 0;
    let skippedCount = 0;
    const errors = [];

    // Import customers in batches
    const batchSize = 50;
    for (let i = 0; i < processedCustomers.length; i += batchSize) {
      const batch = processedCustomers.slice(i, i + batchSize);
      
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(processedCustomers.length / batchSize)}`);

      for (const customerData of batch) {
        try {
          // Prepare customer data for database
          const dataCompleteness = calculateDataCompleteness(customerData);
          
          const customerRecord = {
            firstName: customerData.firstName || customerData.contactName?.split(' ')[0] || 'Unknown',
            lastName: customerData.lastName || (customerData.contactName?.split(' ').slice(1).join(' ')) || '',
            contactName: customerData.contactName || `${customerData.firstName} ${customerData.lastName}`.trim(),
            company: customerData.company || null,
            email: customerData.email || null,
            phone: customerData.phone || null,
            address: customerData.address || null,
            website: customerData.website || null,
            accountNumber: customerData.accountNumber || null,
            
            // Classification
            customerType: determineCustomerType(customerData),
            customerStatus: determineCustomerStatus(customerData),
            creditStatus: determineCreditStatus(customerData),
            source: 'CSV_IMPORT',
            
            // Data quality
            dataCompleteness: dataCompleteness,
            emailValidated: false,
            phoneValidated: false,
            addressValidated: false,
            
            // Import tracking
            importSource: 'CSV_IMPORT',
            importDate: new Date(customerData.importDate),
            
            // Additional data
            additionalEmails: [
              customerData.person1Email,
              customerData.person2Email,
              customerData.person3Email
            ].filter(email => email && email.length > 0),
            
            // Portal access (disabled by default for imported customers)
            portalAccess: false,
            emailNotifications: true,
            smsNotifications: false
          };

          // Create customer
          const customer = await prisma.customer.create({
            data: customerRecord
          });

          // Create initial activity
          await prisma.customerActivity.create({
            data: {
              customerId: customer.id,
              activityType: 'CUSTOMER_CREATED',
              description: `Customer imported from CSV: ${customer.contactName}`,
              performedBy: 'System',
              source: 'SYSTEM',
              details: {
                importSource: 'CSV_IMPORT',
                originalData: customerData
              }
            }
          });

          // Create validation record
          await prisma.customerValidation.create({
            data: {
              customerId: customer.id,
              emailValidation: customer.email ? 'PENDING' : 'SKIPPED',
              phoneValidation: customer.phone ? 'PENDING' : 'SKIPPED',
              addressValidation: customer.address ? 'PENDING' : 'SKIPPED',
              businessValidation: customer.company ? 'PENDING' : 'SKIPPED',
              overallStatus: 'PENDING'
            }
          });

          importedCount++;

        } catch (error) {
          console.error(`❌ Error importing customer ${customerData.contactName}:`, error.message);
          errors.push({
            customer: customerData.contactName,
            error: error.message
          });
          skippedCount++;
        }
      }

      // Small delay between batches to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Generate import summary
    const summary = {
      totalProcessed: processedCustomers.length,
      imported: importedCount,
      skipped: skippedCount,
      errors: errors.length,
      importDate: new Date().toISOString()
    };

    // Save import summary
    fs.writeFileSync(
      path.join(__dirname, 'customer-import-summary.json'),
      JSON.stringify(summary, null, 2)
    );

    // Save errors if any
    if (errors.length > 0) {
      fs.writeFileSync(
        path.join(__dirname, 'customer-import-errors.json'),
        JSON.stringify(errors, null, 2)
      );
    }

    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${importedCount} customers`);
    console.log(`⚠️  Skipped: ${skippedCount} customers`);
    console.log(`❌ Errors: ${errors.length} customers`);
    
    if (errors.length > 0) {
      console.log('\n❌ Import Errors:');
      errors.slice(0, 5).forEach(error => {
        console.log(`- ${error.customer}: ${error.error}`);
      });
      if (errors.length > 5) {
        console.log(`... and ${errors.length - 5} more errors (see customer-import-errors.json)`);
      }
    }

    // Get some statistics
    const stats = await prisma.customer.groupBy({
      by: ['customerType', 'customerStatus'],
      where: {
        importSource: 'CSV_IMPORT'
      },
      _count: true
    });

    console.log('\n📈 Customer Statistics:');
    stats.forEach(stat => {
      console.log(`${stat.customerType} (${stat.customerStatus}): ${stat._count} customers`);
    });

    // Data quality statistics
    const qualityStats = await prisma.customer.aggregate({
      where: {
        importSource: 'CSV_IMPORT'
      },
      _avg: {
        dataCompleteness: true
      },
      _count: {
        email: true,
        phone: true,
        address: true,
        company: true
      }
    });

    console.log('\n📊 Data Quality:');
    console.log(`Average data completeness: ${qualityStats._avg.dataCompleteness?.toFixed(1)}%`);
    console.log(`Customers with email: ${qualityStats._count.email}`);
    console.log(`Customers with phone: ${qualityStats._count.phone}`);
    console.log(`Customers with address: ${qualityStats._count.address}`);
    console.log(`Customers with company: ${qualityStats._count.company}`);

    console.log('\n🎉 Customer import completed successfully!');
    console.log('💾 Files saved:');
    console.log('- customer-import-summary.json');
    if (errors.length > 0) {
      console.log('- customer-import-errors.json');
    }

  } catch (error) {
    console.error('❌ Error during customer import:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  importCustomers()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

module.exports = { importCustomers };
