
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { 
  Database, 
  FileText, 
  TrendingUp, 
  Activity,
  Search,
  FolderOpen,
  BarChart3,
  PlayCircle
} from 'lucide-react';

export default function KnowledgeSmelterPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/knowledge-smelter/reports?type=summary');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Knowledge Smelter</h1>
        <p className="text-muted-foreground">
          AI-powered document processing and intelligent archive system
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Files</p>
              <p className="text-3xl font-bold">
                {stats?.overview?.totalFiles?.toLocaleString() || 0}
              </p>
            </div>
            <Database className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Size</p>
              <p className="text-3xl font-bold">
                {stats?.overview?.totalSizeGB?.toFixed(2) || 0} GB
              </p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Processed</p>
              <p className="text-3xl font-bold">
                {stats?.overview?.processingComplete || 0}
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Confidence</p>
              <p className="text-3xl font-bold">
                {stats?.confidence?.high || 0}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/knowledge-smelter/batches">
          <Card className="p-6 hover:bg-accent cursor-pointer transition-colors">
            <div className="flex items-center space-x-4">
              <PlayCircle className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-semibold">Batch Processing</p>
                <p className="text-sm text-muted-foreground">Create and manage batches</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/knowledge-smelter/search">
          <Card className="p-6 hover:bg-accent cursor-pointer transition-colors">
            <div className="flex items-center space-x-4">
              <Search className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-semibold">Search Archive</p>
                <p className="text-sm text-muted-foreground">Find files instantly</p>
              </div>
            </div>
          </Card>
        </Link>

        <Card className="p-6 hover:bg-accent cursor-pointer transition-colors">
          <div className="flex items-center space-x-4">
            <FolderOpen className="h-8 w-8 text-purple-500" />
            <div>
              <p className="font-semibold">Job Folders</p>
              <p className="text-sm text-muted-foreground">Reconstruct projects</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:bg-accent cursor-pointer transition-colors">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-orange-500" />
            <div>
              <p className="font-semibold">Reports</p>
              <p className="text-sm text-muted-foreground">Analytics & insights</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Classification Breakdown */}
      {stats?.fileTypes && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">File Types Distribution</h3>
          <div className="space-y-4">
            {stats.fileTypes.slice(0, 10).map((item: any) => {
              const percentage = (item._count / stats.overview.totalFiles) * 100;
              return (
                <div key={item.fileType}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.fileType}</span>
                    <span className="text-sm text-muted-foreground">
                      {item._count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Confidence Distribution */}
      {stats?.confidence && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Classification Confidence</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {stats.confidence.high}
              </p>
              <p className="text-sm text-muted-foreground">High (≥85%)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {stats.confidence.medium}
              </p>
              <p className="text-sm text-muted-foreground">Medium (50-84%)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {stats.confidence.low}
              </p>
              <p className="text-sm text-muted-foreground">Low (&lt;50%)</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tag Statistics */}
      {stats?.tags && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tag Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Tags</p>
              <p className="text-2xl font-bold">{stats.tags.totalTags}</p>
            </div>
            {Object.entries(stats.tags.tagCounts || {}).slice(0, 3).map(([key, count]: any) => (
              <div key={key}>
                <p className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
