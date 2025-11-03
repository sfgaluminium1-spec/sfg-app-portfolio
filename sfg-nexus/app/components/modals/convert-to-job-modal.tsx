
'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Calendar, User, FileText, MapPin, Clock, Settings } from 'lucide-react';

interface ConvertToJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: any;
  onSuccess: () => void;
}

export default function ConvertToJobModal({ open, onOpenChange, quote, onSuccess }: ConvertToJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobNumber: '',
    scheduledStartDate: '',
    estimatedDuration: '',
    teamLeader: '',
    notes: '',
    priority: 'STANDARD',
    fabricationNotes: '',
    installationNotes: '',
    surveyRequired: false,
    schedulingNotes: ''
  });

  const generateJobNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SFG${year}${month}${random}`;
  };

  React.useEffect(() => {
    if (open && quote) {
      setFormData(prev => ({
        ...prev,
        jobNumber: generateJobNumber(),
        estimatedDuration: calculateEstimatedDuration(),
        scheduledStartDate: getNextAvailableDate()
      }));
    }
  }, [open, quote]);

  const calculateEstimatedDuration = () => {
    if (!quote?.quoteItems?.length) return '1';
    
    // Basic estimation based on quote items
    const itemCount = quote.quoteItems.length;
    const baseHours = Math.max(4, itemCount * 2); // Minimum 4 hours, 2 hours per item
    return baseHours.toString();
  };

  const getNextAvailableDate = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId: quote.id,
          ...formData,
          estimatedDuration: parseInt(formData.estimatedDuration),
          customerId: quote.customerId,
          description: quote.description || `Job converted from quote ${quote.quoteNumber}`
        }),
      });

      if (response.ok) {
        onSuccess();
        onOpenChange(false);
        setFormData({
          jobNumber: '',
          scheduledStartDate: '',
          estimatedDuration: '',
          teamLeader: '',
          notes: '',
          priority: 'STANDARD',
          fabricationNotes: '',
          installationNotes: '',
          surveyRequired: false,
          schedulingNotes: ''
        });
      } else {
        console.error('Failed to convert quote to job');
      }
    } catch (error) {
      console.error('Error converting quote to job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Convert Quote to Job - {quote.quoteNumber}
          </DialogTitle>
          <DialogDescription>
            Convert this approved quote into an active job with scheduling and production details
          </DialogDescription>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quote Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quote Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Quote Number</Label>
                    <p className="font-medium">{quote.quoteNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Customer</Label>
                    <p className="font-medium">
                      {quote.customer?.firstName} {quote.customer?.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Value</Label>
                    <p className="font-medium text-green-600">
                      £{quote.totalValue?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge variant="default">{quote.status}</Badge>
                  </div>
                </div>
                
                {quote.description && (
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="text-sm">{quote.description}</p>
                  </div>
                )}

                {quote.customer?.address && (
                  <div>
                    <Label className="text-muted-foreground">Site Address</Label>
                    <p className="text-sm flex items-start gap-1">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      {quote.customer.address}
                      {quote.customer.city && `, ${quote.customer.city}`}
                      {quote.customer.postcode && ` ${quote.customer.postcode}`}
                    </p>
                  </div>
                )}

                {quote.quoteItems?.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Quote Items</Label>
                    <div className="space-y-2 mt-2">
                      {quote.quoteItems.slice(0, 3).map((item: any, index: number) => (
                        <div key={index} className="text-sm p-2 bg-muted rounded">
                          <div className="flex justify-between">
                            <span>{item.description || item.productType}</span>
                            <span className="font-medium">£{item.unitPrice?.toLocaleString()}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Qty: {item.quantity} | Unit: £{(item.unitPrice || 0).toFixed(2)}
                          </div>
                        </div>
                      ))}
                      {quote.quoteItems.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{quote.quoteItems.length - 3} more items...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pre-Conversion Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Pre-Conversion Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Quote approved by customer</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Pricing validated and confirmed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span>Survey may be required for complex installations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span>Verify materials availability before scheduling</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Conversion Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jobNumber">Job Number</Label>
                    <Input
                      id="jobNumber"
                      value={formData.jobNumber}
                      onChange={(e) => setFormData({ ...formData, jobNumber: e.target.value })}
                      placeholder="Auto-generated"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="STANDARD">Standard</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledStartDate">Scheduled Start Date</Label>
                    <Input
                      id="scheduledStartDate"
                      type="date"
                      value={formData.scheduledStartDate}
                      onChange={(e) => setFormData({ ...formData, scheduledStartDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      min="1"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                      placeholder="Hours"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="teamLeader">Preferred Team Leader</Label>
                  <Select value={formData.teamLeader} onValueChange={(value) => setFormData({ ...formData, teamLeader: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team leader (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="mike-jones">Mike Jones</SelectItem>
                      <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                      <SelectItem value="david-brown">David Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="surveyRequired"
                    checked={formData.surveyRequired}
                    onChange={(e) => setFormData({ ...formData, surveyRequired: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="surveyRequired" className="text-sm">
                    Survey required before fabrication
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Production Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fabricationNotes">Fabrication Notes</Label>
                  <Textarea
                    id="fabricationNotes"
                    value={formData.fabricationNotes}
                    onChange={(e) => setFormData({ ...formData, fabricationNotes: e.target.value })}
                    placeholder="Special requirements for fabrication..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="installationNotes">Installation Notes</Label>
                  <Textarea
                    id="installationNotes"
                    value={formData.installationNotes}
                    onChange={(e) => setFormData({ ...formData, installationNotes: e.target.value })}
                    placeholder="Special requirements for installation..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="schedulingNotes">Scheduling Notes</Label>
                  <Textarea
                    id="schedulingNotes"
                    value={formData.schedulingNotes}
                    onChange={(e) => setFormData({ ...formData, schedulingNotes: e.target.value })}
                    placeholder="Access restrictions, customer preferences, etc..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

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
                Convert to Job
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
