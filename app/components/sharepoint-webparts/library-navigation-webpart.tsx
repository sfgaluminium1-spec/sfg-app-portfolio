
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SHAREPOINT_LIBRARIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const iconMap = {
  Lightbulb: '💡', Crown: '👑', FlaskConical: '🧪', Bot: '🤖', 
  FileText: '📄', TrendingUp: '📈', Users: '👥', Settings: '⚙️',
  Handshake: '🤝', BookOpen: '📚', Shield: '🛡️', Archive: '📦',
  Link: '🔗', Code: '💻', Diamond: '💎', Palette: '🎨'
};

interface LibraryNavigationWebPartProps {
  compact?: boolean;
  showSearch?: boolean;
  maxItems?: number;
  category?: string;
}

export default function LibraryNavigationWebPart({
  compact = false,
  showSearch = true,
  maxItems = 16,
  category = 'all'
}: LibraryNavigationWebPartProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredLibraries, setFilteredLibraries] = useState(SHAREPOINT_LIBRARIES);

  useEffect(() => {
    let filtered = SHAREPOINT_LIBRARIES;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lib => lib.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(lib => 
        lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lib.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Limit items
    if (maxItems > 0) {
      filtered = filtered.slice(0, maxItems);
    }

    setFilteredLibraries(filtered);
  }, [searchTerm, selectedCategory, maxItems]);

  const categories = [
    { value: 'all', label: 'All Libraries' },
    { value: 'core', label: 'Core Business' },
    { value: 'executive', label: 'Executive' },
    { value: 'technical', label: 'Technical' },
    { value: 'creative', label: 'Creative' }
  ];

  const handleLibraryClick = (library: typeof SHAREPOINT_LIBRARIES[0]) => {
    // In SharePoint, this would open the actual library
    if (library.url) {
      window.open(library.url, '_blank');
    } else {
      // Demo message for SharePoint integration
      console.log(`Opening SharePoint library: ${library.name}`);
      // In real SharePoint: window.open(`${_spPageContextInfo.webAbsoluteUrl}/Lists/${library.id}`, '_blank');
    }
  };

  return (
    <div className="sharepoint-webpart w-full">
      {/* Header Controls */}
      {showSearch && (
        <div className={cn(
          'flex flex-col gap-4 mb-6',
          compact ? 'sm:flex-row' : 'md:flex-row'
        )}>
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search libraries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Libraries Display */}
      <div className={cn(
        viewMode === 'grid' 
          ? compact 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          : 'space-y-3'
      )}>
        {filteredLibraries.map((library, index) => (
          <motion.div
            key={library.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={cn(
              'group cursor-pointer transition-all duration-200',
              viewMode === 'grid' 
                ? 'bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-lg'
                : 'bg-card rounded-lg border border-border hover:bg-card/80'
            )}
            onClick={() => handleLibraryClick(library)}
          >
            {viewMode === 'grid' ? (
              // Grid View
              <div className={cn(
                'p-4 h-full flex flex-col',
                compact ? 'min-h-[140px]' : 'min-h-[160px]'
              )}>
                <div className="flex items-center mb-3">
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
                    <h3 className={cn(
                      'font-semibold truncate',
                      compact ? 'text-sm' : 'text-base'
                    )}>
                      {library.name}
                    </h3>
                    <span className={cn(
                      'text-muted-foreground capitalize',
                      compact ? 'text-xs' : 'text-sm'
                    )}>
                      {library.category}
                    </span>
                  </div>
                </div>
                
                <p className={cn(
                  'text-muted-foreground flex-1 line-clamp-2',
                  compact ? 'text-xs' : 'text-sm'
                )}>
                  {library.description}
                </p>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <div 
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      compact ? 'text-xs' : 'text-xs'
                    )}
                    style={{ 
                      backgroundColor: library.color + '10', 
                      color: library.color 
                    }}
                  >
                    {library.category}
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ) : (
              // List View
              <div className="p-4 flex items-center">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                  style={{ 
                    backgroundColor: library.color + '20', 
                    border: `1px solid ${library.color}40` 
                  }}
                >
                  {iconMap[library.icon as keyof typeof iconMap]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{library.name}</h3>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium ml-2"
                      style={{ 
                        backgroundColor: library.color + '10', 
                        color: library.color 
                      }}
                    >
                      {library.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {library.description}
                  </p>
                </div>
                
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-3" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredLibraries.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No libraries found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or category filter
          </p>
        </div>
      )}

      {/* Results Count */}
      {showSearch && filteredLibraries.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Showing {filteredLibraries.length} of {SHAREPOINT_LIBRARIES.length} libraries
        </div>
      )}
    </div>
  );
}
