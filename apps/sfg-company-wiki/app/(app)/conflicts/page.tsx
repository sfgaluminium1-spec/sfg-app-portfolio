
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  User,
  XCircle,
} from "lucide-react"
import Link from "next/link"

export default async function ConflictsPage() {
  const session = await getServerSession(authOptions)

  const conflicts = await prisma.conflictReport.findMany({
    include: {
      procedure: {
        include: {
          category: true,
        },
      },
      relatedProcedure: {
        include: {
          category: true,
        },
      },
      reportedBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: [
      { severity: "desc" },
      { detectedAt: "desc" },
    ],
  })

  const severityColors = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-100 text-red-800",
  }

  const statusColors = {
    DETECTED: "bg-red-100 text-red-800",
    INVESTIGATING: "bg-yellow-100 text-yellow-800",
    RESOLVED: "bg-green-100 text-green-800",
    ACCEPTED: "bg-blue-100 text-blue-800",
    IGNORED: "bg-gray-100 text-gray-800",
  }

  const statusIcons = {
    DETECTED: XCircle,
    INVESTIGATING: Clock,
    RESOLVED: CheckCircle,
    ACCEPTED: CheckCircle,
    IGNORED: XCircle,
  }

  const criticalConflicts = conflicts.filter(c => c.severity === "CRITICAL" && c.status === "DETECTED")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conflicts</h1>
          <p className="text-muted-foreground">
            Manage conflicts and inconsistencies in your procedures
          </p>
        </div>
        <Button>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Conflict
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conflicts.length}</div>
            <p className="text-xs text-muted-foreground">
              All detected conflicts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalConflicts.length}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {conflicts.filter(c => c.status === "RESOLVED").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {conflicts.filter(c => c.status === "INVESTIGATING").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Being investigated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conflicts List */}
      <div className="space-y-4">
        {conflicts.length > 0 ? (
          conflicts.map((conflict) => {
            const StatusIcon = statusIcons[conflict.status as keyof typeof statusIcons]
            return (
              <Card key={conflict.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-4 w-4 ${
                          conflict.status === "RESOLVED" || conflict.status === "ACCEPTED" 
                            ? "text-green-500" 
                            : conflict.status === "INVESTIGATING" 
                            ? "text-yellow-500" 
                            : "text-red-500"
                        }`} />
                        <h3 className="text-lg font-medium">{conflict.title}</h3>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {conflict.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={severityColors[conflict.severity as keyof typeof severityColors]}>
                          {conflict.severity}
                        </Badge>
                        <Badge className={statusColors[conflict.status as keyof typeof statusColors]}>
                          {conflict.status}
                        </Badge>
                        <Badge variant="outline">
                          {conflict.conflictType.replace(/_/g, " ")}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <Link
                            href={`/procedures/${conflict.procedure.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {conflict.procedure.title}
                          </Link>
                          <span className="text-muted-foreground">
                            ({conflict.procedure.category.name})
                          </span>
                        </div>

                        {conflict.relatedProcedure && (
                          <div className="flex items-center space-x-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Related to:</span>
                            <Link
                              href={`/procedures/${conflict.relatedProcedure.id}`}
                              className="text-blue-600 hover:underline"
                            >
                              {conflict.relatedProcedure.title}
                            </Link>
                            <span className="text-muted-foreground">
                              ({conflict.relatedProcedure.category.name})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>
                            Reported by {conflict.reportedBy?.firstName} {conflict.reportedBy?.lastName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(conflict.detectedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {conflict.resolvedAt && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>
                              Resolved {new Date(conflict.resolvedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {conflict.resolution && (
                        <div className="mt-3 p-3 bg-green-50 rounded-md">
                          <h4 className="text-sm font-medium text-green-800 mb-1">Resolution:</h4>
                          <p className="text-sm text-green-700">{conflict.resolution}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {conflict.status === "DETECTED" && (
                        <Button variant="outline" size="sm">
                          Investigate
                        </Button>
                      )}
                      {conflict.status === "INVESTIGATING" && (
                        <Button variant="outline" size="sm">
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No conflicts detected</h3>
              <p className="text-muted-foreground mb-4">
                Your procedures are consistent and conflict-free.
              </p>
              <Button variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report a Conflict
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
