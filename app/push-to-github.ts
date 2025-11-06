
import { createOctokitClient } from './github-auth';
import { execSync } from 'child_process';

async function pushToGitHub() {
  console.log('🔐 Getting GitHub access token...');
  
  const octokit = await createOctokitClient();
  
  // Get installation access token
  try {
    const { data: installation } = await octokit.apps.getAuthenticated();
    console.log('✅ Authenticated as:', installation?.name || 'GitHub App');
  } catch (error: any) {
    console.log('ℹ️ Could not get app details:', error.message);
  }
  
  // Get the installation token using the auth function
  const authResult = await octokit.auth({
    type: 'installation',
  }) as any;
  
  const token = authResult.token;
  console.log('✅ Got access token');
  
  // Configure git with the token
  const owner = 'sfgaluminium1-spec';
  const repo = 'sfg-app-portfolio';
  const remoteUrl = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;
  
  try {
    // Update remote URL with token
    execSync(`git remote set-url origin ${remoteUrl}`, { cwd: process.cwd() });
    console.log('✅ Updated git remote with authentication');
    
    // Create a new branch for Warren Innovation Hub
    const appBranch = 'warren-innovation-hub';
    console.log(`📍 Creating/switching to branch: ${appBranch}`);
    
    try {
      execSync(`git checkout -b ${appBranch}`, { 
        cwd: process.cwd(),
        encoding: 'utf-8'
      });
      console.log(`✅ Created new branch: ${appBranch}`);
    } catch (error: any) {
      // Branch might already exist, try to switch to it
      execSync(`git checkout ${appBranch}`, { 
        cwd: process.cwd(),
        encoding: 'utf-8'
      });
      console.log(`✅ Switched to existing branch: ${appBranch}`);
    }
    
    // Push to GitHub
    console.log('📤 Pushing to GitHub...');
    try {
      const pushResult = execSync(`git push -u origin ${appBranch}`, { 
        cwd: process.cwd(),
        encoding: 'utf-8'
      });
      console.log(pushResult);
    } catch (error: any) {
      // If push fails due to remote branch existing, try to pull and merge first
      console.log('ℹ️ Remote branch exists, pulling changes...');
      execSync(`git pull origin ${appBranch} --rebase`, { 
        cwd: process.cwd(),
        encoding: 'utf-8'
      });
      console.log('✅ Pulled and rebased successfully');
      
      console.log('📤 Pushing again...');
      const pushResult = execSync(`git push -u origin ${appBranch}`, { 
        cwd: process.cwd(),
        encoding: 'utf-8'
      });
      console.log(pushResult);
    }
    
    console.log('✅ Successfully pushed to GitHub!');
    console.log(`🔗 Repository: https://github.com/${owner}/${repo}`);
    
    // Reset remote URL to https (without token) for security
    execSync(`git remote set-url origin https://github.com/${owner}/${repo}.git`, { cwd: process.cwd() });
    
  } catch (error: any) {
    console.error('❌ Error pushing to GitHub:', error.message);
    if (error.stdout) console.error('stdout:', error.stdout.toString());
    if (error.stderr) console.error('stderr:', error.stderr.toString());
    throw error;
  }
}

pushToGitHub().catch(console.error);
