
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'stable';
}

export function KPICard({ title, value, change, icon: Icon, trend }: KPICardProps) {
  const [animatedValue, setAnimatedValue] = useState('0');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Animate the value
    const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
    if (!isNaN(numericValue)) {
      let current = 0;
      const increment = numericValue / 60; // 60 frames for smooth animation
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          current = numericValue;
          clearInterval(timer);
        }
        
        // Format the animated value to match the original format
        if (value.includes('M')) {
          setAnimatedValue(`$${(current).toFixed(2)}M`);
        } else if (value.includes('%')) {
          setAnimatedValue(`${current.toFixed(1)}%`);
        } else if (value.includes('$')) {
          setAnimatedValue(`$${Math.round(current).toLocaleString()}`);
        } else {
          setAnimatedValue(Math.round(current).toLocaleString());
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [value]);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className={cn(
      "glass-card border-white/20 transition-all duration-500 hover:neon-glow hover:scale-105",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-2">{animatedValue}</p>
            <div className="flex items-center mt-2 space-x-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {change}
              </span>
            </div>
          </div>
          <div className="p-3 rounded-full bg-blue-500/20 animate-float">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
