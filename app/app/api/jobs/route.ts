
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { JobNumberGenerator } from '@/lib/job-number-generator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const where = status ? { status: status as any } : {};
    
    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        quote: {
          include: {
            enquiry: true
          }
        },
        orders: true,
        documents: true,
        schedules: {
          include: {
            team: true,
            van: true
          }
        }
      }
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Jobs API error:', error);
    
    // Return mock data if database is not ready
    return NextResponse.json({ jobs: [
      {
        id: '1',
        jobNumber: '18456',
        client: 'Beesley and Fildes',
        site: 'Manchester Office',
        description: 'Aluminium window installation - 12 units',
        value: 15750.00,
        status: 'FABRICATION',
        priority: 'HIGH',
        teamRequirement: 1,
        vanRequirement: 1,
        estimatedDays: 2,
        poReceivedDate: new Date('2025-01-05'),
        fabricationDate: new Date('2025-01-15'),
        installationDate: new Date('2025-01-26'),
        drawingStatus: 'APPROVED',
        approvalStatus: 'APPROVED',
        glassOrderStatus: 'ORDERED',
        cutStatus: 'COMPLETED',
        preparedStatus: 'IN_PROGRESS',
        coatingStatus: 'PENDING',
        assemblyStatus: 'PENDING',
        installStatus: 'PENDING'
      },
      {
        id: '2',
        jobNumber: '18457',
        client: 'Lodestone Projects',
        site: 'SBS Northampton',
        description: 'Glass replacement - Emergency repair',
        value: 2850.00,
        status: 'READY_FOR_INSTALL',
        priority: 'URGENT',
        teamRequirement: 1,
        vanRequirement: 1,
        estimatedDays: 1,
        poReceivedDate: new Date('2025-01-10'),
        fabricationDate: new Date('2025-01-16'),
        installationDate: new Date('2025-01-31'),
        drawingStatus: 'APPROVED',
        approvalStatus: 'APPROVED',
        glassOrderStatus: 'DELIVERED',
        cutStatus: 'COMPLETED',
        preparedStatus: 'COMPLETED',
        coatingStatus: 'COMPLETED',
        assemblyStatus: 'COMPLETED',
        installStatus: 'PENDING'
      }
    ]});
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const jobNumber = JobNumberGenerator.generateJobNumber();
    
    const job = await prisma.job.create({
      data: {
        jobNumber,
        client: body.client,
        site: body.site,
        description: body.description,
        value: body.value ? parseFloat(body.value) : null,
        status: 'APPROVED', // Jobs start as APPROVED in new workflow
        priority: body.priority || 'MEDIUM',
        quoteId: body.quoteId || null,
        orderNumber: body.orderNumber || null,
        poReceivedDate: body.poReceivedDate ? new Date(body.poReceivedDate) : null,
        installationDate: body.installationDate ? new Date(body.installationDate) : null,
        teamRequirement: body.teamRequirement || 1,
        vanRequirement: body.vanRequirement || 1,
        estimatedDays: body.estimatedDays || 1
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'JOB_CREATED',
        description: `New job ${jobNumber} created for ${body.client}`,
        user: 'System',
        jobId: job.id
      }
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
