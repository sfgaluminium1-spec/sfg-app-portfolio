
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, Camera, CheckCircle, Clock, User, MapPin, Calendar, Package, Wrench, Eye, Plus, Signature, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductDetail {
  lineNumber: number;
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface GlassDetail extends ProductDetail {
  glassType: string;
  thickness: string;
  dimensions: string;
}

interface HardwareDetail extends ProductDetail {
  hardwareType: string;
  specifications: string;
}

interface DeliveryTemplate {
  id: string;
  templateNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
  };
  job?: {
    jobNumber: string;
    description: string;
  };
  invoice: {
    invoiceNumber: string;
    totalAmount: number;
  };
  deliveryDate: string;
  deliveryAddress: string;
  installationTeam: string;
  teamLeader: string;
  productDetails: ProductDetail[];
  glassDetails: GlassDetail[];
  hardwareDetails: HardwareDetail[];
  extrasDetails: ProductDetail[];
  installationNotes?: string;
  specialRequirements?: string;
  accessRequirements?: string;
  workCompleted: boolean;
  qualityChecked: boolean;
  customerSatisfied: boolean;
  customerSignature?: string;
  customerName?: string;
  signatureDate?: string;
  beforePhotos: string[];
  afterPhotos: string[];
  installationPhotos: string[];
  certificateGenerated: boolean;
  certificateUrl?: string;
  status: string;
  completedAt?: string;
}

interface DeliveryTemplateGeneratorProps {
  templateId?: string;
  onClose?: () => void;
}

