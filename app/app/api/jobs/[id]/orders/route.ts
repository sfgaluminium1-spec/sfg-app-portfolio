
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;

    const orderItems = await prisma.orderItem.findMany({
      where: { jobId },
      include: {
        supplierOrder: {
          include: {
            supplier: true
          }
        },
        materialsAnalysis: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const supplierOrders = await prisma.supplierOrder.findMany({
      where: { jobId },
      include: {
        supplier: true,
        orderItems: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orderItems, supplierOrders });
  } catch (error) {
    console.error('Job orders API error:', error);
    return NextResponse.json({ error: 'Failed to fetch job orders' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = id;
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_order_item':
        return await createOrderItem(jobId, data);
      case 'create_supplier_order':
        return await createSupplierOrder(jobId, data);
      case 'consolidate_orders':
        return await consolidateOrdersBySupplier(jobId);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Job orders action error:', error);
    return NextResponse.json({ error: 'Failed to process order action' }, { status: 500 });
  }
}

async function createOrderItem(jobId: string, data: any) {
  const orderItem = await prisma.orderItem.create({
    data: {
      jobId,
      itemName: data.itemName,
      itemDescription: data.itemDescription,
      itemCode: data.itemCode,
      category: data.category,
      specifications: data.specifications || {},
      quantity: parseFloat(data.quantity),
      unit: data.unit || 'PCS',
      unitPrice: data.unitPrice ? parseFloat(data.unitPrice) : null,
      totalPrice: data.totalPrice ? parseFloat(data.totalPrice) : null,
      preferredSupplier: data.preferredSupplier,
      supplierItemCode: data.supplierItemCode,
      supplierLeadTime: data.supplierLeadTime ? parseInt(data.supplierLeadTime) : null,
      qualityGrade: data.qualityGrade,
      complianceNotes: data.complianceNotes,
      certificationRequired: data.certificationRequired || false,
      materialsAnalysisId: data.materialsAnalysisId
    }
  });

  return NextResponse.json({ orderItem });
}

async function createSupplierOrder(jobId: string, data: any) {
  // Generate order number
  const orderNumber = `SO-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const supplierOrder = await prisma.supplierOrder.create({
    data: {
      jobId,
      supplierId: data.supplierId,
      orderNumber,
      requiredDate: data.requiredDate ? new Date(data.requiredDate) : null,
      deliveryAddress: data.deliveryAddress,
      deliveryInstructions: data.deliveryInstructions,
      paymentTerms: data.paymentTerms,
      deliveryTerms: data.deliveryTerms,
      specialInstructions: data.specialInstructions,
      orderValue: data.orderValue ? parseFloat(data.orderValue) : null,
      requiresTwoApprovals: data.orderValue ? parseFloat(data.orderValue) > 100 : false,
      canAutoApprove: data.orderValue ? parseFloat(data.orderValue) <= 100 : true
    }
  });

  // Assign order items to this supplier order
  if (data.orderItemIds && data.orderItemIds.length > 0) {
    await prisma.orderItem.updateMany({
      where: {
        id: { in: data.orderItemIds },
        jobId
      },
      data: {
        supplierOrderId: supplierOrder.id,
        status: 'APPROVED'
      }
    });
  }

  return NextResponse.json({ supplierOrder });
}

async function consolidateOrdersBySupplier(jobId: string) {
  // Get all pending order items
  const orderItems = await prisma.orderItem.findMany({
    where: {
      jobId,
      status: 'PENDING',
      supplierOrderId: null
    }
  });

  // Group by preferred supplier
  const supplierGroups: { [key: string]: any[] } = {};
  
  orderItems.forEach((item: any) => {
    const supplier = item.preferredSupplier || 'UNASSIGNED';
    if (!supplierGroups[supplier]) {
      supplierGroups[supplier] = [];
    }
    supplierGroups[supplier].push(item);
  });

  const consolidatedOrders = [];

  // Create supplier orders for each group
  for (const [supplierName, items] of Object.entries(supplierGroups)) {
    if (supplierName === 'UNASSIGNED') continue;

    // Find supplier by name
    const supplier = await prisma.supplier.findFirst({
      where: { name: supplierName }
    });

    if (supplier) {
      const totalValue = items.reduce((sum: number, item) => sum + (item.totalPrice || 0), 0);
      const orderNumber = `SO-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      const supplierOrder = await prisma.supplierOrder.create({
        data: {
          jobId,
          supplierId: supplier.id,
          orderNumber,
          orderValue: totalValue,
          requiresTwoApprovals: totalValue > 100,
          canAutoApprove: totalValue <= 100,
          paymentTerms: supplier.paymentTerms,
          deliveryTerms: supplier.deliveryTerms
        }
      });

      // Assign items to this order
      await prisma.orderItem.updateMany({
        where: {
          id: { in: items.map((item: any) => item.id) }
        },
        data: {
          supplierOrderId: supplierOrder.id,
          status: 'APPROVED'
        }
      });

      consolidatedOrders.push(supplierOrder);
    }
  }

  return NextResponse.json({ 
    consolidatedOrders,
    message: `Created ${consolidatedOrders.length} consolidated supplier orders`
  });
}
