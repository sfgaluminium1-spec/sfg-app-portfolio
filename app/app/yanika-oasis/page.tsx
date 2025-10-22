
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Heart, Users, Plane, Sparkles, Camera, Sun, Moon,
  MessageCircle, TrendingUp, Instagram, BarChart3, Send, Bot,
  Brain, Droplet, Wind, Flower2, Leaf, Crown, Star, Zap,
  Activity, Calendar, Award, Bell, Settings, RefreshCw,
  ExternalLink, ChevronRight, PlusCircle, Edit, Save, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export default function YanikaOasisPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDubaiMode, setIsDubaiMode] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [dermaQuestion, setDermaQuestion] = useState('');
  const [dermaHistory, setDermaHistory] = useState<Array<{role: string, content: string}>>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Dubai-themed color palette
  const dubaiColors = {
    gold: '#FFD700',
    rose: '#FF69B4',
    turquoise: '#40E0D0',
    coral: '#FF7F50',
    purple: '#BA68C8'
  };

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalViews: 45678,
    engagement: 8.7,
    followers: 12450,
    reach: 89234,
    posts: 156,
    stories: 89
  });

  // Marketing campaigns
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Summer Wellness Collection',
      status: 'active',
      reach: 23456,
      engagement: 9.2,
      budget: 5000,
      spent: 3200
    },
    {
      id: 2,
      name: 'Dubai Beauty Showcase',
      status: 'active',
      reach: 18900,
      engagement: 8.5,
      budget: 3000,
      spent: 2100
    }
  ]);

  // Content updates system
  const [updates, setUpdates] = useState([
    {
      id: 1,
      type: 'content',
      title: 'New skincare routine video',
      status: 'published',
      date: '2025-10-20',
      platform: 'Instagram'
    },
    {
      id: 2,
      type: 'campaign',
      title: 'Wellness Wednesday series',
      status: 'scheduled',
      date: '2025-10-25',
      platform: 'Multi-platform'
    }
  ]);

  const [newUpdate, setNewUpdate] = useState({ title: '', description: '' });
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Dermatology AI Bot
  const handleDermaQuestion = async () => {
    if (!dermaQuestion.trim()) return;

    const userMessage = dermaQuestion;
    setDermaHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setDermaQuestion('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your skin concerns, I recommend starting with a gentle cleanser twice daily. Look for ingredients like hyaluronic acid for hydration and niacinamide for brightening. Dubai's climate requires extra hydration!",
        "For anti-aging in Dubai's climate, focus on SPF 50+ daily, retinol at night (start with 0.25%), and antioxidants like Vitamin C in the morning. The sun exposure here requires diligent protection.",
        "Hyperpigmentation responds well to a combination of vitamin C, kojic acid, and regular exfoliation. Given Dubai's intense sun, SPF is non-negotiable. Consider professional treatments like chemical peels.",
        "For sensitive skin in Dubai, use fragrance-free products, focus on barrier repair with ceramides, and avoid harsh actives. The dry climate can exacerbate sensitivity, so hydration is key.",
        "Acne-prone skin benefits from salicylic acid (2%), niacinamide, and oil-free moisturizers. In Dubai's heat, avoid heavy products that can clog pores. Keep your routine simple and consistent."
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      setDermaHistory(prev => [...prev, { role: 'assistant', content: response }]);
      setIsThinking(false);
    }, 2000);
  };

  // Chat with Yanika's AI
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatMessage('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'm so glad you're interested in wellness and creativity! Balance is everything. What aspect would you like to explore today?",
        "Dubai has been an incredible inspiration for my creative journey. The blend of tradition and innovation here is unmatched!",
        "Self-care isn't selfish, it's essential. I always start my day with meditation and end it with gratitude journaling.",
        "Travel opens your mind to new possibilities. Each destination teaches us something unique about beauty, culture, and ourselves.",
        "Art and wellness are deeply connected. When we create, we heal. When we heal, we create better."
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      setIsThinking(false);
    }, 1500);
  };

  // Add new update
  const handleAddUpdate = () => {
    if (!newUpdate.title.trim()) {
      toast.error('Please enter an update title');
      return;
    }

    const update = {
      id: updates.length + 1,
      type: 'content',
      title: newUpdate.title,
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      platform: 'Instagram'
    };

    setUpdates(prev => [update, ...prev]);
    setNewUpdate({ title: '', description: '' });
    setShowUpdateForm(false);
    toast.success('Update added successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-pink-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Yanika's Creative Oasis
                </h1>
                <p className="text-sm text-gray-600">Wellness & Beauty Hub • Dubai</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDubaiMode(!isDubaiMode)}
                className="border-pink-300 hover:bg-pink-50"
              >
                {isDubaiMode ? <Sun className="h-4 w-4 mr-2 text-yellow-500" /> : <Moon className="h-4 w-4 mr-2 text-purple-500" />}
                {isDubaiMode ? 'Dubai Mode' : 'Night Mode'}
              </Button>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="dermatology" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Bot className="h-4 w-4 mr-2" />
              Derma AI
            </TabsTrigger>
            <TabsTrigger value="marketing" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="console" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Instagram className="h-4 w-4 mr-2" />
              Console
            </TabsTrigger>
            <TabsTrigger value="updates" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-2" />
              Updates
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Card className="bg-gradient-to-br from-pink-100 to-pink-50 border-pink-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-pink-700">
                      <Heart className="h-5 w-5 mr-2" />
                      Wellness Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-pink-600">9.4/10</div>
                    <p className="text-sm text-gray-600 mt-2">+0.6 this month</p>
                    <Progress value={94} className="mt-3 h-2" />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-700">
                      <Palette className="h-5 w-5 mr-2" />
                      Creative Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-purple-600">34</div>
                    <p className="text-sm text-gray-600 mt-2">+8 new this quarter</p>
                    <Progress value={88} className="mt-3 h-2" />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-700">
                      <Instagram className="h-5 w-5 mr-2" />
                      Engagement Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-blue-600">{analytics.engagement}%</div>
                    <p className="text-sm text-gray-600 mt-2">{analytics.followers.toLocaleString()} followers</p>
                    <Progress value={87} className="mt-3 h-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Activity Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-pink-500" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {[
                          { icon: Camera, text: 'Posted new skincare routine', time: '2 hours ago', color: 'pink' },
                          { icon: Heart, text: 'Wellness session completed', time: '5 hours ago', color: 'purple' },
                          { icon: Plane, text: 'Travel blog updated', time: '1 day ago', color: 'blue' },
                          { icon: Users, text: 'Family event shared', time: '2 days ago', color: 'orange' },
                          { icon: Palette, text: 'Art project published', time: '3 days ago', color: 'pink' }
                        ].map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className={`w-10 h-10 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                                <Icon className={`h-5 w-5 text-${item.color}-500`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.text}</p>
                                <p className="text-xs text-gray-500">{item.time}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-purple-500" />
                      Chat with Yanika's AI
                    </CardTitle>
                    <CardDescription>Get personalized wellness and creative insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] mb-4 p-3 border rounded-lg bg-gray-50">
                      {chatHistory.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm py-8">
                          Start a conversation about wellness, creativity, or lifestyle...
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] p-3 rounded-lg ${
                                msg.role === 'user' 
                                  ? 'bg-pink-500 text-white' 
                                  : 'bg-white border border-gray-200'
                              }`}>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                          {isThinking && (
                            <div className="flex justify-start">
                              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                                <div className="flex space-x-2">
                                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </ScrollArea>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask about wellness, beauty, or lifestyle..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} className="bg-pink-500 hover:bg-pink-600">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Dermatology AI Tab */}
          <TabsContent value="dermatology" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-teal-700">
                    <Brain className="h-6 w-6 mr-2" />
                    AI Dermatology Assistant
                  </CardTitle>
                  <CardDescription>
                    Get expert skincare advice tailored to Dubai's climate and your skin type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Topics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: Droplet, label: 'Hydration', color: 'blue' },
                      { icon: Sun, label: 'Sun Protection', color: 'yellow' },
                      { icon: Flower2, label: 'Anti-Aging', color: 'pink' },
                      { icon: Leaf, label: 'Sensitive Skin', color: 'green' }
                    ].map((topic, idx) => {
                      const Icon = topic.icon;
                      return (
                        <Button
                          key={idx}
                          variant="outline"
                          className="h-auto py-4 flex-col space-y-2 border-2 hover:border-teal-400 hover:bg-teal-50"
                          onClick={() => setDermaQuestion(`Tell me about ${topic.label.toLowerCase()} for my skin`)}
                        >
                          <Icon className={`h-6 w-6 text-${topic.color}-500`} />
                          <span className="text-sm font-medium">{topic.label}</span>
                        </Button>
                      );
                    })}
                  </div>

                  <Separator />

                  {/* Chat Interface */}
                  <div className="space-y-4">
                    <ScrollArea className="h-[400px] p-4 border-2 border-teal-200 rounded-lg bg-white">
                      {dermaHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
                            <Bot className="h-10 w-10 text-teal-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800 mb-2">Welcome to Derma AI</h3>
                            <p className="text-gray-600 text-sm max-w-md">
                              Ask me anything about skincare, treatments, ingredients, or routines. 
                              I specialize in recommendations for Dubai's unique climate!
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-center">
                            <Badge variant="outline" className="text-xs">Skincare Routines</Badge>
                            <Badge variant="outline" className="text-xs">Product Recommendations</Badge>
                            <Badge variant="outline" className="text-xs">Dubai Climate Solutions</Badge>
                            <Badge variant="outline" className="text-xs">Ingredient Analysis</Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {dermaHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-4 rounded-lg ${
                                msg.role === 'user' 
                                  ? 'bg-teal-500 text-white' 
                                  : 'bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200'
                              }`}>
                                {msg.role === 'assistant' && (
                                  <div className="flex items-center mb-2">
                                    <Bot className="h-4 w-4 mr-2 text-teal-600" />
                                    <span className="font-semibold text-xs text-teal-600">Derma AI</span>
                                  </div>
                                )}
                                <p className={`text-sm leading-relaxed ${msg.role === 'assistant' ? 'text-gray-800' : ''}`}>
                                  {msg.content}
                                </p>
                              </div>
                            </div>
                          ))}
                          {isThinking && (
                            <div className="flex justify-start">
                              <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 p-4 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <Bot className="h-4 w-4 text-teal-600" />
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                  </div>
                                  <span className="text-xs text-teal-600">Analyzing...</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </ScrollArea>

                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask about skincare routines, products, ingredients..."
                        value={dermaQuestion}
                        onChange={(e) => setDermaQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleDermaQuestion()}
                        className="flex-1 border-teal-300 focus:ring-teal-500"
                      />
                      <Button 
                        onClick={handleDermaQuestion} 
                        className="bg-teal-500 hover:bg-teal-600"
                        disabled={isThinking}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Campaign Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-orange-100 to-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                      <Badge variant="secondary" className="bg-green-100 text-green-700">+12%</Badge>
                    </div>
                    <div className="text-2xl font-bold text-orange-700">{analytics.reach.toLocaleString()}</div>
                    <p className="text-xs text-gray-600">Total Reach</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-100 to-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      <Badge variant="secondary" className="bg-green-100 text-green-700">+8%</Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-700">{analytics.engagement}%</div>
                    <p className="text-xs text-gray-600">Engagement</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-100 to-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Instagram className="h-5 w-5 text-blue-500" />
                      <Badge variant="secondary" className="bg-green-100 text-green-700">+450</Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">{analytics.posts}</div>
                    <p className="text-xs text-gray-600">Total Posts</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-100 to-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Crown className="h-5 w-5 text-purple-500" />
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Top 5%</Badge>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">{analytics.stories}</div>
                    <p className="text-xs text-gray-600">Stories</p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Campaigns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    Active Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <Card key={campaign.id} className="border-2 hover:border-pink-300 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{campaign.name}</h4>
                              <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                                {campaign.status}
                              </Badge>
                            </div>
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-600">Reach</p>
                              <p className="text-lg font-semibold">{campaign.reach.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Engagement</p>
                              <p className="text-lg font-semibold">{campaign.engagement}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Budget</p>
                              <p className="text-lg font-semibold">${campaign.budget}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Spent</p>
                              <p className="text-lg font-semibold">${campaign.spent}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Budget Progress</span>
                              <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                            </div>
                            <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button className="w-full mt-4 bg-pink-500 hover:bg-pink-600">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Campaign
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Console Tab */}
          <TabsContent value="console" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Instagram Console */}
                <Card className="border-2 border-pink-300">
                  <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100">
                    <CardTitle className="flex items-center">
                      <Instagram className="h-5 w-5 mr-2 text-pink-600" />
                      Instagram Console
                    </CardTitle>
                    <CardDescription>Manage your Instagram presence</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Status</span>
                        <Badge className="bg-green-500">Connected</Badge>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <Button className="w-full justify-start" variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          View Instagram Analytics
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Send className="h-4 w-4 mr-2" />
                          Schedule Posts
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Manage Messages
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Insights
                        </Button>
                      </div>

                      <Separator />

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                            <ExternalLink className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-blue-900 mb-1">
                              View on Instagram
                            </h4>
                            <p className="text-xs text-blue-700 mb-2">
                              Open Instagram to manage your account directly
                            </p>
                            <Button 
                              size="sm" 
                              className="bg-blue-500 hover:bg-blue-600"
                              onClick={() => window.open('https://www.instagram.com/yanika.heathcote/', '_blank')}
                            >
                              Open Instagram
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Abacus AI Console */}
                <Card className="border-2 border-purple-300">
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100">
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-purple-600" />
                      Abacus AI Platform
                    </CardTitle>
                    <CardDescription>AI-powered tools and analytics</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">API Status</span>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <Button className="w-full justify-start" variant="outline">
                          <Brain className="h-4 w-4 mr-2" />
                          AI Content Generator
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics Dashboard
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Zap className="h-4 w-4 mr-2" />
                          Automation Rules
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Award className="h-4 w-4 mr-2" />
                          Performance Reports
                        </Button>
                      </div>

                      <Separator />

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-3 flex-shrink-0">
                            <ExternalLink className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-purple-900 mb-1">
                              Abacus AI Platform
                            </h4>
                            <p className="text-xs text-purple-700 mb-2">
                              Access advanced AI tools and features
                            </p>
                            <Button 
                              size="sm" 
                              className="bg-purple-500 hover:bg-purple-600"
                              onClick={() => window.open('https://abacus.ai', '_blank')}
                            >
                              Open Platform
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-blue-500" />
                        Updates & Changes Management
                      </CardTitle>
                      <CardDescription>Track and manage your content updates</CardDescription>
                    </div>
                    <Button onClick={() => setShowUpdateForm(!showUpdateForm)} className="bg-blue-500 hover:bg-blue-600">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Update
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* New Update Form */}
                  <AnimatePresence>
                    {showUpdateForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card className="border-2 border-blue-300 bg-blue-50">
                          <CardContent className="pt-6 space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Update Title</label>
                              <Input
                                placeholder="Enter update title..."
                                value={newUpdate.title}
                                onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Description</label>
                              <Textarea
                                placeholder="Enter update description..."
                                value={newUpdate.description}
                                onChange={(e) => setNewUpdate({...newUpdate, description: e.target.value})}
                                rows={3}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={handleAddUpdate} className="flex-1 bg-blue-500 hover:bg-blue-600">
                                <Save className="h-4 w-4 mr-2" />
                                Save Update
                              </Button>
                              <Button onClick={() => setShowUpdateForm(false)} variant="outline" className="flex-1">
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Updates List */}
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {updates.map((update) => (
                        <Card key={update.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-semibold">{update.title}</h4>
                                  <Badge 
                                    variant="secondary" 
                                    className={
                                      update.status === 'published' ? 'bg-green-100 text-green-700' :
                                      update.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                      'bg-gray-100 text-gray-700'
                                    }
                                  >
                                    {update.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {update.date}
                                  </span>
                                  <span className="flex items-center">
                                    <Instagram className="h-4 w-4 mr-1" />
                                    {update.platform}
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() > 0.5 ? 20 : -20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            <Sparkles className="h-4 w-4 text-pink-400" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
