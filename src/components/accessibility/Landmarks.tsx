'use client';

import React from 'react';
import Link from 'next/link';
import { AriaUtils } from '@/lib/accessibility/ariaUtils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  const ariaProps = AriaUtils.getSkipLinkAriaProps(href);
  
  return (
    <Link
      href={href}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#CB343F] text-white px-4 py-2 rounded-md font-medium z-50 ${className}`}
      {...ariaProps}
    >
      {children}
    </Link>
  );
}

interface LandmarkProps {
  children: React.ReactNode;
  type: 'main' | 'navigation' | 'form' | 'complementary' | 'banner' | 'contentinfo';
  label?: string;
  className?: string;
}

export function Landmark({ children, type, label, className = '' }: LandmarkProps) {
  const ariaProps = AriaUtils.getLandmarkAriaProps(type, label);
  
  return (
    <div
      className={className}
      {...ariaProps}
    >
      {children}
    </div>
  );
}

interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function AccessibleHeading({ level, children, className = '', id }: AccessibleHeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <HeadingTag
      id={id}
      className={className}
      tabIndex={-1}
    >
      {children}
    </HeadingTag>
  );
}

interface AccessibleFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  'aria-label'?: string;
}

export function AccessibleForm({ children, onSubmit, className = '', 'aria-label': ariaLabel }: AccessibleFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl+Enter for form submission
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={handleKeyDown}
      className={className}
      role="form"
      aria-label={ariaLabel}
      noValidate
    >
      {children}
    </form>
  );
}

interface AccessibleSectionProps {
  children: React.ReactNode;
  heading: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  expanded?: boolean;
  collapsible?: boolean;
}

export function AccessibleSection({ 
  children, 
  heading, 
  headingLevel = 2, 
  className = '', 
  expanded = true,
  collapsible = false 
}: AccessibleSectionProps) {
  const sectionId = `section-${Math.random().toString(36).substr(2, 9)}`;
  const headingId = `heading-${sectionId}`;
  
  const ariaProps = AriaUtils.getSectionAriaProps(sectionId, headingId, expanded);
  
  return (
    <section
      id={sectionId}
      className={className}
      {...ariaProps}
    >
      <AccessibleHeading 
        level={headingLevel}
        id={headingId}
        className="text-lg font-semibold text-gray-900 font-display"
      >
        {heading}
      </AccessibleHeading>
      {expanded && children}
    </section>
  );
}

interface AccessibleCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
  helpText?: string;
  className?: string;
}

export function AccessibleCheckbox({
  id,
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
  error,
  helpText,
  className = '',
}: AccessibleCheckboxProps) {
  const checkboxRef = React.useRef<HTMLInputElement>(null);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={checkboxRef}
          id={ids.fieldId}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          onKeyDown={handleKeyDown}
          required={required}
          disabled={disabled}
          className={`h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-offset-2 ${
            hasError ? 'border-red-300' : ''
          }`}
          style={{accentColor: '#CB343F', '--tw-ring-color': '#CB343F'} as React.CSSProperties}
          {...ariaProps}
        />
      </div>
      <div className="ml-3 text-sm">
        <label 
          htmlFor={ids.fieldId}
          id={ids.labelId}
          className="font-medium text-gray-700 font-body cursor-pointer"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
        {helpText && (
          <p 
            id={ids.helpId}
            className="text-gray-500 font-body mt-1"
          >
            {helpText}
          </p>
        )}
        {error && (
          <p 
            id={ids.errorId}
            className="text-sm text-red-600 font-body mt-1"
            {...AriaUtils.getErrorAriaProps(ids.errorId)}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

interface AccessibleProgressProps {
  value: number;
  max: number;
  label: string;
  className?: string;
}

export function AccessibleProgress({ value, max, label, className = '' }: AccessibleProgressProps) {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={className}>
      <div className="flex justify-between text-sm font-medium text-gray-700 font-body mb-1">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#CB343F] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${percentage}% complete`}
        />
      </div>
    </div>
  );
}

// Screen reader only utility class
export const srOnly = 'sr-only';

// Focus visible utility for better keyboard navigation
export const focusVisible = 'focus-visible:ring-2 focus-visible:ring-[#CB343F] focus-visible:ring-offset-2';
