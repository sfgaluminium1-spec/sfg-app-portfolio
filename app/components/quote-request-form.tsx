
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

const projectTypes = [
  { value: 'windows', label: 'Aluminium Windows' },
  { value: 'doors', label: 'Aluminium Doors' },
  { value: 'railings', label: 'Railings & Balustrades' },
  { value: 'curtain-walls', label: 'Curtain Wall Systems' },
  { value: 'roofing', label: 'Roofing Systems' },
  { value: 'custom', label: 'Custom Solutions' }
]

const budgetRanges = [
  { value: 'under-5k', label: 'Under £5,000' },
  { value: '5k-15k', label: '£5,000 - £15,000' },
  { value: '15k-50k', label: '£15,000 - £50,000' },
  { value: '50k-100k', label: '£50,000 - £100,000' },
  { value: 'over-100k', label: 'Over £100,000' }
]

const timelines = [
  { value: 'urgent', label: 'ASAP (Rush Job)' },
  { value: '1-month', label: 'Within 1 Month' },
  { value: '1-3-months', label: '1-3 Months' },
  { value: '3-6-months', label: '3-6 Months' },
  { value: 'flexible', label: 'Flexible Timeline' }
]

export default function QuoteRequestForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    projectDetails: '',
    budget: '',
    timeline: '',
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
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Quote Request Submitted!",
          description: "We'll prepare your quote and get back to you within 2 business days.",
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          projectDetails: '',
          budget: '',
          timeline: '',
          address: ''
        })
      } else {
        throw new Error('Failed to submit quote request')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div>
          <Input
            name="company"
            placeholder="Company (optional)"
            value={formData.company}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div>
        <Select
          value={formData.projectType}
          onValueChange={(value) => handleSelectChange('projectType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Project Type *" />
          </SelectTrigger>
          <SelectContent>
            {projectTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Textarea
          name="projectDetails"
          placeholder="Project Details (dimensions, specifications, special requirements) *"
          value={formData.projectDetails}
          onChange={handleChange}
          required
          className="form-input min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select
            value={formData.budget}
            onValueChange={(value) => handleSelectChange('budget', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Budget Range" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={formData.timeline}
            onValueChange={(value) => handleSelectChange('timeline', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Timeline" />
            </SelectTrigger>
            <SelectContent>
              {timelines.map((timeline) => (
                <SelectItem key={timeline.value} value={timeline.value}>
                  {timeline.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Input
          name="address"
          placeholder="Project Address"
          value={formData.address}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isLoading || !formData.projectType}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Request Quote
      </Button>
    </form>
  )
}
