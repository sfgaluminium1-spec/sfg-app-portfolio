
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { VoiceDictation } from '@/components/mobile/voice-dictation';
import { AdvancedValidation } from '@/components/validation/advanced-validation';
import { 
  Clock, 
  Copy, 
  Camera, 
  MapPin, 
  Mic, 
  Save, 
  Send,
  WifiOff,
  CheckCircle,
  AlertTriangle 
} from 'lucide-react';
import { sfgPayrollEngine } from '@/lib/sfg-business-rules';
import { offlineStorage, OfflineEntry } from '@/lib/offline-storage';
import { toast } from '@/hooks/use-toast';

const mobileTimesheetSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  breakMinutes: z.number().min(0).max(120),
  location: z.string().optional(),
  notes: z.string().optional(),
  photoCapture: z.boolean().default(false),
});

type MobileTimesheetFormData = z.infer<typeof mobileTimesheetSchema>;

interface MobileTimesheetFormProps {
  employees: any[];
  onSubmit: (data: any) => Promise<void>;
}

export function MobileTimesheetForm({ employees, onSubmit }: MobileTimesheetFormProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [calculation, setCalculation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickActions, setQuickActions] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MobileTimesheetFormData>({
    resolver: zodResolver(mobileTimesheetSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '08:00',
      endTime: '17:00',
      breakMinutes: 30,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    // Monitor online status
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    setIsOnline(navigator.onLine);

    // Load quick actions from local storage
    loadQuickActions();

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Real-time calculation using SFG business rules
  useEffect(() => {
    if (watchedValues.employeeId && watchedValues.startTime && watchedValues.endTime && watchedValues.date) {
      const employee = employees.find(e => e.id === watchedValues.employeeId);
      if (employee) {
        const calc = sfgPayrollEngine.calculateRegularShift(
          watchedValues.startTime,
          watchedValues.endTime,
          new Date(watchedValues.date),
          employee.hourlyRate,
          watchedValues.breakMinutes
        );
        setCalculation(calc);
      }
    }
  }, [watchedValues, employees]);

  const loadQuickActions = () => {
    try {
      const stored = localStorage.getItem('sfg-quick-actions');
      if (stored) {
        setQuickActions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load quick actions:', error);
    }
  };

  const saveQuickAction = (data: MobileTimesheetFormData) => {
    const action = {
      id: Date.now().toString(),
      label: `${data.startTime} - ${data.endTime}`,
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        breakMinutes: data.breakMinutes,
      },
      usageCount: 1,
      lastUsed: new Date().toISOString(),
    };

    const updated = [...quickActions.slice(0, 4), action];
    setQuickActions(updated);
    localStorage.setItem('sfg-quick-actions', JSON.stringify(updated));
  };

  const applyQuickAction = (action: any) => {
    setValue('startTime', action.data.startTime);
    setValue('endTime', action.data.endTime);
    setValue('breakMinutes', action.data.breakMinutes);
  };

  const handleValidationComplete = (results: any[]) => {
    setValidationResults(results);
    const errors = results.filter(r => r.status === 'fail');
    setHasValidationErrors(errors.length > 0);
  };

  const toggleValidation = () => {
    setShowValidation(!showValidation);
  };

  const repeatYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setValue('date', format(yesterday, 'yyyy-MM-dd'));
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue('location', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast({
            title: "Location Added",
            description: "Your current location has been recorded",
          });
        },
        (error) => {
          console.error('Location error:', error);
          toast({
            title: "Location Error",
            description: "Unable to get your current location",
            variant: "destructive",
          });
        }
      );
    }
  };

  const capturePhoto = () => {
    // Placeholder for camera functionality
    toast({
      title: "Photo Capture",
      description: "Camera feature will be available in the next update",
    });
  };

  const startVoiceNote = () => {
    // Check if Web Speech API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-GB';
      
      recognition.onstart = () => {
        toast({
          title: "Voice Recording Started",
          description: "Speak your timesheet notes clearly...",
        });
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setValue('notes', transcript);
        
        toast({
          title: "Voice Note Added",
          description: `Transcribed: "${transcript}"`,
        });
      };
      
      recognition.onerror = (event: any) => {
        toast({
          title: "Voice Recognition Error",
          description: "Unable to process voice input. Please try again.",
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        console.log('Voice recognition ended');
      };
      
      recognition.start();
    } else {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice input. Please type your notes manually.",
        variant: "destructive",
      });
    }
  };

  const onFormSubmit = async (data: MobileTimesheetFormData) => {
    setIsSubmitting(true);
    
    try {
      const employee = employees.find(e => e.id === data.employeeId);
      if (!employee) throw new Error('Employee not found');

      const submissionData = {
        ...data,
        ...calculation,
        status: 'SUBMITTED',
      };

      if (isOnline) {
        // Submit directly if online
        await onSubmit(submissionData);
        saveQuickAction(data);
        reset();
      } else {
        // Store offline if no connection
        const offlineEntry: OfflineEntry = {
          id: `timesheet_${Date.now()}`,
          type: 'timesheet',
          data: submissionData,
          timestamp: Date.now(),
          synced: false,
        };

        await offlineStorage.storeOffline(offlineEntry);
        
        toast({
          title: "Saved Offline",
          description: "Timesheet will sync when you're back online",
        });
        
        saveQuickAction(data);
        reset();
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit timesheet",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      {/* Connection Status */}
      {!isOnline && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Offline Mode</span>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Your timesheet will be saved locally and synced when connected
          </p>
        </div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={repeatYesterday}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Copy className="w-4 h-4 mr-2" />
              Repeat Yesterday
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              {quickActions.slice(0, 4).map((action) => (
                <Button
                  key={action.id}
                  onClick={() => applyQuickAction(action)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submit Timesheet</CardTitle>
          <CardDescription>
            Record your working hours for today. Use voice dictation for easy note entry!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Employee Selection */}
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee</Label>
              <Select onValueChange={(value) => setValue('employeeId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your name" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employeeId && (
                <p className="text-red-500 text-sm">{errors.employeeId.message}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                {...register('date')}
                type="date"
                className="text-base"
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  {...register('startTime')}
                  type="time"
                  className="text-base"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm">{errors.startTime.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  {...register('endTime')}
                  type="time"
                  className="text-base"
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Break Minutes */}
            <div className="space-y-2">
              <Label htmlFor="breakMinutes">Break (minutes)</Label>
              <Input
                {...register('breakMinutes', { valueAsNumber: true })}
                type="number"
                className="text-base"
              />
              {errors.breakMinutes && (
                <p className="text-red-500 text-sm">{errors.breakMinutes.message}</p>
              )}
            </div>

            {/* Location & Media */}
            <div className="space-y-2">
              <Label>Additional Options</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Location
                </Button>
                
                <Button
                  type="button"
                  onClick={capturePhoto}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Photo
                </Button>
                
                <Button
                  type="button"
                  onClick={startVoiceNote}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Mic className="w-4 h-4 mr-1" />
                  Voice
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                {...register('notes')}
                placeholder="Any additional notes about your shift..."
                rows={2}
                className="text-base resize-none"
              />
              
              {/* Voice Dictation */}
              <VoiceDictation
                onTranscript={(transcript) => {
                  const currentNotes = watch('notes') || '';
                  const newNotes = currentNotes ? `${currentNotes} ${transcript}` : transcript;
                  setValue('notes', newNotes);
                }}
                className="mt-2"
              />
            </div>

            {/* Validation Toggle */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                onClick={toggleValidation}
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${hasValidationErrors ? 'border-red-300 text-red-700' : ''}`}
              >
                {hasValidationErrors ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {showValidation ? 'Hide Validation' : 'Show Validation'}
                {validationResults.length > 0 && (
                  <span className={`ml-1 text-xs px-1.5 py-0.5 rounded ${
                    hasValidationErrors ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {validationResults.filter(r => r.status === 'fail').length} errors
                  </span>
                )}
              </Button>
            </div>

            {/* Validation Component */}
            {showValidation && (
              <div className="border rounded-lg">
                <AdvancedValidation
                  timesheetData={watchedValues}
                  onValidationComplete={handleValidationComplete}
                  autoValidate={true}
                />
              </div>
            )}

            {/* Calculation Display */}
            {calculation && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Calculated Pay
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Total Hours:</span>
                    <p className="font-semibold">{calculation.totalHours}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Total Pay:</span>
                    <p className="font-semibold text-green-600">£{calculation.totalPay}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full warren-button-primary text-base py-3"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : isOnline ? (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Submit Timesheet</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Save Offline</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
