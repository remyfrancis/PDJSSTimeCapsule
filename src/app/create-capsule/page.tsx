'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoadingButton, ErrorDisplay, FormLoadingState, useLoadingState } from '@/components/auth/LoadingComponents';
import { AuthErrorHandler } from '@/lib/auth/errorHandler';
import { CreateCapsuleInputSchema, validateSchemaSafe } from '@/lib/validation';
import type { CreateCapsuleInputValidation } from '@/lib/validation';
import { CapsuleFormValidator, type FormValidationState } from '@/lib/validation/formValidator';
import { FieldError, FormErrorSummary, ValidationIndicator, CharacterCounter } from '@/components/validation/ValidationComponents';
import { AccessibleFormField, AccessibleFileUpload, AccessibleButton } from '@/components/accessibility/AccessibleComponents';
import { SkipLink, Landmark, AccessibleForm, AccessibleSection, AccessibleCheckbox } from '@/components/accessibility/Landmarks';
import { FocusUtils } from '@/lib/accessibility/ariaUtils';

interface CapsuleFormData {
  title: string;
  description: string;
  unlockDate: string;
  unlockTime: string;
  isPrivate: boolean;
  allowComments: boolean;
  tags: string;
  content: {
    text: string;
    files: File[];
  };
}

export default function CreateCapsulePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CapsuleFormData>({
    title: '',
    description: '',
    unlockDate: '',
    unlockTime: '',
    isPrivate: false,
    allowComments: true,
    tags: '',
    content: {
      text: '',
      files: []
    }
  });
  const [error, setError] = useState('');
  const [filePreview, setFilePreview] = useState<string[]>([]);
  const [validationState, setValidationState] = useState<FormValidationState>({
    isValid: false,
    errors: [],
    warnings: [],
    touched: {}
  });
  const createLoading = useLoadingState();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let newFormData = { ...formData };

    if (name.startsWith('content.')) {
      const field = name.split('.')[1];
      newFormData = {
        ...newFormData,
        content: {
          ...newFormData.content,
          [field]: type === 'checkbox' ? checked : value
        }
      };
    } else {
      newFormData = {
        ...newFormData,
        [name]: type === 'checkbox' ? checked : value
      };
    }

    setFormData(newFormData);

    // Real-time validation
    const newValidationState = CapsuleFormValidator.validateForm(newFormData);
    setValidationState(newValidationState);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFormData = {
      ...formData,
      content: {
        ...formData.content,
        files: [...formData.content.files, ...files]
      }
    };

    setFormData(newFormData);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setFilePreview(prev => [...prev, ...previews]);

    // Real-time validation
    const newValidationState = CapsuleFormValidator.validateForm(newFormData);
    setValidationState(newValidationState);
  };

  const removeFile = (index: number) => {
    const newFormData = {
      ...formData,
      content: {
        ...formData.content,
        files: formData.content.files.filter((_, i) => i !== index)
      }
    };

    setFormData(newFormData);
    setFilePreview(prev => prev.filter((_, i) => i !== index));

    // Real-time validation
    const newValidationState = CapsuleFormValidator.validateForm(newFormData);
    setValidationState(newValidationState);
  };

  const validateForm = (): string | null => {
    const validationResult = CapsuleFormValidator.validateForm(formData);
    setValidationState(validationResult);

    if (!validationResult.isValid) {
      const firstError = validationResult.errors[0];
      return firstError ? firstError.message : 'Please fix the form errors';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    createLoading.setLoading(true, 'Creating your time capsule...');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      createLoading.setLoading(true, 'Saving capsule data...', 50);
      
      // Here you would normally save to Firestore
      console.log('Creating capsule:', formData);

      createLoading.setLoading(true, 'Uploading files...', 75);

      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      createLoading.setLoading(true, 'Finalizing capsule...', 90);

      // Simulate final processing
      await new Promise(resolve => setTimeout(resolve, 500));

      createLoading.setLoading(true, 'Redirecting to dashboard...', 100);

      // Redirect to dashboard after successful creation
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);

    } catch (error: any) {
      console.error('Capsule creation error:', error);
      const authError = AuthErrorHandler.getError(error.code || 'capsule/creation-failed');
      setError(authError.code);
    } finally {
      createLoading.clearLoading();
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 20);
    return maxDate.toISOString().split('T')[0];
  };

  const getTimeUntilUnlock = () => {
    if (!formData.unlockDate || !formData.unlockTime) return null;
    
    const unlockDateTime = new Date(`${formData.unlockDate}T${formData.unlockTime}`);
    const now = new Date();
    const diffMs = unlockDateTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return null;
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffYears = Math.floor(diffDays / 365);
    const diffMonths = Math.floor((diffDays % 365) / 30);
    const remainingDays = diffDays % 30;
    
    if (diffYears > 0) {
      return `${diffYears} year${diffYears > 1 ? 's' : ''}${diffMonths > 0 ? `, ${diffMonths} month${diffMonths > 1 ? 's' : ''}` : ''}`;
    } else if (diffMonths > 0) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}${remainingDays > 0 ? `, ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#1B2638'}}>
      {/* Skip Links */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#form-content">Skip to form</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>

      {/* Navigation */}
      <Landmark type="navigation" label="Main navigation">
        <nav className="bg-white shadow-sm" id="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3" style={{backgroundColor: '#CB343F'}}>
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 font-display">Time Capsule</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium font-body"
              >
                Dashboard
              </Link>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 rounded-md text-sm font-medium text-white hover:opacity-90 font-body"
                style={{backgroundColor: '#CB343F'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        </nav>
      </Landmark>

      {/* Main Content */}
      <Landmark type="main" label="Create new time capsule">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 font-display">Create New Time Capsule</h1>
                    <p className="text-gray-600 font-body mt-1">
                      Preserve your memories and set them to unlock in the future
                    </p>
                    <ValidationIndicator 
                      isValid={validationState.isValid}
                      hasErrors={validationState.errors.length > 0}
                      hasWarnings={validationState.warnings.length > 0}
                      className="mt-3"
                    />
                  </div>

          {/* Form */}
          <FormLoadingState 
            loading={createLoading.isLoading} 
            loadingMessage={createLoading.loadingMessage}
          >
            <AccessibleForm 
              onSubmit={handleSubmit}
              aria-label="Create new time capsule form"
              className="px-6 py-6 space-y-6"
            >
              {/* Form Error Summary */}
              <FormErrorSummary 
                errors={validationState.errors}
                warnings={validationState.warnings}
              />

              {/* Basic Information */}
              <AccessibleSection heading="Basic Information" headingLevel={2}>
                
                {/* Title */}
                <AccessibleFormField
                  id="title"
                  label="Capsule Title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a memorable title for your capsule"
                  required={true}
                  maxLength={100}
                  error={CapsuleFormValidator.getFieldError(validationState.errors, 'title')}
                  warning={CapsuleFormValidator.getFieldWarning(validationState.warnings, 'title')}
                  helpText="Choose a title that will help you remember this capsule in the future"
                />

                {/* Description */}
                <AccessibleFormField
                  id="description"
                  label="Description"
                  type="textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what this capsule contains and why it's special..."
                  required={true}
                  maxLength={500}
                  rows={4}
                  error={CapsuleFormValidator.getFieldError(validationState.errors, 'description')}
                  warning={CapsuleFormValidator.getFieldWarning(validationState.warnings, 'description')}
                  helpText="Provide details about what this capsule contains and its significance"
                />

                {/* Tags */}
                <AccessibleFormField
                  id="tags"
                  label="Tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="family, memories, graduation (separate with commas)"
                  required={false}
                  error={CapsuleFormValidator.getFieldError(validationState.errors, 'tags')}
                  warning={CapsuleFormValidator.getFieldWarning(validationState.warnings, 'tags')}
                  helpText="Add tags to help categorize your capsule. Maximum 10 tags, 20 characters each."
                />
              </AccessibleSection>

              {/* Unlock Settings */}
              <AccessibleSection heading="Unlock Settings" headingLevel={2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Unlock Date */}
                  <AccessibleFormField
                    id="unlockDate"
                    label="Unlock Date"
                    type="date"
                    value={formData.unlockDate}
                    onChange={handleInputChange}
                    required={true}
                    min={getMinDate()}
                    max={getMaxDate()}
                    error={CapsuleFormValidator.getFieldError(validationState.errors, 'unlockDate')}
                    warning={CapsuleFormValidator.getFieldWarning(validationState.warnings, 'unlockDate')}
                    helpText="Select when your capsule should unlock (1 day to 20 years from now)"
                  />

                  {/* Unlock Time */}
                  <AccessibleFormField
                    id="unlockTime"
                    label="Unlock Time"
                    type="time"
                    value={formData.unlockTime}
                    onChange={handleInputChange}
                    required={true}
                    error={CapsuleFormValidator.getFieldError(validationState.errors, 'unlockTime')}
                    warning={CapsuleFormValidator.getFieldWarning(validationState.warnings, 'unlockTime')}
                    helpText="Select the time of day for your capsule to unlock"
                  />
                </div>

                {/* Time Until Unlock Display */}
                {formData.unlockDate && formData.unlockTime && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-800 font-body">
                          <strong>Time until unlock:</strong> {getTimeUntilUnlock()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800 font-body">
                        Your capsule will unlock on the specified date and time. 
                        You can set it to unlock anywhere from <strong>1 day to 20 years</strong> in the future.
                        You'll receive notifications before it unlocks.
                      </p>
                    </div>
                  </div>
                </div>
              </AccessibleSection>

              {/* Content */}
              <AccessibleSection heading="Capsule Content" headingLevel={2}>
                {/* Text Content */}
                <AccessibleFormField
                  id="content.text"
                  label="Message or Story"
                  type="textarea"
                  value={formData.content.text}
                  onChange={handleInputChange}
                  placeholder="Write a message, story, or any text you want to preserve..."
                  required={false}
                  maxLength={2000}
                  rows={6}
                  error={CapsuleFormValidator.getFieldError(validationState.errors, 'content.text')}
                  warning={CapsuleFormValidator.getFieldWarning(validationState.warnings, 'content.text')}
                  helpText="Share your thoughts, memories, or messages for the future"
                />

                {/* File Upload */}
                <AccessibleFileUpload
                  id="content.files"
                  label="Upload Files"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  multiple={true}
                  onChange={handleFileChange}
                  files={formData.content.files}
                  maxFiles={10}
                  maxSize={10 * 1024 * 1024}
                  error={CapsuleFormValidator.getFieldError(validationState.errors, 'content.files')}
                  warning={CapsuleFormValidator.getFieldWarning(validationState.warnings, 'content.files')}
                  helpText="Images, Videos, Audio, PDFs, Documents (up to 10MB each)"
                />
              </AccessibleSection>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="files" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2" style={{'--tw-ring-color': '#CB343F'} as React.CSSProperties}>
                          <span>Upload files</span>
                          <input
                            id="files"
                            name="files"
                            type="file"
                            multiple
                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1 font-body">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 font-body">
                        PNG, JPG, GIF, MP4, MP3, PDF up to 10MB each
                      </p>
                    </div>
                  </div>

                  {/* File Preview */}
                  {filePreview.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 font-body mb-2">Uploaded Files:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {filePreview.map((preview, index) => (
                          <div key={index} className="relative">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              {formData.content.files[index]?.type.startsWith('image/') ? (
                                <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <p className="text-xs text-gray-500 mt-1 truncate font-body">
                              {formData.content.files[index]?.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              {/* Privacy Settings */}
              <AccessibleSection heading="Privacy Settings" headingLevel={2}>
                <div className="space-y-3">
                  <AccessibleCheckbox
                    id="isPrivate"
                    label="Keep this capsule private"
                    checked={formData.isPrivate}
                    onChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
                    helpText="Only you will be able to view this capsule when it unlocks"
                  />

                  <AccessibleCheckbox
                    id="allowComments"
                    label="Allow comments when unlocked"
                    checked={formData.allowComments}
                    onChange={(checked) => setFormData(prev => ({ ...prev, allowComments: checked }))}
                    helpText="If public, others can leave comments on your capsule"
                  />
                </div>
              </AccessibleSection>

              {/* Error Display */}
              <ErrorDisplay 
                error={error}
                onDismiss={() => setError('')}
              />

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-body"
                >
                  Cancel
                </button>
                <LoadingButton
                  loading={createLoading.isLoading}
                  loadingText={createLoading.loadingMessage}
                  type="submit"
                  disabled={!validationState.isValid || createLoading.isLoading}
                >
                  Create Time Capsule
                </LoadingButton>
              </div>
            </AccessibleForm>
          </FormLoadingState>
        </div>
      </div>
    </Landmark>
    </div>
  );
}
