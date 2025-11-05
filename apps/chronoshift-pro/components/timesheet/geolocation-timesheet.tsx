
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  Navigation, 
  Shield,
  Calendar
} from 'lucide-react';
import { geolocationService, getCurrentLocationForTimesheet, getLocationPrivacyNotice } from '@/lib/geolocation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface TimesheetEntry {
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
    timestamp: number;
  };
}

interface GeolocationTimesheetProps {
  employeeId?: string;
  onSubmit: (data: TimesheetEntry & { location: any }) => Promise<void>;
}

export function GeolocationTimesheet({ employeeId, onSubmit }: GeolocationTimesheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<{
    checking: boolean;
    valid: boolean;
    message: string;
    location?: any;
  }>({
    checking: false,
    valid: false,
    message: 'Location not verified',
  });

  const [timesheetData, setTimesheetData] = useState<TimesheetEntry>({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    breakMinutes: 30,
    description: '',
  });

  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  useEffect(() => {
    // Check if geolocation is supported
    if (!geolocationService.isSupported()) {
      setLocationStatus({
        checking: false,
        valid: false,
        message: 'Geolocation not supported by this device/browser',
      });
    }
  }, []);

  const requestLocationAccess = async () => {
    try {
      const granted = await geolocationService.requestLocationPermission();
      setLocationPermissionGranted(granted);
      if (granted) {
        toast.success('Location access granted');
        await verifyLocation();
      }
    } catch (error: any) {
      toast.error(error.message);
      setLocationStatus({
        checking: false,
        valid: false,
        message: error.message,
      });
    }
  };

  const verifyLocation = async () => {
    setLocationStatus(prev => ({ ...prev, checking: true, message: 'Checking location...' }));
    
    try {
      const locationValidation = await getCurrentLocationForTimesheet();
      
      setLocationStatus({
        checking: false,
        valid: locationValidation.isValid,
        message: locationValidation.message,
        location: locationValidation.location,
      });

      if (locationValidation.isValid) {
        toast.success('Location verified successfully');
      } else {
        toast.error('Location verification failed');
      }
    } catch (error: any) {
      setLocationStatus({
        checking: false,
        valid: false,
        message: error.message || 'Failed to verify location',
      });
      toast.error('Unable to verify location');
    }
  };

  const calculateHours = () => {
    if (!timesheetData.startTime || !timesheetData.endTime) return 0;
    
    const start = new Date(`2000-01-01 ${timesheetData.startTime}`);
    const end = new Date(`2000-01-01 ${timesheetData.endTime}`);
    
    if (end <= start) return 0;
    
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Subtract break time
    const breakHours = timesheetData.breakMinutes / 60;
    
    return Math.max(0, diffHours - breakHours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!locationStatus.valid) {
      toast.error('Please verify your location first');
      return;
    }

    if (!timesheetData.startTime || !timesheetData.endTime) {
      toast.error('Please enter start and end times');
      return;
    }

    const totalHours = calculateHours();
    if (totalHours <= 0) {
      toast.error('End time must be after start time');
      return;
    }

    setIsLoading(true);
    
    try {
      // Get final location verification at submission
      const finalLocationCheck = await getCurrentLocationForTimesheet();
      
      if (!finalLocationCheck.isValid) {
        throw new Error(finalLocationCheck.message);
      }

      const submissionData = {
        ...timesheetData,
        location: {
          ...finalLocationCheck.location,
          geofenceCheck: finalLocationCheck.geofenceCheck,
          verifiedAt: new Date().toISOString(),
        },
        totalHours,
        status: 'SUBMITTED',
      };

      await onSubmit(submissionData);
      
      toast.success('Timesheet submitted successfully');
      
      // Reset form
      setTimesheetData({
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '',
        endTime: '',
        breakMinutes: 30,
        description: '',
      });
      
      setLocationStatus({
        checking: false,
        valid: false,
        message: 'Location not verified',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit timesheet');
    } finally {
      setIsLoading(false);
    }
  };

  const privacyNotice = getLocationPrivacyNotice();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Submit Timesheet
          <Badge variant="outline" className="ml-auto">
            Location Required
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Location Verification Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Location Verification</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Info
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{privacyNotice.title}</DialogTitle>
                </DialogHeader>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {privacyNotice.content}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            locationStatus.valid 
              ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
              : 'border-amber-200 bg-amber-50 dark:bg-amber-900/20'
          }`}>
            <div className="flex items-start gap-3">
              {locationStatus.checking ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin mt-0.5" />
              ) : locationStatus.valid ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              )}
              
              <div className="flex-1">
                <p className={`font-medium ${
                  locationStatus.valid ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'
                }`}>
                  {locationStatus.checking ? 'Verifying location...' : locationStatus.message}
                </p>
                
                {locationStatus.location && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p><strong>Address:</strong> {locationStatus.location.address}</p>
                    <p><strong>Accuracy:</strong> ±{locationStatus.location.accuracy}m</p>
                    <p><strong>Verified:</strong> {format(new Date(locationStatus.location.timestamp), 'HH:mm:ss')}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              {!locationPermissionGranted && (
                <Button 
                  onClick={requestLocationAccess}
                  size="sm"
                  variant="outline"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Grant Location Access
                </Button>
              )}
              
              {locationPermissionGranted && (
                <Button 
                  onClick={verifyLocation}
                  size="sm"
                  variant="outline"
                  disabled={locationStatus.checking}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {locationStatus.checking ? 'Checking...' : 'Verify Location'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Timesheet Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                Date
                <Calendar className="w-4 h-4 inline ml-1" />
              </Label>
              <Input
                id="date"
                type="date"
                value={timesheetData.date}
                onChange={(e) => setTimesheetData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="break">Break Time (minutes)</Label>
              <Input
                id="break"
                type="number"
                min="0"
                max="120"
                value={timesheetData.breakMinutes}
                onChange={(e) => setTimesheetData(prev => ({ ...prev, breakMinutes: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={timesheetData.startTime}
                onChange={(e) => setTimesheetData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={timesheetData.endTime}
                onChange={(e) => setTimesheetData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          {timesheetData.startTime && timesheetData.endTime && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Total Hours: {calculateHours().toFixed(2)} hours
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                Includes {timesheetData.breakMinutes} minutes break deduction
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Work Description (Optional)</Label>
            <Textarea
              id="description"
              value={timesheetData.description}
              onChange={(e) => setTimesheetData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the work performed today..."
              rows={3}
            />
          </div>

          <div className="pt-4 border-t">
            <Button
              type="submit"
              className="w-full"
              disabled={!locationStatus.valid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Timesheet...
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Submit Timesheet
                </>
              )}
            </Button>

            {!locationStatus.valid && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 text-center">
                Location verification required before submission
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
