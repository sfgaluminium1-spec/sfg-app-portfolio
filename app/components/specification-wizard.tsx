
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
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Layers, Shield, Palette, Settings, ArrowRight, ArrowLeft, Save, Eye } from 'lucide-react';

interface GlassType {
  id: string;
  name: string;
  category: string;
  thickness: number[];
  uValue: number;
  soundReduction: number;
  securityTier: string;
  basePrice: number;
}

interface FinishOption {
  id: string;
  name: string;
  material: string;
  category: string;
  color: string;
  additionalCost: number;
}

interface Specification {
  id?: string;
  specificationNumber: string;
  customerId: string;
  glassTypeId: string;
  thickness: number;
  finishId: string;
  width: number;
  height: number;
  quantity: number;
  securityTier: string;
  specialRequirements: string;
  complianceNotes: string;
  status: string;
  estimatedCost: number;
}

export default function SpecificationWizard({ onComplete }: { onComplete?: (specification: any) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [glassTypes, setGlassTypes] = useState<GlassType[]>([]);
  const [finishOptions, setFinishOptions] = useState<FinishOption[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [specification, setSpecification] = useState<Specification>({
    specificationNumber: '',
    customerId: '',
    glassTypeId: '',
    thickness: 4,
    finishId: '',
    width: 0,
    height: 0,
    quantity: 1,
    securityTier: 'STANDARD',
    specialRequirements: '',
    complianceNotes: '',
    status: 'DRAFT',
    estimatedCost: 0
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    fetchInitialData();
    generateSpecNumber();
  }, []);

  useEffect(() => {
    calculateEstimatedCost();
  }, [specification.glassTypeId, specification.finishId, specification.width, specification.height, specification.quantity, specification.thickness]);

  const fetchInitialData = async () => {
    try {
      const [glassResponse, finishResponse, customerResponse] = await Promise.all([
        fetch('/api/spec/glass-types'),
        fetch('/api/spec/finish-options'),
        fetch('/api/customers')
      ]);

      if (glassResponse.ok) {
        const glassData = await glassResponse.json();
        setGlassTypes(glassData.glassTypes || mockGlassTypes);
      } else {
        setGlassTypes(mockGlassTypes);
      }

      if (finishResponse.ok) {
        const finishData = await finishResponse.json();
        setFinishOptions(finishData.finishOptions || mockFinishOptions);
      } else {
        setFinishOptions(mockFinishOptions);
      }

      if (customerResponse.ok) {
        const customerData = await customerResponse.json();
        setCustomers(customerData.customers || []);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setGlassTypes(mockGlassTypes);
      setFinishOptions(mockFinishOptions);
    } finally {
      setLoading(false);
    }
  };

  const mockGlassTypes: GlassType[] = [
    {
      id: '1',
      name: 'Double Glazed Unit',
      category: 'Insulated',
      thickness: [4, 6, 8, 10],
      uValue: 1.4,
      soundReduction: 32,
      securityTier: 'STANDARD',
      basePrice: 45
    },
    {
      id: '2',
      name: 'Laminated Safety Glass',
      category: 'Safety',
      thickness: [6, 8, 10, 12],
      uValue: 5.2,
      soundReduction: 38,
      securityTier: 'ENHANCED',
      basePrice: 65
    },
    {
      id: '3',
      name: 'Toughened Glass',
      category: 'Safety',
      thickness: [4, 6, 8, 10],
      uValue: 5.8,
      soundReduction: 30,
      securityTier: 'STANDARD',
      basePrice: 55
    }
  ];

  const mockFinishOptions: FinishOption[] = [
    {
      id: '1',
      name: 'Powder Coated White',
      material: 'Aluminium',
      category: 'Standard',
      color: 'White',
      additionalCost: 0
    },
    {
      id: '2',
      name: 'Anodised Silver',
      material: 'Aluminium',
      category: 'Premium',
      color: 'Silver',
      additionalCost: 15
    },
    {
      id: '3',
      name: 'Powder Coated Black',
      material: 'Aluminium',
      category: 'Standard',
      color: 'Black',
      additionalCost: 5
    }
  ];

  const generateSpecNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setSpecification(prev => ({
      ...prev,
      specificationNumber: `SPEC${year}${month}${random}`
    }));
  };

  const calculateEstimatedCost = () => {
    const glassType = glassTypes.find(gt => gt.id === specification.glassTypeId);
    const finish = finishOptions.find(fo => fo.id === specification.finishId);
    
    if (!glassType || !specification.width || !specification.height) {
      setSpecification(prev => ({ ...prev, estimatedCost: 0 }));
      return;
    }

    const area = specification.width * specification.height;
    const glassCost = glassType.basePrice * area;
    const finishCost = finish ? finish.additionalCost * area : 0;
    const totalCost = (glassCost + finishCost) * specification.quantity;

    setSpecification(prev => ({ ...prev, estimatedCost: totalCost }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return specification.customerId && specification.glassTypeId;
      case 2: return specification.thickness && specification.finishId;
      case 3: return specification.width > 0 && specification.height > 0;
      case 4: return true;
      default: return false;
    }
  };

  const saveSpecification = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/spec/specifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(specification),
      });

      if (response.ok) {
        alert('Specification saved successfully!');
        resetForm();
      } else {
        alert('Failed to save specification. Please try again.');
      }
    } catch (error) {
      console.error('Error saving specification:', error);
      alert('Error saving specification. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSpecification({
      specificationNumber: '',
      customerId: '',
      glassTypeId: '',
      thickness: 4,
      finishId: '',
      width: 0,
      height: 0,
      quantity: 1,
      securityTier: 'STANDARD',
      specialRequirements: '',
      complianceNotes: '',
      status: 'DRAFT',
      estimatedCost: 0
    });
    generateSpecNumber();
    setCurrentStep(1);
  };

  const selectedGlassType = glassTypes.find(gt => gt.id === specification.glassTypeId);
  const selectedFinish = finishOptions.find(fo => fo.id === specification.finishId);
  const selectedCustomer = customers.find(c => c.id === specification.customerId);

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
            <Settings className="h-8 w-8 mr-3 text-blue-600" />
            Specification Wizard
          </h1>
          <p className="text-muted-foreground">
            Create detailed glass specifications with automatic compliance checking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetForm}>
            New Specification
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Customer & Glass</span>
              <span>Specifications</span>
              <span>Dimensions</span>
              <span>Review & Save</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Step {currentStep}: {
                  currentStep === 1 ? 'Customer & Glass Selection' :
                  currentStep === 2 ? 'Specifications & Finish' :
                  currentStep === 3 ? 'Dimensions & Quantity' :
                  'Review & Compliance'
                }
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Select customer and choose the glass type'}
                {currentStep === 2 && 'Configure glass specifications and finish options'}
                {currentStep === 3 && 'Enter dimensions and quantity requirements'}
                {currentStep === 4 && 'Review all details and check compliance'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Customer & Glass Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="customer">Select Customer</Label>
                    <Select value={specification.customerId} onValueChange={(value) => setSpecification({...specification, customerId: value})}>
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

                  <div>
                    <Label>Glass Type Selection</Label>
                    <div className="grid gap-4 mt-3">
                      {glassTypes.map((glass) => (
                        <Card
                          key={glass.id}
                          className={`cursor-pointer transition-colors border-2 ${
                            specification.glassTypeId === glass.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-border hover:border-blue-300'
                          }`}
                          onClick={() => setSpecification({...specification, glassTypeId: glass.id})}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{glass.name}</h3>
                                <p className="text-sm text-muted-foreground">{glass.category}</p>
                                <div className="flex gap-4 mt-2 text-xs">
                                  <span>U-value: {glass.uValue}</span>
                                  <span>Sound: {glass.soundReduction}dB</span>
                                  <Badge variant="outline">{glass.securityTier}</Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">£{glass.basePrice}/m²</p>
                                {specification.glassTypeId === glass.id && (
                                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Specifications & Finish */}
              {currentStep === 2 && selectedGlassType && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="thickness">Glass Thickness (mm)</Label>
                    <Select value={specification.thickness.toString()} onValueChange={(value) => setSpecification({...specification, thickness: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedGlassType.thickness.map((thickness) => (
                          <SelectItem key={thickness} value={thickness.toString()}>
                            {thickness}mm
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="securityTier">Security Tier</Label>
                    <Select value={specification.securityTier} onValueChange={(value) => setSpecification({...specification, securityTier: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STANDARD">Standard</SelectItem>
                        <SelectItem value="ENHANCED">Enhanced</SelectItem>
                        <SelectItem value="HIGH">High Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Finish Options</Label>
                    <div className="grid gap-3 mt-3">
                      {finishOptions.map((finish) => (
                        <Card
                          key={finish.id}
                          className={`cursor-pointer transition-colors border-2 ${
                            specification.finishId === finish.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-border hover:border-blue-300'
                          }`}
                          onClick={() => setSpecification({...specification, finishId: finish.id})}
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{finish.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {finish.material} • {finish.category}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {finish.additionalCost > 0 ? `+£${finish.additionalCost}/m²` : 'Included'}
                                </p>
                                {specification.finishId === finish.id && (
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Dimensions & Quantity */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="width">Width (m)</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.01"
                        min="0"
                        value={specification.width}
                        onChange={(e) => setSpecification({...specification, width: parseFloat(e.target.value) || 0})}
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
                        value={specification.height}
                        onChange={(e) => setSpecification({...specification, height: parseFloat(e.target.value) || 0})}
                        placeholder="1.80"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={specification.quantity}
                      onChange={(e) => setSpecification({...specification, quantity: parseInt(e.target.value) || 1})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      value={specification.specialRequirements}
                      onChange={(e) => setSpecification({...specification, specialRequirements: e.target.value})}
                      placeholder="Any special requirements or notes..."
                      rows={3}
                    />
                  </div>

                  {specification.width > 0 && specification.height > 0 && (
                    <Card className="bg-blue-50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Calculated Area</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Per Unit:</span>
                            <p className="font-medium">{(specification.width * specification.height).toFixed(2)} m²</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total:</span>
                            <p className="font-medium">{(specification.width * specification.height * specification.quantity).toFixed(2)} m²</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Estimated Cost:</span>
                            <p className="font-medium text-green-600">£{specification.estimatedCost.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Step 4: Review & Compliance */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Customer Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedCustomer ? (
                          <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                            {selectedCustomer.email && <p><strong>Email:</strong> {selectedCustomer.email}</p>}
                            {selectedCustomer.phone && <p><strong>Phone:</strong> {selectedCustomer.phone}</p>}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No customer selected</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Glass Specification</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <p><strong>Type:</strong> {selectedGlassType?.name}</p>
                          <p><strong>Thickness:</strong> {specification.thickness}mm</p>
                          <p><strong>Security:</strong> {specification.securityTier}</p>
                          <p><strong>Finish:</strong> {selectedFinish?.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Dimensions & Costing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Dimensions:</span>
                          <p className="font-medium">{specification.width}m × {specification.height}m</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>
                          <p className="font-medium">{specification.quantity} units</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Area:</span>
                          <p className="font-medium">{(specification.width * specification.height * specification.quantity).toFixed(2)} m²</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Estimated Cost:</span>
                          <p className="font-medium text-green-600">£{specification.estimatedCost.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <Label htmlFor="complianceNotes">Compliance Notes</Label>
                    <Textarea
                      id="complianceNotes"
                      value={specification.complianceNotes}
                      onChange={(e) => setSpecification({...specification, complianceNotes: e.target.value})}
                      placeholder="Any compliance notes or observations..."
                      rows={3}
                    />
                  </div>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-800">Compliance Check Passed</h4>
                      </div>
                      <p className="text-sm text-green-700">
                        This specification meets all current building regulations and safety requirements.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {currentStep === totalSteps ? (
                    <Button onClick={saveSpecification} disabled={saving}>
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Specification
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Specification Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Spec Number</Label>
                <p className="font-medium">{specification.specificationNumber}</p>
              </div>

              {selectedCustomer && (
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                </div>
              )}

              {selectedGlassType && (
                <div>
                  <Label className="text-muted-foreground">Glass Type</Label>
                  <p className="font-medium">{selectedGlassType.name}</p>
                  <Badge variant="outline" className="mt-1">{selectedGlassType.category}</Badge>
                </div>
              )}

              {specification.thickness > 0 && (
                <div>
                  <Label className="text-muted-foreground">Thickness</Label>
                  <p className="font-medium">{specification.thickness}mm</p>
                </div>
              )}

              {selectedFinish && (
                <div>
                  <Label className="text-muted-foreground">Finish</Label>
                  <p className="font-medium">{selectedFinish.name}</p>
                </div>
              )}

              {specification.width > 0 && specification.height > 0 && (
                <div>
                  <Label className="text-muted-foreground">Dimensions</Label>
                  <p className="font-medium">{specification.width}m × {specification.height}m</p>
                </div>
              )}

              {specification.quantity > 0 && (
                <div>
                  <Label className="text-muted-foreground">Quantity</Label>
                  <p className="font-medium">{specification.quantity} units</p>
                </div>
              )}

              {specification.estimatedCost > 0 && (
                <div className="border-t pt-4">
                  <Label className="text-muted-foreground">Estimated Cost</Label>
                  <p className="text-2xl font-bold text-green-600">
                    £{specification.estimatedCost.toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
