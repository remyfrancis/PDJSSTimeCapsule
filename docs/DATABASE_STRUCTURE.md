# Firebase Time Capsule Database Structure

This document describes the complete database structure for the Firebase Time Capsule application, including collections, documents, fields, relationships, and validation rules.

## Overview

The database uses Firestore (NoSQL) with the following main collections:

- `users` - User profiles and preferences
- `capsules` - Time capsules with metadata
- `content` - Content items within capsules
- `notifications` - User notifications
- `analytics` - Capsule usage analytics
- `system` - System configuration

## Database Schema Diagram

```
┌─────────────────┐
│     USERS       │
│ ┌─────────────┐ │
│ │ id          │ │
│ │ email       │ │
│ │ displayName │ │
│ │ preferences │ │
│ │ createdAt   │ │
│ └─────────────┘ │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│    CAPSULES     │
│ ┌─────────────┐ │
│ │ id          │ │
│ │ userId      │ │◄───┐
│ │ title       │ │    │
│ │ description │ │    │
│ │ unlockDate  │ │    │
│ │ isSealed    │ │    │
│ │ settings    │ │    │
│ └─────────────┘ │    │
└─────────────────┘    │
         │              │
         │ 1:N          │
         ▼              │
┌─────────────────┐     │
│     CONTENT     │     │
│ ┌─────────────┐ │     │
│ │ id          │ │     │
│ │ capsuleId   │ │◄────┘
│ │ type        │ │
│ │ order       │ │
│ │ data        │ │
│ │ thumbnailUrl│ │
│ └─────────────┘ │
└─────────────────┘

┌─────────────────┐
│  NOTIFICATIONS  │
│ ┌─────────────┐ │
│ │ id          │ │
│ │ userId      │ │◄───┐
│ │ type        │ │    │
│ │ capsuleId   │ │    │
│ │ title       │ │    │
│ │ message     │ │    │
│ └─────────────┘ │    │
└─────────────────┘    │
                       │
┌─────────────────┐    │
│    ANALYTICS    │    │
│ ┌─────────────┐ │    │
│ │ id          │ │    │
│ │ capsuleId   │ │    │
│ │ viewCount   │ │    │
│ │ shareCount  │ │    │
│ │ openCount   │ │    │
│ └─────────────┘ │    │
└─────────────────┘    │
                       │
┌─────────────────┐    │
│     SYSTEM      │    │
│ ┌─────────────┐ │    │
│ │ id          │ │    │
│ │ config      │ │    │
│ │ version     │ │    │
│ └─────────────┘ │    │
└─────────────────┘    │
                       │
                       │
┌─────────────────┐    │
│      USERS      │◄───┘
│ (Reference)     │
└─────────────────┘
```

## Collections

### 1. Users Collection (`users`)

**Purpose**: Store user profiles, preferences, and account information.

**Document Structure**:

```typescript
{
  id: string,                    // Document ID (auto-generated)
  email: string,                  // User's email address
  displayName: string,            // User's display name
  lastActive: Timestamp,         // Last activity timestamp
  profilePicture?: string,       // URL to profile image
  preferences?: {                // User preferences
    emailNotifications: boolean,
    theme: 'light' | 'dark',
    language?: string,
    timezone?: string
  },
  isEmailVerified?: boolean,     // Email verification status
  accountStatus: 'active' | 'suspended' | 'deleted',
  createdAt: Timestamp,          // Account creation time
  updatedAt?: Timestamp         // Last update time
}
```

**Security Rules**:

