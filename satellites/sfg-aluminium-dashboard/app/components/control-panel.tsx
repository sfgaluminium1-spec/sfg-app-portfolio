
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Database, 
  Upload, 
  Download, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

interface SystemLog {
  id: string;
  level: string;
  message: string;
  timestamp: string;
}

export function ControlPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchSystemLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback demo data
      setUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@doe.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2025-01-01T10:30:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@sfgaluminium.com',
          role: 'manager',
          status: 'active',
          lastLogin: '2024-12-31T15:45:00Z'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@sfgaluminium.com',
          role: 'user',
          status: 'inactive',
          lastLogin: '2024-12-28T09:15:00Z'
        }
      ]);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      const response = await fetch('/api/system-logs');
      if (response.ok) {
        const data = await response.json();
        setSystemLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch system logs:', error);
      // Fallback demo data
      setSystemLogs([
        {
          id: '1',
          level: 'info',
          message: 'User john@doe.com logged in successfully',
          timestamp: '2025-01-01T10:30:15Z'
        },
        {
          id: '2',
          level: 'warning',
          message: 'API rate limit exceeded for key sk_test_123',
          timestamp: '2025-01-01T10:25:30Z'
        },
        {
          id: '3',
          level: 'error',
          message: 'Failed to process document doc_456.pdf',
          timestamp: '2025-01-01T10:20:45Z'
        },
        {
          id: '4',
          level: 'info',
          message: 'Daily backup completed successfully',
          timestamp: '2025-01-01T02:00:00Z'
        }
      ]);
    }
  };

  const handleAddUser = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'active',
        lastLogin: 'Never'
      };
      
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'user', password: '' });
    } catch (error) {
      console.error('Failed to add user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock CSV download
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Type,Date,Value\n" +
        "Revenue,2025-01-01,125000\n" +
        "Expenses,2025-01-01,85000\n" +
        "Profit,2025-01-01,40000";
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "sfg_data_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400';
      case 'manager':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-400'
      : 'bg-yellow-500/20 text-yellow-400';
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">System Control Panel</h1>
          <p className="text-gray-400 mt-2">
            Manage users, data, and system configuration
          </p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="system">System Monitoring</TabsTrigger>
            <TabsTrigger value="registration">App Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add New User */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New User
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Create a new user account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Name</Label>
                    <Input
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/20">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Password</Label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Enter password"
                      className="bg-white/5 border-white/20 text-white mt-1"
                    />
                  </div>
                  <Button 
                    onClick={handleAddUser}
                    disabled={isLoading || !newUser.name || !newUser.email || !newUser.password}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card className="lg:col-span-2 glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    User Management
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    View and manage system users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-gray-300">Name</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Role</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Last Login</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="border-white/10">
                          <TableCell className="text-white font-medium">{user.name}</TableCell>
                          <TableCell className="text-gray-300">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {user.lastLogin === 'Never' ? 'Never' : new Date(user.lastLogin).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-white/20">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Upload */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Data Import
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload files for processing and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Drag and drop files here</p>
                    <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                    <Button variant="outline" className="border-white/20">
                      Choose Files
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    <p>Supported formats:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Documents: PDF, DOCX, TXT</li>
                      <li>Spreadsheets: XLSX, CSV</li>
                      <li>Images: PNG, JPG, JPEG</li>
                      <li>Maximum file size: 50MB</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Data Export */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    Data Export
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Export system data and reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Financial Data</p>
                        <p className="text-gray-400 text-sm">Revenue, expenses, profit metrics</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-white/20">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">AI Usage Reports</p>
                        <p className="text-gray-400 text-sm">Model usage and performance</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-white/20">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Document Processing</p>
                        <p className="text-gray-400 text-sm">Processed documents and results</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-white/20">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Button 
                      onClick={handleExportData}
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4 mr-2" />
                          Export All Data
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System Stats */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">API Status</span>
                      <Badge className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Database</span>
                      <Badge className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">AI Models</span>
                      <Badge className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        4/4 Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Storage</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        75% Used
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Logs */}
              <Card className="lg:col-span-2 glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    System Logs
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Recent system events and activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {systemLogs.map((log) => (
                      <div key={log.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                        {getLogLevelIcon(log.level)}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{log.message}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {log.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="registration" className="space-y-6">
            <RegistrationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Registration Panel Component
function RegistrationPanel() {
  const [registrationStatus, setRegistrationStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/registration');
      if (response.ok) {
        const data = await response.json();
        setRegistrationStatus(data);
      }
    } catch (error) {
      console.error('Failed to check registration status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setRegistrationStatus({
          ...registrationStatus,
          is_registered: true,
          issue_number: data.issue_number,
          issue_url: data.issue_url,
        });
        alert('Successfully registered in SFG App Portfolio!\n\nIssue #' + data.issue_number);
      } else {
        alert('Registration failed: ' + data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Registration Status Card */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            {registrationStatus?.is_registered ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
            )}
            Registration Status
          </CardTitle>
          <CardDescription className="text-gray-400">
            GitHub App Portfolio Registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">App Name</Label>
            <p className="text-white font-mono text-sm mt-1">
              {registrationStatus?.app_name || 'SFG-Aluminium-Unified-Dashboard'}
            </p>
          </div>

          <div>
            <Label className="text-gray-300">Status</Label>
            <div className="mt-1">
              {registrationStatus?.is_registered ? (
                <Badge className="bg-green-500/20 text-green-400">
                  ✓ Registered
                </Badge>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  ⚠ Not Registered
                </Badge>
              )}
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Repository</Label>
            <p className="text-blue-400 text-sm mt-1 break-all">
              {registrationStatus?.repository || 'https://github.com/sfgaluminium1-spec/sfg-app-portfolio'}
            </p>
          </div>

          {!registrationStatus?.is_registered && (
            <Button
              onClick={handleRegister}
              disabled={isRegistering}
              className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
            >
              {isRegistering ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Register in Portfolio
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Webhook & Message Handler Card */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Integration Endpoints
          </CardTitle>
          <CardDescription className="text-gray-400">
            Webhook and message handler URLs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              Webhook Endpoint
            </Label>
            <p className="text-white text-sm font-mono mt-1 bg-white/5 p-2 rounded break-all">
              {registrationStatus?.webhook_url || 'https://sfg-unified-brain.abacusai.app/api/webhooks/nexus'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Receives events from NEXUS orchestrator
            </p>
          </div>

          <div>
            <Label className="text-gray-300 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              Message Handler
            </Label>
            <p className="text-white text-sm font-mono mt-1 bg-white/5 p-2 rounded break-all">
              {registrationStatus?.message_handler_url || 'https://sfg-unified-brain.abacusai.app/api/messages/handle'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Handles requests from other apps
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              variant="outline"
              onClick={() => window.open('/api/webhooks/nexus', '_blank')}
              className="w-full border-white/20"
            >
              Test Webhook Endpoint
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('/api/messages/handle', '_blank')}
              className="w-full border-white/20"
            >
              Test Message Handler
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Capabilities Card */}
      <Card className="glass-card border-white/20 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            App Capabilities
          </CardTitle>
          <CardDescription className="text-gray-400">
            What this app can do for NEXUS orchestration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Webhook Events */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Webhook Events
              </h4>
              <div className="space-y-1 text-sm">
                {[
                  'enquiry.created',
                  'quote.requested',
                  'order.approved',
                  'customer.registered',
                  'credit.check_required',
                  'invoice.due',
                  'payment.received',
                ].map((event) => (
                  <div key={event} className="text-gray-300 font-mono text-xs bg-white/5 px-2 py-1 rounded">
                    {event}
                  </div>
                ))}
              </div>
            </div>

            {/* Supported Messages */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Supported Messages
              </h4>
              <div className="space-y-1 text-sm">
                {[
                  'query.customer_data',
                  'query.quote_status',
                  'query.order_status',
                  'action.create_quote',
                  'action.approve_order',
                  'action.send_invoice',
                  'action.check_credit',
                  'query.production_schedule',
                ].map((msg) => (
                  <div key={msg} className="text-gray-300 font-mono text-xs bg-white/5 px-2 py-1 rounded">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
