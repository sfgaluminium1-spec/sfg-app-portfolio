
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { JobNumberGenerator } from '@/lib/job-number-generator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const where = status ? { status: status as any } : {};
    
    const quotes = await prisma.quote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        enquiry: true,
        jobs: true,
        documents: true,
        lineItems: {
          orderBy: { lineNumber: 'asc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('Quotes API error:', error);
    
    // Return mock data if database is not ready
    return NextResponse.json({ quotes: [
      {
        id: '1',
        quoteNumber: '21471',
        revision: 0,
        customerName: 'Lodestone Projects',
        projectName: 'SBS Northampton',
        contactName: 'Matt Ellis',
        productType: 'Glass Replacement',
        quotedBy: 'Warren',
        quoteDate: new Date('2025-01-03'),
        dueDate: new Date('2025-01-17'),
        value: 1377.00,
        status: 'WON',
        quoteType: 'Supply & Fit'
      },
      {
        id: '2',
        quoteNumber: '21472',
        revision: 1,
        customerName: 'True Fix Solution',
        projectName: 'Birmingham Warehouse Repair',
        contactName: 'Sarah Johnson',
        productType: 'Emergency Glazing',
        quotedBy: 'Neil',
        quoteDate: new Date('2025-01-05'),
        dueDate: new Date('2025-01-19'),
        value: 2850.00,
        revisedPrice: 2650.00,
        status: 'SENT',
        quoteType: 'Supply & Fit'
      }
    ]});
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quoteNumber = JobNumberGenerator.generateQuoteNumber();
    
    // Customer validation and handling
    let customerId = body.customerId;
    let customerValidated = false;
    let newCustomerRequestId = null;
    
    // If customer ID is provided, validate it exists
    if (customerId) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { id: customerId }
      });
      
      if (!existingCustomer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }
      
      customerValidated = true;
      
      // Update customer activity
      await prisma.customerActivity.create({
        data: {
          customerId: existingCustomer.id,
          activityType: 'QUOTE_REQUESTED',
          description: `Quote requested: ${body.projectName || 'New project'}`,
          performedBy: body.quotedBy || 'System',
          source: 'SYSTEM'
        }
      });
    } else if (body.customer) {
      // Try to find existing customer by name, email, or phone
      const searchCriteria = [];
      
      if (body.customerEmail) {
        searchCriteria.push({ email: body.customerEmail });
      }
      
      if (body.customerPhone) {
        searchCriteria.push({ phone: body.customerPhone });
      }
      
      // Search by company name or contact name
      searchCriteria.push(
        { company: { contains: body.customer, mode: 'insensitive' as any } },
        { contactName: { contains: body.customer, mode: 'insensitive' as any } },
        { 
          AND: [
            { firstName: { contains: body.customer.split(' ')[0], mode: 'insensitive' as any } },
            { lastName: { contains: body.customer.split(' ').slice(1).join(' '), mode: 'insensitive' as any } }
          ]
        }
      );
      
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          OR: searchCriteria,
          isActive: true
        }
      });
      
      if (existingCustomer) {
        customerId = existingCustomer.id;
        customerValidated = true;
        
        // Update customer activity
        await prisma.customerActivity.create({
          data: {
            customerId: existingCustomer.id,
            activityType: 'QUOTE_REQUESTED',
            description: `Quote requested: ${body.projectName || 'New project'}`,
            performedBy: body.quotedBy || 'System',
            source: 'SYSTEM'
          }
        });
      } else {
        // Create new customer request for information gathering
        const newCustomerRequest = await prisma.newCustomerRequest.create({
          data: {
            customerName: body.customer,
            contactEmail: body.customerEmail,
            contactPhone: body.customerPhone,
            company: body.customerCompany,
            projectDetails: body.projectName || body.description,
            status: 'PENDING',
            priority: 'MEDIUM',
            requestNotes: `New customer request from quote: ${body.projectName || 'Unnamed project'}`,
            assignedTo: body.quotedBy
          }
        });
        
        newCustomerRequestId = newCustomerRequest.id;
        customerValidated = false;
      }
    }
    
    // Map quote type to enum
    const quoteTypeMapping: { [key: string]: string } = {
      'Supply Only': 'SUPPLY_ONLY',
      'Supply & Fit': 'SUPPLY_AND_INSTALL',
      'Supply & Install': 'SUPPLY_AND_INSTALL',
      'Labour Only': 'LABOUR_ONLY',
      'Maintenance': 'MAINTENANCE',
      'Emergency Repair': 'EMERGENCY_REPAIR'
    };

    // Map product type to enum
    const productTypeMapping: { [key: string]: string } = {
      'Standard Fabrication': 'STANDARD_FABRICATION',
      'Bespoke': 'BESPOKE',
      'Bought In Item': 'BOUGHT_IN_ITEM',
      'Merged Design': 'MERGED_DESIGN'
    };

    const quoteTypeEnum = quoteTypeMapping[body.quoteType] || 'SUPPLY_AND_INSTALL';
    const productTypeEnum = productTypeMapping[body.productTypeClassification] || 'STANDARD_FABRICATION';
    
    // Get quote type rule for markup calculation
    const quoteTypeRule = await prisma.quoteTypeRule.findFirst({
      where: { 
        quoteType: quoteTypeEnum as any,
        isActive: true 
      }
    });

    // Get product type rule for additional calculations
    const productTypeRule = await prisma.productTypeRule.findUnique({
      where: { 
        productType: productTypeEnum as any
      }
    });

    const baseValue = parseFloat(body.value);
    let markup = 0;
    let markupAmount = 0;
    let finalValue = baseValue;

    // Apply quote type markup
    if (quoteTypeRule) {
      markup = Math.max(
        quoteTypeRule.baseMarkup + quoteTypeRule.riskMarkup,
        quoteTypeRule.minimumMarkup
      );
      markupAmount = (baseValue * markup) / 100;
      finalValue = baseValue + markupAmount;
    }

    // Apply product type adjustments
    let productTypeAdjustment = 0;
    let leadTimeWeeks = 4; // Default lead time
    let designComplexity = 'Simple';
    
    if (productTypeRule) {
      // Apply product type price multiplier
      const adjustedValue = finalValue * productTypeRule.basePriceMultiplier;
      const complexityMarkupAmount = (adjustedValue * productTypeRule.complexityMarkup) / 100;
      productTypeAdjustment = (adjustedValue + complexityMarkupAmount) - finalValue;
      finalValue = adjustedValue + complexityMarkupAmount;
      
      // Set lead time
      leadTimeWeeks = Math.round((productTypeRule.minimumLeadTimeWeeks + productTypeRule.maximumLeadTimeWeeks) / 2);
      
      // Determine design complexity
      if (productTypeRule.requiresDetailedSpecifications && productTypeRule.requiresDrawings) {
        designComplexity = productTypeRule.requiresDesignApproval ? 'Highly Complex' : 'Complex';
      } else if (productTypeRule.requiresDetailedSpecifications || productTypeRule.requiresDrawings) {
        designComplexity = 'Moderate';
      }
    }

    // Determine approval requirements (considering both quote type and product type)
    const requiresApproval = finalValue > 10000 || 
                           quoteTypeEnum === 'SUPPLY_AND_INSTALL' || 
                           (productTypeRule?.requiresDesignApproval || false) ||
                           (productTypeRule?.requiresFabricationApproval || false);
    
    const canSelfApprove = finalValue <= 25000 && 
                          quoteTypeEnum !== 'SUPPLY_AND_INSTALL' && 
                          !(productTypeRule?.requiresDesignApproval || false);

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        customerName: body.customer,
        projectName: body.projectName,
        contactName: body.contactName,
        productType: body.productType,
        quotedBy: body.quotedBy || 'System',
        value: finalValue,
        baseValue: baseValue,
        markup: markup,
        markupAmount: markupAmount,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        quoteType: body.quoteType || 'Supply & Fit',
        quoteTypeEnum: quoteTypeEnum as any,
        
        // Product Type Classification
        productTypeEnum: productTypeEnum as any,
        designComplexity,
        leadTimeWeeks,
        designRequirements: productTypeRule ? JSON.stringify({
          requiresDetailedSpecifications: productTypeRule.requiresDetailedSpecifications,
          requiresDrawings: productTypeRule.requiresDrawings,
          requiresSupplierQuote: productTypeRule.requiresSupplierQuote,
          requiresQualityAssurance: productTypeRule.requiresQualityAssurance
        }) : undefined,
        supplierInfo: productTypeRule?.requiresSupplierConfirmation ? JSON.stringify({
          requiresConfirmation: true,
          leadTimeImpact: productTypeRule.minimumLeadTimeWeeks
        }) : undefined,
        fabricationNotes: body.fabricationNotes || null,
        
        status: 'PENDING',
        approvalStatus: requiresApproval ? 'PENDING' : 'APPROVED',
        requiresApproval,
        canSelfApprove,
        hasLineItems: body.hasLineItems || false,
        enquiryId: body.enquiryId || null,
        customerId: customerId,
        riskAssessment: JSON.stringify({
          // Customer validation status
          customerValidated,
          newCustomerRequest: newCustomerRequestId,
          // Quote type risks
          quoteTypeRisk: quoteTypeRule?.riskLevel || 'MEDIUM',
          warrantyRisk: quoteTypeRule?.warrantyRisk || false,
          callbackRisk: quoteTypeRule?.callbackRisk || false,
          requiresInstallationPricing: quoteTypeRule?.requiresInstallationPricing || false,
          requiresMandatoryApproval: quoteTypeRule?.requiresMandatoryApproval || false,
          
          // Product type risks
          productTypeRisk: productTypeRule?.riskLevel || 'MEDIUM',
          designRisk: productTypeRule?.designRisk || false,
          supplierRisk: productTypeRule?.supplierRisk || false,
          qualityRisk: productTypeRule?.qualityRisk || false,
          timelineRisk: productTypeRule?.timelineRisk || false,
          
          // Combined assessment
          overallRisk: Math.max(
            ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].indexOf(quoteTypeRule?.riskLevel || 'MEDIUM'),
            ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].indexOf(productTypeRule?.riskLevel || 'MEDIUM')
          ) >= 2 ? 'HIGH' : 'MEDIUM',
          
          // Pricing adjustments
          productTypeAdjustment,
          totalMarkup: markup + (productTypeRule?.complexityMarkup || 0)
        })
      }
    });

    // Create line items if provided
    if (body.hasLineItems && body.lineItems && body.lineItems.length > 0) {
      await prisma.quoteItem.createMany({
        data: body.lineItems.map((item: any) => ({
          quoteId: quote.id,
          lineNumber: item.lineNumber,
          product: item.product,
          description: item.description,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice),
          totalPrice: parseFloat(item.totalPrice)
        }))
      });
    }

    // Create quote validation record
    await prisma.quoteValidation.create({
      data: {
        quoteId: quote.id,
        productCountCheck: false,
        productCountValid: false,
        priceValidationCheck: false,
        priceValidationValid: false,
        installationPriceCheck: false,
        installationPriceValid: false,
        quoteTypeValidation: false,
        quoteTypeValid: false,
        markupValidation: false,
        markupValid: false,
        
        // Product Type Validation
        productTypeValidation: false,
        productTypeValid: false,
        designRequirementsCheck: productTypeRule?.requiresDetailedSpecifications || false,
        designRequirementsValid: false,
        supplierValidationCheck: productTypeRule?.requiresSupplierConfirmation || false,
        supplierValidationValid: false,
        leadTimeValidation: false,
        leadTimeValid: false,
        
        allChecksComplete: false,
        validationPassed: false
      }
    });

    // Create approval workflow if required
    if (requiresApproval) {
      const workflow = await prisma.approvalWorkflow.findFirst({
        where: {
          workflowType: finalValue > 50000 ? 'QUOTE_APPROVAL' : 'QUOTE_APPROVAL',
          isActive: true
        }
      });

      if (workflow) {
        await prisma.approval.create({
          data: {
            approvalType: 'QUOTE_CREATION',
            entityType: 'QUOTE',
            entityId: quote.id,
            stage: 'creation',
            status: 'PENDING',
            priority: finalValue > 50000 ? 'HIGH' : 'MEDIUM',
            requiresSecondApproval: !canSelfApprove,
            canSelfApprove,
            mandatoryApproval: quoteTypeRule?.requiresMandatoryApproval || false,
            requestedBy: body.quotedBy || 'System',
            requestNotes: `Quote created for ${body.customer} - ${body.quoteType}`,
            workflowId: workflow.id,
            quoteId: quote.id
          }
        });
      }
    }

    // Update enquiry status if linked
    if (body.enquiryId) {
      await prisma.enquiry.update({
        where: { id: body.enquiryId },
        data: { status: 'QUOTED' }
      });
    }

    // NORMAN'S SURVEY SYSTEM INTEGRATION
    let surveyBooking = null;
    let surveyMessage = '';
    
    if (body.requiresSurvey && body.installationAddress) {
      try {
        // Create survey booking automatically
        const surveyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/survey-booking`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quoteId: quote.id,
              customerName: body.customer,
              contactName: body.contactName,
              contactPhone: body.customerPhone,
              contactEmail: body.customerEmail,
              projectName: body.projectName,
              surveyAddress: body.installationAddress,
              postcode: body.postcode,
              scheduledDate: body.surveyDate,
              scheduledTime: body.surveyTime,
              surveyType: body.surveyType || 'STANDARD_SURVEY',
              accessRequirements: body.accessRequirements,
              specialInstructions: body.specialInstructions,
              priority: body.priority || 'MEDIUM'
            })
          }
        );

        if (surveyResponse.ok) {
          const surveyData = await surveyResponse.json();
          surveyBooking = surveyData.surveyBooking;
          const cost = surveyData.costBreakdown;
          surveyMessage = ` | Survey: ${cost.finalCalculation}`;
        }
      } catch (error) {
        console.error('Survey booking error:', error);
        surveyMessage = ' | Survey booking failed - will need manual setup';
      }
    }

    // ENHANCED GLASS WEIGHT CALCULATOR INTEGRATION
    let glassCalculations = null;
    let glassMessage = '';
    
    if (body.hasGlassProducts || body.manualGlassDimensions) {
      try {
        // Calculate glass weight automatically
        const glassResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/glass-weight-calculator`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quoteId: quote.id,
              glassProducts: body.glassProducts,
              manualDimensions: body.manualGlassDimensions
            })
          }
        );

        if (glassResponse.ok) {
          const glassData = await glassResponse.json();
          glassCalculations = glassData.calculations;
          const summary = glassData.summary;
          glassMessage = ` | Glass: ${summary.totalPanels} panels, ${summary.totalWeight}kg, ${summary.recommendedStaff} staff, ${summary.safetyCategory} safety`;
        }
      } catch (error) {
        console.error('Glass calculation error:', error);
        glassMessage = ' | Glass weight calculation failed - will need manual calculation';
      }
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'QUOTE_GENERATED',
        description: `Quote ${quoteNumber} generated${body.enquiryId ? ' from enquiry' : ''} for ${body.customer}${body.hasLineItems ? ` with ${body.lineItems?.length || 0} line items` : ''} - ${body.quoteType} | ${body.productTypeClassification || 'Standard Fabrication'} (${markup.toFixed(1)}% quote markup + ${productTypeRule?.complexityMarkup || 0}% product complexity markup applied, ${leadTimeWeeks} weeks lead time)${surveyMessage}${glassMessage}`,
        user: body.quotedBy || 'System',
        quoteId: quote.id,
        enquiryId: body.enquiryId || null
      }
    });

    // Return quote with line items, validation, survey, and glass calculations
    const quoteWithItems = await prisma.quote.findUnique({
      where: { id: quote.id },
      include: {
        lineItems: {
          orderBy: { lineNumber: 'asc' }
        },
        validation: true,
        approvals: {
          include: {
            workflow: true
          }
        },
        surveyBooking: true,
        glassWeightCalculations: true
      }
    });

    return NextResponse.json({
      ...quoteWithItems,
      surveyBooking,
      glassCalculations,
      integrationResults: {
        surveyIntegrated: !!surveyBooking,
        glassCalculated: !!glassCalculations,
        surveyMessage: surveyMessage.replace(' | ', ''),
        glassMessage: glassMessage.replace(' | ', '')
      }
    });
  } catch (error) {
    console.error('Create quote error:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
