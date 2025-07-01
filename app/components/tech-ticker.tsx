
'use client';

import { motion } from 'framer-motion';
import { Zap, Cpu, Atom, Brain } from 'lucide-react';
import { TECH_TICKER_ITEMS } from '@/lib/constants';

const iconMap = {
  ai: Brain,
  innovation: Zap,
  aluminium: Atom,
  future: Cpu
};

const TechTicker = () => {
  return (
    <div className="relative bg-card/30 backdrop-blur-sm border-t border-border/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
      
      <div className="relative py-4">
        <div className="flex items-center mb-2 px-6">
          <Zap className="w-5 h-5 text-primary mr-2" />
          <h3 className="font-orbitron font-semibold text-sm neon-text">
            Tech of the Next Decade
          </h3>
        </div>
        
        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-8 ticker-scroll"
            animate={{ x: [1000, -1000] }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...TECH_TICKER_ITEMS, ...TECH_TICKER_ITEMS].map((item, index) => {
              const IconComponent = iconMap[item.category as keyof typeof iconMap];
              
              return (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center space-x-3 whitespace-nowrap"
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                  {index < TECH_TICKER_ITEMS.length * 2 - 1 && (
                    <div className="w-2 h-2 bg-primary/50 rounded-full mx-4"></div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TechTicker;
