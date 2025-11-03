
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Calculator, 
  Download, 
  Send, 
  Eye, 
  Plus, 
  Calendar, 
  Building, 
  CreditCard, 
  Receipt, 
  Truck, 
  Settings, 
  BarChart3 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardData {
  invoiceStats: {
    total: number;
    totalValue: number;
    totalPaid: number;
    totalDrawdowns: number;
    totalFees: number;
    monthlyCount: number;
    monthlyValue: number;
    monthlyPaid: number;
  };
  paymentStatusBreakdown: Array<{
    paymentStatus: string;
    _count: number;
    _sum: { totalAmount: number };
  }>;
  customerTypeBreakdown: Array<{
    customerType: string;
    _count: number;
    _sum: { totalAmount: number; drawdownAmount: number };
  }>;
  drawdownStats: {
    total: number;
    totalDrawdowns: number;
    totalFees: number;
    totalNet: number;
    pending: number;
  };
  complianceStats: Array<{
    status: string;
    _count: number;
  }>;
  upcomingDeadlines: number;
  recentActivity: {
    invoices: any[];
    deliveries: any[];
  };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  customerType: string;
  customer: {
    firstName: string;
    lastName: string;
    company: string;
  };
  financeDrawdown?: {
    drawdownAmount: number;
    status: string;
  };
}

interface DeliveryTemplate {
  id: string;
  templateNumber: string;
  deliveryDate: string;
  status: string;
  customer: {
    firstName: string;
    lastName: string;
    company: string;
  };
  workCompleted: boolean;
  certificateGenerated: boolean;
}

