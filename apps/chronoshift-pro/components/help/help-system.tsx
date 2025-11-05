
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Download, 
  ExternalLink,
  ChevronRight,
  Clock,
  Calculator,
  FileText,
  Users,
  Shield,
  Smartphone
} from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  lastUpdated: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  tags: string[];
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  url: string;
  category: string;
}

export function HelpSystem() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showContactDialog, setShowContactDialog] = useState(false);

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Getting Started with ChronoShift Pro',
      category: 'Getting Started',
      content: `Welcome to ChronoShift Pro, SFG Aluminium's comprehensive timesheet management system.

## System Overview
ChronoShift Pro is designed to streamline your timesheet submission process, making it easy to track hours, breaks, and get approvals from supervisors.

## First Login
1. Visit the login page using your provided credentials
2. Enter your employee email and password
3. Click "Sign In" to access your dashboard

## Dashboard Overview
Your dashboard provides:
- Quick timesheet entry
- Recent submissions status
- Weekly summary
- Pending approvals

## Mobile Access
ChronoShift Pro works perfectly on mobile devices:
- Install as a PWA for native app experience
- Works offline when internet is unavailable
- Automatic sync when connection returns

## Getting Help
- Use the search function to find specific help topics
- Contact your supervisor for approval-related questions
- Reach out to IT support for technical issues`,
      tags: ['login', 'dashboard', 'mobile', 'overview'],
      difficulty: 'beginner',
      estimatedReadTime: 5,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      title: 'Submitting Your Timesheet',
      category: 'Timesheet Entry',
      content: `Learn how to properly submit your weekly timesheets in ChronoShift Pro.

## Timesheet Entry Process
1. Navigate to "Submit Timesheet" from the main menu
2. Select the correct date for your shift
3. Enter your start and end times in 24-hour format (HH:MM)
4. Add any relevant notes about your shift
5. Review your entries before submitting

## Time Format Guidelines
- Use 24-hour format: 09:00 for 9 AM, 15:30 for 3:30 PM
- Be precise with your times
- Include break times if different from standard 30 minutes

## Important Deadlines
⚠️ **Critical**: All timesheets must be submitted by Tuesday 16:00 for weekly processing.

## Notes Section
Use the notes section to record:
- Travel time to different sites
- Equipment delays
- Weather-related delays
- Early departure reasons
- Late arrival explanations

## Submission Status
After submission, your timesheet status will show:
- **Draft**: Still being edited
- **Submitted**: Awaiting supervisor approval
- **Approved**: Ready for payroll processing
- **Rejected**: Requires corrections and resubmission`,
      tags: ['submit', 'timesheet', 'deadline', 'format'],
      difficulty: 'beginner',
      estimatedReadTime: 7,
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      title: 'Understanding SFG Sleep Rules',
      category: 'Payroll Rules',
      content: `SFG Aluminium has specific sleep rules for long shifts. This guide explains how they work.

## Sleep Rule Overview
For shifts longer than 9 hours, the sleep rule applies:
- **9-hour rest period required**
- **1 hour unpaid** (for eating/personal time)
- **8 hours paid** (actual sleep time)

## When Sleep Rules Apply
Sleep rules automatically apply when:
- Your shift duration exceeds 9 hours
- There is overnight work (typically 22:00 to 06:00)
- Long-duration projects require extended presence

## Calculation Example
If you work a 12-hour shift from 18:00 to 06:00:
- Total shift: 12 hours
- Less break: 30 minutes (standard)
- Less sleep deduction: 1 hour (unpaid)
- **Paid hours**: 10.5 hours
- **Sleep allowance**: 8 hours paid

## Important Notes
- Sleep rules are automatically calculated by the system
- Manual adjustments require supervisor approval
- Questions about sleep rule applications should be directed to payroll
- Sleep periods must be properly documented in shift notes

## Night Shift Considerations
- Night shifts (22:00-06:00) may have different rate calculations
- Ensure accurate time entry for proper calculation
- Supervisor approval may be required for unusual sleep arrangements`,
      tags: ['sleep', 'rules', 'overtime', 'night', 'payroll'],
      difficulty: 'intermediate',
      estimatedReadTime: 8,
      lastUpdated: '2024-01-08'
    },
    {
      id: '4',
      title: 'Working Offline and Data Sync',
      category: 'Technical Support',
      content: `ChronoShift Pro works seamlessly even when you're offline. Here's how to manage offline work.

## Offline Capabilities
ChronoShift Pro automatically:
- Stores your timesheet entries locally when offline
- Continues to work without internet connection
- Syncs data automatically when connection returns
- Maintains all functionality during offline periods

## Installing as PWA (Progressive Web App)
For the best offline experience:
1. Visit ChronoShift Pro in your mobile browser
2. Look for the "Install App" prompt
3. Tap "Install" to add to your home screen
4. Use like a native mobile app

## Offline Data Management
- All entries are saved locally on your device
- Data automatically syncs when internet returns
- You'll see a "pending sync" indicator for offline entries
- Manual sync option available in settings

## Best Practices for Offline Work
- Install the PWA before going to remote sites
- Complete your timesheet entries as normal
- Don't worry about internet connectivity
- Data will sync automatically later

## Troubleshooting Offline Issues
If you experience sync problems:
1. Check your internet connection
2. Try manual sync from the settings menu
3. Contact IT support if sync fails repeatedly
4. Your data is safe and stored locally until sync completes

## Data Security
- All offline data is encrypted on your device
- Sync uses secure connections (HTTPS)
- Your timesheet data is protected at all times`,
      tags: ['offline', 'sync', 'pwa', 'mobile', 'troubleshooting'],
      difficulty: 'intermediate',
      estimatedReadTime: 6,
      lastUpdated: '2024-01-12'
    },
    {
      id: '5',
      title: 'Supervisor Approval Process',
      category: 'Approvals',
      content: `Understanding how the supervisor approval process works for timesheets.

## Approval Workflow
1. **Employee Submission**: You submit your timesheet by Tuesday 16:00
2. **Supervisor Review**: Your supervisor reviews all submissions
3. **Approval Decision**: Supervisor approves or requests corrections
4. **Notification**: You receive email notification of the decision
5. **Payroll Processing**: Approved timesheets go to payroll

## Approval Timeline
- **Tuesday 16:00**: Submission deadline
- **Wednesday**: Supervisor review period
- **Thursday**: Final approval and payroll processing
- **Friday**: Payroll calculations complete

## If Your Timesheet is Rejected
When a timesheet is rejected:
1. You'll receive an email with rejection reasons
2. Log in to see supervisor notes/comments
3. Make the required corrections
4. Resubmit before the next deadline
5. Supervisor will review the corrected version

## Common Rejection Reasons
- **Incorrect time format**: Use HH:MM format
- **Missing information**: Complete all required fields
- **Unusual hours**: Provide explanation in notes
- **Time conflicts**: Ensure times are logical (end after start)
- **Missing signatures**: For paper backup forms

## Supervisor Communication
- Supervisors can add notes to timesheet approvals
- Check your dashboard for supervisor messages
- Contact your supervisor directly for urgent questions
- Use email for formal approval inquiries

## Emergency Situations
For urgent timesheet issues:
- Contact your supervisor immediately
- Provide clear explanation of the situation
- Submit corrected timesheet as soon as possible
- Follow up to ensure approval before payroll deadline`,
      tags: ['approval', 'supervisor', 'rejection', 'workflow', 'deadline'],
      difficulty: 'beginner',
      estimatedReadTime: 9,
      lastUpdated: '2024-01-05'
    }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'What is the deadline for timesheet submission?',
      answer: 'All timesheets must be submitted by Tuesday 16:00 (4:00 PM) each week for processing. Late submissions may delay your pay.',
      category: 'Deadlines',
      helpful: 45,
      tags: ['deadline', 'submission', 'tuesday']
    },
    {
      id: '2',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email. If you don\'t receive the email, contact your supervisor or IT support.',
      category: 'Account',
      helpful: 32,
      tags: ['password', 'reset', 'login']
    },
    {
      id: '3',
      question: 'Can I use ChronoShift Pro on my mobile phone?',
      answer: 'Yes! ChronoShift Pro is fully mobile-responsive and can be installed as a Progressive Web App (PWA) for the best mobile experience. It also works offline.',
      category: 'Mobile',
      helpful: 28,
      tags: ['mobile', 'pwa', 'phone']
    },
    {
      id: '4',
      question: 'What happens if I forget to submit my timesheet?',
      answer: 'Contact your supervisor immediately. Late submissions may delay your pay processing. Your supervisor may be able to approve late submissions on a case-by-case basis.',
      category: 'Deadlines',
      helpful: 41,
      tags: ['late', 'forgot', 'submission']
    },
    {
      id: '5',
      question: 'How are overtime hours calculated?',
      answer: 'Overtime is calculated for hours worked over 8.5 per day at 1.5x your regular rate. The system automatically calculates this based on your shift times.',
      category: 'Payroll',
      helpful: 38,
      tags: ['overtime', 'calculation', 'payroll']
    },
    {
      id: '6',
      question: 'What should I do if the system is down?',
      answer: 'If ChronoShift Pro is unavailable, use the backup paper timesheet forms. Submit the paper forms to your supervisor and enter the data digitally once the system is back online.',
      category: 'Technical',
      helpful: 22,
      tags: ['system down', 'backup', 'paper']
    }
  ];

  const videoTutorials: VideoTutorial[] = [
    {
      id: '1',
      title: 'ChronoShift Pro Overview',
      description: 'Get familiar with the main features and navigation of ChronoShift Pro',
      duration: '5:23',
      thumbnail: '/video-thumbnails/overview.jpg',
      url: '#',
      category: 'Getting Started'
    },
    {
      id: '2',
      title: 'Submitting Your First Timesheet',
      description: 'Step-by-step guide to entering and submitting your timesheet',
      duration: '7:41',
      thumbnail: '/video-thumbnails/submit-timesheet.jpg',
      url: '#',
      category: 'Timesheet Entry'
    },
    {
      id: '3',
      title: 'Using ChronoShift Pro on Mobile',
      description: 'How to install and use the mobile version of ChronoShift Pro',
      duration: '4:15',
      thumbnail: '/video-thumbnails/mobile-app.jpg',
      url: '#',
      category: 'Mobile'
    },
    {
      id: '4',
      title: 'Understanding Sleep Rules and Payroll',
      description: 'Learn how SFG\'s sleep rules work and affect your pay calculations',
      duration: '6:58',
      thumbnail: '/video-thumbnails/sleep-rules.jpg',
      url: '#',
      category: 'Payroll Rules'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'Getting Started', name: 'Getting Started', icon: BookOpen },
    { id: 'Timesheet Entry', name: 'Timesheet Entry', icon: Clock },
    { id: 'Payroll Rules', name: 'Payroll Rules', icon: Calculator },
    { id: 'Approvals', name: 'Approvals', icon: Users },
    { id: 'Mobile', name: 'Mobile', icon: Smartphone },
    { id: 'Technical Support', name: 'Technical', icon: Shield }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-warren-blue-600" />
            Help & Support Center
          </h2>
          <p className="text-gray-600 dark:text-warren-gray-400">
            Find answers, tutorials, and get support for ChronoShift Pro
          </p>
        </div>
        
        <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <DialogTrigger asChild>
            <Button className="warren-button-primary">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
              <DialogDescription>
                Get in touch with our support team for help with ChronoShift Pro
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Card className="warren-card">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-warren-blue-600" />
                      <div>
                        <h3 className="font-medium">IT Support</h3>
                        <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                          Technical issues, password resets, system problems
                        </p>
                        <p className="text-sm font-medium text-warren-blue-600">
                          support@sfgaluminium.co.uk
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-green-600" />
                      <div>
                        <h3 className="font-medium">Payroll Support</h3>
                        <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                          Pay calculations, sleep rules, overtime questions
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          payroll@sfgaluminium.co.uk
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <div>
                        <h3 className="font-medium">Supervisor</h3>
                        <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                          Timesheet approvals, schedule questions, work-related queries
                        </p>
                        <p className="text-sm font-medium text-purple-600">
                          Contact your direct supervisor
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="pt-4">
                <Button onClick={() => setShowContactDialog(false)} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="warren-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search help articles, FAQs, and tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="warren-input pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">Help Articles</TabsTrigger>
          <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="warren-card h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-6">{article.title}</CardTitle>
                    <Badge className={getDifficultyColor(article.difficulty)}>
                      {article.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.estimatedReadTime} min read
                    </span>
                    <span>Updated {new Date(article.lastUpdated).toLocaleDateString('en-GB')}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-warren-gray-400 mb-4">
                    {article.content.split('\n')[0].substring(0, 150)}...
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="sm">
                        Read Article
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {article.title}
                          <Badge className={getDifficultyColor(article.difficulty)}>
                            {article.difficulty}
                          </Badge>
                        </DialogTitle>
                        <DialogDescription>
                          {article.estimatedReadTime} minute read • Updated {new Date(article.lastUpdated).toLocaleDateString('en-GB')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="prose dark:prose-invert max-w-none">
                        <div className="whitespace-pre-line">
                          {article.content}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="warren-card">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-warren-gray-400">
                      {faq.answer}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-warren-gray-500">
                        {faq.helpful} people found this helpful
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoTutorials.map((video) => (
              <Card key={video.id} className="warren-card">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 dark:bg-warren-gray-700 rounded-t-lg flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-warren-gray-400 mb-4">
                    {video.description}
                  </p>
                  <Button className="w-full" size="sm">
                    <Video className="w-4 h-4 mr-2" />
                    Watch Tutorial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="warren-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <FileText className="w-12 h-12 text-warren-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">User Manual PDF</h3>
                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                      Complete user guide for ChronoShift Pro (25 pages)
                    </p>
                  </div>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="warren-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <FileText className="w-12 h-12 text-green-600" />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Backup Timesheet Forms</h3>
                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                      Printable PDF forms for system downtime (A4 landscape)
                    </p>
                  </div>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="warren-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <FileText className="w-12 h-12 text-purple-600" />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Sleep Rules Guide</h3>
                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                      Detailed explanation of SFG's sleep rules and calculations
                    </p>
                  </div>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="warren-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Smartphone className="w-12 h-12 text-orange-600" />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Mobile App Guide</h3>
                    <p className="text-sm text-gray-600 dark:text-warren-gray-400">
                      How to install and use ChronoShift Pro on mobile devices
                    </p>
                  </div>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
