
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        van: true,
        schedules: {
          include: {
            job: true,
            van: true
          },
          orderBy: { scheduledDate: 'desc' },
          take: 5
        }
      },
      orderBy: { teamName: 'asc' }
    });

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
