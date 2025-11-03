
'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TierWrapper } from '@/components/tier-wrapper'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <TierWrapper>
          {children}
          <Toaster position="top-right" />
        </TierWrapper>
      </ThemeProvider>
    </SessionProvider>
  )
}
