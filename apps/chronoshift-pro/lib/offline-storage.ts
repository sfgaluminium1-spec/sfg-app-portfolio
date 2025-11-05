
// SFG Aluminium Offline Storage Service
// Handles local data storage and sync when online

export interface OfflineEntry {
  id: string;
  type: 'timesheet' | 'expense' | 'holiday';
  data: any;
  timestamp: number;
  synced: boolean;
}

export class OfflineStorageService {
  private dbName = 'SFGPayrollDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('offline-timesheets')) {
          const timesheetStore = db.createObjectStore('offline-timesheets', { keyPath: 'id' });
          timesheetStore.createIndex('timestamp', 'timestamp', { unique: false });
          timesheetStore.createIndex('synced', 'synced', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('offline-expenses')) {
          const expenseStore = db.createObjectStore('offline-expenses', { keyPath: 'id' });
          expenseStore.createIndex('timestamp', 'timestamp', { unique: false });
          expenseStore.createIndex('synced', 'synced', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('offline-holidays')) {
          const holidayStore = db.createObjectStore('offline-holidays', { keyPath: 'id' });
          holidayStore.createIndex('timestamp', 'timestamp', { unique: false });
          holidayStore.createIndex('synced', 'synced', { unique: false });
        }
      };
    });
  }

  // Store data offline
  async storeOffline(entry: OfflineEntry): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([`offline-${entry.type}s`], 'readwrite');
      const store = transaction.objectStore(`offline-${entry.type}s`);
      const request = store.put(entry);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get unsynced entries
  async getUnsyncedEntries(type: 'timesheet' | 'expense' | 'holiday'): Promise<OfflineEntry[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([`offline-${type}s`], 'readonly');
      const store = transaction.objectStore(`offline-${type}s`);
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(false)); // Get unsynced entries
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Mark entry as synced
  async markSynced(type: 'timesheet' | 'expense' | 'holiday', id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([`offline-${type}s`], 'readwrite');
      const store = transaction.objectStore(`offline-${type}s`);
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const entry = getRequest.result;
        if (entry) {
          entry.synced = true;
          const putRequest = store.put(entry);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Remove synced entry
  async removeSynced(type: 'timesheet' | 'expense' | 'holiday', id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([`offline-${type}s`], 'readwrite');
      const store = transaction.objectStore(`offline-${type}s`);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get count of unsynced entries
  async getUnsyncedCount(): Promise<{ timesheets: number; expenses: number; holidays: number }> {
    const [timesheets, expenses, holidays] = await Promise.all([
      this.getUnsyncedEntries('timesheet'),
      this.getUnsyncedEntries('expense'),
      this.getUnsyncedEntries('holiday')
    ]);

    return {
      timesheets: timesheets.length,
      expenses: expenses.length,
      holidays: holidays.length
    };
  }

  // Sync all unsynced entries
  async syncAll(): Promise<void> {
    const types: Array<'timesheet' | 'expense' | 'holiday'> = ['timesheet', 'expense', 'holiday'];
    
    for (const type of types) {
      await this.syncType(type);
    }
  }

  // Sync specific type
  private async syncType(type: 'timesheet' | 'expense' | 'holiday'): Promise<void> {
    const entries = await this.getUnsyncedEntries(type);
    
    for (const entry of entries) {
      try {
        const endpoint = `/api/${type}s`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry.data),
        });

        if (response.ok) {
          await this.removeSynced(type, entry.id);
        } else {
          console.error(`Failed to sync ${type}:`, entry.id, response.statusText);
        }
      } catch (error) {
        console.error(`Error syncing ${type}:`, entry.id, error);
      }
    }
  }
}

// Singleton instance
export const offlineStorage = new OfflineStorageService();

// Initialize on load
if (typeof window !== 'undefined') {
  offlineStorage.init().catch(console.error);
}
