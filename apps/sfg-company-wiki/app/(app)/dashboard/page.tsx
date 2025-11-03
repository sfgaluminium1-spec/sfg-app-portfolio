
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TransparentCard, TransparentCardContent, TransparentCardDescription, TransparentCardHeader, TransparentCardTitle } from "@/components/ui/transparent-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  AlertTriangle,
  Database,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { RulesValidator } from "@/components/rules-validator"
import { FINANCIAL_TARGETS, CUSTOMER_TIERS, STAFF_TIERS, INSURANCE_LIMITS } from "@/lib/business-rules"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Get dashboard statistics
  const [
    totalProcedures,
    totalConflicts,
    criticalConflicts,
    totalCategories,
    recentProcedures,
    conflictsBySeverity,
  ] = await Promise.all([
    prisma.procedure.count({
      where: { isLatestVersion: true },
    }),
    prisma.conflictReport.count(),
    prisma.conflictReport.count({
      where: { severity: "CRITICAL", status: "DETECTED" },
    }),
    prisma.category.count({
      where: { isActive: true },
    }),
    prisma.procedure.findMany({
      where: { isLatestVersion: true },
      include: {
        category: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.conflictReport.groupBy({
      by: ["severity"],
      _count: {
        severity: true,
      },
    }),
  ])

  const stats = [
    {
      title: "Total Procedures",
      value: totalProcedures.toString(),
      description: "Active company procedures",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Conflicts",
      value: totalConflicts.toString(),
      description: "Detected conflicts",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Critical Issues",
      value: criticalConflicts.toString(),
      description: "Require immediate attention",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Categories",
      value: totalCategories.toString(),
      description: "Knowledge categories",
      icon: Database,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const priorityColors = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          Welcome back, {session?.user?.name || session?.user?.email}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your SFG Aluminium knowledge base today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} ${stat.color} p-2 rounded-md`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Business Rules Validator Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight gradient-text">Live Business Rules Validator</h2>
          <p className="text-muted-foreground">
            Test margin calculations, credit approvals, and insurance compliance in real-time using extracted SFG Aluminium rules
          </p>
        </div>
        <RulesValidator />
      </div>

      {/* Business Rules Reference Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <TransparentCard glassLevel="light">
          <TransparentCardHeader>
            <TransparentCardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial Targets
            </TransparentCardTitle>
          </TransparentCardHeader>
          <TransparentCardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/90">Monthly Target</span>
                <span className="text-white/60 font-semibold">£{FINANCIAL_TARGETS.monthlyTurnover.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/90">Daily Target</span>
                <span className="text-white/60 font-semibold">£{FINANCIAL_TARGETS.dailyTurnover.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/90">Target Margin</span>
                <span className="text-white/60 font-semibold">{FINANCIAL_TARGETS.targetMarginMax}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/90">Minimum Margin</span>
                <span className="text-red-400 font-semibold">{FINANCIAL_TARGETS.absoluteMinimumMargin}%</span>
              </div>
            </div>
          </TransparentCardContent>
        </TransparentCard>

        <TransparentCard glassLevel="light">
          <TransparentCardHeader>
            <TransparentCardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff Tiers
            </TransparentCardTitle>
          </TransparentCardHeader>
          <TransparentCardContent>
            <div className="space-y-2">
              {Object.entries(STAFF_TIERS).map(([key, tier]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-white/90">{tier.name}</span>
                  <span className="text-white/60">
                    £{tier.approvalLimit === Infinity ? 'Unlimited' : tier.approvalLimit.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </TransparentCardContent>
        </TransparentCard>

        <TransparentCard glassLevel="light">
          <TransparentCardHeader>
            <TransparentCardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Insurance Limits
            </TransparentCardTitle>
          </TransparentCardHeader>
          <TransparentCardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/90">Max Work Height</span>
                <span className="text-white/60">{INSURANCE_LIMITS.maxWorkHeight}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/90">Max Work Depth</span>
                <span className="text-white/60">{INSURANCE_LIMITS.maxWorkDepth}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/90">Public Liability</span>
                <span className="text-white/60">£{(INSURANCE_LIMITS.publicLiability / 1000000).toFixed(0)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/90">Groundwork</span>
                <Badge variant="destructive" className="text-xs">Prohibited</Badge>
              </div>
            </div>
          </TransparentCardContent>
        </TransparentCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Procedures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Updates
            </CardTitle>
            <CardDescription>
              Latest procedure changes and additions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProcedures.length > 0 ? (
              recentProcedures.map((procedure) => (
                <div key={procedure.id} className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/procedures/${procedure.id}`}
                      className="text-sm font-medium hover:underline text-primary"
                    >
                      {procedure.title}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {procedure.category.name}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          priorityColors[procedure.priority as keyof typeof priorityColors]
                        }`}
                      >
                        {procedure.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      By {procedure.createdBy?.firstName} {procedure.createdBy?.lastName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent procedures found.
              </p>
            )}
            <div className="pt-4">
              <Link href="/procedures">
                <Button variant="outline" size="sm">
                  View All Procedures
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Conflicts Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Conflicts Overview
            </CardTitle>
            <CardDescription>
              Current system conflicts by severity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {conflictsBySeverity.length > 0 ? (
              <div className="space-y-3">
                {conflictsBySeverity.map((conflict) => (
                  <div key={conflict.severity} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          conflict.severity === "CRITICAL"
                            ? "bg-red-100 text-red-800"
                            : conflict.severity === "HIGH"
                            ? "bg-orange-100 text-orange-800"
                            : conflict.severity === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {conflict.severity}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">
                      {conflict._count.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No conflicts detected
                </p>
              </div>
            )}
            <div className="pt-4">
              <Link href="/conflicts">
                <Button variant="outline" size="sm">
                  View All Conflicts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/procedures/new">
              <Button className="w-full" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                New Procedure
              </Button>
            </Link>
            <Link href="/categories">
              <Button className="w-full" variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </Link>
            <Link href="/import">
              <Button className="w-full" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </Link>
            <Link href="/chat">
              <Button className="w-full" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                AI Assistant
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
