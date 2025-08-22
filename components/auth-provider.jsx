'use client';

import { useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import {
  initializeAuthAtom,
  authStatusAtom,
  currentUserAtom,
} from '@/lib/auth-atoms';

export function AuthProvider({ children }) {
  const initializeAuth = useSetAtom(initializeAuthAtom);
  const authStatus = useAtomValue(authStatusAtom);
  const user = useAtomValue(currentUserAtom);

  useEffect(() => {
    // Initialize authentication when the component mounts
    const initialize = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
      }
    };

    initialize();
  }, [initializeAuth]);

  // Show loading state while initializing auth
  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Email verification reminder */}
      {user && authStatus === 'unverified' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 text-sm">
          ⚠️ Please verify your email address to secure your account.
        </div>
      )}
      {children}
    </div>
  );
}
