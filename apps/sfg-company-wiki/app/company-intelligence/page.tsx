
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Building2, Users, FileText, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CompanyIntelligencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [officers, setOfficers] = useState<any[]>([]);
  const [creditRisk, setCreditRisk] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a company name or number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/companies-house/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setSearchResults(data.items || []);
      if (data.items?.length === 0) {
        toast.error('No companies found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to search companies');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyDetails = async (companyNumber: string) => {
    setLoading(true);
    try {
      // Load profile
      const profileRes = await fetch(`/api/companies-house/profile?number=${companyNumber}`);
      const profileData = await profileRes.json();
      setCompanyProfile(profileData);

      // Load officers
      const officersRes = await fetch(`/api/companies-house/officers?number=${companyNumber}`);
      const officersData = await officersRes.json();
      setOfficers(officersData.items || []);

      // Load credit risk assessment
      const riskRes = await fetch(`/api/companies-house/credit-risk?number=${companyNumber}`);
      const riskData = await riskRes.json();
      setCreditRisk(riskData);

      toast.success('Company details loaded');
    } catch (error: any) {
      toast.error('Failed to load company details');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    const variants: any = {
      LOW: 'default',
      MEDIUM: 'secondary',
      HIGH: 'destructive',
      CRITICAL: 'destructive',
    };
    return <Badge variant={variants[level] || 'default'}>{level} RISK</Badge>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'active') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === 'dissolved') return <XCircle className="w-4 h-4 text-red-500" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="w-8 h-8" />
            Company Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            Search and analyze UK companies using Companies House data
          </p>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Companies</CardTitle>
          <CardDescription>Enter company name or registration number</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., SFG Aluminium Ltd or 12345678"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Search Results ({searchResults.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((company) => (
                  <Card
                    key={company.company_number}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedCompany(company);
                      loadCompanyDetails(company.company_number);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{company.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Company No: {company.company_number}
                          </p>
                          {company.address_snippet && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {company.address_snippet}
                            </p>
                          )}
                        </div>
                        <Badge variant={company.company_status === 'active' ? 'default' : 'secondary'}>
                          {company.company_status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Details */}
      {companyProfile && (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Company Profile</TabsTrigger>
            <TabsTrigger value="officers">Officers</TabsTrigger>
            <TabsTrigger value="risk">Credit Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(companyProfile.company_status)}
                      {companyProfile.company_name}
                    </CardTitle>
                    <CardDescription>
                      Company No: {companyProfile.company_number}
                    </CardDescription>
                  </div>
                  <Badge>{companyProfile.company_status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p>{companyProfile.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Incorporated</p>
                    <p>{new Date(companyProfile.date_of_creation).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Registered Address</p>
                  <div className="text-sm">
                    {companyProfile.registered_office_address?.address_line_1 && (
                      <p>{companyProfile.registered_office_address.address_line_1}</p>
                    )}
                    {companyProfile.registered_office_address?.address_line_2 && (
                      <p>{companyProfile.registered_office_address.address_line_2}</p>
                    )}
                    {companyProfile.registered_office_address?.locality && (
                      <p>{companyProfile.registered_office_address.locality}</p>
                    )}
                    {companyProfile.registered_office_address?.postal_code && (
                      <p>{companyProfile.registered_office_address.postal_code}</p>
                    )}
                  </div>
                </div>

                {companyProfile.sic_codes && companyProfile.sic_codes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">SIC Codes</p>
                    <div className="flex flex-wrap gap-2">
                      {companyProfile.sic_codes.map((code: string) => (
                        <Badge key={code} variant="outline">{code}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {companyProfile.accounts && (
                  <div className="grid grid-cols-2 gap-4">
                    {companyProfile.accounts.next_due && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Next Accounts Due</p>
                        <p>{new Date(companyProfile.accounts.next_due).toLocaleDateString()}</p>
                      </div>
                    )}
                    {companyProfile.accounts.last_made_up_to && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Accounts</p>
                        <p>{new Date(companyProfile.accounts.last_made_up_to).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="officers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Company Officers ({officers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {officers.map((officer, idx) => (
                    <div key={idx} className="border-b pb-4 last:border-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{officer.name}</h4>
                          <p className="text-sm text-muted-foreground">{officer.officer_role}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Appointed: {new Date(officer.appointed_on).toLocaleDateString()}
                          </p>
                          {officer.resigned_on && (
                            <p className="text-sm text-red-600">
                              Resigned: {new Date(officer.resigned_on).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {!officer.resigned_on && <Badge>Active</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            {creditRisk && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Credit Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-2xl font-bold">{creditRisk.score}/100</p>
                      <p className="text-sm text-muted-foreground">Credit Score</p>
                    </div>
                    {getRiskBadge(creditRisk.risk_level)}
                  </div>

                  {creditRisk.factors && creditRisk.factors.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Risk Factors</h4>
                      <ul className="space-y-2">
                        {creditRisk.factors.map((factor: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                            <span className="text-sm">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Note:</strong> This is an automated assessment based on Companies House data.
                      For comprehensive credit decisions, please conduct additional due diligence.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
