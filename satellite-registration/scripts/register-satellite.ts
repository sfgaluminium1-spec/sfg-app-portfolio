
/**
 * SFG Satellite App Registration - Main Registration Script
 * @version 2.0
 * @date November 3, 2025
 */

import { createOctokitClient, getRepoConfig, verifyAuth } from './github-auth';
import { extractBusinessLogic, validateBusinessLogic } from './extract-business-logic';
import { formatIssueBody, formatIssueTitle, getIssueLabels } from '../utils/issue-formatter';
import type { RegistrationResult } from '../types/business-logic';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Register satellite app with SFG orchestration ecosystem
 * @returns {Promise<RegistrationResult>} Registration result
 */
async function registerSatelliteApp(): Promise<RegistrationResult> {
  console.log('🚀 SFG Satellite App Registration');
  console.log('═══════════════════════════════════════════\n');

  try {
    // Step 1: Verify authentication
    console.log('🔐 Verifying GitHub authentication...');
    const isAuthenticated = await verifyAuth();
    
    if (!isAuthenticated) {
      return {
        success: false,
        error: 'GitHub authentication failed. Please check your credentials.',
      };
    }
    console.log('✅ Authentication verified\n');

    // Step 2: Extract business logic
    console.log('📊 Extracting business logic...');
    const businessLogic = extractBusinessLogic();
    console.log(`✅ Extracted: ${businessLogic.app_name} v${businessLogic.version}\n`);

    // Step 3: Validate business logic
    console.log('🔍 Validating business logic...');
    const warnings = validateBusinessLogic(businessLogic);
    
    if (warnings.length > 0) {
      console.log('⚠️  Validation warnings:');
      warnings.forEach(warning => console.log(`   ${warning}`));
      console.log('');
    } else {
      console.log('✅ Business logic validated\n');
    }

    // Step 4: Create Octokit client
    const octokit = await createOctokitClient();
    const { owner, repo } = getRepoConfig();

    // Step 5: Format issue content
    console.log('📝 Formatting registration issue...');
    const issueTitle = formatIssueTitle(businessLogic.app_name);
    const issueBody = formatIssueBody(businessLogic, owner, repo);
    const issueLabels = getIssueLabels();
    console.log('✅ Issue formatted\n');

    // Step 6: Create GitHub issue
    console.log('🚀 Creating registration issue on GitHub...');
    const issue = await octokit.issues.create({
      owner,
      repo,
      title: issueTitle,
      body: issueBody,
      labels: issueLabels,
    });
    console.log(`✅ Issue created: #${issue.data.number}\n`);

    // Step 7: Save business logic locally
    console.log('💾 Saving business logic locally...');
    const outputDir = path.join(process.cwd(), '../registration_output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(
      outputDir,
      `${businessLogic.app_name}_${timestamp}.json`
    );

    fs.writeFileSync(outputFile, JSON.stringify(businessLogic, null, 2));
    console.log(`✅ Saved to: ${outputFile}\n`);

    // Success summary
    console.log('═══════════════════════════════════════════');
    console.log('✅ REGISTRATION COMPLETE!');
    console.log('═══════════════════════════════════════════');
    console.log(`📝 Issue URL: ${issue.data.html_url}`);
    console.log(`🔢 Issue Number: #${issue.data.number}`);
    console.log(`📊 Business Logic: ${outputFile}`);
    console.log(`⏰ Expected Review: 24-48 hours`);
    console.log('');
    console.log('Next Steps:');
    console.log('1. Monitor GitHub issue for Nexus approval');
    console.log('2. Check for integration instructions');
    console.log('3. Prepare for MCP server setup');
    console.log('');

    return {
      success: true,
      issue_url: issue.data.html_url,
      issue_number: issue.data.number,
    };
  } catch (error) {
    console.error('❌ Registration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Run registration if executed directly
if (require.main === module) {
  registerSatelliteApp()
    .then(result => {
      if (!result.success) {
        console.error(`\n❌ Error: ${result.error}`);
        process.exit(1);
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

export { registerSatelliteApp };
