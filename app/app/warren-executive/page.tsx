
'use client';

import { motion } from 'framer-motion';
import { 
  Crown, TrendingUp, Car, Gem, Bitcoin, 
  Target, BarChart3, Trophy, Briefcase 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIChatModal from '@/components/ai-chat-modal';
import SimpleAuth from '@/components/simple-auth';

export default function WarrenExecutivePage() {
  const sections = [
    {
      id: 'innovation-strategy',
      title: 'Innovation & Strategy',
      icon: Target,
      description: 'Strategic roadmaps, disruptive technologies, and future market positioning',
      color: '#FFD700',
      stats: [
        { label: 'R&D Investment', value: '$2.3M', trend: '+15%' },
        { label: 'Patents Filed', value: '47', trend: '+23%' },
        { label: 'Innovation Score', value: '9.2/10', trend: '+0.8' }
      ]
    },
    {
      id: 'motorsport-automotive',
      title: 'Motorsport & Automotive',
      icon: Car,
      description: 'High-performance alloys, racing partnerships, and automotive excellence',
      color: '#FF4444',
      stats: [
        { label: 'Racing Partnerships', value: '12', trend: '+3' },
        { label: 'Performance Gains', value: '18%', trend: '+5%' },
        { label: 'Championship Wins', value: '8', trend: '+2' }
      ]
    },
    {
      id: 'luxury-lifestyle',
      title: 'Luxury & Lifestyle',
      icon: Gem,
      description: 'Premium experiences, luxury partnerships, and lifestyle investments',
      color: '#9D4EDD',
      stats: [
        { label: 'Luxury Partnerships', value: '24', trend: '+6' },
        { label: 'Experience Rating', value: '9.8/10', trend: '+0.3' },
        { label: 'Portfolio Value', value: '$4.2M', trend: '+12%' }
      ]
    },
    {
      id: 'investments-crypto',
      title: 'Investments & Crypto',
      icon: Bitcoin,
      description: 'Digital assets, blockchain ventures, and future finance strategies',
      color: '#F7931A',
      stats: [
        { label: 'Crypto Holdings', value: '$1.8M', trend: '+34%' },
        { label: 'DeFi Yield', value: '12.4%', trend: '+2.1%' },
        { label: 'Blockchain Projects', value: '7', trend: '+3' }
      ]
    }
  ];

  return (
    <SimpleAuth>
      <div className="min-h-screen warren-theme">
        <AIChatModal />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10"></div>
          <div className="absolute inset-0 diamond-dust opacity-30"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                className="relative"
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Crown className="w-20 h-20 text-yellow-400 neon-glow" />
                <div className="absolute inset-0 diamond-shimmer"></div>
              </motion.div>
            </div>
            
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold mb-6 text-yellow-400 neon-text">
              Warren's Diamond
              <span className="block text-white">Executive Suite</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Strategic command center for visionary leadership, premium investments, and revolutionary business excellence in the diamond-grade digital workspace.
            </p>

            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 text-lg font-bold"
              onClick={() => {
                window.open('/warren-executive/dashboard', '_blank');
              }}
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Access Executive Dashboard
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Executive Sections */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  className="warren-card rounded-2xl p-8 relative overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Background Pattern */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${section.color}20, transparent)`
                    }}
                  ></div>

                  {/* Header */}
                  <div className="relative z-10 flex items-center mb-6">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center mr-4 neon-glow"
                      style={{ backgroundColor: section.color + '20', borderColor: section.color }}
                    >
                      <IconComponent 
                        className="w-7 h-7" 
                        style={{ color: section.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-orbitron text-2xl font-bold text-white mb-2">
                        {section.title}
                      </h3>
                      <p className="text-gray-400">{section.description}</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {section.stats.map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: (index * 0.2) + (i * 0.1), duration: 0.6 }}
                        className="text-center p-4 bg-black/30 rounded-lg border border-yellow-500/20"
                      >
                        <div className="text-2xl font-bold text-yellow-400 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-400 mb-1">
                          {stat.label}
                        </div>
                        <div className="text-xs text-green-400">
                          {stat.trend}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="relative z-10">
                    <Button
                      className="w-full bg-transparent border border-yellow-500/50 hover:bg-yellow-500/10 text-yellow-400"
                      onClick={() => {
                        window.open(`/warren-executive/analytics/${section.id}`, '_blank');
                      }}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Detailed Analytics
                    </Button>
                  </div>

                  {/* Hover Effects */}
                  <div className="absolute inset-0 diamond-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision 2035 Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="warren-card rounded-2xl p-12 diamond-dust"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6 neon-glow" />
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-6 text-yellow-400 neon-text">
              Executive Vision 2035
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Leading the transformation of global aluminium markets through strategic innovation, 
              premium partnerships, and revolutionary business models. Setting new standards for 
              executive excellence in the digital age.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Market Leadership', desc: 'Global #1 Position' },
                { title: 'Innovation Pipeline', desc: '100+ Patents Filed' },
                { title: 'Strategic Partnerships', desc: '50+ Premium Alliances' },
                { title: 'Digital Transformation', desc: 'Full AI Integration' }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  className="text-center p-4 bg-black/20 rounded-lg border border-yellow-500/20"
                >
                  <h3 className="font-orbitron font-semibold text-yellow-400 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </SimpleAuth>
  );
}
