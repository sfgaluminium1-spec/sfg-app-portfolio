
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Clock, Building2, Users, MapPin, AlertCircle, CheckCircle, Filter, Plus, Truck, User, Wrench, Edit, Trash2, Move, RefreshCw, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, isToday } from 'date-fns';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Team {
  id: string;
  teamName: string;
  teamLeader: string;
  members: string[];
  skills: string[];
  van?: Van;
  isActive: boolean;
}

interface Van {
  id: string;
  vanNumber: string;
  registration: string;
  model: string;
  capacity: string;
  equipment: string[];
  vehicleType: 'INSTALLATION_VAN' | 'SURVEYOR_VEHICLE';
  isActive: boolean;
}

interface Job {
  id: string;
  jobNumber: string;
  client: string;
  site: string;
  description: string;
  status: string;
  teamRequirement: number;
  vanRequirement: number;
  estimatedDays: number;
  installationDate: Date | string;
  value?: number;
  priority?: string;
}

interface JobSchedule {
  id: string;
  scheduledDate: Date | string;
  scheduledTime: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  notes?: string;
  jobId: string;
  teamId: string;
  vanId: string;
  job: Job;
  team: Team;
  van: Van;
}

interface NewScheduleForm {
  jobId: string;
  teamId: string;
  vanId: string;
  scheduledDate: Date;
  scheduledTime: string;
  notes: string;
  duration: number;
}

