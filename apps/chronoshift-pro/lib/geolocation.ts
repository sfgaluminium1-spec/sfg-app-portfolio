
'use client';

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface GeofenceConfig {
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in meters
  name: string;
}

// SFG Aluminium operational site geofence
const SFG_GEOFENCE: GeofenceConfig = {
  center: {
    latitude: 53.4644, // Approximate coordinates for Clayton Lane South, Manchester M12 5PG
    longitude: -2.1949,
  },
  radius: 50, // 50 meters
  name: "SFG Aluminium Ltd - Manchester Site"
};

export class GeolocationService {
  private static instance: GeolocationService;
  private watchId: number | null = null;
  private currentPosition: GeolocationData | null = null;
  private onLocationUpdate?: (location: GeolocationData) => void;

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  // Check if geolocation is supported
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  // Get current position with high accuracy
  async getCurrentPosition(options: {
    timeout?: number;
    maximumAge?: number;
    enableHighAccuracy?: boolean;
  } = {}): Promise<GeolocationData> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation is not supported by this device/browser'));
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds
        maximumAge: 60000, // 1 minute cache
        ...options,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: GeolocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          
          this.currentPosition = locationData;
          resolve(locationData);
        },
        (error) => {
          let errorMessage = 'Location access failed';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services and reload the page.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in meters
  }

  // Check if current location is within SFG site geofence
  isWithinSiteGeofence(location: GeolocationData): {
    isWithin: boolean;
    distance: number;
    siteName: string;
  } {
    const distance = this.calculateDistance(
      location.latitude,
      location.longitude,
      SFG_GEOFENCE.center.latitude,
      SFG_GEOFENCE.center.longitude
    );

    return {
      isWithin: distance <= SFG_GEOFENCE.radius,
      distance: Math.round(distance),
      siteName: SFG_GEOFENCE.name,
    };
  }

  // Get human-readable address from coordinates (reverse geocoding)
  async getAddressFromCoordinates(
    latitude: number, 
    longitude: number
  ): Promise<string> {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      // Build address string
      const addressParts = [
        data.locality,
        data.principalSubdivision,
        data.countryName
      ].filter(Boolean);
      
      return addressParts.join(', ') || 'Unknown location';
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  }

  // Validate location for timesheet submission
  async validateLocationForTimesheet(): Promise<{
    isValid: boolean;
    location: GeolocationData;
    geofenceCheck: {
      isWithin: boolean;
      distance: number;
      siteName: string;
    };
    address: string;
    message: string;
  }> {
    try {
      // Get current high-accuracy position
      const location = await this.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 30000, // 30 seconds max age for timesheet submission
      });

      // Check geofence
      const geofenceCheck = this.isWithinSiteGeofence(location);
      
      // Get address
      const address = await this.getAddressFromCoordinates(
        location.latitude, 
        location.longitude
      );

      location.address = address;

      let message = '';
      let isValid = true;

      if (!geofenceCheck.isWithin) {
        isValid = false;
        message = `You are ${geofenceCheck.distance}m from the work site. Please be within ${SFG_GEOFENCE.radius}m of ${geofenceCheck.siteName} to submit timesheets.`;
      } else {
        message = `Location verified: ${address} (${geofenceCheck.distance}m from site)`;
      }

      return {
        isValid,
        location,
        geofenceCheck,
        address,
        message,
      };
    } catch (error: any) {
      return {
        isValid: false,
        location: {
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          timestamp: Date.now(),
        },
        geofenceCheck: {
          isWithin: false,
          distance: 999999,
          siteName: SFG_GEOFENCE.name,
        },
        address: 'Location unavailable',
        message: error.message || 'Failed to get location. Location tracking is required for timesheet submission.',
      };
    }
  }

  // Request permission and show user-friendly prompts
  async requestLocationPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this device/browser');
    }

    // Check current permission state
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'granted') {
          return true;
        } else if (permission.state === 'denied') {
          throw new Error('Location access has been permanently denied. Please enable it in your browser settings and reload the page.');
        }
      } catch (error) {
        // Permissions API might not be supported, continue with direct request
      }
    }

    // Try to get position to trigger permission prompt
    try {
      await this.getCurrentPosition({ timeout: 10000 });
      return true;
    } catch (error: any) {
      if (error.message.includes('denied')) {
        throw new Error('Location access denied. Please allow location access and reload the page to submit timesheets.');
      }
      throw error;
    }
  }

  // Clear cached position
  clearCache(): void {
    this.currentPosition = null;
  }

  // Get last known position
  getLastKnownPosition(): GeolocationData | null {
    return this.currentPosition;
  }
}

// Export singleton instance
export const geolocationService = GeolocationService.getInstance();

// Utility function for components
export const getCurrentLocationForTimesheet = async () => {
  return await geolocationService.validateLocationForTimesheet();
};

// Privacy compliance helper
export const getLocationPrivacyNotice = () => {
  return {
    title: "Location Data Privacy Notice",
    content: `SFG Aluminium Ltd collects your location data only when you submit timesheets to verify you are at the authorized work site (${SFG_GEOFENCE.name}). 

Location data is:
• Only captured when you press 'Submit' on timesheets
• Used solely for work verification purposes
• Stored securely for 3 years as required by HMRC
• Never used for continuous tracking
• Not shared with third parties

You can opt out of location tracking, but you will need to use manual timesheet submission through your supervisor.`,
  };
};
