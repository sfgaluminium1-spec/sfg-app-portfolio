
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files are supported' },
        { status: 400 }
      );
    }

    // Read and parse CSV content
    const csvContent = await file.text();
    const lines = csvContent.split('\n').filter((line: any) => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must contain headers and at least one data row' },
        { status: 400 }
      );
    }

    // Parse headers
    const headers = lines[0].split(',').map((header: any) => header.replace(/"/g, '').trim().toLowerCase());
    
    // Required fields mapping
    const fieldMapping: Record<string, string> = {
      'first name': 'firstName',
      'firstname': 'firstName',
      'last name': 'lastName',
      'lastname': 'lastName',
      'company': 'company',
      'company name': 'company',
      'email': 'email',
      'email address': 'email',
      'phone': 'phone',
      'phone number': 'phone',
      'address': 'address',
      'customer type': 'customerType',
      'type': 'customerType',
      'website': 'website'
    };

    // Find column indices
    const columnIndices: Record<string, number> = {};
    headers.forEach((header, index) => {
      const mappedField = fieldMapping[header];
      if (mappedField) {
        columnIndices[mappedField] = index;
      }
    });

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'company', 'email'];
    const missingFields = requiredFields.filter((field: any) => columnIndices[field] === undefined);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required columns: ${missingFields.join(', ')}`,
          requiredHeaders: 'First Name, Last Name, Company, Email, Phone (optional), Address (optional), Customer Type (optional), Website (optional)'
        },
        { status: 400 }
      );
    }

    // Parse data rows
    const customers = [];
    const errors = [];
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const row = lines[i].split(',').map((cell: any) => cell.replace(/"/g, '').trim());
        
        if (row.length < headers.length) {
          errors.push(`Row ${i + 1}: Incomplete data`);
          continue;
        }

        const customerData = {
          firstName: row[columnIndices.firstName] || '',
          lastName: row[columnIndices.lastName] || '',
          company: row[columnIndices.company] || '',
          email: row[columnIndices.email] || '',
          phone: columnIndices.phone !== undefined ? row[columnIndices.phone] || undefined : undefined,
          address: columnIndices.address !== undefined ? row[columnIndices.address] || undefined : undefined,
          website: columnIndices.website !== undefined ? row[columnIndices.website] || undefined : undefined,
          customerType: columnIndices.customerType !== undefined ? row[columnIndices.customerType] || 'PROSPECT' : 'PROSPECT',
        };

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerData.email)) {
          errors.push(`Row ${i + 1}: Invalid email format`);
          continue;
        }

        // Validate required fields are not empty
        if (!customerData.firstName || !customerData.lastName || !customerData.company || !customerData.email) {
          errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        customers.push(customerData);
      } catch (error) {
        errors.push(`Row ${i + 1}: Error parsing data - ${error}`);
      }
    }

    if (customers.length === 0) {
      return NextResponse.json(
        { 
          error: 'No valid customers found in CSV file',
          errors
        },
        { status: 400 }
      );
    }

    // Import customers to database
    const results = {
      successful: 0,
      failed: 0,
      duplicates: 0,
      errors: [...errors]
    };

    for (const customerData of customers) {
      try {
        // Check for existing customer by email
        const existingCustomer = await prisma.customer.findUnique({
          where: { email: customerData.email.toLowerCase() }
        });

        if (existingCustomer) {
          results.duplicates++;
          results.errors.push(`Customer with email ${customerData.email} already exists`);
          continue;
        }

        // Create new customer
        await prisma.customer.create({
          data: {
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            contactName: `${customerData.firstName} ${customerData.lastName}`,
            company: customerData.company,
            email: customerData.email.toLowerCase(),
            phone: customerData.phone,
            address: customerData.address,
            website: customerData.website,
            customerType: customerData.customerType.toUpperCase() as any,
            customerStatus: 'ACTIVE',
            creditStatus: 'GOOD',
            dataCompleteness: calculateDataCompleteness(customerData)
          }
        });

        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to import customer ${customerData.email}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed. ${results.successful} customers imported successfully.`,
      results
    });

  } catch (error) {
    console.error('Customer import error:', error);
    return NextResponse.json(
      { error: 'Failed to process import file' },
      { status: 500 }
    );
  }
}

function calculateDataCompleteness(customerData: any): number {
  const fields = ['firstName', 'lastName', 'company', 'email', 'phone', 'address', 'website'];
  const filledFields = fields.filter((field: any) => customerData[field] && customerData[field].trim() !== '').length;
  return Math.round((filledFields / fields.length) * 100);
}
