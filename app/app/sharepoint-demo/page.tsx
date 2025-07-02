
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Grid, List, Maximize, Settings, 
  Diamond, Sparkles, Crown, Heart,
  Bot, Users, TrendingUp, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Import all the web parts
import LibraryNavigationWebPart from '@/components/sharepoint-webparts/library-navigation-webpart';
import AIChatbotWebPart from '@/components/sharepoint-webparts/ai-chatbot-webpart';
import WarrenExecutiveWebPart from '@/components/sharepoint-webparts/warren-executive-webpart';
import YanikaWellnessWebPart from '@/components/sharepoint-webparts/yanika-wellness-webpart';
import LibraryQuickAccess from '@/components/sharepoint-webparts/library-quick-access';

export default function SharePointDemoPage() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectedWebPart, setSelectedWebPart] = useState<string | null>(null);

  const webParts = [
    {
      id: 'library-navigation',
      title: 'Library Navigation',
      description: 'Browse and search SharePoint libraries with advanced filtering',
      icon: Grid,
      color: '#00BFFF',
      component: <LibraryNavigationWebPart compact={layout === 'list'} />
    },
    {
      id: 'ai-chatbot-default',
      title: 'AI Assistant (Default)',
      description: 'Smart AI chatbot with diamond theme for general assistance',
      icon: Bot,
      color: '#00BFFF',
      component: <AIChatbotWebPart autoMinimize={false} theme="default" />
    },
    {
      id: 'warren-executive',
      title: 'Warren Executive Dashboard',
      description: 'Premium executive suite with metrics and strategic insights',
      icon: Crown,
      color: '#FFD700',
      component: <WarrenExecutiveWebPart compact={layout === 'list'} />
    },
    {
      id: 'yanika-wellness',
      title: 'Yanika Wellness Hub',
      description: 'Creative wellness dashboard with inspirational elements',
      icon: Heart,
      color: '#FF69B4',
      component: <YanikaWellnessWebPart compact={layout === 'list'} />
    },
    {
      id: 'library-quick-access',
      title: 'Library Quick Access',
      description: 'Fast access to pinned, recent, and trending libraries',
      icon: TrendingUp,
      color: '#4ECDC4',
      component: <LibraryQuickAccess layout={layout === 'list' ? 'vertical' : 'grid'} />
    },
    {
      id: 'ai-chatbot-warren',
      title: 'Warren AI Assistant',
      description: 'Executive AI assistant with gold diamond theme',
      icon: Crown,
      color: '#FFD700',
      component: <AIChatbotWebPart autoMinimize={false} theme="warren" title="Warren's AI Assistant" />
    },
    {
      id: 'ai-chatbot-yanika',
      title: 'Yanika AI Assistant',
      description: 'Creative wellness AI guide with pink theme',
      icon: Sparkles,
      color: '#FF69B4',
      component: <AIChatbotWebPart autoMinimize={false} theme="yanika" title="Yanika's Creative Guide" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <Diamond className="h-16 w-16 text-primary diamond-shimmer" />
                <div className="absolute inset-0 diamond-dust"></div>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-orbitron text-4xl md:text-5xl font-bold mb-4 neon-text"
            >
              SharePoint Web Parts
              <span className="block text-primary text-2xl md:text-3xl">Demo Showcase</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Experience the complete collection of SharePoint Framework (SPFx) web parts 
              designed for the Warren Heathcote Innovation Hub with diamond theme integration.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Web Parts Collection</h2>
            <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
              {webParts.length} Components
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Web Parts Grid */}
        <Tabs value={selectedWebPart || 'overview'} onValueChange={setSelectedWebPart}>
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className={cn(
              layout === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            )}>
              {webParts.map((webPart, index) => {
                const IconComponent = webPart.icon;
                
                return (
                  <motion.div
                    key={webPart.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card 
                      className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50"
                      onClick={() => setSelectedWebPart(webPart.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                            style={{ backgroundColor: webPart.color + '20', borderColor: webPart.color + '40' }}
                          >
                            <IconComponent className="h-6 w-6" style={{ color: webPart.color }} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{webPart.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{webPart.description}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWebPart(webPart.id);
                            }}
                          >
                            <Maximize className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Individual Web Part Tabs */}
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full mb-6">
            <TabsTrigger value="overview" onClick={() => setSelectedWebPart('overview')}>Overview</TabsTrigger>
            {webParts.map(webPart => (
              <TabsTrigger 
                key={webPart.id} 
                value={webPart.id} 
                className="text-xs"
                onClick={() => setSelectedWebPart(webPart.id)}
              >
                {webPart.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {webParts.map(webPart => (
            <TabsContent key={webPart.id} value={webPart.id} className="mt-6">
              <div className="space-y-6">
                {/* Web Part Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                      style={{ backgroundColor: webPart.color + '20', borderColor: webPart.color + '40' }}
                    >
                      <webPart.icon className="h-6 w-6" style={{ color: webPart.color }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">{webPart.title}</h3>
                      <p className="text-muted-foreground">{webPart.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedWebPart('overview')}>
                    Back to Overview
                  </Button>
                </div>

                {/* Web Part Demo */}
                <Card className="border-dashed border-2">
                  <CardContent className="p-6">
                    {webPart.component}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Features Overview */}
      {selectedWebPart === null && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">SharePoint Integration Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These web parts are designed for seamless SharePoint integration with responsive design and theme consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Diamond,
                title: 'Diamond Theme',
                description: 'Consistent ultra-premium diamond and bling effects across all components'
              },
              {
                icon: Users,
                title: 'Personalization',
                description: 'Specialized themes for Warren (executive gold) and Yanika (creative wellness)'
              },
              {
                icon: Settings,
                title: 'SharePoint Native',
                description: 'Built for SharePoint Framework with iframe optimization and responsive design'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
