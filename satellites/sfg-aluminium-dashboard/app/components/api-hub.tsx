
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Copy, 
  Play, 
  Key, 
  Globe, 
  Database,
  Brain,
  FileText,
  BarChart3,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const apiEndpoints = [
  {
    id: 'dashboard',
    name: 'Dashboard Data',
    method: 'GET',
    endpoint: '/api/v1/dashboard',
    description: 'Retrieve dashboard KPI data and metrics',
    icon: BarChart3,
    parameters: [
      { name: 'range', type: 'string', required: false, description: 'Time range: 7d, 30d, 90d, 1y' }
    ],
    example: {
      request: `GET /api/v1/dashboard?range=30d
Authorization: Bearer YOUR_API_KEY`,
      response: `{
  "revenue": 2847500,
  "efficiency": 94.2,
  "documentsProcessed": 1847,
  "activeModels": 4
}`
    }
  },
  {
    id: 'financial',
    name: 'Financial Data',
    method: 'GET',
    endpoint: '/api/v1/financial-data',
    description: 'Access financial metrics and historical data',
    icon: Database,
    parameters: [
      { name: 'range', type: 'string', required: false, description: 'Time range filter' },
      { name: 'format', type: 'string', required: false, description: 'Response format: json, csv' }
    ],
    example: {
      request: `GET /api/v1/financial-data?range=7d
Authorization: Bearer YOUR_API_KEY`,
      response: `[
  {
    "date": "2025-01-01",
    "revenue": 125000,
    "expenses": 85000,
    "profit": 40000
  }
]`
    }
  },
  {
    id: 'ai-usage',
    name: 'AI Usage Statistics',
    method: 'GET',
    endpoint: '/api/v1/ai-usage',
    description: 'Get AI model usage statistics and performance metrics',
    icon: Brain,
    parameters: [
      { name: 'model', type: 'string', required: false, description: 'Specific AI model name' }
    ],
    example: {
      request: `GET /api/v1/ai-usage
Authorization: Bearer YOUR_API_KEY`,
      response: `[
  {
    "name": "GPT-4",
    "requests": 2840,
    "success": 2785,
    "errors": 55
  }
]`
    }
  },
  {
    id: 'documents',
    name: 'Document Processing',
    method: 'POST',
    endpoint: '/api/v1/documents',
    description: 'Upload and process documents with AI',
    icon: FileText,
    parameters: [
      { name: 'file', type: 'file', required: true, description: 'Document file to process' },
      { name: 'type', type: 'string', required: false, description: 'Processing type: extract, analyze, summarize' }
    ],
    example: {
      request: `POST /api/v1/documents
Authorization: Bearer YOUR_API_KEY
Content-Type: multipart/form-data

file: [binary data]
type: analyze`,
      response: `{
  "id": "doc_123456",
  "status": "processing",
  "estimatedTime": "2-3 minutes"
}`
    }
  },
  {
    id: 'ai-chat',
    name: 'AI Chat Interface',
    method: 'POST',
    endpoint: '/api/v1/ai/chat',
    description: 'Send chat requests to AI models',
    icon: Brain,
    parameters: [
      { name: 'model', type: 'string', required: true, description: 'AI model: gpt-4, claude-3, gemini-pro, custom-llm' },
      { name: 'message', type: 'string', required: true, description: 'Chat message' },
      { name: 'context', type: 'string', required: false, description: 'Additional context' }
    ],
    example: {
      request: `POST /api/v1/ai/chat
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "model": "gpt-4",
  "message": "Analyze production efficiency trends",
  "context": "aluminum manufacturing"
}`,
      response: `{
  "response": "Based on the data...",
  "model": "gpt-4",
  "tokens": 150,
  "processingTime": 1.2
}`
    }
  }
];

