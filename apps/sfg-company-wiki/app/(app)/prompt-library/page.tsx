import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  Wrench,
  ClipboardList,
  Star
} from "lucide-react"

export default async function PromptLibraryPage() {
  const session = await getServerSession(authOptions)

  const superstarPrompts = [
    {
      id: 'intake-brief',
      title: 'Intake → Brief → Spec Extract → Risks',
      category: 'Sales & Estimating',
      icon: FileText,
      color: 'text-tier-3',
      bgColor: 'bg-tier-3/20',
      description: 'Read RFQ, drawings, emails, and design brief. Output executive summary, itemised spec, compliance checklist, risks.'
    },
    {
      id: 'quotation-generator',
      title: 'Quotation Generator with Guardrails',
      category: 'Finance',
      icon: DollarSign,
      color: 'text-tier-2',
      bgColor: 'bg-tier-2/20',
      description: 'Build client-ready quote pack with Good/Better/Best options, margin guardrails (40-45%, never <28%).'
    },
    {
      id: 'variation-vo',
      title: 'Variation/VO Builder',
      category: 'Operations',
      icon: Wrench,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
      description: 'Draft contract-safe Variation Order with scope change, cost impact, dayworks breakdown.'
    },
    {
      id: 'executive-weekly',
      title: 'Executive Weekly Pack',
      category: 'Finance',
      icon: TrendingUp,
      color: 'text-tier-1',
      bgColor: 'bg-tier-1/20',
      description: 'Create comprehensive executive pack with finance snapshot, sales pipeline, operations status.'
    },
    {
      id: 'credit-control',
      title: 'Credit Control Suite',
      category: 'Finance',
      icon: Shield,
      color: 'text-conflict',
      bgColor: 'bg-conflict/20',
      description: 'Prepare polite but firm overdue notices with statutory interest/late payment fees.'
    },
    {
      id: 'compliance-pack',
      title: 'Compliance Pack Compiler',
      category: 'Compliance',
      icon: ClipboardList,
      color: 'text-installation',
      bgColor: 'bg-installation/20',
      description: 'Compile project compliance pack with UKCA DoP, CE/UKCA evidence, insurance certificates.'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          Superstar Prompt Library
        </h1>
        <p className="text-muted-foreground">
          High-impact shortcut prompts and templates tailored to SFG Aluminium operations
        </p>
      </div>

      {/* Overview Card */}
      <Card className="border-l-4 border-l-tier-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-tier-1" />
            About This Library
          </CardTitle>
          <CardDescription>Evidence-backed prompts for automation and efficiency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This curated master list of high-impact prompts is tailored to SFG Aluminium and UK construction sectors. 
            Each prompt is evidence-backed and cites uploaded SFG policies and templates.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-tier-1">10+</div>
              <div className="text-xs text-muted-foreground">Superstar Prompts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-tier-2">5</div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-tier-3">100%</div>
              <div className="text-xs text-muted-foreground">Evidence-Backed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-installation">Ready</div>
              <div className="text-xs text-muted-foreground">To Use</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prompts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {superstarPrompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-lg transition-all hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className={`${prompt.bgColor} p-2 rounded-lg`}>
                  <prompt.icon className={`h-5 w-5 ${prompt.color}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base leading-tight">{prompt.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{prompt.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{prompt.description}</p>
              <Button size="sm" className="w-full bg-tier-2 hover:bg-tier-2/90">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt Engineering Tips</CardTitle>
          <CardDescription>Company-wide consistency guidelines</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-warning flex-shrink-0" />
              <span>Always request: "Cite source file and page/cell. Mark assumptions as Gap-filled with logic."</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-tier-2 flex-shrink-0" />
              <span>Constrain tone: "Plain UK English, client-safe, avoid acronyms unless defined."</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-tier-3 flex-shrink-0" />
              <span>Guardrails: "Never propose margins less than 28% or weekend work without 1.5× uplift."</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
