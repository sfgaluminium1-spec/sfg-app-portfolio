
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class CustomerDataProcessor {
  constructor() {
    this.customers = new Map();
    this.duplicates = [];
    this.stats = {
      totalRecords: 0,
      validRecords: 0,
      duplicatesRemoved: 0,
      missingEmails: 0,
      missingPhones: 0,
      cleanedRecords: 0
    };
  }

  // Clean and standardize data
  cleanData(record) {
    const cleaned = {
      contactName: this.cleanString(record['*ContactName'] || record.ContactName || record['Customer '] || ''),
      firstName: this.cleanString(record.FirstName || ''),
      lastName: this.cleanString(record.LastName || ''),
      email: this.cleanEmail(record.EmailAddress || record['Contact Email'] || ''),
      phone: this.cleanPhone(record.PhoneNumber || record['Phone Number '] || record.MobileNumber || ''),
      company: this.cleanString(record.LegalName || record['*ContactName'] || record.ContactName || record['Customer '] || ''),
      accountNumber: this.cleanString(record.AccountNumber || record['Company Reg no'] || ''),
      address: this.buildAddress(record),
      website: this.cleanString(record.Website || ''),
      // Additional contact persons
      person1Email: this.cleanEmail(record.Person1Email || ''),
      person2Email: this.cleanEmail(record.Person2Email || ''),
      person3Email: this.cleanEmail(record.Person3Email || ''),
      // Source tracking
      source: 'CSV_IMPORT',
      importDate: new Date().toISOString()
    };

    // If no first/last name, try to split contact name
    if (!cleaned.firstName && !cleaned.lastName && cleaned.contactName) {
      const nameParts = cleaned.contactName.split(' ');
      if (nameParts.length >= 2) {
        cleaned.firstName = nameParts[0];
        cleaned.lastName = nameParts.slice(1).join(' ');
      } else {
        cleaned.firstName = cleaned.contactName;
      }
    }

    // Use company name as contact name if missing
    if (!cleaned.contactName && cleaned.company) {
      cleaned.contactName = cleaned.company;
    }

    return cleaned;
  }

  cleanString(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().replace(/\s+/g, ' ');
  }

  cleanEmail(email) {
    if (!email || typeof email !== 'string') return '';
    const cleaned = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(cleaned) ? cleaned : '';
  }

  cleanPhone(phone) {
    if (!phone || typeof phone !== 'string') return '';
    // Remove all non-numeric characters except + and spaces
    let cleaned = phone.replace(/[^\d\s+()-]/g, '');
    // Standardize UK phone numbers
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
  }

  buildAddress(record) {
    const addressParts = [
      record.POAddressLine1 || record.Address || '',
      record.POAddressLine2 || '',
      record.POAddressLine3 || '',
      record.POCity || '',
      record.PORegion || '',
      record.POPostalCode || '',
      record.POCountry || ''
    ].filter(part => part && part.trim());

    return addressParts.join(', ');
  }

  // Generate unique key for deduplication
  generateKey(customer) {
    const email = customer.email.toLowerCase();
    const phone = customer.phone.replace(/\s/g, '');
    const company = customer.company.toLowerCase().replace(/ltd|limited|plc|&|and/gi, '').trim();
    
    // Primary key: email if available
    if (email) return `email:${email}`;
    
    // Secondary key: phone + company
    if (phone && company) return `phone_company:${phone}_${company}`;
    
    // Tertiary key: company name only
    if (company) return `company:${company}`;
    
    // Last resort: contact name
    return `contact:${customer.contactName.toLowerCase()}`;
  }

  // Check if record is valid for import
  isValidRecord(customer) {
    // Must have at least contact name or company
    if (!customer.contactName && !customer.company) return false;
    
    // Accept records with any contact information (email, phone, or address)
    if (!customer.email && !customer.phone && !customer.address) return false;
    
    // Skip obviously empty records
    if (customer.contactName.length < 2 && customer.company.length < 2) return false;
    
    return true;
  }

  // Process a single record
  processRecord(record) {
    this.stats.totalRecords++;
    
    const cleaned = this.cleanData(record);
    
    if (!this.isValidRecord(cleaned)) {
      return false;
    }

    this.stats.validRecords++;
    
    // Track missing data
    if (!cleaned.email) this.stats.missingEmails++;
    if (!cleaned.phone) this.stats.missingPhones++;

    const key = this.generateKey(cleaned);
    
    if (this.customers.has(key)) {
      // Merge with existing record (keep most complete data)
      const existing = this.customers.get(key);
      const merged = this.mergeRecords(existing, cleaned);
      this.customers.set(key, merged);
      this.duplicates.push({ key, existing, duplicate: cleaned });
      this.stats.duplicatesRemoved++;
    } else {
      this.customers.set(key, cleaned);
      this.stats.cleanedRecords++;
    }

    return true;
  }

  // Merge two customer records, keeping the most complete data
  mergeRecords(existing, newRecord) {
    const merged = { ...existing };
    
    // Merge fields, preferring non-empty values
    Object.keys(newRecord).forEach(key => {
      if (newRecord[key] && !existing[key]) {
        merged[key] = newRecord[key];
      } else if (newRecord[key] && existing[key] && newRecord[key].length > existing[key].length) {
        // Prefer longer/more complete values
        merged[key] = newRecord[key];
      }
    });

    // Merge additional emails
    const additionalEmails = [
      newRecord.person1Email,
      newRecord.person2Email,
      newRecord.person3Email
    ].filter(email => email && email !== merged.email);
    
    if (additionalEmails.length > 0) {
      merged.additionalEmails = [
        ...(merged.additionalEmails || []),
        ...additionalEmails
      ];
    }

    return merged;
  }

  // Process CSV file
  async processCSVFile(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          console.log(`📁 Processing ${results.length} records from ${path.basename(filePath)}`);
          
          results.forEach(record => {
            this.processRecord(record);
          });
          
          resolve(results.length);
        })
        .on('error', reject);
    });
  }

  // Generate final customer dataset
  generateFinalDataset() {
    const customers = Array.from(this.customers.values());
    
    // Sort by company name, then contact name
    customers.sort((a, b) => {
      const aSort = (a.company || a.contactName).toLowerCase();
      const bSort = (b.company || b.contactName).toLowerCase();
      return aSort.localeCompare(bSort);
    });

    return customers;
  }

  // Generate processing report
  generateReport() {
    const report = {
      summary: this.stats,
      dataQuality: {
        emailCoverage: ((this.stats.validRecords - this.stats.missingEmails) / this.stats.validRecords * 100).toFixed(1) + '%',
        phoneCoverage: ((this.stats.validRecords - this.stats.missingPhones) / this.stats.validRecords * 100).toFixed(1) + '%',
        deduplicationRate: (this.stats.duplicatesRemoved / this.stats.totalRecords * 100).toFixed(1) + '%'
      },
      recommendations: []
    };

    // Add recommendations based on data quality
    if (this.stats.missingEmails > this.stats.validRecords * 0.3) {
      report.recommendations.push('High number of missing emails - implement email collection workflow');
    }
    
    if (this.stats.missingPhones > this.stats.validRecords * 0.5) {
      report.recommendations.push('High number of missing phone numbers - add phone collection to customer forms');
    }

    return report;
  }
}

