
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Generate CSRF token
    const csrfToken = `csrf_${Date.now()}_${Math.random().toString(36).substr(2, 32)}`
    
    // In production, store this token in session/database for validation
    console.log('CSRF token generated:', csrfToken)
    
    return NextResponse.json({
      csrfToken,
      success: true
    }, { status: 200 })

  } catch (error) {
    console.error('CSRF token generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate CSRF token',
        success: false
      }, 
      { status: 500 }
    )
  }
}
