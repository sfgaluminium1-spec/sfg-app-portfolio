
'use client';

import { useSafeSession } from '@/hooks/use-safe-session';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DirectorAccess } from '@/components/hr-compliance/director-access';

export default function AdminHRCompliancePage() {
  const { data: session, status, mounted } = useSafeSession();
  const router = useRouter();

  useEffect(() => {
    if (!mounted) return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Additional security check for admin access
    if (session && session.user?.role !== 'admin' && !session.user?.email?.includes('yanika') && !session.user?.email?.includes('warren') && !session.user?.email?.includes('pawel')) {
      router.push('/');
      return;
    }
  }, [session, status, mounted, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-warren-gray-400">Loading HR compliance system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:ml-64 transition-all duration-300">
      <DirectorAccess userRole={session?.user?.role || 'employee'} />
    </div>
  );
}
