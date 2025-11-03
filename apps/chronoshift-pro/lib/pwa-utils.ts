
// PWA Utilities for SFG Aluminium Payroll System

export class PWAInstaller {
  private deferredPrompt: any = null;
  private isInstallable = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.isInstallable = true;
      this.showInstallButton();
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.deferredPrompt = null;
      this.isInstallable = false;
      this.hideInstallButton();
    });

    // Register service worker
    this.registerServiceWorker();
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateAvailable();
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt || !this.isInstallable) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const result = await this.deferredPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
      this.isInstallable = false;
    }
  }

  public isInstallAvailable(): boolean {
    return this.isInstallable;
  }

  private showInstallButton() {
    // Dispatch custom event to show install button
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  }

  private hideInstallButton() {
    // Dispatch custom event to hide install button
    window.dispatchEvent(new CustomEvent('pwa-install-completed'));
  }

  private showUpdateAvailable() {
    // Dispatch custom event to show update notification
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }
}

export class OfflineSyncManager {
  private syncInProgress = false;

  public async syncPendingData(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) {
      return;
    }

    this.syncInProgress = true;

    try {
      // Sync timesheets
      await this.syncTimesheets();
      
      // Sync expenses
      await this.syncExpenses();
      
      // Sync holidays
      await this.syncHolidays();

      console.log('Offline sync completed successfully');
      
      // Dispatch sync completion event
      window.dispatchEvent(new CustomEvent('offline-sync-completed'));
    } catch (error) {
      console.error('Offline sync failed:', error);
      
      // Dispatch sync error event
      window.dispatchEvent(new CustomEvent('offline-sync-error', { detail: error }));
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncTimesheets(): Promise<void> {
    const offlineTimesheets = this.getOfflineData('offline-timesheets');
    
    for (const entry of offlineTimesheets) {
      try {
        const response = await fetch('/api/timesheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry.data),
        });

        if (response.ok) {
          this.removeOfflineData('offline-timesheets', entry.id);
        }
      } catch (error) {
        console.error('Failed to sync timesheet:', entry.id, error);
      }
    }
  }

  private async syncExpenses(): Promise<void> {
    const offlineExpenses = this.getOfflineData('offline-expenses');
    
    for (const entry of offlineExpenses) {
      try {
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry.data),
        });

        if (response.ok) {
          this.removeOfflineData('offline-expenses', entry.id);
        }
      } catch (error) {
        console.error('Failed to sync expense:', entry.id, error);
      }
    }
  }

  private async syncHolidays(): Promise<void> {
    const offlineHolidays = this.getOfflineData('offline-holidays');
    
    for (const entry of offlineHolidays) {
      try {
        const response = await fetch('/api/holidays', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry.data),
        });

        if (response.ok) {
          this.removeOfflineData('offline-holidays', entry.id);
        }
      } catch (error) {
        console.error('Failed to sync holiday:', entry.id, error);
      }
    }
  }

  private getOfflineData(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private removeOfflineData(key: string, id: string): void {
    try {
      const data = this.getOfflineData(key);
      const filtered = data.filter(item => item.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove offline data:', error);
    }
  }
}

export class NotificationManager {
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  public async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      console.log('Notification permission denied');
      return;
    }

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'sfg-payroll',
        renotify: true,
        ...options,
      });
    } else {
      new Notification(title, options);
    }
  }

  public async scheduleTimesheetReminder(): Promise<void> {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(17, 0, 0, 0); // 5 PM

    if (now < endOfDay) {
      const timeUntilReminder = endOfDay.getTime() - now.getTime();
      
      setTimeout(() => {
        this.showNotification('Timesheet Reminder', {
          body: 'Don\'t forget to submit your timesheet for today!',
          actions: [
            { action: 'submit', title: 'Submit Now' },
            { action: 'later', title: 'Remind Later' },
          ],
        });
      }, timeUntilReminder);
    }
  }
}

// Singleton instances
export const pwaInstaller = new PWAInstaller();
export const offlineSyncManager = new OfflineSyncManager();
export const notificationManager = new NotificationManager();
