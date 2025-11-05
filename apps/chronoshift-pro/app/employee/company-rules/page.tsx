
'use client';

import { useSafeSession } from '@/hooks/use-safe-session';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CompanyRules } from '@/components/hr-compliance/company-rules';

export default function EmployeeCompanyRulesPage() {
  const { data: session, status, mounted } = useSafeSession();
  const router = useRouter();

  useEffect(() => {
    if (!mounted) return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
  }, [session, status, mounted, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-warren-blue-200 border-t-warren-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-warren-gray-400">Loading company rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-warren-gray-900 pb-20 md:ml-64 transition-all duration-300">
      <div className="p-4">
        <CompanyRules />
      </div>
    </div>
  );
}
