# Types Documentation

This folder contains TypeScript type definitions for the Digital Time Capsule application. These types provide type safety and IntelliSense support throughout the codebase.

## File Structure

```
src/types/
├── index.ts          # Main exports and common types
├── firestore.ts      # Firestore collection and document types
├── storage.ts        # Firebase Storage types and utilities
└── api.ts           # API response and utility types
```

## Usage

### Basic Import

```typescript
import { User, Capsule, Content } from "@/types";
```

### Specific Module Import

```typescript
import { User, Capsule } from "@/types/firestore";
import { StoragePaths, FileTypeDetector } from "@/types/storage";
import { ApiResponse, PaginationParams } from "@/types/api";
```

## Type Categories

### 1. Firestore Types (`firestore.ts`)

**Core Document Types:**

- `User` - User profile and preferences
- `Capsule` - Time capsule metadata and settings
- `Content` - Individual content items within capsules
- `SystemConfig` - System-wide configuration (admin)

**Content Data Types:**

- `TextContentData` - Text-based content
- `MediaContentData` - Image, video, audio content
- `DocumentContentData` - PDF and document files

**Form Input Types:**

- `CreateCapsuleInput` - Capsule creation form data
- `UpdateCapsuleInput` - Capsule update form data
- `CreateContentInput` - Content creation form data

**Query and Filter Types:**

- `CapsuleFilters` - Capsule query filters
- `ContentFilters` - Content query filters
- `SearchFilters` - Search functionality filters

### 2. Storage Types (`storage.ts`)

**File Management:**

- `StoragePath` - File path structure
- `UploadOptions` - File upload configuration
- `UploadProgress` - Upload progress tracking
- `FileValidationRules` - File validation constraints

**Utility Classes:**

- `StoragePaths` - Static methods for generating file paths
- `FileTypeDetector` - File type detection and validation
- `StorageValidator` - File validation utilities

**Constants:**

- `FILE_SIZE_LIMITS` - Maximum file sizes for different types

### 3. API Types (`api.ts`)

**Response Types:**

- `ApiResponse<T>` - Generic API response wrapper
- `PaginatedResponse<T>` - Paginated data responses
- `ApiError` - Error response structure

**Form and UI Types:**

- `FormState<T>` - Form state management
- `LoadingState` - Loading state management
- `ErrorState` - Error state management
- `ModalState` - Modal dialog state

**Component Props:**

- `ButtonProps` - Button component props
- `InputProps` - Input component props
- `BaseComponentProps` - Base component props

## Type Guards

Type guards are provided for runtime type checking:

```typescript
import { isTextContent, isMediaContent, isDocumentContent } from "@/types";

function processContent(content: Content) {
  if (isTextContent(content)) {
    // content.data is now typed as TextContentData
    console.log(content.data.text);
  } else if (isMediaContent(content)) {
    // content.data is now typed as MediaContentData
    console.log(content.data.url);
  }
}
```

## Utility Types

### Storage Path Generation

```typescript
import { StoragePaths } from "@/types/storage";

// Generate storage paths
const profilePath = StoragePaths.userProfile(userId, "avatar.jpg");
const imagePath = StoragePaths.capsuleImage(capsuleId, "photo.jpg");
const videoPath = StoragePaths.capsuleVideo(capsuleId, "memory.mp4");
```

### File Type Detection

```typescript
import { FileTypeDetector } from "@/types/storage";

const fileType = FileTypeDetector.getFileType("image/jpeg"); // 'image'
const isImage = FileTypeDetector.isImageFile("image/png"); // true
const allowedTypes = FileTypeDetector.getAllowedImageTypes();
```

### File Validation

```typescript
import { StorageValidator } from "@/types/storage";

const validation = StorageValidator.validateImageFile(file);
if (!validation.valid) {
  console.error(validation.error);
}
```

## Constants

### API Endpoints

```typescript
import { API_ENDPOINTS } from "@/types/api";

const capsuleUrl = API_ENDPOINTS.CAPSULES.GET("capsule-id");
const uploadUrl = API_ENDPOINTS.CONTENT.UPLOAD;
```

### File Size Limits

```typescript
import { FILE_SIZE_LIMITS } from "@/types/storage";

const maxImageSize = FILE_SIZE_LIMITS.IMAGE_MAX_SIZE; // 10MB
const maxVideoSize = FILE_SIZE_LIMITS.VIDEO_MAX_SIZE; // 500MB
```

## Best Practices

### 1. Use Type Guards for Content Types

```typescript
// ✅ Good - Use type guards
if (isTextContent(content)) {
  return <TextContentComponent data={content.data} />;
}

// ❌ Avoid - Type assertions without validation
return <TextContentComponent data={content.data as TextContentData} />;
```

### 2. Leverage Utility Types

```typescript
// ✅ Good - Use utility types
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;

// ✅ Good - Use form input types
const createCapsule = (input: CreateCapsuleInput) => {
  // Implementation
};
```

### 3. Use API Response Types

```typescript
// ✅ Good - Type API responses
const response: ApiResponse<Capsule> = await fetchCapsule(id);
if (response.success) {
  const capsule = response.data; // Properly typed
}
```

### 4. Validate File Types

```typescript
// ✅ Good - Validate files before upload
const validation = StorageValidator.validateImageFile(file);
if (!validation.valid) {
  throw new Error(validation.error);
}
```

## Extending Types

### Adding New Content Types

```typescript
// In firestore.ts
export interface NewContentData {
  // Define new content data structure
}

// Update ContentData union type
export type ContentData =
  | TextContentData
  | MediaContentData
  | DocumentContentData
  | NewContentData; // Add new type

// Add type guard
export function isNewContent(
  content: Content
): content is Content & { data: NewContentData } {
  return content.type === "new-type";
}
```

### Adding New API Endpoints

```typescript
// In api.ts
export const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_FEATURE: {
    LIST: "/api/new-feature",
    CREATE: "/api/new-feature",
    GET: (id: string) => `/api/new-feature/${id}`,
  },
} as const;
```

## Type Safety Benefits

1. **Compile-time Error Detection**: Catch errors before runtime
2. **IntelliSense Support**: Better IDE autocomplete and suggestions
3. **Refactoring Safety**: Confident refactoring with type checking
4. **Documentation**: Types serve as living documentation
5. **API Contract Enforcement**: Ensure API responses match expected structure

## Migration Notes

When updating types:

1. **Backward Compatibility**: Maintain existing interfaces when possible
2. **Gradual Migration**: Use optional fields for new properties
3. **Version Control**: Document breaking changes in type definitions
4. **Testing**: Update tests when types change

This type system provides comprehensive coverage for the Digital Time Capsule application, ensuring type safety and better developer experience throughout the codebase.
