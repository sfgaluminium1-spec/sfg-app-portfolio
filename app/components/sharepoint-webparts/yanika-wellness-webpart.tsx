
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, Heart, Users, Plane, 
  Sparkles, Camera, Dumbbell, MapPin,
  ExternalLink, ChevronRight, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface YanikaWellnessWebPartProps {
  compact?: boolean;
  showMetrics?: boolean;
  maxSections?: number;
}

export default function YanikaWellnessWebPart({
  compact = false,
  showMetrics = true,
  maxSections = 4
}: YanikaWellnessWebPartProps) {
  const [animatedValues, setAnimatedValues] = useState({
    creativeProjects: 0,
    wellnessScore: 0,
    familyEvents: 0,
    destinations: 0
  });

  const targetValues = {
    creativeProjects: 34,
    wellnessScore: 9.4,
    familyEvents: 16,
    destinations: 23
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
      id: 'art-design',
      title: 'Art & Design',
      icon: Palette,
      description: 'Creative projects and artistic collaborations',
      color: '#FF69B4',
      value: animatedValues.creativeProjects,
      unit: '',
      label: 'Projects',
      trend: '+8',
      progress: 88
    },
    {
      id: 'health-wellness',
      title: 'Health & Wellness',
      icon: Heart,
      description: 'Wellness routines and health tracking',
      color: '#4ECDC4',
      value: animatedValues.wellnessScore,
      unit: '/10',
      label: 'Wellness Score',
      trend: '+0.6',
      progress: 94
    },
    {
      id: 'family-events',
      title: 'Family & Events',
      icon: Users,
      description: 'Family moments and special celebrations',
      color: '#FFB74D',
      value: animatedValues.familyEvents,
      unit: '',
      label: 'Events',
      trend: '+4',
      progress: 76
    },
    {
      id: 'travel-culture',
      title: 'Travel & Culture',
      icon: Plane,
      description: 'Travel adventures and cultural experiences',
      color: '#BA68C8',
      value: animatedValues.destinations,
      unit: '',
      label: 'Destinations',
      trend: '+7',
      progress: 82
    }
  ].slice(0, maxSections);

  const quickActions = [
    { label: 'Wellness Dashboard', icon: Heart, href: '/yanika-oasis' },
    { label: 'Creative Gallery', icon: Palette, href: '#' },
    { label: 'Travel Journal', icon: Plane, href: '#' },
    { label: 'Family Memories', icon: Camera, href: '#' }
  ];

  const inspirationalQuotes = [
    "Creativity is the currency of the future",
    "Wellness is not a destination, it's a journey",
    "Every day is a new canvas to paint",
    "Balance is the key to a beautiful life"
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sharepoint-webpart yanika-theme-webpart">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center mr-4">
            <Sparkles className="h-6 w-6 text-pink-500" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-bold text-pink-600">
              Yanika's Creative Oasis
            </h2>
            <p className="text-sm text-gray-600">Wellness & Creativity Hub</p>
          </div>
        </div>
        
        <Button
          size="sm"
          className="bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/50 text-pink-600"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Full Experience
        </Button>
      </div>

      {/* Inspirational Quote */}
      <motion.div
        key={currentQuote}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-6 p-4 rounded-lg bg-gradient-to-r from-pink-100/50 to-purple-100/50 border border-pink-200/50"
      >
        <p className="text-sm italic text-center text-pink-700">
          "{inspirationalQuotes[currentQuote]}"
        </p>
      </motion.div>

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
                <Card className="yanika-card bg-white/60 border-pink-200 hover:border-pink-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: section.color + '20' }}
                      >
                        <IconComponent className="h-4 w-4" style={{ color: section.color }} />
                      </div>
                      <span className="text-xs text-green-600">+{section.trend}</span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-gray-800">
                        {section.unit === '/10' 
                          ? `${section.value.toFixed(1)}${section.unit}`
                          : Math.round(section.value)
                        }
                      </div>
                      <div className="text-xs text-gray-600">{section.label}</div>
                    </div>
                    
                    <Progress 
                      value={section.progress} 
                      className="h-1 bg-pink-100"
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
              <Card className="yanika-card bg-white/60 border-pink-200 hover:border-pink-300 transition-all duration-200 group cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                      style={{ backgroundColor: section.color + '20', borderColor: section.color + '40' }}
                    >
                      <IconComponent className="h-5 w-5" style={{ color: section.color }} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-800">{section.title}</CardTitle>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-pink-500 transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-pink-600 mb-3">Quick Actions</h3>
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
                  className="w-full h-auto p-3 border-pink-300 hover:border-pink-400 hover:bg-pink-50 text-gray-700 hover:text-pink-600 justify-start"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sparkle Effect Footer */}
      <div className="mt-6 pt-4 border-t border-pink-200">
        <div className="flex items-center justify-center">
          <motion.div
            className="flex items-center text-xs text-gray-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="h-3 w-3 mr-1 text-pink-500" />
            Creative Wellness Journey
            <Star className="h-3 w-3 ml-1 text-pink-500" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
