
'use client'

import { Badge } from '@/components/ui/badge'
import { VERSION_INFO, getVersionDisplay } from '@/lib/version'
import { Code, Calendar, Zap } from 'lucide-react'

interface VersionBadgeProps {
  position?: 'fixed' | 'relative'
  variant?: 'default' | 'compact' | 'detailed'
}

export default function VersionBadge({ position = 'fixed', variant = 'default' }: VersionBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className={`${position === 'fixed' ? 'fixed bottom-4 right-4 z-50' : ''}`}>
        <Badge variant="secondary" className="bg-blue-600/90 text-white hover:bg-blue-700 backdrop-blur-sm shadow-lg">
          <Code className="mr-1 h-3 w-3" />
          v{VERSION_INFO.version}
        </Badge>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`${position === 'fixed' ? 'fixed bottom-4 right-4 z-50' : ''} bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs`}>
        <div className="flex items-center space-x-2 mb-2">
          <Code className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-sm text-gray-900">SFG Aluminium Ltd</span>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Version: {VERSION_INFO.version}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Build: {VERSION_INFO.buildDate}</span>
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {VERSION_INFO.status}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${position === 'fixed' ? 'fixed bottom-4 right-4 z-50' : ''}`}>
      <Badge variant="secondary" className="bg-blue-600/90 text-white hover:bg-blue-700 backdrop-blur-sm shadow-lg px-3 py-1.5">
        <Code className="mr-2 h-3 w-3" />
        <span className="text-sm font-medium">{getVersionDisplay()}</span>
      </Badge>
    </div>
  )
}

// Export version info for use in other components
export { VERSION_INFO }
