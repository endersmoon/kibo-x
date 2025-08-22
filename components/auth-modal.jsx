'use client';

import { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  showLoginModalAtom,
  showRegisterModalAtom,
  authModalModeAtom,
  authLoadingAtom,
  authErrorAtom,
  signInAtom,
  signUpAtom,
  signInWithGoogleAtom,
  resetPasswordAtom,
  closeAuthModalsAtom,
  openLoginModalAtom,
  openRegisterModalAtom,
  openResetPasswordModalAtom,
} from '@/lib/auth-atoms';

export function AuthModal() {
  const [showLoginModal, setShowLoginModal] = useAtom(showLoginModalAtom);
  const [showRegisterModal, setShowRegisterModal] = useAtom(showRegisterModalAtom);
  const mode = useAtomValue(authModalModeAtom);
  const loading = useAtomValue(authLoadingAtom);
  const error = useAtomValue(authErrorAtom);
  
  const signIn = useSetAtom(signInAtom);
  const signUp = useSetAtom(signUpAtom);
  const signInWithGoogle = useSetAtom(signInWithGoogleAtom);
  const resetPassword = useSetAtom(resetPasswordAtom);
  const closeModals = useSetAtom(closeAuthModalsAtom);
  const openLogin = useSetAtom(openLoginModalAtom);
  const openRegister = useSetAtom(openRegisterModalAtom);
  const openResetPassword = useSetAtom(openResetPasswordModalAtom);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const result = await signIn({
        email: formData.email,
        password: formData.password,
      });
      setMessage(result.message);
      closeModals();
    } catch (error) {
      // Error is handled by atoms
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
      });
      setMessage(result.message);
      setTimeout(() => {
        closeModals();
      }, 2000);
    } catch (error) {
      // Error is handled by atoms
    }
  };

  const handleGoogleSignIn = async () => {
    setMessage('');
    try {
      const result = await signInWithGoogle();
      setMessage(result.message);
      closeModals();
    } catch (error) {
      // Error is handled by atoms
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.email) {
      setMessage('Please enter your email address.');
      return;
    }

    try {
      const result = await resetPassword(formData.email);
      setMessage(result.message);
    } catch (error) {
      // Error is handled by atoms
    }
  };

  const handleCloseModal = () => {
    closeModals();
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    });
    setMessage('');
  };

  const isOpen = showLoginModal || showRegisterModal;

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' && 'Welcome back! Please sign in to your account.'}
            {mode === 'register' && 'Create a new account to get started.'}
            {mode === 'reset' && 'Enter your email to receive a password reset link.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Google Sign In Button */}
          {mode !== 'reset' && (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Forms */}
          <form onSubmit={
            mode === 'login' ? handleSignIn :
            mode === 'register' ? handleSignUp :
            handleResetPassword
          } className="space-y-4">
            
            {/* Display Name (Register only) */}
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Full Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {/* Password (not for reset) */}
            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {/* Confirm Password (Register only) */}
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (
                mode === 'login' ? 'Sign In' :
                mode === 'register' ? 'Create Account' :
                'Send Reset Email'
              )}
            </Button>
          </form>

          {/* Mode Switch Links */}
          <div className="text-center space-y-2">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={openResetPassword}
                  className="text-sm text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Forgot your password?
                </button>
                <div className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={openRegister}
                    className="text-blue-600 hover:underline"
                    disabled={loading}
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={openLogin}
                  className="text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <div className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={openLogin}
                  className="text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Sign in
                </button>
              </div>
            )}
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className="text-sm text-green-600 text-center">
              {message}
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
