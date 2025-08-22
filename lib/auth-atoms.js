// Authentication state management with Jotai
import { atom } from 'jotai';
import authServices from './auth-services';

// ===== AUTH STATE ATOMS =====

// Current user state
export const currentUserAtom = atom(null);

// Authentication loading state
export const authLoadingAtom = atom(false);

// Authentication error state
export const authErrorAtom = atom(null);

// Authentication initialization state
export const authInitializedAtom = atom(false);

// UI state atoms
export const showLoginModalAtom = atom(false);
export const showRegisterModalAtom = atom(false);
export const authModalModeAtom = atom('login'); // 'login', 'register', 'reset'

// ===== AUTH ACTION ATOMS =====

// Initialize authentication
export const initializeAuthAtom = atom(
  null,
  (get, set) => {
    return new Promise((resolve) => {
      const unsubscribe = authServices.onAuthStateChanged((user) => {
        set(currentUserAtom, user);
        set(authInitializedAtom, true);
        set(authLoadingAtom, false);
        unsubscribe(); // Only need to set initial state once
        resolve(user);
      });
    });
  }
);

// Sign up action
export const signUpAtom = atom(
  null,
  async (get, set, { email, password, displayName }) => {
    try {
      set(authLoadingAtom, true);
      set(authErrorAtom, null);
      
      const result = await authServices.signUp(email, password, displayName);
      set(currentUserAtom, result.user);
      
      return result;
    } catch (error) {
      set(authErrorAtom, error.message);
      throw error;
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

// Sign in action
export const signInAtom = atom(
  null,
  async (get, set, { email, password }) => {
    try {
      set(authLoadingAtom, true);
      set(authErrorAtom, null);
      
      const result = await authServices.signIn(email, password);
      set(currentUserAtom, result.user);
      
      return result;
    } catch (error) {
      set(authErrorAtom, error.message);
      throw error;
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

// Sign in with Google action
export const signInWithGoogleAtom = atom(
  null,
  async (get, set) => {
    try {
      set(authLoadingAtom, true);
      set(authErrorAtom, null);
      
      const result = await authServices.signInWithGoogle();
      set(currentUserAtom, result.user);
      
      return result;
    } catch (error) {
      set(authErrorAtom, error.message);
      throw error;
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

// Sign out action
export const signOutAtom = atom(
  null,
  async (get, set) => {
    try {
      set(authLoadingAtom, true);
      set(authErrorAtom, null);
      
      const result = await authServices.signOut();
      set(currentUserAtom, null);
      
      return result;
    } catch (error) {
      set(authErrorAtom, error.message);
      throw error;
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

// Password reset action
export const resetPasswordAtom = atom(
  null,
  async (get, set, email) => {
    try {
      set(authLoadingAtom, true);
      set(authErrorAtom, null);
      
      const result = await authServices.resetPassword(email);
      return result;
    } catch (error) {
      set(authErrorAtom, error.message);
      throw error;
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

// Update profile action
export const updateProfileAtom = atom(
  null,
  async (get, set, updates) => {
    try {
      set(authLoadingAtom, true);
      set(authErrorAtom, null);
      
      const result = await authServices.updateUserProfile(updates);
      set(currentUserAtom, result.user);
      
      return result;
    } catch (error) {
      set(authErrorAtom, error.message);
      throw error;
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

// Send email verification action
export const sendEmailVerificationAtom = atom(
  null,
  async (get, set) => {
    try {
      set(authLoadingAtom, true);
      set(authErrorAtom, null);
      
      const result = await authServices.sendEmailVerification();
      return result;
    } catch (error) {
      set(authErrorAtom, error.message);
      throw error;
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

// ===== AUTH MODAL ACTIONS =====

export const openLoginModalAtom = atom(
  null,
  (get, set) => {
    set(authModalModeAtom, 'login');
    set(showLoginModalAtom, true);
    set(authErrorAtom, null);
  }
);

export const openRegisterModalAtom = atom(
  null,
  (get, set) => {
    set(authModalModeAtom, 'register');
    set(showRegisterModalAtom, true);
    set(authErrorAtom, null);
  }
);

export const openResetPasswordModalAtom = atom(
  null,
  (get, set) => {
    set(authModalModeAtom, 'reset');
    set(showLoginModalAtom, true);
    set(authErrorAtom, null);
  }
);

export const closeAuthModalsAtom = atom(
  null,
  (get, set) => {
    set(showLoginModalAtom, false);
    set(showRegisterModalAtom, false);
    set(authErrorAtom, null);
  }
);

// ===== DERIVED ATOMS =====

// Check if user is authenticated
export const isAuthenticatedAtom = atom((get) => {
  const user = get(currentUserAtom);
  return user !== null;
});

// Check if user email is verified
export const isEmailVerifiedAtom = atom((get) => {
  const user = get(currentUserAtom);
  return user?.emailVerified || false;
});

// Get user display name or email
export const userDisplayNameAtom = atom((get) => {
  const user = get(currentUserAtom);
  if (!user) return '';
  return user.displayName || user.email || 'User';
});

// Get user initials for avatar
export const userInitialsAtom = atom((get) => {
  const user = get(currentUserAtom);
  if (!user) return '';
  
  const name = user.displayName || user.email || '';
  const words = name.split(' ');
  
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  
  return 'U';
});

// Authentication status for UI
export const authStatusAtom = atom((get) => {
  const user = get(currentUserAtom);
  const loading = get(authLoadingAtom);
  const initialized = get(authInitializedAtom);
  
  if (!initialized || loading) {
    return 'loading';
  }
  
  if (user) {
    return user.emailVerified ? 'authenticated' : 'unverified';
  }
  
  return 'unauthenticated';
});

export default {
  // State atoms
  currentUserAtom,
  authLoadingAtom,
  authErrorAtom,
  authInitializedAtom,
  showLoginModalAtom,
  showRegisterModalAtom,
  authModalModeAtom,
  
  // Action atoms
  initializeAuthAtom,
  signUpAtom,
  signInAtom,
  signInWithGoogleAtom,
  signOutAtom,
  resetPasswordAtom,
  updateProfileAtom,
  sendEmailVerificationAtom,
  
  // Modal actions
  openLoginModalAtom,
  openRegisterModalAtom,
  openResetPasswordModalAtom,
  closeAuthModalsAtom,
  
  // Derived atoms
  isAuthenticatedAtom,
  isEmailVerifiedAtom,
  userDisplayNameAtom,
  userInitialsAtom,
  authStatusAtom,
};
