
export interface LibraryFolder {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'core' | 'executive' | 'creative' | 'technical';
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title?: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export interface PowerBIDashboard {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  category: 'financial' | 'operational' | 'strategic' | 'wellness';
}

export interface TechTicker {
  id: string;
  text: string;
  category: 'ai' | 'aluminium' | 'innovation' | 'future';
  priority: number;
}
