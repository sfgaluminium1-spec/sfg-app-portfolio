import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Shield } from "lucide-react"
import Link from "next/link"

export default async function StaffTiersPage() {
  const session = await getServerSession(authOptions)
  
  const tiers = await prisma.staffTier.findMany({
    orderBy: { level: 'asc' }
  })

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          Staff Tier Levels
        </h1>
        <p className="text-muted-foreground">
          Role classifications, permissions, and access levels for SFG Aluminium staff
        </p>
      </div>

      <Card className="border-l-4 border-l-tier-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-tier-1" />
            SFG Aluminium Staff Tier System
          </CardTitle>
          <CardDescription>Three-tier role structure with specific permissions and access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 p-4 bg-tier-1/10 rounded-lg border border-tier-1">
              <h4 className="font-semibold text-tier-1 flex items-center gap-2">
                Tier 1 - CEO/Executive
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full features and data access</li>
                <li>• All modules visible</li>
                <li>• Admin settings</li>
                <li>• Audit and override capabilities</li>
              </ul>
              <div className="pt-2">
                <Badge className="bg-tier-1">Deep Blue - #2563EB</Badge>
              </div>
            </div>
            <div className="space-y-2 p-4 bg-tier-2/10 rounded-lg border border-tier-2">
              <h4 className="font-semibold text-tier-2 flex items-center gap-2">
                Tier 2 - Finance & Estimation
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Financials, pricing, quotes</li>
                <li>• POs, receivables/payables</li>
                <li>• Margin dashboards</li>
                <li>• Limited admin access</li>
              </ul>
              <div className="pt-2">
                <Badge className="bg-tier-2">Medium Blue - #3B82F6</Badge>
              </div>
            </div>
            <div className="space-y-2 p-4 bg-tier-3/10 rounded-lg border border-tier-3">
              <h4 className="font-semibold text-tier-3 flex items-center gap-2">
                Tier 3 - Sales & Design
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Quotes, CRM, files</li>
                <li>• Drawings, schedules</li>
                <li>• Job boards</li>
                <li>• No finance ledgers</li>
              </ul>
              <div className="pt-2">
                <Badge className="bg-tier-3">Light Blue - #60A5FA</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Configured Tiers</h2>
        {tiers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {tiers.map((tier) => (
              <Card key={tier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <CardDescription>Level {tier.level}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {tier.description && <p className="text-muted-foreground">{tier.description}</p>}
                    {tier.salaryMin && tier.salaryMax && (
                      <div>
                        <span className="font-medium">Salary Range:</span> £{tier.salaryMin.toString()} - £{tier.salaryMax.toString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No staff tiers configured yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
