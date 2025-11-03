
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calculator, Plus, Trash2, FileText, DollarSign, User, Package, AlertCircle, CheckCircle, Eye, Edit, Save } from 'lucide-react';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
}

interface ProductType {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  unit: string;
  description?: string;
}

interface QuoteItem {
  id?: string;
  productTypeId: string;
  productType?: ProductType;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  totalPrice: number;
  notes?: string;
}

interface Quote {
  id?: string;
  quoteNumber: string;
  customerId: string;
  customer?: Customer;
  description?: string;
  status: string;
  validUntil: string;
  totalValue: number;
  quoteItems: QuoteItem[];
  notes?: string;
  terms?: string;
}

export default function QuoteGenerator() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Quote state
  const [quote, setQuote] = useState<Quote>({
    quoteNumber: '',
    customerId: '',
    description: '',
    status: 'DRAFT',
    validUntil: '',
    totalValue: 0,
    quoteItems: [],
    notes: '',
    terms: 'Standard SFG Aluminium terms and conditions apply. Quote valid for 30 days.'
  });

  useEffect(() => {
    fetchInitialData();
    generateQuoteNumber();
    setDefaultValidDate();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [quote.quoteItems]);

  const fetchInitialData = async () => {
    try {
      const [customersResponse, productTypesResponse] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/product-types')
      ]);

      if (customersResponse.ok) {
        const customersData = await customersResponse.json();
        setCustomers(customersData.customers || []);
      }

      if (productTypesResponse.ok) {
        const productTypesData = await productTypesResponse.json();
        setProductTypes(productTypesData.productTypes || []);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuoteNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setQuote(prev => ({ ...prev, quoteNumber: `QUO${year}${month}${random}` }));
  };

  const setDefaultValidDate = () => {
    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 30);
    setQuote(prev => ({ ...prev, validUntil: validDate.toISOString().split('T')[0] }));
  };

  const calculateTotal = () => {
    const total = quote.quoteItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setQuote(prev => ({ ...prev, totalValue: total }));
  };

  const addQuoteItem = () => {
    const newItem: QuoteItem = {
      productTypeId: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      notes: ''
    };
    setQuote(prev => ({
      ...prev,
      quoteItems: [...prev.quoteItems, newItem]
    }));
  };

  const updateQuoteItem = (index: number, field: keyof QuoteItem, value: any) => {
    const updatedItems = [...quote.quoteItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Auto-calculate total when quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const item = updatedItems[index];
      const discountMultiplier = 1 - ((item.discount || 0) / 100);
      updatedItems[index].totalPrice = item.quantity * item.unitPrice * discountMultiplier;
    }

    // Update unit price when product type changes
    if (field === 'productTypeId') {
      const productType = productTypes.find(pt => pt.id === value);
      if (productType) {
        updatedItems[index].unitPrice = productType.basePrice;
        updatedItems[index].description = productType.name;
        updatedItems[index].productType = productType;
        const item = updatedItems[index];
        const discountMultiplier = 1 - ((item.discount || 0) / 100);
        updatedItems[index].totalPrice = item.quantity * item.unitPrice * discountMultiplier;
      }
    }

    setQuote(prev => ({ ...prev, quoteItems: updatedItems }));
  };

  const removeQuoteItem = (index: number) => {
    setQuote(prev => ({
      ...prev,
      quoteItems: prev.quoteItems.filter((_, i) => i !== index)
    }));
  };

  const saveQuote = async () => {
    if (!quote.customerId || quote.quoteItems.length === 0) {
      alert('Please select a customer and add at least one quote item');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote),
      });

      if (response.ok) {
        const savedQuote = await response.json();
        alert('Quote saved successfully!');
        resetForm();
      } else {
        console.error('Failed to save quote');
        alert('Failed to save quote. Please try again.');
      }
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Error saving quote. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setQuote({
      quoteNumber: '',
      customerId: '',
      description: '',
      status: 'DRAFT',
      validUntil: '',
      totalValue: 0,
      quoteItems: [],
      notes: '',
      terms: 'Standard SFG Aluminium terms and conditions apply. Quote valid for 30 days.'
    });
    generateQuoteNumber();
    setDefaultValidDate();
    setPreviewMode(false);
  };

  const selectedCustomer = customers.find(c => c.id === quote.customerId);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Calculator className="h-8 w-8 mr-3 text-blue-600" />
            Quote Generator
          </h1>
          <p className="text-muted-foreground">
            Create professional quotes with automatic pricing and calculations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button onClick={resetForm} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            New Quote
          </Button>
          <Button onClick={saveQuote} disabled={saving}>
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Quote
          </Button>
        </div>
      </div>

      {previewMode ? (
        /* Quote Preview */
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">SFG ALUMINIUM</CardTitle>
                <CardDescription className="text-blue-100">
                  Professional Aluminium & Glass Solutions
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">QUOTATION</div>
                <div className="text-blue-100">{quote.quoteNumber}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Quote To:</h3>
                {selectedCustomer ? (
                  <div className="space-y-1">
                    <p className="font-medium">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </p>
                    {selectedCustomer.address && (
                      <p className="text-sm text-muted-foreground">
                        {selectedCustomer.address}
                      </p>
                    )}
                    {(selectedCustomer.city || selectedCustomer.postcode) && (
                      <p className="text-sm text-muted-foreground">
                        {selectedCustomer.city} {selectedCustomer.postcode}
                      </p>
                    )}
                    {selectedCustomer.email && (
                      <p className="text-sm text-muted-foreground">
                        {selectedCustomer.email}
                      </p>
                    )}
                    {selectedCustomer.phone && (
                      <p className="text-sm text-muted-foreground">
                        {selectedCustomer.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No customer selected</p>
                )}
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Quote Date: </span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Valid Until: </span>
                    <span className="font-medium">
                      {new Date(quote.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status: </span>
                    <Badge variant="secondary">{quote.status}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {quote.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description:</h3>
                <p className="text-muted-foreground">{quote.description}</p>
              </div>
            )}

            {/* Quote Items Table */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Quote Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">Description</th>
                      <th className="text-center p-3 font-medium">Qty</th>
                      <th className="text-right p-3 font-medium">Unit Price</th>
                      <th className="text-right p-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.quoteItems.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">
                          <div className="font-medium">{item.description}</div>
                          {item.notes && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {item.notes}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">£{item.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">
                          £{item.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-muted">
                      <td colSpan={3} className="p-3 text-right font-semibold">
                        Total:
                      </td>
                      <td className="p-3 text-right font-bold text-lg">
                        £{quote.totalValue.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {quote.notes && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Notes:</h3>
                <p className="text-muted-foreground">{quote.notes}</p>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Terms & Conditions:</h3>
              <p className="text-sm text-muted-foreground">{quote.terms}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Quote Builder Form */
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Quote Details</TabsTrigger>
            <TabsTrigger value="items">Quote Items</TabsTrigger>
            <TabsTrigger value="summary">Summary & Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Quote Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quoteNumber">Quote Number</Label>
                      <Input
                        id="quoteNumber"
                        value={quote.quoteNumber}
                        onChange={(e) => setQuote({ ...quote, quoteNumber: e.target.value })}
                        placeholder="Auto-generated"
                      />
                    </div>
                    <div>
                      <Label htmlFor="validUntil">Valid Until</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={quote.validUntil}
                        onChange={(e) => setQuote({ ...quote, validUntil: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={quote.description}
                      onChange={(e) => setQuote({ ...quote, description: e.target.value })}
                      placeholder="Brief description of the quote..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customer">Select Customer</Label>
                    <Select value={quote.customerId} onValueChange={(value) => setQuote({ ...quote, customerId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a customer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                            {customer.email && ` (${customer.email})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCustomer && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="space-y-2 text-sm">
                          <div className="font-medium">
                            {selectedCustomer.firstName} {selectedCustomer.lastName}
                          </div>
                          {selectedCustomer.email && (
                            <div className="text-muted-foreground">
                              📧 {selectedCustomer.email}
                            </div>
                          )}
                          {selectedCustomer.phone && (
                            <div className="text-muted-foreground">
                              📞 {selectedCustomer.phone}
                            </div>
                          )}
                          {selectedCustomer.address && (
                            <div className="text-muted-foreground">
                              📍 {selectedCustomer.address}
                              {selectedCustomer.city && `, ${selectedCustomer.city}`}
                              {selectedCustomer.postcode && ` ${selectedCustomer.postcode}`}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Quote Items
                    </CardTitle>
                    <CardDescription>
                      Add products and services to this quote
                    </CardDescription>
                  </div>
                  <Button onClick={addQuoteItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quote.quoteItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No items added yet
                    </h3>
                    <p className="mb-4">
                      Start building your quote by adding products or services
                    </p>
                    <Button onClick={addQuoteItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quote.quoteItems.map((item, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-12 gap-4 items-start">
                            <div className="col-span-3">
                              <Label className="text-xs">Product Type</Label>
                              <Select
                                value={item.productTypeId}
                                onValueChange={(value) => updateQuoteItem(index, 'productTypeId', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select product..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {productTypes.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                      {product.name} (£{product.basePrice})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="col-span-3">
                              <Label className="text-xs">Description</Label>
                              <Input
                                value={item.description}
                                onChange={(e) => updateQuoteItem(index, 'description', e.target.value)}
                                placeholder="Item description..."
                              />
                            </div>

                            <div className="col-span-1">
                              <Label className="text-xs">Qty</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuoteItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              />
                            </div>

                            <div className="col-span-2">
                              <Label className="text-xs">Unit Price (£)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => updateQuoteItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              />
                            </div>

                            <div className="col-span-2">
                              <Label className="text-xs">Total</Label>
                              <div className="flex items-center h-9 px-3 bg-muted rounded-md">
                                <span className="font-medium">
                                  £{item.totalPrice.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="col-span-1 flex items-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeQuoteItem(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3">
                            <Label className="text-xs">Notes (optional)</Label>
                            <Input
                              value={item.notes || ''}
                              onChange={(e) => updateQuoteItem(index, 'notes', e.target.value)}
                              placeholder="Additional notes for this item..."
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Separator />

                    <div className="flex justify-between items-center pt-4">
                      <Button variant="outline" onClick={addQuoteItem}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Item
                      </Button>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Quote Total</div>
                        <div className="text-2xl font-bold text-green-600">
                          £{quote.totalValue.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Quote Notes</Label>
                    <Textarea
                      id="notes"
                      value={quote.notes}
                      onChange={(e) => setQuote({ ...quote, notes: e.target.value })}
                      placeholder="Additional notes or special requirements..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="terms">Terms & Conditions</Label>
                    <Textarea
                      id="terms"
                      value={quote.terms}
                      onChange={(e) => setQuote({ ...quote, terms: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Quote Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Quote Number:</span>
                      <span className="font-medium">{quote.quoteNumber}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Customer:</span>
                      <span className="font-medium">
                        {selectedCustomer ? 
                          `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : 
                          'Not selected'
                        }
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-medium">{quote.quoteItems.length}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Valid Until:</span>
                      <span className="font-medium">
                        {quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-2 border-green-200 bg-green-50 rounded-lg">
                      <span className="font-semibold">Total Value:</span>
                      <span className="text-2xl font-bold text-green-600">
                        £{quote.totalValue.toFixed(2)}
                      </span>
                    </div>

                    {/* Validation Status */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {quote.customerId ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">Customer selected</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {quote.quoteItems.length > 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">Quote items added</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {quote.validUntil ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">Valid until date set</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
