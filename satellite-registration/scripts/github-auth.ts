
/**
 * SFG Satellite App Registration - GitHub Authentication
 * @version 2.0
 * @date November 3, 2025
 */

import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

// GitHub App credentials from environment variables
const GITHUB_APP_ID = process.env.GITHUB_APP_ID || '2228094';
const GITHUB_INSTALLATION_ID = process.env.GITHUB_APP_INSTALLATION_ID || '92873690';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'sfgaluminium1-spec';
const GITHUB_REPO = process.env.GITHUB_REPO || 'sfg-app-portfolio';

// Private key from environment variable
const PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY || `-----BEGIN RSA PRIVATE KEY-----
MIIEpgIBAAKCAQEA8+XtgHAePuJNY7UH65XFqSVQKvQpgPz/URxrdYb8gLnjK4dx
QU9uAvlOHhMm8yNPfZNzEU74H1I7mzfds+/wT5GncSnKKiPBRN8Ci8DyRV3m8DsN
Kcs30Yl2ZVkQzSdGLhQUXcGG9vxEDAvqNdpwySlARqW567iWsvfEPotTBOtBHIXW
Kak1d4vmq5yn0wiJdvN34L3fQcvouQ6sikERXuCA0hxvFlKADDIWC8zJUzvTIXpd
U6HmZSTI/KhpZEiRTXyD0d4IhxdNXjg93GZUb98PqsqGNGvaEvkjjHflN4UmOfXE
gatBzp9jMZqVXEvMhXLgdOVypSa8AJQQ1emH+QIDAQABAoIBAQDMvnAqKfS6BW/C
C+6iLhDIdbJe3Kkax0ft51WuS6scxO+XUxQYJ33KsU6KoLlJ0pKgcG9gUFKquHWh
T7ylmP67TSKrNNGpnmpYTn3spAS9hp6ffHMIarhpBmSFn8ci8Z1QgTq3mgaawBq/
oiDzJHUZ6a8zn1v8LfEUPDpZ5svCi7eEvk5Wn/PHMAZDtVVS58eW6eSBCOs7plPy
8tTCAAlDkv6IueHGH6Sc9FJwOo8gbO55AKlLJHL1cOIoNFmrs66FiNddPgQHCvEz
WcJRQodYE3HdNFcBz0+Fs5Lb1QmOEhMyD5JcokrGfZbZ5EMfgLrzlJwnvH5USnp5
eAN+C9qhAoGBAP0QpbEhPW0DLDjQbyIrEqqLVbqJ5Qo4d/WhhcbIEq80qvzFWPBV
nA5GsH9U2y/VEfYtQDKNb8+0Xt5FBEk2LzcQTdDT5l4qHX788JvqSu2CFR9DN8Af
Aa+As7vDD2hkOLxbikhHv6nbSlKCzKDB0rXILQzpCbdDldu02kqbDvOLAoGBAPa6
EF/ml0naw3SV/vxBauVw4G6Ob8yQoq72mIiZBlBHoncT+8S8nHxI8fm2n2iaEFTd
+GqGGpIoqJ9LGTD38r1A1V9RZu074xjzYFLwaMqIQwZT0J99SCLOHYjFdnWW08wD
aL9JfwJpcnxXa/Rcz0EoCaJG1tPCm/AZKW2HzVMLAoGBAI1L7jeoR5PGYbqXJnX9
dr6ibYtp0uiR/ui29uq2azhIP/BCgBYwtqGB9qohxwA+B3lcaqvPLM7b9txDzNDT
4CjugYRHzChne3Cb6fwkJRHXv9NkxIwQw/Ap/DCqCMBQtRz2P498ABfmyOio/3gC
wJOe4QiEVVht9A5oPDnLud1hAoGBAOOScYITbh4oEzqZE81XBaNF/yzaYpKcIgIh
4EW2Z9VqjZcqLoKjue8FVXQQF27jFAdDiluvABkqOYZcPYsmWJZpk6XMrpRJNcoQ
yhsWNoIBN1lBu98wLnY0CZfbEs2ZZhf6WQZ/YxA1dOztsdx+MoiVxnUQxBwkl7LZ
cpXduexLAoGBAKI6U4JFpmJTYNo5jd8nJNaNsoyP5bKGZAPRlOA2unalS+P6taPv
5ss5wr+df1RVQKNMQ4+zBw4cQIYEDBwz9koCIKJ5IK2uTAUY2EwMdMFcBByDbE8o
rXGxVe0whJeMu5P4QcYRd+FVeqxuiQI12hOY4sy6AlO7Y4rpbwnAR7TN
-----END RSA PRIVATE KEY-----`;

/**
 * Create authenticated Octokit client for GitHub API
 * @returns {Promise<Octokit>} Authenticated Octokit instance
 */
export async function createOctokitClient(): Promise<Octokit> {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: GITHUB_APP_ID,
      privateKey: PRIVATE_KEY,
      installationId: GITHUB_INSTALLATION_ID,
    },
  });

  return octokit;
}

/**
 * Get GitHub repository configuration
 * @returns {object} Repository configuration
 */
export function getRepoConfig() {
  return {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
  };
}

/**
 * Verify GitHub authentication and permissions
 * @returns {Promise<boolean>} True if authentication is valid
 */
export async function verifyAuth(): Promise<boolean> {
  try {
    const octokit = await createOctokitClient();
    const { owner, repo } = getRepoConfig();
    
    // Try to fetch repository info
    await octokit.repos.get({ owner, repo });
    
    return true;
  } catch (error) {
    console.error('GitHub authentication failed:', error);
    return false;
  }
}
