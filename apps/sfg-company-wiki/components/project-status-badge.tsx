
'use client'

import { getStatusColor, type ProjectStatusKey } from '@/lib/sfg-config'
import { Badge } from '@/components/ui/badge'

interface ProjectStatusBadgeProps {
  status: ProjectStatusKey
  className?: string
}

export function ProjectStatusBadge({ status, className = '' }: ProjectStatusBadgeProps) {
  const statusConfig = getStatusColor(status)
  
  return (
    <Badge
      className={`${className}`}
      style={{
        backgroundColor: statusConfig.bg,
        color: statusConfig.color,
        borderColor: statusConfig.border,
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      {statusConfig.name}
    </Badge>
  )
}
