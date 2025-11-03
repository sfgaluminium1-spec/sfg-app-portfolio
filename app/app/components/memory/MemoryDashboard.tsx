
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  ListTodo, 
  GitBranch, 
  Database, 
  FileText, 
  Book, 
  Settings,
  Search
} from 'lucide-react';

interface MemoryStats {
  conversations: number;
  plans: number;
  decisions: number;
  apps: number;
  instructions: number;
  knowledge: number;
  context: number;
}

export default function MemoryDashboard() {
  const [stats, setStats] = useState<MemoryStats>({
    conversations: 0,
    plans: 0,
    decisions: 0,
    apps: 0,
    instructions: 0,
    knowledge: 0,
    context: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch stats from all endpoints
      const responses = await Promise.all([
        fetch('/api/memory/conversations?limit=1'),
        fetch('/api/memory/plans?limit=1'),
        fetch('/api/memory/decisions?limit=1'),
        fetch('/api/memory/app-registry?limit=1'),
        fetch('/api/memory/instructions?limit=1'),
        fetch('/api/memory/knowledge?limit=1'),
        fetch('/api/memory/context'),
      ]);

      const data = await Promise.all(responses.map(r => r.json()));

      setStats({
        conversations: data[0].pagination?.total || 0,
        plans: data[1].pagination?.total || 0,
        decisions: data[2].pagination?.total || 0,
        apps: data[3].pagination?.total || 0,
        instructions: data[4].pagination?.total || 0,
        knowledge: data[5].pagination?.total || 0,
        context: data[6].data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Conversations',
      value: stats.conversations,
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/memory/conversations',
    },
    {
      title: 'Plans',
      value: stats.plans,
      icon: ListTodo,
      color: 'text-green-600',
      bg: 'bg-green-50',
      href: '/memory/plans',
    },
    {
      title: 'Decisions',
      value: stats.decisions,
      icon: GitBranch,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      href: '/memory/decisions',
    },
    {
      title: 'Applications',
      value: stats.apps,
      icon: Database,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      href: '/memory/apps',
    },
    {
      title: 'Instructions',
      value: stats.instructions,
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      href: '/memory/instructions',
    },
    {
      title: 'Knowledge Base',
      value: stats.knowledge,
      icon: Book,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      href: '/memory/knowledge',
    },
    {
      title: 'Context',
      value: stats.context,
      icon: Settings,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      href: '/memory/context',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Persistent Memory System</h1>
          <p className="text-gray-600 mt-1">
            Zero-drift orchestration through comprehensive memory management
          </p>
        </div>
        <Button>
          <Search className="w-4 h-4 mr-2" />
          Search Memory
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(7)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => window.location.href = card.href}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Total records tracked
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">Plan</Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Implementation plan updated
                  </p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">Decision</Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Architecture decision logged
                  </p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">App</Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    New satellite app registered
                  </p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory Coverage</span>
                <Badge variant="success">100%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Context Freshness</span>
                <Badge variant="success">Fresh</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Knowledge Base</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-save</span>
                <Badge variant="success">Enabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
