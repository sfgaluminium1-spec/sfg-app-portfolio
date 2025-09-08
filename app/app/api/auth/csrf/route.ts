
import { NextResponse } from 'next/server'

export async function GET() {
  // Basic CSRF token for testing - will be replaced with proper implementation
  const csrfToken = `csrf-token-${Date.now()}-${Math.random().toString(36).substring(7)}`
  
  return NextResponse.json({
    csrfToken,
    status: "development",
    message: "Basic CSRF endpoint for v1.1.0 - Full authentication coming soon"
  })
}
