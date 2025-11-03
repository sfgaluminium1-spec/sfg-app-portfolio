
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

// Email template for quote notifications
const generateQuoteEmailTemplate = (data: any) => {
  const { type, quoteNumber, customerName, action, reason, projectName, value } = data;
  
  const isApproved = action === 'approved';
  const isRejected = action === 'rejected';
  
  return {
    subject: `Quote ${quoteNumber} ${isApproved ? 'Approved' : isRejected ? 'Update' : 'Notification'} - SFG Aluminium`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote ${action || 'Update'} - SFG Aluminium</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${isApproved ? '#10B981' : isRejected ? '#EF4444' : '#3B82F6'}; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .quote-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .status-badge { 
            display: inline-block; 
            padding: 6px 12px; 
            border-radius: 20px; 
            font-weight: bold; 
            text-transform: uppercase;
            background: ${isApproved ? '#10B981' : isRejected ? '#EF4444' : '#3B82F6'};
            color: white;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #3B82F6; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SFG Aluminium</h1>
            <h2>Quote ${isApproved ? 'Approved' : isRejected ? 'Update' : 'Notification'}</h2>
          </div>
          
          <div class="content">
            <p>Dear ${customerName},</p>
            
            ${isApproved ? `
              <p>We are pleased to inform you that your quote has been <strong>approved</strong> and is ready to proceed.</p>
            ` : isRejected ? `
              <p>We regret to inform you that your quote requires revision. Please see the details below.</p>
            ` : `
              <p>This is an update regarding your quote with SFG Aluminium.</p>
            `}
            
            <div class="quote-details">
              <h3>Quote Details</h3>
              <div class="detail-row">
                <span class="detail-label">Quote Number:</span>
                <span class="detail-value">${quoteNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Project:</span>
                <span class="detail-value">${projectName || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Value:</span>
                <span class="detail-value">£${value ? value.toLocaleString() : 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">
                  <span class="status-badge">${action ? action.toUpperCase() : 'UPDATED'}</span>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${new Date().toLocaleDateString()}</span>
              </div>
              ${reason ? `
                <div class="detail-row">
                  <span class="detail-label">Notes:</span>
                  <span class="detail-value">${reason}</span>
                </div>
              ` : ''}
            </div>
            
            ${isApproved ? `
              <p>Next steps:</p>
              <ul>
                <li>We will contact you within 24 hours to schedule the work</li>
                <li>Please ensure site access is available on the agreed dates</li>
                <li>Any changes to the specification may affect the quoted price</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/portal" class="button">
                  View in Customer Portal
                </a>
              </div>
            ` : isRejected ? `
              <p>Please contact us to discuss the required revisions or if you have any questions.</p>
            ` : ''}
            
            <p>If you have any questions, please don't hesitate to contact us:</p>
            <ul>
              <li>Phone: 01234 567890</li>
              <li>Email: info@sfgaluminium.com</li>
              <li>Website: www.sfgaluminium.com</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This is an automated message from SFG Aluminium Business Management System.</p>
            <p>© ${new Date().getFullYear()} SFG Aluminium. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Quote ${action || 'Update'} - SFG Aluminium
      
      Dear ${customerName},
      
      ${isApproved ? 'Your quote has been approved and is ready to proceed.' : 
        isRejected ? 'Your quote requires revision.' : 
        'This is an update regarding your quote.'}
      
      Quote Details:
      - Quote Number: ${quoteNumber}
      - Project: ${projectName || 'N/A'}
      - Value: £${value ? value.toLocaleString() : 'N/A'}
      - Status: ${action ? action.toUpperCase() : 'UPDATED'}
      - Date: ${new Date().toLocaleDateString()}
      ${reason ? `- Notes: ${reason}` : ''}
      
      Contact us:
      Phone: 01234 567890
      Email: info@sfgaluminium.com
      Website: www.sfgaluminium.com
      
      © ${new Date().getFullYear()} SFG Aluminium. All rights reserved.
    `
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate email template
    const emailTemplate = generateQuoteEmailTemplate(body);
    
    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Nodemailer with SMTP
    
    // For now, we'll log the email content and simulate sending
    console.log('Email notification generated:', {
      to: body.customerEmail || 'customer@example.com',
      subject: emailTemplate.subject,
      timestamp: new Date().toISOString(),
      quoteNumber: body.quoteNumber,
      action: body.action
    });
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email notification sent successfully',
      template: {
        subject: emailTemplate.subject,
        preview: emailTemplate.text.substring(0, 200) + '...'
      }
    });

  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json({ 
      error: 'Failed to send email notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
