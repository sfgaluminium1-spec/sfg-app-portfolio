
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// Safe wrapper for useSession that handles SSR properly
export function useSafeSession() {
  const [mounted, setMounted] = useState(false);
  
  // Always call useSession (hooks rule)
  const sessionData = useSession();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return loading state until mounted
  if (!mounted) {
    return {
      data: null,
      status: 'loading' as const,
      mounted: false,
    };
  }

  return {
    data: sessionData.data,
    status: sessionData.status as 'authenticated' | 'unauthenticated' | 'loading',
    mounted: true,
  };
}
