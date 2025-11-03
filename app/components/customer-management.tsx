'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  Plus,
  Filter,
  Users,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  Upload,
  UserPlus,
  Activity,
  CreditCard,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'
import NewCustomerForm from './new-customer-form'

interface Customer {
  id: string
  firstName: string
  lastName?: string
  contactName?: string
  company?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  customerType: string
  customerStatus: string
  creditStatus: string
  dataCompleteness: number
  totalEnquiries: number
  totalQuotes: number
  totalJobs: number
  totalValue: number
  lastActivity: string
  createdAt: string
}

interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  newThisMonth: number
  averageValue: number
  dataQuality: number
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    newThisMonth: 0,
    averageValue: 0,
    dataQuality: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter })
      })

      const response = await fetch(`/api/customers?${params}`)
      const data = await response.json()

      setCustomers(data.customers || [])
      setTotalPages(data.pagination?.totalPages || 1)

      // Calculate stats
      const totalCustomers = data.pagination?.totalCount || 0
      const activeCustomers = data.customers?.filter((c: Customer) => c.customerStatus === 'ACTIVE').length || 0
      const newThisMonth = data.customers?.filter((c: Customer) => {
        const created = new Date(c.createdAt)
        const now = new Date()
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
      }).length || 0
      const averageValue = data.customers?.reduce((sum: number, c: Customer) => sum + c.totalValue, 0) / (data.customers?.length || 1) || 0
      const dataQuality = data.customers?.reduce((sum: number, c: Customer) => sum + c.dataCompleteness, 0) / (data.customers?.length || 1) || 0

      setStats({
        totalCustomers,
        activeCustomers,
        newThisMonth,
        averageValue,
        dataQuality
      })
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [currentPage, searchTerm, statusFilter, typeFilter])

  // Export customers to CSV
  const handleExport = async () => {
    try {
      setLoading(true)
      // Fetch all customers for export (not just current page)
      const response = await fetch('/api/customers?export=true')
      const data = await response.json()

      if (data.customers && data.customers.length > 0) {
        // Convert to CSV
        const csvHeaders = [
          'ID',
          'First Name',
          'Last Name',
          'Company',
          'Email',
          'Phone',
          'Address',
          'Customer Type',
          'Status',
          'Credit Status',
          'Total Value',
          'Created Date'
        ]

        const csvRows = data.customers.map((customer: Customer) => [
          customer.id,
          customer.firstName || '',
          customer.lastName || '',
          customer.company || '',
          customer.email || '',
          customer.phone || '',
          customer.address || '',
          customer.customerType || '',
          customer.customerStatus || '',
          customer.creditStatus || '',
          customer.totalValue || 0,
          customer.createdAt ? formatDate(customer.createdAt) : ''
        ])

        const csvContent = [csvHeaders, ...csvRows]
          .map(row => row.map((field: any) => `"${field}"`).join(','))
          .join('\n')

        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        URL.revokeObjectURL(link.href)

        console.log('Customer data exported successfully')
      } else {
        console.warn('No customer data to export')
      }
    } catch (error) {
      console.error('Error exporting customers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Import customers from CSV
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        setLoading(true)
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/customers/import', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (response.ok) {
          console.log('Import successful:', result)
          fetchCustomers() // Refresh the customer list
        } else {
          console.error('Import failed:', result.error)
        }
      } catch (error) {
        console.error('Error importing customers:', error)
      } finally {
        setLoading(false)
      }
    }
    input.click()
  }

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get customer type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'VIP_CUSTOMER':
        return 'bg-purple-100 text-purple-800'
      case 'ACTIVE_CUSTOMER':
        return 'bg-blue-100 text-blue-800'
      case 'REPEAT_CUSTOMER':
        return 'bg-indigo-100 text-indigo-800'
      case 'LEAD':
        return 'bg-orange-100 text-orange-800'
      case 'PROSPECT':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="warren-container py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600 mt-1">Manage your customer database and relationships</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="warren-btn-secondary flex items-center gap-2"
              onClick={handleExport}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="warren-btn-secondary flex items-center gap-2"
              onClick={handleImport}
              disabled={loading}
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Dialog open={showNewCustomerModal} onOpenChange={setShowNewCustomerModal}>
              <DialogTrigger asChild>
                <Button className="warren-btn-primary flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  New Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Create a new customer record in the system
                  </DialogDescription>
                </DialogHeader>
                <NewCustomerForm
                  onClose={() => setShowNewCustomerModal(false)}
                  onSuccess={fetchCustomers}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Customers</p>
                  <p className="text-2xl font-bold">{stats.activeCustomers.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">New This Month</p>
                  <p className="text-2xl font-bold">{stats.newThisMonth}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Average Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.averageValue)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Data Quality</p>
                  <p className="text-2xl font-bold">{stats.dataQuality.toFixed(1)}%</p>
                </div>
                <Activity className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="VIP_CUSTOMER">VIP</SelectItem>
                <SelectItem value="ACTIVE_CUSTOMER">Active</SelectItem>
                <SelectItem value="REPEAT_CUSTOMER">Repeat</SelectItem>
                <SelectItem value="LEAD">Lead</SelectItem>
                <SelectItem value="PROSPECT">Prospect</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Customer List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Database
              </CardTitle>
              <CardDescription>
                Showing {customers.length} customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {(customer.firstName?.[0] || customer.contactName?.[0] || 'U').toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {customer.contactName || `${customer.firstName} ${customer.lastName || ''}`.trim()}
                              </h3>
                              {customer.company && (
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {customer.company}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              {customer.email ? (
                                <>
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">{customer.email}</span>
                                </>
                              ) : (
                                <span className="text-gray-400">No email</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {customer.phone ? (
                                <>
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">{customer.phone}</span>
                                </>
                              ) : (
                                <span className="text-gray-400">No phone</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{formatCurrency(customer.totalValue)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{formatDate(customer.lastActivity)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <Badge className={getStatusBadgeColor(customer.customerStatus)}>
                              {customer.customerStatus.replace('_', ' ')}
                            </Badge>
                            <Badge className={getTypeBadgeColor(customer.customerType)}>
                              {customer.customerType.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Data Quality:</span>
                            <Progress value={customer.dataCompleteness} className="w-20 h-2" />
                            <span className="text-xs text-gray-600">{customer.dataCompleteness}%</span>
                          </div>
                          
                          <div className="flex gap-1 text-xs text-gray-500">
                            <span>{customer.totalEnquiries} enquiries</span>
                            <span>•</span>
                            <span>{customer.totalQuotes} quotes</span>
                            <span>•</span>
                            <span>{customer.totalJobs} jobs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onUpdate={fetchCustomers}
          />
        )}
      </div>
    </div>
  )
}

// Customer Detail Modal Component
function CustomerDetailModal({
  customer,
  onClose,
  onUpdate
}: {
  customer: Customer
  onClose: () => void
  onUpdate: () => void
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {(customer.firstName?.[0] || customer.contactName?.[0] || 'U').toUpperCase()}
            </div>
            {customer.contactName || `${customer.firstName} ${customer.lastName || ''}`.trim()}
          </DialogTitle>
          <DialogDescription>
            Customer details and activity history
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="quotes">Quotes & Jobs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{customer.company}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{customer.address}</span>
                    </div>
                  )}
                  {customer.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a
                        href={customer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {customer.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP'
                      }).format(customer.totalValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enquiries:</span>
                    <span className="font-semibold">{customer.totalEnquiries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quotes:</span>
                    <span className="font-semibold">{customer.totalQuotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jobs:</span>
                    <span className="font-semibold">{customer.totalJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Quality:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={customer.dataCompleteness} className="w-16 h-2" />
                      <span className="text-sm font-semibold">{customer.dataCompleteness}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Activity history will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Quotes & Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Quote and job history will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Customer Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Customer settings and preferences will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 