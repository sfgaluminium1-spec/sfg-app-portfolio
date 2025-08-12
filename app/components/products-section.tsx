
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Building, Home, Shield, Layers } from 'lucide-react'

const products = [
  {
    icon: Home,
    title: 'Aluminium Windows',
    description: 'Energy-efficient windows with superior thermal performance and modern aesthetics.',
    image: 'https://mccoymart.com/post/wp-content/uploads/08-Oct-24-Aluminium-Windows-in-2024-FI.jpg',
    features: ['Double Glazed', 'Energy Efficient', 'Low Maintenance', 'Custom Sizes']
  },
  {
    icon: Building,
    title: 'Aluminium Doors',
    description: 'Robust entrance solutions for residential and commercial applications.',
    image: 'https://www.expressbifolds.co.uk/wp-content/uploads/2022/04/img0055High_Res-1500x1000.jpg',
    features: ['Security Enhanced', 'Weather Resistant', 'Multiple Styles', 'Professional Installation']
  },
  {
    icon: Shield,
    title: 'Railings & Balustrades',
    description: 'Safety-first designs that complement your architectural vision.',
    image: 'https://www.viewrail.com/wp-content/uploads/2021/09/CableRailing_AluminumSpeedboatSilver_ColonialGrayHandrail_LosGatosCA_3-2021_00011.jpg',
    features: ['Safety Compliant', 'Durable Finish', 'Custom Design', 'Easy Installation']
  },
  {
    icon: Layers,
    title: 'Curtain Wall Systems',
    description: 'Advanced facade solutions for commercial and architectural projects.',
    image: 'https://www.reynaers.com/sites/default/files/public/inriver/images/79597_REYN-5139.jpg',
    features: ['Weather Sealed', 'Structural Glazing', 'Thermal Efficiency', 'Design Flexibility']
  }
]

export default function ProductsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Product Range</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of premium aluminium products, each engineered for excellence and built to last.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.title} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
              <div className="relative aspect-[4/3] bg-gray-200">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <product.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {product.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {product.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-1 mb-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-500 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
