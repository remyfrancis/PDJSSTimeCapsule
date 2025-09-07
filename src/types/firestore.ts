import { Timestamp } from 'firebase/firestore';

// Base types for common fields
export interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// User preferences
export interface UserPreferences {
  emailNotifications: boolean;
  theme: 'light' | 'dark';
  language?: string;
  timezone?: string;
}

// User document type
export interface User extends BaseDocument {
  email: string;
  displayName: string;
  lastActive: Timestamp;
  profilePicture?: string; // URL to Firebase Storage
  preferences?: UserPreferences;
  isEmailVerified?: boolean;
  accountStatus: 'active' | 'suspended' | 'deleted';
}

// Capsule settings
export interface CapsuleSettings {
  allowSharing: boolean;
  notificationEnabled: boolean;
  isPublic?: boolean; // For future public capsule feature
}

// Capsule document type
export interface Capsule extends BaseDocument {
  title: string;
  description: string;
  userId: string; // Reference to user who owns this capsule
  unlockDate: Timestamp; // When capsule becomes accessible
  isSealed: boolean; // Whether capsule is locked for time-lock
  isOpened: boolean; // Whether user has opened it after unlock
  tags: string[];
  contentCount: number; // Number of content items
  coverImage?: string; // URL to cover image in Storage
  settings?: CapsuleSettings;
  // Computed fields (not stored in Firestore)
  daysUntilUnlock?: number;
  isUnlocked?: boolean;
}

// Content metadata
export interface ContentMetadata {
  duration?: number; // For video/audio in seconds
  dimensions?: {
    width: number;
    height: number;
  }; // For images/video
  description?: string;
  thumbnailUrl?: string; // For video/audio content
  fileHash?: string; // For duplicate detection
}

// Content data based on type
export interface TextContentData {
  text: string;
  format?: 'plain' | 'markdown' | 'html';
}

export interface MediaContentData {
  url: string; // Firebase Storage URL
  fileName: string;
  fileSize: number;
  mimeType: string;
  metadata?: ContentMetadata;
}

export interface DocumentContentData {
  url: string; // Firebase Storage URL
  fileName: string;
  fileSize: number;
  mimeType: string;
  pageCount?: number; // For PDFs
  metadata?: ContentMetadata;
}

// Union type for content data
export type ContentData = TextContentData | MediaContentData | DocumentContentData;

// Content document type
export interface Content extends BaseDocument {
  capsuleId: string; // Reference to parent capsule
  type: 'text' | 'image' | 'video' | 'audio' | 'document';
  order: number; // Display order within capsule
  data: ContentData;
  isProcessed: boolean; // Whether content has been processed/optimized
  thumbnailUrl?: string; // For video/audio content
  // Computed fields (not stored in Firestore)
  capsule?: Capsule; // Populated when needed
}

// System configuration (for admin collection)
export interface SystemConfig extends BaseDocument {
  maintenanceMode: boolean;
  maxFileSize: number; // in bytes
  allowedFileTypes: string[];
  maxCapsulesPerUser: number;
  maxContentPerCapsule: number;
  version: string;
}

// Admin user claims
export interface AdminClaims {
  admin: boolean;
  role?: 'super-admin' | 'moderator' | 'support';
  permissions?: string[];
}

// Storage file metadata
export interface StorageFileMetadata {
  name: string;
  bucket: string;
  contentType: string;
  size: number;
  timeCreated: string;
  updated: string;
  md5Hash: string;
  downloadTokens?: string[];
}

// API Response types (using the more comprehensive version from api.ts)

// Form input types
export interface CreateCapsuleInput {
  title: string;
  description: string;
  unlockDate: Date;
  tags: string[];
  settings?: Partial<CapsuleSettings>;
}

export interface UpdateCapsuleInput extends Partial<CreateCapsuleInput> {
  id: string;
}

export interface CreateContentInput {
  capsuleId: string;
  type: Content['type'];
  order: number;
  data: ContentData;
}

export interface UpdateContentInput extends Partial<CreateContentInput> {
  id: string;
}

// Query filter types
export interface CapsuleFilters {
  userId?: string;
  isSealed?: boolean;
  isOpened?: boolean;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ContentFilters {
  capsuleId?: string;
  type?: Content['type'];
  isProcessed?: boolean;
}

// Search types
export interface SearchFilters {
  query: string;
  type?: 'capsules' | 'content' | 'all';
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Notification types
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  reminderDays: number[]; // Days before unlock to send reminders
}

export interface NotificationData {
  userId: string;
  type: 'unlock_reminder' | 'unlock_ready' | 'capsule_opened';
  capsuleId?: string;
  title: string;
  message: string;
  scheduledFor?: Timestamp;
  sentAt?: Timestamp;
  readAt?: Timestamp;
}

// Analytics types (for future use)
export interface CapsuleAnalytics {
  capsuleId: string;
  viewCount: number;
  shareCount: number;
  openCount: number;
  lastViewed?: Timestamp;
  averageViewDuration?: number; // in seconds
}

// Error types
export interface FirestoreError {
  code: string;
  message: string;
  details?: any;
}

export interface StorageError {
  code: string;
  message: string;
  serverResponse?: any;
}

// Utility types
export type TimestampField = Timestamp | Date | string;
export type OptionalTimestampField = TimestampField | null | undefined;

// Type guards
export function isTextContent(content: Content): content is Content & { data: TextContentData } {
  return content.type === 'text';
}

export function isMediaContent(content: Content): content is Content & { data: MediaContentData } {
  return ['image', 'video', 'audio'].includes(content.type);
}

export function isDocumentContent(content: Content): content is Content & { data: DocumentContentData } {
  return content.type === 'document';
}

// Helper types for API responses (import from api.ts)
import type { ApiResponse, PaginatedResponse } from './api';

export type UserResponse = ApiResponse<User>;
export type CapsuleResponse = ApiResponse<Capsule>;
export type ContentResponse = ApiResponse<Content>;
export type CapsulesResponse = PaginatedResponse<Capsule>;
export type ContentListResponse = PaginatedResponse<Content>;
