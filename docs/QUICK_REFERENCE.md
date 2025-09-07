# Firebase Time Capsule - Quick Reference

## Collections Overview

| Collection      | Purpose         | Key Fields                            | Relationships              |
| --------------- | --------------- | ------------------------------------- | -------------------------- |
| `users`         | User profiles   | `id`, `email`, `displayName`          | 1:N → capsules             |
| `capsules`      | Time capsules   | `id`, `userId`, `title`, `unlockDate` | N:1 ← users, 1:N → content |
| `content`       | Content items   | `id`, `capsuleId`, `type`, `data`     | N:1 ← capsules             |
| `notifications` | User alerts     | `id`, `userId`, `type`, `capsuleId`   | N:1 ← users                |
| `analytics`     | Usage metrics   | `id`, `capsuleId`, `viewCount`        | 1:1 ← capsules             |
| `system`        | Config settings | `id`, `config`, `version`             | Standalone                 |

## Common Queries

### Get User's Capsules

```typescript
const capsules = await getDocs(
  query(
    collection(db, "capsules"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  )
);
```

### Get Capsule Content

```typescript
const content = await getDocs(
  query(
    collection(db, "content"),
    where("capsuleId", "==", capsuleId),
    orderBy("order", "asc")
  )
);
```

### Get User Notifications

```typescript
const notifications = await getDocs(
  query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("scheduledFor", "desc")
  )
);
```

## Security Rules Summary

- **Users**: Can only access their own profile
- **Capsules**: Can only access capsules they own
- **Content**: Can only access content from owned capsules
- **Notifications**: Can only access their own notifications
- **Analytics**: Read-only for capsule owners
- **System**: Read-only for all users, write for admins

## Data Validation

All data is validated using Zod schemas:

- `UserSchema` - User profile validation
- `CapsuleSchema` - Capsule metadata validation
- `ContentSchema` - Content item validation
- `NotificationSchema` - Notification validation

## File Storage

Content files are stored in Firebase Storage with the following structure:

```
/storage/
├── users/{userId}/
│   ├── profile-pictures/
│   └── capsules/{capsuleId}/
│       ├── images/
│       ├── videos/
│       ├── audio/
│       └── documents/
```

## Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Development Commands

```bash
# Start development server
npm run dev

# Seed database with test data
npm run seed

# Clear database
npm run seed:clear

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Start Firebase emulators
firebase emulators:start
```

## Error Handling

Common Firestore errors and solutions:

- `PERMISSION_DENIED` - Check security rules
- `INVALID_ARGUMENT` - Check data validation
- `NOT_FOUND` - Verify document exists
- `ALREADY_EXISTS` - Document ID conflict

## Performance Tips

1. Use composite indexes for complex queries
2. Implement pagination for large datasets
3. Use batch operations for multiple writes
4. Cache frequently accessed data
5. Clean undefined values before writes

## Backup and Recovery

- Firestore automatic backups enabled
- Point-in-time recovery available
- Export/import for data migration
- Seed scripts for development data
