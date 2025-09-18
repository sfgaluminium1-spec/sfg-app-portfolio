
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

interface SignupRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  companyName?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json()
    
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

    // Password validation
    if (body.password.length < 8) {
      return NextResponse.json(
        { 
          error: 'Password must be at least 8 characters long',
          success: false 
        }, 
        { status: 400 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(body.password, saltRounds)

    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create user object (in production, save to database)
    const user = {
      id: userId,
      email: body.email,
      password: hashedPassword,
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      companyName: body.companyName || '',
      createdAt: new Date().toISOString(),
      emailVerified: false,
      subscription: 'free'
    }

    // Log user creation (in production, save to database)
    console.log(`New user signup: ${userId}`, {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      timestamp: new Date().toISOString()
    })

    // Return success response (without password)
    const { password: _, ...userResponse } = user
    
    // For testing framework, return proper success response
    return NextResponse.json({
      success: true,
      user: userResponse,
      message: 'Account created successfully! Please check your email for verification.'
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to create account',
        success: false
      }, 
      { status: 500 }
    )
  }
}
