
// SFG Aluminium PWA Service Worker
const CACHE_NAME = 'sfg-payroll-v2.1.3';
const OFFLINE_URL = '/offline';
const API_CACHE_NAME = 'sfg-api-cache';

// Critical assets to cache for offline functionality
const CACHE_URLS = [
  '/',
  '/employee/dashboard',
  '/employee/timesheet',
  '/employee/expenses',
  '/employee/holidays',
  '/admin/dashboard',
  '/admin/timesheets',
  '/login',
  '/offline',
  // Static assets
  '/_next/static/css/app/layout.css',
  '/manifest.json'
];

// Install service worker and cache critical resources
self.addEventListener('install', (event) => {
  console.log('SFG Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching critical resources');
      return cache.addAll(CACHE_URLS);
    })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SFG Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

// Network-first strategy for API calls, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle static assets
  event.respondWith(handleStaticAssets(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('API request failed, trying cache:', request.url);
    
    // Try to serve from cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline indicator for failed API calls
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This request will be synced when you\'re back online' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('Navigation request failed, serving from cache:', request.url);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline page for unknown routes
    return caches.match(OFFLINE_URL);
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  // Try cache first for static assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch from network and cache
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Failed to fetch static asset:', request.url);
    throw error;
  }
}

// Handle background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-timesheets') {
    event.waitUntil(syncOfflineTimesheets());
  }
  
  if (event.tag === 'sync-expenses') {
    event.waitUntil(syncOfflineExpenses());
  }
  
  if (event.tag === 'sync-holidays') {
    event.waitUntil(syncOfflineHolidays());
  }
});

// Sync offline timesheet entries
async function syncOfflineTimesheets() {
  try {
    const offlineData = await getStoredData('offline-timesheets');
    
    for (const entry of offlineData) {
      try {
        const response = await fetch('/api/timesheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry.data),
        });
        
        if (response.ok) {
          await removeStoredData('offline-timesheets', entry.id);
          console.log('Synced timesheet entry:', entry.id);
        }
      } catch (error) {
        console.error('Failed to sync timesheet:', entry.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Sync offline expense entries
async function syncOfflineExpenses() {
  try {
    const offlineData = await getStoredData('offline-expenses');
    
    for (const entry of offlineData) {
      try {
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry.data),
        });
        
        if (response.ok) {
          await removeStoredData('offline-expenses', entry.id);
          console.log('Synced expense entry:', entry.id);
        }
      } catch (error) {
        console.error('Failed to sync expense:', entry.id, error);
      }
    }
  } catch (error) {
    console.error('Expense sync failed:', error);
  }
}

// Sync offline holiday requests
async function syncOfflineHolidays() {
  try {
    const offlineData = await getStoredData('offline-holidays');
    
    for (const entry of offlineData) {
      try {
        const response = await fetch('/api/holidays', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry.data),
        });
        
        if (response.ok) {
          await removeStoredData('offline-holidays', entry.id);
          console.log('Synced holiday request:', entry.id);
        }
      } catch (error) {
        console.error('Failed to sync holiday:', entry.id, error);
      }
    }
  } catch (error) {
    console.error('Holiday sync failed:', error);
  }
}

// Helper function to get stored offline data
async function getStoredData(key) {
  try {
    if ('indexedDB' in self) {
      // Use IndexedDB for larger storage
      return await getFromIndexedDB(key);
    } else {
      // Fallback to localStorage
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    }
  } catch (error) {
    console.error('Failed to get stored data:', error);
    return [];
  }
}

// Helper function to remove stored data
async function removeStoredData(key, id) {
  try {
    if ('indexedDB' in self) {
      return await removeFromIndexedDB(key, id);
    } else {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = data.filter(item => item.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
  } catch (error) {
    console.error('Failed to remove stored data:', error);
  }
}

// IndexedDB helper functions
async function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SFGPayrollDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function removeFromIndexedDB(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SFGPayrollDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}
