'use client';

import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { LogOut, User, Settings, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  currentUserAtom,
  userDisplayNameAtom,
  userInitialsAtom,
  isEmailVerifiedAtom,
  signOutAtom,
  sendEmailVerificationAtom,
  openLoginModalAtom,
  authLoadingAtom,
} from '@/lib/auth-atoms';

export function UserMenu() {
  const user = useAtomValue(currentUserAtom);
  const displayName = useAtomValue(userDisplayNameAtom);
  const initials = useAtomValue(userInitialsAtom);
  const isEmailVerified = useAtomValue(isEmailVerifiedAtom);
  const loading = useAtomValue(authLoadingAtom);
  
  const signOut = useSetAtom(signOutAtom);
  const sendEmailVerification = useSetAtom(sendEmailVerificationAtom);
  const openLogin = useSetAtom(openLoginModalAtom);
  
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification();
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Send verification error:', error);
    }
  };

  // If user is not authenticated, show sign in button
  if (!user) {
    return (
      <Button
        onClick={openLogin}
        variant="outline"
        size="sm"
        disabled={loading}
      >
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <>
      <div className="relative">
        {/* User Avatar Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {displayName}
            </div>
            <div className="flex items-center space-x-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </div>
              {!isEmailVerified && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Email not verified" />
              )}
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {displayName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </div>
                  {!isEmailVerified && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Shield className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">
                        Email not verified
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {!isEmailVerified && (
                <button
                  onClick={handleSendVerification}
                  className="flex items-center w-full px-3 py-2 text-sm text-left text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-md transition-colors"
                  disabled={loading}
                >
                  <Mail className="w-4 h-4 mr-3" />
                  Verify Email
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowUserDialog(true);
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </button>
              
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                disabled={loading}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      {/* User Profile Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Information</DialogTitle>
            <DialogDescription>
              Your account details and settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-medium">
                {initials}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">{displayName}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {isEmailVerified ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Email verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Email not verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!isEmailVerified && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Verify your email address
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Please verify your email address to secure your account and access all features.
                </p>
                <Button
                  onClick={handleSendVerification}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  disabled={loading}
                >
                  Send Verification Email
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  User ID
                </label>
                <div className="text-sm text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {user.uid}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
