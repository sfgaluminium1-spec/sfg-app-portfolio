
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  WifiOff, 
  Wifi, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OfflineTimesheet {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  notes: string;
  timestamp: number;
  synced: boolean;
}

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingSync: number;
  syncInProgress: boolean;
}

export function OfflineSyncManager() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingSync: 0,
    syncInProgress: false
  });
  const [offlineTimesheets, setOfflineTimesheets] = useState<OfflineTimesheet[]>([]);

  useEffect(() => {
    // Load offline data from localStorage
    loadOfflineData();
    
    // Set up online/offline event listeners
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      toast.success('Connection restored - syncing data...');
      handleAutoSync();
    };
    
    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
      toast.error('Connection lost - working offline');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Auto-sync every 5 minutes when online
    const syncInterval = setInterval(() => {
      if (navigator.onLine && offlineTimesheets.some(t => !t.synced)) {
        handleAutoSync();
      }
    }, 5 * 60 * 1000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, []);

  const loadOfflineData = () => {
    try {
      const stored = localStorage.getItem('sfg_offline_timesheets');
      if (stored) {
        const timesheets = JSON.parse(stored);
        setOfflineTimesheets(timesheets);
        setSyncStatus(prev => ({
          ...prev,
          pendingSync: timesheets.filter((t: OfflineTimesheet) => !t.synced).length
        }));
      }
      
      const lastSync = localStorage.getItem('sfg_last_sync');
      if (lastSync) {
        setSyncStatus(prev => ({ ...prev, lastSync: new Date(lastSync) }));
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  const saveToOfflineStorage = (timesheet: OfflineTimesheet) => {
    try {
      const existing = [...offlineTimesheets];
      const index = existing.findIndex(t => t.id === timesheet.id);
      
      if (index >= 0) {
        existing[index] = timesheet;
      } else {
        existing.push(timesheet);
      }
      
      localStorage.setItem('sfg_offline_timesheets', JSON.stringify(existing));
      setOfflineTimesheets(existing);
      setSyncStatus(prev => ({
        ...prev,
        pendingSync: existing.filter(t => !t.synced).length
      }));
      
      toast.success('Timesheet saved offline');
    } catch (error) {
      console.error('Error saving offline data:', error);
      toast.error('Failed to save timesheet offline');
    }
  };

  const handleAutoSync = async () => {
    if (!navigator.onLine || syncStatus.syncInProgress) return;
    
    setSyncStatus(prev => ({ ...prev, syncInProgress: true }));
    
    try {
      const unsyncedTimesheets = offlineTimesheets.filter(t => !t.synced);
      
      for (const timesheet of unsyncedTimesheets) {
        const response = await fetch('/api/timesheets/offline-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(timesheet)
        });
        
        if (response.ok) {
          // Mark as synced
          timesheet.synced = true;
        } else {
          console.error('Failed to sync timesheet:', timesheet.id);
        }
      }
      
      // Update storage
      localStorage.setItem('sfg_offline_timesheets', JSON.stringify(offlineTimesheets));
      localStorage.setItem('sfg_last_sync', new Date().toISOString());
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        pendingSync: offlineTimesheets.filter(t => !t.synced).length,
        syncInProgress: false
      }));
      
      if (unsyncedTimesheets.length > 0) {
        toast.success(`Synced ${unsyncedTimesheets.length} timesheets`);
      }
      
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Failed to sync offline data');
      setSyncStatus(prev => ({ ...prev, syncInProgress: false }));
    }
  };

  const handleManualSync = () => {
    if (!navigator.onLine) {
      toast.error('No internet connection available');
      return;
    }
    
    handleAutoSync();
  };

  const clearOfflineData = () => {
    localStorage.removeItem('sfg_offline_timesheets');
    localStorage.removeItem('sfg_last_sync');
    setOfflineTimesheets([]);
    setSyncStatus(prev => ({ ...prev, pendingSync: 0, lastSync: null }));
    toast.success('Offline data cleared');
  };

  const downloadOfflineData = () => {
    try {
      const dataStr = JSON.stringify(offlineTimesheets, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `sfg-offline-timesheets-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast.success('Offline data downloaded');
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error('Failed to download offline data');
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className={`warren-card ${syncStatus.isOnline ? 'border-green-200' : 'border-red-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {syncStatus.isOnline ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            Connection Status
          </CardTitle>
          <CardDescription>
            {syncStatus.isOnline ? 'Online - automatic sync enabled' : 'Offline - working in offline mode'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-warren-gray-400">Status</p>
              <Badge className={syncStatus.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {syncStatus.isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-warren-gray-400">Pending Sync</p>
              <p className="font-semibold text-orange-600">{syncStatus.pendingSync} items</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-warren-gray-400">Last Sync</p>
              <p className="font-medium">
                {syncStatus.lastSync 
                  ? syncStatus.lastSync.toLocaleString('en-GB') 
                  : 'Never'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-warren-gray-400">Offline Data</p>
              <p className="font-medium">{offlineTimesheets.length} timesheets</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleManualSync}
              disabled={!syncStatus.isOnline || syncStatus.syncInProgress}
              className="warren-button-primary"
            >
              {syncStatus.syncInProgress ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Sync Now
            </Button>
            
            <Button 
              onClick={downloadOfflineData}
              variant="outline"
              disabled={offlineTimesheets.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            
            <Button 
              onClick={clearOfflineData}
              variant="outline"
              disabled={offlineTimesheets.length === 0}
            >
              Clear Offline Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Timesheets */}
      <Card className="warren-card">
        <CardHeader>
          <CardTitle>Offline Timesheets</CardTitle>
          <CardDescription>
            Timesheets stored locally when connection is unavailable
          </CardDescription>
        </CardHeader>
        <CardContent>
          {offlineTimesheets.length > 0 ? (
            <div className="space-y-3">
              {offlineTimesheets.map((timesheet) => (
                <div 
                  key={timesheet.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {new Date(timesheet.date).toLocaleDateString('en-GB')}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-warren-gray-400">
                        {timesheet.startTime} - {timesheet.endTime}
                      </span>
                      <Badge className={timesheet.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {timesheet.synced ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {timesheet.synced ? 'Synced' : 'Pending'}
                      </Badge>
                    </div>
                    {timesheet.notes && (
                      <p className="text-sm text-gray-600 dark:text-warren-gray-400 mt-1">
                        {timesheet.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-warren-gray-500">
                    {new Date(timesheet.timestamp).toLocaleString('en-GB')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-warren-gray-400">
              <WifiOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No offline timesheets stored</p>
              <p className="text-sm">Data will appear here when working offline</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offline Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Offline Mode Instructions
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Timesheets are automatically saved locally when offline</li>
                <li>• Data syncs automatically when connection is restored</li>
                <li>• Use "Sync Now" to manually sync when online</li>
                <li>• Export offline data as backup if needed</li>
                <li>• Ensure you sync before Tuesday 16:00 deadline</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
