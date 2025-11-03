
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  User,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Edit,
  Share,
} from "lucide-react"
import Link from "next/link"

interface ProcedurePageProps {
  params: {
    id: string
  }
}

export default async function ProcedurePage({ params }: ProcedurePageProps) {
  const session = await getServerSession(authOptions)

  const procedure = await prisma.procedure.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      conflicts: {
        where: { status: "DETECTED" },
        include: {
          relatedProcedure: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      crossReferences: {
        include: {
          targetProcedure: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
        },
      },
      referencedIn: {
        include: {
          sourceProcedure: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
        },
      },
      attachments: true,
    },
  })

  if (!procedure) {
    notFound()
  }

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
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Link href="/procedures">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Procedures
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{procedure.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>
                {procedure.createdBy?.firstName} {procedure.createdBy?.lastName}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{new Date(procedure.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4">
        <Badge variant="outline" className="flex items-center space-x-1">
          <FileText className="h-3 w-3" />
          <span>{procedure.category.name}</span>
        </Badge>
        <Badge className={priorityColors[procedure.priority as keyof typeof priorityColors]}>
          {procedure.priority}
        </Badge>
        <Badge className={statusColors[procedure.status as keyof typeof statusColors]}>
          {procedure.status}
        </Badge>
        {procedure.tags?.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          {procedure.summary && (
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{procedure.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Procedure Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: procedure.content.replace(/\n/g, '<br/>') }}
              />
            </CardContent>
          </Card>

          {/* Formulas */}
          {procedure.formulas && procedure.formulas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Formulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {procedure.formulas.map((formula, index) => (
                    <div key={index} className="bg-muted p-3 rounded-md font-mono text-sm">
                      {formula}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Conflicts */}
          {procedure.conflicts && procedure.conflicts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Conflicts</span>
                </CardTitle>
                <CardDescription>
                  Issues detected with this procedure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {procedure.conflicts.map((conflict) => (
                  <div key={conflict.id} className="border-l-4 border-orange-500 pl-3">
                    <div className="font-medium text-sm">{conflict.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {conflict.conflictType} - {conflict.severity}
                    </div>
                    {conflict.relatedProcedure && (
                      <Link 
                        href={`/procedures/${conflict.relatedProcedure.id}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Related: {conflict.relatedProcedure.title}
                      </Link>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Cross References */}
          {(procedure.crossReferences.length > 0 || procedure.referencedIn.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Related Procedures</CardTitle>
                <CardDescription>
                  Linked and dependent procedures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {procedure.crossReferences.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">References:</h4>
                    <div className="space-y-2">
                      {procedure.crossReferences.map((ref) => (
                        <Link 
                          key={ref.id}
                          href={`/procedures/${ref.targetProcedure.id}`}
                          className="block text-sm text-blue-600 hover:underline"
                        >
                          {ref.targetProcedure.title}
                          <div className="text-xs text-muted-foreground">
                            {ref.targetProcedure.category.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {procedure.referencedIn.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Referenced By:</h4>
                    <div className="space-y-2">
                      {procedure.referencedIn.map((ref) => (
                        <Link 
                          key={ref.id}
                          href={`/procedures/${ref.sourceProcedure.id}`}
                          className="block text-sm text-blue-600 hover:underline"
                        >
                          {ref.sourceProcedure.title}
                          <div className="text-xs text-muted-foreground">
                            {ref.sourceProcedure.category.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium">Version:</label>
                <div className="text-sm text-muted-foreground">{procedure.version}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Approval Level:</label>
                <div className="text-sm text-muted-foreground">{procedure.approvalLevel}</div>
              </div>

              {procedure.effectiveDate && (
                <div>
                  <label className="text-sm font-medium">Effective Date:</label>
                  <div className="text-sm text-muted-foreground">
                    {new Date(procedure.effectiveDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              {procedure.expirationDate && (
                <div>
                  <label className="text-sm font-medium">Expiration Date:</label>
                  <div className="text-sm text-muted-foreground">
                    {new Date(procedure.expirationDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Created:</label>
                <div className="text-sm text-muted-foreground">
                  {new Date(procedure.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Updated:</label>
                <div className="text-sm text-muted-foreground">
                  {new Date(procedure.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
