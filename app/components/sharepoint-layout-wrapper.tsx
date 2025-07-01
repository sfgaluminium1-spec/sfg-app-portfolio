
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { isInIframe, isSharePointEnvironment } from '@/lib/utils';

interface SharePointLayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function SharePointLayoutWrapper({ 
  children, 
  className 
}: SharePointLayoutWrapperProps) {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [isSharePoint, setIsSharePoint] = useState(false);

  useEffect(() => {
    setIsEmbedded(isInIframe());
    setIsSharePoint(isSharePointEnvironment());
  }, []);

  return (
    <div 
      className={cn(
        'sharepoint-compatible',
        isEmbedded && 'iframe-embedded',
        isSharePoint && 'sharepoint-environment',
        className
      )}
      style={{
        '--is-embedded': isEmbedded ? '1' : '0',
        '--is-sharepoint': isSharePoint ? '1' : '0',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
