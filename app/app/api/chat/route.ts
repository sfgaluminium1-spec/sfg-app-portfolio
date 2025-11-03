
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ChatProcessor } from '@/lib/chat-processor';
import { JobNumberGenerator } from '@/lib/job-number-generator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, response, command } = body;

    // Save chat message to database
    const chatMessage = await prisma.chatMessage.create({
      data: {
        message,
        response,
        user: 'User',
        processed: true
      }
    });

    // Execute command actions if needed
    if (command && command.type !== 'unknown' && command.type !== 'help') {
      await executeCommand(command);
    }

    return NextResponse.json({ success: true, messageId: chatMessage.id });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}

async function executeCommand(command: any) {
  try {
    switch (command.type) {
      case 'job':
        if (command.action === 'create') {
          const jobNumber = JobNumberGenerator.generateJobNumber();
          await prisma.job.create({
            data: {
              jobNumber,
              client: command.parameters.client || 'Unknown Client',
              description: command.parameters.description || 'Created via chat',
              status: 'APPROVED',
              priority: 'MEDIUM'
            }
          });
          
          await prisma.activity.create({
            data: {
              type: 'CHAT_COMMAND',
              description: `Job ${jobNumber} created via chat command`,
              user: 'Chat Bot'
            }
          });
        } else if (command.action === 'complete') {
          const jobNumber = command.parameters.jobNumber;
          if (jobNumber) {
            await prisma.job.updateMany({
              where: { jobNumber },
              data: { 
                status: 'COMPLETED',
                completionDate: new Date()
              }
            });
            
            await prisma.activity.create({
              data: {
                type: 'CHAT_COMMAND',
                description: `Job ${jobNumber} marked as completed via chat`,
                user: 'Chat Bot'
              }
            });
          }
        }
        break;
        
      case 'quote':
        if (command.action === 'create') {
          const quoteNumber = JobNumberGenerator.generateQuoteNumber();
          await prisma.quote.create({
            data: {
              quoteNumber,
              customerName: command.parameters.customer || 'Unknown Customer',
              projectName: command.parameters.project,
              value: 0,
              status: 'PENDING',
              quoteType: 'Supply & Fit'
            }
          });
          
          await prisma.activity.create({
            data: {
              type: 'CHAT_COMMAND',
              description: `Quote ${quoteNumber} created via chat command`,
              user: 'Chat Bot'
            }
          });
        }
        break;
        
      case 'status':
        if (command.action === 'update') {
          const jobNumber = command.parameters.jobNumber;
          const status = command.parameters.status;
          if (jobNumber && status) {
            await prisma.job.updateMany({
              where: { jobNumber },
              data: { status }
            });
            
            await prisma.activity.create({
              data: {
                type: 'CHAT_COMMAND',
                description: `Job ${jobNumber} status updated to ${status} via chat`,
                user: 'Chat Bot'
              }
            });
          }
        }
        break;
        
      case 'survey':
        if (command.action === 'request') {
          const enquiryId = command.parameters.enquiryId;
          const enquiryNumber = command.parameters.enquiryNumber;
          if (enquiryId && enquiryNumber) {
            // Update enquiry to mark survey as requested
            await prisma.enquiry.update({
              where: { id: enquiryId },
              data: { 
                surveyRequested: true,
                surveyScheduled: false
              }
            });
            
            await prisma.activity.create({
              data: {
                type: 'SURVEY_REQUESTED',
                description: `Survey team notified for enquiry ${enquiryNumber} via chat`,
                user: 'Survey Team',
                enquiryId: enquiryId
              }
            });
          }
        } else if (command.action === 'schedule') {
          const enquiryId = command.parameters.enquiryId;
          const surveyDate = command.parameters.surveyDate;
          if (enquiryId && surveyDate) {
            await prisma.enquiry.update({
              where: { id: enquiryId },
              data: { 
                surveyScheduled: true,
                surveyDate: new Date(surveyDate)
              }
            });
            
            await prisma.activity.create({
              data: {
                type: 'SURVEY_SCHEDULED',
                description: `Survey scheduled for ${new Date(surveyDate).toLocaleDateString()}`,
                user: 'Survey Team',
                enquiryId: enquiryId
              }
            });
          }
        }
        break;
    }
  } catch (error) {
    console.error('Command execution error:', error);
  }
}

export async function GET() {
  try {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get chat messages error:', error);
    return NextResponse.json([]);
  }
}
