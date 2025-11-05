
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('x-hub-signature-256');
    const event = req.headers.get('x-github-event');
    
    // Verify webhook signature (security)
    const secret = process.env.GITHUB_WEBHOOK_SECRET || 'TEMP_SECRET_CHANGE_ME';
    
    if (signature) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = 'sha256=' + hmac.update(body).digest('hex');
      
      if (signature !== digest) {
        console.error('[GitHub Webhook] Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }
    
    // Parse the JSON body
    const payload = JSON.parse(body);
    
    console.log('[GitHub Webhook] Received event:', event);
    
    // Handle push event (new instructions from sfg-nexus-repo)
    if (event === 'push') {
      const APP_NAME = process.env.APP_NAME || 'sfg-company-wiki';
      const commits = payload.commits || [];
      
      console.log('[GitHub Webhook] Processing', commits.length, 'commits');
      
      for (const commit of commits) {
        const files = [
          ...(commit.added || []),
          ...(commit.modified || [])
        ];
        
        // Check if our instruction file was updated
        const ourInstruction = `instructions/satellites/${APP_NAME}.md`;
        
        if (files.includes(ourInstruction)) {
          console.log(`🔔 [GitHub Webhook] New instruction detected in commit ${commit.id}`);
          console.log('[GitHub Webhook] Commit message:', commit.message);
          console.log('[GitHub Webhook] Instruction URL:', commit.url);
          
          // TODO: Implement instruction processing
          // For now, just log it and store notification
          
          // In a real implementation, you would:
          // 1. Fetch the instruction file content from GitHub
          // 2. Parse the markdown instructions
          // 3. Create a notification for admins
          // 4. Optionally: Queue tasks based on instructions
          // 5. Report back to sfg-nexus-repo via GitHub issue
          
          console.log('⚠️  [GitHub Webhook] Admin: New instruction available from GitHub!');
          console.log('📄 [GitHub Webhook] Review at:', `https://github.com/${payload.repository.full_name}/blob/${payload.ref.replace('refs/heads/', '')}/${ourInstruction}`);
        }
      }
      
      return NextResponse.json({ 
        status: 'ok',
        event: 'push',
        commits_processed: commits.length,
        message: 'Webhook received and processed'
      });
    }
    
    // Handle issues event (instructions or questions from sfg-nexus-repo)
    if (event === 'issues') {
      const action = payload.action;
      const issue = payload.issue;
      
      console.log('[GitHub Webhook] Issue event:', action);
      console.log('[GitHub Webhook] Issue title:', issue.title);
      console.log('[GitHub Webhook] Issue URL:', issue.html_url);
      
      // Check if this issue is for our app
      const APP_NAME = process.env.APP_NAME || 'sfg-company-wiki';
      const labels = (issue.labels || []).map((l: any) => l.name);
      
      if (labels.includes(APP_NAME) || issue.title.includes(APP_NAME)) {
        console.log(`🔔 [GitHub Webhook] Issue for ${APP_NAME} detected`);
        
        // TODO: Implement issue processing
        // For now, just log it
        
        // In a real implementation, you would:
        // 1. Parse issue body for instructions
        // 2. Create notification for admins
        // 3. If it's a question, prepare draft response
        // 4. If it's an instruction, queue tasks
        // 5. Comment on issue to acknowledge receipt
        
        console.log('⚠️  [GitHub Webhook] Admin: New GitHub issue for this app!');
      }
      
      return NextResponse.json({
        status: 'ok',
        event: 'issues',
        action: action,
        message: 'Issue webhook received'
      });
    }
    
    // Handle other events
    console.log('[GitHub Webhook] Unhandled event type:', event);
    
    return NextResponse.json({ 
      status: 'ok',
      event: event,
      message: 'Webhook received but not processed'
    });
    
  } catch (error) {
    console.error('[GitHub Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Health check endpoint
  return NextResponse.json({
    service: 'GitHub Webhook Endpoint',
    status: 'active',
    app: process.env.APP_NAME || 'sfg-company-wiki',
    endpoint: '/api/github-webhook',
    supported_events: ['push', 'issues'],
    message: 'Webhook endpoint is ready to receive GitHub events'
  });
}
