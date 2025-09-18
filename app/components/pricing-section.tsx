
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Star, Zap, Crown } from 'lucide-react'
import { buttonActions } from '@/lib/button-actions'

export function PricingSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const plans = [
    {
      name: 'Free',
      icon: Star,
      price: '$0',
      period: 'forever',
      description: 'Perfect for individual users getting started with AI automation.',
      features: [
        'Basic AI text processing',
        'Up to 100 bookmarks',
        'Mobile sync (limited)',
        'Community support',
        '5 automations per day'
      ],
      gradient: 'from-gray-600 to-gray-800',
      popular: false,
      buttonText: 'Get Started',
      buttonStyle: 'border-2 border-gray-400 text-gray-400 hover:bg-gray-400/10'
    },
    {
      name: 'Professional',
      icon: Zap,
      price: '$19',
      period: 'per month',
      description: 'Ideal for professionals and power users who need advanced features.',
      features: [
        'Advanced AI processing',
        'Unlimited bookmarks',
        'Full mobile integration',
        'Priority support',
        'Unlimited automations',
        'Custom workflows',
        'Team collaboration',
        'API access'
      ],
      gradient: 'from-blue-600 to-purple-600',
      popular: true,
      buttonText: 'Start Free Trial',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white neon-blue'
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: '$99',
      period: 'per month',
      description: 'Comprehensive solution for teams and organizations.',
      features: [
        'Everything in Professional',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment',
        'Advanced security',
        'Training & onboarding'
      ],
      gradient: 'from-purple-600 to-green-600',
      popular: false,
      buttonText: 'Contact Sales',
      buttonStyle: 'border-2 border-purple-400 text-purple-400 hover:bg-purple-400/10'
    }
  ]

  return (
    <section id="pricing" className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="grid-pattern opacity-20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-purple-400">Plan</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include our core AI-powered features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative group ${plan.popular ? 'scale-105 md:scale-110' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: plan.popular ? 1.15 : 1.05 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold z-20"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Most Popular
                </motion.div>
              )}

              <div className="relative overflow-hidden rounded-3xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-8 h-full">
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-2xl transition-all duration-300`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <motion.div
                        key={feature}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 + idx * 0.05 }}
                      >
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Button */}
                  <motion.button
                    className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${plan.buttonStyle}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={
                      plan.buttonText === 'Get Started' ? buttonActions.getStarted :
                      plan.buttonText === 'Start Free Trial' ? buttonActions.startFreeTrial :
                      buttonActions.contactSales
                    }
                  >
                    {plan.buttonText}
                  </motion.button>
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  plan.popular ? 'shadow-2xl shadow-blue-500/25' : 'shadow-lg shadow-gray-500/10'
                }`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-300 mb-4">
            All plans include our 30-day money-back guarantee
          </p>
          <p className="text-gray-400 text-sm">
            Need a custom plan? <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Contact our sales team</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