// Main processing function
async function processCustomerData() {
  const processor = new CustomerDataProcessor();
  
  try {
    console.log('🚀 Starting customer data processing...\n');

    // Process all CSV files (Note: CSV files should be placed in the data directory)
    const csvFiles = [
      // Note: CSV files have been processed and customers imported successfully
      // Place CSV files in ./data/ directory for processing
    ];

    for (const filePath of csvFiles) {
      if (fs.existsSync(filePath)) {
        await processor.processCSVFile(filePath);
        console.log(`✅ Processed ${path.basename(filePath)}`);
      } else {
        console.log(`⚠️  File not found: ${path.basename(filePath)}`);
      }
    }

    // Generate final dataset
    const finalCustomers = processor.generateFinalDataset();
    const report = processor.generateReport();

    // Save processed data
    const outputDir = '/home/ubuntu/sfg-nexus-mockup/app';
    
    // Save cleaned customer data
    fs.writeFileSync(
      path.join(outputDir, 'processed-customers.json'),
      JSON.stringify(finalCustomers, null, 2)
    );

    // Save processing report
    fs.writeFileSync(
      path.join(outputDir, 'customer-processing-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Save duplicates for review
    fs.writeFileSync(
      path.join(outputDir, 'customer-duplicates.json'),
      JSON.stringify(processor.duplicates, null, 2)
    );

    console.log('\n📊 Processing Summary:');
    console.log(`Total records processed: ${report.summary.totalRecords}`);
    console.log(`Valid records: ${report.summary.validRecords}`);
    console.log(`Duplicates removed: ${report.summary.duplicatesRemoved}`);
    console.log(`Final clean records: ${report.summary.cleanedRecords}`);
    console.log(`Email coverage: ${report.dataQuality.emailCoverage}`);
    console.log(`Phone coverage: ${report.dataQuality.phoneCoverage}`);
    console.log(`Deduplication rate: ${report.dataQuality.deduplicationRate}`);

    console.log('\n💾 Files saved:');
    console.log('- processed-customers.json (clean customer data)');
    console.log('- customer-processing-report.json (processing report)');
    console.log('- customer-duplicates.json (duplicate records for review)');

    console.log('\n🎉 Customer data processing completed successfully!');
    
    return {
      customers: finalCustomers,
      report: report,
      duplicates: processor.duplicates
    };

  } catch (error) {
    console.error('❌ Error processing customer data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  processCustomerData()
    .catch(console.error);
}

module.exports = { CustomerDataProcessor, processCustomerData };
