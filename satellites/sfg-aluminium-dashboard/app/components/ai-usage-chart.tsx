
'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#A19AD3'];

interface AIUsageData {
  name: string;
  value: number;
  requests: number;
}

export function AIUsageChart() {
  const [data, setData] = useState<AIUsageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIUsageData();
  }, []);

  const fetchAIUsageData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-usage');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch AI usage data:', error);
      // Fallback demo data
      setData([
        { name: 'GPT-4', value: 2840, requests: 2840 },
        { name: 'Claude-3', value: 1920, requests: 1920 },
        { name: 'Gemini-Pro', value: 1560, requests: 1560 },
        { name: 'Custom-LLM', value: 980, requests: 980 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-400">Loading AI usage data...</div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '11px'
            }}
            formatter={(value: any) => [`${value?.toLocaleString()} requests`, '']}
          />
          <Legend 
            verticalAlign="top"
            align="right"
            layout="vertical"
            wrapperStyle={{ fontSize: '11px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
