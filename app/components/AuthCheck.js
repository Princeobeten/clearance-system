'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function AuthCheck({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useApp();
  const router = useRouter();
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (isBrowser && !loading) {
      // Not authenticated, redirect to login
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        router.replace('/login');
        return;
      }
      
      // Check roles if specified
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log('Unauthorized role, redirecting to dashboard');
        router.replace('/dashboard');
        return;
      }
    }
  }, [loading, isAuthenticated, router, isBrowser, user, allowedRoles]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-main-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-main-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
      </div>
    );
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-main-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cta"></div>
      </div>
    );
  }

  return <>{children}</>;
}
