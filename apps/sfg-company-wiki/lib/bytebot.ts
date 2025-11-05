
/**
 * Bytebot AI Integration
 * For RAG queries, LLM completions, and AI-powered features
 * Based on SFG COMET CORE API Sharing Package
 */

import { getSecret } from './vault';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class BytebotAI {
  private apiKey: string | null = null;
  private baseURL = 'https://api.abacus.ai/v1'; // Use AbacusAI endpoint instead

  private async loadAPIKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;
    
    try {
      // Try AbacusAI key first (more reliable)
      this.apiKey = await getSecret('bytebot', 'abacus_api_key');
      return this.apiKey;
    } catch {
      try {
        // Fall back to Bytebot key
        this.apiKey = await getSecret('bytebot', 'api_key');
        return this.apiKey;
      } catch {
        // Finally, try environment variables
        const envKey = process.env.ABACUSAI_API_KEY || process.env.BYTEBOT_API_KEY;
        if (!envKey) {
          throw new Error('AI API key not found in vault or environment');
        }
        this.apiKey = envKey;
        return this.apiKey;
      }
    }
  }

  /**
   * Chat completion - general purpose LLM queries
   */
  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const apiKey = await this.loadAPIKey();
    
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || 'gpt-4',
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.max_tokens,
        stream: request.stream ?? false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Bytebot API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  /**
   * RAG Query - Query the SFG knowledge base with context
   */
  async ragQuery(query: string, context?: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: context || 'You are a helpful assistant with access to SFG Aluminium company knowledge.',
      },
      {
        role: 'user',
        content: query,
      },
    ];

    const response = await this.chatCompletion({ messages });
    return response.choices[0].message.content;
  }

  /**
   * Extract structured data from unstructured text
   */
  async extractData(text: string, schema: string): Promise<any> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Extract structured data from the following text according to this schema: ${schema}. Return ONLY valid JSON.`,
      },
      {
        role: 'user',
        content: text,
      },
    ];

    const response = await this.chatCompletion({ messages, temperature: 0.1 });
    const content = response.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      return { raw: content };
    }
  }

  /**
   * Summarize long documents
   */
  async summarize(text: string, maxLength?: number): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Summarize the following text${maxLength ? ` in about ${maxLength} words` : ''}.`,
      },
      {
        role: 'user',
        content: text,
      },
    ];

    const response = await this.chatCompletion({ messages });
    return response.choices[0].message.content;
  }

  /**
   * Answer questions about SFG business rules, pricing, procedures, etc.
   */
  async askSFGQuestion(question: string): Promise<string> {
    const systemPrompt = `You are an expert on SFG Aluminium's business operations, including:
- Customer tiers (Platinum, Gold, Silver, Bronze)
- Pricing rules and credit limits
- Project numbering conventions
- Payroll formulas
- Workflow procedures
- Staff tiers and responsibilities

Answer questions accurately based on the SFG knowledge base.`;

    return this.ragQuery(question, systemPrompt);
  }
}

export const bytebotAI = new BytebotAI();
export type { ChatMessage, ChatCompletionRequest, ChatCompletionResponse };

