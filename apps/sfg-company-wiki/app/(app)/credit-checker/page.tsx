'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CreditCheckingUI } from '@/components/sfg/credit-checker';

interface CompanySearchResult {
  company_number: string;
  title: string;
  company_status: string;
  address_snippet: string;
}

interface CreditRiskAssessment {
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
  factors: string[];
  profile: any;
}

export default function CreditCheckerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanySearchResult | null>(null);
  const [creditRisk, setCreditRisk] = useState<CreditRiskAssessment | null>(null);
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

  const handleCompanySelect = async (company: CompanySearchResult) => {
    setSelectedCompany(company);
    setLoading(true);
    
    try {
      const response = await fetch(
        `/api/companies-house/credit-risk?number=${company.company_number}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assess credit risk');
      }

      setCreditRisk(data);
      toast.success('Credit risk assessment completed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to assess credit risk');
      console.error('Credit risk error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    const config: Record<string, { variant: any; icon: any; color: string }> = {
      LOW: { variant: 'default', icon: CheckCircle2, color: 'text-green-500' },
      MEDIUM: { variant: 'secondary', icon: AlertTriangle, color: 'text-yellow-500' },
      HIGH: { variant: 'destructive', icon: AlertTriangle, color: 'text-orange-500' },
      CRITICAL: { variant: 'destructive', icon: XCircle, color: 'text-red-500' },
    };

    const { variant, icon: Icon, color } = config[level] || config.MEDIUM;
    
    return (
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <Badge variant={variant}>{level} RISK</Badge>
      </div>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRecommendedTier = (score: number) => {
    if (score >= 80) return 'Platinum';
    if (score >= 70) return 'Gold';
    if (score >= 60) return 'Silver';
    if (score >= 50) return 'Bronze';
    return 'Proforma Only';
  };

  const getRecommendedCreditLimit = (score: number, riskLevel: string) => {
    const baseLimits: Record<string, number> = {
      LOW: 100000,
      MEDIUM: 50000,
      HIGH: 25000,
      CRITICAL: 0,
    };

    const base = baseLimits[riskLevel] || 25000;
    const multiplier = score / 100;
    return Math.round(base * multiplier);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Enhanced Credit Checker
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time credit risk assessment using Companies House data
          </p>
        </div>
      </div>

      <Tabs defaultValue="quick-check" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick-check">Quick Check (Companies House)</TabsTrigger>
          <TabsTrigger value="full-system">Full System (Legacy)</TabsTrigger>
        </TabsList>

        <TabsContent value="quick-check" className="space-y-4">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle>Company Search</CardTitle>
              <CardDescription>
                Search for a UK company by name or registration number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., ABC Manufacturing Ltd or 12345678"
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
                  <h3 className="font-semibold">Results ({searchResults.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {searchResults.map((company) => (
                      <Card
                        key={company.company_number}
                        className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedCompany?.company_number === company.company_number
                            ? 'border-primary'
                            : ''
                        }`}
                        onClick={() => handleCompanySelect(company)}
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
                            <Badge
                              variant={company.company_status === 'active' ? 'default' : 'secondary'}
                            >
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

          {/* Credit Risk Assessment */}
          {creditRisk && selectedCompany && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Risk Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className={`text-3xl font-bold ${getScoreColor(creditRisk.score)}`}>
                        {creditRisk.score}/100
                      </p>
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
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Assessment based on Companies House data • Last updated:{' '}
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Suggested Customer Tier
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        {getRecommendedTier(creditRisk.score)}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Recommended Credit Limit
                    </h4>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold">
                        £{getRecommendedCreditLimit(creditRisk.score, creditRisk.risk_level).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Payment Terms
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {creditRisk.score >= 80 && (
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          60-day terms approved
                        </li>
                      )}
                      {creditRisk.score >= 60 && (
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          30-day terms approved
                        </li>
                      )}
                      {creditRisk.score < 60 && (
                        <li className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          Proforma or COD recommended
                        </li>
                      )}
                      {creditRisk.score < 40 && (
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          Consider declining credit
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                      <strong>Note:</strong> These are automated recommendations based on
                      Companies House data. Please conduct additional due diligence for final
                      credit decisions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Company Profile Summary */}
              {creditRisk.profile && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Company Profile Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                        <p className="font-semibold">{creditRisk.profile.company_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge variant={creditRisk.profile.company_status === 'active' ? 'default' : 'secondary'}>
                          {creditRisk.profile.company_status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Type</p>
                        <p>{creditRisk.profile.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Incorporated</p>
                        <p>{new Date(creditRisk.profile.date_of_creation).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {creditRisk.profile.registered_office_address && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Registered Address
                        </p>
                        <div className="text-sm">
                          {creditRisk.profile.registered_office_address.address_line_1 && (
                            <p>{creditRisk.profile.registered_office_address.address_line_1}</p>
                          )}
                          {creditRisk.profile.registered_office_address.locality && (
                            <p>{creditRisk.profile.registered_office_address.locality}</p>
                          )}
                          {creditRisk.profile.registered_office_address.postal_code && (
                            <p>{creditRisk.profile.registered_office_address.postal_code}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="full-system">
          <CreditCheckingUI />
        </TabsContent>
      </Tabs>
    </div>
  );
}
