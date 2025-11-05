
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.text();
    const payload = JSON.parse(body);

    // Verify webhook signature for security
    const signature = request.headers.get('x-hub-signature-256');
    const secret = process.env.GITHUB_WEBHOOK_SECRET || 'TEMP_SECRET_CHANGE_ME';

    if (signature) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = 'sha256=' + hmac.update(body).digest('hex');

      if (signature !== digest) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Handle push event (new instructions)
    if (request.headers.get('x-github-event') === 'push') {
      const APP_NAME = process.env.APP_NAME || 'chronoshift-pro';
      const commits = payload.commits || [];

      for (const commit of commits) {
        const files = [
          ...(commit.added || []),
          ...(commit.modified || [])
        ];

        // Check if our instruction file was updated
        const ourInstruction = `instructions/satellites/${APP_NAME}.md`;

        if (files.includes(ourInstruction)) {
          console.log(`🔔 New instruction detected in commit ${commit.id}`);
          console.log('Instruction URL:', commit.url);
          console.log('Commit message:', commit.message);
          console.log('Commit author:', commit.author?.name);

          // Log to HR Compliance system
          try {
            await prisma.hRComplianceLog.create({
              data: {
                action: 'GITHUB_INSTRUCTION_RECEIVED',
                details: {
                  commit_id: commit.id,
                  commit_url: commit.url,
                  commit_message: commit.message,
                  author: commit.author?.name,
                  files_modified: files,
                  instruction_file: ourInstruction
                },
                ipAddress: request.headers.get('x-forwarded-for') || 'github-webhook'
              }
            });
          } catch (dbError) {
            console.error('Failed to log to compliance database:', dbError);
          }

          // TODO: Implement instruction processing workflow
          // 1. Fetch instruction file from GitHub
          // 2. Parse instruction content
          // 3. Create admin notification
          // 4. Create task queue entry for processing

          console.log('⚠️ Admin: New instruction available from GitHub!');
          console.log(`📋 Instruction file: ${ourInstruction}`);
        }
      }

      return NextResponse.json({ 
        status: 'ok',
        message: 'Webhook processed successfully',
        commits_processed: commits.length
      });
    }

    // Handle issue events
    if (request.headers.get('x-github-event') === 'issues') {
      const action = payload.action;
      const issue = payload.issue;

      console.log(`📋 GitHub Issue ${action}:`, issue.title);
      console.log('Issue URL:', issue.html_url);

      // Log issue events
      try {
        await prisma.hRComplianceLog.create({
          data: {
            action: 'GITHUB_ISSUE_EVENT',
            details: {
              action: action,
              issue_number: issue.number,
              issue_title: issue.title,
              issue_url: issue.html_url,
              issue_state: issue.state
            },
            ipAddress: request.headers.get('x-forwarded-for') || 'github-webhook'
          }
        });
      } catch (dbError) {
        console.error('Failed to log to compliance database:', dbError);
      }

      return NextResponse.json({ status: 'ok', message: 'Issue event processed' });
    }

    // Handle other events
    const eventType = request.headers.get('x-github-event');
    console.log(`ℹ️ Received GitHub event: ${eventType}`);

    return NextResponse.json({ 
      status: 'ok',
      message: `Event ${eventType} received but not processed`
    });

  } catch (error) {
    console.error('GitHub webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Support GET for webhook verification
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'ChronoShift Pro GitHub Webhook Endpoint',
    app_name: process.env.APP_NAME || 'chronoshift-pro',
    timestamp: new Date().toISOString()
  });
}
