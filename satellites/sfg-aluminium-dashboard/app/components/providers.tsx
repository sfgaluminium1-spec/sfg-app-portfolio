
'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render children immediately, but only add SessionProvider after mounting to prevent hydration issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
