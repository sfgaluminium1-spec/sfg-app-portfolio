import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, DollarSign, FileText, Shield } from "lucide-react"
import Link from "next/link"

export default async function CreditChecksPage() {
  const session = await getServerSession(authOptions)
  
  // Fetch credit check protocols
  const protocols = await prisma.creditCheckProtocol.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          Credit Check Protocols
        </h1>
        <p className="text-muted-foreground">
          Comprehensive credit checking and approval procedures for SFG Aluminium
        </p>
      </div>

      {/* Key Guidelines Card */}
      <Card className="border-l-4 border-l-tier-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-tier-2" />
            Credit Policy Summary
          </CardTitle>
          <CardDescription>Evidence-backed credit checking guidelines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Default Position
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• New customers: Pay upfront (100%) until credit vetted</li>
                <li>• 50% deposit accepted for low-risk, short lead-time jobs</li>
                <li>• Use CreditSafe to screen all new accounts</li>
                <li>• If not creditworthy, quotation must state prepayment terms</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-tier-2" />
                30-Day Terms
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Only after "credit is good enough" (Accounts decision)</li>
                <li>• Initial limit recommended: £1-5k for new customers</li>
                <li>• Step up based on on-time payments and CreditSafe bands</li>
                <li>• Always check with Accounts before proceeding</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              Approval Matrix (Proposed)
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                <span>Up to £5k limit</span>
                <Badge variant="outline">Accounts</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                <span>£5k - £20k limit</span>
                <Badge variant="outline">Accounts + Ops Manager</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                <span>&gt;£20k or exceptions</span>
                <Badge className="bg-tier-1">Tier 1 (Warren/Pawel)</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-conflict" />
              Collections Cadence
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Day -3</Badge>
                <span className="text-muted-foreground">Gentle reminder before due date</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Day +5</Badge>
                <span className="text-muted-foreground">Second reminder (overdue)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-warning/20 text-warning">Day +15</Badge>
                <span className="text-muted-foreground">Final notice (requires Tier 1 approval)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-conflict/20 text-conflict">Day +30</Badge>
                <span className="text-muted-foreground">Collections + statutory interest</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Check Protocols List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Active Protocols</h2>
        {protocols.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {protocols.map((protocol) => (
              <Card key={protocol.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{protocol.name}</CardTitle>
                  <CardDescription>{protocol.triggerCondition}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Check Types:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {protocol.checkType.map((type, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {protocol.minimumScore && (
                      <div className="text-sm">
                        <span className="font-medium">Minimum Score:</span> {protocol.minimumScore}
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
                No credit check protocols configured. Add your first protocol to get started.
              </p>
              <div className="flex justify-center mt-4">
                <Button>Add Protocol</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link href="/procedures?category=credit">
          <Button variant="outline">
            View Related Procedures
          </Button>
        </Link>
      </div>
    </div>
  )
}
