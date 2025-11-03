
'use client';

import { useState } from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

interface FirstEnquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnquiryCreated?: () => void;
}

interface FormData {
  customerName: string;
  customer: string;
  project: string;
  location: string;
  productType: string;
  deliveryType: string;
  enqInitialCount: string;
  contactName: string;
  email: string;
  phone: string;
  company: string;
  description: string;
}

const PRODUCT_TYPES = [
  'Aluminium Windows',
  'Aluminium Doors',
  'Curtain Walling',
  'Shopfronts',
  'Balustrades',
  'Canopies',
  'Bespoke Fabrication',
  'Glass Supply Only',
  'Repairs & Maintenance'
];

const DELIVERY_TYPES = [
  { value: 'Supply&Install', label: 'Supply & Install' },
  { value: 'SupplyOnly', label: 'Supply Only' },
  { value: 'Collected', label: 'Collected' }
];

export default function FirstEnquiryModal({ open, onOpenChange, onEnquiryCreated }: FirstEnquiryModalProps) {
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customer: '',
    project: '',
    location: '',
    productType: '',
    deliveryType: 'Supply&Install',
    enqInitialCount: '',
    contactName: '',
    email: '',
    phone: '',
    company: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showRedAlert, setShowRedAlert] = useState(false);

  // Track which required fields are missing
  const requiredFields = ['customer', 'project', 'location', 'productType', 'deliveryType', 'enqInitialCount'];
  
  const checkMissingFields = () => {
    const missing: string[] = [];
    if (!formData.customer?.trim()) missing.push('Customer');
    if (!formData.project?.trim()) missing.push('Project');
    if (!formData.location?.trim()) missing.push('Location');
    if (!formData.productType) missing.push('ProductType');
    if (!formData.deliveryType) missing.push('DeliveryType');
    if (!formData.enqInitialCount || parseInt(formData.enqInitialCount) < 1) missing.push('ENQ_initial_count');
    
    setMissingFields(missing);
    setShowRedAlert(missing.length > 0);
    return missing;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Check for missing fields
    const missing = checkMissingFields();
    
    // Allow creation even with missing fields (they'll be marked as MISSING)
    setLoading(true);
    
    try {
      const response = await fetch('/api/enquiries/create-with-truth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          customerName: formData.customerName || formData.customer || 'MISSING'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create enquiry');
      }

      // Show success message
      if (result.truthFile?.redAlert) {
        alert(`⚠️ Enquiry created with MISSING fields: ${result.truthFile.validation.missingFields.join(', ')}\n\nBaseNumber: ${result.truthFile.baseNumber.fullNumber}\n\nPlease complete these fields to enable quote conversion.`);
      } else {
        alert(`✅ Enquiry created successfully!\n\nBaseNumber: ${result.truthFile.baseNumber.fullNumber}\nData Completeness: ${result.truthFile.completeness}%`);
      }

      onEnquiryCreated?.();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        customerName: '',
        customer: '',
        project: '',
        location: '',
        productType: '',
        deliveryType: 'Supply&Install',
        enqInitialCount: '',
        contactName: '',
        email: '',
        phone: '',
        company: '',
        description: ''
      });
      setMissingFields([]);
      setShowRedAlert(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Re-check missing fields on change
    setTimeout(checkMissingFields, 100);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg max-w-3xl w-full p-6 my-8">
        <h2 className="text-2xl font-bold mb-2">Create New Enquiry</h2>
        <p className="text-sm text-muted-foreground mb-4">
          SFG Truth File v1.2.3 - All fields marked with * are required for quote conversion
        </p>

        {/* Red Alert Banner */}
        {showRedAlert && missingFields.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">⚠️ Required Fields MISSING</h3>
                <p className="text-sm text-red-700 mt-1">
                  The following required fields are MISSING: <span className="font-semibold">{missingFields.join(', ')}</span>
                </p>
                <p className="text-xs text-red-600 mt-2">
                  NON-NEGOTIABLE: These fields must be completed before converting quote to order
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields Section */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50/50">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Required Fields (Truth File v1.2.3)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name *
                  {!formData.customer && <span className="text-red-500 ml-1">MISSING</span>}
                </label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) => handleChange('customer', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Name *
                  {!formData.project && <span className="text-red-500 ml-1">MISSING</span>}
                </label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => handleChange('project', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location *
                  {!formData.location && <span className="text-red-500 ml-1">MISSING</span>}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Site location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Type *
                  {!formData.productType && <span className="text-red-500 ml-1">MISSING</span>}
                </label>
                <select
                  value={formData.productType}
                  onChange={(e) => handleChange('productType', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select product type</option>
                  {PRODUCT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Delivery Type *
                  {!formData.deliveryType && <span className="text-red-500 ml-1">MISSING</span>}
                </label>
                <select
                  value={formData.deliveryType}
                  onChange={(e) => handleChange('deliveryType', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  {DELIVERY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Initial Product Count (ENQ) *
                  {(!formData.enqInitialCount || parseInt(formData.enqInitialCount) < 1) && (
                    <span className="text-red-500 ml-1">MISSING</span>
                  )}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.enqInitialCount}
                  onChange={(e) => handleChange('enqInitialCount', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Number of products"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Count only complete deliverables with their own price
                </p>
              </div>
            </div>
          </div>

          {/* Optional Contact Details */}
          <div>
            <h3 className="font-semibold mb-3">Contact Details (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact Name</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Brief description of the enquiry..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border rounded hover:bg-muted"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{loading ? 'Creating...' : 'Create Enquiry'}</span>
            </button>
          </div>

          {/* Info Box */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p className="font-semibold mb-1">SFG Truth File v1.2.3 Compliance:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>BaseNumber will be allocated automatically (YYYY-NNNN format)</li>
              <li>Canonical folder path will be generated in SharePoint</li>
              <li>Missing fields will be marked as "MISSING" and tracked</li>
              <li>Product count must be set for quote conversion</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
