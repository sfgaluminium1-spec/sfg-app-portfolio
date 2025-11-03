
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, quoteId, action, customerName, quoteNumber, projectName, value } = body;

    // MS Teams webhook URL (in production, this would be from environment variables)
    const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;

    let teamsMessage = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": action === 'approved' ? "00FF00" : action === 'rejected' ? "FF0000" : "0076D7",
      "summary": `Quote ${action || 'notification'}`,
      "sections": [{
        "activityTitle": `Quote ${quoteNumber} ${action || 'notification'}`,
        "activitySubtitle": `Customer: ${customerName}`,
        "activityImage": "https://i.pinimg.com/originals/85/71/d3/8571d3a91bce3b276c2fc90d983e19ec.jpg",
        "facts": [
          {
            "name": "Quote Number:",
            "value": quoteNumber || 'N/A'
          },
          {
            "name": "Customer:",
            "value": customerName || 'N/A'
          },
          {
            "name": "Project:",
            "value": projectName || 'N/A'
          },
          {
            "name": "Value:",
            "value": value ? `£${value.toLocaleString()}` : 'N/A'
          },
          {
            "name": "Status:",
            "value": action ? action.toUpperCase() : 'UPDATED'
          },
          {
            "name": "Time:",
            "value": new Date().toLocaleString()
          }
        ],
        "markdown": true
      }],
      "potentialAction": [{
        "@type": "OpenUri",
        "name": "View Quote",
        "targets": [{
          "os": "default",
          "uri": `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/quotes`
        }]
      }]
    };

    // If Teams webhook is configured, send to Teams
    if (teamsWebhookUrl) {
      try {
        const teamsResponse = await fetch(teamsWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(teamsMessage)
        });

        if (teamsResponse.ok) {
          console.log('Teams notification sent successfully');
        } else {
          console.error('Failed to send Teams notification:', await teamsResponse.text());
        }
      } catch (teamsError) {
        console.error('Teams webhook error:', teamsError);
      }
    } else {
      console.log('Teams webhook not configured, skipping Teams notification');
    }

    // Log the notification for audit purposes
    console.log('Notification processed:', {
      type,
      message,
      quoteId,
      action,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Notification sent successfully',
      teamsConfigured: !!teamsWebhookUrl
    });

  } catch (error) {
    console.error('Teams notification error:', error);
    return NextResponse.json({ 
      error: 'Failed to send Teams notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
