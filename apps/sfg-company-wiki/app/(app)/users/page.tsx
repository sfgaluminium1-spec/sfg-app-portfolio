import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          User Management
        </h1>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Administration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            User management interface coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
