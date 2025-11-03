
import { vault } from '../lib/vault';

console.log('=== VAULT DEBUG ===');
console.log('\nRaw vault services:', Object.keys(vault.getRawVault()));
console.log('\nDetailed vault structure:');
const raw = vault.getRawVault();
for (const [serviceName, service] of Object.entries(raw)) {
  console.log(`\n${serviceName}:`);
  console.log('  Secrets:', Object.keys(service.secrets));
}

console.log('\n=== CREDENTIAL CHECKS ===');
console.log('bytebot:', vault.hasCredentials('bytebot'));
console.log('companies_house:', vault.hasCredentials('companies_house'));
console.log('companies house:', vault.hasCredentials('companies house'));
console.log('twilio:', vault.hasCredentials('twilio'));
console.log('microsoft_graph:', vault.hasCredentials('microsoft_graph'));
console.log('xero:', vault.hasCredentials('xero'));
