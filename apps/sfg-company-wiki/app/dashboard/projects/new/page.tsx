
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { SFG_CONFIG } from '@/lib/sfg-config'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    customer: '',
    project: '',
    location: '',
    productType: '',
    deliveryType: '',
    customerOrderNumber: '',
    enquiryInitialCount: '',
    notes: '',
    priority: 'MEDIUM'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create project')
      }

      const project = await response.json()
      router.push(`/dashboard/projects/${project.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard/projects">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-1">
          A unique BaseNumber will be automatically allocated
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle>Required Fields</CardTitle>
            <CardDescription>
              All fields are required for ENQ → QUO progression
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer">Customer Name *</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => handleChange('customer', e.target.value)}
                placeholder="Company or individual name"
                className="bg-white/80"
              />
            </div>

            <div>
              <Label htmlFor="project">Project Name *</Label>
              <Input
                id="project"
                value={formData.project}
                onChange={(e) => handleChange('project', e.target.value)}
                placeholder="e.g., Office Refurbishment"
                className="bg-white/80"
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., London, Birmingham"
                className="bg-white/80"
              />
            </div>

            <div>
              <Label htmlFor="productType">Product Type *</Label>
              <Select value={formData.productType} onValueChange={(val) => handleChange('productType', val)}>
                <SelectTrigger className="bg-white/80">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {SFG_CONFIG.PRODUCT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deliveryType">Delivery Type *</Label>
              <Select value={formData.deliveryType} onValueChange={(val) => handleChange('deliveryType', val)}>
                <SelectTrigger className="bg-white/80">
                  <SelectValue placeholder="Select delivery type" />
                </SelectTrigger>
                <SelectContent>
                  {SFG_CONFIG.DELIVERY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="enquiryInitialCount">Initial Product Count *</Label>
              <Input
                id="enquiryInitialCount"
                type="number"
                min="0"
                value={formData.enquiryInitialCount}
                onChange={(e) => handleChange('enquiryInitialCount', e.target.value)}
                placeholder="Number of products in enquiry"
                className="bg-white/80"
              />
              <p className="text-xs text-gray-500 mt-1">
                Count only complete deliverables with their own price
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Optional fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerOrderNumber">Customer Order Number</Label>
              <Input
                id="customerOrderNumber"
                value={formData.customerOrderNumber}
                onChange={(e) => handleChange('customerOrderNumber', e.target.value)}
                placeholder="Optional"
                className="bg-white/80"
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(val) => handleChange('priority', val)}>
                <SelectTrigger className="bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional notes about this enquiry"
                rows={4}
                className="bg-white/80"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link href="/dashboard/projects" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Project
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
