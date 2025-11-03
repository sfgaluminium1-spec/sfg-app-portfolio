
'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectStatusBadge } from './project-status-badge'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Package, User } from 'lucide-react'
import { formatDistance } from 'date-fns'

interface ProjectCardProps {
  project: any
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/60 backdrop-blur-sm border border-gray-200/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span className="text-blue-600">{project.baseNumber}-{project.prefix}</span>
                {project.status === 'MISSING' && (
                  <Badge variant="destructive" className="text-xs">
                    Missing Fields
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {project.customer || 'No customer name'}
              </CardDescription>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {project.project && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>{project.project}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
            )}
            {project.productType && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>{project.productType}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDistance(new Date(project.createdAt), new Date(), { addSuffix: true })}</span>
            </div>
            {project.createdBy && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>{project.createdBy.firstName} {project.createdBy.lastName}</span>
              </div>
            )}
            {project.currentProductCount !== null && project.currentProductCount !== undefined && (
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mt-2">
                <Package className="h-4 w-4" />
                <span>{project.currentProductCount} product{project.currentProductCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