```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

**Indexes**:

- None required (single document access by user ID)

---

### 2. Capsules Collection (`capsules`)

**Purpose**: Store time capsule metadata and settings.

**Document Structure**:

```typescript
{
  id: string,                    // Document ID (auto-generated)
  title: string,                 // Capsule title
  description: string,           // Capsule description
  userId: string,                // Reference to user who owns this capsule
  unlockDate: Timestamp,        // When capsule becomes accessible
  isSealed: boolean,            // Whether capsule is locked for time-lock
  isOpened: boolean,            // Whether user has opened it after unlock
  tags: string[],               // Array of tags
  contentCount: number,         // Number of content items
  coverImage?: string,          // URL to cover image in Storage
  settings?: {                  // Capsule settings
    allowSharing: boolean,
    notificationEnabled: boolean,
    isPublic?: boolean
  },
  createdAt: Timestamp,         // Creation time
  updatedAt?: Timestamp        // Last update time
}
```

**Security Rules**:

```javascript
match /capsules/{capsuleId} {
  allow read, write: if request.auth != null &&
    request.auth.uid == resource.data.userId;
  allow create: if request.auth != null &&
    request.auth.uid == request.resource.data.userId;
}
```

**Indexes**:

```json
[
  {
    "collectionGroup": "capsules",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "userId", "order": "ASCENDING" },
      { "fieldPath": "unlockDate", "order": "ASCENDING" }
    ]
  },
  {
    "collectionGroup": "capsules",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "userId", "order": "ASCENDING" },
      { "fieldPath": "isSealed", "order": "ASCENDING" },
      { "fieldPath": "createdAt", "order": "DESCENDING" }
    ]
  }
]
```

---

### 3. Content Collection (`content`)

**Purpose**: Store individual content items within capsules.

**Document Structure**:

```typescript
{
  id: string,                    // Document ID (auto-generated)
  capsuleId: string,             // Reference to parent capsule
  type: 'text' | 'image' | 'video' | 'audio' | 'document',
  order: number,                 // Display order within capsule
  data: {                        // Content data based on type
    // For text content:
    text?: string,
    format?: 'plain' | 'markdown' | 'html',

    // For media/document content:
    url?: string,                // Firebase Storage URL
    fileName?: string,
    fileSize?: number,
    mimeType?: string,
    metadata?: {                 // Additional metadata
      duration?: number,         // For video/audio
      dimensions?: {            // For images/video
        width: number,
        height: number
      },
      description?: string,
      thumbnailUrl?: string,
      fileHash?: string,
      pageCount?: number        // For PDFs
    }
  },
  isProcessed: boolean,          // Whether content has been processed/optimized
  thumbnailUrl?: string,        // For video/audio content
  createdAt: Timestamp,         // Creation time
  updatedAt?: Timestamp        // Last update time
}
```

**Security Rules**:

```javascript
match /content/{contentId} {
  allow read, write: if request.auth != null &&
    request.auth.uid == get(/databases/$(database)/documents/capsules/$(resource.data.capsuleId)).data.userId;
  allow create: if request.auth != null &&
    request.auth.uid == get(/databases/$(database)/documents/capsules/$(request.resource.data.capsuleId)).data.userId;
}
```

**Indexes**:

```json
[
  {
    "collectionGroup": "content",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "capsuleId", "order": "ASCENDING" },
      { "fieldPath": "order", "order": "ASCENDING" }
    ]
  }
]
```

---

### 4. Notifications Collection (`notifications`)

**Purpose**: Store user notifications and reminders.

**Document Structure**:

```typescript
{
  id: string,                    // Document ID (auto-generated)
  userId: string,                // Reference to user
  type: 'unlock_reminder' | 'unlock_ready' | 'capsule_opened',
  capsuleId?: string,           // Reference to capsule (if applicable)
  title: string,                // Notification title
  message: string,              // Notification message
  scheduledFor?: Timestamp,     // When notification should be sent
  sentAt?: Timestamp,          // When notification was sent
  readAt?: Timestamp           // When user read the notification
}
```

**Security Rules**:

```javascript
match /notifications/{notificationId} {
  allow read, write: if request.auth != null &&
    request.auth.uid == resource.data.userId;
  allow create: if request.auth != null &&
    request.auth.uid == request.resource.data.userId;
}
```

**Indexes**:

- None required (queries by userId)

---

### 5. Analytics Collection (`analytics`)

**Purpose**: Store usage analytics for capsules.

**Document Structure**:

```typescript
{
  id: string,                    // Document ID (auto-generated)
  capsuleId: string,             // Reference to capsule
  viewCount: number,            // Number of views
  shareCount: number,           // Number of shares
  openCount: number,            // Number of times opened
  lastViewed?: Timestamp,       // Last view timestamp
  averageViewDuration?: number  // Average view duration in seconds
}
```

**Security Rules**:

```javascript
match /analytics/{analyticsId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null &&
    request.auth.uid == get(/databases/$(database)/documents/capsules/$(resource.data.capsuleId)).data.userId;
}
```

**Indexes**:

- None required (queries by capsuleId)

---

### 6. System Collection (`system`)

**Purpose**: Store system-wide configuration and settings.

**Document Structure**:

```typescript
{
  id: string,                    // Document ID (auto-generated)
  maintenanceMode: boolean,       // System maintenance status
  maxFileSize: number,          // Maximum file size in bytes
  allowedFileTypes: string[],   // Allowed MIME types
  maxCapsulesPerUser: number,   // Maximum capsules per user
  maxContentPerCapsule: number, // Maximum content per capsule
  version: string,              // System version
  createdAt: Timestamp,         // Creation time
  updatedAt?: Timestamp        // Last update time
}
```

**Security Rules**:

```javascript
match /system/{document=**} {
  allow read: if request.auth != null;
  allow write: if request.auth != null &&
    request.auth.token.admin == true;
}
```

**Indexes**:

- None required (single document access)

---

## Relationships

### User → Capsules

- **One-to-Many**: One user can have multiple capsules
- **Foreign Key**: `capsules.userId` → `users.id`

### Capsule → Content

- **One-to-Many**: One capsule can have multiple content items
- **Foreign Key**: `content.capsuleId` → `capsules.id`

### User → Notifications

- **One-to-Many**: One user can have multiple notifications
- **Foreign Key**: `notifications.userId` → `users.id`

### Capsule → Analytics

- **One-to-One**: One capsule has one analytics record
- **Foreign Key**: `analytics.capsuleId` → `capsules.id`

## Data Validation

All data is validated using Zod schemas before being written to Firestore:

- **User Validation**: Email format, display name length, preferences
- **Capsule Validation**: Title/description length, future unlock dates, tag limits
- **Content Validation**: File size limits, MIME type validation, content format
- **Notification Validation**: Required fields, valid types, timestamp validation

## Security Considerations

1. **Authentication Required**: All operations require user authentication
2. **User Isolation**: Users can only access their own data
3. **Cascade Security**: Content access is controlled by parent capsule ownership
4. **Admin Access**: System configuration requires admin privileges
5. **Data Validation**: All input is validated before database operations

## Performance Optimizations

1. **Indexes**: Composite indexes for common query patterns
2. **Batch Operations**: Multiple writes combined into single operations
3. **Data Cleaning**: Undefined values removed before Firestore writes
4. **Pagination**: Large result sets paginated for performance
5. **Caching**: Frequently accessed data cached at application level

## Backup and Recovery

1. **Automated Backups**: Firestore automatic backups enabled
2. **Point-in-Time Recovery**: Available for disaster recovery
3. **Export/Import**: Data can be exported for migration
4. **Seed Data**: Development data can be regenerated using seed scripts

## Monitoring and Analytics

1. **Usage Metrics**: Track capsule views, shares, and opens
2. **Performance Monitoring**: Query performance and error rates
3. **Security Monitoring**: Failed authentication attempts and rule violations
4. **Storage Monitoring**: File uploads and storage usage

---

_Last Updated: September 2025_
_Version: 1.0.0_
