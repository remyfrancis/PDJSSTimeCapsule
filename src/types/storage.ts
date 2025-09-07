// Firebase Storage types and utilities
export interface StoragePath {
  bucket: string;
  path: string;
  fullPath: string;
}

// Storage file upload options
export interface UploadOptions {
  contentType?: string;
  customMetadata?: Record<string, string>;
  cacheControl?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  contentLanguage?: string;
}

// Storage file upload progress
export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
}

// Storage file download options
export interface DownloadOptions {
  expires?: number; // URL expiration time in seconds
}

// File validation rules
export interface FileValidationRules {
  maxSize: number; // in bytes
  allowedTypes: string[];
  allowedExtensions: string[];
}

// Storage error types
export interface StorageUploadError {
  code: string;
  message: string;
  serverResponse?: any;
  customData?: any;
}

// Storage file reference types
export type StorageFileType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface StorageFileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  webkitRelativePath?: string;
}

// Storage path builders
export class StoragePaths {
  static userProfile(userId: string, filename: string): string {
    return `users/${userId}/profile/${filename}`;
  }

  static userTemp(userId: string, filename: string): string {
    return `users/${userId}/temp/${filename}`;
  }

  static capsuleImage(capsuleId: string, filename: string): string {
    return `capsules/${capsuleId}/images/${filename}`;
  }

  static capsuleVideo(capsuleId: string, filename: string): string {
    return `capsules/${capsuleId}/videos/${filename}`;
  }

  static capsuleAudio(capsuleId: string, filename: string): string {
    return `capsules/${capsuleId}/audio/${filename}`;
  }

  static capsuleDocument(capsuleId: string, filename: string): string {
    return `capsules/${capsuleId}/documents/${filename}`;
  }

  static publicAsset(path: string): string {
    return `public/assets/${path}`;
  }

  static adminFile(path: string): string {
    return `admin/${path}`;
  }
}

// File type detection utilities
export class FileTypeDetector {
  static getFileType(mimeType: string): StorageFileType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
    return 'other';
  }

  static isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  static isVideoFile(mimeType: string): boolean {
    return mimeType.startsWith('video/');
  }

  static isAudioFile(mimeType: string): boolean {
    return mimeType.startsWith('audio/');
  }

  static isDocumentFile(mimeType: string): boolean {
    return mimeType.includes('pdf') || 
           mimeType.includes('document') || 
           mimeType.includes('text') ||
           mimeType.includes('application/msword') ||
           mimeType.includes('application/vnd.openxmlformats-officedocument');
  }

  static getAllowedImageTypes(): string[] {
    return [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];
  }

  static getAllowedVideoTypes(): string[] {
    return [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/mov',
      'video/wmv'
    ];
  }

  static getAllowedAudioTypes(): string[] {
    return [
      'audio/mp3',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/m4a',
      'audio/aac'
    ];
  }

  static getAllowedDocumentTypes(): string[] {
    return [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
  }
}

// File size constants
export const FILE_SIZE_LIMITS = {
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  VIDEO_MAX_SIZE: 500 * 1024 * 1024, // 500MB
  AUDIO_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  DOCUMENT_MAX_SIZE: 25 * 1024 * 1024, // 25MB
  TOTAL_CAPSULE_SIZE: 500 * 1024 * 1024, // 500MB per capsule
} as const;

// Storage validation utilities
export class StorageValidator {
  static validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  static validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!this.validateFileType(file, FileTypeDetector.getAllowedImageTypes())) {
      return { valid: false, error: 'Invalid image file type' };
    }
    if (!this.validateFileSize(file, FILE_SIZE_LIMITS.IMAGE_MAX_SIZE)) {
      return { valid: false, error: 'Image file too large' };
    }
    return { valid: true };
  }

  static validateVideoFile(file: File): { valid: boolean; error?: string } {
    if (!this.validateFileType(file, FileTypeDetector.getAllowedVideoTypes())) {
      return { valid: false, error: 'Invalid video file type' };
    }
    if (!this.validateFileSize(file, FILE_SIZE_LIMITS.VIDEO_MAX_SIZE)) {
      return { valid: false, error: 'Video file too large' };
    }
    return { valid: true };
  }

  static validateAudioFile(file: File): { valid: boolean; error?: string } {
    if (!this.validateFileType(file, FileTypeDetector.getAllowedAudioTypes())) {
      return { valid: false, error: 'Invalid audio file type' };
    }
    if (!this.validateFileSize(file, FILE_SIZE_LIMITS.AUDIO_MAX_SIZE)) {
      return { valid: false, error: 'Audio file too large' };
    }
    return { valid: true };
  }

  static validateDocumentFile(file: File): { valid: boolean; error?: string } {
    if (!this.validateFileType(file, FileTypeDetector.getAllowedDocumentTypes())) {
      return { valid: false, error: 'Invalid document file type' };
    }
    if (!this.validateFileSize(file, FILE_SIZE_LIMITS.DOCUMENT_MAX_SIZE)) {
      return { valid: false, error: 'Document file too large' };
    }
    return { valid: true };
  }
}
