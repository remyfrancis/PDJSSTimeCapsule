// Main types index file - exports all types for easy importing
export * from './firestore';
export * from './storage';
export * from './api';

// Export validation schemas
export * from '../lib/validation';

// Explicitly re-export conflicting types from api.ts to resolve conflicts
export type { ApiResponse, PaginatedResponse } from './api';

// Re-export commonly used Firebase types
export type { Timestamp } from 'firebase/firestore';
export type { User as FirebaseUser } from 'firebase/auth';

// Common utility types
export type ID = string;
export type DocumentReference = import('firebase/firestore').DocumentReference;
export type CollectionReference = import('firebase/firestore').CollectionReference;
export type Query = import('firebase/firestore').Query;
export type QuerySnapshot = import('firebase/firestore').QuerySnapshot;
export type DocumentSnapshot = import('firebase/firestore').DocumentSnapshot;

// Type aliases for better readability
export type UserID = ID;
export type CapsuleID = ID;
export type ContentID = ID;
export type StoragePath = string;

// Generic collection types
export interface Collection<T> {
  [key: string]: T;
}

// Database reference types
export interface DatabaseRefs {
  users: CollectionReference;
  capsules: CollectionReference;
  content: CollectionReference;
  admin: CollectionReference;
  system: CollectionReference;
}

// Environment types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  NEXT_PUBLIC_FIREBASE_APP_ID: string;
  FIREBASE_ADMIN_PROJECT_ID: string;
  FIREBASE_ADMIN_PRIVATE_KEY_ID: string;
  FIREBASE_ADMIN_PRIVATE_KEY: string;
  FIREBASE_ADMIN_CLIENT_EMAIL: string;
  FIREBASE_ADMIN_CLIENT_ID: string;
  FIREBASE_ADMIN_AUTH_URI: string;
  FIREBASE_ADMIN_TOKEN_URI: string;
  FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL: string;
  FIREBASE_ADMIN_CLIENT_X509_CERT_URL: string;
}
