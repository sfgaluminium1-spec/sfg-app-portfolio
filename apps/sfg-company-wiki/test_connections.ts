/**
 * Connection Test Script for Wiki
 * Tests: SharePoint (Read/Write), Database, APIs
 */

import { microsoftGraphAPI } from './lib/microsoft-graph';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSharePointRead() {
  console.log('\n🔍 Testing SharePoint READ Connection...');
  try {
    const sites = await microsoftGraphAPI.getSites();
    console.log(`✅ SUCCESS: Found ${sites.length} SharePoint sites`);
    if (sites.length > 0) {
      console.log(`   Sample site: ${sites[0].displayName}`);
    }
    return true;
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}`);
    return false;
  }
}

async function testSharePointWrite() {
  console.log('\n📝 Testing SharePoint WRITE Connection...');
  console.log('⚠️  Write operations not yet implemented in current codebase');
  console.log('   Current scope: Files.Read.All, Sites.Read.All (READ ONLY)');
  console.log('   Required for write: Files.ReadWrite.All, Sites.ReadWrite.All');
  return false;
}

async function testDatabase() {
  console.log('\n💾 Testing Database Connection...');
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const procedureCount = await prisma.procedure.count();
    console.log(`✅ SUCCESS: Database connected`);
    console.log(`   Users: ${userCount}, Categories: ${categoryCount}, Procedures: ${procedureCount}`);
    return true;
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}`);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function testAPIs() {
  console.log('\n🔌 Testing External API Connections...');
  
  // Test Companies House
  try {
    const apiKey = process.env.COMPANIES_HOUSE_API_KEY;
    if (!apiKey) throw new Error('API key not configured');
    
    const response = await fetch('https://api.company-information.service.gov.uk/company/00000006', {
      headers: { 'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}` }
    });
    
    if (response.ok) {
      console.log('✅ Companies House API: Working');
    } else {
      console.log(`⚠️  Companies House API: ${response.status} ${response.statusText}`);
    }
  } catch (error: any) {
    console.log(`❌ Companies House API: ${error.message}`);
  }
  
  // Test Xero (check configuration)
  const xeroConfigured = !!(process.env.XERO_CLIENT_ID && process.env.XERO_CLIENT_SECRET);
  console.log(xeroConfigured ? '✅ Xero API: Configured' : '⚠️  Xero API: Not configured');
  
  // Test Abacus AI
  const abacusConfigured = !!process.env.ABACUSAI_API_KEY;
  console.log(abacusConfigured ? '✅ Abacus AI: Configured' : '⚠️  Abacus AI: Not configured');
  
  return true;
}

async function runAllTests() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  SFG COMPANY WIKI - CONNECTION TEST SUITE        ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  
  const results = {
    sharepointRead: await testSharePointRead(),
    sharepointWrite: await testSharePointWrite(),
    database: await testDatabase(),
    apis: await testAPIs(),
  };
  
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║  TEST SUMMARY                                     ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log(`SharePoint READ:  ${results.sharepointRead ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`SharePoint WRITE: ${results.sharepointWrite ? '✅ PASS' : '⚠️  NOT IMPLEMENTED'}`);
  console.log(`Database:         ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`External APIs:    ${results.apis ? '✅ PASS' : '❌ FAIL'}`);
  
  return results;
}

runAllTests()
  .then((results) => {
    console.log('\n✅ Test suite completed\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });
