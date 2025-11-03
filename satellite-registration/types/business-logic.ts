
/**
 * SFG Satellite App Registration - Business Logic Type Definitions
 * @version 2.0
 * @date November 3, 2025
 */

export interface Workflow {
  name: string;
  description: string;
  steps?: string[];
  triggers?: string;
  outputs?: string;
}

export interface BusinessRule {
  name: string;
  description: string;
  condition?: string;
  action?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface ApiEndpoint {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  purpose: string;
  auth_required?: boolean;
}

export interface DataModel {
  name: string;
  description: string;
  key_fields?: string[];
}

export type AppCategory =
  | 'PROJECT_MANAGEMENT'
  | 'ESTIMATING'
  | 'SCHEDULING'
  | 'LEGAL_COMPLIANCE'
  | 'WORKSPACE_MANAGEMENT'
  | 'DOCUMENT_MANAGEMENT'
  | 'CRM'
  | 'FINANCE'
  | 'HR'
  | 'OPERATIONS'
  | 'ANALYTICS'
  | 'INTEGRATION'
  | 'AUTOMATION'
  | 'OTHER';

export interface BusinessLogic {
  app_name: string;
  category: AppCategory;
  description: string;
  version: string;
  app_url?: string;
  capabilities: string[];
  workflows: Workflow[];
  business_rules: BusinessRule[];
  integrations: string[];
  api_endpoints: ApiEndpoint[];
  data_models: DataModel[];
  contact_email?: string;
  repository_url?: string;
}

export interface RegistrationResult {
  success: boolean;
  issue_url?: string;
  issue_number?: number;
  error?: string;
}
