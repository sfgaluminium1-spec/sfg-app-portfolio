
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, Crown, FlaskConical, Bot, FileText, TrendingUp, 
  Users, Settings, Handshake, BookOpen, Shield, Archive, 
  Link, Code, Diamond, Palette, ExternalLink 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SHAREPOINT_LIBRARIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';

const iconMap = {
  Lightbulb, Crown, FlaskConical, Bot, FileText, TrendingUp,
  Users, Settings, Handshake, BookOpen, Shield, Archive,
  Link, Code, Diamond, Palette
};

const FolderGrid = () => {
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'core':
        return 'from-blue-500/20 to-cyan-500/20';
      case 'executive':
        return 'from-yellow-500/20 to-orange-500/20';
      case 'creative':
        return 'from-pink-500/20 to-purple-500/20';
      case 'technical':
        return 'from-green-500/20 to-emerald-500/20';
      default:
        return 'from-gray-500/20 to-slate-500/20';
    }
  };

  const handleFolderClick = (folder: typeof SHAREPOINT_LIBRARIES[0]) => {
    if (folder.url) {
      window.open(folder.url, '_blank');
    } else {
      // Enhanced functionality for different folder types
      switch (folder.id) {
        case 'innovation-portal':
          window.open('/sharepoint/innovation-portal', '_blank');
          break;
        case 'executive-dashboard':
          window.open('/warren-executive', '_blank');
          break;
        case 'r-and-d':
          window.open('/sharepoint/research-development', '_blank');
          break;
        case 'ai-models':
          window.open('/sharepoint/ai-models', '_blank');
          break;
        case 'financial-hub':
          window.open('/sharepoint/financial-records', '_blank');
          break;
        case 'business-intelligence':
          window.open('/sharepoint/business-intelligence', '_blank');
          break;
        case 'project-docs':
          window.open('/sharepoint/project-documents', '_blank');
          break;
        case 'client-relations':
          window.open('/sharepoint/client-relations', '_blank');
          break;
        case 'hr-docs':
          window.open('/sharepoint/hr-documents', '_blank');
          break;
        case 'knowledge-base':
          window.open('/sharepoint/knowledge-base', '_blank');
          break;
        case 'compliance':
          window.open('/sharepoint/compliance', '_blank');
          break;
        case 'archives':
          window.open('/sharepoint/archives', '_blank');
          break;
        case 'api-docs':
          window.open('/sharepoint/api-documentation', '_blank');
          break;
        case 'dev-tools':
          window.open('/sharepoint/dev-tools', '_blank');
          break;
        case 'premium-assets':
          window.open('/sharepoint/premium-assets', '_blank');
          break;
        case 'creative-studio':
          window.open('/sharepoint/creative-studio', '_blank');
          break;
        default:
          // Fallback with enhanced message
          alert(`Opening ${folder.name} SharePoint library. This will connect to your document management system in production.`);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {SHAREPOINT_LIBRARIES.map((folder, index) => {
        const IconComponent = iconMap[folder.icon as keyof typeof iconMap];
        
        return (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="transform-3d"
          >
            <motion.div
              className={cn(
                'relative group cursor-pointer',
                'bg-card/50 backdrop-blur-sm rounded-xl border border-border/50',
                'folder-hover glass-effect diamond-dust',
                'p-6 h-full min-h-[200px] flex flex-col'
              )}
              style={{
                background: `linear-gradient(135deg, ${getCategoryGradient(folder.category)})`
              }}
              whileHover={{ 
                scale: 1.02,
                rotateX: 5,
                rotateY: 5
              }}
              onHoverStart={() => setHoveredFolder(folder.id)}
              onHoverEnd={() => setHoveredFolder(null)}
              onClick={() => handleFolderClick(folder)}
            >
              {/* Diamond Shimmer Effect */}
              <div className="absolute inset-0 rounded-xl diamond-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Icon */}
              <div className="relative z-10 mb-4">
                <motion.div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center',
                    'bg-gradient-to-br from-primary/20 to-secondary/20',
                    'border border-primary/30 neon-glow'
                  )}
                  style={{ borderColor: folder.color + '50' }}
                  animate={hoveredFolder === folder.id ? {
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <IconComponent 
                    className="w-6 h-6" 
                    style={{ color: folder.color }}
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1">
                <h3 className="font-orbitron font-semibold text-lg mb-2 neon-text">
                  {folder.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {folder.description}
                </p>
              </div>

              {/* Category Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  'bg-secondary/50 text-secondary-foreground border border-border/50'
                )}>
                  {folder.category.charAt(0).toUpperCase() + folder.category.slice(1)}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFolderClick(folder);
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              {/* Glow Effect */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
                style={{ 
                  background: `radial-gradient(circle at center, ${folder.color}, transparent)` 
                }}
              ></div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FolderGrid;
