// Main validation index file - exports all validation schemas
export * from './base';
export * from './user';
export * from './capsule';
export * from './content';
export * from './api';

// Re-export Zod for convenience
export { z } from 'zod';

// Common validation utilities
export const validateSchema = <T>(schema: any, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, errors: [error.message] };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

export const validateSchemaSafe = <T>(schema: any, data: unknown): { success: boolean; data?: T; error?: any } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
};

// Validation helper functions
export const isValidId = (id: string): boolean => {
  return typeof id === 'string' && id.length > 0;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidFileSize = (size: number, maxSize: number = 100 * 1024 * 1024): boolean => {
  return typeof size === 'number' && size > 0 && size <= maxSize;
};

export const isValidMimeType = (mimeType: string, allowedTypes: string[] = []): boolean => {
  if (allowedTypes.length === 0) {
    return /^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*$/.test(mimeType);
  }
  return allowedTypes.includes(mimeType);
};
