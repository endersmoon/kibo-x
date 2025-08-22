# Firebase Integration Setup Guide

This guide will help you set up Firebase Firestore as the database for your Kibo-X candidate tracking system.

## Prerequisites

- A Google account
- Node.js and npm installed
- Your Kibo-X project setup

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "kibo-x-candidates")
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

## Step 2: Set up Firestore Database

1. In your Firebase project console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (you can configure security rules later)
4. Select a location for your database (choose the one closest to your users)
5. Click "Done"

## Step 3: Get Your Firebase Configuration

1. In the Firebase console, click on the gear icon (⚙️) and select "Project settings"
2. Scroll down to the "Your apps" section
3. Click on the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Kibo-X Web")
5. Copy the configuration object that appears

## Step 4: Configure Environment Variables

1. In your Kibo-X project root, create a `.env.local` file
2. Copy the configuration from `firebase-env-example.txt` and replace with your actual values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. The application should:
   - Show a loading spinner initially
   - Initialize with sample data if the database is empty
   - Display a green connection indicator if successful
   - Show a yellow warning if Firebase is not connected

## Step 6: Verify Data in Firestore

1. Go back to your Firebase console
2. Click on "Firestore Database"
3. You should see two collections:
   - `requisitions` - containing job requisitions
   - `candidates` - containing candidate data

## Features

### What's Included

- **Automatic data synchronization** with Firestore
- **Real-time updates** (candidates and requisitions sync across browser tabs)
- **Offline fallback** to sample data if Firebase is unavailable
- **Loading states** and error handling
- **Bulk operations** for data management

### Database Structure

The Firebase integration maintains the same data structure as the original local storage implementation:

#### Requisitions Collection
- `id` (document ID)
- `title`, `department`, `location`, `type`
- `status`, `priority`, `hiring_manager`, `recruiter`
- `created_date`, `target_start_date`
- `description`, `requirements[]`, `salary_range`
- `positions_to_fill`, `role_type`, `hiring_stages[]`
- `created_at`, `updated_at` (automatic timestamps)

#### Candidates Collection
- `id` (document ID)
- `requisition_id` (references requisitions)
- `first_name`, `last_name`, `email`, `phone`
- `location`, `current_stage`, `priority`, `source`
- `applied_date`, `experience_years`
- `current_company`, `current_title`
- `linkedin_url`, `resume_url`, `portfolio_url`
- `salary_expectation`, `notice_period`, `notes`
- `tags[]`, `interviews[]`
- `created_at`, `updated_at` (automatic timestamps)

## Troubleshooting

### Common Issues

1. **"Firebase not connected" warning**
   - Check your `.env.local` file has the correct values
   - Ensure all environment variables are prefixed with `NEXT_PUBLIC_`
   - Restart your development server after changing environment variables

2. **Permission denied errors**
   - Your Firestore rules might be too restrictive
   - For development, you can use test mode rules in the Firebase console

3. **App not loading**
   - Check the browser console for error messages
   - Verify your Firebase project ID and configuration

### Firebase Security Rules (Production)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to requisitions and candidates
    match /{collection}/{document} {
      allow read, write: if collection in ['requisitions', 'candidates'];
    }
  }
}
```

## Advanced Configuration

### Real-time Subscriptions

The Firebase integration supports real-time data synchronization. You can enable automatic updates by implementing the subscription methods in the Firebase services.

### Data Migration

If you have existing data in localStorage, you can migrate it:

1. Export your current data
2. Use the `bulkOperations.initializeWithSampleData()` function
3. Pass your existing data instead of sample data

## Support

If you encounter issues:

1. Check the Firebase console for any error messages
2. Verify your environment configuration
3. Check the browser console for detailed error logs
4. Ensure your Firebase project has the Firestore database enabled

## Next Steps

- Set up Firebase Authentication for user management
- Configure Firestore security rules for production
- Add file upload capabilities with Firebase Storage
- Implement real-time notifications with Firebase Cloud Messaging
