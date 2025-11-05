
import { UserTierLevel, TIER_PERMISSIONS } from './types'

export function getUserTier(user: any): UserTierLevel {
  if (!user) return UserTierLevel.SALES
  
  const tierLevel = user.tierLevel
  
  if (tierLevel === UserTierLevel.CEO || user.role === 'SUPER_ADMIN') {
    return UserTierLevel.CEO
  } else if (tierLevel === UserTierLevel.FINANCE || user.role === 'ADMIN') {
    return UserTierLevel.FINANCE
  }
  
  return UserTierLevel.SALES
}

export function getUserPermissions(user: any) {
  const tier = getUserTier(user)
  return TIER_PERMISSIONS[tier]
}

export function canAccessRoute(user: any, route: string): boolean {
  const permissions = getUserPermissions(user)
  
  // Route-based access control
  const restrictedRoutes: Record<string, keyof typeof TIER_PERMISSIONS.CEO> = {
    '/pricing': 'canEditPricing',
    '/financials': 'canViewFinancials',
    '/users': 'canManageUsers',
    '/admin': 'canAccessAdminSettings',
    '/contracts': 'canApproveContracts'
  }
  
  const requiredPermission = restrictedRoutes[route]
  if (!requiredPermission) return true
  
  return permissions[requiredPermission]
}

export function getTierDataAttribute(user: any): string {
  const tier = getUserTier(user)
  
  switch (tier) {
    case UserTierLevel.CEO:
      return 'ceo'
    case UserTierLevel.FINANCE:
      return 'finance'
    case UserTierLevel.SALES:
      return 'sales'
    default:
      return 'sales'
  }
}

// Tier-specific styling helpers
export function getTierCardClass(tier: UserTierLevel): string {
  switch (tier) {
    case UserTierLevel.CEO:
      return 'bg-card border-[#263247]'
    case UserTierLevel.FINANCE:
      return 'glass-card-tier-2 border-[#202938]'
    case UserTierLevel.SALES:
      return 'glass-card-tier-3 border-[#2B3950]'
    default:
      return 'glass-card-tier-3'
  }
}

export function getTierColor(tier: UserTierLevel): string {
  switch (tier) {
    case UserTierLevel.CEO:
      return '#2563EB'
    case UserTierLevel.FINANCE:
      return '#3B82F6'
    case UserTierLevel.SALES:
      return '#60A5FA'
    default:
      return '#60A5FA'
  }
}
