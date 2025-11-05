
'use client';

import { useState, useEffect } from 'react';
import { useSafeSession } from '@/hooks/use-safe-session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  FileText, 
  Users, 
  AlertTriangle, 
  Download, 
  Eye, 
  Lock,
  Building2,
  Gavel,
  BookOpen,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { CompanyRules } from './company-rules';

interface DirectorAccessProps {
  userRole: string;
}

export function DirectorAccess({ userRole }: DirectorAccessProps) {
  const { data: session } = useSafeSession();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check if user has director access
  const hasDirectorAccess = session?.user?.role === 'admin' || 
                           session?.user?.role === 'director' ||
                           session?.user?.email?.includes('yanika') ||
                           session?.user?.email?.includes('warren') ||
                           session?.user?.email?.includes('pawel');

  if (!hasDirectorAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <Lock className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Access Restricted
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This section is only accessible to company directors.
            </p>
            <Badge variant="destructive">Director Access Required</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Director HR Compliance Centre
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            SFG Aluminium Ltd - Confidential Management System
          </p>
          <Badge variant="outline" className="mt-2">
            <Lock className="w-3 h-3 mr-1" />
            Director Access Only
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="legal">Legal Framework</TabsTrigger>
            <TabsTrigger value="employees">Employee Database</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="rules">Company Rules</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-red-600" />
                    Legal Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">OPUS 4.1 Framework:</span>
                      <Badge variant="default" className="bg-green-600">Complete</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">GDPR Compliance:</span>
                      <Badge variant="default" className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Employment Law:</span>
                      <Badge variant="default" className="bg-green-600">2025 Ready</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">H&S Compliance:</span>
                      <Badge variant="default" className="bg-green-600">Current</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Employee Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Employees:</span>
                      <Badge variant="secondary">27</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Auth System:</span>
                      <Badge variant="default" className="bg-blue-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Location Tracking:</span>
                      <Badge variant="default" className="bg-blue-600">Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Data Retention:</span>
                      <Badge variant="outline">3 Years</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">ChronoShift Pro:</span>
                      <Badge variant="default" className="bg-green-600">Online</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Database:</span>
                      <Badge variant="default" className="bg-green-600">Connected</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Geolocation:</span>
                      <Badge variant="default" className="bg-green-600">Operational</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Backup:</span>
                      <Badge variant="outline">Daily</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Q1 2025 Implementation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-green-600">✅ Completed (September 2025)</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Employee authentication system deployed
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Geolocation tracking implemented
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Company rules section active
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Director access controls functional
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-amber-600">⏳ Next Phase (October 2025)</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          Full legal reference system
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          DPIA documentation completion
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          Equal pay audit system
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          Holiday pay calculation update
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Framework Tab */}
          <TabsContent value="legal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  OPUS 4.1 Legal Framework Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Complete UK Employment Law & HR Compliance System
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Effective: January 2025 – December 2027 | Staff: 27 PAYE employees | Sector: Aluminium Manufacturing
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Statutory Coverage</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✅ Employment Rights Act 1996</li>
                      <li>✅ Equality Act 2010</li>
                      <li>✅ Health & Safety at Work Act 1974</li>
                      <li>✅ Working Time Regulations 1998</li>
                      <li>✅ Data Protection Act 2018 & UK GDPR</li>
                      <li>✅ National Minimum Wage Act 1998</li>
                      <li>✅ Pensions Act 2008 (Auto-enrolment)</li>
                      <li>✅ COSHH, PUWER, RIDDOR, Fire Safety</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Company-Specific Implementation</h3>
                    <ul className="space-y-2 text-sm">
                      <li>🎯 Geolocation/timekeeping: Submit-only capture</li>
                      <li>🎯 Vehicle use: Commute + work only policy</li>
                      <li>🎯 30-minute lateness notification rule</li>
                      <li>🎯 48-hour opt-out voluntary procedures</li>
                      <li>🎯 3-year data retention (HMRC compliance)</li>
                      <li>🎯 PPE requirements by manufacturing area</li>
                      <li>🎯 Emergency contact database</li>
                      <li>🎯 Audit framework with RAG ratings</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Priority Actions Timeline</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">September 2025 (Complete)</span>
                        <Badge variant="default" className="bg-green-600">✓ Done</Badge>
                      </div>
                      <p className="text-sm mt-1">Employee handbook issued, geolocation system deployed, director access implemented</p>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">October 2025 (Next Phase)</span>
                        <Badge variant="outline">Planned</Badge>
                      </div>
                      <p className="text-sm mt-1">DPIA completion, equal pay audit, holiday pay calculation update</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">November 2025 (Audit)</span>
                        <Badge variant="secondary">Scheduled</Badge>
                      </div>
                      <p className="text-sm mt-1">Full compliance audit, board review, Q1 2026 planning</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employee Database Tab */}
          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Employee Contact Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-amber-800 dark:text-amber-200">
                        Confidential Information
                      </span>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      This section contains sensitive personal data. Access is logged and monitored for compliance purposes.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Yanika Heathcote</CardTitle>
                        <Badge variant="outline">Director</Badge>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p><strong>Email:</strong> yanika@sfg-aluminium.co.uk</p>
                        <p><strong>Phone:</strong> 0161 884 0131</p>
                        <p><strong>Employee ID:</strong> SFG001</p>
                        <p><strong>Auth:</strong> M45NG12</p>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            <strong>Home:</strong> 12 Acacia Drive, Northwich M45 NG
                          </p>
                          <p className="text-xs text-gray-500">
                            <strong>Emergency:</strong> Warren Heathcote (Husband) - 07787 631861
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Warren Heathcote</CardTitle>
                        <Badge variant="outline">Operations Manager</Badge>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p><strong>Email:</strong> warren@sfg-aluminium.co.uk</p>
                        <p><strong>Mobile:</strong> 07787 631861</p>
                        <p><strong>Employee ID:</strong> SFG002</p>
                        <p><strong>Auth:</strong> M12QR8A</p>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            <strong>Home:</strong> 8A Greenwood Terrace, Manchester M12 QR
                          </p>
                          <p className="text-xs text-gray-500">
                            <strong>Emergency:</strong> Yanika Heathcote (Wife) - 0161 884 0131
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Pawel Marzec</CardTitle>
                        <Badge variant="outline">Payroll Officer</Badge>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p><strong>Email:</strong> pawel@sfg-aluminium.co.uk</p>
                        <p><strong>Phone:</strong> 0161 884 0132</p>
                        <p><strong>Employee ID:</strong> SFG003</p>
                        <p><strong>Auth:</strong> M145TY15</p>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            <strong>Home:</strong> 15 Victoria Street, Manchester M14 5TY
                          </p>
                          <p className="text-xs text-gray-500">
                            <strong>Emergency:</strong> Anna Marzec (Wife) - 07123 456789
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center py-4">
                    <Badge variant="outline">
                      Additional 24 employees - Full database available in Phase 2
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Compliance Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-green-600">✅ Active Compliance</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✅ GDPR Data Processing - Employee location data</li>
                      <li>✅ Working Time Monitoring - 48-hour limits</li>
                      <li>✅ Health & Safety - PPE requirements by area</li>
                      <li>✅ Equal Pay - Annual audit scheduled</li>
                      <li>✅ Data Retention - 3-year HMRC schedule</li>
                      <li>✅ Emergency Procedures - Contact database</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-amber-600">⚠️ Risk Management</h3>
                    <ul className="space-y-2 text-sm">
                      <li>⚠️ Location opt-out handling - Manual timesheet fallback</li>
                      <li>⚠️ 48-hour opt-out renewals - Annual review required</li>
                      <li>⚠️ Holiday pay calculations - Overtime inclusion pending</li>
                      <li>⚠️ Night work assessments - Health screening due</li>
                      <li>⚠️ Fatigue monitoring - HSE guidance compliance</li>
                      <li>⚠️ Equal pay audit - February 2025 deadline</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-lg">Audit Trail & Documentation</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Compliance Log
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View DPIA Document
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Generate Board Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            <CompanyRules />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
