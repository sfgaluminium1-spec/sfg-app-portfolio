
import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import IframeOptimizedNavigation from '@/components/iframe-optimized-navigation'
import SharePointLayoutWrapper from '@/components/sharepoint-layout-wrapper'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron'
})

export const metadata: Metadata = {
  title: 'SFG Aluminium Innovation Hub - Warren Executive Suite',
  description: 'Ultra-premium SharePoint interface for SFG Aluminium innovation, AI integration, and executive strategy',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SharePointLayoutWrapper>
            <div className="relative min-h-screen sharepoint-container">
              <IframeOptimizedNavigation />
              <main className="relative sharepoint-main">
                {children}
              </main>
            </div>
            <Toaster />
          </SharePointLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
