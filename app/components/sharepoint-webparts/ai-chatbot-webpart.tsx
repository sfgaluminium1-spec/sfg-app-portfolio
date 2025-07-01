
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Minimize2, Maximize2, Sparkles, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatbotWebPartProps {
  title?: string;
  compact?: boolean;
  autoMinimize?: boolean;
  theme?: 'default' | 'warren' | 'yanika';
}

export default function AIChatbotWebPart({
  title = 'AI Assistant',
  compact = false,
  autoMinimize = true,
  theme = 'default'
}: AIChatbotWebPartProps) {
  const [isMinimized, setIsMinimized] = useState(autoMinimize);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant for the Warren Heathcote Innovation Hub. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const themeConfig = {
    default: {
      primary: 'hsl(var(--primary))',
      accent: 'hsl(var(--accent))',
      gradient: 'from-primary/10 to-secondary/10'
    },
    warren: {
      primary: '#FFD700',
      accent: '#FFA500',
      gradient: 'from-yellow-500/10 to-orange-500/10'
    },
    yanika: {
      primary: '#FF69B4',
      accent: '#DDA0DD',
      gradient: 'from-pink-500/10 to-purple-500/10'
    }
  };

  const currentTheme = themeConfig[theme];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response - in SharePoint, this would call the actual API
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `I understand you're asking about "${message}". Let me help you with that. In a SharePoint environment, I can assist with navigation, document searches, and innovation insights.`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.error('AI response error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className={cn(
            'rounded-full w-14 h-14 shadow-lg border-2',
            `bg-gradient-to-r ${currentTheme.gradient}`,
            'hover:scale-110 transition-transform duration-200'
          )}
          style={{ borderColor: currentTheme.primary }}
        >
          <MessageCircle className="h-6 w-6" style={{ color: currentTheme.primary }} />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'sharepoint-webpart bg-card border border-border rounded-lg shadow-lg',
        compact ? 'w-80 h-96' : 'w-96 h-[500px]',
        autoMinimize ? 'fixed bottom-4 right-4 z-50' : 'relative'
      )}
    >
      {/* Header */}
      <div 
        className={cn(
          'p-4 border-b border-border rounded-t-lg',
          `bg-gradient-to-r ${currentTheme.gradient}`
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
              style={{ backgroundColor: currentTheme.primary + '20' }}
            >
              <Bot className="h-5 w-5" style={{ color: currentTheme.primary }} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">
                {theme === 'warren' ? 'Executive Assistant' : 
                 theme === 'yanika' ? 'Creative Wellness Guide' : 
                 'Innovation Assistant'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {autoMinimize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea 
        ref={scrollAreaRef}
        className={cn(
          'flex-1 p-4',
          compact ? 'h-64' : 'h-80'
        )}
      >
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex',
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
                style={msg.sender === 'user' ? { backgroundColor: currentTheme.primary } : {}}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-muted rounded-lg px-3 py-2 flex items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ backgroundColor: currentTheme.primary }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ backgroundColor: currentTheme.primary, animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ backgroundColor: currentTheme.primary, animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            size="sm"
            className="px-3"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            'Find documents',
            'Show dashboards',
            'Innovation updates'
          ].map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="text-xs h-6"
              onClick={() => setMessage(action)}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
