import { z } from 'zod';
import { 
  BaseDocumentSchema, 
  TitleSchema, 
  DescriptionSchema, 
  TagSchema, 
  TimestampSchema,
  UrlSchema,
  FutureDateSchema 
} from './base';

// Capsule settings validation
export const CapsuleSettingsSchema = z.object({
  allowSharing: z.boolean().default(true),
  notificationEnabled: z.boolean().default(true),
  isPublic: z.boolean().optional().default(false),
});

// Capsule document validation
export const CapsuleSchema = BaseDocumentSchema.extend({
  title: TitleSchema,
  description: DescriptionSchema,
  userId: z.string().min(1, 'User ID is required'),
  unlockDate: TimestampSchema,
  isSealed: z.boolean().default(false),
  isOpened: z.boolean().default(false),
  tags: z.array(TagSchema).max(10, 'Maximum 10 tags allowed'),
  contentCount: z.number().int().min(0, 'Content count cannot be negative').default(0),
  coverImage: UrlSchema.optional(),
  settings: CapsuleSettingsSchema.optional(),
});

// Capsule creation input validation
export const CreateCapsuleInputSchema = z.object({
  title: TitleSchema,
  description: DescriptionSchema,
  unlockDate: FutureDateSchema,
  tags: z.array(TagSchema).max(10, 'Maximum 10 tags allowed').default([]),
  settings: CapsuleSettingsSchema.optional(),
});

// Capsule update input validation
export const UpdateCapsuleInputSchema = z.object({
  id: z.string().min(1),
  title: TitleSchema.optional(),
  description: DescriptionSchema.optional(),
  unlockDate: FutureDateSchema.optional(),
  tags: z.array(TagSchema).max(10, 'Maximum 10 tags allowed').optional(),
  settings: CapsuleSettingsSchema.optional(),
});

// Capsule seal validation
export const SealCapsuleSchema = z.object({
  id: z.string().min(1),
  isSealed: z.boolean(),
});

// Capsule open validation
export const OpenCapsuleSchema = z.object({
  id: z.string().min(1),
  isOpened: z.boolean(),
});

// Capsule query filters
export const CapsuleFiltersSchema = z.object({
  userId: z.string().optional(),
  isSealed: z.boolean().optional(),
  isOpened: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
});

// Capsule search filters
export const CapsuleSearchFiltersSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  tags: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  isSealed: z.boolean().optional(),
  isOpened: z.boolean().optional(),
});

// Capsule analytics validation
export const CapsuleAnalyticsSchema = z.object({
  capsuleId: z.string().min(1),
  viewCount: z.number().int().min(0).default(0),
  shareCount: z.number().int().min(0).default(0),
  openCount: z.number().int().min(0).default(0),
  lastViewed: TimestampSchema.optional(),
  averageViewDuration: z.number().min(0).optional(),
});

// Export types
export type CapsuleValidation = z.infer<typeof CapsuleSchema>;
export type CreateCapsuleInputValidation = z.infer<typeof CreateCapsuleInputSchema>;
export type UpdateCapsuleInputValidation = z.infer<typeof UpdateCapsuleInputSchema>;
export type CapsuleSettingsValidation = z.infer<typeof CapsuleSettingsSchema>;
export type CapsuleFiltersValidation = z.infer<typeof CapsuleFiltersSchema>;
export type CapsuleSearchFiltersValidation = z.infer<typeof CapsuleSearchFiltersSchema>;
export type CapsuleAnalyticsValidation = z.infer<typeof CapsuleAnalyticsSchema>;
