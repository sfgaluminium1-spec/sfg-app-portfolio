
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, BookmarkCheck, MessageSquare, Zap, Shield, Smartphone } from 'lucide-react'
import Image from 'next/image'

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const features = [
    {
      icon: Brain,
      title: 'AI Text Processing',
      description: 'Advanced natural language processing for automatic text corrections, grammar checks, and smart suggestions.',
      gradient: 'from-blue-500 to-blue-700',
      bgImage: 'https://cdn.abacus.ai/images/9c6090b0-5bc1-426d-85c1-0ff7f17cce06.png'
    },
    {
      icon: BookmarkCheck,
      title: 'Smart Bookmarks',
      description: 'Intelligent bookmark organization with AI-powered categorization and instant search capabilities.',
      gradient: 'from-purple-500 to-purple-700',
      bgImage: 'https://cdn.abacus.ai/images/635caaca-cc9c-4567-82a5-d26c14e7975c.png'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with instant processing and seamless integration across all your tabs.',
      gradient: 'from-green-500 to-green-700',
      bgImage: 'https://cdn.abacus.ai/images/fd3805d6-d284-41d3-ab5e-76aac1ac09dd.png'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'End-to-end encryption ensures your data stays private and secure at all times.',
      gradient: 'from-blue-500 to-purple-500',
      bgImage: 'https://cdn.abacus.ai/images/9c6090b0-5bc1-426d-85c1-0ff7f17cce06.png'
    },
    {
      icon: MessageSquare,
      title: 'Context Awareness',
      description: 'Understands context across different websites and applications for better automation.',
      gradient: 'from-purple-500 to-green-500',
      bgImage: 'https://cdn.abacus.ai/images/635caaca-cc9c-4567-82a5-d26c14e7975c.png'
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform',
      description: 'Seamless synchronization with mobile devices and other platforms for unified experience.',
      gradient: 'from-green-500 to-blue-500',
      bgImage: 'https://cdn.abacus.ai/images/fd3805d6-d284-41d3-ab5e-76aac1ac09dd.png'
    }
  ]

  return (
    <section id="features" className="py-20 bg-slate-900/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful <span className="text-blue-400">Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience next-generation Chrome extension capabilities designed for the modern web.
          </p>
        </motion.div>

        {/* Extension Mockup */}
        <motion.div
          className="mb-16 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative max-w-4xl w-full">
            <Image
              src="https://cdn.abacus.ai/images/6ca9815e-ffc8-4127-bbb4-7b56e926f8c0.png"
              alt="Chrome Extension Interface"
              width={1280}
              height={800}
              className="rounded-xl shadow-2xl border border-blue-500/20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-xl"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-8 h-full">
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src={feature.bgImage}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-blue-500/25"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