export function APIHub() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0]);
  const [apiKey, setApiKey] = useState('sk_test_1234567890abcdef');
  const [testRequest, setTestRequest] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleTestAPI = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestResponse(selectedEndpoint.example.response);
    } catch (error) {
      setTestResponse('{"error": "API test failed"}');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCodeExample = (language: 'javascript' | 'python' | 'curl') => {
    const endpoint = selectedEndpoint;
    const baseUrl = 'https://your-domain.com';
    
    switch (language) {
      case 'javascript':
        return `// JavaScript/Node.js Example
const response = await fetch('${baseUrl}${endpoint.endpoint}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }${endpoint.method === 'POST' ? `,
  body: JSON.stringify({
    // Your request data here
  })` : ''}
});

const data = await response.json();
console.log(data);`;

      case 'python':
        return `# Python Example
import requests

headers = {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
}

${endpoint.method === 'POST' ? `data = {
    # Your request data here
}

response = requests.${endpoint.method.toLowerCase()}('${baseUrl}${endpoint.endpoint}', headers=headers, json=data)` : `response = requests.${endpoint.method.toLowerCase()}('${baseUrl}${endpoint.endpoint}', headers=headers)`}
result = response.json()
print(result)`;

      case 'curl':
        return `# cURL Example
curl -X ${endpoint.method} "${baseUrl}${endpoint.endpoint}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"${endpoint.method === 'POST' ? ` \\
  -d '{
    "key": "value"
  }'` : ''}`;

      default:
        return '';
    }
  };

  return (
    <div className="h-full flex">
      {/* API Endpoints Sidebar */}
      <div className="w-80 glass-sidebar border-r border-white/10 p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">API Endpoints</h2>
            <p className="text-sm text-gray-400">
              Explore and test available API endpoints
            </p>
          </div>

          <div className="space-y-2">
            {apiEndpoints.map((endpoint) => (
              <Button
                key={endpoint.id}
                variant={selectedEndpoint.id === endpoint.id ? 'default' : 'ghost'}
                onClick={() => setSelectedEndpoint(endpoint)}
                className="w-full justify-start text-left h-auto p-3"
              >
                <div className="flex items-start space-x-3">
                  <endpoint.icon className="w-5 h-5 mt-0.5 text-blue-400" />
                  <div>
                    <div className="font-medium">{endpoint.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      <Badge variant="outline" className="mr-2 text-xs">
                        {endpoint.method}
                      </Badge>
                      {endpoint.endpoint}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <Card className="glass-card border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center">
                <Key className="w-4 h-4 mr-2" />
                API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="apiKey" className="text-xs text-gray-400">Your API Key</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-white/5 border-white/20 text-white text-xs"
                    placeholder="Enter your API key"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyCode(apiKey)}
                    className="border-white/20"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                Generate New Key
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">API Integration Hub</h1>
            <p className="text-gray-400 mt-2">
              Integrate SFG-Aluminium-AI-Brain with your applications
            </p>
          </div>

          <Tabs defaultValue="documentation" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="testing">API Testing</TabsTrigger>
              <TabsTrigger value="examples">Code Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="documentation" className="space-y-6">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <selectedEndpoint.icon className="w-6 h-6 text-blue-400" />
                      <div>
                        <CardTitle className="text-white">{selectedEndpoint.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {selectedEndpoint.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {selectedEndpoint.method}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Endpoint</h4>
                    <div className="bg-black/30 p-3 rounded-lg font-mono text-sm text-gray-300">
                      {selectedEndpoint.method} {selectedEndpoint.endpoint}
                    </div>
                  </div>

                  {selectedEndpoint.parameters.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Parameters</h4>
                      <div className="space-y-3">
                        {selectedEndpoint.parameters.map((param, index) => (
                          <div key={index} className="border-l-2 border-blue-400/30 pl-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-sm text-blue-400">{param.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {param.type}
                              </Badge>
                              {param.required && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{param.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-white font-medium mb-3">Example Request</h4>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {selectedEndpoint.example.request}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Example Response</h4>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {selectedEndpoint.example.response}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      Test Request
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Configure and send test requests to the API
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Endpoint</Label>
                      <div className="bg-black/30 p-2 rounded text-sm font-mono text-gray-300 mt-1">
                        {selectedEndpoint.method} {selectedEndpoint.endpoint}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Request Body</Label>
                      <Textarea
                        value={testRequest}
                        onChange={(e) => setTestRequest(e.target.value)}
                        placeholder="Enter JSON request body..."
                        className="bg-white/5 border-white/20 text-white mt-1 font-mono"
                        rows={6}
                      />
                    </div>

                    <Button 
                      onClick={handleTestAPI}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Send Test Request
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Response
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      View the API response data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {testResponse ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">200 OK</span>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                            {testResponse}
                          </pre>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyCode(testResponse)}
                          className="border-white/20"
                        >
                          <Copy className="w-3 h-3 mr-2" />
                          Copy Response
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">
                          Send a test request to see the response
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Code Examples
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Ready-to-use code snippets for popular programming languages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="javascript" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>

                    {(['javascript', 'python', 'curl'] as const).map((lang) => (
                      <TabsContent key={lang} value={lang}>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-medium capitalize">{lang} Example</h4>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyCode(generateCodeExample(lang))}
                              className="border-white/20"
                            >
                              <Copy className="w-3 h-3 mr-2" />
                              Copy Code
                            </Button>
                          </div>
                          <div className="bg-black/30 p-4 rounded-lg">
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                              {generateCodeExample(lang)}
                            </pre>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
