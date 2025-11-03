
'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle, Mail, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function DataDeletionPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    reason: '',
    dataTypes: [] as string[]
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, this would send the deletion request
    console.log('Data deletion request:', formData)
    setIsSubmitted(true)
  }

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        dataTypes: [...prev.dataTypes, dataType]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        dataTypes: prev.dataTypes.filter(type => type !== dataType)
      }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-12 px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Request Submitted Successfully</CardTitle>
              <CardDescription>
                Your data deletion request has been received and will be processed within 30 days.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>What happens next?</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>We will verify your identity and employment status</li>
                    <li>Your request will be processed within 30 days as required by GDPR</li>
                    <li>You will receive confirmation once the deletion is complete</li>
                    <li>Some data may be retained for legal or regulatory compliance</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="text-center pt-4">
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                >
                  Submit Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Data Deletion Request</h1>
          <p className="text-lg text-muted-foreground">
            Request deletion of your personal data from ChronoShift Pro in compliance with GDPR and UK data protection laws.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Data Deletion Request Form
                </CardTitle>
                <CardDescription>
                  Complete this form to request deletion of your personal data from our systems.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                      placeholder="Enter your employee ID (if applicable)"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>What data would you like to delete? *</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { id: 'timesheet', label: 'Timesheet Records' },
                        { id: 'payroll', label: 'Payroll Information' },
                        { id: 'expenses', label: 'Expense Claims' },
                        { id: 'personal', label: 'Personal Details' },
                        { id: 'location', label: 'Location Data' },
                        { id: 'all', label: 'All Personal Data' }
                      ].map((dataType) => (
                        <div key={dataType.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={dataType.id}
                            className="rounded border-input"
                            onChange={(e) => handleDataTypeChange(dataType.id, e.target.checked)}
                          />
                          <Label htmlFor={dataType.id} className="text-sm font-normal cursor-pointer">
                            {dataType.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Deletion (Optional)</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Please provide any additional context for your deletion request..."
                      rows={3}
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important Information</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
                        <li>Some data may need to be retained for legal or regulatory compliance (e.g., payroll records for HMRC)</li>
                        <li>Deletion of certain data may affect your access to the system and services</li>
                        <li>This process is irreversible once completed</li>
                        <li>We will process your request within 30 days as required by GDPR</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full">
                    Submit Deletion Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Alternative Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  You can also request data deletion by emailing us directly:
                </p>
                <div className="space-y-2">
                  <p className="font-medium">Data Protection Officer</p>
                  <p className="text-sm text-muted-foreground">
                    <a href="mailto:Apps@sfg-innovations.com" className="text-primary hover:underline">
                      Apps@sfg-innovations.com
                    </a>
                  </p>
                  <div className="text-xs text-muted-foreground mt-4">
                    <p><strong>SFG Aluminium Ltd</strong></p>
                    <p>39 Clayton Lane South</p>
                    <p>Manchester, England, M12 5PG</p>
                    <p>United Kingdom</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Under GDPR and UK data protection laws, you have the right to:</p>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                  <li>Request deletion of your personal data</li>
                  <li>Access your data we hold</li>
                  <li>Correct inaccurate information</li>
                  <li>Restrict data processing</li>
                  <li>Data portability</li>
                  <li>Object to certain processing</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We will respond to your request within <strong>30 days</strong> as required by GDPR. 
                  Complex requests may take longer, but we will keep you informed of any delays.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
