'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertTriangle, FileText, DollarSign, Package, Wrench, Shield, Calculator, Eye, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface QuoteValidation {
  id: string;
  quoteId: string;
  productCountCheck: boolean;
  productCountValid: boolean;
  productCountNotes?: string;
  priceValidationCheck: boolean;
  priceValidationValid: boolean;
  priceValidationNotes?: string;
  installationPriceCheck: boolean;
  installationPriceValid: boolean;
  installationPriceNotes?: string;
  quoteTypeValidation: boolean;
  quoteTypeValid: boolean;
  quoteTypeNotes?: string;
  markupValidation: boolean;
  markupValid: boolean;
  markupNotes?: string;
  allChecksComplete: boolean;
  validationPassed: boolean;
  validatedBy?: string;
  validatedAt?: string;
  quote: {
    id: string;
    quoteNumber: string;
    customerName: string;
    quoteType: string;
    quoteTypeEnum: string;
    value: number;
    baseValue?: number;
    markup?: number;
    markupAmount?: number;
    lineItems: Array<{
      id: string;
      product: string;
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
  };
}

interface QuoteValidationProps {
  quoteId: string;
  currentUser?: string;
  onValidationComplete?: () => void;
}

export default function QuoteValidation({ 
  quoteId, 
  currentUser = 'Warren Smith', 
  onValidationComplete 
}: QuoteValidationProps) {
  const [validation, setValidation] = useState<QuoteValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeValidation, setActiveValidation] = useState<string | null>(null);
  const [validationNotes, setValidationNotes] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    fetchValidation();
  }, [quoteId]);

  const fetchValidation = async () => {
    try {
      const response = await fetch(`/api/quote-validation?quoteId=${quoteId}`);
      const data = await response.json();
      setValidation(data);
    } catch (error) {
      console.error('Error fetching validation:', error);
      toast.error('Failed to fetch validation data');
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (validationType: string, valid: boolean, notes: string) => {
    try {
      const response = await fetch('/api/quote-validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId,
          validationType,
          isValid: valid,
          notes,
          validatedBy: currentUser
        }),
      });

      if (response.ok) {
        toast.success(`${validationType.replace('_', ' ')} validation ${valid ? 'passed' : 'failed'}`);
        setActiveValidation(null);
        setValidationNotes('');
        setIsValid(false);
        fetchValidation();
        onValidationComplete?.();
      } else {
        toast.error('Failed to update validation');
      }
    } catch (error) {
      console.error('Error updating validation:', error);
      toast.error('Failed to update validation');
    }
  };

  const getValidationIcon = (checked: boolean, valid: boolean) => {
    if (!checked) return AlertTriangle;
    return valid ? CheckCircle : XCircle;
  };

  const getValidationColor = (checked: boolean, valid: boolean) => {
    if (!checked) return 'text-orange-500';
    return valid ? 'text-green-500' : 'text-red-500';
  };

  const getValidationBadge = (checked: boolean, valid: boolean) => {
    if (!checked) return { variant: 'warning' as const, text: 'Pending' };
    return valid ? { variant: 'success' as const, text: 'Passed' } : { variant: 'destructive' as const, text: 'Failed' };
  };

  const ValidationItem = ({ 
    type, 
    title, 
    description, 
    icon: Icon, 
    checked, 
    valid, 
    notes, 
    required = true 
  }: {
    type: string;
    title: string;
    description: string;
    icon: any;
    checked: boolean;
    valid: boolean;
    notes?: string;
    required?: boolean;
  }) => {
    const ValidationIcon = getValidationIcon(checked, valid);
    const badge = getValidationBadge(checked, valid);

    return (
      <Card className={`hover:shadow-lg transition-shadow duration-300 ${
        !checked ? 'border-orange-200 bg-orange-50' : 
        valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {required && (
                <Badge variant="outline" className="text-xs">Required</Badge>
              )}
              <Badge variant={badge.variant}>{badge.text}</Badge>
              <ValidationIcon className={`h-5 w-5 ${getValidationColor(checked, valid)}`} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Validation Details */}
          {type === 'product_count' && validation?.quote.lineItems && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium mb-2">Product Count Analysis</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Line Items:</span>
                  <span className="ml-2 font-medium">{validation.quote.lineItems.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Quantity:</span>
                  <span className="ml-2 font-medium">
                    {validation.quote.lineItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {type === 'price_validation' && validation?.quote && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium mb-2">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                {validation.quote.baseValue && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Value:</span>
                    <span className="font-medium">£{validation.quote.baseValue.toLocaleString()}</span>
                  </div>
                )}
                {validation.quote.markup && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Markup ({validation.quote.markup}%):</span>
                    <span className="font-medium">£{validation.quote.markupAmount?.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Final Value:</span>
                  <span>£{validation.quote.value.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {type === 'installation_pricing' && validation?.quote.quoteTypeEnum === 'SUPPLY_AND_INSTALL' && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium mb-2">Installation Risk Assessment</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quote Type:</span>
                  <Badge variant="warning">{validation.quote.quoteType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Warranty Risk:</span>
                  <Badge variant="destructive">High</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Callback Risk:</span>
                  <Badge variant="destructive">High</Badge>
                </div>
              </div>
            </div>
          )}

          {type === 'quote_type' && validation?.quote && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium mb-2">Quote Type Validation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selected Type:</span>
                  <Badge variant="outline">{validation.quote.quoteType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge variant={validation.quote.quoteTypeEnum === 'SUPPLY_ONLY' ? 'success' : 'warning'}>
                    {validation.quote.quoteTypeEnum === 'SUPPLY_ONLY' ? 'Low' : 'High'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {type === 'markup' && validation?.quote && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium mb-2">Markup Validation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applied Markup:</span>
                  <span className="font-medium">{validation.quote.markup?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum Required:</span>
                  <span className="font-medium">
                    {validation.quote.quoteTypeEnum === 'SUPPLY_ONLY' ? '3.0%' : '12.0%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={
                    (validation.quote.markup || 0) >= (validation.quote.quoteTypeEnum === 'SUPPLY_ONLY' ? 3.0 : 12.0) 
                      ? 'success' : 'destructive'
                  }>
                    {(validation.quote.markup || 0) >= (validation.quote.quoteTypeEnum === 'SUPPLY_ONLY' ? 3.0 : 12.0) 
                      ? 'Compliant' : 'Below Minimum'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Previous Validation Notes */}
          {notes && (
            <div className="bg-muted p-3 rounded">
              <h4 className="font-medium mb-2">Previous Validation Notes</h4>
              <p className="text-sm">{notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          {!checked && (
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveValidation(type)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Validate
              </Button>
            </div>
          )}

          {checked && (
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveValidation(type)}
                className="flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Re-validate
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!validation) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Validation data not found</h3>
          <p className="text-muted-foreground">Unable to load validation data for this quote.</p>
        </CardContent>
      </Card>
    );
  }

  const requiresInstallationValidation = validation.quote.quoteTypeEnum === 'SUPPLY_AND_INSTALL' || 
                                        validation.quote.quoteTypeEnum === 'LABOUR_ONLY';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <Shield className="h-6 w-6 mr-3 text-blue-600" />
            Quote Validation
          </h2>
          <p className="text-muted-foreground">
            Validate quote {validation.quote.quoteNumber} for {validation.quote.customerName}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={validation.allChecksComplete ? 'success' : 'warning'}>
            {validation.allChecksComplete ? 'All Checks Complete' : 'Validation Pending'}
          </Badge>
          {validation.allChecksComplete && (
            <Badge variant={validation.validationPassed ? 'success' : 'destructive'}>
              {validation.validationPassed ? 'Validation Passed' : 'Validation Failed'}
            </Badge>
          )}
        </div>
      </div>

      {/* Validation Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Validation Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                validation.productCountCheck
                  ? validation.productCountValid
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                <Package className="h-6 w-6" />
              </div>
              <p className="text-xs font-medium">Product Count</p>
            </div>

            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                validation.priceValidationCheck
                  ? validation.priceValidationValid
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                <DollarSign className="h-6 w-6" />
              </div>
              <p className="text-xs font-medium">Price Validation</p>
            </div>

            {requiresInstallationValidation && (
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  validation.installationPriceCheck
                    ? validation.installationPriceValid
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  <Wrench className="h-6 w-6" />
                </div>
                <p className="text-xs font-medium">Installation</p>
              </div>
            )}

            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                validation.quoteTypeValidation
                  ? validation.quoteTypeValid
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-xs font-medium">Quote Type</p>
            </div>

            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                validation.markupValidation
                  ? validation.markupValid
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                <Calculator className="h-6 w-6" />
              </div>
              <p className="text-xs font-medium">Markup</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Items */}
      <div className="grid gap-6 md:grid-cols-2">
        <ValidationItem
          type="product_count"
          title="Product Count Verification"
          description="Verify the number of products matches enquiry requirements"
          icon={Package}
          checked={validation.productCountCheck}
          valid={validation.productCountValid}
          notes={validation.productCountNotes}
        />

        <ValidationItem
          type="price_validation"
          title="Price Validation"
          description="Validate product prices and overall quote value"
          icon={DollarSign}
          checked={validation.priceValidationCheck}
          valid={validation.priceValidationValid}
          notes={validation.priceValidationNotes}
        />

        {requiresInstallationValidation && (
          <ValidationItem
            type="installation_pricing"
            title="Installation Price Check"
            description="Validate installation pricing and risk assessment"
            icon={Wrench}
            checked={validation.installationPriceCheck}
            valid={validation.installationPriceValid}
            notes={validation.installationPriceNotes}
          />
        )}

        <ValidationItem
          type="quote_type"
          title="Quote Type Validation"
          description="Ensure quote type matches requirements and risk profile"
          icon={FileText}
          checked={validation.quoteTypeValidation}
          valid={validation.quoteTypeValid}
          notes={validation.quoteTypeNotes}
        />

        <ValidationItem
          type="markup"
          title="Markup Validation"
          description="Verify markup meets minimum requirements for quote type"
          icon={Calculator}
          checked={validation.markupValidation}
          valid={validation.markupValid}
          notes={validation.markupNotes}
        />
      </div>

      {/* Validation Dialog */}
      {activeValidation && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Validate: {activeValidation.replace('_', ' ').toUpperCase()}
            </CardTitle>
            <CardDescription>
              Perform validation check and provide notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="validation-pass"
                  checked={isValid}
                  onCheckedChange={(checked) => setIsValid(checked as boolean)}
                />
                <label htmlFor="validation-pass" className="text-sm font-medium">
                  Validation Passed
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Validation Notes *</label>
              <Textarea
                value={validationNotes}
                onChange={(e) => setValidationNotes(e.target.value)}
                placeholder="Provide detailed notes about this validation check..."
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => handleValidation(activeValidation, isValid, validationNotes)}
                disabled={!validationNotes.trim()}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Validation
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveValidation(null);
                  setValidationNotes('');
                  setIsValid(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}