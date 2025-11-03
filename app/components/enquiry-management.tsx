'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, Phone, Mail, Calendar, FileText, Search, Filter, Plus, Eye, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import FirstEnquiryModal from '@/components/modals/first-enquiry-modal';
import QuickQuoteModal from '@/components/modals/quick-quote-modal';

interface Enquiry {
  id: string;
  enquiryNumber: string;
  customerName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectName?: string;
  description?: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'WON' | 'LOST' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: Date | string;
  quotes?: any[];
}

const statusColors = {
  NEW: 'bg-blue-500',
  CONTACTED: 'bg-yellow-500',
  QUOTED: 'bg-purple-500',
  WON: 'bg-green-500',
  LOST: 'bg-red-500',
  ON_HOLD: 'bg-gray-500'
};

const priorityColors = {
  LOW: 'border-l-gray-400',
  MEDIUM: 'border-l-blue-400',
  HIGH: 'border-l-orange-400',
  URGENT: 'border-l-red-400'
};

export default function EnquiryManagement() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsEnquiry, setDetailsEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/enquiries');
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = enquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.enquiryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enquiry.projectName && enquiry.projectName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateQuote = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowQuoteModal(true);
  };

  const handleViewDetails = (enquiry: Enquiry) => {
    setDetailsEnquiry(enquiry);
    setShowDetailsModal(true);
  };

  const EnquiryCard = ({ enquiry }: { enquiry: Enquiry }) => (
    <Card className={`hover:shadow-lg transition-shadow duration-300 border-l-4 ${priorityColors[enquiry.priority]}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg">{enquiry.enquiryNumber}</CardTitle>
              <CardDescription>{enquiry.customerName}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${statusColors[enquiry.status]} text-white`}>
              {enquiry.status}
            </Badge>
            <Badge variant="outline">{enquiry.priority}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {enquiry.projectName && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Project</h4>
            <p className="text-sm">{enquiry.projectName}</p>
          </div>
        )}
        
        {enquiry.description && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
            <p className="text-sm line-clamp-2">{enquiry.description}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {enquiry.contactName && (
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>{enquiry.contactName}</span>
            </div>
          )}
          
          {enquiry.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{enquiry.phone}</span>
            </div>
          )}
          
          {enquiry.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{enquiry.email}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(enquiry.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{enquiry.source}</Badge>
            {enquiry.quotes && enquiry.quotes.length > 0 && (
              <Badge variant="outline">{enquiry.quotes.length} Quote(s)</Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            {enquiry.status === 'NEW' || enquiry.status === 'CONTACTED' ? (
              <Button
                size="sm"
                onClick={() => handleCreateQuote(enquiry)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-1" />
                Create Quote
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewDetails(enquiry)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            )}
          </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Enquiry Management</h1>
          <p className="text-muted-foreground">
            Manage customer enquiries and convert them to quotes
          </p>
        </div>
        <Button onClick={() => setShowEnquiryModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          First Enquiry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search enquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="QUOTED">Quoted</SelectItem>
            <SelectItem value="WON">Won</SelectItem>
            <SelectItem value="LOST">Lost</SelectItem>
            <SelectItem value="ON_HOLD">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {Object.entries(statusColors).map(([status, color]) => {
          const count = enquiries.filter(e => e.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${color}`}></div>
                  <div>
                    <p className="text-sm font-medium">{status}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enquiries Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEnquiries.map((enquiry) => (
          <EnquiryCard key={enquiry.id} enquiry={enquiry} />
        ))}
      </div>

      {filteredEnquiries.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No enquiries found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first enquiry to get started'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      <FirstEnquiryModal
        open={showEnquiryModal}
        onOpenChange={setShowEnquiryModal}
        onEnquiryCreated={fetchEnquiries}
      />
      
      <QuickQuoteModal
        open={showQuoteModal}
        onOpenChange={setShowQuoteModal}
        onSuccess={fetchEnquiries}
        enquiry={selectedEnquiry}
      />

      {/* Enquiry Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Enquiry Details - {detailsEnquiry?.enquiryNumber}</span>
            </DialogTitle>
            <DialogDescription>
              Complete enquiry information and history
            </DialogDescription>
          </DialogHeader>
          
          {detailsEnquiry && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Customer Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Customer:</span>
                      <p className="text-sm">{detailsEnquiry.customerName}</p>
                    </div>
                    {detailsEnquiry.contactName && (
                      <div>
                        <span className="text-sm font-medium">Contact:</span>
                        <p className="text-sm">{detailsEnquiry.contactName}</p>
                      </div>
                    )}
                    {detailsEnquiry.company && (
                      <div>
                        <span className="text-sm font-medium">Company:</span>
                        <p className="text-sm">{detailsEnquiry.company}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Contact Details</h4>
                  <div className="space-y-2">
                    {detailsEnquiry.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{detailsEnquiry.email}</span>
                      </div>
                    )}
                    {detailsEnquiry.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{detailsEnquiry.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Project Information</h4>
                <div className="space-y-2">
                  {detailsEnquiry.projectName && (
                    <div>
                      <span className="text-sm font-medium">Project Name:</span>
                      <p className="text-sm">{detailsEnquiry.projectName}</p>
                    </div>
                  )}
                  {detailsEnquiry.description && (
                    <div>
                      <span className="text-sm font-medium">Description:</span>
                      <p className="text-sm">{detailsEnquiry.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Metadata */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium">Status:</span>
                  <div className="mt-1">
                    <Badge className={`${statusColors[detailsEnquiry.status]} text-white`}>
                      {detailsEnquiry.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Priority:</span>
                  <div className="mt-1">
                    <Badge variant="outline">{detailsEnquiry.priority}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Source:</span>
                  <div className="mt-1">
                    <Badge variant="secondary">{detailsEnquiry.source}</Badge>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Timeline</h4>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created: {formatDate(detailsEnquiry.createdAt)}</span>
                </div>
              </div>

              {/* Quotes */}
              {detailsEnquiry.quotes && detailsEnquiry.quotes.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Related Quotes</h4>
                  <div className="space-y-2">
                    {detailsEnquiry.quotes.map((quote: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">Quote #{quote.quoteNumber || `${index + 1}`}</span>
                        <Badge variant="outline">{quote.status || 'PENDING'}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                {(detailsEnquiry.status === 'NEW' || detailsEnquiry.status === 'CONTACTED') && (
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleCreateQuote(detailsEnquiry);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Create Quote
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}