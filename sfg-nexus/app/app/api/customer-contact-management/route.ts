
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ContactRole } from '@prisma/client';

export const dynamic = "force-dynamic";

// Enhanced Customer Contact Management API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, customerId, contactData, formData } = body;

    switch (action) {
      case 'create_contact':
        return await createCustomerContact(customerId, contactData);
      
      case 'update_contact':
        return await updateCustomerContact(contactData.id, contactData);
      
      case 'validate_contact':
        return await validateCustomerContact(contactData.id, contactData.validationType);
      
      case 'process_form_submission':
        return await processCustomerFormSubmission(formData);
      
      case 'sync_xero_contacts':
        return await syncXeroContacts(customerId);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Customer Contact Management API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact management request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const role = searchParams.get('role');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const whereClause: any = { customerId };
    if (role) {
      whereClause.role = role;
    }

    const contacts = await prisma.customerContact.findMany({
      where: whereClause,
      include: {
        customer: true,
        sentCommunications: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        receivedCommunications: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: [
        { role: 'asc' },
        { contactName: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      contacts
    });

  } catch (error) {
    console.error('Get Customer Contacts Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve customer contacts' },
      { status: 500 }
    );
  }
}

// Create new customer contact
async function createCustomerContact(customerId: string, contactData: any) {
  // Validate customer exists
  const customer = await prisma.customer.findUnique({
    where: { id: customerId }
  });

  if (!customer) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404 }
    );
  }

  // Check for duplicate contacts
  const existingContact = await prisma.customerContact.findFirst({
    where: {
      customerId,
      email: contactData.email,
      role: contactData.role
    }
  });

  if (existingContact) {
    return NextResponse.json(
      { error: 'Contact with this email and role already exists' },
      { status: 409 }
    );
  }

  // Create new contact
  const contact = await prisma.customerContact.create({
    data: {
      customerId,
      contactName: contactData.contactName,
      role: contactData.role,
      email: contactData.email,
      phone: contactData.phone,
      mobile: contactData.mobile,
      officePhone: contactData.officePhone,
      preferredContactMethod: contactData.preferredContactMethod || 'EMAIL',
      whatsappEnabled: contactData.whatsappEnabled || false,
      whatsappNumber: contactData.whatsappNumber,
      emailNotifications: contactData.emailNotifications !== false,
      smsNotifications: contactData.smsNotifications || false,
      department: contactData.department,
      jobTitle: contactData.jobTitle,
      authority: contactData.authority,
      availability: contactData.availability,
      dataSource: contactData.dataSource || 'MANUAL_ENTRY'
    }
  });

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'CUSTOMER_CONTACT_CREATED',
      description: `New contact ${contact.contactName} (${contact.role}) added for customer`,
      user: 'System',
      metadata: {
        contactId: contact.id,
        customerId,
        role: contact.role
      }
    }
  });

  return NextResponse.json({
    success: true,
    contact,
    message: 'Customer contact created successfully'
  });
}

// Update existing customer contact
async function updateCustomerContact(contactId: string, contactData: any) {
  const existingContact = await prisma.customerContact.findUnique({
    where: { id: contactId }
  });

  if (!existingContact) {
    return NextResponse.json(
      { error: 'Contact not found' },
      { status: 404 }
    );
  }

  const updatedContact = await prisma.customerContact.update({
    where: { id: contactId },
    data: {
      contactName: contactData.contactName,
      role: contactData.role,
      email: contactData.email,
      phone: contactData.phone,
      mobile: contactData.mobile,
      officePhone: contactData.officePhone,
      preferredContactMethod: contactData.preferredContactMethod,
      whatsappEnabled: contactData.whatsappEnabled,
      whatsappNumber: contactData.whatsappNumber,
      emailNotifications: contactData.emailNotifications,
      smsNotifications: contactData.smsNotifications,
      department: contactData.department,
      jobTitle: contactData.jobTitle,
      authority: contactData.authority,
      availability: contactData.availability
    }
  });

  // Create activity log
  await prisma.activity.create({
    data: {
      type: 'CUSTOMER_CONTACT_UPDATED',
      description: `Contact ${updatedContact.contactName} information updated`,
      user: 'System',
      metadata: {
        contactId: updatedContact.id,
        customerId: updatedContact.customerId,
        changes: contactData
      }
    }
  });

  return NextResponse.json({
    success: true,
    contact: updatedContact,
    message: 'Customer contact updated successfully'
  });
}

