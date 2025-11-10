
'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface FinancialChartProps {
  dateRange: string;
}

interface FinancialData {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export function FinancialChart({ dateRange }: FinancialChartProps) {
  const [data, setData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, [dateRange]);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/financial-data?range=${dateRange}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
      // Fallback demo data
      const demoData = Array.from({ length: 30 }, (_, i) => ({
        date: `Day ${i + 1}`,
        revenue: Math.floor(Math.random() * 50000) + 100000,
        expenses: Math.floor(Math.random() * 30000) + 60000,
        profit: 0
      })).map(item => ({
        ...item,
        profit: item.revenue - item.expenses
      }));
      setData(demoData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-400">Loading financial data...</div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <XAxis 
            dataKey="date" 
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '11px'
            }}
            formatter={(value: any) => [`$${value?.toLocaleString()}`, '']}
          />
          <Legend 
            verticalAlign="top"
            wrapperStyle={{ fontSize: '11px' }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#60B5FF" 
            strokeWidth={2}
            dot={false}
            name="Revenue"
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#FF9149" 
            strokeWidth={2}
            dot={false}
            name="Expenses"
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            stroke="#80D8C3" 
            strokeWidth={2}
            dot={false}
            name="Profit"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
