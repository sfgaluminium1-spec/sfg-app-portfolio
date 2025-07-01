
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Rocket, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FolderGrid from '@/components/folder-grid';
import DashboardMockups from '@/components/dashboard-mockups';
import TechTicker from '@/components/tech-ticker';
import AIChatModal from '@/components/ai-chat-modal';
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
                ? 'Warren Heathcote\'s premium AI & aluminium innovation center - Executive excellence redefined.'
                : 'Welcome to Warren Heathcote\'s AI & Aluminium Innovation Hub - Where strategic leadership meets cutting-edge technology in the future of materials science and executive excellence.'
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

      {/* Tech Ticker - Hidden in iframe to save space */}
      {!isEmbedded && <TechTicker />}
    </div>
  );
}
