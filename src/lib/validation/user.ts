import { z } from 'zod';
import { 
  BaseDocumentSchema, 
  EmailSchema, 
  DisplayNameSchema, 
  TimestampSchema,
  UrlSchema 
} from './base';

// User preferences validation
export const UserPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  theme: z.enum(['light', 'dark']).default('light'),
  language: z.string().optional(),
  timezone: z.string().optional(),
});

// User document validation
export const UserSchema = BaseDocumentSchema.extend({
  email: EmailSchema,
  displayName: DisplayNameSchema,
  lastActive: TimestampSchema,
  profilePicture: UrlSchema.optional(),
  preferences: UserPreferencesSchema.optional(),
  isEmailVerified: z.boolean().optional().default(false),
  accountStatus: z.enum(['active', 'suspended', 'deleted']).default('active'),
});

// User creation input validation
export const CreateUserInputSchema = z.object({
  email: EmailSchema,
  displayName: DisplayNameSchema,
  profilePicture: UrlSchema.optional(),
  preferences: UserPreferencesSchema.optional(),
});

// User update input validation
export const UpdateUserInputSchema = z.object({
  id: z.string().min(1),
  displayName: DisplayNameSchema.optional(),
  profilePicture: UrlSchema.optional(),
  preferences: UserPreferencesSchema.optional(),
  accountStatus: z.enum(['active', 'suspended', 'deleted']).optional(),
});

// User preferences update validation
export const UpdateUserPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  theme: z.enum(['light', 'dark']).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
});

// Authentication schemas
export const AuthUserSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email().nullable(),
  displayName: z.string().nullable(),
  photoURL: z.string().url().nullable(),
  emailVerified: z.boolean(),
  isAnonymous: z.boolean(),
});

export const AuthStateSchema = z.object({
  user: AuthUserSchema.nullable(),
  loading: z.boolean(),
  error: z.string().nullable(),
});

// User query filters
export const UserFiltersSchema = z.object({
  accountStatus: z.enum(['active', 'suspended', 'deleted']).optional(),
  emailVerified: z.boolean().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
});

// Export types
export type UserValidation = z.infer<typeof UserSchema>;
export type CreateUserInputValidation = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserInputValidation = z.infer<typeof UpdateUserInputSchema>;
export type UserPreferencesValidation = z.infer<typeof UserPreferencesSchema>;
export type AuthUserValidation = z.infer<typeof AuthUserSchema>;
export type AuthStateValidation = z.infer<typeof AuthStateSchema>;
export type UserFiltersValidation = z.infer<typeof UserFiltersSchema>;
