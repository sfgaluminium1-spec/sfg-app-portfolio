
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// Generate API key for external applications
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appName, description } = await request.json();
    
    if (!appName) {
      return NextResponse.json({ error: 'App name is required' }, { status: 400 });
    }

    // Generate API key
    const apiKey = `sfg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Store API key configuration (in a real app, you'd have an ApiKey model)
    await prisma.configuration.upsert({
      where: { key: `api_key_${apiKey}` },
      update: { 
        value: JSON.stringify({ 
          appName, 
          description, 
          userId: session.user.id,
          createdAt: new Date(),
          active: true 
        })
      },
      create: { 
        key: `api_key_${apiKey}`,
        value: JSON.stringify({ 
          appName, 
          description, 
          userId: session.user.id,
          createdAt: new Date(),
          active: true 
        })
      },
    });

    return NextResponse.json({ 
      apiKey,
      message: 'API key generated successfully',
      appName,
      description 
    });
  } catch (error) {
    console.error('API key generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    );
  }
}

// Validate API key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 });
    }

    const config = await prisma.configuration.findUnique({
      where: { key: `api_key_${apiKey}` },
    });

    if (!config) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const keyData = JSON.parse(config.value);
    if (!keyData.active) {
      return NextResponse.json({ error: 'API key inactive' }, { status: 401 });
    }

    return NextResponse.json({ 
      valid: true,
      appName: keyData.appName,
      description: keyData.description,
      createdAt: keyData.createdAt
    });
  } catch (error) {
    console.error('API key validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate API key' },
      { status: 500 }
    );
  }
}
