'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAtomValue } from 'jotai';
import {
  authStatusAtom,
  isAuthenticatedAtom,
} from '@/lib/auth-atoms';

export function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const authStatus = useAtomValue(authStatusAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authStatus === 'loading') {
      return;
    }

    // If user is not authenticated and not on login page, redirect to login
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }

    // If user is authenticated and on login page, redirect to home
    if (isAuthenticated && pathname === '/login') {
      router.push('/');
    }
  }, [authStatus, isAuthenticated, pathname, router]);

  // Show loading state while checking authentication
  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, show loading (will redirect)
  if (!isAuthenticated && pathname !== '/login') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If authenticated and on login page, show loading (will redirect)
  if (isAuthenticated && pathname === '/login') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return children;
}
