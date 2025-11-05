
import { NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'SFG-Website',
    version: '1.7.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      webhook: '/api/webhooks/nexus',
      message_handler: '/api/messages/handle',
      contact: '/api/contact',
      quote: '/api/quote',
      service: '/api/service'
    },
    uptime: process.uptime(),
    memory_usage: process.memoryUsage()
  });
}
