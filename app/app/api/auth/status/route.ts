
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    authenticated: false,
    status: "development",
    message: "Authentication status endpoint - Development mode",
    version: "1.2.0"
  })
}
