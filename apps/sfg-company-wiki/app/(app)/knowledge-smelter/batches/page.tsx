
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  PlayCircle, 
  PauseCircle, 
  Plus, 
  FileText, 
  Clock,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newBatch, setNewBatch] = useState({
    batchName: '',
    sourceLocation: '',
    siteId: '',
    driveId: '',
    maxFiles: 100
  });

  useEffect(() => {
    fetchBatches();
    const interval = setInterval(fetchBatches, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch('/api/knowledge-smelter/batch');
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBatch = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/knowledge-smelter/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBatch)
      });

      if (!response.ok) throw new Error('Failed to create batch');

      toast.success('Batch created successfully');
      fetchBatches();
      setNewBatch({
        batchName: '',
        sourceLocation: '',
        siteId: '',
        driveId: '',
        maxFiles: 100
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const startBatch = async (batchId: string) => {
    try {
      const response = await fetch(`/api/knowledge-smelter/batch/${batchId}/start`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to start batch');

      toast.success('Batch processing started');
      fetchBatches();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const pauseBatch = async (batchId: string) => {
    try {
      const response = await fetch(`/api/knowledge-smelter/batch/${batchId}/pause`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to pause batch');

      toast.success('Batch paused');
      fetchBatches();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: { variant: 'secondary', icon: Clock },
      PROCESSING: { variant: 'default', icon: Loader2 },
      COMPLETED: { variant: 'default', icon: CheckCircle2, className: 'bg-green-500' },
      FAILED: { variant: 'destructive', icon: XCircle },
      PAUSED: { variant: 'outline', icon: PauseCircle }
    };

    const config = variants[status] || variants.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Batch Processing</h1>
          <p className="text-muted-foreground">Manage file processing batches</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Batch Name</Label>
                <Input
                  value={newBatch.batchName}
                  onChange={(e) => setNewBatch({ ...newBatch, batchName: e.target.value })}
                  placeholder="Q1 2025 Processing"
                />
              </div>
              <div>
                <Label>Source Location</Label>
                <Input
                  value={newBatch.sourceLocation}
                  onChange={(e) => setNewBatch({ ...newBatch, sourceLocation: e.target.value })}
                  placeholder="SharePoint/Documents/2024"
                />
              </div>
              <div>
                <Label>Site ID</Label>
                <Input
                  value={newBatch.siteId}
                  onChange={(e) => setNewBatch({ ...newBatch, siteId: e.target.value })}
                  placeholder="site-id-from-sharepoint"
                />
              </div>
              <div>
                <Label>Drive ID</Label>
                <Input
                  value={newBatch.driveId}
                  onChange={(e) => setNewBatch({ ...newBatch, driveId: e.target.value })}
                  placeholder="drive-id-from-sharepoint"
                />
              </div>
              <div>
                <Label>Max Files</Label>
                <Input
                  type="number"
                  value={newBatch.maxFiles}
                  onChange={(e) => setNewBatch({ ...newBatch, maxFiles: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={createBatch} disabled={isCreating} className="w-full">
                {isCreating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Create Batch
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Batches List */}
      <div className="grid grid-cols-1 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{batch.batchName}</h3>
                  <p className="text-sm text-muted-foreground">{batch.sourceLocation}</p>
                </div>
                {getStatusBadge(batch.status)}
              </div>

              {/* Progress */}
              {batch.status === 'PROCESSING' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {batch.filesProcessed}/{batch.filesQueued} files
                    </span>
                  </div>
                  <Progress value={batch.progress} />
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Queued</p>
                  <p className="text-2xl font-bold">{batch.filesQueued}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Processed</p>
                  <p className="text-2xl font-bold">{batch.filesProcessed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Succeeded</p>
                  <p className="text-2xl font-bold text-green-600">{batch.filesSucceeded}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{batch.filesFailed}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {batch.status === 'PENDING' && (
                  <Button onClick={() => startBatch(batch.id)} size="sm">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Processing
                  </Button>
                )}
                {batch.status === 'PROCESSING' && (
                  <Button onClick={() => pauseBatch(batch.id)} size="sm" variant="outline">
                    <PauseCircle className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Report
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {batches.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Batches Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first batch to start processing files
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
