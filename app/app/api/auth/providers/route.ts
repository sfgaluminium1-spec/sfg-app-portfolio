
import { NextResponse } from 'next/server'

export async function GET() {
  // Basic providers endpoint for testing
  // This will be replaced with proper Microsoft 365 authentication later
  return NextResponse.json({
    providers: {
      microsoft: {
        id: "microsoft",
        name: "Microsoft",
        type: "oauth",
        version: "2.0",
        callbackUrl: "/api/auth/callback/microsoft",
        authorization: {
          url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
          params: {
            scope: "openid profile email",
            response_type: "code",
            prompt: "select_account"
          }
        }
      }
    },
    status: "development",
    message: "Basic auth providers endpoint for v1.1.0 - Full Microsoft 365 integration coming soon"
  })
}
