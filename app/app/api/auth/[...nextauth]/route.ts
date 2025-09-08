
import { NextRequest, NextResponse } from 'next/server'

// Handle NextAuth.js compatible routes
export async function GET(
  request: NextRequest,
  { params }: { params: { nextauth: string[] } }
) {
  const { nextauth } = params
  const action = nextauth[0]

  switch (action) {
    case 'providers':
      return NextResponse.json({
        microsoft: {
          id: "microsoft",
          name: "Microsoft",
          type: "oauth",
          version: "2.0",
          callbackUrl: "/api/auth/callback/microsoft"
        }
      })

    case 'session':
      return NextResponse.json({
        user: null,
        expires: null,
        status: "development"
      })

    case 'csrf':
      return NextResponse.json({
        csrfToken: `csrf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })

    case 'signin':
      // Return signin page URL
      return NextResponse.json({
        url: `/auth/signin`,
        status: "development"
      })

    case 'signup':  
      // Return signup page URL
      return NextResponse.json({
        url: `/auth/signup`,
        status: "development"
      })

    case 'signout':
      return NextResponse.redirect(new URL('/', request.url), 302)

    case 'callback':
      const provider = nextauth[1]
      if (provider === 'microsoft') {
        // Simulate successful auth callback
        return NextResponse.redirect(new URL('/', request.url), 302)
      }
      break

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
  }

  return NextResponse.json({ error: 'Not implemented yet' }, { status: 404 })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { nextauth: string[] } }
) {
  const { nextauth } = params
  const action = nextauth[0]

  switch (action) {
    case 'signin':
      try {
        const body = await request.json()
        
        // For development, accept any credentials
        if (body.email && body.password) {
          return NextResponse.json({
            user: {
              email: body.email,
              id: `user-${Date.now()}`,
              name: body.email.split('@')[0]
            },
            url: '/',
            status: "success",
            message: "Development signin successful"
          })
        } else {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
        }
      } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      }

    case 'signup':
      try {
        const body = await request.json()
        
        // For development, accept any valid signup data
        if (body.email && body.password) {
          return NextResponse.json({
            user: {
              email: body.email,
              id: `user-${Date.now()}`,
              name: body.email.split('@')[0]
            },
            url: '/',
            status: "success",
            message: "Development signup successful"
          })
        } else {
          return NextResponse.json({ error: 'Invalid signup data' }, { status: 400 })
        }
      } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      }

    case 'signout':
      return NextResponse.redirect(new URL('/', request.url), 302)

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 404 })
  }
}
