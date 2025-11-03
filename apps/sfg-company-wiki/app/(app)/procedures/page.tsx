
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Search,
  Filter,
  Plus,
  Clock,
  AlertTriangle,
  User,
} from "lucide-react"
import Link from "next/link"

export default async function ProceduresPage() {
  const session = await getServerSession(authOptions)

  const [procedures, categories] = await Promise.all([
    prisma.procedure.findMany({
      where: { isLatestVersion: true },
      include: {
        category: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        conflicts: {
          where: { status: "DETECTED" },
        },
        _count: {
          select: {
            crossReferences: true,
            referencedIn: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ])

  const priorityColors = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-100 text-red-800",
  }

  const statusColors = {
    DRAFT: "bg-gray-100 text-gray-800",
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-yellow-100 text-yellow-800",
    ARCHIVED: "bg-red-100 text-red-800",
    UNDER_REVIEW: "bg-blue-100 text-blue-800",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procedures</h1>
          <p className="text-muted-foreground">
            Manage your company procedures and policies
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Procedure
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search procedures..."
                  className="pl-8"
                />
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{category.code}</Badge>
                <div className="text-sm text-muted-foreground">
                  {procedures.filter(p => p.categoryId === category.id).length} procedures
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Procedures List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Procedures</h2>
        <div className="space-y-3">
          {procedures.map((procedure) => (
            <Card key={procedure.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/procedures/${procedure.id}`}
                        className="text-lg font-medium hover:underline text-primary"
                      >
                        {procedure.title}
                      </Link>
                      {procedure.conflicts.length > 0 && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>

                    {procedure.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {procedure.summary}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {procedure.category.name}
                      </Badge>
                      <Badge className={priorityColors[procedure.priority as keyof typeof priorityColors]}>
                        {procedure.priority}
                      </Badge>
                      <Badge className={statusColors[procedure.status as keyof typeof statusColors]}>
                        {procedure.status}
                      </Badge>
                      {procedure.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>
                          {procedure.createdBy?.firstName} {procedure.createdBy?.lastName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          Updated {new Date(procedure.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {procedure._count.crossReferences > 0 && (
                        <span>
                          {procedure._count.crossReferences + procedure._count.referencedIn} references
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {procedures.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No procedures found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first procedure.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Procedure
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
