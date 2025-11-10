
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageSquare } from 'lucide-react';

export default function ChatbotIntegration() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">SFG Knowledge Assistant</h1>
        <p className="text-gray-400">
          AI-powered assistant with access to your complete business knowledge base
        </p>
      </div>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Intelligent Business Assistant
          </CardTitle>
          <CardDescription className="text-gray-400">
            Chat with your AI assistant to get insights, analyze data, and make informed decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full border-t border-white/10">
            <iframe
              src="https://apps.abacus.ai/chatllm/?appId=176c5b3c8&hideTopBar=2"
              className="w-full border-0 bg-transparent"
              style={{ minHeight: '800px' }}
              title="SFG Knowledge Assistant"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
