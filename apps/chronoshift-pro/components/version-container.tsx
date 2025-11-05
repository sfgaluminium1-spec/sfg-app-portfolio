
'use client';

import React, { useState, useEffect, useRef } from 'react';

// Simple icons as SVG components to avoid dependency issues
const Info = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9,9 0,0"/>
    <path d="m15,9 0,0"/>
    <path d="M8,15s1.5,2,4,2,4-2,4-2"/>
  </svg>
);

const ChevronUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m18 15-6-6-6 6"/>
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const Code = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="16,18 22,12 16,6"/>
    <polyline points="8,6 2,12 8,18"/>
  </svg>
);

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
  type: 'feature' | 'bugfix' | 'improvement' | 'security';
}

const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    version: 'v2.3.0',
    date: '2025-09-13',
    type: 'bugfix',
    changes: [
      'Fixed hydration errors and client-side rendering issues',
      'Updated all dates to current September 2025 timeframe',
      'Improved app stability and performance',
      'Enhanced session management and authentication flow'
    ]
  },
  {
    version: 'v2.2.0',
    date: '2025-09-12',
    type: 'feature',
    changes: [
      'Added dark mode support with Warren Executive Theme integration',
      'Implemented version container with changelog dropdown',
      'Enhanced mobile responsiveness for all components',
      'Added real-time calculation updates in timesheet forms'
    ]
  },
  {
    version: 'v2.1.2',
    date: '2025-09-11',
    type: 'improvement',
    changes: [
      'Optimized sleep rule calculations for overnight shifts',
      'Improved overtime calculation accuracy',
      'Enhanced employee management interface',
      'Fixed cross-midnight shift boundary handling'
    ]
  },
  {
    version: 'v2.1.1',
    date: '2025-09-10',
    type: 'bugfix',
    changes: [
      'Fixed timesheet submission validation errors',
      'Resolved dashboard chart rendering issues',
      'Improved error handling for employee data',
      'Enhanced form validation messages'
    ]
  },
  {
    version: 'v2.1.0',
    date: '2025-09-09',
    type: 'feature',
    changes: [
      'Launched Phase 1 MVP with core timesheet functionality',
      'Implemented SFG business rules for payroll calculations',
      'Added employee management system',
      'Created approval workflow for timesheets',
      'Built responsive dashboard with analytics'
    ]
  }
];

export default function VersionContainer({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currentVersion = 'v2.3.0';
  const buildId = '31030338'; // Static build ID to prevent hydration mismatches
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent hydration mismatches by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const getTypeIcon = (type: ChangelogEntry['type']) => {
    switch (type) {
      case 'feature':
        return '🚀';
      case 'bugfix':
        return '🐛';
      case 'improvement':
        return '⚡';
      case 'security':
        return '🔒';
      default:
        return '📝';
    }
  };

  const getTypeColor = (type: ChangelogEntry['type']) => {
    switch (type) {
      case 'feature':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'bugfix':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'improvement':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'security':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div ref={containerRef} className={`version-container ${className}`}>
      {/* Changelog Dropdown */}
      <div className={`changelog-dropdown ${isOpen ? 'open' : ''}`}>
        <div className="changelog-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>ChronoShift Pro Updates</span>
            </div>
            <div className="text-xs opacity-75">{buildId}</div>
          </div>
        </div>
        
        <div className="changelog-content">
          {CHANGELOG_DATA.map((entry, index) => (
            <div
              key={entry.version}
              className={`changelog-item border-l-4 ${getTypeColor(entry.type)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="changelog-version flex items-center space-x-1">
                  <span>{getTypeIcon(entry.type)}</span>
                  <span>{entry.version}</span>
                </div>
                <div className="changelog-date flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{entry.date}</span>
                </div>
              </div>
              
              <div className="changelog-description">
                <ul className="space-y-1">
                  {entry.changes.map((change, changeIndex) => (
                    <li key={changeIndex} className="text-xs flex items-start">
                      <span className="inline-block w-1 h-1 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version Badge */}
      <div
        className="version-badge flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setTimeout(() => setIsOpen(false), 300)}
      >
        <Info className="w-3 h-3" />
        <span>{currentVersion}</span>
        <ChevronUp className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
    </div>
  );
}
