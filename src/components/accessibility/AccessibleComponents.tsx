'use client';

import React, { useRef, useEffect } from 'react';
import { AriaUtils, KeyboardUtils, FocusUtils } from '@/lib/accessibility/ariaUtils';
import { FieldError, CharacterCounter } from '@/components/validation/ValidationComponents';

interface AccessibleFormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'date' | 'time';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  min?: string;
  max?: string;
  rows?: number;
  error?: string | null;
  warning?: string | null;
  helpText?: string;
  className?: string;
  style?: React.CSSProperties;
  'aria-describedby'?: string;
}

export function AccessibleFormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  min,
  max,
  rows = 4,
  error,
  warning,
  helpText,
  className = '',
  style,
  'aria-describedby': ariaDescribedby,
}: AccessibleFormFieldProps) {
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const ids = AriaUtils.generateIds(id);
  
  const hasError = !!error;
  const ariaProps = AriaUtils.getFieldAriaProps(
    ids.fieldId,
    ids.labelId,
    ids.errorId,
    ids.helpId,
    hasError,
    required
  );

  // Enhanced keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key for text inputs (submit form)
    if (type === 'text' || type === 'email') {
      KeyboardUtils.handleEnterKey(e, () => {
        // Move to next field or submit form
        const form = fieldRef.current?.closest('form');
        if (form) {
          const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
          const currentIndex = inputs.indexOf(fieldRef.current!);
          const nextInput = inputs[currentIndex + 1] as HTMLElement;
          
          if (nextInput) {
            nextInput.focus();
          } else {
            // Submit form if this is the last field
            const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitButton && !submitButton.disabled) {
              submitButton.click();
            }
          }
        }
      });
    }

    // Handle Escape key to clear field
    KeyboardUtils.handleEscapeKey(e, () => {
      if (fieldRef.current && value) {
        onChange({ target: { value: '', name: id } } as any);
        FocusUtils.announceToScreenReader('Field cleared');
      }
    });
  };

  const baseClasses = `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm text-gray-900 ${
    hasError 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-red-500'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`;

  const inputProps = {
    ref: fieldRef,
    id: ids.fieldId,
    name: id,
    type: type === 'textarea' ? undefined : type,
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyDown: handleKeyDown,
    placeholder,
    required,
    disabled,
    maxLength,
    min,
    max,
    className: baseClasses,
    style,
    ...ariaProps,
    ...(ariaDescribedby && { 'aria-describedby': ariaDescribedby }),
  };

  return (
    <div>
      <label 
        htmlFor={ids.fieldId}
        id={ids.labelId}
        className="block text-sm font-medium text-gray-700 font-body"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          {...inputProps}
          rows={rows}
        />
      ) : (
        <input {...inputProps} />
      )}

      {helpText && (
        <p 
          id={ids.helpId}
          className="mt-1 text-xs text-gray-500 font-body"
        >
          {helpText}
        </p>
      )}

      {maxLength && (
        <CharacterCounter 
          current={value.length} 
          max={maxLength}
          className="mt-1"
          {...AriaUtils.getCounterAriaProps(value.length, maxLength, label)}
        />
      )}

      <FieldError 
        error={error}
        warning={warning}
        className="mt-1"
        {...AriaUtils.getErrorAriaProps(ids.errorId)}
      />
    </div>
  );
}

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function AccessibleButton({
  loading = false,
  loadingText = 'Loading...',
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  className = '',
  onClick,
  ...props
}: AccessibleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const ariaProps = AriaUtils.getButtonAriaProps(
    typeof children === 'string' ? children : 'Button',
    loading,
    disabled || loading
  );

  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
  
  const variantClasses = {
    primary: "bg-[#CB343F] text-white hover:opacity-90 focus:ring-[#CB343F]",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    KeyboardUtils.handleEnterKey(e, () => {
      if (!disabled && !loading && onClick) {
        onClick(e as any);
      }
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...ariaProps}
      {...props}
    >
      {loading && (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="sr-only">{loadingText}</span>
        </>
      )}
      {children}
    </button>
  );
}

interface AccessibleFileUploadProps {
  id: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[];
  maxFiles?: number;
  maxSize?: number;
  error?: string | null;
  warning?: string | null;
  helpText?: string;
  className?: string;
}

export function AccessibleFileUpload({
  id,
  label,
  accept,
  multiple = true,
  onChange,
  files,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  error,
  warning,
  helpText,
  className = '',
}: AccessibleFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const ids = AriaUtils.generateIds(id);
  
  const hasError = !!error;
  const fileCount = files.length;
  const hasFiles = fileCount > 0;

  const ariaProps = AriaUtils.getFileUploadAriaProps(
    ids.fieldId,
    ids.labelId,
    ids.helpId,
    hasFiles,
    fileCount
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      // Create a synthetic event for the onChange handler
      const syntheticEvent = {
        target: {
          files: droppedFiles,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
      FocusUtils.announceToScreenReader(`${droppedFiles.length} files added`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    KeyboardUtils.handleEnterKey(e, () => {
      fileInputRef.current?.click();
    });
    
    KeyboardUtils.handleEscapeKey(e, () => {
      if (hasFiles) {
        // Clear files
        onChange({ target: { files: [] } } as any);
        FocusUtils.announceToScreenReader('Files cleared');
      }
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <label 
        htmlFor={ids.fieldId}
        id={ids.labelId}
        className="block text-sm font-medium text-gray-700 font-body"
      >
        {label}
      </label>
      
      <div
        ref={dropZoneRef}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CB343F] ${
          hasError 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        {...ariaProps}
      >
        <div className="space-y-1 text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48" 
            aria-hidden="true"
          >
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4V8h-4m-4 0h-4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={ids.fieldId}
              className="relative cursor-pointer bg-white rounded-md font-medium text-[#CB343F] hover:text-[#CB343F] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#CB343F]"
            >
              <span>Upload files</span>
              <input
                ref={fileInputRef}
                id={ids.fieldId}
                name={id}
                type="file"
                className="sr-only"
                multiple={multiple}
                accept={accept}
                onChange={onChange}
                aria-describedby={ids.helpId}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          
          {helpText && (
            <p 
              id={ids.helpId}
              className="text-xs text-gray-500"
            >
              {helpText}
            </p>
          )}
        </div>
      </div>

      {hasFiles && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 font-body mb-2">
            Selected Files ({fileCount})
          </h4>
          <ul className="space-y-2" role="list">
            {files.map((file, index) => (
              <li 
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                role="listitem"
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900 font-body">{file.name}</p>
                    <p className="text-xs text-gray-500 font-body">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = files.filter((_, i) => i !== index);
                    onChange({ target: { files: newFiles } } as any);
                    FocusUtils.announceToScreenReader(`${file.name} removed`);
                  }}
                  className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FieldError 
        error={error}
        warning={warning}
        className="mt-1"
        {...AriaUtils.getErrorAriaProps(ids.errorId)}
      />
    </div>
  );
}
