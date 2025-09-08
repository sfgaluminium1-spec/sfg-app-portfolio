
import { NextResponse } from 'next/server'

export async function GET() {
  // Basic session endpoint for testing
  return NextResponse.json({
    user: null,
    authenticated: false,
    status: "development",
    message: "Basic session endpoint for v1.1.0 - Full Microsoft 365 authentication coming soon"
  })
}
