// ARIA utilities for enhanced accessibility

export interface AriaProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'role'?: string;
}

export interface FieldAriaProps extends AriaProps {
  'aria-required': boolean;
  'aria-invalid': boolean;
  'aria-describedby': string;
}

export class AriaUtils {
  /**
   * Generate ARIA props for form fields
   */
  static getFieldAriaProps(
    fieldId: string,
    labelId: string,
    errorId: string,
    helpId: string,
    hasError: boolean,
    isRequired: boolean = false
  ): FieldAriaProps {
    const describedBy = [errorId, helpId].filter(Boolean).join(' ');
    
    return {
      'aria-required': isRequired,
      'aria-invalid': hasError,
      'aria-describedby': describedBy || undefined,
      'aria-labelledby': labelId,
    };
  }

  /**
   * Generate ARIA props for buttons
   */
  static getButtonAriaProps(
    label: string,
    loading: boolean = false,
    disabled: boolean = false
  ): AriaProps {
    return {
      'aria-label': loading ? `${label} (loading)` : label,
      'aria-disabled': disabled,
      'aria-busy': loading,
    };
  }

  /**
   * Generate ARIA props for error messages
   */
  static getErrorAriaProps(errorId: string): AriaProps {
    return {
      'aria-live': 'polite',
      'aria-atomic': true,
      id: errorId,
    };
  }

  /**
   * Generate ARIA props for form sections
   */
  static getSectionAriaProps(
    sectionId: string,
    headingId: string,
    isExpanded: boolean = true
  ): AriaProps {
    return {
      'aria-labelledby': headingId,
      'aria-expanded': isExpanded,
      role: 'region',
    };
  }

  /**
   * Generate ARIA props for file upload areas
   */
  static getFileUploadAriaProps(
    uploadId: string,
    labelId: string,
    helpId: string,
    hasFiles: boolean,
    fileCount: number
  ): AriaProps {
    const describedBy = helpId;
    const ariaLabel = hasFiles 
      ? `${fileCount} file${fileCount > 1 ? 's' : ''} selected. Click to change files.`
      : 'Click to select files or drag and drop files here';

    return {
      'aria-label': ariaLabel,
      'aria-labelledby': labelId,
      'aria-describedby': describedBy,
      'aria-invalid': false,
    };
  }

  /**
   * Generate ARIA props for validation indicators
   */
  static getValidationAriaProps(
    isValid: boolean,
    hasErrors: boolean,
    hasWarnings: boolean
  ): AriaProps {
    let ariaLabel = 'Form validation status: ';
    
    if (hasErrors) {
      ariaLabel += 'Form has errors that must be fixed';
    } else if (hasWarnings) {
      ariaLabel += 'Form has warnings';
    } else if (isValid) {
      ariaLabel += 'Form is valid and ready to submit';
    } else {
      ariaLabel += 'Form validation in progress';
    }

    return {
      'aria-live': 'polite',
      'aria-label': ariaLabel,
    };
  }

  /**
   * Generate ARIA props for character counters
   */
  static getCounterAriaProps(
    current: number,
    max: number,
    fieldName: string
  ): AriaProps {
    const percentage = Math.round((current / max) * 100);
    const ariaLabel = `${fieldName}: ${current} of ${max} characters used (${percentage}%)`;
    
    return {
      'aria-label': ariaLabel,
      'aria-live': 'polite',
    };
  }

  /**
   * Generate ARIA props for loading states
   */
  static getLoadingAriaProps(
    loadingMessage: string,
    progress?: number
  ): AriaProps {
    const ariaLabel = progress 
      ? `${loadingMessage} (${progress}% complete)`
      : loadingMessage;

    return {
      'aria-live': 'assertive',
      'aria-label': ariaLabel,
      'aria-busy': true,
    };
  }

  /**
   * Generate unique IDs for ARIA relationships
   */
  static generateIds(prefix: string): {
    fieldId: string;
    labelId: string;
    errorId: string;
    helpId: string;
  } {
    const baseId = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      fieldId: `${baseId}-field`,
      labelId: `${baseId}-label`,
      errorId: `${baseId}-error`,
      helpId: `${baseId}-help`,
    };
  }

  /**
   * Generate ARIA props for skip links
   */
  static getSkipLinkAriaProps(targetId: string): AriaProps {
    return {
      'aria-label': `Skip to ${targetId}`,
      role: 'link',
    };
  }

  /**
   * Generate ARIA props for landmarks
   */
  static getLandmarkAriaProps(
    landmarkType: 'main' | 'navigation' | 'form' | 'complementary',
    label?: string
  ): AriaProps {
    const props: AriaProps = {
      role: landmarkType,
    };

    if (label) {
      props['aria-label'] = label;
    }

    return props;
  }
}

// Keyboard navigation utilities
export class KeyboardUtils {
  /**
   * Handle Enter key for form submission
   */
  static handleEnterKey(
    event: React.KeyboardEvent,
    callback: () => void,
    preventDefault: boolean = true
  ) {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (preventDefault) {
        event.preventDefault();
      }
      callback();
    }
  }

  /**
   * Handle Escape key for closing/canceling
   */
  static handleEscapeKey(
    event: React.KeyboardEvent,
    callback: () => void
  ) {
    if (event.key === 'Escape') {
      event.preventDefault();
      callback();
    }
  }

  /**
   * Handle Tab key for focus management
   */
  static handleTabKey(
    event: React.KeyboardEvent,
    onTabForward?: () => void,
    onTabBackward?: () => void
  ) {
    if (event.key === 'Tab') {
      if (event.shiftKey && onTabBackward) {
        onTabBackward();
      } else if (!event.shiftKey && onTabForward) {
        onTabForward();
      }
    }
  }

  /**
   * Handle Arrow keys for navigation
   */
  static handleArrowKeys(
    event: React.KeyboardEvent,
    onUp?: () => void,
    onDown?: () => void,
    onLeft?: () => void,
    onRight?: () => void
  ) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onRight?.();
        break;
    }
  }

  /**
   * Check if a key is a printable character
   */
  static isPrintableKey(key: string): boolean {
    return key.length === 1 && /[a-zA-Z0-9\s]/.test(key);
  }

  /**
   * Get keyboard shortcut description
   */
  static getShortcutDescription(key: string, modifiers: string[] = []): string {
    const modifierText = modifiers.length > 0 ? `${modifiers.join('+')}+` : '';
    return `${modifierText}${key}`;
  }
}

// Focus management utilities
export class FocusUtils {
  /**
   * Focus the first focusable element in a container
   */
  static focusFirst(container: HTMLElement): boolean {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
      return true;
    }
    
    return false;
  }

  /**
   * Focus the last focusable element in a container
   */
  static focusLast(container: HTMLElement): boolean {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      lastElement.focus();
      return true;
    }
    
    return false;
  }

  /**
   * Trap focus within a container
   */
  static trapFocus(container: HTMLElement, event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Announce text to screen readers
   */
  static announceToScreenReader(text: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = text;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}
