
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/memory/search - Search across all memory tables
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, types, limit } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'query is required' },
        { status: 400 }
      );
    }

    const searchLimit = limit || 10;
    const results: any = {};

    // Search types: conversations, plans, decisions, knowledge, instructions
    const searchTypes = types || ['conversations', 'plans', 'decisions', 'knowledge', 'instructions'];

    if (searchTypes.includes('conversations')) {
      results.conversations = await prisma.conversation.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        orderBy: { lastActivityAt: 'desc' },
      });
    }

    if (searchTypes.includes('plans')) {
      results.plans = await prisma.plan.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        orderBy: { updatedAt: 'desc' },
      });
    }

    if (searchTypes.includes('decisions')) {
      results.decisions = await prisma.decision.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { rationale: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        orderBy: { madeAt: 'desc' },
      });
    }

    if (searchTypes.includes('knowledge')) {
      results.knowledge = await prisma.knowledgeBase.findMany({
        where: {
          OR: [
            { topic: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        orderBy: { relevanceScore: 'desc' },
      });
    }

    if (searchTypes.includes('instructions')) {
      results.instructions = await prisma.instruction.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: searchLimit,
        orderBy: { usageCount: 'desc' },
      });
    }

    return NextResponse.json({
      success: true,
      query,
      results,
    });
  } catch (error: any) {
    console.error('Error searching memory:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
