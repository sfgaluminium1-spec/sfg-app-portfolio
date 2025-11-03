
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; orderId: string }> }
) {
  try {
    const { id: jobId, orderId } = await params;
    const body = await request.json();
    const { approvedBy, approvalType, notes } = body;

    const supplierOrder = await prisma.supplierOrder.findUnique({
      where: { id: orderId },
      include: { supplier: true }
    });

    if (!supplierOrder) {
      return NextResponse.json({ error: 'Supplier order not found' }, { status: 404 });
    }

    const updateData: any = {};

    // Handle different approval types based on value and requirements
    if (approvalType === 'first_approval') {
      updateData.firstApproval = true;
      updateData.firstApprovedAt = new Date();
      updateData.firstApprovedBy = approvedBy;

      // If order value is under £100 or doesn't require two approvals, complete approval
      if (supplierOrder.canAutoApprove || !supplierOrder.requiresTwoApprovals) {
        updateData.approved = true;
        updateData.approvedAt = new Date();
        updateData.approvedBy = approvedBy;
        updateData.status = 'APPROVED';
      }
    } else if (approvalType === 'second_approval') {
      updateData.secondApproval = true;
      updateData.secondApprovedAt = new Date();
      updateData.secondApprovedBy = approvedBy;
      updateData.approved = true;
      updateData.approvedAt = new Date();
      updateData.approvedBy = approvedBy;
      updateData.status = 'APPROVED';
    } else if (approvalType === 'override') {
      // Override approval for small values
      if (supplierOrder.orderValue && supplierOrder.orderValue <= 100) {
        updateData.approved = true;
        updateData.approvedAt = new Date();
        updateData.approvedBy = approvedBy;
        updateData.status = 'APPROVED';
        updateData.firstApproval = true;
        updateData.firstApprovedAt = new Date();
        updateData.firstApprovedBy = approvedBy;
      } else {
        return NextResponse.json({ 
          error: 'Override not allowed for orders over £100' 
        }, { status: 403 });
      }
    }

    const updatedOrder = await prisma.supplierOrder.update({
      where: { id: orderId },
      data: updateData
    });

    // If fully approved, generate and send supplier email
    if (updatedOrder.approved && !updatedOrder.emailSent) {
      await generateAndSendSupplierEmail(updatedOrder.id);
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'JOB_UPDATED',
        description: `Supplier order ${approvalType} by ${approvedBy} - £${supplierOrder.orderValue}`,
        user: approvedBy,
        jobId
      }
    });

    // Send MS Teams notification
    try {
      const notificationMessage = `Supplier order ${approvalType} completed for Job ${jobId}. Order value: £${supplierOrder.orderValue}`;
      
      await fetch('/api/notifications/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Supplier Order Approval',
          message: notificationMessage,
          recipient: 'sales@sfg-aluminium.co.uk',
          jobId,
          orderId
        })
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    return NextResponse.json({ 
      supplierOrder: updatedOrder,
      message: `${approvalType} completed successfully`
    });
  } catch (error) {
    console.error('Supplier order approval error:', error);
    return NextResponse.json({ error: 'Failed to approve supplier order' }, { status: 500 });
  }
}

async function generateAndSendSupplierEmail(orderId: string) {
  try {
    const supplierOrder = await prisma.supplierOrder.findUnique({
      where: { id: orderId },
      include: {
        supplier: true,
        job: true,
        orderItems: true
      }
    });

    if (!supplierOrder || !supplierOrder.supplier.email) {
      return false;
    }

    // Generate professional supplier email
    const emailData = {
      to: supplierOrder.supplier.email,
      subject: `Purchase Order ${supplierOrder.orderNumber} - SFG Aluminium`,
      template: 'supplier_order',
      data: {
        supplierName: supplierOrder.supplier.name,
        orderNumber: supplierOrder.orderNumber,
        jobNumber: supplierOrder.job.jobNumber,
        orderDate: supplierOrder.orderDate,
        requiredDate: supplierOrder.requiredDate,
        orderItems: supplierOrder.orderItems,
        totalAmount: supplierOrder.totalAmount,
        deliveryAddress: supplierOrder.deliveryAddress,
        deliveryInstructions: supplierOrder.deliveryInstructions,
        paymentTerms: supplierOrder.paymentTerms,
        specialInstructions: supplierOrder.specialInstructions
      }
    };

    // Send email via email API
    const response = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      // Mark email as sent
      await prisma.supplierOrder.update({
        where: { id: orderId },
        data: {
          emailSent: true,
          emailSentAt: new Date(),
          emailTemplate: 'supplier_order',
          status: 'SENT_TO_SUPPLIER'
        }
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error sending supplier email:', error);
    return false;
  }
}
