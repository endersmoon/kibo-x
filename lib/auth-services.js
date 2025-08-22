// Firebase Authentication service functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
} from 'firebase/auth';
import { auth } from './firebase';

// ===== AUTHENTICATION SERVICES =====

export const authServices = {
  // Sign up with email and password
  async signUp(email, password, displayName = '') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name if provided
      if (displayName.trim()) {
        await updateProfile(user, {
          displayName: displayName.trim(),
        });
      }
      
      // Send email verification
      await sendEmailVerification(user);
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
        },
        message: 'Account created successfully. Please check your email for verification.',
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
        },
        message: 'Signed in successfully.',
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
        },
        message: 'Signed in with Google successfully.',
      };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { message: 'Signed out successfully.' };
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Send password reset email
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { message: 'Password reset email sent. Please check your inbox.' };
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Update user profile
  async updateUserProfile(updates) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in.');
      }
      
      await updateProfile(user, updates);
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
        },
        message: 'Profile updated successfully.',
      };
    } catch (error) {
      console.error('Profile update error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Send email verification
  async sendEmailVerification() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in.');
      }
      
      await sendEmailVerification(user);
      return { message: 'Verification email sent. Please check your inbox.' };
    } catch (error) {
      console.error('Email verification error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Delete user account
  async deleteAccount() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in.');
      }
      
      await deleteUser(user);
      return { message: 'Account deleted successfully.' };
    } catch (error) {
      console.error('Delete account error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Get current user
  getCurrentUser() {
    const user = auth.currentUser;
    if (user) {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
      };
    }
    return null;
  },

  // Subscribe to authentication state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
        });
      } else {
        callback(null);
      }
    });
  },

  // Handle authentication errors
  handleAuthError(error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    // Custom error messages for common Firebase Auth errors
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/requires-recent-login': 'Please sign in again to complete this action.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
      'auth/popup-blocked': 'Sign-in popup was blocked by the browser.',
      'auth/cancelled-popup-request': 'Multiple popup requests cancelled.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };

    return new Error(errorMessages[errorCode] || errorMessage);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return auth.currentUser !== null;
  },

  // Check if user email is verified
  isEmailVerified() {
    return auth.currentUser?.emailVerified || false;
  },
};

// Export default auth service
export default authServices;
