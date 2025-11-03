
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, Plus, Search, Star, Phone, Mail, MapPin, Building, Eye, Edit, Trash2, Package, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

interface Supplier {
  id: string;
  name: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  postcode?: string;
  country: string;
  categories: string[];
  specializations: string[];
  certifications: string[];
  performanceRating?: number;
  deliveryRating?: number;
  qualityRating?: number;
  priceRating?: number;
  paymentTerms?: string;
  deliveryTerms?: string;
  minimumOrder?: number;
  isActive: boolean;
  isPreferred: boolean;
  supplierOrders?: any[];
}

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [suppliers, searchTerm, categoryFilter, statusFilter]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data.suppliers || []);
      } else {
        // Fallback to mock data
        setSuppliers(mockSuppliers);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      // Fallback to mock data
      setSuppliers(mockSuppliers);
    } finally {
      setLoading(false);
    }
  };

  const mockSuppliers: Supplier[] = [
    {
      id: '1',
      name: 'Premium Glass Solutions',
      companyName: 'Premium Glass Solutions Ltd',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@premiumglass.co.uk',
      phone: '01234 567890',
      address: '123 Industrial Estate',
      city: 'Birmingham',
      postcode: 'B12 3AB',
      country: 'UK',
      categories: ['GLASS_PANELS', 'HARDWARE'],
      specializations: ['Laminated Glass', 'Toughened Glass'],
      certifications: ['ISO 9001', 'CE Marking'],
      performanceRating: 4.8,
      deliveryRating: 4.6,
      qualityRating: 4.9,
      priceRating: 4.2,
      paymentTerms: '30 days',
      deliveryTerms: '5-7 working days',
      minimumOrder: 500,
      isActive: true,
      isPreferred: true,
      supplierOrders: []
    },
    {
      id: '2',
      name: 'Aluminium Direct',
      companyName: 'Aluminium Direct Manufacturing',
      contactPerson: 'Mike Wilson',
      email: 'mike@aluminiumdirect.com',
      phone: '01234 567891',
      address: '456 Factory Road',
      city: 'Manchester',
      postcode: 'M15 6CD',
      country: 'UK',
      categories: ['ALUMINIUM_PROFILES', 'SEALANTS'],
      specializations: ['Extrusions', 'Powder Coating'],
      certifications: ['ISO 14001', 'OHSAS 18001'],
      performanceRating: 4.5,
      deliveryRating: 4.3,
      qualityRating: 4.7,
      priceRating: 4.6,
      paymentTerms: '30 days',
      deliveryTerms: '3-5 working days',
      minimumOrder: 1000,
      isActive: true,
      isPreferred: false,
      supplierOrders: []
    }
  ];

  const filterSuppliers = () => {
    let filtered = suppliers;

    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(supplier =>
        supplier.categories.includes(categoryFilter)
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(supplier => supplier.isActive);
      } else if (statusFilter === 'preferred') {
        filtered = filtered.filter(supplier => supplier.isPreferred);
      }
    }

    setFilteredSuppliers(filtered);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierModal(true);
    setIsEditing(false);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
    setIsEditing(true);
  };

  const handleCreateSupplier = () => {
    setSelectedSupplier(null);
    setShowEditModal(true);
    setIsEditing(false);
  };

  const getRatingColor = (rating?: number) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : ''} ${getRatingColor(rating)}`} />
    ));
  };

  const SupplierCard = ({ supplier }: { supplier: Supplier }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${supplier.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <CardTitle className="text-lg">{supplier.name}</CardTitle>
            {supplier.isPreferred && (
              <Badge variant="default" className="bg-blue-500">
                Preferred
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleViewSupplier(supplier)} title="View Supplier Details">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditSupplier(supplier)} title="Edit Supplier">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {supplier.companyName && (
          <CardDescription className="text-base font-medium">
            {supplier.companyName}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Contact Information */}
          <div className="grid grid-cols-1 gap-2">
            {supplier.contactPerson && (
              <div className="flex items-center text-sm">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                {supplier.contactPerson}
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                {supplier.email}
              </div>
            )}
            {supplier.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                {supplier.phone}
              </div>
            )}
            {supplier.address && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {supplier.address}
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Categories</p>
            <div className="flex flex-wrap gap-1">
              {supplier.categories.slice(0, 3).map((category, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {category.replace('_', ' ')}
                </Badge>
              ))}
              {supplier.categories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{supplier.categories.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Performance Ratings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Performance</p>
              <div className="flex items-center space-x-1">
                {getRatingStars(supplier.performanceRating)}
                <span className="text-sm font-medium ml-2">
                  {supplier.performanceRating?.toFixed(1) || 'N/A'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Delivery</p>
              <div className="flex items-center space-x-1">
                {getRatingStars(supplier.deliveryRating)}
                <span className="text-sm font-medium ml-2">
                  {supplier.deliveryRating?.toFixed(1) || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          {supplier.paymentTerms && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Payment Terms</p>
              <p className="text-sm font-medium">{supplier.paymentTerms}</p>
            </div>
          )}

          {/* Recent Orders */}
          {supplier.supplierOrders && supplier.supplierOrders.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Recent Orders</p>
              <p className="text-sm">{supplier.supplierOrders.length} orders</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
            <Truck className="h-8 w-8 mr-3 text-blue-600" />
            Supplier Management
          </h1>
          <p className="text-muted-foreground">
            Manage suppliers, track performance, and handle orders
          </p>
        </div>
        <Button onClick={handleCreateSupplier}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers by name, company, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ALUMINIUM_PROFILES">Aluminium Profiles</SelectItem>
                <SelectItem value="GLASS_PANELS">Glass Panels</SelectItem>
                <SelectItem value="HARDWARE">Hardware</SelectItem>
                <SelectItem value="SEALANTS">Sealants</SelectItem>
                <SelectItem value="TOOLS">Tools</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="preferred">Preferred Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by adding your first supplier.'}
            </p>
            <Button onClick={handleCreateSupplier}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Supplier Detail Modal */}
      <Dialog open={showSupplierModal} onOpenChange={setShowSupplierModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>{selectedSupplier?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Complete supplier information and performance metrics
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-6">
              {/* Supplier Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Company Name</Label>
                        <p className="font-medium">{selectedSupplier.companyName || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Contact Person</Label>
                        <p className="font-medium">{selectedSupplier.contactPerson || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{selectedSupplier.email || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium">{selectedSupplier.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Address</Label>
                        <p className="font-medium">
                          {selectedSupplier.address
                            ? `${selectedSupplier.address}, ${selectedSupplier.city || ''} ${selectedSupplier.postcode || ''}`.trim()
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Website</Label>
                        <p className="font-medium">{selectedSupplier.website || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Ratings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Performance</span>
                        <div className="flex items-center space-x-2">
                          {getRatingStars(selectedSupplier.performanceRating)}
                          <span className="text-sm font-bold">
                            {selectedSupplier.performanceRating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Delivery Rating</span>
                        <div className="flex items-center space-x-2">
                          {getRatingStars(selectedSupplier.deliveryRating)}
                          <span className="text-sm font-bold">
                            {selectedSupplier.deliveryRating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Quality Rating</span>
                        <div className="flex items-center space-x-2">
                          {getRatingStars(selectedSupplier.qualityRating)}
                          <span className="text-sm font-bold">
                            {selectedSupplier.qualityRating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Price Rating</span>
                        <div className="flex items-center space-x-2">
                          {getRatingStars(selectedSupplier.priceRating)}
                          <span className="text-sm font-bold">
                            {selectedSupplier.priceRating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Categories and Specializations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedSupplier.categories.map((category, index) => (
                        <Badge key={index} variant="outline">
                          {category.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Specializations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedSupplier.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Business Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Payment Terms</Label>
                      <p className="font-medium">{selectedSupplier.paymentTerms || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Delivery Terms</Label>
                      <p className="font-medium">{selectedSupplier.deliveryTerms || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Minimum Order</Label>
                      <p className="font-medium">
                        {selectedSupplier.minimumOrder ? `£${selectedSupplier.minimumOrder}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSupplier.supplierOrders && selectedSupplier.supplierOrders.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSupplier.supplierOrders.slice(0, 5).map((order: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.orderDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                            {order.totalAmount && (
                              <p className="text-sm font-medium text-green-600">
                                £{order.totalAmount.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSupplierModal(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowSupplierModal(false);
              if (selectedSupplier) handleEditSupplier(selectedSupplier);
            }}>
              Edit Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note: SupplierEditModal component would be implemented here */}
    </div>
  );
}
