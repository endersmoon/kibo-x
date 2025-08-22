# Firebase Authentication Setup Guide

This guide extends the Firebase integration to include user authentication and data security.

## Prerequisites

- Completed Firebase Firestore setup (see FIREBASE_SETUP.md)
- Firebase project with Firestore enabled

## Step 1: Enable Firebase Authentication

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. In the left sidebar, click on "Authentication"
4. Click "Get started" if you haven't used Authentication before

### Enable Sign-in Methods

1. Go to the "Sign-in method" tab
2. Enable the following sign-in providers:

   **Email/Password:**
   - Click on "Email/Password"
   - Enable "Email/Password"
   - Optionally enable "Email link (passwordless sign-in)"
   - Click "Save"

   **Google Sign-in:**
   - Click on "Google"
   - Enable "Google"
   - Set your project support email
   - Click "Save"

## Step 2: Update Firestore Security Rules

Replace your Firestore security rules with the following to ensure data isolation between users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /requisitions/{requisitionId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.user_id;
    }
    
    match /candidates/{candidateId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

To update the rules:
1. Go to Firestore Database in your Firebase console
2. Click on the "Rules" tab
3. Replace the existing rules with the above
4. Click "Publish"

## Step 3: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3001`

3. The application should now:
   - Show a "Sign In" button in the top right
   - Allow you to create an account or sign in
   - Support Google sign-in
   - Show sample data for unauthenticated users
   - Isolate data per user when authenticated

## Features

### Authentication Features

- **Email/Password Registration** - Create accounts with email and password
- **Email/Password Sign-in** - Secure login with credentials
- **Google Sign-in** - One-click authentication with Google
- **Password Reset** - Send password reset emails
- **Email Verification** - Verify user email addresses
- **User Profile Management** - View and update profile information
- **Secure Sign-out** - Clean session termination

### Security Features

- **Data Isolation** - Each user can only access their own data
- **Firestore Security Rules** - Server-side data protection
- **Authentication State** - Persistent login across browser sessions
- **Route Protection** - Automatic data filtering based on authentication
- **Fallback Mode** - Sample data for unauthenticated users

### User Experience

- **Seamless Integration** - Authentication flows integrate with existing UI
- **Loading States** - Clear feedback during authentication operations
- **Error Handling** - User-friendly error messages
- **Mobile Responsive** - Works on all device sizes
- **Dark Mode Compatible** - Supports light and dark themes

## User Workflow

### For New Users
1. Click "Sign In" button
2. Choose "Create Account" option
3. Fill in name, email, and password
4. Verify email address (optional but recommended)
5. Start using the application with personal data

### For Existing Users
1. Click "Sign In" button
2. Enter email and password or use Google sign-in
3. Access personal requisitions and candidates data

### Data Migration
If you were using the application before authentication:
- Your local data (localStorage) will continue to work as sample data
- Create an account to start using cloud storage
- Sample data will be automatically created for new authenticated users

## Database Structure

With authentication enabled, all documents now include a `user_id` field:

### Requisitions Collection
```javascript
{
  id: "user123_req-001",
  user_id: "user123",           // Firebase Auth UID
  title: "Senior Developer",
  department: "Engineering",
  // ... other requisition fields
}
```

### Candidates Collection
```javascript
{
  id: "user123_cand-001",
  user_id: "user123",           // Firebase Auth UID
  requisition_id: "user123_req-001",
  first_name: "John",
  last_name: "Doe",
  // ... other candidate fields
}
```

## Environment Variables

No additional environment variables are needed beyond the existing Firebase configuration.

## Troubleshooting

### Common Authentication Issues

1. **"User must be authenticated" errors**
   - Ensure you're signed in before performing data operations
   - Check if your session has expired

2. **Google Sign-in not working**
   - Verify Google sign-in is enabled in Firebase console
   - Check if you're testing on localhost (some browsers block popups)

3. **Email verification emails not received**
   - Check spam folder
   - Verify email address is correct
   - Try resending verification email

4. **Data not loading after sign-in**
   - Check browser console for errors
   - Verify Firestore security rules are published
   - Ensure user has data or trigger sample data initialization

### Security Rule Debugging

If you're having permission issues:

1. Go to Firebase Console → Firestore → Rules
2. Check the "Rules Playground" to test specific operations
3. Look at the "Firestore" → "Usage" tab for security rule denials

### Development Tips

- Use the Firebase Auth emulator for local development (optional)
- Test with both email/password and Google sign-in methods
- Verify that user data is properly isolated between accounts
- Test the application in both authenticated and unauthenticated states

## Production Considerations

### Security Rules Refinement
For production, consider more specific rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /requisitions/{requisitionId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.user_id
        && request.auth.token.email_verified == true;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.user_id
        && request.auth.token.email_verified == true;
    }
    
    match /candidates/{candidateId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.user_id
        && request.auth.token.email_verified == true;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.user_id
        && request.auth.token.email_verified == true;
    }
  }
}
```

### Additional Security Measures
- Enable email verification requirement
- Set up password policies
- Monitor authentication events
- Implement rate limiting
- Add CAPTCHA for sensitive operations

## Next Steps

- Set up Firebase Cloud Functions for backend processing
- Add file upload capabilities with Firebase Storage
- Implement real-time notifications
- Add user roles and permissions
- Set up automated testing for authentication flows
