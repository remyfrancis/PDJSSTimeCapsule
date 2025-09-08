import React from 'react';
import { CreateCapsuleInputSchema } from '@/lib/validation';
import type { CreateCapsuleInputValidation } from '@/lib/validation';

export interface FormFieldError {
  field: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export interface FormValidationState {
  isValid: boolean;
  errors: FormFieldError[];
  warnings: FormFieldError[];
  touched: Record<string, boolean>;
}

export class CapsuleFormValidator {
  private static validateField(fieldName: string, value: any, allValues: any): FormFieldError | null {
    switch (fieldName) {
      case 'title':
        if (!value || value.trim().length === 0) {
          return { field: 'title', message: 'Capsule title is required', type: 'error' };
        }
        if (value.length < 3) {
          return { field: 'title', message: 'Title must be at least 3 characters long', type: 'error' };
        }
        if (value.length > 100) {
          return { field: 'title', message: 'Title cannot exceed 100 characters', type: 'error' };
        }
        break;

      case 'description':
        if (!value || value.trim().length === 0) {
          return { field: 'description', message: 'Description is required', type: 'error' };
        }
        if (value.length < 10) {
          return { field: 'description', message: 'Description must be at least 10 characters long', type: 'error' };
        }
        if (value.length > 500) {
          return { field: 'description', message: 'Description cannot exceed 500 characters', type: 'error' };
        }
        break;

      case 'unlockDate':
        if (!value) {
          return { field: 'unlockDate', message: 'Unlock date is required', type: 'error' };
        }
        const unlockDate = new Date(`${value}T${allValues.unlockTime || '00:00'}`);
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 20);

        if (unlockDate <= now) {
          return { field: 'unlockDate', message: 'Unlock date must be in the future', type: 'error' };
        }
        if (unlockDate < tomorrow) {
          return { field: 'unlockDate', message: 'Unlock date must be at least 1 day in the future', type: 'error' };
        }
        if (unlockDate > maxDate) {
          return { field: 'unlockDate', message: 'Unlock date cannot be more than 20 years in the future', type: 'error' };
        }
        break;

      case 'unlockTime':
        if (!value) {
          return { field: 'unlockTime', message: 'Unlock time is required', type: 'error' };
        }
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(value)) {
          return { field: 'unlockTime', message: 'Please enter a valid time (HH:MM)', type: 'error' };
        }
        break;

      case 'content.text':
        if (value && value.length > 2000) {
          return { field: 'content.text', message: 'Text content cannot exceed 2000 characters', type: 'error' };
        }
        break;

      case 'content.files':
        if (value && value.length > 10) {
          return { field: 'content.files', message: 'You can upload a maximum of 10 files', type: 'error' };
        }
        // Check individual file sizes
        for (let i = 0; i < value.length; i++) {
          const file = value[i];
          if (file.size > 10 * 1024 * 1024) { // 10MB
            return { field: 'content.files', message: `File "${file.name}" is too large (max 10MB)`, type: 'error' };
          }
        }
        break;

      case 'tags':
        if (value) {
          const tags = value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
          if (tags.length > 10) {
            return { field: 'tags', message: 'You can add a maximum of 10 tags', type: 'warning' };
          }
          for (const tag of tags) {
            if (tag.length > 20) {
              return { field: 'tags', message: 'Each tag cannot exceed 20 characters', type: 'warning' };
            }
          }
        }
        break;
    }

    return null;
  }

  static validateForm(formData: any): FormValidationState {
    const errors: FormFieldError[] = [];
    const warnings: FormFieldError[] = [];
    const touched: Record<string, boolean> = {};

    // Validate each field
    const fieldsToValidate = [
      'title', 'description', 'unlockDate', 'unlockTime', 
      'content.text', 'content.files', 'tags'
    ];

    fieldsToValidate.forEach(field => {
      const value = this.getNestedValue(formData, field);
      const error = this.validateField(field, value, formData);
      
      if (error) {
        if (error.type === 'error') {
          errors.push(error);
        } else {
          warnings.push(error);
        }
      }
      
      // Mark field as touched if it has a value
      if (value !== undefined && value !== null && value !== '') {
        touched[field] = true;
      }
    });

    // Additional cross-field validation
    if (formData.unlockDate && formData.unlockTime) {
      const unlockDateTime = new Date(`${formData.unlockDate}T${formData.unlockTime}`);
      const now = new Date();
      
      if (unlockDateTime <= now) {
        errors.push({
          field: 'unlockDate',
          message: 'The selected date and time must be in the future',
          type: 'error'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      touched
    };
  }

  static validateFieldRealTime(fieldName: string, value: any, allValues: any): FormFieldError | null {
    return this.validateField(fieldName, value, allValues);
  }

  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  static getFieldError(errors: FormFieldError[], fieldName: string): string | null {
    const error = errors.find(err => err.field === fieldName);
    return error ? error.message : null;
  }

  static getFieldWarning(warnings: FormFieldError[], fieldName: string): string | null {
    const warning = warnings.find(warn => warn.field === fieldName);
    return warning ? warning.message : null;
  }

  static hasFieldError(errors: FormFieldError[], fieldName: string): boolean {
    return errors.some(err => err.field === fieldName);
  }

  static hasFieldWarning(warnings: FormFieldError[], fieldName: string): boolean {
    return warnings.some(warn => warn.field === fieldName);
  }
}

// Form state management hook
export function useFormValidation(initialData: any) {
  const [formData, setFormData] = React.useState(initialData);
  const [validationState, setValidationState] = React.useState<FormValidationState>({
    isValid: false,
    errors: [],
    warnings: [],
    touched: {}
  });

  const updateField = (fieldName: string, value: any) => {
    const newFormData = { ...formData };
    if (fieldName.includes('.')) {
      const keys = fieldName.split('.');
      let current = newFormData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    } else {
      newFormData[fieldName] = value;
    }

    setFormData(newFormData);
    
    // Real-time validation
    const newValidationState = CapsuleFormValidator.validateForm(newFormData);
    setValidationState(newValidationState);
  };

  const validateForm = () => {
    const newValidationState = CapsuleFormValidator.validateForm(formData);
    setValidationState(newValidationState);
    return newValidationState;
  };

  const resetForm = () => {
    setFormData(initialData);
    setValidationState({
      isValid: false,
      errors: [],
      warnings: [],
      touched: {}
    });
  };

  return {
    formData,
    validationState,
    updateField,
    validateForm,
    resetForm
  };
}
