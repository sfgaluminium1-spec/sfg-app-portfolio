
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import VersionBadge from '@/components/version-badge'
import { 
  Wrench, 
  Truck, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  Settings,
  HardHat,
  FileText,
  Phone
} from 'lucide-react'

const services = [
  {
    icon: HardHat,
    title: 'Professional Installation',
    description: 'Expert installation teams ensuring perfect fit and long-lasting performance.',
    image: 'https://elevatedsteel.com/wp-content/uploads/2024/02/Erection-1024x768.jpg',
    features: [
      'Certified installation teams',
      'Project management included',
      'Building compliance checks',
      'Quality assurance testing',
      'Clean-up and disposal',
      '2-year installation warranty'
    ],
    process: [
      'Site survey and measurement',
      'Installation planning',
      'Professional fitting',
      'Quality inspection',
      'Customer handover'
    ]
  },
  {
    icon: Settings,
    title: 'Maintenance Services',
    description: 'Comprehensive maintenance programs to keep your aluminium systems performing optimally.',
    image: 'https://mavericksteelbuildings.com/wp-content/uploads/2022/08/Stair-South-3-Casey-McDonough-1024x615.jpg',
    features: [
      'Scheduled maintenance visits',
      'Performance diagnostics',
      'Preventive repairs',
      'Component replacement',
      'Seal and gasket renewal',
      'Extended warranty options'
    ],
    process: [
      'System assessment',
      'Maintenance scheduling',
      'Regular inspections',
      'Repairs and adjustments',
      'Performance reports'
    ]
  },
  {
    icon: Wrench,
    title: 'Repair Services',
    description: 'Fast and reliable repair services for all types of aluminium systems.',
    image: 'https://www.reynaers.com/sites/default/files/public/inriver/images/79597_REYN-5139.jpg',
    features: [
      '24/7 emergency response',
      'Damage assessment',
      'Insurance work specialist',
      'Original parts guarantee',
      'Weatherproofing repairs',
      'Cost-effective solutions'
    ],
    process: [
      'Emergency call-out',
      'Damage evaluation',
      'Repair quotation',
      'Parts ordering',
      'Professional repair'
    ]
  },
  {
    icon: FileText,
    title: 'Design & Consultation',
    description: 'Expert design services and technical consultation for your project requirements.',
    image: 'https://www.finishfacades.co.uk/wp-content/uploads/2024/11/shutterstock_2467913365-scaled.jpg',
    features: [
      'CAD design services',
      'Structural calculations',
      'Building regulation advice',
      'Energy efficiency analysis',
      'Cost optimization',
      'Project visualization'
    ],
    process: [
      'Initial consultation',
      'Site analysis',
      'Design development',
      'Technical specifications',
      'Final recommendations'
    ]
  }
]

const whyChooseUs = [
  {
    icon: Users,
    title: 'Expert Team',
    description: '25+ years of combined experience in aluminium systems installation and service.'
  },
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Comprehensive insurance coverage for all our work, giving you complete peace of mind.'
  },
  {
    icon: Clock,
    title: 'Reliable Service',
    description: 'On-time service delivery with transparent communication throughout the project.'
  },
  {
    icon: Truck,
    title: 'UK-Wide Coverage',
    description: 'Serving customers across the UK with local teams and nationwide logistics.'
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 to-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Professional Aluminium Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From installation to maintenance, our expert team provides comprehensive services 
            to ensure your aluminium systems perform at their best.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div key={service.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{service.title}</h2>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                      <div className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Process</h3>
                      <div className="space-y-2">
                        {service.process.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">{stepIndex + 1}</span>
                            </div>
                            <span className="text-gray-700 text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/contact">Request Service</Link>
                  </Button>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine expertise, reliability, and exceptional customer service to deliver outstanding results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason) => (
              <Card key={reason.title} className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <reason.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {reason.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PPM Services */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pre-Planned Maintenance (PPM) Services
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Scheduled maintenance programs to keep your aluminium systems performing optimally. Professional planned maintenance services designed to prevent issues before they occur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Schedule PPM Service
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/contact">
                Get PPM Quote
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <VersionBadge position="fixed" variant="default" />
    </div>
  )
}
