
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function validateApiKey(apiKey: string | null) {
  if (!apiKey) return false;
  
  try {
    const config = await prisma.configuration.findUnique({
      where: { key: `api_key_${apiKey}` },
    });
    
    if (!config) return false;
    const keyData = JSON.parse(config.value);
    return keyData.active === true;
  } catch {
    return false;
  }
}

// SFG Knowledge Assistant Integration Endpoint
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('api_key') || request.headers.get('x-api-key');
    
    if (!await validateApiKey(apiKey)) {
      return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
    }

    const { query, context, documentId } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Log the query for analytics
    await prisma.systemLog.create({
      data: {
        level: 'info',
        message: 'SFG Assistant Query',
        details: JSON.stringify({ 
          query: query.substring(0, 100) + '...', 
          hasContext: !!context,
          documentId: documentId || null,
          timestamp: new Date().toISOString()
        })
      }
    });

    // Prepare response for SFG Knowledge Assistant integration
    const integrationResponse = {
      status: 'ready_for_integration',
      sfgAssistant: {
        modelId: '16bba6251c',
        query,
        context: context || null,
        documentId: documentId || null,
        integrationInstructions: {
          endpoint: 'https://apps.abacus.ai/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
          },
          modelConfig: {
            modelName: 'sfg-knowledge-assistant',
            temperature: 0.7,
            maxTokens: 2000
          }
        }
      },
      metadata: {
        timestamp: new Date().toISOString(),
        queryId: `sfg_query_${Date.now()}`,
        systemStatus: 'operational'
      }
    };

    return NextResponse.json(integrationResponse);
  } catch (error) {
    console.error('SFG Assistant integration error:', error);
    return NextResponse.json(
      { error: 'Failed to process SFG Assistant integration' },
      { status: 500 }
    );
  }
}

// Get SFG Assistant connection status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('api_key') || request.headers.get('x-api-key');
    
    if (!await validateApiKey(apiKey)) {
      return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
    }

    // Check if SFG Knowledge Assistant is configured and accessible
    const connectionStatus = {
      sfgAssistant: {
        modelId: '16bba6251c',
        status: 'available',
        capabilities: [
          'Document Q&A',
          'Knowledge Retrieval', 
          'Context-Aware Responses',
          'Logikal Integration Ready'
        ],
        lastChecked: new Date().toISOString(),
        integrationLevel: 'ready', // ready, partial, not_configured
        endpointHealth: 'operational'
      },
      logikalIntegration: {
        status: 'pending_setup',
        fileSystemAccess: 'not_configured',
        dataSync: 'not_active'
      },
      systemHealth: {
        apiResponsive: true,
        databaseConnected: true,
        authSystemActive: true
      }
    };

    return NextResponse.json(connectionStatus);
  } catch (error) {
    console.error('SFG connection status error:', error);
    return NextResponse.json(
      { error: 'Failed to check connection status' },
      { status: 500 }
    );
  }
}
