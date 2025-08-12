
import Header from '@/components/header'
import Footer from '@/components/footer'
import ContactForm from '@/components/contact-form'
import QuoteRequestForm from '@/components/quote-request-form'
import ServiceInquiryForm from '@/components/service-inquiry-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Calculator,
  Settings
} from 'lucide-react'

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+44 (0)20 7123 4567', '+44 (0)20 7123 4568 (Emergency)'],
    description: 'Speak directly with our team'
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@sfgaluminium.co.uk', 'quotes@sfgaluminium.co.uk'],
    description: 'Send us your requirements'
  },
  {
    icon: MapPin,
    title: 'Location',
    details: ['Industrial Estate', 'London, UK'],
    description: 'Visit our facility'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Mon-Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM'],
    description: '24/7 emergency support'
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Ready to start your aluminium project? Contact our experts for personalized advice, 
            competitive quotes, and exceptional service.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info) => (
              <Card key={info.title} className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <info.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                  <CardDescription className="text-gray-500">
                    {info.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {info.details.map((detail, index) => (
                      <p key={index} className="text-gray-700 font-medium">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Forms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Can We Help You?
            </h2>
            <p className="text-lg text-gray-600">
              Choose the option that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* General Contact */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">General Inquiry</CardTitle>
                <CardDescription>
                  Questions about our products or services? Get in touch with our team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>

            {/* Quote Request */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Request Quote</CardTitle>
                <CardDescription>
                  Need pricing for a specific project? Tell us your requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuoteRequestForm />
              </CardContent>
            </Card>

            {/* Service Request */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Service Request</CardTitle>
                <CardDescription>
                  Need installation, maintenance, or repair services? Schedule here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceInquiryForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Facility</h2>
            <p className="text-lg text-gray-600">
              See our manufacturing capabilities and meet our team in person
            </p>
          </div>
          
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Interactive Map</p>
              <p className="text-gray-500">Industrial Estate, London, UK</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
