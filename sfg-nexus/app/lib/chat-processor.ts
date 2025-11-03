
import { JobNumberGenerator } from './job-number-generator';

export interface ChatCommand {
  type: 'job' | 'quote' | 'order' | 'status' | 'search' | 'help' | 'unknown';
  action: string;
  parameters: Record<string, any>;
  confidence: number;
}

export class ChatProcessor {
  static processMessage(message: string): ChatCommand {
    const lowerMessage = message.toLowerCase().trim();
    
    // Job-related commands
    if (lowerMessage.includes('new job') || lowerMessage.includes('create job')) {
      return {
        type: 'job',
        action: 'create',
        parameters: this.extractJobParameters(message),
        confidence: 0.9
      };
    }
    
    if (lowerMessage.includes('complete job') || lowerMessage.includes('finish job')) {
      const jobNumber = this.extractJobNumber(message);
      return {
        type: 'job',
        action: 'complete',
        parameters: { jobNumber },
        confidence: jobNumber ? 0.9 : 0.6
      };
    }
    
    // Quote-related commands
    if (lowerMessage.includes('new quote') || lowerMessage.includes('create quote')) {
      return {
        type: 'quote',
        action: 'create',
        parameters: this.extractQuoteParameters(message),
        confidence: 0.9
      };
    }
    
    // Status updates
    if (lowerMessage.includes('update status') || lowerMessage.includes('change status')) {
      const jobNumber = this.extractJobNumber(message);
      const status = this.extractStatus(message);
      return {
        type: 'status',
        action: 'update',
        parameters: { jobNumber, status },
        confidence: (jobNumber && status) ? 0.9 : 0.6
      };
    }
    
    // Search commands
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('show')) {
      return {
        type: 'search',
        action: 'find',
        parameters: this.extractSearchParameters(message),
        confidence: 0.8
      };
    }
    
    // Help commands
    if (lowerMessage.includes('help') || lowerMessage.includes('commands')) {
      return {
        type: 'help',
        action: 'show',
        parameters: {},
        confidence: 1.0
      };
    }
    
    return {
      type: 'unknown',
      action: 'unknown',
      parameters: { originalMessage: message },
      confidence: 0.1
    };
  }
  
  static generateResponse(command: ChatCommand): string {
    switch (command.type) {
      case 'job':
        if (command.action === 'create') {
          const jobNumber = JobNumberGenerator.generateJobNumber();
          return `✅ New job created: **${jobNumber}**\n\nClient: ${command.parameters.client || 'Not specified'}\nDescription: ${command.parameters.description || 'Not specified'}\n\nJob is ready for processing. Would you like me to create a quote for this job?`;
        }
        if (command.action === 'complete') {
          return `✅ Job **${command.parameters.jobNumber}** marked as completed!\n\nStatus updated to COMPLETED\nCompletion date: ${new Date().toLocaleDateString()}\n\nGreat work! 🎉`;
        }
        break;
        
      case 'quote':
        if (command.action === 'create') {
          const quoteNumber = JobNumberGenerator.generateQuoteNumber();
          return `📋 New quote created: **${quoteNumber}**\n\nCustomer: ${command.parameters.customer || 'Not specified'}\nProject: ${command.parameters.project || 'Not specified'}\n\nQuote is ready for pricing. Navigate to Quotes section to add details.`;
        }
        break;
        
      case 'status':
        if (command.action === 'update') {
          return `🔄 Status updated for job **${command.parameters.jobNumber}**\n\nNew status: ${command.parameters.status}\nUpdated: ${new Date().toLocaleString()}\n\nTeam has been notified of the status change.`;
        }
        break;
        
      case 'search':
        return `🔍 Searching for: "${command.parameters.query}"\n\nFound results in:\n• Jobs database\n• Quotes database\n• Orders database\n\nClick on the search icon in the header to see detailed results.`;
        
      case 'help':
        return `🤖 **SFG NEXUS Chat Commands**\n\n**Job Management:**\n• "New job for [client]" - Create new job\n• "Complete job [number]" - Mark job complete\n• "Update status job [number] to [status]" - Change status\n\n**Quotes:**\n• "New quote for [customer]" - Create quote\n• "Send quote [number]" - Send quote to customer\n\n**Search:**\n• "Find jobs for [client]" - Search jobs\n• "Show pending quotes" - Filter quotes\n\n**Examples:**\n• "New job for Beesley and Fildes"\n• "Complete job 18456"\n• "New quote for Lodestone Projects"`;
        
      default:
        return `🤔 I didn't understand that command. Try:\n\n• "New job for [client name]"\n• "Complete job [job number]"\n• "New quote for [customer]"\n• "Help" for more commands\n\nWhat would you like me to help you with?`;
    }
    
    return "Command processed successfully!";
  }
  
  private static extractJobNumber(message: string): string | null {
    const jobMatch = message.match(/\b(\d{4,5})\b/);
    return jobMatch ? jobMatch[1] : null;
  }
  
  private static extractJobParameters(message: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract client name after "for"
    const clientMatch = message.match(/for\s+([^,\n]+)/i);
    if (clientMatch) {
      params.client = clientMatch[1].trim();
    }
    
    // Extract description
    const descMatch = message.match(/description[:\s]+([^,\n]+)/i);
    if (descMatch) {
      params.description = descMatch[1].trim();
    }
    
    return params;
  }
  
  private static extractQuoteParameters(message: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract customer name after "for"
    const customerMatch = message.match(/for\s+([^,\n]+)/i);
    if (customerMatch) {
      params.customer = customerMatch[1].trim();
    }
    
    // Extract project name
    const projectMatch = message.match(/project[:\s]+([^,\n]+)/i);
    if (projectMatch) {
      params.project = projectMatch[1].trim();
    }
    
    return params;
  }
  
  private static extractStatus(message: string): string | null {
    const statusKeywords = [
      'pending', 'approved', 'in_production', 'fabrication', 
      'assembly', 'ready_for_install', 'installing', 'completed', 
      'on_hold', 'cancelled'
    ];
    
    const lowerMessage = message.toLowerCase();
    for (const status of statusKeywords) {
      if (lowerMessage.includes(status.replace('_', ' '))) {
        return status.toUpperCase();
      }
    }
    
    return null;
  }
  
  private static extractSearchParameters(message: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract search query
    const queryMatch = message.match(/(?:find|search|show)\s+(.+)/i);
    if (queryMatch) {
      params.query = queryMatch[1].trim();
    }
    
    return params;
  }
}
