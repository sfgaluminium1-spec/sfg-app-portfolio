
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.deliveryTemplate.findUnique({
      where: { id: id },
      include: {
        customer: true,
        job: {
          include: {
            quote: {
              include: {
                lineItems: true
              }
            }
          }
        },
        invoice: {
          include: {
            quote: {
              include: {
                lineItems: true
              }
            }
          }
        }
      }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Delivery template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);

  } catch (error) {
    console.error('Error fetching delivery template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const template = await prisma.deliveryTemplate.update({
      where: { id: id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        customer: true,
        job: true,
        invoice: true
      }
    });

    return NextResponse.json(template);

  } catch (error) {
    console.error('Error updating delivery template:', error);
    return NextResponse.json(
      { error: 'Failed to update delivery template' },
      { status: 500 }
    );
  }
}

// Complete delivery and generate certificate
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (data.action === 'complete') {
      // Generate completion certificate
      const certificateData = {
        completionDate: new Date(),
        customerSignature: data.customerSignature,
        customerName: data.customerName,
        workCompleted: true,
        qualityChecked: data.qualityChecked || false,
        customerSatisfied: data.customerSatisfied || false,
        installationNotes: data.installationNotes,
        beforePhotos: data.beforePhotos || [],
        afterPhotos: data.afterPhotos || [],
        installationPhotos: data.installationPhotos || []
      };

      const template = await prisma.deliveryTemplate.update({
        where: { id: id },
        data: {
          status: 'COMPLETED',
          workCompleted: true,
          qualityChecked: data.qualityChecked || false,
          customerSatisfied: data.customerSatisfied || false,
          customerSignature: data.customerSignature,
          customerName: data.customerName,
          signatureDate: new Date(),
          beforePhotos: data.beforePhotos || [],
          afterPhotos: data.afterPhotos || [],
          installationPhotos: data.installationPhotos || [],
          certificateGenerated: true,
          certificateData,
          completedAt: new Date()
        },
        include: {
          customer: true,
          job: true,
          invoice: true
        }
      });

      return NextResponse.json(template);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error completing delivery template:', error);
    return NextResponse.json(
      { error: 'Failed to complete delivery template' },
      { status: 500 }
    );
  }
}
