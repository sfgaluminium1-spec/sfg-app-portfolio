
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, Search, Edit, Eye, Phone, Mail, Calendar, Award, MapPin, Clock } from 'lucide-react';

interface TeamMember {
  id: string;
  fullName: string;
  role: string;
  email: string;
  phone?: string;
  skills: string[];
  certifications: string[];
  isActive: boolean;
  joinDate: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  availability?: {
    status: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY' | 'LEAVE';
    currentAssignment?: string;
  };
}

export default function TeamMemberManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [teamMembers, searchTerm, roleFilter, availabilityFilter]);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team-members');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.teamMembers || mockTeamMembers);
      } else {
        setTeamMembers(mockTeamMembers);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers(mockTeamMembers);
    } finally {
      setLoading(false);
    }
  };

  const mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      fullName: 'John Smith',
      role: 'Team Leader',
      email: 'john.smith@sfgaluminium.com',
      phone: '07123 456789',
      skills: ['Fabrication', 'Installation', 'Team Management'],
      certifications: ['CSCS Card', 'First Aid', 'Working at Height'],
      isActive: true,
      joinDate: '2020-03-15',
      availability: {
        status: 'AVAILABLE',
        currentAssignment: undefined
      },
      emergencyContact: {
        name: 'Jane Smith',
        phone: '07987 654321',
        relationship: 'Spouse'
      }
    },
    {
      id: '2',
      fullName: 'Mike Johnson',
      role: 'Installer',
      email: 'mike.johnson@sfgaluminium.com',
      phone: '07234 567890',
      skills: ['Installation', 'Glass Handling', 'Customer Service'],
      certifications: ['CSCS Card', 'Manual Handling'],
      isActive: true,
      joinDate: '2021-07-20',
      availability: {
        status: 'BUSY',
        currentAssignment: 'Job SFG240115 - Installation'
      },
      emergencyContact: {
        name: 'Sarah Johnson',
        phone: '07876 543210',
        relationship: 'Sister'
      }
    },
    {
      id: '3',
      fullName: 'David Wilson',
      role: 'Fabricator',
      email: 'david.wilson@sfgaluminium.com',
      phone: '07345 678901',
      skills: ['Aluminium Fabrication', 'Welding', 'Quality Control'],
      certifications: ['CSCS Card', 'Welding Certification', 'Fork Lift License'],
      isActive: true,
      joinDate: '2019-11-10',
      availability: {
        status: 'AVAILABLE',
        currentAssignment: undefined
      }
    }
  ];

  const filterMembers = () => {
    let filtered = teamMembers;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(member => member.availability?.status === availabilityFilter);
    }

    setFilteredMembers(filtered);
  };

  const getAvailabilityColor = (status?: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'BUSY': return 'bg-yellow-100 text-yellow-800';
      case 'OFF_DUTY': return 'bg-gray-100 text-gray-800';
      case 'LEAVE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'team leader': return '👨‍💼';
      case 'installer': return '🔧';
      case 'fabricator': return '🏭';
      case 'surveyor': return '📏';
      default: return '👤';
    }
  };

  const handleViewMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Team Member Management
          </h1>
          <p className="text-muted-foreground">
            Manage team members, skills, and availability
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{teamMembers.length}</div>
            <div className="text-sm text-muted-foreground">Total Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {teamMembers.filter(m => m.availability?.status === 'AVAILABLE').length}
            </div>
            <div className="text-sm text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {teamMembers.filter(m => m.availability?.status === 'BUSY').length}
            </div>
            <div className="text-sm text-muted-foreground">On Assignment</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {teamMembers.filter(m => m.availability?.status === 'LEAVE').length}
            </div>
            <div className="text-sm text-muted-foreground">On Leave</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, role, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Team Leader">Team Leader</SelectItem>
                <SelectItem value="Installer">Installer</SelectItem>
                <SelectItem value="Fabricator">Fabricator</SelectItem>
                <SelectItem value="Surveyor">Surveyor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="BUSY">Busy</SelectItem>
                <SelectItem value="OFF_DUTY">Off Duty</SelectItem>
                <SelectItem value="LEAVE">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {member.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-lg">{getRoleIcon(member.role)}</span>
                    {member.fullName}
                  </CardTitle>
                  <CardDescription className="font-medium">
                    {member.role}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleViewMember(member)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Contact Info */}
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div>
                  <Badge className={getAvailabilityColor(member.availability?.status)}>
                    {member.availability?.status || 'UNKNOWN'}
                  </Badge>
                  {member.availability?.currentAssignment && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {member.availability.currentAssignment}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined {new Date(member.joinDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No team members found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || roleFilter !== 'all' || availabilityFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by adding your first team member.'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Member Detail Modal */}
      <Dialog open={showMemberModal} onOpenChange={setShowMemberModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {selectedMember?.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{selectedMember?.fullName}</span>
                <p className="text-sm text-muted-foreground font-normal">
                  {selectedMember?.role}
                </p>
              </div>
            </DialogTitle>
            <DialogDescription>
              Complete team member information and current status
            </DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedMember.email}</span>
                    </div>
                    {selectedMember.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedMember.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Joined {new Date(selectedMember.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Availability</Label>
                      <div className="mt-1">
                        <Badge className={getAvailabilityColor(selectedMember.availability?.status)}>
                          {selectedMember.availability?.status || 'UNKNOWN'}
                        </Badge>
                      </div>
                    </div>
                    {selectedMember.availability?.currentAssignment && (
                      <div>
                        <Label className="text-muted-foreground">Current Assignment</Label>
                        <p className="text-sm font-medium mt-1">
                          {selectedMember.availability.currentAssignment}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Skills and Certifications */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedMember.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Award className="h-3 w-3 text-green-600" />
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Emergency Contact */}
              {selectedMember.emergencyContact && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-muted-foreground">Name</Label>
                        <p className="font-medium">{selectedMember.emergencyContact.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium">{selectedMember.emergencyContact.phone}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Relationship</Label>
                        <p className="font-medium">{selectedMember.emergencyContact.relationship}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMemberModal(false)}>
              Close
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
