import { getGitHubClient, GITHUB_CONFIG } from "../lib/github-client";

async function verifyRegistration() {
  try {
    console.log("🔍 Verifying SFG Aluminium Dashboard Registration...\n");
    
    const octokit = await getGitHubClient();
    const appFolder = "apps/SFG-Aluminium-Unified-Dashboard";
    
    // Check files
    console.log("📁 Checking files in repository...");
    const files = ["README.md", "business-logic.json", "registration-metadata.json"];
    
    for (const file of files) {
      try {
        const response = await octokit.repos.getContent({
          owner: GITHUB_CONFIG.owner,
          repo: GITHUB_CONFIG.repo,
          path: `${appFolder}/${file}`,
        });
        console.log(`   ✓ ${file} exists`);
      } catch (error: any) {
        console.log(`   ✗ ${file} missing`);
      }
    }
    
    // Check issue
    console.log("\n🎫 Checking registration issue...");
    const issues = await octokit.issues.listForRepo({
      owner: GITHUB_CONFIG.owner,
      repo: GITHUB_CONFIG.repo,
      labels: "registration,sfg-aluminium-app",
      state: "all",
      per_page: 5,
    });
    
    const registrationIssue = issues.data.find((issue) =>
      issue.title.includes("SFG-Aluminium-Unified-Dashboard")
    );
    
    if (registrationIssue) {
      console.log(`   ✓ Issue #${registrationIssue.number} found`);
      console.log(`   Title: ${registrationIssue.title}`);
      console.log(`   Labels: ${registrationIssue.labels.map((l: any) => l.name).join(", ")}`);
      console.log(`   Status: ${registrationIssue.state}`);
      console.log(`   URL: ${registrationIssue.html_url}`);
    } else {
      console.log("   ✗ Registration issue not found");
    }
    
    console.log("\n✅ Verification complete!\n");
    console.log("📦 View in GitHub:");
    console.log(`   https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/tree/main/${appFolder}\n`);
    
  } catch (error: any) {
    console.error("❌ Verification failed:", error.message);
  }
}

verifyRegistration();
