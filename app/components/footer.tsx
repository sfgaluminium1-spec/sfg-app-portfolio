
import Link from 'next/link'
import { Mail, Phone, MapPin, Wrench } from 'lucide-react'
import { VERSION_INFO, getVersionDisplay } from '@/lib/version'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">SFG Aluminium</span>
            </div>
            <p className="text-gray-300 text-sm">
              Leading provider of premium aluminium solutions with over 25 years of expertise in design, manufacture, and installation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Windows & Doors</li>
              <li>Curtain Walls</li>
              <li>Railings & Balustrades</li>
              <li>Commercial Glazing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">+44 (0)20 7123 4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">info@sfgaluminium.co.uk</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                <span className="text-gray-300">
                  Industrial Estate, London, UK
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-300">
            <div className="text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} SFG Aluminium Ltd. All rights reserved.</p>
              <p className="text-xs text-gray-400 mt-1">
                🎯 {VERSION_INFO.scope} | Warren Executive Theme | PPM Services Ready
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-2 mb-1">
                <div className="px-3 py-1 bg-blue-600 rounded-full text-xs font-semibold text-white">
                  {getVersionDisplay()}
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Build: {VERSION_INFO.buildDate} | Features: {VERSION_INFO.features.length} Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
