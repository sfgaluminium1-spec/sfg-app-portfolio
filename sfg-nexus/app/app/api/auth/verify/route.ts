
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find valid session
    const session = await prisma.customerSession.findUnique({
      where: { token },
      include: { customer: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (!session.customer.isActive) {
      return NextResponse.json(
        { error: 'Customer account is inactive' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...customerData } = session.customer;

    return NextResponse.json({ customer: customerData });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
