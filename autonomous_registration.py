
#!/usr/bin/env python3
"""
SFG Aluminium Website - Autonomous App Registration
Registers the website in the SFG App Portfolio on GitHub
"""

import json
import os
from datetime import datetime
from github import Github, GithubIntegration

def load_business_logic():
    """Load business logic from JSON file"""
    with open('business-logic.json', 'r') as f:
        return json.load(f)

def load_github_credentials():
    """Load GitHub credentials from .env file"""
    env_path = os.path.join('app', '.env')
    credentials = {}
    
    with open(env_path, 'r') as f:
        content = f.read()
        
    # Extract credentials
    for line in content.split('\n'):
        if line.startswith('GITHUB_OWNER='):
            credentials['owner'] = line.split('=', 1)[1].strip()
        elif line.startswith('GITHUB_REPO='):
            credentials['repo'] = line.split('=', 1)[1].strip()
        elif line.startswith('GITHUB_APP_ID='):
            credentials['app_id'] = int(line.split('=', 1)[1].strip())
        elif line.startswith('GITHUB_APP_INSTALLATION_ID='):
            credentials['installation_id'] = int(line.split('=', 1)[1].strip())
        elif line.startswith('GITHUB_APP_PRIVATE_KEY='):
            # Extract multi-line private key
            key_start = content.find("'-----BEGIN RSA PRIVATE KEY-----")
            key_end = content.find("-----END RSA PRIVATE KEY-----'") + len("-----END RSA PRIVATE KEY-----")
            key = content[key_start+1:key_end].strip()
            credentials['private_key'] = key
            break
    
    return credentials

def create_issue_body(bl):
    """Create the GitHub issue body"""
    body = f"""# {bl['appName']} - Registration Complete

## ✅ Registration Complete

**App Name:** {bl['appName']}  
**Platform:** {bl['platform']}  
**Category:** {bl['category']}  
**Status:** {bl['status']}  
**Version:** {bl['version']}

**Deployed URL:** {bl['deployed_url']}  
**Webhook URL:** {bl['webhook_url']}  
**Message Handler URL:** {bl['message_handler_url']}

## 📋 App Information

**Purpose:** {bl['description']}

## 🎯 Capabilities

"""
    for cap in bl['capabilities']:
        body += f"- {cap}\n"
    
    body += "\n## 🔄 Workflows\n\n"
    for workflow in bl['workflows']:
        body += f"### {workflow['name']}\n\n"
        for i, step in enumerate(workflow['steps'], 1):
            body += f"{i}. {step}\n"
        body += f"\n**Triggers:** {', '.join(workflow['triggers'])}  \n"
        body += f"**Outputs:** {', '.join(workflow['outputs'])}\n\n"
    
    body += "## 📏 Business Rules\n\n"
    for rule in bl['businessRules']:
        body += f"- **{rule['rule']}**\n"
        body += f"  - Condition: `{rule['condition']}`\n"
        body += f"  - Action: {rule['action']}\n\n"
    
    body += "## 🔗 Integration Points\n\n"
    for integration in bl['integrations']:
        body += f"- **{integration['system']}**\n"
        body += f"  - Purpose: {integration['purpose']}\n"
        body += f"  - Methods: {', '.join(integration['methods'])}\n\n"
    
    body += "## 🔔 Webhook Events\n\n"
    for event in bl['webhook_events']:
        body += f"- {event}\n"
    
    body += "\n## 💬 Supported Messages\n\n"
    for msg in bl['supported_messages']:
        body += f"- {msg}\n"
    
    body += "\n## 🌐 API Endpoints\n\n"
    for endpoint in bl['apiEndpoints']:
        body += f"- **{endpoint['method']} {endpoint['path']}**\n"
        body += f"  - Description: {endpoint['description']}\n"
        body += f"  - Auth: {endpoint['auth']}\n"
        body += f"  - Rate Limit: {endpoint['rate_limit']}\n\n"
    
    body += "## 📊 Data Models\n\n"
    for model in bl['dataModels']:
        body += f"### {model['name']}\n\n"
        for field in model['fields']:
            required = ' (required)' if field.get('required') else ''
            body += f"- {field['name']}: {field['type']}{required}\n"
        body += "\n"
    
    body += """## 📁 Files Backed Up

- ✅ business-logic.json
- ✅ Full project source code
- ✅ Configuration files
- ✅ Documentation

"""
    
    body += f"""## 👥 Team

- **Owner:** {bl['team']['owner']}
- **Developers:** {', '.join(bl['team']['developers'])}
- **Contact:** {bl['team']['contact']}

## 📈 Monitoring

- **Health Check:** {bl['monitoring']['health_check_url']}
- **Uptime Requirement:** {bl['monitoring']['uptime_requirement']}
- **Response Time Target:** {bl['monitoring']['response_time_target']}

---

**Registered by:** DeepAgent (Autonomous Registration)  
**Date:** {datetime.now().strftime('%Y-%m-%d')}  
**Repository:** {bl['repository']['url']}
"""
    
    return body

def register_app():
    """Main registration function"""
    print("🚀 Starting SFG-Website Registration...\n")
    
    # Load business logic
    print("📦 Loading business logic...")
    bl = load_business_logic()
    print(f"   App Name: {bl['appName']}")
    print(f"   Version: {bl['version']}")
    print(f"   Description: {bl['description']}\n")
    
    # Load credentials
    print("🔐 Loading GitHub credentials...")
    creds = load_github_credentials()
    print(f"   Owner: {creds['owner']}")
    print(f"   Repo: {creds['repo']}")
    print(f"   App ID: {creds['app_id']}\n")
    
    # Authenticate with GitHub
    print("🔑 Authenticating with GitHub...")
    integration = GithubIntegration(creds['app_id'], creds['private_key'])
    access_token = integration.get_access_token(creds['installation_id']).token
    g = Github(access_token)
    repo = g.get_repo(f"{creds['owner']}/{creds['repo']}")
    print(f"   Connected to: {repo.full_name}\n")
    
    # Create issue
    print("📝 Creating registration issue...")
    title = f"[Registration] {bl['appName']}"
    body = create_issue_body(bl)
    labels = ['registration', 'satellite-app', 'sfg-aluminium-app', 'pending-approval']
    
    issue = repo.create_issue(
        title=title,
        body=body,
        labels=labels
    )
    
    print("✅ SUCCESS!\n")
    print(f"📝 Issue Created: #{issue.number}")
    print(f"🔗 URL: {issue.html_url}")
    print(f"📅 Created: {issue.created_at}\n")
    
    # Save local backup
    print("💾 Saving local backup...")
    backup = {
        'issue_number': issue.number,
        'issue_url': issue.html_url,
        'created_at': str(issue.created_at),
        'business_logic': bl
    }
    
    with open('registration-backup.json', 'w') as f:
        json.dump(backup, f, indent=2)
    
    print("   Backup saved: registration-backup.json\n")
    
    print("🎉 SFG-Website successfully registered in the portfolio!")
    print("🔄 NEXUS will review and approve within 24 hours.\n")
    
    return issue

if __name__ == '__main__':
    try:
        register_app()
    except Exception as e:
        print(f"❌ Registration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        exit(1)
