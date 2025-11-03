
/**
 * Azure Key Vault Integration
 * Provides secure access to secrets stored in Azure Key Vault
 */

import { SecretClient } from "@azure/keyvault-secrets"
import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity"

// Key Vault configuration
const KEY_VAULT_URL = process.env.AZURE_KEY_VAULT_URL || ""
const USE_KEY_VAULT = process.env.USE_AZURE_KEY_VAULT === "true"

// Singleton client instance
let secretClient: SecretClient | null = null

/**
 * Initialize Key Vault client
 * Uses Managed Identity in production, or Client Credentials for local dev
 */
function getSecretClient(): SecretClient | null {
  if (!USE_KEY_VAULT || !KEY_VAULT_URL) {
    return null
  }

  if (!secretClient) {
    try {
      let credential

      // Check if we have explicit credentials (for local development)
      if (
        process.env.AZURE_CLIENT_ID &&
        process.env.AZURE_CLIENT_SECRET &&
        process.env.AZURE_TENANT_ID
      ) {
        credential = new ClientSecretCredential(
          process.env.AZURE_TENANT_ID,
          process.env.AZURE_CLIENT_ID,
          process.env.AZURE_CLIENT_SECRET
        )
      } else {
        // Use DefaultAzureCredential (Managed Identity in production)
        credential = new DefaultAzureCredential()
      }

      secretClient = new SecretClient(KEY_VAULT_URL, credential)
    } catch (error) {
      console.error("Failed to initialize Key Vault client:", error)
      return null
    }
  }

  return secretClient
}

/**
 * Get a secret from Key Vault
 * Falls back to environment variable if Key Vault is not configured
 */
export async function getSecret(secretName: string, fallbackEnvVar?: string): Promise<string | null> {
  const client = getSecretClient()

  // If Key Vault is not configured, use environment variable
  if (!client) {
    if (fallbackEnvVar) {
      const envValue = process.env[fallbackEnvVar]
      return envValue !== undefined ? envValue : null
    }
    return null
  }

  try {
    const secret = await client.getSecret(secretName)
    return secret.value || null
  } catch (error) {
    console.error(`Failed to get secret '${secretName}' from Key Vault:`, error)
    
    // Fallback to environment variable
    if (fallbackEnvVar) {
      const envValue = process.env[fallbackEnvVar]
      return envValue !== undefined ? envValue : null
    }
    
    return null
  }
}

/**
 * Set a secret in Key Vault (admin operation)
 */
export async function setSecret(secretName: string, secretValue: string): Promise<boolean> {
  const client = getSecretClient()

  if (!client) {
    console.error("Key Vault is not configured")
    return false
  }

  try {
    await client.setSecret(secretName, secretValue)
    return true
  } catch (error) {
    console.error(`Failed to set secret '${secretName}' in Key Vault:`, error)
    return false
  }
}

/**
 * Delete a secret from Key Vault (admin operation)
 */
export async function deleteSecret(secretName: string): Promise<boolean> {
  const client = getSecretClient()

  if (!client) {
    console.error("Key Vault is not configured")
    return false
  }

  try {
    await client.beginDeleteSecret(secretName)
    return true
  } catch (error) {
    console.error(`Failed to delete secret '${secretName}' from Key Vault:`, error)
    return false
  }
}

/**
 * List all secrets in Key Vault (admin operation)
 */
export async function listSecrets(): Promise<string[]> {
  const client = getSecretClient()

  if (!client) {
    return []
  }

  try {
    const secretNames: string[] = []
    for await (const secretProperties of client.listPropertiesOfSecrets()) {
      secretNames.push(secretProperties.name)
    }
    return secretNames
  } catch (error) {
    console.error("Failed to list secrets from Key Vault:", error)
    return []
  }
}

/**
 * Helper to get all SFG-specific secrets
 */
export async function getSFGSecrets() {
  return {
    entraClientId: await getSecret("sfg-wiki-entra-client-id", "AZURE_AD_CLIENT_ID"),
    entraClientSecret: await getSecret("sfg-wiki-entra-client-secret", "AZURE_AD_CLIENT_SECRET"),
    entraTenantId: await getSecret("sfg-wiki-entra-tenant-id", "AZURE_AD_TENANT_ID"),
    xeroClientId: await getSecret("sfg-xero-client-id", "XERO_CLIENT_ID"),
    xeroClientSecret: await getSecret("sfg-xero-client-secret", "XERO_CLIENT_SECRET"),
    twilioAccountSid: await getSecret("sfg-twilio-account-sid", "TWILIO_ACCOUNT_SID"),
    twilioAuthToken: await getSecret("sfg-twilio-auth-token", "TWILIO_AUTH_TOKEN"),
    nextAuthSecret: await getSecret("sfg-wiki-nextauth-secret", "NEXTAUTH_SECRET"),
  }
}