// Validate customer contact information
async function validateCustomerContact(contactId: string, validationType: string) {
  const contact = await prisma.customerContact.findUnique({
    where: { id: contactId }
  });

  if (!contact) {
    return NextResponse.json(
      { error: 'Contact not found' },
      { status: 404 }
    );
  }

  let validationResult = { valid: false, message: '' };

  switch (validationType) {
    case 'email':
      validationResult = await validateEmail(contact.email ?? undefined);
      break;
    case 'phone':
      validationResult = await validatePhone(contact.phone ?? contact.mobile ?? undefined);
      break;
    case 'whatsapp':
      validationResult = await validateWhatsApp(contact.whatsappNumber ?? undefined);
      break;
    default:
      validationResult = { valid: false, message: 'Invalid validation type' };
  }

  if (validationResult.valid) {
    await prisma.customerContact.update({
      where: { id: contactId },
      data: {
        isValidated: true,
        validatedAt: new Date(),
        lastContactedAt: new Date()
      }
    });
  }

  return NextResponse.json({
    success: true,
    validation: validationResult,
    message: validationResult.valid ? 'Contact validated successfully' : 'Contact validation failed'
  });
}

// Process customer form submission
async function processCustomerFormSubmission(formData: any) {
  // Create form submission record
  const submission = await prisma.customerFormSubmission.create({
    data: {
      formId: formData.formId,
      formData: formData.data,
      submitterEmail: formData.data.email,
      submitterPhone: formData.data.phone,
      submitterName: formData.data.name || formData.data.contactName,
      status: 'PENDING',
      dataCompleteness: calculateDataCompleteness(formData.data),
      duplicateCheck: false
    }
  });

  // Check for duplicate customers
  const duplicateCheck = await checkForDuplicateCustomer(formData.data);
  
  if (duplicateCheck.isDuplicate) {
    await prisma.customerFormSubmission.update({
      where: { id: submission.id },
      data: {
        duplicateCheck: true,
        status: 'REQUIRES_REVIEW',
        validationErrors: {
          duplicate: duplicateCheck.matches
        }
      }
    });

    return NextResponse.json({
      success: true,
      submission,
      requiresReview: true,
      duplicateMatches: duplicateCheck.matches,
      message: 'Form submitted but requires review due to potential duplicates'
    });
  }

  // Auto-process if data is complete and no duplicates
  if (submission.dataCompleteness && submission.dataCompleteness > 80) {
    const processResult = await autoProcessFormSubmission(submission);
    return NextResponse.json({
      success: true,
      submission,
      autoProcessed: true,
      customer: processResult.customer,
      enquiry: processResult.enquiry,
      message: 'Form submitted and automatically processed'
    });
  }

  return NextResponse.json({
    success: true,
    submission,
    message: 'Form submitted successfully'
  });
}

// Sync contacts from Xero integration
async function syncXeroContacts(customerId: string) {
  // Mock Xero integration - replace with actual Xero API calls
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { customerContacts: true }
  });

  if (!customer) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404 }
    );
  }

  // Simulate Xero contact data
  const xeroContacts = await fetchXeroContacts(customer.accountNumber ?? undefined);
  
  let syncedContacts = [];
  for (const xeroContact of xeroContacts) {
    // Check if contact already exists
    const existingContact = customer.customerContacts.find(
      (c: any) => c.email === xeroContact.email
    );

    if (!existingContact) {
      const newContact = await prisma.customerContact.create({
        data: {
          customerId,
          contactName: xeroContact.name ?? undefined,
          role: mapXeroRoleToContactRole(xeroContact.role ?? undefined),
          email: xeroContact.email ?? undefined,
          phone: xeroContact.phone ?? undefined,
          dataSource: 'XERO_INTEGRATION',
          isValidated: true,
          validatedAt: new Date()
        }
      });
      syncedContacts.push(newContact);
    }
  }

  return NextResponse.json({
    success: true,
    syncedContacts,
    message: `Synced ${syncedContacts.length} contacts from Xero`
  });
}

