
'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface AnalyticsData {
  category: string;
  current: number;
  target: number;
  previous: number;
}

export function AnalyticsChart() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      // Fallback demo data
      const categories = ['Production', 'Quality', 'Efficiency', 'Sales', 'Customer', 'Innovation'];
      setData(categories.map(category => ({
        category,
        current: Math.floor(Math.random() * 40) + 60,
        target: Math.floor(Math.random() * 20) + 80,
        previous: Math.floor(Math.random() * 30) + 50
      })));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-400">Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <XAxis 
            dataKey="category" 
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '11px'
            }}
            formatter={(value: any) => [`${value}%`, '']}
          />
          <Legend 
            verticalAlign="top"
            wrapperStyle={{ fontSize: '11px' }}
          />
          <Bar 
            dataKey="current" 
            fill="#60B5FF" 
            name="Current"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="target" 
            fill="#80D8C3" 
            name="Target"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="previous" 
            fill="#FF9898" 
            name="Previous"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
