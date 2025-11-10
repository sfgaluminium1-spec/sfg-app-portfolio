
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Key, ExternalLink, CheckCircle, AlertCircle, Clock, Code } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  apiKey: string;
  appName: string;
  description: string;
}

export default function ApiDocumentation() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyData, setNewKeyData] = useState({ appName: '', description: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedExample, setSelectedExample] = useState('dashboard');

  const apiEndpoints = [
    {
      id: 'auth',
      name: 'Authentication',
      method: 'POST',
      endpoint: '/api/external/auth',
      description: 'Generate API keys for external applications',
      status: 'stable'
    },
    {
      id: 'dashboard',
      name: 'Dashboard Data',
      method: 'GET',
      endpoint: '/api/external/dashboard-data',
      description: 'Get comprehensive dashboard metrics and financial data',
      status: 'stable'
    },
    {
      id: 'sfg-assistant',
      name: 'SFG Knowledge Assistant',
      method: 'POST',
      endpoint: '/api/external/integration/sfg-assistant',
      description: 'Integrate with SFG Knowledge Assistant (Model: 16bba6251c)',
      status: 'ready'
    },
    {
      id: 'logikal',
      name: 'Logikal Integration',
      method: 'POST',
      endpoint: '/api/external/integration/logikal',
      description: 'Connect with Logikal software systems',
      status: 'development'
    },
    {
      id: 'status',
      name: 'System Status',
      method: 'GET',
      endpoint: '/api/external/system-status',
      description: 'Get real-time system health and integration status',
      status: 'stable'
    },
    {
      id: 'llm-chat',
      name: 'LLM Chat',
      method: 'POST',
      endpoint: '/api/llm/chat',
      description: 'Stream AI responses for chat interfaces',
      status: 'stable'
    }
  ];

  const codeExamples = {
    dashboard: {
      title: 'Get Dashboard Data',
      description: 'Retrieve comprehensive business metrics',
      code: `// JavaScript/Node.js Example
const response = await fetch('http://localhost:3000/api/external/dashboard-data?range=30d', {
  method: 'GET',
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log('Revenue:', data.financial.totalRevenue);
console.log('Efficiency:', data.financial.avgEfficiency);`
    },
    sfgAssistant: {
      title: 'Query SFG Knowledge Assistant',
      description: 'Send questions to the SFG Knowledge Assistant',
      code: `// JavaScript/Node.js Example
const response = await fetch('http://localhost:3000/api/external/integration/sfg-assistant', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: "What are the latest aluminium pricing trends?",
    context: "Market analysis",
    documentId: "optional_document_id"
  })
});

const result = await response.json();
console.log('Assistant Response:', result);`
    },
    systemStatus: {
      title: 'Check System Health',
      description: 'Monitor system status and integration health',
      code: `// JavaScript/Node.js Example
const response = await fetch('http://localhost:3000/api/external/system-status', {
  method: 'GET',
  headers: {
    'X-API-Key': 'your_api_key_here'
  }
});

const status = await response.json();
console.log('Overall Status:', status.overall.status);
console.log('SFG Assistant:', status.integrations.sfgKnowledgeAssistant.status);
console.log('Logikal:', status.integrations.logikal.status);`
    },
    llmChat: {
      title: 'Streaming AI Chat',
      description: 'Stream AI responses for real-time chat',
      code: `// JavaScript/Node.js Example with Streaming
const response = await fetch('http://localhost:3000/api/llm/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_session_token'
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Analyze our Q3 performance' }
    ],
    model: 'gpt-4.1-mini',
    temperature: 0.7
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Process streaming chunks
  console.log('Chunk:', chunk);
}`
    }
  };

  const handleGenerateApiKey = async () => {
    if (!newKeyData.appName.trim()) {
      toast.error('App name is required');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/external/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKeyData)
      });

      if (response.ok) {
        const result = await response.json();
        setApiKeys(prev => [...prev, result]);
        setNewKeyData({ appName: '', description: '' });
        toast.success('API key generated successfully!');
      } else {
        toast.error('Failed to generate API key');
      }
    } catch (error) {
      toast.error('Error generating API key');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ready':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'development':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'stable':
        return <CheckCircle className="w-4 h-4" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'development':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">API Documentation</h1>
        <p className="text-gray-400">
          Complete API reference for integrating with SFG Aluminium AI Brain
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-400" />
                API Overview
              </CardTitle>
              <CardDescription className="text-gray-400">
                SFG Aluminium AI Brain API provides programmatic access to business intelligence, 
                integration capabilities, and AI-powered features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">Base URL</h3>
                  <code className="block p-2 bg-slate-800 text-green-400 text-sm rounded">
                    http://localhost:3000/api/external
                  </code>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-white">Authentication</h3>
                  <p className="text-gray-400 text-sm">API Key (Header: X-API-Key)</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-white">Key Features</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                  <li>Real-time dashboard data and business metrics</li>
                  <li>Integration with SFG Knowledge Assistant (Model: 16bba6251c)</li>
                  <li>Logikal software system connectivity (Phase 1)</li>
                  <li>Streaming AI chat capabilities</li>
                  <li>System health and status monitoring</li>
                  <li>External application authentication</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {apiEndpoints.map((endpoint) => (
              <Card key={endpoint.id} className="glass-card border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {endpoint.method}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(endpoint.status)}`}>
                      {getStatusIcon(endpoint.status)}
                      <span className="ml-1">{endpoint.status}</span>
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-white text-sm">{endpoint.name}</h3>
                  <p className="text-gray-400 text-xs mt-1">{endpoint.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-400" />
                Generate API Key
              </CardTitle>
              <CardDescription className="text-gray-400">
                Create API keys for external applications to access the SFG AI Brain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appName" className="text-gray-200">Application Name</Label>
                  <Input
                    id="appName"
                    placeholder="e.g., External Dashboard"
                    value={newKeyData.appName}
                    onChange={(e) => setNewKeyData(prev => ({ ...prev, appName: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-200">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the integration"
                    value={newKeyData.description}
                    onChange={(e) => setNewKeyData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>
              <Button 
                onClick={handleGenerateApiKey}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? 'Generating...' : 'Generate API Key'}
              </Button>
            </CardContent>
          </Card>

          {apiKeys.length > 0 && (
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Generated API Keys</CardTitle>
                <CardDescription className="text-gray-400">
                  Keep these keys secure. They provide full access to your API endpoints.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiKeys.map((key, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{key.appName}</p>
                        <p className="text-gray-400 text-sm">{key.description}</p>
                        <code className="text-green-400 text-sm">{key.apiKey}</code>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(key.apiKey)}
                        className="border-white/20"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          {apiEndpoints.map((endpoint) => (
            <Card key={endpoint.id} className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {endpoint.method}
                  </Badge>
                  <code className="text-green-400">{endpoint.endpoint}</code>
                  <Badge className={`text-xs ${getStatusColor(endpoint.status)}`}>
                    {getStatusIcon(endpoint.status)}
                    <span className="ml-1">{endpoint.status}</span>
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {endpoint.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-white font-medium mb-2">Authentication</h4>
                    <p className="text-gray-400 text-sm">
                      Include your API key in the request header: <code className="text-green-400">X-API-Key: your_api_key</code>
                    </p>
                  </div>
                  
                  {endpoint.id === 'dashboard' && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Query Parameters</h4>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li><code className="text-green-400">range</code> - Time range: 7d, 30d, 90d, 1y (default: 30d)</li>
                      </ul>
                    </div>
                  )}

                  {endpoint.id === 'sfg-assistant' && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Request Body</h4>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li><code className="text-green-400">query</code> - Your question or request</li>
                        <li><code className="text-green-400">context</code> - Additional context (optional)</li>
                        <li><code className="text-green-400">documentId</code> - Specific document ID (optional)</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                Code Examples
              </CardTitle>
              <CardDescription className="text-gray-400">
                Ready-to-use code examples for integrating with the API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedExample} onValueChange={setSelectedExample}>
                <TabsList className="grid w-full grid-cols-4 bg-white/5">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="sfgAssistant">SFG Assistant</TabsTrigger>
                  <TabsTrigger value="systemStatus">Status</TabsTrigger>
                  <TabsTrigger value="llmChat">AI Chat</TabsTrigger>
                </TabsList>

                {Object.entries(codeExamples).map(([key, example]) => (
                  <TabsContent key={key} value={key} className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium">{example.title}</h3>
                      <p className="text-gray-400 text-sm">{example.description}</p>
                    </div>
                    <div className="relative">
                      <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm">
                        <code className="text-gray-300">{example.code}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 border-white/20"
                        onClick={() => copyToClipboard(example.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