export default function FinanceDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [deliveryTemplates, setDeliveryTemplates] = useState<DeliveryTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTemplate | null>(null);

  // Form states
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    customerId: '',
    jobId: '',
    quoteId: '',
    subtotal: '',
    vatAmount: '',
    cisDeduction: '',
    totalAmount: '',
    dueDate: '',
    vatStatus: 'STANDARD_RATE',
    cisStatus: 'NOT_APPLICABLE'
  });

  const [newDeliveryForm, setNewDeliveryForm] = useState({
    customerId: '',
    jobId: '',
    invoiceId: '',
    deliveryDate: '',
    deliveryAddress: '',
    installationTeam: '',
    teamLeader: '',
    installationNotes: '',
    specialRequirements: '',
    accessRequirements: ''
  });

  useEffect(() => {
    fetchDashboardData();
    fetchInvoices();
    fetchDeliveryTemplates();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/finance/reports?type=dashboard_summary');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/finance/invoices?limit=20');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchDeliveryTemplates = async () => {
    try {
      const response = await fetch('/api/finance/delivery-templates?limit=20');
      if (response.ok) {
        const data = await response.json();
        setDeliveryTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching delivery templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async () => {
    try {
      const response = await fetch('/api/finance/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newInvoiceForm,
          subtotal: parseFloat(newInvoiceForm.subtotal),
          vatAmount: parseFloat(newInvoiceForm.vatAmount || '0'),
          cisDeduction: parseFloat(newInvoiceForm.cisDeduction || '0'),
          totalAmount: parseFloat(newInvoiceForm.totalAmount),
          dueDate: new Date(newInvoiceForm.dueDate)
        })
      });

      if (response.ok) {
        fetchInvoices();
        fetchDashboardData();
        setNewInvoiceForm({
          customerId: '',
          jobId: '',
          quoteId: '',
          subtotal: '',
          vatAmount: '',
          cisDeduction: '',
          totalAmount: '',
          dueDate: '',
          vatStatus: 'STANDARD_RATE',
          cisStatus: 'NOT_APPLICABLE'
        });
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const createDeliveryTemplate = async () => {
    try {
      const response = await fetch('/api/finance/delivery-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDeliveryForm,
          deliveryDate: new Date(newDeliveryForm.deliveryDate)
        })
      });

      if (response.ok) {
        fetchDeliveryTemplates();
        setNewDeliveryForm({
          customerId: '',
          jobId: '',
          invoiceId: '',
          deliveryDate: '',
          deliveryAddress: '',
          installationTeam: '',
          teamLeader: '',
          installationNotes: '',
          specialRequirements: '',
          accessRequirements: ''
        });
      }
    } catch (error) {
      console.error('Error creating delivery template:', error);
    }
  };

  const generateAutomaticReminders = async () => {
    try {
      const response = await fetch('/api/finance/payment-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_automatic_reminders' })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Generated ${data.reminders.length} automatic payment reminders`);
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error generating reminders:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      PAID: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      OVERDUE: { color: 'bg-red-100 text-red-800', label: 'Overdue' },
      PARTIAL: { color: 'bg-blue-100 text-blue-800', label: 'Partial' },
      SCHEDULED: { color: 'bg-purple-100 text-purple-800', label: 'Scheduled' },
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: status
    };

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getCustomerTypeBadge = (type: string) => {
    const typeConfig = {
      TYPE_1: { color: 'bg-green-100 text-green-800', label: 'Type 1 - Full Eligibility' },
      TYPE_2: { color: 'bg-blue-100 text-blue-800', label: 'Type 2 - Standard' },
      TYPE_3: { color: 'bg-yellow-100 text-yellow-800', label: 'Type 3 - Limited' },
      TYPE_4: { color: 'bg-red-100 text-red-800', label: 'Type 4 - No Eligibility' }
    };

    const config = typeConfig[type as keyof typeof typeConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: type
    };

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SFG TIME Finance</h1>
          <p className="text-gray-600">Invoice Finance Management & Delivery Templates</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateAutomaticReminders} variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Generate Reminders
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Create a new invoice with automatic finance eligibility calculation
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerId">Customer ID</Label>
                  <Input
                    id="customerId"
                    value={newInvoiceForm.customerId}
                    onChange={(e) => setNewInvoiceForm({...newInvoiceForm, customerId: e.target.value})}
                    placeholder="Customer ID"
                  />
                </div>
                <div>
                  <Label htmlFor="jobId">Job ID (Optional)</Label>
                  <Input
                    id="jobId"
                    value={newInvoiceForm.jobId}
                    onChange={(e) => setNewInvoiceForm({...newInvoiceForm, jobId: e.target.value})}
                    placeholder="Job ID"
                  />
                </div>
                <div>
                  <Label htmlFor="subtotal">Subtotal</Label>
                  <Input
                    id="subtotal"
                    type="number"
                    step="0.01"
                    value={newInvoiceForm.subtotal}
                    onChange={(e) => setNewInvoiceForm({...newInvoiceForm, subtotal: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="vatAmount">VAT Amount</Label>
                  <Input
                    id="vatAmount"
                    type="number"
                    step="0.01"
                    value={newInvoiceForm.vatAmount}
                    onChange={(e) => setNewInvoiceForm({...newInvoiceForm, vatAmount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    value={newInvoiceForm.totalAmount}
                    onChange={(e) => setNewInvoiceForm({...newInvoiceForm, totalAmount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newInvoiceForm.dueDate}
                    onChange={(e) => setNewInvoiceForm({...newInvoiceForm, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="vatStatus">VAT Status</Label>
                  <Select
                    value={newInvoiceForm.vatStatus}
                    onValueChange={(value) => setNewInvoiceForm({...newInvoiceForm, vatStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD_RATE">Standard Rate</SelectItem>
                      <SelectItem value="REDUCED_RATE">Reduced Rate</SelectItem>
                      <SelectItem value="ZERO_RATE">Zero Rate</SelectItem>
                      <SelectItem value="EXEMPT">Exempt</SelectItem>
                      <SelectItem value="REVERSE_CHARGE">Reverse Charge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cisStatus">CIS Status</Label>
                  <Select
                    value={newInvoiceForm.cisStatus}
                    onValueChange={(value) => setNewInvoiceForm({...newInvoiceForm, cisStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
                      <SelectItem value="STANDARD_RATE">Standard Rate</SelectItem>
                      <SelectItem value="HIGHER_RATE">Higher Rate</SelectItem>
                      <SelectItem value="GROSS_PAYMENT">Gross Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={createInvoice} className="w-full">
                Create Invoice
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.invoiceStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  £{dashboardData.invoiceStats.totalValue.toLocaleString()} total value
                </p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Finance Drawdowns</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{dashboardData.drawdownStats.totalDrawdowns.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.drawdownStats.pending} pending approvals
                </p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Finance Fees</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{dashboardData.drawdownStats.totalFees.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  3.967% average rate
                </p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Deadlines</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.upcomingDeadlines}</div>
                <p className="text-xs text-muted-foreground">
                  Due in next 7 days
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Templates</TabsTrigger>
          <TabsTrigger value="drawdowns">Drawdowns</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Status Breakdown */}
            {dashboardData && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status Breakdown</CardTitle>
                  <CardDescription>Current invoice payment status distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.paymentStatusBreakdown.map((status, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(status.paymentStatus)}
                          <span className="text-sm">{status._count} invoices</span>
                        </div>
                        <span className="font-medium">£{status._sum.totalAmount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Type Analysis */}
            {dashboardData && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Type Analysis</CardTitle>
                  <CardDescription>Finance eligibility by customer type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.customerTypeBreakdown.map((type, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          {getCustomerTypeBadge(type.customerType)}
                          <span className="text-sm">{type._count} customers</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Total: £{type._sum.totalAmount.toLocaleString()} | Drawdowns: £{(type._sum.drawdownAmount || 0).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Latest invoice activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData?.recentActivity.invoices.map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-600">
                          {invoice.customer.company || `${invoice.customer.firstName} ${invoice.customer.lastName}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">£{invoice.totalAmount.toLocaleString()}</div>
                        {getStatusBadge(invoice.paymentStatus)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>Latest delivery template activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData?.recentActivity.deliveries.map((delivery, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{delivery.templateNumber}</div>
                        <div className="text-sm text-gray-600">
                          {delivery.customer.company || `${delivery.customer.firstName} ${delivery.customer.lastName}`}
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(delivery.status)}
                        {delivery.certificateGenerated && (
                          <div className="text-xs text-green-600 mt-1">Certificate Generated</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>Manage invoices and finance drawdowns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer Type</TableHead>
                    <TableHead>Drawdown</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>
                        {invoice.customer.company || `${invoice.customer.firstName} ${invoice.customer.lastName}`}
                      </TableCell>
                      <TableCell>£{invoice.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(invoice.paymentStatus)}</TableCell>
                      <TableCell>{getCustomerTypeBadge(invoice.customerType)}</TableCell>
                      <TableCell>
                        {invoice.financeDrawdown ? (
                          <div>
                            <div className="font-medium">£{invoice.financeDrawdown.drawdownAmount.toLocaleString()}</div>
                            <div className="text-xs">{getStatusBadge(invoice.financeDrawdown.status)}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not eligible</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Delivery Templates</h2>
              <p className="text-gray-600">Professional completion certificates with automatic product population</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Delivery Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Delivery Template</DialogTitle>
                  <DialogDescription>
                    Create a new delivery template with automatic product detail population
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerId">Customer ID</Label>
                    <Input
                      id="customerId"
                      value={newDeliveryForm.customerId}
                      onChange={(e) => setNewDeliveryForm({...newDeliveryForm, customerId: e.target.value})}
                      placeholder="Customer ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobId">Job ID</Label>
                    <Input
                      id="jobId"
                      value={newDeliveryForm.jobId}
                      onChange={(e) => setNewDeliveryForm({...newDeliveryForm, jobId: e.target.value})}
                      placeholder="Job ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoiceId">Invoice ID</Label>
                    <Input
                      id="invoiceId"
                      value={newDeliveryForm.invoiceId}
                      onChange={(e) => setNewDeliveryForm({...newDeliveryForm, invoiceId: e.target.value})}
                      placeholder="Invoice ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={newDeliveryForm.deliveryDate}
                      onChange={(e) => setNewDeliveryForm({...newDeliveryForm, deliveryDate: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Input
                      id="deliveryAddress"
                      value={newDeliveryForm.deliveryAddress}
                      onChange={(e) => setNewDeliveryForm({...newDeliveryForm, deliveryAddress: e.target.value})}
                      placeholder="Full delivery address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="installationTeam">Installation Team</Label>
                    <Input
                      id="installationTeam"
                      value={newDeliveryForm.installationTeam}
                      onChange={(e) => setNewDeliveryForm({...newDeliveryForm, installationTeam: e.target.value})}
                      placeholder="Team name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamLeader">Team Leader</Label>
                    <Input
                      id="teamLeader"
                      value={newDeliveryForm.teamLeader}
                      onChange={(e) => setNewDeliveryForm({...newDeliveryForm, teamLeader: e.target.value})}
                      placeholder="Team leader name"
                    />
                  </div>
                </div>
                <Button onClick={createDeliveryTemplate} className="w-full">
                  Create Delivery Template
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.templateNumber}</TableCell>
                      <TableCell>
                        {template.customer.company || `${template.customer.firstName} ${template.customer.lastName}`}
                      </TableCell>
                      <TableCell>{new Date(template.deliveryDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(template.status)}</TableCell>
                      <TableCell>
                        {template.workCompleted ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {template.certificateGenerated ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Receipt className="h-3 w-3 mr-1" />
                            Generated
                          </Badge>
                        ) : (
                          <span className="text-gray-400">Not generated</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDelivery(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drawdowns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Finance Drawdowns</CardTitle>
              <CardDescription>80% drawdown tracking with 3.967% fees</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Finance drawdowns are automatically calculated at 80% of eligible invoice amounts with 3.967% fees.
                  Customer types 1 & 2 are eligible by default.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VAT/CIS Compliance</CardTitle>
              <CardDescription>Automated compliance tracking and deadline management</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  VAT submissions due by 7th of following month. CIS submissions due by 19th of following month.
                  Quarterly deadlines on last day of month following quarter.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Cash flow analysis, compliance reports, and reconciliation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Cash Flow Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Drawdown Analysis
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <CheckCircle className="h-6 w-6 mb-2" />
                  Compliance Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Invoice Details - {selectedInvoice.invoiceNumber}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Invoice Information</h3>
                <div className="space-y-2 text-sm">
                  <div>Customer: {selectedInvoice.customer.company || `${selectedInvoice.customer.firstName} ${selectedInvoice.customer.lastName}`}</div>
                  <div>Amount: £{selectedInvoice.totalAmount.toLocaleString()}</div>
                  <div>Paid: £{selectedInvoice.paidAmount.toLocaleString()}</div>
                  <div>Due Date: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</div>
                  <div>Status: {getStatusBadge(selectedInvoice.paymentStatus)}</div>
                  <div>Customer Type: {getCustomerTypeBadge(selectedInvoice.customerType)}</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Finance Drawdown</h3>
                {selectedInvoice.financeDrawdown ? (
                  <div className="space-y-2 text-sm">
                    <div>Drawdown Amount: £{selectedInvoice.financeDrawdown.drawdownAmount.toLocaleString()}</div>
                    <div>Status: {getStatusBadge(selectedInvoice.financeDrawdown.status)}</div>
                    <div className="text-green-600">✓ Eligible for 80% drawdown</div>
                  </div>
                ) : (
                  <div className="text-gray-500">Not eligible for finance drawdown</div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delivery Template Detail Modal */}
      {selectedDelivery && (
        <Dialog open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Delivery Template - {selectedDelivery.templateNumber}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Delivery Information</h3>
                <div className="space-y-2 text-sm">
                  <div>Customer: {selectedDelivery.customer.company || `${selectedDelivery.customer.firstName} ${selectedDelivery.customer.lastName}`}</div>
                  <div>Delivery Date: {new Date(selectedDelivery.deliveryDate).toLocaleDateString()}</div>
                  <div>Status: {getStatusBadge(selectedDelivery.status)}</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Completion Status</h3>
                <div className="space-y-2 text-sm">
                  <div>Work Completed: {selectedDelivery.workCompleted ? '✓ Yes' : '✗ No'}</div>
                  <div>Certificate Generated: {selectedDelivery.certificateGenerated ? '✓ Yes' : '✗ No'}</div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
