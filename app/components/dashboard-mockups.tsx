
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { POWER_BI_DASHBOARDS } from '@/lib/constants';

const DashboardMockups = () => {
  const [chartHeights, setChartHeights] = useState<number[][][]>([]);
  const [statsValues, setStatsValues] = useState<number[][]>([]);

  const iconMap = {
    financial: TrendingUp,
    operational: BarChart3,
    strategic: PieChart,
    wellness: Activity
  };

  useEffect(() => {
    // Generate random values on client-side only
    const heights = POWER_BI_DASHBOARDS.map(() => 
      Array.from({ length: 8 }).map(() => [
        Math.random() * 60 + 20,
        Math.random() * 60 + 20,
        Math.random() * 60 + 20
      ])
    );
    
    const stats = POWER_BI_DASHBOARDS.map(() => 
      Array.from({ length: 3 }).map(() => Math.floor(Math.random() * 100))
    );
    
    setChartHeights(heights);
    setStatsValues(stats);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      {POWER_BI_DASHBOARDS.map((dashboard, index) => {
        const IconComponent = iconMap[dashboard.category as keyof typeof iconMap];
        
        return (
          <motion.div
            key={dashboard.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="dashboard-mockup rounded-xl p-6 h-64 relative overflow-hidden group cursor-pointer"
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => {
              // Open dashboard in new window/tab
              window.open(`/dashboard/${dashboard.id}`, '_blank');
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 gap-1 h-full">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-current rounded-sm opacity-20"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      animation: 'pulse 2s infinite'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-orbitron font-semibold">{dashboard.title}</h3>
                  <p className="text-sm text-muted-foreground">{dashboard.description}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>

            {/* Mock Data Visualization */}
            <div className="relative z-10 space-y-4">
              {/* Chart Area */}
              <div className="h-24 bg-muted/30 rounded-lg flex items-end justify-between px-4 py-2">
                {chartHeights[index] && Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-primary/60 rounded-sm"
                    style={{ width: '8px' }}
                    animate={{
                      height: chartHeights[index]?.[i] || [40, 40, 40]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  ></motion.div>
                ))}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                {['Revenue', 'Growth', 'Efficiency'].map((label, i) => (
                  <div key={label} className="text-center">
                    <motion.div
                      className="text-lg font-bold text-primary"
                      animate={{
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    >
                      {statsValues[index]?.[i] || 0}%
                    </motion.div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                className="bg-primary/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/30"
              >
                <span className="text-sm font-medium">Open Dashboard</span>
              </motion.div>
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 diamond-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardMockups;
