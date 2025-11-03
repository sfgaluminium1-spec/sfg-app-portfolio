import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ImportPage() {
  const session = await getServerSession(authOptions)
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          Import Data
        </h1>
        <p className="text-muted-foreground">
          Import procedures and data from CSV/Excel files
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Data Import</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Data import functionality coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
