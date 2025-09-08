import { z } from 'zod';
import { 
  BaseDocumentSchema, 
  TimestampSchema,
  PaginationSchema,
  SearchSchema,
  ValidationErrorSchema,
  ApiErrorSchema 
} from './base';

// API response validation
export const ApiSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
});

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: ApiErrorSchema,
  validationErrors: z.array(ValidationErrorSchema).optional(),
});

export const ApiResponseSchema = z.union([
  ApiSuccessResponseSchema,
  ApiErrorResponseSchema,
]);

// Paginated response validation
export const PaginationMetaSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: PaginationMetaSchema,
});

// Form validation schemas
export const FormFieldSchema = z.object({
  name: z.string().min(1),
  value: z.any(),
  error: z.string().optional(),
  touched: z.boolean(),
  required: z.boolean().optional(),
});

export const FormStateSchema = z.object({
  values: z.record(z.string(), z.any()),
  errors: z.record(z.string(), z.string()).optional(),
  touched: z.record(z.string(), z.boolean()).optional(),
  isSubmitting: z.boolean(),
  isValid: z.boolean(),
});

// UI state validation
export const LoadingStateSchema = z.object({
  isLoading: z.boolean(),
  loadingMessage: z.string().optional(),
});

export const ErrorStateSchema = z.object({
  hasError: z.boolean(),
  error: z.string().nullable(),
  errorCode: z.string().optional(),
});

export const SuccessStateSchema = z.object({
  isSuccess: z.boolean(),
  successMessage: z.string().optional(),
});

// Modal validation
export const ModalStateSchema = z.object({
  isOpen: z.boolean(),
  title: z.string().optional(),
  content: z.any().optional(),
  onClose: z.function().optional(),
  onConfirm: z.function().optional(),
  confirmText: z.string().optional(),
  cancelText: z.string().optional(),
  variant: z.enum(['default', 'danger', 'warning', 'success']).optional(),
});

// Toast notification validation
export const ToastNotificationSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['success', 'error', 'warning', 'info']),
  title: z.string().min(1),
  message: z.string().optional(),
  duration: z.number().int().min(0).optional(),
  action: z.object({
    label: z.string().min(1),
    onClick: z.function(),
  }).optional(),
});

// Theme validation
export const ThemeSchema = z.enum(['light', 'dark', 'system']);

export const ThemeConfigSchema = z.object({
  mode: ThemeSchema,
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    surface: z.string(),
    text: z.string(),
    textSecondary: z.string(),
    border: z.string(),
    error: z.string(),
    warning: z.string(),
    success: z.string(),
    info: z.string(),
  }),
});

// Component prop validation
export const BaseComponentPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any().optional(),
  id: z.string().optional(),
  'data-testid': z.string().optional(),
});

export const ButtonPropsSchema = BaseComponentPropsSchema.extend({
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'danger']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  onClick: z.function().optional(),
  type: z.enum(['button', 'submit', 'reset']).optional(),
});

export const InputPropsSchema = BaseComponentPropsSchema.extend({
  type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url', 'search']).optional(),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  defaultValue: z.string().optional(),
  onChange: z.function().optional(),
  onBlur: z.function().optional(),
  onFocus: z.function().optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  error: z.string().optional(),
  label: z.string().optional(),
  helperText: z.string().optional(),
});

// Notification validation
export const NotificationPreferencesSchema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(false),
  reminderDays: z.array(z.number().int().min(1).max(30)).default([7, 3, 1]),
});

export const NotificationDataSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(['unlock_reminder', 'unlock_ready', 'capsule_opened']),
  capsuleId: z.string().optional(),
  title: z.string().min(1),
  message: z.string().min(1),
  scheduledFor: TimestampSchema.optional(),
  sentAt: TimestampSchema.optional(),
  readAt: TimestampSchema.optional(),
});

// System configuration validation
export const SystemConfigSchema = BaseDocumentSchema.extend({
  maintenanceMode: z.boolean().default(false),
  maxFileSize: z.number().int().min(1).default(100 * 1024 * 1024), // 100MB
  allowedFileTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'audio/mp3', 'application/pdf']),
  maxCapsulesPerUser: z.number().int().min(1).default(50),
  maxContentPerCapsule: z.number().int().min(1).default(100),
  version: z.string().min(1),
});

// Export types
export type ApiResponseValidation = z.infer<typeof ApiResponseSchema>;
export type PaginatedResponseValidation = z.infer<typeof PaginatedResponseSchema>;
export type FormStateValidation = z.infer<typeof FormStateSchema>;
export type LoadingStateValidation = z.infer<typeof LoadingStateSchema>;
export type ErrorStateValidation = z.infer<typeof ErrorStateSchema>;
export type SuccessStateValidation = z.infer<typeof SuccessStateSchema>;
export type ModalStateValidation = z.infer<typeof ModalStateSchema>;
export type ToastNotificationValidation = z.infer<typeof ToastNotificationSchema>;
export type ThemeValidation = z.infer<typeof ThemeSchema>;
export type ThemeConfigValidation = z.infer<typeof ThemeConfigSchema>;
export type ButtonPropsValidation = z.infer<typeof ButtonPropsSchema>;
export type InputPropsValidation = z.infer<typeof InputPropsSchema>;
export type NotificationPreferencesValidation = z.infer<typeof NotificationPreferencesSchema>;
export type NotificationDataValidation = z.infer<typeof NotificationDataSchema>;
export type SystemConfigValidation = z.infer<typeof SystemConfigSchema>;
