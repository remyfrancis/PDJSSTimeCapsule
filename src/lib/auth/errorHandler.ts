// Enhanced error handling utilities for authentication
export interface AuthError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  category: 'network' | 'validation' | 'auth' | 'firebase' | 'unknown';
}

export class AuthErrorHandler {
  private static errorMap: Record<string, AuthError> = {
    // Network errors
    'auth/network-request-failed': {
      code: 'auth/network-request-failed',
      message: 'Network request failed',
      userMessage: 'Please check your internet connection and try again.',
      retryable: true,
      category: 'network'
    },
    'auth/timeout': {
      code: 'auth/timeout',
      message: 'Request timeout',
      userMessage: 'The request took too long. Please try again.',
      retryable: true,
      category: 'network'
    },

    // Authentication errors
    'auth/user-not-found': {
      code: 'auth/user-not-found',
      message: 'User not found',
      userMessage: 'No account found with this email address.',
      retryable: false,
      category: 'auth'
    },
    'auth/wrong-password': {
      code: 'auth/wrong-password',
      message: 'Wrong password',
      userMessage: 'Incorrect password. Please try again.',
      retryable: false,
      category: 'auth'
    },
    'auth/invalid-email': {
      code: 'auth/invalid-email',
      message: 'Invalid email',
      userMessage: 'Please enter a valid email address.',
      retryable: false,
      category: 'validation'
    },
    'auth/user-disabled': {
      code: 'auth/user-disabled',
      message: 'User disabled',
      userMessage: 'This account has been disabled. Please contact support.',
      retryable: false,
      category: 'auth'
    },
    'auth/email-already-in-use': {
      code: 'auth/email-already-in-use',
      message: 'Email already in use',
      userMessage: 'An account with this email already exists.',
      retryable: false,
      category: 'auth'
    },
    'auth/weak-password': {
      code: 'auth/weak-password',
      message: 'Weak password',
      userMessage: 'Password should be at least 6 characters long.',
      retryable: false,
      category: 'validation'
    },
    'auth/operation-not-allowed': {
      code: 'auth/operation-not-allowed',
      message: 'Operation not allowed',
      userMessage: 'Email/password accounts are not enabled.',
      retryable: false,
      category: 'firebase'
    },

    // Configuration errors
    'auth/configuration-not-found': {
      code: 'auth/configuration-not-found',
      message: 'Configuration not found',
      userMessage: 'Firebase configuration error. Please refresh the page or contact support.',
      retryable: true,
      category: 'firebase'
    },
    'auth/invalid-api-key': {
      code: 'auth/invalid-api-key',
      message: 'Invalid API key',
      userMessage: 'Configuration error. Please refresh the page.',
      retryable: true,
      category: 'firebase'
    },

    // Rate limiting
    'auth/too-many-requests': {
      code: 'auth/too-many-requests',
      message: 'Too many requests',
      userMessage: 'Too many attempts. Please wait a moment before trying again.',
      retryable: true,
      category: 'auth'
    },

    // Popup errors
    'auth/popup-closed-by-user': {
      code: 'auth/popup-closed-by-user',
      message: 'Popup closed by user',
      userMessage: 'Sign-in popup was closed. Please try again.',
      retryable: false,
      category: 'auth'
    },
    'auth/popup-blocked': {
      code: 'auth/popup-blocked',
      message: 'Popup blocked',
      userMessage: 'Popup was blocked by your browser. Please allow popups and try again.',
      retryable: false,
      category: 'auth'
    },
    'auth/cancelled-popup-request': {
      code: 'auth/cancelled-popup-request',
      message: 'Popup request cancelled',
      userMessage: 'Sign-in was cancelled. Please try again.',
      retryable: false,
      category: 'auth'
    }
  };

  static getError(errorCode: string, fallbackMessage?: string): AuthError {
    const mappedError = this.errorMap[errorCode];
    
    if (mappedError) {
      return mappedError;
    }

    // Handle unknown errors
    return {
      code: errorCode,
      message: fallbackMessage || 'Unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again.',
      retryable: true,
      category: 'unknown'
    };
  }

  static isRetryableError(errorCode: string): boolean {
    const error = this.getError(errorCode);
    return error.retryable;
  }

  static getErrorCategory(errorCode: string): AuthError['category'] {
    const error = this.getError(errorCode);
    return error.category;
  }

  static getRetryDelay(errorCode: string): number {
    const category = this.getErrorCategory(errorCode);
    
    switch (category) {
      case 'network':
        return 2000; // 2 seconds
      case 'auth':
        return 1000; // 1 second
      case 'firebase':
        return 3000; // 3 seconds
      default:
        return 1500; // 1.5 seconds
    }
  }
}

// Loading state management
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;
}

export class LoadingStateManager {
  private static loadingStates = new Map<string, LoadingState>();

  static setLoading(key: string, loading: boolean, message?: string, progress?: number): void {
    this.loadingStates.set(key, {
      isLoading: loading,
      loadingMessage: message,
      progress
    });
  }

  static getLoading(key: string): LoadingState {
    return this.loadingStates.get(key) || { isLoading: false };
  }

  static clearLoading(key: string): void {
    this.loadingStates.delete(key);
  }

  static isAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(state => state.isLoading);
  }
}

// Retry mechanism
export class RetryManager {
  private static retryAttempts = new Map<string, number>();
  private static readonly MAX_RETRIES = 3;

  static canRetry(operationId: string): boolean {
    const attempts = this.retryAttempts.get(operationId) || 0;
    return attempts < this.MAX_RETRIES;
  }

  static incrementRetry(operationId: string): number {
    const attempts = this.retryAttempts.get(operationId) || 0;
    const newAttempts = attempts + 1;
    this.retryAttempts.set(operationId, newAttempts);
    return newAttempts;
  }

  static resetRetry(operationId: string): void {
    this.retryAttempts.delete(operationId);
  }

  static getRetryDelay(operationId: string): number {
    const attempts = this.retryAttempts.get(operationId) || 0;
    return Math.min(1000 * Math.pow(2, attempts), 10000); // Exponential backoff, max 10s
  }
}
