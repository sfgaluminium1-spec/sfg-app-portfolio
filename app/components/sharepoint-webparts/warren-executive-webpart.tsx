
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, TrendingUp, Car, Gem, Bitcoin, 
  Target, BarChart3, Trophy, Briefcase,
  ExternalLink, ChevronRight, Sparkles, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface WarrenExecutiveWebPartProps {
  compact?: boolean;
  showMetrics?: boolean;
  maxSections?: number;
}

export default function WarrenExecutiveWebPart({
  compact = false,
  showMetrics = true,
  maxSections = 4
}: WarrenExecutiveWebPartProps) {
  const [animatedValues, setAnimatedValues] = useState({
    investment: 0,
    patents: 0,
    partnerships: 0,
    cryptoHoldings: 0
  });

  const targetValues = {
    investment: 2.3,
    patents: 47,
    partnerships: 24,
    cryptoHoldings: 1.8
  };

  useEffect(() => {
    // Animate the numbers
    const animateValue = (key: keyof typeof targetValues, target: number) => {
      const increment = target / 100;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({ ...prev, [key]: current }));
      }, 20);
    };

    Object.entries(targetValues).forEach(([key, value]) => {
      animateValue(key as keyof typeof targetValues, value);
    });
  }, []);

  const sections = [
    {
      id: 'innovation-strategy',
      title: 'Innovation & Strategy',
      icon: Target,
      description: 'Strategic roadmaps and disruptive technologies',
      color: '#FFD700',
      value: animatedValues.investment,
      unit: 'M',
      label: 'R&D Investment',
      trend: '+15%',
      progress: 85
    },
    {
      id: 'motorsport-automotive',
      title: 'Motorsport & Automotive',
      icon: Car,
      description: 'High-performance alloys and racing partnerships',
      color: '#FF4444',
      value: animatedValues.patents,
      unit: '',
      label: 'Patents Filed',
      trend: '+23%',
      progress: 72
    },
    {
      id: 'luxury-lifestyle',
      title: 'Luxury & Lifestyle',
      icon: Gem,
      description: 'Premium experiences and luxury partnerships',
      color: '#9D4EDD',
      value: animatedValues.partnerships,
      unit: '',
      label: 'Partnerships',
      trend: '+12%',
      progress: 95
    },
    {
      id: 'investments-crypto',
      title: 'Investments & Crypto',
      icon: Bitcoin,
      description: 'Digital assets and blockchain ventures',
      color: '#F7931A',
      value: animatedValues.cryptoHoldings,
      unit: 'M',
      label: 'Crypto Holdings',
      trend: '+34%',
      progress: 68
    }
  ].slice(0, maxSections);

  const quickActions = [
    { label: 'Executive Dashboard', icon: BarChart3, href: '/warren-executive' },
    { label: 'Strategic Reports', icon: FileText, href: '#' },
    { label: 'Investment Portfolio', icon: TrendingUp, href: '#' },
    { label: 'Innovation Pipeline', icon: Target, href: '#' }
  ];

  return (
    <div className="sharepoint-webpart warren-theme-webpart">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center mr-4">
            <Crown className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-bold text-yellow-400">
              Warren's Executive Suite
            </h2>
            <p className="text-sm text-gray-400">Strategic Command Center</p>
          </div>
        </div>
        
        <Button
          size="sm"
          className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Full Dashboard
        </Button>
      </div>

      {/* Key Metrics Grid */}
      {showMetrics && (
        <div className={cn(
          'grid gap-4 mb-6',
          compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'
        )}>
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="warren-card bg-black/40 border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: section.color + '20' }}
                      >
                        <IconComponent className="h-4 w-4" style={{ color: section.color }} />
                      </div>
                      <span className="text-xs text-green-400">{section.trend}</span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-yellow-400">
                        {section.unit === 'M' 
                          ? `$${section.value.toFixed(1)}${section.unit}`
                          : Math.round(section.value)
                        }
                      </div>
                      <div className="text-xs text-gray-400">{section.label}</div>
                    </div>
                    
                    <Progress 
                      value={section.progress} 
                      className="h-1 bg-gray-800"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Sections Grid */}
      <div className={cn(
        'grid gap-4 mb-6',
        compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
      )}>
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          
          return (
            <motion.div
              key={`${section.id}-detail`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Card className="warren-card bg-black/40 border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-200 group cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                      style={{ backgroundColor: section.color + '20', borderColor: section.color + '40' }}
                    >
                      <IconComponent className="h-5 w-5" style={{ color: section.color }} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-yellow-400">{section.title}</CardTitle>
                      <p className="text-sm text-gray-400">{section.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-yellow-400 mb-3">Quick Actions</h3>
        <div className={cn(
          'grid gap-2',
          compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'
        )}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-auto p-3 border-yellow-500/30 hover:border-yellow-500/50 hover:bg-yellow-500/10 text-gray-300 hover:text-yellow-400 justify-start"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Diamond Effect Footer */}
      <div className="mt-6 pt-4 border-t border-yellow-500/20">
        <div className="flex items-center justify-center">
          <motion.div
            className="flex items-center text-xs text-gray-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-3 w-3 mr-1 text-yellow-400" />
            Premium Executive Experience
            <Sparkles className="h-3 w-3 ml-1 text-yellow-400" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
