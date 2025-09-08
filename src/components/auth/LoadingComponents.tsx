'use client';

import { useState, useEffect } from 'react';
import { AuthErrorHandler, LoadingStateManager, RetryManager } from '@/lib/auth/errorHandler';
import type { AuthError, LoadingState } from '@/lib/auth/errorHandler';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', color = '#CB343F', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8'
  };

  return (
    <svg 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingButtonProps {
  loading: boolean;
  loadingText?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function LoadingButton({
  loading,
  loadingText,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  children,
  variant = 'primary'
}: LoadingButtonProps) {
  const isDisabled = loading || disabled;

  const variantClasses = {
    primary: 'text-white hover:opacity-90',
    secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200',
    outline: 'text-gray-700 border border-gray-300 hover:bg-gray-50'
  };

  const backgroundColor = variant === 'primary' ? '#CB343F' : undefined;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${variantClasses[variant]} ${className}`}
      style={{ backgroundColor }}
    >
      {loading && (
        <LoadingSpinner size="sm" className="-ml-1 mr-3" />
      )}
      {loading ? (loadingText || 'Loading...') : children}
    </button>
  );
}

interface ErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryable?: boolean;
  className?: string;
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  retryable = false, 
  className = '' 
}: ErrorDisplayProps) {
  if (!error) return null;

  const authError = AuthErrorHandler.getError(error);
  const canRetry = retryable && authError.retryable;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 font-body">
            {authError.userMessage}
          </h3>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-1 text-xs text-red-600 font-body">
              Error Code: {authError.code}
            </p>
          )}
          <div className="mt-3 flex space-x-3">
            {canRetry && onRetry && (
              <button
                onClick={onRetry}
                className="text-sm font-medium text-red-800 hover:text-red-600 underline"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm font-medium text-red-800 hover:text-red-600 underline"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
  progress?: number;
}

export function LoadingOverlay({ loading, message, progress }: LoadingOverlayProps) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 font-display mb-2">
            {message || 'Loading...'}
          </h3>
          {progress !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface FormLoadingStateProps {
  loading: boolean;
  loadingMessage?: string;
  children: React.ReactNode;
}

export function FormLoadingState({ loading, loadingMessage, children }: FormLoadingStateProps) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md">
          <div className="text-center">
            <LoadingSpinner size="md" className="mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-body">
              {loadingMessage || 'Processing...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for managing loading states
export function useLoadingState(initialState: LoadingState = { isLoading: false }) {
  const [loadingState, setLoadingState] = useState<LoadingState>(initialState);

  const setLoading = (loading: boolean, message?: string, progress?: number) => {
    setLoadingState({
      isLoading: loading,
      loadingMessage: message,
      progress
    });
  };

  const clearLoading = () => {
    setLoadingState({ isLoading: false });
  };

  return {
    ...loadingState,
    setLoading,
    clearLoading
  };
}

// Hook for retry functionality
export function useRetry(operationId: string) {
  const [retryCount, setRetryCount] = useState(0);

  const canRetry = RetryManager.canRetry(operationId);
  const retryDelay = RetryManager.getRetryDelay(operationId);

  const incrementRetry = () => {
    const newCount = RetryManager.incrementRetry(operationId);
    setRetryCount(newCount);
    return newCount;
  };

  const resetRetry = () => {
    RetryManager.resetRetry(operationId);
    setRetryCount(0);
  };

  return {
    retryCount,
    canRetry,
    retryDelay,
    incrementRetry,
    resetRetry
  };
}
