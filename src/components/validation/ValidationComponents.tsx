'use client';

import { FormFieldError } from '@/lib/validation/formValidator';

interface FieldErrorProps {
  error?: string | null;
  warning?: string | null;
  className?: string;
}

export function FieldError({ error, warning, className = '' }: FieldErrorProps) {
  if (!error && !warning) return null;

  return (
    <div className={`mt-1 ${className}`}>
      {error && (
        <p className="text-sm text-red-600 font-body flex items-center">
          <svg className="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {warning && (
        <p className="text-sm text-yellow-600 font-body flex items-center">
          <svg className="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {warning}
        </p>
      )}
    </div>
  );
}

interface FormErrorSummaryProps {
  errors: FormFieldError[];
  warnings: FormFieldError[];
  className?: string;
}

export function FormErrorSummary({ errors, warnings, className = '' }: FormErrorSummaryProps) {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 font-body">
            Please fix the following issues:
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="font-body">{error.message}</li>
              ))}
            </ul>
          </div>
          {warnings.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-yellow-800 font-body">Warnings:</h4>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-700 font-body">{warning.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ValidationIndicatorProps {
  isValid: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  className?: string;
}

export function ValidationIndicator({ isValid, hasErrors, hasWarnings, className = '' }: ValidationIndicatorProps) {
  if (!hasErrors && !hasWarnings) return null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {hasErrors && (
        <div className="flex items-center text-red-600">
          <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-body">Form has errors</span>
        </div>
      )}
      {hasWarnings && !hasErrors && (
        <div className="flex items-center text-yellow-600">
          <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-body">Form has warnings</span>
        </div>
      )}
      {isValid && (
        <div className="flex items-center text-green-600">
          <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-body">Form is valid</span>
        </div>
      )}
    </div>
  );
}

interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export function CharacterCounter({ current, max, className = '' }: CharacterCounterProps) {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className={`mt-1 ${className}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-body ${
          isAtLimit ? 'text-red-500' : 
          isNearLimit ? 'text-yellow-600' : 
          'text-gray-500'
        }`}>
          {current}/{max} characters
        </span>
        {isNearLimit && (
          <div className="w-16 bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                isAtLimit ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
