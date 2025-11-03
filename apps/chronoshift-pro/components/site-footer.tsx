
'use client';

import Link from 'next/link';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-warren-gray-50 dark:bg-warren-gray-900 border-t border-warren-gray-200 dark:border-warren-gray-800 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-warren-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                SFG Aluminium Ltd
              </h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-warren-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>warren@sfg-aluminium.co.uk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>[Company Phone Number]</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>[Company Address]</span>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              ChronoShift Pro
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-warren-gray-400">
              <p>Professional payroll management system</p>
              <p>Version 2.1.3</p>
              <p>Built for SFG Aluminium Ltd</p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Legal
            </h3>
            <div className="space-y-2 text-sm">
              <Link 
                href="/legal/terms" 
                className="block text-gray-600 dark:text-warren-gray-400 hover:text-warren-blue-600 dark:hover:text-warren-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/legal/privacy" 
                className="block text-gray-600 dark:text-warren-gray-400 hover:text-warren-blue-600 dark:hover:text-warren-blue-400 transition-colors"
              >
                Privacy Statement
              </Link>
              <Link 
                href="/legal/terms" 
                className="block text-gray-600 dark:text-warren-gray-400 hover:text-warren-blue-600 dark:hover:text-warren-blue-400 transition-colors"
              >
                Data Protection
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Support
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-warren-gray-400">
              <p>Business Hours:</p>
              <p>Monday - Friday</p>
              <p>9:00 AM - 5:00 PM GMT</p>
              <p className="mt-3">
                For technical support, contact your system administrator or 
                <span className="block mt-1">warren@sfg-aluminium.co.uk</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-warren-gray-200 dark:border-warren-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 dark:text-warren-gray-400">
              <p>© 2025 SFG Aluminium Ltd. All rights reserved.</p>
              <p className="mt-1">
                Registered in England and Wales. Company Number: [Company Number]
              </p>
            </div>
            <div className="flex space-x-6">
              <Link 
                href="/legal/terms"
                className="text-sm text-gray-600 dark:text-warren-gray-400 hover:text-warren-blue-600 dark:hover:text-warren-blue-400 transition-colors"
              >
                Terms
              </Link>
              <Link 
                href="/legal/privacy"
                className="text-sm text-gray-600 dark:text-warren-gray-400 hover:text-warren-blue-600 dark:hover:text-warren-blue-400 transition-colors"
              >
                Privacy
              </Link>
              <span className="text-sm text-gray-600 dark:text-warren-gray-400">
                UK GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
