import { z } from 'zod';

// Base validation schemas
export const BaseDocumentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

// Timestamp validation (for Firestore)
export const TimestampSchema = z.union([
  z.date(),
  z.string().datetime(),
  z.object({
    seconds: z.number(),
    nanoseconds: z.number(),
  }),
]);

// Common field validations
export const EmailSchema = z.string().email('Invalid email format');
export const DisplayNameSchema = z.string().min(1, 'Display name is required').max(100, 'Display name too long');
export const TitleSchema = z.string().min(1, 'Title is required').max(200, 'Title too long');
export const DescriptionSchema = z.string().max(1000, 'Description too long');
export const TagSchema = z.string().min(1, 'Tag cannot be empty').max(50, 'Tag too long');

// Date validation schemas
export const FutureDateSchema = z.date().refine(
  (date) => date > new Date(),
  'Date must be in the future'
);

export const PastDateSchema = z.date().refine(
  (date) => date < new Date(),
  'Date must be in the past'
);

// File validation schemas
export const FileSizeSchema = z.number().min(1, 'File size must be positive').max(100 * 1024 * 1024, 'File too large (max 100MB)');
export const MimeTypeSchema = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*$/, 'Invalid MIME type');

// URL validation
export const UrlSchema = z.string().url('Invalid URL format');

// Boolean validation with defaults
export const BooleanSchema = z.boolean().default(false);

// Pagination schemas
export const PaginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search schema
export const SearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  type: z.enum(['capsules', 'content', 'all']).default('all'),
  tags: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
});

// Error response schema
export const ValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  value: z.any().optional(),
});

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.any().optional(),
  timestamp: z.string(),
});

// Utility functions
export const validateId = (id: string): boolean => {
  return z.string().min(1).safeParse(id).success;
};

export const validateEmail = (email: string): boolean => {
  return EmailSchema.safeParse(email).success;
};

export const validateUrl = (url: string): boolean => {
  return UrlSchema.safeParse(url).success;
};

export const validateFileSize = (size: number): boolean => {
  return FileSizeSchema.safeParse(size).success;
};

export const validateMimeType = (mimeType: string): boolean => {
  return MimeTypeSchema.safeParse(mimeType).success;
};
