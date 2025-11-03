
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ProjectStatusBadge } from '@/components/project-status-badge'
import { ArrowLeft, Save, Package, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { SFG_CONFIG } from '@/lib/sfg-config'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatDistance } from 'date-fns'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
        setFormData(data)
      } else {
        setError('Project not found')
      }
    } catch (err) {
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update project')
      }

      const updated = await response.json()
      setProject(updated)
      setFormData(updated)
      setEditMode(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      setSaving(true)
      setError('')
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update status')
      }

      const updated = await response.json()
      setProject(updated)
      setFormData(updated)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Project not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard/projects">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-blue-600">{project.baseNumber}-{project.prefix}</span>
              <ProjectStatusBadge status={project.status} />
            </h1>
            <p className="text-gray-600 mt-1">
              {project.customer} • {project.project}
            </p>
          </div>
          <div className="flex gap-2">
            {!editMode ? (
              <Button onClick={() => setEditMode(true)} variant="outline">
                Edit Details
              </Button>
            ) : (
              <>
                <Button onClick={() => {
                  setEditMode(false)
                  setFormData(project)
                }} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="product-count">
            <Package className="h-4 w-4 mr-2" />
            Product Count
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          {/* Status Progression */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>ENQ → QUO → ORD → INV → DEL → PAID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['ENQ', 'QUO', 'ORD', 'INV', 'DEL', 'PAID'].map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={saving}
                    variant={project.status === status ? 'default' : 'outline'}
                    className={project.status === status ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Information */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode ? (
                <>
                  <div>
                    <Label>Customer Name</Label>
                    <Input
                      value={formData.customer || ''}
                      onChange={(e) => setFormData({...formData, customer: e.target.value})}
                      className="bg-white/80"
                    />
                  </div>
                  <div>
                    <Label>Project Name</Label>
                    <Input
                      value={formData.project || ''}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                      className="bg-white/80"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={formData.location || ''}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="bg-white/80"
                    />
                  </div>
                  <div>
                    <Label>Product Type</Label>
                    <Select 
                      value={formData.productType || ''} 
                      onValueChange={(val) => setFormData({...formData, productType: val})}
                    >
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
                    <Label>Delivery Type</Label>
                    <Select 
                      value={formData.deliveryType || ''} 
                      onValueChange={(val) => setFormData({...formData, deliveryType: val})}
                    >
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
                    <Label>Customer Order Number</Label>
                    <Input
                      value={formData.customerOrderNumber || ''}
                      onChange={(e) => setFormData({...formData, customerOrderNumber: e.target.value})}
                      className="bg-white/80"
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={4}
                      className="bg-white/80"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Customer</Label>
                    <p className="text-lg font-medium">{project.customer || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Project</Label>
                    <p className="text-lg font-medium">{project.project || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Location</Label>
                    <p className="text-lg font-medium">{project.location || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Product Type</Label>
                    <p className="text-lg font-medium">{project.productType || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Delivery Type</Label>
                    <p className="text-lg font-medium">
                      {project.deliveryType ? 
                        SFG_CONFIG.DELIVERY_TYPES.find(t => t.value === project.deliveryType)?.label 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Customer Order Number</Label>
                    <p className="text-lg font-medium">{project.customerOrderNumber || 'N/A'}</p>
                  </div>
                  {project.notes && (
                    <div className="col-span-2">
                      <Label className="text-gray-500">Notes</Label>
                      <p className="text-lg">{project.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product-count">
          <ProductCountTab project={project} onUpdate={fetchProject} />
        </TabsContent>

        <TabsContent value="documents">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle>Documents & Attachments</CardTitle>
              <CardDescription>Coming soon - File upload and management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Document management will be implemented in Phase 2</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.enquiryDate && (
                  <TimelineItem 
                    status="ENQ" 
                    date={project.enquiryDate} 
                    label="Enquiry Received"
                  />
                )}
                {project.quoteDate && (
                  <TimelineItem 
                    status="QUO" 
                    date={project.quoteDate} 
                    label="Quote Issued"
                  />
                )}
                {project.orderDate && (
                  <TimelineItem 
                    status="ORD" 
                    date={project.orderDate} 
                    label="Order Confirmed"
                  />
                )}
                {project.invoiceDate && (
                  <TimelineItem 
                    status="INV" 
                    date={project.invoiceDate} 
                    label="Invoice Raised"
                  />
                )}
                {project.deliveryDate && (
                  <TimelineItem 
                    status="DEL" 
                    date={project.deliveryDate} 
                    label="Delivered"
                  />
                )}
                {project.paidDate && (
                  <TimelineItem 
                    status="PAID" 
                    date={project.paidDate} 
                    label="Payment Received"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TimelineItem({ status, date, label }: { status: string; date: string; label: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-white/40 rounded-lg border border-gray-200/50">
      <ProjectStatusBadge status={status as any} />
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">
          {formatDistance(new Date(date), new Date(), { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}

function ProductCountTab({ project, onUpdate }: { project: any; onUpdate: () => void }) {
  const [newCount, setNewCount] = useState(project.currentProductCount || 0)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleUpdateCount = async () => {
    try {
      setSaving(true)
      setError('')
      const response = await fetch(`/api/projects/${project.id}/product-count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newCount,
          note,
          source: 'Manual',
          pricingStatus: 'Pricing Needed'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update product count')
      }

      setNote('')
      onUpdate()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <CardTitle>Current Product Count</CardTitle>
          <CardDescription>Track product count changes throughout project lifecycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Label className="text-gray-600">Initial Count</Label>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {project.enquiryInitialCount || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Label className="text-gray-600">Current Count</Label>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {project.currentProductCount || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Label className="text-gray-600">Delivered</Label>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {project.deliveredCount + project.collectedCount}
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label>New Product Count</Label>
              <Input
                type="number"
                min="0"
                value={newCount}
                onChange={(e) => setNewCount(parseInt(e.target.value) || 0)}
                className="bg-white/80"
              />
            </div>
            <div>
              <Label>Note (reason for change)</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Explain the reason for count change..."
                rows={3}
                className="bg-white/80"
              />
            </div>
            <Button
              onClick={handleUpdateCount}
              disabled={saving || newCount === project.currentProductCount}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {saving ? 'Updating...' : 'Update Product Count'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <CardTitle>Product Count History</CardTitle>
        </CardHeader>
        <CardContent>
          {project.productCountLogs?.length > 0 ? (
            <div className="space-y-3">
              {project.productCountLogs.map((log: any) => (
                <div key={log.id} className="p-4 bg-white/40 rounded-lg border border-gray-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{log.source}</Badge>
                    <span className="text-sm text-gray-500">
                      {formatDistance(new Date(log.createdAt), new Date(), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="font-medium">
                    {log.oldCount !== null ? `${log.oldCount} → ` : ''}
                    {log.newCount} products
                    {log.delta !== 0 && (
                      <span className={log.delta > 0 ? 'text-green-600' : 'text-red-600'}>
                        {' '}({log.delta > 0 ? '+' : ''}{log.delta})
                      </span>
                    )}
                  </p>
                  {log.note && <p className="text-sm text-gray-600 mt-1">{log.note}</p>}
                  <div className="flex gap-2 mt-2">
                    {!log.estimatorSignoff && (
                      <Badge variant="secondary" className="text-xs">
                        Awaiting Estimator Sign-off
                      </Badge>
                    )}
                    {!log.financeAcknowledged && (
                      <Badge variant="secondary" className="text-xs">
                        Awaiting Finance Acknowledgment
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-6">No product count changes yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
