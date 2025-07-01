
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Pin, Star, Clock, TrendingUp, Search, 
  ExternalLink, MoreHorizontal, BookmarkPlus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SHAREPOINT_LIBRARIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const iconMap = {
  Lightbulb: '💡', Crown: '👑', FlaskConical: '🧪', Bot: '🤖', 
  FileText: '📄', TrendingUp: '📈', Users: '👥', Settings: '⚙️',
  Handshake: '🤝', BookOpen: '📚', Shield: '🛡️', Archive: '📦',
  Link: '🔗', Code: '💻', Diamond: '💎', Palette: '🎨'
};

interface LibraryQuickAccessProps {
  title?: string;
  showPinned?: boolean;
  showRecent?: boolean;
  showTrending?: boolean;
  maxItems?: number;
  layout?: 'horizontal' | 'vertical' | 'grid';
}

export default function LibraryQuickAccess({
  title = 'Quick Access',
  showPinned = true,
  showRecent = true,
  showTrending = true,
  maxItems = 6,
  layout = 'grid'
}: LibraryQuickAccessProps) {
  const [activeTab, setActiveTab] = useState<'pinned' | 'recent' | 'trending'>('pinned');

  // Mock data for different categories
  const pinnedLibraries = SHAREPOINT_LIBRARIES.filter(lib => 
    ['innovation-hub-portal', 'warren-executive', 'yanika-dubai', 'ai-lab'].includes(lib.id)
  ).slice(0, maxItems);

  const recentLibraries = SHAREPOINT_LIBRARIES.filter(lib => 
    ['project-documents', 'financial-records', 'rd-workspace', 'operations-center'].includes(lib.id)
  ).slice(0, maxItems);

  const trendingLibraries = SHAREPOINT_LIBRARIES.filter(lib => 
    ['ai-lab', 'innovation-hub-portal', 'ip-vault', 'developer-technical'].includes(lib.id)
  ).slice(0, maxItems);

  const getLibrariesForTab = () => {
    switch (activeTab) {
      case 'recent': return recentLibraries;
      case 'trending': return trendingLibraries;
      default: return pinnedLibraries;
    }
  };

  const handleLibraryClick = (library: typeof SHAREPOINT_LIBRARIES[0]) => {
    console.log(`Opening SharePoint library: ${library.name}`);
    // In real SharePoint: window.open(`${_spPageContextInfo.webAbsoluteUrl}/Lists/${library.id}`, '_blank');
  };

  const tabs = [
    { id: 'pinned' as const, label: 'Pinned', icon: Pin, show: showPinned },
    { id: 'recent' as const, label: 'Recent', icon: Clock, show: showRecent },
    { id: 'trending' as const, label: 'Trending', icon: TrendingUp, show: showTrending }
  ].filter(tab => tab.show);

  return (
    <div className="sharepoint-webpart">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex-1"
              >
                <IconComponent className="h-3 w-3 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Libraries Display */}
      <div className={cn(
        layout === 'horizontal' && 'flex gap-3 overflow-x-auto pb-2',
        layout === 'vertical' && 'space-y-2',
        layout === 'grid' && 'grid grid-cols-2 md:grid-cols-3 gap-3'
      )}>
        {getLibrariesForTab().map((library, index) => (
          <motion.div
            key={library.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={cn(
              layout === 'horizontal' && 'min-w-[200px]',
              layout === 'vertical' && 'w-full'
            )}
          >
            <Card 
              className="group cursor-pointer hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/50"
              onClick={() => handleLibraryClick(library)}
            >
              <CardContent className={cn(
                'p-3',
                layout === 'vertical' ? 'flex items-center' : 'text-center'
              )}>
                {layout === 'vertical' ? (
                  // Horizontal Layout (List Style)
                  <>
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 text-lg"
                      style={{ 
                        backgroundColor: library.color + '20', 
                        border: `1px solid ${library.color}40` 
                      }}
                    >
                      {iconMap[library.icon as keyof typeof iconMap]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{library.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {library.description}
                      </p>
                    </div>
                    <div className="flex items-center ml-2">
                      {activeTab === 'pinned' && <Pin className="h-3 w-3 text-primary" />}
                      {activeTab === 'recent' && <Clock className="h-3 w-3 text-muted-foreground" />}
                      {activeTab === 'trending' && <TrendingUp className="h-3 w-3 text-green-500" />}
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
                    </div>
                  </>
                ) : (
                  // Grid/Card Layout
                  <>
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl relative"
                      style={{ 
                        backgroundColor: library.color + '20', 
                        border: `1px solid ${library.color}40` 
                      }}
                    >
                      {iconMap[library.icon as keyof typeof iconMap]}
                      {activeTab === 'pinned' && (
                        <Pin className="absolute -top-1 -right-1 h-3 w-3 text-primary bg-background rounded-full p-0.5" />
                      )}
                      {activeTab === 'trending' && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    
                    <h4 className="font-medium text-sm mb-1 truncate">{library.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {library.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: library.color + '10', 
                          color: library.color 
                        }}
                      >
                        {library.category}
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
        <Button variant="outline" size="sm" className="flex-1">
          <Search className="h-3 w-3 mr-2" />
          Browse All
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <BookmarkPlus className="h-3 w-3 mr-2" />
          Add Library
        </Button>
      </div>

      {/* Activity Indicator */}
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground">
          {activeTab === 'pinned' && `${pinnedLibraries.length} pinned libraries`}
          {activeTab === 'recent' && `Last accessed today`}
          {activeTab === 'trending' && `${trendingLibraries.length} libraries trending this week`}
        </p>
      </div>
    </div>
  );
}
