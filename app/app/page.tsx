
import { Building2, Shield, Clock, Trophy } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AdvancedHeroVideo from '@/components/advanced-hero-video'
import ProductsSection from '@/components/products-section'
import StatsSection from '@/components/stats-section'
import VersionBadge from '@/components/version-badge'

const features = [
  {
    icon: Building2,
    title: 'Expert Installation',
    description: 'Professional installation teams with over 25 years of combined experience in aluminium systems.'
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'All products backed by comprehensive warranties and manufactured to the highest British standards.'
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    description: 'Quick turnaround times without compromising on quality. Most projects completed within agreed timelines.'
  },
  {
    icon: Trophy,
    title: 'Award Winning',
    description: 'Recognized industry leader with numerous awards for excellence in aluminium fabrication and service.'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <AdvancedHeroVideo />
      
      <StatsSection />
      
      <ProductsSection />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">SFG Aluminium</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with traditional craftsmanship to deliver superior aluminium solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get a free consultation and quote for your aluminium project today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Get Free Quote</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/products">View Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <VersionBadge position="fixed" variant="default" />
    </div>
  )
}