export default function DeliveryTemplateGenerator({ templateId, onClose }: DeliveryTemplateGeneratorProps) {
  const [template, setTemplate] = useState<DeliveryTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('details');
  const [completionForm, setCompletionForm] = useState({
    customerSignature: '',
    customerName: '',
    qualityChecked: false,
    customerSatisfied: false,
    installationNotes: '',
    beforePhotos: [] as string[],
    afterPhotos: [] as string[],
    installationPhotos: [] as string[]
  });

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    if (!templateId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/finance/delivery-templates/${templateId}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeDelivery = async () => {
    if (!template) return;
    try {
      const response = await fetch(`/api/finance/delivery-templates/${template.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'complete',
          ...completionForm
        })
      });
      if (response.ok) {
        const updatedTemplate = await response.json();
        setTemplate(updatedTemplate);
        alert('Delivery completed successfully!');
      }
    } catch (error) {
      console.error('Error completing delivery:', error);
    }
  };

  const generateCertificate = () => {
    if (!template) return;
    
    // Generate a professional completion certificate
    const certificateContent = `
COMPLETION CERTIFICATE

Template: ${template.templateNumber}
Customer: ${template.customer.company || `${template.customer.firstName} ${template.customer.lastName}`}
Delivery Date: ${new Date(template.deliveryDate).toLocaleDateString()}
Installation Team: ${template.installationTeam}
Team Leader: ${template.teamLeader}

PRODUCTS DELIVERED:
${template.productDetails.map(product => 
  `- ${product.product}: ${product.description} (Qty: ${product.quantity})`
).join('\n')}

GLASS SPECIFICATIONS:
${template.glassDetails.map(glass => 
  `- ${glass.glassType} ${glass.thickness} (${glass.dimensions}) - Qty: ${glass.quantity}`
).join('\n')}

HARDWARE & EXTRAS:
${template.hardwareDetails.map(hardware => 
  `- ${hardware.hardwareType}: ${hardware.specifications}`
).join('\n')}

COMPLETION DETAILS:
Work Completed: ${template.workCompleted ? 'Yes' : 'No'}
Quality Checked: ${template.qualityChecked ? 'Yes' : 'No'}
Customer Satisfied: ${template.customerSatisfied ? 'Yes' : 'No'}
Customer Signature: ${template.customerName}
Date: ${template.signatureDate ? new Date(template.signatureDate).toLocaleDateString() : 'N/A'}

This certificate confirms the successful completion of the above installation.
`;

    // Create and download the certificate
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `completion-certificate-${template.templateNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      IN_PROGRESS: { color: 'bg-yellow-100 text-yellow-800', label: 'In Progress' },
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No delivery template selected
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Template</h1>
          <p className="text-gray-600">{template.templateNumber}</p>
        </div>
        <div className="flex gap-2">
          {getStatusBadge(template.status)}
          {template.certificateGenerated && (
            <Button onClick={generateCertificate} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          )}
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Customer & Delivery Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Customer</Label>
              <div className="text-sm">
                {template.customer.company || `${template.customer.firstName} ${template.customer.lastName}`}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Contact</Label>
              <div className="text-sm">
                {template.customer.email} | {template.customer.phone}
              </div>
            </div>
            {template.job && (
              <div>
                <Label className="text-sm font-medium">Job</Label>
                <div className="text-sm">
                  {template.job.jobNumber} - {template.job.description}
                </div>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium">Invoice</Label>
              <div className="text-sm">
                {template.invoice.invoiceNumber} - £{template.invoice.totalAmount.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Delivery Date</Label>
              <div className="text-sm">{new Date(template.deliveryDate).toLocaleDateString()}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Delivery Address</Label>
              <div className="text-sm">{template.deliveryAddress}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Installation Team</Label>
              <div className="text-sm">{template.installationTeam}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Team Leader</Label>
              <div className="text-sm">{template.teamLeader}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Details - Automatically Populated */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
            <Badge className="bg-green-100 text-green-800 ml-2">
              Automatically Populated
            </Badge>
          </CardTitle>
          <CardDescription>
            Product details extracted automatically from the associated job/quote
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Products */}
            {template.productDetails.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Main Products</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Line</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {template.productDetails.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.lineNumber}</TableCell>
                        <TableCell className="font-medium">{product.product}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>£{product.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>£{product.totalPrice.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Glass Specifications */}
            {template.glassDetails.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Glass Specifications</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Glass Type</TableHead>
                      <TableHead>Thickness</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {template.glassDetails.map((glass, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{glass.product}</TableCell>
                        <TableCell>{glass.glassType}</TableCell>
                        <TableCell>{glass.thickness}</TableCell>
                        <TableCell>{glass.dimensions}</TableCell>
                        <TableCell>{glass.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Hardware & Extras */}
            {template.hardwareDetails.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Hardware & Fixings</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Hardware Type</TableHead>
                      <TableHead>Specifications</TableHead>
                      <TableHead>Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {template.hardwareDetails.map((hardware, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{hardware.product}</TableCell>
                        <TableCell>{hardware.hardwareType}</TableCell>
                        <TableCell>{hardware.specifications}</TableCell>
                        <TableCell>{hardware.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Additional Items */}
            {template.extrasDetails.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Additional Items & Extras</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {template.extrasDetails.map((extra, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{extra.product}</TableCell>
                        <TableCell>{extra.description}</TableCell>
                        <TableCell>{extra.quantity}</TableCell>
                        <TableCell>£{extra.totalPrice.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Installation Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Installation Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {template.installationNotes && (
            <div>
              <Label className="text-sm font-medium">Installation Notes</Label>
              <div className="text-sm bg-gray-50 p-3 rounded">{template.installationNotes}</div>
            </div>
          )}
          {template.specialRequirements && (
            <div>
              <Label className="text-sm font-medium">Special Requirements</Label>
              <div className="text-sm bg-gray-50 p-3 rounded">{template.specialRequirements}</div>
            </div>
          )}
          {template.accessRequirements && (
            <div>
              <Label className="text-sm font-medium">Access Requirements</Label>
              <div className="text-sm bg-gray-50 p-3 rounded">{template.accessRequirements}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Section */}
      {!template.workCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Complete Delivery
            </CardTitle>
            <CardDescription>
              Mark the delivery as completed and generate completion certificate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={completionForm.customerName}
                  onChange={(e) => setCompletionForm({...completionForm, customerName: e.target.value})}
                  placeholder="Customer name for signature"
                />
              </div>
              <div>
                <Label htmlFor="customerSignature">Digital Signature</Label>
                <Input
                  id="customerSignature"
                  value={completionForm.customerSignature}
                  onChange={(e) => setCompletionForm({...completionForm, customerSignature: e.target.value})}
                  placeholder="Digital signature data"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={completionForm.qualityChecked}
                  onChange={(e) => setCompletionForm({...completionForm, qualityChecked: e.target.checked})}
                />
                <span className="text-sm">Quality checked</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={completionForm.customerSatisfied}
                  onChange={(e) => setCompletionForm({...completionForm, customerSatisfied: e.target.checked})}
                />
                <span className="text-sm">Customer satisfied</span>
              </label>
            </div>
            <div>
              <Label htmlFor="installationNotes">Final Installation Notes</Label>
              <Textarea
                id="installationNotes"
                value={completionForm.installationNotes}
                onChange={(e) => setCompletionForm({...completionForm, installationNotes: e.target.value})}
                placeholder="Any final notes about the installation"
                rows={3}
              />
            </div>
            <Alert>
              <Camera className="h-4 w-4" />
              <AlertDescription>
                Photo documentation can be uploaded to provide visual evidence of the completed installation. This includes before photos, after photos, and installation process photos.
              </AlertDescription>
            </Alert>
            <Button onClick={completeDelivery} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Delivery & Generate Certificate
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      {template.workCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Delivery Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-sm">Work Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {template.qualityChecked ? '✓' : '✗'}
                </div>
                <div className="text-sm">Quality Checked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {template.customerSatisfied ? '✓' : '✗'}
                </div>
                <div className="text-sm">Customer Satisfied</div>
              </div>
            </div>
            {template.customerName && (
              <div>
                <Label className="text-sm font-medium">Customer Signature</Label>
                <div className="text-sm">
                  {template.customerName} - {template.signatureDate ? new Date(template.signatureDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            )}
            {template.certificateGenerated && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Completion certificate has been generated and is available for download.
                </AlertDescription>
              </Alert>
            )}
            {template.completedAt && (
              <div>
                <Label className="text-sm font-medium">Completed At</Label>
                <div className="text-sm">{new Date(template.completedAt).toLocaleString()}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
