
/**
 * Vault Manager - Unified API Credentials Management
 * Based on SFG COMET CORE API Sharing Package
 * 
 * This library provides a single interface to access all API credentials
 * across the SFG ecosystem, supporting both .env and auth_secrets.json sources.
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load .env file if it exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  config({ path: envPath });
}

interface SecretValue {
  value: string;
  expires_at?: string;
}

interface ServiceSecrets {
  secrets: {
    [key: string]: SecretValue;
  };
}

interface VaultSecrets {
  [serviceName: string]: ServiceSecrets;
}

class Vault {
  private secrets: VaultSecrets = {};
  private authSecretsPath: string;
  private initialized: boolean = false;

  constructor() {
    this.authSecretsPath = path.join(
      process.env.HOME || '',
      '.config',
      'abacusai_auth_secrets.json'
    );
    this.loadSecrets();
  }

  private loadSecrets(): void {
    // Load from auth_secrets.json (OAuth and API secrets configured via UI)
    if (fs.existsSync(this.authSecretsPath)) {
      try {
        const fileContent = fs.readFileSync(this.authSecretsPath, 'utf-8');
        const authSecrets = JSON.parse(fileContent);
        this.secrets = { ...authSecrets };
      } catch (error) {
        console.warn('Failed to load auth secrets:', error);
      }
    }

    // Overlay with .env credentials (takes precedence)
    this.loadEnvSecrets();
    this.initialized = true;
  }

  private loadEnvSecrets(): void {
    // Bytebot AI (LLM & RAG)
    if (process.env.BYTEBOT_API_KEY || process.env.ABACUSAI_API_KEY) {
      this.secrets.bytebot = {
        secrets: {
          api_key: { value: process.env.BYTEBOT_API_KEY || '' },
          abacus_api_key: { value: process.env.ABACUSAI_API_KEY || '' },
        },
      };
    }

    // Companies House
    if (process.env.COMPANIES_HOUSE_API_KEY) {
      this.secrets.companies_house = {
        secrets: {
          api_key: { value: process.env.COMPANIES_HOUSE_API_KEY },
          login_email: { value: process.env.COMPANIES_HOUSE_LOGIN_EMAIL || '' },
          login_password: { value: process.env.COMPANIES_HOUSE_LOGIN_PASSWORD || '' },
        },
      };
    }

    // Twilio
    if (process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_AUTH_TOKEN) {
      this.secrets.twilio = {
        secrets: {
          account_sid: { value: process.env.TWILIO_ACCOUNT_SID || '' },
          auth_token: { value: process.env.TWILIO_AUTH_TOKEN || '' },
        },
      };
    }

    // Microsoft Graph
    if (process.env.MICROSOFT_GRAPH_CLIENT_ID) {
      this.secrets.microsoft_graph = {
        secrets: {
          client_id: { value: process.env.MICROSOFT_GRAPH_CLIENT_ID },
          client_secret: { value: process.env.MICROSOFT_GRAPH_CLIENT_SECRET || '' },
          tenant_id: { value: process.env.MICROSOFT_GRAPH_TENANT_ID || '' },
          object_id: { value: process.env.MICROSOFT_GRAPH_OBJECT_ID || '' },
        },
      };
    }

    // SharePoint Access Token (legacy support)
    if (process.env.SHAREPOINT_ACCESS_TOKEN) {
      if (!this.secrets.sharepoint) {
        this.secrets.sharepoint = { secrets: {} };
      }
      this.secrets.sharepoint.secrets.access_token = {
        value: process.env.SHAREPOINT_ACCESS_TOKEN,
      };
    }

    // Xero
    if (process.env.XERO_CLIENT_ID) {
      this.secrets.xero = {
        secrets: {
          client_id: { value: process.env.XERO_CLIENT_ID },
          client_secret: { value: process.env.XERO_CLIENT_SECRET || '' },
          redirect_uri: { value: process.env.XERO_REDIRECT_URI || '' },
        },
      };
    }
  }

  /**
   * Get a specific secret value for a service
   */
  async getSecret(serviceName: string, secretName: string): Promise<string> {
    const normalizedService = serviceName.toLowerCase().replace(/\s+/g, '_');
    
    // Try multiple service name variations
    const service = 
      this.secrets[normalizedService] || 
      this.secrets[serviceName] ||
      this.secrets[serviceName.toLowerCase()] ||
      this.secrets[serviceName.replace(/_/g, ' ')];

    if (!service || !service.secrets) {
      throw new Error(`Service "${serviceName}" not found in vault`);
    }

    const secret = service.secrets[secretName];
    if (!secret) {
      throw new Error(`Secret "${secretName}" not found for service "${serviceName}"`);
    }

    // Check if token is expired
    if (secret.expires_at) {
      const expiresAt = new Date(secret.expires_at);
      if (expiresAt < new Date()) {
        throw new Error(`Token expired for ${serviceName}.${secretName}`);
      }
    }

    return secret.value;
  }

  /**
   * Get all secrets for a service
   */
  async getServiceSecrets(serviceName: string): Promise<Record<string, string>> {
    const normalizedService = serviceName.toLowerCase().replace(/\s+/g, '_');
    const service = this.secrets[normalizedService] || this.secrets[serviceName];

    if (!service || !service.secrets) {
      throw new Error(`Service "${serviceName}" not found in vault`);
    }

    const result: Record<string, string> = {};
    for (const [key, secretValue] of Object.entries(service.secrets)) {
      result[key] = secretValue.value;
    }

    return result;
  }

  /**
   * Check if credentials exist for a service
   */
  hasCredentials(serviceName: string): boolean {
    const normalizedService = serviceName.toLowerCase().replace(/\s+/g, '_');
    
    // Try multiple service name variations
    const service = 
      this.secrets[normalizedService] || 
      this.secrets[serviceName] ||
      this.secrets[serviceName.toLowerCase()] ||
      this.secrets[serviceName.replace(/_/g, ' ')];
      
    return Boolean(service && service.secrets && Object.keys(service.secrets).length > 0);
  }

  /**
   * List all available services
   */
  listServices(): string[] {
    return Object.keys(this.secrets);
  }

  /**
   * Get raw vault data (for debugging)
   */
  getRawVault(): VaultSecrets {
    return this.secrets;
  }
}

// Singleton instance
const vault = new Vault();

// Export convenience functions
export async function getSecret(serviceName: string, secretName: string): Promise<string> {
  return vault.getSecret(serviceName, secretName);
}

export async function getServiceSecrets(serviceName: string): Promise<Record<string, string>> {
  return vault.getServiceSecrets(serviceName);
}

export function hasCredentials(serviceName: string): boolean {
  return vault.hasCredentials(serviceName);
}

export function listServices(): string[] {
  return vault.listServices();
}

export { vault };
export default vault;

