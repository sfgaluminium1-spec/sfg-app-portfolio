
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Hash,
  Plus,
  Settings,
  Calendar,
  FileText,
  Code,
  ArrowRight,
} from "lucide-react"

export default async function ProjectNumberingPage() {
  const session = await getServerSession(authOptions)

  // Get project numbering systems from database
  const numberingSystems = await prisma.projectNumbering.findMany({
    orderBy: { createdAt: "desc" },
  })

  // Sample project categories
  const sampleCategories = [
    { code: "SW", name: "Software Development", description: "Software projects and applications" },
    { code: "MKT", name: "Marketing", description: "Marketing campaigns and initiatives" },
    { code: "OPS", name: "Operations", description: "Operational improvements and processes" },
    { code: "RD", name: "R&D", description: "Research and development projects" },
    { code: "HR", name: "Human Resources", description: "HR initiatives and programs" },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Hash className="h-8 w-8" />
            Project Numbering System
          </h1>
          <p className="text-muted-foreground">
            Manage project identification and numbering schemes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Numbering Scheme
        </Button>
      </div>

      {/* Current Numbering Systems */}
      {numberingSystems.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Numbering Systems</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {numberingSystems.map((system) => (
              <Card key={system.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{system.format}</span>
                    <Badge variant="outline">Active</Badge>
                  </CardTitle>
                  <CardDescription>{system.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Next Number:</span>
                      <span className="font-mono">{system.nextNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Year Reset:</span>
                      <span>{system.yearReset ? "Yes" : "No"}</span>
                    </div>
                    {system.prefix && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Prefix:</span>
                        <span className="font-mono">{system.prefix}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Numbering Systems Configured</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project numbering scheme to get started.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Numbering System
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Standard Format Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Standard Format Examples</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Year-Category-Number</CardTitle>
              <CardDescription>Most common format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-mono text-sm bg-muted p-2 rounded">
                PRJ-{currentYear}-SW-001
              </div>
              <div className="text-xs text-muted-foreground">
                Example: PRJ-2025-SW-001 for first software project of 2025
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Department-Sequential</CardTitle>
              <CardDescription>Department-based numbering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-mono text-sm bg-muted p-2 rounded">
                IT-{String(new Date().getMonth() + 1).padStart(2, '0')}-001
              </div>
              <div className="text-xs text-muted-foreground">
                Example: IT-03-001 for first IT project in March
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Simple Sequential</CardTitle>
              <CardDescription>Continuous numbering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-mono text-sm bg-muted p-2 rounded">
                PROJECT-0001
              </div>
              <div className="text-xs text-muted-foreground">
                Example: PROJECT-0001, PROJECT-0002, etc.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Project Categories</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sampleCategories.map((category) => (
            <Card key={category.code} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold">
                    {category.code}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {category.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Numbering Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Numbering Rules & Guidelines</CardTitle>
          <CardDescription>
            Best practices for project numbering systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Format Guidelines
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Use consistent separators (dashes or underscores)</li>
                <li>• Keep total length under 20 characters</li>
                <li>• Use clear, meaningful category codes</li>
                <li>• Avoid special characters that cause system issues</li>
                <li>• Consider sorting and filtering requirements</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timing Considerations
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Reset numbering annually for budget cycles</li>
                <li>• Use fiscal year vs calendar year as appropriate</li>
                <li>• Plan for high-volume project periods</li>
                <li>• Consider archival and historical tracking</li>
                <li>• Allow for emergency or rush project codes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common project numbering tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Generate Next Number
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Modify Format
            </Button>
            <Button variant="outline" className="justify-start">
              <Hash className="h-4 w-4 mr-2" />
              Reset Counter
            </Button>
            <Button variant="outline" className="justify-start">
              <ArrowRight className="h-4 w-4 mr-2" />
              Bulk Assign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
