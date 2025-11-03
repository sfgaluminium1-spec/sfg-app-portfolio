
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Eye, Package, AlertTriangle, CheckCircle, Plus, Trash2, Download, Save } from 'lucide-react';

interface GlassPanel {
  id: string;
  panelName: string;
  length: number;
  width: number;
  thickness: number;
  glassType: string;
  quantity: number;
  weight?: number;
  area?: number;
  notes?: string;
}

interface CalculationResult {
  totalPanels: number;
  totalWeight: number;
  totalArea: number;
  averageThickness: number;
  totalValue: number;
  panels: {
    id: string;
    panelName: string;
    weight: number;
    area: number;
    unitPrice: number;
    totalPrice: number;
    safetyNotes: string[];
  }[];
  summary: {
    glassTypes: { [key: string]: number };
    thicknessSummary: { [key: string]: number };
    recommendations: string[];
    warnings: string[];
  };
}

export default function SurveyGlassCalculator() {
  const [glassPanels, setGlassPanels] = useState<GlassPanel[]>([]);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [surveyDate, setSurveyDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    addDefaultPanel();
  }, []);

  const addDefaultPanel = () => {
    const newPanel: GlassPanel = {
      id: generateId(),
      panelName: `Panel ${glassPanels.length + 1}`,
      length: 2.0,
      width: 1.5,
      thickness: 4,
      glassType: 'DOUBLE_GLAZED',
      quantity: 1,
      notes: ''
    };
    setGlassPanels([newPanel]);
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const addPanel = () => {
    const newPanel: GlassPanel = {
      id: generateId(),
      panelName: `Panel ${glassPanels.length + 1}`,
      length: 2.0,
      width: 1.5,
      thickness: 4,
      glassType: 'DOUBLE_GLAZED',
      quantity: 1,
      notes: ''
    };
    setGlassPanels([...glassPanels, newPanel]);
  };

  const removePanel = (id: string) => {
    if (glassPanels.length > 1) {
      setGlassPanels(glassPanels.filter(panel => panel.id !== id));
    }
  };

  const updatePanel = (id: string, field: keyof GlassPanel, value: any) => {
    setGlassPanels(panels =>
      panels.map(panel =>
        panel.id === id ? { ...panel, [field]: value } : panel
      )
    );
  };

  const calculateGlass = async () => {
    setLoading(true);
    try {
      // Calculate locally for demo purposes
      const result = performCalculation();
      setCalculationResult(result);
    } catch (error) {
      console.error('Error calculating glass:', error);
    } finally {
      setLoading(false);
    }
  };

  const performCalculation = (): CalculationResult => {
    const glassTypePrices: { [key: string]: number } = {
      'SINGLE_GLAZED': 25,
      'DOUBLE_GLAZED': 45,
      'TRIPLE_GLAZED': 65,
      'LAMINATED': 55,
      'TOUGHENED': 50,
      'LOW_E': 55
    };

    const glassTypeDensity: { [key: string]: number } = {
      'SINGLE_GLAZED': 2.5,
      'DOUBLE_GLAZED': 5.0,
      'TRIPLE_GLAZED': 7.5,
      'LAMINATED': 2.8,
      'TOUGHENED': 2.5,
      'LOW_E': 2.6
    };

    let totalWeight = 0;
    let totalArea = 0;
    let totalValue = 0;
    const calculatedPanels = [];
    const glassTypeSummary: { [key: string]: number } = {};
    const thicknessSummary: { [key: string]: number } = {};

    for (const panel of glassPanels) {
      const area = panel.length * panel.width * panel.quantity;
      const volume = area * (panel.thickness / 1000); // Convert mm to m
      const density = glassTypeDensity[panel.glassType] || 2.5;
      const weight = volume * density * 1000; // Convert to kg
      const unitPrice = glassTypePrices[panel.glassType] || 45;
      const totalPrice = area * unitPrice;

      const safetyNotes = [];
      if (weight > 25) safetyNotes.push('Heavy panel - requires team lift');
      if (panel.thickness > 10) safetyNotes.push('Thick glass - handle with care');
      if (area > 4) safetyNotes.push('Large panel - may require mechanical assistance');

      calculatedPanels.push({
        id: panel.id,
        panelName: panel.panelName,
        weight,
        area,
        unitPrice,
        totalPrice,
        safetyNotes
      });

      totalWeight += weight;
      totalArea += area;
      totalValue += totalPrice;

      // Update summaries
      glassTypeSummary[panel.glassType] = (glassTypeSummary[panel.glassType] || 0) + panel.quantity;
      thicknessSummary[`${panel.thickness}mm`] = (thicknessSummary[`${panel.thickness}mm`] || 0) + panel.quantity;
    }

    const recommendations = [];
    const warnings = [];

    if (totalWeight > 200) {
      recommendations.push('Consider mechanical lifting equipment for installation');
    }
    if (totalArea > 50) {
      recommendations.push('Schedule installation across multiple days');
    }
    
    const hasHeavyPanels = calculatedPanels.some(p => p.weight > 100);
    if (hasHeavyPanels) {
      warnings.push('Some panels exceed 100kg - ensure adequate lifting equipment');
    }

    return {
      totalPanels: glassPanels.reduce((sum, panel) => sum + panel.quantity, 0),
      totalWeight,
      totalArea,
      averageThickness: glassPanels.reduce((sum, panel) => sum + panel.thickness, 0) / glassPanels.length,
      totalValue,
      panels: calculatedPanels,
      summary: {
        glassTypes: glassTypeSummary,
        thicknessSummary,
        recommendations,
        warnings
      }
    };
  };

  const saveCalculation = async () => {
    if (!calculationResult || !projectName) {
      alert('Please enter a project name and calculate first');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/survey/glass-calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          surveyDate,
          glassPanels,
          calculationResult
        }),
      });

      if (response.ok) {
        alert('Calculation saved successfully!');
      } else {
        alert('Failed to save calculation. Please try again.');
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
      alert('Error saving calculation. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const exportToCSV = () => {
    if (!calculationResult) return;

    const csvData = [
      ['Panel Name', 'Length (m)', 'Width (m)', 'Thickness (mm)', 'Glass Type', 'Quantity', 'Area (m²)', 'Weight (kg)', 'Unit Price (£)', 'Total Price (£)'],
      ...glassPanels.map((panel, index) => {
        const result = calculationResult.panels[index];
        return [
          panel.panelName,
          panel.length.toString(),
          panel.width.toString(),
          panel.thickness.toString(),
          panel.glassType.replace('_', ' '),
          panel.quantity.toString(),
          result?.area.toFixed(2) || '0',
          result?.weight.toFixed(2) || '0',
          result?.unitPrice.toFixed(2) || '0',
          result?.totalPrice.toFixed(2) || '0'
        ];
      })
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'glass-calculation'}-${surveyDate}.csv`;
    document.body.appendChild(a);
    (a as HTMLAnchorElement).click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Calculator className="h-8 w-8 mr-3 text-blue-600" />
            Survey Glass Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate glass weights, areas, and costs for accurate project planning
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV} disabled={!calculationResult}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={saveCalculation} disabled={saving || !calculationResult}>
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
              />
            </div>
            <div>
              <Label htmlFor="surveyDate">Survey Date</Label>
              <Input
                id="surveyDate"
                type="date"
                value={surveyDate}
                onChange={(e) => setSurveyDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="input" className="space-y-6">
        <TabsList>
          <TabsTrigger value="input">Glass Input</TabsTrigger>
          <TabsTrigger value="results">Calculation Results</TabsTrigger>
          <TabsTrigger value="summary">Project Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Glass Panel Details</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={addPanel}>
                <Plus className="h-4 w-4 mr-2" />
                Add Panel
              </Button>
              <Button onClick={calculateGlass} disabled={loading || glassPanels.length === 0}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Calculator className="h-4 w-4 mr-2" />
                )}
                Calculate
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {glassPanels.map((panel, index) => (
              <Card key={panel.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-2">
                      <Label className="text-xs">Panel Name</Label>
                      <Input
                        value={panel.panelName}
                        onChange={(e) => updatePanel(panel.id, 'panelName', e.target.value)}
                        placeholder="Panel name"
                      />
                    </div>

                    <div className="col-span-1">
                      <Label className="text-xs">Length (m)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={panel.length}
                        onChange={(e) => updatePanel(panel.id, 'length', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="col-span-1">
                      <Label className="text-xs">Width (m)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={panel.width}
                        onChange={(e) => updatePanel(panel.id, 'width', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="col-span-1">
                      <Label className="text-xs">Thickness (mm)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={panel.thickness}
                        onChange={(e) => updatePanel(panel.id, 'thickness', parseInt(e.target.value) || 4)}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="text-xs">Glass Type</Label>
                      <Select value={panel.glassType} onValueChange={(value) => updatePanel(panel.id, 'glassType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SINGLE_GLAZED">Single Glazed</SelectItem>
                          <SelectItem value="DOUBLE_GLAZED">Double Glazed</SelectItem>
                          <SelectItem value="TRIPLE_GLAZED">Triple Glazed</SelectItem>
                          <SelectItem value="LAMINATED">Laminated</SelectItem>
                          <SelectItem value="TOUGHENED">Toughened</SelectItem>
                          <SelectItem value="LOW_E">Low-E</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-1">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={panel.quantity}
                        onChange={(e) => updatePanel(panel.id, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div className="col-span-3">
                      <Label className="text-xs">Notes</Label>
                      <Input
                        value={panel.notes || ''}
                        onChange={(e) => updatePanel(panel.id, 'notes', e.target.value)}
                        placeholder="Additional notes..."
                      />
                    </div>

                    <div className="col-span-1 flex items-end justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePanel(panel.id)}
                        disabled={glassPanels.length === 1}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-600 grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-muted-foreground">Area per unit:</span>
                      <span className="ml-1 font-medium">{(panel.length * panel.width).toFixed(2)} m²</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total area:</span>
                      <span className="ml-1 font-medium">{(panel.length * panel.width * panel.quantity).toFixed(2)} m²</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Est. weight:</span>
                      <span className="ml-1 font-medium">{(panel.length * panel.width * panel.thickness * 2.5 * panel.quantity / 1000).toFixed(1)} kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {calculationResult ? (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{calculationResult.totalPanels}</div>
                    <div className="text-sm text-muted-foreground">Total Panels</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{calculationResult.totalArea.toFixed(2)} m²</div>
                    <div className="text-sm text-muted-foreground">Total Area</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{calculationResult.totalWeight.toFixed(1)} kg</div>
                    <div className="text-sm text-muted-foreground">Total Weight</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">£{calculationResult.totalValue.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Estimated Value</div>
                  </CardContent>
                </Card>
              </div>

              {/* Panel Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Panel-by-Panel Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {calculationResult.panels.map((panel, index) => (
                      <Card key={panel.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{panel.panelName}</h4>
                            <Badge variant="outline">£{panel.totalPrice.toFixed(2)}</Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Area:</span>
                              <span className="ml-1 font-medium">{panel.area.toFixed(2)} m²</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="ml-1 font-medium">{panel.weight.toFixed(1)} kg</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Unit Price:</span>
                              <span className="ml-1 font-medium">£{panel.unitPrice}/m²</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total:</span>
                              <span className="ml-1 font-medium">£{panel.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                          {panel.safetyNotes.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {panel.safetyNotes.map((note, noteIndex) => (
                                  <Badge key={noteIndex} variant="secondary" className="text-xs">
                                    {note}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Warnings and Recommendations */}
              {(calculationResult.summary.warnings.length > 0 || calculationResult.summary.recommendations.length > 0) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {calculationResult.summary.warnings.length > 0 && (
                    <Card className="border-orange-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-800">
                          <AlertTriangle className="h-5 w-5" />
                          Warnings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {calculationResult.summary.warnings.map((warning, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-orange-700">
                              <AlertTriangle className="h-4 w-4" />
                              {warning}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {calculationResult.summary.recommendations.length > 0 && (
                    <Card className="border-green-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="h-5 w-5" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {calculationResult.summary.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                              <CheckCircle className="h-4 w-4" />
                              {recommendation}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Calculations Yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Add glass panels and click calculate to see results
                </p>
                <Button onClick={() => {
                  (document.querySelector('[value="input"]') as HTMLElement)?.click();
                }}>
                  <Eye className="h-4 w-4 mr-2" />
                  Go to Input
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          {calculationResult ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Glass Types Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(calculationResult.summary.glassTypes).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm">{type.replace('_', ' ')}</span>
                        <Badge variant="outline">{count} panels</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thickness Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(calculationResult.summary.thicknessSummary).map(([thickness, count]) => (
                      <div key={thickness} className="flex justify-between items-center">
                        <span className="text-sm">{thickness}</span>
                        <Badge variant="outline">{count} panels</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{calculationResult.totalPanels}</div>
                      <div className="text-sm text-muted-foreground">Total Panels</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{calculationResult.totalArea.toFixed(1)} m²</div>
                      <div className="text-sm text-muted-foreground">Total Area</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{calculationResult.totalWeight.toFixed(0)} kg</div>
                      <div className="text-sm text-muted-foreground">Total Weight</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">£{calculationResult.totalValue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Est. Value</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Project Summary
                </h3>
                <p className="text-gray-500">
                  Complete calculations to see project summary
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
