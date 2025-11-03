
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const securityTiers = await prisma.securityTier.findMany({
      include: {
        employees: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            department: true,
            isActive: true
          }
        }
      },
      orderBy: {
        tierId: 'asc'
      }
    });

    return NextResponse.json(securityTiers);
  } catch (error) {
    console.error('Error fetching security tiers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security tiers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const securityTier = await prisma.securityTier.create({
      data: {
        tierId: body.tierId,
        tierName: body.tierName,
        description: body.description,
        hasFullSystemAccess: body.hasFullSystemAccess || false,
        hasFinancialAccess: body.hasFinancialAccess || false,
        hasDepartmentAccess: body.hasDepartmentAccess || false,
        hasTeamManagementAccess: body.hasTeamManagementAccess || false,
        hasBasicAccess: body.hasBasicAccess || true,
        canApproveQuotes: body.canApproveQuotes || false,
        canApproveJobs: body.canApproveJobs || false,
        canManageSchedule: body.canManageSchedule || false,
        canViewReports: body.canViewReports || false,
        canManageUsers: body.canManageUsers || false,
        maxApprovalValue: body.maxApprovalValue || null
      }
    });

    return NextResponse.json(securityTier);
  } catch (error) {
    console.error('Error creating security tier:', error);
    return NextResponse.json(
      { error: 'Failed to create security tier' },
      { status: 500 }
    );
  }
}
