
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { ArrowRight, CheckCircle, Home, Building, Shield, Layers, Zap, Settings } from 'lucide-react'

const productCategories = [
  {
    icon: Home,
    title: 'Aluminium Windows',
    description: 'Premium quality windows designed for energy efficiency and modern aesthetics.',
    image: 'https://mccoymart.com/post/wp-content/uploads/08-Oct-24-Aluminium-Windows-in-2024-FI.jpg',
    features: [
      'Double and triple glazing options',
      'Thermal break technology',
      'Multi-point locking systems',
      'Powder-coated finishes',
      'Custom sizes and configurations',
      '10-year manufacturer warranty'
    ],
    applications: ['Residential homes', 'Office buildings', 'Retail spaces', 'Educational facilities']
  },
  {
    icon: Building,
    title: 'Aluminium Doors',
    description: 'Robust entrance solutions combining security, style, and performance.',
    image: 'https://www.expressbifolds.co.uk/wp-content/uploads/2022/04/img0055High_Res-1500x1000.jpg',
    features: [
      'Enhanced security systems',
      'Weather-resistant sealing',
      'Automated door options',
      'Fire-rated variants',
      'Accessible design compliance',
      'Multiple operating styles'
    ],
    applications: ['Commercial entrances', 'Residential front doors', 'Fire exits', 'Automatic sliding doors']
  },
  {
    icon: Shield,
    title: 'Railings & Balustrades',
    description: 'Safety-first designs that enhance architectural beauty.',
    image: 'https://www.viewrail.com/wp-content/uploads/2021/09/CableRailing_AluminumSpeedboatSilver_ColonialGrayHandrail_LosGatosCA_3-2021_00011.jpg',
    features: [
      'Building regulations compliant',
      'Corrosion-resistant materials',
      'Glass panel integration',
      'Cable railing systems',
      'LED lighting integration',
      'Maintenance-free finishes'
    ],
    applications: ['Balconies and terraces', 'Staircases', 'Pool areas', 'Commercial walkways']
  },
  {
    icon: Layers,
    title: 'Curtain Wall Systems',
    description: 'Advanced facade solutions for contemporary architecture.',
    image: 'https://www.reynaers.com/sites/default/files/public/inriver/images/79597_REYN-5139.jpg',
    features: [
      'Structural glazing capability',
      'Superior weather sealing',
      'Thermal performance optimization',
      'Integration with building systems',
      'Modular design flexibility',
      'Earthquake resistance'
    ],
    applications: ['High-rise buildings', 'Commercial complexes', 'Institutional buildings', 'Mixed-use developments']
  },
  {
    icon: Zap,
    title: 'Roofing Systems',
    description: 'Durable aluminium roofing for commercial and industrial applications.',
    image: 'https://www.americanweatherstar.com/wp-content/uploads/2023/08/commercial-metal-roofing-hdr-img.jpg',
    features: [
      'Standing seam technology',
      'Superior water management',
      'Solar panel integration ready',
      'High wind resistance',
      'Energy-efficient coatings',
      '25-year weatherproofing warranty'
    ],
    applications: ['Industrial facilities', 'Warehouses', 'Retail buildings', 'Sports complexes']
  },
  {
    icon: Settings,
    title: 'Custom Solutions',
    description: 'Bespoke aluminium fabrication for unique architectural requirements.',
    image: 'https://elevatedsteel.com/wp-content/uploads/2024/02/Erection-1024x768.jpg',
    features: [
      'CAD design and engineering',
      'Prototype development',
      'Structural calculations',
      'Performance testing',
      'Installation supervision',
      'Ongoing technical support'
    ],
    applications: ['Architectural features', 'Specialized structures', 'Historic renovations', 'Artistic installations']
  }
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Premium Aluminium Products
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover our comprehensive range of aluminium solutions, engineered for performance, 
            designed for beauty, and built to last generations.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {productCategories.map((category, index) => (
              <div key={category.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <category.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6">{category.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900">Key Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Applications</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.applications.map((application, appIndex) => (
                        <span key={appIndex} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {application}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Request Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={category.image}
                      alt={category.title}
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

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our expert team can design and manufacture bespoke aluminium products to meet your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Get Custom Quote
            </Button>
            <Button size="lg" variant="outline">
              Speak to Expert
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
