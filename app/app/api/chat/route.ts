
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `You are the AI Assistant for the Warren Heathcote AI & Aluminium Innovation Hub. You are an expert in:

1. Aluminium industry innovations and sustainable manufacturing
2. AI integration in industrial processes
3. Business strategy and executive decision-making
4. Innovation management and R&D processes
5. SharePoint and business intelligence tools
6. Future technology trends and digital transformation

You help users navigate the innovation hub, provide insights about aluminium industry trends, AI applications, strategic planning, and support executive decision-making. You are professional, knowledgeable, and focused on innovation and excellence.

Keep responses concise but informative, and always relate back to the context of aluminium innovation, AI integration, or business excellence.`
          },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('LLM API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || 'I apologize, but I encountered an error processing your request.';

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
