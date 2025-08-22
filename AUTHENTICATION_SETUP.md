# Authentication Setup

This document explains the authentication system implemented in Kibo-X.

## Overview

The application now includes a complete authentication system with the following features:

- **Login Page**: A dedicated login page at `/login` for unauthenticated users
- **Route Protection**: All routes are protected and require authentication
- **Google Sign-In**: Support for Google OAuth authentication
- **Email/Password**: Traditional email and password authentication
- **User Registration**: New users can create accounts
- **Email Verification**: Email verification system for security
- **Automatic Redirects**: Users are automatically redirected based on their authentication status

## How It Works

### Authentication Flow

1. **Unauthenticated Users**: 
   - Are automatically redirected to `/login`
   - Cannot access any protected routes
   - See a clean login page without the sidebar

2. **Authenticated Users**:
   - Can access all routes
   - Are redirected to the dashboard if they try to access `/login`
   - See the full application with sidebar and navigation

3. **Loading States**:
   - While authentication is being checked, users see a loading spinner
   - During redirects, appropriate loading messages are shown

### Components

#### AuthGuard (`components/auth-guard.jsx`)
- Protects all routes by checking authentication status
- Handles redirects based on user authentication state
- Shows loading states during authentication checks

#### LoginPage (`app/login/page.js`)
- Dedicated login page with email/password and Google sign-in
- Toggle between sign-in and sign-up modes
- Clean, centered design without sidebar

#### AuthProvider (`components/auth-provider.jsx`)
- Initializes Firebase authentication
- Manages authentication state
- Shows email verification reminders (except on login page)

#### SidebarLayout (`components/navigation.jsx`)
- Conditionally renders sidebar based on current route
- Hides sidebar and header on login page
- Shows full navigation for authenticated users

### Authentication Atoms (`lib/auth-atoms.js`)

The application uses Jotai for state management with the following key atoms:

- `currentUserAtom`: Current user data
- `authStatusAtom`: Authentication status ('loading', 'authenticated', 'unauthenticated', 'unverified')
- `isAuthenticatedAtom`: Boolean indicating if user is authenticated
- `authLoadingAtom`: Loading state for auth operations
- `authErrorAtom`: Error messages from auth operations

### Authentication Services (`lib/auth-services.js`)

Firebase authentication services including:

- Email/password sign-in and sign-up
- Google OAuth sign-in
- Password reset
- Email verification
- User profile management
- Sign out

## Usage

### For Users

1. **First Time Users**:
   - Navigate to any page → redirected to `/login`
   - Click "Don't have an account? Sign up"
   - Fill in email, password, and name
   - Verify email address

2. **Returning Users**:
   - Navigate to any page → redirected to `/login`
   - Sign in with email/password or Google
   - Access the full application

3. **Sign Out**:
   - Click user menu in top-right corner
   - Click "Sign Out"
   - Redirected back to login page

### For Developers

#### Adding New Protected Routes

All routes are automatically protected. Simply create new pages in the `app/` directory and they will require authentication.

#### Checking Authentication Status

```javascript
import { useAtomValue } from 'jotai';
import { isAuthenticatedAtom, currentUserAtom } from '@/lib/auth-atoms';

function MyComponent() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const user = useAtomValue(currentUserAtom);
  
  if (!isAuthenticated) {
    return <div>Please sign in to access this feature</div>;
  }
  
  return <div>Welcome, {user.displayName}!</div>;
}
```

#### Performing Authentication Actions

```javascript
import { useSetAtom } from 'jotai';
import { signInAtom, signOutAtom } from '@/lib/auth-atoms';

function MyComponent() {
  const signIn = useSetAtom(signInAtom);
  const signOut = useSetAtom(signOutAtom);
  
  const handleSignIn = async () => {
    try {
      await signIn({ email: 'user@example.com', password: 'password' });
    } catch (error) {
      console.error('Sign in failed:', error.message);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error.message);
    }
  };
}
```

## Security Features

- **Route Protection**: All routes require authentication
- **Email Verification**: Users must verify their email address
- **Secure Password Handling**: Passwords are handled securely through Firebase
- **Session Management**: Automatic session persistence and cleanup
- **Error Handling**: Comprehensive error handling for all auth operations

## Configuration

The authentication system uses Firebase. Ensure your Firebase configuration is properly set up in `lib/firebase.js` with the following services enabled:

- Authentication (Email/Password, Google)
- Firestore (for user data)

## Troubleshooting

### Common Issues

1. **Users stuck on loading screen**:
   - Check Firebase configuration
   - Verify authentication is properly initialized

2. **Google sign-in not working**:
   - Ensure Google OAuth is enabled in Firebase console
   - Check domain is authorized for OAuth

3. **Email verification not sending**:
   - Check Firebase Authentication settings
   - Verify email templates are configured

### Debug Mode

To debug authentication issues, check the browser console for error messages and ensure all Firebase services are properly configured.
