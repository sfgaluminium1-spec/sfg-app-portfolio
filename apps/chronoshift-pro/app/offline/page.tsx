
'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [offlineData, setOfflineData] = useState({
    timesheets: 0,
    expenses: 0,
    holidays: 0
  });

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        // Trigger background sync when back online
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
          navigator.serviceWorker.ready.then((registration) => {
            (registration as any).sync.register('sync-timesheets');
            (registration as any).sync.register('sync-expenses');
            (registration as any).sync.register('sync-holidays');
          });
        }
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Load offline data count
    loadOfflineDataCount();

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const loadOfflineDataCount = async () => {
    try {
      // Check localStorage for offline data
      const timesheets = JSON.parse(localStorage.getItem('offline-timesheets') || '[]');
      const expenses = JSON.parse(localStorage.getItem('offline-expenses') || '[]');
      const holidays = JSON.parse(localStorage.getItem('offline-holidays') || '[]');
      
      setOfflineData({
        timesheets: timesheets.length,
        expenses: expenses.length,
        holidays: holidays.length
      });
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-warren-blue-100 dark:bg-warren-blue-900 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-8 h-8 text-warren-blue-600 dark:text-warren-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isOnline ? 'Back Online!' : 'You\'re Offline'}
          </h1>
          <p className="text-gray-600 dark:text-warren-gray-400 mt-2">
            {isOnline 
              ? 'Your data is now syncing with the server.'
              : 'Don\'t worry, you can still use the app. Your data will sync when you\'re back online.'
            }
          </p>
        </div>

        {/* Connection Status */}
        <Card className="warren-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {isOnline ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-500" />
                  Offline Mode
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isOnline 
                ? 'All features are available and data will sync automatically.'
                : 'Limited functionality available. Changes will be saved locally.'
              }
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Offline Data Summary */}
        {!isOnline && (offlineData.timesheets > 0 || offlineData.expenses > 0 || offlineData.holidays > 0) && (
          <Card className="warren-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Pending Sync
              </CardTitle>
              <CardDescription>
                Data waiting to be synced when you're back online
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {offlineData.timesheets > 0 && (
                <div className="flex justify-between">
                  <span>Timesheets:</span>
                  <span className="font-medium">{offlineData.timesheets}</span>
                </div>
              )}
              {offlineData.expenses > 0 && (
                <div className="flex justify-between">
                  <span>Expenses:</span>
                  <span className="font-medium">{offlineData.expenses}</span>
                </div>
              )}
              {offlineData.holidays > 0 && (
                <div className="flex justify-between">
                  <span>Holiday Requests:</span>
                  <span className="font-medium">{offlineData.holidays}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Available Features */}
        <Card className="warren-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Available Features</CardTitle>
            <CardDescription>
              What you can do while offline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Submit timesheets</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Create expense claims</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Request holidays</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>View cached data</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={refreshPage}
            className="w-full warren-button-primary"
            variant="default"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {isOnline ? 'Return to App' : 'Check Connection'}
          </Button>
          
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full"
          >
            Go Back
          </Button>
        </div>

        {/* Tips */}
        <div className="text-center text-sm text-gray-500 dark:text-warren-gray-500">
          <p className="mb-1">💡 <strong>Pro tip:</strong></p>
          <p>Your work is automatically saved locally and will sync when you're connected again.</p>
        </div>
      </div>
    </div>
  );
}
