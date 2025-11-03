
'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calculator, User, Package } from 'lucide-react';

interface QuickQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enquiry?: any;
  onSuccess: () => void;
}

export default function QuickQuoteModal({ open, onOpenChange, enquiry, onSuccess }: QuickQuoteModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: enquiry?.customerName || '',
    email: enquiry?.email || '',
    phone: enquiry?.phone || '',
    projectDescription: enquiry?.description || '',
    glassType: 'DOUBLE_GLAZED',
    width: '',
    height: '',
    quantity: '1',
    urgency: 'STANDARD',
    estimatedValue: 0
  });

  const calculateEstimate = () => {
    const width = parseFloat(formData.width) || 0;
    const height = parseFloat(formData.height) || 0;
    const quantity = parseInt(formData.quantity) || 1;
    
    const glassTypePrices: { [key: string]: number } = {
      'SINGLE_GLAZED': 25,
      'DOUBLE_GLAZED': 45,
      'TRIPLE_GLAZED': 65,
      'LAMINATED': 55,
      'TOUGHENED': 50
    };

    const basePrice = glassTypePrices[formData.glassType] || 45;
    const area = width * height * quantity;
    const estimate = area * basePrice;

    setFormData(prev => ({ ...prev, estimatedValue: estimate }));
  };

  React.useEffect(() => {
    if (formData.width && formData.height) {
      calculateEstimate();
    }
  }, [formData.width, formData.height, formData.quantity, formData.glassType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/quotes/quick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          enquiryId: enquiry?.id,
          estimatedValue: formData.estimatedValue
        }),
      });

      if (response.ok) {
        onSuccess();
        onOpenChange(false);
        setFormData({
          customerName: '',
          email: '',
          phone: '',
          projectDescription: '',
          glassType: 'DOUBLE_GLAZED',
          width: '',
          height: '',
          quantity: '1',
          urgency: 'STANDARD',
          estimatedValue: 0
        });
      } else {
        console.error('Failed to create quote');
      }
    } catch (error) {
      console.error('Error creating quote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Quick Quote Generator
          </DialogTitle>
          <DialogDescription>
            Generate a quick estimate for the customer
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@email.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low Priority</SelectItem>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="HIGH">High Priority</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <Label htmlFor="projectDescription">Project Description</Label>
            <Textarea
              id="projectDescription"
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              placeholder="Brief description of the project..."
              rows={3}
            />
          </div>

          {/* Glass Specifications */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="glassType">Glass Type</Label>
              <Select value={formData.glassType} onValueChange={(value) => setFormData({ ...formData, glassType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE_GLAZED">Single Glazed (£25/m²)</SelectItem>
                  <SelectItem value="DOUBLE_GLAZED">Double Glazed (£45/m²)</SelectItem>
                  <SelectItem value="TRIPLE_GLAZED">Triple Glazed (£65/m²)</SelectItem>
                  <SelectItem value="LAMINATED">Laminated (£55/m²)</SelectItem>
                  <SelectItem value="TOUGHENED">Toughened (£50/m²)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">Width (m)</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                min="0"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                placeholder="2.50"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (m)</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                min="0"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="1.80"
              />
            </div>
          </div>

          {/* Estimate Display */}
          {formData.estimatedValue > 0 && (
            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800">Estimated Quote Value</h4>
                  <p className="text-sm text-green-600">
                    {formData.width && formData.height ? 
                      `${(parseFloat(formData.width) * parseFloat(formData.height) * parseInt(formData.quantity)).toFixed(2)} m² total area` 
                      : 'Based on current specifications'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    £{formData.estimatedValue.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-600">
                    + VAT & Installation
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Generate Quote
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
