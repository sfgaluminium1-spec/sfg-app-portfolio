
/**
 * AI Chat API Route
 * Uses Bytebot AI for RAG-powered queries about SFG business
 */

import { NextRequest, NextResponse } from 'next/server';
import { bytebotAI } from '@/lib/bytebot';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Query Bytebot AI with SFG context
    const response = await bytebotAI.askSFGQuestion(message);

    return NextResponse.json({ 
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('AI Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

