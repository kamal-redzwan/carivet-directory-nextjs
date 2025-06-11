'use client';

import { SignInForm } from '@/components/admin/auth/SignInForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminSignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600'></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return <SignInForm />;
}
