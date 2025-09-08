
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { 
          error: "Email and password are required",
          status: "validation_error" 
        },
        { status: 400 }
      )
    }

    // For now, return a success response for testing
    // This will be replaced with proper Microsoft 365 authentication
    return NextResponse.json({
      message: "Account created successfully",
      user: {
        email: body.email,
        id: `temp-user-${Date.now()}`,
        status: "development_user"
      },
      status: "development",
      note: "Basic signup endpoint for v1.1.0 - Full Microsoft 365 integration coming soon"
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Invalid request format",
        status: "error" 
      },
      { status: 400 }
    )
  }
}
