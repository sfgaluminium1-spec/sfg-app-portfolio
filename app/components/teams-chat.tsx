
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Phone, Video, Plus, Settings, Search, MessageCircle, Users, Bell } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  type: 'text' | 'system' | 'file';
  isRead: boolean;
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  isOnline: boolean;
  avatar?: string;
}

export default function TeamsChat() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTeamsData();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      loadMessages(selectedTeam);
    }
  }, [selectedTeam]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadTeamsData = async () => {
    try {
      // Mock teams data
      const mockTeams: Team[] = [
        {
          id: 'installation-team',
          name: 'Installation Team',
          members: [
            { id: '1', name: 'John Smith', role: 'Team Leader', isOnline: true },
            { id: '2', name: 'Mike Johnson', role: 'Installer', isOnline: true },
            { id: '3', name: 'David Wilson', role: 'Installer', isOnline: false }
          ],
          lastMessage: {
            id: '1',
            text: 'Installation at Site A complete. Moving to Site B.',
            senderId: '1',
            senderName: 'John Smith',
            timestamp: new Date().toISOString(),
            type: 'text',
            isRead: false
          },
          unreadCount: 2,
          isOnline: true
        },
        {
          id: 'fabrication-team',
          name: 'Fabrication Team',
          members: [
            { id: '4', name: 'Sarah Wilson', role: 'Fabricator', isOnline: true },
            { id: '5', name: 'Tom Brown', role: 'Quality Control', isOnline: true },
            { id: '6', name: 'Lisa Davis', role: 'Welder', isOnline: false }
          ],
          lastMessage: {
            id: '2',
            text: 'Batch 15 ready for delivery tomorrow.',
            senderId: '4',
            senderName: 'Sarah Wilson',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            type: 'text',
            isRead: true
          },
          unreadCount: 0,
          isOnline: true
        },
        {
          id: 'management-team',
          name: 'Management Team',
          members: [
            { id: '7', name: 'Emma Thompson', role: 'Project Manager', isOnline: true },
            { id: '8', name: 'James Clarke', role: 'Operations Manager', isOnline: false },
            { id: '9', name: 'Robert Taylor', role: 'Sales Manager', isOnline: true }
          ],
          lastMessage: {
            id: '3',
            text: 'Weekly review meeting at 2 PM today.',
            senderId: '7',
            senderName: 'Emma Thompson',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            type: 'text',
            isRead: true
          },
          unreadCount: 0,
          isOnline: true
        }
      ];

      setTeams(mockTeams);
      if (mockTeams.length > 0) {
        setSelectedTeam(mockTeams[0].id);
      }
    } catch (error) {
      console.error('Error loading teams data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (teamId: string) => {
    try {
      // Mock messages data
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'Good morning team! Ready for today\'s installations?',
          senderId: '1',
          senderName: 'John Smith',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          type: 'text',
          isRead: true
        },
        {
          id: '2',
          text: 'Yes, all equipment loaded and ready to go.',
          senderId: '2',
          senderName: 'Mike Johnson',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
          type: 'text',
          isRead: true
        },
        {
          id: '3',
          text: 'Customer at Site A confirmed access for 9 AM.',
          senderId: '3',
          senderName: 'David Wilson',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          type: 'text',
          isRead: true
        },
        {
          id: '4',
          text: 'Installation at Site A complete. Moving to Site B.',
          senderId: '1',
          senderName: 'John Smith',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          type: 'text',
          isRead: false
        },
        {
          id: '5',
          text: 'ETA to Site B is 1:30 PM.',
          senderId: '2',
          senderName: 'Mike Johnson',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          type: 'text',
          isRead: false
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTeam) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      senderId: 'current-user',
      senderName: 'You',
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update team's last message
    setTeams(prev => prev.map(team => 
      team.id === selectedTeam 
        ? { ...team, lastMessage: message }
        : team
    ));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const currentTeam = teams.find(team => team.id === selectedTeam);

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
            <MessageCircle className="h-8 w-8 mr-3 text-blue-600" />
            Teams Chat
          </h1>
          <p className="text-muted-foreground">
            Communicate with your teams in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Team
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
        {/* Teams List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Teams</CardTitle>
              <Badge variant="secondary">{teams.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search teams..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 ${
                    selectedTeam === team.id 
                      ? 'border-l-blue-500 bg-blue-50' 
                      : 'border-l-transparent'
                  }`}
                  onClick={() => setSelectedTeam(team.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${team.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="font-medium text-sm">{team.name}</span>
                    </div>
                    {team.unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                        {team.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {team.members.filter(m => m.isOnline).length}/{team.members.length} online
                    </span>
                  </div>
                  {team.lastMessage && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground truncate">
                        <span className="font-medium">{team.lastMessage.senderName}:</span> {team.lastMessage.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(team.lastMessage.timestamp)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col">
          {currentTeam ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${currentTeam.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <CardTitle className="text-lg">{currentTeam.name}</CardTitle>
                      <CardDescription>
                        {currentTeam.members.filter(m => m.isOnline).length} of {currentTeam.members.length} members online
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.senderId === 'current-user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {message.senderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className={`rounded-lg p-3 ${
                            message.senderId === 'current-user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <div className={`flex items-center mt-1 space-x-2 text-xs text-muted-foreground ${
                            message.senderId === 'current-user' ? 'justify-end' : ''
                          }`}>
                            <span>{message.senderName}</span>
                            <span>•</span>
                            <span>{formatTime(message.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        sendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a team to start chatting</h3>
                <p className="text-muted-foreground">
                  Choose a team from the sidebar to view messages and start conversations
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Team Members */}
      {currentTeam && (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Current members of {currentTeam.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentTeam.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
