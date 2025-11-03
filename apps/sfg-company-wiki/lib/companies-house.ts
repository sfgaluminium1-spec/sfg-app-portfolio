
/**
 * Companies House API Integration
 * Official API: https://api.company-information.service.gov.uk
 */

interface CompanyProfile {
  company_number: string;
  company_name: string;
  company_status: string;
  company_status_detail?: string;
  type: string;
  date_of_creation: string;
  registered_office_address: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
  accounts?: {
    next_due?: string;
    last_made_up_to?: string;
    accounting_reference_date?: {
      day: string;
      month: string;
    };
  };
  confirmation_statement?: {
    next_due?: string;
    last_made_up_to?: string;
  };
  sic_codes?: string[];
  has_insolvency_history?: boolean;
  has_charges?: boolean;
}

interface CompanyOfficer {
  name: string;
  officer_role: string;
  appointed_on: string;
  resigned_on?: string;
  address: {
    address_line_1?: string;
    locality?: string;
    postal_code?: string;
  };
}

interface CompanyFilingHistory {
  category: string;
  date: string;
  description: string;
  type: string;
}

class CompaniesHouseAPI {
  private apiKey: string | null = null;
  private baseURL = 'https://api.company-information.service.gov.uk';

  private loadAPIKey(): string {
    if (this.apiKey) return this.apiKey;
    
    const apiKey = process.env.COMPANIES_HOUSE_API_KEY;
    if (!apiKey) {
      throw new Error('Companies House API key not found in environment variables');
    }
    this.apiKey = apiKey.trim();
    return this.apiKey;
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const apiKey = this.loadAPIKey();
    const url = `${this.baseURL}${endpoint}`;
    const auth = Buffer.from(`${apiKey}:`).toString('base64');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Companies House API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCompanyProfile(companyNumber: string): Promise<CompanyProfile> {
    const cleanNumber = companyNumber.replace(/\s/g, '').toUpperCase();
    return this.makeRequest(`/company/${cleanNumber}`);
  }

  async searchCompanies(query: string): Promise<any> {
    return this.makeRequest(`/search/companies?q=${encodeURIComponent(query)}`);
  }

  async getCompanyOfficers(companyNumber: string): Promise<{ items: CompanyOfficer[] }> {
    const cleanNumber = companyNumber.replace(/\s/g, '').toUpperCase();
    return this.makeRequest(`/company/${cleanNumber}/officers`);
  }

  async getFilingHistory(companyNumber: string): Promise<{ items: CompanyFilingHistory[] }> {
    const cleanNumber = companyNumber.replace(/\s/g, '').toUpperCase();
    return this.makeRequest(`/company/${cleanNumber}/filing-history`);
  }

  async getCompanyCharges(companyNumber: string): Promise<any> {
    const cleanNumber = companyNumber.replace(/\s/g, '').toUpperCase();
    try {
      return await this.makeRequest(`/company/${cleanNumber}/charges`);
    } catch (error) {
      // Some companies may not have charges
      return { items: [] };
    }
  }

  // Credit risk assessment helper
  async assessCompanyCreditRisk(companyNumber: string): Promise<{
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    score: number;
    factors: string[];
    profile: CompanyProfile;
  }> {
    const profile = await this.getCompanyProfile(companyNumber);
    const factors: string[] = [];
    let score = 100;

    // Check company status
    if (profile.company_status !== 'active') {
      factors.push(`Company status: ${profile.company_status}`);
      score -= 40;
    }

    // Check age
    const creationDate = new Date(profile.date_of_creation);
    const ageInYears = (Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (ageInYears < 1) {
      factors.push('Company less than 1 year old');
      score -= 20;
    }

    // Check insolvency history
    if (profile.has_insolvency_history) {
      factors.push('Has insolvency history');
      score -= 30;
    }

    // Check charges
    if (profile.has_charges) {
      factors.push('Has registered charges');
      score -= 10;
    }

    // Determine risk level
    let risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (score >= 80) risk_level = 'LOW';
    else if (score >= 60) risk_level = 'MEDIUM';
    else if (score >= 40) risk_level = 'HIGH';
    else risk_level = 'CRITICAL';

    return { risk_level, score, factors, profile };
  }
}

export const companiesHouseAPI = new CompaniesHouseAPI();
export type { CompanyProfile, CompanyOfficer, CompanyFilingHistory };
