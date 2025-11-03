
'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { pwaInstaller } from '@/lib/pwa-utils';

export function InstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has dismissed recently (only on client)
    try {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (dismissed && new Date(dismissed) > new Date()) {
        setShowPrompt(false);
        return;
      }
    } catch (error) {
      // localStorage not available, continue
    }

    const handleInstallAvailable = () => {
      setShowPrompt(true);
    };

    const handleInstallCompleted = () => {
      setShowPrompt(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('pwa-install-available', handleInstallAvailable);
      window.addEventListener('pwa-install-completed', handleInstallCompleted);

      return () => {
        window.removeEventListener('pwa-install-available', handleInstallAvailable);
        window.removeEventListener('pwa-install-completed', handleInstallCompleted);
      };
    }
  }, []);

  const handleInstall = async () => {
    setInstalling(true);
    
    try {
      const installed = await pwaInstaller.promptInstall();
      if (installed) {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Don't show again for 7 days (only on client)
    try {
      const dismissTime = new Date();
      dismissTime.setDate(dismissTime.getDate() + 7);
      localStorage.setItem('pwa-install-dismissed', dismissTime.toISOString());
    } catch (error) {
      // localStorage not available, continue
    }
  };

  // Prevent hydration mismatches by not rendering until mounted
  if (!mounted || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-sm z-50 animate-slide-up">
      <Card className="warren-card shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-warren-blue-100 dark:bg-warren-blue-900/30 rounded-lg">
                <Smartphone className="w-5 h-5 text-warren-blue-600" />
              </div>
              Install App
            </CardTitle>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Get the full SFG Payroll experience with offline access and push notifications
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Works offline</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Faster loading</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Push notifications</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Native app experience</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              disabled={installing}
              className="flex-1 warren-button-primary"
            >
              {installing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Installing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Install</span>
                </div>
              )}
            </Button>
            
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="px-3"
            >
              Later
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-warren-gray-500 text-center">
            Free and takes up minimal storage space
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
