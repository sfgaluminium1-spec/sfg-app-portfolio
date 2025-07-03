
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Rocket, Target, Crown, Car, Gem, Bitcoin, Heart, Plane, Palette, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FolderGrid from '@/components/folder-grid';
import DashboardMockups from '@/components/dashboard-mockups';
import TechTicker from '@/components/tech-ticker';
import AIChatModal from '@/components/ai-chat-modal';
import XeroIntegration from '@/components/xero-integration';
import SharePointAnalytics from '@/components/sharepoint-analytics';
import IntegrationOverview from '@/components/integration-overview';
import { isInIframe, isSharePointEnvironment, getContainerClasses, getSectionHeight } from '@/lib/utils';

export default function HomePage() {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [isSharePoint, setIsSharePoint] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{left: number, top: number}>>([]);

  useEffect(() => {
    setIsEmbedded(isInIframe());
    setIsSharePoint(isSharePointEnvironment());
    
    // Generate floating elements positions on client-side only
    const elements = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/20 sharepoint-compatible">
      <AIChatModal />
      
      {/* Hero Section */}
      <section className={`relative flex items-center justify-center overflow-hidden sharepoint-section hero ${getSectionHeight(isEmbedded, true)}`}>
        {/* Background Video Effect - Simplified for iframe */}
        {!isEmbedded && (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, hsl(var(--secondary)) 0%, transparent 50%)`,
              animation: 'pulse 4s infinite'
            }}></div>
          </div>
        )}

        {/* Main Content */}
        <div className={`relative z-10 text-center ${getContainerClasses(isEmbedded)} max-w-4xl`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className={`font-orbitron font-bold mb-6 neon-text ${
                isEmbedded 
                  ? 'text-3xl md:text-4xl lg:text-5xl' 
                  : 'text-4xl md:text-6xl lg:text-7xl xl:text-8xl'
              }`}
              animate={!isEmbedded ? { 
                textShadow: [
                  '0 0 20px hsl(var(--primary) / 0.8)',
                  '0 0 40px hsl(var(--primary) / 0.8)',
                  '0 0 20px hsl(var(--primary) / 0.8)'
                ]
              } : {}}
              transition={!isEmbedded ? { duration: 2, repeat: Infinity } : {}}
            >
              Innovation
              <span className="block text-primary">Redefined</span>
            </motion.h1>
            
            <motion.p 
              className={`text-muted-foreground mb-8 mx-auto leading-relaxed ${
                isEmbedded 
                  ? 'text-lg md:text-xl max-w-xl' 
                  : 'text-xl md:text-2xl max-w-2xl'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {isEmbedded 
                ? 'Warren Heathcote\'s executive command center - Strategic leadership, innovation excellence, and premium lifestyle management.'
                : 'Welcome to Warren Heathcote\'s Executive Innovation Hub - Your premier destination for strategic leadership, AI-driven business intelligence, and access to both executive operations and creative wellness initiatives.'
              }
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg neon-glow"
                onClick={() => {
                  document.getElementById('folders')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Explore Innovation Hub
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-primary/50 hover:bg-primary/10 px-8 py-4 text-lg"
                onClick={() => {
                  const event = new CustomEvent('openAIChat');
                  window.dispatchEvent(event);
                }}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                AI Assistant
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator - Hidden in iframe */}
          {!isEmbedded && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-primary" />
            </motion.div>
          )}
        </div>

        {/* Floating Elements - Reduced for iframe */}
        {!isEmbedded && floatingElements.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {floatingElements.map((element, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/30 rounded-full"
                style={{
                  left: `${element.left}%`,
                  top: `${element.top}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Executive Access Section */}
      <section className={`bg-muted/30 relative overflow-hidden sharepoint-section ${getSectionHeight(isEmbedded)}`}>
        {!isEmbedded && <div className="absolute inset-0 diamond-dust opacity-50"></div>}
        <div className={`${getContainerClasses(isEmbedded)} relative z-10`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`font-orbitron font-bold mb-4 neon-text ${
              isEmbedded ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              Executive Access Centers
            </h2>
            <p className={`text-muted-foreground mx-auto ${
              isEmbedded 
                ? 'text-lg max-w-2xl' 
                : 'text-xl max-w-3xl'
            }`}>
              Choose your workspace: Executive command center for strategic operations or creative wellness oasis for inspiration and balance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Warren's Executive Suite */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="warren-card rounded-2xl p-8 relative overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => window.open('/warren-executive', '_blank')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-yellow-500/20 border border-yellow-400 flex items-center justify-center mr-4 neon-glow">
                    <Crown className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-2xl font-bold text-yellow-400 mb-2 neon-text">
                      Warren's Executive Suite
                    </h3>
                    <p className="text-gray-300">Strategic command & premium operations</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Strategy & Innovation', icon: Target },
                    { label: 'Luxury Lifestyle', icon: Gem },
                    { label: 'Motorsport Excellence', icon: Car },
                    { label: 'Investment Portfolio', icon: Bitcoin }
                  ].map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.label} className="text-center p-3 bg-black/30 rounded-lg border border-yellow-500/20">
                        <IconComponent className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <div className="text-xs text-gray-400">{item.label}</div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('/warren-executive', '_blank');
                  }}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Access Executive Suite
                </Button>
              </div>
              <div className="absolute inset-0 diamond-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </motion.div>

            {/* Yanika's Creative Wellness Oasis */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="yanika-card rounded-2xl p-8 relative overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => window.open('/yanika-oasis', '_blank')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-pink-500/20 border border-pink-400 flex items-center justify-center mr-4 neon-glow">
                    <Sparkles className="w-8 h-8 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-2xl font-bold text-pink-400 mb-2 neon-text">
                      Yanika's Creative Oasis
                    </h3>
                    <p className="text-gray-300">Wellness, creativity & inspiration</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Art & Design', icon: Palette },
                    { label: 'Wellness Journey', icon: Heart },
                    { label: 'Family Moments', icon: Users },
                    { label: 'Travel Dreams', icon: Plane }
                  ].map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.label} className="text-center p-3 bg-white/10 rounded-lg border border-pink-200/20">
                        <IconComponent className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                        <div className="text-xs text-gray-400">{item.label}</div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  className="w-full border-pink-400 text-pink-400 hover:bg-pink-500/10 font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('/yanika-oasis', '_blank');
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explore Creative Oasis
                </Button>
              </div>
              <div className="absolute inset-0 diamond-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SharePoint Libraries Section */}
      <section id="folders" className={`relative sharepoint-section ${getSectionHeight(isEmbedded)}`}>
        <div className={getContainerClasses(isEmbedded)}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`font-orbitron font-bold mb-4 neon-text ${
              isEmbedded ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              {isEmbedded ? 'SharePoint Libraries' : 'Premium SharePoint Libraries'}
            </h2>
            <p className={`text-muted-foreground mx-auto ${
              isEmbedded 
                ? 'text-lg max-w-2xl' 
                : 'text-xl max-w-3xl'
            }`}>
              {isEmbedded 
                ? 'Access your complete digital ecosystem with cutting-edge interfaces for innovation management.'
                : 'Access your complete digital ecosystem with ultra-modern interfaces designed for the future of business intelligence and innovation management.'
              }
            </p>
          </motion.div>

          <FolderGrid />
        </div>
      </section>

      {/* Power BI Dashboards Section */}
      <section className={`bg-muted/30 relative overflow-hidden sharepoint-section ${getSectionHeight(isEmbedded)}`}>
        {!isEmbedded && <div className="absolute inset-0 diamond-dust opacity-50"></div>}
        <div className={`${getContainerClasses(isEmbedded)} relative z-10`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`font-orbitron font-bold mb-4 neon-text ${
              isEmbedded ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              {isEmbedded ? 'Dashboards' : 'Executive Dashboards'}
            </h2>
            <p className={`text-muted-foreground mx-auto ${
              isEmbedded 
                ? 'text-lg max-w-2xl' 
                : 'text-xl max-w-3xl'
            }`}>
              {isEmbedded 
                ? 'AI-powered business intelligence for strategic decision making.'
                : 'Real-time business intelligence powered by AI analytics and predictive modeling for strategic decision making.'
              }
            </p>
          </motion.div>

          <DashboardMockups />
        </div>
      </section>

      {/* Vision 2035 Section */}
      <section className={`relative overflow-hidden sharepoint-section ${getSectionHeight(isEmbedded)}`}>
        <div className={getContainerClasses(isEmbedded)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={`text-center bg-gradient-to-br from-card/50 to-muted/50 rounded-2xl backdrop-blur-sm border border-border/50 ${
              !isEmbedded && 'diamond-dust'
            } ${isEmbedded ? 'p-6' : 'p-12'}`}
          >
            <Target className={`text-primary mx-auto mb-6 ${isEmbedded ? 'w-12 h-12' : 'w-16 h-16'}`} />
            <h2 className={`font-orbitron font-bold mb-6 neon-text ${
              isEmbedded ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              Vision 2035
            </h2>
            <p className={`text-muted-foreground mx-auto leading-relaxed mb-8 ${
              isEmbedded 
                ? 'text-base max-w-3xl' 
                : 'text-lg max-w-4xl'
            }`}>
              {isEmbedded 
                ? 'Pioneering AI-driven innovation and sustainable aluminium production for the future.'
                : 'Pioneering the next generation of sustainable aluminium production through AI-driven innovation, quantum-enhanced material science, and carbon-negative manufacturing processes. Our journey toward a revolutionary industrial future begins today.'
              }
            </p>
            <div className={`grid gap-8 mt-12 ${
              isEmbedded ? 'grid-cols-1 sm:grid-cols-3 gap-4' : 'grid-cols-1 md:grid-cols-3'
            }`}>
              {[
                { title: 'AI Integration', desc: '100% AI-Optimized Operations' },
                { title: 'Sustainability', desc: 'Carbon-Negative Production' },
                { title: 'Innovation', desc: 'Quantum Material Science' }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                  className="text-center"
                >
                  <h3 className={`font-orbitron font-semibold mb-2 ${
                    isEmbedded ? 'text-lg' : 'text-xl'
                  }`}>{item.title}</h3>
                  <p className={`text-muted-foreground ${isEmbedded ? 'text-sm' : 'text-base'}`}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Xero Financial Integration Section */}
      <section className={`bg-muted/30 relative overflow-hidden sharepoint-section ${getSectionHeight(isEmbedded)}`}>
        {!isEmbedded && <div className="absolute inset-0 diamond-dust opacity-50"></div>}
        <div className={`${getContainerClasses(isEmbedded)} relative z-10`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`font-orbitron font-bold mb-4 neon-text ${
              isEmbedded ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              {isEmbedded ? 'Xero Integration' : 'Comprehensive Xero Financial Integration'}
            </h2>
            <p className={`text-muted-foreground mx-auto ${
              isEmbedded 
                ? 'text-lg max-w-2xl' 
                : 'text-xl max-w-3xl'
            }`}>
              {isEmbedded 
                ? 'Real-time financial analytics with automated invoice generation and cash flow tracking.'
                : 'Real-time financial analytics, automated invoice generation, cash flow forecasting, and comprehensive profitability analysis powered by Xero integration.'
              }
            </p>
          </motion.div>

          <XeroIntegration compact={isEmbedded} />
        </div>
      </section>

      {/* SharePoint Analytics Section */}
      <section className={`relative sharepoint-section ${getSectionHeight(isEmbedded)}`}>
        <div className={getContainerClasses(isEmbedded)}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`font-orbitron font-bold mb-4 neon-text ${
              isEmbedded ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              {isEmbedded ? 'SharePoint Analytics' : 'Advanced SharePoint Analytics'}
            </h2>
            <p className={`text-muted-foreground mx-auto ${
              isEmbedded 
                ? 'text-lg max-w-2xl' 
                : 'text-xl max-w-3xl'
            }`}>
              {isEmbedded 
                ? 'Real-time document analytics and enhanced collaboration insights.'
                : 'Real-time document analytics, user activity tracking, and enhanced collaboration insights with comprehensive library management.'
              }
            </p>
          </motion.div>

          <SharePointAnalytics compact={isEmbedded} />
        </div>
      </section>

      {/* Integration Overview Section */}
      <section className={`bg-muted/30 relative overflow-hidden sharepoint-section ${getSectionHeight(isEmbedded)}`}>
        {!isEmbedded && <div className="absolute inset-0 diamond-dust opacity-50"></div>}
        <div className={`${getContainerClasses(isEmbedded)} relative z-10`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`font-orbitron font-bold mb-4 neon-text ${
              isEmbedded ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              {isEmbedded ? 'System Integration' : 'Comprehensive System Integration Hub'}
            </h2>
            <p className={`text-muted-foreground mx-auto ${
              isEmbedded 
                ? 'text-lg max-w-2xl' 
                : 'text-xl max-w-3xl'
            }`}>
              {isEmbedded 
                ? 'Complete overview of all connected services with health monitoring and status indicators.'
                : 'Complete overview of all connected services including Xero, SharePoint, Teams, and Abacus.AI with real-time health monitoring and status indicators. £135,000 investment delivering 300% ROI.'
              }
            </p>
          </motion.div>

          <IntegrationOverview compact={isEmbedded} />
        </div>
      </section>

      {/* Tech Ticker - Hidden in iframe to save space */}
      {!isEmbedded && <TechTicker />}
    </div>
  );
}
