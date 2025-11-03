
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to extract product details from quote/job
async function extractProductDetails(jobId?: string, quoteId?: string) {
  let productDetails: any[] = [];
  let glassDetails: any[] = [];
  let hardwareDetails: any[] = [];
  let extrasDetails: any[] = [];

  if (jobId) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        quote: {
          include: {
            lineItems: true
          }
        }
      }
    });

    if (job?.quote?.lineItems) {
      job.quote.lineItems.forEach((item: any) => {
        const product = {
          lineNumber: item.lineNumber,
          product: item.product,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        };

        productDetails.push(product);

        // Categorize items
        if (item.product.toLowerCase().includes('glass') || 
            item.description.toLowerCase().includes('glass')) {
          glassDetails.push({
            ...product,
            glassType: extractGlassType(item.description),
            thickness: extractThickness(item.description),
            dimensions: extractDimensions(item.description)
          });
        } else if (item.product.toLowerCase().includes('gasket') ||
                   item.product.toLowerCase().includes('seal') ||
                   item.product.toLowerCase().includes('fixing')) {
          hardwareDetails.push({
            ...product,
            hardwareType: categorizeHardware(item.product),
            specifications: item.description
          });
        } else if (item.product.toLowerCase().includes('extra') ||
                   item.description.toLowerCase().includes('additional')) {
          extrasDetails.push({
            ...product,
            extraType: 'Additional Item',
            specifications: item.description
          });
        }
      });
    }
  } else if (quoteId) {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        lineItems: true
      }
    });

    if (quote?.lineItems) {
      quote.lineItems.forEach((item: any) => {
        const product = {
          lineNumber: item.lineNumber,
          product: item.product,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        };

        productDetails.push(product);

        // Similar categorization logic as above
        if (item.product.toLowerCase().includes('glass')) {
          glassDetails.push({
            ...product,
            glassType: extractGlassType(item.description),
            thickness: extractThickness(item.description),
            dimensions: extractDimensions(item.description)
          });
        } else if (item.product.toLowerCase().includes('gasket') ||
                   item.product.toLowerCase().includes('seal')) {
          hardwareDetails.push({
            ...product,
            hardwareType: categorizeHardware(item.product),
            specifications: item.description
          });
        }
      });
    }
  }

  return {
    productDetails,
    glassDetails,
    hardwareDetails,
    extrasDetails
  };
}

// Helper functions for product detail extraction
function extractGlassType(description: string): string {
  const glassTypes = ['toughened', 'laminated', 'double glazed', 'triple glazed', 'low-e'];
  for (const type of glassTypes) {
    if (description.toLowerCase().includes(type)) {
      return type;
    }
  }
  return 'standard';
}

function extractThickness(description: string): string {
  const thicknessMatch = description.match(/(\d+)mm/);
  return thicknessMatch ? `${thicknessMatch[1]}mm` : 'standard';
}

function extractDimensions(description: string): string {
  const dimensionMatch = description.match(/(\d+)\s*x\s*(\d+)/);
  return dimensionMatch ? `${dimensionMatch[1]} x ${dimensionMatch[2]}` : 'as specified';
}

function categorizeHardware(product: string): string {
  if (product.toLowerCase().includes('gasket')) return 'Gasket';
  if (product.toLowerCase().includes('seal')) return 'Seal';
  if (product.toLowerCase().includes('fixing')) return 'Fixing';
  if (product.toLowerCase().includes('handle')) return 'Handle';
  if (product.toLowerCase().includes('hinge')) return 'Hinge';
  return 'Hardware';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { templateNumber: { contains: search, mode: 'insensitive' } },
        { customer: { firstName: { contains: search, mode: 'insensitive' } } },
        { customer: { lastName: { contains: search, mode: 'insensitive' } } },
        { customer: { company: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [templates, total] = await Promise.all([
      prisma.deliveryTemplate.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              company: true,
              email: true,
              phone: true
            }
          },
          job: {
            select: {
              id: true,
              jobNumber: true,
              description: true
            }
          },
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              totalAmount: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.deliveryTemplate.count({ where })
    ]);

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching delivery templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate template number
    const lastTemplate = await prisma.deliveryTemplate.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { templateNumber: true }
    });

    let templateNumber = 'DT-001';
    if (lastTemplate) {
      const lastNumber = parseInt(lastTemplate.templateNumber.split('-')[1]);
      templateNumber = `DT-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Extract product details automatically
    const productData = await extractProductDetails(data.jobId, data.invoice?.quoteId);

    // Create delivery template
    const template = await prisma.deliveryTemplate.create({
      data: {
        templateNumber,
        customerId: data.customerId,
        jobId: data.jobId,
        invoiceId: data.invoiceId,
        deliveryDate: new Date(data.deliveryDate),
        deliveryAddress: data.deliveryAddress,
        installationTeam: data.installationTeam,
        teamLeader: data.teamLeader,
        productDetails: productData.productDetails,
        glassDetails: productData.glassDetails,
        hardwareDetails: productData.hardwareDetails,
        extrasDetails: productData.extrasDetails,
        installationNotes: data.installationNotes,
        specialRequirements: data.specialRequirements,
        accessRequirements: data.accessRequirements
      },
      include: {
        customer: true,
        job: true,
        invoice: true
      }
    });

    return NextResponse.json(template, { status: 201 });

  } catch (error) {
    console.error('Error creating delivery template:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery template' },
      { status: 500 }
    );
  }
}