const statusColors = {
  SCHEDULED: 'bg-blue-500',
  IN_PROGRESS: 'bg-yellow-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
  RESCHEDULED: 'bg-purple-500'
};

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export default function AdvancedScheduleManagement() {
  const [schedules, setSchedules] = useState<JobSchedule[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [vans, setVans] = useState<Van[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'teams' | 'jobs'>('calendar');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<JobSchedule | null>(null);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | undefined>(new Date());
  const [draggedItem, setDraggedItem] = useState<JobSchedule | null>(null);
  const [conflicts, setConflicts] = useState<string[]>([]);

  // Form state for new schedule
  const [newSchedule, setNewSchedule] = useState<NewScheduleForm>({
    jobId: '',
    teamId: '',
    vanId: '',
    scheduledDate: new Date(),
    scheduledTime: '09:00',
    notes: '',
    duration: 8
  });

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      
      // Fetch schedules
      const scheduleResponse = await fetch('/api/schedule');
      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        setSchedules(scheduleData.schedules || []);
      }

      // Fetch teams
      const teamsResponse = await fetch('/api/teams');
      let activeVans: Van[] = [];
      
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setTeams(teamsData.teams || []);
        
        // Extract vans from teams
        activeVans = (teamsData.teams || [])
          .map((team: Team) => team.van)
          .filter((van: Van | undefined) => van && van.isActive);
        setVans(activeVans);
      }

      // Fetch jobs ready for scheduling
      const jobsResponse = await fetch('/api/jobs?status=READY_FOR_INSTALL');
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleJob = async () => {
    if (!newSchedule.jobId || !newSchedule.teamId || !newSchedule.vanId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: newSchedule.jobId,
          teamId: newSchedule.teamId,
          vanId: newSchedule.vanId,
          scheduledDate: newSchedule.scheduledDate.toISOString(),
          scheduledTime: newSchedule.scheduledTime,
          notes: newSchedule.notes
        })
      });

      if (response.ok) {
        const scheduledJob = await response.json();
        setSchedules(prev => [...prev, scheduledJob]);
        setShowScheduleModal(false);
        toast.success('Job scheduled successfully!');
        
        // Reset form
        setNewSchedule({
          jobId: '',
          teamId: '',
          vanId: '',
          scheduledDate: new Date(),
          scheduledTime: '09:00',
          notes: '',
          duration: 8
        });
        
        // Refresh data
        fetchScheduleData();
      } else {
        throw new Error('Failed to schedule job');
      }
    } catch (error) {
      console.error('Error scheduling job:', error);
      toast.error('Failed to schedule job');
    }
  };

  const handleUpdateSchedule = async (scheduleId: string, updates: Partial<JobSchedule>) => {
    try {
      const response = await fetch(`/api/schedule/${scheduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedSchedule = await response.json();
        setSchedules(prev => prev.map(s => s.id === scheduleId ? updatedSchedule : s));
        toast.success('Schedule updated successfully!');
      } else {
        throw new Error('Failed to update schedule');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      const response = await fetch(`/api/schedule/${scheduleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSchedules(prev => prev.filter(s => s.id !== scheduleId));
        toast.success('Schedule deleted successfully!');
      } else {
        throw new Error('Failed to delete schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete schedule');
    }
  };

  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(schedule => 
      isSameDay(new Date(schedule.scheduledDate), date)
    );
  };

  const getTeamScheduleForDate = (teamId: string, date: Date) => {
    return schedules.filter(schedule => 
      schedule.team.id === teamId && 
      isSameDay(new Date(schedule.scheduledDate), date)
    );
  };

  const checkConflicts = (teamId: string, vanId: string, date: Date, time: string, excludeId?: string) => {
    const conflicts = schedules.filter(schedule => 
      schedule.id !== excludeId &&
      (schedule.team.id === teamId || schedule.van.id === vanId) &&
      isSameDay(new Date(schedule.scheduledDate), date) &&
      schedule.scheduledTime === time
    );
    return conflicts.length > 0;
  };

  const getAvailableTeams = () => {
    return teams.filter(team => team.isActive && team.van);
  };

  const getAvailableVans = () => {
    return vans.filter(van => van.isActive);
  };

  // Calendar View Component
  const CalendarView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const handlePreviousWeek = () => setSelectedDate(subWeeks(selectedDate, 1));
    const handleNextWeek = () => setSelectedDate(addWeeks(selectedDate, 1));
    const handleThisWeek = () => setSelectedDate(new Date());

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={handleThisWeek}>
              This Week
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Interactive Calendar Grid */}
        <div className="space-y-2 overflow-x-auto">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-2 min-w-[800px]">
            <div className="font-semibold text-sm p-3 bg-muted/50 rounded-lg border">
              Vehicle/Team
            </div>
            {weekDays.map((day) => {
              const isDayToday = isToday(day);
              const daySchedules = getSchedulesForDate(day);
              
              return (
                <div
                  key={day.toISOString()}
                  className={`text-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    isDayToday 
                      ? 'bg-primary/10 border-primary/20 font-semibold text-primary'
                      : 'bg-muted/30 border-muted hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setCalendarSelectedDate(day);
                    setSelectedDate(day);
                  }}
                >
                  <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                  <div className="text-xs text-muted-foreground">{format(day, 'd')}</div>
                  {daySchedules.length > 0 && (
                    <div className="text-xs text-primary font-medium mt-1">
                      {daySchedules.length} job{daySchedules.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Vehicle rows with drag-and-drop support */}
          {vans.map((van) => {
            const team = teams.find(t => t.van?.id === van.id);
            const vehicleColor = van.vehicleType === 'SURVEYOR_VEHICLE' 
              ? 'border-l-purple-500' 
              : 'border-l-blue-500';
            const vehicleBg = van.vehicleType === 'SURVEYOR_VEHICLE' 
              ? 'bg-purple-50/50' 
              : 'bg-blue-50/50';

            return (
              <div 
                key={van.id} 
                className={`grid grid-cols-8 gap-2 border-l-4 ${vehicleColor} ${vehicleBg} rounded-lg shadow-sm border min-w-[800px]`}
              >
                {/* Vehicle/Team Info */}
                <div className="p-3 bg-muted/50 rounded-l-lg border-r">
                  <div className="flex items-center space-x-2 mb-1">
                    {van.vehicleType === 'SURVEYOR_VEHICLE' ? (
                      <User className="h-4 w-4 text-purple-600" />
                    ) : (
                      <Truck className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="font-medium text-sm">{van.vanNumber}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{van.registration}</div>
                  {team && (
                    <div className="text-xs text-muted-foreground mt-1 font-medium">
                      {team.teamName}
                    </div>
                  )}
                </div>

                {/* Daily schedule cells */}
                {weekDays.map((day) => {
                  const daySchedules = schedules.filter(schedule =>
                    schedule.van.id === van.id && 
                    isSameDay(new Date(schedule.scheduledDate), day)
                  );
                  const isDayToday = isToday(day);

                  return (
                    <div
                      key={`${van.id}-${format(day, 'yyyy-MM-dd')}`}
                      className={`p-2 min-h-[120px] border border-muted/50 rounded-lg transition-colors ${
                        isDayToday ? 'bg-primary/5 border-primary/20' : 'bg-background'
                      }`}
                      onClick={() => {
                        if (team) {
                          setNewSchedule(prev => ({
                            ...prev,
                            teamId: team.id,
                            vanId: van.id,
                            scheduledDate: day
                          }));
                          setShowScheduleModal(true);
                        }
                      }}
                    >
                      {daySchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className={`p-2 rounded-md text-xs mb-1 shadow-sm cursor-pointer transition-all ${
                            van.vehicleType === 'SURVEYOR_VEHICLE'
                              ? 'bg-purple-100 border border-purple-200 hover:bg-purple-150'
                              : 'bg-blue-100 border border-blue-200 hover:bg-blue-150'
                          } hover:shadow-md`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSchedule(schedule);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Badge className={`${statusColors[schedule.status]} text-white text-xs px-1 py-0.5`}>
                              {schedule.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-muted-foreground text-xs font-medium">
                              {schedule.scheduledTime}
                            </span>
                          </div>
                          <div className="font-medium text-xs mb-1">{schedule.job.jobNumber}</div>
                          <div className="text-muted-foreground text-xs truncate">{schedule.job.client}</div>
                          {van.vehicleType === 'SURVEYOR_VEHICLE' && (
                            <div className="text-purple-700 text-xs font-medium mt-1">Survey</div>
                          )}
                        </div>
                      ))}
                      
                      {daySchedules.length === 0 && (
                        <div className="text-center text-muted-foreground text-xs py-6 opacity-60 border-2 border-dashed border-muted/30 rounded-md hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                          Click to schedule
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm">Installation Vans</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-sm">Surveyor Vehicle</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-sm">In Progress</span>
          </div>
        </div>
      </div>
    );
  };

  // Teams View Component
  const TeamsView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Team Management</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Team
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage Resources
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const todaySchedule = getTeamScheduleForDate(team.id, new Date());
          const isAvailable = todaySchedule.length === 0;
          const weekSchedule = getTeamScheduleForDate(team.id, selectedDate);

          return (
            <Card 
              key={team.id} 
              className={`transition-all hover:shadow-md ${
                isAvailable 
                  ? 'border-green-200 bg-green-50/30' 
                  : 'border-yellow-200 bg-yellow-50/30'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{team.teamName}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={isAvailable ? 'secondary' : 'outline'}>
                      {isAvailable ? 'Available' : 'Scheduled'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Led by {team.teamLeader} • {team.members.length} members
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {team.van && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Assigned Van</h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>{team.van.vanNumber} ({team.van.registration})</span>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-sm mb-1">This Week ({weekSchedule.length} jobs)</h4>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {weekSchedule.slice(0, 3).map((schedule) => (
                      <div key={schedule.id} className="text-sm p-2 bg-muted rounded">
                        <div className="font-medium">{schedule.job.jobNumber}</div>
                        <div className="text-muted-foreground text-xs">
                          {schedule.job.client} • {format(new Date(schedule.scheduledDate), 'MMM d')}
                        </div>
                      </div>
                    ))}
                    {weekSchedule.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{weekSchedule.length - 3} more jobs
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1" 
                    size="sm"
                    onClick={() => {
                      setNewSchedule(prev => ({
                        ...prev,
                        teamId: team.id,
                        vanId: team.van?.id || ''
                      }));
                      setShowScheduleModal(true);
                    }}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Jobs View Component
  const JobsView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Jobs Ready for Scheduling</h3>
          <p className="text-sm text-muted-foreground">
            Jobs that are ready for installation scheduling
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setShowScheduleModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Job
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => {
          const isScheduled = schedules.some(schedule => schedule.job.id === job.id);
          const jobSchedule = schedules.find(schedule => schedule.job.id === job.id);

          return (
            <Card 
              key={job.id} 
              className={`transition-all hover:shadow-md ${
                isScheduled 
                  ? 'border-green-200 bg-green-50/30' 
                  : 'border-orange-200 bg-orange-50/30'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{job.jobNumber}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={isScheduled ? "secondary" : "outline"}>
                      {isScheduled ? 'Scheduled' : job.status}
                    </Badge>
                    {job.priority && (
                      <Badge 
                        variant={job.priority === 'URGENT' ? 'destructive' : 'outline'} 
                        className="text-xs"
                      >
                        {job.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription>{job.client}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Site</h4>
                  <p className="text-sm">{job.site}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                  <p className="text-sm line-clamp-2">{job.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <h4 className="font-medium text-muted-foreground">Teams</h4>
                    <p>{job.teamRequirement}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">Vans</h4>
                    <p>{job.vanRequirement}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-muted-foreground">Days</h4>
                    <p>{job.estimatedDays}</p>
                  </div>
                </div>

                {job.value && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Value</h4>
                    <p className="text-sm font-medium">£{job.value.toLocaleString()}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Installation Date</h4>
                  <p className="text-sm">{format(new Date(job.installationDate), 'PPP')}</p>
                </div>

                {isScheduled && jobSchedule ? (
                  <div className="p-2 bg-green-100 rounded-md">
                    <div className="text-sm font-medium text-green-800">Scheduled</div>
                    <div className="text-xs text-green-600">
                      {format(new Date(jobSchedule.scheduledDate), 'PPP')} at {jobSchedule.scheduledTime}
                    </div>
                    <div className="text-xs text-green-600">Team: {jobSchedule.team.teamName}</div>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => {
                      setNewSchedule(prev => ({ ...prev, jobId: job.id }));
                      setShowScheduleModal(true);
                    }}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule Installation
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Schedule Job Modal Component
  const ScheduleJobModal = () => {
    const availableTeams = getAvailableTeams();
    const availableVans = getAvailableVans();
    const selectedTeam = teams.find(t => t.id === newSchedule.teamId);
    const hasConflict = newSchedule.teamId && newSchedule.vanId ? 
      checkConflicts(newSchedule.teamId, newSchedule.vanId, newSchedule.scheduledDate, newSchedule.scheduledTime) : 
      false;

    return (
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Job</DialogTitle>
            <DialogDescription>
              Schedule a job for installation with team and vehicle assignment
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job">Job</Label>
                <Select 
                  value={newSchedule.jobId} 
                  onValueChange={(value) => setNewSchedule(prev => ({ ...prev, jobId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.jobNumber} - {job.client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Select 
                  value={newSchedule.teamId} 
                  onValueChange={(value) => {
                    const team = teams.find(t => t.id === value);
                    setNewSchedule(prev => ({ 
                      ...prev, 
                      teamId: value,
                      vanId: team?.van?.id || ''
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.teamName} ({team.teamLeader})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="van">Vehicle</Label>
                <Select 
                  value={newSchedule.vanId} 
                  onValueChange={(value) => setNewSchedule(prev => ({ ...prev, vanId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVans.map((van) => (
                      <SelectItem key={van.id} value={van.id}>
                        {van.vanNumber} - {van.registration} ({van.vehicleType.replace('_', ' ')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  type="date" 
                  value={format(newSchedule.scheduledDate, 'yyyy-MM-dd')}
                  onChange={(e) => setNewSchedule(prev => ({ 
                    ...prev, 
                    scheduledDate: new Date(e.target.value) 
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select 
                  value={newSchedule.scheduledTime} 
                  onValueChange={(value) => setNewSchedule(prev => ({ ...prev, scheduledTime: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="12" 
                  value={newSchedule.duration}
                  onChange={(e) => setNewSchedule(prev => ({ 
                    ...prev, 
                    duration: parseInt(e.target.value) || 8 
                  }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                placeholder="Add any scheduling notes or special requirements..."
                value={newSchedule.notes}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {hasConflict && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Schedule Conflict Detected</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  The selected team or vehicle is already scheduled at this time.
                </p>
              </div>
            )}

            {selectedTeam && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm font-medium text-blue-800">Team Information</div>
                <div className="text-sm text-blue-600 mt-1">
                  Leader: {selectedTeam.teamLeader} • Skills: {selectedTeam.skills.join(', ')}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleScheduleJob}
              disabled={hasConflict || !newSchedule.jobId || !newSchedule.teamId || !newSchedule.vanId}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading schedule data...</p>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Advanced Schedule Management</h1>
            <p className="text-muted-foreground">
              Comprehensive scheduling system for teams, vehicles, and job assignments
            </p>
          </div>
          
          <Button onClick={() => setShowScheduleModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Job
          </Button>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'calendar' | 'teams' | 'jobs')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>

          <TabsContent value="teams">
            <TeamsView />
          </TabsContent>

          <TabsContent value="jobs">
            <JobsView />
          </TabsContent>
        </Tabs>

        <ScheduleJobModal />
      </div>
    </DragDropContext>
  );
}
