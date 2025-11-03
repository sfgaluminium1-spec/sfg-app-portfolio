
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Truck, Users, AlertTriangle, CheckCircle, Calendar, Calculator, Package, MapPin, Clock, Shield, Wrench, TrendingUp } from 'lucide-react';

interface GlassPanel {
  panelName: string;
  length: number;
  width: number;
  thickness: number;
  weight?: number;
  staffRequired?: number;
  liftingMethod?: string;
  safetyNotes?: string;
}

interface GlassCalculationResult {
  summary: {
    totalPanels: number;
    totalWeight: number;
    totalArea: number;
    maxStaffRequired: number;
    primaryLiftingMethod: string;
    mechanicalAidRequired: boolean;
    overallSafetyNotes: string[];
  };
  calculations: any[];
  routeOptimization: {
    recommendedVanConfiguration: string;
    estimatedInstallationTime: number;
    toolsRequired: string[];
  };
  safetyCompliance: {
    manualHandlingAssessment: string;
    teamSizeCompliant: string;
    mechanicalAidCompliant: string;
  };
}

interface InstallationSchedule {
  id: string;
  scheduledDate: string;
  scheduledTime: string | null;
  estimatedDuration: number;
  totalGlassWeight: number | null;
  requiredStaff: number;
  actualStaff: number;
  status: string;
  mechanicalAidRequired: boolean;
  job: {
    id: string;
    jobNumber: string;
    client: string;
    site: string | null;
    description: string;
    status: string;
    value: number | null;
  };
  teamLeader: {
    id: string;
    fullName: string;
    role: string;
    email: string;
    phone: string | null;
  } | null;
  van: {
    id: string;
    vanNumber: string;
    registration: string;
    capacity: string | null;
  } | null;
  assignments: {
    employee: {
      id: string;
      fullName: string;
      role: string;
      skills: string[];
    };
    assignmentType: string;
    isTeamLeader: boolean;
  }[];
  glassCalculations: {
    panelName: string;
    length: number;
    width: number;
    thickness: number;
    calculatedWeight: number;
    staffRequired: number;
    liftingMethod: string;
    safetyNotes: string | null;
  }[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
    case 'READY_FOR_INSTALL': return 'bg-green-100 text-green-800';
    case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
    case 'MECHANICAL_AID_REQUIRED': return 'bg-orange-100 text-orange-800';
    case 'SAFETY_HOLD': return 'bg-red-100 text-red-800';
    case 'COMPLETED': return 'bg-green-100 text-green-800';
    case 'CANCELLED': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getSafetyColor = (assessment: string) => {
  switch (assessment) {
    case 'PASS': return 'text-green-600';
    case 'REQUIRES_ASSESSMENT': return 'text-orange-600';
    case 'COMPLIANT': return 'text-green-600';
    case 'REQUIRES_ADDITIONAL_RESOURCES': return 'text-red-600';
    case 'MECHANICAL_AID_REQUIRED': return 'text-orange-600';
    case 'MANUAL_HANDLING_ACCEPTABLE': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

export default function InstallationScheduler() {
  const [installationSchedules, setInstallationSchedules] = useState<InstallationSchedule[]>([]);
  const [glassCalculationResult, setGlassCalculationResult] = useState<GlassCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Glass Calculator Form
  const [glassPanels, setGlassPanels] = useState<GlassPanel[]>([
    { panelName: 'Panel 1', length: 2.0, width: 1.5, thickness: 4 }
  ]);

  useEffect(() => {
    fetchInstallationSchedules();
  }, []);

  const fetchInstallationSchedules = async () => {
    try {
      const response = await fetch('/api/installation-schedule');
      const data = await response.json();
      setInstallationSchedules(data);
    } catch (error) {
      console.error('Error fetching installation schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGlassPanel = () => {
    setGlassPanels([
      ...glassPanels,
      { panelName: `Panel ${glassPanels.length + 1}`, length: 2.0, width: 1.5, thickness: 4 }
    ]);
  };

  const removeGlassPanel = (index: number) => {
    setGlassPanels(glassPanels.filter((_, i) => i !== index));
  };

  const updateGlassPanel = (index: number, field: keyof GlassPanel, value: any) => {
    const updated = [...glassPanels];
    updated[index] = { ...updated[index], [field]: value };
    setGlassPanels(updated);
  };

  const calculateGlassWeights = async () => {
    setCalculating(true);
    try {
      const response = await fetch('/api/installation-schedule/glass-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ glassDetails: glassPanels })
      });

      if (response.ok) {
        const result = await response.json();
        setGlassCalculationResult(result);
      } else {
        console.error('Failed to calculate glass weights');
      }
    } catch (error) {
      console.error('Error calculating glass weights:', error);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <Truck className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Installation Scheduler & Safety Calculator</h1>
            <p className="text-orange-100 mt-2">
              Glass weight calculations, automatic staffing, and route optimization with safety compliance
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-orange-700/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">{installationSchedules.length}</div>
            <div className="text-orange-100">Scheduled Installs</div>
          </div>
          <div className="bg-orange-700/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {installationSchedules.filter(s => s.status === 'IN_PROGRESS').length}
            </div>
            <div className="text-orange-100">In Progress</div>
          </div>
          <div className="bg-orange-700/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {installationSchedules.filter(s => s.mechanicalAidRequired).length}
            </div>
            <div className="text-orange-100">Need Mech Aid</div>
          </div>
          <div className="bg-orange-700/50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {installationSchedules.reduce((sum, s) => sum + s.requiredStaff, 0)}
            </div>
            <div className="text-orange-100">Total Staff Req</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Glass Calculator</TabsTrigger>
          <TabsTrigger value="schedules">Installation Schedules</TabsTrigger>
          <TabsTrigger value="safety">Safety Compliance</TabsTrigger>
          <TabsTrigger value="routes">Route Optimization</TabsTrigger>
        </TabsList>

        {/* Glass Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Glass Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Glass Weight Calculator
                </CardTitle>
                <CardDescription>
                  Calculate glass weights and automatic staffing requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {glassPanels.map((panel, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Input
                          value={panel.panelName}
                          onChange={(e) => updateGlassPanel(index, 'panelName', e.target.value)}
                          className="font-medium"
                        />
                        {glassPanels.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeGlassPanel(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Length (m)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={panel.length}
                            onChange={(e) => updateGlassPanel(index, 'length', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Width (m)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={panel.width}
                            onChange={(e) => updateGlassPanel(index, 'width', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Thickness (mm)</Label>
                          <Input
                            type="number"
                            value={panel.thickness}
                            onChange={(e) => updateGlassPanel(index, 'thickness', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Area: {(panel.length * panel.width).toFixed(2)} m² | Weight: {(panel.length * panel.width * panel.thickness * 2.5).toFixed(1)} kg
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={addGlassPanel} className="flex-1">
                    <Package className="h-4 w-4 mr-2" />
                    Add Panel
                  </Button>
                  <Button onClick={calculateGlassWeights} disabled={calculating} className="flex-1">
                    {calculating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Calculator className="h-4 w-4 mr-2" />
                    )}
                    Calculate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety & Staffing Analysis
                </CardTitle>
                <CardDescription>
                  Automatic safety calculations and resource requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {glassCalculationResult ? (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-blue-800">
                          {glassCalculationResult.summary.totalWeight} kg
                        </div>
                        <div className="text-sm text-blue-600">Total Weight</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-green-800">
                          {glassCalculationResult.summary.maxStaffRequired}
                        </div>
                        <div className="text-sm text-green-600">Staff Required</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-purple-800">
                          {glassCalculationResult.summary.totalArea} m²
                        </div>
                        <div className="text-sm text-purple-600">Total Area</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-orange-800">
                          {glassCalculationResult.routeOptimization.estimatedInstallationTime}h
                        </div>
                        <div className="text-sm text-orange-600">Est. Duration</div>
                      </div>
                    </div>

                    {/* Safety Compliance */}
                    <div>
                      <h4 className="font-medium mb-3">Safety Compliance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">Manual Handling Assessment</span>
                          <Badge className={getSafetyColor(glassCalculationResult.safetyCompliance.manualHandlingAssessment)}>
                            {glassCalculationResult.safetyCompliance.manualHandlingAssessment}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">Team Size Compliance</span>
                          <Badge className={getSafetyColor(glassCalculationResult.safetyCompliance.teamSizeCompliant)}>
                            {glassCalculationResult.safetyCompliance.teamSizeCompliant}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">Mechanical Aid</span>
                          <Badge className={getSafetyColor(glassCalculationResult.safetyCompliance.mechanicalAidCompliant)}>
                            {glassCalculationResult.safetyCompliance.mechanicalAidCompliant}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Safety Notes */}
                    {glassCalculationResult.summary.overallSafetyNotes.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Safety Alerts</h4>
                        <div className="space-y-2">
                          {glassCalculationResult.summary.overallSafetyNotes.map((note, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                              <AlertTriangle className="h-4 w-4" />
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Route Optimization */}
                    <div>
                      <h4 className="font-medium mb-3">Route Optimization</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Recommended Van</span>
                          <span className="font-medium">{glassCalculationResult.routeOptimization.recommendedVanConfiguration}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Required Tools:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {glassCalculationResult.routeOptimization.toolsRequired.map((tool, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Panel Details */}
                    <div>
                      <h4 className="font-medium mb-3">Panel-by-Panel Analysis</h4>
                      <div className="space-y-2">
                        {glassCalculationResult.calculations.map((calc, index) => (
                          <Card key={index} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-sm">{calc.panelName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {calc.staffRequired} {calc.staffRequired === 1 ? 'person' : 'people'}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-gray-500">Dimensions:</span>
                                  <span className="ml-1">{calc.dimensions.length}×{calc.dimensions.width}×{calc.dimensions.thickness}mm</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Weight:</span>
                                  <span className="ml-1 font-medium">{calc.weight}kg</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 mt-2">
                                <strong>Method:</strong> {calc.liftingMethod}
                              </div>
                              {calc.safetyNotes && (
                                <div className="text-xs text-orange-600 bg-orange-50 p-1 rounded mt-1">
                                  {calc.safetyNotes}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Glass Weight Calculator
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Add glass panel dimensions and click calculate to get safety analysis
                    </p>
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                      <strong>Formula:</strong> Weight = Length × Width × Thickness × 2.5 kg/m³
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Installation Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6">
          <div className="grid gap-6">
            {installationSchedules.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Truck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Installation Schedules
                  </h3>
                  <p className="text-gray-500">
                    Installation schedules will appear here once jobs are ready for installation
                  </p>
                </CardContent>
              </Card>
            ) : (
              installationSchedules.map((schedule) => (
                <Card key={schedule.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {schedule.job.jobNumber}
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status.replace('_', ' ')}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {schedule.job.client} - {schedule.job.site || 'Site TBC'}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Scheduled</div>
                        <div className="font-medium">
                          {new Date(schedule.scheduledDate).toLocaleDateString()}
                          {schedule.scheduledTime && ` ${schedule.scheduledTime}`}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Team Info */}
                      <div>
                        <h4 className="font-medium mb-3">Team Assignment</h4>
                        <div className="space-y-2">
                          {schedule.teamLeader && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-blue-100">
                                  {schedule.teamLeader.fullName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{schedule.teamLeader.fullName}</div>
                                <div className="text-xs text-gray-600">Team Leader</div>
                              </div>
                            </div>
                          )}
                          <div className="text-sm">
                            <span className="text-gray-600">Team Size:</span>
                            <span className="ml-1 font-medium">
                              {schedule.actualStaff} of {schedule.requiredStaff} required
                            </span>
                          </div>
                          {schedule.assignments.length > 0 && (
                            <div className="text-xs text-gray-600">
                              +{schedule.assignments.length} team members assigned
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Glass Details */}
                      <div>
                        <h4 className="font-medium mb-3">Glass Analysis</h4>
                        <div className="space-y-2">
                          {schedule.totalGlassWeight && (
                            <div className="text-sm">
                              <span className="text-gray-600">Total Weight:</span>
                              <span className="ml-1 font-medium">{schedule.totalGlassWeight}kg</span>
                            </div>
                          )}
                          <div className="text-sm">
                            <span className="text-gray-600">Panels:</span>
                            <span className="ml-1 font-medium">{schedule.glassCalculations.length}</span>
                          </div>
                          {schedule.mechanicalAidRequired && (
                            <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 p-1 rounded">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Mechanical aid required</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Vehicle */}
                      <div>
                        <h4 className="font-medium mb-3">Vehicle</h4>
                        {schedule.van ? (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{schedule.van.vanNumber}</div>
                            <div className="text-xs text-gray-600">{schedule.van.registration}</div>
                            {schedule.van.capacity && (
                              <div className="text-xs text-gray-600">Capacity: {schedule.van.capacity}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">Van not assigned</div>
                        )}
                      </div>

                      {/* Schedule Info */}
                      <div>
                        <h4 className="font-medium mb-3">Schedule</h4>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Duration:</span>
                            <span className="ml-1 font-medium">{schedule.estimatedDuration}h</span>
                          </div>
                          {schedule.job.value && (
                            <div className="text-sm">
                              <span className="text-gray-600">Job Value:</span>
                              <span className="ml-1 font-medium">£{schedule.job.value.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Glass Calculations Details */}
                    {schedule.glassCalculations.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Glass Panel Breakdown</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {schedule.glassCalculations.map((calc, index) => (
                            <Card key={index} className="border-l-4 border-l-orange-500">
                              <CardContent className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-medium text-sm">{calc.panelName}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {calc.staffRequired} staff
                                  </Badge>
                                </div>
                                <div className="text-xs space-y-1">
                                  <div>
                                    <span className="text-gray-500">Size:</span>
                                    <span className="ml-1">{calc.length}×{calc.width}×{calc.thickness}mm</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Weight:</span>
                                    <span className="ml-1 font-medium">{calc.calculatedWeight}kg</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Method:</span>
                                    <span className="ml-1">{calc.liftingMethod}</span>
                                  </div>
                                </div>
                                {calc.safetyNotes && (
                                  <div className="text-xs text-orange-600 bg-orange-50 p-1 rounded mt-2">
                                    {calc.safetyNotes}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Safety Compliance Tab */}
        <TabsContent value="safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Safety Guidelines & Compliance
              </CardTitle>
              <CardDescription>
                SFG Aluminium safety protocols for glass installation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Weight-Based Staffing Rules</h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3 bg-green-50">
                      <div className="font-medium text-green-800">≤25kg - 1 Person</div>
                      <div className="text-sm text-green-600">Manual lifting allowed</div>
                      <div className="text-xs text-gray-600">Solo lift with proper technique</div>
                    </div>
                    <div className="border rounded-lg p-3 bg-blue-50">
                      <div className="font-medium text-blue-800">26-75kg - 2 People</div>
                      <div className="text-sm text-blue-600">Suction/manual lifting</div>
                      <div className="text-xs text-gray-600">Two-man lift with coordination</div>
                    </div>
                    <div className="border rounded-lg p-3 bg-orange-50">
                      <div className="font-medium text-orange-800">76-150kg - 3 People</div>
                      <div className="text-sm text-orange-600">Suction/manual lifting</div>
                      <div className="text-xs text-gray-600">Three-man lift with care</div>
                    </div>
                    <div className="border rounded-lg p-3 bg-red-50">
                      <div className="font-medium text-red-800">&gt;150kg - 4+ People or Mechanical</div>
                      <div className="text-sm text-red-600">Suction/crane assistance</div>
                      <div className="text-xs text-gray-600">Mechanical aid strongly recommended</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Planning Guidelines</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Group jobs by area/postcode for efficient routing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Assign staff based on glass weight and safe lifting rules</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Use one van with three men for heavy glass instead of two vans with two men each</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Install schedule must always be full 3 weeks in advance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                      <span>Flag under-booking immediately</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                      <span>If glass weight exceeds 150kg, flag for mechanical aid or extra staff</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Route Optimization Tab */}
        <TabsContent value="routes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Optimization
              </CardTitle>
              <CardDescription>
                3-week planning horizon with route efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Route Planning Coming Soon
                </h3>
                <p className="text-gray-500">
                  Advanced route optimization with 3-week planning horizon will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
