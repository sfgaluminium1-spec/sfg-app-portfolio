
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond, Sparkles, Bot, Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isInIframe, isSharePointEnvironment } from '@/lib/utils';

const IframeOptimizedNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [isSharePoint, setIsSharePoint] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsEmbedded(isInIframe());
    setIsSharePoint(isSharePointEnvironment());
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    if (!isInIframe()) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const navItems = [
    { href: '/', label: 'Innovation Hub', icon: Diamond },
    { href: '/warren-executive', label: 'Warren\'s Executive Suite', icon: Diamond },
    { href: '/sharepoint-demo', label: 'SharePoint Web Parts', icon: Bot },
  ];

  // Use static positioning for iframe, fixed for standalone
  const navigationPosition = isEmbedded ? 'relative' : 'fixed';
  
  return (
    <motion.nav
      initial={{ y: isEmbedded ? 0 : -100 }}
      animate={{ y: 0 }}
      className={cn(
        'top-0 left-0 right-0 z-50 transition-all duration-300',
        navigationPosition === 'fixed' ? 'fixed' : 'relative',
        isScrolled && !isEmbedded
          ? 'bg-background/80 backdrop-blur-lg border-b border-border/50' 
          : isEmbedded 
          ? 'bg-background/95 border-b border-border/50'
          : 'bg-transparent'
      )}
    >
      <div className={cn(
        'px-4 sm:px-6',
        isEmbedded ? 'w-full' : 'max-w-7xl mx-auto lg:px-8'
      )}>
        <div className={cn(
          'flex items-center justify-between',
          isEmbedded ? 'h-12' : 'h-16'
        )}>
          {/* Logo - Simplified for iframe */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <motion.div
                className="diamond-shimmer"
                animate={!isEmbedded ? { 
                  rotateY: [0, 360],
                  scale: [1, 1.05, 1]
                } : {}}
                transition={!isEmbedded ? { 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              >
                <div className={cn(
                  'relative rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-300 p-1',
                  isEmbedded ? 'h-8 w-8' : 'h-10 w-10'
                )}>
                  <Image
                    src="/sfg-logo-silver.png"
                    alt="SFG Aluminium Logo"
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
              </motion.div>
              {!isEmbedded && <div className="absolute inset-0 diamond-dust"></div>}
            </div>
            <div>
              <motion.h1 
                className={cn(
                  'font-orbitron font-bold neon-text',
                  isEmbedded ? 'text-sm' : 'text-lg'
                )}
                whileHover={!isEmbedded ? { scale: 1.05 } : {}}
              >
                {isEmbedded ? 'SFG Aluminium' : 'SFG Aluminium'}
              </motion.h1>
              {!isEmbedded && (
                <p className="text-xs text-muted-foreground">Innovation Hub</p>
              )}
            </div>
          </Link>

          {/* Desktop Navigation - Responsive for iframe */}
          <div className={cn(
            'hidden items-center',
            isEmbedded ? 'sm:flex space-x-4' : 'md:flex space-x-8'
          )}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      'flex items-center space-x-2 rounded-lg transition-all duration-200',
                      isEmbedded ? 'px-2 py-1' : 'px-4 py-2',
                      isActive 
                        ? 'bg-primary/20 text-primary neon-glow' 
                        : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                    )}
                    whileHover={!isEmbedded ? { scale: 1.05, y: -2 } : { scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={cn(isEmbedded ? 'h-3 w-3' : 'h-4 w-4')} />
                    <span className={cn(
                      'font-medium',
                      isEmbedded ? 'text-xs hidden lg:block' : 'text-sm'
                    )}>
                      {isEmbedded ? item.label.split(' ')[0] : item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* AI Assistant Button - Compact for iframe */}
          <div className={cn(isEmbedded ? 'hidden sm:block' : 'hidden md:block')}>
            <Button
              size={isEmbedded ? 'sm' : 'sm'}
              className={cn(
                'bg-primary/20 hover:bg-primary/30 border border-primary/50',
                isEmbedded && 'px-2 py-1 text-xs'
              )}
              onClick={() => {
                const event = new CustomEvent('openAIChat');
                window.dispatchEvent(event);
              }}
            >
              <Bot className={cn(
                'mr-1',
                isEmbedded ? 'h-3 w-3' : 'h-4 w-4'
              )} />
              {isEmbedded ? 'AI' : 'AI Assistant'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className={cn(isEmbedded ? 'sm:hidden' : 'md:hidden')}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Compact for iframe */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'bg-background/95 backdrop-blur-lg border-t border-border/50',
              isEmbedded ? 'sm:hidden' : 'md:hidden'
            )}
          >
            <div className={cn(
              'px-4 space-y-2',
              isEmbedded ? 'py-2' : 'py-4'
            )}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                    <motion.div
                      className={cn(
                        'flex items-center justify-between rounded-lg transition-all duration-200',
                        isEmbedded ? 'px-3 py-2' : 'px-4 py-3',
                        isActive 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-secondary/50 text-muted-foreground'
                      )}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      <ChevronRight className="h-3 w-3" />
                    </motion.div>
                  </Link>
                );
              })}
              
              <motion.div
                className={cn(
                  'border-t border-border/50',
                  isEmbedded ? 'pt-2' : 'pt-3'
                )}
                whileHover={{ x: 5 }}
              >
                <Button
                  className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/50 text-sm"
                  size={isEmbedded ? 'sm' : 'default'}
                  onClick={() => {
                    setIsOpen(false);
                    const event = new CustomEvent('openAIChat');
                    window.dispatchEvent(event);
                  }}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI Assistant
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default IframeOptimizedNavigation;
