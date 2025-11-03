
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Edit, Phone, Mail, MessageSquare, CheckCircle, XCircle, Building2, UserCheck, RefreshCw, FileText, QrCode, Link, Send, Eye, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface EnhancedCustomerContactManagementProps {
  customerId: string;
}

interface CustomerContact {
  id: string;
  contactName: string;
  role: string;
  email?: string;
  phone?: string;
  mobile?: string;
  officePhone?: string;
  preferredContactMethod: string;
  whatsappEnabled: boolean;
  whatsappNumber?: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  department?: string;
  jobTitle?: string;
  authority?: string;
  availability?: string;
  dataSource: string;
  isValidated: boolean;
  validatedAt?: string;
  lastContactedAt?: string;
}

interface CustomerForm {
  id: string;
  formName: string;
  formType: string;
  description?: string;
  formUrl: string;
  qrCodeUrl?: string;
  isActive: boolean;
  expiresAt?: string;
  viewCount: number;
  submissionCount: number;
  conversionRate?: number;
}

export default function EnhancedCustomerContactManagement({ customerId }: EnhancedCustomerContactManagementProps) {
  const [contacts, setContacts] = useState<CustomerContact[]>([]);
  const [forms, setForms] = useState<CustomerForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contacts');

  // Contact management states
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<CustomerContact | null>(null);
  const [contactData, setContactData] = useState<Partial<CustomerContact>>({});

  // Form management states
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Validation states
  const [validatingContact, setValidatingContact] = useState<string | null>(null);

  useEffect(() => {
    fetchContactData();
  }, [customerId]);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const [contactsResponse, formsResponse] = await Promise.all([
        fetch(`/api/customer-contact-management?customerId=${customerId}`),
        fetch(`/api/customer-forms?customerId=${customerId}`)
      ]);

      const contactsData = await contactsResponse.json();
      const formsData = await formsResponse.json();

      if (contactsData.success) {
        setContacts(contactsData.contacts || []);
      }
      if (formsData.success) {
        setForms(formsData.forms || []);
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
      toast.error('Failed to load contact data');
    } finally {
      setLoading(false);
    }
  };

  const saveContact = async () => {
    try {
      const action = editingContact ? 'update_contact' : 'create_contact';
      const response = await fetch('/api/customer-contact-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          customerId,
          contactData: {
            ...contactData,
            id: editingContact?.id
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(editingContact ? 'Contact updated' : 'Contact created');
        await fetchContactData();
        setShowContactModal(false);
        setEditingContact(null);
        setContactData({});
      } else {
        toast.error(result.error || 'Failed to save contact');
      }
    } catch (error) {
      console.error('Save contact error:', error);
      toast.error('Failed to save contact');
    }
  };

  const validateContact = async (contactId: string, validationType: string) => {
    try {
      setValidatingContact(contactId);
      const response = await fetch('/api/customer-contact-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'validate_contact',
          contactData: {
            id: contactId,
            validationType
          }
        })
      });

      const result = await response.json();
      if (result.success && result.validation.valid) {
        toast.success(`${validationType} validation successful`);
        await fetchContactData();
      } else {
        toast.error(result.validation.message || 'Validation failed');
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to validate contact');
    } finally {
      setValidatingContact(null);
    }
  };

  const syncXeroContacts = async () => {
    try {
      const response = await fetch('/api/customer-contact-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'sync_xero_contacts',
          customerId
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Synced ${result.syncedContacts.length} contacts from Xero`);
        await fetchContactData();
      } else {
        toast.error('Failed to sync Xero contacts');
      }
    } catch (error) {
      console.error('Xero sync error:', error);
      toast.error('Failed to sync Xero contacts');
    }
  };

  const createCustomerForm = async () => {
    try {
      const response = await fetch('/api/customer-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create_form',
          formData: {
            ...formData,
            customerId
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Customer form created');
        await fetchContactData();
        setShowFormModal(false);
        setFormData({});
      } else {
        toast.error('Failed to create form');
      }
    } catch (error) {
      console.error('Form creation error:', error);
      toast.error('Failed to create form');
    }
  };

  const sendFormLink = async (form: CustomerForm, method: string) => {
    try {
      const response = await fetch('/api/customer-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'send_form_link',
          formId: form.id,
          method,
          customerId
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Form link sent via ${method}`);
      } else {
        toast.error('Failed to send form link');
      }
    } catch (error) {
      console.error('Send form link error:', error);
      toast.error('Failed to send form link');
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
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <Users className="h-6 w-6 mr-3 text-blue-600" />
            Enhanced Customer Contact Management
          </h2>
          <p className="text-muted-foreground">
            Manage customer contacts beyond Xero integration with digital form collection
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={syncXeroContacts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Xero Contacts
          </Button>
          <Button onClick={() => setShowContactModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Enhanced Contact Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="forms">Digital Forms</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <ContactsTab
            contacts={contacts}
            onEditContact={(contact: any) => {
              setEditingContact(contact);
              setContactData(contact);
              setShowContactModal(true);
            }}
            onValidateContact={validateContact}
            validatingContact={validatingContact}
          />
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <DigitalFormsTab
            forms={forms}
            onCreateForm={() => setShowFormModal(true)}
            onSendFormLink={sendFormLink}
          />
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <ValidationTab contacts={contacts} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab contacts={contacts} forms={forms} />
        </TabsContent>
      </Tabs>

      {/* Contact Creation/Edit Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </DialogTitle>
            <DialogDescription>
              {editingContact ? 'Update contact information' : 'Add a new contact beyond Xero integration'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Contact Name *</label>
                <Input
                  value={contactData.contactName || ''}
                  onChange={(e) => setContactData({ ...contactData, contactName: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Role *</label>
                <Select
                  value={contactData.role || ''}
                  onValueChange={(value) => setContactData({ ...contactData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIMARY_CONTACT">Primary Contact</SelectItem>
                    <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                    <SelectItem value="PURCHASING_MANAGER">Purchasing Manager</SelectItem>
                    <SelectItem value="FINANCE_CONTACT">Finance Contact</SelectItem>
                    <SelectItem value="TECHNICAL_CONTACT">Technical Contact</SelectItem>
                    <SelectItem value="SITE_MANAGER">Site Manager</SelectItem>
                    <SelectItem value="EMERGENCY_CONTACT">Emergency Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  value={contactData.email || ''}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input
                  value={contactData.phone || ''}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="+44 20 1234 5678"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mobile</label>
                <Input
                  value={contactData.mobile || ''}
                  onChange={(e) => setContactData({ ...contactData, mobile: e.target.value })}
                  placeholder="+44 7123 456789"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Office Phone</label>
                <Input
                  value={contactData.officePhone || ''}
                  onChange={(e) => setContactData({ ...contactData, officePhone: e.target.value })}
                  placeholder="+44 20 1234 5679"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Input
                  value={contactData.department || ''}
                  onChange={(e) => setContactData({ ...contactData, department: e.target.value })}
                  placeholder="Engineering, Procurement, etc."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Job Title</label>
                <Input
                  value={contactData.jobTitle || ''}
                  onChange={(e) => setContactData({ ...contactData, jobTitle: e.target.value })}
                  placeholder="Senior Engineer, etc."
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Authority/Decision Making</label>
              <Textarea
                value={contactData.authority || ''}
                onChange={(e) => setContactData({ ...contactData, authority: e.target.value })}
                placeholder="What they can approve/decide on..."
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Availability</label>
              <Input
                value={contactData.availability || ''}
                onChange={(e) => setContactData({ ...contactData, availability: e.target.value })}
                placeholder="Working hours, timezone, etc."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Contact Method</label>
              <Select
                value={contactData.preferredContactMethod || 'EMAIL'}
                onValueChange={(value) => setContactData({ ...contactData, preferredContactMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="PHONE">Phone</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Communication Preferences</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={contactData.whatsappEnabled || false}
                    onChange={(e) => setContactData({ ...contactData, whatsappEnabled: e.target.checked })}
                  />
                  <span className="text-sm">WhatsApp enabled</span>
                </label>
                {contactData.whatsappEnabled && (
                  <Input
                    value={contactData.whatsappNumber || ''}
                    onChange={(e) => setContactData({ ...contactData, whatsappNumber: e.target.value })}
                    placeholder="WhatsApp number (+44 7123 456789)"
                    className="ml-6"
                  />
                )}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={contactData.emailNotifications !== false}
                    onChange={(e) => setContactData({ ...contactData, emailNotifications: e.target.checked })}
                  />
                  <span className="text-sm">Email notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={contactData.smsNotifications || false}
                    onChange={(e) => setContactData({ ...contactData, smsNotifications: e.target.checked })}
                  />
                  <span className="text-sm">SMS notifications</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveContact} 
              disabled={!contactData.contactName || !contactData.role}
            >
              {editingContact ? 'Update Contact' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Digital Form Creation Modal */}
      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Create Digital Form
            </DialogTitle>
            <DialogDescription>
              Create a digital form for customer data collection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Form Name *</label>
              <Input
                value={formData.formName || ''}
                onChange={(e) => setFormData({ ...formData, formName: e.target.value })}
                placeholder="Customer Information Form"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Form Type</label>
              <Select
                value={formData.formType || ''}
                onValueChange={(value) => setFormData({ ...formData, formType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select form type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW_CUSTOMER">New Customer Information</SelectItem>
                  <SelectItem value="PROJECT_INFO">Project Information</SelectItem>
                  <SelectItem value="CONTACT_UPDATE">Contact Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Form description and purpose..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Collection Methods</label>
              <div className="space-y-2">
                {['EMAIL_LINK', 'QR_CODE', 'PORTAL_REGISTRATION', 'DIRECT_SUBMISSION'].map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.collectionMethods?.includes(method) || false}
                      onChange={(e) => {
                        const methods = formData.collectionMethods || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, collectionMethods: [...methods, method] });
                        } else {
                          setFormData({ ...formData, collectionMethods: methods.filter((m: string) => m !== method) });
                        }
                      }}
                    />
                    <span className="text-sm">{method.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Expiration (Optional)</label>
              <Input
                type="datetime-local"
                value={formData.expiresAt || ''}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFormModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={createCustomerForm} 
              disabled={!formData.formName || !formData.formType}
            >
              Create Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-components
function ContactsTab({ contacts, onEditContact, onValidateContact, validatingContact }: any) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact: CustomerContact) => (
          <div className="bg-white" key={contact.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{contact.contactName}</CardTitle>
                    <CardDescription>{contact.role.replace('_', ' ')}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant={contact.isValidated ? 'default' : 'secondary'}>
                      {contact.isValidated ? 'Validated' : 'Unvalidated'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {contact.dataSource.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {contact.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-green-600" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.whatsappEnabled && (
                    <div className="flex items-center text-sm">
                      <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                      <span>WhatsApp enabled</span>
                    </div>
                  )}
                  {contact.department && (
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 mr-2 text-purple-600" />
                      <span>{contact.department}</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditContact(contact)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {!contact.isValidated && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onValidateContact(contact.id, 'email')}
                      disabled={validatingContact === contact.id}
                      className="flex-1"
                    >
                      {validatingContact === contact.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <UserCheck className="h-4 w-4 mr-1" />
                      )}
                      Validate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      {contacts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No contacts found</h3>
            <p className="text-muted-foreground">Add contacts to enhance customer communication</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DigitalFormsTab({ forms, onCreateForm, onSendFormLink }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Customer Data Collection Forms</h3>
        <Button onClick={onCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {forms.map((form: CustomerForm) => (
          <Card key={form.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{form.formName}</CardTitle>
                  <CardDescription>{form.formType.replace('_', ' ')}</CardDescription>
                </div>
                <Badge variant={form.isActive ? 'default' : 'secondary'}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.description && (
                <p className="text-sm text-muted-foreground">{form.description}</p>
              )}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{form.viewCount}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{form.submissionCount}</div>
                  <div className="text-xs text-muted-foreground">Submissions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {form.conversionRate ? `${form.conversionRate}%` : '0%'}
                  </div>
                  <div className="text-xs text-muted-foreground">Conversion</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Form URL:</span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(form.formUrl)}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {form.qrCodeUrl && (
                  <div className="flex items-center justify-between text-sm">
                    <span>QR Code:</span>
                    <Button variant="ghost" size="sm">
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSendFormLink(form, 'EMAIL')}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSendFormLink(form, 'WHATSAPP')}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSendFormLink(form, 'SMS')}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-1" />
                  SMS
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {forms.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No forms created yet</h3>
            <p className="text-muted-foreground">Create digital forms for enhanced customer data collection</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ValidationTab({ contacts }: any) {
  const unvalidatedContacts = contacts.filter((c: CustomerContact) => !c.isValidated);
  const validatedContacts = contacts.filter((c: CustomerContact) => c.isValidated);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
              Requires Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-orange-600">{unvalidatedContacts.length}</div>
              <div className="text-sm text-muted-foreground">Unvalidated contacts</div>
            </div>
            {unvalidatedContacts.slice(0, 3).map((contact: CustomerContact) => (
              <div key={contact.id} className="flex items-center justify-between p-2 border rounded mb-2">
                <div>
                  <div className="font-medium text-sm">{contact.contactName}</div>
                  <div className="text-xs text-muted-foreground">{contact.role}</div>
                </div>
                <Button size="sm" variant="outline">
                  Validate
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Validated Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600">{validatedContacts.length}</div>
              <div className="text-sm text-muted-foreground">Validated contacts</div>
            </div>
            {validatedContacts.slice(0, 3).map((contact: CustomerContact) => (
              <div key={contact.id} className="flex items-center justify-between p-2 border rounded mb-2">
                <div>
                  <div className="font-medium text-sm">{contact.contactName}</div>
                  <div className="text-xs text-muted-foreground">{contact.role}</div>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsTab({ contacts, forms }: any) {
  const totalContacts = contacts.length;
  const validatedContacts = contacts.filter((c: CustomerContact) => c.isValidated).length;
  const whatsappEnabledContacts = contacts.filter((c: CustomerContact) => c.whatsappEnabled).length;
  const totalFormViews = forms.reduce((sum: number, form: CustomerForm) => sum + form.viewCount, 0);
  const totalSubmissions = forms.reduce((sum: number, form: CustomerForm) => sum + form.submissionCount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalContacts}</div>
              <div className="text-sm text-muted-foreground">Total Contacts</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{validatedContacts}</div>
              <div className="text-sm text-muted-foreground">Validated</div>
              <div className="text-xs text-muted-foreground">
                {totalContacts > 0 ? Math.round((validatedContacts / totalContacts) * 100) : 0}% validated
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{whatsappEnabledContacts}</div>
              <div className="text-sm text-muted-foreground">WhatsApp Enabled</div>
              <div className="text-xs text-muted-foreground">
                {totalContacts > 0 ? Math.round((whatsappEnabledContacts / totalContacts) * 100) : 0}% enabled
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{forms.length}</div>
              <div className="text-sm text-muted-foreground">Digital Forms</div>
              <div className="text-xs text-muted-foreground">
                {totalFormViews} total views
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
