import { z } from 'zod';
import { 
  BaseDocumentSchema, 
  DisplayNameSchema, 
  TimestampSchema,
  UrlSchema 
} from './base';

// File validation schema
export const FileSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  size: z.number().int().min(1),
  url: UrlSchema.optional(),
  uploadedAt: TimestampSchema.optional(),
});

// Capsule content validation
export const CapsuleContentSchema = z.object({
  text: z.string().max(2000).optional(),
  files: z.array(FileSchema).max(10).optional(),
  mediaUrls: z.array(UrlSchema).max(20).optional(),
});

// Capsule privacy settings
export const CapsulePrivacySchema = z.object({
  isPrivate: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  allowShares: z.boolean().default(true),
  visibility: z.enum(['private', 'friends', 'public']).default('private'),
});

// Capsule notification settings
export const CapsuleNotificationSchema = z.object({
  reminderDays: z.array(z.number().int().min(1).max(30)).default([7, 3, 1]),
  emailReminders: z.boolean().default(true),
  pushReminders: z.boolean().default(false),
});

// Main capsule document validation
export const CapsuleSchema = BaseDocumentSchema.extend({
  title: DisplayNameSchema.max(100),
  description: z.string().min(10).max(500),
  content: CapsuleContentSchema,
  unlockDate: TimestampSchema,
  isUnlocked: z.boolean().default(false),
  unlockedAt: TimestampSchema.optional(),
  privacy: CapsulePrivacySchema,
  notifications: CapsuleNotificationSchema,
  tags: z.array(z.string().max(20)).max(10).optional(),
  views: z.number().int().min(0).default(0),
  likes: z.number().int().min(0).default(0),
  comments: z.number().int().min(0).default(0),
  shares: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'active', 'unlocked', 'archived']).default('draft'),
});

// Capsule creation input validation
export const CreateCapsuleInputSchema = z.object({
  title: DisplayNameSchema.max(100),
  description: z.string().min(10).max(500),
  content: CapsuleContentSchema,
  unlockDate: z.string().refine((date) => {
    const unlockDate = new Date(date);
    const now = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 20);
    
    return unlockDate > now && unlockDate <= maxDate;
  }, {
    message: "Unlock date must be between 1 day and 20 years in the future"
  }),
  unlockTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format"
  }),
  privacy: CapsulePrivacySchema.optional(),
  notifications: CapsuleNotificationSchema.optional(),
  tags: z.string().optional().transform((val) => 
    val ? val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []
  ),
});

// Capsule update input validation
export const UpdateCapsuleInputSchema = z.object({
  id: z.string().min(1),
  title: DisplayNameSchema.max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  content: CapsuleContentSchema.optional(),
  privacy: CapsulePrivacySchema.optional(),
  notifications: CapsuleNotificationSchema.optional(),
  tags: z.array(z.string().max(20)).max(10).optional(),
  status: z.enum(['draft', 'active', 'unlocked', 'archived']).optional(),
});

// Capsule query filters
export const CapsuleFiltersSchema = z.object({
  status: z.enum(['draft', 'active', 'unlocked', 'archived']).optional(),
  isPrivate: z.boolean().optional(),
  isUnlocked: z.boolean().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
});

// Capsule comment validation
export const CapsuleCommentSchema = BaseDocumentSchema.extend({
  capsuleId: z.string().min(1),
  userId: z.string().min(1),
  content: z.string().min(1).max(500),
  parentId: z.string().optional(), // For replies
  likes: z.number().int().min(0).default(0),
  isEdited: z.boolean().default(false),
  editedAt: TimestampSchema.optional(),
});

// Capsule like validation
export const CapsuleLikeSchema = BaseDocumentSchema.extend({
  capsuleId: z.string().min(1),
  userId: z.string().min(1),
  type: z.enum(['like', 'love', 'laugh', 'wow', 'sad', 'angry']).default('like'),
});

// Export types
export type CapsuleValidation = z.infer<typeof CapsuleSchema>;
export type CreateCapsuleInputValidation = z.infer<typeof CreateCapsuleInputSchema>;
export type UpdateCapsuleInputValidation = z.infer<typeof UpdateCapsuleInputSchema>;
export type CapsuleContentValidation = z.infer<typeof CapsuleContentSchema>;
export type CapsulePrivacyValidation = z.infer<typeof CapsulePrivacySchema>;
export type CapsuleNotificationValidation = z.infer<typeof CapsuleNotificationSchema>;
export type CapsuleFiltersValidation = z.infer<typeof CapsuleFiltersSchema>;
export type CapsuleCommentValidation = z.infer<typeof CapsuleCommentSchema>;
export type CapsuleLikeValidation = z.infer<typeof CapsuleLikeSchema>;
export type FileValidation = z.infer<typeof FileSchema>;