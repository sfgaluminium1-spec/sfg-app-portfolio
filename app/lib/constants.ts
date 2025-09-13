
import { LibraryFolder, PowerBIDashboard, TechTicker } from './types';

export const SHAREPOINT_LIBRARIES: LibraryFolder[] = [
  {
    id: 'innovation-hub-portal',
    name: 'Innovation Hub Portal',
    description: 'Central innovation management and strategic initiatives',
    icon: 'Lightbulb',
    color: '#00BFFF',
    category: 'core'
  },
  {
    id: 'leadership-corner',
    name: 'Leadership Corner',
    description: 'Executive decisions and leadership communications',
    icon: 'Crown',
    color: '#FFD700',
    category: 'executive'
  },
  {
    id: 'rd-workspace',
    name: 'R&D Workspace',
    description: 'Research and development projects and prototypes',
    icon: 'FlaskConical',
    color: '#FF6B6B',
    category: 'technical'
  },
  {
    id: 'ai-lab',
    name: 'AI Lab',
    description: 'Artificial intelligence projects and machine learning',
    icon: 'Bot',
    color: '#4ECDC4',
    category: 'technical'
  },
  {
    id: 'project-documents',
    name: 'Project Documents',
    description: 'Active project documentation and collaboration',
    icon: 'FileText',
    color: '#95A5A6',
    category: 'core'
  },
  {
    id: 'financial-records',
    name: 'Financial Records',
    description: 'Financial reports, budgets, and accounting documents',
    icon: 'TrendingUp',
    color: '#2ECC71',
    category: 'executive'
  },
  {
    id: 'hr-resources',
    name: 'HR Resources',
    description: 'Human resources, personnel, and organizational development',
    icon: 'Users',
    color: '#E74C3C',
    category: 'core'
  },
  {
    id: 'operations-center',
    name: 'Operations Center',
    description: 'Daily operations, workflows, and process management',
    icon: 'Settings',
    color: '#9B59B6',
    category: 'core'
  },
  {
    id: 'partner-portal',
    name: 'Partner Portal',
    description: 'External partnerships and collaboration documents',
    icon: 'Handshake',
    color: '#F39C12',
    category: 'executive'
  },
  {
    id: 'knowledge-center',
    name: 'Knowledge Center',
    description: 'Training materials, best practices, and documentation',
    icon: 'BookOpen',
    color: '#3498DB',
    category: 'core'
  },
  {
    id: 'ip-vault',
    name: 'IP Vault',
    description: 'Intellectual property, patents, and proprietary information',
    icon: 'Shield',
    color: '#1ABC9C',
    category: 'technical'
  },
  {
    id: 'legacy-archive',
    name: 'Legacy Archive',
    description: 'Historical documents and archived materials',
    icon: 'Archive',
    color: '#BDC3C7',
    category: 'core'
  },
  {
    id: 'app-integrations',
    name: 'App Integrations',
    description: 'Third-party integrations and API configurations',
    icon: 'Link',
    color: '#E67E22',
    category: 'technical'
  },
  {
    id: 'developer-technical',
    name: 'Developer Technical',
    description: 'Code repositories, technical specifications, and dev tools',
    icon: 'Code',
    color: '#8E44AD',
    category: 'technical'
  },
  {
    id: 'warren-executive',
    name: 'Warren Executive',
    description: 'Warren\'s personal executive workspace and strategic vision',
    icon: 'Diamond',
    color: '#C0392B',
    category: 'executive'
  },
  {
    id: 'yanika-dubai',
    name: 'Yanika Dubai',
    description: 'Yanika\'s creative projects and wellness initiatives',
    icon: 'Palette',
    color: '#FF69B4',
    category: 'creative'
  }
];

export const POWER_BI_DASHBOARDS: PowerBIDashboard[] = [
  {
    id: 'financial-overview',
    title: 'Financial Performance',
    description: 'Revenue, profit margins, and financial KPIs',
    embedUrl: '/mockup/financial-dashboard',
    category: 'financial'
  },
  {
    id: 'operational-metrics',
    title: 'Operational Excellence',
    description: 'Production efficiency and operational metrics',
    embedUrl: '/mockup/operational-dashboard',
    category: 'operational'
  },
  {
    id: 'innovation-pipeline',
    title: 'Innovation Pipeline',
    description: 'R&D projects and innovation tracking',
    embedUrl: '/mockup/innovation-dashboard',
    category: 'strategic'
  },
  {
    id: 'wellness-metrics',
    title: 'Wellness & Culture',
    description: 'Employee wellness and organizational culture',
    embedUrl: '/mockup/wellness-dashboard',
    category: 'wellness'
  }
];

export const TECH_TICKER_ITEMS: TechTicker[] = [
  {
    id: '1',
    text: 'SFG Best Practices: Abacus.ai Integration Delivers 300% ROI with AI-Optimized Operations',
    category: 'ai',
    priority: 1
  },
  {
    id: '2',
    text: 'Next.js 15 TypeScript Migration: Microfrontends Architecture Enables Scalable AI Development',
    category: 'innovation',
    priority: 2
  },
  {
    id: '3',
    text: 'Microsoft 365 SSO Integration: Enterprise-Grade Security with 99.9% Uptime Achievement',
    category: 'innovation',
    priority: 1
  },
  {
    id: '4',
    text: 'AI Cost Optimization: £3,500/mo Model Training Budget with 40% Compression Savings',
    category: 'ai',
    priority: 2
  },
  {
    id: '5',
    text: 'Warren Executive Theme: Premium UI/UX Standards Drive 250% User Engagement',
    category: 'innovation',
    priority: 1
  },
  {
    id: '6',
    text: 'Auto-Scale AI Models: 15-Minute Idle Shutdown Reduces Infrastructure Costs by 60%',
    category: 'ai',
    priority: 2
  }
];
