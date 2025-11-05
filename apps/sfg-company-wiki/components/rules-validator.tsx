
'use client'

import { useState } from 'react'
import { TransparentCard, TransparentCardHeader, TransparentCardTitle, TransparentCardContent } from './ui/transparent-card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import {
  validateMargin,
  validateCreditApproval,
  validateInsuranceCompliance,
  MARGIN_RULES,
  STAFF_TIERS,
  type StaffTierType,
} from '@/lib/business-rules'

export function RulesValidator() {
  const [results, setResults] = useState<{
    margin?: ReturnType<typeof validateMargin>
    credit?: ReturnType<typeof validateCreditApproval>
    insurance?: ReturnType<typeof validateInsuranceCompliance>
  }>({})

  const [marginInputs, setMarginInputs] = useState({
    jobType: 'supplyAndInstall' as keyof typeof MARGIN_RULES,
    cost: 10000,
    price: 18000,
  })

  const [creditInputs, setCreditInputs] = useState({
    amount: 5000,
    userTier: 'standard' as StaffTierType,
  })

  const [insuranceInputs, setInsuranceInputs] = useState({
    workHeight: 10,
    workDepth: 1,
    includesGroundwork: false,
    workType: [] as string[],
  })

  const runMarginValidation = () => {
    const result = validateMargin(marginInputs.jobType, marginInputs.cost, marginInputs.price)
    setResults((prev) => ({ ...prev, margin: result }))
  }

  const runCreditValidation = () => {
    const result = validateCreditApproval(creditInputs.amount, creditInputs.userTier)
    setResults((prev) => ({ ...prev, credit: result }))
  }

  const runInsuranceValidation = () => {
    const result = validateInsuranceCompliance(insuranceInputs)
    setResults((prev) => ({ ...prev, insurance: result }))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Margin Validator */}
      <TransparentCard>
        <TransparentCardHeader>
          <TransparentCardTitle className="text-lg">Margin Validator</TransparentCardTitle>
        </TransparentCardHeader>
        <TransparentCardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobType" className="text-white">Job Type</Label>
            <Select
              value={marginInputs.jobType}
              onValueChange={(value) =>
                setMarginInputs((prev) => ({ ...prev, jobType: value as any }))
              }
            >
              <SelectTrigger id="jobType" className="bg-white/10 text-white border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MARGIN_RULES).map(([key, rule]) => (
                  <SelectItem key={key} value={key}>
                    {rule.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost" className="text-white">Cost (£)</Label>
            <Input
              id="cost"
              type="number"
              value={marginInputs.cost}
              onChange={(e) =>
                setMarginInputs((prev) => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))
              }
              className="bg-white/10 text-white border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">Price (£)</Label>
            <Input
              id="price"
              type="number"
              value={marginInputs.price}
              onChange={(e) =>
                setMarginInputs((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
              }
              className="bg-white/10 text-white border-white/20"
            />
          </div>

          <Button onClick={runMarginValidation} className="w-full">
            Validate Margin
          </Button>

          {results.margin && (
            <div className={`p-4 rounded-lg ${
              results.margin.severity === 'ok' 
                ? 'bg-green-500/20 border border-green-500/50' 
                : results.margin.severity === 'warning'
                ? 'bg-yellow-500/20 border border-yellow-500/50'
                : 'bg-red-500/20 border border-red-500/50'
            }`}>
              <div className="flex items-start gap-2">
                {results.margin.severity === 'ok' && <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />}
                {results.margin.severity === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />}
                {results.margin.severity === 'critical' && <XCircle className="h-5 w-5 text-red-400 mt-0.5" />}
                <div className="flex-1 text-sm text-white">
                  <p className="font-semibold">Margin: {results.margin.margin.toFixed(1)}%</p>
                  <p className="text-white/80 mt-1">{results.margin.message}</p>
                </div>
              </div>
            </div>
          )}
        </TransparentCardContent>
      </TransparentCard>

      {/* Credit Approval Validator */}
      <TransparentCard>
        <TransparentCardHeader>
          <TransparentCardTitle className="text-lg">Credit Approval</TransparentCardTitle>
        </TransparentCardHeader>
        <TransparentCardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white">Amount (£)</Label>
            <Input
              id="amount"
              type="number"
              value={creditInputs.amount}
              onChange={(e) =>
                setCreditInputs((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))
              }
              className="bg-white/10 text-white border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userTier" className="text-white">Your Staff Tier</Label>
            <Select
              value={creditInputs.userTier}
              onValueChange={(value) =>
                setCreditInputs((prev) => ({ ...prev, userTier: value as StaffTierType }))
              }
            >
              <SelectTrigger id="userTier" className="bg-white/10 text-white border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STAFF_TIERS).map(([key, tier]) => (
                  <SelectItem key={key} value={key}>
                    {tier.name} (£{tier.approvalLimit === Infinity ? 'Unlimited' : tier.approvalLimit.toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={runCreditValidation} className="w-full">
            Check Approval
          </Button>

          {results.credit && (
            <div className={`p-4 rounded-lg ${
              results.credit.canCurrentUserApprove
                ? 'bg-green-500/20 border border-green-500/50'
                : 'bg-yellow-500/20 border border-yellow-500/50'
            }`}>
              <div className="flex items-start gap-2">
                {results.credit.canCurrentUserApprove ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                )}
                <p className="flex-1 text-sm text-white">{results.credit.message}</p>
              </div>
            </div>
          )}
        </TransparentCardContent>
      </TransparentCard>

      {/* Insurance Compliance Validator */}
      <TransparentCard>
        <TransparentCardHeader>
          <TransparentCardTitle className="text-lg">Insurance Check</TransparentCardTitle>
        </TransparentCardHeader>
        <TransparentCardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workHeight" className="text-white">Work Height (m)</Label>
            <Input
              id="workHeight"
              type="number"
              value={insuranceInputs.workHeight}
              onChange={(e) =>
                setInsuranceInputs((prev) => ({ ...prev, workHeight: parseFloat(e.target.value) || 0 }))
              }
              className="bg-white/10 text-white border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workDepth" className="text-white">Work Depth (m)</Label>
            <Input
              id="workDepth"
              type="number"
              value={insuranceInputs.workDepth}
              onChange={(e) =>
                setInsuranceInputs((prev) => ({ ...prev, workDepth: parseFloat(e.target.value) || 0 }))
              }
              className="bg-white/10 text-white border-white/20"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="groundwork"
              type="checkbox"
              checked={insuranceInputs.includesGroundwork}
              onChange={(e) =>
                setInsuranceInputs((prev) => ({ ...prev, includesGroundwork: e.target.checked }))
              }
              className="h-4 w-4"
            />
            <Label htmlFor="groundwork" className="text-white cursor-pointer">
              Includes Groundwork
            </Label>
          </div>

          <Button onClick={runInsuranceValidation} className="w-full">
            Check Insurance
          </Button>

          {results.insurance && (
            <div className={`p-4 rounded-lg ${
              results.insurance.isPermitted
                ? 'bg-green-500/20 border border-green-500/50'
                : 'bg-red-500/20 border border-red-500/50'
            }`}>
              <div className="space-y-2">
                {results.insurance.isPermitted ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                    <p className="flex-1 text-sm text-white font-semibold">
                      ✅ Work is covered by insurance
                    </p>
                  </div>
                ) : (
                  <>
                    {results.insurance.violations.map((violation, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="flex-1 text-xs text-white">{violation}</p>
                      </div>
                    ))}
                  </>
                )}
                {results.insurance.warnings.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/20">
                    {results.insurance.warnings.map((warning, i) => (
                      <div key={i} className="flex items-start gap-2 mt-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="flex-1 text-xs text-white/80">{warning}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </TransparentCardContent>
      </TransparentCard>
    </div>
  )
}
