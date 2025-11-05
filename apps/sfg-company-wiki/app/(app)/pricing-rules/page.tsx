import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PricingRulesPage() {
  const session = await getServerSession(authOptions)
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          Pricing Rules & Margins
        </h1>
        <p className="text-muted-foreground">
          Configure pricing methods, markup percentages, and margin guardrails
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pricing Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Pricing rules and margin configuration coming soon. See Prompt Library for quotation guardrails.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
