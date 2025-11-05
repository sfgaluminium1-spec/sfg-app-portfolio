
'use client'

import { useSession } from 'next-auth/react'
import { UserTierLevel, TIER_COLORS } from '@/lib/types'

interface TierWrapperProps {
  children: React.ReactNode
  className?: string
}

export function TierWrapper({ children, className = '' }: TierWrapperProps) {
  const { data: session } = useSession() || {}
  
  // Determine user tier from session
  const getUserTier = () => {
    if (!session?.user) return 'sales'
    
    const tierLevel = (session.user as any).tierLevel
    
    if (tierLevel === UserTierLevel.CEO || (session.user as any).role === 'SUPER_ADMIN') {
      return 'ceo'
    } else if (tierLevel === UserTierLevel.FINANCE || (session.user as any).role === 'ADMIN') {
      return 'finance'
    }
    
    return 'sales'
  }

  const tier = getUserTier()

  return (
    <div data-tier={tier} className={className}>
      {children}
    </div>
  )
}
