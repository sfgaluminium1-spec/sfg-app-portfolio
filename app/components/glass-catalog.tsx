
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Eye, Shield, Thermometer, Volume2, Lightbulb, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface GlassType {
  id: string;
  name: string;
  category: string;
  description: string;
  thickness: number[];
  uValue: number;
  gValue: number;
  lightTransmission: number;
  soundReduction: number;
  isLaminated: boolean;
  isToughened: boolean;
  isFireRated: boolean;
  isSecurityGlass: boolean;
  isLowE: boolean;
  securityRating: string;
  fireRating: string;
  standards: string[];
  basePrice: number;
  pricePerSqm: number;
  leadTimeWeeks: number;
  isActive: boolean;
  _count: {
    specifications: number;
  };
}

export default function GlassCatalog({ onSelectGlass }: { onSelectGlass?: (glassType: GlassType) => void; }) {
  const [glassTypes, setGlassTypes] = useState<GlassType[]>([]);
  const [filteredGlassTypes, setFilteredGlassTypes] = useState<GlassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [securityFilter, setSecurityFilter] = useState('all');
  const [selectedGlass, setSelectedGlass] = useState<GlassType | null>(null);

  useEffect(() => {
    fetchGlassTypes();
  }, []);

  useEffect(() => {
    filterGlassTypes();
  }, [glassTypes, searchTerm, categoryFilter, securityFilter]);

  const fetchGlassTypes = async () => {
    try {
      const response = await fetch('/api/spec/glass-types?isActive=true');
      if (response.ok) {
        const data = await response.json();
        setGlassTypes(data);
      }
    } catch (error) {
      console.error('Error fetching glass types:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGlassTypes = () => {
    let filtered = glassTypes;

    if (searchTerm) {
      filtered = filtered.filter(glass =>
        glass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        glass.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(glass => glass.category === categoryFilter);
    }

    if (securityFilter !== 'all') {
      if (securityFilter === 'security') {
        filtered = filtered.filter(glass => glass.isSecurityGlass);
      } else if (securityFilter === 'fire') {
        filtered = filtered.filter(glass => glass.isFireRated);
      }
    }

    setFilteredGlassTypes(filtered);
  };

  const getUniqueCategories = () => {
    return Array.from(new Set(glassTypes.map(glass => glass.category)));
  };

  const getPerformanceColor = (value: number, type: 'uValue' | 'gValue' | 'light' | 'sound') => {
    switch (type) {
      case 'uValue':
        return value <= 1.2 ? 'text-green-600' : value <= 1.6 ? 'text-yellow-600' : 'text-red-600';
      case 'gValue':
        return value >= 0.6 ? 'text-green-600' : value >= 0.4 ? 'text-yellow-600' : 'text-red-600';
      case 'light':
        return value >= 70 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600';
      case 'sound':
        return value >= 35 ? 'text-green-600' : value >= 30 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Glass Catalog</h2>
          <p className="text-muted-foreground">Browse and select glass types for specifications</p>
        </div>
        <Badge variant="secondary">{filteredGlassTypes.length} glass types</Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search glass types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Security</label>
              <Select value={securityFilter} onValueChange={setSecurityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="security">Security Glass</SelectItem>
                  <SelectItem value="fire">Fire Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setSecurityFilter('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Glass Types Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGlassTypes.map((glass, index) => (
          <div key={glass.id}>
            <Card
              className="h-full hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedGlass(glass)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{glass.name}</CardTitle>
                    <CardDescription>{glass.category.replace('_', ' ')}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {glass.isSecurityGlass && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Security
                      </Badge>
                    )}
                    {glass.isFireRated && (
                      <Badge variant="destructive" className="text-xs">
                        Fire Rated
                      </Badge>
                    )}
                    {glass.isLowE && (
                      <Badge variant="default" className="text-xs">
                        Low-E
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Thermometer className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">U-Value</span>
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(glass.uValue, 'uValue')}`}>
                        {glass.uValue || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Light</span>
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(glass.lightTransmission, 'light')}`}>
                        {glass.lightTransmission || 'N/A'}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-green-500" />
                        <span className="text-sm">G-Value</span>
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(glass.gValue, 'gValue')}`}>
                        {glass.gValue || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Volume2 className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Sound</span>
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(glass.soundReduction, 'sound')}`}>
                        {glass.soundReduction || 'N/A'} dB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thickness Options */}
                <div>
                  <p className="text-sm font-medium mb-2">Available Thickness:</p>
                  <div className="flex flex-wrap gap-1">
                    {glass.thickness.map(t => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}mm
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {glass.isLaminated && (
                    <Badge variant="secondary" className="text-xs">Laminated</Badge>
                  )}
                  {glass.isToughened && (
                    <Badge variant="secondary" className="text-xs">Toughened</Badge>
                  )}
                </div>

                {/* Pricing and Lead Time */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Price: </span>
                    <span className="font-medium">
                      {glass.pricePerSqm ? `£${glass.pricePerSqm}/m²` : 'POA'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lead: </span>
                    <span className="font-medium">{glass.leadTimeWeeks}w</span>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Used in {glass._count.specifications} specifications
                  </span>
                  {onSelectGlass && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectGlass(glass);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Select
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {filteredGlassTypes.length === 0 && (
        <div className="text-center py-12">
          <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No glass types found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Glass Details Modal */}
      {selectedGlass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedGlass.name}</h3>
                  <p className="text-muted-foreground">{selectedGlass.category.replace('_', ' ')}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedGlass(null)}>
                  ×
                </Button>
              </div>
              
              <Tabs defaultValue="specifications" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="specifications" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Thermal Performance</h4>
                      <div className="space-y-1 text-sm">
                        <p>U-Value: {selectedGlass.uValue || 'N/A'} W/m²K</p>
                        <p>G-Value: {selectedGlass.gValue || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Optical Performance</h4>
                      <div className="space-y-1 text-sm">
                        <p>Light Transmission: {selectedGlass.lightTransmission || 'N/A'}%</p>
                        <p>Sound Reduction: {selectedGlass.soundReduction || 'N/A'} dB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGlass.isLaminated && <Badge>Laminated</Badge>}
                      {selectedGlass.isToughened && <Badge>Toughened</Badge>}
                      {selectedGlass.isFireRated && <Badge>Fire Rated</Badge>}
                      {selectedGlass.isSecurityGlass && <Badge>Security Glass</Badge>}
                      {selectedGlass.isLowE && <Badge>Low-E</Badge>}
                    </div>
                  </div>
                  
                  {selectedGlass.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedGlass.description}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="compliance" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Security Rating</h4>
                    <p className="text-sm">{selectedGlass.securityRating || 'Standard'}</p>
                  </div>
                  
                  {selectedGlass.fireRating && (
                    <div>
                      <h4 className="font-medium mb-2">Fire Rating</h4>
                      <p className="text-sm">{selectedGlass.fireRating}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-2">Standards</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGlass.standards.map(standard => (
                        <Badge key={standard} variant="outline">{standard}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Pricing</h4>
                      <div className="space-y-1 text-sm">
                        <p>Base Price: {selectedGlass.basePrice ? `£${selectedGlass.basePrice}` : 'POA'}</p>
                        <p>Price per m²: {selectedGlass.pricePerSqm ? `£${selectedGlass.pricePerSqm}` : 'POA'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Availability</h4>
                      <div className="space-y-1 text-sm">
                        <p>Lead Time: {selectedGlass.leadTimeWeeks} weeks</p>
                        <p>Status: {selectedGlass.isActive ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {onSelectGlass && (
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => {
                      onSelectGlass(selectedGlass);
                      setSelectedGlass(null);
                    }}
                  >
                    Select This Glass Type
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
