import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function WorkflowsPage() {
  const session = await getServerSession(authOptions)
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          Workflow Diagrams
        </h1>
        <p className="text-muted-foreground">
          Visual workflow and dependency diagrams
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Workflow Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Workflow diagram visualization coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
