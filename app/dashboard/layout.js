'use client';

import Navigation from '@/app/components/Navigation';
import AuthCheck from '@/app/components/AuthCheck';

export default function DashboardLayout({ children }) {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-main-bg">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </AuthCheck>
  );
}
