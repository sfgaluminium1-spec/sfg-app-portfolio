
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjectCard } from '@/components/project-card'
import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProjectsPage() {
  const { data: session } = useSession() || {}
  const [projects, setProjects] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProjects()
    fetchStats()
  }, [search, statusFilter, page])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })
      if (search) params.append('search', search)
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/projects?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
        setTotalPages(data.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/projects/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-1">SFG Aluminium Project Lifecycle (ENQ → PAID)</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader className="pb-2">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-3xl">{stats.total || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-blue-50/60 backdrop-blur-sm border-blue-200/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-700">Enquiries (ENQ)</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.byStatus?.ENQ || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-amber-50/60 backdrop-blur-sm border-amber-200/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-amber-700">Orders (ORD)</CardDescription>
              <CardTitle className="text-3xl text-amber-600">{stats.byStatus?.ORD || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-purple-50/60 backdrop-blur-sm border-purple-200/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-purple-700">Invoiced (INV)</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{stats.byStatus?.INV || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-green-50/60 backdrop-blur-sm border-green-200/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-700">Paid (PAID)</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.byStatus?.PAID || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by BaseNumber, Customer, Project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/60 backdrop-blur-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white/60 backdrop-blur-sm">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ENQ">ENQ - Enquiry</SelectItem>
            <SelectItem value="QUO">QUO - Quote</SelectItem>
            <SelectItem value="ORD">ORD - Order</SelectItem>
            <SelectItem value="INV">INV - Invoice</SelectItem>
            <SelectItem value="DEL">DEL - Delivered</SelectItem>
            <SelectItem value="PAID">PAID - Paid</SelectItem>
            <SelectItem value="MISSING">MISSING - Missing Fields</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardContent className="text-center py-12">
            <p className="text-gray-600">No projects found</p>
            <Link href="/dashboard/projects/new">
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-white/60 backdrop-blur-sm"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="bg-white/60 backdrop-blur-sm"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
