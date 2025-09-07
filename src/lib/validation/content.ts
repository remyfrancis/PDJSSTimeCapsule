import { z } from 'zod';
import { 
  BaseDocumentSchema, 
  TimestampSchema,
  UrlSchema,
  FileSizeSchema,
  MimeTypeSchema 
} from './base';

// Content metadata validation
export const ContentMetadataSchema = z.object({
  duration: z.number().min(0, 'Duration must be positive').optional(),
  dimensions: z.object({
    width: z.number().int().min(1, 'Width must be positive'),
    height: z.number().int().min(1, 'Height must be positive'),
  }).optional(),
  description: z.string().max(500, 'Description too long').optional(),
  thumbnailUrl: UrlSchema.optional(),
  fileHash: z.string().min(1, 'File hash is required').optional(),
});

// Text content data validation
export const TextContentDataSchema = z.object({
  text: z.string().min(1, 'Text content is required').max(50000, 'Text content too long'),
  format: z.enum(['plain', 'markdown', 'html']).default('plain'),
});

// Media content data validation
export const MediaContentDataSchema = z.object({
  url: UrlSchema,
  fileName: z.string().min(1, 'File name is required').max(255, 'File name too long'),
  fileSize: FileSizeSchema,
  mimeType: MimeTypeSchema,
  metadata: ContentMetadataSchema.optional(),
});

// Document content data validation
export const DocumentContentDataSchema = z.object({
  url: UrlSchema,
  fileName: z.string().min(1, 'File name is required').max(255, 'File name too long'),
  fileSize: FileSizeSchema,
  mimeType: MimeTypeSchema,
  pageCount: z.number().int().min(1, 'Page count must be positive').optional(),
  metadata: ContentMetadataSchema.optional(),
});

// Content data union validation
export const ContentDataSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    data: TextContentDataSchema,
  }),
  z.object({
    type: z.literal('image'),
    data: MediaContentDataSchema,
  }),
  z.object({
    type: z.literal('video'),
    data: MediaContentDataSchema,
  }),
  z.object({
    type: z.literal('audio'),
    data: MediaContentDataSchema,
  }),
  z.object({
    type: z.literal('document'),
    data: DocumentContentDataSchema,
  }),
]);

// Content document validation
export const ContentSchema = BaseDocumentSchema.extend({
  capsuleId: z.string().min(1, 'Capsule ID is required'),
  type: z.enum(['text', 'image', 'video', 'audio', 'document']),
  order: z.number().int().min(0, 'Order must be non-negative'),
  data: ContentDataSchema,
  isProcessed: z.boolean().default(false),
  thumbnailUrl: UrlSchema.optional(),
});

// Content creation input validation
export const CreateContentInputSchema = z.object({
  capsuleId: z.string().min(1, 'Capsule ID is required'),
  type: z.enum(['text', 'image', 'video', 'audio', 'document']),
  order: z.number().int().min(0, 'Order must be non-negative'),
  data: ContentDataSchema,
});

// Content update input validation
export const UpdateContentInputSchema = z.object({
  id: z.string().min(1),
  capsuleId: z.string().min(1).optional(),
  type: z.enum(['text', 'image', 'video', 'audio', 'document']).optional(),
  order: z.number().int().min(0).optional(),
  data: ContentDataSchema.optional(),
});

// Content query filters
export const ContentFiltersSchema = z.object({
  capsuleId: z.string().optional(),
  type: z.enum(['text', 'image', 'video', 'audio', 'document']).optional(),
  isProcessed: z.boolean().optional(),
});

// File upload validation
export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  capsuleId: z.string().min(1),
  order: z.number().int().min(0).optional().default(0),
});

// Text content creation validation
export const CreateTextContentSchema = z.object({
  capsuleId: z.string().min(1),
  text: z.string().min(1, 'Text content is required').max(50000, 'Text content too long'),
  format: z.enum(['plain', 'markdown', 'html']).default('plain'),
  order: z.number().int().min(0).optional().default(0),
});

// Export types
export type ContentValidation = z.infer<typeof ContentSchema>;
export type CreateContentInputValidation = z.infer<typeof CreateContentInputSchema>;
export type UpdateContentInputValidation = z.infer<typeof UpdateContentInputSchema>;
export type ContentDataValidation = z.infer<typeof ContentDataSchema>;
export type ContentMetadataValidation = z.infer<typeof ContentMetadataSchema>;
export type ContentFiltersValidation = z.infer<typeof ContentFiltersSchema>;
export type FileUploadValidation = z.infer<typeof FileUploadSchema>;
export type CreateTextContentValidation = z.infer<typeof CreateTextContentSchema>;
