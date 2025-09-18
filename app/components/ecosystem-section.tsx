
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Network, Puzzle, Code, Globe } from 'lucide-react'
import Image from 'next/image'
import { buttonActions } from '@/lib/button-actions'

export function EcosystemSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const ecosystemFeatures = [
    {
      icon: Network,
      title: 'Universal API',
      description: 'RESTful API that works with any application or service for seamless integration.'
    },
    {
      icon: Puzzle,
      title: 'Plugin Architecture',
      description: 'Modular system allowing developers to create custom extensions and automations.'
    },
    {
      icon: Code,
      title: 'Developer Tools',
      description: 'Comprehensive SDK, documentation, and debugging tools for rapid development.'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Worldwide infrastructure ensuring fast, reliable connections across all regions.'
    }
  ]

  return (
    <section id="ecosystem" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-1/4 w-2 h-2 bg-blue-400 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-3 h-3 bg-purple-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
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
            <Network className="w-12 h-12 text-blue-400 mr-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              App <span className="text-blue-400">Ecosystem</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect, integrate, and expand your productivity with our comprehensive ecosystem of applications and services.
          </p>
        </motion.div>

        {/* Ecosystem Visualization */}
        <motion.div
          className="mb-16 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="relative max-w-5xl w-full">
            <Image
              src="https://cdn.abacus.ai/images/4697f461-64f8-475c-8cb5-e59f923b2621.png"
              alt="App Ecosystem Network"
              width={1312}
              height={736}
              className="rounded-2xl shadow-2xl border border-blue-500/20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent rounded-2xl"></div>
            
            {/* Overlay Connection Points */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {ecosystemFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-2xl transition-all duration-300">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Integration Examples */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Popular Integrations
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Connect with your favorite tools and services through our robust ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              'Slack', 'Discord', 'Notion', 'Trello', 'Gmail', 'Calendar',
              'Drive', 'Dropbox', 'GitHub', 'Figma', 'Zoom', 'Teams'
            ].map((app, index) => (
              <motion.div
                key={app}
                className="flex flex-col items-center group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 1 + index * 0.05 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mb-2 group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                  <span className="text-white font-semibold text-xs">
                    {app.slice(0, 2)}
                  </span>
                </div>
                <span className="text-gray-400 text-sm group-hover:text-white transition-colors duration-300">
                  {app}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 neon-blue"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={buttonActions.viewIntegrations}
            >
              View All Integrations
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
