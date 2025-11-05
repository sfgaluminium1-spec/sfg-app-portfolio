import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AuditLogsPage() {
  const session = await getServerSession(authOptions)
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          Audit Trail
        </h1>
        <p className="text-muted-foreground">
          System activity logs and change history
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Audit log viewer coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
