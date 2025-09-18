

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronUp, Info, Clock, Zap, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface VersionInfo {
  version: string
  buildId: string
  buildTimestamp: string
  packageVersion: string
  lastUpdated: string
}

interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
  type: 'major' | 'minor' | 'patch'
}

export function VersionContainer({ isInsideChat = false }: { isInsideChat?: boolean }) {
  const [isClient, setIsClient] = useState(false)
  const [versionInfo, setVersionInfo] = useState<VersionInfo>({
    version: 'loading...',
    buildId: 'loading...',
    buildTimestamp: 'loading...',
    packageVersion: 'loading...',
    lastUpdated: 'loading...'
  })
  
  const [isOpen, setIsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Ensure client-side only rendering to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Changelog entries - in production this would come from an API
  const changelog: ChangelogEntry[] = [
    {
      version: '2.1.4',
      date: '2025-09-18',
      type: 'minor',
      changes: [
        'Added AI-AutoStack partnership integration',
        'Enhanced app ecosystem dashboard',
        'Improved mobile section with iPhone/Android features',
        'Added version container with real-time updates',
        'Implemented branding engine connectivity'
      ]
    },
    {
      version: '2.1.3',
      date: '2025-09-17',
      type: 'patch',
      changes: [
        'Fixed authentication flow',
        'Improved mobile responsiveness',
        'Added ecosystem invitation system',
        'Enhanced Warren Executive Theme styling'
      ]
    },
    {
      version: '2.1.2',
      date: '2025-09-16',
      type: 'minor',
      changes: [
        'Added Generic App Ecosystem API',
        'Implemented cross-promotion features',
        'Enhanced AI automation capabilities',
        'Added comprehensive marketing sections'
      ]
    },
    {
      version: '2.1.1',
      date: '2025-09-15',
      type: 'patch',
      changes: [
        'Initial marketing website deployment',
        'Added Chrome extension showcase',
        'Implemented contact and pricing sections',
        'Added dark theme with gradient backgrounds'
      ]
    }
  ]

  const refreshVersionInfo = async () => {
    setIsRefreshing(true)
    
    // Simulate API call - in production this would fetch from server
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newVersionInfo: VersionInfo = {
      version: process.env.NEXT_PUBLIC_APP_VERSION || '2.1.4',
      buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'sfg-marketing-v2.1.4',
      buildTimestamp: process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || new Date().toISOString(),
      packageVersion: '2.1.4',
      lastUpdated: new Date().toLocaleString()
    }
    
    setVersionInfo(newVersionInfo)
    setIsRefreshing(false)
  }

  useEffect(() => {
    if (isClient) {
      refreshVersionInfo()
    }
  }, [isClient])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'minor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'patch': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const containerClasses = cn(
    "backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg",
    "bg-slate-900/80 hover:bg-slate-800/80 transition-all duration-200",
    isInsideChat 
      ? "relative mb-4 w-full" 
      : "fixed bottom-4 right-4 z-50"
  )

  // Only render on client side to prevent hydration mismatch
  if (!isClient) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={containerClasses}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-3 text-left hover:bg-slate-700/50 border-0 bg-transparent"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-slate-300">
                  v{versionInfo.version}
                </span>
              </div>
              
              {!isInsideChat && (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="h-3 w-3 text-slate-400" />
                </motion.div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  refreshVersionInfo()
                }}
                disabled={isRefreshing}
                className="h-6 w-6 p-0 hover:bg-slate-600/50"
              >
                <RefreshCw className={cn("h-3 w-3 text-slate-400", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-80 p-0 bg-slate-900/95 border-slate-700/50 backdrop-blur-sm"
          side={isInsideChat ? "top" : "top"}
          align="end"
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  <span>Version Info</span>
                </CardTitle>
                <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                  Live
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Version Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400">Version</p>
                  <p className="font-mono text-slate-200">{versionInfo.version}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Build ID</p>
                  <p className="font-mono text-slate-200 truncate">{versionInfo.buildId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Built</p>
                  <p className="font-mono text-slate-200">{formatDate(versionInfo.buildTimestamp)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Updated</p>
                  <p className="font-mono text-slate-200">{versionInfo.lastUpdated}</p>
                </div>
              </div>

              {/* Changelog */}
              <div className="border-t border-slate-700/50 pt-3">
                <h4 className="text-xs font-semibold text-slate-200 mb-3 flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>Recent Updates</span>
                </h4>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {changelog.slice(0, 3).map((entry, index) => (
                    <motion.div
                      key={entry.version}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-2 border-slate-700 pl-3"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs px-1 py-0", getTypeColor(entry.type))}
                        >
                          v{entry.version}
                        </Badge>
                        <span className="text-xs text-slate-400">{entry.date}</span>
                      </div>
                      
                      <ul className="space-y-1">
                        {entry.changes.slice(0, 3).map((change, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start space-x-1">
                            <span className="text-slate-500 mt-0.5">•</span>
                            <span className="flex-1">{change}</span>
                          </li>
                        ))}
                        {entry.changes.length > 3 && (
                          <li className="text-xs text-slate-500 italic">
                            ...and {entry.changes.length - 3} more changes
                          </li>
                        )}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="border-t border-slate-700/50 pt-3 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Services Online</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Zap className="h-3 w-3" />
                  <span>Auto-updates enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </motion.div>
  )
}
