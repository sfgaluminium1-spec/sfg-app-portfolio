
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';


export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;

    // In a real application, you would update user lock status in database
    console.log(`User ${userId} unlocked by admin`);

    return NextResponse.json({ 
      message: 'User unlocked successfully' 
    });
  } catch (error) {
    console.error('Error unlocking user:', error);
    return NextResponse.json(
      { error: 'Failed to unlock user' },
      { status: 500 }
    );
  }
}
