
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond, Sparkles, Bot, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Innovation Hub', icon: Diamond },
    { href: '/warren-executive', label: 'Warren\'s Executive Suite', icon: Diamond },
    { href: '/yanika-oasis', label: 'Yanika\'s Creative Oasis', icon: Sparkles },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg border-b border-border/50' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <motion.div
                className="diamond-shimmer"
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-300 p-1">
                  <Image
                    src="/sfg-logo-silver.png"
                    alt="SFG Aluminium Logo"
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
              </motion.div>
              <div className="absolute inset-0 diamond-dust"></div>
            </div>
            <div>
              <motion.h1 
                className="font-orbitron font-bold text-lg neon-text"
                whileHover={{ scale: 1.05 }}
              >
                SFG Aluminium
              </motion.h1>
              <p className="text-xs text-muted-foreground">Innovation Hub</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
                      isActive 
                        ? 'bg-primary/20 text-primary neon-glow' 
                        : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                    )}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* AI Assistant Button */}
          <div className="hidden md:block">
            <Button
              size="sm"
              className="bg-primary/20 hover:bg-primary/30 border border-primary/50"
              onClick={() => {
                // This will be handled by the AI chat modal
                const event = new CustomEvent('openAIChat');
                window.dispatchEvent(event);
              }}
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border/50"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                    <motion.div
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                        isActive 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-secondary/50 text-muted-foreground'
                      )}
                      whileHover={{ x: 5 }}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
              
              <motion.div
                className="pt-3 border-t border-border/50"
                whileHover={{ x: 5 }}
              >
                <Button
                  className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/50"
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

export default Navigation;
