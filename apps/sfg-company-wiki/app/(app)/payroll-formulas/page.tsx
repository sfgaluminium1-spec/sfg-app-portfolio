import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PayrollFormulasPage() {
  const session = await getServerSession(authOptions)
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          Payroll Formulas
        </h1>
        <p className="text-muted-foreground">
          Overtime, bonus, and deduction formulas
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payroll Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Payroll formula configuration coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
