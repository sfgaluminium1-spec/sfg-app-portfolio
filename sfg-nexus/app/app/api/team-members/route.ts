
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const canApproveQuotes = searchParams.get('canApproveQuotes');
    const canApproveJobs = searchParams.get('canApproveJobs');

    const where: any = { isActive: true };
    
    if (canApproveQuotes === 'true') where.canApproveQuotes = true;
    if (canApproveJobs === 'true') where.canApproveJobs = true;

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ teamMembers });
  } catch (error) {
    console.error('Team members API error:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}
