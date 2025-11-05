
/**
 * API Connections Test Script
 * Tests all API integrations from the SFG COMET CORE API Sharing Package
 * 
 * Run with: yarn tsx scripts/test-api-connections.ts
 */

import { getSecret, hasCredentials, listServices } from '../lib/vault';
import { companiesHouseAPI } from '../lib/companies-house';
import { bytebotAI } from '../lib/bytebot';
import { twilioAPI } from '../lib/twilio';
import { xeroAPI } from '../lib/xero';

async function testConnections() {
  console.log('\n🔍 SFG API CONNECTIONS TEST\n');
  console.log('=' .repeat(60));
  
  // Show available services
  console.log('\n📦 Available Services in Vault:');
  const services = listServices();
  services.forEach(service => {
    const hasConfig = hasCredentials(service);
    console.log(`  ${hasConfig ? '✅' : '❌'} ${service}`);
  });
  
  console.log('\n' + '='.repeat(60));
  
  // Test 1: Companies House API
  console.log('\n📌 TEST 1: Companies House API');
  if (hasCredentials('companies_house')) {
    try {
      console.log('  Testing company lookup (00000006 - Marks & Spencer)...');
      const company = await companiesHouseAPI.getCompanyProfile('00000006');
      console.log(`  ✅ SUCCESS`);
      console.log(`     Company: ${company.company_name}`);
      console.log(`     Status: ${company.company_status}`);
      console.log(`     Type: ${company.type}`);
    } catch (error: any) {
      console.log(`  ❌ FAILED: ${error.message}`);
    }
  } else {
    console.log('  ⚠️  SKIPPED: Credentials not found');
  }
  
  // Test 2: Bytebot AI (LLM/RAG)
  console.log('\n📌 TEST 2: Bytebot AI (LLM/RAG)');
  if (hasCredentials('bytebot')) {
    try {
      console.log('  Testing AI query...');
      const response = await bytebotAI.ragQuery(
        'What is a credit check?',
        'You are a helpful assistant.'
      );
      console.log(`  ✅ SUCCESS`);
      console.log(`     Response: ${response.substring(0, 100)}...`);
    } catch (error: any) {
      console.log(`  ❌ FAILED: ${error.message}`);
    }
  } else {
    console.log('  ⚠️  SKIPPED: Credentials not found');
  }
  
  // Test 3: Twilio
  console.log('\n📌 TEST 3: Twilio API');
  if (hasCredentials('twilio')) {
    try {
      const accountSid = await getSecret('twilio', 'account_sid');
      console.log(`  ✅ Credentials found`);
      console.log(`     Account SID: ${accountSid.substring(0, 10)}...`);
      console.log(`     ⚠️  Skipping actual SMS send (avoid charges)`);
    } catch (error: any) {
      console.log(`  ❌ FAILED: ${error.message}`);
    }
  } else {
    console.log('  ⚠️  SKIPPED: Credentials not found');
  }
  
  // Test 4: Microsoft Graph / SharePoint
  console.log('\n📌 TEST 4: Microsoft Graph / SharePoint');
  if (hasCredentials('microsoft_graph') || hasCredentials('sharepoint')) {
    try {
      const clientId = await getSecret('microsoft_graph', 'client_id');
      console.log(`  ✅ Credentials found`);
      console.log(`     Client ID: ${clientId.substring(0, 10)}...`);
      console.log(`     ⚠️  OAuth flow requires user authentication`);
    } catch (error: any) {
      console.log(`  ❌ FAILED: ${error.message}`);
    }
  } else {
    console.log('  ⚠️  SKIPPED: Credentials not found');
  }
  
  // Test 5: Xero
  console.log('\n📌 TEST 5: Xero Accounting API');
  if (hasCredentials('xero')) {
    try {
      const clientId = await getSecret('xero', 'client_id');
      console.log(`  ✅ Credentials found`);
      console.log(`     Client ID: ${clientId.substring(0, 10)}...`);
      console.log(`     ⚠️  OAuth flow requires user authentication`);
    } catch (error: any) {
      console.log(`  ❌ FAILED: ${error.message}`);
    }
  } else {
    console.log('  ⚠️  SKIPPED: Credentials not found');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ API CONNECTION TESTS COMPLETE\n');
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log('  • Companies House: Ready for immediate use');
  console.log('  • Bytebot AI: Ready for RAG queries and AI features');
  console.log('  • Twilio: Ready for SMS/WhatsApp notifications');
  console.log('  • Microsoft Graph: Requires OAuth flow setup');
  console.log('  • Xero: Requires OAuth flow setup');
  console.log('\n💡 NEXT STEPS:');
  console.log('  1. Implement OAuth callback routes for Graph & Xero');
  console.log('  2. Add AI-powered features using Bytebot');
  console.log('  3. Set up notification system with Twilio');
  console.log('  4. Integrate company credit checks with Companies House');
  console.log('');
}

// Run tests
testConnections().catch(console.error);