// Helper functions
async function validateEmail(email?: string): Promise<{ valid: boolean; message: string }> {
  if (!email) return { valid: false, message: 'No email provided' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  // In real implementation, could check email deliverability
  return { valid: true, message: 'Email format is valid' };
}

async function validatePhone(phone?: string): Promise<{ valid: boolean; message: string }> {
  if (!phone) return { valid: false, message: 'No phone number provided' };
  
  // Basic UK phone number validation
  const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { valid: false, message: 'Invalid phone number format' };
  }

  return { valid: true, message: 'Phone number format is valid' };
}

async function validateWhatsApp(whatsappNumber?: string): Promise<{ valid: boolean; message: string }> {
  if (!whatsappNumber) return { valid: false, message: 'No WhatsApp number provided' };
  
  // In real implementation, would check WhatsApp Business API
  return { valid: true, message: 'WhatsApp number appears valid' };
}

function calculateDataCompleteness(data: any): number {
  const requiredFields = ['name', 'email', 'phone', 'company'];
  const optionalFields = ['projectDetails', 'address', 'website'];
  
  const requiredComplete = requiredFields.filter((field: any) => data[field]).length;
  const optionalComplete = optionalFields.filter((field: any) => data[field]).length;
  
  return ((requiredComplete / requiredFields.length) * 70) + 
         ((optionalComplete / optionalFields.length) * 30);
}

async function checkForDuplicateCustomer(data: any) {
  const duplicateChecks = [];
  
  // Check by email
  if (data.email) {
    const emailMatches = await prisma.customer.findMany({
      where: { email: data.email }
    });
    duplicateChecks.push(...emailMatches.map((c: any) => ({ customer: c, matchType: 'email' })));
  }
  
  // Check by company name
  if (data.company) {
    const companyMatches = await prisma.customer.findMany({
      where: { 
        company: {
          contains: data.company,
          mode: 'insensitive'
        }
      }
    });
    duplicateChecks.push(...companyMatches.map((c: any) => ({ customer: c, matchType: 'company' })));
  }

  return {
    isDuplicate: duplicateChecks.length > 0,
    matches: duplicateChecks
  };
}

async function autoProcessFormSubmission(submission: any) {
  const formData = submission.formData;
  
  // Create customer
  const customer = await prisma.customer.create({
    data: {
      firstName: formData.name || formData.firstName,
      lastName: formData.lastName,
      contactName: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      website: formData.website,
      customerType: 'PROSPECT',
      customerStatus: 'ACTIVE',
      source: 'DIGITAL_FORM',
      importSource: 'DIGITAL_FORM',
      importDate: new Date(),
      dataCompleteness: submission.dataCompleteness
    }
  });

  // Create enquiry if project details provided
  let enquiry = null;
  if (formData.projectDetails) {
    enquiry = await prisma.enquiry.create({
      data: {
        enquiryNumber: `ENQ-${Date.now()}`,
        customerName: customer.contactName || customer.firstName,
        contactName: formData.contactName || formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        description: formData.projectDetails,
        source: 'Digital Form',
        customerId: customer.id,
        status: 'NEW',
        priority: 'MEDIUM'
      }
    });
  }

  // Update submission as processed
  await prisma.customerFormSubmission.update({
    where: { id: submission.id },
    data: {
      status: 'PROCESSED',
      processedAt: new Date(),
      processedBy: 'Auto-Processing',
      customerCreated: true,
      customerId: customer.id,
      enquiryCreated: !!enquiry,
      enquiryId: enquiry?.id
    }
  });

  return { customer, enquiry };
}

async function fetchXeroContacts(accountNumber?: string) {
  // Mock Xero API call - replace with actual Xero integration
  return [
    {
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+44 20 7123 4567',
      role: 'AccountsContact'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+44 20 7123 4568',
      role: 'PrimaryContact'
    }
  ];
}

function mapXeroRoleToContactRole(xeroRole?: string): ContactRole {
  const roleMap: { [key: string]: ContactRole } = {
    'AccountsContact': ContactRole.FINANCE_CONTACT,
    'PrimaryContact': ContactRole.PRIMARY_CONTACT,
    'SalesContact': ContactRole.PRIMARY_CONTACT,
    'PurchaseContact': ContactRole.PURCHASING_MANAGER
  };
  return xeroRole ? (roleMap[xeroRole] || ContactRole.PRIMARY_CONTACT) : ContactRole.PRIMARY_CONTACT;
}
