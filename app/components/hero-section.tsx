
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Premium <span className="text-blue-400">Aluminium</span> Solutions
          </h1>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gray-900">
        <div className="relative w-full h-full">
          <Image
            src="https://www.finishfacades.co.uk/wp-content/uploads/2024/11/shutterstock_2467913365-scaled.jpg"
            alt="Modern aluminium architecture"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Premium <span className="text-blue-400">Aluminium</span> Solutions
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
          Transform your space with expertly crafted windows, doors, and architectural systems. 
          Quality engineering meets exceptional design.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3" asChild>
            <Link href="/contact">
              Get Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3" asChild>
            <Link href="/products">
              View Products
              <Play className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-white/80">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1">25+</div>
            <div className="text-sm">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1">5000+</div>
            <div className="text-sm">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1">100%</div>
            <div className="text-sm">Quality Guaranteed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1">24/7</div>
            <div className="text-sm">Support Available</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
