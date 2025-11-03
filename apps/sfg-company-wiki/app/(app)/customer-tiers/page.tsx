import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard } from "lucide-react"

export default async function CustomerTiersPage() {
  const session = await getServerSession(authOptions)
  const tiers = await prisma.customerTier.findMany({ orderBy: { priority: 'asc' } })

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          Customer Tier Levels
        </h1>
        <p className="text-muted-foreground">
          Customer classifications, payment terms, and credit limits
        </p>
      </div>
      <Card className="border-l-4 border-l-tier-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-tier-2" />
            Customer Tier System
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tiers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {tiers.map((tier) => (
                <Card key={tier.id}>
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>Priority: {tier.priority}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      {tier.paymentTerms && <div><strong>Payment Terms:</strong> {tier.paymentTerms}</div>}
                      {tier.creditLimit && <div><strong>Credit Limit:</strong> £{tier.creditLimit.toString()}</div>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No customer tiers configured.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
