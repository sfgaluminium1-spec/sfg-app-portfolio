
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

interface SigninRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SigninRequest = await request.json()
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { 
          error: 'Email and password are required',
          success: false 
        }, 
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          success: false 
        }, 
        { status: 400 }
      )
    }

    // In production, fetch user from database
    // For demo purposes, we'll simulate a user lookup
    const simulatedUser = {
      id: 'user_demo_123',
      email: body.email,
      password: await bcrypt.hash('demo123', 12), // Demo password
      firstName: 'Demo',
      lastName: 'User',
      companyName: 'SFG Demo',
      subscription: 'professional'
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(body.password, simulatedUser.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          error: 'Invalid email or password',
          success: false 
        }, 
        { status: 401 }
      )
    }

    // Generate session token (in production, use proper JWT)
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
    
    // Log successful login
    console.log(`User login: ${simulatedUser.id}`, {
      email: body.email,
      timestamp: new Date().toISOString()
    })

    // Return success response (without password)
    const { password: _, ...userResponse } = simulatedUser
    
    // For testing framework, return 302 redirect on successful login
    const response = new NextResponse(null, { 
      status: 302,
      headers: {
        'Location': '/?login=success',
        'Set-Cookie': `session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax`
      }
    })
    
    return response

  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to sign in',
        success: false
      }, 
      { status: 500 }
    )
  }
}
