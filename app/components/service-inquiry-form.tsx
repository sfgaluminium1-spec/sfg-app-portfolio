
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

const serviceTypes = [
  { value: 'installation', label: 'Professional Installation' },
  { value: 'maintenance', label: 'Maintenance Service' },
  { value: 'repair', label: 'Repair Service' },
  { value: 'consultation', label: 'Design Consultation' }
]

const productTypes = [
  { value: 'windows', label: 'Windows' },
  { value: 'doors', label: 'Doors' },
  { value: 'railings', label: 'Railings' },
  { value: 'curtain-walls', label: 'Curtain Walls' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'other', label: 'Other' }
]

const urgencyLevels = [
  { value: 'urgent', label: 'Urgent (24-48 hours)' },
  { value: 'normal', label: 'Normal (1-2 weeks)' },
  { value: 'low', label: 'Low Priority (Flexible)' }
]

export default function ServiceInquiryForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    productType: '',
    description: '',
    urgency: 'normal',
    preferredDate: '',
    address: ''
  })

  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Service Request Submitted!",
          description: "Our service team will contact you within 24 hours to schedule.",
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceType: '',
          productType: '',
          description: '',
          urgency: 'normal',
          preferredDate: '',
          address: ''
        })
      } else {
        throw new Error('Failed to submit service request')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit service request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            name="name"
            placeholder="Your Name *"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div>
          <Input
            name="email"
            type="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
      </div>

      <div>
        <Input
          name="phone"
          type="tel"
          placeholder="Phone Number *"
          value={formData.phone}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select
            value={formData.serviceType}
            onValueChange={(value) => handleSelectChange('serviceType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Service Type *" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={formData.productType}
            onValueChange={(value) => handleSelectChange('productType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Product Type" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Textarea
          name="description"
          placeholder="Describe your service requirements *"
          value={formData.description}
          onChange={handleChange}
          required
          className="form-input min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select
            value={formData.urgency}
            onValueChange={(value) => handleSelectChange('urgency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Urgency Level" />
            </SelectTrigger>
            <SelectContent>
              {urgencyLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input
            name="preferredDate"
            type="date"
            placeholder="Preferred Date"
            value={formData.preferredDate}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div>
        <Input
          name="address"
          placeholder="Service Address"
          value={formData.address}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={isLoading || !formData.serviceType}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Service Request
      </Button>
    </form>
  )
}
