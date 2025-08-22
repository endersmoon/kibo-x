# Firestore Indexes Setup Guide

This guide helps you set up the required Firestore composite indexes for your Kibo-X application.

## Why Indexes Are Needed

Firestore requires composite indexes when you query on multiple fields or combine filtering and ordering operations. Your application queries:

1. **Requisitions**: Filter by `user_id` AND order by `created_at`
2. **Candidates**: Filter by `user_id` AND order by `created_at`
3. **Candidates by Requisition**: Filter by `user_id` AND `requisition_id` AND order by `created_at`

## Quick Fix (Automated)

The error message provides direct links to create indexes. Use these links:

### 1. Requisitions Index
Click this link to create the requisitions index automatically:
[Create Requisitions Index](https://console.firebase.google.com/v1/r/project/kibox-a1d1a/firestore/indexes?create_composite=ClBwcm9qZWN0cy9raWJveC1hMWQxYS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcmVxdWlzaXRpb25zL2luZGV4ZXMvXxABGgsKB3VzZXJfaWQQARoOCgpjcmVhdGVkX2F0EAIaDAoIX19uYW1lX18QAg)

### 2. Candidates Index
You'll need to create similar indexes for candidates. Follow the steps below.

## Manual Index Creation

If the automated links don't work, create indexes manually:

### Step 1: Go to Firestore Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `kibox-a1d1a`
3. Go to Firestore Database
4. Click on the "Indexes" tab

### Step 2: Create Requisitions Index

Click "Create Index" and configure:

- **Collection**: `requisitions`
- **Fields**:
  1. `user_id` - Ascending
  2. `created_at` - Descending
  3. `__name__` - Ascending (automatically added)

### Step 3: Create Candidates Index

Click "Create Index" and configure:

- **Collection**: `candidates`
- **Fields**:
  1. `user_id` - Ascending
  2. `created_at` - Descending
  3. `__name__` - Ascending (automatically added)

### Step 4: Create Candidates by Requisition Index

Click "Create Index" and configure:

- **Collection**: `candidates`
- **Fields**:
  1. `user_id` - Ascending
  2. `requisition_id` - Ascending
  3. `created_at` - Descending
  4. `__name__` - Ascending (automatically added)

## Index Building Process

After creating indexes:

1. **Building Time**: Indexes can take a few minutes to build
2. **Status**: Monitor the "Status" column in the Indexes tab
3. **Ready**: Wait for status to change from "Building" to "Enabled"

## Temporary Workaround

I've updated your Firebase services to work without indexes temporarily:

- ✅ Queries will fall back to simple filtering without ordering
- ✅ Client-side sorting is applied as a backup
- ✅ Application continues to work while indexes are building
- ✅ Better error handling and warnings in console

## Testing After Index Creation

Once indexes are created and enabled:

1. **Refresh your browser** at http://localhost:3001
2. **Sign in** to your account
3. **Check browser console** for any warnings
4. **Verify data loads** properly without errors

## Alternative: Using Firebase CLI

You can also create indexes using the Firebase CLI:

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login and Initialize
```bash
firebase login
firebase init firestore
```

### Create firestore.indexes.json
```json
{
  "indexes": [
    {
      "collectionGroup": "requisitions",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "user_id", "order": "ASCENDING"},
        {"fieldPath": "created_at", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "candidates",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "user_id", "order": "ASCENDING"},
        {"fieldPath": "created_at", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "candidates",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "user_id", "order": "ASCENDING"},
        {"fieldPath": "requisition_id", "order": "ASCENDING"},
        {"fieldPath": "created_at", "order": "DESCENDING"}
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

## Troubleshooting

### Common Issues

1. **Indexes taking too long**
   - Small datasets: Usually complete in 1-2 minutes
   - Larger datasets: Can take hours
   - Check Firebase console for progress

2. **Permission errors**
   - Ensure you're signed in to the correct Google account
   - Verify you have edit permissions for the Firebase project

3. **Index creation fails**
   - Check that field names match exactly
   - Ensure collection names are correct
   - Verify project ID is correct

### Verification

After indexes are created, you should see:

1. **No more index errors** in browser console
2. **Faster query performance**
3. **Proper data ordering** in the application
4. **Green status indicators** in Firebase console

## Performance Benefits

With proper indexes:

- ⚡ **Faster Queries**: Server-side filtering and ordering
- 📈 **Better Scalability**: Efficient for large datasets  
- 🔍 **Optimized Searches**: Sub-second response times
- 💰 **Cost Effective**: Reduced read operations

## Next Steps

1. **Create the indexes** using the provided links or manual steps
2. **Wait for completion** (check Firebase console)
3. **Test the application** to ensure everything works
4. **Monitor performance** in the Firebase console

Your application will continue to work with the fallback queries while indexes are being created!
