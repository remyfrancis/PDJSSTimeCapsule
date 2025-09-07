# Firestore Database Setup with Security Rules

This document provides step-by-step instructions for setting up Firestore database with security rules for the Digital Time Capsule application.

## Files Created

The following files have been created to configure Firestore and Firebase Storage:

- `firebase.json` - Firebase project configuration
- `firestore.rules` - Firestore security rules
- `storage.rules` - Firebase Storage security rules
- `firestore.indexes.json` - Firestore database indexes

## Security Rules Overview

### Firestore Security Rules

The Firestore security rules implement the following access controls:

1. **Users Collection** (`/users/{userId}`)

   - Users can only read/write their own profile data
   - Authentication required for all operations

2. **Capsules Collection** (`/capsules/{capsuleId}`)

   - Users can only access capsules they own
   - Authentication required for all operations
   - Prevents cross-user data access

3. **Content Collection** (`/content/{contentId}`)

   - Users can only access content from their own capsules
   - Uses Firestore `get()` function to verify capsule ownership
   - Authentication required for all operations

4. **Admin Collection** (`/admin/{document=**}`)

   - Only accessible by users with admin token claim
   - Reserved for administrative functions

5. **System Collection** (`/system/{document=**}`)
   - Read-only access for authenticated users
   - Used for system-wide configuration

### Storage Security Rules

The Firebase Storage security rules implement:

1. **User Content Storage** (`/users/{userId}/{allPaths=**}`)

   - Users can only access files in their own user directory
   - Authentication required for all operations

2. **Capsule Content Storage** (`/capsules/{capsuleId}/{allPaths=**}`)

   - Users can only access files from capsules they own
   - Uses Firestore integration to verify ownership
   - Authentication required for all operations

3. **Public Assets** (`/public/{allPaths=**}`)

   - Read-only access for authenticated users
   - Used for shared resources

4. **Admin Storage** (`/admin/{allPaths=**}`)
   - Only accessible by admin users
   - Reserved for administrative files

## Database Indexes

The following composite indexes are configured for optimal query performance:

1. **Capsules by User and Unlock Date**

   - Enables efficient queries for user's capsules sorted by unlock date
   - Used for dashboard display and notification scheduling

2. **Capsules by User, Sealed Status, and Creation Date**

   - Enables efficient queries for user's capsules filtered by sealed status
   - Used for capsule management interface

3. **Content by Capsule and Order**
   - Enables efficient queries for capsule content in display order
   - Used for content timeline display

## Deployment Instructions

### Prerequisites

1. Install Firebase CLI:

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:

   ```bash
   firebase login
   ```

3. Initialize Firebase project (if not already done):
   ```bash
   firebase init
   ```

### Deploy Security Rules

1. **Deploy Firestore Rules**:

   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Deploy Storage Rules**:

   ```bash
   firebase deploy --only storage
   ```

3. **Deploy Database Indexes**:

   ```bash
   firebase deploy --only firestore:indexes
   ```

4. **Deploy All Rules and Indexes**:
   ```bash
   firebase deploy --only firestore,storage
   ```

### Verify Deployment

1. **Check Firestore Rules**:

   - Go to Firebase Console → Firestore Database → Rules
   - Verify the rules are active and match the deployed version

2. **Check Storage Rules**:

   - Go to Firebase Console → Storage → Rules
   - Verify the rules are active and match the deployed version

3. **Check Database Indexes**:
   - Go to Firebase Console → Firestore Database → Indexes
   - Verify all composite indexes are built and ready

## Testing Security Rules

### Test Firestore Rules

1. **Test User Access**:

   ```javascript
   // This should succeed
   const userDoc = await getDoc(doc(db, "users", currentUser.uid));

   // This should fail
   const otherUserDoc = await getDoc(doc(db, "users", "other-user-id"));
   ```

2. **Test Capsule Access**:

   ```javascript
   // This should succeed if user owns the capsule
   const capsuleDoc = await getDoc(doc(db, "capsules", "user-capsule-id"));

   // This should fail
   const otherCapsuleDoc = await getDoc(
     doc(db, "capsules", "other-user-capsule-id")
   );
   ```

### Test Storage Rules

1. **Test File Upload**:

   ```javascript
   // This should succeed
   const uploadRef = ref(storage, `users/${currentUser.uid}/test-file.jpg`);
   await uploadBytes(uploadRef, file);

   // This should fail
   const otherUploadRef = ref(storage, `users/other-user-id/test-file.jpg`);
   await uploadBytes(otherUploadRef, file);
   ```

## Security Considerations

1. **Authentication Required**: All operations require valid authentication
2. **User Isolation**: Users can only access their own data
3. **Capsule Ownership**: Content access is verified through capsule ownership
4. **Admin Controls**: Administrative functions are properly protected
5. **File Type Validation**: Consider adding file type validation in application code
6. **Rate Limiting**: Consider implementing rate limiting for file uploads

## Monitoring and Maintenance

1. **Monitor Security Rules**: Regularly review Firebase Console for rule violations
2. **Update Rules**: Modify rules as needed for new features
3. **Test Changes**: Always test rule changes in development environment first
4. **Document Changes**: Keep this documentation updated with any rule modifications

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**:

   - Verify user is authenticated
   - Check if user has proper ownership of the resource
   - Ensure rules are properly deployed

2. **Index Not Found Errors**:

   - Verify indexes are deployed: `firebase deploy --only firestore:indexes`
   - Check if queries match index definitions
   - Wait for index building to complete

3. **Storage Access Errors**:
   - Verify file path matches user ownership
   - Check if storage rules are deployed
   - Ensure user is authenticated

### Debug Mode

Enable debug mode in Firebase Console to see detailed rule evaluation logs:

1. Go to Firebase Console → Firestore Database → Rules
2. Click "Debug" tab
3. Monitor rule evaluation in real-time

## Next Steps

After deploying these security rules:

1. Test authentication flow with the rules
2. Implement API endpoints that work with these rules
3. Add client-side error handling for permission errors
4. Consider adding custom claims for admin users
5. Implement data validation in application code
6. Set up monitoring and alerting for security violations
