
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Handshake, Rocket, Users } from 'lucide-react'
import Image from 'next/image'
import { buttonActions } from '@/lib/button-actions'

export function PartnershipSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const benefits = [
    {
      icon: Rocket,
      title: 'Accelerated Development',
      description: 'Leverage AI-AutoStack\'s powerful infrastructure to build and deploy applications 10x faster.'
    },
    {
      icon: Users,
      title: 'Expanded Reach',
      description: 'Access a growing ecosystem of developers and users through our integrated platform.'
    },
    {
      icon: Handshake,
      title: 'Seamless Integration',
      description: 'Easy API integration with comprehensive documentation and developer support.'
    }
  ]

  return (
    <section id="partnership" className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20"></div>
        <div className="grid-pattern"></div>
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
            <Handshake className="w-12 h-12 text-purple-400 mr-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              AI-AutoStack <span className="text-purple-400">Partnership</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powered by cutting-edge AI infrastructure, bringing enterprise-grade automation to your browser.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Partnership Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <Image
                src="https://cdn.abacus.ai/images/0978a65e-4c19-467c-9d92-7c08b5e44d16.png"
                alt="AI-AutoStack Partnership"
                width={1152}
                height={864}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent rounded-2xl"></div>
              
              {/* Animated Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(147, 51, 234, 0.3)',
                    '0 0 40px rgba(147, 51, 234, 0.6)',
                    '0 0 20px rgba(147, 51, 234, 0.3)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>

          {/* Partnership Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Enterprise-Grade AI Platform
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                SFG Chrome Extension is proudly powered by AI-AutoStack, providing robust AI infrastructure and advanced automation capabilities that scale with your needs.
              </p>
              
              <motion.a
                href="https://Ai-AutoStack.abacusai.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <span>Visit AI-AutoStack</span>
                <ExternalLink className="w-5 h-5" />
              </motion.a>
            </div>

            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="flex items-start space-x-4 group cursor-pointer"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-3xl p-8 md:p-12 text-center border border-purple-500/20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Build the Future?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our partnership program and integrate your applications with the SFG ecosystem through AI-AutoStack's powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 neon-purple"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={buttonActions.becomePartner}
            >
              Become a Partner
            </motion.button>
            <motion.button
              className="border-2 border-purple-400 text-purple-400 px-8 py-4 rounded-full font-semibold hover:bg-purple-400/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={buttonActions.viewDocumentation}
            >
              API Documentation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
