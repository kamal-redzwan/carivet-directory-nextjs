'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/loading';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        router.push('/admin/auth/signin?error=callback_error');
        return;
      }

      if (data.session) {
        // User is authenticated, redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        // No session, redirect to sign in
        router.push('/admin/auth/signin');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <LoadingSpinner size='lg' />
        <p className='mt-4 text-gray-600'>Processing authentication...</p>
      </div>
    </div>
  );
}
