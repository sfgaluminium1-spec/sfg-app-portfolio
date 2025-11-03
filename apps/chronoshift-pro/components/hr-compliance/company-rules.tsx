
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, Shield, Car, AlertTriangle, Phone, MapPin } from 'lucide-react';

export function CompanyRules() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          SFG Aluminium Ltd - Employee Guide
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Essential company rules and employment information
        </p>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="conduct">Conduct</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="contact">Contacts</TabsTrigger>
        </TabsList>

        {/* Attendance Rules */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Working Hours & Time Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Standard Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Production:</span>
                      <span className="font-medium">08:00 - 17:00 (42.5hrs/week)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fabrication:</span>
                      <span className="font-medium">07:30 - 16:30 (42.5hrs/week)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Warehouse:</span>
                      <span className="font-medium">08:00 - 17:00 (42.5hrs/week)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Office:</span>
                      <span className="font-medium">08:30 - 17:30 (42.5hrs/week)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Break Entitlements</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <Badge variant="outline" className="mb-1">6-8 hours</Badge>
                      <p>1×15min paid + 30min lunch unpaid</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1">8-10 hours</Badge>
                      <p>2×15min paid + 30min lunch unpaid</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1">10+ hours</Badge>
                      <p>2×15min paid + 45min total unpaid</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Timesheet Rules</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-2">
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location Tracking Required
                  </p>
                  <ul className="space-y-1 text-sm ml-6">
                    <li>• GPS location captured automatically when submitting timesheets</li>
                    <li>• Must be within 50m of work site: 39 Clayton Lane South, Manchester M12 5PG</li>
                    <li>• Location data stored securely for 3 years (HMRC requirement)</li>
                    <li>• No continuous tracking - only at timesheet submission</li>
                  </ul>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Time Rounding Rules</h4>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      <p className="font-medium text-green-600">Within 15 minutes:</p>
                      <p>07:45-08:14 → Paid from 08:00</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      <p className="font-medium text-amber-600">15-45 minutes late:</p>
                      <p>08:15-08:44 → Paid from 08:30</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Absence & Lateness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Critical 30-Minute Rule
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  If you will be late, you MUST call <strong>0161 884 0131</strong> at least 30 minutes before your shift starts. 
                  Failure to notify may result in loss of paid absence day at Director's discretion.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Emergency Absence</h3>
                <div className="space-y-2 text-sm">
                  <p>For sudden illness or emergency:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Call office immediately: <strong>0161 884 0131</strong></li>
                    <li>Backup: Email HR@sfg-aluminium.co.uk</li>
                    <li>Provide: nature of emergency, expected duration, contact number</li>
                    <li>Evidence: Self-cert for days 1-7, fit note from day 8+</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Holiday Booking</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p><strong>Annual Entitlement:</strong> 28 days including bank holidays</p>
                    <p><strong>Year:</strong> 1 April - 31 March</p>
                    <p><strong>Notice:</strong> 2 weeks minimum</p>
                  </div>
                  <div>
                    <p><strong>Peak Restrictions:</strong></p>
                    <p>• Christmas: Max 50% team</p>
                    <p>• Summer: Rota basis</p>
                    <p>• Year-end: No leave Mar 25-31</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conduct Rules */}
        <TabsContent value="conduct" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Workplace Conduct & Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-green-600">Expected Behaviours</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Punctual attendance and professional conduct</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Wear appropriate PPE in designated areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Follow all safety procedures and report hazards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Maintain confidentiality and data security</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Support colleagues and promote teamwork</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-red-600">Prohibited Conduct</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Discrimination, harassment, or bullying</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Violence, threats, or aggressive behaviour</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Theft, dishonesty, or misuse of company property</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Substance abuse or working under the influence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Serious safety breaches or ignoring procedures</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">PPE Requirements by Area</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Location</th>
                        <th className="text-center p-2">Safety Boots</th>
                        <th className="text-center p-2">Hi-Vis</th>
                        <th className="text-center p-2">Safety Glasses</th>
                        <th className="text-center p-2">Hearing Protection</th>
                        <th className="text-center p-2">Gloves</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-2 font-medium">Production Floor</td>
                        <td className="text-center p-2">✓</td>
                        <td className="text-center p-2">✓</td>
                        <td className="text-center p-2">✓</td>
                        <td className="text-center p-2">✓</td>
                        <td className="text-center p-2">✓</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Warehouse</td>
                        <td className="text-center p-2">✓</td>
                        <td className="text-center p-2">✓</td>
                        <td className="text-center p-2">-</td>
                        <td className="text-center p-2">-</td>
                        <td className="text-center p-2">✓</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Furnace Area</td>
                        <td className="text-center p-2">✓</td>
                        <td className="text-center p-2">✓</td>
                        <td className="text-center p-2">✓</td>
                        <td className="text-center p-2">✓</td>
                        <td className="text-center p-2">Heat-resistant</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Office Areas</td>
                        <td className="text-center p-2">-</td>
                        <td className="text-center p-2">-</td>
                        <td className="text-center p-2">-</td>
                        <td className="text-center p-2">-</td>
                        <td className="text-center p-2">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicle Rules */}
        <TabsContent value="vehicles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Company Vehicle & Equipment Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  Authorised Use Windows Only
                </h3>
                <div className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  <p><strong>06:00-08:00:</strong> Home to work commute</p>
                  <p><strong>08:00-17:00:</strong> Work purposes only</p>
                  <p><strong>17:00-19:00:</strong> Work to home commute</p>
                  <p className="font-semibold mt-2">All other times: PROHIBITED (except emergencies)</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-red-600">Absolutely Prohibited</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Personal errands or shopping trips</li>
                    <li>• Weekend use without authorisation</li>
                    <li>• Holiday or leisure travel</li>
                    <li>• Family use or lending to others</li>
                    <li>• Private passenger transport</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-green-600">Required Documentation</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Valid UK driving licence</li>
                    <li>• Annual licence declaration</li>
                    <li>• Journey log maintained daily</li>
                    <li>• Fuel receipts submitted monthly</li>
                    <li>• Incident reports (immediate)</li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Forklift Operation</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Requirements:</strong></p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Current forklift certificate mandatory</li>
                    <li>Daily safety checks (Form FLT-01)</li>
                    <li>Speed limits: 5mph inside, 10mph outside</li>
                    <li>No passengers permitted under any circumstances</li>
                    <li>Report defects immediately to supervisor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Important Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Company Contacts</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-semibold">Main Office</p>
                      <p>Tel: 0161 884 0131</p>
                      <p>Email: info@sfg-aluminium.co.uk</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="font-semibold">HR Department</p>
                      <p>Email: HR@sfg-aluminium.co.uk</p>
                      <p>For: Grievances, policies, employment issues</p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="font-semibold">Payroll</p>
                      <p>Email: payroll@sfg-aluminium.co.uk</p>
                      <p>For: Pay queries, timesheets, benefits</p>
                    </div>
                    
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="font-semibold">Operations Manager</p>
                      <p>Warren Heathcote</p>
                      <p>Mobile: 07787 631 861</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Emergency & External Support</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="font-semibold text-red-600">Emergency Services</p>
                      <p>Police/Fire/Ambulance: <strong>999</strong></p>
                      <p>Non-emergency: <strong>111</strong></p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="font-semibold">ACAS (Employment Support)</p>
                      <p>Helpline: 0300 123 1100</p>
                      <p>Website: www.acas.org.uk</p>
                      <p>Free advice on employment rights</p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="font-semibold">HSE (Health & Safety)</p>
                      <p>Helpline: 0300 003 1647</p>
                      <p>Website: www.hse.gov.uk</p>
                      <p>For safety concerns and reporting</p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-semibold">Employee Assistance</p>
                      <p>Confidential helpline: 0800 XXX XXXX</p>
                      <p>Mental health first aiders on-site</p>
                      <p>Free counselling and support services</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Site Address</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="font-semibold">SFG Aluminium Limited</p>
                  <p>39 Clayton Lane South</p>
                  <p>Manchester M12 5PG</p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <strong>Registered Office:</strong> 86-89 Paul St, London EC2A 4NE
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
