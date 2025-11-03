
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, Users, MapPin, Wrench, AlertTriangle, CheckCircle, Plus, Filter, Eye, Edit, Truck } from 'lucide-react';

interface ScheduleItem {
  id: string;
  scheduledDate: string;
  scheduledTime: string | null;
  duration: number;
  status: string;
  type: 'FABRICATION' | 'INSTALLATION' | 'SURVEY';
  priority: string;
  job: {
    id: string;
    jobNumber: string;
    description: string;
    customer: {
      firstName: string;
      lastName: string;
      address?: string;
      city?: string;
      postcode?: string;
    };
    status: string;
  };
  assignedTeam?: {
    teamLeader: {
      fullName: string;
      role: string;
    };
    members: {
      fullName: string;
      role: string;
    }[];
  };
  equipment?: string[];
  notes?: string;
}

export default function ScheduleManagement() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchScheduleItems();
  }, [selectedDate, viewMode]);

  const fetchScheduleItems = async () => {
    try {
      const params = new URLSearchParams({
        date: selectedDate,
        view: viewMode,
        type: filterType !== 'all' ? filterType : '',
        status: filterStatus !== 'all' ? filterStatus : ''
      });

      const response = await fetch(`/api/schedule?${params}`);
      if (response.ok) {
        const data = await response.json();
        setScheduleItems(data.scheduleItems || []);
      }
    } catch (error) {
      console.error('Error fetching schedule items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'DELAYED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FABRICATION': return <Wrench className="h-4 w-4" />;
      case 'INSTALLATION': return <Truck className="h-4 w-4" />;
      case 'SURVEY': return <Eye className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleItemClick = (item: ScheduleItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const groupItemsByDate = () => {
    const grouped: { [key: string]: ScheduleItem[] } = {};
    scheduleItems.forEach(item => {
      const date = item.scheduledDate;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  const getWeekDates = () => {
    const start = new Date(selectedDate);
    const startOfWeek = new Date(start.setDate(start.getDate() - start.getDay()));
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const groupedItems = groupItemsByDate();
  const weekDates = viewMode === 'week' ? getWeekDates() : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-blue-600" />
            Schedule Management
          </h1>
          <p className="text-muted-foreground">
            Manage fabrication, installation, and survey schedules
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule Item
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
            </div>

            <div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>

            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="FABRICATION">Fabrication</SelectItem>
                  <SelectItem value="INSTALLATION">Installation</SelectItem>
                  <SelectItem value="SURVEY">Survey</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Display */}
      <div className="space-y-6">
        {viewMode === 'day' && (
          <Card>
            <CardHeader>
              <CardTitle>
                {new Date(selectedDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {groupedItems[selectedDate]?.length > 0 ? (
                <div className="space-y-4">
                  {groupedItems[selectedDate].map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleItemClick(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(item.type)}
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="font-medium">{item.job.jobNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.job.customer.firstName} {item.job.customer.lastName}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {item.scheduledTime || 'All Day'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.duration}h duration
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No items scheduled
                  </h3>
                  <p>No schedule items found for this date</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {viewMode === 'week' && (
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map((date) => (
              <Card key={date} className="min-h-96">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-center">
                    <div className="font-medium">
                      {new Date(date).toLocaleDateString('en-GB', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-bold">
                      {new Date(date).getDate()}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-2">
                    {groupedItems[date]?.map((item) => (
                      <Card
                        key={item.id}
                        className="cursor-pointer hover:shadow-sm transition-shadow p-2 border-l-4"
                        style={{
                          borderLeftColor: item.type === 'FABRICATION' ? '#3b82f6' :
                                         item.type === 'INSTALLATION' ? '#10b981' : '#f59e0b'
                        }}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(item.type)}
                            <span className="text-xs font-medium truncate">
                              {item.job.jobNumber}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.job.customer.firstName} {item.job.customer.lastName}
                          </div>
                          <div className="text-xs">
                            {item.scheduledTime || 'All Day'}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedItem && getTypeIcon(selectedItem.type)}
              <span>Schedule Details - {selectedItem?.job.jobNumber}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.type} scheduled for {selectedItem && new Date(selectedItem.scheduledDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Schedule Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline">{selectedItem.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedItem.status)}>
                        {selectedItem.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(selectedItem.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{selectedItem.scheduledTime || 'All Day'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{selectedItem.duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <span className={getPriorityColor(selectedItem.priority)}>
                        {selectedItem.priority}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Job Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-muted-foreground">Job Number:</span>
                      <p className="font-medium">{selectedItem.job.jobNumber}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Customer:</span>
                      <p className="font-medium">
                        {selectedItem.job.customer.firstName} {selectedItem.job.customer.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p className="text-sm">{selectedItem.job.description}</p>
                    </div>
                    {selectedItem.job.customer.address && (
                      <div>
                        <span className="text-muted-foreground">Address:</span>
                        <p className="text-sm flex items-start space-x-1">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span>
                            {selectedItem.job.customer.address}
                            {selectedItem.job.customer.city && `, ${selectedItem.job.customer.city}`}
                            {selectedItem.job.customer.postcode && ` ${selectedItem.job.customer.postcode}`}
                          </span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {selectedItem.assignedTeam && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Assigned Team</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-muted-foreground">Team Leader:</span>
                        <p className="font-medium">
                          {selectedItem.assignedTeam.teamLeader.fullName}
                          <span className="text-sm text-muted-foreground ml-2">
                            ({selectedItem.assignedTeam.teamLeader.role})
                          </span>
                        </p>
                      </div>
                      {selectedItem.assignedTeam.members.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Team Members:</span>
                          <div className="mt-2 space-y-1">
                            {selectedItem.assignedTeam.members.map((member, index) => (
                              <p key={index} className="text-sm">
                                {member.fullName}
                                <span className="text-muted-foreground ml-2">
                                  ({member.role})
                                </span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedItem.equipment && selectedItem.equipment.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Wrench className="h-5 w-5" />
                      <span>Required Equipment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.equipment.map((item, index) => (
                        <Badge key={index} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedItem.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedItem.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
