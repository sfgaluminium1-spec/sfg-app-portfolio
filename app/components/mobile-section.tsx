
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Smartphone, RefreshCw, Cloud, Bell } from 'lucide-react'
import Image from 'next/image'
import { buttonActions } from '@/lib/button-actions'

export function MobileSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const mobileFeatures = [
    {
      icon: RefreshCw,
      title: 'Real-time Sync',
      description: 'Instant synchronization between your Chrome extension and mobile devices.'
    },
    {
      icon: Cloud,
      title: 'Cloud Integration',
      description: 'Seamless cloud backup and access across all your connected devices.'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Intelligent alerts and reminders based on your browsing patterns.'
    }
  ]

  return (
    <section id="mobile" className="py-20 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Smartphone className="w-12 h-12 text-green-400 mr-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Mobile <span className="text-green-400">Integration</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Perfect harmony between your Chrome extension and mobile experience with intelligent note organization.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mobile Mockup */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <Image
                src="https://cdn.abacus.ai/images/63a380e5-cafc-4882-a70f-78a31992a29e.png"
                alt="Mobile Integration"
                width={1248}
                height={832}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent rounded-2xl"></div>
              
              {/* Floating Connection Lines */}
              <motion.div
                className="absolute top-1/4 -right-10 w-20 h-1 bg-gradient-to-r from-blue-400 to-transparent"
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-1/4 -right-10 w-20 h-1 bg-gradient-to-r from-green-400 to-transparent"
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              />
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Seamless Cross-Platform Experience
              </h3>
              <p className="text-gray-300 text-lg">
                Your productivity never stops. Access your AI-enhanced notes, bookmarks, and automations on iOS and Android devices with perfect synchronization.
              </p>
            </div>

            {mobileFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex items-start space-x-4 group cursor-pointer"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.div
              className="pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 neon-green"
                  onClick={buttonActions.downloadiOS}
                >
                  Download iOS App
                </button>
                <button 
                  className="border-2 border-green-400 text-green-400 px-8 py-3 rounded-full font-semibold hover:bg-green-400/10 transition-all duration-300"
                  onClick={buttonActions.downloadAndroid}
                >
                  Get Android App
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
